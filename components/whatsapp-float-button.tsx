'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFloatButton() {
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  console.log('WhatsApp float button rendered')

  useEffect(() => {
    // Simular chegada de mensagens
    const timer = setTimeout(() => {
      setHasNewMessages(true)
      setMessageCount(2)
      console.log('New WhatsApp messages detected')
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com minha contabilidade.')
    window.open(`https://wa.me/5511999990000?text=${message}`, '_blank')
    console.log('WhatsApp opened from float button')
    
    // Reset notifications
    setHasNewMessages(false)
    setMessageCount(0)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className={`h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          hasNewMessages 
            ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
        size="icon"
      >
        <MessageCircle className="h-8 w-8 text-white" />
        
        {hasNewMessages && messageCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
            {messageCount}
          </Badge>
        )}
      </Button>
      
      {hasNewMessages && (
        <div className="absolute bottom-20 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 max-w-xs animate-in slide-in-from-bottom-2">
          <p className="text-sm font-medium">Nova mensagem!</p>
          <p className="text-xs text-muted-foreground">
            Você tem {messageCount} mensagem(s) no WhatsApp
          </p>
        </div>
      )}
    </div>
  )
}