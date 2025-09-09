import { AuthProvider, useAuth } from '@/lib/auth'
import { NavigationProvider, useNavigation } from '@/lib/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { Layout } from '@/components/layout/layout'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { InstructorDashboard } from '@/components/dashboard/instructor-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { StudentsPage } from '@/components/students'
import { LessonsManager } from '@/components/lessons'
import { EndorsementsManager } from '@/components/endorsements'
import { SchedulingCalendar, StudentScheduling } from '@/components/scheduling'

function AppContent() {
  const { user, isAuthenticated } = useAuth()
  const { currentRoute } = useNavigation()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const renderContent = () => {
    // Handle dashboard route based on user role
    if (currentRoute === '/dashboard') {
      switch (user?.role) {
        case 'student':
          return <StudentDashboard />
        case 'instructor':
          return <InstructorDashboard />
        case 'admin':
          return <AdminDashboard />
        default:
          return <div>Invalid user role</div>
      }
    }

    // Handle other routes
    switch (currentRoute) {
      case '/students':
        if (['instructor', 'admin'].includes(user?.role || '')) {
          return <StudentsPage />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      case '/lessons':
        if (['instructor', 'admin'].includes(user?.role || '')) {
          return <LessonsManager />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      case '/endorsements':
        if (['instructor', 'admin'].includes(user?.role || '')) {
          return <EndorsementsManager />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      case '/scheduling':
        if (user?.role === 'student') {
          return <StudentScheduling studentId={user.id} />
        } else if (user?.role === 'instructor') {
          return <SchedulingCalendar mode="instructor" instructorId={user.id} />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      case '/progress':
        if (user?.role === 'student') {
          return <StudentDashboard />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      case '/admin':
        if (user?.role === 'admin') {
          return <AdminDashboard />
        }
        return <div className="text-center text-muted-foreground">Access denied</div>
      
      default:
        return <div className="text-center text-muted-foreground">Page not found</div>
    }
  }

  return (
    <Layout>
      {renderContent()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  )
}

export default App