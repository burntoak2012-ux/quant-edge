import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { isPaidUser } from "@/lib/isPaidUser"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const paid = await isPaidUser(userId)

    if (!paid) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 })
    }

    const signals = [
      {
        match: "Arsenal vs Chelsea",
        pick: "Over 2.5",
        confidence: 78,
      },
      {
        match: "Madrid vs Sevilla",
        pick: "Home Win",
        confidence: 82,
      },
    ]

    return NextResponse.json({ signals })
  } catch (error) {
    console.error("signals route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
