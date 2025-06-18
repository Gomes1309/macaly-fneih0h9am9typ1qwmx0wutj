'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  User, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Send,
  X
} from 'lucide-react'

interface Colaborador {
  id: number
  nome: string
  avatar: string
  status: 'online' | 'ocupado' | 'ausente'
  departamento: string
}

interface TicketTransferProps {
  conversaId: number
  colaboradores: Colaborador[]
  onTransfer: (novoAtendente: string) => void
  onClose: () => void
}

export function TicketTransfer({ conversaId, colaboradores, onTransfer, onClose }: TicketTransferProps) {
  const [atendenteEscolhido, setAtendenteEscolhido] = useState<string>('')
  const [observacoes, setObservacoes] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)

  console.log('Ticket transfer opened for conversation:', conversaId)

  const handleTransfer = async () => {
    if (!atendenteEscolhido) return

    setIsTransferring(true)
    console.log('Transferring to:', atendenteEscolhido, 'with notes:', observacoes)
    
    // Simular transferência
    setTimeout(() => {
      onTransfer(atendenteEscolhido)
      setIsTransferring(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'ocupado': return 'bg-yellow-500'
      case 'ausente': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Disponível'
      case 'ocupado': return 'Ocupado'
      case 'ausente': return 'Ausente'
      default: return 'Offline'
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Transferir Atendimento</span>
          </DialogTitle>
          <DialogDescription>
            Escolha um colaborador para assumir esta conversa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Conversa */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Conversa #{conversaId}</CardTitle>
              <CardDescription>Cliente aguardando transferência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Tempo de espera: 2m 15s</span>
                <MessageCircle className="h-4 w-4 ml-4" />
                <span>5 mensagens</span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Colaboradores */}
          <div>
            <h3 className="font-semibold mb-3">Selecionar Atendente</h3>
            <div className="grid grid-cols-1 gap-3">
              {colaboradores.map((colaborador) => (
                <div
                  key={colaborador.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    atendenteEscolhido === colaborador.nome 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => setAtendenteEscolhido(colaborador.nome)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={colaborador.avatar} />
                          <AvatarFallback>
                            {colaborador.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(colaborador.status)}`} />
                      </div>
                      
                      <div>
                        <p className="font-medium">{colaborador.nome}</p>
                        <p className="text-sm text-muted-foreground">{colaborador.departamento}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={colaborador.status === 'online' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {getStatusText(colaborador.status)}
                      </Badge>
                      
                      {atendenteEscolhido === colaborador.nome && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <h3 className="font-semibold mb-3">Observações para o novo atendente</h3>
            <Textarea
              placeholder="Adicione observações sobre o caso, contexto da conversa, ou instruções especiais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>O cliente será notificado sobre a transferência</span>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleTransfer}
                disabled={!atendenteEscolhido || isTransferring}
              >
                {isTransferring ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transferindo...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Transferir Atendimento</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Histórico de Transferências (se houver) */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-sm mb-2">Histórico de Transferências</h4>
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>14:20 - João Silva → Ana Costa</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}