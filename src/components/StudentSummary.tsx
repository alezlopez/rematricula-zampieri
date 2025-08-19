import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface StudentSummaryProps {
  data: any;
  extraData: any;
  onConfirm: () => void;
  onBack: () => void;
}

const StudentSummary = ({ data, extraData, onConfirm, onBack }: StudentSummaryProps) => {
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
              <span className="font-medium">{data?.["Nome do Aluno"] || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turma 2025:</span>
              <span className="font-medium">{data?.["Curso 2025"] || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turma 2026:</span>
              <span className="font-medium">{data?.["Curso 2026"] || "Não informado"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Turno:</span>
              <Badge variant="outline">{data?.["Turno 2026"] || extraData?.turno_2026 || "Não informado"}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ciclo:</span>
              <Badge variant="secondary">{data?.Ciclo || "Não informado"}</Badge>
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
                {data?.["mensalidade 2026 sem desconto"] || "Não informado"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mensalidade 2026 com desconto (até o vencimento):</span>
              <span className="font-bold text-primary">
                {data?.["mensalidade 2026 com desconto"] || "Não informado"}
              </span>
            </div>
            
            {data?.Desconto && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Desconto:</span>
                <Badge variant="secondary">
                  {data.Desconto}%
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

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Voltar
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Confirmar Matrícula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSummary;