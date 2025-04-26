"use client"

import { X, Calendar, MapPin, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface EventDetailModalProps {
  event: any
  open: boolean
  onClose: () => void
  onRegister: () => void
  isRegistered: boolean
}

export default function EventDetailModal({ event, open, onClose, onRegister, isRegistered }: EventDetailModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleRegister = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      onRegister()
    }, 1500)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header with close button */}
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg?height=200&width=600"}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 bg-white/80 hover:bg-white text-gray-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        {showConfirmation ? (
          <div className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Confirmed!</h2>
            <p className="text-gray-600 mb-6">You're all set for {event.title}</p>
            <p className="text-sm text-gray-500 mb-6">
              We've added this event to your calendar. You'll receive a reminder before the event starts.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{event.title}</h2>
              {isRegistered && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> Registered
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-pink-500" />
                <span>{event.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2 text-pink-500" />
                <span>{event.participants} participants</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">About this event</h3>
              <p className="text-gray-600">{event.details || event.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Host</h3>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={event.host} />
                  <AvatarFallback>{event.host.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.host}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isRegistered ? (
                <Button className="bg-pink-500 hover:bg-pink-600 flex-1" onClick={handleRegister}>
                  Register for Event
                </Button>
              ) : (
                <Button className="bg-red-500 hover:bg-red-600 flex-1">Cancel Registration</Button>
              )}
              <Button variant="outline" className="flex-1">
                Save for Later
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
