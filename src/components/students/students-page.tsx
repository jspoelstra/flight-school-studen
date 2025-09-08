import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AddStudentForm } from '@/components/students/add-student-form'
import { useSampleData } from '@/lib/sample-data'
import { useAuth } from '@/lib/auth'
import { 
  Users,
  Search,
  Plus,
  Eye,
  Calendar,
  Mail,
  Phone
} from '@phosphor-icons/react'

export function StudentsPage() {
  const { user } = useAuth()
  const { students } = useSampleData()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'withdrawn':
        return <Badge variant="destructive">Withdrawn</Badge>
      default:
        return <Badge variant="outline">Inactive</Badge>
    }
  }

  const getTrainingObjective = (objective: string) => {
    const objectives = {
      ppl: 'Private Pilot License',
      instrument: 'Instrument Rating',
      commercial: 'Commercial License',
      cfi: 'Certified Flight Instructor'
    }
    return objectives[objective as keyof typeof objectives] || objective
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Students</h2>
          <p className="text-muted-foreground">Manage student enrollments and records</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <Button onClick={() => setIsAddStudentOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Directory
          </CardTitle>
          <CardDescription>
            {filteredStudents.length} of {students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or student number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No students found matching your search.' : 'No students enrolled yet.'}
                </p>
                {!searchTerm && (user?.role === 'admin' || user?.role === 'instructor') && (
                  <Button onClick={() => setIsAddStudentOpen(true)} className="mt-4">
                    Add First Student
                  </Button>
                )}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {student.firstName} {student.lastName}
                        </h3>
                        {getStatusBadge(student.status)}
                        <span className="text-sm text-muted-foreground">
                          #{student.studentNumber}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Enrolled: {formatDate(student.enrollmentDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Goal: {getTrainingObjective(student.trainingObjective)}</span>
                        <span>Medical: {student.medicalClass.charAt(0).toUpperCase() + student.medicalClass.slice(1)} Class</span>
                        <span>Progress: {student.progress.percentComplete}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Student Form Dialog */}
      <AddStudentForm 
        open={isAddStudentOpen} 
        onOpenChange={setIsAddStudentOpen} 
      />
    </div>
  )
}