"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Music, MessageCircle } from "lucide-react"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  alpha: number
  life: number
  maxLife: number
}

interface VisualElement {
  x: number
  y: number
  size: number
  color: string
  alpha: number
  type: string
  startTime: number
  duration: number
  isPersistent: boolean
}

interface InteractionData {
  timestamp: number
  x: number
  y: number
  intensity: number
  note: string
}

// Declare WebMidi interface
declare global {
  interface Window {
    navigator: Navigator
  }
  interface Navigator {
    requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>
  }
}

export default function PianoHeartbeat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [isPersistentMode, setIsPersistentMode] = useState(false)
  const [midiConnected, setMidiConnected] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [reflection, setReflection] = useState("")
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false)
  const [interactionStyle, setInteractionStyle] = useState("neutral") // neutral, energetic, calm

  // Refs for animation and state
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const visualElementsRef = useRef<VisualElement[]>([])
  const recentInteractionsRef = useRef<InteractionData[]>([])
  const lastInteractionTimeRef = useRef<number>(0)
  const reflectionIconRef = useRef<boolean>(false)

  // Color palettes
  const colorPalettes = {
    major: ["#FFD6E0", "#FFACC7", "#FF85B3", "#FF5C8D", "#FF337D"],
    minor: ["#C9E4FF", "#A3D0FF", "#7DBCFF", "#57A8FF", "#3195FF"],
    neutral: ["#FFE6E6", "#FFD6E0", "#C9E4FF", "#D8F8E1", "#FFF3CD"],
  }

  // Notes and their harmonic qualities
  const notes = {
    C: { type: "major", frequency: 261.63 },
    E: { type: "major", frequency: 329.63 },
    G: { type: "major", frequency: 392.0 },
    A: { type: "minor", frequency: 440.0 },
    D: { type: "minor", frequency: 293.66 },
    F: { type: "minor", frequency: 349.23 },
  }

  // Initialize canvas and animation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setCanvasSize({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize MIDI if available
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(onMIDISuccess)
        .catch(() => console.log("MIDI access denied"))
    }

    // Start animation loop
    startAnimation()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Handle MIDI connection
  const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    const inputs = midiAccess.inputs

    inputs.forEach((input) => {
      input.onmidimessage = onMIDIMessage
      setMidiConnected(true)
    })

    midiAccess.onstatechange = () => {
      let hasConnectedDevice = false
      midiAccess.inputs.forEach(() => {
        hasConnectedDevice = true
      })
      setMidiConnected(hasConnectedDevice)
    }
  }

  // Handle MIDI messages
  const onMIDIMessage = (event: WebMidi.MIDIMessageEvent) => {
    const [command, note, velocity] = event.data

    // Note on
    if (command === 144 && velocity > 0) {
      const x = Math.random() * canvasSize.width
      const y = Math.random() * canvasSize.height
      const intensity = velocity / 127

      createVisualFromNote(x, y, note, intensity)
      recordInteraction(x, y, intensity, note.toString())
    }

    // Sustain pedal
    if (command === 176 && note === 64) {
      if (velocity >= 64) {
        // Pedal down - add global effect
        addGlobalEffect()
      } else {
        // Pedal up - remove global effect
      }
    }
  }

  // Start animation loop
  const startAnimation = () => {
    const animate = () => {
      updateCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Update canvas with all visual elements
  const updateCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with a semi-transparent background for trailing effect
    ctx.fillStyle = "rgba(255, 246, 250, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background effects (shooting stars)
    drawBackgroundEffects(ctx)

    // Update and draw visual elements
    updateVisualElements(ctx)

    // Check if we should show reflection icon
    checkReflectionTrigger()
  }

  // Draw background effects
  const drawBackgroundEffects = (ctx: CanvasRenderingContext2D) => {
    // Randomly create shooting stars
    if (Math.random() < 0.01) {
      createShootingStar()
    }

    // Update and draw particles
    const particles = particlesRef.current
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      p.x += p.vx
      p.y += p.vy
      p.life -= 1
      p.alpha = p.life / p.maxLife

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1
  }

  // Create a shooting star effect
  const createShootingStar = () => {
    const x = Math.random() * canvasSize.width
    const y = 0
    const size = Math.random() * 2 + 1
    const speed = Math.random() * 3 + 2
    const angle = Math.PI / 4 + (Math.random() * Math.PI) / 4

    const particle: Particle = {
      x,
      y,
      size,
      color: "#FFD700", // Golden yellow
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      life: 100,
      maxLife: 100,
    }

    particlesRef.current.push(particle)

    // Add trail particles
    for (let i = 0; i < 5; i++) {
      const trailParticle: Particle = {
        x: x - Math.cos(angle) * i * 2,
        y: y - Math.sin(angle) * i * 2,
        size: size * (1 - i / 10),
        color: "#FFD700",
        vx: Math.cos(angle) * (speed * 0.8),
        vy: Math.sin(angle) * (speed * 0.8),
        alpha: 0.7 - i * 0.1,
        life: 70 - i * 10,
        maxLife: 70 - i * 10,
      }

      particlesRef.current.push(trailParticle)
    }
  }

  // Update and draw visual elements
  const updateVisualElements = (ctx: CanvasRenderingContext2D) => {
    const elements = visualElementsRef.current
    const currentTime = Date.now()

    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]
      const elapsed = currentTime - element.startTime

      // Calculate alpha based on elapsed time and duration
      if (!element.isPersistent) {
        element.alpha = 1 - elapsed / element.duration
      } else {
        // Persistent elements fade to a minimum opacity
        element.alpha = Math.max(0.1, 1 - elapsed / element.duration)
      }

      // Remove expired non-persistent elements
      if (!element.isPersistent && elapsed > element.duration) {
        elements.splice(i, 1)
        continue
      }

      // Draw the element based on its type
      drawVisualElement(ctx, element)
    }
  }

  // Draw a visual element based on its type
  const drawVisualElement = (ctx: CanvasRenderingContext2D, element: VisualElement) => {
    ctx.globalAlpha = element.alpha

    switch (element.type) {
      case "ripple":
        drawRipple(ctx, element)
        break
      case "burst":
        drawBurst(ctx, element)
        break
      case "wave":
        drawWave(ctx, element)
        break
      default:
        drawRipple(ctx, element)
    }

    ctx.globalAlpha = 1
  }

  // Draw ripple effect
  const drawRipple = (ctx: CanvasRenderingContext2D, element: VisualElement) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 1000)

    ctx.strokeStyle = element.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(element.x, element.y, size, 0, Math.PI * 2)
    ctx.stroke()

    // Inner ripple
    ctx.beginPath()
    ctx.arc(element.x, element.y, size * 0.7, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Draw burst effect
  const drawBurst = (ctx: CanvasRenderingContext2D, element: VisualElement) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 2000)

    ctx.fillStyle = element.color

    for (let i = 0; i < 8; i++) {
      const angle = ((Math.PI * 2) / 8) * i
      const x = element.x + Math.cos(angle) * size
      const y = element.y + Math.sin(angle) * size

      ctx.beginPath()
      ctx.arc(x, y, size / 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw wave effect
  const drawWave = (ctx: CanvasRenderingContext2D, element: VisualElement) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 1500)

    ctx.strokeStyle = element.color
    ctx.lineWidth = 3

    ctx.beginPath()

    for (let i = 0; i < Math.PI * 2; i += 0.1) {
      const x = element.x + Math.cos(i) * size
      const y = element.y + Math.sin(i) * size * (1 + 0.2 * Math.sin(i * 3 + elapsed / 200))

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.stroke()
  }

  // Create visual effect from canvas interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (midiConnected) return // Ignore clicks if MIDI is connected

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Get a random note
    const noteKeys = Object.keys(notes)
    const randomNote = noteKeys[Math.floor(Math.random() * noteKeys.length)]
    const note = notes[randomNote as keyof typeof notes]

    // Create visual based on the note
    createVisualFromNote(x, y, randomNote, 1)

    // Record interaction
    recordInteraction(x, y, 1, randomNote)

    // Play sound (if we had audio implementation)
    playSound(note.frequency)
  }

  // Create visual based on note properties
  const createVisualFromNote = (x: number, y: number, note: any, intensity: number) => {
    // Determine note type and get appropriate color palette
    const noteType =
      typeof note === "string"
        ? notes[note as keyof typeof notes]?.type || "neutral"
        : note % 12 === 0 || note % 12 === 4 || note % 12 === 7
          ? "major"
          : "minor"

    const palette = colorPalettes[noteType as keyof typeof colorPalettes] || colorPalettes.neutral
    const color = palette[Math.floor(Math.random() * palette.length)]

    // Determine visual type based on note and interaction style
    let visualType = "ripple"
    if (noteType === "major") {
      visualType = Math.random() > 0.5 ? "burst" : "ripple"
    } else if (noteType === "minor") {
      visualType = Math.random() > 0.5 ? "wave" : "ripple"
    }

    // Create the visual element
    const baseSize = 20 + intensity * 30
    const baseDuration = 2000 + intensity * 1000

    const visualElement: VisualElement = {
      x,
      y,
      size: baseSize,
      color,
      alpha: 1,
      type: visualType,
      startTime: Date.now(),
      duration: baseDuration,
      isPersistent: isPersistentMode,
    }

    visualElementsRef.current.push(visualElement)
  }

  // Record interaction for analysis
  const recordInteraction = (x: number, y: number, intensity: number, note: string) => {
    const interaction: InteractionData = {
      timestamp: Date.now(),
      x,
      y,
      intensity,
      note,
    }

    recentInteractionsRef.current.push(interaction)
    lastInteractionTimeRef.current = Date.now()

    // Keep only recent interactions (last 10 seconds)
    const tenSecondsAgo = Date.now() - 10000
    recentInteractionsRef.current = recentInteractionsRef.current.filter((i) => i.timestamp > tenSecondsAgo)

    // Analyze interaction style after accumulating enough data
    if (recentInteractionsRef.current.length >= 5) {
      analyzeInteractionStyle()
    }
  }

  // Analyze recent interactions to determine style
  const analyzeInteractionStyle = () => {
    const interactions = recentInteractionsRef.current
    if (interactions.length < 3) return

    // Calculate average time between interactions
    let totalTimeDiff = 0
    let totalIntensity = 0

    for (let i = 1; i < interactions.length; i++) {
      totalTimeDiff += interactions[i].timestamp - interactions[i - 1].timestamp
      totalIntensity += interactions[i].intensity
    }

    const avgTimeDiff = totalTimeDiff / (interactions.length - 1)
    const avgIntensity = totalIntensity / interactions.length

    // Determine interaction style
    if (avgTimeDiff < 500 && avgIntensity > 0.7) {
      setInteractionStyle("energetic")
    } else if (avgTimeDiff > 1500 || avgIntensity < 0.4) {
      setInteractionStyle("calm")
    } else {
      setInteractionStyle("neutral")
    }
  }

  // Check if we should show the reflection icon
  const checkReflectionTrigger = () => {
    const now = Date.now()
    const interactions = recentInteractionsRef.current

    // Show reflection icon if:
    // 1. We have enough interactions
    // 2. Some time has passed since the last interaction
    // 3. Icon is not already showing
    if (
      interactions.length >= 5 &&
      now - lastInteractionTimeRef.current > 3000 &&
      now - lastInteractionTimeRef.current < 10000 &&
      !reflectionIconRef.current &&
      !showReflection
    ) {
      reflectionIconRef.current = true
      setTimeout(() => {
        setShowReflection(true)
      }, 500)
    }

    // Hide reflection icon if too much time has passed
    if (now - lastInteractionTimeRef.current > 10000) {
      reflectionIconRef.current = false
    }
  }

  // Generate reflection using Groq
  const generateReflection = async () => {
    setIsGeneratingReflection(true)

    try {
      // Get data about recent interactions
      const interactions = recentInteractionsRef.current
      const style = interactionStyle
      const noteTypes = interactions.map((i) => {
        const noteKey = i.note
        return typeof noteKey === "string" ? notes[noteKey as keyof typeof notes]?.type || "neutral" : "unknown"
      })

      const majorCount = noteTypes.filter((t) => t === "major").length
      const minorCount = noteTypes.filter((t) => t === "minor").length
      const dominantType = majorCount > minorCount ? "major" : minorCount > majorCount ? "minor" : "balanced"

      // Create prompt for Groq
      const prompt = `
        Create a very short, poetic sensory description (1-2 sentences) for a musical interaction experience.
        
        Interaction style: ${style}
        Dominant note type: ${dominantType}
        
        The description should be gentle, evocative, and child-friendly. Focus on sensory qualities like colors, movement, or feelings.
        Keep it very brief and simple. Don't use complex metaphors or abstract concepts.
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        temperature: 0.7,
        maxTokens: 100,
      })

      setReflection(text)
    } catch (error) {
      console.error("Error generating reflection:", error)
      setReflection("Soft colors dance with the sounds.")
    } finally {
      setIsGeneratingReflection(false)
    }
  }

  // Clear canvas (for Rhythm Canvas feature)
  const handleClearCanvas = () => {
    // Keep only non-persistent elements
    visualElementsRef.current = visualElementsRef.current.filter((e) => !e.isPersistent)
  }

  // Toggle persistent mode (Rhythm Canvas feature)
  const togglePersistentMode = () => {
    setIsPersistentMode(!isPersistentMode)
  }

  // Add global effect (for MIDI sustain pedal)
  const addGlobalEffect = () => {
    // Add a subtle background glow effect
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "rgba(255, 230, 240, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Play sound (placeholder - would need Web Audio API implementation)
  const playSound = (frequency: number) => {
    // This would be implemented with Web Audio API
    console.log(`Playing sound at frequency: ${frequency}Hz`)
  }

  // Handle reflection icon click
  const handleReflectionClick = () => {
    generateReflection()
  }

  // Handle dismissing the reflection
  const handleDismissReflection = () => {
    setShowReflection(false)
    setReflection("")
    reflectionIconRef.current = false
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Piano Heartbeat</h1>
      </div>

      <Card className="border-2 border-pink-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-pink-500" />
              Interactive Sensory Experience
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`${isPersistentMode ? "bg-pink-100 text-pink-700" : ""}`}
                onClick={togglePersistentMode}
                title="Rhythm Canvas Mode"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {isPersistentMode ? "Canvas Mode" : "Flow Mode"}
              </Button>

              {isPersistentMode && (
                <Button variant="outline" size="sm" onClick={handleClearCanvas} title="Clear Canvas">
                  Clear
                </Button>
              )}

              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full border ${
                  midiConnected ? "border-green-500 bg-green-100" : "border-gray-300"
                }`}
                title={midiConnected ? "MIDI Connected" : "MIDI Not Connected"}
              >
                <Music className={`h-4 w-4 ${midiConnected ? "text-green-600" : "text-gray-400"}`} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div ref={containerRef} className="w-full h-[500px] bg-gradient-to-b from-pink-50 to-white relative">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="w-full h-full cursor-pointer"
              onClick={handleCanvasClick}
              style={{
                background: "linear-gradient(to bottom, rgba(255, 246, 250, 0.9), rgba(255, 255, 255, 0.9))",
              }}
            />

            {/* Reflection icon */}
            {showReflection && (
              <div
                className="absolute bottom-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 border border-pink-200 cursor-pointer hover:bg-pink-200 transition-colors"
                onClick={handleReflectionClick}
              >
                <MessageCircle className="h-5 w-5 text-pink-600" />
              </div>
            )}

            {/* Reflection panel */}
            {reflection && (
              <div
                className="absolute bottom-16 right-4 max-w-xs p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md"
                onClick={handleDismissReflection}
              >
                {isGeneratingReflection ? (
                  <div className="flex items-center justify-center h-8">
                    <div className="animate-pulse text-pink-600">Thinking...</div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 italic">{reflection}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Click or tap anywhere on the canvas to create visual and sound effects.</p>
        <p className="mt-1">Connect a MIDI keyboard for enhanced expression.</p>
      </div>
    </div>
  )
}
