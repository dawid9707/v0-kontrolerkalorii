'use client'

import { memo, useMemo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { MacroRing } from './macro-ring'
import { Flame, Dumbbell, TrendingUp } from 'lucide-react'

export const CalorieSummary = memo(function CalorieSummary() {
  const { selectedDate, getDailySummary, profile } = useDiet()
  
  const { summary, goals, netCalories, remainingCalories } = useMemo(() => {
    const sum = getDailySummary(selectedDate)
    const g = profile.dailyGoals
    const net = sum.totalCalories - sum.exerciseCalories
    return {
      summary: sum,
      goals: g,
      netCalories: net,
      remainingCalories: g.calories - net
    }
  }, [selectedDate, getDailySummary, profile.dailyGoals])

  return (
    <div className="rounded-[2rem] bg-card elevation-2 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Flame className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Podsumowanie dnia</h2>
            <p className="text-xs text-muted-foreground">Twój dzienny bilans kaloryczny</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col items-center gap-5">
          {/* Main calorie ring */}
          <div className="relative py-2">
            <MacroRing
              value={netCalories}
              max={goals.calories}
              size="lg"
              color="var(--calories)"
              label="kcal"
              unit="kcal"
            />
          </div>

          {/* Calorie breakdown - MD3 Chips style */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-surface-container transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <TrendingUp className="h-4 w-4 text-primary mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Spożyte</p>
              <p className="font-bold text-xl tabular-nums">{Math.round(summary.totalCalories)}</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-tertiary-container transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Dumbbell className="h-4 w-4 text-tertiary mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Spalone</p>
              <p className="font-bold text-xl tabular-nums text-tertiary">{Math.round(summary.exerciseCalories)}</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-primary-container transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Flame className="h-4 w-4 text-primary mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Pozostało</p>
              <p className={`font-bold text-xl tabular-nums ${remainingCalories < 0 ? 'text-destructive' : 'text-primary'}`}>
                {Math.round(remainingCalories)}
              </p>
            </div>
          </div>

          {/* Macros - MD3 style */}
          <div className="flex justify-around w-full pt-2">
            <MacroRing
              value={summary.totalProtein}
              max={goals.protein}
              size="sm"
              color="var(--protein)"
              label="Białko"
            />
            <MacroRing
              value={summary.totalCarbs}
              max={goals.carbs}
              size="sm"
              color="var(--carbs)"
              label="Węgle"
            />
            <MacroRing
              value={summary.totalFat}
              max={goals.fat}
              size="sm"
              color="var(--fat)"
              label="Tłuszcze"
            />
          </div>
        </div>
      </div>
    </div>
  )
})
