"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Sparkles, Download, Share2, BookmarkPlus, Loader2 } from "lucide-react"

export default function SocialStoryGenerator() {
  const [scenario, setScenario] = useState("")
  const [childName, setChildName] = useState("")
  const [perspective, setPerspective] = useState("first")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<string | null>(null)
  const [savedStories, setSavedStories] = useState<Array<{ id: number; title: string; content: string }>>([])

  const handleGenerate = async () => {
    if (!scenario.trim()) return

    setIsGenerating(true)
    setGeneratedStory(null)

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario,
          childName: childName || "I",
          perspective,
        }),
      })

      const data = await response.json()
      setGeneratedStory(data.story)
    } catch (error) {
      console.error("Error generating story:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveStory = () => {
    if (!generatedStory) return

    const newStory = {
      id: Date.now(),
      title: scenario,
      content: generatedStory,
    }

    setSavedStories([...savedStories, newStory])
  }

  const handleClearForm = () => {
    setScenario("")
    setChildName("")
    setGeneratedStory(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Social Story Generator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Story Generator */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                Create a Social Story
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario">What situation would you like a story about?</Label>
                  <Textarea
                    id="scenario"
                    placeholder="E.g., Going to the dentist, Sharing toys with friends, Feeling frustrated..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child's name (optional)</Label>
                    <Input
                      id="childName"
                      placeholder="Leave blank to use 'I'"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Story perspective</Label>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={perspective === "first" ? "default" : "outline"}
                        onClick={() => setPerspective("first")}
                        className={perspective === "first" ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        First Person ("I will...")
                      </Button>
                      <Button
                        type="button"
                        variant={perspective === "third" ? "default" : "outline"}
                        onClick={() => setPerspective("third")}
                        className={perspective === "third" ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        Third Person ("{childName || "Sam"} will...")
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleClearForm}>
                    Clear
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!scenario.trim() || isGenerating}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {generatedStory && (
            <Card className="border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Your Social Story
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSaveStory} className="text-blue-600">
                    <BookmarkPlus className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="text-green-600">
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-purple-600">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h2 className="text-xl font-bold text-center mb-4">{scenario}</h2>
                  <div className="prose max-w-none">
                    {generatedStory.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50 text-sm text-blue-700">
                <p>Tip: You can save this story to your library or download it as a PDF to print.</p>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column - Saved Stories & Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Your Story Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="saved" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="saved">Saved Stories</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                <TabsContent value="saved" className="pt-4">
                  {savedStories.length > 0 ? (
                    <div className="space-y-3">
                      {savedStories.map((story) => (
                        <div key={story.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h3 className="font-medium">{story.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {story.content.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No saved stories yet</p>
                      <p className="text-sm">Generate and save stories to see them here</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="examples" className="pt-4">
                  <div className="space-y-3">
                    {exampleStories.map((story) => (
                      <div key={story.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h3 className="font-medium">{story.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{story.preview}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Tips for Social Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-1">Keep it simple</h3>
                  <p className="text-sm text-blue-700">Use clear, concrete language and avoid abstract concepts.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-1">Be positive</h3>
                  <p className="text-sm text-green-700">Focus on what to do rather than what not to do.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-1">Use visuals</h3>
                  <p className="text-sm text-purple-700">Consider adding simple pictures to support the text.</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-1">Read regularly</h3>
                  <p className="text-sm text-yellow-700">Review the story before encountering the situation.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const exampleStories = [
  {
    id: 1,
    title: "Going to the Dentist",
    preview: "Going to the dentist helps keep my teeth healthy. When I arrive, I will sit in the waiting room...",
  },
  {
    id: 2,
    title: "Sharing Toys at School",
    preview: "Sharing toys with friends is a kind thing to do. When someone asks to play with my toy...",
  },
  {
    id: 3,
    title: "Handling Big Feelings",
    preview: "Sometimes I feel big emotions like anger or frustration. When I feel upset, I can...",
  },
  {
    id: 4,
    title: "Taking Turns on the Playground",
    preview: "At the playground, many children want to use the same equipment. Taking turns means...",
  },
]
