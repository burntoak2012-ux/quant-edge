import { NextResponse } from "next/server"
import { exec } from "child_process"

export async function GET() {
  return new Promise((resolve) => {
    exec("npm run generate:signals", (error, stdout, stderr) => {
      if (error) {
        console.error("Cron error:", error)
        resolve(
          NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          )
        )
        return
      }

      console.log("Cron stdout:", stdout)
      console.error("Cron stderr:", stderr)

      resolve(
        NextResponse.json({
          success: true,
          output: stdout,
        })
      )
    })
  })
}