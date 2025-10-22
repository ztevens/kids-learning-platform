import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface StudentHeaderProps {
  studentName: string
  points: number
  level: number
  streakDays: number
}

export function StudentHeader({ studentName, points, level, streakDays }: StudentHeaderProps) {
  async function signOut() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-blue-600">IYF STUDIO</h1>
          </div>

          <div className="flex items-center gap-6">
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
