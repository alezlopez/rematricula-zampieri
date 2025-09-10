import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Unlock } from 'lucide-react';

const LiberarMatricula = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [codigoAluno, setCodigoAluno] = useState('');
  const [studentData, setStudentData] = useState<any>(null);
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

  const liberarMatricula = async () => {
    if (!studentData) {
      toast({
        title: "Erro",
        description: "Nenhum aluno encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('rematricula')
        .update({ "Liberado para rematrícula": true })
        .eq('Cod Aluno', studentData['Cod Aluno']);

      if (error) throw error;

      toast({
        title: "Matrícula liberada",
        description: `Matrícula liberada para: ${studentData['Nome do Aluno']}`,
      });

      setStudentData({ ...studentData, "Liberado para rematrícula": true });
    } catch (error) {
      console.error('Erro ao liberar matrícula:', error);
      toast({
        title: "Erro na liberação",
        description: "Erro ao liberar matrícula do aluno",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setCodigoAluno('');
    setStudentData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Unlock className="h-4 w-4" />
          Liberar Matrícula
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Liberar Matrícula do Aluno</DialogTitle>
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
                      {studentData['Liberado para rematrícula'] ? 'Liberado' : 'Não liberado'}
                    </span>
                  </div>
                  <div>
                    <strong>Curso:</strong> {studentData['Curso 2026']}
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

          {/* Botão de liberar */}
          {studentData && !studentData['Liberado para rematrícula'] && (
            <Button 
              onClick={liberarMatricula}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Liberando...' : 'Liberar Matrícula'}
            </Button>
          )}

          {/* Mensagem se já estiver liberado */}
          {studentData && studentData['Liberado para rematrícula'] && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                Matrícula já está liberada para este aluno
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiberarMatricula;