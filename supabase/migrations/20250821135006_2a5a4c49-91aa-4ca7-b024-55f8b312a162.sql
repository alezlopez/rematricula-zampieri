-- Permitir leitura pública da tabela numeros_da_sorte
CREATE POLICY "Permitir leitura pública dos números da sorte" 
ON public.numeros_da_sorte 
FOR SELECT 
USING (true);