"use client"
import { useRouter } from "next/navigation"

export function BindUPIButton() {
  const router = useRouter()
  return (
    <div className="flex gap-4">
    <button onClick={() => router.push("/upi")} className="w-1/2 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity">
      Bind UPI Now
    </button>
    <button onClick={() => router.push("/deposit")} className="w-1/2 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity">
      Deposit Now
    </button>
    </div>
  )
}
