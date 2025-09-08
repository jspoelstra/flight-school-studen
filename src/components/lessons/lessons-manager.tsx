import { useState } from 'react'
import { LessonForm } from './lesson-form'
import { LessonList } from './lesson-list'
import { LessonDetails } from './lesson-details'
import { Lesson } from '@/lib/types'

type LessonView = 'list' | 'form' | 'details'

export function LessonsManager() {
  const [currentView, setCurrentView] = useState<LessonView>('list')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>()

  const handleNewLesson = () => {
    setSelectedLesson(undefined)
    setCurrentView('form')
  }

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentView('form')
  }

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentView('details')
  }

  const handleLessonSaved = () => {
    setCurrentView('list')
    setSelectedLesson(undefined)
  }

  const handleBack = () => {
    setCurrentView('list')
    setSelectedLesson(undefined)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return (
          <LessonForm
            lesson={selectedLesson}
            onSave={handleLessonSaved}
            onCancel={handleBack}
          />
        )
      case 'details':
        return selectedLesson ? (
          <LessonDetails
            lesson={selectedLesson}
            onBack={handleBack}
            onEdit={() => setCurrentView('form')}
          />
        ) : null
      case 'list':
      default:
        return (
          <LessonList
            onNewLesson={handleNewLesson}
            onEditLesson={handleEditLesson}
            onViewLesson={handleViewLesson}
          />
        )
    }
  }

  return renderCurrentView()
}