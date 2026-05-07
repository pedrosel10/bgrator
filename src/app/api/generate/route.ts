import { NextResponse } from "next/server";
import OpenAI from "openai";

// Make sure to add OPENAI_API_KEY to your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { name, niche, vibe } = await req.json();

    if (!name || !niche || !vibe) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
       return NextResponse.json({ error: "OPENAI_API_KEY não configurada no servidor." }, { status: 500 });
    }

    // Step 1: Text Generation (Colors, Typography, Logo Prompt)
    const prompt = `Você é um designer de marcas especialista. Crie a base de uma identidade visual para um cliente.
Nome da Marca: ${name}
Nicho/Indústria: ${niche}
Vibe/Personalidade: ${vibe}

Forneça um objeto JSON estritamente com a seguinte estrutura:
{
  "colors": {
    "primary": "Hex code",
    "secondary": "Hex code",
    "accent": "Hex code",
    "background": "Hex code",
    "text": "Hex code"
  },
  "typography": {
    "headingFont": "Nome exato de uma Google Font para títulos",
    "bodyFont": "Nome exato de uma Google Font para textos"
  },
  "logoPrompt": "Um prompt em inglês, altamente detalhado para a IA DALL-E 3 gerar um logo limpo, moderno e minimalista (estilo flat vector) para essa marca. Especifique 'no text, symbol only' para evitar textos distorcidos no logo gerado."
}

Retorne APENAS o JSON válido.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0].message.content;
    if (!responseContent) throw new Error("Falha ao gerar o conteúdo de texto.");

    const brandData = JSON.parse(responseContent);

    // Step 2: Logo Generation
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: brandData.logoPrompt,
      n: 1,
      size: "1024x1024",
    });

    const logoUrl = imageResponse.data?.[0]?.url;

    return NextResponse.json({
      success: true,
      data: {
        ...brandData,
        logoUrl,
      },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Erro interno do servidor." }, { status: 500 });
  }
}
