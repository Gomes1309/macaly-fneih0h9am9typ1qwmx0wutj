import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          senha_hash: string
          role: string
          permissoes: string[]
          ativo: boolean
          ultimo_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          senha_hash: string
          role?: string
          permissoes?: string[]
          ativo?: boolean
          ultimo_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          senha_hash?: string
          role?: string
          permissoes?: string[]
          ativo?: boolean
          ultimo_login?: string | null
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          razao_social: string
          nome_fantasia: string | null
          cnpj: string
          ie: string | null
          tipo: string
          status: string
          grupo: string
          email: string
          telefone: string
          whatsapp: string | null
          endereco: string | null
          cep: string | null
          responsavel: string | null
          observacoes: string | null
          atividade: string | null
          faturamento_anual: number
          funcionarios: number
          nirf: string | null
          contador_responsavel: string | null
          auditor: string | null
          data_contrato: string
          data_vencimento: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          razao_social: string
          nome_fantasia?: string | null
          cnpj: string
          ie?: string | null
          tipo?: string
          status?: string
          grupo?: string
          email: string
          telefone: string
          whatsapp?: string | null
          endereco?: string | null
          cep?: string | null
          responsavel?: string | null
          observacoes?: string | null
          atividade?: string | null
          faturamento_anual?: number
          funcionarios?: number
          nirf?: string | null
          contador_responsavel?: string | null
          auditor?: string | null
          data_contrato?: string
          data_vencimento?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          razao_social?: string
          nome_fantasia?: string | null
          cnpj?: string
          ie?: string | null
          tipo?: string
          status?: string
          grupo?: string
          email?: string
          telefone?: string
          whatsapp?: string | null
          endereco?: string | null
          cep?: string | null
          responsavel?: string | null
          observacoes?: string | null
          atividade?: string | null
          faturamento_anual?: number
          funcionarios?: number
          nirf?: string | null
          contador_responsavel?: string | null
          auditor?: string | null
          data_contrato?: string
          data_vencimento?: string
          updated_at?: string
        }
      }
      configuracoes: {
        Row: {
          id: string
          chave: string
          valor: string
          tipo: string
          descricao: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          chave: string
          valor: string
          tipo?: string
          descricao?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          chave?: string
          valor?: string
          tipo?: string
          descricao?: string | null
          updated_at?: string
        }
      }
      logs: {
        Row: {
          id: string
          usuario_id: string | null
          acao: string
          detalhes: any
          ip: string | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          acao: string
          detalhes?: any
          ip?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string | null
          acao?: string
          detalhes?: any
          ip?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Funções helper para o Supabase
export const getSupabaseClient = () => supabase

// Função para inicializar as tabelas no Supabase
export async function initializeSupabaseTables() {
  console.log('🔄 Inicializando tabelas do Supabase...')
  
  // As tabelas serão criadas via Supabase Dashboard ou SQL Editor
  // Aqui você pode adicionar verificações se necessário
  
  try {
    // Verificar se as tabelas existem
    const { data: usuarios } = await supabase.from('usuarios').select('count').limit(1)
    const { data: clientes } = await supabase.from('clientes').select('count').limit(1)
    const { data: configuracoes } = await supabase.from('configuracoes').select('count').limit(1)
    const { data: logs } = await supabase.from('logs').select('count').limit(1)
    
    console.log('✅ Tabelas Supabase verificadas')
    return { success: true, provider: 'supabase' }
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas Supabase:', error)
    throw error
  }
}

// Função para testar conexão com Supabase
export async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  try {
    const { data, error } = await supabase.from('usuarios').select('count').limit(1)
    
    if (error) {
      throw error
    }
    
    console.log('✅ Conexão com Supabase estabelecida')
    return {
      success: true,
      provider: 'supabase',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Falha na conexão com Supabase:', error)
    throw error
  }
}