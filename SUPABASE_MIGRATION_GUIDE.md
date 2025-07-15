# 🚀 Guia de Migração para Supabase

## 📋 Situação Atual
- **Banco atual**: Neon PostgreSQL (via @vercel/postgres)
- **Status**: ❌ NÃO CONFIGURADO (falta `POSTGRES_URL`)
- **Estrutura**: ✅ Completa (tabelas, APIs, migração)

## 🎯 Opções de Migração

### **Opção 1: Migração Simples (Recomendada)**
Manter o código atual e apenas configurar a connection string do Supabase:

1. **Criar projeto no Supabase**:
   - Acesse [supabase.com](https://supabase.com)
   - Crie novo projeto
   - Aguarde inicialização

2. **Obter connection string**:
   - Vá em Settings → Database
   - Copie a connection string PostgreSQL
   - Formato: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`

3. **Configurar no Vercel**:
   - Acesse Vercel Dashboard
   - Vá em Settings → Environment Variables
   - Adicione: `POSTGRES_URL` = sua connection string
   - Redeploy o projeto

4. **Executar migração**:
   ```bash
   curl -X GET https://seu-projeto.vercel.app/api/migrate
   ```

### **Opção 2: Migração com Cliente Supabase**
Usar o cliente oficial do Supabase para recursos extras:

1. **Instalar dependências** (✅ Já feito):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configurar variáveis de ambiente**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

3. **Executar SQL de migração**:
   - Copie o conteúdo de `lib/supabase-migration.sql`
   - Execute no Supabase SQL Editor

4. **Adaptar APIs** (opcional):
   - Substituir `@vercel/postgres` por `@supabase/supabase-js`
   - Usar client do Supabase para queries

## 🗂️ Estrutura de Tabelas

### **Tabelas Principais**:
- `usuarios` - Usuários do sistema
- `clientes` - Clientes da assessoria
- `configuracoes` - Configurações do sistema
- `logs` - Logs de atividades

### **Tabelas Expandidas**:
- `documentos` - Documentos dos clientes
- `obrigacoes` - Obrigações fiscais
- `parcelamentos` - Parcelamentos de impostos
- `whatsapp_conversas` - Conversas WhatsApp
- `whatsapp_mensagens` - Mensagens WhatsApp

## 🔧 Configuração Passo a Passo

### **1. Criar Projeto Supabase**
```bash
# 1. Acesse supabase.com
# 2. Clique em "New Project"
# 3. Escolha organização
# 4. Configure nome e senha
# 5. Aguarde criação (2-3 minutos)
```

### **2. Executar Migração SQL**
```sql
-- Copie todo o conteúdo de lib/supabase-migration.sql
-- Execute no Supabase SQL Editor
-- Verificar se todas as tabelas foram criadas
```

### **3. Configurar Variáveis de Ambiente**
```bash
# No Vercel Dashboard:
POSTGRES_URL=postgresql://postgres:[SUA_SENHA]@[HOST]:[PORT]/postgres

# Para cliente Supabase (opcional):
NEXT_PUBLIC_SUPABASE_URL=https://[ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_CHAVE_ANONIMA]
```

### **4. Testar Conexão**
```bash
# Teste via API
curl -X GET https://seu-projeto.vercel.app/api/migrate

# Resposta esperada:
{
  "success": true,
  "provider": "supabase",
  "connection": { ... },
  "stats": { ... }
}
```

## 🎨 Recursos Extras do Supabase

### **1. Real-time Subscriptions**
```typescript
// Escutar mudanças em tempo real
supabase
  .channel('clientes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'clientes' },
    (payload) => console.log('Mudança:', payload)
  )
  .subscribe()
```

### **2. Autenticação Integrada**
```typescript
// Login com Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'senha'
})
```

### **3. Storage para Documentos**
```typescript
// Upload de documentos
const { data, error } = await supabase.storage
  .from('documentos')
  .upload('cliente/documento.pdf', file)
```

### **4. Edge Functions**
```typescript
// Funções serverless no Supabase
const { data, error } = await supabase.functions
  .invoke('calcular-impostos', { body: { clienteId: '123' } })
```

## 🔒 Segurança e Permissões

### **1. Row Level Security (RLS)**
```sql
-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política de segurança
CREATE POLICY "Users can only see their own clients" ON clientes
  FOR SELECT USING (auth.uid() = usuario_id);
```

### **2. Backup Automático**
- ✅ Backup automático incluído no Supabase
- ✅ Point-in-time recovery
- ✅ Snapshots diários

## 📊 Vantagens da Migração

### **Benefícios Técnicos**:
- ✅ Interface administrativa completa
- ✅ Real-time subscriptions
- ✅ Autenticação integrada
- ✅ Storage para arquivos
- ✅ Edge functions
- ✅ Backup automático

### **Benefícios Operacionais**:
- ✅ Menor complexidade de manutenção
- ✅ Monitoring integrado
- ✅ Escalabilidade automática
- ✅ Logs detalhados
- ✅ API REST automática

## 🚨 Troubleshooting

### **Erro: Connection refused**
```bash
# Verificar se IP está na whitelist
# Supabase → Settings → Database → Connection pooling
```

### **Erro: Password authentication failed**
```bash
# Verificar senha no Supabase
# Resetar senha se necessário
```

### **Erro: Permission denied**
```bash
# Verificar RLS policies
# Desabilitar RLS temporariamente para testes
```

## 📞 Suporte

- **Documentação**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [Supabase Discord](https://discord.supabase.com)

---

**Recomendação**: Use a **Opção 1** (migração simples) para manter o código atual funcionando rapidamente, depois migre gradualmente para recursos específicos do Supabase conforme necessário.