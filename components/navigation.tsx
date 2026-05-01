'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BookOpen, Apple, TrendingUp, Settings, Dumbbell } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Główna', icon: Home },
  { href: '/dziennik', label: 'Dziennik', icon: BookOpen },
  { href: '/produkty', label: 'Produkty', icon: Apple },
  { href: '/aktywnosc', label: 'Aktywność', icon: Dumbbell },
  { href: '/postepy', label: 'Postępy', icon: TrendingUp },
  { href: '/ustawienia', label: 'Ustawienia', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:relative md:border-t-0 md:border-r md:w-64 md:min-h-screen">
      <div className="flex justify-around md:flex-col md:p-4 md:gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-2 transition-colors md:flex-row md:gap-3 md:px-4 md:py-3 md:rounded-lg',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
