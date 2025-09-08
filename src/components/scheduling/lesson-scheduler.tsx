import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Settings,
  List
} from '@phosphor-icons/react'
import { SchedulingCalendar } from './scheduling-calendar'
import { InstructorAvailability } from './instructor-availability'
import { StudentScheduling } from './student-scheduling'
import { useAuth } from '@/lib/auth'
import { useSampleData } from '@/lib/sample-data'
import { ScheduledLesson, InstructorAvailability as IAvailability } from '@/lib/types'

export function LessonScheduler() {
  const { user } = useAuth()
  const { scheduledLessons, availabilities } = useSampleData()

  if (!user) return null

  const userLessons = scheduledLessons.filter(lesson => 
    user.role === 'student' ? lesson.studentId === user.id : lesson.instructorId === user.id
  )

  const upcomingLessons = userLessons
    .filter(lesson => 
      lesson.status !== 'cancelled' && 
      new Date(lesson.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
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

  if (user.role === 'student') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lesson Scheduling</h1>
            <p className="text-muted-foreground">
              Schedule lessons with your instructors
            </p>
          </div>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Schedule Lessons
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Upcoming Lessons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <StudentScheduling studentId={user.id} />
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
                <CardDescription>
                  Your scheduled lessons and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingLessons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming lessons scheduled</p>
                    <p className="text-sm">Use the Schedule tab to book lessons</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingLessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium">{formatDate(lesson.date)}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lesson.type === 'flight' ? 'Flight' : 'Ground'} Lesson
                              {lesson.aircraft && ` - ${lesson.aircraft}`}
                            </div>
                          </div>
                        </div>

                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Instructor view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lesson Scheduling</h1>
          <p className="text-muted-foreground">
            Manage your availability and scheduled lessons
          </p>
        </div>
      </div>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Scheduled Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <InstructorAvailability instructorId={user.id} />
        </TabsContent>

        <TabsContent value="calendar">
          <SchedulingCalendar
            mode="instructor"
            instructorId={user.id}
          />
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Lessons</CardTitle>
              <CardDescription>
                Lessons scheduled with your students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingLessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No lessons scheduled</p>
                  <p className="text-sm">Set your availability to allow students to book lessons</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">{formatDate(lesson.date)}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {lesson.type === 'flight' ? 'Flight' : 'Ground'} Lesson
                            {lesson.aircraft && ` - ${lesson.aircraft}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={lesson.status === 'confirmed' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        {lesson.status === 'scheduled' && (
                          <Button size="sm" variant="outline">
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}