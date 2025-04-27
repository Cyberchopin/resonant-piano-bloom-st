"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  RefreshCw,
  Music,
  MessageCircle,
  Play,
  Square,
  Download,
  Settings,
  Users,
  Keyboard,
  Share2,
} from "lucide-react"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { SketchPicker } from "react-color"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

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
  intensity: number
  frequencyData?: number[] // For sound visualization
}

interface InteractionData {
  timestamp: number
  x: number
  y: number
  intensity: number
  note: string
  visualType?: string
  color?: string
  id?: string // For collaborative mode
  userId?: string // For collaborative mode
  duration?: number // For recording
}

interface RecordingFrame {
  timestamp: number
  interactions: InteractionData[]
}

interface Recording {
  id: string
  name: string
  duration: number
  frames: RecordingFrame[]
  dateCreated: string
}

interface CustomizationSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  visualComplexity: number
  soundVolume: number
  enableReverb: boolean
  enableDelay: boolean
}

// Sound environment interface
interface SoundEnvironment {
  id: string
  name: string
  description: string
  baseFrequencyMultiplier: number
  octaveShift: number
  attackTime: number
  releaseTime: number
  reverbSettings: {
    wet: number
    decay: number
    preDelay: number
  }
  delaySettings: {
    wet: number
    time: number
    feedback: number
  }
  oscillatorType: OscillatorType
  visualStyle: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    particleTypes: string[]
  }
}

// Declare WebMidi interface
declare global {
  interface Window {
    navigator: Navigator
  }
  interface Navigator {
    requestMIDIAccess(options?: any): Promise<any>
  }
}

export default function PianoHeartbeat() {
  // Sound environments data
  const soundEnvironments: SoundEnvironment[] = [
    {
      id: "default",
      name: "Default Piano",
      description: "Standard piano sound with natural acoustics",
      baseFrequencyMultiplier: 1,
      octaveShift: 0,
      attackTime: 0.02,
      releaseTime: 0.05,
      reverbSettings: {
        wet: 0.3,
        decay: 1.5,
        preDelay: 0.01,
      },
      delaySettings: {
        wet: 0,
        time: 0.3,
        feedback: 0.3,
      },
      oscillatorType: "sine",
      visualStyle: {
        primaryColor: "#FF85B3",
        secondaryColor: "#7DBCFF",
        backgroundColor: "#FFF6FA",
        particleTypes: ["ripple", "burst", "wave"],
      },
    },
    {
      id: "crystal-ice-cave",
      name: "Crystal Ice Cave",
      description: "Echoes of the Crystal Ice Cave - bright, crystalline sounds",
      baseFrequencyMultiplier: 1.02,
      octaveShift: 1, // Higher octave
      attackTime: 0.01,
      releaseTime: 0.03,
      reverbSettings: {
        wet: 0.8,
        decay: 8.0,
        preDelay: 0.05,
      },
      delaySettings: {
        wet: 0.2,
        time: 0.4,
        feedback: 0.2,
      },
      oscillatorType: "sine",
      visualStyle: {
        primaryColor: "#A0E4FF",
        secondaryColor: "#FFFFFF",
        backgroundColor: "#E0F7FF",
        particleTypes: ["ripple", "burst", "spiral"],
      },
    },
    {
      id: "summer-garden",
      name: "Summer Garden",
      description: "Lazy Afternoon in a Summer Garden - warm, rounded sounds",
      baseFrequencyMultiplier: 0.99,
      octaveShift: 0,
      attackTime: 0.05,
      releaseTime: 0.1,
      reverbSettings: {
        wet: 0.4,
        decay: 2.0,
        preDelay: 0.01,
      },
      delaySettings: {
        wet: 0.1,
        time: 0.3,
        feedback: 0.1,
      },
      oscillatorType: "sine",
      visualStyle: {
        primaryColor: "#FFD166",
        secondaryColor: "#A0E4A0",
        backgroundColor: "#FFFAEB",
        particleTypes: ["wave", "particle"],
      },
    },
    {
      id: "old-music-box",
      name: "Old Music Box",
      description: "Music Box in the Old Attic - plinky, toy-like piano",
      baseFrequencyMultiplier: 1.01,
      octaveShift: 1,
      attackTime: 0.005,
      releaseTime: 0.1,
      reverbSettings: {
        wet: 0.2,
        decay: 0.8,
        preDelay: 0,
      },
      delaySettings: {
        wet: 0,
        time: 0,
        feedback: 0,
      },
      oscillatorType: "triangle",
      visualStyle: {
        primaryColor: "#D4A373",
        secondaryColor: "#E9EDC9",
        backgroundColor: "#FAEDCD",
        particleTypes: ["burst", "particle"],
      },
    },
    {
      id: "forest-rain",
      name: "Forest After Rain",
      description: "Scent of Earth After Rain in the Forest - soft, muted sounds",
      baseFrequencyMultiplier: 0.98,
      octaveShift: -1, // Lower octave
      attackTime: 0.08,
      releaseTime: 0.2,
      reverbSettings: {
        wet: 0.5,
        decay: 3.0,
        preDelay: 0.02,
      },
      delaySettings: {
        wet: 0.2,
        time: 0.5,
        feedback: 0.1,
      },
      oscillatorType: "sine",
      visualStyle: {
        primaryColor: "#606C38",
        secondaryColor: "#283618",
        backgroundColor: "#FEFAE0",
        particleTypes: ["ripple", "wave"],
      },
    },
    {
      id: "interstellar",
      name: "Interstellar Signals",
      description: "Pulsing Signals of Interstellar Travel - processed piano with effects",
      baseFrequencyMultiplier: 1,
      octaveShift: 0,
      attackTime: 0.01,
      releaseTime: 0.3,
      reverbSettings: {
        wet: 0.7,
        decay: 10.0,
        preDelay: 0.1,
      },
      delaySettings: {
        wet: 0.6,
        time: 0.6,
        feedback: 0.5,
      },
      oscillatorType: "sawtooth",
      visualStyle: {
        primaryColor: "#7400B8",
        secondaryColor: "#5390D9",
        backgroundColor: "#03071E",
        particleTypes: ["spiral", "particle"],
      },
    },
  ]

  // Main state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [isPersistentMode, setIsPersistentMode] = useState(false)
  const [midiConnected, setMidiConnected] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [reflection, setReflection] = useState("")
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false)
  const [interactionStyle, setInteractionStyle] = useState("neutral") // neutral, energetic, calm
  const [activeInteractions, setActiveInteractions] = useState<{ [key: string]: boolean }>({})
  const [isAccessibilityModeActive, setIsAccessibilityModeActive] = useState(false)

  // Sound generation state
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const reverbNodeRef = useRef<ConvolverNode | null>(null)
  const delayNodeRef = useRef<DelayNode | null>(null)
  const analyserNodeRef = useRef<AnalyserNode | null>(null)
  const oscillatorsRef = useRef<Map<number, OscillatorNode>>(new Map())

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentRecordingName, setCurrentRecordingName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const recordingStartTimeRef = useRef<number>(0)
  const recordingFramesRef = useRef<RecordingFrame[]>([])
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Customization state
  const [showSettings, setShowSettings] = useState(false)
  const [customSettings, setCustomSettings] = useState<CustomizationSettings>({
    primaryColor: "#FF85B3",
    secondaryColor: "#7DBCFF",
    backgroundColor: "#FFF6FA",
    visualComplexity: 50,
    soundVolume: 70,
    enableReverb: false,
    enableDelay: false,
  })

  // Collaborative mode state
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(false)
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [userId, setUserId] = useState("")
  const socketRef = useRef<any>(null)

  // Refs for animation and state
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const visualElementsRef = useRef<VisualElement[]>([])
  const recentInteractionsRef = useRef<InteractionData[]>([])
  const lastInteractionTimeRef = useRef<number>(0)
  const reflectionIconRef = useRef<boolean>(false)

  // Environment state
  const [currentEnvironment, setCurrentEnvironment] = useState<SoundEnvironment>(soundEnvironments[0])
  const [showEnvironmentSelector, setShowEnvironmentSelector] = useState(false)

  // Add a chorusNodeRef for the interstellar environment
  const chorusNodeRef = useRef<DelayNode | null>(null)
  const phaserNodeRef = useRef<BiquadFilterNode | null>(null)

  // Color palettes (now dynamic based on customization)
  const getColorPalettes = useCallback(() => {
    return {
      major: [
        customSettings.primaryColor,
        adjustColorBrightness(customSettings.primaryColor, 20),
        adjustColorBrightness(customSettings.primaryColor, -20),
        adjustColorBrightness(customSettings.primaryColor, 40),
        adjustColorBrightness(customSettings.primaryColor, -40),
      ],
      minor: [
        customSettings.secondaryColor,
        adjustColorBrightness(customSettings.secondaryColor, 20),
        adjustColorBrightness(customSettings.secondaryColor, -20),
        adjustColorBrightness(customSettings.secondaryColor, 40),
        adjustColorBrightness(customSettings.secondaryColor, -40),
      ],
      neutral: [
        "#FFE6E6",
        customSettings.primaryColor,
        customSettings.secondaryColor,
        adjustColorBrightness(customSettings.primaryColor, 60),
        adjustColorBrightness(customSettings.secondaryColor, 60),
      ],
    }
  }, [customSettings.primaryColor, customSettings.secondaryColor])

  // Notes and their harmonic qualities
  const notes = {
    C: { type: "major", frequency: 261.63 },
    E: { type: "major", frequency: 329.63 },
    G: { type: "major", frequency: 392.0 },
    A: { type: "minor", frequency: 440.0 },
    D: { type: "minor", frequency: 293.66 },
    F: { type: "minor", frequency: 349.23 },
    // Extended notes for keyboard access
    "C#": { type: "minor", frequency: 277.18 },
    "D#": { type: "major", frequency: 311.13 },
    "F#": { type: "minor", frequency: 370.0 },
    "G#": { type: "minor", frequency: 415.3 },
    "A#": { type: "major", frequency: 466.16 },
    B: { type: "major", frequency: 493.88 },
  }

  // Initialize audio context
  const initAudioContext = () => {
    if (audioContextRef.current) return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()

      // Create gain node
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.gain.value = customSettings.soundVolume / 100

      // Create analyzer node
      analyserNodeRef.current = audioContextRef.current.createAnalyser()
      analyserNodeRef.current.fftSize = 256

      // Setup effect nodes
      setupEffectNodes()

      // Connect nodes - do this after a small delay to ensure all nodes are created
      setTimeout(() => {
        if (gainNodeRef.current && analyserNodeRef.current && audioContextRef.current) {
          gainNodeRef.current.connect(analyserNodeRef.current)
          analyserNodeRef.current.connect(audioContextRef.current.destination)
          updateAudioRouting()
        }
      }, 100)

      console.log("Audio context initialized successfully")
    } catch (error) {
      console.error("Failed to initialize audio context:", error)
    }
  }

  // Setup audio effect nodes
  const setupEffectNodes = async () => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    try {
      // Create reverb node
      reverbNodeRef.current = audioContextRef.current.createConvolver()

      // Create a synthetic impulse response instead of fetching a file
      const sampleRate = audioContextRef.current.sampleRate
      const length = 2 * sampleRate // 2 seconds
      const impulseResponse = audioContextRef.current.createBuffer(2, length, sampleRate)

      // Fill both channels with white noise and apply decay
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulseResponse.getChannelData(channel)
        for (let i = 0; i < length; i++) {
          // White noise with exponential decay
          const decay = Math.exp(-i / (sampleRate * 0.5)) // 0.5 second decay
          channelData[i] = (Math.random() * 2 - 1) * decay
        }
      }

      // Set the synthetic impulse response
      reverbNodeRef.current.buffer = impulseResponse

      // Create delay node
      delayNodeRef.current = audioContextRef.current.createDelay(2.0)
      delayNodeRef.current.delayTime.value = 0.3

      // Create feedback for delay
      const feedbackGain = audioContextRef.current.createGain()
      feedbackGain.gain.value = 0.3

      // Connect delay feedback loop
      delayNodeRef.current.connect(feedbackGain)
      feedbackGain.connect(delayNodeRef.current)

      // Create chorus effect (using delay)
      chorusNodeRef.current = audioContextRef.current.createDelay(0.03)
      chorusNodeRef.current.delayTime.value = 0.01

      // Create phaser effect (using filter)
      phaserNodeRef.current = audioContextRef.current.createBiquadFilter()
      phaserNodeRef.current.type = "allpass"
      phaserNodeRef.current.frequency.value = 1000
      phaserNodeRef.current.Q.value = 5

      console.log("Effect nodes initialized successfully")
    } catch (error) {
      console.error("Failed to initialize effect nodes:", error)

      // Create fallback nodes if the main initialization fails
      try {
        if (!reverbNodeRef.current && audioContextRef.current) {
          // Create a simple gain node as a fallback for reverb
          const fallbackGain = audioContextRef.current.createGain()
          fallbackGain.gain.value = 1.0
          reverbNodeRef.current = fallbackGain as unknown as ConvolverNode
        }

        if (!delayNodeRef.current && audioContextRef.current) {
          // Create a simple delay node
          delayNodeRef.current = audioContextRef.current.createDelay(1.0)
          delayNodeRef.current.delayTime.value = 0.3
        }

        console.log("Created fallback audio nodes")
      } catch (fallbackError) {
        console.error("Failed to create fallback nodes:", fallbackError)
      }
    }
  }

  // Update audio routing based on settings and current environment
  const updateAudioRouting = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return
    if (!analyserNodeRef.current) return

    try {
      // Disconnect all nodes
      gainNodeRef.current.disconnect()

      // Disconnect effect nodes if they exist
      if (reverbNodeRef.current) reverbNodeRef.current.disconnect()
      if (delayNodeRef.current) delayNodeRef.current.disconnect()
      if (chorusNodeRef.current) chorusNodeRef.current.disconnect()
      if (phaserNodeRef.current) phaserNodeRef.current.disconnect()

      // Update gain value
      gainNodeRef.current.gain.value = customSettings.soundVolume / 100

      // Apply environment-specific settings
      if (delayNodeRef.current) {
        delayNodeRef.current.delayTime.value = currentEnvironment.delaySettings.time
      }

      // Create a chain of audio nodes based on the current environment
      let lastNode: AudioNode = gainNodeRef.current

      // Add reverb if enabled
      if ((customSettings.enableReverb || currentEnvironment.reverbSettings.wet > 0) && reverbNodeRef.current) {
        // Create a dry/wet mix for reverb
        const dryGain = audioContextRef.current.createGain()
        const wetGain = audioContextRef.current.createGain()

        dryGain.gain.value = 1 - currentEnvironment.reverbSettings.wet
        wetGain.gain.value = currentEnvironment.reverbSettings.wet

        lastNode.connect(dryGain)
        lastNode.connect(reverbNodeRef.current)
        reverbNodeRef.current.connect(wetGain)

        const mixNode = audioContextRef.current.createGain()
        dryGain.connect(mixNode)
        wetGain.connect(mixNode)

        lastNode = mixNode
      }

      // Add delay if enabled
      if ((customSettings.enableDelay || currentEnvironment.delaySettings.wet > 0) && delayNodeRef.current) {
        // Create a dry/wet mix for delay
        const dryGain = audioContextRef.current.createGain()
        const wetGain = audioContextRef.current.createGain()

        dryGain.gain.value = 1 - currentEnvironment.delaySettings.wet
        wetGain.gain.value = currentEnvironment.delaySettings.wet

        lastNode.connect(dryGain)
        lastNode.connect(delayNodeRef.current)
        delayNodeRef.current.connect(wetGain)

        const mixNode = audioContextRef.current.createGain()
        dryGain.connect(mixNode)
        wetGain.connect(mixNode)

        lastNode = mixNode
      }

      // Add chorus for interstellar environment
      if (currentEnvironment.id === "interstellar" && chorusNodeRef.current) {
        // Modulate chorus delay time for effect
        const now = audioContextRef.current.currentTime
        chorusNodeRef.current.delayTime.setValueAtTime(0.01, now)
        chorusNodeRef.current.delayTime.linearRampToValueAtTime(0.02, now + 0.5)
        chorusNodeRef.current.delayTime.linearRampToValueAtTime(0.01, now + 1.0)

        // Create a dry/wet mix for chorus
        const dryGain = audioContextRef.current.createGain()
        const wetGain = audioContextRef.current.createGain()

        dryGain.gain.value = 0.7
        wetGain.gain.value = 0.3

        lastNode.connect(dryGain)
        lastNode.connect(chorusNodeRef.current)
        chorusNodeRef.current.connect(wetGain)

        const mixNode = audioContextRef.current.createGain()
        dryGain.connect(mixNode)
        wetGain.connect(mixNode)

        lastNode = mixNode
      }

      // Add phaser for interstellar environment
      if (currentEnvironment.id === "interstellar" && phaserNodeRef.current) {
        // Modulate phaser frequency for effect
        const now = audioContextRef.current.currentTime
        phaserNodeRef.current.frequency.setValueAtTime(1000, now)
        phaserNodeRef.current.frequency.linearRampToValueAtTime(500, now + 0.5)
        phaserNodeRef.current.frequency.linearRampToValueAtTime(1000, now + 1.0)

        lastNode.connect(phaserNodeRef.current)
        lastNode = phaserNodeRef.current
      }

      // Connect the last node to the analyzer
      lastNode.connect(analyserNodeRef.current)
      analyserNodeRef.current.connect(audioContextRef.current.destination)
    } catch (error) {
      console.error("Error in updateAudioRouting:", error)

      // Fallback to direct connection
      try {
        if (gainNodeRef.current && analyserNodeRef.current) {
          gainNodeRef.current.connect(analyserNodeRef.current)
          analyserNodeRef.current.connect(audioContextRef.current.destination)
        }
      } catch (fallbackError) {
        console.error("Failed to create fallback routing:", fallbackError)
      }
    }
  }, [customSettings.enableDelay, customSettings.enableReverb, customSettings.soundVolume, currentEnvironment])

  // Play a sound with the given frequency
  const playSound = useCallback(
    (frequency: number, duration = 2000, intensity = 1) => {
      if (!audioContextRef.current || !gainNodeRef.current) {
        initAudioContext()
      }

      if (!audioContextRef.current || !gainNodeRef.current) return

      // Apply environment frequency adjustments
      const adjustedFrequency =
        frequency * currentEnvironment.baseFrequencyMultiplier * Math.pow(2, currentEnvironment.octaveShift)

      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator()
      oscillator.type = currentEnvironment.oscillatorType
      oscillator.frequency.value = adjustedFrequency

      // Create an envelope (to avoid clicks)
      const envelope = audioContextRef.current.createGain()
      envelope.gain.value = 0

      // Connect oscillator to envelope to output chain
      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current)

      // Apply intensity to volume
      const maxGain = Math.min(0.8, 0.3 + intensity * 0.5)

      // Apply environment-specific attack and release times
      const attackTime = currentEnvironment.attackTime
      const releaseTime = currentEnvironment.releaseTime

      // Start the sound with environment-specific attack
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      envelope.gain.linearRampToValueAtTime(maxGain, audioContextRef.current.currentTime + attackTime)

      // Schedule the release with environment-specific release time
      envelope.gain.setValueAtTime(maxGain, audioContextRef.current.currentTime + duration / 1000 - releaseTime)
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration / 1000)

      // Start the oscillator
      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000)

      // Store oscillator reference for possible later manipulation
      const id = Math.random()
      oscillatorsRef.current.set(id, oscillator)

      // Clean up when done
      oscillator.onended = () => {
        oscillatorsRef.current.delete(id)
        oscillator.disconnect()
        envelope.disconnect()
      }

      return { id, oscillator, envelope }
    },
    [currentEnvironment],
  )

  // Create visual based on note properties
  const createVisualFromNote = (x: number, y: number, note: any, intensity: number) => {
    // Determine note type and get appropriate color palette
    const noteType =
      typeof note === "string"
        ? notes[note as keyof typeof notes]?.type || "neutral"
        : note % 12 === 0 || note % 12 === 4 || note % 12 === 7
          ? "major"
          : "minor"

    // Use environment-specific colors
    const envColors = {
      major: [
        currentEnvironment.visualStyle.primaryColor,
        adjustColorBrightness(currentEnvironment.visualStyle.primaryColor, 20),
        adjustColorBrightness(currentEnvironment.visualStyle.primaryColor, -20),
      ],
      minor: [
        currentEnvironment.visualStyle.secondaryColor,
        adjustColorBrightness(currentEnvironment.visualStyle.secondaryColor, 20),
        adjustColorBrightness(currentEnvironment.visualStyle.secondaryColor, -20),
      ],
      neutral: [
        currentEnvironment.visualStyle.primaryColor,
        currentEnvironment.visualStyle.secondaryColor,
        adjustColorBrightness(currentEnvironment.visualStyle.primaryColor, 40),
      ],
    }

    const palette = envColors[noteType as keyof typeof envColors] || envColors.neutral
    const color = palette[Math.floor(Math.random() * palette.length)]

    // Use environment-specific visual types
    const visualOptions = currentEnvironment.visualStyle.particleTypes

    // Add more complex visuals when complexity is higher
    if (customSettings.visualComplexity > 50 && !visualOptions.includes("spiral")) {
      visualOptions.push("spiral")
    }

    let visualType = visualOptions[Math.floor(Math.random() * visualOptions.length)]

    // Influence visual type based on note type
    if (noteType === "major") {
      // Major chords favor burst and spiral
      visualType =
        Math.random() > 0.4
          ? Math.random() > 0.5 && visualOptions.includes("burst")
            ? "burst"
            : visualOptions.includes("spiral")
              ? "spiral"
              : visualOptions[0]
          : visualOptions[Math.floor(Math.random() * visualOptions.length)]
    } else if (noteType === "minor") {
      // Minor chords favor wave and ripple
      visualType =
        Math.random() > 0.4
          ? Math.random() > 0.5 && visualOptions.includes("wave")
            ? "wave"
            : visualOptions.includes("ripple")
              ? "ripple"
              : visualOptions[0]
          : visualOptions[Math.floor(Math.random() * visualOptions.length)]
    }

    // Create the visual element with intensity affecting size and duration
    const baseSize = 20 + intensity * 30 * (0.5 + customSettings.visualComplexity / 100)
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
      intensity,
    }

    visualElementsRef.current.push(visualElement)

    return visualElement
  }

  // Update audio routing when settings or environment change
  useEffect(() => {
    updateAudioRouting()
  }, [
    customSettings.enableReverb,
    customSettings.enableDelay,
    customSettings.soundVolume,
    currentEnvironment,
    updateAudioRouting,
  ])

  // Add a function to change the environment
  const changeEnvironment = (envId: string) => {
    const newEnv = soundEnvironments.find((env) => env.id === envId) || soundEnvironments[0]
    setCurrentEnvironment(newEnv)

    // Update customization settings to match the environment
    setCustomSettings((prev) => ({
      ...prev,
      primaryColor: newEnv.visualStyle.primaryColor,
      secondaryColor: newEnv.visualStyle.secondaryColor,
      backgroundColor: newEnv.visualStyle.backgroundColor,
      enableReverb: newEnv.reverbSettings.wet > 0,
      enableDelay: newEnv.delaySettings.wet > 0,
    }))
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

    ctx.fillStyle = `rgba(${hexToRgb(customSettings.primaryColor)}, 0.2)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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

  // Toggle accessibility mode
  const toggleAccessibilityMode = () => {
    setIsAccessibilityModeActive(!isAccessibilityModeActive)
  }

  // Toggle collaborative mode
  const toggleCollaborativeMode = () => {
    setIsCollaborativeMode(!isCollaborativeMode)
  }

  // Download recording as JSON
  const downloadRecording = (recording: Recording) => {
    const data = JSON.stringify(recording)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${recording.name.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

  // Utility function to convert hex to rgb
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const bigint = Number.parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return `${r}, ${g}, ${b}`
  }

  // Utility function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number): string => {
    // Remove # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    let r = Number.parseInt(hex.substring(0, 2), 16)
    let g = Number.parseInt(hex.substring(2, 4), 16)
    let b = Number.parseInt(hex.substring(4, 6), 16)

    // Adjust brightness
    r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)))
    g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)))
    b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)))

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Start recording
  const startRecording = () => {
    setIsRecording(true)
    recordingStartTimeRef.current = Date.now()
    recordingFramesRef.current = []
  }

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false)
    const endTime = Date.now()
    const duration = endTime - recordingStartTimeRef.current

    // Save recording
    setShowSaveDialog(true)

    // Set duration for saving
    recordingFramesRef.current = recordingFramesRef.current.filter((frame) => frame.interactions.length > 0)
  }

  // Save recording
  const saveRecording = () => {
    setShowSaveDialog(false)

    const recording: Recording = {
      id: Math.random().toString(36).substring(7),
      name: currentRecordingName || `Recording ${recordings.length + 1}`,
      duration: Date.now() - recordingStartTimeRef.current,
      frames: recordingFramesRef.current,
      dateCreated: new Date().toISOString(),
    }

    setRecordings([...recordings, recording])
    setCurrentRecordingName("")
  }

  // Play recording
  const playRecording = (recording: Recording) => {
    setIsPlaying(true)
    let startTime = 0

    recording.frames.forEach((frame, index) => {
      const delay = frame.timestamp - startTime
      startTime = frame.timestamp

      playbackTimeoutRef.current = setTimeout(() => {
        frame.interactions.forEach((interaction) => {
          handleInteraction(interaction)
        })

        if (index === recording.frames.length - 1) {
          setIsPlaying(false)
        }
      }, delay)
    })
  }

  // Stop playback
  const stopPlayback = () => {
    setIsPlaying(false)
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current)
    }
  }

  // Handle canvas click
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

    // Create interaction data
    const interaction: InteractionData = {
      timestamp: Date.now(),
      x,
      y,
      intensity: 1,
      note: randomNote,
    }

    handleInteraction(interaction)
  }

  // Handle interaction
  const handleInteraction = (interaction: InteractionData) => {
    const { x, y, intensity, note } = interaction

    // Play sound
    const frequency = typeof note === "string" ? notes[note as keyof typeof notes]?.frequency || 440 : note
    playSound(frequency, 2000, intensity)

    // Create visual
    createVisualFromNote(x, y, note, intensity)

    // Update recent interactions
    recentInteractionsRef.current = [...recentInteractionsRef.current, interaction].slice(-10)
    lastInteractionTimeRef.current = Date.now()

    // Analyze interaction style
    analyzeInteractionStyle()

    // Check if we should show the reflection icon
    checkReflectionTrigger()

    // Record interaction
    if (isRecording) {
      const timestamp = Date.now() - recordingStartTimeRef.current
      const frame = recordingFramesRef.current.find((f) => f.timestamp === timestamp)

      if (frame) {
        frame.interactions.push(interaction)
      } else {
        recordingFramesRef.current.push({
          timestamp,
          interactions: [interaction],
        })
      }
    }

    // Send to collaborators if in collaborative mode
    if (isCollaborativeMode && socketRef.current) {
      socketRef.current.emit("interaction", {
        x,
        y,
        note,
        intensity,
        userId,
      })
    }
  }

  // Mock socket setup for demo purposes
  const mockSocketSetup = () => {
    const mockSocket = {
      id: userId,
      on: (event: string, callback: Function) => {
        if (event === "interaction") {
          // Mock receiving interactions
          this.receiveCallback = callback
        } else if (event === "user_joined") {
          // Mock user joining
          setTimeout(() => {
            const mockUser = `user-${Math.floor(Math.random() * 10000)}`
            setCollaborators((prev) => [...prev, mockUser])
          }, 2000)
        } else if (event === "user_left") {
          // Mock user leaving
          setTimeout(() => {
            setCollaborators((prev) => {
              if (prev.length <= 1) return prev
              return prev.filter((_, i) => i !== prev.length - 1)
            })
          }, 5000)
        }
      },
      emit: (event: string, data: any) => {
        // Mock emitting events
        if (event === "interaction" && this.receiveCallback) {
          // Simulate network delay before "receiving" our own event back
          setTimeout(() => {
            this.receiveCallback({ ...data, userId: "mock-user" })
          }, 100)
        }
      },
      disconnect: () => {
        this.receiveCallback = null
      },
      receiveCallback: null as Function | null,
    }

    return mockSocket
  }

  // Handle MIDI connection
  const onMIDISuccess = (midiAccess: any) => {
    const inputs = midiAccess.inputs

    inputs.forEach((input: any) => {
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
  const onMIDIMessage = (event: any) => {
    const [command, note, velocity] = event.data

    // Note on
    if (command === 144 && velocity > 0) {
      const x = Math.random() * canvasSize.width
      const y = Math.random() * canvasSize.height
      const intensity = velocity / 127

      // Create interaction data
      const interaction: InteractionData = {
        timestamp: Date.now(),
        x,
        y,
        intensity,
        note: note.toString(),
      }

      handleInteraction(interaction)
    }

    // Sustain pedal
    if (command === 176 && note === 64) {
      if (velocity >= 64) {
        // Pedal down - add global effect
        addGlobalEffect()
      }
    }
  }

  // Initialize
  useEffect(() => {
    // Initialize audio context
    initAudioContext()

    // Set up canvas sizing
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
    const animate = () => {
      updateCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Generate a unique user ID for collaborative mode
    setUserId(`user-${Math.floor(Math.random() * 10000)}`)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)

      // Stop all sounds
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
          osc.disconnect()
        } catch (e) {}
      })
      oscillatorsRef.current.clear()

      // Clean up audio context
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close()
      }

      // Clean up socket
      if (socketRef.current) {
        socketRef.current.disconnect()
      }

      // Clean up playback timeout
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current)
      }
    }
  }, [])

  // Handle collaborative mode
  useEffect(() => {
    if (isCollaborativeMode && !socketRef.current) {
      // In a real implementation, connect to a WebSocket server
      // For this demo, we'll create a mock implementation
      const mockSocket = mockSocketSetup()
      socketRef.current = mockSocket

      // Add current user to collaborators
      setCollaborators((prev) => [...prev, userId])
    } else if (!isCollaborativeMode && socketRef.current) {
      // Disconnect socket
      socketRef.current.disconnect()
      socketRef.current = null

      // Clear collaborators
      setCollaborators([])
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isCollaborativeMode, userId])

  // Set up keyboard navigation for accessibility
  useEffect(() => {
    if (!isAccessibilityModeActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle key events when accessibility mode is active
      if (!isAccessibilityModeActive) return

      // Map keyboard keys to notes
      const keyMap: { [key: string]: string } = {
        a: "C",
        w: "C#",
        s: "D",
        e: "D#",
        d: "E",
        f: "F",
        t: "F#",
        g: "G",
        y: "G#",
        h: "A",
        u: "A#",
        j: "B",
        k: "C",
      }

      const key = e.key.toLowerCase()

      if (keyMap[key] && !activeInteractions[key]) {
        // Calculate position based on the key
        const keyIndex = Object.keys(keyMap).indexOf(key)
        const totalKeys = Object.keys(keyMap).length

        const x = (keyIndex / totalKeys) * canvasSize.width + canvasSize.width / totalKeys / 2
        const y = canvasSize.height / 2

        // Create interaction data
        const interaction: InteractionData = {
          timestamp: Date.now(),
          x,
          y,
          intensity: 0.7,
          note: keyMap[key],
          id: `key:${key}`,
        }

        // Mark key as active
        setActiveInteractions((prev) => ({ ...prev, [key]: true }))

        // Handle the interaction
        handleInteraction(interaction)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // Clear active key
      if (activeInteractions[key]) {
        setActiveInteractions((prev) => {
          const newState = { ...prev }
          delete newState[key]
          return newState
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isAccessibilityModeActive, activeInteractions, canvasSize])

  // Update canvas with all visual elements
  const updateCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with customized background color
    ctx.fillStyle = currentEnvironment.visualStyle.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background effects (shooting stars)
    drawBackgroundEffects(ctx)

    // Update and draw visual elements
    updateVisualElements(ctx)

    // Draw audio visualization if analyser exists
    drawAudioVisualization(ctx)

    // Check if we should show reflection icon
    checkReflectionTrigger()

    // Record frame if recording
    if (isRecording) {
      recordFrame()
    }
  }

  // Draw audio visualization
  const drawAudioVisualization = (ctx: CanvasRenderingContext2D) => {
    if (!analyserNodeRef.current || !audioContextRef.current?.state === "running") return

    // Get frequency data
    const bufferLength = analyserNodeRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserNodeRef.current.getByteFrequencyData(dataArray)

    // Draw visualization at the bottom of the canvas
    const barWidth = (canvasSize.width / bufferLength) * 2.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2

      // Use colors from our palette based on frequency
      const colorIndex = Math.floor((i / bufferLength) * 5)
      const palette =
        getColorPalettes()[
          interactionStyle === "energetic" ? "major" : interactionStyle === "calm" ? "minor" : "neutral"
        ]
      const color = palette[colorIndex % palette.length]

      ctx.fillStyle = color
      ctx.globalAlpha = 0.5
      ctx.fillRect(x, canvasSize.height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }

    ctx.globalAlpha = 1
  }

  // Draw background effects
  const drawBackgroundEffects = (ctx: CanvasRenderingContext2D) => {
    // Randomly create shooting stars based on visual complexity
    if (Math.random() < 0.01 * (customSettings.visualComplexity / 50)) {
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

  // Draw a visual element based on its type and visual complexity
  const drawVisualElement = (ctx: CanvasRenderingContext2D, element: VisualElement) => {
    ctx.globalAlpha = element.alpha

    // Adjust visual complexity based on settings
    const complexity = customSettings.visualComplexity / 100 // 0 to 1

    switch (element.type) {
      case "ripple":
        drawRipple(ctx, element, complexity)
        break
      case "burst":
        drawBurst(ctx, element, complexity)
        break
      case "wave":
        drawWave(ctx, element, complexity)
        break
      case "spiral":
        drawSpiral(ctx, element, complexity)
        break
      case "particle":
        drawParticleSystem(ctx, element, complexity)
        break
      default:
        drawRipple(ctx, element, complexity)
    }

    ctx.globalAlpha = 1
  }

  // Draw ripple effect with complexity factor
  const drawRipple = (ctx: CanvasRenderingContext2D, element: VisualElement, complexity = 1) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 1000)

    // Adjust thickness based on complexity
    ctx.strokeStyle = element.color
    ctx.lineWidth = 1 + complexity

    // Main ripple
    ctx.beginPath()
    ctx.arc(element.x, element.y, size, 0, Math.PI * 2)
    ctx.stroke()

    // Inner ripples (more with higher complexity)
    const rippleCount = Math.floor(2 + complexity * 2)
    for (let i = 1; i <= rippleCount; i++) {
      ctx.beginPath()
      ctx.arc(element.x, element.y, size * (0.8 - i * 0.1 * complexity), 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  // Draw burst effect with complexity factor
  const drawBurst = (ctx: CanvasRenderingContext2D, element: VisualElement, complexity = 1) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 2000)

    ctx.fillStyle = element.color

    // Adjust number of points based on complexity
    const pointCount = Math.floor(8 + complexity * 8)

    for (let i = 0; i < pointCount; i++) {
      const angle = ((Math.PI * 2) / pointCount) * i
      const x = element.x + Math.cos(angle) * size
      const y = element.y + Math.sin(angle) * size

      ctx.beginPath()
      ctx.arc(x, y, size / (5 - complexity * 2), 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw wave effect with complexity factor
  const drawWave = (ctx: CanvasRenderingContext2D, element: VisualElement, complexity = 1) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 1500)

    ctx.strokeStyle = element.color
    ctx.lineWidth = 2 + complexity

    ctx.beginPath()

    const waveFrequency = 3 + complexity * 4
    const waveAmplitude = 0.2 + complexity * 0.3

    for (let i = 0; i < Math.PI * 2; i += 0.05) {
      const x = element.x + Math.cos(i) * size
      const y = element.y + Math.sin(i) * size * (1 + waveAmplitude * Math.sin(i * waveFrequency + elapsed / 200))

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.stroke()
  }

  // Draw spiral effect (new visual type)
  const drawSpiral = (ctx: CanvasRenderingContext2D, element: VisualElement, complexity = 1) => {
    const elapsed = Date.now() - element.startTime
    const size = element.size * (1 + elapsed / 2000)

    ctx.strokeStyle = element.color
    ctx.lineWidth = 1 + complexity * 2

    ctx.beginPath()

    const turns = 3 + complexity * 4
    const points = 100 + complexity * 100

    for (let i = 0; i < points; i++) {
      const t = (i / points) * turns * Math.PI * 2
      const radius = (i / points) * size
      const x = element.x + Math.cos(t + elapsed / 1000) * radius
      const y = element.y + Math.sin(t + elapsed / 1000) * radius

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  // Draw particle system effect (new visual type)
  const drawParticleSystem = (ctx: CanvasRenderingContext2D, element: VisualElement, complexity = 1) => {
    const elapsed = Date.now() - element.startTime
    const baseSize = element.size / 5

    // Number of particles based on complexity
    const particleCount = Math.floor(10 + complexity * 20)

    // Use element as a particle emitter
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const distance = baseSize + (elapsed / 1000) * (baseSize / 2)

      const x = element.x + Math.cos(angle) * distance
      const y = element.y + Math.sin(angle) * distance

      ctx.fillStyle = element.color
      ctx.beginPath()
      ctx.arc(x, y, baseSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Record a frame
  const recordFrame = () => {
    const timestamp = Date.now() - recordingStartTimeRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    // Get canvas data
    const imageData = canvas.toDataURL("image/png")

    // Create interaction data
    const interaction: InteractionData = {
      timestamp: Date.now(),
      x: 0,
      y: 0,
      intensity: 0,
      note: imageData,
    }

    // Find frame
    const frame = recordingFramesRef.current.find((f) => f.timestamp === timestamp)

    if (frame) {
      frame.interactions.push(interaction)
    } else {
      recordingFramesRef.current.push({
        timestamp,
        interactions: [interaction],
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Piano Heartbeat</h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  aria-label="Customize visuals and sounds"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Customize visuals and sounds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={isAccessibilityModeActive ? "bg-pink-100 text-pink-700" : ""}
                  onClick={toggleAccessibilityMode}
                  aria-label="Toggle keyboard accessibility"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle keyboard accessibility</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={isCollaborativeMode ? "bg-pink-100 text-pink-700" : ""}
                  onClick={toggleCollaborativeMode}
                  aria-label="Toggle collaborative mode"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle collaborative mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Add this after the existing buttons in the header section */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowEnvironmentSelector(!showEnvironmentSelector)}
                  aria-label="Change sound environment"
                >
                  <Music className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change sound environment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className="border-2 border-pink-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg font-medium text-gray-700 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-pink-500" />
              Interactive Sensory Experience
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Recording controls */}
              {!isRecording && !isPlaying ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startRecording}
                  className="text-red-500"
                  aria-label="Start recording"
                >
                  <span className="sr-only">Record</span>
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Record
                </Button>
              ) : isRecording ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopRecording}
                  className="text-red-500"
                  aria-label="Stop recording"
                >
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={stopPlayback} aria-label="Stop playback">
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              )}

              {/* Canvas mode toggle */}
              <Button
                variant="outline"
                size="sm"
                className={`${isPersistentMode ? "bg-pink-100 text-pink-700" : ""}`}
                onClick={togglePersistentMode}
                aria-label={isPersistentMode ? "Switch to flow mode" : "Switch to canvas mode"}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {isPersistentMode ? "Canvas Mode" : "Flow Mode"}
              </Button>

              {isPersistentMode && (
                <Button variant="outline" size="sm" onClick={handleClearCanvas} aria-label="Clear canvas">
                  Clear
                </Button>
              )}

              {/* MIDI status indicator */}
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full border ${
                  midiConnected ? "border-green-500 bg-green-100" : "border-gray-300"
                }`}
                title={midiConnected ? "MIDI Connected" : "MIDI Not Connected"}
                aria-label={midiConnected ? "MIDI Not Connected" : "MIDI Not Connected"}
              >
                <Music className={`h-4 w-4 ${midiConnected ? "text-green-600" : "text-gray-400"}`} />
              </div>

              {/* Collaborative mode indicator */}
              {isCollaborativeMode && collaborators.length > 0 && (
                <div className="flex items-center bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  <Users className="h-3 w-3 mr-1" />
                  {collaborators.length} online
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        {/* Update the CardContent div to use the current environment's background color
        Replace the existing containerRef div with this one: */}
        <CardContent className="p-0 relative">
          <div
            ref={containerRef}
            className="w-full h-[500px] relative"
            style={{
              backgroundColor: currentEnvironment.visualStyle.backgroundColor,
              background: `linear-gradient(to bottom, ${currentEnvironment.visualStyle.backgroundColor}, rgba(255, 255, 255, 0.9))`,
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="w-full h-full cursor-pointer"
              onClick={handleCanvasClick}
              aria-label="Interactive piano heartbeat canvas. Click to create sounds and visuals."
              role="application"
              tabIndex={isAccessibilityModeActive ? 0 : -1}
              aria-roledescription="Musical interactive canvas"
            />

            {/* Display current environment name */}
            <div className="absolute top-2 left-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              {currentEnvironment.name}
            </div>

            {/* Reflection icon */}
            {showReflection && (
              <div
                className="absolute bottom-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 border border-pink-200 cursor-pointer hover:bg-pink-200 transition-colors"
                onClick={handleReflectionClick}
                aria-label="Generate reflection"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleReflectionClick()}
              >
                <MessageCircle className="h-5 w-5 text-pink-600" />
              </div>
            )}

            {/* Reflection panel */}
            {reflection && (
              <div
                className="absolute bottom-16 right-4 max-w-xs p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-pink-100 shadow-md"
                onClick={handleDismissReflection}
                aria-live="polite"
                role="status"
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
        <CardFooter className="bg-gray-50 py-3 px-4">
          <div className="w-full">
            {isAccessibilityModeActive && (
              <div className="mb-3 text-sm text-gray-600">
                <p>Keyboard enabled. Use keys A-K to play notes (A=C, W=C#, S=D, etc.)</p>
              </div>
            )}
            <div className="text-center text-sm text-gray-500">
              <p>Click or tap anywhere on the canvas to create visual and sound effects.</p>
              {midiConnected && <p className="mt-1">MIDI keyboard connected. Play notes to create visuals.</p>}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Recordings section */}
      {recordings.length > 0 && (
        <Card className="mt-6 border-2 border-blue-100">
          <CardHeader>
            <CardTitle>Your Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {recordings.map((recording) => (
                  <div key={recording.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{recording.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(recording.dateCreated).toLocaleDateString()} • {Math.round(recording.duration / 1000)}
                        s
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playRecording(recording)}
                        disabled={isPlaying || isRecording}
                        aria-label={`Play ${recording.name}`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadRecording(recording)}
                        aria-label={`Download ${recording.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`Share ${recording.name}`}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Add the environment selector dialog
      Add this before the Settings Dialog: */}

      {/* Environment Selector Dialog */}
      <Dialog open={showEnvironmentSelector} onOpenChange={setShowEnvironmentSelector}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sound Environments</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {soundEnvironments.map((env) => (
                  <div
                    key={env.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      currentEnvironment.id === env.id
                        ? "bg-primary/20 border border-primary"
                        : "bg-card hover:bg-accent/50 border border-border"
                    }`}
                    onClick={() => changeEnvironment(env.id)}
                  >
                    <h3 className="font-medium text-lg">{env.name}</h3>
                    <p className="text-sm text-muted-foreground">{env.description}</p>
                    <div className="flex mt-2 gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: env.visualStyle.primaryColor }} />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: env.visualStyle.secondaryColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Visual and Sound Settings</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    style={{ backgroundColor: customSettings.primaryColor }}
                    id="primaryColor"
                  >
                    <div className="h-4 w-4 mr-2 rounded" style={{ backgroundColor: customSettings.primaryColor }} />
                    {customSettings.primaryColor}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <SketchPicker
                    color={customSettings.primaryColor}
                    onChange={(color) => setCustomSettings({ ...customSettings, primaryColor: color.hex })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    style={{ backgroundColor: customSettings.secondaryColor }}
                    id="secondaryColor"
                  >
                    <div className="h-4 w-4 mr-2 rounded" style={{ backgroundColor: customSettings.secondaryColor }} />
                    {customSettings.secondaryColor}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <SketchPicker
                    color={customSettings.secondaryColor}
                    onChange={(color) => setCustomSettings({ ...customSettings, secondaryColor: color.hex })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    style={{ backgroundColor: customSettings.backgroundColor }}
                    id="backgroundColor"
                  >
                    <div className="h-4 w-4 mr-2 rounded" style={{ backgroundColor: customSettings.backgroundColor }} />
                    {customSettings.backgroundColor}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <SketchPicker
                    color={customSettings.backgroundColor}
                    onChange={(color) => setCustomSettings({ ...customSettings, backgroundColor: color.hex })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visualComplexity">Visual Complexity</Label>
              <input
                type="range"
                id="visualComplexity"
                min="0"
                max="100"
                value={customSettings.visualComplexity}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    visualComplexity: Number.parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="soundVolume">Sound Volume</Label>
              <input
                type="range"
                id="soundVolume"
                min="0"
                max="100"
                value={customSettings.soundVolume}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    soundVolume: Number.parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="enableReverb">Enable Reverb</Label>
              <input
                type="checkbox"
                id="enableReverb"
                checked={customSettings.enableReverb}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    enableReverb: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="enableDelay">Enable Delay</Label>
              <input
                type="checkbox"
                id="enableDelay"
                checked={customSettings.enableDelay}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    enableDelay: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Recording Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Recording</DialogTitle>
            <p className="text-sm text-muted-foreground">Enter a name for your recording.</p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Recording Name</Label>
              <Input
                id="name"
                value={currentRecordingName}
                onChange={(e) => setCurrentRecordingName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveRecording}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
