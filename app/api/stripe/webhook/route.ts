import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
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
    console.error("Webhook error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // 🔥 THIS is the important part
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const clerkUserId = session.metadata?.clerkUserId;

    if (!clerkUserId) {
      console.error("No clerkUserId in metadata");
      return new NextResponse("Missing user", { status: 400 });
    }

    const client = await clerkClient();

    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        plan: "pro",
      },
    });

    console.log("User upgraded to PRO:", clerkUserId);
  }

  return NextResponse.json({ received: true });
}
