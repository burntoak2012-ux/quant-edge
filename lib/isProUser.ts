import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

export async function isProUser() {
  const { userId } = await auth()

  console.log("Clerk userId:", userId)

  if (!userId) return false

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from("paid_users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single()

  console.log("DB result:", data)
  console.log("DB error:", error)

  if (error || !data) return false

  return data.subscription_status === "active"
}
