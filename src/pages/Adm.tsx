import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RematriculaData {
  "Nome do Aluno": string;
  "Endereço": string;
  "Número": number;
  "Bairro": string;
  "Cidade": string;
  "CEP": string;
}

const Adm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [matriculas, setMatriculas] = useState<RematriculaData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    // Senha simples para acesso admin (você pode trocar esta senha)
    if (password === 'admin2025') {
      setIsAuthenticated(true);
      fetchMatriculas();
    } else {
      toast({
        title: "Erro",
        description: "Senha incorreta",
        variant: "destructive",
      });
    }
  };

  const fetchMatriculas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rematricula')
        .select(`
          "Nome do Aluno",
          "Endereço",
          "Número",
          "Bairro", 
          "Cidade",
          "CEP"
        `)
        .eq('Status', 'Pago');

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar dados: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setMatriculas(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao buscar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Acesso Administrativo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button 
                  onClick={handleLogin}
                  className="w-full"
                >
                  Entrar
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <Button 
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Matrículas Pagas ({matriculas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Aluno</TableHead>
                      <TableHead>Endereço Completo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matriculas.map((matricula, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {matricula["Nome do Aluno"]}
                        </TableCell>
                        <TableCell>
                          {matricula["Endereço"]} {matricula["Número"] ? `, ${matricula["Número"]}` : ''} - {matricula["Bairro"]} - {matricula["Cidade"]} - CEP: {matricula["CEP"]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {matriculas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma matrícula paga encontrada.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Adm;