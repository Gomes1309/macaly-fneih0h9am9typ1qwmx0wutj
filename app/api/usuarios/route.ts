import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initializeTables, logActivity } from '@/lib/database'

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    await initializeTables()
    
    console.log('👥 Listando usuários')

    const usuarios = await sql`
      SELECT id, nome, email, role, permissoes, ativo, ultimo_login, created_at
      FROM usuarios 
      ORDER BY nome ASC
    `

    return NextResponse.json({
      success: true,
      data: usuarios.rows
    })

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao buscar usuários' 
    }, { status: 500 })
  }
}

// POST - Criar usuário
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    console.log('✅ Criando usuário:', userData.nome)

    // Validar campos obrigatórios
    if (!userData.nome || !userData.email || !userData.senha) {
      return NextResponse.json({ 
        success: false, 
        message: 'Campos obrigatórios: nome, email e senha' 
      }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await sql`
      SELECT id FROM usuarios WHERE email = ${userData.email}
    `

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email já cadastrado' 
      }, { status: 409 })
    }

    // Inserir usuário (em produção, fazer hash da senha)
    const result = await sql`
      INSERT INTO usuarios (
        nome, email, senha_hash, role, permissoes, ativo
      )
      VALUES (
        ${userData.nome},
        ${userData.email},
        ${userData.senha}, 
        ${userData.role || 'assistente'},
        ${JSON.stringify(userData.permissoes || [])},
        ${userData.ativo !== false}
      )
      RETURNING id, nome, email, role, permissoes, ativo, created_at
    `

    const novoUsuario = result.rows[0]

    // Log da atividade
    const creatorId = request.headers.get('x-user-id')
    if (creatorId) {
      await logActivity(
        creatorId,
        'CREATE',
        'usuarios',
        novoUsuario.id,
        null,
        novoUsuario,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      data: novoUsuario,
      message: 'Usuário cadastrado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao cadastrar usuário' 
    }, { status: 500 })
  }
}

// PUT - Atualizar usuário
export async function PUT(request: NextRequest) {
  try {
    const { id, ...userData } = await request.json()
    console.log('📝 Atualizando usuário:', id)

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do usuário é obrigatório' 
      }, { status: 400 })
    }

    // Buscar dados anteriores para log
    const usuarioAnterior = await sql`
      SELECT * FROM usuarios WHERE id = ${id}
    `

    if (usuarioAnterior.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      }, { status: 404 })
    }

    // Atualizar usuário
    const result = await sql`
      UPDATE usuarios SET
        nome = ${userData.nome},
        email = ${userData.email},
        role = ${userData.role},
        permissoes = ${JSON.stringify(userData.permissoes)},
        ativo = ${userData.ativo},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, nome, email, role, permissoes, ativo, updated_at
    `

    const usuarioAtualizado = result.rows[0]

    // Log da atividade
    const updaterId = request.headers.get('x-user-id')
    if (updaterId) {
      await logActivity(
        updaterId,
        'UPDATE',
        'usuarios',
        id,
        usuarioAnterior.rows[0],
        usuarioAtualizado,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      data: usuarioAtualizado,
      message: 'Usuário atualizado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao atualizar usuário' 
    }, { status: 500 })
  }
}

// DELETE - Desativar usuário (não excluir)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID do usuário é obrigatório' 
      }, { status: 400 })
    }

    console.log('🔒 Desativando usuário:', id)

    // Buscar dados para log
    const usuarioAnterior = await sql`
      SELECT * FROM usuarios WHERE id = ${id}
    `

    if (usuarioAnterior.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      }, { status: 404 })
    }

    // Desativar usuário ao invés de excluir
    const result = await sql`
      UPDATE usuarios SET ativo = false, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, nome, email, ativo
    `

    // Log da atividade
    const deleterId = request.headers.get('x-user-id')
    if (deleterId) {
      await logActivity(
        deleterId,
        'DEACTIVATE',
        'usuarios',
        id,
        usuarioAnterior.rows[0],
        result.rows[0],
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent')
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário desativado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao desativar usuário:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao desativar usuário' 
    }, { status: 500 })
  }
}