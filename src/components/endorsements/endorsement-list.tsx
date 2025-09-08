import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Edit, Hash, Calendar, User } from '@phosphor-icons/react'
import { Endorsement, Student } from '@/lib/types'

interface EndorsementListProps {
  endorsements: Endorsement[]
  students: Student[]
  onEdit: (endorsement: Endorsement) => void
}

export function EndorsementList({ endorsements, students, onEdit }: EndorsementListProps) {
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'
  }

  const getStatusBadge = (endorsement: Endorsement) => {
    if (endorsement.status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    if (endorsement.expiresAt) {
      const expirationDate = new Date(endorsement.expiresAt)
      const now = new Date()
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiration <= 0) {
        return <Badge variant="destructive">Expired</Badge>
      } else if (daysUntilExpiration <= 30) {
        return <Badge variant="secondary">Expires Soon</Badge>
      }
    }
    
    return <Badge variant="default">Active</Badge>
  }

  if (endorsements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">No endorsements found</h3>
            <p className="text-muted-foreground">
              No endorsements match the current filter criteria.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {endorsements.map((endorsement) => (
        <Card key={endorsement.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{endorsement.title}</CardTitle>
                  {getStatusBadge(endorsement)}
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {getStudentName(endorsement.studentId)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Issued: {format(new Date(endorsement.issuedAt), 'MMM d, yyyy')}
                  </span>
                  {endorsement.expiresAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Expires: {format(new Date(endorsement.expiresAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(endorsement)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Endorsement Content */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{endorsement.content}</p>
              </div>
              
              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Hash: {endorsement.hash}
                </span>
                <span>Type: {endorsement.type || 'Custom'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}