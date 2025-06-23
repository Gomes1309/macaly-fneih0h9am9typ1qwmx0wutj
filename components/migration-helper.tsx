'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Users,
  Building2,
  Settings,
  FileText,
  Info,
  ExternalLink
} from 'lucide-react'
import { apiClient } from '@/hooks/use-api'

interface MigrationStats {
  clientes: number
  usuarios: number
  configuracoes: number
  logs: number
}

interface MigrationResult {
  clientes: number
  usuarios: number
  configuracoes: number
  errors: string[]
}

interface MigrationStatus {
  success: boolean
  stats: MigrationStats
  message?: string
  fallback?: string
}

export function MigrationHelper() {
  const [stats, setStats] = useState<MigrationStats | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [databaseStatus, setDatabaseStatus] = useState<'loading' | 'postgres' | 'localStorage'>('loading')
  const [statusMessage, setStatusMessage] = useState<string>('')

  console.log('🔄 MigrationHelper carregado')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const result: MigrationStatus = await apiClient.getMigrationStatus()
      console.log('📊 Status do banco:', result)
      
      if (result.success) {
        setStats(result.stats)
        setDatabaseStatus(result.fallback === 'localStorage' ? 'localStorage' : 'postgres')
        setStatusMessage(result.message || '')
        console.log('📊 Stats carregadas:', result.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
      setDatabaseStatus('localStorage')
      setStatusMessage('Erro de conexão - usando localStorage')
    }
  }

  const migrateFromLocalStorage = async () => {
    console.log('🚀 Iniciando migração do localStorage')
    setMigrating(true)
    setProgress(0)
    setMigrationResult(null)

    try {
      // Verificar se PostgreSQL está disponível
      if (databaseStatus === 'localStorage') {
        alert('⚠️ PostgreSQL não configurado. Configure primeiro o banco de dados no Vercel.')
        return
      }

      // Buscar dados do localStorage
      const clientesLS = localStorage.getItem('ag_clientes')
      const usuariosLS = localStorage.getItem('ag_usuarios')
      const configsLS = localStorage.getItem('ag_configuracoes')

      const data = {
        clientes: clientesLS ? JSON.parse(clientesLS) : [],
        usuarios: usuariosLS ? JSON.parse(usuariosLS) : [],
        configuracoes: configsLS ? JSON.parse(configsLS) : {}
      }

      console.log('📦 Dados encontrados no localStorage:', {
        clientes: data.clientes.length,
        usuarios: data.usuarios.length,
        configuracoes: Object.keys(data.configuracoes).length
      })

      setProgress(25)

      // Enviar para migração
      const result = await apiClient.migrateData(data)
      setProgress(75)

      if (result.success) {
        setMigrationResult(result.results)
        setProgress(100)
        
        // Recarregar stats
        await loadStats()
        
        console.log('✅ Migração concluída:', result.results)
        alert('✅ Migração concluída com sucesso!')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('❌ Erro na migração:', error)
      alert('❌ Erro na migração: ' + (error as Error).message)
    } finally {
      setMigrating(false)
      setProgress(0)
    }
  }

  const clearLocalStorage = () => {
    if (confirm('⚠️ Deseja limpar todos os dados do localStorage? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('ag_clientes')
      localStorage.removeItem('ag_usuarios')
      localStorage.removeItem('ag_configuracoes')
      localStorage.removeItem('ag_user')
      alert('🗑️ localStorage limpo!')
      console.log('🗑️ localStorage limpo')
    }
  }

  const hasLocalStorageData = () => {
    return !!(
      localStorage.getItem('ag_clientes') ||
      localStorage.getItem('ag_usuarios') ||
      localStorage.getItem('ag_configuracoes')
    )
  }

  const openVercelDashboard = () => {
    window.open('https://vercel.com/dashboard', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Status da Configuração */}
      {databaseStatus === 'localStorage' && (
        <Card className="ag-card border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-600" />
              PostgreSQL Não Configurado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                Para usar o banco de dados PostgreSQL e ter dados permanentes, configure no Vercel:
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 ml-4 list-decimal">
                <li>Acesse o Vercel Dashboard</li>
                <li>Vá em "Storage" → "Create Database" → "Postgres"</li>
                <li>Conecte ao seu projeto</li>
                <li>As variáveis de ambiente serão configuradas automaticamente</li>
                <li>Reimplante o projeto</li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={openVercelDashboard}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Vercel Dashboard
              </Button>
              <Button variant="outline" onClick={loadStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar Novamente
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              💡 Enquanto isso, o sistema continua funcionando com localStorage (dados locais apenas).
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status do Banco de Dados */}
      <Card className={`ag-card border-l-4 ${databaseStatus === 'postgres' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className={`h-5 w-5 ${databaseStatus === 'postgres' ? 'text-green-600' : 'text-blue-600'}`} />
            Status do Banco de Dados
            <Badge variant="outline" className={databaseStatus === 'postgres' ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}>
              {databaseStatus === 'postgres' ? 'PostgreSQL' : 'localStorage'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statusMessage && (
            <p className="text-sm text-muted-foreground mb-4">{statusMessage}</p>
          )}
          
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Clientes</span>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {stats?.clientes || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Usuários</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {stats?.usuarios || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Configs</span>
              </div>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {stats?.configuracoes || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Logs</span>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {stats?.logs || 0}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadStats}
              disabled={migrating}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Migração do localStorage */}
      {hasLocalStorageData() && (
        <Card className="ag-card border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Migração do localStorage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Dados encontrados no localStorage
                </span>
              </div>
              <p className="text-xs text-orange-700">
                Foi detectado que você possui dados salvos localmente. 
                {databaseStatus === 'postgres' 
                  ? ' Migre-os para o banco de dados PostgreSQL para maior segurança e acesso de qualquer lugar.'
                  : ' Configure primeiro o PostgreSQL no Vercel para fazer a migração.'
                }
              </p>
            </div>

            {migrating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Migrando dados...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {migrationResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Migração Concluída
                  </span>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <p>✅ {migrationResult.clientes} clientes migrados</p>
                  <p>✅ {migrationResult.usuarios} usuários migrados</p>
                  <p>✅ {migrationResult.configuracoes} configurações migradas</p>
                  {migrationResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-600 font-medium">Erros encontrados:</p>
                      {migrationResult.errors.map((error, index) => (
                        <p key={index} className="text-red-600 text-xs">• {error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={migrateFromLocalStorage}
                disabled={migrating || databaseStatus === 'localStorage'}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
              >
                {migrating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {databaseStatus === 'localStorage' ? 'Configure PostgreSQL Primeiro' : 'Migrar Dados'}
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={clearLocalStorage}
                disabled={migrating}
              >
                🗑️ Limpar localStorage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Final */}
      {databaseStatus === 'postgres' && stats && (stats.clientes > 0 || stats.usuarios > 0) && (
        <Card className="ag-card border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Sistema Configurado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              ✅ Banco de dados PostgreSQL ativo e funcionando!<br/>
              ✅ Dados sendo salvos permanentemente no Vercel Postgres<br/>
              ✅ Backup automático e acesso de qualquer lugar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}