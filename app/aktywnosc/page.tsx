'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { exerciseTypes } from '@/lib/data'
import { DateSelector } from '@/components/date-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dumbbell, Plus, Trash2, Flame, Clock, Check, Zap } from 'lucide-react'

const ExerciseTypeCard = memo(function ExerciseTypeCard({ 
  name, 
  caloriesPerMinute 
}: { 
  name: string
  caloriesPerMinute: number 
}) {
  return (
    <div className="p-3 rounded-2xl bg-surface-container transition-all duration-200 hover:bg-surface-container-high active:scale-[0.98]">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-tertiary font-semibold mt-0.5">{caloriesPerMinute} kcal/min</p>
    </div>
  )
})

const ExerciseItem = memo(function ExerciseItem({ 
  exercise, 
  onRemove 
}: { 
  exercise: { id: string; name: string; duration: number; caloriesBurned: number }
  onRemove: (id: string) => void 
}) {
  const handleRemove = useCallback(() => onRemove(exercise.id), [exercise.id, onRemove])

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container group transition-all duration-200 hover:bg-surface-container-high active:scale-[0.98]">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary-container">
          <Zap className="h-5 w-5 text-tertiary" />
        </span>
        <div>
          <p className="font-medium">{exercise.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{exercise.duration} min</span>
            <span className="text-xs font-semibold text-tertiary">{exercise.caloriesBurned} kcal</span>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRemove}
        className="h-10 w-10 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
})

export default function ActivityPage() {
  const { selectedDate, addExercise, removeExercise, getExercisesByDate } = useDiet()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('')
  const [duration, setDuration] = useState('')

  const todayExercises = useMemo(() => getExercisesByDate(selectedDate), [selectedDate, getExercisesByDate])
  
  const { totalCaloriesBurned, totalDuration } = useMemo(() => ({
    totalCaloriesBurned: todayExercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0),
    totalDuration: todayExercises.reduce((acc, ex) => acc + ex.duration, 0)
  }), [todayExercises])

  const estimatedCalories = useMemo(() => {
    const exerciseType = exerciseTypes.find((e) => e.name === selectedExercise)
    return exerciseType && duration ? exerciseType.caloriesPerMinute * parseInt(duration) : 0
  }, [selectedExercise, duration])

  const handleAddExercise = useCallback(() => {
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
  }, [selectedExercise, duration, addExercise, selectedDate])

  const openDialog = useCallback(() => setDialogOpen(true), [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-tertiary-container">
            <Dumbbell className="h-6 w-6 text-tertiary" />
          </span>
          <div>
            <h1 className="text-xl font-bold">Aktywność</h1>
            <p className="text-xs text-muted-foreground">Śledź swoje treningi</p>
          </div>
        </div>

        <Button 
          onClick={openDialog}
          className="rounded-2xl h-11 px-5 elevation-2 hover:elevation-3 transition-all duration-200 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      <DateSelector />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 rounded-[1.75rem] bg-tertiary-container elevation-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-tertiary/20">
              <Flame className="h-6 w-6 text-tertiary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Spalone</p>
              <p className="text-2xl font-bold tabular-nums">{totalCaloriesBurned}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-[1.75rem] bg-primary-container elevation-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Czas</p>
              <p className="text-2xl font-bold tabular-nums">{totalDuration}</p>
              <p className="text-xs text-muted-foreground">minut</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises list */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-semibold">Dzisiejsze aktywności</h2>
        </div>
        <div className="p-4">
          {todayExercises.length === 0 ? (
            <button 
              onClick={openDialog}
              className="w-full text-center py-8 rounded-2xl border-2 border-dashed border-border hover:border-tertiary/50 hover:bg-tertiary/5 transition-all duration-200 group"
            >
              <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-tertiary transition-colors" />
              <p className="text-sm text-muted-foreground mt-2 group-hover:text-tertiary transition-colors">
                Dodaj swój pierwszy trening
              </p>
            </button>
          ) : (
            <div className="space-y-2">
              {todayExercises.map((exercise) => (
                <ExerciseItem key={exercise.id} exercise={exercise} onRemove={removeExercise} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise types */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-semibold">Rodzaje aktywności</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {exerciseTypes.map((ex) => (
              <ExerciseTypeCard key={ex.name} name={ex.name} caloriesPerMinute={ex.caloriesPerMinute} />
            ))}
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary/10">
                <Dumbbell className="h-5 w-5 text-tertiary" />
              </span>
              <DialogTitle className="text-lg">Dodaj aktywność</DialogTitle>
            </div>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rodzaj aktywności</Label>
              <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                <SelectTrigger className="h-12 rounded-2xl bg-surface-container border-0">
                  <SelectValue placeholder="Wybierz aktywność" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {exerciseTypes.map((ex) => (
                    <SelectItem key={ex.name} value={ex.name} className="rounded-xl">
                      {ex.name} ({ex.caloriesPerMinute} kcal/min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Czas trwania (minuty)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="np. 30"
                className="h-12 rounded-2xl bg-surface-container border-0 text-center text-lg font-semibold"
              />
            </div>

            {estimatedCalories > 0 && (
              <div className="p-4 rounded-2xl bg-tertiary-container">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Szacowane spalone kalorie</p>
                <p className="text-3xl font-bold text-tertiary mt-1 tabular-nums">{estimatedCalories} kcal</p>
              </div>
            )}

            <Button 
              onClick={handleAddExercise} 
              className="w-full h-12 rounded-2xl text-base font-semibold elevation-2 hover:elevation-3 transition-all duration-200 active:scale-[0.98]" 
              disabled={!selectedExercise || !duration}
            >
              <Check className="h-5 w-5 mr-2" />
              Dodaj aktywność
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
