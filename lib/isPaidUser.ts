import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: server only
)

export async function isProUser() {
  const user = await currentUser()

  if (!user) return false

  // 1. Clerk metadata (fast)
  const clerkStatus = user.publicMetadata?.subscriptionStatus

  if (clerkStatus === "active" || clerkStatus === "trialing") {
    return true
  }

  // 2. Supabase fallback (source of truth)
  const { data } = await supabase
    .from("paid_users")
    .select("subscription_status")
    .eq("clerk_user_id", user.id)
    .single()

  return (
    data?.subscription_status === "active" ||
    data?.subscription_status === "trialing"
  )
}
