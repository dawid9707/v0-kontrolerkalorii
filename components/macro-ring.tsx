'use client'

import { cn } from '@/lib/utils'

interface MacroRingProps {
  value: number
  max: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  label: string
  unit?: string
  showPercentage?: boolean
}

export function MacroRing({
  value,
  max,
  size = 'md',
  color = 'var(--primary)',
  label,
  unit = 'g',
  showPercentage = false,
}: MacroRingProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', textSizes[size])}>
          {showPercentage ? `${Math.round(percentage)}%` : Math.round(value)}
        </span>
        <span className="text-xs text-muted-foreground">
          {showPercentage ? label : `/ ${max} ${unit}`}
        </span>
        {!showPercentage && (
          <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
        )}
      </div>
    </div>
  )
}
