import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default async function TutorStudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get tutor record
  const { data: tutor } = await supabase.from("tutors").select("*").eq("profile_id", user.id).single()

  if (!tutor) {
    redirect("/dashboard")
  }

  // Get all students (in a real app, this would be filtered to tutor's students)
  const { data: students } = await supabase
    .from("students")
    .select(
      `
      *,
      profile:profiles(full_name, email)
    `,
    )
    .order("profile(full_name)")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">My Students</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {students && students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {student.profile?.full_name?.charAt(0).toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.profile?.full_name || "Unknown Student"}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Year {student.year_group}</Badge>
                        <Badge variant="outline">Level {student.level}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Points</p>
                      <p className="font-bold text-blue-600">{student.points}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Streak</p>
                      <p className="font-bold text-orange-600">{student.streak_days}d</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Level</p>
                      <p className="font-bold text-purple-600">{student.level}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/tutor/students/${student.id}`}>View Progress</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${student.profile?.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No students found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
