import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { scenario, childName, perspective } = await req.json()

    // Determine the perspective format
    const viewpoint =
      perspective === "first"
        ? 'first-person (using "I" statements)'
        : `third-person (using "${childName}" as the subject)`

    const prompt = `
      Create a simple, clear social story for a child with autism about: "${scenario}".
      
      The story should:
      - Be written in ${viewpoint}
      - Use simple, concrete language appropriate for children
      - Be positive and supportive
      - Focus on what TO do rather than what NOT to do
      - Include 4-6 short paragraphs
      - Describe the situation, expected behaviors, and positive outcomes
      - Avoid abstract concepts and metaphors
      - Be reassuring and calm in tone
      
      Format the story as plain text with paragraph breaks.
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return NextResponse.json({ story: text })
  } catch (error) {
    console.error("Error generating story:", error)
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 })
  }
}
