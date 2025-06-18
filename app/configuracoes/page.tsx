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
  Image
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

  const handleSave = () => {
    console.log('Configurações salvas:', config)
    // Aqui implementaria a lógica de salvamento
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="empresa">Empresa</TabsTrigger>
              <TabsTrigger value="email">E-mail</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="sistema">Sistema</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
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
                    Configurações do WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="api">Provedor de API</Label>
                      <Select value={config.whatsapp.api}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Z-API">Z-API</SelectItem>
                          <SelectItem value="Twilio">Twilio</SelectItem>
                          <SelectItem value="ChatAPI">ChatAPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instancia">ID da Instância</Label>
                      <Input
                        id="instancia"
                        value={config.whatsapp.instancia}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="token">Token de API</Label>
                      <div className="relative">
                        <Input
                          id="token"
                          type={showPassword ? "text" : "password"}
                          value={config.whatsapp.token}
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
                        placeholder="https://seu-sistema.com/webhook"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagemPadrao">Mensagem de Boas-vindas</Label>
                    <Textarea
                      id="mensagemPadrao"
                      value={config.whatsapp.mensagemPadrao}
                      rows={3}
                      placeholder="Mensagem automática de resposta..."
                    />
                  </div>

                  <Button variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Testar Conexão WhatsApp
                  </Button>
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
          </Tabs>
        </main>
      </div>


    </div>
  )
}