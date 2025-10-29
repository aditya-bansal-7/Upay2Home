import { Header } from "@/components/header"
import { PromoCarousel } from "@/components/promo-carousel"
import { CurrencyRatios } from "@/components/currency-ratios"
import { BindUPIButton } from "@/components/bind-upi-button"
import { AccountStats } from "@/components/account-stats"
import { Tutorial } from "@/components/tutorial"
import { BottomNav } from "@/components/bottom-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <PromoCarousel />
        <CurrencyRatios />
        <BindUPIButton />
        <AccountStats />
      </main>
      <BottomNav />
    </div>
  )
}
