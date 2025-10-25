"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const userDetails = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  status: "Active",
  joinDate: "2024-01-01",
  balance: "$1,250",
  totalDeposits: "$5,000",
  totalWithdrawals: "$3,750",
  referralCode: "JOHN123456",
  referralCount: 12,
}

const wallets = [
  {
    id: 1,
    type: "USDT",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e...",
    balance: "$1,250",
    network: "Ethereum",
  },
  { id: 2, type: "USDT", address: "0x8f3Cf7ad23Cd3CaDbD9735AFF958023D60c42C...", balance: "$0", network: "Polygon" },
]

const transactions = [
  { id: 1, type: "Deposit", amount: "$500", date: "2024-01-15", status: "Completed", txHash: "0x123abc..." },
  { id: 2, type: "Withdrawal", amount: "$200", date: "2024-01-14", status: "Completed", txHash: "0x456def..." },
  { id: 3, type: "Deposit", amount: "$750", date: "2024-01-13", status: "Completed", txHash: "0x789ghi..." },
  { id: 4, type: "Withdrawal", amount: "$300", date: "2024-01-12", status: "Pending", txHash: "0xabc123..." },
]

const activityData = [
  { date: "Jan 1", deposits: 500, withdrawals: 0 },
  { date: "Jan 5", deposits: 750, withdrawals: 200 },
  { date: "Jan 10", deposits: 1000, withdrawals: 300 },
  { date: "Jan 15", deposits: 500, withdrawals: 200 },
]

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{userDetails.name}</h1>
          <p className="text-muted-foreground">{userDetails.email}</p>
        </div>
        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          {userDetails.status}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDetails.balance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDetails.totalDeposits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDetails.totalWithdrawals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDetails.referralCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>Wallets</CardTitle>
          <CardDescription>User's connected wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <div className="font-semibold">
                    {wallet.type} - {wallet.network}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{wallet.address}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{wallet.balance}</div>
                  <button
                    onClick={() => copyToClipboard(wallet.address)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Deposit and withdrawal history</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deposits" stroke="#000000" name="Deposits" />
              <Line type="monotone" dataKey="withdrawals" stroke="#a1a1a1" name="Withdrawals" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">TX Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4 font-medium">{tx.type}</td>
                    <td className="py-3 px-4 font-semibold">{tx.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:underline flex items-center gap-1">
                        <Copy className="h-3 w-3" />
                        {tx.txHash}
                      </button>
                    </td>
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
