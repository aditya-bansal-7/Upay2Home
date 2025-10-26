"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { Play, Plus, Trash2, Copy, Check } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface SavedUPI {
  id: string
  upiAddress: string
  accountHolder: string
}

interface SavedBank {
  id: string
  accountHolder: string
  accountNumber: string
  ifscCode: string
  bankName: string
}

type ProfileItem = (SavedUPI & { profileType: "UPI" }) | (SavedBank & { profileType: "BANK" })

export default function UPIPage() {
  const { data: session, status } = useSession()
  const { language } = useLanguage()
  const t = translations[language]

  const [expandedSection, setExpandedSection] = useState<"available" | "bank" | null>("available")
  const [showAddUPI, setShowAddUPI] = useState(false)
  const [showAddBank, setShowAddBank] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // loading flags
  const [isFetchingProfiles, setIsFetchingProfiles] = useState(false)
  const [isAddingUPI, setIsAddingUPI] = useState(false)
  const [isAddingBank, setIsAddingBank] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // start empty; when user is authenticated, you can fetch from /api/user/payout-profiles
  const [savedUPIs, setSavedUPIs] = useState<SavedUPI[]>([])
  const [savedBanks, setSavedBanks] = useState<SavedBank[]>([])

  const [newUPI, setNewUPI] = useState("")
  const [newBank, setNewBank] = useState({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  })

  // fetch profiles when authenticated
  useEffect(() => {
    let mounted = true
    async function load() {
      if (status !== "authenticated") {
        setSavedUPIs([])
        setSavedBanks([])
        return
      }
      setIsFetchingProfiles(true)
      try {
        const res = await fetch("/api/user/payout-profiles?userId=" + session?.user?.id)
        if (!res.ok) throw new Error("Failed to fetch profiles")
        const json = await res.json()
        if (!mounted) return
        const upi = (json.profiles || []).filter((p: any) => p.type === "UPI")
        const bank = (json.profiles || []).filter((p: any) => p.type === "BANK")
        // map db fields to local shapes
        setSavedUPIs(
          upi.map((p: any) => ({
            id: p.id,
            upiAddress: p.upiVpa || "",
            accountHolder: p.accountHolder || "",
          }))
        )
        setSavedBanks(
          bank.map((p: any) => ({
            id: p.id,
            accountHolder: p.accountHolder || "",
            accountNumber: p.accountNumber || "",
            ifscCode: p.ifsc || "",
            bankName: p.bankName || "",
          }))
        )
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setIsFetchingProfiles(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [status, session?.user?.id])

  // merged list for display (UPI first then banks)
  const mergedProfiles = useMemo<ProfileItem[]>(
    () => [
      ...savedUPIs.map((u) => ({ ...u, profileType: "UPI" as const })),
      ...savedBanks.map((b) => ({ ...b, profileType: "BANK" as const })),
    ],
    [savedUPIs, savedBanks]
  )

  const handleCopyUPI = (upiAddress: string, id: string) => {
    navigator.clipboard.writeText(upiAddress)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // add via API only when authenticated
  async function handleAddUPI() {
    if (!newUPI.trim()) return
    if (status !== "authenticated") return
    setIsAddingUPI(true)
    try {
      const res = await fetch("/api/user/payout-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPI", upiVpa: newUPI, userId: session?.user?.id }),
      })
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      setSavedUPIs((s) => [
        { id: json.profile.id, upiAddress: json.profile.upiVpa, accountHolder: json.profile.accountHolder || "Account" },
        ...s,
      ])
      setNewUPI("")
      setShowAddUPI(false)
    } catch (err) {
      console.error(err)
      // fallback local update if API isn't available
      setSavedUPIs((s) => [{ id: Date.now().toString(), upiAddress: newUPI, accountHolder: "New Account" }, ...s])
      setNewUPI("")
      setShowAddUPI(false)
    } finally {
      setIsAddingUPI(false)
    }
  }

  async function handleAddBank() {
    if (!newBank.accountNumber.trim() || status !== "authenticated") return
    setIsAddingBank(true)
    try {
      const res = await fetch("/api/user/payout-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BANK",
          userId: session?.user?.id,
          accountHolder: newBank.accountHolder,
          accountNumber: newBank.accountNumber,
          ifsc: newBank.ifscCode,
          bankName: newBank.bankName,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      setSavedBanks((s) => [
        {
          id: json.profile.id,
          accountHolder: json.profile.accountHolder,
          accountNumber: json.profile.accountNumber,
          ifscCode: json.profile.ifsc,
          bankName: json.profile.bankName,
        },
        ...s,
      ])
      setNewBank({ accountHolder: "", accountNumber: "", ifscCode: "", bankName: "" })
      setShowAddBank(false)
    } catch (err) {
      console.error(err)
      setSavedBanks((s) => [{ id: Date.now().toString(), ...newBank }, ...s])
      setNewBank({ accountHolder: "", accountNumber: "", ifscCode: "", bankName: "" })
      setShowAddBank(false)
    } finally {
      setIsAddingBank(false)
    }
  }

  // delete handlers call API when authenticated
  async function handleDeleteProfile(id: string, type: "UPI" | "BANK") {
    setDeletingIds((prev) => new Set(prev).add(id))
    try {
      if (status === "authenticated") {
        const res = await fetch(`/api/user/payout-profiles/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session?.user?.id }),
        })
        if (!res.ok) throw new Error("Failed")
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (type === "UPI") setSavedUPIs((s) => s.filter((u) => u.id !== id))
      else setSavedBanks((s) => s.filter((b) => b.id !== id))
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  // UI when session loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="h-20 bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  // If not authenticated show login prompt and hide saved profiles
  const notAuthenticated = status !== "authenticated"

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        <>
          {/* Warning Alert */}
          <div className="bg-muted rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-background text-xs font-bold">!</span>
            </div>
            <p className="text-sm text-foreground">{t.pleaseKeepAccount}</p>
          </div>

          {/* How to bind UPI */}
          <button className="flex items-center gap-2 text-foreground font-medium mb-6 hover:opacity-80 transition-opacity">
            <Play className="w-5 h-5" />
            {t.howToBind}
          </button>

          {/* If not logged in show CTA */}
          {notAuthenticated && (
            <div className="bg-card border border-border rounded-lg p-4 mb-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">Please sign in to manage your payout profiles.</p>
              <div className="flex justify-center gap-3">
                <Link href="/login" className="px-4 py-2 bg-foreground text-background rounded-lg">Sign in</Link>
                <Link href="/register" className="px-4 py-2 bg-muted text-foreground rounded-lg">Register</Link>
              </div>
            </div>
          )}

          {/* Add controls (only enabled when authenticated) */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { if (!notAuthenticated) setShowAddUPI((s) => !s) }}
              className={`flex-1 px-4 py-2 rounded-lg ${notAuthenticated ? "bg-muted text-muted-foreground" : "bg-foreground text-background"} `}
              aria-disabled={notAuthenticated || isAddingUPI}
              disabled={notAuthenticated || isAddingUPI}
            >
              <Plus className="inline w-4 h-4 mr-2" /> {isAddingUPI ? t.loading : t.addUPI}
            </button>
            <button
              onClick={() => { if (!notAuthenticated) setShowAddBank((s) => !s) }}
              className={`flex-1 px-4 py-2 rounded-lg ${notAuthenticated ? "bg-muted text-muted-foreground" : "bg-foreground text-background"} `}
              aria-disabled={notAuthenticated || isAddingBank}
              disabled={notAuthenticated || isAddingBank}
            >
              <Plus className="inline w-4 h-4 mr-2" /> {isAddingBank ? t.loading : t.addBank}
            </button>
          </div>

          {/* Add forms */}
          {showAddUPI && !notAuthenticated && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3 mb-6">
              <input
                type="text"
                placeholder={t.upiAddress}
                value={newUPI}
                onChange={(e) => setNewUPI(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddUPI}
                  disabled={isAddingUPI || !newUPI.trim()}
                  className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {isAddingUPI ? t.loading : t.save}
                </button>
                <button onClick={() => setShowAddUPI(false)} className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg">
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {showAddBank && !notAuthenticated && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3 mb-6">
              <input
                type="text"
                placeholder={t.accountHolder + " Name"}
                value={newBank.accountHolder}
                onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <input
                type="text"
                placeholder={t.bankName}
                value={newBank.bankName}
                onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <input
                type="text"
                placeholder={t.accountNumber}
                value={newBank.accountNumber}
                onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <input
                type="text"
                placeholder={t.ifscCode}
                value={newBank.ifscCode}
                onChange={(e) => setNewBank({ ...newBank, ifscCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddBank}
                  disabled={isAddingBank || !newBank.accountNumber.trim()}
                  className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {isAddingBank ? t.loading : t.save}
                </button>
                <button onClick={() => setShowAddBank(false)} className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg">
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Merged Profiles list */}
          <div className="space-y-3 mb-6">
            {isFetchingProfiles ? (
              <>
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              </>
            ) : mergedProfiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">{t.noData}</p>
            ) : (
              mergedProfiles.map((p) => {
                const isDeleting = deletingIds.has(p.id)
                return (
                  <div key={p.id} className="bg-card border border-border rounded-lg p-4 relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="pr-8">
                        {p.profileType === "UPI" ? (
                          <>
                            <p className="font-medium text-foreground">{p.accountHolder}</p>
                            <p className="text-sm text-muted-foreground">{(p as SavedUPI).upiAddress}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-foreground">{(p as SavedBank).bankName}</p>
                            <p className="text-sm text-muted-foreground">{(p as SavedBank).accountHolder}</p>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {p.profileType === "UPI" ? (
                          <>
                            <button
                              onClick={() => handleCopyUPI((p as SavedUPI).upiAddress, p.id)}
                              className="p-2 hover:bg-muted rounded transition-colors text-sm disabled:opacity-50"
                              disabled={isDeleting}
                            >
                              {copiedId === p.id ? (
                                <>
                                  <Check className="w-4 h-4 inline" /> {t.copied}
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 inline" /> {t.copy}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteProfile(p.id, "UPI")}
                              className="p-2 hover:bg-muted rounded transition-colors text-sm disabled:opacity-50"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="text-xs text-muted-foreground">
                              {`••••${(p as SavedBank).accountNumber.slice(-4)}`}
                            </div>
                            <button
                              onClick={() => handleDeleteProfile(p.id, "BANK")}
                              className="p-2 hover:bg-muted rounded transition-colors text-sm disabled:opacity-50"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isDeleting && <div className="absolute inset-0 bg-background/40 rounded-lg animate-pulse" />}
                  </div>
                )
              })
            )}
          </div>
        </>
      </main>
      <BottomNav />
    </div>
  )
}
