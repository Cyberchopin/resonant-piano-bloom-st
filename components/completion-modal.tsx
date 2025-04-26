"use client"

import { X, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface CompletionModalProps {
  open: boolean
  onClose: () => void
  level: string
  points: number
}

export default function CompletionModal({ open, onClose, level, points }: CompletionModalProps) {
  useEffect(() => {
    if (open) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="mb-4 flex justify-center">
            <div className="bg-white/20 rounded-full p-4">
              <Award className="h-12 w-12" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1">Congratulations!</h2>
          <p className="text-white/80">You've completed Level {level}!</p>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">You've earned</p>
            <p className="text-3xl font-bold text-purple-600">+{points} points</p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button className="bg-purple-600 hover:bg-purple-700">Add To Memory</Button>
            <Button variant="outline" onClick={onClose}>
              Back to Learning Hub
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
