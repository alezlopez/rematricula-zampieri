import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Settings } from 'lucide-react';

const StatusUpdater = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [codigoAluno, setCodigoAluno] = useState('');
  const [studentData, setStudentData] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const searchStudent = async () => {
    if (!codigoAluno.trim()) {
      toast({
        title: "Erro",
        description: "Digite o código do aluno",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('rematricula')
        .select('*')
        .eq('Cod Aluno', parseInt(codigoAluno))
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStudentData(data);
        setNewStatus('');
      } else {
        toast({
          title: "Aluno não encontrado",
          description: "Verifique o código e tente novamente",
          variant: "destructive",
        });
        setStudentData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      toast({
        title: "Erro na busca",
        description: "Erro ao buscar dados do aluno",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const updateStatus = async () => {
    if (!studentData || !newStatus) {
      toast({
        title: "Erro",
        description: "Selecione um novo status",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const statusValue = newStatus === "NULL_VALUE" ? null : newStatus;
      const { error } = await supabase
        .from('rematricula')
        .update({ Status: statusValue })
        .eq('Cod Aluno', studentData['Cod Aluno']);

      if (error) throw error;

      const displayStatus = statusValue === null ? "Null" : statusValue;
      toast({
        title: "Status atualizado",
        description: `Status alterado para: ${displayStatus}`,
      });

      setStudentData({ ...studentData, Status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro na atualização",
        description: "Erro ao atualizar status do aluno",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setCodigoAluno('');
    setStudentData(null);
    setNewStatus('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Alterar Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Alterar Status do Aluno</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Busca por código */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Digite o código do aluno"
              value={codigoAluno}
              onChange={(e) => setCodigoAluno(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
            />
            <Button 
              onClick={searchStudent}
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {/* Dados do aluno */}
          {studentData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Aluno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Código:</strong> {studentData['Cod Aluno']}
                  </div>
                  <div>
                    <strong>Nome:</strong> {studentData['Nome do Aluno']}
                  </div>
                  <div>
                    <strong>Status Atual:</strong> 
                    <span className="ml-2 px-2 py-1 bg-secondary rounded text-sm">
                      {studentData.Status || 'Não definido'}
                    </span>
                  </div>
                  <div>
                    <strong>Pai:</strong> {studentData['Nome do Pai']}
                  </div>
                  <div>
                    <strong>Mãe:</strong> {studentData['Nome da mãe']}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seleção de novo status */}
          {studentData && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Novo Status:
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="Contrato Assinado">Contrato Assinado</SelectItem>
                    <SelectItem value="Concluido">Concluido</SelectItem>
                    <SelectItem value="NULL_VALUE">Null (Limpar status)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={updateStatus}
                disabled={isUpdating || !newStatus}
                className="w-full"
              >
                {isUpdating ? 'Atualizando...' : 'Atualizar Status'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdater;