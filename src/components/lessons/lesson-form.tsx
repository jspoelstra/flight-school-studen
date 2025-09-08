import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  CheckCircle, 
  Clock, 
  Plane, 
  BookOpen,
  AlertTriangle,
  Plus,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Lesson, LessonObjective, Student } from '@/lib/types'

interface LessonFormProps {
  lesson?: Lesson
  onSave?: (lesson: Lesson) => void
  onCancel?: () => void
}

export function LessonForm({ lesson, onSave, onCancel }: LessonFormProps) {
  const [lessons, setLessons] = useKV<Lesson[]>('lessons', [])
  const [students] = useKV<Student[]>('students', [])
  
  const [formData, setFormData] = useState({
    studentId: lesson?.studentId || '',
    date: lesson?.date || new Date().toISOString().split('T')[0],
    type: lesson?.type || 'flight' as 'flight' | 'ground',
    aircraft: lesson?.aircraft || '',
    duration: lesson?.duration || 0,
    remarks: lesson?.remarks || '',
    status: lesson?.status || 'draft' as 'draft' | 'final'
  })

  const [objectives, setObjectives] = useState<LessonObjective[]>(
    lesson?.objectives || []
  )

  const [newObjective, setNewObjective] = useState({
    code: '',
    description: '',
    assessment: 'not-met' as 'met' | 'partial' | 'not-met',
    remarks: ''
  })

  // Common training objectives based on type
  const commonObjectives = {
    flight: [
      { code: 'PRE', description: 'Preflight inspection and planning' },
      { code: 'TO', description: 'Normal takeoff and departure' },
      { code: 'TP', description: 'Traffic pattern operations' },
      { code: 'LDG', description: 'Normal landing approach and landing' },
      { code: 'XC', description: 'Cross-country navigation' },
      { code: 'EMER', description: 'Emergency procedures' },
      { code: 'COMM', description: 'Radio communications' },
      { code: 'MAN', description: 'Performance maneuvers' }
    ],
    ground: [
      { code: 'REG', description: 'Federal Aviation Regulations' },
      { code: 'WX', description: 'Weather interpretation' },
      { code: 'NAV', description: 'Navigation principles' },
      { code: 'PERF', description: 'Aircraft performance' },
      { code: 'SYS', description: 'Aircraft systems' },
      { code: 'AERO', description: 'Aerodynamics' },
      { code: 'PROC', description: 'Standard procedures' }
    ]
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addObjective = (objective?: { code: string; description: string }) => {
    const objectiveToAdd = objective || newObjective
    if (!objectiveToAdd.code || !objectiveToAdd.description) {
      toast.error('Please provide both code and description for the objective')
      return
    }

    const newObj: LessonObjective = {
      id: Date.now().toString(),
      code: objectiveToAdd.code,
      description: objectiveToAdd.description,
      assessment: 'not-met',
      remarks: ''
    }

    setObjectives(prev => [...prev, newObj])
    
    if (!objective) {
      setNewObjective({
        code: '',
        description: '',
        assessment: 'not-met',
        remarks: ''
      })
    }
  }

  const updateObjective = (id: string, field: string, value: any) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === id ? { ...obj, [field]: value } : obj
    ))
  }

  const removeObjective = (id: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id))
  }

  const validateForm = () => {
    if (!formData.studentId) {
      toast.error('Please select a student')
      return false
    }
    if (!formData.date) {
      toast.error('Please select a lesson date')
      return false
    }
    if (formData.duration <= 0) {
      toast.error('Please enter lesson duration')
      return false
    }
    if (objectives.length === 0) {
      toast.error('Please add at least one training objective')
      return false
    }
    
    // For final status, all objectives must be assessed
    if (formData.status === 'final') {
      const unassessedObjectives = objectives.filter(obj => !obj.assessment || obj.assessment === 'not-met')
      if (unassessedObjectives.length > 0) {
        toast.error('All objectives must be assessed before finalizing the lesson')
        return false
      }
    }
    
    return true
  }

  const saveDraft = () => {
    if (!validateBasicForm()) return
    
    const lessonData: Lesson = {
      id: lesson?.id || Date.now().toString(),
      ...formData,
      objectives,
      instructorId: 'current-instructor', // Would come from auth context
      createdAt: lesson?.createdAt || new Date().toISOString(),
      status: 'draft'
    }

    if (lesson) {
      setLessons(prev => prev.map(l => l.id === lesson.id ? lessonData : l))
    } else {
      setLessons(prev => [...prev, lessonData])
    }

    toast.success('Lesson draft saved successfully')
    onSave?.(lessonData)
  }

  const finalizeLesson = () => {
    if (!validateForm()) return
    
    const lessonData: Lesson = {
      id: lesson?.id || Date.now().toString(),
      ...formData,
      objectives,
      instructorId: 'current-instructor',
      createdAt: lesson?.createdAt || new Date().toISOString(),
      finalizedAt: new Date().toISOString(),
      status: 'final'
    }

    if (lesson) {
      setLessons(prev => prev.map(l => l.id === lesson.id ? lessonData : l))
    } else {
      setLessons(prev => [...prev, lessonData])
    }

    toast.success('Lesson finalized successfully')
    onSave?.(lessonData)
  }

  const validateBasicForm = () => {
    if (!formData.studentId || !formData.date) {
      toast.error('Please fill in required fields')
      return false
    }
    return true
  }

  const selectedStudent = students.find(s => s.id === formData.studentId)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {lesson ? 'Edit' : 'New'} Lesson Record
          </h2>
          <p className="text-muted-foreground">
            {formData.type === 'flight' ? 'Flight' : 'Ground'} training lesson
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={formData.status === 'final' ? 'default' : 'secondary'}>
            {formData.status === 'final' ? (
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {formData.type === 'flight' ? (
                  <Plane className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                Lesson Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="student">Student *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => handleInputChange('studentId', value)}>
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} ({student.studentNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Lesson Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flight" id="flight" />
                    <Label htmlFor="flight">Flight Training</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ground" id="ground" />
                    <Label htmlFor="ground">Ground Instruction</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {formData.type === 'flight' && (
                  <div className="space-y-2">
                    <Label htmlFor="aircraft">Aircraft</Label>
                    <Input
                      id="aircraft"
                      placeholder="e.g., N12345"
                      value={formData.aircraft}
                      onChange={(e) => handleInputChange('aircraft', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="1.5"
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Training Objectives</CardTitle>
              <CardDescription>
                Add and assess training objectives for this lesson
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Add Common Objectives */}
              <div className="space-y-2">
                <Label>Quick Add Common Objectives</Label>
                <div className="flex flex-wrap gap-2">
                  {commonObjectives[formData.type].map((obj) => (
                    <Button
                      key={obj.code}
                      variant="outline"
                      size="sm"
                      onClick={() => addObjective(obj)}
                      disabled={objectives.some(o => o.code === obj.code)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {obj.code}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Objective Entry */}
              <div className="space-y-3">
                <Label>Add Custom Objective</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  <Input
                    placeholder="Code (e.g., SLO)"
                    value={newObjective.code}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  />
                  <Input
                    placeholder="Description"
                    value={newObjective.description}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                    className="md:col-span-2"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => addObjective()}
                  disabled={!newObjective.code || !newObjective.description}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>

              <Separator />

              {/* Objectives List */}
              <div className="space-y-3">
                {objectives.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    No objectives added yet
                  </div>
                ) : (
                  objectives.map((objective) => (
                    <Card key={objective.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{objective.code}</Badge>
                              <span className="font-medium">{objective.description}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeObjective(objective.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Assessment</Label>
                            <RadioGroup
                              value={objective.assessment}
                              onValueChange={(value) => updateObjective(objective.id, 'assessment', value)}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="met" id={`met-${objective.id}`} />
                                <Label htmlFor={`met-${objective.id}`} className="text-green-600">
                                  Met
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="partial" id={`partial-${objective.id}`} />
                                <Label htmlFor={`partial-${objective.id}`} className="text-yellow-600">
                                  Partial
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not-met" id={`not-met-${objective.id}`} />
                                <Label htmlFor={`not-met-${objective.id}`} className="text-red-600">
                                  Not Met
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`remarks-${objective.id}`}>Remarks</Label>
                            <Textarea
                              id={`remarks-${objective.id}`}
                              placeholder="Notes about this objective..."
                              value={objective.remarks}
                              onChange={(e) => updateObjective(objective.id, 'remarks', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* General Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>General Remarks</CardTitle>
              <CardDescription>
                Overall lesson notes and instructor observations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter lesson remarks, areas for improvement, and general observations..."
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p>{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Student Number</Label>
                  <p>{selectedStudent.studentNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Training Objective</Label>
                  <p className="capitalize">{selectedStudent.trainingObjective}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${selectedStudent.progress.percentComplete}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedStudent.progress.percentComplete}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={saveDraft} 
                variant="outline" 
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              <Button 
                onClick={finalizeLesson} 
                className="w-full"
                disabled={formData.status === 'final'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalize Lesson
              </Button>
              
              {onCancel && (
                <Button 
                  onClick={onCancel} 
                  variant="ghost" 
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
              
              {formData.status === 'final' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Lesson Finalized</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This lesson record is now locked and cannot be edited.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}