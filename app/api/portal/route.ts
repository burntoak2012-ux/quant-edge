import { NextResponse } from "next/server"
import Stripe from "stripe"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // get user from DB
  const { data } = await supabase
    .from("paid_users")
    .select("*")
    .eq("clerk_user_id", user.id)
    .single()

  if (!data?.stripe_customer_id) {
    return NextResponse.json({ error: "No customer found" }, { status: 400 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: "http://localhost:3000/signals",
  })

  return NextResponse.json({ url: session.url })
}
