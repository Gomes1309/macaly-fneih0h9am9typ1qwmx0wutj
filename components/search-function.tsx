'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, User, Building, Calendar, X } from 'lucide-react'

interface SearchResult {
  id: string
  tipo: 'cliente' | 'documento' | 'vencimento' | 'parcelamento'
  titulo: string
  descricao: string
  data?: string
  status?: string
  url?: string
}

// Mock de dados expandido para busca completa
const mockData: SearchResult[] = [
  // Clientes
  {
    id: '1',
    tipo: 'cliente',
    titulo: 'Maria Silva Santos',
    descricao: 'MS Comércio de Roupas Ltda - CNPJ: 12.345.678/0001-90',
    url: '/cliente'
  },
  {
    id: '2',
    tipo: 'cliente',
    titulo: 'João Carlos Oliveira',
    descricao: 'JC Transportes Ltda - CNPJ: 98.765.432/0001-10',
    url: '/cliente'
  },
  {
    id: '3',
    tipo: 'cliente',
    titulo: 'Ana Paula Costa',
    descricao: 'APC Consultoria ME - CNPJ: 33.444.555/0001-22',
    url: '/cliente'
  },
  // Documentos
  {
    id: '4',
    tipo: 'documento',
    titulo: 'DAS Junho 2024',
    descricao: 'Guia de Pagamento - Simples Nacional - Maria Silva',
    data: '2024-06-15',
    status: 'disponível',
    url: '/documentos'
  },
  {
    id: '5',
    tipo: 'documento',
    titulo: 'Balancete Maio 2024',
    descricao: 'Relatório Contábil Mensal - João Carlos',
    data: '2024-05-30',
    status: 'novo',
    url: '/documentos'
  },
  {
    id: '6',
    tipo: 'documento',
    titulo: 'Holerite Junho 2024',
    descricao: 'Folha de Pagamento - Ana Paula Costa',
    data: '2024-06-30',
    status: 'enviado',
    url: '/folha'
  },
  {
    id: '7',
    tipo: 'documento',
    titulo: 'Certidão Negativa',
    descricao: 'Certidão Federal - MS Comércio',
    data: '2024-06-10',
    status: 'válida',
    url: '/documentos'
  },
  // Parcelamentos
  {
    id: '8',
    tipo: 'parcelamento',
    titulo: 'Parcelamento INSS',
    descricao: 'João Carlos - 12 parcelas restantes',
    data: '2024-07-15',
    status: 'ativo',
    url: '/parcelamentos'
  },
  {
    id: '9',
    tipo: 'parcelamento',
    titulo: 'Parcelamento Simples Nacional',
    descricao: 'Maria Silva - 6 parcelas restantes',
    data: '2024-08-10',
    status: 'ativo',
    url: '/parcelamentos'
  },
  // Obrigações
  {
    id: '10',
    tipo: 'vencimento',
    titulo: 'ISS Municipal',
    descricao: 'Ana Paula Costa - Imposto Sobre Serviços',
    data: '2024-07-25',
    status: 'pendente',
    url: '/obrigacoes'
  },
  {
    id: '11',
    tipo: 'vencimento',
    titulo: 'FGTS',
    descricao: 'João Carlos - Fundo de Garantia',
    data: '2024-07-07',
    status: 'vencido',
    url: '/obrigacoes'
  },
  {
    id: '12',
    tipo: 'vencimento',
    titulo: 'IRPJ',
    descricao: 'Maria Silva - Imposto de Renda Pessoa Jurídica',
    data: '2024-07-31',
    status: 'pendente',
    url: '/obrigacoes'
  },
  // Declarações/Impostos
  {
    id: '13',
    tipo: 'documento',
    titulo: 'Declaração IRPJ 2024',
    descricao: 'Maria Silva - Apuração Anual',
    data: '2024-06-20',
    status: 'processando',
    url: '/impostos'
  },
  {
    id: '14',
    tipo: 'documento',
    titulo: 'Faturamento Mensal',
    descricao: 'João Carlos - Maio/2024',
    data: '2024-05-31',
    status: 'enviado',
    url: '/impostos'
  },
  // Alvarás
  {
    id: '15',
    tipo: 'documento',
    titulo: 'Alvará Funcionamento',
    descricao: 'APC Consultoria - Renovação 2024',
    data: '2024-12-31',
    status: 'vigente',
    url: '/alvaras'
  },
  // Honorários
  {
    id: '16',
    tipo: 'documento',
    titulo: 'Boleto Honorários Junho',
    descricao: 'Maria Silva - R$ 850,00',
    data: '2024-06-05',
    status: 'pago',
    url: '/honorarios'
  },
  {
    id: '17',
    tipo: 'documento',
    titulo: 'Boleto Honorários Junho',
    descricao: 'João Carlos - R$ 1.200,00',
    data: '2024-06-05',  
    status: 'pendente',
    url: '/honorarios'
  }
]

interface SearchFunctionProps {
  onClose?: () => void
}

export function SearchFunction({ onClose }: SearchFunctionProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  console.log('Search function rendered')

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true)
      
      // Simular busca com delay
      const searchTimer = setTimeout(() => {
        const filteredResults = mockData.filter(item =>
          item.titulo.toLowerCase().includes(query.toLowerCase()) ||
          item.descricao.toLowerCase().includes(query.toLowerCase())
        )
        
        setResults(filteredResults)
        setShowResults(true)
        setIsSearching(false)
        
        console.log('Search completed for:', query, 'Results:', filteredResults.length)
      }, 500)

      return () => clearTimeout(searchTimer)
    } else {
      setResults([])
      setShowResults(false)
      setIsSearching(false)
    }
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    console.log('Search result clicked:', result)
    
    if (result.url) {
      window.location.href = result.url
    } else {
      // Simular ação baseada no tipo
      switch (result.tipo) {
        case 'documento':
          alert(`Documento: ${result.titulo} - ${result.descricao}`)
          break
        case 'vencimento':
          alert(`Vencimento: ${result.titulo} - Data: ${result.data}`)
          break
        default:
          alert(`Item encontrado: ${result.titulo}`)
      }
    }
    
    if (onClose) onClose()
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'cliente':
        return <User className="h-4 w-4" />
      case 'documento':
        return <FileText className="h-4 w-4" />
      case 'vencimento':
        return <Calendar className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800'
      case 'documento':
        return 'bg-green-100 text-green-800'
      case 'vencimento':
        return 'bg-orange-100 text-orange-800'
      case 'parcelamento':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
      case 'disponível':
        return 'default'
      case 'pendente':
        return 'secondary'
      case 'vencido':
        return 'destructive'
      case 'novo':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes, documentos, parcelamentos, declarações, obrigações..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => {
              setQuery('')
              setResults([])
              setShowResults(false)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isSearching && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Buscando...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${getTypeColor(result.tipo)}`}>
                    {getIcon(result.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.descricao}</p>
                    {result.data && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.data).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getTypeColor(result.tipo)}`}>
                    {result.tipo}
                  </Badge>
                  {result.status && (
                    <Badge variant={getStatusColor(result.status)} className="text-xs">
                      {result.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && query.trim().length >= 2 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum resultado encontrado para "{query}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar por nome do cliente, tipo de documento ou CNPJ
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}