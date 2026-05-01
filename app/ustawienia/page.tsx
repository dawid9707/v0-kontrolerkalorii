'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Settings, User, Target, Calculator, Check, Flame, Activity } from 'lucide-react'

const activityLevels = [
  { value: 'sedentary', label: 'Siedzący tryb życia', multiplier: 1.2 },
  { value: 'light', label: 'Lekka aktywność (1-2 dni/tydzień)', multiplier: 1.375 },
  { value: 'moderate', label: 'Umiarkowana aktywność (3-5 dni/tydzień)', multiplier: 1.55 },
  { value: 'active', label: 'Wysoka aktywność (6-7 dni/tydzień)', multiplier: 1.725 },
  { value: 'very_active', label: 'Bardzo wysoka aktywność', multiplier: 1.9 },
]

const goals = [
  { value: 'lose', label: 'Redukcja wagi', calorieAdjustment: -500 },
  { value: 'maintain', label: 'Utrzymanie wagi', calorieAdjustment: 0 },
  { value: 'gain', label: 'Budowa masy', calorieAdjustment: 300 },
]

export default function SettingsPage() {
  const { profile, updateProfile } = useDiet()
  const [formData, setFormData] = useState(profile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const { bmr, tdee } = useMemo(() => {
    const calculatedBmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
    const activity = activityLevels.find((a) => a.value === formData.activityLevel)
    const calculatedTdee = calculatedBmr * (activity?.multiplier || 1.55)
    return { bmr: calculatedBmr, tdee: calculatedTdee }
  }, [formData.weight, formData.height, formData.age, formData.activityLevel])

  const handleAutoCalculate = useCallback(() => {
    const goalAdjustment = goals.find((g) => g.value === formData.goal)?.calorieAdjustment || 0
    const calories = Math.round(tdee + goalAdjustment)

    const proteinCalories = calories * 0.3
    const carbsCalories = calories * 0.4
    const fatCalories = calories * 0.3

    setFormData(prev => ({
      ...prev,
      dailyGoals: {
        calories,
        protein: Math.round(proteinCalories / 4),
        carbs: Math.round(carbsCalories / 4),
        fat: Math.round(fatCalories / 9),
      }
    }))
  }, [formData.goal, tdee])

  const handleSave = useCallback(() => {
    updateProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [formData, updateProfile])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary-container">
          <Settings className="h-6 w-6 text-secondary" />
        </span>
        <div>
          <h1 className="text-xl font-bold">Ustawienia</h1>
          <p className="text-xs text-muted-foreground">Personalizuj aplikację</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Profil</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Imię</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-2xl bg-surface-container border-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Wiek</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">Wzrost (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">Aktualna waga (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-sm font-medium">Docelowa waga (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || 0 })}
                className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Poziom aktywności</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value: typeof formData.activityLevel) =>
                setFormData({ ...formData, activityLevel: value })
              }
            >
              <SelectTrigger className="h-12 rounded-2xl bg-surface-container border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value} className="rounded-xl">
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Cele</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cel</Label>
            <Select
              value={formData.goal}
              onValueChange={(value: typeof formData.goal) =>
                setFormData({ ...formData, goal: value })
              }
            >
              <SelectTrigger className="h-12 rounded-2xl bg-surface-container border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value} className="rounded-xl">
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={handleAutoCalculate} 
            className="w-full h-12 rounded-2xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200"
          >
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Oblicz automatycznie
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-sm font-medium">Kalorie (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.dailyGoals.calories}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyGoals: { ...formData.dailyGoals, calories: parseInt(e.target.value) || 0 },
                  })
                }
                className="h-12 rounded-2xl bg-primary/10 border-0 text-center font-bold text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein" className="text-sm font-medium">Białko (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.dailyGoals.protein}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyGoals: { ...formData.dailyGoals, protein: parseInt(e.target.value) || 0 },
                  })
                }
                className="h-12 rounded-2xl bg-protein/10 border-0 text-center font-bold text-protein"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs" className="text-sm font-medium">Węglowodany (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.dailyGoals.carbs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyGoals: { ...formData.dailyGoals, carbs: parseInt(e.target.value) || 0 },
                  })
                }
                className="h-12 rounded-2xl bg-carbs/10 border-0 text-center font-bold text-carbs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat" className="text-sm font-medium">Tłuszcze (g)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.dailyGoals.fat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyGoals: { ...formData.dailyGoals, fat: parseInt(e.target.value) || 0 },
                  })
                }
                className="h-12 rounded-2xl bg-fat/10 border-0 text-center font-bold text-fat"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-[1.75rem] bg-primary-container p-5 elevation-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
              <Flame className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">BMR</p>
              <p className="font-bold text-lg tabular-nums">{Math.round(bmr)} kcal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary/20">
              <Activity className="h-5 w-5 text-tertiary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TDEE</p>
              <p className="font-bold text-lg tabular-nums">{Math.round(tdee)} kcal</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        className="w-full h-14 rounded-2xl text-base font-semibold elevation-2 hover:elevation-3 transition-all duration-200 active:scale-[0.98]" 
        size="lg"
      >
        <Check className="h-5 w-5 mr-2" />
        {saved ? 'Zapisano!' : 'Zapisz ustawienia'}
      </Button>
    </div>
  )
}
