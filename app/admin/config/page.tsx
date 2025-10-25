"use client"

import { useState } from "react"
import { Save, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfigPage() {
  const [config, setConfig] = useState({
    platformName: "DonePay",
    platformFee: "2.5",
    minDeposit: "10",
    maxDeposit: "50000",
    minWithdrawal: "5",
    maxWithdrawal: "25000",
    referralBonus: "5",
    referralCommission: "10",
    maxReferrals: "unlimited",
    tokenName: "DonePay Token",
    tokenSymbol: "DPT",
    tokenDecimals: "18",
    networks: ["Ethereum", "Polygon", "BSC", "Arbitrum"],
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    emailFrom: "noreply@donepay.com",
    twoFactorEnabled: true,
    maintenanceMode: false,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Configuration</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage platform settings and configurations</p>
      </div>

      {saved && (
        <div className="rounded-lg bg-green-100 p-4 text-green-800 flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5" />
          Configuration saved successfully!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Platform Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">General platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Name</label>
              <input
                type="text"
                value={config.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Platform Fee (%)</label>
              <input
                type="number"
                value={config.platformFee}
                onChange={(e) => handleChange("platformFee", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Deposit & Withdrawal Limits</CardTitle>
          <CardDescription className="text-xs md:text-sm">Set minimum and maximum transaction amounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Min Deposit ($)</label>
              <input
                type="number"
                value={config.minDeposit}
                onChange={(e) => handleChange("minDeposit", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Deposit ($)</label>
              <input
                type="number"
                value={config.maxDeposit}
                onChange={(e) => handleChange("maxDeposit", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Min Withdrawal ($)</label>
              <input
                type="number"
                value={config.minWithdrawal}
                onChange={(e) => handleChange("minWithdrawal", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Withdrawal ($)</label>
              <input
                type="number"
                value={config.maxWithdrawal}
                onChange={(e) => handleChange("maxWithdrawal", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Referral Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">Configure referral program parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Referral Bonus ($)</label>
              <input
                type="number"
                value={config.referralBonus}
                onChange={(e) => handleChange("referralBonus", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commission (%)</label>
              <input
                type="number"
                value={config.referralCommission}
                onChange={(e) => handleChange("referralCommission", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Referrals</label>
              <input
                type="text"
                value={config.maxReferrals}
                onChange={(e) => handleChange("maxReferrals", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Token Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">Configure platform token parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Token Name</label>
              <input
                type="text"
                value={config.tokenName}
                onChange={(e) => handleChange("tokenName", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Token Symbol</label>
              <input
                type="text"
                value={config.tokenSymbol}
                onChange={(e) => handleChange("tokenSymbol", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Decimals</label>
              <input
                type="number"
                value={config.tokenDecimals}
                onChange={(e) => handleChange("tokenDecimals", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Security Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">Configure security options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-medium text-sm md:text-base">Two-Factor Authentication</p>
              <p className="text-xs md:text-sm text-muted-foreground">Require 2FA for user accounts</p>
            </div>
            <input
              type="checkbox"
              checked={config.twoFactorEnabled}
              onChange={(e) => handleChange("twoFactorEnabled", e.target.checked)}
              className="h-5 w-5 rounded border-border"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="font-medium text-sm md:text-base">Maintenance Mode</p>
              <p className="text-xs md:text-sm text-muted-foreground">Disable platform for maintenance</p>
            </div>
            <input
              type="checkbox"
              checked={config.maintenanceMode}
              onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
              className="h-5 w-5 rounded border-border"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:opacity-90 transition-opacity font-semibold w-full md:w-auto justify-center md:justify-start text-sm md:text-base"
        >
          <Save className="h-5 w-5" />
          Save Configuration
        </button>
      </div>
    </div>
  )
}
