import { useState, useEffect } from 'react'

// Hook genérico para APIs
export function useApi<T = any>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data || result)
      } else {
        throw new Error(result.message || 'Erro na requisição')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro na API:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  return { data, loading, error, refetch: fetchData }
}

// Hook para clientes
export function useClientes(filters?: {
  search?: string
  tipo?: string
  status?: string
  grupo?: string
  page?: number
  limit?: number
}) {
  const params = new URLSearchParams()
  
  if (filters?.search) params.set('search', filters.search)
  if (filters?.tipo) params.set('tipo', filters.tipo)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.grupo) params.set('grupo', filters.grupo)
  if (filters?.page) params.set('page', filters.page.toString())
  if (filters?.limit) params.set('limit', filters.limit.toString())

  const endpoint = `/api/clientes${params.toString() ? `?${params.toString()}` : ''}`
  
  return useApi(endpoint)
}

// Hook para configurações
export function useConfiguracoes(categoria?: string) {
  const endpoint = `/api/configuracoes${categoria ? `?categoria=${categoria}` : ''}`
  return useApi(endpoint)
}

// Hook para usuários
export function useUsuarios() {
  return useApi('/api/usuarios')
}

// Funções de mutação
export const apiClient = {
  // Autenticação
  async login(email: string, senha: string) {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, action: 'login' })
    })
    return response.json()
  },

  async forgotPassword(email: string) {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action: 'forgot-password' })
    })
    return response.json()
  },

  async resetPassword(email: string, codigo: string, novaSenha: string) {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo, novaSenha, action: 'reset-password' })
    })
    return response.json()
  },

  // Clientes
  async createCliente(clienteData: any) {
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteData)
    })
    return response.json()
  },

  async updateCliente(id: string, clienteData: any) {
    const response = await fetch('/api/clientes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...clienteData })
    })
    return response.json()
  },

  async deleteCliente(id: string) {
    const response = await fetch(`/api/clientes?id=${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  // Configurações
  async saveConfiguracoes(configs: any) {
    const response = await fetch('/api/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configs)
    })
    return response.json()
  },

  async updateConfiguracao(chave: string, valor: any, categoria: string = 'sistema') {
    const response = await fetch('/api/configuracoes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chave, valor, categoria })
    })
    return response.json()
  },

  // Usuários
  async createUsuario(userData: any) {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  async updateUsuario(id: string, userData: any) {
    const response = await fetch('/api/usuarios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...userData })
    })
    return response.json()
  },

  async deleteUsuario(id: string) {
    const response = await fetch(`/api/usuarios?id=${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  // Migração
  async migrateData(data: { clientes?: any[], usuarios?: any[], configuracoes?: any }) {
    const response = await fetch('/api/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  async getMigrationStatus() {
    const response = await fetch('/api/migrate')
    return response.json()
  }
}

// Hook para estado de autenticação
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('ag_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    try {
      const result = await apiClient.login(email, senha)
      if (result.success) {
        setUser(result.user)
        localStorage.setItem('ag_user', JSON.stringify(result.user))
        return result
      }
      throw new Error(result.message)
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ag_user')
    window.location.href = '/login'
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }
}