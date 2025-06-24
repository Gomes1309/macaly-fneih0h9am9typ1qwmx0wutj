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
  console.log('🔄 Inicializando tabelas do banco de dados Neon...')
  
  // Verificar se temos conexão PostgreSQL
  if (!hasPostgresConnection()) {
    console.error('❌ ERRO: PostgreSQL não configurado!')
    throw new Error('NEON_NOT_CONFIGURED: Configure a variável POSTGRES_URL no Vercel para usar o banco Neon.')
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

    console.log('✅ Banco Neon inicializado com sucesso!')
    return { success: true, provider: 'neon' }
  } catch (error) {
    console.error('❌ Erro ao conectar com Neon:', error)
    throw new Error(`NEON_CONNECTION_ERROR: ${(error as Error).message}`)
  }
}

// Funções para Clientes
export async function createCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) {
  console.log('📝 Criando cliente no Neon:', cliente.nome)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`
    INSERT INTO clientes (nome, email, telefone, tipo, cpf_cnpj, status, whatsapp, endereco)
    VALUES (${cliente.nome}, ${cliente.email}, ${cliente.telefone}, ${cliente.tipo}, ${cliente.cpf_cnpj}, ${cliente.status}, ${cliente.whatsapp}, ${cliente.endereco})
    RETURNING *
  `
  
  console.log('✅ Cliente criado no Neon:', result.rows[0])
  return result.rows[0] as Cliente
}

export async function getClientes(): Promise<Cliente[]> {
  console.log('🔍 Buscando clientes no Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`SELECT * FROM clientes ORDER BY created_at DESC`
  console.log(`✅ ${result.rows.length} clientes encontrados no Neon`)
  return result.rows as Cliente[]
}

export async function updateCliente(id: string, data: Partial<Cliente>) {
  console.log('📝 Atualizando cliente no Neon:', id)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`
    UPDATE clientes 
    SET nome = ${data.nome}, email = ${data.email}, telefone = ${data.telefone}, 
        tipo = ${data.tipo}, cpf_cnpj = ${data.cpf_cnpj}, status = ${data.status},
        whatsapp = ${data.whatsapp}, endereco = ${data.endereco}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  
  console.log('✅ Cliente atualizado no Neon:', result.rows[0])
  return result.rows[0] as Cliente
}

export async function deleteCliente(id: string) {
  console.log('🗑️ Deletando cliente no Neon:', id)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  await sql`DELETE FROM clientes WHERE id = ${id}`
  console.log('✅ Cliente deletado do Neon')
}

// Funções para Usuários
export async function createUsuario(usuario: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>) {
  console.log('👤 Criando usuário no Neon:', usuario.email)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`
    INSERT INTO usuarios (nome, email, senha, tipo, status, permissoes)
    VALUES (${usuario.nome}, ${usuario.email}, ${usuario.senha}, ${usuario.tipo}, ${usuario.status}, ${JSON.stringify(usuario.permissoes)})
    RETURNING *
  `
  
  console.log('✅ Usuário criado no Neon:', result.rows[0])
  return result.rows[0] as Usuario
}

export async function getUsuarios(): Promise<Usuario[]> {
  console.log('👥 Buscando usuários no Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`SELECT * FROM usuarios ORDER BY created_at DESC`
  console.log(`✅ ${result.rows.length} usuários encontrados no Neon`)
  return result.rows as Usuario[]
}

export async function getUserByEmail(email: string): Promise<Usuario | null> {
  console.log('🔍 Buscando usuário por email no Neon:', email)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`SELECT * FROM usuarios WHERE email = ${email} LIMIT 1`
  const user = result.rows[0] as Usuario || null
  
  console.log(user ? '✅ Usuário encontrado no Neon' : '❌ Usuário não encontrado no Neon')
  return user
}

// Funções para Configurações
export async function getConfiguracoes(): Promise<Configuracao[]> {
  console.log('⚙️ Buscando configurações no Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`SELECT * FROM configuracoes ORDER BY chave`
  console.log(`✅ ${result.rows.length} configurações encontradas no Neon`)
  return result.rows as Configuracao[]
}

export async function updateConfiguracao(chave: string, valor: string, tipo: string = 'string') {
  console.log('💾 Salvando configuração no Neon:', chave)
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon primeiro')
  }
  
  const result = await sql`
    INSERT INTO configuracoes (chave, valor, tipo, updated_at)
    VALUES (${chave}, ${valor}, ${tipo}, NOW())
    ON CONFLICT (chave) 
    DO UPDATE SET valor = ${valor}, tipo = ${tipo}, updated_at = NOW()
    RETURNING *
  `
  
  console.log('✅ Configuração salva no Neon:', result.rows[0])
  return result.rows[0] as Configuracao
}

// Funções para Logs
export async function createLog(usuario_id: string | null, acao: string, detalhes: any = {}, ip?: string) {
  console.log('📋 Criando log no Neon:', acao)
  
  if (!hasPostgresConnection()) {
    console.warn('⚠️ Neon não configurado - log perdido:', acao)
    return
  }
  
  try {
    await sql`
      INSERT INTO logs (usuario_id, acao, detalhes, ip)
      VALUES (${usuario_id}, ${acao}, ${JSON.stringify(detalhes)}, ${ip})
    `
    console.log('✅ Log salvo no Neon')
  } catch (error) {
    console.error('❌ Erro ao salvar log no Neon:', error)
  }
}

export async function getStats() {
  console.log('📊 Buscando estatísticas no Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon para visualizar estatísticas')
  }

  try {
    const [clientesResult, usuariosResult, configuracoesResult, logsResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM clientes`,
      sql`SELECT COUNT(*) as count FROM usuarios`,
      sql`SELECT COUNT(*) as count FROM configuracoes`,
      sql`SELECT COUNT(*) as count FROM logs`
    ])

    const stats = {
      clientes: parseInt(clientesResult.rows[0].count) || 0,
      usuarios: parseInt(usuariosResult.rows[0].count) || 0,
      configuracoes: parseInt(configuracoesResult.rows[0].count) || 0,
      logs: parseInt(logsResult.rows[0].count) || 0
    }
    
    console.log('✅ Estatísticas do Neon:', stats)
    return stats
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas no Neon:', error)
    throw error
  }
}

// Função para migração de dados
export async function migrateData(data: { clientes: any[], usuarios: any[], configuracoes: any }) {
  console.log('🚀 Iniciando migração para o Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Configure o banco Neon antes de migrar dados')
  }

  const results = {
    clientes: 0,
    usuarios: 0,
    configuracoes: 0,
    errors: [] as string[]
  }

  try {
    // Migrar clientes
    console.log(`📋 Migrando ${data.clientes?.length || 0} clientes para o Neon...`)
    for (const cliente of data.clientes || []) {
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
    console.log(`👥 Migrando ${data.usuarios?.length || 0} usuários para o Neon...`)
    for (const usuario of data.usuarios || []) {
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
    console.log(`⚙️ Migrando configurações para o Neon...`)
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

    console.log('✅ Migração para Neon concluída:', results)
    return results

  } catch (error) {
    console.error('❌ Erro na migração para Neon:', error)
    throw error
  }
}

// Função para testar conexão
export async function testConnection() {
  console.log('🔍 Testando conexão com Neon...')
  
  if (!hasPostgresConnection()) {
    throw new Error('NEON_NOT_CONFIGURED: Variável POSTGRES_URL não encontrada')
  }
  
  try {
    const result = await sql`SELECT NOW() as timestamp, version() as version`
    const info = result.rows[0]
    
    console.log('✅ Conexão com Neon estabelecida:', info)
    return {
      success: true,
      timestamp: info.timestamp,
      version: info.version,
      provider: 'neon'
    }
  } catch (error) {
    console.error('❌ Falha na conexão com Neon:', error)
    throw error
  }
}