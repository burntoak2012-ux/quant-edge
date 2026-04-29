import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from("paid_users")
      .select("stripe_customer_id, status")
      .eq("clerk_user_id", userId)
      .maybeSingle()

    if (error) {
      console.error("Billing lookup error:", error)
      return NextResponse.json(
        { error: "Could not load billing information" },
        { status: 500 }
      )
    }

    if (!data?.stripe_customer_id || data.status !== "active") {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${appUrl}/signals`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Billing portal error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to open billing portal",
      },
      { status: 500 }
    )
  }
}
