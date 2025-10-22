"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SubjectGrid } from "@/components/student/subject-grid"
import { StudentHeader } from "@/components/student/student-header"
import { RecentActivity } from "@/components/student/recent-activity"

interface StudentDashboardProps {
  userId: string
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  student: any
  subjects: any[]
  recentAttempts: any[]
}

export function StudentDashboard({ profile, student, subjects, recentAttempts }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <StudentHeader
        studentName={profile.full_name || "Student"}
        points={student?.points || 0}
        level={student?.level || 1}
        streakDays={student?.streak_days || 0}
      />

      <main className="container mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-100">Total Points</CardDescription>
              <CardTitle className="text-4xl">{student?.points || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(student?.points || 0) % 100} className="bg-blue-300" />
              <p className="text-sm text-blue-100 mt-2">{100 - ((student?.points || 0) % 100)} points to next level</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-100">Current Level</CardDescription>
              <CardTitle className="text-4xl">Level {student?.level || 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-purple-300 text-purple-900 border-0 text-sm font-bold">
                {student?.level === 1 ? "Beginner" : student?.level < 5 ? "Explorer" : "Master"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-100">Learning Streak</CardDescription>
              <CardTitle className="text-4xl">{student?.streak_days || 0} days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-100">Keep it up! Learn daily to build your streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-balance text-center">Choose Your Subject</h2>
          <SubjectGrid subjects={subjects || []} studentId={student?.id || ""} />
        </div>

        {/* Recent Activity */}
        {recentAttempts && recentAttempts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Recent Activity</h2>
            <RecentActivity attempts={recentAttempts} />
          </div>
        )}
      </main>
    </div>
  )
}