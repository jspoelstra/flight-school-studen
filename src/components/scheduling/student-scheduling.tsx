import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Airplane,
  BookOpen,
  Plus,
  Check,
  X,
  AlertCircle
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { ScheduledLesson, InstructorAvailability, Instructor, TimeSlot } from '@/lib/types'
import { SchedulingCalendar } from './scheduling-calendar'
import { useSampleData } from '@/lib/sample-data'
import { toast } from 'sonner'

interface StudentSchedulingProps {
  studentId: string
}

interface SchedulingForm {
  availabilityId: string
  instructorId: string
  type: 'flight' | 'ground'
  aircraft: string
  notes: string
  lessonObjectives: string[]
}

const defaultForm: SchedulingForm = {
  availabilityId: '',
  instructorId: '',
  type: 'flight',
  aircraft: '',
  notes: '',
  lessonObjectives: []
}

const lessonObjectiveOptions = [
  'Pre-flight inspection',
  'Start-up procedures',
  'Taxi operations',
  'Takeoff procedures',
  'Traffic pattern',
  'Landing procedures',
  'Emergency procedures',
  'Navigation',
  'Radio communications',
  'Steep turns',
  'Stalls',
  'Slow flight',
  'Ground reference maneuvers'
]

export function StudentScheduling({ studentId }: StudentSchedulingProps) {
  const [form, setForm] = useState<SchedulingForm>(defaultForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState<InstructorAvailability | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  
  // Get KV stores for updating data
  const [, setScheduledLessonsKV] = useKV<ScheduledLesson[]>('scheduled-lessons', [])
  
  // Get current data from sample data
  const { instructors, availabilities, scheduledLessons } = useSampleData()

  // Get student's scheduled lessons
  const studentLessons = scheduledLessons.filter(lesson => lesson.studentId === studentId)

  // Get available time slots for a specific date
  const getAvailableSlots = (date: string): TimeSlot[] => {
    const dayAvailabilities = availabilities.filter(avail => avail.date === date)
    const dayLessons = scheduledLessons.filter(lesson => lesson.date === date)
    
    const slots: TimeSlot[] = []
    
    dayAvailabilities.forEach(availability => {
      // Generate hourly slots within availability window
      const startTime = new Date(`${date}T${availability.startTime}:00`)
      const endTime = new Date(`${date}T${availability.endTime}:00`)
      
      const current = new Date(startTime)
      while (current < endTime) {
        const slotStart = current.toTimeString().substring(0, 5)
        const slotEnd = new Date(current.getTime() + 60 * 60 * 1000).toTimeString().substring(0, 5)
        
        // Check if this slot is already booked
        const isBooked = dayLessons.some(lesson => 
          lesson.instructorId === availability.instructorId &&
          lesson.startTime === slotStart &&
          lesson.status !== 'cancelled'
        )
        
        // Get the booked lesson if it exists
        const bookedLesson = dayLessons.find(lesson => 
          lesson.instructorId === availability.instructorId &&
          lesson.startTime === slotStart &&
          lesson.status !== 'cancelled'
        )
        
        slots.push({
          start: slotStart,
          end: slotEnd,
          available: !isBooked,
          scheduledLessonId: bookedLesson?.id,
          studentName: bookedLesson ? 'Booked' : undefined
        })
        
        current.setHours(current.getHours() + 1)
      }
    })
    
    return slots.sort((a, b) => a.start.localeCompare(b.start))
  }

  const handleScheduleLesson = (date: string, timeSlot: TimeSlot) => {
    if (!timeSlot.available) return
    
    // Find the availability that contains this time slot
    const availability = availabilities.find(avail => 
      avail.date === date &&
      timeSlot.start >= avail.startTime &&
      timeSlot.end <= avail.endTime
    )
    
    if (!availability) return
    
    setSelectedAvailability(availability)
    setSelectedDate(date)
    setForm(prev => ({
      ...prev,
      availabilityId: availability.id,
      instructorId: availability.instructorId
    }))
    setIsDialogOpen(true)
  }

  const handleConfirmScheduling = () => {
    if (!selectedAvailability || !selectedDate) return
    
    if (!form.type || (!form.aircraft && form.type === 'flight')) {
      toast.error('Please fill in all required fields')
      return
    }

    const newLesson: ScheduledLesson = {
      id: `lesson-${Date.now()}`,
      studentId,
      instructorId: form.instructorId,
      availabilityId: form.availabilityId,
      date: selectedDate,
      startTime: '09:00', // This would be selected from time slot
      endTime: '10:00',   // This would be calculated
      type: form.type,
      aircraft: form.aircraft,
      status: 'scheduled',
      lessonObjectives: form.lessonObjectives,
      notes: form.notes,
      scheduledAt: new Date().toISOString()
    }

    setScheduledLessonsKV(prev => [...prev, newLesson])
    toast.success('Lesson scheduled successfully!')
    handleCloseDialog()
  }

  const handleCancelLesson = (lessonId: string) => {
    setScheduledLessonsKV(prev => 
      prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, status: 'cancelled' as const, cancelledAt: new Date().toISOString() }
          : lesson
      )
    )
    toast.success('Lesson cancelled')
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAvailability(null)
    setSelectedDate('')
    setForm(defaultForm)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find(inst => inst.id === instructorId)
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown Instructor'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schedule Lessons</h2>
          <p className="text-muted-foreground">
            Book lessons with available instructors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <SchedulingCalendar
            mode="student"
            studentId={studentId}
            onScheduleLesson={handleScheduleLesson}
          />
        </div>

        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Lessons
            </CardTitle>
            <CardDescription>
              Your scheduled lessons
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentLessons.filter(lesson => lesson.status !== 'cancelled').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lessons scheduled</p>
                <p className="text-sm">Click on available dates in the calendar to schedule</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentLessons
                  .filter(lesson => lesson.status !== 'cancelled')
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {lesson.type === 'flight' ? (
                          <Airplane className="h-5 w-5 text-blue-500" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium">{formatDate(lesson.date)}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {getInstructorName(lesson.instructorId)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                        {lesson.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelLesson(lesson.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Instructors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Available Instructors
            </CardTitle>
            <CardDescription>
              Instructors with upcoming availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {instructors
                .filter(instructor => 
                  availabilities.some(avail => 
                    avail.instructorId === instructor.id &&
                    new Date(avail.date) >= new Date()
                  )
                )
                .map(instructor => {
                  const instructorAvailabilities = availabilities.filter(avail => 
                    avail.instructorId === instructor.id &&
                    new Date(avail.date) >= new Date()
                  )
                  
                  return (
                    <div key={instructor.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{instructor.firstName} {instructor.lastName}</div>
                      <div className="text-sm text-muted-foreground">
                        {instructor.ratings.join(', ')}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {instructorAvailabilities.length} available slot{instructorAvailabilities.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduling Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Lesson</DialogTitle>
            <DialogDescription>
              {selectedDate && `Schedule a lesson for ${formatDate(selectedDate)}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAvailability && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">
                  {getInstructorName(selectedAvailability.instructorId)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(selectedAvailability.startTime)} - {formatTime(selectedAvailability.endTime)}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select value={form.type} onValueChange={(value: 'flight' | 'ground') => setForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight Lesson</SelectItem>
                    <SelectItem value="ground">Ground Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.type === 'flight' && (
                <div className="space-y-2">
                  <Label>Aircraft</Label>
                  <Select value={form.aircraft} onValueChange={(value) => setForm(prev => ({ ...prev, aircraft: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aircraft" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N12345">N12345 - Cessna 172</SelectItem>
                      <SelectItem value="N67890">N67890 - Cessna 152</SelectItem>
                      <SelectItem value="N24680">N24680 - Piper Cherokee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Lesson Objectives</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {lessonObjectiveOptions.map(objective => (
                    <label key={objective} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.lessonObjectives.includes(objective)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm(prev => ({
                              ...prev,
                              lessonObjectives: [...prev.lessonObjectives, objective]
                            }))
                          } else {
                            setForm(prev => ({
                              ...prev,
                              lessonObjectives: prev.lessonObjectives.filter(obj => obj !== objective)
                            }))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{objective}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special notes or requests..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleConfirmScheduling} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Schedule Lesson
                </Button>
                <Button variant="outline" onClick={handleCloseDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}