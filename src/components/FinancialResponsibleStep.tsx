import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Shield, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FinancialResponsibleStepProps {
  data: any;
  onBack: () => void;
  onSuccess: (updatedData: any) => void;
}

const FinancialResponsibleStep = ({ data, onBack, onSuccess }: FinancialResponsibleStepProps) => {
  const [selectedResponsible, setSelectedResponsible] = useState<"pai" | "mae" | "">("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [step, setStep] = useState<"select" | "phone" | "verify">("select");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResponsibleSelection = (value: "pai" | "mae") => {
    setSelectedResponsible(value);
    const phoneNumber = value === "pai" 
      ? data["Telefone do Pai"] 
      : data["Telefone da Mãe"];
    
    setPhone(phoneNumber || "");
    setStep("phone");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhone(formatted);
  };

  const sendVerificationCode = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      toast({
        title: "Erro",
        description: "Digite um telefone válido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('send-whatsapp-code', {
        body: { phone: phone.replace(/\D/g, '') }
      });

      if (error) throw error;

      setSentCode(response.code);
      setStep("verify");
      
      toast({
        title: "Código enviado!",
        description: "Verifique seu WhatsApp e digite o código recebido",
      });
    } catch (error) {
      console.error('Error sending code:', error);
      toast({
        title: "Erro ao enviar código",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode !== sentCode) {
      toast({
        title: "Código incorreto",
        description: "Verifique o código e tente novamente",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Update financial responsible in database
      const responsibleName = selectedResponsible === "pai" 
        ? data["Nome do Pai"] 
        : data["Nome da mãe"];

      const { data: result, error } = await supabase.rpc('update_rematricula_fields', {
        p_cod_aluno: data["Cod Aluno"],
        p_resp_financeiro: responsibleName
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Responsável financeiro confirmado",
      });

      onSuccess(result[0]);
    } catch (error) {
      console.error('Error updating responsible:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar responsável financeiro",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case "select":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Selecione o Responsável Financeiro</h3>
              <p className="text-sm text-muted-foreground">
                Escolha quem será o responsável financeiro para a rematrícula
              </p>
            </div>

            <RadioGroup value={selectedResponsible} onValueChange={handleResponsibleSelection}>
              <div className="space-y-3">
                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="pai" />
                  <div className="flex-1">
                    <div className="font-medium">{data["Nome do Pai"] || "Pai"}</div>
                    <div className="text-sm text-muted-foreground">
                      {data["Telefone do Pai"] || "Telefone não cadastrado"}
                    </div>
                  </div>
                </Label>

                <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="mae" />
                  <div className="flex-1">
                    <div className="font-medium">{data["Nome da mãe"] || "Mãe"}</div>
                    <div className="text-sm text-muted-foreground">
                      {data["Telefone da Mãe"] || "Telefone não cadastrado"}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </>
        );

      case "phone":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Confirmar Telefone
              </h3>
              <p className="text-sm text-muted-foreground">
                Confirme o telefone do responsável financeiro: <strong>
                  {selectedResponsible === "pai" ? data["Nome do Pai"] : data["Nome da mãe"]}
                </strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone WhatsApp</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    disabled={!isEditing}
                    placeholder="(00) 00000-0000"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    size="sm"
                  >
                    {isEditing ? "OK" : "Editar"}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("select")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  onClick={sendVerificationCode} 
                  disabled={loading || !phone}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Enviar Código
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        );

      case "verify":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verificação WhatsApp
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Digite o código de 5 dígitos enviado para:
              </p>
              <Badge variant="outline" className="font-mono">
                {phone}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="verification">Código de Verificação</Label>
                <Input
                  id="verification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 5))}
                  placeholder="00000"
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={5}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("phone")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={sendVerificationCode}
                  disabled={loading}
                >
                  Reenviar
                </Button>
                <Button 
                  onClick={verifyCode} 
                  disabled={loading || verificationCode.length !== 5}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Responsável Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {getStepContent()}
        
        {step === "select" && (
          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialResponsibleStep;