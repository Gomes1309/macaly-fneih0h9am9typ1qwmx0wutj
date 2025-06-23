import { sql } from '@vercel/postgres'

// Verificar se temos conexão com PostgreSQL
const hasPostgresConnection = () => {
  return !!(process.env.POSTGRES_URL || process.env.DATABASE_URL)
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  tipo: 'pessoa_fisica' | 'pessoa_juridica' | 'mei' | 'produtor_rural'
  cpf_cnpj: string
  status: 'ativo' | 'inativo'
  whatsapp: string
  endereco: string
  created_at: Date
  updated_at: Date
}

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: 'admin' | 'contador' | 'assistente' | 'cliente'
  status: 'ativo' | 'inativo'
  permissoes: string[]
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export interface Configuracao {
  id: string
  chave: string
  valor: string
  tipo: 'string' | 'number' | 'boolean' | 'json'
  descricao?: string
  updated_at: Date
}

export async function initializeTables() {
  console.log('🔄 Inicializando tabelas do banco de dados...')
  
  // Verificar se temos conexão PostgreSQL
  if (!hasPostgresConnection()) {
    console.log('⚠️ PostgreSQL não configurado - usando localStorage como fallback')
    return {
      success: false,
      message: 'PostgreSQL não configurado. Configure as variáveis de ambiente no Vercel.',
      fallback: 'localStorage'
    }
  }
  
  try {
    // Tabela de usuários
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL, 
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'cliente',
        status VARCHAR(20) DEFAULT 'ativo',
        permissoes JSONB DEFAULT '[]',
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de clientes
    await sql`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        tipo VARCHAR(50) DEFAULT 'pessoa_fisica',
        cpf_cnpj VARCHAR(20),
        status VARCHAR(20) DEFAULT 'ativo',
        whatsapp VARCHAR(20),
        endereco TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de configurações
    await sql`
      CREATE TABLE IF NOT EXISTS configuracoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chave VARCHAR(255) UNIQUE NOT NULL,
        valor TEXT,
        tipo VARCHAR(20) DEFAULT 'string',
        descricao TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Tabela de logs
    await sql`
      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID,
        acao VARCHAR(255) NOT NULL,
        detalhes JSONB,
        ip VARCHAR(45),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('✅ Tabelas inicializadas com sucesso!')
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error)
    return {
      success: false,
      message: `Erro ao inicializar PostgreSQL: ${(error as Error).message}`,
      fallback: 'localStorage'
    }
  }
}

// Funções para Clientes
export async function createCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado')
  }
  
  const result = await sql`
    INSERT INTO clientes (nome, email, telefone, tipo, cpf_cnpj, status, whatsapp, endereco)
    VALUES (${cliente.nome}, ${cliente.email}, ${cliente.telefone}, ${cliente.tipo}, ${cliente.cpf_cnpj}, ${cliente.status}, ${cliente.whatsapp}, ${cliente.endereco})
    RETURNING *
  `
  return result.rows[0] as Cliente
}

export async function getClientes(): Promise<Cliente[]> {
  if (!hasPostgresConnection()) {
    return []
  }
  
  const result = await sql`SELECT * FROM clientes ORDER BY created_at DESC`
  return result.rows as Cliente[]
}

export async function updateCliente(id: string, data: Partial<Cliente>) {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado')
  }
  
  const result = await sql`
    UPDATE clientes 
    SET nome = ${data.nome}, email = ${data.email}, telefone = ${data.telefone}, 
        tipo = ${data.tipo}, cpf_cnpj = ${data.cpf_cnpj}, status = ${data.status},
        whatsapp = ${data.whatsapp}, endereco = ${data.endereco}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0] as Cliente
}

export async function deleteCliente(id: string) {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado')
  }
  
  await sql`DELETE FROM clientes WHERE id = ${id}`
}

// Funções para Usuários
export async function createUsuario(usuario: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado')
  }
  
  const result = await sql`
    INSERT INTO usuarios (nome, email, senha, tipo, status, permissoes)
    VALUES (${usuario.nome}, ${usuario.email}, ${usuario.senha}, ${usuario.tipo}, ${usuario.status}, ${JSON.stringify(usuario.permissoes)})
    RETURNING *
  `
  return result.rows[0] as Usuario
}

export async function getUsuarios(): Promise<Usuario[]> {
  if (!hasPostgresConnection()) {
    return []
  }
  
  const result = await sql`SELECT * FROM usuarios ORDER BY created_at DESC`
  return result.rows as Usuario[]
}

export async function getUserByEmail(email: string): Promise<Usuario | null> {
  if (!hasPostgresConnection()) {
    return null
  }
  
  const result = await sql`SELECT * FROM usuarios WHERE email = ${email} LIMIT 1`
  return result.rows[0] as Usuario || null
}

// Funções para Configurações
export async function getConfiguracoes(): Promise<Configuracao[]> {
  if (!hasPostgresConnection()) {
    return []
  }
  
  const result = await sql`SELECT * FROM configuracoes ORDER BY chave`
  return result.rows as Configuracao[]
}

export async function updateConfiguracao(chave: string, valor: string, tipo: string = 'string') {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado')
  }
  
  const result = await sql`
    INSERT INTO configuracoes (chave, valor, tipo, updated_at)
    VALUES (${chave}, ${valor}, ${tipo}, NOW())
    ON CONFLICT (chave) 
    DO UPDATE SET valor = ${valor}, tipo = ${tipo}, updated_at = NOW()
    RETURNING *
  `
  return result.rows[0] as Configuracao
}

// Funções para Logs
export async function createLog(usuario_id: string | null, acao: string, detalhes: any = {}, ip?: string) {
  if (!hasPostgresConnection()) {
    return // Silent fail para logs
  }
  
  try {
    await sql`
      INSERT INTO logs (usuario_id, acao, detalhes, ip)
      VALUES (${usuario_id}, ${acao}, ${JSON.stringify(detalhes)}, ${ip})
    `
  } catch (error) {
    console.error('Erro ao criar log:', error)
  }
}

export async function getStats() {
  if (!hasPostgresConnection()) {
    return {
      clientes: 0,
      usuarios: 0,
      configuracoes: 0,
      logs: 0
    }
  }

  try {
    const [clientesResult, usuariosResult, configuracoesResult, logsResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM clientes`,
      sql`SELECT COUNT(*) as count FROM usuarios`,
      sql`SELECT COUNT(*) as count FROM configuracoes`,
      sql`SELECT COUNT(*) as count FROM logs`
    ])

    return {
      clientes: parseInt(clientesResult.rows[0].count) || 0,
      usuarios: parseInt(usuariosResult.rows[0].count) || 0,
      configuracoes: parseInt(configuracoesResult.rows[0].count) || 0,
      logs: parseInt(logsResult.rows[0].count) || 0
    }
  } catch (error) {
    console.error('Erro ao buscar stats:', error)
    return {
      clientes: 0,
      usuarios: 0,
      configuracoes: 0,
      logs: 0
    }
  }
}

// Função para migração de dados
export async function migrateData(data: { clientes: any[], usuarios: any[], configuracoes: any }) {
  if (!hasPostgresConnection()) {
    throw new Error('PostgreSQL não configurado para migração')
  }

  const results = {
    clientes: 0,
    usuarios: 0,
    configuracoes: 0,
    errors: [] as string[]
  }

  try {
    // Migrar clientes
    for (const cliente of data.clientes) {
      try {
        await sql`
          INSERT INTO clientes (nome, email, telefone, tipo, cpf_cnpj, status, whatsapp, endereco)
          VALUES (${cliente.nome}, ${cliente.email || ''}, ${cliente.telefone || ''}, 
                  ${cliente.tipo || 'pessoa_fisica'}, ${cliente.cpf_cnpj || ''}, 
                  ${cliente.status || 'ativo'}, ${cliente.whatsapp || ''}, ${cliente.endereco || ''})
          ON CONFLICT (email) DO NOTHING
        `
        results.clientes++
      } catch (error) {
        results.errors.push(`Erro ao migrar cliente ${cliente.nome}: ${(error as Error).message}`)
      }
    }

    // Migrar usuários
    for (const usuario of data.usuarios) {
      try {
        await sql`
          INSERT INTO usuarios (nome, email, senha, tipo, status, permissoes)
          VALUES (${usuario.nome}, ${usuario.email}, ${usuario.senha}, 
                  ${usuario.tipo || 'cliente'}, ${usuario.status || 'ativo'}, 
                  ${JSON.stringify(usuario.permissoes || [])})
          ON CONFLICT (email) DO NOTHING
        `
        results.usuarios++
      } catch (error) {
        results.errors.push(`Erro ao migrar usuário ${usuario.nome}: ${(error as Error).message}`)
      }
    }

    // Migrar configurações
    if (data.configuracoes && typeof data.configuracoes === 'object') {
      for (const [chave, valor] of Object.entries(data.configuracoes)) {
        try {
          await sql`
            INSERT INTO configuracoes (chave, valor, tipo)
            VALUES (${chave}, ${JSON.stringify(valor)}, 'json')
            ON CONFLICT (chave) DO UPDATE SET valor = ${JSON.stringify(valor)}, updated_at = NOW()
          `
          results.configuracoes++
        } catch (error) {
          results.errors.push(`Erro ao migrar configuração ${chave}: ${(error as Error).message}`)
        }
      }
    }

    console.log('✅ Migração concluída:', results)
    return results

  } catch (error) {
    console.error('❌ Erro na migração:', error)
    throw error
  }
}