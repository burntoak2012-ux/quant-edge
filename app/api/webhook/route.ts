import Stripe from "stripe"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return new NextResponse("Missing stripe-signature header", { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log("✅ Webhook received:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const clerkUserId = session.metadata?.clerkUserId
      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : null
      const stripeSubscriptionId =
        typeof session.subscription === "string" ? session.subscription : null

      if (!clerkUserId) {
        console.log("❌ No clerkUserId found in checkout session metadata")
        return NextResponse.json({ received: true })
      }

      let trialEnd: string | null = null
      let subscriptionStatus: string | null = "active"

      if (stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId
        )

        subscriptionStatus = subscription.status

        if (subscription.trial_end) {
          trialEnd = new Date(subscription.trial_end * 1000).toISOString()
        }
      }

      const { error } = await supabase.from("paid_users").upsert(
        {
          clerk_user_id: clerkUserId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status: "active",
          subscription_status: subscriptionStatus,
          trial_end: trialEnd,
        },
        {
          onConflict: "clerk_user_id",
        }
      )

      if (error) {
        console.error("❌ Supabase upsert error:", error)
      } else {
        console.log("💾 Paid user saved to Supabase:", clerkUserId)
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription

      let clerkUserId = subscription.metadata?.clerkUserId

      if (!clerkUserId) {
        const { data, error } = await supabase
          .from("paid_users")
          .select("clerk_user_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle()

        if (error) {
          console.error("❌ Supabase lookup error:", error)
        } else {
          clerkUserId = data?.clerk_user_id ?? undefined
        }
      }

      if (!clerkUserId) {
        console.log("❌ No clerkUserId found for subscription update")
        return NextResponse.json({ received: true })
      }

      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null

      const status =
        subscription.status === "active" || subscription.status === "trialing"
          ? "active"
          : "cancelled"

      const { error } = await supabase
        .from("paid_users")
        .update({
          status,
          subscription_status: subscription.status,
          trial_end: trialEnd,
        })
        .eq("clerk_user_id", clerkUserId)

      if (error) {
        console.error("❌ Supabase subscription update error:", error)
      } else {
        console.log("🔄 Subscription updated:", clerkUserId, subscription.status)
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription

      let clerkUserId = subscription.metadata?.clerkUserId

      if (!clerkUserId) {
        const { data, error } = await supabase
          .from("paid_users")
          .select("clerk_user_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle()

        if (error) {
          console.error("❌ Supabase lookup error:", error)
        } else {
          clerkUserId = data?.clerk_user_id ?? undefined
        }
      }

      if (!clerkUserId) {
        console.log("❌ No user found for cancelled subscription")
        return NextResponse.json({ received: true })
      }

      const { error } = await supabase
        .from("paid_users")
        .update({
          status: "cancelled",
          subscription_status: "cancelled",
        })
        .eq("clerk_user_id", clerkUserId)

      if (error) {
        console.error("❌ Cancel update error:", error)
      } else {
        console.log("🛑 Subscription cancelled:", clerkUserId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("❌ Webhook error:", error?.message || error)
    return new NextResponse(
      `Webhook Error: ${error?.message || "Unknown error"}`,
      { status: 400 }
    )
  }
}
