"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MessageCircle, Heart, Clock, ChevronRight, Users, Sparkles } from "lucide-react"
import { useState } from "react"
import ProgressChart from "@/components/progress-chart"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hi, Amy!</h1>
        <img src="/placeholder.svg?height=30&width=30&text=👋" alt="Wave" className="ml-2 h-8 w-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 border-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                Socialization Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-purple-600">Level 4</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="text-lg text-gray-500">Level 5</span>
                    </div>
                    <span className="text-sm text-gray-500">70%</span>
                  </div>
                  <Progress value={70} className="h-2 mb-4" />
                </div>

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  classNames={{
                    day_selected: "bg-pink-500 text-white hover:bg-pink-600 focus:bg-pink-600",
                    day_today: "bg-pink-100 text-pink-700",
                  }}
                />
                <div className="flex justify-center mt-2 gap-4 text-xs">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-400 mr-1"></span>
                    <span className="text-gray-500">Communication</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-pink-400 mr-1"></span>
                    <span className="text-gray-500">Daily living</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-purple-400 mr-1"></span>
                    <span className="text-gray-500">Emotion</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
                <ProgressChart />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-50">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-pink-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Key Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-medium">Communication</span>
                      <div className="flex items-center mt-1">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mr-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-xs text-gray-500">3/5 days</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">+15 pts</Badge>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-pink-100 p-2 rounded-full mr-3">
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <span className="font-medium">Positive feedback</span>
                      <div className="flex items-center mt-1">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mr-2">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <span className="text-xs text-gray-500">2 records</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-pink-100 text-pink-800">+10 pts</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-2 border-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                Piano Heartbeat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <img src="/placeholder.svg?height=40&width=40&text=🎵" alt="Music" className="h-8 w-8 mr-2" />
                  <h3 className="font-medium text-purple-800">Interactive Experience</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Create beautiful visual and sound patterns with our interactive sensory experience.
                </p>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => (window.location.href = "/piano-heartbeat")}
                >
                  Open Piano Heartbeat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-50">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M3 10H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <CalendarIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Child Counseling</h3>
                      <p className="text-xs text-gray-500">Topic: Therapy</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2 ml-11">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Support Group</h3>
                      <p className="text-xs text-gray-500">Topic: Sharing Experiences</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2 ml-11">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Friday, 2:00 PM</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
              >
                View All Events
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-50">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2V4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 20V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.93 4.93L6.34 6.34"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.66 17.66L19.07 19.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 12H22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.34 17.66L4.93 19.07"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.07 4.93L17.66 6.34"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Daily Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <img src="/placeholder.svg?height=40&width=40&text=💡" alt="Tip" className="h-8 w-8 mr-2" />
                  <h3 className="font-medium text-blue-800">Positive Reinforcement</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Celebrate small wins! Acknowledge and reward positive behaviors to encourage their repetition.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Read more tips
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
