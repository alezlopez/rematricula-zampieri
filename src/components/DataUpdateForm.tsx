
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DataUpdateFormProps {
  data: any;
  onBack: () => void;
  onSuccess: (updatedData: any) => void;
}

interface UpdateFormData {
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  estado?: string;
  telefone_pai?: string;
  telefone_mae?: string;
  email_pai?: string;
  email_mae?: string;
}

const DataUpdateForm = ({ data, onBack, onSuccess }: DataUpdateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<UpdateFormData>({
    defaultValues: {
      endereco: data.endereco || "",
      numero: data.numero?.toString() || "",
      bairro: data.bairro || "",
      cidade: data.cidade || "",
      cep: data.cep || "",
      estado: data.estado || "",
      telefone_pai: data.telefone_pai || "",
      telefone_mae: data.telefone_mae || "",
      email_pai: data.email_pai || "",
      email_mae: data.email_mae || "",
    },
  });

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3");
  };

  const onSubmit = async (formData: UpdateFormData) => {
    if (!data.cod_aluno) {
      toast.error("Código do aluno não encontrado");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Atualizando dados do aluno:', data.cod_aluno);
      console.log('Dados para atualização:', formData);

      // Preparar os dados para a função RPC
      const updateParams = {
        p_cod_aluno: data.cod_aluno,
        p_endereco: formData.endereco || null,
        p_numero: formData.numero ? parseInt(formData.numero) : null,
        p_bairro: formData.bairro || null,
        p_cidade: formData.cidade || null,
        p_cep: formData.cep || null,
        p_estado: formData.estado || null,
        p_telefone_pai: formData.telefone_pai || null,
        p_telefone_mae: formData.telefone_mae || null,
        p_email_pai: formData.email_pai || null,
        p_email_mae: formData.email_mae || null,
      };

      const { data: updatedData, error } = await supabase.rpc('update_rematricula_fields', updateParams);

      if (error) {
        console.error('Erro ao atualizar:', error);
        toast.error("Erro ao atualizar os dados. Tente novamente.");
        return;
      }

      console.log('Dados atualizados:', updatedData);
      toast.success("Dados atualizados com sucesso!");
      
      // Retornar os dados atualizados
      if (updatedData && updatedData.length > 0) {
        const updated = updatedData[0];
        const mappedData = {
          ...data,
          endereco: updated["Endereço"],
          numero: updated["Número"],
          bairro: updated["Bairro"],
          cidade: updated["Cidade"],
          cep: updated["CEP"],
          estado: updated["Estado"],
          telefone_pai: updated["Telefone do Pai"],
          telefone_mae: updated["Telefone da Mãe"],
          email_pai: updated["Email do Pai"],
          email_mae: updated["Email da Mãe"],
        };
        onSuccess(mappedData);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error("Erro ao atualizar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-primary">
          <Save className="w-5 h-5" />
          <span>Atualizar Dados</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Aluno: <span className="font-medium">{data.nome_aluno}</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Endereço</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rua, Avenida..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Centro" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="São Paulo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="00000-000"
                          maxLength={9}
                          onChange={(e) => field.onChange(formatCEP(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SP" maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dados do Pai */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Contato do Pai</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone_pai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Pai</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_pai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Pai</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="pai@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dados da Mãe */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Contato da Mãe</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone_mae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone da Mãe</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_mae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email da Mãe</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="mae@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary hover:bg-primary-light"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DataUpdateForm;
