"use client"

import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Copy, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function TeamPage() {
  const { data: session } = useSession()
  const [referrals, setReferrals] = useState<any[]>([])
  const [totalCommission, setTotalCommission] = useState(0)
  const [teamRecharge, setTeamRecharge] = useState(0)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      const res = await fetch("/api/team?userId=" + session?.user?.userId)
      if (res.ok) {
        const data = await res.json()
        setReferrals(data.referrals)
        setTotalCommission(data.totalCommission)
        setTeamRecharge(data.teamRecharge)
      }
    }
    fetchTeam()
  }, [])

  const referralLink = `https://www.upay2home.com/register?ref=${session?.user?.userId ?? ""}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopySuccess("Copied!")
    setTimeout(() => setCopySuccess(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Team Heading */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Team</h2>

        {/* Stats Card */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-4xl font-bold text-foreground">{totalCommission}</p>
              <p className="text-sm text-muted-foreground mt-1">Commission</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground">{teamRecharge}</p>
              <p className="text-sm text-muted-foreground mt-1">Team Recharge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">{referrals.length}</p>
          </div>
        </div>

        {/* Invite Code Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Invite Code</h3>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
            <button onClick={handleCopy} className="p-2 hover:bg-background rounded transition-colors">
              <Copy className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {copySuccess && <p className="text-sm text-green-600 mt-2">{copySuccess}</p>}
        </div>

        {/* Team Detail Section */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Team Members</h3>

          {referrals.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No team members yet.
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center bg-muted rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
