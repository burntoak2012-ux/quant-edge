import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("paid_users").upsert({
    clerk_user_id: userId,
    subscription_status: "active",
  })

  if (error) {
    console.error("activate-user error:", error)
    return NextResponse.json({ error: "Failed to activate user" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}