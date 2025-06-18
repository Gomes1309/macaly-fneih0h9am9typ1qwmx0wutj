'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ReactNode
  color?: 'default' | 'green' | 'red' | 'yellow'
}

function StatCard({ title, value, subtitle, trend, trendValue, icon, color = 'default' }: StatCardProps) {
  const colorClasses = {
    default: 'text-primary',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  }

  const bgClasses = {
    default: 'bg-primary/10',
    green: 'bg-green-100 dark:bg-green-900/20',
    red: 'bg-red-100 dark:bg-red-900/20',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20'
  }

  return (
    <Card className="ag-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-md ${bgClasses[color]}`}>
          <div className={`h-4 w-4 ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
            <span className={`text-xs ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  console.log('Dashboard stats component rendered')

  const stats = [
    {
      title: 'Obrigações Pendentes',
      value: '12',
      subtitle: 'Vencimento até 30 dias',
      trend: 'down' as const,
      trendValue: '-2 desde ontem',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'yellow' as const
    },
    {
      title: 'Documentos Enviados',
      value: '847',
      subtitle: 'Este mês',
      trend: 'up' as const,
      trendValue: '+15% vs mês anterior',
      icon: <FileText className="h-4 w-4" />,
      color: 'green' as const
    },
    {
      title: 'Vencimentos Hoje',
      value: '3',
      subtitle: 'Requer atenção',
      icon: <Calendar className="h-4 w-4" />,
      color: 'red' as const
    },
    {
      title: 'Honorários Pendentes',
      value: 'R$ 28.350',
      subtitle: '15 clientes',
      trend: 'up' as const,
      trendValue: '+8% este mês',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'default' as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}