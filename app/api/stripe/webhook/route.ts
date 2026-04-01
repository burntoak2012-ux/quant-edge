import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "production") {
    console.log("WEBHOOK HIT");
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    console.error("Missing signature");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Signature error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerkUserId;

    if (clerkUserId) {
      const client = await clerkClient();

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: { plan: "pro" },
      });
    } else {
      console.error("No clerkUserId in metadata");
    }
  }

  return NextResponse.json({ received: true });
}