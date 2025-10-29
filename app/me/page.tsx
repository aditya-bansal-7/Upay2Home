"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ProfileSection } from "@/components/profile-section"
import { ContactUsModal } from "@/components/contact-us-modal"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { ChevronRight, Clock, HelpCircle, LogOut, Gift } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

export default function MePage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isReferralOpen, setIsReferralOpen] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [hasReferrer, setHasReferrer] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { language } = useLanguage()
  const { data: session } = useSession()

  const t = translations[language]

  // ✅ Fetch user referral info
  useEffect(() => {
    const fetchRefStatus = async () => {
      if (!session?.user?.email) return
      const res = await fetch(`/api/user/ref-status?email=${session.user.email}`)
      const data = await res.json()
      setHasReferrer(data.hasReferrer)
    }
    fetchRefStatus()
  }, [session])

  const handleReferralSubmit = async () => {
    setMessage(null)
    const res = await fetch("/api/refer/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode , userId: session?.user?.userId }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage("Referral code added successfully!")
      setHasReferrer(true)
    } else {
      setMessage(data.error || "Invalid referral code")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        <ProfileSection />

        <div className="mb-6">
          <LanguageToggle />
        </div>

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

          {/* ✅ Only show if user has no referrer */}
          {hasReferrer === false && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">
                  {language === "en" ? "Enter Referral Code" : "रेफ़रल कोड दर्ज करें"}
                </span>
              </div>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder={language === "en" ? "Enter referral code" : "रेफ़रल कोड दर्ज करें"}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <button
                onClick={handleReferralSubmit}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90"
              >
                {language === "en" ? "Submit" : "जमा करें"}
              </button>
              {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
            </div>
          )}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted rounded-lg transition-colors"
          >
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
