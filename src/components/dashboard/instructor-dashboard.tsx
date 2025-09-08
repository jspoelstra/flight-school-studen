import { useState } from 'react'
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
  Calendar,
  FileText,
  Certificate
} from '@phosphor-icons/react'
import { LessonsManager } from '@/components/lessons'
import { StudentDetailView } from '@/components/students'
import { EndorsementsManager } from '@/components/endorsements'
import { useSampleData } from '@/lib/sample-data'
import { useKV } from '@github/spark/hooks'
import { Lesson, Student } from '@/lib/types'

export function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  // Initialize sample data and get real data from KV store
  useSampleData()
  const [lessons] = useKV<Lesson[]>('lessons', [])
  const { students } = useSampleData()

  // Calculate real metrics from stored data
  const draftLessons = lessons.filter(lesson => lesson.status === 'draft')
  const finalLessons = lessons.filter(lesson => lesson.status === 'final')
  const recentLessons = lessons.filter(lesson => {
    const lessonDate = new Date(lesson.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return lessonDate >= weekAgo
  })

  const instructorData = {
    totalStudents: students.length,
    activeLessons: recentLessons.length,
    draftLessons: draftLessons.length,
    upcomingLessons: 5, // This would come from scheduling system
    students: students.map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      progress: student.progress.percentComplete,
      lastLesson: lessons
        .filter(lesson => lesson.studentId === student.id && lesson.status === 'final')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || 'None',
      nextLesson: '2024-01-15', // Would come from scheduling
      status: student.progress.percentComplete >= 90 ? 'stage-check' : 'active'
    })),
    draftLessons: draftLessons.map(lesson => {
      const student = students.find(s => s.id === lesson.studentId)
      const daysSinceCreated = Math.floor(
        (new Date().getTime() - new Date(lesson.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      return {
        id: lesson.id,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        lessonTitle: lesson.type === 'flight' ? 'Flight Training' : 'Ground Instruction',
        date: lesson.date,
        daysOverdue: Math.max(0, daysSinceCreated - 1) // Draft is overdue after 1 day
      }
    })
  }

  // Handle viewing a specific student
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
  }

  const handleBackToStudents = () => {
    setSelectedStudent(null)
  }

  // If a student is selected, show the detail view
  if (selectedStudent) {
    return <StudentDetailView student={selectedStudent} onBack={handleBackToStudents} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Instructor Dashboard</h2>
          <p className="text-muted-foreground">Manage your students and lessons</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Navigation Buttons */}
        <div className="flex space-x-2 border-b">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Students
          </Button>
          <Button 
            variant={activeTab === 'lessons' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('lessons')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Lessons
          </Button>
          <Button 
            variant={activeTab === 'endorsements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('endorsements')}
            className="flex items-center gap-2"
          >
            <Certificate className="h-4 w-4" />
            Endorsements
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const fullStudent = students.find(s => s.id === student.id)
                          if (fullStudent) {
                            handleViewStudent(fullStudent)
                          }
                        }}
                      >
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
                  {instructorData.draftLessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No draft lessons pending
                    </p>
                  ) : (
                    instructorData.draftLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lesson.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.lessonTitle} • {lesson.date}
                          </p>
                          {lesson.daysOverdue > 0 && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {lesson.daysOverdue} days overdue
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('lessons')}
                        >
                          Finalize
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
          {/* Students List - Simplified version for navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>Manage your assigned students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructorData.students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const fullStudent = students.find(s => s.id === student.id)
                        if (fullStudent) {
                          handleViewStudent(fullStudent)
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'lessons' && (
          <LessonsManager />
        )}

        {activeTab === 'endorsements' && (
          <EndorsementsManager />
        )}
      </div>
    </div>
  )
}