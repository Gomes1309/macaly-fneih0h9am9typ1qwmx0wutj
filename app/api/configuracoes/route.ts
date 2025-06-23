import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initializeTables, getConfiguracoes, saveConfiguracao, logActivity } from '@/lib/database'

// GET - Buscar configurações
export async function GET(request: NextRequest) {
  try {
    await initializeTables()
    
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    
    console.log('⚙️ Buscando configurações:', categoria || 'todas')
    
    const configs = await getConfiguracoes(categoria || undefined)
    
    return NextResponse.json({
      success: true,
      data: configs
    })

  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar configurações' 
    }, { status: 500 })
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const configuracoes = await request.json()
    console.log('💾 Salvando configurações:', Object.keys(configuracoes))

    const userId = request.headers.get('x-user-id')
    const savedConfigs = []

    // Salvar cada configuração
    for (const [categoria, configs] of Object.entries(configuracoes as Record<string, any>)) {
      if (typeof configs === 'object' && configs !== null) {
        for (const [chave, valor] of Object.entries(configs)) {
          const chaveCompleta = `${categoria}.${chave}`
          
          try {
            await saveConfiguracao(chaveCompleta, valor, typeof valor, categoria)
            savedConfigs.push(chaveCompleta)
            
            // Log da atividade
            if (userId) {
              await logActivity(
                userId,
                'UPDATE',
                'configuracoes',
                chaveCompleta,
                null,
                { chave: chaveCompleta, valor },
                request.ip,
                request.headers.get('user-agent')
              )
            }
            
          } catch (error) {
            console.error(`Erro ao salvar ${chaveCompleta}:`, error)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedConfigs.length} configurações salvas com sucesso!`,
      saved: savedConfigs
    })

  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao salvar configurações' 
    }, { status: 500 })
  }
}

// PUT - Atualizar configuração específica
export async function PUT(request: NextRequest) {
  try {
    const { chave, valor, categoria = 'sistema' } = await request.json()
    
    if (!chave) {
      return NextResponse.json({ 
        success: false, 
        message: 'Chave da configuração é obrigatória' 
      }, { status: 400 })
    }

    console.log('🔧 Atualizando configuração:', chave)

    await saveConfiguracao(chave, valor, typeof valor, categoria)

    // Log da atividade
    const userId = request.headers.get('x-user-id')
    if (userId) {
      await logActivity(
        userId,
        'UPDATE',
        'configuracoes',
        chave,
        null,
        { chave, valor },
        request.ip,
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração atualizada com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar configuração:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar configuração' 
    }, { status: 500 })
  }
}