import { Button } from "@/components/ui/button"
import { FancyLogo } from "@/components/ui/fancy-logo"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-6 relative overflow-hidden">
      {/* Background illustrations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Books */}
        <div className="absolute top-10 left-10 text-5xl animate-bounce">📚</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce">📖</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-bounce">📘</div>
        
        {/* Tech devices */}
        <div className="absolute top-32 right-10 text-5xl animate-bounce">💻</div>
        <div className="absolute bottom-20 right-32 text-4xl animate-bounce">📱</div>
        <div className="absolute top-60 left-32 text-5xl animate-bounce">🎧</div>
        
        {/* Learning items */}
        <div className="absolute bottom-60 left-1/4 text-4xl animate-bounce">✏️</div>
        <div className="absolute top-40 left-1/3 text-5xl animate-bounce">📐</div>
        <div className="absolute bottom-40 right-1/3 text-5xl animate-bounce">🔬</div>
        
        {/* Kids learning */}
        <div className="absolute top-1/4 left-10 text-5xl animate-pulse">👧</div>
        <div className="absolute top-1/3 right-10 text-5xl animate-pulse">👦</div>
        <div className="absolute bottom-1/4 left-20 text-5xl animate-pulse">🧒</div>
        <div className="absolute bottom-1/3 right-20 text-5xl animate-pulse">🧑‍🎓</div>
        
        {/* Fun elements */}
        <div className="absolute top-1/2 left-1/4 text-4xl animate-spin">⭐</div>
        <div className="absolute bottom-1/2 right-1/4 text-4xl animate-spin">🌟</div>
      </div>
      
      <div className="max-w-4xl text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="flex justify-center">
            <FancyLogo size="xl" clickable={false} />
          </div>
          <p className="text-2xl text-muted-foreground">Gamified Learning Platform for Years 1-6 🎮📚</p>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Master all core UK subjects through fun, interactive quizzes. Connect with expert tutors, track your progress,
          and level up your learning journey!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
            <Link href="/auth/sign-up">Start Learning Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/80 hover:bg-white border-2 border-purple-300 shadow-lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">🎮</div>
            <h3 className="font-bold text-blue-600">Gamified Learning</h3>
            <p className="text-sm text-muted-foreground">Earn points and level up</p>
          </div>
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">📚</div>
            <h3 className="font-bold text-purple-600">All Core Subjects</h3>
            <p className="text-sm text-muted-foreground">Maths, English, Science & more</p>
          </div>
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-green-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">👨‍🏫</div>
            <h3 className="font-bold text-green-600">Expert Tutors</h3>
            <p className="text-sm text-muted-foreground">Live classes & assignments</p>
          </div>
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-yellow-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">📊</div>
            <h3 className="font-bold text-yellow-600">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">Weekly insights for parents</p>
          </div>
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-pink-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">🏆</div>
            <h3 className="font-bold text-pink-600">Achievements</h3>
            <p className="text-sm text-muted-foreground">Unlock badges & rewards</p>
          </div>
          <div className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-all">
            <div className="text-4xl">⚡</div>
            <h3 className="font-bold text-orange-600">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">Daily learning habits</p>
          </div>
        </div>
      </div>
    </div>
  )
}