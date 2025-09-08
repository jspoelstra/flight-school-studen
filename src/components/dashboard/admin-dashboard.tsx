import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddStudentForm } from '@/components/students'
import { CFIExpirations } from '@/components/admin/cfi-expirations'
import { useSampleData } from '@/lib/sample-data'
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  AlertTriangle,
  Airplane,
  Tower,
  Gauge,
  MapPin
} from '@phosphor-icons/react'

export function AdminDashboard() {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isCFIExpirationsOpen, setIsCFIExpirationsOpen] = useState(false)
  
  // Load sample data
  const { students } = useSampleData()
  const adminData = {
    totalStudents: students.length,
    activeInstructors: 8,
    totalLessons: 1250,
    completionRate: 87,
    recentActivity: [
      {
        id: '1',
        type: 'student_enrolled',
        description: 'New student pilot enrolled: Alex Johnson',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'stage_check',
        description: 'Solo flight test completed: Mike Student (Pass)',
        timestamp: '4 hours ago'
      },
      {
        id: '3',
        type: 'endorsement',
        description: 'Endorsement issued: Pre-solo written exam',
        timestamp: '1 day ago'
      }
    ],
    metrics: {
      studentsThisMonth: 12,
      averageProgress: 68,
      passRate: 94,
      retentionRate: 91
    },
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: '3 pilots have medical certificates expiring within 30 days',
        action: 'Review Expirations'
      },
      {
        id: '2',
        type: 'info',
        message: '5 flight reports pending finalization for >24 hours',
        action: 'Notify Instructors'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Tower className="h-16 w-16 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Flight Operations Command
          </h2>
          <p className="text-muted-foreground">Aviation training academy oversight and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border/50 hover:bg-muted/50">
            <Settings className="h-4 w-4" />
            Flight Ops
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={() => setIsAddStudentOpen(true)}>
            <Plus className="h-4 w-4" />
            Enroll Pilot
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      {adminData.alerts.length > 0 && (
        <Card className="border-destructive/30 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <div className="p-2 bg-destructive/20 rounded-full">
                <AlertTriangle className="h-5 w-5" />
              </div>
              Flight Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent/30 hover:bg-accent/10"
                    onClick={() => {
                      if (alert.action === 'Review Expirations') {
                        setIsCFIExpirationsOpen(true)
                      }
                    }}
                  >
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Student Pilots</CardTitle>
            <div className="p-2 bg-primary/20 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{adminData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{adminData.metrics.studentsThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Flight Instructors</CardTitle>
            <div className="p-2 bg-accent/20 rounded-full">
              <Airplane className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{adminData.activeInstructors}</div>
            <p className="text-xs text-muted-foreground">
              Certified flight instructors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Success Rate</CardTitle>
            <div className="p-2 bg-primary/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{adminData.completionRate}%</div>
            <Progress value={adminData.completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 aviation-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Flight Hours</CardTitle>
            <div className="p-2 bg-accent/20 rounded-full">
              <Gauge className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{adminData.totalLessons.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total instruction hours logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <div className="p-2 bg-primary/20 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              Training Metrics
            </CardTitle>
            <CardDescription>Academy performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-foreground">Average Progress</span>
                <span className="font-medium text-accent">{adminData.metrics.averageProgress}%</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-foreground">Check Ride Pass Rate</span>
                <span className="font-medium text-accent">{adminData.metrics.passRate}%</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-foreground">Student Retention</span>
                <span className="font-medium text-accent">{adminData.metrics.retentionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="p-2 bg-accent/20 rounded-full">
                <Award className="h-5 w-5 text-accent" />
              </div>
              Flight Activity Log
            </CardTitle>
            <CardDescription>Recent training milestones and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      activity.type === 'student_enrolled' ? 'bg-primary/20 text-primary border-primary/30' : 
                      activity.type === 'stage_check' ? 'bg-accent/20 text-accent border-accent/30' : 
                      'bg-muted/20 text-muted-foreground border-border/30'
                    }
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Student Form Dialog */}
      <AddStudentForm 
        open={isAddStudentOpen} 
        onOpenChange={setIsAddStudentOpen} 
      />

      {/* CFI Expirations Dialog */}
      <CFIExpirations
        open={isCFIExpirationsOpen}
        onOpenChange={setIsCFIExpirationsOpen}
      />
    </div>
  )
}