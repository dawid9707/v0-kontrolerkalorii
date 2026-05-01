'use client'

import { useState, useCallback, useMemo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrendingUp, Plus, Scale, Target, TrendingDown, Check, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

export default function ProgressPage() {
  const { weightEntries, addWeightEntry, profile } = useDiet()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const { sortedEntries, latestWeight, startWeight, weightChange, progressToGoal, chartData } = useMemo(() => {
    const sorted = [...weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const latest = sorted[sorted.length - 1]?.weight || profile.weight
    const start = sorted[0]?.weight || profile.weight
    const change = latest - start
    const progress = profile.targetWeight
      ? ((start - latest) / (start - profile.targetWeight)) * 100
      : 0
    const chart = sorted.map((entry) => ({
      date: format(new Date(entry.date), 'd MMM', { locale: pl }),
      weight: entry.weight,
    }))
    return { sortedEntries: sorted, latestWeight: latest, startWeight: start, weightChange: change, progressToGoal: progress, chartData: chart }
  }, [weightEntries, profile.weight, profile.targetWeight])

  const handleAddWeight = useCallback(() => {
    if (!newWeight) return

    addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
    })

    setNewWeight('')
    setDialogOpen(false)
  }, [newWeight, addWeightEntry])

  const openDialog = useCallback(() => setDialogOpen(true), [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary-container">
            <TrendingUp className="h-6 w-6 text-primary" />
          </span>
          <div>
            <h1 className="text-xl font-bold">Postępy</h1>
            <p className="text-xs text-muted-foreground">Monitoruj swoją wagę</p>
          </div>
        </div>

        <Button 
          onClick={openDialog}
          className="rounded-2xl h-11 px-5 elevation-2 hover:elevation-3 transition-all duration-200 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj wagę
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 rounded-[1.75rem] bg-primary-container elevation-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20">
              <Scale className="h-6 w-6 text-primary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Aktualna</p>
              <p className="text-2xl font-bold tabular-nums">{latestWeight}</p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-[1.75rem] bg-tertiary-container elevation-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-tertiary/20">
              <Target className="h-6 w-6 text-tertiary" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Cel</p>
              <p className="text-2xl font-bold tabular-nums">{profile.targetWeight}</p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Zmiana wagi</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${weightChange < 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  {weightChange < 0 ? (
                    <TrendingDown className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                </span>
                <p className={`text-2xl font-bold tabular-nums ${weightChange < 0 ? 'text-primary' : 'text-destructive'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Postęp</p>
              <p className="text-2xl font-bold text-primary tabular-nums mt-1">
                {Math.min(Math.max(progressToGoal, 0), 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="h-3 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(Math.max(progressToGoal, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Historia wagi</h2>
        </div>
        <div className="p-4">
          {chartData.length < 2 ? (
            <div className="text-center py-10">
              <Scale className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Dodaj więcej pomiarów, aby zobaczyć wykres
              </p>
            </div>
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: 'var(--elevation-2)',
                    }}
                    labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  />
                  {profile.targetWeight && (
                    <ReferenceLine 
                      y={profile.targetWeight} 
                      stroke="var(--tertiary)" 
                      strokeDasharray="5 5"
                      label={{ value: 'Cel', position: 'right', fontSize: 10, fill: 'var(--tertiary)' }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: 'var(--primary)' }}
                    name="Waga (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-semibold">Ostatnie pomiary</h2>
        </div>
        <div className="p-4 space-y-2">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">Brak pomiarów</p>
            </div>
          ) : (
            sortedEntries.slice(-5).reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-surface-container transition-all duration-200 hover:bg-surface-container-high"
              >
                <p className="text-sm font-medium">
                  {format(new Date(entry.date), 'd MMMM yyyy', { locale: pl })}
                </p>
                <p className="font-bold text-lg tabular-nums">{entry.weight} kg</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Weight Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </span>
              <DialogTitle className="text-lg">Dodaj pomiar wagi</DialogTitle>
            </div>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">Waga (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="np. 75.5"
                className="h-14 rounded-2xl bg-surface-container border-0 text-center text-2xl font-bold tabular-nums"
              />
            </div>

            <Button 
              onClick={handleAddWeight} 
              className="w-full h-12 rounded-2xl text-base font-semibold elevation-2 hover:elevation-3 transition-all duration-200 active:scale-[0.98]" 
              disabled={!newWeight}
            >
              <Check className="h-5 w-5 mr-2" />
              Zapisz pomiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
