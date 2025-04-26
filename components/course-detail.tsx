"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

export default function CourseDetail({ course, onComplete }) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(
    course.modules ? course.modules.findIndex((m) => m.current) : 0,
  )

  const currentModule = course.modules ? course.modules[currentModuleIndex] : null

  const handleNext = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    } else {
      // If we're at the last module, trigger completion
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const handleModuleSelect = (index) => {
    setCurrentModuleIndex(index)
  }

  if (!course || !course.modules) {
    return (
      <div className="text-center py-10">
        <p>Course content is not available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left sidebar - Course modules */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">Course Modules</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-l-2 border-gray-200 ml-4 space-y-1 py-2">
              {course.modules.map((module, index) => (
                <div
                  key={module.id}
                  className={`relative pl-6 py-2 pr-2 cursor-pointer ${
                    index === currentModuleIndex ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleModuleSelect(index)}
                >
                  <div
                    className={`absolute left-[-5px] w-2 h-2 rounded-full ${
                      module.completed ? "bg-green-500" : index === currentModuleIndex ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          index === currentModuleIndex ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {module.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                    {module.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right content - Current module */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-blue-100 text-blue-800">
                  Module {currentModuleIndex + 1} of {course.modules.length}
                </Badge>
                <CardTitle>{currentModule.title}</CardTitle>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{currentModule.duration}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Module content would go here */}
            <div className="prose max-w-none">
              <h2>Learning Objectives</h2>
              <ul>
                <li>Understand the key components of {currentModule.title.toLowerCase()}</li>
                <li>Learn practical strategies for implementation</li>
                <li>Identify common challenges and solutions</li>
              </ul>

              <h2>Content</h2>
              <p>
                This module covers important aspects of {currentModule.title.toLowerCase()}
                in children with autism. You'll learn about evidence-based approaches and practical techniques you can
                apply immediately.
              </p>

              <div className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-blue-800 font-medium">Key Concept</h3>
                <p className="text-blue-700">
                  Children with autism often process information differently. Understanding their unique communication
                  patterns helps build stronger connections.
                </p>
              </div>

              <p>
                Through interactive examples and case studies, you'll develop skills to recognize and respond
                effectively to different communication styles.
              </p>

              {/* Placeholder for video or interactive content */}
              <div className="my-6 bg-gray-100 rounded-lg p-10 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive content would appear here</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentModuleIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button onClick={handleNext}>
                {currentModuleIndex < course.modules.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Complete Course"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
