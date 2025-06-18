'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  Users, 
  Building2, 
  Search,
  Shield,
  Radio,
  Calendar,
  Archive,
  Plus,
  Phone,
  Mail,
  User,
  FileText,
  Filter,
  Eye,
  Trash2,
  Edit3,
  Copy,
  Mic,
  MicOff,
  Play,
  Pause,
  Square
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function WhatsAppBusinessPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState('conversas')
  const [conversaAtiva, setConversaAtiva] = useState<any>(null)
  const [novaMensagem, setNovaMensagem] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)

  // Estados para conversas e mensagens
  const [conversasLista, setConversasLista] = useState<any[]>([])
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      conversaId: 1,
      remetente: 'cliente',
      nome: 'Maria Silva',
      mensagem: 'Bom dia! Preciso de ajuda com a declaração do IR.',
      dataHora: '09:15'
    },
    {
      id: 2,
      conversaId: 1,
      remetente: 'colaborador',
      nome: 'Ana Silva',
      mensagem: 'Bom dia Maria! Claro, vou te ajudar. Você já tem todos os documentos necessários?',
      dataHora: '09:18'
    },
    {
      id: 3,
      conversaId: 2,
      remetente: 'cliente',
      nome: 'João Santos',
      mensagem: 'Oi, quando fica pronto o balancete de novembro?',
      dataHora: '10:30'
    }
  ])

  const conversasIniciais = [
    {
      id: 1,
      cliente: 'Silva & Associados',
      contato: 'Maria Silva',
      telefone: '(11) 99999-1111',
      email: 'maria@silva.com',
      status: 'atendimento',
      ultimaMensagem: 'Bom dia Maria! Claro, vou te ajudar...',
      dataHora: '09:18',
      naoLidas: 0,
      setor: 'Contábil',
      observacoes: ''
    },
    {
      id: 2,
      cliente: 'Tech Solutions LTDA',
      contato: 'João Santos',
      telefone: '(11) 99999-2222',
      email: 'joao@techsolutions.com',
      status: 'novo',
      ultimaMensagem: 'Oi, quando fica pronto o balancete de novembro?',
      dataHora: '10:30',
      naoLidas: 1,
      setor: 'Fiscal',
      observacoes: ''
    },
    {
      id: 3,
      cliente: 'Comércio Brasil ME',
      contato: 'Ana Costa',
      telefone: '(11) 99999-3333',
      email: 'ana@comerciobrasil.com',
      status: 'pausado',
      ultimaMensagem: 'Preciso do DAS em urgência',
      dataHora: '14:22',
      naoLidas: 0,
      setor: 'Trabalhista',
      observacoes: ''
    }
  ]

  // Estados para novo contato
  const [novoContato, setNovoContato] = useState({
    nomeEmpresa: '',
    nomeContato: '',
    telefone: '',
    email: '',
    setor: 'Contábil',
    observacoes: ''
  })

  // Estados para envio em massa
  const [clientesSelecionados, setClientesSelecionados] = useState<number[]>([])
  const [mensagemMassa, setMensagemMassa] = useState('')

  // Estados para agendamentos
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [novoAgendamento, setNovoAgendamento] = useState({
    clientes: [] as number[],
    mensagem: '',
    dataEnvio: '',
    horaEnvio: '',
    template: ''
  })

  // Estados para templates
  const [templates, setTemplates] = useState([
    {
      id: 1,
      nome: 'Bom Dia - Cobrança',
      categoria: 'Cobrança',
      conteudo: 'Bom dia! Esperamos que esteja tudo bem. Gostaríamos de lembrar sobre o vencimento dos honorários do mês {MES}. Qualquer dúvida, estamos à disposição.',
      variaveis: ['MES']
    },
    {
      id: 2,
      nome: 'Certidões Negativas',
      categoria: 'Documentos',
      conteudo: 'Olá {CLIENTE}! Suas certidões negativas estão prontas. Você pode baixá-las pelo nosso portal ou podemos enviar por e-mail. Como prefere?',
      variaveis: ['CLIENTE']
    },
    {
      id: 3,
      nome: 'Balancete Pronto',
      categoria: 'Contabilidade',
      conteudo: 'Boa tarde {CLIENTE}! O balancete de {MES} está pronto e disponível no portal. Caso precise de algum esclarecimento, estou à disposição.',
      variaveis: ['CLIENTE', 'MES']
    }
  ])
  
  // Estados para áudio
  const [gravandoAudio, setGravandoAudio] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcricaoAudio, setTranscricaoAudio] = useState('')

  const [novoTemplate, setNovoTemplate] = useState({
    nome: '',
    categoria: 'Geral',
    conteudo: '',
    variaveis: []
  })

  const [templateSelecionado, setTemplateSelecionado] = useState('')

  // Funções auxiliares
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'novo': return 'bg-yellow-100 text-yellow-800'
      case 'atendimento': return 'bg-blue-100 text-blue-800'
      case 'pausado': return 'bg-orange-100 text-orange-800'
      case 'concluido': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'novo': return 'Novo'
      case 'atendimento': return 'Em Atendimento'
      case 'pausado': return 'Pausado'
      case 'concluido': return 'Concluído'
      default: return status
    }
  }

  // Funções de controle
  const handleIniciarAtendimento = (conversa: any) => {
    console.log('Iniciando atendimento para:', conversa.cliente)
    const conversasAtuais = conversasLista.length > 0 ? conversasLista : conversasIniciais
    const conversasAtualizadas = conversasAtuais.map(conv => 
      conv.id === conversa.id ? { ...conv, status: 'atendimento' } : conv
    )
    setConversasLista(conversasAtualizadas)
    setConversaAtiva({ ...conversa, status: 'atendimento' })
  }

  const handleConcluirAtendimento = () => {
    console.log('Concluindo atendimento')
    setConversaAtiva(null)
  }

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaAtiva) return
    
    const novaMensagemObj = {
      id: Date.now(),
      conversaId: conversaAtiva.id,
      remetente: 'colaborador' as const,
      nome: 'Ana Silva',
      mensagem: novaMensagem.trim(),
      dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    
    console.log('Enviando mensagem:', novaMensagemObj)
    setMensagens(prev => [...prev, novaMensagemObj])
    setNovaMensagem('')
    
    // Atualizar última mensagem da conversa
    const conversasAtuais = conversasLista.length > 0 ? conversasLista : conversasIniciais
    const conversasAtualizadas = conversasAtuais.map(conv => 
      conv.id === conversaAtiva.id 
        ? { ...conv, ultimaMensagem: novaMensagem.trim(), dataHora: novaMensagemObj.dataHora }
        : conv
    )
    setConversasLista(conversasAtualizadas)
  }

  const handleAdicionarContato = () => {
    if (!novoContato.nomeEmpresa || !novoContato.nomeContato || !novoContato.telefone) {
      alert('Preencha os campos obrigatórios: Nome da Empresa, Nome do Contato e Telefone')
      return
    }

    const novaConversa = {
      id: Date.now(),
      cliente: novoContato.nomeEmpresa,
      contato: novoContato.nomeContato,
      telefone: novoContato.telefone,
      email: novoContato.email,
      status: 'novo',
      ultimaMensagem: 'Contato adicionado - Aguardando primeira mensagem',
      dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      naoLidas: 0,
      setor: novoContato.setor,
      observacoes: novoContato.observacoes
    }

    console.log('Adicionando novo contato:', novaConversa)
    
    // Atualizar lista de conversas
    const conversasAtuais = conversasLista.length > 0 ? conversasLista : conversasIniciais
    const novasConversas = [...conversasAtuais, novaConversa]
    setConversasLista(novasConversas)
    
    // Limpar formulário
    setNovoContato({
      nomeEmpresa: '',
      nomeContato: '',
      telefone: '',
      email: '',
      setor: 'Contábil',
      observacoes: ''
    })
    
    // Fechar dialog
    setDialogAberto(false)
    
    // Toast de sucesso seria interessante aqui
    alert('Contato adicionado com sucesso!')
  }

  // Funções para envio em massa
  const handleSelecionarCliente = (clienteId: number) => {
    if (clientesSelecionados.includes(clienteId)) {
      setClientesSelecionados(clientesSelecionados.filter(id => id !== clienteId))
    } else {
      setClientesSelecionados([...clientesSelecionados, clienteId])
    }
  }

  const handleSelecionarTodos = () => {
    const conversasAtuais = conversasLista.length > 0 ? conversasLista : conversasIniciais
    if (clientesSelecionados.length === conversasAtuais.length) {
      setClientesSelecionados([])
    } else {
      setClientesSelecionados(conversasAtuais.map(c => c.id))
    }
  }

  const handleEnvioMassa = () => {
    if (clientesSelecionados.length === 0) {
      alert('Selecione pelo menos um cliente')
      return
    }
    if (!mensagemMassa.trim()) {
      alert('Digite uma mensagem')
      return
    }

    console.log('Enviando mensagem em massa para:', clientesSelecionados)
    console.log('Mensagem:', mensagemMassa)
    alert(`Mensagem enviada para ${clientesSelecionados.length} cliente(s)!`)
    setMensagemMassa('')
    setClientesSelecionados([])
  }

  // Funções para agendamentos
  const handleCriarAgendamento = () => {
    if (novoAgendamento.clientes.length === 0 || !novoAgendamento.mensagem || !novoAgendamento.dataEnvio) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const agendamento = {
      id: Date.now(),
      ...novoAgendamento,
      status: 'agendado',
      criadoEm: new Date().toLocaleString('pt-BR')
    }

    setAgendamentos([...agendamentos, agendamento])
    setNovoAgendamento({
      clientes: [],
      mensagem: '',
      dataEnvio: '',
      horaEnvio: '',
      template: ''
    })
    alert('Agendamento criado com sucesso!')
  }

  // Funções para templates
  const handleAplicarTemplate = (template: any) => {
    setMensagemMassa(template.conteudo)
    setTemplateSelecionado(template.id.toString())
  }

  const handleCriarTemplate = () => {
    if (!novoTemplate.nome || !novoTemplate.conteudo) {
      alert('Preencha nome e conteúdo do template')
      return
    }

    const template = {
      id: Date.now(),
      ...novoTemplate
    }

    setTemplates([...templates, template])
    setNovoTemplate({
      nome: '',
      categoria: 'Geral',
      conteudo: '',
      variaveis: []
    })
    alert('Template criado com sucesso!')
  }

  // Funções para áudio
  const handleIniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioBlob(event.data)
        }
      }
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
      }
      
      setMediaRecorder(recorder)
      recorder.start()
      setGravandoAudio(true)
      console.log('Gravação de áudio iniciada')
    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
      alert('Erro ao acessar microfone. Verifique as permissões.')
    }
  }

  const handlePararGravacao = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setGravandoAudio(false)
      console.log('Gravação de áudio parada')
    }
  }

  const handleEnviarAudio = () => {
    if (audioBlob) {
      // Simular transcrição (em produção seria uma API de transcrição)
      const transcricaoSimulada = 'Transcrição do áudio: Olá, preciso verificar os documentos pendentes.'
      setTranscricaoAudio(transcricaoSimulada)
      
      console.log('Áudio enviado:', audioBlob)
      console.log('Transcrição:', transcricaoSimulada)
      
      // Limpar áudio após envio
      setAudioBlob(null)
      setTranscricaoAudio('')
      alert('Áudio enviado e transcrito com sucesso!')
    }
  }

  const handleCancelarAudio = () => {
    setAudioBlob(null)
    setTranscricaoAudio('')
    setGravandoAudio(false)
    console.log('Áudio cancelado')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="WhatsApp Business Pro" userName="Ana Silva" userRole="Contadora Senior" />
        
        <main className="flex-1 overflow-hidden">
          
          {/* NAVIGATION TABS */}
          <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant={activeView === 'conversas' ? 'default' : 'ghost'}
                onClick={() => setActiveView('conversas')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Conversas</span>
                <Badge variant="secondary" className="ml-1">5</Badge>
              </Button>
              
              <Button 
                variant={activeView === 'massa' ? 'default' : 'ghost'}
                onClick={() => setActiveView('massa')}
                className="flex items-center space-x-2"
              >
                <Radio className="h-4 w-4" />
                <span>Envio em Massa</span>
              </Button>
              
              <Button 
                variant={activeView === 'agendamentos' ? 'default' : 'ghost'}
                onClick={() => setActiveView('agendamentos')}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Agendamentos</span>
              </Button>
              
              <Button 
                variant={activeView === 'historico' ? 'default' : 'ghost'}
                onClick={() => setActiveView('historico')}
                className="flex items-center space-x-2"
              >
                <Archive className="h-4 w-4" />
                <span>Histórico</span>
              </Button>
            </div>
          </div>

          {/* CONTENT AREA */}
          {activeView === 'conversas' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* SIDEBAR CONVERSAS - Redimensionável */}
              <div className="w-80 min-w-80 max-w-96 border-r bg-slate-50 flex flex-col resize-x overflow-auto">
                
                {/* HEADER COM FILTROS E NOVO CONTATO */}
                <div className="p-3 border-b bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar conversas..." className="text-sm" />
                    </div>
                    
                    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="ml-2 px-2">
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="hidden lg:inline">Novo</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Adicionar Novo Contato
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nomeEmpresa" className="text-right font-medium">
                              Empresa *
                            </Label>
                            <Input
                              id="nomeEmpresa"
                              value={novoContato.nomeEmpresa}
                              onChange={(e) => setNovoContato({...novoContato, nomeEmpresa: e.target.value})}
                              placeholder="Nome da empresa"
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nomeContato" className="text-right font-medium">
                              Contato *
                            </Label>
                            <Input
                              id="nomeContato"
                              value={novoContato.nomeContato}
                              onChange={(e) => setNovoContato({...novoContato, nomeContato: e.target.value})}
                              placeholder="Nome do responsável"
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telefone" className="text-right font-medium">
                              <Phone className="h-4 w-4 inline mr-1" />
                              Telefone *
                            </Label>
                            <Input
                              id="telefone"
                              value={novoContato.telefone}
                              onChange={(e) => setNovoContato({...novoContato, telefone: e.target.value})}
                              placeholder="(11) 99999-9999"
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right font-medium">
                              <Mail className="h-4 w-4 inline mr-1" />
                              E-mail
                            </Label>
                            <Input
                              id="email"
                              value={novoContato.email}
                              onChange={(e) => setNovoContato({...novoContato, email: e.target.value})}
                              placeholder="contato@empresa.com"
                              className="col-span-3"
                              type="email"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="setor" className="text-right font-medium">
                              <Building2 className="h-4 w-4 inline mr-1" />
                              Setor
                            </Label>
                            <Select value={novoContato.setor} onValueChange={(value) => setNovoContato({...novoContato, setor: value})}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Contábil">Contábil</SelectItem>
                                <SelectItem value="Fiscal">Fiscal</SelectItem>
                                <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                                <SelectItem value="Societário">Societário</SelectItem>
                                <SelectItem value="Consultoria">Consultoria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="observacoes" className="text-right font-medium">
                              Observações
                            </Label>
                            <Textarea
                              id="observacoes"
                              value={novoContato.observacoes}
                              onChange={(e) => setNovoContato({...novoContato, observacoes: e.target.value})}
                              placeholder="Informações adicionais..."
                              className="col-span-3"
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setDialogAberto(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAdicionarContato}>
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar Contato
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0">N: {(conversasLista.length > 0 ? conversasLista : conversasIniciais).filter(c => c.status === 'novo').length}</Badge>
                    <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">A: {(conversasLista.length > 0 ? conversasLista : conversasIniciais).filter(c => c.status === 'atendimento').length}</Badge>
                    <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0">P: {(conversasLista.length > 0 ? conversasLista : conversasIniciais).filter(c => c.status === 'pausado').length}</Badge>
                  </div>
                </div>

                {/* LISTA DE CONVERSAS */}
                <ScrollArea className="flex-1 px-2" style={{scrollbarWidth: 'thin'}}>
                  <div className="py-2 space-y-2">
                    {(conversasLista.length > 0 ? conversasLista : conversasIniciais).map((conversa) => (
                      <Card
                        key={conversa.id}
                        className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                          conversaAtiva?.id === conversa.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                        }`}
                        onClick={() => setConversaAtiva(conversa)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                                  {conversa.cliente.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {conversa.naoLidas > 0 && (
                                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full shadow-lg">
                                  {conversa.naoLidas}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm truncate">{conversa.cliente}</h4>
                                <span className="text-xs text-muted-foreground">{conversa.dataHora}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {conversa.contato}
                              </p>
                              <p className="text-xs text-slate-700 line-clamp-2 bg-slate-50 p-1 rounded text-ellipsis">{conversa.ultimaMensagem}</p>
                              
                              <div className="flex items-center justify-between pt-1">
                                <Badge className={`text-xs px-2 py-0 ${getStatusColor(conversa.status)}`}>
                                  {getStatusLabel(conversa.status)}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {conversa.setor}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* ÁREA DE CHAT - Flexível */}
              <div className="flex-1 flex flex-col min-w-0">
                {conversaAtiva ? (
                  <>
                    {/* HEADER DO CHAT - Compacto */}
                    <div className="border-b bg-white p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {conversaAtiva.cliente.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-sm">{conversaAtiva.cliente}</h3>
                            <p className="text-xs text-muted-foreground">{conversaAtiva.contato}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge className={`text-xs px-2 py-0 ${getStatusColor(conversaAtiva.status)}`}>
                              {getStatusLabel(conversaAtiva.status)}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {conversaAtiva.setor}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {conversaAtiva.status === 'novo' && (
                            <Button size="sm" onClick={() => handleIniciarAtendimento(conversaAtiva)} className="h-8 px-3 text-xs">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Iniciar
                            </Button>
                          )}
                          {conversaAtiva.status === 'atendimento' && (
                            <Button size="sm" onClick={handleConcluirAtendimento} className="bg-green-600 hover:bg-green-700 h-8 px-3 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Concluir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* MENSAGENS - Otimizada */}
                    <ScrollArea className="flex-1 px-4 py-2" style={{scrollbarWidth: 'thin'}}>
                      <div className="space-y-3 min-h-full">
                        {mensagens
                          .filter(m => m.conversaId === conversaAtiva.id)
                          .map((mensagem) => (
                            <div
                              key={mensagem.id}
                              className={`flex ${mensagem.remetente === 'colaborador' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                                mensagem.remetente === 'colaborador' 
                                  ? 'bg-primary text-primary-foreground ml-4' 
                                  : 'bg-white border border-slate-200 mr-4'
                              }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium opacity-90">
                                    {mensagem.nome}
                                  </span>
                                  <span className="text-xs opacity-75 ml-2">
                                    {mensagem.dataHora}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{mensagem.mensagem}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>

                    {/* INPUT DE MENSAGEM - Compacto */}
                    <div className="border-t bg-white p-3">
                      <div className="mb-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Templates:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {templates.slice(0, 3).map((template) => (
                            <Button
                              key={template.id}
                              variant="outline"
                              size="sm"
                              onClick={() => setNovaMensagem(template.conteudo)}
                              className="text-xs h-6 px-2"
                            >
                              {template.nome}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Textarea
                            placeholder="Digite sua mensagem..."
                            value={novaMensagem}
                            onChange={(e) => setNovaMensagem(e.target.value)}
                            rows={2}
                            className="resize-none border-2 focus:border-primary text-sm"
                          />
                        </div>
                        
                        {/* CONTROLES DE ÁUDIO - Compactos */}
                        <div className="flex space-x-1">
                          {!gravandoAudio ? (
                            <Button 
                              onClick={handleIniciarGravacao}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Gravar áudio"
                            >
                              <Mic className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              onClick={handlePararGravacao}
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0 animate-pulse"
                              title="Parar gravação"
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {audioBlob && (
                            <>
                              <Button 
                                onClick={handleEnviarAudio}
                                variant="default"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Enviar áudio"
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={handleCancelarAudio}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Cancelar áudio"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                        
                        <Button 
                          onClick={handleEnviarMensagem} 
                          disabled={!novaMensagem.trim()}
                          className="h-8 px-4 text-sm"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Enviar
                        </Button>
                      </div>
                      
                      {/* TRANSCRIÇÃO DE ÁUDIO - Compacta */}
                      {transcricaoAudio && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Mic className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">Transcrição:</span>
                          </div>
                          <p className="text-xs text-blue-700">{transcricaoAudio}</p>
                        </div>
                      )}
                      
                      {/* INDICADOR DE GRAVAÇÃO - Compacto */}
                      {gravandoAudio && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-red-800">Gravando...</span>
                          </div>
                        </div>
                      )}
                      
                      <Alert className="mt-2 bg-slate-50 border-slate-200 py-2">
                        <Shield className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          🔒 Mensagens protegidas
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        Selecione uma conversa
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        1 novo • 1 em atendimento • 1 pausado
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ENVIO EM MASSA */}
          {activeView === 'massa' && (
            <div className="flex-1 flex flex-col p-6 space-y-6">
              <div className="grid grid-cols-12 gap-6 h-full">
                
                {/* SELEÇÃO DE CLIENTES */}
                <div className="col-span-4">
                  <Card className="h-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Selecionar Clientes
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSelecionarTodos}
                        >
                          {clientesSelecionados.length === (conversasLista.length > 0 ? conversasLista : conversasIniciais).length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-96" style={{scrollbarWidth: 'thin'}}>
                        <div className="p-4 space-y-3">
                          {(conversasLista.length > 0 ? conversasLista : conversasIniciais).map((conversa) => (
                            <div 
                              key={conversa.id}
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
                              onClick={() => handleSelecionarCliente(conversa.id)}
                            >
                              <Checkbox 
                                checked={clientesSelecionados.includes(conversa.id)}
                                onChange={() => handleSelecionarCliente(conversa.id)}
                              />
                              <div className="flex items-center space-x-3 flex-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {conversa.cliente.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{conversa.cliente}</p>
                                  <p className="text-xs text-muted-foreground">{conversa.contato}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {conversa.setor}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* TEMPLATES E MENSAGEM */}
                <div className="col-span-8">
                  <Tabs defaultValue="compor" className="h-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="compor">Compor Mensagem</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="compor" className="space-y-4 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Mensagem para {clientesSelecionados.length} cliente(s)</span>
                            <Badge variant="secondary">{clientesSelecionados.length} selecionado(s)</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="mensagem-massa">Mensagem</Label>
                            <Textarea
                              id="mensagem-massa"
                              placeholder="Digite sua mensagem aqui..."
                              value={mensagemMassa}
                              onChange={(e) => setMensagemMassa(e.target.value)}
                              rows={8}
                              className="mt-2"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              Caracteres: {mensagemMassa.length}/1000
                            </div>
                            <Button 
                              onClick={handleEnvioMassa}
                              disabled={clientesSelecionados.length === 0 || !mensagemMassa.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Radio className="h-4 w-4 mr-2" />
                              Enviar para {clientesSelecionados.length} cliente(s)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="mt-6">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {/* LISTA DE TEMPLATES */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Templates Salvos</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <ScrollArea className="h-80" style={{scrollbarWidth: 'thin'}}>
                              <div className="p-4 space-y-3">
                                {templates.map((template) => (
                                  <div key={template.id} className="border rounded-lg p-3 hover:bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-sm">{template.nome}</h4>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-xs">{template.categoria}</Badge>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={() => handleAplicarTemplate(template)}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{template.conteudo}</p>
                                    {template.variaveis.length > 0 && (
                                      <div className="flex items-center space-x-1 mt-2">
                                        <span className="text-xs text-muted-foreground">Variáveis:</span>
                                        {template.variaveis.map((variavel) => (
                                          <Badge key={variavel} variant="secondary" className="text-xs">{variavel}</Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>

                        {/* CRIAR NOVO TEMPLATE */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Criar Template</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="nome-template">Nome do Template</Label>
                              <Input
                                id="nome-template"
                                placeholder="Ex: Cobrança Mensal"
                                value={novoTemplate.nome}
                                onChange={(e) => setNovoTemplate({...novoTemplate, nome: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="categoria-template">Categoria</Label>
                              <Select value={novoTemplate.categoria} onValueChange={(value) => setNovoTemplate({...novoTemplate, categoria: value})}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Geral">Geral</SelectItem>
                                  <SelectItem value="Cobrança">Cobrança</SelectItem>
                                  <SelectItem value="Documentos">Documentos</SelectItem>
                                  <SelectItem value="Contabilidade">Contabilidade</SelectItem>
                                  <SelectItem value="Fiscal">Fiscal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="conteudo-template">Conteúdo</Label>
                              <Textarea
                                id="conteudo-template"
                                placeholder="Digite o conteúdo do template..."
                                value={novoTemplate.conteudo}
                                onChange={(e) => setNovoTemplate({...novoTemplate, conteudo: e.target.value})}
                                rows={6}
                                className="mt-1"
                              />
                            </div>
                            
                            <Button onClick={handleCriarTemplate} className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Criar Template
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}

          {/* AGENDAMENTOS */}
          {activeView === 'agendamentos' && (
            <div className="flex-1 p-6 space-y-6">
              <div className="grid grid-cols-12 gap-6">
                
                {/* CRIAR AGENDAMENTO */}
                <div className="col-span-5">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Novo Agendamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Selecionar Clientes</Label>
                        <ScrollArea className="mt-2 h-40 border rounded-md p-2" style={{scrollbarWidth: 'thin'}}>
                          <div className="space-y-2">
                            {(conversasLista.length > 0 ? conversasLista : conversasIniciais).map((conversa) => (
                              <div key={conversa.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={novoAgendamento.clientes.includes(conversa.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNovoAgendamento({
                                        ...novoAgendamento,
                                        clientes: [...novoAgendamento.clientes, conversa.id]
                                      })
                                    } else {
                                      setNovoAgendamento({
                                        ...novoAgendamento,
                                        clientes: novoAgendamento.clientes.filter(id => id !== conversa.id)
                                      })
                                    }
                                  }}
                                />
                                <span className="text-sm">{conversa.cliente}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      
                      <div>
                        <Label htmlFor="data-envio">Data de Envio</Label>
                        <Input
                          id="data-envio"
                          type="date"
                          value={novoAgendamento.dataEnvio}
                          onChange={(e) => setNovoAgendamento({...novoAgendamento, dataEnvio: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="hora-envio">Horário de Envio</Label>
                        <Input
                          id="hora-envio"
                          type="time"
                          value={novoAgendamento.horaEnvio}
                          onChange={(e) => setNovoAgendamento({...novoAgendamento, horaEnvio: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="mensagem-agendamento">Mensagem</Label>
                        <Textarea
                          id="mensagem-agendamento"
                          placeholder="Digite a mensagem para envio agendado..."
                          value={novoAgendamento.mensagem}
                          onChange={(e) => setNovoAgendamento({...novoAgendamento, mensagem: e.target.value})}
                          rows={4}
                          className="mt-1"
                        />
                      </div>
                      
                      <Button onClick={handleCriarAgendamento} className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        Criar Agendamento
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* LISTA DE AGENDAMENTOS */}
                <div className="col-span-7">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Agendamentos Ativos</span>
                        <Badge variant="secondary">{agendamentos.length} agendamento(s)</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-96" style={{scrollbarWidth: 'thin'}}>
                        <div className="p-4 space-y-4">
                          {agendamentos.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>Nenhum agendamento criado</p>
                            </div>
                          ) : (
                            agendamentos.map((agendamento) => (
                              <div key={agendamento.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">
                                      {new Date(agendamento.dataEnvio).toLocaleDateString('pt-BR')} às {agendamento.horaEnvio}
                                    </span>
                                  </div>
                                  <Badge 
                                    variant={agendamento.status === 'agendado' ? 'default' : 'secondary'}
                                    className="capitalize"
                                  >
                                    {agendamento.status}
                                  </Badge>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Clientes ({agendamento.clientes.length}):</p>
                                  <div className="flex flex-wrap gap-1">
                                    {agendamento.clientes.map((clienteId: number) => {
                                      const cliente = (conversasLista.length > 0 ? conversasLista : conversasIniciais).find(c => c.id === clienteId)
                                      return cliente ? (
                                        <Badge key={clienteId} variant="outline" className="text-xs">
                                          {cliente.cliente}
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Mensagem:</p>
                                  <p className="text-sm bg-slate-50 p-2 rounded border line-clamp-3">
                                    {agendamento.mensagem}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">
                                    Criado em {agendamento.criadoEm}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeView === 'historico' && (
            <div className="flex-1 p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Archive className="h-5 w-5 mr-2" />
                    Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Histórico completo será exibido aqui
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}