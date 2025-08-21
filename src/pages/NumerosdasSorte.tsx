import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface NumeroSorte {
  id: number;
  Aluno: string;
  numero_da_sorte: number;
  cpf: string;
}

const NumerosdasSorte = () => {
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultados, setResultados] = useState<NumeroSorte[]>([]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSearch = async () => {
    if (!cpf.trim()) {
      toast.error('Por favor, informe o CPF');
      return;
    }

    setIsLoading(true);
    try {
      // Remove formatação do CPF para busca
      const cpfClean = cpf.replace(/[^0-9]/g, '');
      
      const { data, error } = await supabase
        .from('numeros_da_sorte' as any)
        .select('*')
        .eq('cpf', cpfClean);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast.error('Nenhum número da sorte encontrado para este CPF');
        setResultados([]);
        return;
      }

      setResultados(data as unknown as NumeroSorte[]);
      toast.success(`${data.length} número(s) da sorte encontrado(s)`);
    } catch (error) {
      console.error('Erro ao buscar números da sorte:', error);
      toast.error('Erro ao buscar números da sorte');
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Números da Sorte</h1>
            <p className="text-muted-foreground">Consulte os números da sorte dos alunos rematriculados</p>
          </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Buscar por CPF</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF do Responsável Financeiro</Label>
              <div className="flex space-x-2">
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCPFChange}
                  onKeyPress={handleKeyPress}
                  maxLength={14}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading}
                  className="px-6"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {resultados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Números da Sorte Encontrados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Aluno</TableHead>
                      <TableHead>Número da Sorte</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((resultado) => (
                      <TableRow key={resultado.id}>
                        <TableCell className="font-medium">
                          {resultado.Aluno}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary">
                          {resultado.numero_da_sorte.toString().padStart(4, '0')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
    </div>
  );
};

export default NumerosdasSorte;