"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ChevronLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"

type TxStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED"
type TxType = "CONVERT" | "WITHDRAW"

interface Tx {
  id: string
  type: TxType
  inrAmount: string
  status: TxStatus
  createdAt: string
}

export default function RechargeHistoryPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<{ nextCursor?: string | null; prevCursor?: string | null; totalCount?: number }>({})
  const [totals, setTotals] = useState<{ totalProcessing: number; totalCompleted: number }>({ totalProcessing: 0, totalCompleted: 0 })

  const pageSize = useMemo(() => {
    const p = Number(searchParams.get("pageSize") || 10)
    return p > 0 && p <= 100 ? p : 10
  }, [searchParams])

  const type = (searchParams.get("type") as TxType) || ""
  const stat = (searchParams.get("status") as TxStatus) || ""
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const cursor = searchParams.get("cursor") || ""
  const direction = searchParams.get("dir") || "forward"

  useEffect(() => {
    async function fetchTxs() {
      if (status !== "authenticated") return
      setLoading(true)
      setError(null)
      try {
        const url = new URL("/api/user/inr-transactions", window.location.origin)
        url.searchParams.set("userId", session?.user?.id ?? "")
        url.searchParams.set("pageSize", String(pageSize))
        if (type) url.searchParams.set("type", type)
        if (stat) url.searchParams.set("status", stat)
        if (from) url.searchParams.set("from", from)
        if (to) url.searchParams.set("to", to)
        if (cursor) {
          url.searchParams.set("cursor", cursor)
          url.searchParams.set("dir", direction)
        }
        const res = await fetch(url.toString(), { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch transactions")
        const json = await res.json()
        setTransactions(json.transactions || [])
        setPageInfo({ nextCursor: json.nextCursor, prevCursor: json.prevCursor, totalCount: json.totalCount })
        setTotals({ totalProcessing: Number(json.totalProcessing || 0), totalCompleted: Number(json.totalCompleted || 0) })
      } catch (err: any) {
        setError(err.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    fetchTxs()
  }, [status, session?.user?.id, pageSize, type, stat, from, to, cursor, direction])

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "PENDING":
      case "PROCESSING":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "FAILED":
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const updateParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) params.delete(key)
    else params.set(key, value)
    // reset cursor when changing filters
    if (["type", "status", "from", "to", "pageSize"].includes(key)) {
      params.delete("cursor")
      params.delete("dir")
    }
    router.replace(`?${params.toString()}`)
  }

  const onNext = () => {
    if (!pageInfo.nextCursor) return
    updateParam("cursor", pageInfo.nextCursor)
    updateParam("dir", "forward")
  }

  const onPrev = () => {
    if (!pageInfo.prevCursor) return
    updateParam("cursor", pageInfo.prevCursor)
    updateParam("dir", "backward")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  const notAuthenticated = status !== "authenticated"

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/me" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Recharge History</h1>
        </div>

        {/* Totals */}
        {!notAuthenticated && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Total Processing</p>
              <p className="text-xl font-bold text-foreground">₹{totals.totalProcessing.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Total Completed</p>
              <p className="text-xl font-bold text-foreground">₹{totals.totalCompleted.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {/* {!notAuthenticated && (
          <div className="bg-card border border-border rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <select value={type} onChange={(e) => updateParam("type", e.target.value || null)} className="px-2 py-2 bg-background border border-border rounded">
                <option value="">All Types</option>
                <option value="CONVERT">Convert</option>
                <option value="WITHDRAW">Withdraw</option>
              </select>
              <select value={stat} onChange={(e) => updateParam("status", e.target.value || null)} className="px-2 py-2 bg-background border border-border rounded">
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <input type="date" value={from} onChange={(e) => updateParam("from", e.target.value || null)} className="px-2 py-2 bg-background border border-border rounded" />
              <input type="date" value={to} onChange={(e) => updateParam("to", e.target.value || null)} className="px-2 py-2 bg-background border border-border rounded" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={pageSize}
                onChange={(e) => updateParam("pageSize", String(Math.min(100, Math.max(1, Number(e.target.value) || 10))))}
                className="w-24 px-2 py-2 bg-background border border-border rounded"
              />
              <button onClick={() => { updateParam("cursor", null); updateParam("dir", null); }} className="px-3 py-2 text-sm bg-muted rounded">
                Reset
              </button>
            </div>
          </div>
        )} */}

        {/* Auth gate */}
        {notAuthenticated && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">Please sign in to view your transactions.</p>
            <div className="flex justify-center gap-3">
              <Link href="/login" className="px-4 py-2 bg-foreground text-background rounded-lg">Sign in</Link>
              <Link href="/register" className="px-4 py-2 bg-muted text-foreground rounded-lg">Register</Link>
            </div>
          </div>
        )}

        {/* Loading/Error */}
        {status === "authenticated" && (loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <>
            {/* List */}
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No transactions found.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(tx.status)}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{tx.type === "CONVERT" ? "USDT Convert" : "INR Withdraw"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{Number(tx.inrAmount ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground capitalize">{tx.status.toLowerCase()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <button onClick={onPrev} disabled={!pageInfo.prevCursor} className="px-3 py-2 rounded bg-muted disabled:opacity-50">
                Previous
              </button>
              <div className="text-sm text-muted-foreground">
                {pageInfo.totalCount ? `${pageInfo.totalCount} total` : ""}
              </div>
              <button onClick={onNext} disabled={!pageInfo.nextCursor} className="px-3 py-2 rounded bg-muted disabled:opacity-50">
                Next
              </button>
            </div>
          </>
        ))}
      </main>
      <BottomNav />
    </div>
  )
}
