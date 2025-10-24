"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { ChainSelector } from "@/components/chain-selector"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { DepositHistory } from "@/components/deposit-history"
import { Copy, Check } from "lucide-react"

export default function DepositPage() {
  const [copied, setCopied] = useState(false)
  const [selectedChain, setSelectedChain] = useState("ethereum")

  const depositAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f42e0d"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Deposit</h2>

        {/* Chain Selection */}
        <ChainSelector selectedChain={selectedChain} onChainChange={setSelectedChain} />

        {/* QR Code Section */}
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <div className="flex justify-center mb-4">
            <QRCodeDisplay address={depositAddress} />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">Scan to deposit USDT</p>
        </div>

        {/* Address Section */}
        <div className="bg-card rounded-lg p-4 mb-6 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Deposit Address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-secondary p-2 rounded text-foreground break-all">
              {depositAddress}
            </code>
            <button
              onClick={handleCopyAddress}
              className="flex-shrink-0 p-2 hover:bg-secondary rounded transition-colors"
              title="Copy address"
            >
              {copied ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Deposit History */}
        <DepositHistory />
      </main>
      <BottomNav />
    </div>
  )
}
