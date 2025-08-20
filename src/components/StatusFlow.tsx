import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, CreditCard, Clock, ExternalLink, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface StatusFlowProps {
  status: string;
  data: any;
  onBackToSearch: () => void;
}

const StatusFlow = ({ status, data, onBackToSearch }: StatusFlowProps) => {
  // Função para abrir link do contrato
  const openContractLink = (url: string) => {
    console.log('Abrindo link do contrato:', url);
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        toast.success('Contrato aberto em nova aba!');
      } else {
        throw new Error('Window.open retornou null');
      }
    } catch (error) {
      console.warn('Erro ao abrir contrato:', error);
      copyToClipboard(url);
      toast.warning('Erro ao abrir link. Link copiado para área de transferência.');
    }
  };

  // Função para copiar link para clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
      toast.error('Não foi possível copiar o link.');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pago":
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          title: "Rematrícula Paga",
          description: "Sua rematrícula já foi paga com sucesso!",
          color: "bg-green-100 text-green-800",
          next_steps: [
            "Aguarde o contrato ser enviado por email",
            "Verifique sua caixa de entrada e spam",
            "Em caso de dúvidas, entre em contato conosco"
          ]
        };
      
      case "assinado":
      case "contrato assinado":
        return {
          icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
          title: "Contrato Aguardando Assinatura",
          description: "Seu contrato está pronto para assinatura digital!",
          color: "bg-orange-100 text-orange-800",
          next_steps: [
            "Clique no link abaixo para assinar o contrato",
            "Após assinar, o processo estará concluído",
            "Em caso de dúvidas, entre em contato conosco"
          ],
          showContractLink: true
        };
      
      case "contrato gerado":
        return {
          icon: <FileText className="w-8 h-8 text-gold" />,
          title: "Contrato Gerado",
          description: "Seu contrato está disponível para assinatura digital!",
          color: "bg-gold/20 text-gold",
          next_steps: [
            "Verifique seu email para o link de assinatura",
            "Assine o contrato digitalmente",
            "Após a assinatura, o processo estará concluído"
          ]
        };
      
      case "pagamento pendente":
        return {
          icon: <CreditCard className="w-8 h-8 text-coral" />,
          title: "Pagamento Pendente",
          description: "Há um pagamento pendente para sua rematrícula.",
          color: "bg-coral/20 text-coral",
          next_steps: [
            "Acesse o link de pagamento enviado por email",
            "Complete o pagamento para prosseguir",
            "Após o pagamento, o contrato será gerado"
          ]
        };
      
      default:
        return {
          icon: <Clock className="w-8 h-8 text-muted-foreground" />,
          title: "Status Desconhecido",
          description: "Status não reconhecido pelo sistema.",
          color: "bg-muted text-muted-foreground",
          next_steps: ["Entre em contato com o suporte"]
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-soft">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {statusInfo.icon}
          </div>
          <CardTitle className="text-primary text-2xl">
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge className={statusInfo.color}>
              Status: {status}
            </Badge>
          </div>
          
          <p className="text-center text-muted-foreground">
            {statusInfo.description}
          </p>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-3">Dados do Aluno:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium ml-2">{data.nome_aluno}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Curso 2025:</span>
                <span className="font-medium ml-2">{data.curso_2025}</span>
              </div>
              {data.curso_2026 && (
                <div>
                  <span className="text-muted-foreground">Curso 2026:</span>
                  <span className="font-medium ml-2">{data.curso_2026}</span>
                </div>
              )}
              {data.turno_2026 && (
                <div>
                  <span className="text-muted-foreground">Turno 2026:</span>
                  <span className="font-medium ml-2">{data.turno_2026}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-lighter/50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-3">Próximos Passos:</h4>
            <ul className="space-y-2">
              {statusInfo.next_steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Link do Contrato para Assinatura - só mostra quando status é "Contrato Assinado" */}
          {statusInfo.showContractLink && data?.["Link Contrato"] && (
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Contrato para Assinatura
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                Clique no botão abaixo para acessar e assinar seu contrato digitalmente:
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => openContractLink(data["Link Contrato"])}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Assinar Contrato
                </Button>
                <Button 
                  onClick={() => copyToClipboard(data["Link Contrato"])}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                Link: {data["Link Contrato"]}
              </p>
            </div>
          )}

          <Button
            onClick={onBackToSearch}
            variant="outline"
            className="w-full"
          >
            Buscar Outro CPF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusFlow;