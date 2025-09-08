import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Student, User } from '@/lib/types'
import { useKV } from '@github/spark/hooks'

interface AddStudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudentForm({ open, onOpenChange }: AddStudentFormProps) {
  const [students, setStudents] = useKV<Student[]>('students', [])
  const [users, setUsers] = useKV<User[]>('users', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    trainingObjective: '',
    medicalClass: '',
    medicalExpiration: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateStudentNumber = () => {
    const existingNumbers = students
      .map(s => s.studentNumber)
      .filter(num => num.startsWith('STU'))
      .map(num => parseInt(num.slice(3)))
      .filter(num => !isNaN(num))
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    return `STU${nextNumber.toString().padStart(3, '0')}`
  }

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'trainingObjective', 'medicalClass', 'medicalExpiration']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Check if email already exists
    const existingUser = users.find(user => user.email === formData.email)
    if (existingUser) {
      toast.error('A user with this email already exists')
      return false
    }

    // Medical expiration date validation
    const medicalDate = new Date(formData.medicalExpiration)
    if (medicalDate <= new Date()) {
      toast.error('Medical expiration date must be in the future')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Generate unique IDs
      const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
      const studentId = `student_${Date.now()}_${Math.random().toString(36).slice(2)}`
      const studentNumber = generateStudentNumber()

      // Create user record
      const newUser: User = {
        id: userId,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'student',
        studentId: studentId,
        createdAt: new Date().toISOString()
      }

      // Create student record
      const newStudent: Student = {
        id: studentId,
        userId: userId,
        studentNumber: studentNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        enrollmentDate: new Date().toISOString(),
        status: 'active',
        trainingObjective: formData.trainingObjective as Student['trainingObjective'],
        medicalClass: formData.medicalClass as Student['medicalClass'],
        medicalExpiration: formData.medicalExpiration,
        progress: {
          totalLessons: 0,
          completedLessons: 0,
          percentComplete: 0
        }
      }

      // Update KV storage
      setUsers(currentUsers => [...currentUsers, newUser])
      setStudents(currentStudents => [...currentStudents, newStudent])

      toast.success(`Student ${formData.firstName} ${formData.lastName} added successfully!`)
      
      // Reset form and close dialog
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        trainingObjective: '',
        medicalClass: '',
        medicalExpiration: ''
      })
      onOpenChange(false)

    } catch (error) {
      console.error('Error adding student:', error)
      toast.error('Failed to add student. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account and enrollment record.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingObjective">Training Objective *</Label>
            <Select value={formData.trainingObjective} onValueChange={(value) => handleInputChange('trainingObjective', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select training goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ppl">Private Pilot License (PPL)</SelectItem>
                <SelectItem value="instrument">Instrument Rating</SelectItem>
                <SelectItem value="commercial">Commercial License</SelectItem>
                <SelectItem value="cfi">Certified Flight Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicalClass">Medical Class *</Label>
              <Select value={formData.medicalClass} onValueChange={(value) => handleInputChange('medicalClass', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medical class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Class</SelectItem>
                  <SelectItem value="second">Second Class</SelectItem>
                  <SelectItem value="third">Third Class</SelectItem>
                  <SelectItem value="basic">BasicMed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalExpiration">Medical Expiration *</Label>
              <Input
                id="medicalExpiration"
                type="date"
                value={formData.medicalExpiration}
                onChange={(e) => handleInputChange('medicalExpiration', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Student...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}