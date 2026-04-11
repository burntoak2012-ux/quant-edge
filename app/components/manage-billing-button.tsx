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
      className="rounded-full bg-black px-4 py-2 font-medium text-white hover:opacity-90"
    >
      Manage Billing
    </button>
  )
}
