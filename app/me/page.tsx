"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ProfileSection } from "@/components/profile-section"
import { ContactUsModal } from "@/components/contact-us-modal"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { ChevronRight, Clock, FileText, HelpCircle, LogOut } from "lucide-react"

export default function MePage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { language } = useLanguage()

  const t = translations[language]

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        <ProfileSection />

        {/* Language Toggle */}
        <div className="mb-6">
          <LanguageToggle />
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <a
            href="/recharge-history"
            className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">{t.rechargeHistory}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </a>

          <a
            href="/token-history"
            className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">{t.tokenHistory}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </a>

          <button
            onClick={() => setIsContactOpen(true)}
            className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">{t.contactUs}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">{t.signOut}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </main>

      <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <BottomNav />
    </div>
  )
}
