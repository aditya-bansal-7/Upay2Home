"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface TokenTransaction {
  id: string
  type: "earned" | "spent"
  amount: number
  date: string
  purpose: string
}

export default function TokenHistoryPage() {
  const [transactions] = useState<TokenTransaction[]>([
    { id: "1", type: "earned", amount: 100, date: "2024-10-20", purpose: "Referral Bonus" },
    { id: "2", type: "spent", amount: 50, date: "2024-10-19", purpose: "Withdrawal" },
    { id: "3", type: "earned", amount: 200, date: "2024-10-18", purpose: "Team Commission" },
    { id: "4", type: "spent", amount: 75, date: "2024-10-17", purpose: "Fee" },
    { id: "5", type: "earned", amount: 150, date: "2024-10-16", purpose: "Deposit Bonus" },
    { id: "6", type: "spent", amount: 100, date: "2024-10-15", purpose: "Withdrawal" },
  ])

  const [filterType, setFilterType] = useState<"all" | "earned" | "spent">("all")
  const [dateRange, setDateRange] = useState<"all" | "week" | "month">("all")

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/me" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Token History</h1>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Type Filter */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Type</p>
            <div className="flex gap-2">
              {(["all", "earned", "spent"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filterType === type ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Date Range</p>
            <div className="flex gap-2">
              {(["all", "week", "month"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    dateRange === range ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {range === "all" ? "All" : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {tx.type === "earned" ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{tx.purpose}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                  {tx.type === "earned" ? "+" : "-"}
                  {tx.amount} Tokens
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
