"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FancyLogo } from "@/components/ui/fancy-logo"
import { MainNav } from "@/components/navigation/main-nav"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<string>("student")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <MainNav showHomeButton={true} showBackButton={false} />
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
            <p className="text-muted-foreground">Start your learning journey! 🚀</p>
          </div>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign up</CardTitle>
              <CardDescription className="text-center">Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">I am a...</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="tutor">Tutor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-green-200 focus:border-green-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repeat Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="border-2 border-yellow-200 focus:border-yellow-400"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 text-blue-600 hover:text-purple-600">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}