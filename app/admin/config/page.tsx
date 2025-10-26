"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { QrCode } from "lucide-react"

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<any>(null)

  // local form state
  const [usdtToInrRate, setUsdtToInrRate] = useState<string>("")
  const [depositFeeBps, setDepositFeeBps] = useState<number>(0)
  const [withdrawFeeBps, setWithdrawFeeBps] = useState<number>(0)
  const [minDepositUSDT, setMinDepositUSDT] = useState<string>("0")
  const [minWithdrawINR, setMinWithdrawINR] = useState<string>("0")
  const [allowDeposits, setAllowDeposits] = useState<boolean>(true)
  const [allowWithdrawals, setAllowWithdrawals] = useState<boolean>(true)
  const [notes, setNotes] = useState<string>("")
  const [bonusRatio, setBonusRatio] = useState<number>(0)
  const [bonusRatioInr, setBonusRatioInr] = useState<number>(0)
  const [depositAddress, setDepositAddress] = useState<string>("")
  const [qrValue, setQrValue] = useState<string>("")

  useEffect(() => {
    let mounted = true
    async function fetchConfig() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/config")
        if (!res.ok) throw new Error("Failed to load config")
        const json = await res.json()
        if (!mounted) return
        const cfg = json.config
        setConfig(cfg)
        setUsdtToInrRate(cfg?.usdtToInrRate ? String(cfg.usdtToInrRate) : "0")
        setDepositFeeBps(cfg?.depositFeeBps ?? 0)
        setWithdrawFeeBps(cfg?.withdrawFeeBps ?? 0)
        setMinDepositUSDT(cfg?.minDepositUSDT ? String(cfg.minDepositUSDT) : "0")
        setMinWithdrawINR(cfg?.minWithdrawINR ? String(cfg.minWithdrawINR) : "0")
        setAllowDeposits(cfg?.allowDeposits ?? true)
        setAllowWithdrawals(cfg?.allowWithdrawals ?? true)
        setNotes(cfg?.notes ?? "")
        setBonusRatio(cfg?.bonusRatio ?? 0)
        setBonusRatioInr(cfg?.bonusRatioInr ?? 0)
        setDepositAddress(cfg?.depositAddress ?? "")
        setQrValue(cfg?.qrCode ?? "")
      } catch (err: any) {
        setError(err?.message ?? "Failed to load")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchConfig()
    return () => { mounted = false }
  }, [])

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        usdtToInrRate: usdtToInrRate,
        depositFeeBps,
        withdrawFeeBps,
        minDepositUSDT,
        minWithdrawINR,
        allowDeposits,
        allowWithdrawals,
        notes,
        bonusRatio,
        bonusRatioInr,
        depositAddress,
        qrCode: qrValue,
      }
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save")
      const json = await res.json()
      setConfig(json.config)
    } catch (err: any) {
      setError(err?.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Config</h1>
        <p className="text-sm md:text-base text-muted-foreground">Platform configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Rates & fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limits & toggles</CardTitle>
            <CardDescription>Min amounts and enable/disable features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Config</h1>
        <p className="text-sm md:text-base text-muted-foreground">Platform configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Rates & fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="block text-sm">USDT → INR Rate</label>
              <input value={usdtToInrRate} onChange={(e) => setUsdtToInrRate(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Deposit Fee (bps)</label>
                  <input type="number" value={depositFeeBps} onChange={(e) => setDepositFeeBps(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded" />
                </div>
                <div>
                  <label className="block text-sm">Withdraw Fee (bps)</label>
                  <input type="number" value={withdrawFeeBps} onChange={(e) => setWithdrawFeeBps(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limits & toggles</CardTitle>
            <CardDescription>Min amounts and toggles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm">Min Deposit (USDT)</label>
                <input value={minDepositUSDT} onChange={(e) => setMinDepositUSDT(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
              </div>
              <div>
                <label className="block text-sm">Min Withdraw (INR)</label>
                <input value={minWithdrawINR} onChange={(e) => setMinWithdrawINR(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
              </div>

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={allowDeposits} onChange={(e) => setAllowDeposits(e.target.checked)} />
                  <span>Allow Deposits</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={allowWithdrawals} onChange={(e) => setAllowWithdrawals(e.target.checked)} />
                  <span>Allow Withdrawals</span>
                </label>
              </div>

              <div>
                <label className="block text-sm">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={save} disabled={saving} className="px-4 py-2 bg-foreground text-background rounded">
                  {saving ? "Saving..." : "Save"}
                </button>
                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Currency Ratios</CardTitle>
            <CardDescription>Ratio </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Bonus Ratio</label>
                  <input type="number" value={bonusRatio} onChange={(e) => setBonusRatio(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded" />
                </div>
                <div>
                  <label className="block text-sm">Bonus Ratio (INR)</label>
                  <input type="number" value={bonusRatioInr} onChange={(e) => setBonusRatioInr(Number(e.target.value))} className="w-full px-3 py-2 border border-border rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>  
          <CardHeader>
            <CardTitle><div className="flex items-center gap-2 ">
                  <QrCode size={20} />Deposit Address
                </div></CardTitle>
            <CardDescription>Scan QR code to deposit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                
                <div className="flex-1">
                  <label className="block text-sm">Deposit Address</label>
                  <input type="text" value={depositAddress} onChange={(e) => setDepositAddress(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm">QR Code </label>
                  <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="w-full px-3 py-2 border border-border rounded" />
                </div>
              </div>
            </div>
        
          </CardContent>

        </Card>
      </div>
    </div>
  )
}
