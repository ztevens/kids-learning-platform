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

  // Get additional data based on role
  switch (profile.role) {
    case "student": {
      const { data: student } = await supabase.from("students").select("*").eq("profile_id", user.id).single()
      
      // Create student record if it doesn't exist
      if (!student) {
        await supabase
          .from("students")
          .insert({
            profile_id: user.id,
            year_group: 1,
            points: 0,
            level: 1,
            streak_days: 0,
          })
      }
      
      const { data: subjects } = await supabase.from("subjects").select("*").order("name")
      const { data: recentAttempts } = await supabase
        .from("quiz_attempts")
        .select(
          `
          *,
          quiz:quizzes(
            title,
            topic:topics(
              name,
              subject:subjects(name, color)
            )
          )
        `,
        )
        .eq("student_id", student?.id)
        .order("completed_at", { ascending: false })
        .limit(5)
      
      return <StudentDashboard userId={user.id} profile={profile} student={student} subjects={subjects || []} recentAttempts={recentAttempts || []} />
    }
    case "tutor": {
      const { data: tutor } = await supabase.from("tutors").select("*").eq("profile_id", user.id).single()
      
      // Create tutor record if it doesn't exist
      if (!tutor) {
        await supabase
          .from("tutors")
          .insert({
            profile_id: user.id,
            specialization: [],
            verified: false,
          })
      }
      
      const { data: assignments } = await supabase
        .from("assignments")
        .select(
          `
          *,
          student:students(
            profile:profiles(full_name)
          ),
          subject:subjects(name, color)
        `,
        )
        .eq("tutor_id", tutor?.id)
        .order("created_at", { ascending: false })
        .limit(10)
      
      return <TutorDashboard userId={user.id} profile={profile} tutor={tutor} assignments={assignments || []} />
    }
    case "parent": {
      const { data: parent } = await supabase.from("parents").select("*").eq("profile_id", user.id).single()
      
      // Create parent record if it doesn't exist
      if (!parent) {
        await supabase
          .from("parents")
          .insert({
            profile_id: user.id,
            subscription_tier: "basic",
            subscription_status: "inactive",
          })
      }
      
      const { data: children } = await supabase
        .from("students")
        .select(
          `
          *,
          profile:profiles(full_name, email)
        `,
        )
        .eq("parent_id", user.id)
        .order("profile(full_name)")
      
      const childrenIds = children?.map((c) => c.id) || []
      const { data: weeklyInsights } = await supabase
        .from("weekly_insights")
        .select("*")
        .in("student_id", childrenIds)
        .order("week_start_date", { ascending: false })
      
      return <ParentDashboard userId={user.id} profile={profile} parent={parent} children={children || []} weeklyInsights={weeklyInsights || []} />
    }
    case "admin": {
      const { data: recentProfiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
      
      const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })
      const { count: totalTutors } = await supabase.from("tutors").select("*", { count: "exact", head: true })
      const { count: totalParents } = await supabase.from("parents").select("*", { count: "exact", head: true })
      const { count: totalQuizzes } = await supabase.from("quizzes").select("*", { count: "exact", head: true })
      const { count: totalAttempts } = await supabase.from("quiz_attempts").select("*", { count: "exact", head: true })
      const { count: totalAssignments } = await supabase.from("assignments").select("*", { count: "exact", head: true })
      
      return <AdminDashboard 
        userId={user.id} 
        profile={profile} 
        recentProfiles={recentProfiles || []}
        stats={{
          totalStudents: totalStudents || 0,
          totalTutors: totalTutors || 0,
          totalParents: totalParents || 0,
          totalQuizzes: totalQuizzes || 0,
          totalAttempts: totalAttempts || 0,
          totalAssignments: totalAssignments || 0,
        }}
      />
    }
    default:
      redirect("/auth/login")
  }
}