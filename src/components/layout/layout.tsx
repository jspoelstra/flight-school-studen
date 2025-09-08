import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { Toaster } from '@/components/ui/sonner'
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut,
  Plane,
  User
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  icon: React.ComponentType<any>
  href: string
  roles: string[]
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    icon: BarChart3,
    href: '/dashboard',
    roles: ['student', 'instructor', 'admin']
  },
  {
    label: 'Students',
    icon: Users,
    href: '/students',
    roles: ['instructor', 'admin']
  },
  {
    label: 'Lessons',
    icon: BookOpen,
    href: '/lessons',
    roles: ['instructor', 'admin']
  },
  {
    label: 'Endorsements',
    icon: Award,
    href: '/endorsements',
    roles: ['instructor', 'admin']
  },
  {
    label: 'My Progress',
    icon: BarChart3,
    href: '/progress',
    roles: ['student']
  },
  {
    label: 'Administration',
    icon: Settings,
    href: '/admin',
    roles: ['admin']
  }
]

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Flight School</h1>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground">({user.role})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <nav className="p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => (
                <li key={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}