"use client"
import { useRouter } from "next/navigation"

export function BindUPIButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.push("/upi")} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity">
      Bind UPI Now
    </button>
  )
}
