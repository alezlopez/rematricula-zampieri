import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Sucesso = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Rematrícula concluída
          </h1>
          
          <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
            <p>
              Sua rematrícula foi concluída com sucesso. Encaminhamos para o WhatsApp cadastrado algumas informações importantes, além do(s) número(s) da sorte para concorrer a:
            </p>
            
            <div className="space-y-3 text-left max-w-lg mx-auto">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <span><strong>1º Prêmio:</strong> Kit de material didático 2026</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👕👚</span>
                <span><strong>2º Prêmio:</strong> Kit de uniformes (camiseta, calça, shorts e blusa de frio)</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎒</span>
                <span><strong>3º Prêmio:</strong> Mochila premium personalizada</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sucesso;