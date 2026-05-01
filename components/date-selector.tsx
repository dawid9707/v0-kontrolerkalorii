'use client'

import { useDiet } from '@/lib/diet-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, addDays, subDays, isToday } from 'date-fns'
import { pl } from 'date-fns/locale'

export function DateSelector() {
  const { selectedDate, setSelectedDate } = useDiet()
  const date = new Date(selectedDate)

  const goToPreviousDay = () => {
    setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd'))
  }

  const goToNextDay = () => {
    setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd'))
  }

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const formattedDate = format(date, 'EEEE, d MMMM', { locale: pl })

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
      <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <button
        onClick={goToToday}
        className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-lg transition-colors"
      >
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-medium capitalize">
          {isToday(date) ? 'Dzisiaj' : formattedDate}
        </span>
      </button>

      <Button variant="ghost" size="icon" onClick={goToNextDay}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
