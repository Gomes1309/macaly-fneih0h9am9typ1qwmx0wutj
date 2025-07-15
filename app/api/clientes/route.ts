import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initializeTables, logActivity } from '@/lib/database'

// GET - Listar clientes
export async function GET(request: NextRequest) {
  try {
    await initializeTables()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const grupo = searchParams.get('grupo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    console.log('📋 Listando clientes:', { search, tipo, status, grupo, page, limit })

    // Construir query dinâmica
    let whereConditions: string[] = []
    let params: any[] = []
    let paramIndex = 1

    if (search) {
      whereConditions.push(`(
        razao_social ILIKE $${paramIndex} OR 
        nome_fantasia ILIKE $${paramIndex} OR 
        cnpj ILIKE $${paramIndex} OR 
        email ILIKE $${paramIndex}
      )`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (tipo && tipo !== 'todos') {
      whereConditions.push(`tipo = $${paramIndex}`)
      params.push(tipo)
      paramIndex++
    }

    if (status && status !== 'todos') {
      whereConditions.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (grupo && grupo !== 'todos') {
      whereConditions.push(`grupo = $${paramIndex}`)
      params.push(grupo)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Buscar clientes
    const clientesQuery = `
      SELECT * FROM clientes 
      ${whereClause}
      ORDER BY razao_social ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const clientes = await sql.query(clientesQuery, params)

    // Contar total
    const countQuery = `SELECT COUNT(*) as total FROM clientes ${whereClause}`
    const countResult = await sql.query(countQuery, params.slice(0, -2))
    const total = parseInt(countResult.rows[0].total)

    return NextResponse.json({
      success: true,
      data: clientes.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar clientes' 
    }, { status: 500 })
  }
}

// POST - Criar cliente
export async function POST(request: NextRequest) {
  try {
    const clienteData = await request.json()
    console.log('✅ Criando cliente:', clienteData.razao_social)

    // Validar campos obrigatórios
    if (!clienteData.razao_social || !clienteData.cnpj || !clienteData.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Campos obrigatórios: razão social, CNPJ e email' 
      }, { status: 400 })
    }

    // Verificar se CNPJ já existe
    const existingClient = await sql`
      SELECT id FROM clientes WHERE cnpj = ${clienteData.cnpj}
    `

    if (existingClient.rows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'CNPJ já cadastrado' 
      }, { status: 409 })
    }

    // Calcular data de vencimento (1 ano a partir do contrato)
    const dataContrato = new Date()
    const dataVencimento = new Date(dataContrato)
    dataVencimento.setFullYear(dataVencimento.getFullYear() + 1)

    // Inserir cliente
    const result = await sql`
      INSERT INTO clientes (
        razao_social, nome_fantasia, cnpj, ie, tipo, status, grupo,
        email, telefone, whatsapp, endereco, cep, responsavel,
        observacoes, atividade, faturamento_anual, funcionarios,
        nirf, contador_responsavel, auditor, data_contrato, data_vencimento
      )
      VALUES (
        ${clienteData.razao_social},
        ${clienteData.nome_fantasia || null},
        ${clienteData.cnpj},
        ${clienteData.ie || null},
        ${clienteData.tipo || 'simples'},
        ${clienteData.status || 'ativo'},
        ${clienteData.grupo || 'standard'},
        ${clienteData.email},
        ${clienteData.telefone},
        ${clienteData.whatsapp || null},
        ${clienteData.endereco || null},
        ${clienteData.cep || null},
        ${clienteData.responsavel || null},
        ${clienteData.observacoes || null},
        ${clienteData.atividade || null},
        ${clienteData.faturamento_anual || 0},
        ${clienteData.funcionarios || 1},
        ${clienteData.nirf || null},
        ${clienteData.contador_responsavel || null},
        ${clienteData.auditor || null},
        ${dataContrato.toISOString()},
        ${dataVencimento.toISOString()}
      )
      RETURNING *
    `

    const novoCliente = result.rows[0]

    // Log da atividade
    const userId = request.headers.get('x-user-id')
    if (userId) {
      await logActivity(
        userId,
        'CREATE',
        'clientes',
        novoCliente.id,
        null,
        novoCliente,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      data: novoCliente,
      message: 'Cliente cadastrado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao cadastrar cliente' 
    }, { status: 500 })
  }
}

// PUT - Atualizar cliente
export async function PUT(request: NextRequest) {
  try {
    const { id, ...clienteData } = await request.json()
    console.log('📝 Atualizando cliente:', id)

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do cliente é obrigatório' 
      }, { status: 400 })
    }

    // Buscar dados anteriores para log
    const clienteAnterior = await sql`
      SELECT * FROM clientes WHERE id = ${id}
    `

    if (clienteAnterior.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      }, { status: 404 })
    }

    // Atualizar cliente
    const result = await sql`
      UPDATE clientes SET
        razao_social = ${clienteData.razao_social},
        nome_fantasia = ${clienteData.nome_fantasia || null},
        cnpj = ${clienteData.cnpj},
        ie = ${clienteData.ie || null},
        tipo = ${clienteData.tipo},
        status = ${clienteData.status},
        grupo = ${clienteData.grupo},
        email = ${clienteData.email},
        telefone = ${clienteData.telefone},
        whatsapp = ${clienteData.whatsapp || null},
        endereco = ${clienteData.endereco || null},
        cep = ${clienteData.cep || null},
        responsavel = ${clienteData.responsavel || null},
        observacoes = ${clienteData.observacoes || null},
        atividade = ${clienteData.atividade || null},
        faturamento_anual = ${clienteData.faturamento_anual || 0},
        funcionarios = ${clienteData.funcionarios || 1},
        nirf = ${clienteData.nirf || null},
        contador_responsavel = ${clienteData.contador_responsavel || null},
        auditor = ${clienteData.auditor || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const clienteAtualizado = result.rows[0]

    // Log da atividade
    const userId = request.headers.get('x-user-id')
    if (userId) {
      await logActivity(
        userId,
        'UPDATE',
        'clientes',
        id,
        clienteAnterior.rows[0],
        clienteAtualizado,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      data: clienteAtualizado,
      message: 'Cliente atualizado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar cliente' 
    }, { status: 500 })
  }
}

// DELETE - Excluir cliente
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do cliente é obrigatório' 
      }, { status: 400 })
    }

    console.log('🗑️ Excluindo cliente:', id)

    // Buscar dados para log
    const clienteAnterior = await sql`
      SELECT * FROM clientes WHERE id = ${id}
    `

    if (clienteAnterior.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cliente não encontrado' 
      }, { status: 404 })
    }

    // Excluir cliente
    await sql`DELETE FROM clientes WHERE id = ${id}`

    // Log da atividade
    const userId = request.headers.get('x-user-id')
    if (userId) {
      await logActivity(
        userId,
        'DELETE',
        'clientes',
        id,
        clienteAnterior.rows[0],
        null,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente excluído com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao excluir cliente:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao excluir cliente' 
    }, { status: 500 })
  }
}