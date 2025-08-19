import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para converter números para extenso em português
function numberToText(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(num)) return '';
  
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  
  const integer = Math.floor(num);
  const decimal = Math.round((num - integer) * 100);
  
  function convertInteger(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      return tens[ten] + (unit > 0 ? ' e ' + units[unit] : '');
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      return hundreds[hundred] + (rest > 0 ? ' e ' + convertInteger(rest) : '');
    }
    return n.toString(); // Para números maiores, retorna como string
  }
  
  let result = convertInteger(integer);
  if (integer === 1) result = 'um';
  
  result += ' real';
  if (integer !== 1) result += 'is';
  
  if (decimal > 0) {
    result += ' e ' + convertInteger(decimal) + ' centavo';
    if (decimal !== 1) result += 's';
  }
  
  return result;
}

// Função para formatar data atual
function getCurrentDateFormatted(): string {
  const now = new Date();
  const day = now.getDate();
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const month = months[now.getMonth()];
  return `${day} de ${month}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentData } = await req.json();
    console.log('Gerando contrato para:', studentData);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar todos os dados do aluno na tabela
    const { data: fullStudentData, error } = await supabase
      .from('rematricula')
      .select('*')
      .eq('Cod Aluno', studentData['Cod Aluno'] || studentData.cod_aluno)
      .single();

    if (error || !fullStudentData) {
      throw new Error('Erro ao buscar dados completos do aluno: ' + error?.message);
    }

    console.log('Dados completos do aluno:', fullStudentData);

    // Preparar dados para o contrato
    const mensalidadeSemDesc = fullStudentData['mensalidade 2026 sem desconto'] || '';
    const mensalidadeComDesc = fullStudentData['mensalidade 2026 com desconto'] || '';
    const anuidade = fullStudentData['Anuidade'] || '';
    const desconto = fullStudentData['Desconto'] || '';

    const contractData = {
      template_id: "85f61734-9a3b-4311-bafc-ce982e1f1f53",
      signer_name: "Adenilton Rodrigues Brito",
      send_automatic_email: true,
      send_automatic_whatsapp: false,
      lang: "pt-br",
      folder_token: "3cbdd40d-6858-478f-8f9c-aad5c0c635b7",
      data: [
        { "de": "{{respFin}}", "para": fullStudentData['Resp. Financeiro'] || '' },
        { "de": "{{nascimentoRespFin}}", "para": '' },
        { "de": "{{profRespFin}}", "para": '' },
        { "de": "{{cpfRespFin}}", "para": fullStudentData['CPF do Pai'] || fullStudentData['CPF da mãe'] || '' },
        { "de": "{{rgRespFin}}", "para": '' },
        { "de": "{{estadoCivil}}", "para": '' },
        { "de": "{{telRespFin}}", "para": fullStudentData['Telefone do Pai'] || fullStudentData['Telefone da Mãe'] || '' },
        { "de": "{{emailRespFin}}", "para": fullStudentData['Email do Pai'] || fullStudentData['Email da Mãe'] || '' },
        { "de": "{{naturalidadeRespFin}}", "para": '' },
        
        { "de": "{{pai}}", "para": fullStudentData['Nome do Pai'] || '' },
        { "de": "{{cpfPai}}", "para": fullStudentData['CPF do Pai'] || '' },
        { "de": "{{telPai}}", "para": fullStudentData['Telefone do Pai'] || '' },
        { "de": "{{emailPai}}", "para": fullStudentData['Email do Pai'] || '' },
        
        { "de": "{{mae}}", "para": fullStudentData['Nome da mãe'] || '' },
        { "de": "{{telMae}}", "para": fullStudentData['Telefone da Mãe'] || '' },
        { "de": "{{emailMae}}", "para": fullStudentData['Email da Mãe'] || '' },
        { "de": "{{cpfMae}}", "para": fullStudentData['CPF da mãe'] || '' },
        
        { "de": "{{aluno}}", "para": fullStudentData['Nome do Aluno'] || '' },
        { "de": "{{nascimentoAluno}}", "para": '' },
        { "de": "{{codAluno}}", "para": (fullStudentData['Cod Aluno'] || '').toString() },
        { "de": "{{endereco}}", "para": fullStudentData['Endereço'] || '' },
        { "de": "{{numero}}", "para": (fullStudentData['Número'] || '').toString() },
        { "de": "{{bairro}}", "para": fullStudentData['Bairro'] || '' },
        { "de": "{{cidade}}", "para": fullStudentData['Cidade'] || '' },
        { "de": "{{cep}}", "para": fullStudentData['CEP'] || '' },
        { "de": "{{turma25}}", "para": fullStudentData['Curso 2025'] || '' },
        { "de": "{{turma26}}", "para": fullStudentData['Curso 2026'] || '' },
        { "de": "{{turno26}}", "para": fullStudentData['Turno 2026'] || '' },
        { "de": "{{ciclo}}", "para": fullStudentData['Ciclo'] || '' },
        { "de": "{{anuidade}}", "para": anuidade },
        { "de": "{{mensalidadeComDesc}}", "para": mensalidadeComDesc },
        { "de": "{{desconto}}", "para": desconto },
        { "de": "{{atualizaDados}}", "para": '' },
        { "de": "{{mensalidadeSemDesc}}", "para": mensalidadeSemDesc },
        { "de": "{{anuidadeExt}}", "para": numberToText(anuidade) },
        { "de": "{{mensalidadeSemDescExt}}", "para": numberToText(mensalidadeSemDesc) },
        { "de": "{{dataAtual}}", "para": getCurrentDateFormatted() },
        { "de": "{{mensalidadeComDescExt}}", "para": numberToText(mensalidadeComDesc) },
        { "de": "{{descontoExt}}", "para": numberToText(desconto) }
      ]
    };

    console.log('Dados do contrato preparados:', contractData);

    // Fazer chamada para API do ZapSign
    const response = await fetch('https://app.zapsign.com.br/api/v1/docs/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer d2d6d453-59f8-4bd9-af61-e30267750c186112b7f1-9e5d-4472-b5dc-dede276ea8ec',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API do ZapSign:', response.status, errorText);
      throw new Error(`Erro na API do ZapSign: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Resposta da API do ZapSign:', result);

    // Extrair o link de assinatura
    const signUrl = result?.signers?.[0]?.sign_url;
    
    if (!signUrl) {
      console.error('Link de assinatura não encontrado na resposta:', result);
      throw new Error('Link de assinatura não encontrado na resposta da API');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      signUrl,
      contractData: result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});