'use client'

import { useState, useCallback, memo } from 'react'
import { Plus, Utensils, Dumbbell, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  onAddMeal: () => void
  onAddExercise: () => void
}

export const FAB = memo(function FAB({ onAddMeal, onAddExercise }: FABProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), [])
  
  const handleAddMeal = useCallback(() => {
    setIsOpen(false)
    onAddMeal()
  }, [onAddMeal])
  
  const handleAddExercise = useCallback(() => {
    setIsOpen(false)
    onAddExercise()
  }, [onAddExercise])

  return (
    <div className="fixed right-4 bottom-24 md:bottom-6 z-50 flex flex-col-reverse items-center gap-3">
      {/* Mini FABs */}
      <div
        className={cn(
          'flex flex-col gap-3 transition-all duration-300 ease-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* Add Exercise */}
        <button
          onClick={handleAddExercise}
          className={cn(
            'group flex items-center gap-3 transition-transform duration-200',
            'hover:scale-105 active:scale-95'
          )}
          aria-label="Dodaj trening"
        >
          <span className="bg-surface-container-high text-foreground px-3 py-1.5 rounded-lg text-sm font-medium elevation-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dodaj trening
          </span>
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-tertiary-container text-tertiary elevation-2 transition-shadow hover:elevation-3">
            <Dumbbell className="w-5 h-5" />
          </span>
        </button>

        {/* Add Meal */}
        <button
          onClick={handleAddMeal}
          className={cn(
            'group flex items-center gap-3 transition-transform duration-200',
            'hover:scale-105 active:scale-95'
          )}
          aria-label="Dodaj posiłek"
        >
          <span className="bg-surface-container-high text-foreground px-3 py-1.5 rounded-lg text-sm font-medium elevation-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dodaj posiłek
          </span>
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary-container text-secondary elevation-2 transition-shadow hover:elevation-3">
            <Utensils className="w-5 h-5" />
          </span>
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleOpen}
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-[1.75rem] bg-primary text-primary-foreground',
          'elevation-3 transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isOpen && 'rotate-45 bg-surface-container-high text-foreground'
        )}
        aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu dodawania'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm -z-10"
          onClick={toggleOpen}
          aria-hidden="true"
        />
      )}
    </div>
  )
})
