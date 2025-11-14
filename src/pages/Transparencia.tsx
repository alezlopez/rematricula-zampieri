import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface NumeroSorte {
  id: number;
  Aluno: string;
  numero_da_sorte: number;
  cpf: string;
}

const Transparencia = () => {
  const [numeros, setNumeros] = useState<NumeroSorte[]>([]);
  const [loading, setLoading] = useState(true);

  const ocultarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.trim().split(" ");
    if (palavras.length === 1) {
      return palavras[0];
    }
    const primeiroNome = palavras[0];
    const ultimoNome = palavras[palavras.length - 1];
    const ultimasLetras = ultimoNome.slice(-2);
    return `${primeiroNome} ****** ${ultimasLetras}`;
  };

  const ocultarCPF = (cpf: string) => {
    if (!cpf) return "";
    const apenasNumeros = cpf.replace(/\D/g, "");
    if (apenasNumeros.length !== 11) return cpf;
    return `${apenasNumeros.slice(0, 3)}******${apenasNumeros.slice(-2)}`;
  };

  useEffect(() => {
    const fetchNumeros = async () => {
      try {
        const { data, error } = await supabase
          .from("numeros_da_sorte")
          .select("*")
          .order("numero_da_sorte", { ascending: true });

        if (error) throw error;
        setNumeros(data || []);
      } catch (error) {
        console.error("Erro ao buscar números:", error);
        toast.error("Erro ao carregar números da sorte");
      } finally {
        setLoading(false);
      }
    };

    fetchNumeros();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Relação de números da sorte da campanha de rematrículas 2026.
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Nome do Aluno</TableHead>
                  <TableHead className="w-[30%] text-center">Número da Sorte</TableHead>
                  <TableHead className="w-[30%] text-center">CPF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {numeros.map((numero) => (
                  <TableRow key={numero.id}>
                    <TableCell className="font-medium">
                      {ocultarNome(numero.Aluno)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {numero.numero_da_sorte}
                    </TableCell>
                    <TableCell className="text-center">
                      {ocultarCPF(numero.cpf)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <p className="text-center text-muted-foreground mt-6">
          Total de participantes: {numeros.length}
        </p>
      </div>
    </div>
  );
};

export default Transparencia;
