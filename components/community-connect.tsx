"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Heart,
  MessageCircle,
  User,
  Filter,
  CheckCircle,
  MessageSquare,
} from "lucide-react"
import EventDetailModal from "@/components/event-detail-modal"
import Link from "next/link"

export default function CommunityConnect() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [registeredEvents, setRegisteredEvents] = useState([])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle filter selection
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  // Handle event registration
  const handleEventRegister = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId])
    }
    setShowEventModal(false)
  }

  // Filter events based on search query and active filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "online") return matchesSearch && event.location === "Online"
    if (activeFilter === "in-person") return matchesSearch && event.location !== "Online"
    if (activeFilter === "registered") return matchesSearch && registeredEvents.includes(event.id)

    return matchesSearch
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Connect</h1>
        <Link href="/community/forum" className="ml-4">
          <Button variant="outline" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Discussion Forum
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search posts, events, users..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("all")}
              className={activeFilter === "all" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "mentor" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("mentor")}
              className={activeFilter === "mentor" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <User className="h-4 w-4 mr-1" />
              Mentors
            </Button>
            <Button
              variant={activeFilter === "support" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("support")}
              className={activeFilter === "support" ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              <Users className="h-4 w-4 mr-1" />
              Support Groups
            </Button>
            <Button
              variant={activeFilter === "online" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("online")}
              className={activeFilter === "online" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              Online
            </Button>
            <Button
              variant={activeFilter === "in-person" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("in-person")}
              className={activeFilter === "in-person" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              In-Person
            </Button>
            <Button
              variant={activeFilter === "registered" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("registered")}
              className={activeFilter === "registered" ? "bg-teal-500 hover:bg-teal-600" : ""}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Registered
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Events */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-700">Events For You</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelect={() => handleEventSelect(event)}
                      isRegistered={registeredEvents.includes(event.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No events match your search criteria.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("")
                        setActiveFilter("all")
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                View All Events
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Lead an Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <img
                      src="/placeholder.svg?height=120&width=120"
                      alt="Community leader"
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
                    <p className="text-gray-600 mb-4">
                      Help others by sharing your knowledge and experiences. Create an event or support group for the
                      community.
                    </p>
                    <Button className="bg-purple-500 hover:bg-purple-600">Create an Event</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Support Groups and Mentors */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Support Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="groups" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="groups">Groups</TabsTrigger>
                  <TabsTrigger value="mentors">Mentors</TabsTrigger>
                </TabsList>

                <TabsContent value="groups">
                  <div className="space-y-4">
                    {supportGroups.map((group) => (
                      <SupportGroupCard key={group.id} group={group} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="mentors">
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <MentorCard key={mentor.id} mentor={mentor} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                Find More Support
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Community Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityActivity.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={showEventModal}
          onClose={() => setShowEventModal(false)}
          onRegister={() => handleEventRegister(selectedEvent.id)}
          isRegistered={registeredEvents.includes(selectedEvent?.id)}
        />
      )}
    </div>
  )
}

// Event Card Component
function EventCard({ event, onSelect, isRegistered }) {
  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gray-100">
          <img
            src={event.image || "/placeholder.svg?height=150&width=150"}
            alt={event.title}
            className="w-full h-40 md:h-full object-cover"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            {isRegistered && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Registered
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500">
            <div className="flex items-center mb-2 sm:mb-0">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Support Group Card Component
function SupportGroupCard({ group }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={group.avatar || "/placeholder.svg?height=40&width=40"} alt={group.name} />
          <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{group.name}</h3>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            <span>{group.members} members</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <Avatar key={i} className="h-6 w-6 border-2 border-white">
              <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${i}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ))}
          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
            +{group.members - 3}
          </div>
        </div>
        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
          Join
        </Button>
      </div>
    </div>
  )
}

// Mentor Card Component
function MentorCard({ mentor }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={mentor.avatar || "/placeholder.svg?height=40&width=40"} alt={mentor.name} />
          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{mentor.name}</h3>
          <p className="text-xs text-gray-500">{mentor.title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mentor.bio}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {mentor.expertise.map((skill, index) => (
          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            {skill}
          </Badge>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" size="sm" className="text-pink-600 border-pink-200 hover:bg-pink-50">
          <Heart className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
          <MessageCircle className="h-4 w-4 mr-1" />
          Connect
        </Button>
      </div>
    </div>
  )
}

// Activity Card Component
function ActivityCard({ activity }) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.userAvatar || "/placeholder.svg?height=32&width=32"} alt={activity.userName} />
        <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm">
          <span className="font-medium">{activity.userName}</span> {activity.action}
        </p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  )
}

// Sample data
const events = [
  {
    id: 1,
    title: "Positive Communication Workshop",
    description:
      "Learn effective communication strategies for children with autism. This workshop will cover practical techniques for everyday interactions.",
    date: "May 15, 2023 • 2:00 PM",
    location: "Online",
    image: "/placeholder.svg?height=150&width=300&text=Communication+Workshop",
    tags: ["Therapy", "Communication", "Workshop"],
    host: "Dr. Sarah Johnson",
    duration: "2 hours",
    participants: 24,
    details:
      "This interactive workshop will provide parents and caregivers with practical communication strategies specifically designed for children with autism. Learn how to establish effective communication channels, understand non-verbal cues, and create a supportive environment for expression.",
  },
  {
    id: 2,
    title: "Sensory-Friendly Playdate",
    description:
      "Join us for a sensory-friendly playdate at Central Park. Activities designed for children with sensory sensitivities.",
    date: "May 20, 2023 • 10:00 AM",
    location: "Central Park, Main Playground",
    image: "/placeholder.svg?height=150&width=300&text=Sensory+Playdate",
    tags: ["In-Person", "Sensory", "Social"],
    host: "Autism Parents Network",
    duration: "3 hours",
    participants: 15,
    details:
      "This carefully designed playdate provides a safe and understanding environment for children with sensory sensitivities. Activities will include quiet zones, sensory stations, and structured play opportunities. Parents can connect while children enjoy sensory-appropriate activities.",
  },
  {
    id: 3,
    title: "Parent Support Circle",
    description:
      "A virtual support group for parents of children with autism to share experiences, challenges, and solutions.",
    date: "May 18, 2023 • 7:00 PM",
    location: "Online",
    image: "/placeholder.svg?height=150&width=300&text=Support+Circle",
    tags: ["Support", "Parents", "Discussion"],
    host: "Emily Rodriguez",
    duration: "1.5 hours",
    participants: 12,
    details:
      "Connect with other parents in a safe, supportive environment to share your experiences raising a child with autism. This facilitated discussion will focus on common challenges and practical solutions, with an emphasis on self-care strategies for parents and caregivers.",
  },
  {
    id: 4,
    title: "Autism Awareness Fair",
    description:
      "Community fair featuring resources, activities, and information booths about autism support services.",
    date: "June 5, 2023 • 11:00 AM",
    location: "Community Center, 123 Main St",
    image: "/placeholder.svg?height=150&width=300&text=Awareness+Fair",
    tags: ["Community", "Resources", "Activities"],
    host: "Autism Support Alliance",
    duration: "5 hours",
    participants: 150,
    details:
      "This comprehensive community fair brings together local resources, service providers, and support organizations focused on autism. Explore information booths, participate in family-friendly activities, attend mini-workshops, and connect with other families in your community.",
  },
]

const supportGroups = [
  {
    id: 1,
    name: "Autism Parents Network",
    description: "A supportive community for parents of children with autism to share experiences and resources.",
    members: 128,
    avatar: "/placeholder.svg?height=40&width=40&text=APN",
  },
  {
    id: 2,
    name: "Siblings Support Circle",
    description: "A group focused on supporting siblings of children with autism through shared experiences.",
    members: 56,
    avatar: "/placeholder.svg?height=40&width=40&text=SSC",
  },
  {
    id: 3,
    name: "Sensory Processing Group",
    description: "Discussion and support around sensory processing challenges and strategies.",
    members: 94,
    avatar: "/placeholder.svg?height=40&width=40&text=SPG",
  },
]

const mentors = [
  {
    id: 1,
    name: "Dr. Michael Chen",
    title: "Child Development Specialist",
    bio: "15+ years experience working with children on the autism spectrum. Specializes in early intervention.",
    expertise: ["Early Intervention", "Behavior Support"],
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
  },
  {
    id: 2,
    name: "Lisa Thompson",
    title: "Special Education Teacher",
    bio: "Experienced educator with focus on inclusive teaching methods and individualized learning plans.",
    expertise: ["Education", "IEP Planning"],
    avatar: "/placeholder.svg?height=40&width=40&text=LT",
  },
  {
    id: 3,
    name: "James Wilson",
    title: "Parent Mentor",
    bio: "Father of two children with autism sharing practical advice from personal experience.",
    expertise: ["Daily Living", "Family Support"],
    avatar: "/placeholder.svg?height=40&width=40&text=JW",
  },
]

const communityActivity = [
  {
    id: 1,
    userName: "Sarah K.",
    userAvatar: "/placeholder.svg?height=32&width=32&text=SK",
    action: "joined the Autism Parents Network group",
    time: "2 hours ago",
  },
  {
    id: 2,
    userName: "David M.",
    userAvatar: "/placeholder.svg?height=32&width=32&text=DM",
    action: "registered for Positive Communication Workshop",
    time: "Yesterday",
  },
  {
    id: 3,
    userName: "Jennifer L.",
    userAvatar: "/placeholder.svg?height=32&width=32&text=JL",
    action: "posted a question about sensory toys",
    time: "2 days ago",
  },
  {
    id: 4,
    userName: "Robert G.",
    userAvatar: "/placeholder.svg?height=32&width=32&text=RG",
    action: "connected with Dr. Michael Chen",
    time: "3 days ago",
  },
]
