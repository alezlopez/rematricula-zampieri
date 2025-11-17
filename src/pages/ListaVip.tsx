import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    <div className="min-h-screen" style={{ backgroundColor: "#272727" }}>
      {/* Custom Header for Lista VIP page */}
      <header className="w-full shadow-sm border-b border-white/20" style={{ backgroundColor: "#272727" }}>
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <div className="bg-white rounded-full p-3 flex items-center justify-center">
            <img
              src="/lovable-uploads/0dd01042-2911-4a76-ab1e-e0e6d60e3f18.png"
              alt="Colégio Zampieri"
              className="h-12 object-contain"
            />
          </div>
        </div>
      </header>

      {/* Faixa Vermelha - Largura Total */}
      <div className="w-full bg-red-600/30 py-4 px-6">
        <p className="text-red-500 text-center font-semibold text-lg">
          Se inscreva para ter acesso ao desconto no dia do lançamento da oferta.
        </p>
      </div>

      {/* POPUP INICIAL */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent
          className="sm:max-w-md border-white/20"
          style={{ backgroundColor: "#272727" }}
          hideCloseButton
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">Importante</DialogTitle>
            <DialogDescription className="text-center text-base py-4 text-white">
              A maioria das famílias já fez a rematrícula.
              <br />
              <br />
              Para os que ainda estão indecisos, abrimos uma lista de prioridade, <strong>mas ela é limitada e estará disponível
              só até o dia 24/11.</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Button onClick={handlePositiveClick} className="w-full" size="lg">
              Quero aproveitar essa oportunidade
            </Button>
          </div>
          <Button onClick={handleNegativeClick} variant="destructive" className="h-8 text-xs">
            Quero perder a oportunidade
          </Button>
        </DialogContent>
      </Dialog>

      {/* POPUP DE SUCESSO */}
<Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
  <DialogContent
    className="w-full max-w-[360px] h-[85vh] flex flex-col rounded-2xl border-white/20 overflow-y-auto"
    style={{ backgroundColor: "#272727" }}
  >
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-center text-white">
        Cadastro Realizado com Sucesso
      </DialogTitle>

      <DialogDescription className="text-white text-center">
        <br />
        Seu cadastro foi concluído na <span className="font-bold text-primary">Lista VIP</span>.
        <br />
        Entraremos em contato no dia <span className="font-bold">24/11</span> no número informado.
      </DialogDescription>
    </DialogHeader>

    <button
      onClick={() => setShowSuccessPopup(false)}
      className="mt-auto mb-4 w-full rounded-xl bg-primary p-3 text-white font-medium"
    >
      Não quero perder essa oportunidade!
    </button>
  </DialogContent>
</Dialog>

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
        <Card className="border-0 shadow-none" style={{ backgroundColor: "#272727" }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Lista de Espera - Não Rematriculados</CardTitle>
            <CardDescription className="text-lg text-white">
              Cadastre-se agora e garanta a última oportunidade de rematrícula para 2026 com o maior desconto.
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
                      <FormLabel className="text-white">Nome do Responsável *</FormLabel>
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
                      <FormLabel className="text-white">Nome do Aluno *</FormLabel>
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
                      <FormLabel className="text-white">Série do Aluno *</FormLabel>
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
                      <FormLabel className="text-white">CPF do Responsável *</FormLabel>
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
                      <FormLabel className="text-white">WhatsApp do Responsável *</FormLabel>
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
                  {isSubmitting ? "Enviando..." : "Entrar para a lista"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* FAQ SECTION */}
        <Card className="border-0 shadow-none mt-8" style={{ backgroundColor: "#272727" }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Dúvidas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-white text-left">Qual o desconto?</AccordionTrigger>
                <AccordionContent className="text-white/90">
                  Todos que se inscreverem na lista terão direito a 60% de desconto no valor de rematrícula.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-white text-left">Tenho garantia de vaga?</AccordionTrigger>
                <AccordionContent className="text-white/90">
                  Não! Algumas turmas já estão com vagas esgotadas para o período da manhã.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-white text-left">Como cancelar a inscrição?</AccordionTrigger>
                <AccordionContent className="text-white/90">
                  Essa inscrição é apenas para a lista de espera sem compromisso, ou seja, se não quiser a oportunidade,
                  é só não efetuar o pagamento de rematrícula. Além disso, você pode sair da lista de espera a qualquer
                  momento, perdendo automaticamente o desconto de 60%.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListaVip;
