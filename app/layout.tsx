"use client"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "./components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#0B1120] text-white">
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}