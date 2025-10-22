import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface RecentActivityProps {
  attempts: Array<{
    id: string
    score: number
    total_questions: number
    completed_at: string
    quiz: {
      title: string
      topic: {
        name: string
        subject: {
          name: string
          color: string
        }
      }
    } | null
  }>
}

export function RecentActivity({ attempts }: RecentActivityProps) {
  return (
    <div className="space-y-3">
      {attempts.map((attempt) => {
        const percentage = (attempt.score / attempt.total_questions) * 100
        const passed = percentage >= 70

        return (
          <Card key={attempt.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${passed ? "bg-green-100" : "bg-red-100"}`}>
                    {passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{attempt.quiz?.title || "Quiz"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {attempt.quiz?.topic?.subject?.name} - {attempt.quiz?.topic?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={passed ? "default" : "destructive"} className="mb-1">
                    {attempt.score}/{attempt.total_questions}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{new Date(attempt.completed_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
