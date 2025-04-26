"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageCircle, CalendarIcon, Users, Edit2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatModal from "@/components/chat-modal"

export default function HelpCenter() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Help Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Quick Help */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 border-pink-100">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e-x6WLcrEDK30PatqLR9XFVHf78U0X95.png"
                    alt="Doctor illustration"
                    className="h-32 w-32 object-contain"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">24/7 Online Specialists</h2>
                  <p className="text-gray-600 mb-4">
                    Our team of specialists is available around the clock to provide guidance, answer questions, and
                    offer support whenever you need it.
                  </p>
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600" onClick={() => setChatOpen(true)}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Ask A Doctor
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Book Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="specialist" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="specialist">Specialist</TabsTrigger>
                  <TabsTrigger value="nanny">Nanny</TabsTrigger>
                </TabsList>
                <TabsContent value="specialist">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specialists.map((specialist) => (
                      <SpecialistCard key={specialist.id} specialist={specialist} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="nanny">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nannies.map((nanny) => (
                      <NannyCard key={nanny.id} nanny={nanny} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - My Appointments */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-700">My Appointments</CardTitle>
              <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Help Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Support Groups
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Therapy Sessions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

// Specialist Card Component
function SpecialistCard({ specialist }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={
                specialist.id === 1
                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c-iPyHI.png"
                  : specialist.avatar || "/placeholder.svg"
              }
              alt={specialist.name}
            />
            <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{specialist.name}</h3>
            <p className="text-sm text-gray-500">{specialist.specialty}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Available: {specialist.availability}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {specialist.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
      </div>
    </Card>
  )
}

// Nanny Card Component
function NannyCard({ nanny }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={
                nanny.id === 1
                  ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d-oDNOR.png"
                  : nanny.avatar || "/placeholder.svg"
              }
              alt={nanny.name}
            />
            <AvatarFallback>{nanny.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{nanny.name}</h3>
            <p className="text-sm text-gray-500">{nanny.experience} years experience</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Available: {nanny.availability}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {nanny.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
              {skill}
            </Badge>
          ))}
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700">Book Childcare</Button>
      </div>
    </Card>
  )
}

// Appointment Card Component
function AppointmentCard({ appointment }) {
  return (
    <div className="p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`bg-${appointment.color}-100 p-2 rounded-full mr-3`}>
            <appointment.icon className={`h-4 w-4 text-${appointment.color}-600`} />
          </div>
          <h3 className="font-medium">{appointment.title}</h3>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 ml-11">{appointment.description}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2 ml-11">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {appointment.date}, {appointment.time}
        </span>
      </div>
    </div>
  )
}

// Sample data
const specialists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Child Psychologist",
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Mon, Wed, Fri",
    tags: ["Autism", "Therapy", "Behavior"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Developmental Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Tue, Thu, Sat",
    tags: ["Development", "Early Intervention"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Speech Therapist",
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Mon, Tue, Thu",
    tags: ["Speech", "Communication", "Language"],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Occupational Therapist",
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Wed, Fri, Sat",
    tags: ["Motor Skills", "Sensory Integration"],
  },
]

const nannies = [
  {
    id: 1,
    name: "Lisa Thompson",
    experience: 5,
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Weekdays",
    skills: ["Special Needs", "First Aid Certified"],
  },
  {
    id: 2,
    name: "Robert Garcia",
    experience: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Evenings & Weekends",
    skills: ["Autism Experience", "Activities"],
  },
  {
    id: 3,
    name: "Jennifer Lee",
    experience: 7,
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Flexible Hours",
    skills: ["Developmental Support", "Cooking"],
  },
  {
    id: 4,
    name: "David Miller",
    experience: 4,
    avatar: "/placeholder.svg?height=40&width=40",
    availability: "Weekends Only",
    skills: ["Behavioral Support", "Education"],
  },
]

const appointments = [
  {
    id: 1,
    title: "Child Counseling",
    description: "Session with Dr. Sarah Johnson",
    date: "Tomorrow",
    time: "10:00 AM",
    icon: MessageCircle,
    color: "blue",
  },
  {
    id: 2,
    title: "Speech Therapy",
    description: "Session with Dr. Emily Rodriguez",
    date: "Friday",
    time: "2:00 PM",
    icon: Users,
    color: "purple",
  },
  {
    id: 3,
    title: "Childcare",
    description: "With Lisa Thompson",
    date: "Saturday",
    time: "9:00 AM - 1:00 PM",
    icon: Calendar,
    color: "green",
  },
]
