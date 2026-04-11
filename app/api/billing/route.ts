import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const origin = new URL(req.url).origin

    const customers = await stripe.customers.search({
      query: `metadata['clerkUserId']:'${userId}'`,
      limit: 1,
    })

    const customer = customers.data[0]

    if (!customer) {
      return NextResponse.json(
        { error: "No Stripe customer found for this user" },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Billing portal error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create billing portal session" },
      { status: 500 }
    )
  }
}