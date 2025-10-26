"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type StatsResponse = {
  totalConversions: number
  pendingConversions: number
}

export function AccountStats() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (status !== "authenticated") return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/user/account-stats?userId=${session?.user?.id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load stats")
        const json = await res.json()
        setStats(json)
      } catch (e: any) {
        setError(e.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [status, session?.user?.id])

  const rows = [
    { label: "Total Conversions", value: stats?.totalConversions ?? 0 },
    { label: "Pending Conversions", value: stats?.pendingConversions ?? 0 },
  ]

  if (status === "loading") {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  if (status !== "authenticated") {
    return (
      <div className="space-y-3">
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground"><Link href="/login" className="text-primary hover:underline">Sign in</Link> to view your stats.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rows.map((stat, idx) => (
        <div
          key={idx}
          onClick={() => router.push('/recharge-history')}
          className="flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
        >
          <div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground">
              ₹{Number(stat.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
