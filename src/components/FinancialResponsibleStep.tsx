import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FinancialResponsibleStepProps {
  data: any;
  onSuccess: () => void;
  onBack: () => void;
}

const FinancialResponsibleStep = ({ data, onSuccess, onBack }: FinancialResponsibleStepProps) => {
  const [responsible, setResponsible] = useState<"pai" | "mae" | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [step, setStep] = useState<"selection" | "phone" | "verification" | "success">("selection");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  // Normalize phone number to digits only
  const normalizePhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handleResponsibleSelection = (value: "pai" | "mae") => {
    setResponsible(value);
    const phone = value === "pai" ? data["Telefone do Pai"] : data["Telefone da Mãe"];
    setPhoneNumber(normalizePhone(phone || ""));
    setStep("verification"); // Skip phone step since we already have the number
  };

  // Auto send code when verification step is reached
  useEffect(() => {
    if (step === "verification" && !sentCode && phoneNumber) {
      handleSendCode();
    }
  }, [step, phoneNumber, sentCode]);

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Por favor, digite um número de telefone válido");
      return;
    }

    const now = Date.now();
    const timeSinceLastSent = now - lastSentTime;
    
    if (timeSinceLastSent < 60000 && lastSentTime > 0) {
      const remainingTime = Math.ceil((60000 - timeSinceLastSent) / 1000);
      setError(`Aguarde ${remainingTime} segundos para reenviar o código`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data: result, error } = await supabase.functions.invoke('send-whatsapp-code', {
        body: { phoneNumber: normalizePhone(phoneNumber) }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erro ao enviar código');
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setSentCode(result.code);
      if (step !== "verification") {
        setStep("verification");
      }
      setLastSentTime(now);
      
      // Start cooldown timer
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: "Código enviado",
        description: `Status do provedor: ${result.providerStatus || 'desconhecido'}`,
      });
    } catch (error: any) {
      console.error('Send code error:', error);
      setError(error.message || "Erro ao enviar código de verificação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode !== sentCode) {
      setError("Código incorreto. Tente novamente.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log('Updating responsible with data:', {
        p_cod_aluno: data["Cod Aluno"],
        p_resp_financeiro: responsible === "pai" ? "Pai" : "Mãe"
      });
      
      // Update responsible financeiro in database - pass all required parameters
      const { error } = await supabase.rpc('update_rematricula_fields', {
        p_cod_aluno: data["Cod Aluno"],
        p_endereco: null,
        p_numero: null,
        p_bairro: null,
        p_cidade: null,
        p_cep: null,
        p_estado: null,
        p_telefone_pai: null,
        p_telefone_mae: null,
        p_email_pai: null,
        p_email_mae: null,
        p_resp_financeiro: responsible === "pai" ? "Pai" : "Mãe"
      });

      if (error) {
        console.error('Database update error:', error);
        throw new Error("Erro ao atualizar responsável financeiro");
      }

      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Verify code error:', error);
      setError(error.message || "Erro ao confirmar código");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {step === "selection" && "Responsável Financeiro"}
          {step === "phone" && "Verificar Telefone"}
          {step === "verification" && "Código de Verificação"}
          {step === "success" && "Verificado com Sucesso"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "selection" && (
          <>
            <p className="text-center text-muted-foreground">
              Quem será o responsável financeiro pela matrícula?
            </p>
            <RadioGroup onValueChange={handleResponsibleSelection}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="pai" id="pai" />
                <Label htmlFor="pai" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{data["Nome do Pai"] || "Pai"}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatPhone(data["Telefone do Pai"] || "")}
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="mae" id="mae" />
                <Label htmlFor="mae" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{data["Nome da mãe"] || "Mãe"}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatPhone(data["Telefone da Mãe"] || "")}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            <Button onClick={onBack} variant="outline" className="w-full">
              Voltar
            </Button>
          </>
        )}

        {step === "phone" && (
          <>
            <div>
              <Label htmlFor="phone">Confirme o número do telefone:</Label>
              <Input
                id="phone"
                type="tel"
                value={formatPhone(phoneNumber)}
                onChange={(e) => setPhoneNumber(normalizePhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="mt-2"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setStep("selection")} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleSendCode} disabled={isLoading} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Código"}
              </Button>
            </div>
          </>
        )}

        {step === "verification" && (
          <>
            <div className="text-center mb-4">
              <p className="font-medium">Responsável selecionado:</p>
              <p className="text-muted-foreground">
                {responsible === "pai" ? data["Nome do Pai"] : data["Nome da mãe"]}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatPhone(phoneNumber)}
              </p>
            </div>
            <div>
              <Label htmlFor="code">Digite o código enviado via WhatsApp:</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="mt-2 text-center text-lg"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setStep("selection")} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleVerifyCode} disabled={isLoading || verificationCode.length !== 5} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Não recebeu o código?</p>
              <Button 
                onClick={handleSendCode} 
                variant="ghost" 
                size="sm"
                disabled={isLoading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar código"}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-lg font-medium">Telefone verificado com sucesso!</p>
            <p className="text-muted-foreground">
              Responsável financeiro: {responsible === "pai" ? data["Nome do Pai"] : data["Nome da mãe"]}
            </p>
            <p className="text-sm text-muted-foreground">Redirecionando...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialResponsibleStep;