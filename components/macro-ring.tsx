'use client'

import { memo, useMemo } from 'react'
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

const sizeConfig = {
  sm: { 
    container: 'w-[4.5rem] h-[4.5rem]', 
    textMain: 'text-sm font-bold', 
    textSub: 'text-[9px]',
    strokeWidth: 6,
    radius: 38
  },
  md: { 
    container: 'w-28 h-28', 
    textMain: 'text-lg font-bold', 
    textSub: 'text-xs',
    strokeWidth: 7,
    radius: 40
  },
  lg: { 
    container: 'w-36 h-36', 
    textMain: 'text-3xl font-bold', 
    textSub: 'text-xs',
    strokeWidth: 8,
    radius: 40
  },
}

export const MacroRing = memo(function MacroRing({
  value,
  max,
  size = 'md',
  color = 'var(--primary)',
  label,
  unit = 'g',
  showPercentage = false,
}: MacroRingProps) {
  const config = sizeConfig[size]
  
  const { percentage, circumference, strokeDashoffset } = useMemo(() => {
    const pct = Math.min((value / max) * 100, 100)
    const circ = 2 * Math.PI * config.radius
    const offset = circ - (pct / 100) * circ
    return { percentage: pct, circumference: circ, strokeDashoffset: offset }
  }, [value, max, config.radius])

  return (
    <div className={cn('relative flex items-center justify-center', config.container)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-surface-container-high"
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r={config.radius}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ 
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(config.textMain, 'tabular-nums')}>
          {showPercentage ? `${Math.round(percentage)}%` : Math.round(value)}
        </span>
        {size === 'lg' ? (
          <span className={cn(config.textSub, 'text-muted-foreground')}>
            {showPercentage ? label : `z ${max} ${unit}`}
          </span>
        ) : (
          <span className={cn(config.textSub, 'text-muted-foreground font-medium mt-0.5')}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
})
