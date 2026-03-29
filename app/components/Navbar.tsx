"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">
      
      {/* Left */}
      <Link href="/signals" className="font-bold text-xl">
        ⚡ Quant Edge
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {isLoggedIn && (
          <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Pro
          </span>
        )}

        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
          {isLoggedIn ? "Logout" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
