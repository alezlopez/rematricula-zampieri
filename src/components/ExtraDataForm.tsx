import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface ExtraDataFormProps {
  data: any;
  onSuccess: (extraData: any) => void;
  onBack: () => void;
}
interface ExtraData {
  rg_responsavel: string;
  estado_civil: string;
  profissao: string;
  data_nascimento_responsavel: Date | null;
  data_nascimento_aluno: Date | null;
  turno_2026: string;
  naturalidade_responsavel: string;
}

interface DateInputs {
  responsavel: string;
  aluno: string;
}
const ExtraDataForm = ({
  data,
  onSuccess,
  onBack
}: ExtraDataFormProps) => {
  const [formData, setFormData] = useState<ExtraData>({
    rg_responsavel: "",
    estado_civil: "",
    profissao: "",
    data_nascimento_responsavel: null,
    data_nascimento_aluno: null,
    turno_2026: "",
    naturalidade_responsavel: ""
  });
  const [dateInputs, setDateInputs] = useState<DateInputs>({
    responsavel: "",
    aluno: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();

  // Verificar se é Ensino Médio para limitar opções de turno (normaliza acentos e espaços)
  const cicloRaw = (data?.Ciclo ?? data?.ciclo ?? "").toString();
  const cicloNorm = cicloRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const isEnsinoMedio = cicloNorm === "ensino medio";
  console.log('Ciclo do aluno:', cicloRaw);
  console.log('É Ensino Médio?', isEnsinoMedio);
  const estadosCivis = [{
    value: "solteiro",
    label: "Solteiro(a)"
  }, {
    value: "casado",
    label: "Casado(a)"
  }, {
    value: "viuvo",
    label: "Viúvo(a)"
  }, {
    value: "uniao_estavel",
    label: "União Estável"
  }];
  const turnos = isEnsinoMedio ? [{
    value: "Manhã",
    label: "Manhã"
  }] : [{
    value: "Manhã",
    label: "Manhã"
  }, {
    value: "Tarde",
    label: "Tarde"
  }];

  // Para Ensino Médio, definir automaticamente turno como Manhã
  useEffect(() => {
    if (isEnsinoMedio && !formData.turno_2026) {
      setFormData(prev => ({
        ...prev,
        turno_2026: "Manhã"
      }));
    }
  }, [isEnsinoMedio, formData.turno_2026]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.rg_responsavel.trim()) {
      toast({
        title: "Erro",
        description: "RG é obrigatório",
        variant: "destructive"
      });
      return;
    }
    if (!formData.estado_civil) {
      toast({
        title: "Erro",
        description: "Estado civil é obrigatório",
        variant: "destructive"
      });
      return;
    }
    if (!formData.profissao.trim()) {
      toast({
        title: "Erro",
        description: "Profissão é obrigatória",
        variant: "destructive"
      });
      return;
    }
    if (!formData.data_nascimento_responsavel) {
      toast({
        title: "Erro",
        description: "Data de nascimento do responsável é obrigatória",
        variant: "destructive"
      });
      return;
    }
    if (!formData.data_nascimento_aluno) {
      toast({
        title: "Erro",
        description: "Data de nascimento do aluno é obrigatória",
        variant: "destructive"
      });
      return;
    }
    if (!formData.turno_2026) {
      toast({
        title: "Erro",
        description: "Turno é obrigatório",
        variant: "destructive"
      });
      return;
    }
    if (!formData.naturalidade_responsavel.trim()) {
      toast({
        title: "Erro",
        description: "Cidade em que nasceu é obrigatória",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Iniciando processamento dos dados extras...');
      console.log('Dados recebidos:', data);
      
      // Tentar acessar o código do aluno de diferentes formas
      const codAluno = Number(data?.["Cod Aluno"] || data?.cod_aluno);
      if (!codAluno) {
        console.error('Código do aluno não encontrado nos dados:', data);
        throw new Error("Não foi possível identificar o aluno (código ausente)");
      }

      // Determinar turno a salvar (EM = Manhã obrigatória)
      const selectedTurno = isEnsinoMedio ? "Manhã" : formData.turno_2026;
      console.log('Turno selecionado para salvar:', selectedTurno);

      // Atualizar dados na tabela rematricula
      const {
        error
      } = await supabase.rpc('update_rematricula_fields', {
        p_cod_aluno: codAluno,
        p_turno_2026: selectedTurno,
        p_rg_resp_financeiro: formData.rg_responsavel,
        p_estado_civil_resp_financeiro: formData.estado_civil,
        p_profissao_resp_financeiro: formData.profissao,
        p_data_nascimento_resp_financeiro: format(formData.data_nascimento_responsavel, 'dd/MM/yyyy'),
        p_data_nascimento_aluno: format(formData.data_nascimento_aluno, 'dd/MM/yyyy'),
        p_naturalidade_resp_financeiro: formData.naturalidade_responsavel
      });
      if (error) {
        console.error('Database update error:', error);
        throw new Error("Erro ao salvar os dados complementares");
      }

      console.log('Dados complementares salvos no banco com sucesso');

      // Verificar se as datas estão preenchidas antes de formatar
      if (!formData.data_nascimento_responsavel) {
        throw new Error("Data de nascimento do responsável é obrigatória");
      }
      if (!formData.data_nascimento_aluno) {
        throw new Error("Data de nascimento do aluno é obrigatória");
      }

      // Formatear dados para envio
      const extraData = {
        ...formData,
        data_nascimento_responsavel: format(formData.data_nascimento_responsavel, 'yyyy-MM-dd'),
        data_nascimento_aluno: format(formData.data_nascimento_aluno, 'yyyy-MM-dd'),
        turno_2026: selectedTurno,
        naturalidade_responsavel: formData.naturalidade_responsavel
      };
      
      console.log('Dados formatados para envio:', extraData);
      
      toast({
        title: "Sucesso",
        description: "Dados complementares salvos com sucesso!"
      });
      
      console.log('Chamando onSuccess...');
      onSuccess(extraData);
    } catch (error: any) {
      console.error('Erro ao processar dados:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Dados Complementares</CardTitle>
        <p className="text-center text-muted-foreground">
          Precisamos de algumas informações adicionais para completar o processo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="rg">RG do Responsável *</Label>
            <Input id="rg" type="text" value={formData.rg_responsavel} onChange={e => setFormData({
            ...formData,
            rg_responsavel: e.target.value
          })} placeholder="Ex: 12.345.678-9" className="mt-2" />
          </div>

          <div>
            <Label htmlFor="estado-civil">Estado Civil *</Label>
            <Select onValueChange={value => setFormData({
            ...formData,
            estado_civil: value
          })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione seu estado civil" />
              </SelectTrigger>
              <SelectContent>
                {estadosCivis.map(estado => <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profissao">Profissão *</Label>
            <Input id="profissao" type="text" value={formData.profissao} onChange={e => setFormData({
            ...formData,
            profissao: e.target.value
          })} placeholder="Ex: Médico, Engenheiro, Professor..." className="mt-2" />
          </div>

          <div>
            <Label>Data de Nascimento do Responsável *</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                type="text"
                placeholder="DD/MM/AAAA"
                value={dateInputs.responsavel}
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir apenas números e barras, formatando automaticamente
                  const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3').slice(0, 10);
                  
                  setDateInputs(prev => ({ ...prev, responsavel: formatted }));
                  
                  if (formatted.length === 10) {
                    const [day, month, year] = formatted.split('/');
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (date && !isNaN(date.getTime()) && date <= new Date() && date >= new Date("1900-01-01")) {
                      setFormData(prev => ({
                        ...prev,
                        data_nascimento_responsavel: date
                      }));
                    }
                  } else if (formatted === "") {
                    setFormData(prev => ({
                      ...prev,
                      data_nascimento_responsavel: null
                    }));
                  }
                }}
                className="flex-1"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={formData.data_nascimento_responsavel || undefined} 
                    onSelect={date => {
                      setFormData(prev => ({
                        ...prev,
                        data_nascimento_responsavel: date || null
                      }));
                      setDateInputs(prev => ({
                        ...prev,
                        responsavel: date ? format(date, "dd/MM/yyyy") : ""
                      }));
                    }} 
                    disabled={date => date > new Date() || date < new Date("1900-01-01")} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label>Data de Nascimento do Aluno *</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                type="text"
                placeholder="DD/MM/AAAA"
                value={dateInputs.aluno}
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir apenas números e barras, formatando automaticamente
                  const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3').slice(0, 10);
                  
                  setDateInputs(prev => ({ ...prev, aluno: formatted }));
                  
                  if (formatted.length === 10) {
                    const [day, month, year] = formatted.split('/');
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (date && !isNaN(date.getTime()) && date <= new Date() && date >= new Date("1900-01-01")) {
                      setFormData(prev => ({
                        ...prev,
                        data_nascimento_aluno: date
                      }));
                    }
                  } else if (formatted === "") {
                    setFormData(prev => ({
                      ...prev,
                      data_nascimento_aluno: null
                    }));
                  }
                }}
                className="flex-1"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={formData.data_nascimento_aluno || undefined} 
                    onSelect={date => {
                      setFormData(prev => ({
                        ...prev,
                        data_nascimento_aluno: date || null
                      }));
                      setDateInputs(prev => ({
                        ...prev,
                        aluno: date ? format(date, "dd/MM/yyyy") : ""
                      }));
                    }} 
                    disabled={date => date > new Date() || date < new Date("1900-01-01")} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="naturalidade">Cidade em que nasceu *</Label>
            <Input id="naturalidade" type="text" value={formData.naturalidade_responsavel} onChange={e => setFormData({
            ...formData,
            naturalidade_responsavel: e.target.value
          })} placeholder="Ex: São Paulo, Rio de Janeiro..." className="mt-2" />
          </div>

          <div>
            <Label htmlFor="turno">Turno 2026 *</Label>
            {isEnsinoMedio ? <>
                <p className="text-sm text-muted-foreground mt-1">
                  Para alunos do Ensino Médio, o turno é obrigatoriamente <strong>Manhã</strong>
                </p>
                <Input value="Manhã" readOnly className="mt-2" />
              </> : <>
                <p className="text-sm text-muted-foreground mt-1">Selecione o turno desejado para 2026 - Ensino médio só temos Manhã</p>
                <Select value={formData.turno_2026} onValueChange={value => setFormData({
              ...formData,
              turno_2026: value
            })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    {turnos.map(turno => <SelectItem key={turno.value} value={turno.value}>
                        {turno.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              Voltar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continuar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
};
export default ExtraDataForm;