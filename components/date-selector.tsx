'use client'

import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { useDiet } from '@/lib/diet-context'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { format, addDays, subDays, isToday, isYesterday, isTomorrow } from 'date-fns'
import { pl } from 'date-fns/locale'

export const DateSelector = memo(function DateSelector() {
  const { selectedDate, setSelectedDate } = useDiet()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const date = useMemo(() => new Date(selectedDate), [selectedDate])

  const goToPreviousDay = useCallback(() => {
    setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd'))
  }, [date, setSelectedDate])

  const goToNextDay = useCallback(() => {
    setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd'))
  }, [date, setSelectedDate])

  const goToToday = useCallback(() => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }, [setSelectedDate])

  const formattedDate = useMemo(() => {
    if (!mounted) {
      // Return a stable string for SSR to avoid hydration mismatch
      return format(date, 'EEEE, d MMMM', { locale: pl })
    }
    if (isToday(date)) return 'Dzisiaj'
    if (isYesterday(date)) return 'Wczoraj'
    if (isTomorrow(date)) return 'Jutro'
    return format(date, 'EEEE, d MMMM', { locale: pl })
  }, [date, mounted])

  return (
    <div className="flex items-center justify-between p-2 bg-card rounded-[2rem] elevation-1">
      <button
        onClick={goToPreviousDay}
        className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-surface-container active:bg-surface-container-high transition-colors active:scale-95"
        aria-label="Poprzedni dzień"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>

      <button
        onClick={goToToday}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full hover:bg-surface-container active:bg-surface-container-high transition-all duration-200 active:scale-95"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <CalendarDays className="h-4 w-4 text-primary" />
        </span>
        <span className="font-medium capitalize text-foreground">
          {formattedDate}
        </span>
      </button>

      <button
        onClick={goToNextDay}
        className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-surface-container active:bg-surface-container-high transition-colors active:scale-95"
        aria-label="Następny dzień"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>
    </div>
  )
})
