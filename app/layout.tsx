import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blossom - Empowering Autism Families",
  description: "A web platform to support families with autism",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
