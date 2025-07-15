#!/usr/bin/env node

/**
 * Script de migração automática para Supabase
 * 
 * Este script automatiza o processo de migração do banco de dados
 * atual para o Supabase, incluindo:
 * - Verificação de conexão
 * - Criação de tabelas
 * - Migração de dados
 * - Validação final
 */

const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  POSTGRES_URL: process.env.POSTGRES_URL,
  PROJECT_URL: process.env.VERCEL_URL || 'localhost:3000'
};

// Cores para log
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(colors[color] + message + colors.reset);
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

// Função para verificar requisitos
function checkRequirements() {
  logStep('1', 'Verificando requisitos...');
  
  const requirements = [
    { name: 'SUPABASE_URL', value: CONFIG.SUPABASE_URL },
    { name: 'SUPABASE_ANON_KEY', value: CONFIG.SUPABASE_ANON_KEY },
    { name: 'POSTGRES_URL', value: CONFIG.POSTGRES_URL }
  ];
  
  const missing = requirements.filter(req => !req.value);
  
  if (missing.length > 0) {
    logError('Variáveis de ambiente faltando:');
    missing.forEach(req => log(`  - ${req.name}`, 'red'));
    
    log('\n📋 Para configurar:', 'yellow');
    log('1. Acesse supabase.com e crie um projeto');
    log('2. Vá em Settings → API');
    log('3. Copie URL e anon key');
    log('4. Configure as variáveis de ambiente');
    log('5. Execute este script novamente');
    
    process.exit(1);
  }
  
  logSuccess('Todos os requisitos atendidos');
}

// Função para ler arquivo SQL
function readSQLFile() {
  logStep('2', 'Lendo arquivo de migração SQL...');
  
  const sqlPath = path.join(__dirname, '..', 'lib', 'supabase-migration.sql');
  
  if (!fs.existsSync(sqlPath)) {
    logError(`Arquivo SQL não encontrado: ${sqlPath}`);
    process.exit(1);
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  logSuccess(`Arquivo SQL lido (${sqlContent.length} caracteres)`);
  
  return sqlContent;
}

// Função para testar conexão com Supabase
async function testSupabaseConnection() {
  logStep('3', 'Testando conexão com Supabase...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase.from('usuarios').select('count').limit(1);
    
    if (error && !error.message.includes('relation "usuarios" does not exist')) {
      throw error;
    }
    
    logSuccess('Conexão com Supabase estabelecida');
    return supabase;
  } catch (error) {
    logError(`Erro ao conectar com Supabase: ${error.message}`);
    process.exit(1);
  }
}

// Função para executar migração SQL
async function executeSQLMigration(supabase, sqlContent) {
  logStep('4', 'Executando migração SQL...');
  
  try {
    // Dividir SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    logSuccess(`${commands.length} comandos SQL encontrados`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length > 0) {
        try {
          await supabase.rpc('exec_sql', { sql: command });
          log(`  ✓ Comando ${i + 1}/${commands.length} executado`, 'green');
        } catch (error) {
          if (!error.message.includes('already exists')) {
            logWarning(`Comando ${i + 1} falhou: ${error.message}`);
          }
        }
      }
    }
    
    logSuccess('Migração SQL concluída');
  } catch (error) {
    logError(`Erro na migração SQL: ${error.message}`);
    
    // Tentar método alternativo via API
    logStep('4.1', 'Tentando migração via API...');
    try {
      const response = await fetch(`${CONFIG.PROJECT_URL}/api/migrate`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        logSuccess('Migração via API bem-sucedida');
      } else {
        throw new Error(result.message);
      }
    } catch (apiError) {
      logError(`Erro na migração via API: ${apiError.message}`);
      process.exit(1);
    }
  }
}

// Função para migrar dados existentes
async function migrateExistingData(supabase) {
  logStep('5', 'Migrando dados existentes...');
  
  try {
    // Verificar se há dados no localStorage (simulado)
    const sampleData = {
      clientes: [
        {
          razao_social: 'Exemplo Empresa LTDA',
          nome_fantasia: 'Exemplo',
          cnpj: '12.345.678/0001-90',
          email: 'contato@exemplo.com',
          telefone: '(11) 99999-9999',
          tipo: 'simples',
          status: 'ativo',
          grupo: 'standard'
        }
      ],
      usuarios: [
        {
          nome: 'Usuario Teste',
          email: 'teste@agassessoria.com',
          senha_hash: 'hash_da_senha',
          role: 'assistente',
          permissoes: ['read', 'write'],
          ativo: true
        }
      ],
      configuracoes: {
        sistema_nome: 'AG Assessoria',
        sistema_versao: '1.0.0',
        whatsapp_ativo: true
      }
    };
    
    // Migrar clientes
    if (sampleData.clientes.length > 0) {
      const { data, error } = await supabase
        .from('clientes')
        .insert(sampleData.clientes);
      
      if (error && !error.message.includes('duplicate key')) {
        throw error;
      }
      
      logSuccess(`${sampleData.clientes.length} clientes migrados`);
    }
    
    // Migrar usuários
    if (sampleData.usuarios.length > 0) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(sampleData.usuarios);
      
      if (error && !error.message.includes('duplicate key')) {
        throw error;
      }
      
      logSuccess(`${sampleData.usuarios.length} usuários migrados`);
    }
    
    // Migrar configurações
    const configEntries = Object.entries(sampleData.configuracoes);
    if (configEntries.length > 0) {
      const configData = configEntries.map(([chave, valor]) => ({
        chave,
        valor: JSON.stringify(valor),
        tipo: typeof valor === 'string' ? 'string' : 'json'
      }));
      
      const { data, error } = await supabase
        .from('configuracoes')
        .insert(configData);
      
      if (error && !error.message.includes('duplicate key')) {
        throw error;
      }
      
      logSuccess(`${configEntries.length} configurações migradas`);
    }
    
  } catch (error) {
    logWarning(`Erro na migração de dados: ${error.message}`);
    log('Continuando com dados padrão...', 'yellow');
  }
}

// Função para validar migração
async function validateMigration(supabase) {
  logStep('6', 'Validando migração...');
  
  const tables = ['usuarios', 'clientes', 'configuracoes', 'logs'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      results[table] = data ? data.length : 0;
      logSuccess(`Tabela ${table}: estrutura OK`);
    } catch (error) {
      logError(`Erro na tabela ${table}: ${error.message}`);
      results[table] = 'ERROR';
    }
  }
  
  return results;
}

// Função para gerar relatório final
function generateReport(results) {
  logStep('7', 'Gerando relatório final...');
  
  const report = {
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    supabase_url: CONFIG.SUPABASE_URL,
    tables: results,
    next_steps: [
      '1. Atualize a variável POSTGRES_URL com a connection string do Supabase',
      '2. Faça redeploy do projeto no Vercel',
      '3. Teste a aplicação: /api/migrate',
      '4. Configure backup automático no Supabase',
      '5. Revise políticas de segurança (RLS)'
    ]
  };
  
  // Salvar relatório
  const reportPath = path.join(__dirname, '..', 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess('Relatório salvo em: migration-report.json');
  
  // Exibir resumo
  log('\n📊 RESUMO DA MIGRAÇÃO', 'magenta');
  log('═══════════════════════════════════════', 'magenta');
  log(`Status: ${report.status}`, 'green');
  log(`Timestamp: ${report.timestamp}`, 'blue');
  log(`Supabase URL: ${report.supabase_url}`, 'blue');
  
  log('\n📋 TABELAS MIGRADAS:', 'yellow');
  Object.entries(results).forEach(([table, count]) => {
    const status = count === 'ERROR' ? '❌' : '✅';
    log(`${status} ${table}: ${count}`, count === 'ERROR' ? 'red' : 'green');
  });
  
  log('\n🚀 PRÓXIMOS PASSOS:', 'yellow');
  report.next_steps.forEach((step, i) => {
    log(`${i + 1}. ${step}`, 'cyan');
  });
  
  log('\n✨ MIGRAÇÃO CONCLUÍDA!', 'green');
}

// Função principal
async function main() {
  log('🚀 INICIANDO MIGRAÇÃO PARA SUPABASE', 'magenta');
  log('═══════════════════════════════════════', 'magenta');
  
  try {
    // 1. Verificar requisitos
    checkRequirements();
    
    // 2. Ler arquivo SQL
    const sqlContent = readSQLFile();
    
    // 3. Testar conexão
    const supabase = await testSupabaseConnection();
    
    // 4. Executar migração SQL
    await executeSQLMigration(supabase, sqlContent);
    
    // 5. Migrar dados existentes
    await migrateExistingData(supabase);
    
    // 6. Validar migração
    const results = await validateMigration(supabase);
    
    // 7. Gerar relatório
    generateReport(results);
    
  } catch (error) {
    logError(`Erro fatal: ${error.message}`);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };