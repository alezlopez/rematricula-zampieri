import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";

interface StudentSummaryProps {
  data: any;
  extraData: any;
  onConfirm: () => void;
  onBack: () => void;
}

const StudentSummary = ({ data, extraData, onConfirm, onBack }: StudentSummaryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractUrl, setContractUrl] = useState<string | null>(null);

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-contract', {
        body: { studentData: data }
      });

      if (error) {
        console.error('Erro ao gerar contrato:', error);
        toast.error('Erro ao gerar contrato. Tente novamente.');
        return;
      }

      if (result?.success && result?.signUrl) {
        setContractUrl(result.signUrl);
        toast.success('Contrato gerado com sucesso!');
        onConfirm(); // Chama a função original para continuar o fluxo
      } else {
        console.error('Resposta inválida:', result);
        toast.error('Erro ao gerar contrato. Resposta inválida.');
      }
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      toast.error('Erro ao gerar contrato. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Resumo da Matrícula 2026</CardTitle>
        <p className="text-center text-muted-foreground">
          Confirme os dados do aluno e valores para prosseguir
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados do Aluno */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Dados do Aluno</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nome do aluno:</span>
              <span className="font-medium">{data?.["Nome do Aluno"] || data?.nome_aluno || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turma 2025:</span>
              <span className="font-medium">{data?.["Curso 2025"] || data?.curso_2025 || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turma 2026:</span>
              <span className="font-medium">{data?.["Curso 2026"] || data?.curso_2026 || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turno:</span>
              <Badge variant="outline">{data?.["Turno 2026"] || data?.turno_2026 || extraData?.turno_2026 || "Não informado"}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ciclo:</span>
              <Badge variant="secondary">{data?.Ciclo || data?.ciclo || "Não informado"}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Valores */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Valores para 2026</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mensalidade 2026 sem desconto:</span>
              <span className="font-bold">
                {data?.["mensalidade 2026 sem desconto"] || data?.mensalidade_2026_sem_desconto || "Não informado"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mensalidade 2026 com desconto (até o vencimento):</span>
              <span className="font-bold text-primary">
                {data?.["mensalidade 2026 com desconto"] || data?.mensalidade_2026_com_desconto || "Não informado"}
              </span>
            </div>
            
            {(data?.Desconto || data?.desconto) && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Desconto:</span>
                <Badge variant="secondary">
                  {data?.Desconto || data?.desconto}%
                </Badge>
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Vencimento:</strong> Para 2026 será mantido o mesmo vencimento de 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Link do Contrato */}
        {contractUrl && (
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Contrato Gerado com Sucesso!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Clique no link abaixo para assinar o contrato:
            </p>
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Assinar Contrato
            </a>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Voltar
          </Button>
          <Button 
            onClick={handleGenerateContract} 
            className="flex-1"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              'gerar contrato'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSummary;