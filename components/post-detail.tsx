"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  BookmarkPlus,
  MoreHorizontal,
  Flag,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Smile,
  Users,
  CheckCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function PostDetail({ post }) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(post.comments || [])
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes || 0)
  const [saved, setSaved] = useState(false)

  const categoryColors = {
    questions: "blue",
    tips: "yellow",
    success: "green",
    challenges: "red",
    support: "purple",
  }

  const categoryIcons = {
    questions: HelpCircle,
    tips: Lightbulb,
    success: Smile,
    challenges: AlertCircle,
    support: Users,
  }

  const CategoryIcon = categoryIcons[post.category] || MessageCircle
  const categoryColor = categoryColors[post.category] || "gray"
  const categoryLabel =
    {
      questions: "Questions",
      tips: "Tips & Advice",
      success: "Success Stories",
      challenges: "Challenges",
      support: "Support",
    }[post.category] || "Discussion"

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "Amy Miller",
        avatar: "/placeholder.svg?height=40&width=40&text=AM",
      },
      content: comment,
      date: "Just now",
      likes: 0,
    }

    setComments([...comments, newComment])
    setComment("")
  }

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar - Author Info */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={post.author.avatar || "/placeholder.svg?height=80&width=80"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg mb-1">{post.author.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Member since 2022</p>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Active Member
                </Badge>
                {post.author.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">Similar Discussions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">Similar topic about {post.category}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>{Math.floor(Math.random() * 20) + 5} comments</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Post and Comments */}
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`bg-${categoryColor}-100 text-${categoryColor}-800`}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {categoryLabel}
              </Badge>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p>{post.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${liked ? "text-pink-600" : "text-gray-500"}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{likesCount}</span>
                </Button>
                <div className="flex items-center text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{comments.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${saved ? "text-yellow-600" : "text-gray-500 hover:text-yellow-600"}`}
                  onClick={handleSave}
                >
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-700">
              Comments <span className="text-gray-500">({comments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="relative">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.author.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{comment.author.name}</h4>
                        {comment.author.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs py-0">
                            <CheckCircle className="h-2 w-2 mr-1" /> Verified
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500 hover:text-pink-600">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500">
                          Reply
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 absolute top-0 right-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32&text=AM" alt="Your Avatar" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  className="resize-none mb-2"
                  value={comment}
                  onChange={handleCommentChange}
                />
                <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
