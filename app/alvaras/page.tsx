'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { ClientSelector } from '@/components/client-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  FileText,
  Download
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const alvaras = [
  {
    id: '1',
    cliente: 'ABC Comércio Ltda',
    tipo: 'Funcionamento',
    numeroProtocolo: '2024/001234',
    dataEmissao: '15/01/2024',
    dataVencimento: '15/01/2025',
    status: 'Ativo',
    orgaoEmissor: 'Prefeitura Municipal',
    valor: 850,
    diasParaVencer: 45
  },
  {
    id: '2',
    cliente: 'XYZ Indústria',
    tipo: 'Sanitário',
    numeroProtocolo: '2024/005678',
    dataEmissao: '20/02/2024',
    dataVencimento: '20/04/2024',
    status: 'Vencendo',
    orgaoEmissor: 'Vigilância Sanitária',
    valor: 1200,
    diasParaVencer: 8
  },
  {
    id: '3',
    cliente: 'DEF Serviços',
    tipo: 'Bombeiros',
    numeroProtocolo: '2024/009876',
    dataEmissao: '10/03/2024',
    dataVencimento: '10/03/2025',
    status: 'Ativo',
    orgaoEmissor: 'Corpo de Bombeiros',
    valor: 950,
    diasParaVencer: 180
  },
  {
    id: '4',
    cliente: 'GHI Consultoria',
    tipo: 'Funcionamento',
    numeroProtocolo: '2023/012345',
    dataEmissao: '05/12/2023',
    dataVencimento: '05/12/2023',
    status: 'Vencido',
    orgaoEmissor: 'Prefeitura Municipal',
    valor: 750,
    diasParaVencer: -120
  }
]

function getStatusBadge(status: string, diasParaVencer: number) {
  if (diasParaVencer < 0) {
    return (
      <Badge variant="outline" className="ag-status-overdue flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Vencido
      </Badge>
    )
  } else if (diasParaVencer <= 30) {
    return (
      <Badge variant="outline" className="ag-status-pending flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Vencendo
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="ag-status-completed flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Ativo
    </Badge>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function getDaysText(days: number) {
  if (days < 0) {
    return `${Math.abs(days)} dias em atraso`
  } else if (days === 0) {
    return 'Vence hoje'
  } else if (days <= 30) {
    return `${days} dias (Atenção)`
  } else {
    return `${days} dias`
  }
}

export default function AlvarasPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  console.log('Alvarás page rendered')

  const totalAlvaras = alvaras.length
  const ativos = alvaras.filter(a => a.diasParaVencer > 30).length
  const vencendo = alvaras.filter(a => a.diasParaVencer <= 30 && a.diasParaVencer >= 0).length
  const vencidos = alvaras.filter(a => a.diasParaVencer < 0).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Alvarás"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alvarás</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAlvaras}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{ativos}</div>
                <p className="text-xs text-muted-foreground">Em vigência</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{vencendo}</div>
                <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{vencidos}</div>
                <p className="text-xs text-muted-foreground">Renovação urgente</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Alvará
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Calendário de Renovações
              </Button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar alvarás..."
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

          {/* Alvarás Table */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle>Alvarás Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Órgão Emissor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alvaras.map((alvara) => (
                    <TableRow key={alvara.id} className={
                      alvara.diasParaVencer < 0 ? 'bg-red-50 dark:bg-red-950/20' :
                      alvara.diasParaVencer <= 30 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                      ''
                    }>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{alvara.cliente}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{alvara.tipo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{alvara.numeroProtocolo}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{alvara.dataVencimento}</span>
                          <span className={`text-xs ${
                            alvara.diasParaVencer < 0 ? 'text-red-600' :
                            alvara.diasParaVencer <= 30 ? 'text-yellow-600' :
                            'text-muted-foreground'
                          }`}>
                            {getDaysText(alvara.diasParaVencer)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(alvara.status, alvara.diasParaVencer)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {alvara.orgaoEmissor}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(alvara.valor)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Renovar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Renovações Próximas */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Renovações Próximas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alvaras
                  .filter(a => a.diasParaVencer <= 30 && a.diasParaVencer >= 0)
                  .map((alvara) => (
                    <div key={alvara.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                      <div className="flex items-center gap-4">
                        <Shield className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="font-medium">{alvara.cliente}</p>
                          <p className="text-sm text-muted-foreground">
                            {alvara.tipo} - {alvara.orgaoEmissor}
                          </p>
                          <p className="text-sm font-medium text-yellow-700">
                            Vence em {alvara.diasParaVencer} dias
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(alvara.valor)}</span>
                        <Button size="sm" variant="outline">
                          Renovar Agora
                        </Button>
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