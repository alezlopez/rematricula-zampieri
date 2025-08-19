import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Telefone é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 5-digit verification code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    
    // Send WhatsApp message
    const whatsappResponse = await fetch('https://evoapi.colegiozampieri.com/message/sendText/Zampieri3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('EVOLUTION_API_KEY') || ''
      },
      body: JSON.stringify({
        number: `55${phone.replace(/\D/g, '')}`,
        text: `Código de verificação: ${code}`,
        linkPreview: false
      })
    });

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', await whatsappResponse.text());
      throw new Error('Erro ao enviar mensagem WhatsApp');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        code, // In production, you might want to store this more securely
        message: 'Código enviado com sucesso'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-whatsapp-code:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});