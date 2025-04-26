"use client"

import { useState } from "react"
import { X, HelpCircle, Lightbulb, Smile, AlertCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface NewPostModalProps {
  open: boolean
  onClose: () => void
}

export default function NewPostModal({ open, onClose }: NewPostModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("questions")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [step, setStep] = useState(1)

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
  }

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value)
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleNextStep = () => {
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = () => {
    // Here you would typically submit the post to your backend
    console.log({ title, content, category, tags })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Post Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={handleTitleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-base font-medium">
                  Post Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={content}
                  onChange={handleContentChange}
                  className="mt-1 min-h-[200px]"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNextStep} disabled={!title.trim() || !content.trim()}>
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Category</Label>
                <RadioGroup value={category} onValueChange={handleCategoryChange} className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="questions" id="questions" />
                      <Label htmlFor="questions" className="flex items-center cursor-pointer">
                        <HelpCircle className="h-4 w-4 text-blue-500 mr-2" />
                        Questions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tips" id="tips" />
                      <Label htmlFor="tips" className="flex items-center cursor-pointer">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                        Tips & Advice
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="success" id="success" />
                      <Label htmlFor="success" className="flex items-center cursor-pointer">
                        <Smile className="h-4 w-4 text-green-500 mr-2" />
                        Success Stories
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="challenges" id="challenges" />
                      <Label htmlFor="challenges" className="flex items-center cursor-pointer">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        Challenges
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="support" id="support" />
                      <Label htmlFor="support" className="flex items-center cursor-pointer">
                        <Users className="h-4 w-4 text-purple-500 mr-2" />
                        Support
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="tags" className="text-base font-medium">
                  Tags (up to 5)
                </Label>
                <div className="mt-1">
                  <Input
                    id="tags"
                    placeholder="Add tags and press Enter"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={tags.length >= 5}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        #{tag}
                        <button
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => removeTag(tag)}
                          aria-label="Remove tag"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{tags.length}/5 tags used. Press Enter to add a tag.</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={!category}>
                  Post Discussion
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
