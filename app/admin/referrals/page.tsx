"use client"

import { useState } from "react"
import { Search, TrendingUp, Users, Gift } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

const referralData = [
  { id: 1, referrer: "John Doe", referrals: 12, totalCommission: "$1,200", status: "Active", joinDate: "2024-01-01" },
  { id: 2, referrer: "Jane Smith", referrals: 8, totalCommission: "$800", status: "Active", joinDate: "2024-01-05" },
  {
    id: 3,
    referrer: "Mike Johnson",
    referrals: 15,
    totalCommission: "$1,500",
    status: "Active",
    joinDate: "2023-12-15",
  },
  {
    id: 4,
    referrer: "Sarah Williams",
    referrals: 5,
    totalCommission: "$500",
    status: "Inactive",
    joinDate: "2024-01-10",
  },
  { id: 5, referrer: "Tom Brown", referrals: 20, totalCommission: "$2,000", status: "Active", joinDate: "2023-11-20" },
  {
    id: 6,
    referrer: "Emily Davis",
    referrals: 10,
    totalCommission: "$1,000",
    status: "Active",
    joinDate: "2024-01-12",
  },
]

const teamHierarchy = [
  { id: 1, name: "John Doe", level: 1, referrals: 12, commission: "$1,200", status: "Active" },
  { id: 2, name: "Jane Smith", level: 2, referrals: 8, commission: "$800", status: "Active" },
  { id: 3, name: "Mike Johnson", level: 2, referrals: 15, commission: "$1,500", status: "Active" },
  { id: 4, name: "Sarah Williams", level: 3, referrals: 5, commission: "$500", status: "Inactive" },
  { id: 5, name: "Tom Brown", level: 3, referrals: 20, commission: "$2,000", status: "Active" },
]

const commissionTrend = [
  { month: "Jan", commission: 5000, referrals: 45 },
  { month: "Feb", commission: 6200, referrals: 52 },
  { month: "Mar", commission: 5800, referrals: 48 },
  { month: "Apr", commission: 7100, referrals: 61 },
  { month: "May", commission: 8300, referrals: 73 },
  { month: "Jun", commission: 9500, referrals: 85 },
]

const topReferrers = [
  { name: "Tom Brown", referrals: 20, commission: "$2,000" },
  { name: "Mike Johnson", referrals: 15, commission: "$1,500" },
  { name: "John Doe", referrals: 12, commission: "$1,200" },
  { name: "Emily Davis", referrals: 10, commission: "$1,000" },
  { name: "Jane Smith", referrals: 8, commission: "$800" },
]

export default function ReferralsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredReferrals = referralData.filter((ref) => {
    const matchesSearch = ref.referrer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || ref.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalReferrers: referralData.length,
    totalReferrals: referralData.reduce((sum, r) => sum + r.referrals, 0),
    totalCommission: referralData.reduce((sum, r) => sum + Number.parseInt(r.totalCommission.replace(/[$,]/g, "")), 0),
    activeReferrers: referralData.filter((r) => r.status === "Active").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referrals & Team Tracking</h1>
        <p className="text-muted-foreground">Monitor referral program and team structure</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCommission.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReferrers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Commission Trend</CardTitle>
            <CardDescription>Monthly commission and referral growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commissionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commission" stroke="#000000" name="Commission ($)" />
                <Line type="monotone" dataKey="referrals" stroke="#a1a1a1" name="New Referrals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Best performing referrers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topReferrers.map((ref, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">{ref.referrals} referrals</p>
                  </div>
                  <p className="font-semibold">{ref.commission}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by referrer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Referrers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referrers ({filteredReferrals.length})</CardTitle>
          <CardDescription>All referral program participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Referrer</th>
                  <th className="text-left py-3 px-4 font-semibold">Referrals</th>
                  <th className="text-left py-3 px-4 font-semibold">Commission</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4 font-medium">{ref.referrer}</td>
                    <td className="py-3 px-4">{ref.referrals}</td>
                    <td className="py-3 px-4 font-semibold">{ref.totalCommission}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          ref.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{ref.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Team Hierarchy</CardTitle>
          <CardDescription>Multi-level team structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamHierarchy.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-secondary transition-colors"
                style={{ marginLeft: `${(member.level - 1) * 20}px` }}
              >
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">Level {member.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{member.referrals} referrals</div>
                  <div className="text-xs text-muted-foreground">{member.commission}</div>
                </div>
                <span
                  className={`ml-4 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
