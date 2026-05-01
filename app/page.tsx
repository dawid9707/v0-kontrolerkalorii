'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DateSelector } from '@/components/date-selector'
import { CalorieSummary } from '@/components/calorie-summary'
import { MealSection } from '@/components/meal-section'
import { AddMealDialog } from '@/components/add-meal-dialog'
import { FAB } from '@/components/fab'
import type { MealType } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')

  const handleAddMeal = useCallback((mealType: MealType) => {
    setSelectedMealType(mealType)
    setAddMealOpen(true)
  }, [])

  const handleFABMeal = useCallback(() => {
    setSelectedMealType('breakfast')
    setAddMealOpen(true)
  }, [])

  const handleFABExercise = useCallback(() => {
    router.push('/aktywnosc')
  }, [router])

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-2xl font-bold text-foreground">FitTracker</h1>
        </div>

        <DateSelector />
        
        <CalorieSummary />

        <div className="space-y-3">
          <MealSection mealType="breakfast" onAddClick={() => handleAddMeal('breakfast')} />
          <MealSection mealType="lunch" onAddClick={() => handleAddMeal('lunch')} />
          <MealSection mealType="dinner" onAddClick={() => handleAddMeal('dinner')} />
          <MealSection mealType="snack" onAddClick={() => handleAddMeal('snack')} />
        </div>
      </div>

      <FAB onAddMeal={handleFABMeal} onAddExercise={handleFABExercise} />

      <AddMealDialog
        open={addMealOpen}
        onOpenChange={setAddMealOpen}
        mealType={selectedMealType}
      />
    </>
  )
}
