'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Copy,
  Settings,
  Zap
} from 'lucide-react'

export function PostgresSetupGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const steps = [
    {
      id: 1,
      title: "Acesse o Vercel Dashboard",
      description: "Entre na sua conta e selecione o projeto",
      action: "Abrir Vercel",
      actionUrl: "https://vercel.com/dashboard"
    },
    {
      id: 2,
      title: "Vá para Settings",
      description: "Clique na aba 'Settings' do projeto",
      image: "⚙️"
    },
    {
      id: 3,
      title: "Environment Variables",
      description: "Clique em 'Environment Variables'",
      image: "🔐"
    },
    {
      id: 4,
      title: "Adicionar POSTGRES_URL",
      description: "Adicione sua connection string do Neon",
      image: "🔗"
    },
    {
      id: 5,
      title: "Salvar Configuração",
      description: "Salve as variáveis de ambiente",
      image: "💾"
    },
    {
      id: 6,
      title: "Redeploy",
      description: "Faça o redeploy para ativar as mudanças",
      image: "🚀"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <Card className="ag-card border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Integração com Neon Detectada
            <Badge variant="default">Configurando</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-3">
              <strong>✅ Neon configurado!</strong> Agora precisa configurar as variáveis de ambiente no Vercel.
            </p>
            <div className="space-y-2 text-xs text-green-700">
              <p><strong>1.</strong> Copie a connection string do Neon</p>
              <p><strong>2.</strong> Adicione no Vercel como POSTGRES_URL</p>
              <p><strong>3.</strong> Faça o redeploy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card className="ag-card border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Guia de Configuração PostgreSQL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium">Progresso:</span>
            <div className="flex items-center gap-1">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{steps[currentStep - 1]?.image || "📋"}</div>
              <div>
                <h3 className="font-semibold text-blue-800">
                  Passo {currentStep}: {steps[currentStep - 1]?.title}
                </h3>
                <p className="text-sm text-blue-600">
                  {steps[currentStep - 1]?.description}
                </p>
                {currentStep === 4 && (
                  <div className="mt-2 p-2 bg-white border rounded text-xs">
                    <p className="text-gray-600 mb-1">Nome da variável:</p>
                    <code className="bg-gray-100 px-2 py-1 rounded">POSTGRES_URL</code>
                    <p className="text-gray-600 mt-2 mb-1">Valor: Sua connection string do Neon</p>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                      postgresql://user:password@host/database?sslmode=require
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {steps[currentStep - 1]?.actionUrl && (
                <Button 
                  onClick={() => window.open(steps[currentStep - 1].actionUrl, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {steps[currentStep - 1].action}
                </Button>
              )}
              
              {currentStep < steps.length && (
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Próximo Passo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentStep > 1 && (
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Voltar
                </Button>
              )}
            </div>
          </div>

          {/* All Steps Overview */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Visão Geral dos Passos:</h4>
            <div className="grid gap-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    currentStep >= step.id 
                      ? 'border-green-200 bg-green-50' 
                      : currentStep === step.id 
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="text-lg">{step.image || "📋"}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  {currentStep >= step.id && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="ag-card border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-yellow-600" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Neon PostgreSQL</p>
                <p className="text-xs text-muted-foreground">
                  Banco serverless com plano gratuito generoso - ideal para produção.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Variáveis Automáticas</p>
                <p className="text-xs text-muted-foreground">
                  O Vercel configura automaticamente as variáveis POSTGRES_URL quando você conecta o banco.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Deploy Necessário</p>
                <p className="text-xs text-muted-foreground">
                  Após configurar, faça um deploy para que as mudanças tenham efeito.
                </p>
              </div>
            </div>
          </div>

          {currentStep === steps.length && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Configuração Completa!
                </span>
              </div>
              <p className="text-xs text-green-700 mb-3">
                Agora você pode fazer o deploy para ativar o PostgreSQL.
              </p>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => window.open('/configuracoes', '_self')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Ir para Deploy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}