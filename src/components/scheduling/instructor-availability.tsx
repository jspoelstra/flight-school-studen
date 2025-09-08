import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Clock, 
  Calendar as CalendarIcon, 
  Trash,
  Edit,
  Copy,
  Check,
  X
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { InstructorAvailability as IAvailability, TimeSlot } from '@/lib/types'
import { toast } from 'sonner'

interface InstructorAvailabilityProps {
  instructorId: string
}

interface AvailabilityForm {
  date: string
  startTime: string
  endTime: string
  isRecurring: boolean
  recurrencePattern?: 'weekly' | 'biweekly'
  maxStudents: number
  notes: string
}

const defaultForm: AvailabilityForm = {
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '17:00',
  isRecurring: false,
  maxStudents: 1,
  notes: ''
}

export function InstructorAvailability({ instructorId }: InstructorAvailabilityProps) {
  const [availabilities, setAvailabilities] = useKV<IAvailability[]>('instructor-availabilities', [])
  const [form, setForm] = useState<AvailabilityForm>(defaultForm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Filter availabilities for this instructor
  const instructorAvailabilities = availabilities.filter(avail => avail.instructorId === instructorId)

  const handleSubmit = () => {
    if (!form.date || !form.startTime || !form.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    if (form.startTime >= form.endTime) {
      toast.error('End time must be after start time')
      return
    }

    const newAvailability: IAvailability = {
      id: editingId || `avail-${Date.now()}`,
      instructorId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      isRecurring: form.isRecurring,
      recurrencePattern: form.isRecurring ? form.recurrencePattern : undefined,
      maxStudents: form.maxStudents,
      notes: form.notes,
      createdAt: new Date().toISOString()
    }

    if (editingId) {
      // Update existing
      setAvailabilities(prev => 
        prev.map(avail => avail.id === editingId ? newAvailability : avail)
      )
      toast.success('Availability updated successfully')
    } else {
      // Add new
      setAvailabilities(prev => [...prev, newAvailability])
      toast.success('Availability added successfully')
    }

    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setAvailabilities(prev => prev.filter(avail => avail.id !== id))
    toast.success('Availability deleted')
  }

  const handleEdit = (availability: IAvailability) => {
    setForm({
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isRecurring: availability.isRecurring,
      recurrencePattern: availability.recurrencePattern,
      maxStudents: availability.maxStudents,
      notes: availability.notes || ''
    })
    setEditingId(availability.id)
    setIsDialogOpen(true)
  }

  const handleCopy = (availability: IAvailability) => {
    setForm({
      date: new Date().toISOString().split('T')[0], // Today's date
      startTime: availability.startTime,
      endTime: availability.endTime,
      isRecurring: availability.isRecurring,
      recurrencePattern: availability.recurrencePattern,
      maxStudents: availability.maxStudents,
      notes: availability.notes || ''
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setForm(defaultForm)
  }

  const handleQuickAdd = (date: string) => {
    setForm({ ...defaultForm, date })
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  // Generate time slots for today and next 7 days
  const getUpcomingDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability Management</h2>
          <p className="text-muted-foreground">
            Set your availability for student lesson scheduling
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Availability' : 'Add Availability'}
              </DialogTitle>
              <DialogDescription>
                Set your available time slots for student lessons
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students</Label>
                <Select value={form.maxStudents.toString()} onValueChange={(value) => setForm(prev => ({ ...prev, maxStudents: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Student</SelectItem>
                    <SelectItem value="2">2 Students</SelectItem>
                    <SelectItem value="3">3 Students</SelectItem>
                    <SelectItem value="4">4 Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={form.isRecurring}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isRecurring: checked }))}
                />
                <Label htmlFor="recurring">Recurring availability</Label>
              </div>

              {form.isRecurring && (
                <div className="space-y-2">
                  <Label>Recurrence Pattern</Label>
                  <Select value={form.recurrencePattern} onValueChange={(value: 'weekly' | 'biweekly') => setForm(prev => ({ ...prev, recurrencePattern: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes about this availability..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Add'} Availability
                </Button>
                <Button variant="outline" onClick={handleCloseDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add for upcoming days */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Add - Next 7 Days</CardTitle>
          <CardDescription>
            Quickly add availability for the upcoming week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {getUpcomingDays().map(date => {
              const hasAvailability = instructorAvailabilities.some(avail => avail.date === date)
              return (
                <Button
                  key={date}
                  variant={hasAvailability ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAdd(date)}
                  className="flex-col h-16 p-2"
                >
                  <div className="text-xs text-muted-foreground">
                    {formatDate(date).split(',')[0]}
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(date).getDate()}
                  </div>
                  {hasAvailability && (
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Availabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Current Availabilities
          </CardTitle>
          <CardDescription>
            Your scheduled availability slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instructorAvailabilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No availability set yet</p>
              <p className="text-sm">Add your availability to allow students to schedule lessons</p>
            </div>
          ) : (
            <div className="space-y-3">
              {instructorAvailabilities
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(availability => (
                <div key={availability.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{formatDate(availability.date)}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {availability.maxStudents} student{availability.maxStudents !== 1 ? 's' : ''}
                      </Badge>
                      {availability.isRecurring && (
                        <Badge variant="outline">
                          {availability.recurrencePattern}
                        </Badge>
                      )}
                    </div>
                    
                    {availability.notes && (
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {availability.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(availability)}
                      title="Copy availability"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(availability)}
                      title="Edit availability"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(availability.id)}
                      title="Delete availability"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}