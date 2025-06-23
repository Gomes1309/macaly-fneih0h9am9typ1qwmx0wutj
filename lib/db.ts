import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { pgTable, serial, text, timestamp, decimal, boolean, integer } from 'drizzle-orm/pg-core';

// Schema Tables
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  empresa: text('empresa'),
  cnpj: text('cnpj').notNull().unique(),
  email: text('email'),
  telefone: text('telefone'),
  regime: text('regime').notNull(), // 'Simples Nacional', 'Lucro Real', etc
  plano: text('plano'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const vencimentos = pgTable('vencimentos', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').references(() => clientes.id),
  titulo: text('titulo').notNull(),
  vencimento: timestamp('vencimento').notNull(),
  valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pendente'), // 'pendente', 'pago', 'vencido'
  diasRestantes: integer('dias_restantes'),
  createdAt: timestamp('created_at').defaultNow()
});

export const documentos = pgTable('documentos', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').references(() => clientes.id),
  nome: text('nome').notNull(),
  tipo: text('tipo').notNull(),
  tamanho: text('tamanho'),
  url: text('url'),
  visualizado: boolean('visualizado').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const declaracoes = pgTable('declaracoes', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').references(() => clientes.id),
  cliente: text('cliente').notNull(),
  tipo: text('tipo').notNull(),
  referencia: text('referencia').notNull(),
  valor: decimal('valor', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('pendente'), // 'enviado', 'gerado', 'pendente', 'processando'
  dataEnvio: timestamp('data_envio'),
  canal: text('canal'), // 'whatsapp', 'email'
  visualizado: boolean('visualizado').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const atividades = pgTable('atividades', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').references(() => clientes.id),
  titulo: text('titulo').notNull(),
  descricao: text('descricao'),
  tipo: text('tipo').notNull(), // 'documento', 'sucesso', 'alerta'
  createdAt: timestamp('created_at').defaultNow()
});

export const dashboardStats = pgTable('dashboard_stats', {
  id: serial('id').primaryKey(),
  obrigacoesPendentes: integer('obrigacoes_pendentes').default(0),
  documentosEnviados: integer('documentos_enviados').default(0),
  vencimentosHoje: integer('vencimentos_hoje').default(0),
  honorariosPendentes: decimal('honorarios_pendentes', { precision: 12, scale: 2 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Initialize Drizzle
export const db = drizzle(sql);

console.log('Database schema initialized');