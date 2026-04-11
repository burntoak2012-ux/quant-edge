"use client"

export default function ManageBillingButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to open billing portal")
      }
    } catch {
      alert("Failed to open billing portal")
    }
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-50"
    >
      Manage Billing
    </button>
  )
}