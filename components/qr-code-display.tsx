"use client"

import { useEffect, useRef } from "react"

interface QRCodeDisplayProps {
  address: string
}

export function QRCodeDisplay({ address }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Simple QR code generation using a placeholder
    // In production, you'd use a library like qrcode.react or qr-code-styling
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 200
    canvas.height = 200

    // Draw white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 200, 200)

    // Draw QR code pattern (simplified representation)
    ctx.fillStyle = "black"

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillRect(x, y, 35, 35)
      ctx.fillStyle = "white"
      ctx.fillRect(x + 5, y + 5, 25, 25)
      ctx.fillStyle = "black"
      ctx.fillRect(x + 8, y + 8, 19, 19)
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(165, 0)
    drawFinderPattern(0, 165)

    // Draw timing patterns
    ctx.fillStyle = "black"
    for (let i = 8; i < 192; i += 2) {
      ctx.fillRect(i, 6, 1, 1)
      ctx.fillRect(6, i, 1, 1)
    }

    // Draw data area with pattern
    ctx.fillStyle = "black"
    for (let i = 0; i < 150; i++) {
      for (let j = 0; j < 150; j++) {
        if (Math.random() > 0.5 && i > 40 && j > 40) {
          ctx.fillRect(50 + i, 50 + j, 1, 1)
        }
      }
    }

    // Draw white center area for address text
    ctx.fillStyle = "white"
    ctx.fillRect(40, 85, 120, 30)

    // Draw address text
    ctx.fillStyle = "black"
    ctx.font = "10px monospace"
    ctx.textAlign = "center"
    const shortAddress = address.slice(0, 6) + "..." + address.slice(-4)
    ctx.fillText(shortAddress, 100, 105)
  }, [address])

  return <canvas ref={canvasRef} className="border-2 border-border rounded-lg" />
}
