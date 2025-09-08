import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Student, Endorsement } from '@/lib/types'

interface EndorsementFormProps {
  students: Student[]
  endorsement?: Endorsement | null
  onSubmit: (endorsement: Omit<Endorsement, 'id' | 'issuedAt' | 'hash'>) => void
  onCancel: () => void
}

// Common endorsement templates
const endorsementTemplates = [
  {
    type: 'solo',
    title: 'Solo Flight Authorization',
    template: 'I certify that [STUDENT_NAME] has received the required training in accordance with 14 CFR 61.87 and is competent to make solo flights in [AIRCRAFT_TYPE].'
  },
  {
    type: 'stage-check',
    title: 'Stage Check Completion',
    template: 'I certify that [STUDENT_NAME] has successfully completed Stage [STAGE_NUMBER] training requirements and is prepared for the next phase of training.'
  },
  {
    type: 'cross-country',
    title: 'Cross Country Authorization',
    template: 'I certify that [STUDENT_NAME] has received the required cross-country training in accordance with 14 CFR 61.93 and is authorized to conduct solo cross-country flights.'
  },
  {
    type: 'checkride',
    title: 'Practical Test Authorization',
    template: 'I certify that [STUDENT_NAME] has received the required training and is prepared for the [CERTIFICATE_TYPE] practical test in accordance with 14 CFR 61.'
  },
  {
    type: 'currency',
    title: 'Currency Endorsement',
    template: 'I certify that [STUDENT_NAME] has completed the required training for currency in accordance with applicable regulations and is authorized to act as pilot in command.'
  },
  {
    type: 'custom',
    title: 'Custom Endorsement',
    template: 'Enter custom endorsement text here...'
  }
]

export function EndorsementForm({ students, endorsement, onSubmit, onCancel }: EndorsementFormProps) {
  const [formData, setFormData] = useState({
    studentId: endorsement?.studentId || '',
    instructorId: endorsement?.instructorId || 'inst-1', // Current instructor
    type: endorsement?.type || '',
    title: endorsement?.title || '',
    content: endorsement?.content || '',
    expiresAt: endorsement?.expiresAt || '',
    status: endorsement?.status || 'active' as const
  })
  
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    endorsement?.expiresAt ? new Date(endorsement.expiresAt) : undefined
  )

  const handleTemplateSelect = (templateType: string) => {
    const template = endorsementTemplates.find(t => t.type === templateType)
    if (template) {
      setFormData(prev => ({
        ...prev,
        type: templateType,
        title: template.title,
        content: template.template
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.title || !formData.content) {
      return
    }

    onSubmit({
      ...formData,
      expiresAt: expirationDate ? expirationDate.toISOString() : undefined
    })
  }

  const selectedStudent = students.find(s => s.id === formData.studentId)

  // Replace placeholders in content when student is selected
  const processedContent = formData.content
    .replace(/\[STUDENT_NAME\]/g, selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : '[STUDENT_NAME]')
    .replace(/\[STUDENT_NUMBER\]/g, selectedStudent?.studentNumber || '[STUDENT_NUMBER]')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endorsement Details</CardTitle>
        <CardDescription>
          Complete the form below to issue a new endorsement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.studentNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Endorsement Template */}
          <div className="space-y-2">
            <Label htmlFor="template">Endorsement Template</Label>
            <Select
              value={formData.type}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                {endorsementTemplates.map((template) => (
                  <SelectItem key={template.type} value={template.type}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Endorsement Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter endorsement title"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Endorsement Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the endorsement text"
              rows={6}
              required
            />
            {formData.content && selectedStudent && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <Label className="text-sm font-medium">Preview:</Label>
                <p className="text-sm mt-1">{processedContent}</p>
              </div>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label>Expiration Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expirationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expirationDate ? format(expirationDate, "PPP") : "Select expiration date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expirationDate}
                  onSelect={setExpirationDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {endorsement ? 'Update Endorsement' : 'Issue Endorsement'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}