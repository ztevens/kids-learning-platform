"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FancyLogo } from "@/components/ui/fancy-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Background illustrations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-30">📚</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce opacity-30">📖</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-bounce opacity-30">📘</div>
        <div className="absolute top-32 right-10 text-4xl animate-bounce opacity-30">💻</div>
        <div className="absolute bottom-20 right-32 text-3xl animate-bounce opacity-30">📱</div>
        <div className="absolute top-60 left-32 text-4xl animate-bounce opacity-30">🎧</div>
        <div className="absolute bottom-60 left-1/4 text-3xl animate-bounce opacity-30">✏️</div>
        <div className="absolute top-40 left-1/3 text-4xl animate-bounce opacity-30">📐</div>
        <div className="absolute bottom-40 right-1/3 text-4xl animate-bounce opacity-30">🔬</div>
        <div className="absolute top-1/4 left-10 text-4xl animate-pulse opacity-30">👧</div>
        <div className="absolute top-1/3 right-10 text-4xl animate-pulse opacity-30">👦</div>
        <div className="absolute bottom-1/4 left-20 text-4xl animate-pulse opacity-30">🧒</div>
        <div className="absolute bottom-1/3 right-20 text-4xl animate-pulse opacity-30">🧑‍🎓</div>
      </div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <FancyLogo size="lg" clickable={true} />
            </div>
            <p className="text-muted-foreground">Welcome back to learning! 🎓</p>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">Enter your email to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="underline underline-offset-4 text-blue-600 hover:text-purple-600">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}