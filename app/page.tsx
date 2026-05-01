'use client'

import { useState } from 'react'
import { DateSelector } from '@/components/date-selector'
import { CalorieSummary } from '@/components/calorie-summary'
import { MealSection } from '@/components/meal-section'
import { AddMealDialog } from '@/components/add-meal-dialog'
import type { MealType } from '@/lib/types'

export default function HomePage() {
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')

  const handleAddMeal = (mealType: MealType) => {
    setSelectedMealType(mealType)
    setAddMealOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FitTracker</h1>
      </div>

      <DateSelector />
      
      <CalorieSummary />

      <div className="space-y-3">
        <MealSection mealType="breakfast" onAddClick={() => handleAddMeal('breakfast')} />
        <MealSection mealType="lunch" onAddClick={() => handleAddMeal('lunch')} />
        <MealSection mealType="dinner" onAddClick={() => handleAddMeal('dinner')} />
        <MealSection mealType="snack" onAddClick={() => handleAddMeal('snack')} />
      </div>

      <AddMealDialog
        open={addMealOpen}
        onOpenChange={setAddMealOpen}
        mealType={selectedMealType}
      />
    </div>
  )
}
