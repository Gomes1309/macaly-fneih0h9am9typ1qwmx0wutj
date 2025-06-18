'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCheck, 
  Check, 
  Clock, 
  Download,
  FileText,
  Image,
  Phone,
  Paperclip
} from 'lucide-react'

interface Mensagem {
  id: number
  texto: string
  remetente: 'cliente' | 'atendente'
  nomeRemetente: string
  horario: string
  status: 'enviando' | 'enviado' | 'entregue' | 'lido'
  tipo: 'texto' | 'arquivo' | 'imagem' | 'audio'
  arquivo?: {
    nome: string
    tamanho: string
    url: string
  }
}

// Mock de mensagens para demonstração
const mensagensMock: { [key: number]: Mensagem[] } = {
  1: [
    {
      id: 1,
      texto: 'Boa tarde! Preciso da certidão negativa da empresa urgente.',
      remetente: 'cliente',
      nomeRemetente: 'Maria Silva',
      horario: '14:30',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 2,
      texto: 'Boa tarde, Maria! Vou verificar isso para você agora mesmo.',
      remetente: 'atendente',
      nomeRemetente: 'João Silva',
      horario: '14:31',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 3,
      texto: 'Encontrei sua certidão. Vou enviar o documento para você.',
      remetente: 'atendente',
      nomeRemetente: 'João Silva',
      horario: '14:33',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 4,
      texto: 'Certidão Negativa - MS Comércio Ltda',
      remetente: 'atendente',
      nomeRemetente: 'João Silva',
      horario: '14:34',
      status: 'entregue',
      tipo: 'arquivo',
      arquivo: {
        nome: 'certidao-negativa-ms-comercio.pdf',
        tamanho: '245 KB',
        url: '/documents/certidao.pdf'
      }
    },
    {
      id: 5,
      texto: 'Perfeito! Muito obrigada pelo atendimento rápido. 😊',
      remetente: 'cliente',
      nomeRemetente: 'Maria Silva',
      horario: '14:35',
      status: 'lido',
      tipo: 'texto'
    }
  ],
  2: [
    {
      id: 1,
      texto: 'Olá! Gostaria de tirar uma dúvida sobre o DAS.',
      remetente: 'cliente',
      nomeRemetente: 'Carlos Oliveira',
      horario: '13:15',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 2,
      texto: 'Olá Carlos! Claro, pode me dizer qual é a dúvida?',
      remetente: 'atendente',
      nomeRemetente: 'Ana Costa',
      horario: '13:16',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 3,
      texto: 'O valor está diferente do mês passado, é normal?',
      remetente: 'cliente',
      nomeRemetente: 'Carlos Oliveira',
      horario: '13:17',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 4,
      texto: 'Sim, pode variar conforme o faturamento. Vou te explicar melhor.',
      remetente: 'atendente',
      nomeRemetente: 'Ana Costa',
      horario: '13:18',
      status: 'lido',
      tipo: 'texto'
    },
    {
      id: 5,
      texto: 'Obrigado pela explicação! Ficou bem claro.',
      remetente: 'cliente',
      nomeRemetente: 'Carlos Oliveira',
      horario: '13:20',
      status: 'lido',
      tipo: 'texto'
    }
  ]
}

interface ChatInterfaceProps {
  conversaId: number
  clienteNome: string
}

export function ChatInterface({ conversaId, clienteNome }: ChatInterfaceProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  console.log('Chat interface rendered for conversation:', conversaId)

  useEffect(() => {
    // Carregar mensagens da conversa
    const mensagensConversa = mensagensMock[conversaId] || []
    setMensagens(mensagensConversa)
    console.log('Loaded messages for conversation:', conversaId, mensagensConversa.length)
  }, [conversaId])

  useEffect(() => {
    // Auto-scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviando':
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case 'enviado':
        return <Check className="h-3 w-3 text-muted-foreground" />
      case 'entregue':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case 'lido':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const handleDownload = (arquivo: any) => {
    console.log('Downloading file:', arquivo.nome)
    // Implementar download real
  }

  const renderMensagem = (mensagem: Mensagem) => {
    const isCliente = mensagem.remetente === 'cliente'
    
    return (
      <div key={mensagem.id} className={`flex ${isCliente ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex items-end space-x-2 max-w-[70%] ${isCliente ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
          {isCliente && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/cliente-avatar.png" />
              <AvatarFallback className="text-xs">
                {clienteNome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`rounded-lg p-3 ${
            isCliente 
              ? 'bg-slate-100 dark:bg-slate-700' 
              : 'bg-primary text-primary-foreground'
          }`}>
            {/* Nome do remetente (só para atendentes) */}
            {!isCliente && (
              <p className="text-xs opacity-80 mb-1">{mensagem.nomeRemetente}</p>
            )}
            
            {/* Conteúdo da mensagem */}
            {mensagem.tipo === 'texto' && (
              <p className="text-sm whitespace-pre-wrap">{mensagem.texto}</p>
            )}
            
            {mensagem.tipo === 'arquivo' && mensagem.arquivo && (
              <div className="bg-white/10 rounded-lg p-3 mt-2">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{mensagem.arquivo.nome}</p>
                    <p className="text-xs opacity-80">{mensagem.arquivo.tamanho}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={isCliente ? "outline" : "secondary"}
                    onClick={() => handleDownload(mensagem.arquivo)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Horário e status */}
            <div className={`flex items-center justify-between mt-2 ${
              isCliente ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <span className="text-xs opacity-70">{mensagem.horario}</span>
              {!isCliente && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon(mensagem.status)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
      {/* Header do Chat com informações */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            Conversa iniciada hoje
          </Badge>
        </div>
      </div>

      {/* Mensagens */}
      <div className="space-y-1">
        {mensagens.map(renderMensagem)}
      </div>
      
      {/* Referência para scroll automático */}
      <div ref={messagesEndRef} />
      
      {/* Indicador de digitação (mock) */}
      {conversaId === 1 && (
        <div className="flex items-center space-x-2 mt-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/cliente-avatar.png" />
            <AvatarFallback className="text-xs">MS</AvatarFallback>
          </Avatar>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">digitando...</span>
        </div>
      )}
    </div>
  )
}