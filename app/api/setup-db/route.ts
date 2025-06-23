import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  console.log('Database setup initiated');

  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        empresa TEXT,
        cnpj TEXT NOT NULL UNIQUE,
        email TEXT,
        telefone TEXT,
        regime TEXT NOT NULL,
        plano TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vencimentos (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id),
        titulo TEXT NOT NULL,
        vencimento TIMESTAMP NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        dias_restantes INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS documentos (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id),
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        tamanho TEXT,
        url TEXT,
        visualizado BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS declaracoes (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id),
        cliente TEXT NOT NULL,
        tipo TEXT NOT NULL,
        referencia TEXT NOT NULL,
        valor DECIMAL(12,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        data_envio TIMESTAMP,
        canal TEXT,
        visualizado BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS atividades (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id),
        titulo TEXT NOT NULL,
        descricao TEXT,
        tipo TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_stats (
        id SERIAL PRIMARY KEY,
        obrigacoes_pendentes INTEGER DEFAULT 0,
        documentos_enviados INTEGER DEFAULT 0,
        vencimentos_hoje INTEGER DEFAULT 0,
        honorarios_pendentes DECIMAL(12,2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Database tables created successfully');

    // Seed data
    const seedResult = await seedDatabase();
    
    if (seedResult.success) {
      console.log('Database setup completed successfully');
      return NextResponse.json({ 
        message: 'Banco de dados configurado e populado com sucesso!',
        tables: ['clientes', 'vencimentos', 'documentos', 'declaracoes', 'atividades', 'dashboard_stats']
      });
    } else {
      console.error('Seed failed:', seedResult.error);
      return NextResponse.json({ 
        message: 'Tabelas criadas mas falha ao popular dados',
        error: seedResult.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({ 
      error: 'Erro ao configurar banco de dados',
      details: error
    }, { status: 500 });
  }
}