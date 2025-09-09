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
  selectedTimeSlot: string
}

const defaultForm: SchedulingForm = {
  availabilityId: '',
  instructorId: '',
  type: 'flight',
  aircraft: '',
  notes: '',
  lessonObjectives: [],
  selectedTimeSlot: ''
}

const lessonObjectiveOptions = [
  'Pattern work',
  'Takeoffs and landings',
  'Navigation',
  'Radio communication',
  'Emergency procedures',
  'Stalls',
  'Slow flight',
  'Ground reference maneuvers'
]

export function StudentScheduling({ studentId }: StudentSchedulingProps) {
  const [form, setForm] = useState<SchedulingForm>(defaultForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState<InstructorAvailability | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  
  const [scheduledLessons, setScheduledLessons] = useKV<ScheduledLesson[]>('scheduled-lessons', [])
  const [instructorAvailability, setInstructorAvailability] = useKV<InstructorAvailability[]>('instructor-availability', [])
  
  const { instructors } = useSampleData()

  useEffect(() => {
    // Initialize with sample availability data
    if (instructorAvailability.length === 0) {
      const sampleAvailability: InstructorAvailability[] = [
        {
          id: '1',
          instructorId: 'instructor-1',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '17:00',
          availableSlots: [
            { start: '09:00', end: '11:00', available: true },
            { start: '11:00', end: '13:00', available: true },
            { start: '13:00', end: '15:00', available: false },
            { start: '15:00', end: '17:00', available: true }
          ]
        },
        {
          id: '2',
          instructorId: 'instructor-2',
          date: '2024-01-15',
          startTime: '08:00',
          endTime: '16:00',
          availableSlots: [
            { start: '08:00', end: '10:00', available: true },
            { start: '10:00', end: '12:00', available: true },
            { start: '14:00', end: '16:00', available: true }
          ]
        },
        {
          id: '3',
          instructorId: 'instructor-1',
          date: '2024-01-16',
          startTime: '10:00',
          endTime: '18:00',
          availableSlots: [
            { start: '10:00', end: '12:00', available: true },
            { start: '12:00', end: '14:00', available: false },
            { start: '14:00', end: '16:00', available: true },
            { start: '16:00', end: '18:00', available: true }
          ]
        }
      ]
      setInstructorAvailability(sampleAvailability)
    }
  }, [instructorAvailability.length, setInstructorAvailability])

  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId)
    return instructor ? instructor.name : 'Unknown Instructor'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getAvailableSlots = (date: string) => {
    const availability = instructorAvailability.filter(av => av.date === date)
    return availability.flatMap(av => av.availableSlots || [])
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    
    // Find availability for this date
    const availabilityForDate = instructorAvailability.filter(av => av.date === date)
    
    if (availabilityForDate.length === 0) {
      toast.error('No instructors available on this date')
      return
    }

    // For now, select the first available instructor
    const firstAvailable = availabilityForDate.find(av => 
      av.availableSlots?.some(slot => slot.available)
    )
    
    if (firstAvailable) {
      setSelectedAvailability(firstAvailable)
      setForm(prev => ({ 
        ...prev, 
        instructorId: firstAvailable.instructorId,
        availabilityId: firstAvailable.id 
      }))
      setIsDialogOpen(true)
    } else {
      toast.error('No available slots on this date')
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAvailability(null)
    setSelectedDate('')
    setForm(defaultForm)
  }

  const handleConfirmScheduling = () => {
    if (!selectedAvailability || !form.selectedTimeSlot) {
      toast.error('Please select a time slot')
      return
    }

    if (form.lessonObjectives.length === 0) {
      toast.error('Please select at least one lesson objective')
      return
    }

    const newLesson: ScheduledLesson = {
      id: Date.now().toString(),
      studentId,
      instructorId: selectedAvailability.instructorId,
      date: selectedDate,
      startTime: form.selectedTimeSlot,
      endTime: getSlotEndTime(form.selectedTimeSlot),
      type: form.type,
      status: 'scheduled',
      aircraft: form.aircraft || undefined,
      lessonObjectives: form.lessonObjectives,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString()
    }

    setScheduledLessons(prev => [...prev, newLesson])
    
    // Update availability to mark slot as booked
    setInstructorAvailability(prev => prev.map(av => {
      if (av.id === selectedAvailability.id) {
        return {
          ...av,
          availableSlots: av.availableSlots?.map(slot => 
            slot.start === form.selectedTimeSlot 
              ? { ...slot, available: false }
              : slot
          ) || []
        }
      }
      return av
    }))

    toast.success('Lesson scheduled successfully!')
    handleCloseDialog()
  }

  const getSlotEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHour = hours + 2 // Assuming 2-hour lessons
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
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

      {/* My Upcoming Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            My Upcoming Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledLessons
              .filter(lesson => lesson.studentId === studentId)
              .filter(lesson => new Date(lesson.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(lesson => {
                const instructor = instructors.find(i => i.id === lesson.instructorId)
                return (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        {lesson.type === 'flight' ? 
                          <Airplane className="h-5 w-5 text-primary" /> : 
                          <BookOpen className="h-5 w-5 text-primary" />
                        }
                      </div>
                      <div>
                        <div className="font-medium">
                          {lesson.type === 'flight' ? 'Flight Lesson' : 'Ground Lesson'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(lesson.date)} at {formatTime(lesson.startTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          with {instructor?.name || 'Unknown Instructor'}
                        </div>
                      </div>
                    </div>
                    <Badge variant={lesson.status === 'scheduled' ? 'default' : 'secondary'}>
                      {lesson.status}
                    </Badge>
                  </div>
                )
              })}
            {scheduledLessons.filter(lesson => lesson.studentId === studentId).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lessons scheduled yet</p>
                <p className="text-sm">Click on available dates below to schedule your first lesson</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Available Dates</CardTitle>
          <CardDescription>
            Click on an available date to schedule a lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchedulingCalendar 
            mode="student"
            onDateSelect={handleDateSelect}
            availableDates={instructorAvailability.map(av => av.date)}
            bookedDates={scheduledLessons.map(lesson => lesson.date)}
          />
        </CardContent>
      </Card>

      {/* Lesson Scheduling Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          handleCloseDialog()
        }
      }}>
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
                <Label>Time Slot</Label>
                <Select value={form.selectedTimeSlot} onValueChange={(value) => setForm(prev => ({ ...prev, selectedTimeSlot: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSlots(selectedDate).map((slot, index) => (
                      <SelectItem 
                        key={index} 
                        value={slot.start}
                        disabled={!slot.available}
                      >
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                        {!slot.available && ' (Booked)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Label>Aircraft (Optional)</Label>
                  <Select value={form.aircraft} onValueChange={(value) => setForm(prev => ({ ...prev, aircraft: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aircraft" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N123AB">N123AB - Cessna 172</SelectItem>
                      <SelectItem value="N456CD">N456CD - Cessna 152</SelectItem>
                      <SelectItem value="N789EF">N789EF - Piper Cherokee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Lesson Objectives</Label>
                <div className="grid grid-cols-2 gap-2">
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
                        className="rounded border-border"
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