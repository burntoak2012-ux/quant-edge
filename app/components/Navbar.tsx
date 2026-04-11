import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            Q
          </span>
          QuantEdge
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-black">
            Pricing
          </Link>

          {userId ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-black">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


