"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Chain {
  id: string
  name: string
  logo: string
  symbol: string
}

const chains: Chain[] = [
  { id: "ethereum", name: "Ethereum", logo: "ETH", symbol: "ETH" },
  { id: "polygon", name: "Polygon", logo: "MATIC", symbol: "MATIC" },
  { id: "bsc", name: "BSC", logo: "BNB", symbol: "BNB" },
  { id: "arbitrum", name: "Arbitrum", logo: "ARB", symbol: "ARB" },
  { id: "optimism", name: "Optimism", logo: "OP", symbol: "OP" },
]

interface ChainSelectorProps {
  selectedChain: string
  onChainChange: (chain: string) => void
}

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = chains.find((c) => c.id === selectedChain) || chains[0]

  return (
    <div className="mb-6">
      <p className="text-xs text-muted-foreground mb-2">Select Network</p>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-card border border-border rounded-lg p-3 flex items-center justify-between hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
              {selected.logo}
            </div>
            <span className="font-medium text-foreground">{selected.name}</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  onChainChange(chain.id)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0 ${
                  selectedChain === chain.id ? "bg-secondary" : ""
                }`}
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {chain.logo}
                </div>
                <span className="font-medium text-foreground">{chain.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
