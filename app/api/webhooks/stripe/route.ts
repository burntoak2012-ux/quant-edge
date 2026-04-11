import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import fs from "fs"
import path from "path"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// 📁 path to paid users file
const dataPath = path.join(
  process.cwd(),
  "python-engine",
  "data",
  "paid_users.json"
)

// ✅ helper: read users
function readPaidUsers(): string[] {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// ✅ helper: save users
function savePaidUsers(users: string[]) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2))
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    )
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ✅ HANDLE PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const clerkUserId = session.metadata?.clerkUserId

    console.log("💰 PAYMENT SUCCESS:", clerkUserId)

    if (clerkUserId) {
      const users = readPaidUsers()

      if (!users.includes(clerkUserId)) {
        users.push(clerkUserId)
        savePaidUsers(users)
        console.log("✅ User saved:", clerkUserId)
      } else {
        console.log("ℹ️ User already exists")
      }
    }
  }

  return NextResponse.json({ received: true })
}
