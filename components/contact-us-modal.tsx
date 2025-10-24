"use client"

import { X, MessageCircle, Send } from "lucide-react"

interface ContactUsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-background rounded-t-2xl p-6 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Telegram */}
          <a
            href="https://t.me/bnsl_boy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Telegram</h3>
              <p className="text-sm text-muted-foreground">Chat with us on Telegram</p>
            </div>
            <Send className="w-5 h-5 text-muted-foreground" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Message us on WhatsApp</p>
            </div>
            <Send className="w-5 h-5 text-muted-foreground" />
          </a>

          {/* Email */}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  )
}
