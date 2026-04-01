"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  const plan = (user?.publicMetadata as { plan?: string })?.plan;

  return (
    <div className="w-full border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">⚡ Quant Edge</h1>

      <div className="flex items-center gap-4">
        {plan === "pro" && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
            Pro
          </span>
        )}

        {isSignedIn ? (
  <UserButton />
) : (
  <SignInButton />
)}
      </div>
    </div>
  );
}

