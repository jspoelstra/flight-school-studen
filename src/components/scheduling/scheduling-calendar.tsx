import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Airplane
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { ScheduledLesson, InstructorAvailability as IAvailability, TimeSlot } from '@/lib/types'
import { useSampleData } from '@/lib/sample-data'

interface SchedulingCalendarProps {
  mode: 'instructor' | 'student'
  instructorId?: string
  studentId?: string
  onScheduleLesson?: (date: string, timeSlot: TimeSlot) => void
  onManageAvailability?: (date: string) => void
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  hasAvailability: boolean
  hasLessons: boolean
  scheduledLessons: ScheduledLesson[]
}

export function SchedulingCalendar({ 
  mode, 
  instructorId, 
  studentId, 
  onScheduleLesson, 
  onManageAvailability 
}: SchedulingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // Get data from sample data hook
  const { availabilities, scheduledLessons } = useSampleData()

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
    
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))
    
    const days: CalendarDay[] = []
    const currentDay = new Date(startDate)
    const today = new Date()
    
    while (currentDay <= endDate) {
      const dayLessons = scheduledLessons.filter(lesson => 
        lesson.date === currentDay.toISOString().split('T')[0]
      )
      
      const hasAvailability = availabilities.some(avail => 
        avail.date === currentDay.toISOString().split('T')[0]
      )
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        isSelected: selectedDate?.toDateString() === currentDay.toDateString(),
        hasAvailability,
        hasLessons: dayLessons.length > 0,
        scheduledLessons: dayLessons
      })
      
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const handleDateClick = (day: CalendarDay) => {
    if (day.date < new Date()) return // Prevent scheduling in the past
    
    setSelectedDate(day.date)
    
    if (mode === 'instructor' && onManageAvailability) {
      onManageAvailability(day.date.toISOString().split('T')[0])
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const calendarDays = generateCalendarDays()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {mode === 'instructor' ? 'Availability Calendar' : 'Lesson Scheduling'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={cn(
                "relative p-2 min-h-[60px] border rounded-md cursor-pointer transition-all",
                "hover:bg-accent/20",
                day.isCurrentMonth ? "bg-background" : "bg-muted/30",
                day.isToday && "ring-2 ring-primary",
                day.isSelected && "bg-primary/20",
                day.date < new Date() && "opacity-50 cursor-not-allowed",
                day.hasAvailability && mode === 'student' && "border-green-500/50 bg-green-500/5",
                day.hasLessons && "border-blue-500/50"
              )}
            >
              <div className="text-sm font-medium mb-1">
                {day.date.getDate()}
              </div>
              
              {/* Availability indicator */}
              {day.hasAvailability && mode === 'student' && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
              
              {/* Lessons indicators */}
              {day.scheduledLessons.length > 0 && (
                <div className="space-y-1">
                  {day.scheduledLessons.slice(0, 2).map(lesson => (
                    <div key={lesson.id} className="text-xs">
                      <Badge 
                        variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs px-1 py-0 h-4"
                      >
                        {lesson.type === 'flight' ? <Airplane className="h-2 w-2" /> : <Clock className="h-2 w-2" />}
                      </Badge>
                    </div>
                  ))}
                  {day.scheduledLessons.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.scheduledLessons.length - 2} more
                    </div>
                  )}
                </div>
              )}
              
              {/* Add availability button for instructors */}
              {mode === 'instructor' && day.isCurrentMonth && day.date >= new Date() && (
                <div className="absolute bottom-1 right-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      onManageAvailability?.(day.date.toISOString().split('T')[0])
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          {mode === 'student' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Scheduled Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}