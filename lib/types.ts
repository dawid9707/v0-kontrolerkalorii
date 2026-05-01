export interface Product {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit: string
  serving: number
  category: string
}

export interface MealEntry {
  id: string
  productId: string
  product: Product
  quantity: number
  mealType: MealType
  date: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface UserProfile {
  name: string
  age: number
  weight: number
  targetWeight: number
  height: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose' | 'maintain' | 'gain'
  dailyGoals: DailyGoals
}

export interface WeightEntry {
  id: string
  date: string
  weight: number
}

export interface MeasurementEntry {
  id: string
  date: string
  chest?: number
  waist?: number
  hips?: number
  biceps?: number
  thighs?: number
}

export interface Exercise {
  id: string
  name: string
  caloriesBurned: number
  duration: number
  date: string
}

export interface DailySummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  exerciseCalories: number
}
