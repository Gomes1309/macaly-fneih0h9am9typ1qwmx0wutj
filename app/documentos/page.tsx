'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Upload, 
  Send, 
  Search, 
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const documents = [
  {
    id: '1',
    nome: 'DAS - Março 2024',
    cliente: 'ABC Comércio Ltda',
    tipo: 'Tributário',
    dataEnvio: '15/03/2024',
    status: 'Enviado',
    visualizado: true,
    whatsapp: true,
    email: true
  },
  {
    id: '2',
    nome: 'SPED Fiscal',
    cliente: 'XYZ Indústria',
    tipo: 'Fiscal',
    dataEnvio: '10/03/2024',
    status: 'Pendente',
    visualizado: false,
    whatsapp: false,
    email: false
  },
  {
    id: '3',
    nome: 'Balancete',
    cliente: 'DEF Serviços',
    tipo: 'Contábil',
    dataEnvio: '20/03/2024',
    status: 'Visualizado',
    visualizado: true,
    whatsapp: true,
    email: true
  }
]

function getStatusBadge(status: string) {
  const statusConfig = {
    'Enviado': { color: 'ag-status-completed', icon: <CheckCircle className="h-3 w-3" /> },
    'Pendente': { color: 'ag-status-pending', icon: <Clock className="h-3 w-3" /> },
    'Visualizado': { color: 'ag-status-completed', icon: <Eye className="h-3 w-3" /> }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pendente']
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {status}
    </Badge>
  )
}

export default function DocumentosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Documentos page rendered')

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Documentos"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enviados</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.247</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizados</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">892</div>
                <p className="text-xs text-muted-foreground">71% taxa de abertura</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Aguardando envio</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Não Visualizados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">355</div>
                <p className="text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Enviar Documento
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Envio em Lote
              </Button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
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

          {/* Documents Table */}
          <Card className="ag-card">
            <CardHeader>
              <CardTitle>Documentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Envio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Canais</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.nome}</TableCell>
                      <TableCell>{doc.cliente}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.tipo}</Badge>
                      </TableCell>
                      <TableCell>{doc.dataEnvio}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.whatsapp && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              WhatsApp
                            </Badge>
                          )}
                          {doc.email && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              E-mail
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
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