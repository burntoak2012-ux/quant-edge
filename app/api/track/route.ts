import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const user = await currentUser()
  const body = await req.json()

  const { event, metadata } = body

  await supabase.from("conversion_events").insert({
    event_name: event,
    clerk_user_id: user?.id ?? null,
    metadata: metadata ?? {},
  })

  return NextResponse.json({ success: true })
}
