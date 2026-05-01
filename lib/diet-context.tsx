'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product, MealEntry, UserProfile, WeightEntry, Exercise, MealType } from './types'
import { defaultProducts, defaultProfile, sampleMealEntries, sampleWeightEntries, sampleExercises } from './data'

interface DietContextType {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  
  // Meals
  mealEntries: MealEntry[]
  addMealEntry: (entry: Omit<MealEntry, 'id'>) => void
  removeMealEntry: (id: string) => void
  getMealsByDate: (date: string) => MealEntry[]
  getMealsByDateAndType: (date: string, type: MealType) => MealEntry[]
  
  // Profile
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
  
  // Weight
  weightEntries: WeightEntry[]
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void
  
  // Exercise
  exercises: Exercise[]
  addExercise: (exercise: Omit<Exercise, 'id'>) => void
  removeExercise: (id: string) => void
  getExercisesByDate: (date: string) => Exercise[]
  
  // Selected date
  selectedDate: string
  setSelectedDate: (date: string) => void
  
  // Daily summary
  getDailySummary: (date: string) => {
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    exerciseCalories: number
  }
}

const DietContext = createContext<DietContextType | undefined>(undefined)

export function DietProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(sampleMealEntries)
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(sampleWeightEntries)
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('diet-products')
    const savedMealEntries = localStorage.getItem('diet-meals')
    const savedProfile = localStorage.getItem('diet-profile')
    const savedWeightEntries = localStorage.getItem('diet-weight')
    const savedExercises = localStorage.getItem('diet-exercises')

    if (savedProducts) setProducts(JSON.parse(savedProducts))
    if (savedMealEntries) setMealEntries(JSON.parse(savedMealEntries))
    if (savedProfile) setProfile(JSON.parse(savedProfile))
    if (savedWeightEntries) setWeightEntries(JSON.parse(savedWeightEntries))
    if (savedExercises) setExercises(JSON.parse(savedExercises))
    
    setIsHydrated(true)
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('diet-products', JSON.stringify(products))
  }, [products, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('diet-meals', JSON.stringify(mealEntries))
  }, [mealEntries, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('diet-profile', JSON.stringify(profile))
  }, [profile, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('diet-weight', JSON.stringify(weightEntries))
  }, [weightEntries, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('diet-exercises', JSON.stringify(exercises))
  }, [exercises, isHydrated])

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() }
    setProducts(prev => [...prev, newProduct])
  }

  const addMealEntry = (entry: Omit<MealEntry, 'id'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID() }
    setMealEntries(prev => [...prev, newEntry])
  }

  const removeMealEntry = (id: string) => {
    setMealEntries(prev => prev.filter(e => e.id !== id))
  }

  const getMealsByDate = (date: string) => {
    return mealEntries.filter(e => e.date === date)
  }

  const getMealsByDateAndType = (date: string, type: MealType) => {
    return mealEntries.filter(e => e.date === date && e.mealType === type)
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID() }
    setWeightEntries(prev => [...prev, newEntry])
  }

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = { ...exercise, id: crypto.randomUUID() }
    setExercises(prev => [...prev, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const getExercisesByDate = (date: string) => {
    return exercises.filter(e => e.date === date)
  }

  const getDailySummary = (date: string) => {
    const meals = getMealsByDate(date)
    const dayExercises = getExercisesByDate(date)

    const totals = meals.reduce(
      (acc, entry) => {
        const multiplier = entry.quantity / entry.product.serving
        return {
          totalCalories: acc.totalCalories + entry.product.calories * multiplier,
          totalProtein: acc.totalProtein + entry.product.protein * multiplier,
          totalCarbs: acc.totalCarbs + entry.product.carbs * multiplier,
          totalFat: acc.totalFat + entry.product.fat * multiplier,
        }
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    )

    const exerciseCalories = dayExercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0)

    return {
      ...totals,
      exerciseCalories,
    }
  }

  return (
    <DietContext.Provider
      value={{
        products,
        addProduct,
        mealEntries,
        addMealEntry,
        removeMealEntry,
        getMealsByDate,
        getMealsByDateAndType,
        profile,
        updateProfile,
        weightEntries,
        addWeightEntry,
        exercises,
        addExercise,
        removeExercise,
        getExercisesByDate,
        selectedDate,
        setSelectedDate,
        getDailySummary,
      }}
    >
      {children}
    </DietContext.Provider>
  )
}

export function useDiet() {
  const context = useContext(DietContext)
  if (context === undefined) {
    throw new Error('useDiet must be used within a DietProvider')
  }
  return context
}
