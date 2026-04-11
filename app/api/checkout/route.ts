import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
})

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const origin = new URL(req.url).origin

  try {
    const existingCustomers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1,
    })

    let customerId: string

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        metadata: {
          clerkUserId: userId,
        },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      success_url: `${origin}/signals?success=true`,
      cancel_url: `${origin}/signals`,
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
    })

    if (!session.url) {
      return new NextResponse("No checkout URL returned", { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message)
    return new NextResponse("Error creating checkout session", {
      status: 500,
    })
  }
}
