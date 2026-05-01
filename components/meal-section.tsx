'use client'

import { useDiet } from '@/lib/diet-context'
import type { MealType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Coffee, Utensils, Moon, Cookie } from 'lucide-react'

const mealTypeConfig: Record<MealType, { label: string; icon: typeof Coffee }> = {
  breakfast: { label: 'Śniadanie', icon: Coffee },
  lunch: { label: 'Obiad', icon: Utensils },
  dinner: { label: 'Kolacja', icon: Moon },
  snack: { label: 'Przekąski', icon: Cookie },
}

interface MealSectionProps {
  mealType: MealType
  onAddClick: () => void
}

export function MealSection({ mealType, onAddClick }: MealSectionProps) {
  const { selectedDate, getMealsByDateAndType, removeMealEntry } = useDiet()
  const meals = getMealsByDateAndType(selectedDate, mealType)
  const config = mealTypeConfig[mealType]
  const Icon = config.icon

  const totalCalories = meals.reduce((acc, meal) => {
    const multiplier = meal.quantity / meal.product.serving
    return acc + meal.product.calories * multiplier
  }, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-4 w-4 text-primary" />
            {config.label}
            <span className="text-sm font-normal text-muted-foreground">
              ({Math.round(totalCalories)} kcal)
            </span>
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={onAddClick} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {meals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Brak posiłków. Dodaj coś!
          </p>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => {
              const multiplier = meal.quantity / meal.product.serving
              const calories = Math.round(meal.product.calories * multiplier)
              const protein = Math.round(meal.product.protein * multiplier)
              const carbs = Math.round(meal.product.carbs * multiplier)
              const fat = Math.round(meal.product.fat * multiplier)

              return (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{meal.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {meal.quantity}{meal.product.unit} • {calories} kcal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      B: {protein}g • W: {carbs}g • T: {fat}g
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMealEntry(meal.id)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
