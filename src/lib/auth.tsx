import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication - in real app this would call an API
    const mockUsers: Record<string, User> = {
      'admin@flightschool.com': {
        id: '1',
        name: 'John Admin',
        email: 'admin@flightschool.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      'instructor@flightschool.com': {
        id: '2',
        name: 'Sarah CFI',
        email: 'instructor@flightschool.com',
        role: 'instructor',
        instructorId: 'CFI001',
        createdAt: new Date().toISOString()
      },
      'student@flightschool.com': {
        id: '3',
        name: 'Mike Student',
        email: 'student@flightschool.com',
        role: 'student',
        studentId: 'STU001',
        createdAt: new Date().toISOString()
      }
    }

    if (mockUsers[email] && password === 'password') {
      setUser(mockUsers[email])
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}