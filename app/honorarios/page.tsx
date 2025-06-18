'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { ClientSelector } from '@/components/client-selector'
import { UploadZone } from '@/components/upload-zone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  Send,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Cloud,
  Zap,
  Settings,
  Wifi,
  WifiOff,
  Check,
  X
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Simulação de dados iniciais (podem vir do sistema Domínio)
const honorariosBase = [
  {
    id: '1',
    cliente: 'ABC Comércio Ltda',
    valor: 2500,
    mesReferencia: 'Março/2024',
    dataVencimento: '10/04/2024',
    status: 'Enviado',
    visualizado: true,
    dataPagamento: null,
    observacoes: 'Boleto enviado via WhatsApp',
    sincronizadoDominio: true,
    dominioId: 'DOM_001'
  },
  {
    id: '2',
    cliente: 'XYZ Indústria',
    valor: 4200,
    mesReferencia: 'Março/2024',
    dataVencimento: '15/04/2024',
    status: 'Pago',
    visualizado: true,
    dataPagamento: '14/04/2024',
    observacoes: 'Pagamento via PIX',
    sincronizadoDominio: true,
    dominioId: 'DOM_002'
  },
  {
    id: '3',
    cliente: 'DEF Serviços',
    valor: 1800,
    mesReferencia: 'Março/2024',
    dataVencimento: '05/04/2024',
    status: 'Vencido',
    visualizado: false,
    dataPagamento: null,
    observacoes: 'Cliente não visualizou',
    sincronizadoDominio: false,
    dominioId: null
  }
]

function getStatusBadge(status: string) {
  const statusConfig = {
    'Pago': { color: 'ag-status-completed', icon: <CheckCircle className="h-3 w-3" /> },
    'Enviado': { color: 'ag-status-pending', icon: <Send className="h-3 w-3" /> },
    'Pendente': { color: 'ag-status-pending', icon: <Clock className="h-3 w-3" /> },
    'Vencido': { color: 'ag-status-overdue', icon: <AlertTriangle className="h-3 w-3" /> }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pendente']
  
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

export default function HonorariosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [honorarios, setHonorarios] = useState(honorariosBase)
  
  // Estados para integração Domínio
  const [dominioConnected, setDominioConnected] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [lastSync, setLastSync] = useState(new Date())
  const [syncing, setSyncing] = useState(false)
  const [dominioConfig, setDominioConfig] = useState({
    apiUrl: 'https://api.dominiosistemas.com.br',
    token: '••••••••••••••••',
    ultimaAtualizacao: '18/06/2025 10:30:00'
  })

  console.log('Honorários page rendered with Domínio integration')

  // Simulação de sincronização automática
  useEffect(() => {
    if (autoSync && dominioConnected) {
      const interval = setInterval(() => {
        handleSyncDominio(false) // sync silencioso
      }, 300000) // 5 minutos

      return () => clearInterval(interval)
    }
  }, [autoSync, dominioConnected])

  const handleSyncDominio = async (manual = true) => {
    if (manual) setSyncing(true)
    
    try {
      console.log('Sincronizando com sistema Domínio...')
      
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular dados atualizados do Domínio
      const novosHonorarios = [
        ...honorarios,
        {
          id: `DOM_${Date.now()}`,
          cliente: 'Novo Cliente Domínio',
          valor: 3200,
          mesReferencia: 'Junho/2025',
          dataVencimento: '20/07/2025',
          status: 'Pendente',
          visualizado: false,
          dataPagamento: null,
          observacoes: 'Importado do sistema Domínio',
          sincronizadoDominio: true,
          dominioId: `DOM_${Date.now()}`
        }
      ]
      
      setHonorarios(novosHonorarios)
      setLastSync(new Date())
      setDominioConfig(prev => ({
        ...prev,
        ultimaAtualizacao: new Date().toLocaleString('pt-BR')
      }))
      
      if (manual) {
        alert('Sincronização concluída! Novos honorários importados do sistema Domínio.')
      }
      
    } catch (error) {
      console.error('Erro na sincronização:', error)
      if (manual) {
        alert('Erro na sincronização. Verifique a conexão com o sistema Domínio.')
      }
    } finally {
      if (manual) setSyncing(false)
    }
  }

  const handleEnviarParaDominio = async (honorarioId: string) => {
    try {
      console.log('Enviando honorário para sistema Domínio:', honorarioId)
      
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setHonorarios(prev => prev.map(h => 
        h.id === honorarioId 
          ? { ...h, sincronizadoDominio: true, dominioId: `DOM_${Date.now()}` }
          : h
      ))
      
      alert('Honorário enviado com sucesso para o sistema Domínio!')
      
    } catch (error) {
      console.error('Erro ao enviar para Domínio:', error)
      alert('Erro ao enviar para o sistema Domínio.')
    }
  }

  const totalHonorarios = honorarios.reduce((sum, h) => sum + h.valor, 0)
  const pagos = honorarios.filter(h => h.status === 'Pago')
  const totalPago = pagos.reduce((sum, h) => sum + h.valor, 0)
  const pendentes = honorarios.filter(h => h.status !== 'Pago')
  const totalPendente = pendentes.reduce((sum, h) => sum + h.valor, 0)
  const vencidos = honorarios.filter(h => h.status === 'Vencido')
  const sincronizados = honorarios.filter(h => h.sincronizadoDominio)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Honorários - Integração Domínio"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status de Conexão Domínio */}
          <Alert className={`${dominioConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center space-x-2">
              {dominioConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
              <AlertDescription className={dominioConnected ? 'text-green-800' : 'text-red-800'}>
                <strong>Sistema Domínio:</strong> {dominioConnected ? 'Conectado' : 'Desconectado'} • 
                Última sincronização: {lastSync.toLocaleString('pt-BR')} • 
                {sincronizados.length}/{honorarios.length} sincronizados
              </AlertDescription>
            </div>
          </Alert>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalHonorarios)}</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recebido</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</div>
                <p className="text-xs text-muted-foreground">{pagos.length} clientes</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Receber</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</div>
                <p className="text-xs text-muted-foreground">{pendentes.length} pendentes</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{vencidos.length}</div>
                <p className="text-xs text-muted-foreground">Requer ação</p>
              </CardContent>
            </Card>

            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Domínio Sync</CardTitle>
                <Cloud className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{sincronizados.length}</div>
                <p className="text-xs text-muted-foreground">Sincronizados</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="listagem" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listagem">Listagem</TabsTrigger>
              <TabsTrigger value="enviar">Enviar Honorários</TabsTrigger>
              <TabsTrigger value="dominio">Config. Domínio</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="listagem" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Honorários do Mês</span>
                    <Button 
                      onClick={() => handleSyncDominio(true)} 
                      disabled={syncing || !dominioConnected}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                      {syncing ? 'Sincronizando...' : 'Sync Domínio'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Mês Ref.</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Domínio</TableHead>
                        <TableHead>Visualizado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {honorarios.map((honorario) => (
                        <TableRow key={honorario.id}>
                          <TableCell className="font-medium">{honorario.cliente}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(honorario.valor)}</TableCell>
                          <TableCell>{honorario.mesReferencia}</TableCell>
                          <TableCell>{honorario.dataVencimento}</TableCell>
                          <TableCell>{getStatusBadge(honorario.status)}</TableCell>
                          <TableCell>
                            {honorario.sincronizadoDominio ? (
                              <Badge variant="outline" className="ag-status-completed">
                                <Check className="h-3 w-3 mr-1" />
                                Sync
                              </Badge>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="ag-status-pending">
                                  <X className="h-3 w-3 mr-1" />
                                  Pendente
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEnviarParaDominio(honorario.id)}
                                  disabled={!dominioConnected}
                                >
                                  <Cloud className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {honorario.visualizado ? (
                              <Badge variant="outline" className="ag-status-completed">
                                <Eye className="h-3 w-3 mr-1" />
                                Sim
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ag-status-pending">
                                Não
                              </Badge>
                            )}
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

            <TabsContent value="enviar" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle>Enviar Honorários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cliente</label>
                      <ClientSelector 
                        value={selectedClient}
                        onValueChange={setSelectedClient}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mês de Referência</label>
                      <Input type="month" defaultValue="2025-06" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload de Boletos/PDFs</label>
                    <UploadZone 
                      acceptedFileTypes={['application/pdf']}
                      maxFiles={50}
                      onFilesUploaded={(files) => {
                        console.log('Files uploaded for honorários:', files.length)
                      }}
                    />
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Os honorários enviados serão automaticamente sincronizados com o sistema Domínio quando a integração estiver ativa.
                    </AlertDescription>
                  </Alert>

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
            </TabsContent>

            <TabsContent value="dominio" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurações da API
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dominio-url">URL da API Domínio</Label>
                      <Input 
                        id="dominio-url"
                        value={dominioConfig.apiUrl}
                        onChange={(e) => setDominioConfig(prev => ({
                          ...prev,
                          apiUrl: e.target.value
                        }))}
                        placeholder="https://api.dominiosistemas.com.br"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dominio-token">Token de Acesso</Label>
                      <Input 
                        id="dominio-token"
                        type="password"
                        value={dominioConfig.token}
                        onChange={(e) => setDominioConfig(prev => ({
                          ...prev,
                          token: e.target.value
                        }))}
                        placeholder="Seu token de acesso"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="auto-sync"
                        checked={autoSync}
                        onCheckedChange={setAutoSync}
                      />
                      <Label htmlFor="auto-sync">Sincronização Automática (5 min)</Label>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => {
                          setDominioConnected(!dominioConnected)
                          alert(dominioConnected ? 'Desconectado do sistema Domínio' : 'Conectado ao sistema Domínio!')
                        }}
                        className={dominioConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        variant={dominioConnected ? 'destructive' : 'default'}
                      >
                        {dominioConnected ? (
                          <>
                            <WifiOff className="h-4 w-4 mr-2" />
                            Desconectar
                          </>
                        ) : (
                          <>
                            <Wifi className="h-4 w-4 mr-2" />
                            Conectar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Status da Integração
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Status da Conexão</span>
                        <Badge variant={dominioConnected ? 'default' : 'destructive'}>
                          {dominioConnected ? 'Conectado' : 'Desconectado'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Última Atualização</span>
                        <span className="text-sm text-muted-foreground">
                          {dominioConfig.ultimaAtualizacao}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Honorários Sincronizados</span>
                        <span className="font-medium">
                          {sincronizados.length}/{honorarios.length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Sincronização Automática</span>
                        <Badge variant={autoSync ? 'default' : 'secondary'}>
                          {autoSync ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleSyncDominio(true)}
                        disabled={syncing || !dominioConnected}
                        className="w-full"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Faturamento Mensal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Janeiro</span>
                        <span className="font-medium">R$ 28.500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fevereiro</span>
                        <span className="font-medium">R$ 31.200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Março</span>
                        <span className="font-medium">R$ 35.800</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Abril</span>
                        <span className="font-medium">R$ 29.600</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maio</span>
                        <span className="font-medium">R$ 33.200</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-4">
                        <span>Junho (atual)</span>
                        <span className="font-bold text-primary">{formatCurrency(totalHonorarios)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Domínio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Taxa de Pagamento</span>
                        <span className="font-medium text-green-600">
                          {Math.round((pagos.length / honorarios.length) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tempo Médio Pagamento</span>
                        <span className="font-medium">12 dias</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Taxa de Sincronização</span>
                        <span className="font-medium text-blue-600">
                          {Math.round((sincronizados.length / honorarios.length) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cliente com Maior Valor</span>
                        <span className="font-medium">XYZ Indústria</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Última Sincronização</span>
                        <span className="font-medium text-blue-600">
                          {Math.round((Date.now() - lastSync.getTime()) / 60000)} min atrás
                        </span>
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