import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { TutorDashboard } from "@/components/dashboard/tutor-dashboard"
import { ParentDashboard } from "@/components/dashboard/parent-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile to determine role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Route to appropriate dashboard based on role
  switch (profile.role) {
    case "student":
      return <StudentDashboard userId={user.id} profile={profile} />
    case "tutor":
      return <TutorDashboard userId={user.id} profile={profile} />
    case "parent":
      return <ParentDashboard userId={user.id} profile={profile} />
    case "admin":
      return <AdminDashboard userId={user.id} profile={profile} />
    default:
      redirect("/auth/login")
  }
}