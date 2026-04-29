import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.redirect("http://localhost:3000/")
  }

  const sessions = await stripe.checkout.sessions.list({
    limit: 1,
  })

  const customer = sessions.data[0]?.customer as string

  if (!customer) {
    return NextResponse.redirect("http://localhost:3000/pricing")
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer,
    return_url: "http://localhost:3000/signals",
  })

  return NextResponse.redirect(portalSession.url)

}
