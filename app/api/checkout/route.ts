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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/signals?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        clerkUserId,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("🔥 STRIPE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Stripe failed" },
      { status: 500 }
    );
  }
}






