import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
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
    console.error("STRIPE ERROR FULL:", err);

    return NextResponse.json(
      { error: err.message || "Stripe failed" },
      { status: 500 }
    );
  }
}




