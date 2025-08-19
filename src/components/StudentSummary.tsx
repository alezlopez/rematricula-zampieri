import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      const webhookData = {
        "cod do aluno": data?.["Cod Aluno"] || data?.cod_aluno || '',
        "Responsavel Financeiro": data?.["Resp. Financeiro"] || data?.resp_financeiro || '',
        "Estado civil": data?.["Estado Civil Resp. Financeiro"] || extraData?.estado_civil || '',
        "Profissão": data?.["Profissão Resp. Financeiro"] || extraData?.profissao || '',
        "Data de nascimento do responsavel": data?.["Data Nascimento Resp. Financeiro"] || extraData?.data_nascimento_responsavel || '',
        "Data de nascimento do aluno": data?.["Data Nascimento Aluno"] || extraData?.data_nascimento_aluno || '',
        "RG do Responsável": data?.["RG Resp. Financeiro"] || extraData?.rg_responsavel || '',
        "Naturalidade": data?.["Naturalidade do Responsável Financeiro"] || extraData?.naturalidade_responsavel || ''
      };

      console.log('Enviando dados para webhook:', webhookData);

      const response = await fetch('https://n8n.colegiozampieri.com/webhook/contratorematriculaonline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Resposta do webhook:', responseData);
        
        // Extrair o link do contrato da resposta
        const contractLink = responseData?.contrato || responseData?.link_contrato || responseData?.linkContrato || responseData?.contract_url;
        
        console.log('Link do contrato extraído:', contractLink);
        
        if (contractLink) {
          setContractUrl(contractLink);
          toast.success('Contrato gerado com sucesso!');
        } else {
          setContractUrl('success'); // Marca como enviado com sucesso mesmo sem link
          toast.success('Dados enviados com sucesso! O contrato será processado.');
        }
        // Não chama onConfirm() aqui - deixa o usuário decidir quando continuar
      } else {
        console.error('Erro na resposta do webhook:', response.status);
        toast.error('Erro ao enviar dados. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar dados para webhook:', error);
      toast.error('Erro ao enviar dados. Verifique sua conexão e tente novamente.');
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

        {/* Informação sobre envio */}
        {contractUrl && (
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              {contractUrl === 'success' ? 'Dados Enviados com Sucesso!' : 'Contrato Gerado!'}
            </h4>
            {contractUrl === 'success' ? (
              <p className="text-sm text-green-700 dark:text-green-300">
                Os dados do aluno foram enviados para processamento. O contrato será gerado em breve.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  O contrato foi gerado com sucesso! Clique no botão abaixo para acessá-lo:
                </p>
                <Button 
                  onClick={() => {
                    console.log('Clicando no botão. URL do contrato:', contractUrl);
                    if (contractUrl && contractUrl !== 'success') {
                      try {
                        window.open(contractUrl, '_blank', 'noopener,noreferrer');
                      } catch (error) {
                        console.error('Erro ao abrir link:', error);
                        // Fallback: tentar usando location.href
                        window.location.href = contractUrl;
                      }
                    } else {
                      console.error('URL do contrato inválida:', contractUrl);
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Acessar Contrato
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4">
          {contractUrl ? (
            // Após gerar o contrato, mostra opções de continuar ou nova rematrícula
            <>
              <Button onClick={onBack} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={onConfirm} className="flex-1">
                Nova Rematrícula
              </Button>
            </>
          ) : (
            // Antes de gerar o contrato, mostra botões normais
            <>
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
                  'Gerar Contrato'
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSummary;