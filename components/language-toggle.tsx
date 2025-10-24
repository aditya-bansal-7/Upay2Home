"use client"

import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-3">
      <span className="text-sm text-muted-foreground">Language:</span>
      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-1 rounded-lg font-medium text-sm transition-colors ${
            language === "en" ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={`px-4 py-1 rounded-lg font-medium text-sm transition-colors ${
            language === "hi" ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          🇮🇳 हिंदी
        </button>
      </div>
    </div>
  )
}
