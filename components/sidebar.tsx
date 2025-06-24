'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  CreditCard,
  Shield,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  Building2,
  MessageCircle,
  User,
  Receipt,
  Upload,
} from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  onToggle: () => void
}

const navigation = [
  {
    title: 'Clientes',
    href: '/clientes',
    icon: Users,
  },
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Documentos',
    href: '/documentos',
    icon: FileText,
  },
  {
    title: 'Obrigações',
    href: '/obrigacoes',
    icon: Calendar,
  },
  {
    title: 'Parcelamentos',
    href: '/parcelamentos',
    icon: CreditCard,
  },
  {
    title: 'Alvarás',
    href: '/alvaras',
    icon: Shield,
  },
  {
    title: 'Folha de Pagamento',
    href: '/folha',
    icon: Users,
  },
  {
    title: 'Honorários',
    href: '/honorarios',
    icon: DollarSign,
  },
  {
    title: 'WhatsApp',
    href: '/whatsapp',
    icon: MessageCircle,
  },
  {
    title: 'Impostos',
    href: '/impostos',
    icon: Receipt,
  },

  {
    title: 'Usuários',
    href: '/usuarios',
    icon: Users,
  },
  {
    title: 'Área do Cliente',
    href: '/cliente',
    icon: User,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
]

export function Sidebar({ className, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  console.log('Sidebar rendered, collapsed:', isCollapsed, 'current path:', pathname)

  return (
    <div className={cn(
      'flex flex-col border-r bg-card transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-72',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AG Assessoria</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform',
            isCollapsed && 'rotate-180'
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11',
                    isCollapsed && 'justify-center px-2',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}