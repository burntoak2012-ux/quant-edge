import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function getTrialDaysLeft(trialEnd: string | null) {
  if (!trialEnd) return null

  const now = Date.now()
  const end = new Date(trialEnd).getTime()
  const diff = end - now

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({
        signedIn: false,
        hasAccess: false,
        paid: false,
        subscriptionStatus: null,
        trialEnd: null,
        trialDaysLeft: null,
      })
    }

    const { data, error } = await supabase
      .from("paid_users")
      .select("status, subscription_status, trial_end")
      .eq("clerk_user_id", userId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({
        signedIn: true,
        hasAccess: false,
        paid: false,
        subscriptionStatus: null,
        trialEnd: null,
        trialDaysLeft: null,
      })
    }

    const now = Date.now()
    const trialEndMs = data.trial_end ? new Date(data.trial_end).getTime() : null
    const isTrialing = data.subscription_status === "trialing"
    const isTrialValid = isTrialing && trialEndMs !== null && trialEndMs > now
    const isActivePaid = data.status === "active" && data.subscription_status === "active"

    const hasAccess =
      isActivePaid ||
      isTrialValid ||
      (data.status === "active" && !data.subscription_status)

    return NextResponse.json({
      signedIn: true,
      hasAccess,
      paid: hasAccess,
      subscriptionStatus: data.subscription_status ?? null,
      trialEnd: data.trial_end ?? null,
      trialDaysLeft: getTrialDaysLeft(data.trial_end),
    })
  } catch (error) {
    console.error("access-status error:", error)

    return NextResponse.json(
      {
        signedIn: false,
        hasAccess: false,
        paid: false,
        subscriptionStatus: null,
        trialEnd: null,
        trialDaysLeft: null,
      },
      { status: 500 }
    )
  }
}