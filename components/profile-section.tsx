"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { Edit2, X } from "lucide-react"
import Link from "next/link"

export function ProfileSection() {
  const { data: session } = useSession()
  const { language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")

  // Use a permissive cast so missing keys don't break TS; provide safe fallbacks where used.
  const tAny = translations[language] as any

  if (!session) {
    return (
      <div className="p-6 text-center space-y-4 bg-card rounded-lg border border-border">
        <h2 className="text-lg font-bold">{tAny.notLoggedIn ?? "You are not logged in"}</h2>
        <div className="space-x-4">
          <Link 
            href="/login"
            className="inline-block bg-foreground text-background px-6 py-2 rounded-full font-medium text-sm hover:opacity-90"
          >
            {tAny.login ?? "Sign in"}
          </Link>
          <Link
            href="/register"
            className="inline-block bg-muted text-foreground px-6 py-2 rounded-full font-medium text-sm hover:opacity-90"
          >
            {tAny.register ?? "Register"}
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, id: session.user?.userId }),
      })
      if (res.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const userInitials = session.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?'

  return (
    <div className="mb-6">
      {/* Profile Header with Photo */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* User Photo */}
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'Profile'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : userInitials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{session.user?.name ?? tAny.userName ?? "User"}</h2>
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tAny.id ?? "ID"}: {session.user?.id ? String(session.user.userId) : "—"}
            </p>
          </div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{tAny.name ?? "Name"}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdateProfile}
              className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {tAny.save ?? "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {tAny.cancel ?? "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Quota Section */}
      {/* <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-foreground">0</span>
          <span className="text-lg text-foreground">INR</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{tAny.bonusRatio ?? "Bonus Ratio"}</p>
        <button className="bg-foreground text-background px-6 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
          {tAny.topUp ?? "Top Up"}
        </button>
      </div> */}
    </div>
  )
}
