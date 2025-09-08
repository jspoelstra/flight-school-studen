import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth'
import { Plane, CloudSun, Compass } from '@phosphor-icons/react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Aviation background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated compass */}
        <div className="absolute top-20 right-20 opacity-5">
          <Compass className="h-48 w-48 text-accent animate-spin" style={{ animationDuration: '120s' }} />
        </div>
        
        {/* Cloud decorations */}
        <div className="absolute top-32 left-16 opacity-10">
          <CloudSun className="h-32 w-32 text-white" />
        </div>
        <div className="absolute bottom-40 right-32 opacity-8">
          <CloudSun className="h-24 w-24 text-white" />
        </div>
        
        {/* Horizon lines */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm aviation-glow border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-primary shadow-2xl">
            <Plane className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            SkyWings Academy
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Professional Flight Training Portal
            <br />
            <span className="text-xs text-accent">Take Flight. Reach New Heights.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="pilot@skywings.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-border/50 focus:border-accent transition-colors"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? 'Taking Off...' : 'Sign In to Cockpit'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
            <p className="mb-2 font-medium text-foreground text-sm">Demo Flight Crew:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong className="text-accent">Chief Pilot:</strong> admin@skywings.com / password</p>
              <p><strong className="text-primary">Flight Instructor:</strong> instructor@skywings.com / password</p>
              <p><strong className="text-foreground">Student Pilot:</strong> student@skywings.com / password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}