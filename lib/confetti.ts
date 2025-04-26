// This is a mock implementation of canvas-confetti for our Next.js environment
// In a real project, you would install the canvas-confetti package

interface ConfettiOptions {
  particleCount?: number
  spread?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  startVelocity?: number
  scalar?: number
  ticks?: number
  shapes?: string[]
  zIndex?: number
}

function confetti(options: ConfettiOptions = {}) {
  console.log("Confetti animation triggered with options:", options)
  // In a real implementation, this would trigger the confetti animation
  return Promise.resolve()
}

export default confetti
