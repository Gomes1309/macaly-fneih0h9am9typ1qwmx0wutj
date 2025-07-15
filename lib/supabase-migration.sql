-- Migração completa para Supabase
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'assistente',
    permissoes JSONB DEFAULT '[]',
    ativo BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    ie VARCHAR(50),
    tipo VARCHAR(50) DEFAULT 'simples',
    status VARCHAR(20) DEFAULT 'ativo',
    grupo VARCHAR(50) DEFAULT 'standard',
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    endereco TEXT,
    cep VARCHAR(10),
    responsavel VARCHAR(255),
    observacoes TEXT,
    atividade VARCHAR(255),
    faturamento_anual NUMERIC DEFAULT 0,
    funcionarios INTEGER DEFAULT 1,
    nirf VARCHAR(50),
    contador_responsavel VARCHAR(255),
    auditor VARCHAR(255),
    data_contrato TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_vencimento TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(255) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'string',
    descricao TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(255) NOT NULL,
    detalhes JSONB,
    ip VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos (adicional)
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    caminho VARCHAR(500) NOT NULL,
    tamanho INTEGER,
    mime_type VARCHAR(100),
    hash_arquivo VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ativo',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de obrigações
CREATE TABLE IF NOT EXISTS obrigacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    periodicidade VARCHAR(50) NOT NULL,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    valor NUMERIC,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de parcelamentos
CREATE TABLE IF NOT EXISTS parcelamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    valor_total NUMERIC NOT NULL,
    valor_parcela NUMERIC NOT NULL,
    parcelas_total INTEGER NOT NULL,
    parcelas_pagas INTEGER DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de WhatsApp (conversas)
CREATE TABLE IF NOT EXISTS whatsapp_conversas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    numero_telefone VARCHAR(20) NOT NULL,
    nome_contato VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'nova',
    ultima_mensagem TEXT,
    data_ultima_mensagem TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversa_id UUID REFERENCES whatsapp_conversas(id) ON DELETE CASCADE,
    remetente VARCHAR(20) NOT NULL, -- 'cliente' ou 'colaborador'
    mensagem TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'texto', -- 'texto', 'audio', 'imagem', 'documento'
    arquivo_url VARCHAR(500),
    lida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_documentos_cliente_id ON documentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_obrigacoes_cliente_id ON obrigacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_obrigacoes_data_vencimento ON obrigacoes(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_parcelamentos_cliente_id ON parcelamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversas_cliente_id ON whatsapp_conversas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_mensagens_conversa_id ON whatsapp_mensagens(conversa_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obrigacoes_updated_at BEFORE UPDATE ON obrigacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parcelamentos_updated_at BEFORE UPDATE ON parcelamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_conversas_updated_at BEFORE UPDATE ON whatsapp_conversas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
    ('sistema_nome', 'AG Assessoria', 'string', 'Nome do sistema'),
    ('sistema_versao', '1.0.0', 'string', 'Versão do sistema'),
    ('whatsapp_ativo', 'true', 'boolean', 'WhatsApp integração ativa'),
    ('backup_automatico', 'true', 'boolean', 'Backup automático ativo'),
    ('notificacoes_email', 'true', 'boolean', 'Notificações por email ativas')
ON CONFLICT (chave) DO NOTHING;

-- Inserir usuário administrador padrão
INSERT INTO usuarios (nome, email, senha_hash, role, permissoes, ativo) VALUES
    ('Administrador', 'admin@agassessoria.com', 'admin123', 'admin', '["all"]', true)
ON CONFLICT (email) DO NOTHING;

-- Inserir cliente de exemplo
INSERT INTO clientes (razao_social, nome_fantasia, cnpj, email, telefone, tipo, status, grupo) VALUES
    ('Exemplo Empresarial LTDA', 'Exemplo', '12.345.678/0001-90', 'contato@exemplo.com', '(11) 99999-9999', 'simples', 'ativo', 'standard')
ON CONFLICT (cnpj) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE clientes IS 'Tabela de clientes da assessoria';
COMMENT ON TABLE configuracoes IS 'Configurações do sistema';
COMMENT ON TABLE logs IS 'Logs de atividades do sistema';
COMMENT ON TABLE documentos IS 'Documentos dos clientes';
COMMENT ON TABLE obrigacoes IS 'Obrigações fiscais e trabalhistas';
COMMENT ON TABLE parcelamentos IS 'Parcelamentos de impostos';
COMMENT ON TABLE whatsapp_conversas IS 'Conversas do WhatsApp';
COMMENT ON TABLE whatsapp_mensagens IS 'Mensagens do WhatsApp';