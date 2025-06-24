'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  ChevronRight,
  KeyRound,
  ArrowLeft
} from 'lucide-react'

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'recovery' | 'reset'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    code: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  console.log('Auth page rendered, mode:', authMode)

  // Sistema de autenticação simulado
  const mockUsers = [
    { email: 'admin@agassessoriaonline.com.br', password: '123456', role: 'admin', name: 'Administrador' },
    { email: 'contador@agassessoriaonline.com.br', password: '123456', role: 'contador', name: 'João Silva' },
    { email: 'assistente@agassessoriaonline.com.br', password: '123456', role: 'assistente', name: 'Maria Santos' },
    { email: 'cliente@exemplo.com.br', password: '123456', role: 'cliente', name: 'Cliente Exemplo' }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('Login attempt:', formData.email)
    
    // Simular autenticação
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === formData.email && u.password === formData.password)
      
      if (user) {
        console.log('Login successful:', user)
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        // Redirecionamento baseado no papel
        if (user.role === 'cliente') {
          router.push('/cliente')
        } else {
          router.push('/')
        }
      } else {
        setError('E-mail ou senha incorretos')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('Password recovery for:', formData.email)
    
    // Simular envio de código
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === formData.email)
      if (user) {
        setSuccess('Código de recuperação enviado para seu e-mail!')
        setAuthMode('reset')
        // Simular código enviado: 123456
      } else {
        setError('E-mail não encontrado no sistema')
      }
      setIsLoading(false)
    }, 2000)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('Password reset with code:', formData.code)
    
    if (formData.code !== '123456') {
      setError('Código de verificação inválido')
      setIsLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }
    
    // Simular reset
    setTimeout(() => {
      setSuccess('Senha alterada com sucesso! Você pode fazer login agora.')
      setAuthMode('login')
      setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '', code: '' })
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16 bg-gradient-to-br from-primary to-primary/80">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-12">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AG Assessoria</h1>
                <p className="text-white/80">Sistema Contábil Integrado</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                {authMode === 'login' && 'Acesso ao Sistema'}
                {authMode === 'recovery' && 'Recuperar Senha'}
                {authMode === 'reset' && 'Nova Senha'}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                {authMode === 'login' && 'Entre com suas credenciais para acessar o sistema completo de gestão contábil.'}
                {authMode === 'recovery' && 'Digite seu e-mail para receber o código de recuperação.'}
                {authMode === 'reset' && 'Digite o código recebido e sua nova senha.'}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-sm">SSL Protegido</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-sm">LGPD Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">AG Assessoria</h1>
                <p className="text-muted-foreground text-sm">Sistema Contábil</p>
              </div>
            </div>

            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center">
                  {authMode === 'login' && 'Entrar no Sistema'}
                  {authMode === 'recovery' && 'Recuperar Senha'}
                  {authMode === 'reset' && 'Redefinir Senha'}
                </CardTitle>
                <CardDescription className="text-center">
                  {authMode === 'login' && 'Digite suas credenciais para acessar'}
                  {authMode === 'recovery' && 'Digite seu e-mail cadastrado'}
                  {authMode === 'reset' && 'Digite o código e sua nova senha'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Login Form */}
                {authMode === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{success}</AlertDescription>
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

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-primary hover:underline p-0"
                        onClick={() => setAuthMode('recovery')}
                      >
                        Esqueci minha senha
                      </Button>
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
                          <span>Entrar no Sistema</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                )}

                {/* Recovery Form */}
                {authMode === 'recovery' && (
                  <form onSubmit={handlePasswordRecovery} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="recovery-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recovery-email"
                          type="email"
                          placeholder="Digite seu e-mail cadastrado"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Enviar Código</span>
                        </div>
                      )}
                    </Button>

                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setAuthMode('login')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar para Login
                    </Button>
                  </form>
                )}

                {/* Reset Form */}
                {authMode === 'reset' && (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="code">Código de Verificação</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="code"
                          type="text"
                          placeholder="Digite o código de 6 dígitos"
                          className="pl-10"
                          value={formData.code}
                          onChange={(e) => handleInputChange('code', e.target.value)}
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Código de teste: 123456</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua nova senha"
                          className="pl-10 pr-10"
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirme sua nova senha"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Alterando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <KeyRound className="h-4 w-4" />
                          <span>Alterar Senha</span>
                        </div>
                      )}
                    </Button>

                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setAuthMode('recovery')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  </form>
                )}

                {/* Demo Users */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-center text-muted-foreground mb-3">
                    💡 Usuários de demonstração:
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>👤 Admin: admin@agassessoriaonline.com.br / 123456</div>
                    <div>📊 Contador: contador@agassessoriaonline.com.br / 123456</div>
                    <div>👤 Cliente: cliente@exemplo.com.br / 123456</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              <p>© 2024 AG Assessoria Empresarial. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}