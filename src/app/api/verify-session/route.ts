import { NextResponse } from "next/server";
import Stripe from "stripe";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  let sessionIdForCleanup = "";
  try {
    const { session_id, test_data } = await req.json();
    if (session_id) sessionIdForCleanup = session_id;

    if (!session_id) {
      return NextResponse.json({ error: "Session ID ausente." }, { status: 400 });
    }

    let briefingData: any = {};
    let brandName = "";

    if (session_id === "TEST_MODE" && test_data) {
      briefingData = test_data;
      brandName = test_data.companyName;
    } else {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "Chaves de API não configuradas." }, { status: 500 });
      }

      // 1. Verify Stripe Session
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid") {
        return NextResponse.json({ error: "Pagamento ainda não aprovado. Aguarde mais uns instantes." }, { status: 400 });
      }

      // 1.5 Security Locks (Prevent Double Generation)
      if (session.metadata?.generated === "true") {
        return NextResponse.json({ error: "ALREADY_GENERATED" }, { status: 400 });
      }
      if (session.metadata?.processing === "true") {
        return NextResponse.json({ error: "PROCESSING" }, { status: 400 });
      }

      // Lock session as processing
      await stripe.checkout.sessions.update(session_id, {
        metadata: { processing: "true" }
      });

      // 2. Extract Metadata (Briefing)
      const metadata = session.metadata || {};
      briefingData = metadata;
      brandName = metadata.companyName || metadata.brandName || "Marca Desconhecida";
    }

    if (!brandName) {
      return NextResponse.json({ error: "Dados do briefing ausentes no pagamento." }, { status: 400 });
    }

    // 3. Generate Advanced Identity with OpenAI
    const prompt = `Você é um Diretor de Arte e Estrategista de Marca sênior de nível mundial.
Abaixo está o briefing COMPLETO preenchido pelo cliente. Leia nas entrelinhas, cruze as informações e tire conclusões profundas sobre como essa marca deve se posicionar, falar e se vestir visualmente.

--- DADOS DO BRIEFING ---
${JSON.stringify(briefingData, null, 2)}
-------------------------

**SUA TAREFA:**
Desenvolva uma identidade visual e estratégica de ponta.

**PASSO MENTAL OBRIGATÓRIO (ANTES DE GERAR):**
1. Acesse sua base de conhecimento profunda sobre tendências de design do Pinterest, Behance e Dribbble.
2. Lembre-se de 3 marcas reais ou estéticas de sucesso no mesmo setor/nicho desta empresa, que possuam a exata vibe que o cliente deseja (baseado no briefing).
3. Use essas 3 referências de alto padrão como fundação estética e estratégica para todas as decisões abaixo. Não mencione as marcas na saída JSON, apenas absorva a qualidade e o estilo delas.

**DIRETRIZES VISUAIS:**

1. **Logo**: O prompt gerado para a IA de Imagem deve exigir um ÚNICO logotipo, perfeitamente centralizado. Ele DEVE conter o nome da empresa ("${brandName}") escrito claramente, junto com o símbolo. **OBRIGATÓRIO: O prompt da imagem deve ser PROFUNDO e baseado na sua análise estratégica. Você deve instruir a IA de imagem detalhadamente sobre o estilo dos traços, o formato do ícone, o "peso" da fonte e o estilo visual geral.** Forneça as 3 cores APENAS COM O NOME DESCRITIVO EM INGLÊS (Ex: 'Navy Blue', 'Vibrant Yellow'). É EXPRESSAMENTE PROIBIDO INCLUIR CÓDIGOS HEX (Ex: #000000) NO PROMPT DA IMAGEM. É EXPRESSAMENTE PROIBIDO gerar múltiplas variações. Especifique o prompt em inglês, seguindo esta estrutura de exemplo: "A single, perfectly centered logo design for the brand '${brandName}'. Strategic vibe: [ESTILO GERAL E ARQUÉTIPO]. The symbol/icon must feature [DESCRIÇÃO PROFUNDA DOS TRAÇOS E DO ÍCONE, ex: sharp geometric lines, organic flow, minimalist architecture]. The typography should feel [ESTILO E PESO DA FONTE, ex: heavy industrial sans-serif, elegant high-contrast serif]. The image must contain ONLY ONE single logo in the center. Clean, flat vector style on a solid background. Incorporate STRICTLY the exact brand colors: [NOMES EM INGLÊS DAS CORES AQUI]. Absolutely NO HEX CODES are allowed. IMPORTANT: DO NOT write the color names or hex codes as text in the image. Only write the brand name. Do not include mockups, 3D effects, shadows, or multiple variations on the same page."
2. **Paleta de Cores**: Limite a paleta a EXATAMENTE 3 CORES (Primária, Secundária/Base e Acento). Não utilize cores extras. Crie contraste alto para digital. Retorne os HEX.
3. **Tipografia**: Combine APENAS 2 fontes. OBRIGATÓRIO: As duas fontes escolhidas devem, INCONDICIONALMENTE, ser fontes reais e existentes na biblioteca oficial do Google Fonts. Crie hierarquia forte. Ex: Uma Serif elegante para título + Sans legível para texto, ou uma Sans geométrica forte para título + Sans humanista para texto.

**DIRETRIZES DE TOM DE VOZ E REDAÇÃO (CRÍTICO):**
Você está redigindo o manual de uma marca de alto padrão. O texto deve ser **poético, imponente, refinado e profundo** (ex: "Fazer o tempo parar, por um instante..."). Evite textos genéricos e clichês de marketing corporativo. As frases devem ser curtas, de impacto, evocando afeto, excelência e pausa.

**SAÍDA OBRIGATÓRIA (ESTRITAMENTE JSON NOS MOLDES ABAIXO):**
{
  "analiseEstrategica": "Em 1 parágrafo profundo, explique qual foi a sua linha de raciocínio lógico ao cruzar as respostas do formulário para chegar nessa identidade visual.",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX"
  },
  "typography": {
    "headingFont": "Nome exato de uma Google Font elegante com serifa para títulos",
    "bodyFont": "Nome exato de uma Google Font sans-serif minimalista para textos"
  },
  "logoPrompt": "Um prompt em inglês, altamente detalhado para IA de geração de imagem criar um logo limpo e moderno (estilo flat vector) para essa marca. Especifique 'no text, symbol only'. IMPORTANTE: O prompt DEVE instruir explicitamente a IA sobre as cores usando APENAS Nomes Descritivos (Ex: 'Dark Charcoal background with a Vibrant Crimson symbol'). NUNCA USE CÓDIGOS HEX (como #FFFFFF). O fundo NUNCA deve ser branco puro.",
  "branding": {
    "estrategia": {
      "publico": "Resumo refinado, poético e preciso do público-alvo",
      "promessa": "A promessa silenciosa e profunda da marca (ex: O que ela entrega de fato)",
      "posicionamento": "Declaração de posicionamento forte e imponente"
    },
    "core": {
      "sobre": "1 parágrafo descrevendo a empresa de forma elegante e poética",
      "proposito": "Frase de propósito (O porquê profundo, o grande motivo de existir)",
      "valores": [
        { "titulo": "Valor Um.", "descricao": "Descrição detalhada, poética e assertiva sobre este valor." },
        { "titulo": "Valor Dois.", "descricao": "Descrição detalhada, poética e assertiva sobre este valor." },
        { "titulo": "Valor Três.", "descricao": "Descrição detalhada, poética e assertiva sobre este valor." }
      ],
      "visao": "Onde querem chegar, descrito como um estado de espírito ou visão de mundo"
    },
    "personalidade": {
      "arquetipo": "Nome do Arquétipo principal (ex: O Criador, O Mago)",
      "voz": "Como a marca fala (ex: Direta, Ousada, Serena)",
      "tom": "O sentimento da fala (ex: Acolhedora mas com firmeza)"
    },
    "narrativa": {
      "bigIdea": "O conceito central em uma única frase de impacto",
      "bio": "Bio curta para Instagram/Social",
      "tagline": "Slogan curto, elegante e memorável",
      "manifesto": "Um manifesto inspirador e poético da marca, de 4 a 6 frases curtas, que evoque emoção e conexão."
    },
    "expressao": {
      "dosAndDonts": {
        "dos": ["Faça X", "Faça Y"],
        "donts": ["Nunca faça Z", "Evite W"]
      },
      "keywords": ["Palavra 1", "Palavra 2", "Palavra 3", "Palavra 4"],
      "verbos": ["Ação 1", "Ação 2"]
    }
  }
}

Retorne APENAS o JSON válido, sem formatações Markdown adicionais ou explicações.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0].message.content;
    if (!responseContent) throw new Error("Falha ao gerar texto.");

    const brandData = JSON.parse(responseContent);

    console.log("\n\n=== ANÁLISE ESTRATÉGICA DO GPT-4o ===");
    console.log(brandData.analiseEstrategica);
    console.log("=====================================\n");

    console.log("=== RESULTADO DO GPT-4o ===");
    console.log("Paleta de Cores gerada:", brandData.colors);
    console.log("Comando enviado para o Imagen 4:\n", brandData.logoPrompt);
    console.log("===========================\n\n");

    // 4. Generate Logo with Gemini (Nano Banana Pro / Imagen 4)
    const imageResponse = await gemini.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: brandData.logoPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png"
      }
    });

    const base64Image = imageResponse.generatedImages?.[0]?.image?.imageBytes;
    const logoUrl = base64Image ? `data:image/png;base64,${base64Image}` : "";

    // 5. Analyse Logo Quality with GPT-4o Vision & Calculate Cost
    console.log("Analisando qualidade da imagem gerada...");
    const visionCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analise esta logo gerada por IA. Ela parece profissional? Há erros grotescos de geração (textos bizarros, deformações graves) ou símbolos inapropriados? Responda em 1 ou 2 frases curtas." },
            { type: "image_url", image_url: { url: logoUrl, detail: "low" } } // detail: low para gastar menos créditos
          ]
        }
      ],
      max_tokens: 100
    });

    const logoAnalysis = visionCompletion.choices[0].message.content;

    // Cost Calculation (Estimates based on OpenAI and Google Pricing)
    const textTokensIn = chatCompletion.usage?.prompt_tokens || 0;
    const textTokensOut = chatCompletion.usage?.completion_tokens || 0;
    const textCost = (textTokensIn / 1000000) * 5.00 + (textTokensOut / 1000000) * 15.00;

    const visionTokensIn = visionCompletion.usage?.prompt_tokens || 0;
    const visionTokensOut = visionCompletion.usage?.completion_tokens || 0;
    const visionCost = (visionTokensIn / 1000000) * 5.00 + (visionTokensOut / 1000000) * 15.00;

    const imageCost = 0.03; // Imagen 4 average cost per image

    const totalCost = textCost + visionCost + imageCost;

    console.log("\n\n=== ANÁLISE DE QUALIDADE (GPT-4o Vision) ===");
    console.log(logoAnalysis);
    console.log("\n=== ESTIMATIVA DE CUSTO DA GERAÇÃO ===");
    console.log(`Estratégia (GPT-4o): $${textCost.toFixed(4)}`);
    console.log(`Logo (Imagen 4): $${imageCost.toFixed(4)}`);
    console.log(`Auditoria (Vision): $${visionCost.toFixed(4)}`);
    console.log(`CUSTO TOTAL: $${totalCost.toFixed(4)} (aprox. R$ ${(totalCost * 5.5).toFixed(2)})`);
    console.log("=======================================\n\n");

    if (session_id !== "TEST_MODE") {
      // Remove processing lock and set generated lock
      await stripe.checkout.sessions.update(session_id, {
        metadata: { processing: "", generated: "true" }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...brandData,
        logoUrl,
      },
    });

  } catch (error: any) {
    console.error("Verify Session Error:", error);

    // Attempt to clear processing lock if a failure occurs
    if (sessionIdForCleanup && sessionIdForCleanup !== "TEST_MODE") {
      try {
        await stripe.checkout.sessions.update(sessionIdForCleanup, {
          metadata: { processing: "" }
        });
      } catch (cleanupError) {
        console.error("Failed to clear processing lock:", cleanupError);
      }
    }

    return NextResponse.json({ error: error.message || "Erro interno do servidor." }, { status: 500 });
  }
}
