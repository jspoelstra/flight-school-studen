import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Award,
  TrendingUp,
  Calendar,
  Airplane,
  Target
} from '@phosphor-icons/react'
import { LessonScheduler } from '@/components/scheduling'

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const studentProgress = {
    totalLessons: 40,
    completedLessons: 15,
    percentComplete: 37.5,
    nextLesson: 'Navigation and Cross-Country Planning',
    nextLessonDate: '2024-01-15',
    recentLessons: [
      {
        id: '1',
        title: 'Traffic Patterns',
        date: '2024-01-10',
        instructor: 'Sarah CFI',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Emergency Procedures',
        date: '2024-01-08',
        instructor: 'Sarah CFI',
        status: 'completed'
      }
    ],
    endorsements: [
      {
        id: '1',
        title: 'Pre-Solo Written Exam',
        issuedDate: '2024-01-05',
        instructor: 'Sarah CFI',
        status: 'active'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Airplane className="h-16 w-16 text-accent" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
          Flight Training Dashboard
        </h2>
        <p className="text-muted-foreground">Your journey to the skies - track every milestone</p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-2 border-b border-border/30 pb-4">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 aviation-glow"
        >
          <Target className="h-4 w-4" />
          Training Overview
        </Button>
        <Button 
          variant={activeTab === 'scheduling' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('scheduling')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Schedule Lessons
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Training Progress</CardTitle>
            <div className="p-2 bg-primary/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{studentProgress.percentComplete}%</div>
            <Progress value={studentProgress.percentComplete} className="mt-2 h-2 progress-aviation" />
            <p className="text-xs text-muted-foreground mt-2">
              {studentProgress.completedLessons} of {studentProgress.totalLessons} lessons completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Flight Hours</CardTitle>
            <div className="p-2 bg-accent/20 rounded-full">
              <Clock className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{studentProgress.completedLessons * 1.5}</div>
            <p className="text-xs text-muted-foreground">
              Flight and ground instruction hours
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Endorsements</CardTitle>
            <div className="p-2 bg-primary/20 rounded-full">
              <Award className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{studentProgress.endorsements.length}</div>
            <p className="text-xs text-muted-foreground">
              Active flight endorsements
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Next Flight</CardTitle>
            <div className="p-2 bg-accent/20 rounded-full aviation-pulse">
              <Calendar className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-primary">{studentProgress.nextLessonDate}</div>
            <p className="text-xs text-muted-foreground">
              {studentProgress.nextLesson}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Lessons */}
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-primary/20 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              Recent Flight Lessons
            </CardTitle>
            <CardDescription>Your latest training activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.date} • {lesson.instructor}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endorsements */}
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-accent/20 rounded-full">
                <Award className="h-5 w-5 text-accent" />
              </div>
              Flight Endorsements
            </CardTitle>
            <CardDescription>Your current flight authorizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.endorsements.map((endorsement) => (
                <div key={endorsement.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">{endorsement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Issued {endorsement.issuedDate} by {endorsement.instructor}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-accent/20 text-accent border-accent/30">
                    <Target className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      )}

      {activeTab === 'scheduling' && (
        <LessonScheduler />
      )}
    </div>
  )
}