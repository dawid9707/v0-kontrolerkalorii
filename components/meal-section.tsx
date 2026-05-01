'use client'

import { memo, useMemo, useCallback } from 'react'
import { useDiet } from '@/lib/diet-context'
import type { MealType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Coffee, Utensils, Moon, Cookie } from 'lucide-react'

const mealTypeConfig: Record<MealType, { label: string; icon: typeof Coffee; color: string }> = {
  breakfast: { label: 'Śniadanie', icon: Coffee, color: 'bg-tertiary-container text-tertiary' },
  lunch: { label: 'Obiad', icon: Utensils, color: 'bg-primary-container text-primary' },
  dinner: { label: 'Kolacja', icon: Moon, color: 'bg-secondary-container text-secondary' },
  snack: { label: 'Przekąski', icon: Cookie, color: 'bg-surface-container-high text-muted-foreground' },
}

interface MealSectionProps {
  mealType: MealType
  onAddClick: () => void
}

const MealItem = memo(function MealItem({ 
  meal, 
  onRemove 
}: { 
  meal: { id: string; quantity: number; product: { name: string; serving: number; unit: string; calories: number; protein: number; carbs: number; fat: number } }
  onRemove: (id: string) => void 
}) {
  const multiplier = meal.quantity / meal.product.serving
  const calories = Math.round(meal.product.calories * multiplier)
  const protein = Math.round(meal.product.protein * multiplier)
  const carbs = Math.round(meal.product.carbs * multiplier)
  const fat = Math.round(meal.product.fat * multiplier)

  const handleRemove = useCallback(() => onRemove(meal.id), [meal.id, onRemove])

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container group transition-all duration-200 hover:bg-surface-container-high active:scale-[0.98]">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{meal.product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-primary">{calories} kcal</span>
          <span className="text-xs text-muted-foreground">
            {meal.quantity}{meal.product.unit}
          </span>
        </div>
        <div className="flex gap-3 mt-1">
          <span className="text-[10px] text-protein font-medium">B {protein}g</span>
          <span className="text-[10px] text-carbs font-medium">W {carbs}g</span>
          <span className="text-[10px] text-fat font-medium">T {fat}g</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRemove}
        className="h-9 w-9 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
})

export const MealSection = memo(function MealSection({ mealType, onAddClick }: MealSectionProps) {
  const { selectedDate, getMealsByDateAndType, removeMealEntry } = useDiet()
  const meals = getMealsByDateAndType(selectedDate, mealType)
  const config = mealTypeConfig[mealType]
  const Icon = config.icon

  const totalCalories = useMemo(() => 
    meals.reduce((acc, meal) => {
      const multiplier = meal.quantity / meal.product.serving
      return acc + meal.product.calories * multiplier
    }, 0),
    [meals]
  )

  return (
    <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden transition-all duration-200 hover:elevation-2">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.color}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-foreground">{config.label}</h3>
            <p className="text-xs text-muted-foreground">{Math.round(totalCalories)} kcal</p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onAddClick} 
          className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {meals.length === 0 ? (
          <button 
            onClick={onAddClick}
            className="w-full text-center py-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
          >
            <Plus className="h-5 w-5 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-sm text-muted-foreground mt-1 group-hover:text-primary transition-colors">
              Dodaj posiłek
            </p>
          </button>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => (
              <MealItem key={meal.id} meal={meal} onRemove={removeMealEntry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
