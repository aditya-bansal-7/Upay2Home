import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Copy, Users } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Team Heading */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Team</h2>

        {/* Team Stats Card */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-4xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground mt-1">Commission</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground mt-1">Team Recharge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">0</p>
          </div>
        </div>

        {/* Invite Code Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Invite Code</h3>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-4">
            <input
              type="text"
              value="...web.Upay2Home.com/regist?code=0ardonepbdtq"
              readOnly
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
            <button className="p-2 hover:bg-background rounded transition-colors">
              <Copy className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Team Detail Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Team Detail</h3>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-muted rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-muted-foreground"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M30 40 L70 40 Q75 40 75 45 L75 70 Q75 75 70 75 L30 75 Q25 75 25 70 L25 45 Q25 40 30 40" />
                <path d="M75 50 L85 50 Q90 50 90 55 L90 65 Q90 70 85 70 L75 70" />
                <circle cx="82" cy="60" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mb-4">
          <div className="w-1 h-16 bg-muted rounded-full"></div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
