'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export function WhatsAppButton({ 
  phoneNumber = '5511999999999', 
  message = 'Olá! Preciso de ajuda com o sistema contábil.',
  className
}: WhatsAppButtonProps) {
  const handleClick = () => {
    console.log('WhatsApp button clicked, phone:', phoneNumber)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg',
        'bg-green-500 hover:bg-green-600 text-white',
        'animate-pulse hover:animate-none',
        'z-50 border-2 border-white',
        className
      )}
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Abrir WhatsApp</span>
    </Button>
  )
}