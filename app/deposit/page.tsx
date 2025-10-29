"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Copy, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import Link from "next/link";
import "./deposit.css";

export default function DepositPage() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [txHash, setTxHash] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch config and profiles
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const { config } = await res.json();
          setConfig(config);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const loadProfiles = async () => {
      try {
        const res = await fetch(`/api/user/payout-profiles?userId=${session.user.id}`);
        if (res.ok) {
          const { profiles } = await res.json();
          setProfiles(profiles || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfiles();
  }, [session]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(config?.depositAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDeposit = async () => {
    if (!session || !amount || !txHash || !selectedProfile) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/deposits?userId=" + session?.user?.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          txHash,
          profileId: selectedProfile,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Not logged in
  if (status !== "loading" && !session) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">{t.pleaseSignIn}</h2>
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-foreground text-background rounded-lg"
              >
                {t.signIn}
              </Link>
              <Link
                href="/register"
                className="inline-block px-4 py-2 bg-muted text-foreground rounded-lg"
              >
                {t.register}
              </Link>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-md mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-[200px] bg-muted rounded animate-pulse" />
            <div className="h-[100px] bg-muted rounded animate-pulse" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="max-w-md mx-auto px-4 py-6 text-center space-y-6">
          <div className="bg-green-50 text-green-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">{t.depositSubmitted}</h3>
            <p className="text-sm">{t.processingMessage}</p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-foreground text-background rounded-lg"
          >
            {t.goToDashboard}
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6 space-y-8">

        {/* Deposit Address */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="text-center font-medium mb-4">{t.depositTitle}</div>
          <div className="flex justify-center mb-4">
            <img src={config.qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-4">
            {t.scanToDeposit}
          </p>
          <div className="flex items-center gap-2 bg-secondary p-3 rounded">
            <code className="flex-1 text-sm font-mono break-all">{config?.depositAddress}</code>
            <button onClick={handleCopyAddress} className="p-2 hover:bg-muted rounded">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <label className="block text-sm font-medium mb-2">{t.enterAmount}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {t.minDeposit}: {config?.minDepositUSDT} USDT
          </p>
        </div>

        {/* Payout Profile */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="font-medium mb-4">{t.selectPayoutProfile}</h3>
          <div className="space-y-3">
            {profiles.map((p) => (
              <label key={p.id} className="block">
                <input
                  type="radio"
                  name="profile"
                  value={p.id}
                  checked={selectedProfile === p.id}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`p-4 rounded-lg border ${
                    selectedProfile === p.id ? "border-foreground" : "border-border"
                  }`}
                >
                  <p className="font-medium">
                    {p.type === "UPI" ? p.upiVpa : p.bankName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p.type === "UPI" ? "UPI" : `${p.accountNumber}`}
                  </p>
                </div>
              </label>
            ))}
            <div>
              <Link href="/upi" className="text-sm text-primary hover:underline">
                {t.addNewUPI}
              </Link>
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <label className="block text-sm font-medium mb-2">
            {t.transactionHash}
          </label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono"
            placeholder={t.enterTransactionHash}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitDeposit}
          disabled={
            submitting ||
            !amount ||
            !txHash ||
            !selectedProfile ||
            Number(amount) < Number(config?.minDepositUSDT)
          }
          className="w-full bg-foreground text-background py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.submit}
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
