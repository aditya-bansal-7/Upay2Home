"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function CurrencyRatios() {
  const [loading, setLoading] = useState(true)
  const [rates, setRates] = useState<any>(null)
  const [hasProfiles, setHasProfiles] = useState(false)

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/rates")
        const json = await res.json()
        setRates(json.rates)
        setHasProfiles(json.hasPayoutProfiles)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
  }, [])

  if (loading) {
    return (
      <div className="bg-muted rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    )
  }

  if (!rates) return null

  return (
    <div className="bg-muted rounded-xl p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground text-sm mb-2">USDT Ratio</p>
          <p className="text-lg font-bold text-foreground">
            1 USDT ≈ {Number(rates.usdtToInrRate).toFixed(2)} INR
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Bonus ratio: {Number(rates.bonusRatio).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm mb-2">INR Bonus Ratio</p>
          <p className="text-2xl font-bold text-foreground">
            {Number(rates.bonusRatioInr).toFixed(1)}%
          </p>
        </div>
      </div>
      {!hasProfiles && (
        <p className="text-muted-foreground text-sm">
          You're not bound to UPI!
        </p>
      )}
    </div>
  )
}
