import { NextRequest, NextResponse } from 'next/server'
import { getConfiguracoes, updateConfiguracao, createLog } from '@/lib/database'

// GET - Buscar configurações
export async function GET() {
  try {
    console.log('⚙️ Buscando configurações...')
    const configuracoes = await getConfiguracoes()
    
    // Converter array para objeto
    const configObj = configuracoes.reduce((acc, config) => {
      try {
        acc[config.chave] = config.tipo === 'json' ? JSON.parse(config.valor) : config.valor
      } catch (error) {
        acc[config.chave] = config.valor
      }
      return acc
    }, {} as Record<string, any>)

    console.log(`✅ ${configuracoes.length} configurações encontradas`)
    
    return NextResponse.json({
      success: true,
      configuracoes: configObj
    })

  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar configurações: ' + (error as Error).message 
    }, { status: 500 })
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('💾 Salvando configurações:', Object.keys(body))

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const results: any[] = []

    // Salvar cada configuração
    for (const [chave, valor] of Object.entries(body)) {
      try {
        const valorString = typeof valor === 'string' ? valor : JSON.stringify(valor)
        const tipo = typeof valor === 'string' ? 'string' : 'json'
        
        const result = await updateConfiguracao(chave, valorString, tipo)
        results.push(result)
        
        console.log(`✅ Configuração salva: ${chave}`)
      } catch (error) {
        console.error(`❌ Erro ao salvar ${chave}:`, error)
        throw error
      }
    }

    // Log da atividade
    await createLog(
      null,
      'CONFIGURACOES_UPDATED',
      {
        keys: Object.keys(body),
        count: results.length
      },
      ip
    )

    console.log(`✅ ${results.length} configurações salvas com sucesso`)
    
    return NextResponse.json({
      success: true,
      message: `${results.length} configurações salvas com sucesso!`,
      saved: results.length
    })

  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error)
    
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Log do erro
    await createLog(
      null,
      'CONFIGURACOES_ERROR',
      {
        error: (error as Error).message
      },
      ip
    )
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao salvar configurações: ' + (error as Error).message 
    }, { status: 500 })
  }
}