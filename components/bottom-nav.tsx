"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Wallet, CreditCard, Users, User } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

const getNavItems = (t: any) => [
  { icon: Home, label: t.home ?? "Home", href: "/" },
  { icon: Wallet, label: t.deposit ?? "Deposit", href: "/deposit" },
  { icon: CreditCard, label: t.upi ?? "UPI", href: "/upi" },
  { icon: User, label: t.me ?? "Me", href: "/me" },
]

export function BottomNav() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]
  const navItems = getNavItems(t)

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
