import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CreateAssignmentForm } from "@/components/tutor/create-assignment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CreateAssignmentPage() {
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

  // Get all students
  const { data: students } = await supabase
    .from("students")
    .select(
      `
      id,
      year_group,
      profile:profiles(full_name)
    `,
    )
    .order("profile(full_name)")

  // Get all subjects
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

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
            <h1 className="text-2xl font-bold">Create New Assignment</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-2xl">
        <CreateAssignmentForm tutorId={tutor.id} students={students || []} subjects={subjects || []} />
      </main>
    </div>
  )
}
