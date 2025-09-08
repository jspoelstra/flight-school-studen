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
  Certificate,
  Airplane,
  Compass,
  Target
} from '@phosphor-icons/react'
import { LessonsManager } from '@/components/lessons'
import { StudentDetailView } from '@/components/students'
import { EndorsementsManager } from '@/components/endorsements'
import { LessonScheduler } from '@/components/scheduling'
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
      <div className="flex items-center justify-between relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Airplane className="h-16 w-16 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Flight Instructor Command Center
          </h2>
          <p className="text-muted-foreground">Guide the next generation of aviators</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Navigation Buttons */}
        <div className="flex space-x-2 border-b border-border/30 pb-4">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 aviation-glow"
          >
            <Compass className="h-4 w-4" />
            Command Center
          </Button>
          <Button 
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Student Pilots
          </Button>
          <Button 
            variant={activeTab === 'lessons' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('lessons')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Flight Logs
          </Button>
          <Button 
            variant={activeTab === 'endorsements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('endorsements')}
            className="flex items-center gap-2"
          >
            <Certificate className="h-4 w-4" />
            Endorsements
          </Button>
          <Button 
            variant={activeTab === 'scheduling' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('scheduling')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Scheduling
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Student Pilots</CardTitle>
                <div className="p-2 bg-primary/20 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{instructorData.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Under your instruction
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Active Flights</CardTitle>
                <div className="p-2 bg-accent/20 rounded-full">
                  <BookOpen className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{instructorData.activeLessons}</div>
                <p className="text-xs text-muted-foreground">
                  Completed this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Pending Reports</CardTitle>
                <div className="p-2 bg-destructive/20 rounded-full">
                  <Clock className="h-4 w-4 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{instructorData.draftLessons.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require finalization
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Scheduled</CardTitle>
                <div className="p-2 bg-primary/20 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{instructorData.upcomingLessons}</div>
                <p className="text-xs text-muted-foreground">
                  Flights this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Overview */}
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Student Squadron
                </CardTitle>
                <CardDescription>Your current pilot trainees and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructorData.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{student.name}</p>
                          {student.status === 'stage-check' && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                              <Target className="h-3 w-3 mr-1" />
                              Check Ride Due
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Progress: {student.progress}% • Last Flight: {student.lastLesson}
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
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Draft Lessons Alert */}
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="p-2 bg-destructive/20 rounded-full">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  Flight Reports Pending
                </CardTitle>
                <CardDescription>Lesson reports requiring your final review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructorData.draftLessons.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-accent mx-auto mb-2" />
                      <p className="text-muted-foreground">All reports finalized</p>
                      <p className="text-xs text-muted-foreground">Your logbook is up to date</p>
                    </div>
                  ) : (
                    instructorData.draftLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                        <div>
                          <p className="font-medium text-foreground">{lesson.studentName}</p>
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
                          className="border-accent/30 hover:bg-accent/10"
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
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Students List - Simplified version for navigation */}
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Student Pilot Management
                </CardTitle>
                <CardDescription>Manage your assigned aviation students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructorData.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{student.name}</p>
                          {student.status === 'stage-check' && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                              <Target className="h-3 w-3 mr-1" />
                              Check Ride Due
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Training Progress: {student.progress}% • Last Flight: {student.lastLesson}
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
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'lessons' && (
          <LessonsManager />
        )}

        {activeTab === 'endorsements' && (
          <EndorsementsManager />
        )}

        {activeTab === 'scheduling' && (
          <LessonScheduler />
        )}
      </div>
    </div>
  )
}