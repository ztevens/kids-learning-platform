import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-blue-600 tracking-tight">IYF STUDIO</h1>
          <p className="text-2xl text-muted-foreground">Gamified Learning Platform for Years 1-6</p>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Master all core UK subjects through fun, interactive quizzes. Connect with expert tutors, track your progress,
          and level up your learning journey!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/sign-up">Start Learning Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="text-4xl">🎮</div>
            <h3 className="font-semibold">Gamified Learning</h3>
            <p className="text-sm text-muted-foreground">Earn points and level up</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">📚</div>
            <h3 className="font-semibold">All Core Subjects</h3>
            <p className="text-sm text-muted-foreground">Maths, English, Science & more</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">👨‍🏫</div>
            <h3 className="font-semibold">Expert Tutors</h3>
            <p className="text-sm text-muted-foreground">Live classes & assignments</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">📊</div>
            <h3 className="font-semibold">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">Weekly insights for parents</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">🏆</div>
            <h3 className="font-semibold">Achievements</h3>
            <p className="text-sm text-muted-foreground">Unlock badges & rewards</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">⚡</div>
            <h3 className="font-semibold">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">Daily learning habits</p>
          </div>
        </div>
      </div>
    </div>
  )
}
