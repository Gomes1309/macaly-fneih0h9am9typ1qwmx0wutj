'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, User, Building2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchFunction } from '@/components/search-function'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  title?: string
  userName?: string
  userRole?: string
}

export function Header({ 
  title = 'Dashboard', 
  userName = 'Admin',
  userRole = 'Administrador'
}: HeaderProps) {
  console.log('Header rendered with title:', title, 'user:', userName)

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Left side - Logo and Breadcrumb */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold">AG Assessoria</h2>
            <p className="text-xs text-muted-foreground">Sistema Contábil</p>
          </div>
        </Link>
        
        <div className="h-6 w-px bg-border mx-4" />
        
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          {title !== 'Dashboard' && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Right side - Search, Notifications, User */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block">
          <SearchFunction />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Vencimento de IRPJ</span>
                <span className="text-sm text-muted-foreground">
                  Empresa ABC Ltda - Vence hoje
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Documento enviado</span>
                <span className="text-sm text-muted-foreground">
                  DAS enviado para XYZ Comércio
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Alvará vencendo</span>
                <span className="text-sm text-muted-foreground">
                  Renovação necessária em 7 dias
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
                <AvatarImage src="/avatars/admin.png" alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userRole}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/configuracoes" className="flex items-center w-full">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}