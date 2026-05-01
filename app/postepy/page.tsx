'use client'

import { useState } from 'react'
import { useDiet } from '@/lib/diet-context'
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
import { TrendingUp, Plus, Scale, Target, TrendingDown } from 'lucide-react'
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
} from 'recharts'

export default function ProgressPage() {
  const { weightEntries, addWeightEntry, profile } = useDiet()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const latestWeight = sortedEntries[sortedEntries.length - 1]?.weight || profile.weight
  const startWeight = sortedEntries[0]?.weight || profile.weight
  const weightChange = latestWeight - startWeight
  const progressToGoal = profile.targetWeight
    ? ((startWeight - latestWeight) / (startWeight - profile.targetWeight)) * 100
    : 0

  const handleAddWeight = () => {
    if (!newWeight) return

    addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
    })

    setNewWeight('')
    setDialogOpen(false)
  }

  const chartData = sortedEntries.map((entry) => ({
    date: format(new Date(entry.date), 'd MMM', { locale: pl }),
    weight: entry.weight,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Postępy</h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj wagę
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj pomiar wagi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Waga (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="np. 75.5"
                />
              </div>

              <Button onClick={handleAddWeight} className="w-full" disabled={!newWeight}>
                Zapisz pomiar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktualna waga</p>
                <p className="text-2xl font-bold">{latestWeight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cel</p>
                <p className="text-2xl font-bold">{profile.targetWeight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Zmiana wagi</p>
              <div className="flex items-center gap-2">
                {weightChange < 0 ? (
                  <TrendingDown className="h-5 w-5 text-primary" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-destructive" />
                )}
                <p className={`text-2xl font-bold ${weightChange < 0 ? 'text-primary' : 'text-destructive'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Postęp do celu</p>
              <p className="text-2xl font-bold text-primary">
                {Math.min(Math.max(progressToGoal, 0), 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progressToGoal, 0), 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weight chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historia wagi</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length < 2 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Dodaj więcej pomiarów, aby zobaczyć wykres
            </p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    name="Waga (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ostatnie pomiary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedEntries.slice(-5).reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <p className="text-sm">
                  {format(new Date(entry.date), 'd MMMM yyyy', { locale: pl })}
                </p>
                <p className="font-bold">{entry.weight} kg</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
