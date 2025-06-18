'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  ChevronRight,
  FileText,
  Calculator,
  MessageCircle,
  Download,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Documentos Online',
    description: 'Acesse seus documentos contábeis 24/7'
  },
  {
    icon: Calculator,
    title: 'Impostos em Dia',
    description: 'Acompanhe vencimentos e pagamentos'
  },
  {
    icon: MessageCircle,
    title: 'Comunicação Direta',
    description: 'Fale conosco via WhatsApp integrado'
  },
  {
    icon: Download,
    title: 'Downloads Seguros',
    description: 'Baixe guias e comprovantes com segurança'
  }
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  console.log('Login page rendered')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('Login attempt:', formData.email)
    
    // Simular autenticação
    setTimeout(() => {
      if (formData.email && formData.password) {
        console.log('Login successful, redirecting to client area')
        router.push('/cliente')
      } else {
        setError('Por favor, preencha todos os campos')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    console.log(`${field} updated:`, value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16 bg-gradient-to-br from-primary to-primary/80">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AG Assessoria</h1>
                <p className="text-white/80">Portal do Cliente</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Sua contabilidade na palma da mão
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Acesse documentos, acompanhe vencimentos e se comunique conosco de forma simples e segura.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-sm">Dados Protegidos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-sm">LGPD Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">AG Assessoria</h1>
                <p className="text-muted-foreground text-sm">Portal do Cliente</p>
              </div>
            </div>

            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center">
                  Bem-vindo de volta
                </CardTitle>
                <CardDescription className="text-center">
                  Entre com suas credenciais para acessar sua área
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@empresa.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.remember}
                        onCheckedChange={(checked) => handleInputChange('remember', checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Lembrar de mim
                      </Label>
                    </div>
                    
                    <Link 
                      href="/recuperar-senha" 
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Entrar na minha área</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Ainda não tem acesso?{' '}
                    <Link 
                      href="/contato" 
                      className="text-primary hover:underline font-medium"
                    >
                      Entre em contato conosco
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-muted-foreground">
              <p>© 2024 AG Assessoria Empresarial. Todos os direitos reservados.</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link href="/privacidade" className="hover:text-primary">
                  Política de Privacidade
                </Link>
                <span>•</span>
                <Link href="/termos" className="hover:text-primary">
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}