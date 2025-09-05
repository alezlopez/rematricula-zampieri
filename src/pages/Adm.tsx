import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StatusUpdater from '@/components/StatusUpdater';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { LogOut, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  "Resp. Financeiro": string;
  "Desconto": string;
  "mensalidade 2026 com desconto": string;
}

const Adm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [matriculas, setMatriculas] = useState<RematriculaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('Pago');
  
  // Estados para modal de desconto
  const [isDescontoModalOpen, setIsDescontoModalOpen] = useState(false);
  const [codigoAlunoInput, setCodigoAlunoInput] = useState('');
  const [descontoInput, setDescontoInput] = useState('');
  const [mensalidadeInput, setMensalidadeInput] = useState('');
  const [searchedAluno, setSearchedAluno] = useState<RematriculaData | null>(null);
  const [updatingDesconto, setUpdatingDesconto] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchMatriculas();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, selectedStatus]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const fetchMatriculas = async (status?: string) => {
    setLoading(true);
    const statusToFilter = status || selectedStatus;
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
          "Atualizou dados Mãe",
          "Resp. Financeiro",
          "Desconto",
          "mensalidade 2026 com desconto"
        `)
        .eq('Status', statusToFilter);

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

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    fetchMatriculas(status);
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

  // Função para buscar aluno por código
  const handleSearchAluno = async () => {
    if (!codigoAlunoInput.trim()) {
      toast({
        title: "Erro",
        description: "Digite o código do aluno",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('rematricula')
        .select(`
          "Cod Aluno",
          "Nome do Aluno",
          "Desconto",
          "mensalidade 2026 com desconto"
        `)
        .eq('Cod Aluno', parseInt(codigoAlunoInput))
        .single();

      if (error) {
        toast({
          title: "Aluno não encontrado",
          description: "Não foi possível encontrar o aluno com esse código",
          variant: "destructive",
        });
        setSearchedAluno(null);
        return;
      }

      setSearchedAluno(data as RematriculaData);
      setDescontoInput(data["Desconto"] || '');
      setMensalidadeInput(data["mensalidade 2026 com desconto"] || '');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao buscar aluno",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar desconto
  const handleUpdateDesconto = async () => {
    if (!searchedAluno) {
      toast({
        title: "Erro",
        description: "Nenhum aluno selecionado",
        variant: "destructive",
      });
      return;
    }

    if (!descontoInput.trim() || !mensalidadeInput.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setUpdatingDesconto(true);
    try {
      const { error } = await supabase
        .from('rematricula')
        .update({
          'Desconto': descontoInput,
          'mensalidade 2026 com desconto': mensalidadeInput
        })
        .eq('Cod Aluno', searchedAluno["Cod Aluno"]);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar desconto: " + error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Desconto atualizado com sucesso",
      });

      // Fechar modal e limpar campos
      setIsDescontoModalOpen(false);
      setCodigoAlunoInput('');
      setDescontoInput('');
      setMensalidadeInput('');
      setSearchedAluno(null);

      // Atualizar a lista se o aluno estiver na listagem atual
      fetchMatriculas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar desconto",
        variant: "destructive",
      });
    } finally {
      setUpdatingDesconto(false);
    }
  };

  // Função para formatar input de desconto (somente números inteiros)
  const handleDescontoChange = (value: string) => {
    // Remove tudo que não é número (não permite pontos, vírgulas ou outros caracteres)
    const numericValue = value.replace(/[^0-9]/g, '');
    setDescontoInput(numericValue);
  };

  // Função para formatar input de mensalidade (números com 2 casas decimais)
  const handleMensalidadeChange = (value: string) => {
    // Remove tudo que não é número
    let numericValue = value.replace(/[^0-9]/g, '');
    
    // Se não houver valor, limpa o campo
    if (!numericValue) {
      setMensalidadeInput('');
      return;
    }
    
    // Converte para número e divide por 100 para ter as casas decimais
    const number = parseInt(numericValue) / 100;
    
    // Formata com 2 casas decimais e vírgula
    const formatted = number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setMensalidadeInput(formatted);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Vai ser redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
            <p className="text-muted-foreground mt-1">Logado como: {user.email}</p>
          </div>
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Matrículas - {selectedStatus} ({matriculas.length})</CardTitle>
              <div className="flex gap-2 items-center">
                <StatusUpdater />
                <Dialog open={isDescontoModalOpen} onOpenChange={setIsDescontoModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Alterar Desconto
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Contrato Assinado">Contrato Assinado</SelectItem>
                    <SelectItem value="Contrato Gerado">Contrato Gerado</SelectItem>
                    <SelectItem value="Pagamento Gerado">Pagamento Gerado</SelectItem>
                    <SelectItem value="Concluido">Concluido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                            {selectedStatus === 'Pago' && matricula["Resp. Financeiro"] && (
                              <p><span className="font-medium">Responsável Financeiro:</span> {matricula["Resp. Financeiro"]}</p>
                            )}
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

                        {/* Botão Concluir - só aparece para status Pago */}
                        {selectedStatus === 'Pago' && (
                          <div className="flex items-end">
                            <Button
                              onClick={() => handleConcluir(matricula["Cod Aluno"])}
                              disabled={updatingStatus === matricula["Cod Aluno"]}
                              className="w-full"
                            >
                              {updatingStatus === matricula["Cod Aluno"] ? 'Processando...' : 'Concluir'}
                            </Button>
                          </div>
                        )}
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

      {/* Modal de Alteração de Desconto */}
      <Dialog open={isDescontoModalOpen} onOpenChange={setIsDescontoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Desconto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Campo de busca por código */}
            <div className="space-y-2">
              <Label htmlFor="codigo-aluno">Código do Aluno</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo-aluno"
                  placeholder="Digite o código do aluno"
                  value={codigoAlunoInput}
                  onChange={(e) => setCodigoAlunoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchAluno();
                    }
                  }}
                />
                <Button onClick={handleSearchAluno} size="sm">
                  Buscar
                </Button>
              </div>
            </div>

            {/* Informações do aluno encontrado */}
            {searchedAluno && (
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm">Aluno encontrado:</h4>
                <p className="text-sm text-muted-foreground">
                  {searchedAluno["Nome do Aluno"]}
                </p>
              </div>
            )}

            {/* Campos de edição - só aparecem quando aluno é encontrado */}
            {searchedAluno && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="desconto">Desconto (%)</Label>
                  <Input
                    id="desconto"
                    placeholder="Ex: 10"
                    value={descontoInput}
                    onChange={(e) => handleDescontoChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensalidade">Mensalidade 2026 com Desconto</Label>
                  <Input
                    id="mensalidade"
                    placeholder="Ex: 450.00"
                    value={mensalidadeInput}
                    onChange={(e) => handleMensalidadeChange(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleUpdateDesconto}
                    disabled={updatingDesconto}
                    className="flex-1"
                  >
                    {updatingDesconto ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDescontoModalOpen(false);
                      setCodigoAlunoInput('');
                      setDescontoInput('');
                      setMensalidadeInput('');
                      setSearchedAluno(null);
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Adm;