'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ClientLayout } from '@/components/client-layout'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { 
  FileText, 
  Send, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Eye,
  MessageCircle,
  Mail,
  Search,
  Filter,
  Plus,
  Upload,
  Zap,
  Building,
  TrendingUp
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const clientes = [
  { id: 1, nome: 'ABC Comércio Ltda', cnpj: '12.345.678/0001-90', regime: 'Simples Nacional' },
  { id: 2, nome: 'XYZ Indústria SA', cnpj: '98.765.432/0001-10', regime: 'Lucro Real' },
  { id: 3, nome: 'MS Serviços ME', cnpj: '11.222.333/0001-44', regime: 'Simples Nacional' },
]

const declaracoes = [
  {
    id: 1,
    cliente: 'ABC Comércio Ltda',
    tipo: 'Faturamento Mensal',
    referencia: 'Junho/2024',
    valor: 15000.00,
    status: 'enviado',
    dataEnvio: '2024-06-28',
    canal: 'whatsapp',
    visualizado: true
  },
  {
    id: 2,
    cliente: 'XYZ Indústria SA',
    tipo: 'Apuração IRPJ',
    referencia: 'Junho/2024',
    valor: 45000.00,
    status: 'pendente',
    dataEnvio: null,
    canal: null,
    visualizado: false
  },
  {
    id: 3,
    cliente: 'MS Serviços ME',
    tipo: 'DAS Simples Nacional',
    referencia: 'Junho/2024',
    valor: 2500.00,
    status: 'gerado',
    dataEnvio: '2024-06-30',
    canal: 'email',
    visualizado: false
  }
]

export default function ImpostosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedCliente, setSelectedCliente] = useState('')
  const [novaDeclaracao, setNovaDeclaracao] = useState({
    cliente: '',
    tipo: '',
    referencia: '',
    envioAutomatico: true,
    canal: 'whatsapp'
  })

  console.log('Impostos page rendered')

  const handleGerarDeclaracao = () => {
    console.log('Gerando declaração:', novaDeclaracao)
    
    // Simular integração com Domínio Sistemas
    const declaracaoData = {
      ...novaDeclaracao,
      id: Date.now(),
      status: 'processando',
      dataGeracao: new Date().toISOString().split('T')[0]
    }
    
    alert(`Declaração sendo gerada via Domínio Sistemas:\n\nCliente: ${novaDeclaracao.cliente}\nTipo: ${novaDeclaracao.tipo}\nReferência: ${novaDeclaracao.referencia}`)
  }

  const handleEnviarDeclaracao = (declaracaoId: number) => {
    console.log('Enviando declaração:', declaracaoId)
    
    const declaracao = declaracoes.find(d => d.id === declaracaoId)
    if (declaracao) {
      const canal = declaracao.canal || 'whatsapp'
      alert(`Declaração enviada via ${canal.toUpperCase()}:\n\n${declaracao.tipo} - ${declaracao.referencia}\nCliente: ${declaracao.cliente}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado': return 'bg-green-500'
      case 'gerado': return 'bg-blue-500'
      case 'pendente': return 'bg-yellow-500'
      case 'processando': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enviado': return 'Enviado'
      case 'gerado': return 'Gerado'
      case 'pendente': return 'Pendente'
      case 'processando': return 'Processando'
      default: return 'Indefinido'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Impostos" userName="Admin" userRole="Administrador" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Módulo de Impostos</h1>
                <p className="text-muted-foreground">Integração com Domínio Sistemas</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Domínio API Conectada
                </Badge>
                <Button onClick={() => setActiveTab('nova')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Declaração
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Declarações este mês</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Send className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-sm text-muted-foreground">Enviadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-sm text-muted-foreground">Taxa de sucesso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="declaracoes">Declarações</TabsTrigger>
              <TabsTrigger value="nova">Nova Declaração</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Declarações Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Declarações Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {declaracoes.slice(0, 3).map((declaracao) => (
                        <div key={declaracao.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(declaracao.status)}`} />
                            <div>
                              <p className="font-medium text-sm">{declaracao.cliente}</p>
                              <p className="text-xs text-muted-foreground">{declaracao.tipo} - {declaracao.referencia}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {getStatusText(declaracao.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ações Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-16 flex-col">
                        <Upload className="h-5 w-5 mb-1" />
                        <span className="text-xs">Upload Lote</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <Download className="h-5 w-5 mb-1" />
                        <span className="text-xs">Baixar Guias</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <MessageCircle className="h-5 w-5 mb-1" />
                        <span className="text-xs">Envio WhatsApp</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <Mail className="h-5 w-5 mb-1" />
                        <span className="text-xs">Envio E-mail</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="declaracoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Declarações Geradas</CardTitle>
                  <CardDescription>Controle de declarações via Domínio Sistemas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {declaracoes.map((declaracao) => (
                      <div key={declaracao.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(declaracao.status)}`} />
                          <div>
                            <p className="font-medium">{declaracao.cliente}</p>
                            <p className="text-sm text-muted-foreground">
                              {declaracao.tipo} - {declaracao.referencia}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Valor: R$ {declaracao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {declaracao.canal && (
                            <Badge variant="outline">
                              {declaracao.canal === 'whatsapp' ? (
                                <MessageCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Mail className="h-3 w-3 mr-1" />
                              )}
                              {declaracao.canal}
                            </Badge>
                          )}
                          
                          <Badge className={getStatusColor(declaracao.status)}>
                            {getStatusText(declaracao.status)}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEnviarDeclaracao(declaracao.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nova" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Nova Declaração - Integração Domínio
                  </CardTitle>
                  <CardDescription>
                    Gere declarações diretamente via API do Domínio Sistemas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cliente">Cliente</Label>
                        <Select value={novaDeclaracao.cliente} onValueChange={(value) => 
                          setNovaDeclaracao(prev => ({...prev, cliente: value}))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientes.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.nome}>
                                {cliente.nome} - {cliente.cnpj}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="tipo">Tipo de Declaração</Label>
                        <Select value={novaDeclaracao.tipo} onValueChange={(value) => 
                          setNovaDeclaracao(prev => ({...prev, tipo: value}))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="faturamento">Faturamento Mensal</SelectItem>
                            <SelectItem value="das">DAS - Simples Nacional</SelectItem>
                            <SelectItem value="irpj">Apuração IRPJ</SelectItem>
                            <SelectItem value="iss">ISS Municipal</SelectItem>
                            <SelectItem value="icms">ICMS Estadual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="referencia">Período de Referência</Label>
                        <Input
                          placeholder="Ex: Junho/2024"
                          value={novaDeclaracao.referencia}
                          onChange={(e) => setNovaDeclaracao(prev => ({...prev, referencia: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="envio-automatico">Envio Automático</Label>
                        <Switch
                          checked={novaDeclaracao.envioAutomatico}
                          onCheckedChange={(checked) => 
                            setNovaDeclaracao(prev => ({...prev, envioAutomatico: checked}))
                          }
                        />
                      </div>

                      {novaDeclaracao.envioAutomatico && (
                        <div>
                          <Label htmlFor="canal">Canal de Envio</Label>
                          <Select value={novaDeclaracao.canal} onValueChange={(value) => 
                            setNovaDeclaracao(prev => ({...prev, canal: value}))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="whatsapp">
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  WhatsApp
                                </div>
                              </SelectItem>
                              <SelectItem value="email">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" />
                                  E-mail
                                </div>
                              </SelectItem>
                              <SelectItem value="ambos">Ambos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Alert>
                        <Zap className="h-4 w-4" />
                        <AlertDescription>
                          A declaração será gerada automaticamente via integração com o Domínio Sistemas.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Salvar Rascunho
                    </Button>
                    <Button onClick={handleGerarDeclaracao}>
                      <Zap className="h-4 w-4 mr-2" />
                      Gerar via Domínio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Envios</CardTitle>
                  <CardDescription>Controle completo de envios e visualizações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {declaracoes.filter(d => d.status === 'enviado').map((declaracao) => (
                      <div key={declaracao.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{declaracao.cliente}</p>
                              <p className="text-sm text-muted-foreground">{declaracao.tipo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Enviado em {declaracao.dataEnvio}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {declaracao.canal === 'whatsapp' && (
                                <Badge variant="outline" className="text-green-700">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  WhatsApp
                                </Badge>
                              )}
                              {declaracao.visualizado && (
                                <Badge variant="secondary">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Visualizado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <WhatsAppFloatButton />
    </div>
  )
}