import { AuthProvider, useAuth } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'
import { Layout } from '@/components/layout/layout'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { InstructorDashboard } from '@/components/dashboard/instructor-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

function AppContent() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const renderDashboard = () => {
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

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App