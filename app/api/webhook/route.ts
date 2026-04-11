import fs from "fs"
import path from "path"
import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
})

function getPaidUsersPath() {
  return path.join(process.cwd(), "python-engine", "data", "paid_users.json")
}

function readPaidUsers(): string[] {
  try {
    const filePath = getPaidUsersPath()
    const raw = fs.readFileSync(filePath, "utf-8")
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => String(item))
  } catch {
    return []
  }
}

function savePaidUsers(users: string[]) {
  const filePath = getPaidUsersPath()
  const dir = path.dirname(filePath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8")
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkUserId = session.metadata?.clerkUserId

      if (clerkUserId) {
        const users = readPaidUsers()

        if (!users.includes(clerkUserId)) {
          users.push(clerkUserId)
          savePaidUsers(users)
          console.log("Saved paid user:", clerkUserId)
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const clerkUserId = subscription.metadata?.clerkUserId

      if (clerkUserId) {
        const users = readPaidUsers().filter((id) => id !== clerkUserId)
        savePaidUsers(users)
        console.log("Removed paid user:", clerkUserId)
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (err: any) {
    console.error("Webhook handler error:", err.message)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}
