"use client"

import { useEffect, useState, useRef } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const statIcons = [Users, CreditCard, TrendingUp, AlertCircle]

// Static content that doesn't need API data
const PAGE_TITLE = "Dashboard"
const PAGE_DESCRIPTION = "Welcome back! Here's your platform overview."
const CHART_TITLE = "Revenue & Users"
const CHART_DESCRIPTION = "Monthly revenue and user growth"
const USER_STATUS_TITLE = "User Status"
const USER_STATUS_DESCRIPTION = "Distribution of users"
const TRANSACTIONS_TITLE = "Recent Transactions"
const TRANSACTIONS_DESCRIPTION = "Latest platform transactions"

// tiny CountUp component (no deps)
function CountUp({ value, formatter = (v: number) => v.toLocaleString() }: { value: number; formatter?: (v:number)=>string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    const start = performance.now()
    const from = display
    const to = value
    const duration = 700
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t // linear
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <>{formatter(display)}</>
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [distribution, setDistribution] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    let iv: number | undefined

    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const [sRes, rRes, dRes, tRes] = await Promise.all([
          fetch("/api/admin/dashboard/stats"),
          fetch("/api/admin/dashboard/revenue"),
          fetch("/api/admin/dashboard/distribution"),
          fetch("/api/admin/dashboard/transactions"),
        ])
        if (!sRes.ok || !rRes.ok || !dRes.ok || !tRes.ok) throw new Error("Failed to load one or more endpoints")
        const sJson = await sRes.json()
        const rJson = await rRes.json()
        const dJson = await dRes.json()
        const tJson = await tRes.json()
        if (!mounted) return
        setStats(sJson.stats || [])
        setRevenueData(rJson.revenueData || [])
        setDistribution(dJson.distribution || [])
        setRecentTransactions(tJson.recentTransactions || [])
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message ?? "Failed to load dashboard")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Separate loading UI into components for better organization
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {/* Header is static, no need for skeleton */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{PAGE_TITLE}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{PAGE_DESCRIPTION}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{CHART_TITLE}</CardTitle>
            <CardDescription>{CHART_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{USER_STATUS_TITLE}</CardTitle>
            <CardDescription>{USER_STATUS_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{TRANSACTIONS_TITLE}</CardTitle>
          <CardDescription>{TRANSACTIONS_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[90px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="space-y-8">
        {/* Keep static header even in error state */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{PAGE_TITLE}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{PAGE_DESCRIPTION}</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-red-600">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Static header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{PAGE_TITLE}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{PAGE_DESCRIPTION}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index] || Users
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  <CountUp value={typeof stat.value === "number" ? stat.value : 0} formatter={(v)=> typeof stat.value === "number" && String(stat.value).startsWith("$") ? `$${v.toLocaleString()}` : stat.valueFormatted ?? v.toLocaleString()} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Revenue & Users</CardTitle>
            <CardDescription className="text-xs md:text-sm">Monthly revenue and user growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#000000" name="Revenue (INR)" />
                <Line type="monotone" dataKey="users" stroke="#a1a1a1" name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">User Status</CardTitle>
            <CardDescription className="text-xs md:text-sm">Distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Recent Transactions</CardTitle>
          <CardDescription className="text-xs md:text-sm">Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 md:px-4 font-semibold">User</th>
                  <th className="text-left py-2 px-2 md:px-4 font-semibold">Type</th>
                  <th className="text-left py-2 px-2 md:px-4 font-semibold">Amount</th>
                  <th className="text-left py-2 px-2 md:px-4 font-semibold">Status</th>
                  <th className="text-left py-2 px-2 md:px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-2 md:px-4">{tx.user}</td>
                    <td className="py-3 px-2 md:px-4">{tx.type}</td>
                    <td className="py-3 px-2 md:px-4 font-semibold">{tx.amount}</td>
                    <td className="py-3 px-2 md:px-4">
                      <span
                        className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "COMPLETED" || tx.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "PENDING" || tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4 text-muted-foreground">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
