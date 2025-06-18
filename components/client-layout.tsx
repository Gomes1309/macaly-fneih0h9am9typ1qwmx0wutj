'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Building2, 
  Bell, 
  LogOut, 
  Settings, 
  User, 
  MessageCircle,
  Shield 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ClientLayoutProps {
  children: React.ReactNode
  clientName?: string
  companyName?: string
}

export function ClientLayout({ 
  children, 
  clientName = "Cliente",
  companyName = "Empresa" 
}: ClientLayoutProps) {
  
  console.log('Client layout rendered for:', clientName)

  const handleLogout = () => {
    console.log('Client logout')
    window.location.href = '/login'
  }

  const handleSupport = () => {
    const message = encodeURIComponent(`Olá! Sou ${clientName} da ${companyName}. Preciso de suporte.`)
    window.open(`https://wa.me/5511999990000?text=${message}`, '_blank')
    console.log('Support WhatsApp opened')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/cliente" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">AG Assessoria</h1>
                <p className="text-xs text-muted-foreground">Portal do Cliente</p>
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Support Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSupport}
                className="hidden md:flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Suporte</span>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">DAS Disponível</span>
                      <span className="text-sm text-muted-foreground">
                        Guia de pagamento junho/2024
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">Vencimento Próximo</span>
                      <span className="text-sm text-muted-foreground">
                        ISS vence em 7 dias
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/cliente-avatar.png" alt={clientName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{clientName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {companyName}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSupport}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Suporte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Segurança</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-bold">AG Assessoria</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua contabilidade com excelência e tecnologia.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 contato@agassessoriaonline.com.br</p>
                <p>📱 (11) 99999-0000</p>
                <p>🌐 www.agassessoriaonline.com.br</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={handleSupport} className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 AG Assessoria Empresarial. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}