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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { MigrationHelper } from '@/components/migration-helper'
import { ProductionHelper } from '@/components/production-helper'
import { 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Palette,
  Bell,
  Shield,
  Users,
  Database,
  Rocket,
  Smartphone,
  Globe,
  CreditCard,
  Save,
  Upload,
  Eye,
  EyeOff,
  Key,
  Zap,
  MessageCircle,
  FileText,
  Image,
  RefreshCw
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const configuracoes = {
  empresa: {
    razaoSocial: 'AG Assessoria Empresarial Ltda',
    nomeFantasia: 'AG Assessoria',
    cnpj: '12.345.678/0001-90',
    ie: '123.456.789.123',
    telefone: '(11) 3456-7890',
    whatsapp: '(11) 99999-0000',
    email: 'contato@agassessoriaonline.com.br',
    site: 'www.agassessoriaonline.com.br',
    endereco: 'Rua das Empresas, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567'
  },
  email: {
    servidor: 'smtp.gmail.com',
    porta: '587',
    usuario: 'sistema@agassessoriaonline.com.br',
    senha: '••••••••',
    ssl: true,
    assinatura: 'Atenciosamente,\nEquipe AG Assessoria\nwww.agassessoriaonline.com.br'
  },
  whatsapp: {
    api: 'Z-API',
    token: '••••••••••••••••',
    instancia: 'AG-ASSESSORIA-001',
    webhook: 'https://sistema.agassessoriaonline.com.br/webhook',
    mensagemPadrao: 'Olá! Obrigado por entrar em contato com a AG Assessoria.'
  },
  sistema: {
    nomeAplicacao: 'AG Assessoria - Sistema Contábil',
    versao: '1.0.0',
    manutencao: false,
    backupAutomatico: true,
    logAtividades: true,
    tema: 'system'
  },
  notificacoes: {
    emailVencimentos: true,
    whatsappVencimentos: true,
    alertasFinanceiros: true,
    relatoriosSemanais: true,
    diasAntecedencia: 15
  }
}

export default function ConfiguracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [config, setConfig] = useState(configuracoes)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  console.log('Configurações page rendered')

  const handleSave = async () => {
    console.log('💾 Salvando configurações:', config)
    
    try {
      const response = await fetch('/api/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Configurações salvas no banco:', result.message)
        alert('✅ Configurações salvas com sucesso!')
      } else {
        throw new Error(result.message || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error)
      // Fallback: salvar localmente
      localStorage.setItem('ag_configuracoes', JSON.stringify(config))
      alert('⚠️ Erro no servidor. Configurações salvas localmente!')
    }
  }

  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      setLogoFile(files[0])
      console.log('Logo uploaded:', files[0].name)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Configurações"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
              <p className="text-muted-foreground">Gerencie todas as configurações da sua aplicação</p>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>

          <Tabs defaultValue="empresa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="empresa">Empresa</TabsTrigger>
              <TabsTrigger value="email">E-mail</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="dominio">Domínio</TabsTrigger>
              <TabsTrigger value="sistema">Sistema</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="database">Banco de Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="empresa" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dados da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="razaoSocial">Razão Social</Label>
                      <Input
                        id="razaoSocial"
                        value={config.empresa.razaoSocial}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, razaoSocial: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                      <Input
                        id="nomeFantasia"
                        value={config.empresa.nomeFantasia}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, nomeFantasia: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={config.empresa.cnpj}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, cnpj: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ie">Inscrição Estadual</Label>
                      <Input
                        id="ie"
                        value={config.empresa.ie}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, ie: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={config.empresa.telefone}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, telefone: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={config.empresa.whatsapp}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, whatsapp: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={config.empresa.email}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, email: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site">Site</Label>
                      <Input
                        id="site"
                        value={config.empresa.site}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, site: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </h4>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                          id="endereco"
                          value={config.empresa.endereco}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            empresa: { ...prev.empresa, endereco: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={config.empresa.cep}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            empresa: { ...prev.empresa, cep: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          value={config.empresa.cidade}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            empresa: { ...prev.empresa, cidade: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={config.empresa.estado}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Logotipo
                    </h4>
                    
                    <div className="space-y-4">
                      <UploadZone
                        acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                        maxFiles={1}
                        onFilesUploaded={handleLogoUpload}
                      />
                      
                      {logoFile && (
                        <div className="flex items-center gap-2 p-2 border rounded-lg">
                          <Image className="h-4 w-4" />
                          <span className="text-sm">{logoFile.name}</span>
                          <Button variant="outline" size="sm" className="ml-auto">
                            Visualizar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Configurações de E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="servidor">Servidor SMTP</Label>
                      <Input
                        id="servidor"
                        value={config.email.servidor}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="porta">Porta</Label>
                      <Input
                        id="porta"
                        value={config.email.porta}
                        placeholder="587"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="usuario">Usuário</Label>
                      <Input
                        id="usuario"
                        type="email"
                        value={config.email.usuario}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          type={showPassword ? "text" : "password"}
                          value={config.email.senha}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ssl"
                      checked={config.email.ssl}
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, ssl: checked }
                      }))}
                    />
                    <Label htmlFor="ssl">Usar SSL/TLS</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assinatura">Assinatura de E-mail</Label>
                    <Textarea
                      id="assinatura"
                      value={config.email.assinatura}
                      rows={4}
                      placeholder="Digite sua assinatura de e-mail..."
                    />
                  </div>

                  <Button variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Configurações do WhatsApp Business
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code Connection */}
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-green-800">Conectar WhatsApp via QR Code</h4>
                        <p className="text-sm text-green-600">Escaneie o QR Code com seu WhatsApp Business</p>
                      </div>
                      <Button 
                        onClick={() => alert('QR Code gerado! Escaneie com seu WhatsApp Business')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Gerar QR Code
                      </Button>
                    </div>
                    
                    {/* QR Code Placeholder */}
                    <div className="flex justify-center p-8 bg-white border-2 border-dashed border-green-300 rounded-lg">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                          <div className="text-gray-500">
                            <Smartphone className="h-16 w-16 mx-auto mb-2" />
                            <p className="text-sm">QR Code aparecerá aqui</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          1. Clique em "Gerar QR Code"<br/>
                          2. Abra WhatsApp Business no celular<br/>
                          3. Vá em Menu → Dispositivos conectados<br/>
                          4. Escaneie o código acima
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-600">Desconectado</span>
                        <Button variant="outline" size="sm" className="ml-4">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reconectar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="api">Provedor de API</Label>
                      <Select value={config.whatsapp.api} onValueChange={(value) => setConfig(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, api: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Z-API">Z-API</SelectItem>
                          <SelectItem value="Twilio">Twilio</SelectItem>
                          <SelectItem value="ChatAPI">ChatAPI</SelectItem>
                          <SelectItem value="Evolution API">Evolution API</SelectItem>
                          <SelectItem value="Venom Bot">Venom Bot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instancia">ID da Instância</Label>
                      <Input
                        id="instancia"
                        value={config.whatsapp.instancia}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, instancia: e.target.value }
                        }))}
                        placeholder="AG-ASSESSORIA-001"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="token">Token de API</Label>
                      <div className="relative">
                        <Input
                          id="token"
                          type={showPassword ? "text" : "password"}
                          value={config.whatsapp.token}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, token: e.target.value }
                          }))}
                          placeholder="Cole seu token de API aqui"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="webhook">URL do Webhook</Label>
                      <Input
                        id="webhook"
                        value={config.whatsapp.webhook}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, webhook: e.target.value }
                        }))}
                        placeholder="https://seu-sistema.com/webhook"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagemPadrao">Mensagem de Boas-vindas</Label>
                    <Textarea
                      id="mensagemPadrao"
                      value={config.whatsapp.mensagemPadrao}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, mensagemPadrao: e.target.value }
                      }))}
                      rows={3}
                      placeholder="Olá! Obrigado por entrar em contato com a AG Assessoria..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => alert('Testando conexão... ✅ WhatsApp conectado!')}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => alert('Mensagem de teste enviada!')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Teste
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sistema" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nomeApp">Nome da Aplicação</Label>
                      <Input
                        id="nomeApp"
                        value={config.sistema.nomeAplicacao}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="versao">Versão</Label>
                      <Input
                        id="versao"
                        value={config.sistema.versao}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tema">Tema Padrão</Label>
                      <Select value={config.sistema.tema}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Sistema</SelectItem>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Configurações Avançadas</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Modo de Manutenção</Label>
                          <p className="text-sm text-muted-foreground">
                            Bloqueia o acesso ao sistema para manutenção
                          </p>
                        </div>
                        <Switch
                          checked={config.sistema.manutencao}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            sistema: { ...prev.sistema, manutencao: checked }
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Backup Automático</Label>
                          <p className="text-sm text-muted-foreground">
                            Realiza backup diário dos dados
                          </p>
                        </div>
                        <Switch
                          checked={config.sistema.backupAutomatico}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            sistema: { ...prev.sistema, backupAutomatico: checked }
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Log de Atividades</Label>
                          <p className="text-sm text-muted-foreground">
                            Registra todas as ações dos usuários
                          </p>
                        </div>
                        <Switch
                          checked={config.sistema.logAtividades}
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            sistema: { ...prev.sistema, logAtividades: checked }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Configurações de Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>E-mail de Vencimentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar alertas de vencimento por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={config.notificacoes.emailVencimentos}
                        onCheckedChange={(checked) => setConfig(prev => ({
                          ...prev,
                          notificacoes: { ...prev.notificacoes, emailVencimentos: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>WhatsApp de Vencimentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar alertas de vencimento via WhatsApp
                        </p>
                      </div>
                      <Switch
                        checked={config.notificacoes.whatsappVencimentos}
                        onCheckedChange={(checked) => setConfig(prev => ({
                          ...prev,
                          notificacoes: { ...prev.notificacoes, whatsappVencimentos: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Alertas Financeiros</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificações sobre pagamentos e inadimplência
                        </p>
                      </div>
                      <Switch
                        checked={config.notificacoes.alertasFinanceiros}
                        onCheckedChange={(checked) => setConfig(prev => ({
                          ...prev,
                          notificacoes: { ...prev.notificacoes, alertasFinanceiros: checked }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Relatórios Semanais</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar resumo semanal por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={config.notificacoes.relatoriosSemanais}
                        onCheckedChange={(checked) => setConfig(prev => ({
                          ...prev,
                          notificacoes: { ...prev.notificacoes, relatoriosSemanais: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="diasAntecedencia">Dias de Antecedência</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="diasAntecedencia"
                        type="number"
                        value={config.notificacoes.diasAntecedencia}
                        className="w-20"
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          notificacoes: { ...prev.notificacoes, diasAntecedencia: parseInt(e.target.value) }
                        }))}
                      />
                      <span className="text-sm text-muted-foreground">
                        dias antes do vencimento
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dominio" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Integração com Domínio Sistemas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Domínio Sistemas API</h4>
                        <p className="text-sm text-blue-600">Conecte-se com o sistema Domínio para sincronização automática</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Conectado</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sincronizar Agora
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dominioUrl">URL da API Domínio</Label>
                      <Input
                        id="dominioUrl"
                        value="https://api.dominiosistemas.com.br"
                        placeholder="https://api.dominiosistemas.com.br"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dominioEmpresa">Código da Empresa</Label>
                      <Input
                        id="dominioEmpresa"
                        value="AG001"
                        placeholder="Código da empresa no Domínio"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dominioUsuario">Usuário API</Label>
                      <Input
                        id="dominioUsuario"
                        value="api_user"
                        placeholder="Usuário para API"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dominioSenha">Senha API</Label>
                      <div className="relative">
                        <Input
                          id="dominioSenha"
                          type={showPassword ? "text" : "password"}
                          value="••••••••"
                          placeholder="Senha da API"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Configurações de Sincronização</h4>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label>Sincronizar Clientes</Label>
                          <p className="text-xs text-muted-foreground">Importar dados de clientes do Domínio</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label>Sincronizar Impostos</Label>
                          <p className="text-xs text-muted-foreground">Buscar impostos e guias</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label>Sincronizar Honorários</Label>
                          <p className="text-xs text-muted-foreground">Atualizar valores de honorários</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label>Sincronização Automática</Label>
                          <p className="text-xs text-muted-foreground">Sincronizar a cada 1 hora</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Última Sincronização</Label>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">19/06/2024 às 10:30</p>
                          <p className="text-xs text-muted-foreground">
                            ✅ 45 clientes • ✅ 234 impostos • ✅ 12 honorários sincronizados
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Log
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => alert('Testando conexão... ✅ Domínio API conectada!')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </Button>
                    <Button 
                      onClick={() => alert('Sincronização iniciada em segundo plano!')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Segurança e Privacidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Key className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Chave de Criptografia</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chave para criptografia de dados sensíveis
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Gerar Nova Chave
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Backup
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Database className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Backup de Dados</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Último backup: Hoje às 03:00
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Criar Backup Agora
                        </Button>
                        <Button variant="outline" size="sm">
                          Restaurar Backup
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Sessões Ativas</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        3 usuários conectados atualmente
                      </p>
                      <Button variant="outline" size="sm">
                        Ver Sessões Ativas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Gerenciamento do Banco de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MigrationHelper />
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