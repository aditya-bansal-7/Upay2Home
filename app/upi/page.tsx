"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { ChevronUp, ChevronDown, Play, Plus, Trash2, Copy, Check } from "lucide-react"

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

export default function UPIPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const [activeTab, setActiveTab] = useState<"receive" | "send">("receive")
  const [expandedSection, setExpandedSection] = useState<"available" | "bank" | null>("available")
  const [showAddUPI, setShowAddUPI] = useState(false)
  const [showAddBank, setShowAddBank] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [savedUPIs, setSavedUPIs] = useState<SavedUPI[]>([
    { id: "1", upiAddress: "john.doe@okhdfcbank", accountHolder: "John Doe" },
    { id: "2", upiAddress: "johndoe@icici", accountHolder: "John Doe" },
  ])

  const [savedBanks, setSavedBanks] = useState<SavedBank[]>([
    {
      id: "1",
      accountHolder: "John Doe",
      accountNumber: "1234567890123456",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
    },
  ])

  const [newUPI, setNewUPI] = useState("")
  const [newBank, setNewBank] = useState({
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  })

  const handleCopyUPI = (upiAddress: string, id: string) => {
    navigator.clipboard.writeText(upiAddress)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAddUPI = () => {
    if (newUPI.trim()) {
      setSavedUPIs([...savedUPIs, { id: Date.now().toString(), upiAddress: newUPI, accountHolder: "New Account" }])
      setNewUPI("")
      setShowAddUPI(false)
    }
  }

  const handleAddBank = () => {
    if (newBank.accountNumber.trim()) {
      setSavedBanks([...savedBanks, { id: Date.now().toString(), ...newBank }])
      setNewBank({ accountHolder: "", accountNumber: "", ifscCode: "", bankName: "" })
      setShowAddBank(false)
    }
  }

  const handleDeleteUPI = (id: string) => {
    setSavedUPIs(savedUPIs.filter((upi) => upi.id !== id))
  }

  const handleDeleteBank = (id: string) => {
    setSavedBanks(savedBanks.filter((bank) => bank.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("receive")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "receive"
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.receivePayment}
          </button>
          <button
            onClick={() => setActiveTab("send")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "send"
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.sendPayment}
          </button>
        </div>

        {activeTab === "receive" && (
          <>
            {/* Warning Alert */}
            <div className="bg-muted rounded-lg p-4 mb-6 flex items-start gap-3">
              <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-background text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-foreground">{t.pleaseKeepAccount}</p>
            </div>

            {/* How to bind UPI */}
            <button className="flex items-center gap-2 text-foreground font-medium mb-6 hover:opacity-80 transition-opacity">
              <Play className="w-5 h-5" />
              {t.howToBind}
            </button>

            {/* Saved UPI Accounts Section */}
            <div className="mb-6">
              <button
                onClick={() => setExpandedSection(expandedSection === "available" ? null : "available")}
                className="w-full flex items-center justify-between py-3 px-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium text-foreground">{t.savedAccounts}</span>
                {expandedSection === "available" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {expandedSection === "available" && (
                <div className="mt-3 space-y-3">
                  {savedUPIs.length > 0 ? (
                    savedUPIs.map((upi) => (
                      <div key={upi.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{upi.accountHolder}</p>
                            <p className="text-sm text-muted-foreground">{upi.upiAddress}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteUPI(upi.id)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleCopyUPI(upi.upiAddress, upi.id)}
                          className="flex items-center gap-2 text-sm text-foreground hover:opacity-80 transition-opacity"
                        >
                          {copiedId === upi.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              {t.copied}
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              {t.copy}
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">{t.noData}</p>
                  )}

                  {/* Add UPI Form */}
                  {showAddUPI ? (
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
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
                          className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          {t.save}
                        </button>
                        <button
                          onClick={() => setShowAddUPI(false)}
                          className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddUPI(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {t.addUPI}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Saved Bank Accounts Section */}
            <div className="mb-6">
              <button
                onClick={() => setExpandedSection(expandedSection === "bank" ? null : "bank")}
                className="w-full flex items-center justify-between py-3 px-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium text-foreground">{t.bankDetails}</span>
                {expandedSection === "bank" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {expandedSection === "bank" && (
                <div className="mt-3 space-y-3">
                  {savedBanks.length > 0 ? (
                    savedBanks.map((bank) => (
                      <div key={bank.id} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{bank.bankName}</p>
                            <p className="text-sm text-muted-foreground">{bank.accountHolder}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteBank(bank.id)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">{t.accountNumber}</p>
                            <p className="text-foreground font-mono">
                              {bank.accountNumber.slice(-4).padStart(bank.accountNumber.length, "*")}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t.ifscCode}</p>
                            <p className="text-foreground">{bank.ifscCode}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">{t.noData}</p>
                  )}

                  {/* Add Bank Form */}
                  {showAddBank ? (
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        placeholder={t.accountHolder}
                        value={newBank.accountHolder}
                        onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder={t.bankName}
                        value={newBank.bankName}
                        onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder={t.accountNumber}
                        value={newBank.accountNumber}
                        onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder={t.ifscCode}
                        value={newBank.ifscCode}
                        onChange={(e) => setNewBank({ ...newBank, ifscCode: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddBank}
                          className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          {t.save}
                        </button>
                        <button
                          onClick={() => setShowAddBank(false)}
                          className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddBank(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {t.addBank}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">{t.available}</p>
                <p className="text-2xl font-bold text-foreground">{savedUPIs.length}</p>
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">{t.unavailable}</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "send" && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">{t.noData}</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
