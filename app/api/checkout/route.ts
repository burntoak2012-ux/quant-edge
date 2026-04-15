import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  return NextResponse.json({ ok: true, route: "checkout" })
}

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const priceId = process.env.STRIPE_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID" },
        { status: 500 }
      )
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          clerkUserId: userId,
        },
      },
      metadata: {
        clerkUserId: userId,
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Checkout failed",
      },
      { status: 500 }
    )
  }
}
