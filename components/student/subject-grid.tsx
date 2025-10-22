import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Subject {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
}

interface SubjectGridProps {
  subjects: Subject[]
  studentId: string
}

export function SubjectGrid({ subjects }: SubjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <Card
          key={subject.id}
          className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{subject.icon}</div>
              <div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
              </div>
            </div>
            <CardDescription className="mt-2">{subject.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" style={{ backgroundColor: subject.color || undefined }}>
              <Link href={`/subjects/${subject.id}`}>Start Learning</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
