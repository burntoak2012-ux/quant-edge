"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();

  const isProUser =
    isLoaded &&
    isSignedIn &&
    user?.publicMetadata?.plan === "pro";

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-semibold text-lg">
        Quant Edge
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/pricing" className="text-sm">
          Pricing
        </Link>

        {isProUser && (
          <Link href="/signals" className="text-sm font-medium">
            Live Signals
          </Link>
        )}

        {isSignedIn ? <UserButton /> : <SignInButton />}
      </div>
    </nav>
  );
}

