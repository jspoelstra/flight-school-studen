import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Plane,
  BookOpen,
  Calendar,
  User,
  Edit,
  FileText,
  MapPin
} from '@phosphor-icons/react'
import { Lesson, Student } from '@/lib/types'

interface LessonDetailsProps {
  lesson: Lesson
  onBack?: () => void
  onEdit?: () => void
}

export function LessonDetails({ lesson, onBack, onEdit }: LessonDetailsProps) {
  const [students] = useKV<Student[]>('students', [])
  
  const student = students.find(s => s.id === lesson.studentId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'met':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'partial':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'not-met':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getAssessmentIcon = (assessment: string) => {
    switch (assessment) {
      case 'met':
        return <CheckCircle className="h-4 w-4" />
      case 'partial':
        return <Clock className="h-4 w-4" />
      case 'not-met':
        return <MapPin className="h-4 w-4" />
      default:
        return null
    }
  }

  const objectivesSummary = {
    met: lesson.objectives.filter(obj => obj.assessment === 'met').length,
    partial: lesson.objectives.filter(obj => obj.assessment === 'partial').length,
    notMet: lesson.objectives.filter(obj => obj.assessment === 'not-met').length,
    total: lesson.objectives.length
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold">Lesson Details</h2>
            <p className="text-muted-foreground">
              {lesson.type === 'flight' ? 'Flight Training' : 'Ground Instruction'} Record
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={lesson.status === 'final' ? 'default' : 'secondary'}
            className={lesson.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
          >
            {lesson.status === 'final' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Final
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
          {onEdit && lesson.status === 'draft' && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {lesson.type === 'flight' ? (
                  <Plane className="h-5 w-5 text-blue-500" />
                ) : (
                  <BookOpen className="h-5 w-5 text-green-500" />
                )}
                Lesson Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(lesson.date)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{lesson.duration} hours</span>
                  </div>
                </div>

                {lesson.aircraft && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Aircraft</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{lesson.aircraft}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Type</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.type === 'flight' ? (
                      <Plane className="h-4 w-4 text-blue-500" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-green-500" />
                    )}
                    <span className="capitalize">{lesson.type} Training</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
                  <p className="text-sm mt-1">{formatDateTime(lesson.createdAt)}</p>
                </div>

                {lesson.finalizedAt && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Finalized</h4>
                    <p className="text-sm mt-1">{formatDateTime(lesson.finalizedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Training Objectives</CardTitle>
              <CardDescription>
                {objectivesSummary.total} objective{objectivesSummary.total !== 1 ? 's' : ''} covered in this lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.status === 'final' && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{objectivesSummary.met}</div>
                    <div className="text-sm text-muted-foreground">Met</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{objectivesSummary.partial}</div>
                    <div className="text-sm text-muted-foreground">Partial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{objectivesSummary.notMet}</div>
                    <div className="text-sm text-muted-foreground">Not Met</div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {lesson.objectives.map((objective, index) => (
                  <Card key={objective.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              {objective.code}
                            </Badge>
                            <span className="font-medium">{objective.description}</span>
                          </div>
                        </div>
                        {lesson.status === 'final' && (
                          <Badge 
                            variant="outline" 
                            className={`${getAssessmentColor(objective.assessment)} border`}
                          >
                            <span className="flex items-center gap-1">
                              {getAssessmentIcon(objective.assessment)}
                              <span className="capitalize">{objective.assessment.replace('-', ' ')}</span>
                            </span>
                          </Badge>
                        )}
                      </div>

                      {objective.remarks && (
                        <div className="bg-muted p-3 rounded-md">
                          <h5 className="font-medium text-sm mb-1">Remarks</h5>
                          <p className="text-sm">{objective.remarks}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Remarks */}
          {lesson.remarks && (
            <Card>
              <CardHeader>
                <CardTitle>General Remarks</CardTitle>
                <CardDescription>Instructor observations and notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{lesson.remarks}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Information */}
          {student && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
                  <p>{student.firstName} {student.lastName}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Student Number</h4>
                  <p className="font-mono">{student.studentNumber}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                  <p className="text-sm">{student.email}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Training Objective</h4>
                  <Badge variant="secondary" className="capitalize">
                    {student.trainingObjective}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Overall Progress</h4>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${student.progress.percentComplete}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{student.progress.percentComplete}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {student.progress.completedLessons} of {student.progress.totalLessons} lessons completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Status */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge 
                  variant={lesson.status === 'final' ? 'default' : 'secondary'}
                  className={lesson.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                >
                  {lesson.status === 'final' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Final
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Draft
                    </>
                  )}
                </Badge>
              </div>

              {lesson.status === 'final' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Lesson Finalized</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This lesson record is locked and cannot be edited.
                  </p>
                  {lesson.finalizedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Finalized on {formatDateTime(lesson.finalizedAt)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Draft Status</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    This lesson is still in draft and can be edited.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Export Record
              </Button>
              
              {student && (
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  View Student Profile
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View All Lessons
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}