import { ChevronRight } from "lucide-react"

export function Tutorial() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Tutorial</h3>
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer">
        <div>
          <p className="font-semibold text-foreground">How to link to FreeCharge?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-foreground text-background p-3 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
