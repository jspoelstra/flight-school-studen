import { useKV } from '@github/spark/hooks'
import { Student, Lesson, Endorsement, StageCheck, User } from '@/lib/types'
import { useEffect } from 'react'

export function useSampleData() {
  const [students, setStudents] = useKV<Student[]>('students', [])
  const [lessons, setLessons] = useKV<Lesson[]>('lessons', [])
  const [endorsements, setEndorsements] = useKV<Endorsement[]>('endorsements', [])
  const [stageChecks, setStageChecks] = useKV<StageCheck[]>('stage-checks', [])
  const [users, setUsers] = useKV<User[]>('users', [])

  useEffect(() => {
    // Initialize users if empty
    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          id: 'user1',
          name: 'Mike Student',
          email: 'mike.student@email.com',
          role: 'student',
          studentId: '1',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'user2',
          name: 'Jane Pilot',
          email: 'jane.pilot@email.com',
          role: 'student',
          studentId: '2',
          createdAt: '2024-02-01T00:00:00Z'
        },
        {
          id: 'user3',
          name: 'Bob Aviator',
          email: 'bob.aviator@email.com',
          role: 'student',
          studentId: '3',
          createdAt: '2023-12-01T00:00:00Z'
        }
      ]
      setUsers(sampleUsers)
    }

    // Only initialize if no data exists
    if (students.length === 0) {
      const sampleStudents: Student[] = [
        {
          id: '1',
          userId: 'user1',
          studentNumber: 'STU001',
          firstName: 'Mike',
          lastName: 'Student',
          email: 'mike.student@email.com',
          phone: '(555) 123-4567',
          enrollmentDate: '2024-01-15',
          status: 'active',
          trainingObjective: 'ppl',
          medicalClass: 'third',
          medicalExpiration: '2025-01-15',
          progress: {
            totalLessons: 40,
            completedLessons: 30,
            percentComplete: 75
          }
        },
        {
          id: '2',
          userId: 'user2',
          studentNumber: 'STU002',
          firstName: 'Jane',
          lastName: 'Pilot',
          email: 'jane.pilot@email.com',
          phone: '(555) 234-5678',
          enrollmentDate: '2024-02-01',
          status: 'active',
          trainingObjective: 'instrument',
          medicalClass: 'second',
          medicalExpiration: '2025-02-01',
          progress: {
            totalLessons: 35,
            completedLessons: 16,
            percentComplete: 45
          }
        },
        {
          id: '3',
          userId: 'user3',
          studentNumber: 'STU003',
          firstName: 'Bob',
          lastName: 'Aviator',
          email: 'bob.aviator@email.com',
          phone: '(555) 345-6789',
          enrollmentDate: '2023-12-01',
          status: 'active',
          trainingObjective: 'commercial',
          medicalClass: 'first',
          medicalExpiration: '2024-12-01',
          progress: {
            totalLessons: 50,
            completedLessons: 45,
            percentComplete: 90
          }
        }
      ]
      setStudents(sampleStudents)
    }

    if (lessons.length === 0) {
      const sampleLessons: Lesson[] = [
        {
          id: '1',
          studentId: '1',
          instructorId: 'current-instructor',
          date: '2024-01-10',
          type: 'flight',
          aircraft: 'N12345',
          duration: 1.5,
          objectives: [
            {
              id: '1',
              code: 'TO',
              description: 'Normal takeoff and departure',
              assessment: 'met',
              remarks: 'Excellent crosswind technique'
            },
            {
              id: '2',
              code: 'TP',
              description: 'Traffic pattern operations',
              assessment: 'met',
              remarks: 'Good spacing and altitude control'
            },
            {
              id: '3',
              code: 'LDG',
              description: 'Normal landing approach and landing',
              assessment: 'partial',
              remarks: 'Need to work on airspeed control on final'
            }
          ],
          status: 'final',
          remarks: 'Good lesson overall. Student is progressing well with basic maneuvers. Focus on airspeed control during approach phase.',
          createdAt: '2024-01-10T14:30:00Z',
          finalizedAt: '2024-01-10T16:45:00Z'
        },
        {
          id: '2',
          studentId: '2',
          instructorId: 'current-instructor',
          date: '2024-01-09',
          type: 'ground',
          duration: 2.0,
          objectives: [
            {
              id: '4',
              code: 'WX',
              description: 'Weather interpretation',
              assessment: 'met',
              remarks: 'Good understanding of METAR/TAF'
            },
            {
              id: '5',
              code: 'REG',
              description: 'Federal Aviation Regulations',
              assessment: 'not-met',
              remarks: 'Need to review Part 91 weather minimums'
            }
          ],
          status: 'draft',
          remarks: 'Review weather minimums for next lesson. Student has good grasp of weather products.',
          createdAt: '2024-01-09T10:00:00Z'
        },
        {
          id: '3',
          studentId: '1',
          instructorId: 'current-instructor',
          date: '2024-01-08',
          type: 'flight',
          aircraft: 'N67890',
          duration: 1.8,
          objectives: [
            {
              id: '6',
              code: 'EMER',
              description: 'Emergency procedures',
              assessment: 'met',
              remarks: 'Good response to simulated engine failure'
            },
            {
              id: '7',
              code: 'MAN',
              description: 'Performance maneuvers',
              assessment: 'partial',
              remarks: 'Steep turns need work - altitude control'
            }
          ],
          status: 'final',
          remarks: 'Emergency procedures are solid. Continue practicing steep turns focusing on altitude control.',
          createdAt: '2024-01-08T13:15:00Z',
          finalizedAt: '2024-01-08T15:30:00Z'
        }
      ]
      setLessons(sampleLessons)
    }

    // Initialize endorsements if empty
    if (endorsements.length === 0) {
      const sampleEndorsements: Endorsement[] = [
        {
          id: '1',
          studentId: '1',
          instructorId: 'current-instructor',
          type: 'presolo',
          title: 'Pre-Solo Written Exam',
          content: 'I certify that Mike Student has satisfactorily completed the required knowledge areas for solo flight in accordance with FAR 61.87(b).',
          issuedAt: '2024-01-05T10:00:00Z',
          hash: 'abc123hash',
          status: 'active'
        },
        {
          id: '2',
          studentId: '1',
          instructorId: 'current-instructor',
          type: 'solo',
          title: 'Student Pilot Solo Endorsement',
          content: 'I certify that Mike Student has received the required training and is competent to conduct solo flights in N12345 at KPAO airport.',
          issuedAt: '2024-01-12T14:30:00Z',
          expiresAt: '2024-07-12T14:30:00Z',
          hash: 'def456hash',
          status: 'active'
        },
        {
          id: '3',
          studentId: '2',
          instructorId: 'current-instructor',
          type: 'knowledge',
          title: 'Instrument Rating Knowledge Test',
          content: 'I certify that Jane Pilot has received the required training and is prepared to take the instrument rating knowledge test.',
          issuedAt: '2024-01-20T16:00:00Z',
          hash: 'ghi789hash',
          status: 'active'
        }
      ]
      setEndorsements(sampleEndorsements)
    }

    // Initialize stage checks if empty
    if (stageChecks.length === 0) {
      const sampleStageChecks: StageCheck[] = [
        {
          id: '1',
          studentId: '1',
          evaluatorId: 'stage-check-instructor',
          stage: 'Pre-Solo Stage Check',
          date: '2024-01-15',
          outcome: 'pass',
          notes: 'Student demonstrated proficiency in all required maneuvers. Ready for solo flight.',
          remediationTasks: [],
          signedAt: '2024-01-15T17:30:00Z'
        },
        {
          id: '2',
          studentId: '2',
          evaluatorId: 'stage-check-instructor',
          stage: 'Instrument Stage 1 Check',
          date: '2024-01-22',
          outcome: 'conditional',
          notes: 'Good overall performance. Some items need additional practice before proceeding.',
          remediationTasks: [
            'Practice holding patterns with wind corrections',
            'Review ILS approach procedures and minimums',
            'Additional practice with partial panel approaches'
          ],
          signedAt: '2024-01-22T16:45:00Z'
        }
      ]
      setStageChecks(sampleStageChecks)
    }
  }, [students.length, lessons.length, endorsements.length, stageChecks.length, users.length, setStudents, setLessons, setEndorsements, setStageChecks, setUsers])

  return { students, lessons, endorsements, stageChecks, users }
}