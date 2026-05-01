'use client'

import { useState, useEffect } from 'react'
import { useDiet } from '@/lib/diet-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Settings, User, Target, Calculator, Save } from 'lucide-react'

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

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    const bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
    return bmr
  }

  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activity = activityLevels.find((a) => a.value === formData.activityLevel)
    return bmr * (activity?.multiplier || 1.55)
  }

  const calculateDailyGoals = () => {
    const tdee = calculateTDEE()
    const goalAdjustment = goals.find((g) => g.value === formData.goal)?.calorieAdjustment || 0
    const calories = Math.round(tdee + goalAdjustment)

    // Standard macro split: 30% protein, 40% carbs, 30% fat
    const proteinCalories = calories * 0.3
    const carbsCalories = calories * 0.4
    const fatCalories = calories * 0.3

    return {
      calories,
      protein: Math.round(proteinCalories / 4), // 4 kcal per gram of protein
      carbs: Math.round(carbsCalories / 4), // 4 kcal per gram of carbs
      fat: Math.round(fatCalories / 9), // 9 kcal per gram of fat
    }
  }

  const handleAutoCalculate = () => {
    const dailyGoals = calculateDailyGoals()
    setFormData({ ...formData, dailyGoals })
  }

  const handleSave = () => {
    updateProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Ustawienia</h1>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Profil
          </CardTitle>
          <CardDescription>Twoje podstawowe dane</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Wiek</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Wzrost (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Aktualna waga (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Docelowa waga (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Poziom aktywności</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value: typeof formData.activityLevel) =>
                setFormData({ ...formData, activityLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            Cele
          </CardTitle>
          <CardDescription>Ustaw swoje cele dietetyczne</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cel</Label>
            <Select
              value={formData.goal}
              onValueChange={(value: typeof formData.goal) =>
                setFormData({ ...formData, goal: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleAutoCalculate} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Oblicz automatycznie
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Kalorie (kcal)</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Białko (g)</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Węglowodany (g)</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Tłuszcze (g)</Label>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">BMR (podstawowa przemiana materii)</p>
              <p className="font-bold text-lg">{Math.round(calculateBMR())} kcal</p>
            </div>
            <div>
              <p className="text-muted-foreground">TDEE (całkowite zapotrzebowanie)</p>
              <p className="font-bold text-lg">{Math.round(calculateTDEE())} kcal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        {saved ? 'Zapisano!' : 'Zapisz ustawienia'}
      </Button>
    </div>
  )
}
