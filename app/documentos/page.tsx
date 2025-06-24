'use client'

import React, { useState, useRef } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  AlertTriangle,
  X,
  File,
  Image,
  FileVideo,
  FileAudio,
  MessageCircle,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  FolderOpen,
  Bot,
  Zap
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Clientes simulados para detecção automática
const clientesBase = [
  { id: '1', nome: 'ABC Comércio Ltda', cnpj: '12.345.678/0001-90', email: 'contato@abccomercio.com.br', telefone: '(11) 9999-9999' },
  { id: '2', nome: 'Maria da Silva', cnpj: '12.345.678/0001-91', email: 'maria@artesanato.com', telefone: '(11) 8888-8888' },
  { id: '3', nome: 'Fazenda São José', cnpj: '98.765.432/0001-10', email: 'fazenda@saojose.com.br', telefone: '(11) 7777-7777' },
  { id: '4', nome: 'XYZ Indústria', cnpj: '45.678.901/0001-23', email: 'contato@xyzindustria.com', telefone: '(11) 6666-6666' },
  { id: '5', nome: 'DEF Serviços', cnpj: '78.901.234/0001-56', email: 'contato@defservicos.com', telefone: '(11) 5555-5555' }
]

const documents = [
  {
    id: '1',
    nome: 'DAS - Março 2024',
    cliente: 'ABC Comércio Ltda',
    clienteId: '1',
    tipo: 'Tributário',
    dataEnvio: '15/03/2024',
    status: 'Enviado',
    visualizado: true,
    whatsapp: true,
    email: true,
    arquivo: 'das-marco-2024.pdf',
    tamanho: '2.3 MB'
  },
  {
    id: '2',
    nome: 'SPED Fiscal',
    cliente: 'XYZ Indústria',
    clienteId: '4',
    tipo: 'Fiscal',
    dataEnvio: '10/03/2024',
    status: 'Pendente',
    visualizado: false,
    whatsapp: false,
    email: false,
    arquivo: 'sped-fiscal-2024.xml',
    tamanho: '15.7 MB'
  },
  {
    id: '3',
    nome: 'Balancete',
    cliente: 'DEF Serviços',
    clienteId: '5',
    tipo: 'Contábil',
    dataEnvio: '20/03/2024',
    status: 'Visualizado',
    visualizado: true,
    whatsapp: true,
    email: true,
    arquivo: 'balancete-marco-2024.pdf',
    tamanho: '5.2 MB'
  }
]

function getStatusBadge(status: string) {
  const statusConfig = {
    'Enviado': { color: 'text-green-600 border-green-200 bg-green-50', icon: <CheckCircle className="h-3 w-3" /> },
    'Pendente': { color: 'text-orange-600 border-orange-200 bg-orange-50', icon: <Clock className="h-3 w-3" /> },
    'Visualizado': { color: 'text-blue-600 border-blue-200 bg-blue-50', icon: <Eye className="h-3 w-3" /> },
    'Erro': { color: 'text-red-600 border-red-200 bg-red-50', icon: <AlertTriangle className="h-3 w-3" /> }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pendente']
  
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {status}
    </Badge>
  )
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'pdf':
      return <File className="h-4 w-4 text-red-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="h-4 w-4 text-blue-500" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <FileVideo className="h-4 w-4 text-purple-500" />
    case 'mp3':
    case 'wav':
      return <FileAudio className="h-4 w-4 text-green-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

// Função para detectar cliente baseado no nome do arquivo
function detectarCliente(nomeArquivo: string) {
  const nomeArquivoLower = nomeArquivo.toLowerCase()
  
  // Buscar por CNPJ no nome do arquivo
  for (const cliente of clientesBase) {
    const cnpjLimpo = cliente.cnpj.replace(/[^\d]/g, '')
    if (nomeArquivoLower.includes(cnpjLimpo)) {
      return cliente
    }
  }
  
  // Buscar por palavras-chave no nome da empresa
  for (const cliente of clientesBase) {
    const palavrasChave = cliente.nome.toLowerCase().split(' ')
    for (const palavra of palavrasChave) {
      if (palavra.length > 3 && nomeArquivoLower.includes(palavra)) {
        return cliente
      }
    }
  }
  
  return null
}

export default function DocumentosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([])
  const [clienteDetections, setClienteDetections] = useState<{[key: string]: any}>({})
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('')
  const [enviarWhatsApp, setEnviarWhatsApp] = useState(true)
  const [enviarEmail, setEnviarEmail] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log('Documentos page rendered - Sistema de upload em lote')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Arquivos selecionados:', files.map(f => f.name))
    
    setArquivosSelecionados(files)
    
    // Detectar clientes automaticamente para cada arquivo
    const detections: {[key: string]: any} = {}
    files.forEach(file => {
      const clienteDetectado = detectarCliente(file.name)
      console.log(`Cliente detectado para ${file.name}:`, clienteDetectado?.nome || 'Não detectado')
      if (clienteDetectado) {
        detections[file.name] = clienteDetectado
      }
    })
    
    setClienteDetections(detections)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    console.log('Arquivos arrastados:', files.map(f => f.name))
    
    setArquivosSelecionados(prev => [...prev, ...files])
    
    // Detectar clientes para os arquivos arrastados
    const detections = { ...clienteDetections }
    files.forEach(file => {
      const clienteDetectado = detectarCliente(file.name)
      console.log(`Cliente detectado para ${file.name}:`, clienteDetectado?.nome || 'Não detectado')
      if (clienteDetectado) {
        detections[file.name] = clienteDetectado
      }
    })
    
    setClienteDetections(detections)
  }

  const handleClienteChange = (nomeArquivo: string, clienteId: string) => {
    console.log('Mudando cliente para arquivo:', nomeArquivo, 'Cliente:', clienteId)
    const cliente = clientesBase.find(c => c.id === clienteId)
    if (cliente) {
      setClienteDetections(prev => ({
        ...prev,
        [nomeArquivo]: cliente
      }))
    }
  }

  const handleRemoveFile = (nomeArquivo: string) => {
    console.log('Removendo arquivo:', nomeArquivo)
    setArquivosSelecionados(prev => prev.filter(f => f.name !== nomeArquivo))
    setClienteDetections(prev => {
      const newDetections = { ...prev }
      delete newDetections[nomeArquivo]
      return newDetections
    })
  }

  const handleUploadAndSend = async () => {
    console.log('Iniciando upload e envio em lote')
    
    if (arquivosSelecionados.length === 0) {
      alert('Selecione pelo menos um arquivo!')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simular upload e envio
      for (let i = 0; i < arquivosSelecionados.length; i++) {
        const arquivo = arquivosSelecionados[i]
        const cliente = clienteDetections[arquivo.name]
        
        console.log(`Processando arquivo ${i + 1}/${arquivosSelecionados.length}:`, arquivo.name)
        console.log('Cliente associado:', cliente?.nome || 'Não definido')
        
        // Simular progresso do upload
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUploadProgress(((i + 1) / arquivosSelecionados.length) * 100)
        
        // Simular envio de notificações
        if (cliente && enviarWhatsApp) {
          console.log(`Enviando WhatsApp para ${cliente.nome} (${cliente.telefone})`)
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        if (cliente && enviarEmail) {
          console.log(`Enviando email para ${cliente.nome} (${cliente.email})`)
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      alert(`✅ Upload concluído! ${arquivosSelecionados.length} arquivo(s) enviado(s) com notificações automáticas.`)
      
      // Limpar formulário
      setArquivosSelecionados([])
      setClienteDetections({})
      setMensagemPersonalizada('')
      setUploadDialogOpen(false)
      setUploadProgress(0)
      
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('❌ Erro no upload. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">1.247</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizados</CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">892</div>
                <p className="text-xs text-muted-foreground">71% taxa de abertura</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">23</div>
                <p className="text-xs text-muted-foreground">Aguardando envio</p>
              </CardContent>
            </Card>
            
            <Card className="ag-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Não Visualizados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">355</div>
                <p className="text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload em Lote
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Upload Inteligente em Lote
                    </DialogTitle>
                    <DialogDescription>
                      Arraste arquivos ou clique para selecionar. O sistema detectará automaticamente os clientes e enviará notificações.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 p-4">
                    {/* Zona de Upload */}
                    <div 
                      className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <FolderOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Arraste arquivos aqui</p>
                          <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Selecionar Arquivos
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.xml,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Lista de Arquivos com Detecção de Clientes */}
                    {arquivosSelecionados.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Arquivos Selecionados ({arquivosSelecionados.length})</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setArquivosSelecionados([])
                              setClienteDetections({})
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Limpar Todos
                          </Button>
                        </div>
                        
                        <ScrollArea className="h-64 border rounded-lg p-4">
                          <div className="space-y-3">
                            {arquivosSelecionados.map((arquivo, index) => {
                              const clienteDetectado = clienteDetections[arquivo.name]
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div className="flex items-center space-x-3 flex-1">
                                    {getFileIcon(arquivo.name)}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{arquivo.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    {clienteDetectado ? (
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-sm font-medium text-green-700">
                                          {clienteDetectado.nome}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-orange-600">Cliente não detectado</span>
                                      </div>
                                    )}
                                    
                                    <Select 
                                      value={clienteDetectado?.id || ''} 
                                      onValueChange={(value) => handleClienteChange(arquivo.name, value)}
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Selecionar cliente" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {clientesBase.map(cliente => (
                                          <SelectItem key={cliente.id} value={cliente.id}>
                                            {cliente.nome}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRemoveFile(arquivo.name)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Opções de Envio */}
                    {arquivosSelecionados.length > 0 && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Opções de Notificação</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="whatsapp"
                                checked={enviarWhatsApp}
                                onChange={(e) => setEnviarWhatsApp(e.target.checked)}
                                className="rounded"
                              />
                              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-green-600" />
                                Enviar por WhatsApp
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="email"
                                checked={enviarEmail}
                                onChange={(e) => setEnviarEmail(e.target.checked)}
                                className="rounded"
                              />
                              <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                Enviar por E-mail
                              </Label>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Mensagem Personalizada (Opcional)</Label>
                            <Textarea
                              value={mensagemPersonalizada}
                              onChange={(e) => setMensagemPersonalizada(e.target.value)}
                              placeholder="Adicione uma mensagem personalizada que será enviada junto com os documentos..."
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        {uploading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Enviando arquivos...</span>
                              <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                          </div>
                        )}
                        
                        {/* Botão de Envio */}
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={handleUploadAndSend}
                            disabled={uploading || arquivosSelecionados.length === 0}
                            className="flex-1"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            {uploading ? 'Enviando...' : `Enviar ${arquivosSelecionados.length} Arquivo(s)`}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setUploadDialogOpen(false)}
                            disabled={uploading}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getFileIcon(doc.arquivo)}
                          <div>
                            <p className="font-medium">{doc.nome}</p>
                            <p className="text-xs text-muted-foreground">{doc.tamanho}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {doc.cliente}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.tipo}</Badge>
                      </TableCell>
                      <TableCell>{doc.dataEnvio}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.whatsapp && (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Badge>
                          )}
                          {doc.email && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                              <Mail className="h-3 w-3 mr-1" />
                              E-mail
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('Visualizar documento:', doc.id)
                              alert(`Visualizando: ${doc.nome}`)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('Download documento:', doc.id)
                              alert(`Download: ${doc.nome}`)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('Reenviar documento:', doc.id)
                              alert(`Reenviando: ${doc.nome}`)
                            }}
                          >
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