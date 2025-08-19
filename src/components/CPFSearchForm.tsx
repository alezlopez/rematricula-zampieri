import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CPFSearchFormProps {
  onSearchResult: (data: any) => void;
}

const CPFSearchForm = ({ onSearchResult }: CPFSearchFormProps) => {
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSearch = async () => {
    if (!cpf || cpf.length < 14) {
      toast.error("Por favor, digite um CPF válido");
      return;
    }

    setIsLoading(true);
    try {
      // Remover formatação do CPF para busca
      const cleanCPF = cpf.replace(/\D/g, "");
      
      // Buscar na tabela rematricula por CPF do pai ou da mãe
      const { data, error } = await supabase
        .from('rematricula')
        .select('*')
        .or(`"CPF do Pai".eq.${cleanCPF},"CPF da mãe".eq.${cleanCPF}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar:', error);
        toast.error("Erro no sistema. Tente novamente.");
        return;
      }

      if (!data) {
        toast.error("CPF não encontrado no sistema");
        return;
      }

      // Mapear os nomes das colunas da tabela para um formato mais consistente
      const mappedData = {
        status: data["Status"],
        cpf_pai: data["CPF do Pai"]?.toString(),
        cpf_mae: data["CPF da mãe"]?.toString(),
        nome_pai: data["Nome do Pai"],
        nome_mae: data["Nome da mãe"],
        telefone_pai: data["Telefone do Pai"]?.toString(),
        telefone_mae: data["Telefone da Mãe"]?.toString(),
        email_pai: data["Email do Pai"],
        email_mae: data["Email da Mãe"],
        endereco: data["Endereço"],
        numero: data["Número"]?.toString(),
        bairro: data["Bairro"],
        cidade: data["Cidade"],
        cep: data["CEP"],
        estado: data["Estado"] || "SP",
        nome_aluno: data["Nome do Aluno"],
        curso_2025: data["Curso 2025"],
        curso_2026: data["Curso 2026"],
        turno_2026: data["Turno 2026"],
        resp_financeiro: data["Resp. Financeiro"],
        liberado_para_rematricula: data["Liberado para rematrícula"],
        cod_aluno: data["Cod Aluno"]
      };

      onSearchResult(mappedData);
      toast.success("Dados encontrados!");
    } catch (error) {
      console.error('Erro ao buscar CPF:', error);
      toast.error("Erro ao buscar CPF. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-primary">
          <Search className="w-5 h-5" />
          <span>Buscar Rematrícula</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-foreground">
            CPF do Responsável
          </Label>
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCPFChange}
            maxLength={14}
            className="text-center"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isLoading || cpf.length < 14}
          className="w-full bg-gradient-primary hover:bg-primary-light transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Buscar Dados
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CPFSearchForm;