'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket,
  Database,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Terminal,
  Settings,
  RefreshCw
} from 'lucide-react'

export function ProductionHelper() {
  const [copied, setCopied] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [deployStatus, setDeployStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const checkDeployment = async () => {
    setChecking(true)
    try {
      // Simular check do deployment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você pode fazer uma chamada real para verificar o status
      const response = await fetch('/api/migrate')
      const data = await response.json()
      
      if (data.success && !data.fallback) {
        setDeployStatus('success')
      } else {
        setDeployStatus('error')
      }
    } catch (error) {
      setDeployStatus('error')
    } finally {
      setChecking(false)
    }
  }

  const deployCommands = [
    'git add .',
    'git commit -m "Configure PostgreSQL and production setup"',
    'git push origin main'
  ]

  return (
    <div className="space-y-6">
      {/* Status do Deploy */}
      <Card className="ag-card border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            Status da Produção
            <Badge variant={deployStatus === 'success' ? 'default' : 'secondary'}>
              {deployStatus === 'success' ? 'Ativo' : 'Pendente'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                PostgreSQL Configurado na Vercel
              </span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              O banco de dados foi configurado no Vercel Dashboard. Agora você precisa fazer o deploy para ativar.
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={checkDeployment}
                disabled={checking}
                size="sm"
                variant="outline"
              >
                {checking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verificar Status
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                size="sm"
                className="bg-black hover:bg-gray-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Vercel Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comandos de Deploy */}
      <Card className="ag-card border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-600" />
            Deploy para Produção  
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-3">
              <strong>Opção 1:</strong> Execute estes comandos no terminal do seu projeto:
            </p>
            
            <div className="space-y-2">
              {deployCommands.map((cmd, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded font-mono text-sm">
                  <span className="text-green-400 flex-1">{cmd}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(cmd, `cmd-${index}`)}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    {copied === `cmd-${index}` ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-3">
              <strong>Opção 2:</strong> Deploy direto pela Vercel:
            </p>
            <Button 
              onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
              className="bg-black hover:bg-gray-800"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Fazer Deploy na Vercel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Pós-Deploy */}
      <Card className="ag-card border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Checklist Pós-Deploy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border-2 border-purple-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-purple-600" />
              </div>
              <span>PostgreSQL configurado no Vercel Dashboard</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
                {deployStatus === 'success' ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                )}
              </div>
              <span>Deploy realizado com sucesso</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded"></div>
              </div>
              <span>Migração de dados do localStorage</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded"></div>
              </div>
              <span>Teste todas as funcionalidades em produção</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URLs de Produção */}
      <Card className="ag-card border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-indigo-600" />
            URLs de Produção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">App Principal:</span>
              <code className="text-xs bg-white px-2 py-1 rounded">seu-app.vercel.app</code>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(window.location.origin, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">API Status:</span>
              <code className="text-xs bg-white px-2 py-1 rounded">/api/migrate</code>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`${window.location.origin}/api/migrate`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}