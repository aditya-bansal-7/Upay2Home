"use client"

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

const dashboardStats = [
  { label: "Total Users", value: "12,543", icon: Users, change: "+12.5%" },
  { label: "Total Deposits", value: "$2.4M", icon: CreditCard, change: "+8.2%" },
  { label: "Active Users", value: "3,421", icon: TrendingUp, change: "+5.1%" },
  { label: "Pending Withdrawals", value: "234", icon: AlertCircle, change: "-2.3%" },
]

const revenueData = [
  { month: "Jan", revenue: 45000, users: 2400 },
  { month: "Feb", revenue: 52000, users: 2210 },
  { month: "Mar", revenue: 48000, users: 2290 },
  { month: "Apr", revenue: 61000, users: 2000 },
  { month: "May", revenue: 55000, users: 2181 },
  { month: "Jun", revenue: 67000, users: 2500 },
]

const userDistribution = [
  { name: "Active", value: 65, color: "#000000" },
  { name: "Inactive", value: 25, color: "#d4d4d8" },
  { name: "Suspended", value: 10, color: "#ef4444" },
]

const recentTransactions = [
  { id: 1, user: "John Doe", type: "Deposit", amount: "$500", status: "Completed", date: "2024-01-15" },
  { id: 2, user: "Jane Smith", type: "Withdrawal", amount: "$1,200", status: "Pending", date: "2024-01-14" },
  { id: 3, user: "Mike Johnson", type: "Deposit", amount: "$750", status: "Completed", date: "2024-01-13" },
  { id: 4, user: "Sarah Williams", type: "Withdrawal", amount: "$2,000", status: "Failed", date: "2024-01-12" },
  { id: 5, user: "Tom Brown", type: "Deposit", amount: "$300", status: "Completed", date: "2024-01-11" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Users</CardTitle>
            <CardDescription>Monthly revenue and user growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#000000" name="Revenue ($)" />
                <Line type="monotone" dataKey="users" stroke="#a1a1a1" name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <CardDescription>Distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-semibold">User</th>
                  <th className="text-left py-2 px-4 font-semibold">Type</th>
                  <th className="text-left py-2 px-4 font-semibold">Amount</th>
                  <th className="text-left py-2 px-4 font-semibold">Status</th>
                  <th className="text-left py-2 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4">{tx.user}</td>
                    <td className="py-3 px-4">{tx.type}</td>
                    <td className="py-3 px-4 font-semibold">{tx.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
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
