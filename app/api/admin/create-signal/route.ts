import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  const { match, pick, market, odds, confidence } = body;

  if (!match || !pick || !market) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("signals").insert([
    {
      match,
      pick,
      market,
      odds,
      confidence,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true });
}
