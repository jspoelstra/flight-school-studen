import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Plus,
  AlertCircle,
  Calendar
} from '@phosphor-icons/react'

export function InstructorDashboard() {
  const instructorData = {
    totalStudents: 12,
    activeLessons: 8,
    draftLessons: 3,
    upcomingLessons: 5,
    students: [
      {
        id: '1',
        name: 'Mike Student',
        progress: 75,
        lastLesson: '2024-01-10',
        nextLesson: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Pilot',
        progress: 45,
        lastLesson: '2024-01-09',
        nextLesson: '2024-01-16',
        status: 'active'
      },
      {
        id: '3',
        name: 'Bob Aviator',
        progress: 90,
        lastLesson: '2024-01-08',
        nextLesson: '2024-01-17',
        status: 'stage-check'
      }
    ],
    draftLessons: [
      {
        id: '1',
        studentName: 'Mike Student',
        lessonTitle: 'Emergency Procedures',
        date: '2024-01-10',
        daysOverdue: 2
      },
      {
        id: '2',
        studentName: 'Jane Pilot',
        lessonTitle: 'Traffic Patterns',
        date: '2024-01-09',
        daysOverdue: 3
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Instructor Dashboard</h2>
          <p className="text-muted-foreground">Manage your students and lessons</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Lesson
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active training students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorData.activeLessons}</div>
            <p className="text-xs text-muted-foreground">
              In progress this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Lessons</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{instructorData.draftLessons.length}</div>
            <p className="text-xs text-muted-foreground">
              Require finalization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorData.upcomingLessons}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Students
            </CardTitle>
            <CardDescription>Current student roster and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorData.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{student.name}</p>
                      {student.status === 'stage-check' && (
                        <Badge variant="secondary">Stage Check Due</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Progress: {student.progress}% • Last: {student.lastLesson}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Draft Lessons Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Pending Finalization
            </CardTitle>
            <CardDescription>Draft lessons requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorData.draftLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{lesson.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.lessonTitle} • {lesson.date}
                    </p>
                    <Badge variant="destructive" className="text-xs mt-1">
                      {lesson.daysOverdue} days overdue
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Finalize
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}