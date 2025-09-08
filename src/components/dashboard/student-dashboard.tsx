import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Award,
  TrendingUp,
  Calendar
} from '@phosphor-icons/react'

export function StudentDashboard() {
  const studentProgress = {
    totalLessons: 40,
    completedLessons: 15,
    percentComplete: 37.5,
    nextLesson: 'Navigation and Cross-Country Planning',
    nextLessonDate: '2024-01-15',
    recentLessons: [
      {
        id: '1',
        title: 'Traffic Patterns',
        date: '2024-01-10',
        instructor: 'Sarah CFI',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Emergency Procedures',
        date: '2024-01-08',
        instructor: 'Sarah CFI',
        status: 'completed'
      }
    ],
    endorsements: [
      {
        id: '1',
        title: 'Pre-Solo Written Exam',
        issuedDate: '2024-01-05',
        instructor: 'Sarah CFI',
        status: 'active'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Training Dashboard</h2>
        <p className="text-muted-foreground">Track your flight training progress</p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProgress.percentComplete}%</div>
            <Progress value={studentProgress.percentComplete} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {studentProgress.completedLessons} of {studentProgress.totalLessons} lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProgress.completedLessons}</div>
            <p className="text-xs text-muted-foreground">
              Flight and ground instruction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Endorsements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProgress.endorsements.length}</div>
            <p className="text-xs text-muted-foreground">
              Current valid endorsements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{studentProgress.nextLessonDate}</div>
            <p className="text-xs text-muted-foreground">
              {studentProgress.nextLesson}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Lessons
            </CardTitle>
            <CardDescription>Your latest training activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.date} • {lesson.instructor}
                    </p>
                  </div>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endorsements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Active Endorsements
            </CardTitle>
            <CardDescription>Your current flight endorsements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.endorsements.map((endorsement) => (
                <div key={endorsement.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{endorsement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Issued {endorsement.issuedDate} by {endorsement.instructor}
                    </p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}