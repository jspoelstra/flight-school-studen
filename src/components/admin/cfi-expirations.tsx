import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  CalendarX,
  Warning,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Airplane,
  AlertTriangle
} from '@phosphor-icons/react'

interface CFIExpiration {
  id: string
  name: string
  email: string
  phone: string
  certificateNumber: string
  certificateType: string
  expirationDate: string
  daysUntilExpiration: number
  status: 'expired' | 'critical' | 'warning' | 'current'
  lastRenewalDate: string
  totalStudents: number
}

interface CFIExpirationsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CFIExpirations({ open, onOpenChange }: CFIExpirationsProps) {
  const [selectedCFI, setSelectedCFI] = useState<CFIExpiration | null>(null)

  // Sample CFI expiration data
  const cfiExpirations: CFIExpiration[] = [
    {
      id: '1',
      name: 'Captain Sarah Mitchell',
      email: 'sarah.mitchell@skywings.edu',
      phone: '(555) 123-4567',
      certificateNumber: 'CFI3456789',
      certificateType: 'Certified Flight Instructor (CFI)',
      expirationDate: '2024-12-15',
      daysUntilExpiration: 12,
      status: 'critical',
      lastRenewalDate: '2022-12-15',
      totalStudents: 8
    },
    {
      id: '2',
      name: 'Captain John Rodriguez',
      email: 'john.rodriguez@skywings.edu',
      phone: '(555) 234-5678',
      certificateNumber: 'CFI4567890',
      certificateType: 'Certified Flight Instructor - Instrument (CFII)',
      expirationDate: '2024-12-28',
      daysUntilExpiration: 25,
      status: 'warning',
      lastRenewalDate: '2022-12-28',
      totalStudents: 12
    },
    {
      id: '3',
      name: 'Captain Lisa Chen',
      email: 'lisa.chen@skywings.edu',
      phone: '(555) 345-6789',
      certificateNumber: 'CFI5678901',
      certificateType: 'Multi-Engine Instructor (MEI)',
      expirationDate: '2024-11-30',
      daysUntilExpiration: -3,
      status: 'expired',
      lastRenewalDate: '2022-11-30',
      totalStudents: 6
    },
    {
      id: '4',
      name: 'Captain Michael Thompson',
      email: 'michael.thompson@skywings.edu',
      phone: '(555) 456-7890',
      certificateNumber: 'CFI6789012',
      certificateType: 'Certified Flight Instructor (CFI)',
      expirationDate: '2025-01-20',
      daysUntilExpiration: 48,
      status: 'current',
      lastRenewalDate: '2023-01-20',
      totalStudents: 15
    }
  ]

  const getStatusIcon = (status: CFIExpiration['status']) => {
    switch (status) {
      case 'expired':
        return <CalendarX className="h-4 w-4 text-destructive" />
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <Warning className="h-4 w-4 text-amber-500" />
      case 'current':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: CFIExpiration['status'], days: number) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">EXPIRED ({Math.abs(days)} days ago)</Badge>
      case 'critical':
        return <Badge variant="destructive">CRITICAL ({days} days)</Badge>
      case 'warning':
        return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">WARNING ({days} days)</Badge>
      case 'current':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">CURRENT ({days} days)</Badge>
      default:
        return <Badge variant="outline">UNKNOWN</Badge>
    }
  }

  const handleSendReminder = (cfi: CFIExpiration) => {
    toast.success(`Renewal reminder sent to ${cfi.name}`, {
      description: `Email notification sent to ${cfi.email}`
    })
  }

  const handleScheduleRenewal = (cfi: CFIExpiration) => {
    toast.info(`Renewal scheduled for ${cfi.name}`, {
      description: 'Flight standards office has been notified'
    })
  }

  const criticalCount = cfiExpirations.filter(cfi => cfi.status === 'expired' || cfi.status === 'critical').length
  const warningCount = cfiExpirations.filter(cfi => cfi.status === 'warning').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-destructive/20 rounded-full">
              <CalendarX className="h-6 w-6 text-destructive" />
            </div>
            CFI Certificate Expirations Review
          </DialogTitle>
          <DialogDescription>
            Monitor and manage flight instructor certificate renewals and expirations
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Critical & Expired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Require immediate action</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Warning className="h-4 w-4 text-amber-500" />
                Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{warningCount}</div>
              <p className="text-xs text-muted-foreground">Expiring within 30 days</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Current
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{cfiExpirations.length - criticalCount - warningCount}</div>
              <p className="text-xs text-muted-foreground">Certificates current</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="space-y-4">
            {cfiExpirations
              .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration)
              .map((cfi) => (
                <Card 
                  key={cfi.id} 
                  className={`border transition-all cursor-pointer hover:shadow-lg ${
                    cfi.status === 'expired' || cfi.status === 'critical' 
                      ? 'border-destructive/50 bg-destructive/5' 
                      : cfi.status === 'warning'
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : 'border-border/50'
                  }`}
                  onClick={() => setSelectedCFI(selectedCFI?.id === cfi.id ? null : cfi)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(cfi.status)}
                        <div>
                          <CardTitle className="text-lg">{cfi.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{cfi.certificateType}</p>
                          <p className="text-xs text-muted-foreground">Cert #{cfi.certificateNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(cfi.status, cfi.daysUntilExpiration)}
                        <p className="text-sm text-muted-foreground mt-1">
                          Expires: {new Date(cfi.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {selectedCFI?.id === cfi.id && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Airplane className="h-4 w-4" />
                            Instructor Details
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{cfi.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{cfi.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active Students:</span>
                              <span className="font-medium">{cfi.totalStudents}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Renewal:</span>
                              <span className="font-medium">
                                {new Date(cfi.lastRenewalDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Actions</h4>
                          
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendReminder(cfi)
                              }}
                              className="w-full justify-start gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              Send Renewal Reminder
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleScheduleRenewal(cfi)
                              }}
                              className="w-full justify-start gap-2"
                            >
                              <CalendarX className="h-4 w-4" />
                              Schedule Renewal Checkride
                            </Button>

                            {(cfi.status === 'expired' || cfi.status === 'critical') && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.warning(`${cfi.name} has been temporarily suspended from instruction`, {
                                    description: 'Student assignments will be redistributed'
                                  })
                                }}
                                className="w-full justify-start gap-2"
                              >
                                <AlertTriangle className="h-4 w-4" />
                                Suspend Instruction Privileges
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {cfiExpirations.length} total instructors • {criticalCount} require immediate attention
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="gap-2" onClick={() => {
              toast.success('Bulk reminder emails sent', {
                description: `Sent renewal reminders to ${criticalCount + warningCount} instructors`
              })
            }}>
              <Mail className="h-4 w-4" />
              Send All Reminders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}