import { NextRequest } from 'next/server'
import { initializeTables, getStats, migrateData, createLog } from '@/lib/database'

export async function GET() {
  try {
    console.log('🔍 Verificando status do banco de dados...')
    
    // Inicializar tabelas se necessário
    const initResult = await initializeTables()
    
    // Se PostgreSQL não está configurado, retornar informação de fallback
    if (!initResult.success) {
      return Response.json({
        success: true,
        stats: {
          clientes: 0,
          usuarios: 0,
          configuracoes: 0,
          logs: 0
        },
        message: initResult.message,
        fallback: initResult.fallback
      })
    }
    
    // Buscar estatísticas
    const stats = await getStats()
    
    console.log('📊 Stats encontradas:', stats)
    
    return Response.json({
      success: true,
      stats,
      message: 'PostgreSQL conectado e funcionando'
    })
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error)
    return Response.json({
      success: false,
      message: (error as Error).message,
      stats: {
        clientes: 0,
        usuarios: 0,
        configuracoes: 0,
        logs: 0
      },
      fallback: 'localStorage'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando migração de dados...')
    
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
      'MIGRATION_COMPLETED',
      {
        results,
        source: 'localStorage',
        userAgent
      },
      ip
    )

    console.log('✅ Migração concluída com sucesso:', results)
    
    return Response.json({
      success: true,
      results,
      message: 'Migração concluída com sucesso'
    })
    
  } catch (error) {
    console.error('❌ Erro durante migração:', error)
    
    // Log do erro
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    await createLog(
      null,
      'MIGRATION_ERROR',
      {
        error: (error as Error).message,
        userAgent
      },
      ip
    )
    
    return Response.json({
      success: false,
      message: `Erro durante a migração: ${(error as Error).message}`,
      results: {
        clientes: 0,
        usuarios: 0,
        configuracoes: 0,
        errors: [(error as Error).message]
      }
    }, { status: 500 })
  }
}