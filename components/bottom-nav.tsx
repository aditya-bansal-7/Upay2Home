"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Wallet, CreditCard, Users, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Wallet, label: "Deposit", href: "/deposit" },
  { icon: CreditCard, label: "UPI", href: "/upi" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: User, label: "Me", href: "/me" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                /* Changed active color from accent (orange) to black */
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
