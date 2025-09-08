import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddStudentForm } from '@/components/students'
import { useSampleData } from '@/lib/sample-data'
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  AlertTriangle
} from '@phosphor-icons/react'

export function AdminDashboard() {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  
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
        description: 'New student enrolled: Alex Johnson',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'stage_check',
        description: 'Stage check completed: Mike Student (Pass)',
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
        message: '3 students have medical certificates expiring within 30 days',
        action: 'Review Expirations'
      },
      {
        id: '2',
        type: 'info',
        message: '5 draft lessons pending finalization for >24 hours',
        action: 'Notify Instructors'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Administration Dashboard</h2>
          <p className="text-muted-foreground">Flight school operations overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="gap-2" onClick={() => setIsAddStudentOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      {adminData.alerts.length > 0 && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between">
                  <p className="text-sm">{alert.message}</p>
                  <Button variant="outline" size="sm">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{adminData.metrics.studentsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.activeInstructors}</div>
            <p className="text-xs text-muted-foreground">
              Certified flight instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.completionRate}%</div>
            <Progress value={adminData.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalLessons.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Flight and ground instruction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Training Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Average Progress</span>
                <span className="font-medium">{adminData.metrics.averageProgress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pass Rate</span>
                <span className="font-medium">{adminData.metrics.passRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Retention Rate</span>
                <span className="font-medium">{adminData.metrics.retentionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge 
                    variant={
                      activity.type === 'student_enrolled' ? 'default' : 
                      activity.type === 'stage_check' ? 'secondary' : 
                      'outline'
                    }
                  >
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
    </div>
  )
}