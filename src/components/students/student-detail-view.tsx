import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  User,
  BookOpen,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Plane,
  FileText
} from '@phosphor-icons/react'
import { Student, Lesson, Endorsement, StageCheck } from '@/lib/types'
import { useKV } from '@github/spark/hooks'

interface StudentDetailViewProps {
  student: Student
  onBack: () => void
}

export function StudentDetailView({ student, onBack }: StudentDetailViewProps) {
  const [lessons] = useKV<Lesson[]>('lessons', [])
  const [endorsements] = useKV<Endorsement[]>('endorsements', [])
  const [stageChecks] = useKV<StageCheck[]>('stage-checks', [])

  // Filter data for this student
  const studentLessons = lessons.filter(lesson => lesson.studentId === student.id)
  const studentEndorsements = endorsements.filter(endorsement => endorsement.studentId === student.id)
  const studentStageChecks = stageChecks.filter(stageCheck => stageCheck.studentId === student.id)

  // Calculate lesson statistics
  const flightLessons = studentLessons.filter(lesson => lesson.type === 'flight')
  const groundLessons = studentLessons.filter(lesson => lesson.type === 'ground')
  const totalFlightTime = flightLessons.reduce((total, lesson) => total + lesson.duration, 0)
  const recentLessons = studentLessons
    .filter(lesson => lesson.status === 'final')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'withdrawn':
        return <Badge variant="destructive">Withdrawn</Badge>
      default:
        return <Badge variant="outline">Inactive</Badge>
    }
  }

  const getTrainingObjective = (objective: string) => {
    const objectives = {
      ppl: 'Private Pilot License',
      instrument: 'Instrument Rating',
      commercial: 'Commercial License',
      cfi: 'Certified Flight Instructor'
    }
    return objectives[objective as keyof typeof objectives] || objective
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Button>
        <div>
          <h2 className="text-3xl font-bold">{student.firstName} {student.lastName}</h2>
          <p className="text-muted-foreground">Student #{student.studentNumber}</p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(student.status)}
        </div>
      </div>

      {/* Student Information Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.progress.percentComplete}%</div>
            <p className="text-xs text-muted-foreground">
              {student.progress.completedLessons} of {student.progress.totalLessons} lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flight Hours</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(totalFlightTime)}</div>
            <p className="text-xs text-muted-foreground">
              {flightLessons.length} flight lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endorsements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentEndorsements.filter(e => e.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Active endorsements
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Records</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          <TabsTrigger value="stage-checks">Stage Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                    <p className="text-sm">{formatDate(student.enrollmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Training Goal</p>
                    <p className="text-sm">{getTrainingObjective(student.trainingObjective)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical Class</p>
                    <p className="text-sm capitalize">{student.medicalClass}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical Expires</p>
                    <p className="text-sm">{formatDate(student.medicalExpiration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Lessons
                </CardTitle>
                <CardDescription>Latest 5 completed lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No completed lessons yet
                    </p>
                  ) : (
                    recentLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {lesson.type === 'flight' ? (
                            <Plane className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-secondary-foreground" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {lesson.type === 'flight' ? 'Flight Training' : 'Ground Instruction'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(lesson.date)} • {formatDuration(lesson.duration)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {lesson.objectives.filter(obj => obj.assessment === 'met').length}/
                          {lesson.objectives.length} met
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>All Lesson Records</CardTitle>
              <CardDescription>Complete history of flight and ground lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentLessons.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No lesson records found
                  </p>
                ) : (
                  studentLessons
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {lesson.type === 'flight' ? (
                              <Plane className="h-5 w-5 text-primary" />
                            ) : (
                              <FileText className="h-5 w-5 text-secondary-foreground" />
                            )}
                            <div>
                              <h4 className="font-medium">
                                {lesson.type === 'flight' ? 'Flight Training' : 'Ground Instruction'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(lesson.date)} • {formatDuration(lesson.duration)}
                                {lesson.aircraft && ` • ${lesson.aircraft}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={lesson.status === 'final' ? 'default' : 'secondary'}>
                              {lesson.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {lesson.objectives.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-2">Objectives:</p>
                            <div className="grid gap-1">
                              {lesson.objectives.map((objective) => (
                                <div key={objective.id} className="flex items-center gap-2">
                                  {objective.assessment === 'met' ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : objective.assessment === 'partial' ? (
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-sm">
                                    {objective.code}: {objective.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {lesson.remarks && (
                          <div>
                            <p className="text-sm font-medium mb-1">Remarks:</p>
                            <p className="text-sm text-muted-foreground">{lesson.remarks}</p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endorsements">
          <Card>
            <CardHeader>
              <CardTitle>Endorsements</CardTitle>
              <CardDescription>Active and expired endorsements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentEndorsements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No endorsements issued yet
                  </p>
                ) : (
                  studentEndorsements
                    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
                    .map((endorsement) => (
                      <div key={endorsement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{endorsement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Issued: {formatDate(endorsement.issuedAt)}
                              {endorsement.expiresAt && ` • Expires: ${formatDate(endorsement.expiresAt)}`}
                            </p>
                          </div>
                          <Badge variant={endorsement.status === 'active' ? 'default' : 'secondary'}>
                            {endorsement.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{endorsement.content}</p>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stage-checks">
          <Card>
            <CardHeader>
              <CardTitle>Stage Checks</CardTitle>
              <CardDescription>Evaluation records and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentStageChecks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No stage checks completed yet
                  </p>
                ) : (
                  studentStageChecks
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((stageCheck) => (
                      <div key={stageCheck.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{stageCheck.stage}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(stageCheck.date)}
                              {stageCheck.signedAt && ` • Signed: ${formatDate(stageCheck.signedAt)}`}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              stageCheck.outcome === 'pass' ? 'default' : 
                              stageCheck.outcome === 'conditional' ? 'secondary' : 'destructive'
                            }
                          >
                            {stageCheck.outcome}
                          </Badge>
                        </div>
                        
                        {stageCheck.notes && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Notes:</p>
                            <p className="text-sm text-muted-foreground">{stageCheck.notes}</p>
                          </div>
                        )}
                        
                        {stageCheck.remediationTasks.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Remediation Tasks:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {stageCheck.remediationTasks.map((task, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 bg-muted-foreground rounded-full flex-shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}