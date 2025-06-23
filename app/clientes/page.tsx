'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Building,
  Briefcase,
  Tractor,
  Store,
  UserCheck,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  History,
  Bell,
  Calendar,
  CreditCard,
  FileBarChart,
  Users,
  Star,
  Eye,
  Copy,
  Archive,
  RefreshCw,
  Settings,
  Zap,
  TrendingUp,
  Activity,
  Target,
  MessageCircle
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Tipos de empresa com configurações específicas
const tiposEmpresa = [
  { 
    value: 'simples', 
    label: 'Simples Nacional', 
    icon: <Store className="h-4 w-4" />, 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    campos: ['razaoSocial', 'nomeFantasia', 'cnpj', 'ie', 'email', 'telefone', 'whatsapp', 'endereco']
  },
  { 
    value: 'presumido', 
    label: 'Lucro Presumido', 
    icon: <Building className="h-4 w-4" />, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    campos: ['razaoSocial', 'nomeFantasia', 'cnpj', 'ie', 'email', 'telefone', 'whatsapp', 'endereco', 'contadorResponsavel']
  },
  { 
    value: 'mei', 
    label: 'MEI', 
    icon: <User className="h-4 w-4" />, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    campos: ['razaoSocial', 'nomeFantasia', 'cnpj', 'email', 'telefone', 'whatsapp', 'endereco', 'atividade']
  },
  { 
    value: 'produtor-rural', 
    label: 'Produtor Rural', 
    icon: <Tractor className="h-4 w-4" />, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    campos: ['razaoSocial', 'nomeFantasia', 'cnpj', 'ie', 'email', 'telefone', 'whatsapp', 'endereco', 'nirf', 'atividades']
  },
  { 
    value: 'real', 
    label: 'Lucro Real', 
    icon: <Briefcase className="h-4 w-4" />, 
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    campos: ['razaoSocial', 'nomeFantasia', 'cnpj', 'ie', 'email', 'telefone', 'whatsapp', 'endereco', 'contadorResponsavel', 'auditor']
  }
]

// Grupos de clientes
const gruposClientes = [
  { value: 'premium', label: 'Premium', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { value: 'standard', label: 'Standard', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'basico', label: 'Básico', color: 'text-gray-600', bg: 'bg-gray-50' },
  { value: 'vip', label: 'VIP', color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: 'novo', label: 'Novo Cliente', color: 'text-green-600', bg: 'bg-green-50' }
]

// Status do cliente
const statusClientes = [
  { value: 'ativo', label: 'Ativo', color: 'text-green-600', icon: <CheckCircle className="h-3 w-3" /> },
  { value: 'inativo', label: 'Inativo', color: 'text-gray-600', icon: <Clock className="h-3 w-3" /> },
  { value: 'suspenso', label: 'Suspenso', color: 'text-red-600', icon: <AlertTriangle className="h-3 w-3" /> },
  { value: 'pendente', label: 'Pendente', color: 'text-yellow-600', icon: <Clock className="h-3 w-3" /> }
]

// Dados de exemplo (sem honorários nos dados base)
const clientesBase = [
  {
    id: '1',
    razaoSocial: 'ABC Comércio Ltda',
    nomeFantasia: 'ABC Comércio',
    cnpj: '12.345.678/0001-90',
    ie: '123.456.789',
    tipo: 'simples',
    status: 'ativo',
    grupo: 'premium',
    email: 'contato@abccomercio.com.br',
    telefone: '(11) 9999-9999',
    whatsapp: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    cep: '01234-567',
    responsavel: 'João Silva',
    dataContrato: '15/01/2024',
    dataVencimento: '15/01/2025',
    observacoes: 'Cliente pontual nos pagamentos',
    ultimaAtualizacao: '10/06/2024',
    documentos: 45,
    obrigacoes: 12,
    rating: 5,
    atividade: 'Comércio de eletrônicos',
    faturamentoAnual: 850000,
    funcionarios: 15
  },
  {
    id: '2',
    razaoSocial: 'Maria da Silva',
    nomeFantasia: 'Maria Artesanato',
    cnpj: '12.345.678/0001-91',
    ie: 'Isento',
    tipo: 'mei',
    status: 'ativo',
    grupo: 'basico',
    email: 'maria@artesanato.com',
    telefone: '(11) 8888-8888',
    whatsapp: '(11) 88888-8888',
    endereco: 'Rua das Rosas, 456 - São Paulo/SP',
    cep: '01234-568',
    responsavel: 'Maria Silva',
    dataContrato: '20/02/2024',
    dataVencimento: '20/02/2025',
    observacoes: 'MEI de artesanato',
    ultimaAtualizacao: '15/06/2024',
    documentos: 8,
    obrigacoes: 2,
    rating: 4,
    atividade: 'Artesanato e decoração',
    faturamentoAnual: 45000,
    funcionarios: 1
  },
  {
    id: '3',
    razaoSocial: 'Fazenda São José Ltda',
    nomeFantasia: 'Fazenda São José',
    cnpj: '98.765.432/0001-10',
    ie: '987.654.321',
    tipo: 'produtor-rural',
    status: 'ativo',
    grupo: 'standard',
    email: 'fazenda@saojose.com.br',
    telefone: '(11) 7777-7777',
    whatsapp: '(11) 77777-7777',
    endereco: 'Estrada Rural, Km 15 - Interior/SP',
    cep: '12345-000',
    responsavel: 'José Santos',
    dataContrato: '10/03/2024',
    dataVencimento: '10/03/2025',
    observacoes: 'Produtor de soja e milho',
    ultimaAtualizacao: '18/06/2024',
    documentos: 32,
    obrigacoes: 8,
    rating: 5,
    atividade: 'Agricultura - soja e milho',
    faturamentoAnual: 1200000,
    funcionarios: 8,
    nirf: '123456789'
  }
]

function getTipoInfo(tipo: string) {
  return tiposEmpresa.find(t => t.value === tipo) || tiposEmpresa[0]
}

function getStatusBadge(status: string) {
  const statusInfo = statusClientes.find(s => s.value === status) || statusClientes[0]
  
  return (
    <Badge variant="outline" className={`${statusInfo.color} border-current flex items-center gap-1`}>
      {statusInfo.icon}
      {statusInfo.label}
    </Badge>
  )
}

function getGrupoBadge(grupo: string) {
  const grupoInfo = gruposClientes.find(g => g.value === grupo) || gruposClientes[1]
  
  return (
    <Badge className={`${grupoInfo.color} ${grupoInfo.bg} border-current`}>
      {grupoInfo.label}
    </Badge>
  )
}

function getRatingStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ))
}

// Função para iniciar conversa no WhatsApp
function abrirWhatsApp(numero: string, nome: string) {
  const numeroLimpo = numero.replace(/\D/g, '')
  const mensagem = `Olá ${nome}, sou da AG Assessoria. Como posso ajudá-lo hoje?`
  const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
}

export default function ClientesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientes, setClientes] = useState(clientesBase)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroGrupo, setFiltroGrupo] = useState<string>('todos')
  const [modoEdicao, setModoEdicao] = useState(false)

  // Estados do formulário (sem honorários)
  const [novoCliente, setNovoCliente] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    ie: '',
    tipo: 'simples',
    status: 'ativo',
    grupo: 'standard',
    email: '',
    telefone: '',
    whatsapp: '',
    endereco: '',
    cep: '',
    responsavel: '',
    observacoes: '',
    atividade: '',
    faturamentoAnual: 0,
    funcionarios: 1,
    nirf: '',
    contadorResponsavel: '',
    auditor: ''
  })

  // Estados para relatórios (sem faturamento)
  const [relatorios, setRelatorios] = useState({
    totalClientes: 0,
    clientesAtivos: 0,
    crescimentoMensal: 12,
    retencaoClientes: 85
  })

  console.log('Clientes page rendered - Sistema manual de gestão de clientes')

  useEffect(() => {
    // Calcular estatísticas
    const stats = {
      totalClientes: clientes.length,
      clientesAtivos: clientes.filter(c => c.status === 'ativo').length,
      crescimentoMensal: 12,
      retencaoClientes: 85
    }
    setRelatorios(stats)
  }, [clientes])

  const handleCadastrarCliente = () => {
    console.log('Cadastrando novo cliente:', novoCliente)
    
    if (modoEdicao && clienteSelecionado) {
      // Editar cliente existente
      setClientes(prev => prev.map(c => 
        c.id === clienteSelecionado.id 
          ? { ...c, ...novoCliente, ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') }
          : c
      ))
      alert('✅ Cliente atualizado com sucesso!')
      setModoEdicao(false)
      setClienteSelecionado(null)
    } else {
      // Criar novo cliente
      const cliente = {
        id: Date.now().toString(),
        ...novoCliente,
        dataContrato: new Date().toLocaleDateString('pt-BR'),
        dataVencimento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
        documentos: 0,
        obrigacoes: 0,
        rating: 3
      }
      
      setClientes(prev => [...prev, cliente])
      alert('✅ Cliente cadastrado com sucesso!')
    }
    
    // Limpar formulário
    resetFormulario()
    setDialogOpen(false)
  }

  const resetFormulario = () => {
    setNovoCliente({
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      ie: '',
      tipo: 'simples',
      status: 'ativo',
      grupo: 'standard',
      email: '',
      telefone: '',
      whatsapp: '',
      endereco: '',
      cep: '',
      responsavel: '',
      observacoes: '',
      atividade: '',
      faturamentoAnual: 0,
      funcionarios: 1,
      nirf: '',
      contadorResponsavel: '',
      auditor: ''
    })
  }

  const handleEditarCliente = (cliente: any) => {
    console.log('Editando cliente:', cliente.id)
    setClienteSelecionado(cliente)
    setNovoCliente({ ...cliente })
    setModoEdicao(true)
    setDialogOpen(true)
  }

  const handleExcluirCliente = (clienteId: string) => {
    console.log('Excluindo cliente:', clienteId)
    if (confirm('Deseja realmente excluir este cliente? Esta ação não pode ser desfeita.')) {
      setClientes(prev => prev.filter(c => c.id !== clienteId))
      alert('Cliente excluído com sucesso!')
    }
  }

  const handleDuplicarCliente = (cliente: any) => {
    console.log('Duplicando cliente:', cliente.id)
    const novoClienteDuplicado = {
      ...cliente,
      id: Date.now().toString(),
      razaoSocial: `${cliente.razaoSocial} - Cópia`,
      cnpj: '',
      email: '',
      whatsapp: '',
      dataContrato: new Date().toLocaleDateString('pt-BR'),
      ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
    }
    setClientes(prev => [...prev, novoClienteDuplicado])
    alert('Cliente duplicado com sucesso!')
  }

  const handleArquivarCliente = (clienteId: string) => {
    console.log('Arquivando cliente:', clienteId)
    setClientes(prev => prev.map(c => 
      c.id === clienteId 
        ? { ...c, status: 'inativo', ultimaAtualizacao: new Date().toLocaleDateString('pt-BR') }
        : c
    ))
    alert('Cliente arquivado!')
  }

  const clientesFiltrados = clientes.filter(cliente => {
    const matchSearch = cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.cnpj.includes(searchTerm) ||
                       cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.whatsapp.includes(searchTerm)
    
    const matchTipo = filtroTipo === 'todos' || cliente.tipo === filtroTipo
    const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus
    const matchGrupo = filtroGrupo === 'todos' || cliente.grupo === filtroGrupo
    
    return matchSearch && matchTipo && matchStatus && matchGrupo
  })

  const exportarDados = () => {
    console.log('Exportando dados dos clientes')
    alert('Funcionalidade de exportação em desenvolvimento!')
  }

  const importarDados = () => {
    console.log('Importando dados dos clientes')
    alert('Funcionalidade de importação em desenvolvimento!')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Sistema de Gestão de Clientes"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* KPI Dashboard (sem faturamento) */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{relatorios.totalClientes}</div>
                <p className="text-xs text-muted-foreground">{relatorios.clientesAtivos} ativos</p>
                <Progress value={(relatorios.clientesAtivos / relatorios.totalClientes) * 100} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Simples Nacional</CardTitle>
                <Store className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {clientes.filter(c => c.tipo === 'simples').length}
                </div>
                <p className="text-xs text-muted-foreground">Empresas</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MEI</CardTitle>
                <User className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {clientes.filter(c => c.tipo === 'mei').length}
                </div>
                <p className="text-xs text-muted-foreground">Microempreendedores</p>
              </CardContent>
            </Card>

            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtor Rural</CardTitle>
                <Tractor className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {clientes.filter(c => c.tipo === 'produtor-rural').length}
                </div>
                <p className="text-xs text-muted-foreground">Produtores</p>
              </CardContent>
            </Card>

            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retenção</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{relatorios.retencaoClientes}%</div>
                <p className="text-xs text-muted-foreground">Taxa de retenção</p>
                <Progress value={relatorios.retencaoClientes} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="listagem" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listagem">Listagem de Clientes</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
              <TabsTrigger value="grupos">Gestão de Grupos</TabsTrigger>
              <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            </TabsList>

            <TabsContent value="listagem" className="space-y-6">
              
              {/* Filtros Avançados */}
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros e Busca Avançada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome, CNPJ, email, WhatsApp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os tipos</SelectItem>
                        {tiposEmpresa.map(tipo => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os status</SelectItem>
                        {statusClientes.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os grupos</SelectItem>
                        {gruposClientes.map(grupo => (
                          <SelectItem key={grupo.value} value={grupo.value}>
                            {grupo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchTerm('')
                          setFiltroTipo('todos')
                          setFiltroStatus('todos')
                          setFiltroGrupo('todos')
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Limpar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      console.log('Clicou em Novo Cliente')
                      // Buscar e clicar na aba de cadastro usando o value correto
                      const cadastroTab = document.querySelector('[value="cadastro"]') as HTMLElement;
                      console.log('Tab encontrada:', cadastroTab)
                      if (cadastroTab) {
                        cadastroTab.click();
                        console.log('Tab clicada com sucesso')
                      } else {
                        // Fallback: trigger programaticamente
                        const tabsElement = document.querySelector('[role="tablist"]') as HTMLElement;
                        const allTabs = tabsElement?.querySelectorAll('[role="tab"]');
                        if (allTabs && allTabs[1]) {
                          (allTabs[1] as HTMLElement).click();
                          console.log('Fallback: segunda aba clicada')
                        }
                      }
                      setModoEdicao(false)
                      setClienteSelecionado(null)
                      resetFormulario()
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Exibindo {clientesFiltrados.length} de {clientes.length} clientes
                </div>
              </div>

              {/* Tabela de Clientes */}
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle>Clientes Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Grupo</TableHead>
                          <TableHead>Contato</TableHead>
                          <TableHead>WhatsApp</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientesFiltrados.map((cliente) => {
                          const tipoInfo = getTipoInfo(cliente.tipo)
                          return (
                            <TableRow key={cliente.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{cliente.razaoSocial}</span>
                                  <span className="text-xs text-muted-foreground">{cliente.nomeFantasia}</span>
                                  <span className="text-xs font-mono text-muted-foreground">{cliente.cnpj}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={`${tipoInfo.color} ${tipoInfo.bgColor} ${tipoInfo.borderColor}`}
                                >
                                  <div className="flex items-center gap-1">
                                    {tipoInfo.icon}
                                    {tipoInfo.label}
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getGrupoBadge(cliente.grupo)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col text-xs space-y-1">
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {cliente.telefone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {cliente.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => abrirWhatsApp(cliente.whatsapp || cliente.telefone, cliente.nomeFantasia || cliente.razaoSocial)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {cliente.whatsapp || cliente.telefone}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {getRatingStars(cliente.rating)}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEditarCliente(cliente)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicarCliente(cliente)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleArquivarCliente(cliente.id)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      Arquivar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleExcluirCliente(cliente.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Formulário de Cadastro/Edição Manual */}
            <TabsContent value="cadastro" className="space-y-6">
              <Card className="ag-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {modoEdicao ? 'Editar Cliente' : 'Cadastro de Cliente'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Informações Básicas */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informações da Empresa</h3>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Empresa *</Label>
                        <Select value={novoCliente.tipo} onValueChange={(value) => setNovoCliente(prev => ({...prev, tipo: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposEmpresa.map(tipo => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                <div className="flex items-center gap-2">
                                  {tipo.icon}
                                  {tipo.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Status do Cliente *</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="ativo"
                              name="status"
                              value="ativo"
                              checked={novoCliente.status === 'ativo'}
                              onChange={(e) => setNovoCliente(prev => ({...prev, status: e.target.value}))}
                              className="text-green-600"
                            />
                            <Label htmlFor="ativo" className="text-green-600 font-medium">Ativo</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="inativo"
                              name="status"
                              value="inativo"
                              checked={novoCliente.status === 'inativo'}
                              onChange={(e) => setNovoCliente(prev => ({...prev, status: e.target.value}))}
                              className="text-gray-600"
                            />
                            <Label htmlFor="inativo" className="text-gray-600 font-medium">Inativo</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Razão Social / Nome Completo *</Label>
                        <Input 
                          value={novoCliente.razaoSocial}
                          onChange={(e) => setNovoCliente(prev => ({...prev, razaoSocial: e.target.value}))}
                          placeholder="Digite a razão social..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Nome Fantasia</Label>
                        <Input 
                          value={novoCliente.nomeFantasia}
                          onChange={(e) => setNovoCliente(prev => ({...prev, nomeFantasia: e.target.value}))}
                          placeholder="Nome fantasia..."
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>{novoCliente.tipo === 'mei' ? 'CNPJ/CPF *' : 'CNPJ *'}</Label>
                          <Input 
                            value={novoCliente.cnpj}
                            onChange={(e) => setNovoCliente(prev => ({...prev, cnpj: e.target.value}))}
                            placeholder={novoCliente.tipo === 'mei' ? '000.000.000-00 ou 00.000.000/0001-00' : '00.000.000/0001-00'}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Inscrição Estadual</Label>
                          <Input 
                            value={novoCliente.ie}
                            onChange={(e) => setNovoCliente(prev => ({...prev, ie: e.target.value}))}
                            placeholder="000.000.000 ou Isento"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Atividade Principal</Label>
                        <Input 
                          value={novoCliente.atividade}
                          onChange={(e) => setNovoCliente(prev => ({...prev, atividade: e.target.value}))}
                          placeholder="Descreva a atividade principal..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Dados de Contato</h3>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>E-mail *</Label>
                          <Input 
                            type="email"
                            value={novoCliente.email}
                            onChange={(e) => setNovoCliente(prev => ({...prev, email: e.target.value}))}
                            placeholder="contato@empresa.com.br"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Telefone *</Label>
                          <Input 
                            value={novoCliente.telefone}
                            onChange={(e) => setNovoCliente(prev => ({...prev, telefone: e.target.value}))}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>WhatsApp para Contato Direto *</Label>
                        <Input 
                          value={novoCliente.whatsapp}
                          onChange={(e) => setNovoCliente(prev => ({...prev, whatsapp: e.target.value}))}
                          placeholder="(11) 99999-9999"
                        />
                        <p className="text-xs text-muted-foreground">
                          💬 Este número será usado para comunicação direta via WhatsApp
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Endereço Completo *</Label>
                        <Input 
                          value={novoCliente.endereco}
                          onChange={(e) => setNovoCliente(prev => ({...prev, endereco: e.target.value}))}
                          placeholder="Rua, número, bairro - Cidade/UF"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>CEP</Label>
                        <Input 
                          value={novoCliente.cep}
                          onChange={(e) => setNovoCliente(prev => ({...prev, cep: e.target.value}))}
                          placeholder="00000-000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Responsável / Contato Principal</Label>
                        <Input 
                          value={novoCliente.responsavel}
                          onChange={(e) => setNovoCliente(prev => ({...prev, responsavel: e.target.value}))}
                          placeholder="Nome do responsável"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informações Adicionais</h3>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Grupo do Cliente</Label>
                        <Select value={novoCliente.grupo} onValueChange={(value) => setNovoCliente(prev => ({...prev, grupo: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gruposClientes.map(grupo => (
                              <SelectItem key={grupo.value} value={grupo.value}>
                                {grupo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Faturamento Anual (R$)</Label>
                        <Input 
                          type="number"
                          value={novoCliente.faturamentoAnual}
                          onChange={(e) => setNovoCliente(prev => ({...prev, faturamentoAnual: Number(e.target.value)}))}
                          placeholder="0,00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Nº de Funcionários</Label>
                        <Input 
                          type="number"
                          value={novoCliente.funcionarios}
                          onChange={(e) => setNovoCliente(prev => ({...prev, funcionarios: Number(e.target.value)}))}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campos Específicos por Tipo */}
                  {(novoCliente.tipo === 'produtor-rural') && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informações Específicas - Produtor Rural</h3>
                        
                        <div className="space-y-2">
                          <Label>NIRF (Número de Inscrição de Registro Fiscal)</Label>
                          <Input 
                            value={novoCliente.nirf}
                            onChange={(e) => setNovoCliente(prev => ({...prev, nirf: e.target.value}))}
                            placeholder="000000000"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(novoCliente.tipo === 'presumido' || novoCliente.tipo === 'real') && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informações Específicas - {getTipoInfo(novoCliente.tipo).label}</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Contador Responsável</Label>
                            <Input 
                              value={novoCliente.contadorResponsavel}
                              onChange={(e) => setNovoCliente(prev => ({...prev, contadorResponsavel: e.target.value}))}
                              placeholder="Nome do contador responsável"
                            />
                          </div>
                          
                          {novoCliente.tipo === 'real' && (
                            <div className="space-y-2">
                              <Label>Auditor Independente</Label>
                              <Input 
                                value={novoCliente.auditor}
                                onChange={(e) => setNovoCliente(prev => ({...prev, auditor: e.target.value}))}
                                placeholder="Nome da empresa de auditoria"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Observações */}
                  <Separator />
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea 
                      value={novoCliente.observacoes}
                      onChange={(e) => setNovoCliente(prev => ({...prev, observacoes: e.target.value}))}
                      placeholder="Observações adicionais sobre o cliente..."
                      rows={4}
                    />
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button onClick={handleCadastrarCliente} className="flex-1">
                      <UserCheck className="h-4 w-4 mr-2" />
                      {modoEdicao ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        resetFormulario()
                        setModoEdicao(false)
                        setClienteSelecionado(null)
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar Formulário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gestão de Grupos */}
            <TabsContent value="grupos" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {gruposClientes.map(grupo => {
                  const clientesGrupo = clientes.filter(c => c.grupo === grupo.value)
                  
                  return (
                    <Card key={grupo.value} className="ag-card">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${grupo.bg}`}></div>
                            {grupo.label}
                          </div>
                          <Badge variant="outline">{clientesGrupo.length} clientes</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress 
                            value={clientes.length > 0 ? (clientesGrupo.length / clientes.length) * 100 : 0} 
                            className="mt-2" 
                          />
                          
                          <div className="text-xs text-muted-foreground">
                            {clientes.length > 0 ? Math.round((clientesGrupo.length / clientes.length) * 100) : 0}% do total de clientes
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Ferramentas */}
            <TabsContent value="ferramentas" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Ações em Massa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Enviar Notificações em Massa
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Lembretes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="ag-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Configurações Avançadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar com Domínio
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileBarChart className="h-4 w-4 mr-2" />
                      Gerar Relatório Completo
                    </Button>
                    <Button className="w-full" variant="outline">
                      <History className="h-4 w-4 mr-2" />
                      Histórico de Alterações
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Backup da Base de Dados
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialog para Cadastro/Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              {modoEdicao ? 'Editar Cliente' : 'Cadastro Rápido de Cliente'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-6">
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">
                Formulário completo de cadastro disponível na aba "Cadastro Manual"
              </p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setDialogOpen(false)
                  // Mudaria para a aba de cadastro
                }}
              >
                Ir para Formulário Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}