'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'
import { 
  FileText, 
  Calendar, 
  Download, 
  MessageCircle, 
  Bell,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  User,
  LogOut,
  Settings,
  Eye,
  TrendingUp,
  Shield,
  Zap,
  Mail,
  Phone,
  Users
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const clienteData = {
  nome: 'Maria Silva Santos',
  empresa: 'MS Comércio de Roupas Ltda',
  cnpj: '12.345.678/0001-90',
  email: 'maria@mscomercio.com.br',
  telefone: '(11) 99999-0000',
  plano: 'Empresarial Pro',
  proximoVencimento: '2024-07-15'
}

const vencimentos = [
  {
    id: 1,
    titulo: 'DAS - Simples Nacional',
    vencimento: '2024-07-20',
    valor: 1250.00,
    status: 'pendente',
    diasRestantes: 2
  },
  {
    id: 2,
    titulo: 'FGTS',
    vencimento: '2024-07-07',
    valor: 890.50,
    status: 'pago',
    diasRestantes: -11
  },
  {
    id: 3,
    titulo: 'ISS',
    vencimento: '2024-07-25',
    valor: 450.00,
    status: 'pendente',
    diasRestantes: 7
  }
]

const documentos = [
  {
    id: 1,
    nome: 'DAS Junho 2024',
    tipo: 'Guia de Pagamento',
    data: '2024-06-15',
    tamanho: '245 KB',
    visualizado: true
  },
  {
    id: 2,
    nome: 'Balancete Maio 2024',
    tipo: 'Relatório Contábil',
    data: '2024-05-30',
    tamanho: '1.2 MB',
    visualizado: false
  },
  {
    id: 3,
    nome: 'Certidão Negativa',
    tipo: 'Documento Fiscal',
    data: '2024-06-10',
    tamanho: '180 KB',
    visualizado: true
  }
]

const atividades = [
  {
    id: 1,
    titulo: 'DAS enviado por WhatsApp',
    descricao: 'Guia de pagamento junho/2024',
    data: '2024-06-15 14:30',
    tipo: 'documento'
  },
  {
    id: 2,
    titulo: 'Alvará renovado',
    descricao: 'Processo de renovação concluído',
    data: '2024-06-12 09:15',
    tipo: 'sucesso'
  },
  {
    id: 3,
    titulo: 'Lembrete de vencimento',
    descricao: 'ISS vence em 7 dias',
    data: '2024-06-18 08:00',
    tipo: 'alerta'
  }
]

export default function ClientePage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [greeting, setGreeting] = useState('')

  console.log('Cliente area rendered for:', clienteData.nome)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-500'
      case 'pendente': return 'bg-yellow-500'
      case 'vencido': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleDownload = (docId: number) => {
    console.log('Download documento:', docId)
    // Simular download
    const documento = documentos.find(doc => doc.id === docId)
    if (documento) {
      const element = document.createElement('a')
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(`Documento: ${documento.nome}`)}`)
      element.setAttribute('download', `${documento.nome}.pdf`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      console.log('Download iniciado para:', documento.nome)
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Sou ${clienteData.nome} da ${clienteData.empresa}. Preciso de ajuda com minha contabilidade.`)
    window.open(`https://wa.me/5511999990000?text=${message}`, '_blank')
    console.log('WhatsApp opened for support')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/login" className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">AG Assessoria</h1>
                  <p className="text-xs text-muted-foreground">Portal do Cliente</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/cliente-avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {clienteData.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{clienteData.nome}</p>
                  <p className="text-xs text-muted-foreground">{clienteData.empresa}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  console.log('Client logout clicked')
                  if (confirm('Tem certeza que deseja sair?')) {
                    window.location.href = '/login'
                  }
                }}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                {greeting}, {clienteData.nome.split(' ')[0]}! 👋
              </h2>
              <p className="text-white/90 mb-6">
                Bem-vindo(a) à sua área exclusiva. Aqui você encontra tudo sobre sua contabilidade.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">Documentos em Dia</p>
                      <p className="text-white/80 text-sm">Tudo regularizado</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">Próximo Vencimento</p>
                      <p className="text-white/80 text-sm">Em 2 dias</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">Suporte 24/7</p>
                      <p className="text-white/80 text-sm">WhatsApp direto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">WhatsApp</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50"
            onClick={() => setActiveTab('documentos')}
          >
            <Download className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">Downloads</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50"
            onClick={() => setActiveTab('vencimentos')}
          >
            <Calendar className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium">Vencimentos</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50"
            onClick={() => setActiveTab('folha')}
          >
            <Users className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium">Folha</span>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-slate-800/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="vencimentos">Vencimentos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="folha">Folha</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                    Situação Fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Regular</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Todas as obrigações em dia
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                    Próximos Vencimentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold">2 dias</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    DAS - R$ 1.250,00
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Documentos Novos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">1 novo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Balancete disponível
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atividades.slice(0, 3).map((atividade) => (
                    <div key={atividade.id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className={`p-2 rounded-full ${
                        atividade.tipo === 'documento' ? 'bg-blue-100 text-blue-600' :
                        atividade.tipo === 'sucesso' ? 'bg-green-100 text-green-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {atividade.tipo === 'documento' && <FileText className="h-4 w-4" />}
                        {atividade.tipo === 'sucesso' && <CheckCircle className="h-4 w-4" />}
                        {atividade.tipo === 'alerta' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{atividade.titulo}</p>
                        <p className="text-xs text-muted-foreground">{atividade.descricao}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{atividade.data}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vencimentos" className="space-y-6">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
                <CardDescription>Acompanhe suas obrigações fiscais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vencimentos.map((vencimento) => (
                    <div key={vencimento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(vencimento.status)}`} />
                        <div>
                          <p className="font-medium">{vencimento.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {new Date(vencimento.vencimento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {vencimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <Badge variant={vencimento.status === 'pago' ? 'default' : 'destructive'}>
                          {vencimento.status === 'pago' ? 'Pago' : `${vencimento.diasRestantes} dias`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-6">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Documentos Disponíveis</CardTitle>
                <CardDescription>Baixe seus documentos contábeis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.map((documento) => (
                    <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{documento.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {documento.tipo} • {documento.tamanho} • {new Date(documento.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {!documento.visualizado && <Badge variant="secondary">Novo</Badge>}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(documento.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folha" className="space-y-6">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Folha de Pagamento
                </CardTitle>
                <CardDescription>Holerites e documentos trabalhistas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">Holerite Junho 2024</p>
                        <p className="text-sm text-muted-foreground">
                          Folha de Pagamento • 345 KB • 30/06/2024
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(99)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">Recibo de Férias</p>
                        <p className="text-sm text-muted-foreground">
                          Período: 01/07 a 30/07 • 180 KB • 15/06/2024
                        </p>
                      </div>
                      <Badge variant="default">Novo</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(98)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Users className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="font-medium">Informe de Rendimentos 2024</p>
                        <p className="text-sm text-muted-foreground">
                          Ano-base 2023 • 290 KB • 28/02/2024
                        </p>
                      </div>
                      <Badge variant="secondary">Visualizado</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(97)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium">13º Salário 2023</p>
                        <p className="text-sm text-muted-foreground">
                          Segunda parcela • 210 KB • 20/12/2023
                        </p>
                      </div>
                      <Badge variant="outline">Arquivado</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(96)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atividades" className="space-y-6">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
                <CardDescription>Todas as interações e atualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atividades.map((atividade) => (
                    <div key={atividade.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full mt-1 ${
                        atividade.tipo === 'documento' ? 'bg-blue-100 text-blue-600' :
                        atividade.tipo === 'sucesso' ? 'bg-green-100 text-green-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {atividade.tipo === 'documento' && <FileText className="h-4 w-4" />}
                        {atividade.tipo === 'sucesso' && <CheckCircle className="h-4 w-4" />}
                        {atividade.tipo === 'alerta' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{atividade.titulo}</p>
                        <p className="text-sm text-muted-foreground mb-2">{atividade.descricao}</p>
                        <span className="text-xs text-muted-foreground">{atividade.data}</span>
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
  )
}