"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface ParentDashboardProps {
  userId: string
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  parent: any
  children: any[]
  weeklyInsights: any[]
}

export function ParentDashboard({ profile, parent, children, weeklyInsights }: ParentDashboardProps) {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-blue-600">IYF STUDIO</h1>
              <Badge variant="secondary">Parent</Badge>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-600 text-white">
                  {profile.full_name?.charAt(0).toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">Parent Account</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Subscription Status */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription className="text-blue-100">
              {parent?.subscription_tier
                ? `${parent.subscription_tier.charAt(0).toUpperCase() + parent.subscription_tier.slice(1)} Plan`
                : "No active subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Children Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Children</h2>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/parent/add-child">Add Child</Link>
            </Button>
          </div>

          {children && children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => {
                // Get latest insight for this child
                const latestInsight = weeklyInsights?.find((insight) => insight.student_id === child.id)

                return (
                  <Card key={child.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-600 text-white text-lg">
                            {child.profile?.full_name?.charAt(0).toUpperCase() || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{child.profile?.full_name || "Unknown"}</CardTitle>
                          <p className="text-sm text-muted-foreground">Year {child.year_group}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <p className="text-muted-foreground">Points</p>
                          <p className="font-bold text-blue-600">{child.points}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Level</p>
                          <p className="font-bold text-purple-600">{child.level}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Streak</p>
                          <p className="font-bold text-orange-600">{child.streak_days}d</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {latestInsight && (
                        <>
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Average Score</span>
                              <span className="font-semibold">{latestInsight.average_score?.toFixed(0)}%</span>
                            </div>
                            <Progress value={Number(latestInsight.average_score) || 0} />
                          </div>

                          <div className="text-sm">
                            <p className="text-muted-foreground mb-1">This Week</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{latestInsight.total_quizzes_completed} quizzes completed</span>
                            </div>
                          </div>
                        </>
                      )}

                      <Button asChild className="w-full">
                        <Link href={`/parent/children/${child.id}`}>View Full Progress</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No children added yet</p>
                <Button asChild>
                  <Link href="/parent/add-child">Add Your First Child</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Weekly Insights Summary */}
        {weeklyInsights && weeklyInsights.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklyInsights.slice(0, 4).map((insight) => {
                const child = children?.find((c) => c.id === insight.student_id)

                return (
                  <Card key={insight.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {child?.profile?.full_name || "Unknown"} - Week of{" "}
                        {new Date(insight.week_start_date).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quizzes</p>
                          <p className="font-semibold">{insight.total_quizzes_completed}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Score</p>
                          <p className="font-semibold">{insight.average_score?.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time Spent</p>
                          <p className="font-semibold">{insight.total_time_spent_minutes} min</p>
                        </div>
                      </div>

                      {insight.strengths && insight.strengths.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-1">
                            <TrendingUp className="h-4 w-4" />
                            Strengths
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {insight.strengths.map((strength: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {insight.areas_for_improvement && insight.areas_for_improvement.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 mb-1">
                            <TrendingDown className="h-4 w-4" />
                            Areas to Improve
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {insight.areas_for_improvement.map((area: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}