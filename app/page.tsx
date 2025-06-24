'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { DashboardStats } from '@/components/dashboard-stats'
import { RecentActivities } from '@/components/recent-activities'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  Users, 
  MessageCircle, 
  Upload, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Shield,
  Receipt,
  Building
} from 'lucide-react'

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  console.log('Home page rendered, sidebar collapsed:', sidebarCollapsed)

  // Verificar autenticação
  useEffect(() => {
    const user = localStorage.getItem('auth_user')
    if (!user) {
      console.log('User not authenticated, redirecting to auth')
      router.push('/auth')
    } else {
      console.log('User authenticated:', JSON.parse(user))
      setIsAuthenticated(true)
    }
  }, [])

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action)
    
    switch (action) {
      case 'documentos':
        window.location.href = '/documentos'
        break
      case 'obrigacoes':
        window.location.href = '/obrigacoes'
        break
      case 'relatorio':
        alert('Relatório será gerado em breve!')
        break
      case 'usuarios':
        window.location.href = '/configuracoes'
        break
      case 'whatsapp':
        window.location.href = '/whatsapp'
        break
      case 'impostos':
        window.location.href = '/impostos'
        break
      default:
        console.log('Action not implemented:', action)
    }
  }

  const quickAccessModules = [
    {
      name: 'Obrigações',
      icon: Calendar,
      href: '/obrigacoes',
      description: 'Ver vencimentos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      name: 'Documentos',
      icon: FileText,
      href: '/documentos',
      description: 'Gestão docs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'Parcelamentos',
      icon: CreditCard,
      href: '/parcelamentos',
      description: 'Controle parcelas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      name: 'Impostos',
      icon: Receipt,
      href: '/impostos',
      description: 'Domínio API',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      name: 'Folha',
      icon: Users,
      href: '/folha',
      description: 'Holerites',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: '/whatsapp',
      description: 'Atendimento',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    }
  ]

  // Mostrar loading enquanto verifica autenticação
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          title="Dashboard"
          userName="João Silva"
          userRole="Administrador"
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Sistema AG Assessoria! 👋</h1>
              <p className="text-white/90 mb-6">
                Gerencie toda a contabilidade dos seus clientes de forma simples e eficiente.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">45 Clientes</p>
                      <p className="text-white/80 text-sm">Ativos no sistema</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">92% Conformidade</p>
                      <p className="text-white/80 text-sm">Obrigações em dia</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">24/7 Suporte</p>
                      <p className="text-white/80 text-sm">WhatsApp integrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats - Compacto */}
          <DashboardStats />

          {/* Quick Access Modules - NOVO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Acesso Rápido aos Módulos
              </CardTitle>
              <CardDescription>
                Clique nos ícones para acessar diretamente cada funcionalidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickAccessModules.map((module) => (
                  <Link key={module.name} href={module.href}>
                    <div className={`p-4 rounded-xl ${module.bgColor} transition-all duration-200 hover:scale-105 cursor-pointer border border-transparent hover:border-gray-200`}>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <module.icon className={`h-8 w-8 ${module.color}`} />
                        <div>
                          <p className="font-medium text-sm">{module.name}</p>
                          <p className="text-xs text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Melhoradas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                    onClick={() => handleQuickAction('documentos')}
                  >
                    <Upload className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Upload Docs</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2 bg-orange-50 hover:bg-orange-100 border-orange-200"
                    onClick={() => handleQuickAction('obrigacoes')}
                  >
                    <Calendar className="h-6 w-6 text-orange-600" />
                    <span className="text-sm font-medium">Ver Obrigações</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2 bg-green-50 hover:bg-green-100 border-green-200"
                    onClick={() => handleQuickAction('whatsapp')}
                  >
                    <MessageCircle className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col space-y-2 bg-purple-50 hover:bg-purple-100 border-purple-200"
                    onClick={() => handleQuickAction('impostos')}
                  >
                    <Receipt className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Impostos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status - Compacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Servidor</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Domínio API</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Conectado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WhatsApp</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Ativo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Atualizado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <RecentActivities />
        </main>
      </div>


    </div>
  )
}