import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      console.error("Missing STRIPE_SECRET_KEY")
      return new NextResponse("Stripe not configured", { status: 500 })
    }

    const stripe = new Stripe(secretKey)

    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const origin = new URL(req.url).origin

    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1,
    })

    let customerId: string

    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        metadata: {
          clerkUserId: userId,
        },
      })

      customerId = customer.id
    }

    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      return new NextResponse("Missing STRIPE_PRICE_ID", { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
  {
    price: priceId,
    quantity: 1,
  },
],

      success_url: `${origin}/success`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("FULL CHECKOUT ERROR:", err)
    console.error("MESSAGE:", err?.message)

    return new NextResponse("Error creating checkout session", {
      status: 500,
    })
  }
}