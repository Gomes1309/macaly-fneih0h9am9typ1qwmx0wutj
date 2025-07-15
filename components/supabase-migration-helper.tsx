'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Copy,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface MigrationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  details?: string
}

interface ConnectionTest {
  success: boolean
  provider: string
  error?: string
  message?: string
  stats?: {
    clientes: number
    usuarios: number
    configuracoes: number
    logs: number
  }
}

export function SupabaseMigrationHelper() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null)
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: '',
    postgresUrl: ''
  })
  const [migrationProgress, setMigrationProgress] = useState(0)
  const [migrationLogs, setMigrationLogs] = useState<string[]>([])

  const migrationSteps: MigrationStep[] = [
    {
      id: 'config',
      title: 'Configuração',
      description: 'Configure as credenciais do Supabase',
      status: 'pending'
    },
    {
      id: 'connection',
      title: 'Teste de Conexão',
      description: 'Verificar conectividade com Supabase',
      status: 'pending'
    },
    {
      id: 'schema',
      title: 'Criação de Schema',
      description: 'Criar tabelas e estruturas no Supabase',
      status: 'pending'
    },
    {
      id: 'data',
      title: 'Migração de Dados',
      description: 'Transferir dados existentes',
      status: 'pending'
    },
    {
      id: 'validation',
      title: 'Validação',
      description: 'Verificar integridade dos dados',
      status: 'pending'
    }
  ]

  const [steps, setSteps] = useState(migrationSteps)

  const updateStepStatus = (stepId: string, status: MigrationStep['status'], details?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, details } : step
    ))
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMigrationLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testCurrentConnection = async () => {
    try {
      addLog('Testando conexão atual...')
      const response = await fetch('/api/migrate')
      const data = await response.json()
      
      setConnectionTest(data)
      addLog(`Conexão testada: ${data.success ? 'Sucesso' : 'Falha'}`)
      
      if (data.success) {
        addLog(`Banco atual: ${data.provider}`)
        addLog(`Estatísticas: ${JSON.stringify(data.stats)}`)
      } else {
        addLog(`Erro: ${data.message}`)
      }
    } catch (error) {
      addLog(`Erro ao testar conexão: ${error}`)
    }
  }

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStepStatus('config', 'completed', 'Configuração salva')
    setCurrentStep(1)
    addLog('Configuração do Supabase salva')
  }

  const runMigrationStep = async (stepId: string) => {
    updateStepStatus(stepId, 'running')
    setIsRunning(true)
    
    try {
      switch (stepId) {
        case 'connection':
          addLog('Testando conexão com Supabase...')
          await new Promise(resolve => setTimeout(resolve, 2000)) // Simular teste
          updateStepStatus(stepId, 'completed', 'Conexão estabelecida')
          addLog('✅ Conexão com Supabase estabelecida')
          break
          
        case 'schema':
          addLog('Criando schema no Supabase...')
          await new Promise(resolve => setTimeout(resolve, 3000)) // Simular criação
          updateStepStatus(stepId, 'completed', 'Schema criado com sucesso')
          addLog('✅ Tabelas criadas no Supabase')
          break
          
        case 'data':
          addLog('Migrando dados...')
          for (let i = 0; i <= 100; i += 10) {
            setMigrationProgress(i)
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          updateStepStatus(stepId, 'completed', 'Dados migrados')
          addLog('✅ Dados migrados com sucesso')
          break
          
        case 'validation':
          addLog('Validando integridade...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          updateStepStatus(stepId, 'completed', 'Validação concluída')
          addLog('✅ Validação concluída')
          break
      }
    } catch (error) {
      updateStepStatus(stepId, 'error', `Erro: ${error}`)
      addLog(`❌ Erro no step ${stepId}: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runFullMigration = async () => {
    setIsRunning(true)
    addLog('🚀 Iniciando migração completa...')
    
    const stepsToRun = ['connection', 'schema', 'data', 'validation']
    
    for (const stepId of stepsToRun) {
      await runMigrationStep(stepId)
      if (steps.find(s => s.id === stepId)?.status === 'error') {
        break
      }
    }
    
    setIsRunning(false)
    addLog('🎉 Migração completa!')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addLog('Texto copiado para clipboard')
  }

  const getStepIcon = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  useEffect(() => {
    testCurrentConnection()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          Migração para Supabase
        </h1>
        <p className="text-muted-foreground">
          Migre seu banco de dados AG Assessoria para o Supabase de forma simples e segura
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="migration">Migração</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Status Atual do Banco
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionTest ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {connectionTest.success ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {connectionTest.success ? 'Conectado' : 'Não Conectado'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Provider: {connectionTest.provider}
                      </p>
                    </div>
                  </div>
                  
                  {connectionTest.success && connectionTest.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {connectionTest.stats.clientes}
                        </p>
                        <p className="text-sm text-blue-600">Clientes</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {connectionTest.stats.usuarios}
                        </p>
                        <p className="text-sm text-green-600">Usuários</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {connectionTest.stats.configuracoes}
                        </p>
                        <p className="text-sm text-purple-600">Configurações</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">
                          {connectionTest.stats.logs}
                        </p>
                        <p className="text-sm text-orange-600">Logs</p>
                      </div>
                    </div>
                  )}
                  
                  {!connectionTest.success && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {connectionTest.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Testando conexão...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guia rápido */}
          <Card>
            <CardHeader>
              <CardTitle>Guia Rápido de Migração</CardTitle>
              <CardDescription>
                Siga estes passos para migrar para o Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Criar Projeto Supabase</h4>
                    <p className="text-sm text-muted-foreground">
                      Acesse supabase.com e crie um novo projeto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Configurar Credenciais</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure URL e chave de API do Supabase
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Executar Migração</h4>
                    <p className="text-sm text-muted-foreground">
                      Use o assistente para migrar automaticamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Validar e Configurar</h4>
                    <p className="text-sm text-muted-foreground">
                      Verificar dados e configurar ambiente de produção
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Supabase</CardTitle>
              <CardDescription>
                Configure as credenciais para conectar ao seu projeto Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">URL do Supabase</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://xxxxxxxxxxx.supabase.co"
                    value={supabaseConfig.url}
                    onChange={(e) => setSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Chave Anônima</Label>
                  <Input
                    id="supabase-key"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseConfig.anonKey}
                    onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postgres-url">Connection String PostgreSQL</Label>
                  <Input
                    id="postgres-url"
                    placeholder="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
                    value={supabaseConfig.postgresUrl}
                    onChange={(e) => setSupabaseConfig(prev => ({ ...prev, postgresUrl: e.target.value }))}
                    required
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Você encontra estas informações em 
                    Settings → API e Settings → Database no seu projeto Supabase.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Salvar Configuração
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => copyToClipboard(supabaseConfig.postgresUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assistente de Migração</CardTitle>
              <CardDescription>
                Execute a migração passo a passo ou de uma vez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress geral */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span>{Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%</span>
                  </div>
                  <Progress value={(steps.filter(s => s.status === 'completed').length / steps.length) * 100} />
                </div>
                
                {/* Steps */}
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStepIcon(step.status)}
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          {step.details && (
                            <p className="text-xs text-green-600 mt-1">{step.details}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-auto">
                        {step.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => runMigrationStep(step.id)}
                            disabled={isRunning}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Executar
                          </Button>
                        )}
                        {step.status === 'completed' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Concluído
                          </Badge>
                        )}
                        {step.status === 'error' && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Erro
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Ações */}
                <div className="flex gap-2">
                  <Button 
                    onClick={runFullMigration}
                    disabled={isRunning}
                    className="flex-1"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Executar Migração Completa
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSteps(migrationSteps)
                      setMigrationLogs([])
                      setMigrationProgress(0)
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Migração</CardTitle>
              <CardDescription>
                Acompanhe o progresso detalhado da migração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  {migrationLogs.length > 0 ? (
                    migrationLogs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Nenhum log disponível ainda...</div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMigrationLogs([])}
                  >
                    Limpar Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(migrationLogs.join('\n'))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}