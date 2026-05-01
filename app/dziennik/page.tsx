'use client'

import { useState } from 'react'
import { useDiet } from '@/lib/diet-context'
import { DateSelector } from '@/components/date-selector'
import { MealSection } from '@/components/meal-section'
import { AddMealDialog } from '@/components/add-meal-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MealType } from '@/lib/types'
import { BookOpen } from 'lucide-react'

export default function DiaryPage() {
  const { selectedDate, getDailySummary, profile } = useDiet()
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')

  const summary = getDailySummary(selectedDate)
  const goals = profile.dailyGoals

  const handleAddMeal = (mealType: MealType) => {
    setSelectedMealType(mealType)
    setAddMealOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Dziennik posiłków</h1>
      </div>

      <DateSelector />

      {/* Quick summary bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Podsumowanie makroskładników</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Kalorie</div>
              <div className="font-bold">{Math.round(summary.totalCalories)}</div>
              <div className="text-xs text-muted-foreground">/ {goals.calories}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Białko</div>
              <div className="font-bold text-protein">{Math.round(summary.totalProtein)}g</div>
              <div className="text-xs text-muted-foreground">/ {goals.protein}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Węgle</div>
              <div className="font-bold text-carbs">{Math.round(summary.totalCarbs)}g</div>
              <div className="text-xs text-muted-foreground">/ {goals.carbs}g</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Tłuszcze</div>
              <div className="font-bold text-fat">{Math.round(summary.totalFat)}g</div>
              <div className="text-xs text-muted-foreground">/ {goals.fat}g</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
