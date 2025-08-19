import { useState } from "react";
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
}

const ExtraDataForm = ({ data, onSuccess, onBack }: ExtraDataFormProps) => {
  const [formData, setFormData] = useState<ExtraData>({
    rg_responsavel: "",
    estado_civil: "",
    profissao: "",
    data_nascimento_responsavel: null,
    data_nascimento_aluno: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const estadosCivis = [
    { value: "solteiro", label: "Solteiro(a)" },
    { value: "casado", label: "Casado(a)" },
    { value: "viuvo", label: "Viúvo(a)" },
    { value: "uniao_estavel", label: "União Estável" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.rg_responsavel.trim()) {
      toast({
        title: "Erro",
        description: "RG é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.estado_civil) {
      toast({
        title: "Erro",
        description: "Estado civil é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.profissao.trim()) {
      toast({
        title: "Erro",
        description: "Profissão é obrigatória",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.data_nascimento_responsavel) {
      toast({
        title: "Erro",
        description: "Data de nascimento do responsável é obrigatória",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.data_nascimento_aluno) {
      toast({
        title: "Erro",
        description: "Data de nascimento do aluno é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Formatear dados para envio
      const extraData = {
        ...formData,
        data_nascimento_responsavel: format(formData.data_nascimento_responsavel, 'yyyy-MM-dd'),
        data_nascimento_aluno: format(formData.data_nascimento_aluno, 'yyyy-MM-dd'),
      };
      
      toast({
        title: "Sucesso",
        description: "Dados coletados com sucesso!",
      });
      
      onSuccess(extraData);
    } catch (error: any) {
      console.error('Erro ao processar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
            <Input
              id="rg"
              type="text"
              value={formData.rg_responsavel}
              onChange={(e) => setFormData({ ...formData, rg_responsavel: e.target.value })}
              placeholder="Ex: 12.345.678-9"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="estado-civil">Estado Civil *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, estado_civil: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione seu estado civil" />
              </SelectTrigger>
              <SelectContent>
                {estadosCivis.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profissao">Profissão *</Label>
            <Input
              id="profissao"
              type="text"
              value={formData.profissao}
              onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
              placeholder="Ex: Médico, Engenheiro, Professor..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>Data de Nascimento do Responsável *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !formData.data_nascimento_responsavel && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_nascimento_responsavel ? (
                    format(formData.data_nascimento_responsavel, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_nascimento_responsavel || undefined}
                  onSelect={(date) => setFormData({ ...formData, data_nascimento_responsavel: date || null })}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Data de Nascimento do Aluno *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !formData.data_nascimento_aluno && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_nascimento_aluno ? (
                    format(formData.data_nascimento_aluno, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_nascimento_aluno || undefined}
                  onSelect={(date) => setFormData({ ...formData, data_nascimento_aluno: date || null })}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onBack} variant="outline" className="flex-1">
              Voltar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continuar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExtraDataForm;