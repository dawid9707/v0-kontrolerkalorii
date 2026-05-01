'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useMemo } from 'react'
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

const NavItem = memo(function NavItem({ 
  href, 
  label, 
  icon: Icon, 
  isActive 
}: { 
  href: string
  label: string
  icon: typeof Home
  isActive: boolean 
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex flex-col items-center gap-0.5 py-3 px-3 transition-all duration-200',
        'md:flex-row md:gap-4 md:px-5 md:py-3.5 md:rounded-[2rem]',
        'active:scale-95',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <span 
        className={cn(
          'flex items-center justify-center w-16 h-8 rounded-full transition-all duration-200 md:w-auto md:h-auto md:p-0',
          isActive 
            ? 'bg-primary/15' 
            : 'hover:bg-muted md:bg-transparent'
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </span>
      <span className={cn(
        'text-[11px] md:text-sm transition-all duration-200',
        isActive ? 'font-semibold' : 'font-medium'
      )}>
        {label}
      </span>
    </Link>
  )
})

export const Navigation = memo(function Navigation() {
  const pathname = usePathname()

  const items = useMemo(() => 
    navItems.map((item) => ({
      ...item,
      isActive: pathname === item.href
    })),
    [pathname]
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border/50 md:relative md:border-t-0 md:border-r md:w-72 md:min-h-screen md:bg-surface">
      <div className="flex justify-around md:flex-col md:p-4 md:gap-1">
        <div className="hidden md:block px-5 py-6">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center">
              <Apple className="w-5 h-5 text-primary-foreground" />
            </span>
            FitTracker
          </h1>
        </div>
        {items.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  )
})
