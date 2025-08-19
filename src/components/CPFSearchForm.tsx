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
        .limit(1);

      if (error) {
        console.error('Erro ao buscar:', error);
        toast.error("Erro no sistema. Tente novamente.");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("CPF não encontrado no sistema");
        return;
      }

      const row = data[0];

      // Verificar se está liberado para rematrícula
      if (!row["Liberado para rematrícula"]) {
        toast.error("Não poderemos seguir com a sua rematrícula por aqui, por favor entre em contato com o departamento financeiro do Colégio");
        return;
      }

      // Mapear os nomes das colunas da tabela para um formato mais consistente
      const mappedData = {
        status: row["Status"],
        cpf_pai: row["CPF do Pai"]?.toString(),
        cpf_mae: row["CPF da mãe"]?.toString(),
        nome_pai: row["Nome do Pai"],
        nome_mae: row["Nome da Mãe"] || row["Nome da mãe"],
        telefone_pai: row["Telefone do Pai"]?.toString(),
        telefone_mae: row["Telefone da Mãe"]?.toString(),
        email_pai: row["Email do Pai"],
        email_mae: row["Email da Mãe"],
        endereco: row["Endereço"],
        numero: row["Número"]?.toString(),
        bairro: row["Bairro"],
        cidade: row["Cidade"],
        cep: row["CEP"],
        nome_aluno: row["Nome do Aluno"],
        curso_2025: row["Curso 2025"],
        curso_2026: row["Curso 2026"],
        turno_2026: row["Turno 2026"],
        resp_financeiro: row["Resp. Financeiro"],
        liberado_para_rematricula: row["Liberado para rematrícula"],
        id_checkout: row["Id Checkout"],
        link_checkout: row["Link Checkout"],
        link_contrato: row["Link Contrato"],
        token_contrato: row["token contrato"],
        cod_aluno: row["Cod Aluno"]
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