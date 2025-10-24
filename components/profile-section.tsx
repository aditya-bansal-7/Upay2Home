"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { Edit2, X } from "lucide-react"

export function ProfileSection() {
  const { language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")

  const t = translations[language]

  return (
    <div className="mb-6">
      {/* Profile Header with Photo */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* User Photo */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            JD
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.id}: 10020063</p>
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
            <label className="text-sm font-medium text-foreground block mb-2">{t.english}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t.save}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Quota Section */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-foreground">0</span>
          <span className="text-lg text-foreground">INR</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t.bonusRatio}</p>
        <button className="bg-foreground text-background px-6 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
          {t.topUp}
        </button>
      </div>
    </div>
  )
}
