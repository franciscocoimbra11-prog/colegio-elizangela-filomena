-- ============================================
-- COLÉGIO ELIZÂNGELA FILOMENA
-- Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PÁGINAS DE CONTEÚDO
-- ============================================
CREATE TABLE IF NOT EXISTS paginas_conteudo (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    conteudo_html TEXT,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pages
INSERT INTO paginas_conteudo (slug, titulo, conteudo_html) VALUES
('quem-somos', 'Quem Somos', '<h2>O Colégio Elizângela Filomena</h2><p>Fundado em 1994, o Colégio Elizângela Filomena é uma referência em educação de qualidade em Angola.</p>'),
('missao-visao', 'Missão e Visão', '<h2>Nossa Missão</h2><p>Formar cidadãos preparados para os desafios do futuro.</p>')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. NOTÍCIAS E EVENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS noticias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT,
    corpo TEXT,
    imagem_url TEXT,
    categoria VARCHAR(50) DEFAULT 'noticia',
    is_published BOOLEAN DEFAULT false,
    data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. INSCRIÇÕES 2025
-- ============================================
CREATE TABLE IF NOT EXISTS inscricoes_2025 (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome_aluno VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    genero VARCHAR(20),
    nivel_ensino VARCHAR(100) NOT NULL,
    classe_pretendida VARCHAR(50),
    nome_encarregado VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    telefone_alternativo VARCHAR(50),
    email VARCHAR(255),
    morada TEXT,
    escola_anterior VARCHAR(255),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'pendente',
    status_pagamento VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. DOCUMENTOS ESCOLARES
-- ============================================
CREATE TABLE IF NOT EXISTS documentos_escolares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    url_pdf TEXT NOT NULL,
    ano_lectivo VARCHAR(20) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CONTACTOS / MENSAGENS
-- ============================================
CREATE TABLE IF NOT EXISTS contactos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. ADMIN ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE paginas_conteudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes_2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_escolares ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published news" ON noticias
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view public documents" ON documentos_escolares
    FOR SELECT USING (is_public = true);

CREATE POLICY "Public can view pages" ON paginas_conteudo
    FOR SELECT USING (true);

-- Public can insert (forms)
CREATE POLICY "Public can submit inscricoes" ON inscricoes_2025
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit contactos" ON contactos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can subscribe newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Authenticated users have full access
CREATE POLICY "Authenticated full access noticias" ON noticias
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated full access inscricoes" ON inscricoes_2025
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated full access contactos" ON contactos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated full access documentos" ON documentos_escolares
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated full access newsletter" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated full access paginas" ON paginas_conteudo
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes_2025(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_nivel ON inscricoes_2025(nivel_ensino);
CREATE INDEX IF NOT EXISTS idx_noticias_published ON noticias(is_published);
CREATE INDEX IF NOT EXISTS idx_noticias_data ON noticias(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_contactos_read ON contactos(is_read);
CREATE INDEX IF NOT EXISTS idx_documentos_categoria ON documentos_escolares(categoria);

-- ============================================
-- STORAGE BUCKET FOR DOCUMENTS
-- ============================================
-- Run this in Supabase Dashboard > Storage:
-- Create bucket: 'documentos'
-- Create bucket: 'imagens'
