"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Home } from "lucide-react"
import { FancyLogo } from "@/components/ui/fancy-logo"
import { signOut } from "@/app/actions/auth"
import Link from "next/link"

interface StudentHeaderProps {
  studentName: string
  points: number
  level: number
  streakDays: number
}

export function StudentHeader({ studentName, points, level, streakDays }: StudentHeaderProps) {

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FancyLogo size="md" clickable={true} />
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Points</p>
                <p className="font-bold text-lg text-blue-600">{points}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Level</p>
                <p className="font-bold text-lg text-purple-600">{level}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Streak</p>
                <p className="font-bold text-lg text-orange-600">{streakDays} days</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {studentName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold">{studentName}</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>

            <form action={signOut}>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
