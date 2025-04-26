"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageSquare,
  Share2,
  BookmarkPlus,
  Filter,
  PlusCircle,
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Smile,
} from "lucide-react"
import NewPostModal from "@/components/new-post-modal"
import PostDetail from "@/components/post-detail"
import Link from "next/link"

export default function CommunityForum() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSort, setActiveSort] = useState("trending")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  // Handle sort selection
  const handleSortChange = (sort) => {
    setActiveSort(sort)
  }

  // Handle post selection
  const handlePostSelect = (post) => {
    setSelectedPost(post)
  }

  // Handle back to forum
  const handleBackToForum = () => {
    setSelectedPost(null)
  }

  // Filter posts based on search query and active category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeCategory === "all") return matchesSearch
    return matchesSearch && post.category === activeCategory
  })

  // Sort posts based on active sort
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeSort === "trending") return b.likes - a.likes
    if (activeSort === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (activeSort === "most-commented") return b.comments.length - a.comments.length
    return 0
  })

  // If a post is selected, show the post detail view
  if (selectedPost) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 hover:text-pink-600"
          onClick={handleBackToForum}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        <PostDetail post={selectedPost} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/community">
              <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-pink-600 -ml-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Community
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Discussion Forum</h1>
          </div>
          <p className="text-gray-500 mt-1">Connect, share, and learn from other community members</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setShowNewPostModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Tabs defaultValue="trending" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="trending" onClick={() => handleSortChange("trending")}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent" onClick={() => handleSortChange("recent")}>
                  <Clock className="h-4 w-4 mr-1" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="most-commented" onClick={() => handleSortChange("most-commented")}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Active
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <CategoryButton
                  icon={MessageSquare}
                  label="All Topics"
                  count={posts.length}
                  active={activeCategory === "all"}
                  onClick={() => handleCategoryChange("all")}
                />
                <CategoryButton
                  icon={HelpCircle}
                  label="Questions"
                  count={posts.filter((p) => p.category === "questions").length}
                  active={activeCategory === "questions"}
                  onClick={() => handleCategoryChange("questions")}
                  color="blue"
                />
                <CategoryButton
                  icon={Lightbulb}
                  label="Tips & Advice"
                  count={posts.filter((p) => p.category === "tips").length}
                  active={activeCategory === "tips"}
                  onClick={() => handleCategoryChange("tips")}
                  color="yellow"
                />
                <CategoryButton
                  icon={Smile}
                  label="Success Stories"
                  count={posts.filter((p) => p.category === "success").length}
                  active={activeCategory === "success"}
                  onClick={() => handleCategoryChange("success")}
                  color="green"
                />
                <CategoryButton
                  icon={AlertCircle}
                  label="Challenges"
                  count={posts.filter((p) => p.category === "challenges").length}
                  active={activeCategory === "challenges"}
                  onClick={() => handleCategoryChange("challenges")}
                  color="red"
                />
                <CategoryButton
                  icon={Users}
                  label="Support"
                  count={posts.filter((p) => p.category === "support").length}
                  active={activeCategory === "support"}
                  onClick={() => handleCategoryChange("support")}
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag.name}
                    variant="outline"
                    className="bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    #{tag.name} <span className="ml-1 text-gray-400">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Forum Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and supportive</li>
                <li>• Share personal experiences</li>
                <li>• Respect privacy and confidentiality</li>
                <li>• No promotional content</li>
              </ul>
              <Button variant="link" className="p-0 h-auto mt-2 text-pink-600">
                Read full guidelines
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Posts */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-gray-700">
                {activeCategory === "all" ? "All Discussions" : categoryLabels[activeCategory]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedPosts.length > 0 ? (
                <div className="space-y-4">
                  {sortedPosts.map((post) => (
                    <PostCard key={post.id} post={post} onSelect={() => handlePostSelect(post)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No discussions found</h3>
                  <p className="text-gray-500 mb-4">Be the first to start a discussion in this category</p>
                  <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setShowNewPostModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                </div>
              )}
            </CardContent>
            {sortedPosts.length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Load More
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal open={showNewPostModal} onClose={() => setShowNewPostModal(false)} />
    </div>
  )
}

// Category Button Component
function CategoryButton({ icon: Icon, label, count, active, onClick, color = "gray" }) {
  const colorClasses = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
  }

  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${
        active ? `${colorClasses[color]} font-medium` : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className={`h-4 w-4 mr-2 ${active ? `text-${color}-500` : "text-gray-500"}`} />
        <span>{label}</span>
      </div>
      <Badge variant="outline" className={active ? `bg-${color}-50` : "bg-gray-50"}>
        {count}
      </Badge>
    </button>
  )
}

// Post Card Component
function PostCard({ post, onSelect }) {
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

  const CategoryIcon = categoryIcons[post.category] || MessageSquare
  const categoryColor = categoryColors[post.category] || "gray"

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`bg-${categoryColor}-100 text-${categoryColor}-800`}>
              <CategoryIcon className="h-3 w-3 mr-1" />
              {categoryLabels[post.category]}
            </Badge>
            <span className="text-xs text-gray-500">{post.date}</span>
          </div>
          <h3 className="font-medium text-lg mb-1">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-500">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{post.comments.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-pink-600">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Category labels
const categoryLabels = {
  questions: "Questions",
  tips: "Tips & Advice",
  success: "Success Stories",
  challenges: "Challenges",
  support: "Support",
}

// Sample data
const posts = [
  {
    id: 1,
    title: "Tips for helping with sensory overload in public places?",
    content:
      "My 6-year-old son gets overwhelmed in busy public places like malls and grocery stores. We've tried noise-cancelling headphones, but they don't always help. Does anyone have other strategies that have worked for your family?",
    author: {
      name: "Sarah K.",
      avatar: "/placeholder.svg?height=40&width=40&text=SK",
    },
    date: "2 hours ago",
    category: "questions",
    tags: ["sensory", "public", "strategies"],
    likes: 24,
    comments: [
      {
        id: 1,
        author: {
          name: "Michael C.",
          avatar: "/placeholder.svg?height=40&width=40&text=MC",
        },
        content:
          "We use a visual schedule with pictures of what to expect during the outing. It helps my daughter prepare mentally for the experience.",
        date: "1 hour ago",
        likes: 8,
      },
      {
        id: 2,
        author: {
          name: "Jennifer L.",
          avatar: "/placeholder.svg?height=40&width=40&text=JL",
        },
        content:
          "Weighted vests have been a game-changer for us! The deep pressure seems to help my son stay regulated in busy environments.",
        date: "45 minutes ago",
        likes: 5,
      },
      {
        id: 3,
        author: {
          name: "David M.",
          avatar: "/placeholder.svg?height=40&width=40&text=DM",
        },
        content:
          "We practice 'sensory breaks' - finding a quiet corner or even sitting in the car for 5 minutes when things get overwhelming. Having an exit strategy is key for us.",
        date: "30 minutes ago",
        likes: 12,
      },
    ],
  },
  {
    id: 2,
    title: "Success with visual communication system!",
    content:
      "After months of trying different approaches, we've finally found a visual communication system that works for our daughter! She's now able to express her basic needs and preferences using picture cards, and it's reduced her frustration significantly. Just wanted to share our success and encourage others who might be struggling with communication challenges.",
    author: {
      name: "Emily R.",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
    },
    date: "Yesterday",
    category: "success",
    tags: ["communication", "visual-supports", "progress"],
    likes: 56,
    comments: [
      {
        id: 1,
        author: {
          name: "Lisa T.",
          avatar: "/placeholder.svg?height=40&width=40&text=LT",
        },
        content: "That's wonderful! Which system are you using? We're looking into options for our son.",
        date: "22 hours ago",
        likes: 3,
      },
      {
        id: 2,
        author: {
          name: "Robert G.",
          avatar: "/placeholder.svg?height=40&width=40&text=RG",
        },
        content:
          "Congratulations! It's amazing how the right tools can make such a difference. We had a similar breakthrough with a tablet-based AAC app.",
        date: "20 hours ago",
        likes: 7,
      },
    ],
  },
  {
    id: 3,
    title: "Advice needed for IEP meeting next week",
    content:
      "We have our first IEP meeting next week and I'm feeling overwhelmed. What are the most important things I should advocate for? What questions should I ask? Any advice from parents who've been through this process would be greatly appreciated.",
    author: {
      name: "James W.",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
    },
    date: "2 days ago",
    category: "support",
    tags: ["education", "IEP", "advocacy"],
    likes: 32,
    comments: [
      {
        id: 1,
        author: {
          name: "Dr. Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40&text=SJ",
          verified: true,
        },
        content:
          "Bring documentation of your child's needs and strengths. Request specific accommodations that have worked at home. Remember you can take time to review the IEP before signing - you don't have to decide everything in the meeting.",
        date: "1 day ago",
        likes: 15,
      },
      {
        id: 2,
        author: {
          name: "Patricia M.",
          avatar: "/placeholder.svg?height=40&width=40&text=PM",
        },
        content:
          "I always bring someone with me as support - either my partner or a friend who can take notes while I focus on the discussion. Also, prepare a one-page summary of your child's strengths, challenges, and goals to share with the team.",
        date: "1 day ago",
        likes: 10,
      },
    ],
  },
  {
    id: 4,
    title: "Morning routine visual schedule that worked for us",
    content:
      "After lots of trial and error, we've created a morning routine visual schedule that has transformed our mornings from chaos to (relative) calm! I've included pictures of our setup and how we use it. The key was breaking down each step into very small parts and using actual photos of our bathroom/kitchen/etc.",
    author: {
      name: "Michelle P.",
      avatar: "/placeholder.svg?height=40&width=40&text=MP",
    },
    date: "3 days ago",
    category: "tips",
    tags: ["routines", "visual-supports", "mornings"],
    likes: 47,
    comments: [
      {
        id: 1,
        author: {
          name: "Thomas K.",
          avatar: "/placeholder.svg?height=40&width=40&text=TK",
        },
        content: "This is brilliant! Would you mind sharing the template you used for your schedule?",
        date: "2 days ago",
        likes: 5,
      },
      {
        id: 2,
        author: {
          name: "Samantha B.",
          avatar: "/placeholder.svg?height=40&width=40&text=SB",
        },
        content:
          "We've been struggling with mornings too. I love the idea of using actual photos of your home spaces. Going to try this tomorrow!",
        date: "2 days ago",
        likes: 8,
      },
    ],
  },
  {
    id: 5,
    title: "Struggling with meltdowns after school",
    content:
      "My 8-year-old daughter has been having intense meltdowns almost every day after school. She seems to hold it together during the school day but falls apart as soon as she gets home. Has anyone else experienced this? How do you help your child decompress after school?",
    author: {
      name: "Daniel F.",
      avatar: "/placeholder.svg?height=40&width=40&text=DF",
    },
    date: "4 days ago",
    category: "challenges",
    tags: ["meltdowns", "school", "regulation"],
    likes: 38,
    comments: [
      {
        id: 1,
        author: {
          name: "Lisa T.",
          avatar: "/placeholder.svg?height=40&width=40&text=LT",
        },
        content:
          "This is so common! It's called 'delayed emotional response' or sometimes 'after-school restraint collapse.' My son needs about 30 minutes of quiet time with no demands when he gets home. We have a special calm-down corner with his favorite sensory tools.",
        date: "3 days ago",
        likes: 20,
      },
      {
        id: 2,
        author: {
          name: "Michael C.",
          avatar: "/placeholder.svg?height=40&width=40&text=MC",
        },
        content:
          "We had the same issue. What helped us was creating a very predictable after-school routine that includes a snack, some physical activity (usually jumping on a mini-trampoline), and then quiet time before we even think about homework.",
        date: "3 days ago",
        likes: 15,
      },
      {
        id: 3,
        author: {
          name: "Dr. Emily Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40&text=ER",
          verified: true,
        },
        content:
          "This is a very common phenomenon. School requires enormous self-regulation effort, and home is where children feel safe to release that tension. Try creating a sensory-friendly decompression routine and keep demands low for the first hour after school.",
        date: "2 days ago",
        likes: 25,
      },
    ],
  },
]

const popularTags = [
  { name: "communication", count: 42 },
  { name: "sensory", count: 38 },
  { name: "education", count: 35 },
  { name: "routines", count: 29 },
  { name: "meltdowns", count: 26 },
  { name: "social-skills", count: 24 },
  { name: "self-care", count: 22 },
  { name: "therapy", count: 20 },
]
