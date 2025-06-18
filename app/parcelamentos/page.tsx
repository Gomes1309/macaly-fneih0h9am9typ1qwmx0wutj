'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const parcelamentos = [
  {
    id: '1',
    cliente: 'ABC Comércio Ltda',
    tipo: 'IRPJ',
    valorTotal: 45000,
    totalParcelas: 12,
    parcelasPagas: 8,
    proximaParcelaValor: 3750,
    proximaParcelaData: '15/04/2024',
    status: 'Ativo',
    orgao: 'Receita Federal'
  },
  {
    id: '2',
    cliente: 'XYZ Indústria',
    tipo: 'INSS',
    valorTotal: 28000,
    totalParcelas: 24,
    parcelasPagas: 15,
    proximaParcelaValor: 1167,
    proximaParcelaData: '20/04/2024',
    status: 'Ativo',
    orgao: 'INSS'
  },
  {
    id: '3',
    cliente: 'DEF Serviços',
    tipo: 'Simples Nacional',
    valorTotal: 15600,
    totalParcelas: 6,
    parcelasPagas: 6,
    proximaParcelaValor: 0,
    proximaParcelaData: '-',
    status: 'Quitado',
    orgao: 'Receita Federal'
  },
  {
    id: '4',
    cliente: 'GHI Consultoria',
    tipo: 'ISS',
    valorTotal: 8400,
    totalParcelas: 10,
    parcelasPagas: 3,
    proximaParcelaValor: 840,
    proximaParcelaData: '10/04/2024',
    status: 'Em Atraso',
    orgao: 'Prefeitura'
  }
]

function getStatusBadge(status: string) {
  const statusConfig = {
    'Ativo': { color: 'ag-status-pending', icon: <Clock className="h-3 w-3" /> },
    'Quitado': { color: 'ag-status-completed', icon: <CheckCircle className="h-3 w-3" /> },
    'Em Atraso': { color: 'ag-status-overdue', icon: <AlertTriangle className="h-3 w-3" /> }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Ativo']
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {status}
    </Badge>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export default function ParcelamentosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Parcelamentos page rendered')

  const totalParcelamentos = parcelamentos.length
  const ativos = parcelamentos.filter(p => p.status === 'Ativo').length
  const quitados = parcelamentos.filter(p => p.status === 'Quitado').length
  const emAtraso = parcelamentos.filter(p => p.status === 'Em Atraso').length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Parcelamentos"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Parcelamentos</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParcelamentos}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{ativos}</div>
                <p className="text-xs text-muted-foreground">Em andamento</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quitados</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{quitados}</div>
                <p className="text-xs text-muted-foreground">Finalizados</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{emAtraso}</div>
                <p className="text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Parcelamento
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Calendário de Vencimentos
              </Button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar parcelamentos..."
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

          {/* Parcelamentos Table */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle>Parcelamentos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Próxima Parcela</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Órgão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcelamentos.map((parcelamento) => {
                    const progresso = (parcelamento.parcelasPagas / parcelamento.totalParcelas) * 100
                    
                    return (
                      <TableRow key={parcelamento.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{parcelamento.cliente}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{parcelamento.tipo}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(parcelamento.valorTotal)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{parcelamento.parcelasPagas}/{parcelamento.totalParcelas}</span>
                              <span>{Math.round(progresso)}%</span>
                            </div>
                            <Progress value={progresso} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {parcelamento.status === 'Quitado' ? (
                            <span className="text-green-600 font-medium">Quitado</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {formatCurrency(parcelamento.proximaParcelaValor)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {parcelamento.proximaParcelaData}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(parcelamento.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {parcelamento.orgao}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm">
                              Ver Detalhes
                            </Button>
                            <Button variant="ghost" size="sm">
                              Pagar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parcelamentos
                  .filter(p => p.status === 'Ativo' || p.status === 'Em Atraso')
                  .map((parcelamento) => (
                    <div key={parcelamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{parcelamento.cliente}</span>
                          <span className="text-sm text-muted-foreground">{parcelamento.tipo}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(parcelamento.proximaParcelaValor)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parcelamento.proximaParcelaData}
                          </div>
                        </div>
                        {getStatusBadge(parcelamento.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>


    </div>
  )
}