import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ hasAccess: false, reason: "no-user" })
  }

  const { data, error } = await supabase
    .from("paid_users")
    .select("clerk_user_id, subscription_status")
    .eq("clerk_user_id", userId)

  if (error) {
    console.error("access-status error:", error)
    return NextResponse.json({
      hasAccess: false,
      reason: "db-error",
      error: error.message,
    })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      hasAccess: false,
      reason: "no-row",
      userId,
    })
  }

  return NextResponse.json({
    hasAccess: data[0].subscription_status === "active",
    userId,
    row: data[0],
  })
}