import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  nomeResponsavel: string;
  nomeAluno: string;
  serieAluno: string;
  cpfResponsavel: string;
  whatsappResponsavel: string;
}

const ListaVip = () => {
  const [showPopup, setShowPopup] = useState(true); // popup inicial
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // popup de sucesso
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      nomeResponsavel: "",
      nomeAluno: "",
      serieAluno: "",
      cpfResponsavel: "",
      whatsappResponsavel: "",
    },
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    return value;
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    form.setValue("cpfResponsavel", formatted);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    form.setValue("whatsappResponsavel", formatted);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const cpfNumbers = data.cpfResponsavel.replace(/\D/g, "");
      const whatsappNumbers = data.whatsappResponsavel.replace(/\D/g, "");

      const { error } = await supabase.from("lista_vip").insert({
        nome_responsavel: data.nomeResponsavel,
        nome_aluno: data.nomeAluno,
        serie_aluno: data.serieAluno,
        cpf_responsavel: cpfNumbers,
        whatsapp_responsavel: whatsappNumbers,
      });

      if (error) throw error;

      // Mostrar o popup de sucesso
      setShowSuccessPopup(true);

      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositiveClick = () => {
    setShowPopup(false);
  };

  const handleNegativeClick = () => {
    setShowPopup(false);
    navigate("/");
  };

  const seriesOptions = [
    "Pré",
    "1º ano",
    "2º ano",
    "3º ano",
    "4º ano",
    "5º ano",
    "6º ano",
    "7º ano",
    "8º ano",
    "9º ano",
    "1º médio",
    "2º médio",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* POPUP INICIAL */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent
          className="sm:max-w-md"
          hideCloseButton
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Importante</DialogTitle>
            <DialogDescription className="text-center text-base py-4">
              A maioria das famílias já fez a rematrícula.
              <br />
              <br />
              Para os que ainda estão indecisos, abrimos uma lista de prioridade, mas ela é limitada e estará disponível
              só até o dia 24/10.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Button onClick={handlePositiveClick} className="w-full" size="lg">
              Quero aproveitar essa oportunidade
            </Button>
            <Button onClick={handleNegativeClick} variant="destructive" className="w-full" size="lg">
              Quero perder a chance de matricular meu filho
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* POPUP DE SUCESSO */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro realizado com sucesso!</DialogTitle>
            <DialogDescription>
              Você foi adicionado à lista VIP. Entraremos em contato no dia 24/10 no número informado.
            </DialogDescription>
          </DialogHeader>

          <button
            onClick={() => setShowSuccessPopup(false)}
            className="mt-4 w-full rounded-xl bg-primary p-2 text-white font-medium"
          >
            Não quero perder essa oportunidade!
          </button>
        </DialogContent>
      </Dialog>

      {/* FORM */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Lista VIP - Prioridade</CardTitle>
            <CardDescription className="text-lg">
              Cadastre-se agora e garanta sua vaga na última oportunidade de rematrícula para 2026.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nomeResponsavel"
                  rules={{ required: "Nome do responsável é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Responsável *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomeAluno"
                  rules={{ required: "Nome do aluno é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Aluno *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serieAluno"
                  rules={{ required: "Série do aluno é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Série do Aluno *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a série" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {seriesOptions.map((serie) => (
                            <SelectItem key={serie} value={serie}>
                              {serie}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpfResponsavel"
                  rules={{
                    required: "CPF é obrigatório",
                    validate: (value) => {
                      const numbers = value.replace(/\D/g, "");
                      return numbers.length === 11 || "CPF deve ter 11 dígitos";
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do Responsável *</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} onChange={handleCPFChange} maxLength={14} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappResponsavel"
                  rules={{
                    required: "WhatsApp é obrigatório",
                    validate: (value) => {
                      const numbers = value.replace(/\D/g, "");
                      return numbers.length === 11 || "WhatsApp deve ter 11 dígitos (DDD + 9 dígitos)";
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp do Responsável *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={handleWhatsAppChange}
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Cadastrar na Lista VIP"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListaVip;
