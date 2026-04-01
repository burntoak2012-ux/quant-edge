import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "No customer ID" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get("origin")}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Portal error:", err);
    return NextResponse.json(
      { error: err.message || "Portal failed" },
      { status: 500 }
    );
  }
}

