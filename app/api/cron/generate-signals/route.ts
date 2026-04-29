import { NextResponse } from "next/server"
import { exec } from "child_process"

export async function GET(): Promise<Response> {
  return await new Promise<Response>((resolve) => {
    exec("npm run generate:signals", (error, stdout, stderr) => {
      if (error) {
        console.error("Cron error:", error)

        resolve(
          NextResponse.json(
            { success: false, error: error.message, stderr },
            { status: 500 }
          )
        )

        return
      }

      resolve(
        NextResponse.json({
          success: true,
          output: stdout,
          stderr,
        })
      )
    })
  })
}
