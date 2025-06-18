'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, X, Phone, Video } from 'lucide-react'

interface WhatsAppNotification {
  id: string
  nome: string
  empresa?: string
  mensagem: string
  timestamp: string
  avatar?: string
}

const notificacoes: WhatsAppNotification[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    empresa: 'ABC Comércio Ltda',
    mensagem: 'Preciso do DAS de março urgente!',
    timestamp: '2 min',
    avatar: ''
  },
  {
    id: '2',
    nome: 'João Carlos',
    empresa: 'XYZ Indústria',
    mensagem: 'Bom dia! O holerite já foi enviado?',
    timestamp: '5 min',
    avatar: ''
  }
]

export function WhatsAppNotifications() {
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simular recebimento de mensagens
    const timer = setTimeout(() => {
      setNotifications(notificacoes)
      setIsVisible(true)
      console.log('WhatsApp notifications shown:', notificacoes.length)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    console.log('Notification dismissed:', id)
    
    if (notifications.length === 1) {
      setIsVisible(false)
    }
  }

  const handleOpenWhatsApp = () => {
    window.open('/whatsapp', '_blank')
    console.log('WhatsApp opened from notification')
  }

  if (!isVisible || notifications.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-card border shadow-lg rounded-lg p-4 animate-in slide-in-from-right-full duration-500"
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.avatar} />
                <AvatarFallback className="bg-green-500 text-white">
                  {notification.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-2 w-2 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm truncate">{notification.nome}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={() => handleDismiss(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {notification.empresa && (
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  {notification.empresa}
                </p>
              )}
              
              <p className="text-sm text-foreground mb-2 line-clamp-2">
                {notification.mensagem}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {notification.timestamp}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleOpenWhatsApp}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {notifications.length > 1 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white border-green-500"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ver todas as mensagens ({notifications.length})
          </Button>
        </div>
      )}
    </div>
  )
}