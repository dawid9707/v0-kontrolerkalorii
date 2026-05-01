'use client'

import { useDiet } from '@/lib/diet-context'
import { MacroRing } from './macro-ring'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Dumbbell } from 'lucide-react'

export function CalorieSummary() {
  const { selectedDate, getDailySummary, profile } = useDiet()
  const summary = getDailySummary(selectedDate)
  const goals = profile.dailyGoals

  const netCalories = summary.totalCalories - summary.exerciseCalories
  const remainingCalories = goals.calories - netCalories

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-primary" />
          Podsumowanie dnia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          {/* Main calorie ring */}
          <div className="relative">
            <MacroRing
              value={netCalories}
              max={goals.calories}
              size="lg"
              color="var(--calories)"
              label="kcal"
              unit="kcal"
            />
          </div>

          {/* Calorie breakdown */}
          <div className="grid grid-cols-3 gap-4 w-full text-center text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground">Spożyte</p>
              <p className="font-bold text-lg">{Math.round(summary.totalCalories)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Dumbbell className="h-3 w-3" />
                <span>Spalone</span>
              </div>
              <p className="font-bold text-lg text-accent">{Math.round(summary.exerciseCalories)}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-muted-foreground">Pozostało</p>
              <p className={`font-bold text-lg ${remainingCalories < 0 ? 'text-destructive' : 'text-primary'}`}>
                {Math.round(remainingCalories)}
              </p>
            </div>
          </div>

          {/* Macros */}
          <div className="flex justify-around w-full">
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
      </CardContent>
    </Card>
  )
}
