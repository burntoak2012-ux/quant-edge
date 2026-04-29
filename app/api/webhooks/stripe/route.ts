import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { clerkClient } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const clerkUserId = session.metadata?.clerk_user_id
    const customerId = session.customer as string

    if (clerkUserId) {
      await supabase.from("paid_users").upsert({
        clerk_user_id: clerkUserId,
        stripe_customer_id: customerId,
        subscription_status: "active",
      })

      await supabase.from("conversion_events").insert({
        event_name: "checkout_completed",
        clerk_user_id: clerkUserId,
        metadata: {
          session_id: session.id,
          customer_id: customerId,
          amount: session.amount_total,
          currency: session.currency,
        },
      })

      const clerk = await clerkClient()

      await clerk.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          subscriptionStatus: "active",
        },
      })
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    const { data } = await supabase
      .from("paid_users")
      .select("clerk_user_id")
      .eq("stripe_customer_id", customerId)
      .single()

    await supabase
      .from("paid_users")
      .update({
        subscription_status: subscription.status,
      })
      .eq("stripe_customer_id", customerId)

    if (data?.clerk_user_id) {
      const clerk = await clerkClient()

      await clerk.users.updateUserMetadata(data.clerk_user_id, {
        publicMetadata: {
          subscriptionStatus: subscription.status,
        },
      })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    const { data } = await supabase
      .from("paid_users")
      .select("clerk_user_id")
      .eq("stripe_customer_id", customerId)
      .single()

    await supabase
      .from("paid_users")
      .update({
        subscription_status: "canceled",
      })
      .eq("stripe_customer_id", customerId)

    if (data?.clerk_user_id) {
      const clerk = await clerkClient()

      await clerk.users.updateUserMetadata(data.clerk_user_id, {
        publicMetadata: {
          subscriptionStatus: "canceled",
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
