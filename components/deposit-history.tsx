"use client"
import { Clock, CheckCircle2 } from "lucide-react"

interface Deposit {
  id: string
  amount: string
  chain: string
  status: "pending" | "completed"
  date: string
  txHash: string
}

const mockDeposits: Deposit[] = [
  {
    id: "1",
    amount: "100 USDT",
    chain: "Ethereum",
    status: "completed",
    date: "2024-10-20 14:30",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d",
  },
  {
    id: "2",
    amount: "50 USDT",
    chain: "Polygon",
    status: "completed",
    date: "2024-10-19 09:15",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d",
  },
  {
    id: "3",
    amount: "250 USDT",
    chain: "BSC",
    status: "pending",
    date: "2024-10-18 16:45",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d",
  },
  {
    id: "4",
    amount: "75 USDT",
    chain: "Arbitrum",
    status: "completed",
    date: "2024-10-17 11:20",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d",
  },
  {
    id: "5",
    amount: "150 USDT",
    chain: "Ethereum",
    status: "completed",
    date: "2024-10-16 13:00",
    txHash: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d",
  },
]

export function DepositHistory() {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-4">Deposit History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {mockDeposits.map((deposit) => (
          <div
            key={deposit.id}
            className="bg-card border border-border rounded-lg p-4 hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${
                    deposit.status === "completed" ? "bg-accent/10" : "bg-muted"
                  }`}
                >
                  {deposit.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{deposit.amount}</p>
                    <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                      {deposit.chain}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{deposit.date}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {deposit.txHash.slice(0, 10)}...{deposit.txHash.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-xs font-medium ${
                    deposit.status === "completed" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {deposit.status === "completed" ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
