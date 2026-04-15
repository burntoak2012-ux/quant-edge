import { supabase } from "@/lib/supabase"

export async function isPaidUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("paid_users")
    .select("clerk_user_id, status")
    .eq("clerk_user_id", userId)
    .eq("status", "active")
    .maybeSingle()

  if (error) {
    console.error("isPaidUser error:", error)
    return false
  }

  return !!data
}
