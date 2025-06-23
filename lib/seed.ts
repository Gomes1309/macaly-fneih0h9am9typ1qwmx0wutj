import { db, clientes, vencimentos, documentos, declaracoes, atividades, dashboardStats } from './db';

export async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Seed Clientes
    const clientesSeed = await db.insert(clientes).values([
      {
        nome: 'Maria Silva Santos',
        empresa: 'MS Comércio de Roupas Ltda',
        cnpj: '12.345.678/0001-90',
        email: 'maria@mscomercio.com.br',
        telefone: '(11) 99999-0000',
        regime: 'Simples Nacional',
        plano: 'Empresarial Pro'
      },
      {
        nome: 'João Pedro Oliveira',
        empresa: 'ABC Comércio Ltda',
        cnpj: '98.765.432/0001-10',
        email: 'joao@abccomercio.com.br',
        telefone: '(11) 88888-0000',
        regime: 'Simples Nacional',
        plano: 'Empresarial'
      },
      {
        nome: 'Ana Costa',
        empresa: 'XYZ Indústria SA',
        cnpj: '11.222.333/0001-44',
        email: 'ana@xyzindustria.com.br',
        telefone: '(11) 77777-0000',
        regime: 'Lucro Real',
        plano: 'Empresarial Pro'
      }
    ]).returning();

    console.log('Clientes seeded:', clientesSeed.length);

    // Seed Vencimentos
    const vencimentosSeed = await db.insert(vencimentos).values([
      {
        clienteId: clientesSeed[0].id,
        titulo: 'DAS - Simples Nacional',
        vencimento: new Date('2024-07-20'),
        valor: '1250.00',
        status: 'pendente',
        diasRestantes: 2
      },
      {
        clienteId: clientesSeed[0].id,
        titulo: 'FGTS',
        vencimento: new Date('2024-07-07'),
        valor: '890.50',
        status: 'pago',
        diasRestantes: -11
      },
      {
        clienteId: clientesSeed[0].id,
        titulo: 'ISS',
        vencimento: new Date('2024-07-25'),
        valor: '450.00',
        status: 'pendente',
        diasRestantes: 7
      }
    ]).returning();

    console.log('Vencimentos seeded:', vencimentosSeed.length);

    // Seed Documentos
    const documentosSeed = await db.insert(documentos).values([
      {
        clienteId: clientesSeed[0].id,
        nome: 'DAS Junho 2024',
        tipo: 'Guia de Pagamento',
        tamanho: '245 KB',
        visualizado: true
      },
      {
        clienteId: clientesSeed[0].id,
        nome: 'Balancete Maio 2024',
        tipo: 'Relatório Contábil',
        tamanho: '1.2 MB',
        visualizado: false
      },
      {
        clienteId: clientesSeed[0].id,
        nome: 'Certidão Negativa',
        tipo: 'Documento Fiscal',
        tamanho: '180 KB',
        visualizado: true
      }
    ]).returning();

    console.log('Documentos seeded:', documentosSeed.length);

    // Seed Declarações
    const declaracoesSeed = await db.insert(declaracoes).values([
      {
        clienteId: clientesSeed[0].id,
        cliente: 'MS Comércio de Roupas Ltda',
        tipo: 'Faturamento Mensal',
        referencia: 'Junho/2024',
        valor: '15000.00',
        status: 'enviado',
        dataEnvio: new Date('2024-06-28'),
        canal: 'whatsapp',
        visualizado: true
      },
      {
        clienteId: clientesSeed[2].id,
        cliente: 'XYZ Indústria SA',
        tipo: 'Apuração IRPJ',
        referencia: 'Junho/2024',
        valor: '45000.00',
        status: 'pendente',
        canal: null,
        visualizado: false
      }
    ]).returning();

    console.log('Declarações seeded:', declaracoesSeed.length);

    // Seed Atividades
    const atividadesSeed = await db.insert(atividades).values([
      {
        clienteId: clientesSeed[0].id,
        titulo: 'DAS enviado por WhatsApp',
        descricao: 'Guia de pagamento junho/2024',
        tipo: 'documento'
      },
      {
        clienteId: clientesSeed[0].id,
        titulo: 'Alvará renovado',
        descricao: 'Processo de renovação concluído',
        tipo: 'sucesso'
      },
      {
        clienteId: clientesSeed[0].id,
        titulo: 'Lembrete de vencimento',
        descricao: 'ISS vence em 7 dias',
        tipo: 'alerta'
      }
    ]).returning();

    console.log('Atividades seeded:', atividadesSeed.length);

    // Seed Dashboard Stats
    const statsSeed = await db.insert(dashboardStats).values([
      {
        obrigacoesPendentes: 12,
        documentosEnviados: 847,
        vencimentosHoje: 3,
        honorariosPendentes: '28350.00'
      }
    ]).returning();

    console.log('Dashboard stats seeded:', statsSeed.length);

    console.log('Database seed completed successfully!');
    return { success: true, message: 'Banco de dados populado com sucesso!' };

  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error };
  }
}