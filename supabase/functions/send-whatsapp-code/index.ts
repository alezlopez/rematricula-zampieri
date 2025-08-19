import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();
    
    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Número de telefone é obrigatório' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize: digits only, strip leading country code if present
    const digits = String(phoneNumber).replace(/\D/g, '');
    const local = digits.startsWith('55') ? digits.slice(2) : digits;
    const e164 = `55${local}`;

    // Generate 5-digit verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    
    console.log('Sending verification code:', verificationCode, 'to phone:', phoneNumber);

    // Send WhatsApp message via Evolution API
    const evolutionApiResponse = await fetch('https://evoapi.colegiozampieri.com/message/sendText/Zampieri3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('EVOLUTION_API_KEY') || '',
      },
      body: JSON.stringify({
        number: e164,
        text: `Código de verificação: ${verificationCode}`,
        linkPreview: false
      }),
    });

    const evolutionResult = await evolutionApiResponse.json();
    console.log('Evolution API response:', evolutionResult);

    if (!evolutionApiResponse.ok) {
      console.error('Evolution API error:', evolutionResult);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar mensagem WhatsApp' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: verificationCode,
        message: 'Código enviado com sucesso',
        providerStatus: evolutionResult?.status ?? null,
        providerMessageId: evolutionResult?.key?.id ?? null
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-whatsapp-code function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});