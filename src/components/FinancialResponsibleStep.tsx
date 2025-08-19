import { useState } from "react";
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

  // Verificar quais responsáveis têm CPF preenchido (aceita chaves mapeadas ou originais)
  const cpfPai = (data?.["CPF do Pai"] ?? data?.cpf_pai)?.toString().trim();
  const cpfMae = (data?.["CPF da mãe"] ?? data?.cpf_mae)?.toString().trim();
  const paiHasCPF = !!cpfPai;
  const maeHasCPF = !!cpfMae;
  
  // Debug logs
  console.log('Dados recebidos:', data);
  console.log('CPF do Pai (detectado):', cpfPai, 'Válido:', paiHasCPF);
  console.log('CPF da Mãe (detectado):', cpfMae, 'Válido:', maeHasCPF);
  
  // Verificar se pelo menos um responsável tem CPF
  const hasValidResponsible = paiHasCPF || maeHasCPF;

  // Normalize phone number to digits only
  const normalizePhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handleResponsibleSelection = (value: "pai" | "mae") => {
    // Validar se o responsável selecionado tem CPF
    if (value === "pai" && !paiHasCPF) {
      toast({
        title: "Erro",
        description: "Este responsável não possui CPF cadastrado",
        variant: "destructive",
      });
      return;
    }
    
    if (value === "mae" && !maeHasCPF) {
      toast({
        title: "Erro", 
        description: "Este responsável não possui CPF cadastrado",
        variant: "destructive",
      });
      return;
    }

    setResponsible(value);
    const phone = value === "pai" 
      ? (data["Telefone do Pai"] ?? data.telefone_pai)
      : (data["Telefone da Mãe"] ?? data.telefone_mae);
    setPhoneNumber(normalizePhone(phone || ""));
    setStep("phone");
  };

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
      setStep("verification");
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
        description: "Código de verificação enviado para o WhatsApp",
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
      console.log('Dados recebidos:', data);
      // Tentar acessar o código do aluno de diferentes formas
      const codAluno = Number(data?.["Cod Aluno"] || data?.cod_aluno);
      if (!codAluno) {
        console.error('Código do aluno não encontrado nos dados:', data);
        throw new Error("Não foi possível identificar o aluno (código ausente)");
      }
      // Update responsável financeiro no banco
      const { error } = await supabase.rpc('update_rematricula_fields', {
        p_cod_aluno: codAluno,
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
            
            {!hasValidResponsible && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum responsável possui CPF cadastrado. Entre em contato com a secretaria para atualizar os dados antes de prosseguir.
                </AlertDescription>
              </Alert>
            )}
            
            {hasValidResponsible && (
              <RadioGroup onValueChange={handleResponsibleSelection}>
                {/* Opção Pai */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="pai" 
                    id="pai" 
                    disabled={!paiHasCPF}
                  />
                  <Label 
                    htmlFor="pai" 
                    className={`flex-1 ${paiHasCPF ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <div>
                      <div className="font-medium">{data["Nome do Pai"] || data.nome_pai || "Pai"}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPhone((data["Telefone do Pai"] ?? data.telefone_pai) || "")}
                      </div>
                      {!paiHasCPF && (
                        <div className="text-xs text-destructive mt-1">
                          CPF não informado - Não é possível selecionar este responsável
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
                
                {/* Opção Mãe */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="mae" 
                    id="mae" 
                    disabled={!maeHasCPF}
                  />
                  <Label 
                    htmlFor="mae" 
                    className={`flex-1 ${maeHasCPF ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <div>
                      <div className="font-medium">{data["Nome da mãe"] || data["Nome da Mãe"] || data.nome_mae || "Mãe"}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPhone((data["Telefone da Mãe"] ?? data.telefone_mae) || "")}
                      </div>
                      {!maeHasCPF && (
                        <div className="text-xs text-destructive mt-1">
                          CPF não informado - Não é possível selecionar este responsável
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            )}
            
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
            <p className="text-sm text-muted-foreground text-center">
              Código enviado para: {formatPhone(phoneNumber)}
            </p>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setStep("phone")} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleVerifyCode} disabled={isLoading || verificationCode.length !== 5} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
              </Button>
            </div>
            <Button 
              onClick={handleSendCode} 
              variant="ghost" 
              className="w-full" 
              disabled={isLoading || resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : "Reenviar código"}
            </Button>
          </>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <p className="text-lg font-medium">Telefone verificado com sucesso!</p>
            <p className="text-muted-foreground">
              Responsável financeiro: {responsible === "pai" ? (data["Nome do Pai"] || data.nome_pai) : (data["Nome da mãe"] || data["Nome da Mãe"] || data.nome_mae)}
            </p>
            <p className="text-sm text-muted-foreground">Redirecionando...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialResponsibleStep;