import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get all users
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

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
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Input placeholder="Search users..." className="max-w-md bg-white" />
        </div>

        {profiles && profiles.length > 0 ? (
          <div className="space-y-3">
            {profiles.map((userProfile) => (
              <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={`text-white ${
                            userProfile.role === "admin"
                              ? "bg-red-600"
                              : userProfile.role === "tutor"
                                ? "bg-purple-600"
                                : userProfile.role === "parent"
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                          }`}
                        >
                          {userProfile.full_name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{userProfile.full_name || "Unknown User"}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{userProfile.email}</span>
                          <Badge
                            variant={
                              userProfile.role === "admin"
                                ? "destructive"
                                : userProfile.role === "tutor"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {userProfile.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(userProfile.created_at).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
