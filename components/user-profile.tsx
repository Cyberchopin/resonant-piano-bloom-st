"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Calendar,
  BookOpen,
  MessageCircle,
  Heart,
  Star,
  Edit,
  ChevronRight,
  CheckCircle,
  Shield,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - User Info */}
        <div className="md:w-1/3 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-pink-200 to-purple-200"></div>
            <CardContent className="pt-0 relative">
              <div className="flex justify-between items-start">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md -mt-12">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a%20-%20Copy-vpiZ3u9PBMZn9m2huvRbb7hSk2savT.png"
                    alt="Amy"
                  />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mt-4 flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  Edit Profile
                </Button>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold">Amy Miller</h2>
                <p className="text-gray-500">Member since January 2023</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-purple-100 text-purple-800">Level 4</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Parent</Badge>
                  <Badge className="bg-green-100 text-green-800">Active Member</Badge>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="font-medium">Progress to Level 5</span>
                    </div>
                    <span className="text-sm text-gray-500">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Days Active</span>
                </div>
                <span className="font-medium">24</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">Courses Completed</span>
                </div>
                <span className="font-medium">7</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm">Forum Posts</span>
                </div>
                <span className="font-medium">12</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                    <Heart className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="text-sm">Events Attended</span>
                </div>
                <span className="font-medium">5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="md:w-2/3 space-y-6">
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Parent of a 6-year-old with autism. Passionate about finding resources and building a supportive
                    community. Love sharing experiences and learning from others on similar journeys.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start">
                        <div className={`p-2 rounded-full bg-${achievement.color}-100 mr-3`}>
                          <Star className={`h-4 w-4 text-${achievement.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className={`p-2 rounded-full bg-${activity.color}-100 mr-3`}>
                          <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map((badge) => (
                      <div key={badge.id} className="flex flex-col items-center p-4 border rounded-lg">
                        <div className={`p-3 rounded-full bg-${badge.color}-100 mb-3`}>
                          <badge.icon className={`h-6 w-6 text-${badge.color}-600`} />
                        </div>
                        <h4 className="font-medium text-center">{badge.title}</h4>
                        <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
                        <Badge className={`mt-2 bg-${badge.color}-100 text-${badge.color}-800`}>{badge.level}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Learning Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge
                            className={`bg-${milestone.completed ? "green" : "gray"}-100 text-${milestone.completed ? "green" : "gray"}-800`}
                          >
                            {milestone.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{milestone.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                            <span>{milestone.course}</span>
                          </div>
                          <span className="text-gray-500">{milestone.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Recent Forum Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {forumActivity.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{activity.title}</h4>
                          <Badge className={`bg-${activity.category.color}-100 text-${activity.category.color}-800`}>
                            {activity.category.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{activity.content}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-gray-500">{activity.comments}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-gray-500">{activity.likes}</span>
                            </div>
                          </div>
                          <span className="text-gray-500">{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                    View All Forum Activity
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Event Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventActivity.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge
                            className={`bg-${event.status === "Attended" ? "green" : event.status === "Registered" ? "blue" : "yellow"}-100 text-${event.status === "Attended" ? "green" : event.status === "Registered" ? "blue" : "yellow"}-800`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{event.type}</span>
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-800">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Personal Information</h4>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">Amy Miller</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">amy.miller@example.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">+1 (555) 123-4567</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">New York, USA</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Edit Information
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Notification Preferences</h4>
                    <Separator />
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive email updates about your activity</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive push notifications on this device</p>
                        </div>
                        <Switch id="push-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="event-reminders">Event Reminders</Label>
                          <p className="text-sm text-gray-500">Get reminders about upcoming events</p>
                        </div>
                        <Switch id="event-reminders" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="forum-notifications">Forum Activity</Label>
                          <p className="text-sm text-gray-500">Get notified about replies to your posts</p>
                        </div>
                        <Switch id="forum-notifications" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Privacy Settings</h4>
                    <Separator />
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <p className="text-sm text-gray-500">Make your profile visible to other community members</p>
                        </div>
                        <Switch id="profile-visibility" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="activity-sharing">Activity Sharing</Label>
                          <p className="text-sm text-gray-500">Share your activity with the community</p>
                        </div>
                        <Switch id="activity-sharing" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-700">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Google</h4>
                          <p className="text-sm text-gray-500">Connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Facebook</h4>
                          <p className="text-sm text-gray-500">Not Connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Apple</h4>
                          <p className="text-sm text-gray-500">Not Connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Sample data
const recentAchievements = [
  {
    id: 1,
    title: "Communication Master",
    description: "Completed all modules in Communication Patterns course",
    date: "2 days ago",
    color: "blue",
  },
  {
    id: 2,
    title: "Community Contributor",
    description: "Created 5 forum posts that helped other members",
    date: "1 week ago",
    color: "green",
  },
  {
    id: 3,
    title: "Learning Explorer",
    description: "Completed 3 different course categories",
    date: "2 weeks ago",
    color: "purple",
  },
]

const recentActivities = [
  {
    id: 1,
    title: "Posted in Forum",
    description: "Tips for helping with sensory overload in public places?",
    date: "2 hours ago",
    icon: MessageCircle,
    color: "blue",
  },
  {
    id: 2,
    title: "Completed Lesson",
    description: "Verbal vs. Non-verbal Communication",
    date: "Yesterday",
    icon: BookOpen,
    color: "green",
  },
  {
    id: 3,
    title: "Registered for Event",
    description: "Sensory-Friendly Playdate",
    date: "3 days ago",
    icon: Calendar,
    color: "yellow",
  },
]

const badges = [
  {
    id: 1,
    title: "Communication Expert",
    description: "Mastered communication techniques",
    level: "Level 3",
    icon: MessageCircle,
    color: "blue",
  },
  {
    id: 2,
    title: "Learning Enthusiast",
    description: "Completed 5+ courses",
    level: "Level 2",
    icon: BookOpen,
    color: "green",
  },
  {
    id: 3,
    title: "Community Supporter",
    description: "Helped 10+ community members",
    level: "Level 2",
    icon: Heart,
    color: "pink",
  },
  {
    id: 4,
    title: "Event Participant",
    description: "Attended 5+ community events",
    level: "Level 1",
    icon: Calendar,
    color: "yellow",
  },
  {
    id: 5,
    title: "Forum Contributor",
    description: "Created 10+ valuable posts",
    level: "Level 2",
    icon: MessageCircle,
    color: "purple",
  },
  {
    id: 6,
    title: "Daily Tracker",
    description: "Logged progress for 20+ days",
    level: "Level 3",
    icon: CheckCircle,
    color: "teal",
  },
]

const milestones = [
  {
    id: 1,
    title: "Communication Patterns",
    description: "Learn to identify and understand different communication patterns",
    course: "Communication Basics",
    date: "Completed on May 10, 2023",
    completed: true,
  },
  {
    id: 2,
    title: "Emotion Regulation",
    description: "Strategies to help recognize and manage emotions effectively",
    course: "Emotional Intelligence",
    date: "In progress - 60% complete",
    completed: false,
  },
  {
    id: 3,
    title: "Social Interaction Basics",
    description: "Foundational skills for successful social interactions",
    course: "Social Skills Development",
    date: "Completed on April 15, 2023",
    completed: true,
  },
  {
    id: 4,
    title: "Daily Living Skills",
    description: "Practical approaches to develop independence in everyday activities",
    course: "Life Skills",
    date: "Completed on March 22, 2023",
    completed: true,
  },
]

const forumActivity = [
  {
    id: 1,
    title: "Tips for helping with sensory overload in public places?",
    content:
      "My 6-year-old son gets overwhelmed in busy public places like malls and grocery stores. We've tried noise-cancelling headphones, but they don't always help. Does anyone have other strategies that have worked for your family?",
    date: "2 hours ago",
    comments: 3,
    likes: 24,
    category: { name: "Questions", color: "blue" },
  },
  {
    id: 2,
    title: "Success with visual communication system!",
    content:
      "After months of trying different approaches, we've finally found a visual communication system that works for our daughter! She's now able to express her basic needs and preferences using picture cards, and it's reduced her frustration significantly.",
    date: "3 days ago",
    comments: 5,
    likes: 42,
    category: { name: "Success Stories", color: "green" },
  },
  {
    id: 3,
    title: "Morning routine visual schedule that worked for us",
    content:
      "After lots of trial and error, we've created a morning routine visual schedule that has transformed our mornings from chaos to (relative) calm! I've included pictures of our setup and how we use it.",
    date: "1 week ago",
    comments: 8,
    likes: 36,
    category: { name: "Tips & Advice", color: "yellow" },
  },
]

const eventActivity = [
  {
    id: 1,
    title: "Sensory-Friendly Playdate",
    date: "May 20, 2023 • 10:00 AM",
    type: "In-Person Event",
    status: "Registered",
  },
  {
    id: 2,
    title: "Positive Communication Workshop",
    date: "May 15, 2023 • 2:00 PM",
    type: "Online Workshop",
    status: "Attended",
  },
  {
    id: 3,
    title: "Parent Support Circle",
    date: "May 8, 2023 • 7:00 PM",
    type: "Online Support Group",
    status: "Attended",
  },
  {
    id: 4,
    title: "Autism Awareness Fair",
    date: "June 5, 2023 • 11:00 AM",
    type: "Community Event",
    status: "Interested",
  },
]
