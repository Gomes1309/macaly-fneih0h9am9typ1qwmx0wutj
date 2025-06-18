'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building2
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const obligations = [
  {
    id: '1',
    nome: 'IRPJ - 1º Trimestre',
    cliente: 'ABC Comércio Ltda',
    tipo: 'Fiscal',
    vencimento: '31/03/2024',
    status: 'Vencido',
    responsavel: 'João Silva',
    valor: 'R$ 15.000,00',
    diasParaVencimento: -2
  },
  {
    id: '2',
    nome: 'SPED Fiscal',
    cliente: 'XYZ Indústria',
    tipo: 'Fiscal',
    vencimento: '15/04/2024',
    status: 'Pendente',
    responsavel: 'Maria Santos',
    valor: '-',
    diasParaVencimento: 12
  },
  {
    id: '3',
    nome: 'ICMS - Março',
    cliente: 'DEF Serviços',
    tipo: 'Estadual',
    vencimento: '18/04/2024',
    status: 'Em Andamento',
    responsavel: 'Carlos Oliveira',
    valor: 'R$ 8.500,00',
    diasParaVencimento: 15
  },
  {
    id: '4',
    nome: 'ISS - Março',
    cliente: 'GHI Consultoria',
    tipo: 'Municipal',
    vencimento: '10/04/2024',
    status: 'Entregue',
    responsavel: 'Ana Costa',
    valor: 'R$ 2.300,00',
    diasParaVencimento: 7
  }
]

function getStatusBadge(status: string, diasParaVencimento: number) {
  if (status === 'Vencido' || diasParaVencimento < 0) {
    return (
      <Badge variant="outline" className="ag-status-overdue flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Vencido
      </Badge>
    )
  }
  
  const statusConfig = {
    'Entregue': { color: 'ag-status-completed', icon: <CheckCircle className="h-3 w-3" /> },
    'Pendente': { color: 'ag-status-pending', icon: <Clock className="h-3 w-3" /> },
    'Em Andamento': { color: 'ag-status-pending', icon: <Clock className="h-3 w-3" /> }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pendente']
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {status}
    </Badge>
  )
}

function getDaysUntilDue(days: number) {
  if (days < 0) {
    return `${Math.abs(days)} dias em atraso`
  } else if (days === 0) {
    return 'Vence hoje'
  } else if (days <= 3) {
    return `${days} dias (Urgente)`
  } else {
    return `${days} dias`
  }
}

export default function ObrigacoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Obrigações page rendered')

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Obrigações"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Obrigações</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">4</div>
                <p className="text-xs text-muted-foreground">Requer ação imediata</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencimento Hoje</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <p className="text-xs text-muted-foreground">Até 23:59</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entregues</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">55</div>
                <p className="text-xs text-muted-foreground">82% concluído</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Obrigação
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Calendário
              </Button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar obrigações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Obligations Table */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle>Obrigações do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obrigação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obligations.map((obligation) => (
                    <TableRow key={obligation.id} className={
                      obligation.diasParaVencimento < 0 ? 'bg-red-50 dark:bg-red-950/20' :
                      obligation.diasParaVencimento <= 3 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                      ''
                    }>
                      <TableCell className="font-medium">{obligation.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {obligation.cliente}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{obligation.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{obligation.vencimento}</span>
                          <span className={`text-xs ${
                            obligation.diasParaVencimento < 0 ? 'text-red-600' :
                            obligation.diasParaVencimento <= 3 ? 'text-yellow-600' :
                            'text-muted-foreground'
                          }`}>
                            {getDaysUntilDue(obligation.diasParaVencimento)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(obligation.status, obligation.diasParaVencimento)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {obligation.responsavel}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{obligation.valor}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm">
                            Entregar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>


    </div>
  )
}