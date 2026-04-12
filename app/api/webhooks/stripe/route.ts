import Stripe from "stripe"
import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing stripe signature", { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    const client = await clerkClient()

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkUserId = session.metadata?.clerkUserId

      if (clerkUserId) {
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            isPro: true,
          },
        })

        console.log("User upgraded to PRO:", clerkUserId)
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const clerkUserId = subscription.metadata?.clerkUserId

      if (clerkUserId) {
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            isPro: false,
          },
        })

        console.log("User downgraded from PRO:", clerkUserId)
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (err: any) {
    console.error("Webhook handler error:", err.message)
    return new NextResponse("Webhook failed", { status: 500 })
  }
}
