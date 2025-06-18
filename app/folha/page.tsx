'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { ClientSelector } from '@/components/client-selector'
import { UploadZone } from '@/components/upload-zone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Send,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Briefcase
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const funcionarios = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    empresa: 'ABC Comércio Ltda',
    cargo: 'Vendedora',
    salario: 2800,
    status: 'Ativo',
    admissao: '15/01/2023',
    ultimoHolerite: 'Março/2024',
    holeriteEnviado: true,
    whatsapp: '11999998888'
  },
  {
    id: '2',
    nome: 'João Carlos Oliveira',
    empresa: 'XYZ Indústria',
    cargo: 'Operador',
    salario: 3200,
    status: 'Ativo',
    admissao: '10/05/2022',
    ultimoHolerite: 'Março/2024',
    holeriteEnviado: false,
    whatsapp: '11888887777'
  },
  {
    id: '3',
    nome: 'Ana Paula Costa',
    empresa: 'DEF Serviços',
    cargo: 'Recepcionista',
    salario: 2400,
    status: 'Férias',
    admissao: '20/08/2021',
    ultimoHolerite: 'Março/2024',
    holeriteEnviado: true,
    whatsapp: '11777776666'
  },
  {
    id: '4',
    nome: 'Carlos Eduardo Pereira',
    empresa: 'ABC Comércio Ltda',
    cargo: 'Gerente',
    salario: 5500,
    status: 'Afastado',
    admissao: '05/03/2020',
    ultimoHolerite: 'Fevereiro/2024',
    holeriteEnviado: false,
    whatsapp: '11666665555'
  }
]

const eventos = [
  {
    id: '1',
    funcionario: 'Maria Silva Santos',
    tipo: 'Férias',
    dataInicio: '15/04/2024',
    dataFim: '29/04/2024',
    status: 'Aprovado'
  },
  {
    id: '2',
    funcionario: 'João Carlos Oliveira',
    tipo: 'Afastamento INSS',
    dataInicio: '10/04/2024',
    dataFim: '20/04/2024',
    status: 'Em Análise'
  }
]

function getStatusBadge(status: string) {
  const statusConfig = {
    'Ativo': { color: 'ag-status-completed', icon: <CheckCircle className="h-3 w-3" /> },
    'Férias': { color: 'ag-status-pending', icon: <Calendar className="h-3 w-3" /> },
    'Afastado': { color: 'ag-status-overdue', icon: <AlertTriangle className="h-3 w-3" /> },
    'Rescindido': { color: 'ag-status-overdue', icon: <AlertTriangle className="h-3 w-3" /> }
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

export default function FolhaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  console.log('Folha de Pagamento page rendered')

  const totalFuncionarios = funcionarios.length
  const ativos = funcionarios.filter(f => f.status === 'Ativo').length
  const holeritesPendentes = funcionarios.filter(f => !f.holeriteEnviado).length
  const folhaMensal = funcionarios.reduce((sum, f) => sum + f.salario, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Folha de Pagamento"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFuncionarios}</div>
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
                <p className="text-xs text-muted-foreground">Trabalhando</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Holerites Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{holeritesPendentes}</div>
                <p className="text-xs text-muted-foreground">Para enviar</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Folha Mensal</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(folhaMensal)}</div>
                <p className="text-xs text-muted-foreground">Total salários</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="funcionarios" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
              <TabsTrigger value="holerites">Holerites</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="funcionarios" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Funcionário
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar funcionário..."
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

              <Card className="ag-card">
                <CardHeader>
                  <CardTitle>Funcionários Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Salário</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Admissão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{funcionario.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell>{funcionario.empresa}</TableCell>
                          <TableCell>{funcionario.cargo}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(funcionario.salario)}</TableCell>
                          <TableCell>{getStatusBadge(funcionario.status)}</TableCell>
                          <TableCell>{funcionario.admissao}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holerites" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle>Envio de Holerites</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <ClientSelector 
                        value={selectedClient}
                        onValueChange={setSelectedClient}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mês de Referência</label>
                      <Input type="month" defaultValue="2024-03" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload de Holerites</label>
                    <UploadZone 
                      acceptedFileTypes={['application/pdf']}
                      maxFiles={100}
                      onFilesUploaded={(files) => {
                        console.log('Holerites uploaded:', files.length)
                      }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar via WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar via E-mail
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="ag-card">
                <CardHeader>
                  <CardTitle>Status dos Holerites</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Último Holerite</TableHead>
                        <TableHead>Status Envio</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id}>
                          <TableCell className="font-medium">{funcionario.nome}</TableCell>
                          <TableCell>{funcionario.ultimoHolerite}</TableCell>
                          <TableCell>
                            {funcionario.holeriteEnviado ? (
                              <Badge variant="outline" className="ag-status-completed">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enviado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ag-status-pending">
                                <Clock className="h-3 w-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {funcionario.whatsapp}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eventos" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Eventos de RH</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle>Férias Programadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {eventos.filter(e => e.tipo === 'Férias').map(evento => (
                        <div key={evento.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{evento.funcionario}</p>
                            <p className="text-sm text-muted-foreground">
                              {evento.dataInicio} até {evento.dataFim}
                            </p>
                          </div>
                          <Badge variant="outline" className="ag-status-completed">
                            {evento.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle>Afastamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {eventos.filter(e => e.tipo.includes('Afastamento')).map(evento => (
                        <div key={evento.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{evento.funcionario}</p>
                            <p className="text-sm text-muted-foreground">{evento.tipo}</p>
                            <p className="text-sm text-muted-foreground">
                              {evento.dataInicio} até {evento.dataFim}
                            </p>
                          </div>
                          <Badge variant="outline" className="ag-status-pending">
                            {evento.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle>Resumo da Folha</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Bruto</span>
                        <span className="font-medium">{formatCurrency(folhaMensal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>INSS Empresa</span>
                        <span className="font-medium">{formatCurrency(folhaMensal * 0.20)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>FGTS</span>
                        <span className="font-medium">{formatCurrency(folhaMensal * 0.08)}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between items-center font-bold">
                        <span>Custo Total</span>
                        <span>{formatCurrency(folhaMensal * 1.28)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Tempo Médio de Empresa</span>
                        <span className="font-medium">2.3 anos</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Turnover Mensal</span>
                        <span className="font-medium">2.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maior Salário</span>
                        <span className="font-medium">{formatCurrency(5500)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Salário Médio</span>
                        <span className="font-medium">{formatCurrency(folhaMensal / totalFuncionarios)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>


    </div>
  )
}