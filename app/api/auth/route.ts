import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createLog } from '@/lib/database'

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { email, senha, action } = await request.json()
    console.log('🔐 Tentativa de autenticação:', { email, action })

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    if (action === 'login') {
      // Buscar usuário
      const user = await getUserByEmail(email)

      if (!user) {
        await createLog(null, 'LOGIN_FAILED', { email, reason: 'User not found' }, ip)
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        }, { status: 401 })
      }

      // Verificar senha (temporário - em produção usar bcrypt)
      const senhaValida = senha === 'admin123' || senha === '123456'
      
      if (!senhaValida) {
        await createLog(user.id, 'LOGIN_FAILED', { email, reason: 'Invalid password' }, ip)
        return NextResponse.json({ 
          success: false, 
          message: 'Senha incorreta' 
        }, { status: 401 })
      }

      // Login bem-sucedido
      await createLog(user.id, 'LOGIN_SUCCESS', { email }, ip)

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          permissoes: user.permissoes
        },
        message: 'Login realizado com sucesso!'
      })
    }

    if (action === 'forgot-password') {
      const user = await getUserByEmail(email)
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: 'Email não encontrado' 
        }, { status: 404 })
      }

      // Gerar código de recuperação
      const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      // Log da solicitação
      await createLog(user.id, 'PASSWORD_RESET_REQUEST', { email, resetCode }, ip)

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

      // Em uma implementação real, validaria o código
      const user = await getUserByEmail(email)
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        }, { status: 404 })
      }

      // Log da mudança de senha
      await createLog(user.id, 'PASSWORD_CHANGED', { email }, ip)

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

    // Buscar usuário (implementar busca por ID se necessário)
    return NextResponse.json({
      success: true,
      message: 'Sessão válida'
    })

  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}