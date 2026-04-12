import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      console.error("Missing STRIPE_SECRET_KEY")
      return new NextResponse("Stripe is not configured", { status: 500 })
    }

    const stripe = new Stripe(secretKey as string)

    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const origin = new URL(req.url).origin

    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return new NextResponse("No Stripe customer found", { status: 404 })
    }

    const customerId = customers.data[0].id

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Billing portal error:", err.message)
    return new NextResponse("Failed to create billing portal session", {
      status: 500,
    })
  }
}
