"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  Play,
  Award,
  CheckCircle,
  ChevronRight,
  Users,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import CourseDetail from "@/components/course-detail"
import CompletionModal from "@/components/completion-modal"

export default function LearningHub() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
  }

  // Handle back to courses
  const handleBackToCourses = () => {
    setSelectedCourse(null)
  }

  // Handle lesson completion
  const handleLessonComplete = () => {
    setShowCompletionModal(true)
  }

  // If a course is selected, show the course detail view
  if (selectedCourse) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 hover:text-pink-600"
          onClick={handleBackToCourses}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Hub
        </Button>

        <CourseDetail course={selectedCourse} onComplete={handleLessonComplete} />

        {showCompletionModal && (
          <CompletionModal
            open={showCompletionModal}
            onClose={() => setShowCompletionModal(false)}
            level={selectedCourse.level}
            points={150}
          />
        )}
      </div>
    )
  }

  // Otherwise show the main learning hub
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Learning Hub</h1>
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1 text-sm">Level 4</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Progress and Current Courses */}
        <div className="md:col-span-2 space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Your Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Level 4 - Communication Patterns</span>
                  </div>
                  <Progress value={70} className="h-2 w-full md:w-64" />
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>70% Complete</span>
                    <span>3/5 Lessons</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Communication
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Daily Living
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Emotion Regulation</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Your Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                  <div className="space-y-4">
                    {currentCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onSelect={() => handleCourseSelect(course)} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="space-y-4">
                    {completedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onSelect={() => handleCourseSelect(course)} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="all">
                  <div className="space-y-4">
                    {[...currentCourses, ...completedCourses, ...upcomingCourses].map((course) => (
                      <CourseCard key={course.id} course={course} onSelect={() => handleCourseSelect(course)} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recommendations */}
        <div className="space-y-6">
          {/* Social Stories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Social Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-4">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-medium">Create Custom Social Stories</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Generate personalized social stories to help understand social situations and expectations.
                </p>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => (window.location.href = "/learning/social-stories")}
                >
                  Create a Social Story
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Recommended Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                View All Articles
              </Button>
            </CardFooter>
          </Card>

          {/* Live Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Live Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveClasses.map((liveClass) => (
                  <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-800">
                View All Classes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Course Card Component
function CourseCard({ course, onSelect }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className={`bg-${course.color}-100 p-2 rounded-full mr-3`}>
              <BookOpen className={`h-5 w-5 text-${course.color}-600`} />
            </div>
            <div>
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-500">Level {course.level}</p>
            </div>
          </div>
          <Badge
            className={`${
              course.status === "completed"
                ? "bg-green-100 text-green-800"
                : course.status === "in-progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {course.status === "completed"
              ? "Completed"
              : course.status === "in-progress"
                ? "In Progress"
                : "Not Started"}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-3">{course.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {course.lessons} Lessons - {course.duration}
            </span>
          </div>
          {course.progress > 0 && (
            <span className="text-sm font-medium text-blue-600">{course.progress}% Complete</span>
          )}
        </div>

        {course.progress > 0 && <Progress value={course.progress} className="h-1 mb-3" />}

        <Button
          className={`w-full ${
            course.status === "completed"
              ? "bg-green-600 hover:bg-green-700"
              : course.status === "in-progress"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {course.status === "completed"
            ? "Review Course"
            : course.status === "in-progress"
              ? "Continue Learning"
              : "Start Course"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </Card>
  )
}

// Article Card Component
function ArticleCard({ article }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="bg-blue-100 p-2 rounded-full">
        <BookOpen className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <h3 className="font-medium text-sm">{article.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{article.readTime} min read</p>
      </div>
    </div>
  )
}

// Live Class Card Component
function LiveClassCard({ liveClass }) {
  return (
    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-3 mb-2">
        <div className={`bg-${liveClass.color}-100 p-2 rounded-full`}>
          <liveClass.icon className={`h-4 w-4 text-${liveClass.color}-600`} />
        </div>
        <h3 className="font-medium">{liveClass.title}</h3>
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-2 ml-11">
        <Users className="h-3 w-3 mr-1" />
        <span>{liveClass.instructor}</span>
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-3 ml-11">
        <Calendar className="h-3 w-3 mr-1" />
        <span>
          {liveClass.date}, {liveClass.time}
        </span>
      </div>
      <div className="flex items-center justify-between ml-11">
        <Badge className="bg-yellow-100 text-yellow-800">+{liveClass.points} pts</Badge>
        <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
          <Play className="h-3 w-3 mr-1" />
          Join Live
        </Button>
      </div>
    </div>
  )
}

// Sample data
const currentCourses = [
  {
    id: 1,
    title: "Recognize Communication Patterns",
    description: "Learn to identify and understand different communication patterns in children with autism.",
    level: "4.2",
    lessons: 5,
    duration: "3 Hours",
    progress: 60,
    status: "in-progress",
    color: "blue",
    modules: [
      {
        id: 1,
        title: "Introduction to Communication Patterns",
        completed: true,
        duration: "30 min",
      },
      {
        id: 2,
        title: "The Avoidance Pattern",
        completed: true,
        duration: "45 min",
      },
      {
        id: 3,
        title: "Eye Contact and Engagement",
        completed: true,
        duration: "30 min",
      },
      {
        id: 4,
        title: "Verbal vs. Non-verbal Communication",
        completed: false,
        duration: "45 min",
        current: true,
      },
      {
        id: 5,
        title: "Building Communication Skills",
        completed: false,
        duration: "30 min",
      },
    ],
  },
  {
    id: 2,
    title: "Emotion Regulation Techniques",
    description: "Strategies to help children recognize and manage their emotions effectively.",
    level: "4.3",
    lessons: 4,
    duration: "2.5 Hours",
    progress: 25,
    status: "in-progress",
    color: "purple",
  },
]

const completedCourses = [
  {
    id: 3,
    title: "Daily Living Skills",
    description: "Practical approaches to develop independence in everyday activities.",
    level: "4.1",
    lessons: 6,
    duration: "4 Hours",
    progress: 100,
    status: "completed",
    color: "green",
  },
  {
    id: 4,
    title: "Social Interaction Basics",
    description: "Foundational skills for successful social interactions and relationship building.",
    level: "3.3",
    lessons: 5,
    duration: "3.5 Hours",
    progress: 100,
    status: "completed",
    color: "pink",
  },
]

const upcomingCourses = [
  {
    id: 5,
    title: "Sensory Processing",
    description: "Understanding sensory sensitivities and developing coping strategies.",
    level: "4.4",
    lessons: 6,
    duration: "3.5 Hours",
    progress: 0,
    status: "not-started",
    color: "yellow",
  },
]

const recommendedArticles = [
  {
    id: 1,
    title: "Tips on positive reinforcement",
    readTime: 5,
  },
  {
    id: 2,
    title: "Creating visual schedules that work",
    readTime: 7,
  },
  {
    id: 3,
    title: "Managing sensory overload in public spaces",
    readTime: 10,
  },
  {
    id: 4,
    title: "Building language through play",
    readTime: 8,
  },
]

const liveClasses = [
  {
    id: 1,
    title: "Communication Strategies",
    instructor: "Dr. Sarah Johnson",
    date: "Today",
    time: "3:00 PM",
    points: 20,
    icon: Users,
    color: "blue",
  },
  {
    id: 2,
    title: "Sensory-Friendly Activities",
    instructor: "Emily Rodriguez",
    date: "Tomorrow",
    time: "11:00 AM",
    points: 15,
    icon: Calendar,
    color: "purple",
  },
]
