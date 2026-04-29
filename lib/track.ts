export async function track(event: string, metadata?: any) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, metadata }),
    })
  } catch (err) {
    console.error("Tracking error:", err)
  }
}