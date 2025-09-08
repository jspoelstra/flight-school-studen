export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  studentId?: string
  instructorId?: string
  createdAt: string
}

export interface Student {
  id: string
  userId: string
  studentNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'completed' | 'withdrawn'
  trainingObjective: 'ppl' | 'instrument' | 'commercial' | 'cfi'
  medicalClass: 'first' | 'second' | 'third' | 'basic'
  medicalExpiration: string
  progress: {
    totalLessons: number
    completedLessons: number
    percentComplete: number
  }
}

export interface Instructor {
  id: string
  userId: string
  certificateNumber: string
  firstName: string
  lastName: string
  email: string
  ratings: string[]
  expirationDate: string
  status: 'active' | 'inactive'
}

export interface Lesson {
  id: string
  studentId: string
  instructorId: string
  date: string
  type: 'flight' | 'ground'
  aircraft?: string
  duration: number
  objectives: LessonObjective[]
  status: 'draft' | 'final'
  remarks: string
  createdAt: string
  finalizedAt?: string
}

export interface LessonObjective {
  id: string
  code: string
  description: string
  assessment: 'met' | 'partial' | 'not-met'
  remarks?: string
}

export interface Endorsement {
  id: string
  studentId: string
  instructorId: string
  type: string
  title: string
  content: string
  issuedAt: string
  expiresAt?: string
  hash: string
  status: 'active' | 'expired'
}

export interface StageCheck {
  id: string
  studentId: string
  evaluatorId: string
  stage: string
  date: string
  outcome: 'pass' | 'conditional' | 'fail'
  notes: string
  remediationTasks: string[]
  signedAt?: string
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  entityType: string
  entityId: string
  details: string
}

export interface InstructorAvailability {
  id: string
  instructorId: string
  date: string
  startTime: string
  endTime: string
  isRecurring: boolean
  recurrencePattern?: 'weekly' | 'biweekly'
  maxStudents: number
  notes?: string
  createdAt: string
}

export interface ScheduledLesson {
  id: string
  studentId: string
  instructorId: string
  availabilityId: string
  date: string
  startTime: string
  endTime: string
  type: 'flight' | 'ground'
  aircraft?: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  lessonObjectives: string[]
  notes?: string
  scheduledAt: string
  confirmedAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
  scheduledLessonId?: string
  studentName?: string
}