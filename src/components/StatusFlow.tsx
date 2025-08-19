import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, CreditCard, Clock } from "lucide-react";

interface StatusFlowProps {
  status: string;
  data: any;
  onBackToSearch: () => void;
}

const StatusFlow = ({ status, data, onBackToSearch }: StatusFlowProps) => {
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
        return {
          icon: <FileText className="w-8 h-8 text-blue-600" />,
          title: "Contrato Assinado",
          description: "Seu contrato foi assinado digitalmente!",
          color: "bg-blue-100 text-blue-800",
          next_steps: [
            "Processo de rematrícula concluído",
            "Aguarde informações sobre o início das aulas",
            "Mantenha seus dados atualizados"
          ]
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