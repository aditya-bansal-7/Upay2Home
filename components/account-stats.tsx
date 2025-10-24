import { ChevronRight } from "lucide-react"

const stats = [
  { label: "Balance", value: "0.00" },
  { label: "Today Received", value: "0.00" },
  { label: "Top up Bonus", value: "0.00" },
  { label: "Team Commission", value: "0.00" },
]

export function AccountStats() {
  return (
    <div className="space-y-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
        >
          <div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
