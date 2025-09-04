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
  onMultipleResults: (results: any[]) => void;
}
const CPFSearchForm = ({
  onSearchResult,
  onMultipleResults
}: CPFSearchFormProps) => {
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
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
      console.log('=== INICIANDO BUSCA CPF ===');
      console.log('CPF:', cpf);
      console.log('User Agent:', navigator.userAgent);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Buscando CPF:', cpf);

      // Usar a nova função RPC para buscar por CPF
      const {
        data,
        error
      } = await supabase.rpc('rematricula_by_cpf', {
        p_cpf: cpf
      });
      console.log('Resultado da busca:', {
        data,
        error
      });
      if (error) {
        console.error('=== ERRO NA BUSCA SUPABASE ===');
        console.error('Erro completo:', error);
        console.error('Tipo do erro:', typeof error);
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        toast.error("Erro no sistema. Tente novamente.");
        return;
      }
      
      console.log('=== DADOS RECEBIDOS ===');
      console.log('Data length:', data?.length);
      console.log('Data type:', typeof data);
      console.log('Data:', data);
      
      if (!data || data.length === 0) {
        console.log('=== CPF NÃO ENCONTRADO ===');
        toast.error("CPF não encontrado no sistema");
        return;
      }
      console.log('Dados encontrados:', data.length, 'registros');

      // Filtrar apenas registros liberados para rematrícula
      const liberados = data.filter((row: any) => row["Liberado para rematrícula"] === true);
      console.log('Registros liberados:', liberados.length);
      if (liberados.length === 0) {
        toast.error("Não poderemos seguir com a sua rematrícula por aqui, por favor entre em contato com o departamento financeiro do Colégio");
        return;
      }

      // Se há mais de um aluno, mostrar opções de escolha
      if (liberados.length > 1) {
        console.log('=== MÚLTIPLOS ALUNOS ENCONTRADOS ===');
        console.log('Quantidade:', liberados.length);
        const mappedResults = liberados.map((row: any) => ({
          "Nome do Aluno": row["Nome do Aluno"],
          "Curso 2025": row["Curso 2025"],
          "Curso 2026": row["Curso 2026"],
          "Turno 2026": row["Turno 2026"],
          "Ciclo": row["Ciclo"],
          "Cod Aluno": row["Cod Aluno"],
          "Desconto": row["Desconto"],
          "mensalidade 2026 sem desconto": row["mensalidade 2026 sem desconto"],
          "mensalidade 2026 com desconto": row["mensalidade 2026 com desconto"],
          "Rematrícula a vista": row["Rematrícula a vista"],
          "Rematrícula Parcelada": row["Rematrícula Parcelada"],
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
          ciclo: row["Ciclo"],
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
        }));
        console.log('=== CHAMANDO onMultipleResults ===');
        onMultipleResults(mappedResults);
        console.log('=== onMultipleResults CHAMADO ===');
        return;
      }

      // Se há apenas um aluno, prosseguir normalmente
      console.log('=== ÚNICO ALUNO ENCONTRADO ===');
      console.log('Dados do aluno:', liberados[0]);
      const row = liberados[0];
      const mappedData = {
        "Nome do Aluno": row["Nome do Aluno"],
        "Curso 2025": row["Curso 2025"],
        "Curso 2026": row["Curso 2026"],
        "Turno 2026": row["Turno 2026"],
        "Ciclo": row["Ciclo"],
        "Cod Aluno": row["Cod Aluno"],
        "Desconto": row["Desconto"],
        "mensalidade 2026 sem desconto": row["mensalidade 2026 sem desconto"],
        "mensalidade 2026 com desconto": row["mensalidade 2026 com desconto"],
        "Rematrícula a vista": row["Rematrícula a vista"],
        "Rematrícula Parcelada": row["Rematrícula Parcelada"],
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
        ciclo: row["Ciclo"],
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
      console.log('=== CHAMANDO onSearchResult ===');
      console.log('Mapped data:', mappedData);
      onSearchResult(mappedData);
      console.log('=== onSearchResult CHAMADO ===');
      toast.success("Dados encontrados!");
    } catch (error) {
      console.error('=== ERRO GERAL NA BUSCA ===');
      console.error('Error completo:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      console.error('CPF usado:', cpf);
      toast.error("Erro ao buscar CPF. Tente novamente.");
    } finally {
      console.log('=== FINALIZANDO BUSCA ===');
      setIsLoading(false);
    }
  };
  return <Card className="w-full max-w-md mx-auto shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-primary">
          <Search className="w-5 h-5" />
          <span className="font-bold">Rematrículas 2026</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-foreground">Insira o CPF do responsável para iniciar</Label>
          <Input id="cpf" type="text" placeholder="000.000.000-00" value={cpf} onChange={handleCPFChange} maxLength={14} className="text-center" />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || cpf.length < 14} className="w-full bg-gradient-primary hover:bg-primary-light transition-all duration-300">
          {isLoading ? <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Buscando...
            </> : <>
              <Search className="w-4 h-4 mr-2" />
              Buscar Dados
            </>}
        </Button>
      </CardContent>
    </Card>;
};
export default CPFSearchForm;