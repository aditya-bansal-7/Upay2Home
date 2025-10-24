export function CurrencyRatios() {
  return (
    <div className="bg-muted rounded-xl p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground text-sm mb-2">USDT Ratio</p>
          <p className="text-lg font-bold text-foreground">1 USDT ≈ 98.94 INR</p>
          <p className="text-xs text-muted-foreground mt-1">Bonus ratio: 2%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm mb-2">INR Bonus Ratio</p>
          <p className="text-2xl font-bold text-foreground">4%</p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">You're not bound to UPI!</p>
    </div>
  )
}
