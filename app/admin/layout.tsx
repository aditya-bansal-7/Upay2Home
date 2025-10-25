"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, LogOut, Settings, Gift, CreditCard } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: CreditCard },
    { href: "/admin/referrals", label: "Referrals", icon: Gift },
    { href: "/admin/config", label: "Config", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground">DonePay Admin</h1>
        </div>
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-6 left-4 right-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-foreground hover:bg-secondary transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
