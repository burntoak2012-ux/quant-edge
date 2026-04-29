import { NextResponse } from "next/server"
import Stripe from "stripe"
import { currentUser } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  const user = await currentUser()

  if (!user) {
    return NextResponse.redirect("http://localhost:3000")
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/signals",
    cancel_url: "http://localhost:3000/pricing",

    // 🔥 REQUIRED FOR WEBHOOK TO WORK
    metadata: {
      clerk_user_id: user.id,
    },
  })

  return NextResponse.redirect(session.url!)
}
