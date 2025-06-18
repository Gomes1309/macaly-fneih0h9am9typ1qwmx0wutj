'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User
} from 'lucide-react'

interface Activity {
  id: string
  type: 'document' | 'send' | 'completed' | 'alert'
  title: string
  description: string
  timestamp: string
  user: string
  status?: 'pending' | 'completed' | 'overdue'
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'document',
    title: 'DAS Enviado',
    description: 'Empresa ABC Ltda - Março/2024',
    timestamp: '2 min atrás',
    user: 'João Silva',
    status: 'completed'
  },
  {
    id: '2',
    type: 'send',
    title: 'Holerite Enviado',
    description: 'Funcionário: Maria Santos',
    timestamp: '15 min atrás',
    user: 'Ana Costa',
    status: 'completed'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Vencimento IRPJ',
    description: 'XYZ Comércio Ltda - Vence hoje',
    timestamp: '1 hora atrás',
    user: 'Sistema',
    status: 'overdue'
  },
  {
    id: '4',
    type: 'completed',
    title: 'Obrigação Entregue',
    description: 'SPED Fiscal - Empresa DEF',
    timestamp: '2 horas atrás',
    user: 'Carlos Oliveira',
    status: 'completed'
  },
  {
    id: '5',
    type: 'document',
    title: 'Alvará Renovado',
    description: 'Renovação até 31/12/2024',
    timestamp: '3 horas atrás',
    user: 'Pedro Santos',
    status: 'completed'
  }
]

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'document':
      return <FileText className="h-4 w-4" />
    case 'send':
      return <Send className="h-4 w-4" />
    case 'completed':
      return <CheckCircle className="h-4 w-4" />
    case 'alert':
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusBadge(status?: Activity['status']) {
  if (!status) return null
  
  const statusConfig = {
    pending: { label: 'Pendente', className: 'ag-status-pending' },
    completed: { label: 'Concluído', className: 'ag-status-completed' },
    overdue: { label: 'Vencido', className: 'ag-status-overdue' }
  }
  
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export function RecentActivities() {
  console.log('Recent activities component rendered')

  return (
    <Card className="ag-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}