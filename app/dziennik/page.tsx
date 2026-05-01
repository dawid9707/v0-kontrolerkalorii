'use client'

import { useState, useCallback, useMemo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { DateSelector } from '@/components/date-selector'
import { MealSection } from '@/components/meal-section'
import { AddMealDialog } from '@/components/add-meal-dialog'
import type { MealType } from '@/lib/types'
import { BookOpen, Flame, Beef, Wheat, Droplets } from 'lucide-react'

export default function DiaryPage() {
  const { selectedDate, getDailySummary, profile } = useDiet()
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')

  const { summary, goals } = useMemo(() => ({
    summary: getDailySummary(selectedDate),
    goals: profile.dailyGoals
  }), [selectedDate, getDailySummary, profile.dailyGoals])

  const handleAddMeal = useCallback((mealType: MealType) => {
    setSelectedMealType(mealType)
    setAddMealOpen(true)
  }, [])

  const MacroCard = useCallback(({ 
    icon: Icon, 
    label, 
    value, 
    goal, 
    color, 
    bgColor 
  }: { 
    icon: typeof Flame
    label: string
    value: number
    goal: number
    color: string
    bgColor: string
  }) => {
    const percentage = Math.min((value / goal) * 100, 100)
    return (
      <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container transition-all duration-200 hover:bg-surface-container-high">
        <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${bgColor} mb-2`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </span>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className={`font-bold text-lg tabular-nums ${color}`}>{Math.round(value)}</p>
        <p className="text-[10px] text-muted-foreground">/ {goal}</p>
        <div className="w-full h-1 bg-surface-container-high rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${bgColor.replace('/10', '')}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary-container">
          <BookOpen className="h-6 w-6 text-secondary" />
        </span>
        <div>
          <h1 className="text-xl font-bold">Dziennik</h1>
          <p className="text-xs text-muted-foreground">Twoje posiłki</p>
        </div>
      </div>

      <DateSelector />

      {/* Quick summary - MD3 style */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="text-sm font-semibold">Makroskładniki</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            <MacroCard 
              icon={Flame} 
              label="kcal" 
              value={summary.totalCalories} 
              goal={goals.calories}
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <MacroCard 
              icon={Beef} 
              label="białko" 
              value={summary.totalProtein} 
              goal={goals.protein}
              color="text-protein"
              bgColor="bg-protein/10"
            />
            <MacroCard 
              icon={Wheat} 
              label="węgle" 
              value={summary.totalCarbs} 
              goal={goals.carbs}
              color="text-carbs"
              bgColor="bg-carbs/10"
            />
            <MacroCard 
              icon={Droplets} 
              label="tłuszcze" 
              value={summary.totalFat} 
              goal={goals.fat}
              color="text-fat"
              bgColor="bg-fat/10"
            />
          </div>
        </div>
      </div>

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
