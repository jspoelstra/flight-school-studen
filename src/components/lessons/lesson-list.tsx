import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Plane,
  BookOpen,
  Calendar,
  User,
  FileText
} from '@phosphor-icons/react'
import { Lesson, Student } from '@/lib/types'

interface LessonListProps {
  onEditLesson?: (lesson: Lesson) => void
  onViewLesson?: (lesson: Lesson) => void
  onNewLesson?: () => void
}

export function LessonList({ onEditLesson, onViewLesson, onNewLesson }: LessonListProps) {
  const [lessons] = useKV<Lesson[]>('lessons', [])
  const [students] = useKV<Student[]>('students', [])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'final'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'flight' | 'ground'>('all')
  const [studentFilter, setStudentFilter] = useState('all')

  // Filter lessons based on search and filter criteria
  const filteredLessons = lessons.filter(lesson => {
    const student = students.find(s => s.id === lesson.studentId)
    const studentName = student ? `${student.firstName} ${student.lastName}` : ''
    
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.aircraft?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.objectives.some(obj => 
        obj.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter
    const matchesType = typeFilter === 'all' || lesson.type === typeFilter
    const matchesStudent = studentFilter === 'all' || lesson.studentId === studentFilter

    return matchesSearch && matchesStatus && matchesType && matchesStudent
  })

  // Sort lessons by date (most recent first)
  const sortedLessons = [...filteredLessons].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getStudentNumber = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student?.studentNumber || 'N/A'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getObjectivesSummary = (objectives: any[]) => {
    const met = objectives.filter(obj => obj.assessment === 'met').length
    const partial = objectives.filter(obj => obj.assessment === 'partial').length
    const notMet = objectives.filter(obj => obj.assessment === 'not-met').length
    
    return { met, partial, notMet, total: objectives.length }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lesson Records</h2>
          <p className="text-muted-foreground">
            Manage flight and ground training records
          </p>
        </div>
        {onNewLesson && (
          <Button onClick={onNewLesson}>
            <FileText className="h-4 w-4 mr-2" />
            New Lesson
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student, aircraft, or objective..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="ground">Ground</SelectItem>
              </SelectContent>
            </Select>

            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {sortedLessons.length} of {lessons.length} lessons
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Final</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Draft</span>
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <Card>
        <CardContent className="p-0">
          {sortedLessons.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
              <p className="text-muted-foreground mb-4">
                {lessons.length === 0 
                  ? "No lessons have been recorded yet." 
                  : "No lessons match your current filters."
                }
              </p>
              {onNewLesson && lessons.length === 0 && (
                <Button onClick={onNewLesson}>
                  Create First Lesson
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Objectives</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLessons.map((lesson) => {
                  const objectives = getObjectivesSummary(lesson.objectives)
                  return (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(lesson.date)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{getStudentName(lesson.studentId)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            #{getStudentNumber(lesson.studentId)}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lesson.type === 'flight' ? (
                            <>
                              <Plane className="h-4 w-4 text-blue-500" />
                              <span>Flight</span>
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <span>Ground</span>
                            </>
                          )}
                        </div>
                        {lesson.aircraft && (
                          <div className="text-sm text-muted-foreground">
                            {lesson.aircraft}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <span className="font-mono">{lesson.duration}h</span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {objectives.total} objective{objectives.total !== 1 ? 's' : ''}
                          </div>
                          {lesson.status === 'final' && (
                            <div className="flex gap-1">
                              {objectives.met > 0 && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  {objectives.met} met
                                </Badge>
                              )}
                              {objectives.partial > 0 && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                                  {objectives.partial} partial
                                </Badge>
                              )}
                              {objectives.notMet > 0 && (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                  {objectives.notMet} not met
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
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
                        {lesson.finalizedAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(lesson.finalizedAt)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {onViewLesson && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewLesson(lesson)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEditLesson && lesson.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditLesson(lesson)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}