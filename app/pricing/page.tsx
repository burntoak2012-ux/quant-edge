import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <Link href="/signals" className="text-blue-600 hover:underline">
            ← Back to Signals
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose your plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get daily football value bets, fair odds, confidence ratings, and
            detailed match breakdowns in one place.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-14">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Free</h2>
            <p className="text-gray-500 mb-6">For casual users</p>

            <div className="text-4xl font-bold mb-6">£0</div>

            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li>✅ 1 top value bet per day</li>
              <li>✅ Limited preview of signals</li>
              <li>✅ Basic match pages</li>
              <li>❌ No full signal list</li>
              <li>❌ No premium match insights</li>
              <li>❌ No full edge breakdown access</li>
            </ul>

            <button className="w-full rounded-xl border border-gray-300 py-3">
              Current Plan
            </button>
          </div>

          <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-md scale-[1.02]">
            <div className="inline-block rounded-full bg-black text-white text-xs px-3 py-1 mb-4">
              MOST POPULAR
            </div>

            <h2 className="text-2xl font-semibold mb-2">Pro</h2>
            <p className="text-gray-500 mb-6">For serious football bettors</p>

            <div className="text-4xl font-bold mb-6">
              £19<span className="text-base text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li>✅ All daily value bets</li>
              <li>✅ Full signal list</li>
              <li>✅ Full fair odds vs market odds comparison</li>
              <li>✅ Confidence ratings</li>
              <li>✅ Match detail pages</li>
              <li>✅ “Why this is a good bet” breakdown</li>
              <li>✅ “Where the market is wrong” explanation</li>
            </ul>

            <Link
  href="/checkout"
  className="block w-full text-center rounded-xl bg-black text-white py-3"
>
  Upgrade to Pro
</Link>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Cancel anytime
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm mb-14">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Why users upgrade
          </h2>

          <div className="grid gap-6 md:grid-cols-3 text-sm text-gray-700">
            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold mb-2">Find value faster</h3>
              <p>
                Stop scanning dozens of markets manually. Quant Edge highlights
                where bookmaker odds may be wrong.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold mb-2">Understand the edge</h3>
              <p>
                Go beyond raw picks with probabilities, ratings, confidence, and
                market comparison.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold mb-2">Use it every day</h3>
              <p>
                Check the strongest football value bets in one place before the
                market moves.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">FAQ</h2>

          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-1">Is this a betting app?</h3>
              <p>
                No. Quant Edge is a football stats and value-bet intelligence
                platform. It helps users analyse odds and make better-informed
                decisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Can I cancel anytime?</h3>
              <p>
                Yes. When subscriptions are live, Pro users will be able to
                cancel anytime.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">What makes Pro different?</h3>
              <p>
                Pro unlocks the full signal list, premium match breakdowns,
                confidence ratings, and full model vs market comparison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
