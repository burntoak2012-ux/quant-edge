import Stripe from "stripe"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

function getPaidUsersPath() {
  return path.join(process.cwd(), "python-engine", "data", "paid_users.json")
}

function readPaidUsers(): string[] {
  try {
    const filePath = getPaidUsersPath()

    if (!fs.existsSync(filePath)) {
      return []
    }

    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch (error) {
    console.error("Error reading paid_users.json:", error)
    return []
  }
}

function writePaidUsers(users: string[]) {
  try {
    const filePath = getPaidUsersPath()
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error writing paid_users.json:", error)
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing stripe signature", { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new NextResponse("Missing webhook secret", { status: 500 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkUserId = session.metadata?.clerkUserId

      if (clerkUserId) {
        const paidUsers = readPaidUsers()

        if (!paidUsers.includes(clerkUserId)) {
          paidUsers.push(clerkUserId)
          writePaidUsers(paidUsers)
        }

        console.log("Added paid user:", clerkUserId)
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const clerkUserId = subscription.metadata?.clerkUserId

      if (clerkUserId) {
        const paidUsers = readPaidUsers().filter((id) => id !== clerkUserId)
        writePaidUsers(paidUsers)

        console.log("Removed paid user:", clerkUserId)
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Webhook handler failed:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}
