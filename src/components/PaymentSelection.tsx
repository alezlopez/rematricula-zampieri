import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ExternalLink, ArrowLeft, CreditCard, Banknote } from "lucide-react";

interface PaymentSelectionProps {
  data: any;
  onBack: () => void;
  onComplete: () => void;
}

const PaymentSelection = ({ data, onBack, onComplete }: PaymentSelectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'vista' | 'parcelada' | null>(null);

  const handleGeneratePayment = async () => {
    if (!selectedPaymentType) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    setIsGenerating(true);
    try {
      const webhookData = {
        "cod_aluno": data?.["Cod Aluno"] || data?.cod_aluno || '',
        "nome_aluno": data?.["Nome do Aluno"] || data?.nome_aluno || '',
        "tipo_pagamento": selectedPaymentType,
        "valor": selectedPaymentType === 'vista' 
          ? data?.["Rematrícula a vista"] || data?.rematricula_a_vista 
          : data?.["Rematrícula Parcelada"] || data?.rematricula_parcelada,
      };

      console.log('Enviando dados para webhook de pagamento:', webhookData);

      const response = await fetch('https://n8n.colegiozampieri.com/webhook/geraCheckoutAssas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Resposta do webhook de pagamento:', responseData);
        
        // Extrair o link do checkout da resposta
        const checkoutLink = responseData?.linkCheckout || responseData?.checkout || responseData?.link_checkout || responseData?.checkoutUrl || responseData?.url;
        
        console.log('Link do checkout extraído:', checkoutLink);
        
        if (checkoutLink) {
          setCheckoutUrl(checkoutLink);
          toast.success('Checkout gerado com sucesso!');
        } else {
          toast.error('Erro ao gerar checkout. Link não encontrado na resposta.');
        }
      } else {
        console.error('Erro na resposta do webhook:', response.status);
        toast.error('Erro ao gerar pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar dados para webhook:', error);
      toast.error('Erro ao gerar pagamento. Verifique sua conexão e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openCheckoutLink = (url: string) => {
    console.log('Abrindo checkout na mesma página:', url);
    
    try {
      // Abrir na mesma página
      window.location.href = url;
      toast.success('Redirecionando para o checkout...');
      return true;
    } catch (error) {
      console.error('Erro ao redirecionar para checkout:', error);
      toast.error('Erro ao abrir checkout. Tente copiar o link manualmente.');
      return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Forma de Pagamento</CardTitle>
        <p className="text-center text-muted-foreground">
          Escolha a forma de pagamento da rematrícula
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados do Aluno */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Aluno</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nome:</span>
            <span className="font-medium">{data?.["Nome do Aluno"] || data?.nome_aluno || "Não informado"}</span>
          </div>
        </div>

        <Separator />

        {/* Opções de Pagamento */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Opções de Pagamento</h3>
          <div className="space-y-4">
            
            {/* Pagamento à Vista */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPaymentType === 'vista' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPaymentType('vista')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Pagamento à Vista</h4>
                    <p className="text-sm text-muted-foreground">Valor total da rematrícula</p>
                  </div>
                </div>
                <Badge variant={selectedPaymentType === 'vista' ? 'default' : 'secondary'}>
                  {data?.["Rematrícula a vista"] || data?.rematricula_a_vista || "Consultar"}
                </Badge>
              </div>
            </div>

            {/* Pagamento Parcelado */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPaymentType === 'parcelada' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPaymentType('parcelada')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Pagamento Parcelado</h4>
                    <p className="text-sm text-muted-foreground">Pagamento em parcelas</p>
                  </div>
                </div>
                <Badge variant={selectedPaymentType === 'parcelada' ? 'default' : 'secondary'}>
                  {data?.["Rematrícula Parcelada"] || data?.rematricula_parcelada || "Consultar"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Link do Checkout */}
        {checkoutUrl && (
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Checkout Gerado!
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-green-700 dark:text-green-300">
                O link de pagamento foi gerado com sucesso!
              </p>
              <Button 
                onClick={() => openCheckoutLink(checkoutUrl)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Pagamento
              </Button>
              <p className="text-xs text-green-600 dark:text-green-400 break-all">
                Link: {checkoutUrl}
              </p>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          {checkoutUrl ? (
            <Button onClick={onComplete} className="flex-1">
              Finalizar
            </Button>
          ) : (
            <Button 
              onClick={handleGeneratePayment} 
              className="flex-1"
              disabled={isGenerating || !selectedPaymentType}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Pagamento'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSelection;