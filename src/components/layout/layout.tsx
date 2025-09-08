import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useNavigation } from '@/lib/navigation'
import { Toaster } from '@/components/ui/sonner'
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Compass,
  CloudSun,
  Calendar
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import slingIcon from '@/assets/images/sling-icon.jpg'

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
    label: 'Scheduling',
    icon: Calendar,
    href: '/scheduling',
    roles: ['student', 'instructor']
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
  const { currentRoute, navigate } = useNavigation()

  if (!user) return null

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="min-h-screen bg-background relative">
      {/* Aviation background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Horizon line effect */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        {/* Compass rose decoration */}
        <div className="absolute top-20 right-20 opacity-10">
          <Compass className="h-32 w-32 text-accent animate-spin" style={{ animationDuration: '60s' }} />
        </div>
        
        {/* Cloud elements */}
        <div className="absolute top-16 left-1/4 opacity-5">
          <CloudSun className="h-24 w-24 text-white" />
        </div>
        <div className="absolute top-32 right-1/3 opacity-5">
          <CloudSun className="h-20 w-20 text-white" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b bg-card/90 backdrop-blur-sm aviation-glow">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-accent/30 shadow-lg backdrop-blur-sm">
                <img 
                  src={slingIcon} 
                  alt="SkyWings Academy Logo" 
                  className="h-full w-full object-cover filter brightness-110 contrast-110 scale-110"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                SkyWings Academy
              </h1>
              <p className="text-xs text-muted-foreground">Professional Flight Training</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
              <User className="h-4 w-4 text-accent" />
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground capitalize">({user.role})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/90 backdrop-blur-sm">
          <nav className="p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => (
                <li key={item.href}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "w-full justify-start gap-3 text-left",
                      "hover:bg-accent/20 hover:text-accent transition-all duration-200",
                      "border border-transparent hover:border-accent/30",
                      currentRoute === item.href && "bg-accent/10 text-accent border-accent/30"
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
        <main className="flex-1 p-6 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}