import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "python-engine",
      "output",
      "signals.json"
    );

    const jsonData = fs.readFileSync(filePath, "utf-8");
    const signals = JSON.parse(jsonData);

    return NextResponse.json(signals);
  } catch (error) {
    console.error("Error reading signals:", error);

    return NextResponse.json(
      { error: "Failed to load signals" },
      { status: 500 }
    );
  }
}