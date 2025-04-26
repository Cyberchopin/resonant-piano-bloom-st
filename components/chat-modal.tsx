"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface ChatModalProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: number
  sender: "user" | "doctor"
  text: string
  time: string
}

export default function ChatModal({ open, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "doctor",
      text: "Hi, I'm Dr. Simmons. How can I help you today?",
      time: "Just now",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      time: "Just now",
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate doctor response after a short delay
    setTimeout(() => {
      const doctorMessage: Message = {
        id: messages.length + 2,
        sender: "doctor",
        text: "Thank you for your message. I understand your concern. Let me help you with that.",
        time: "Just now",
      }
      setMessages((prev) => [...prev, doctorMessage])
    }, 1000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-[500px] flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="bg-pink-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Simmons" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Dr. Simmons</h3>
              <p className="text-xs text-pink-100">Online • Child Specialist</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-pink-600">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div className="border-t p-3">
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend()
              }}
            />
            <Button onClick={handleSend} size="icon" className="bg-pink-500 hover:bg-pink-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
