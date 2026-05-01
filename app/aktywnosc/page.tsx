'use client'

import { useState } from 'react'
import { useDiet } from '@/lib/diet-context'
import { exerciseTypes } from '@/lib/data'
import { DateSelector } from '@/components/date-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dumbbell, Plus, Trash2, Flame, Clock } from 'lucide-react'

export default function ActivityPage() {
  const { selectedDate, exercises, addExercise, removeExercise, getExercisesByDate } = useDiet()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('')
  const [duration, setDuration] = useState('')

  const todayExercises = getExercisesByDate(selectedDate)
  const totalCaloriesBurned = todayExercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0)
  const totalDuration = todayExercises.reduce((acc, ex) => acc + ex.duration, 0)

  const handleAddExercise = () => {
    const exerciseType = exerciseTypes.find((e) => e.name === selectedExercise)
    if (!exerciseType || !duration) return

    const caloriesBurned = exerciseType.caloriesPerMinute * parseInt(duration)

    addExercise({
      name: selectedExercise,
      caloriesBurned,
      duration: parseInt(duration),
      date: selectedDate,
    })

    setSelectedExercise('')
    setDuration('')
    setDialogOpen(false)
  }

  const selectedExerciseType = exerciseTypes.find((e) => e.name === selectedExercise)
  const estimatedCalories = selectedExerciseType && duration
    ? selectedExerciseType.caloriesPerMinute * parseInt(duration)
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Aktywność fizyczna</h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj aktywność</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rodzaj aktywności</Label>
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz aktywność" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseTypes.map((ex) => (
                      <SelectItem key={ex.name} value={ex.name}>
                        {ex.name} ({ex.caloriesPerMinute} kcal/min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Czas trwania (minuty)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="np. 30"
                />
              </div>

              {estimatedCalories > 0 && (
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">Szacowane spalone kalorie:</p>
                  <p className="text-2xl font-bold text-accent">{estimatedCalories} kcal</p>
                </div>
              )}

              <Button onClick={handleAddExercise} className="w-full" disabled={!selectedExercise || !duration}>
                Dodaj aktywność
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DateSelector />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/10">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spalone kalorie</p>
                <p className="text-2xl font-bold">{totalCaloriesBurned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Czas ćwiczeń</p>
                <p className="text-2xl font-bold">{totalDuration} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercises list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dzisiejsze aktywności</CardTitle>
        </CardHeader>
        <CardContent>
          {todayExercises.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Brak aktywności. Dodaj trening!
            </p>
          ) : (
            <div className="space-y-2">
              {todayExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 group"
                >
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.duration} min • {exercise.caloriesBurned} kcal
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise types info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rodzaje aktywności</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {exerciseTypes.map((ex) => (
              <div key={ex.name} className="p-2 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium">{ex.name}</p>
                <p className="text-muted-foreground">{ex.caloriesPerMinute} kcal/min</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
