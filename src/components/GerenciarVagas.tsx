import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, Users, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VagaConfig {
  id: number;
  curso: string;
  turno: string;
  max_vagas: number;
  ativo: boolean;
}

interface VagaDisponivel {
  curso: string;
  turno: string;
  max_vagas: number;
  matriculados: number;
  vagas_disponiveis: number;
  disponivel: boolean;
}

const cursos = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano",
  "7º Ano", "8º Ano", "9º Ano", "1º Ano EM", "2º Ano EM", "3º Ano EM"
];

const turnos = ["Manhã", "Tarde", "Integral"];

export default function GerenciarVagas() {
  const [vagas, setVagas] = useState<VagaConfig[]>([]);
  const [vagasDisponiveis, setVagasDisponiveis] = useState<VagaDisponivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVaga, setEditingVaga] = useState<VagaConfig | null>(null);
  const [formData, setFormData] = useState({
    curso: '',
    turno: '',
    max_vagas: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar configurações de vagas
      const { data: vagasData, error: vagasError } = await supabase
        .from('vagas_turmas')
        .select('*')
        .order('curso, turno');

      if (vagasError) throw vagasError;

      // Carregar vagas disponíveis
      const { data: disponiveisData, error: disponiveisError } = await supabase
        .rpc('get_vagas_disponiveis');

      if (disponiveisError) throw disponiveisError;

      setVagas(vagasData || []);
      setVagasDisponiveis(disponiveisData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de vagas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirDialog = (vaga?: VagaConfig) => {
    if (vaga) {
      setEditingVaga(vaga);
      setFormData({
        curso: vaga.curso,
        turno: vaga.turno,
        max_vagas: vaga.max_vagas.toString()
      });
    } else {
      setEditingVaga(null);
      setFormData({
        curso: '',
        turno: '',
        max_vagas: ''
      });
    }
    setDialogOpen(true);
  };

  const salvarVaga = async () => {
    try {
      const dados = {
        curso: formData.curso,
        turno: formData.turno,
        max_vagas: parseInt(formData.max_vagas)
      };

      if (!dados.curso || !dados.turno || !dados.max_vagas || dados.max_vagas <= 0) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos com valores válidos",
          variant: "destructive"
        });
        return;
      }

      let error;
      if (editingVaga) {
        const { error: updateError } = await supabase
          .from('vagas_turmas')
          .update(dados)
          .eq('id', editingVaga.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('vagas_turmas')
          .insert(dados);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: editingVaga ? "Vaga atualizada com sucesso" : "Vaga criada com sucesso"
      });

      setDialogOpen(false);
      carregarDados();
    } catch (error: any) {
      console.error('Erro ao salvar vaga:', error);
      let message = "Erro ao salvar configuração de vaga";
      if (error.message?.includes('unique')) {
        message = "Já existe uma configuração para este curso e turno";
      }
      toast({
        title: "Erro",
        description: message,
        variant: "destructive"
      });
    }
  };

  const excluirVaga = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração de vaga?')) return;

    try {
      const { error } = await supabase
        .from('vagas_turmas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração de vaga excluída com sucesso"
      });

      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir configuração de vaga",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (vaga: VagaConfig) => {
    try {
      const { error } = await supabase
        .from('vagas_turmas')
        .update({ ativo: !vaga.ativo })
        .eq('id', vaga.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Configuração ${vaga.ativo ? 'desativada' : 'ativada'} com sucesso`
      });

      carregarDados();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da configuração",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Vagas por Turno</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVaga ? 'Editar' : 'Nova'} Configuração de Vagas
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="curso">Curso</Label>
                <Select 
                  value={formData.curso} 
                  onValueChange={(value) => setFormData(prev => ({...prev, curso: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map(curso => (
                      <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="turno">Turno</Label>
                <Select 
                  value={formData.turno} 
                  onValueChange={(value) => setFormData(prev => ({...prev, turno: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {turnos.map(turno => (
                      <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="max_vagas">Máximo de Vagas</Label>
                <Input
                  id="max_vagas"
                  type="number"
                  min="1"
                  value={formData.max_vagas}
                  onChange={(e) => setFormData(prev => ({...prev, max_vagas: e.target.value}))}
                  placeholder="Ex: 25"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={salvarVaga} className="flex-1">
                  {editingVaga ? 'Atualizar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard de Vagas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vagasDisponiveis.map((vaga) => (
          <Card key={`${vaga.curso}-${vaga.turno}`} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{vaga.curso} - {vaga.turno}</span>
                <Badge variant={vaga.disponivel ? "default" : "destructive"}>
                  {vaga.disponivel ? "Disponível" : "Lotado"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Matriculados:
                  </span>
                  <span className="font-semibold">{vaga.matriculados}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Máximo:
                  </span>
                  <span className="font-semibold">{vaga.max_vagas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Disponíveis:</span>
                  <span className={`font-bold ${
                    vaga.vagas_disponiveis <= 0 ? 'text-destructive' : 
                    vaga.vagas_disponiveis <= 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {vaga.vagas_disponiveis}
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      vaga.matriculados >= vaga.max_vagas ? 'bg-destructive' : 
                      vaga.matriculados / vaga.max_vagas > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((vaga.matriculados / vaga.max_vagas) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Vagas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Curso</th>
                  <th className="text-left p-2">Turno</th>
                  <th className="text-left p-2">Máx. Vagas</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.map((vaga) => (
                  <tr key={vaga.id} className="border-b">
                    <td className="p-2">{vaga.curso}</td>
                    <td className="p-2">{vaga.turno}</td>
                    <td className="p-2">{vaga.max_vagas}</td>
                    <td className="p-2">
                      <Badge variant={vaga.ativo ? "default" : "secondary"}>
                        {vaga.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => abrirDialog(vaga)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(vaga)}
                        >
                          {vaga.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => excluirVaga(vaga.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}