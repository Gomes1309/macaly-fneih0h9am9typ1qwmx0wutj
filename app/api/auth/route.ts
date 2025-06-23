import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initializeTables, logActivity } from '@/lib/database'

// POST - Login
export async function POST(request: NextRequest) {
  try {
    // Inicializar tabelas se necessário
    await initializeTables()
    
    const { email, senha, action } = await request.json()
    console.log('🔐 Tentativa de login:', { email, action })

    if (action === 'login') {
      // Verificar credenciais
      const user = await sql`
        SELECT * FROM usuarios 
        WHERE email = ${email} AND ativo = true
        LIMIT 1
      `

      if (user.rows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário não encontrado ou inativo' 
        }, { status: 401 })
      }

      const usuario = user.rows[0]
      
      // Verificar senha (em produção, usar bcrypt.compare)
      const senhaValida = senha === 'admin123' || senha === '123456'
      
      if (!senhaValida) {
        return NextResponse.json({ 
          success: false, 
          message: 'Senha incorreta' 
        }, { status: 401 })
      }

      // Atualizar último login
      await sql`
        UPDATE usuarios 
        SET ultimo_login = NOW(), updated_at = NOW()
        WHERE id = ${usuario.id}
      `

      // Log da atividade
      await logActivity(
        usuario.id,
        'LOGIN',
        'usuarios',
        usuario.id,
        null,
        { login_time: new Date() },
        request.ip,
        request.headers.get('user-agent')
      )

      return NextResponse.json({
        success: true,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          permissoes: usuario.permissoes
        },
        message: 'Login realizado com sucesso!'
      })
    }

    if (action === 'forgot-password') {
      // Gerar código de recuperação
      const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos

      await sql`
        UPDATE usuarios 
        SET reset_token = ${resetCode}, reset_expires = ${expiresAt.toISOString()}
        WHERE email = ${email}
      `

      // Simular envio de email
      console.log(`📧 Código de recuperação para ${email}: ${resetCode}`)

      return NextResponse.json({
        success: true,
        message: `Código de recuperação enviado para ${email}`,
        code: resetCode // Apenas para desenvolvimento
      })
    }

    if (action === 'reset-password') {
      const { codigo, novaSenha } = await request.json()

      const user = await sql`
        SELECT * FROM usuarios 
        WHERE email = ${email} 
        AND reset_token = ${codigo}
        AND reset_expires > NOW()
        LIMIT 1
      `

      if (user.rows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Código inválido ou expirado' 
        }, { status: 400 })
      }

      // Atualizar senha (em produção, fazer hash da senha)
      await sql`
        UPDATE usuarios 
        SET senha_hash = ${novaSenha}, reset_token = NULL, reset_expires = NULL, updated_at = NOW()
        WHERE email = ${email}
      `

      return NextResponse.json({
        success: true,
        message: 'Senha alterada com sucesso!'
      })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Ação não reconhecida' 
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Erro na autenticação:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// GET - Verificar sessão
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Não autenticado' 
      }, { status: 401 })
    }

    const user = await sql`
      SELECT id, nome, email, role, permissoes, ultimo_login 
      FROM usuarios 
      WHERE id = ${userId} AND ativo = true
      LIMIT 1
    `

    if (user.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: user.rows[0]
    })

  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}