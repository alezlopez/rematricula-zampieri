-- Permitir atualização de status na tabela rematricula
CREATE POLICY "Permitir atualização de status para admin" 
ON public.rematricula 
FOR UPDATE 
USING (true) 
WITH CHECK (true);