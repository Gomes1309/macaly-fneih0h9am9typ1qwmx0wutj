"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertCircle, Database, Server, ArrowRight, Zap } from 'lucide-react'

interface DatabaseStatus {
  success: boolean
  provider?: string
  connection?: any
  stats?: {
    clientes: number
    usuarios: number
    configuracoes: number
    logs: number
  }
  message?: string
  error?: string
  instructions?: string[]
}

interface MigrationResult {
  success: boolean
  provider?: string
  results?: {
    clientes: number
    usuarios: number
    configuracoes: number
    errors: string[]
  }
  message?: string
  error?: string
}

function MigrationHelper() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  const checkStatus = async () => {
    console.log('🔍 Verificando status do banco Neon...')
    setIsLoading(true)
    try {
      const response = await fetch('/api/migrate')
      const data = await response.json()
      console.log('📊 Status recebido:', data)
      setStatus(data)
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error)
      setStatus({
        success: false,
        error: 'CONNECTION_ERROR',
        message: 'Não foi possível conectar com o servidor'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const migrateData = async () => {
    console.log('🚀 Iniciando migração para Neon...')
    setIsMigrating(true)
    setMigrationResult(null)

    try {
      // Buscar dados do localStorage
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]')
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const configuracoes = JSON.parse(localStorage.getItem('configuracoes') || '{}')

      console.log('📦 Dados para migração:', {
        clientes: clientes.length,
        usuarios: usuarios.length,
        configuracoes: Object.keys(configuracoes).length
      })

      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientes,
          usuarios,
          configuracoes
        })
      })

      const result = await response.json()
      console.log('✅ Resultado da migração:', result)
      setMigrationResult(result)

      if (result.success) {
        // Limpar localStorage após migração bem-sucedida
        localStorage.removeItem('clientes')
        localStorage.removeItem('usuarios')
        localStorage.removeItem('configuracoes')
        console.log('🧹 localStorage limpo após migração')
        
        // Atualizar status
        await checkStatus()
      }
    } catch (error) {
      console.error('❌ Erro na migração:', error)
      setMigrationResult({
        success: false,
        error: 'MIGRATION_ERROR',
        message: 'Erro na migração: ' + (error as Error).message
      })
    } finally {
      setIsMigrating(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const renderStatus = () => {
    if (isLoading) {
      return (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 animate-spin" />
              Verificando Conexão...
              <Badge variant="outline">Carregando</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={50} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Testando conexão com o banco Neon...
            </p>
          </CardContent>
        </Card>
      )
    }

    if (!status) return null

    if (status.success && status.provider === 'neon') {
      return (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Neon Conectado
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✅ Online
              </Badge>
            </CardTitle>
            <CardDescription>
              Banco de dados Neon funcionando perfeitamente!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.stats?.clientes || 0}</div>
                <div className="text-sm text-muted-foreground">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{status.stats?.usuarios || 0}</div>
                <div className="text-sm text-muted-foreground">Usuários</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{status.stats?.configuracoes || 0}</div>
                <div className="text-sm text-muted-foreground">Configurações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{status.stats?.logs || 0}</div>
                <div className="text-sm text-muted-foreground">Logs</div>
              </div>
            </div>
            
            {status.connection && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>🎯 Conectado ao Neon!</strong> 
                  {status.connection.version && (
                    <span className="ml-2 text-xs">
                      {status.connection.version.split(' ')[0]}
                    </span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    if (status.error === 'NEON_NOT_CONFIGURED') {
      return (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Neon Não Configurado
              <Badge variant="destructive">Ação Necessária</Badge>
            </CardTitle>
            <CardDescription>
              Configure a variável POSTGRES_URL no Vercel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
            
            {status.instructions && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Instruções:</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {status.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Erro de Conexão
            <Badge variant="destructive">Erro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {status.message || 'Erro desconhecido ao conectar com o banco'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const renderMigration = () => {
    // Verificar se há dados no localStorage
    const hasLocalData = () => {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]')
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const configuracoes = JSON.parse(localStorage.getItem('configuracoes') || '{}')
      
      return clientes.length > 0 || usuarios.length > 0 || Object.keys(configuracoes).length > 0
    }

    if (!hasLocalData() && !migrationResult) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Migração de Dados
            </CardTitle>
            <CardDescription>
              Nenhum dado encontrado no localStorage para migrar.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }

    if (migrationResult) {
      return (
        <Card className={`border-l-4 ${migrationResult.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {migrationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Resultado da Migração
              <Badge variant={migrationResult.success ? "default" : "destructive"}>
                {migrationResult.success ? "Sucesso" : "Erro"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {migrationResult.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {migrationResult.success && migrationResult.results && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {migrationResult.results.clientes}
                  </div>
                  <div className="text-sm text-muted-foreground">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {migrationResult.results.usuarios}
                  </div>
                  <div className="text-sm text-muted-foreground">Usuários</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {migrationResult.results.configuracoes}
                  </div>
                  <div className="text-sm text-muted-foreground">Configurações</div>
                </div>
              </div>
            )}
            
            {migrationResult.results?.errors && migrationResult.results.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <details>
                    <summary className="cursor-pointer">
                      {migrationResult.results.errors.length} erro(s) encontrado(s)
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs">
                      {migrationResult.results.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </details>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Migrar para Neon
          </CardTitle>
          <CardDescription>
            Transferir dados do localStorage para o banco Neon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Esta ação irá transferir todos os dados locais para o banco Neon e limpar o localStorage.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={migrateData} 
              disabled={isMigrating || (status && !status.success)}
              className="w-full"
            >
              {isMigrating ? (
                <>
                  <Database className="mr-2 h-4 w-4 animate-spin" />
                  Migrando para Neon...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Migrar Dados para Neon
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Banco de Dados Neon</h2>
          <p className="text-muted-foreground">
            Configuração e migração exclusiva para Neon PostgreSQL
          </p>
        </div>
        <Button onClick={checkStatus} disabled={isLoading || false} variant="outline">
          {isLoading ? (
            <Database className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Verificar Status
        </Button>
      </div>

      {renderStatus()}
      
      <Separator />
      
      {renderMigration()}
    </div>
  )
}

export default MigrationHelper