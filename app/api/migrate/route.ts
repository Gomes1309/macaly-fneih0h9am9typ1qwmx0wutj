import { NextRequest } from 'next/server'
import { initializeTables, getStats, migrateData, createLog, testConnection } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔍 Verificando status do banco Neon...')
    
    // Primeiro, testar a conexão
    const connectionTest = await testConnection()
    console.log('✅ Conexão testada:', connectionTest)
    
    // Inicializar tabelas se necessário
    const initResult = await initializeTables()
    console.log('✅ Tabelas inicializadas:', initResult)
    
    // Buscar estatísticas
    const stats = await getStats()
    console.log('📊 Estatísticas do banco:', stats)
    
    return Response.json({
      success: true,
      provider: 'neon',
      connection: connectionTest,
      stats,
      message: 'Banco Neon conectado e funcionando perfeitamente!'
    })
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Neon:', error)
    
    const errorMessage = (error as Error).message
    
    if (errorMessage.includes('NEON_NOT_CONFIGURED')) {
      return Response.json({
        success: false,
        provider: 'none',
        error: 'NEON_NOT_CONFIGURED',
        message: 'Configure a variável POSTGRES_URL no Vercel para conectar com o Neon.',
        instructions: [
          '1. Acesse o Vercel Dashboard',
          '2. Vá em Settings → Environment Variables',
          '3. Adicione POSTGRES_URL com sua connection string do Neon',
          '4. Faça o redeploy do projeto'
        ]
      }, { status: 424 })
    }
    
    return Response.json({
      success: false,
      provider: 'neon',
      error: 'CONNECTION_ERROR',
      message: `Erro ao conectar com Neon: ${errorMessage}`,
      troubleshooting: [
        'Verifique se a connection string está correta',
        'Confirme se o banco Neon está ativo',
        'Teste a conexão diretamente no Neon Console'
      ]
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando migração de dados para o Neon...')
    
    // Testar conexão primeiro
    await testConnection()
    
    const body = await request.json()
    console.log('📦 Dados recebidos para migração:', {
      clientes: body.clientes?.length || 0,
      usuarios: body.usuarios?.length || 0,
      configuracoes: Object.keys(body.configuracoes || {}).length
    })

    // Executar migração
    const results = await migrateData(body)
    
    // Log da migração
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    await createLog(
      null,
      'MIGRATION_TO_NEON_COMPLETED',
      {
        results,
        source: 'localStorage',
        destination: 'neon',
        userAgent
      },
      ip
    )

    console.log('✅ Migração para Neon concluída com sucesso:', results)
    
    return Response.json({
      success: true,
      provider: 'neon',
      results,
      message: `Migração concluída! ${results.clientes} clientes, ${results.usuarios} usuários e ${results.configuracoes} configurações transferidos para o Neon.`
    })
    
  } catch (error) {
    console.error('❌ Erro durante migração para Neon:', error)
    
    const errorMessage = (error as Error).message
    
    // Log do erro
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    try {
      await createLog(
        null,
        'MIGRATION_TO_NEON_ERROR',
        {
          error: errorMessage,
          userAgent
        },
        ip
      )
    } catch (logError) {
      console.error('Erro ao salvar log de erro:', logError)
    }
    
    if (errorMessage.includes('NEON_NOT_CONFIGURED')) {
      return Response.json({
        success: false,
        provider: 'none',
        error: 'NEON_NOT_CONFIGURED',
        message: 'Configure o banco Neon antes de fazer a migração.',
        results: {
          clientes: 0,
          usuarios: 0,
          configuracoes: 0,
          errors: [errorMessage]
        }
      }, { status: 424 })
    }
    
    return Response.json({
      success: false,
      provider: 'neon',
      error: 'MIGRATION_ERROR',
      message: `Erro durante a migração: ${errorMessage}`,
      results: {
        clientes: 0,
        usuarios: 0,
        configuracoes: 0,
        errors: [errorMessage]
      }
    }, { status: 500 })
  }
}