"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ChevronLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface RechargeTransaction {
  id: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  method: string
}

export default function RechargeHistoryPage() {
  const [transactions] = useState<RechargeTransaction[]>([
    { id: "1", amount: 500, date: "2024-10-20", status: "completed", method: "USDT" },
    { id: "2", amount: 1000, date: "2024-10-18", status: "completed", method: "USDT" },
    { id: "3", amount: 250, date: "2024-10-15", status: "pending", method: "USDT" },
    { id: "4", amount: 750, date: "2024-10-12", status: "completed", method: "USDT" },
    { id: "5", amount: 100, date: "2024-10-10", status: "failed", method: "USDT" },
    { id: "6", amount: 2000, date: "2024-10-08", status: "completed", method: "USDT" },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/me" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Recharge History</h1>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(tx.status)}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{tx.method}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">₹{tx.amount}</p>
                <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
