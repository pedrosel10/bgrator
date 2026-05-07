import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any, // Using latest stable supported in generic types
});

export async function POST(req: Request) {
  try {
    const { name, niche, audience, vibe, email } = await req.json();

    if (!name || !niche || !audience || !vibe || !email) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe não configurado no servidor." }, { status: 500 });
    }

    const host = req.headers.get("origin") || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Only card for now
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Geração de Identidade Visual IA",
              description: `Briefing: ${name} - ${niche}`,
            },
            unit_amount: 100, // R$ 1,00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${host}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/`,
      // We store the briefing data in metadata to retrieve it upon successful payment
      metadata: {
        brandName: name,
        brandNiche: niche,
        brandAudience: audience,
        brandVibe: vibe,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Erro ao criar checkout." }, { status: 500 });
  }
}
