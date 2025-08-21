import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RematriculaData {
  "Cod Aluno": number;
  "Nome do Aluno": string;
  "Endereço": string;
  "Número": number;
  "Bairro": string;
  "Cidade": string;
  "CEP": string;
  "Estado": string;
  "Nome do Pai": string;
  "CPF do Pai": string;
  "Telefone do Pai": string;
  "Email do Pai": string;
  "Nome da mãe": string;
  "CPF da mãe": string;
  "Telefone da Mãe": string;
  "Email da Mãe": string;
  "Curso 2026": string;
  "Turno 2026": string;
  "forma_de_pagamento": string;
  "data_rematricula": string;
  "Status": string;
  "Atualizou Endereço": string;
  "Atualizou dados Pai": string;
  "Atualizou dados Mãe": string;
}

const Adm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [matriculas, setMatriculas] = useState<RematriculaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const { toast } = useToast();

  const handleLogin = () => {
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
          "Cod Aluno",
          "Nome do Aluno",
          "Endereço",
          "Número",
          "Bairro", 
          "Cidade",
          "CEP",
          "Estado",
          "Nome do Pai",
          "CPF do Pai",
          "Telefone do Pai",
          "Email do Pai",
          "Nome da mãe",
          "CPF da mãe",
          "Telefone da Mãe",
          "Email da Mãe",
          "Curso 2026",
          "Turno 2026",
          "forma_de_pagamento",
          "data_rematricula",
          "Status",
          "Atualizou Endereço",
          "Atualizou dados Pai",
          "Atualizou dados Mãe"
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

  const handleConcluir = async (codAluno: number) => {
    setUpdatingStatus(codAluno);
    try {
      const { error } = await supabase
        .from('rematricula')
        .update({ 'Status': 'Concluido' })
        .eq('Cod Aluno', codAluno);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar status: " + error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Status atualizado para Concluído",
      });

      // Atualizar a lista removendo o item concluído
      setMatriculas(prev => prev.filter(m => m["Cod Aluno"] !== codAluno));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatAddress = (matricula: RematriculaData) => {
    const parts = [
      matricula["Endereço"],
      matricula["Número"] ? `nº ${matricula["Número"]}` : '',
      matricula["Bairro"],
      matricula["Cidade"],
      matricula["Estado"],
      matricula["CEP"] ? `CEP: ${matricula["CEP"]}` : ''
    ].filter(Boolean);
    
    return parts.join(', ');
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
              <div className="space-y-4">
                {matriculas.map((matricula, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* Informações Básicas */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-primary">
                            {matricula["Nome do Aluno"]}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Turma 2026:</span> {matricula["Curso 2026"]} - {matricula["Turno 2026"]}</p>
                            <p><span className="font-medium">Forma de Pagamento:</span> {matricula["forma_de_pagamento"] || 'Não informado'}</p>
                            <p><span className="font-medium">Data da Matrícula:</span> {matricula["data_rematricula"] || 'Não informado'}</p>
                          </div>
                        </div>

                        {/* Endereço (só mostra se houve alteração) */}
                        {matricula["Atualizou Endereço"] === 'Sim' && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-primary flex items-center gap-2">
                              Endereço 
                              <Badge variant="secondary" className="text-xs">Atualizado</Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatAddress(matricula)}
                            </p>
                          </div>
                        )}

                        {/* Dados do Pai (só mostra se houve alteração) */}
                        {matricula["Atualizou dados Pai"] === 'Sim' && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-primary flex items-center gap-2">
                              Dados do Pai 
                              <Badge variant="secondary" className="text-xs">Atualizado</Badge>
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Nome:</span> {matricula["Nome do Pai"]}</p>
                              <p><span className="font-medium">CPF:</span> {matricula["CPF do Pai"]}</p>
                              <p><span className="font-medium">Telefone:</span> {matricula["Telefone do Pai"]}</p>
                              <p><span className="font-medium">Email:</span> {matricula["Email do Pai"]}</p>
                            </div>
                          </div>
                        )}

                        {/* Dados da Mãe (só mostra se houve alteração) */}
                        {matricula["Atualizou dados Mãe"] === 'Sim' && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-primary flex items-center gap-2">
                              Dados da Mãe 
                              <Badge variant="secondary" className="text-xs">Atualizado</Badge>
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Nome:</span> {matricula["Nome da mãe"]}</p>
                              <p><span className="font-medium">CPF:</span> {matricula["CPF da mãe"]}</p>
                              <p><span className="font-medium">Telefone:</span> {matricula["Telefone da Mãe"]}</p>
                              <p><span className="font-medium">Email:</span> {matricula["Email da Mãe"]}</p>
                            </div>
                          </div>
                        )}

                        {/* Botão Concluir */}
                        <div className="flex items-end">
                          <Button
                            onClick={() => handleConcluir(matricula["Cod Aluno"])}
                            disabled={updatingStatus === matricula["Cod Aluno"]}
                            className="w-full"
                          >
                            {updatingStatus === matricula["Cod Aluno"] ? 'Processando...' : 'Concluir'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
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