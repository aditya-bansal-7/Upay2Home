"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Copy } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // New: transactions state
  const [txs, setTxs] = useState<any[]>([])
  const [txsLoading, setTxsLoading] = useState(true)
  const [txsPage, setTxsPage] = useState(1)
  const [txsTotalPages, setTxsTotalPages] = useState(1)
  const [txsPageSize] = useState(5)

  // New: activity aggregation state
  const [activityData, setActivityData] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    async function fetchUser() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/users/${id}`)
        if (!res.ok) throw new Error("Failed to load user")
        const json = await res.json()
        if (!mounted) return
        setUser(json.user)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchUser()
    return () => { mounted = false }
  }, [id])

  // Fetch transactions
  useEffect(() => {
    if (!id) return
    let mounted = true
    async function fetchTxs() {
      setTxsLoading(true)
      try {
        const params = new URLSearchParams({ page: String(txsPage), pageSize: String(txsPageSize) })
        const res = await fetch(`/api/admin/users/${id}/transactions?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch transactions")
        const json = await res.json()
        if (!mounted) return
        setTxs(json.items || [])
        setTxsTotalPages(json.totalPages || 1)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setTxsLoading(false)
      }
    }
    fetchTxs()
    return () => { mounted = false }
  }, [id, txsPage, txsPageSize])

  // New: fetch recent transactions (larger page) and aggregate by day for activity chart
  useEffect(() => {
    if (!id) return
    let mounted = true
    async function fetchActivity() {
      setActivityLoading(true)
      try {
        const params = new URLSearchParams({ page: "1", pageSize: "100" })
        const res = await fetch(`/api/admin/users/${id}/transactions?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch activity transactions")
        const json = await res.json()
        if (!mounted) return
        const items: any[] = json.items || []

        // Aggregate by date (YYYY-MM-DD), separate deposits (CONVERT) and withdrawals (WITHDRAW)
        const map = new Map<string, { date: string; deposits: number; withdrawals: number }>()
        items.forEach((tx: any) => {
          const dateKey = new Date(tx.createdAt).toISOString().slice(0, 10)
          if (!map.has(dateKey)) map.set(dateKey, { date: dateKey, deposits: 0, withdrawals: 0 })
          const entry = map.get(dateKey)!
          const amount = Number(tx.inrAmount ?? 0)
          if (tx.type === "CONVERT") entry.deposits += amount
          else if (tx.type === "WITHDRAW") entry.withdrawals += amount
        })

        // Turn into sorted array (ascending by date) and keep last 10 days
        const arr = Array.from(map.values())
          .sort((a, b) => a.date.localeCompare(b.date))
        const last = arr.slice(-10).map((d) => ({
          date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          deposits: d.deposits,
          withdrawals: d.withdrawals,
        }))

        setActivityData(last)
      } catch (err) {
        console.error(err)
        setActivityData([])
      } finally {
        if (mounted) setActivityLoading(false)
      }
    }
    fetchActivity()
    return () => { mounted = false }
  }, [id])

  async function toggleBlock(block: boolean) {
    if (!id) return
    setActionLoading(true)
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: block ? "block" : "unblock" }),
      })
      // reload data
      const res = await fetch(`/api/admin/users/${id}`)
      if (res.ok) {
        const json = await res.json()
        setUser(json.user)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  async function softDelete() {
    if (!confirm("Delete user (soft delete)?")) return
    if (!id) return
    setActionLoading(true)
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      router.push("/admin/users")
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="p-6">User not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.name ?? "—"}</h1>
          <p className="text-sm text-muted-foreground">{user.email ?? "—"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleBlock(!user.isBlocked)} className="px-3 py-2 bg-foreground text-background rounded">
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
          <button onClick={softDelete} className="px-3 py-2 bg-red-100 text-red-800 rounded">Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Basic info</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>User ID:</strong> {user.userId ?? "—"}</p>
            <p><strong>Email:</strong> {user.email ?? "—"}</p>
            {/* <p><strong>KYC:</strong> {user.kycVerified ? "Verified" : "Not verified"}</p> */}
            <p><strong>INR Balance:</strong> ₹{Number(user.inrBalance ?? 0).toLocaleString()}</p>
            <p><strong>USDT Balance:</strong> {Number(user.usdtBalance ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payout Profiles</CardTitle>
            <CardDescription>UPI / Bank profiles for this user</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(user.payoutProfiles) && user.payoutProfiles.length > 0 ? (
              <div className="space-y-3">
                {user.payoutProfiles.map((p: any) => (
                  <div key={p.id} className="border border-border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{p.type} {p.isActive ? "(Active)" : "(Inactive)"}</p>
                        <p className="text-sm text-muted-foreground">{p.verified ? "Verified" : "Not verified"}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                    {p.type === "UPI" ? (
                      <p className="mt-2"><strong>VPA:</strong> {p.upiVpa ?? "—"}</p>
                    ) : (
                      <>
                        <p className="mt-2"><strong>Account:</strong> {p.accountNumber ?? "—"}</p>
                        <p className="text-sm"><strong>IFSC:</strong> {p.ifsc ?? "—"}</p>
                        <p className="text-sm"><strong>Bank:</strong> {p.bankName ?? "—"}</p>
                      </>
                    )}
                    {p.verificationNote && <p className="mt-2 text-sm text-muted-foreground">{p.verificationNote}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No payout profiles found for this user.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Deposit and withdrawal history</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="h-72 flex items-center justify-center">
              <Skeleton className="h-56 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData.length ? activityData : [{ date: "", deposits: 0, withdrawals: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deposits" stroke="#000000" name="Deposits (INR)" />
                <Line type="monotone" dataKey="withdrawals" stroke="#a1a1a1" name="Withdrawals (INR)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>INR transactions for this user</CardDescription>
        </CardHeader>
        <CardContent>
          {txsLoading ? (
            <div className="space-y-3">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold">Type</th>
                      <th className="text-left py-2 px-2 font-semibold">INR Amount</th>
                      <th className="text-left py-2 px-2 font-semibold">Status</th>
                      <th className="text-left py-2 px-2 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3 px-2"><Skeleton className="h-5 w-20" /></td>
                        <td className="py-3 px-2"><Skeleton className="h-5 w-24" /></td>
                        <td className="py-3 px-2"><Skeleton className="h-5 w-24 rounded-full" /></td>
                        <td className="py-3 px-2"><Skeleton className="h-5 w-28" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-border rounded p-3">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold">Type</th>
                      <th className="text-left py-2 px-2 font-semibold">INR Amount</th>
                      <th className="text-left py-2 px-2 font-semibold">Status</th>
                      <th className="text-left py-2 px-2 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((t) => (
                      <tr key={t.id} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-2">{t.type}</td>
                        <td className="py-3 px-2 font-semibold">₹{Number(t.inrAmount ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            t.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            t.status === "PROCESSING" ? "bg-yellow-100 text-yellow-800" :
                            t.status === "FAILED" ? "bg-red-100 text-red-800" : "bg-muted text-muted-foreground"
                          }`}>{t.status}</span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {txs.map((t) => (
                  <div key={t.id} className="border border-border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{t.type}</p>
                        <p className="text-xs text-muted-foreground">Date: {new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Number(t.inrAmount ?? 0).toLocaleString()}</p>
                        <p className="text-xs"><span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">{t.status}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* transactions pagination */}
              <div className="flex justify-center gap-2 mt-3">
                {Array.from({ length: txsTotalPages }).map((_, i) => (
                  <button key={i+1} onClick={() => setTxsPage(i+1)} className={`px-3 py-1 rounded ${txsPage === i+1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{i+1}</button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <Link href="/admin/users" className="text-sm text-muted-foreground">Back to users</Link>
      </div>
    </div>
  )
}
