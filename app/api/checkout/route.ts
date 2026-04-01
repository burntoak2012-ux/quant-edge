import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { clerkUserId } = await req.json();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${origin}/signals?success=true`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        clerkUserId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("STRIPE ERROR FULL:", err);

    return NextResponse.json(
      { error: err.message || "Stripe failed" },
      { status: 500 }
    );
  }
}





