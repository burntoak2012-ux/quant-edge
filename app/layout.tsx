import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuantEdge",
  description: "Premium football signals and model edge",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-zinc-50 flex flex-col">
          <main className="flex-1">{children}</main>

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-xs font-bold text-white">
                    Q
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">
                    QuantEdge
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                  <Link href="/signals" className="hover:text-zinc-900">
                    Signals
                  </Link>
                  <Link href="/pricing" className="hover:text-zinc-900">
                    Pricing
                  </Link>
                  <Link href="/terms" className="hover:text-zinc-900">
                    Terms
                  </Link>
                  <Link href="/privacy" className="hover:text-zinc-900">
                    Privacy
                  </Link>
                  <Link href="/disclaimer" className="hover:text-zinc-900">
                    Disclaimer
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-zinc-400">
                © {new Date().getFullYear()} QuantEdge. All rights reserved.
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}