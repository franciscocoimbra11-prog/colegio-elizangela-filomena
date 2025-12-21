-- ============================================
-- EXTENDED SCHEMA FOR MULTI-ROLE PORTALS
-- Colégio Elizângela Filomena
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- 1. USER PROFILES (for all users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ALUNOS (Students)
CREATE TABLE IF NOT EXISTS alunos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    encarregado_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    numero_aluno VARCHAR(20) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    genero VARCHAR(20),
    nivel_ensino VARCHAR(100),
    classe VARCHAR(50),
    turma VARCHAR(10),
    ano_lectivo VARCHAR(20) DEFAULT '2024/2025',
    status VARCHAR(50) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAGAMENTOS (Payments/Fees)
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL DEFAULT 'propina',
    mes_referencia VARCHAR(50),
    ano_lectivo VARCHAR(20) DEFAULT '2024/2025',
    valor DECIMAL(12,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(50) DEFAULT 'pendente',
    comprovativo_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. NOTAS (Grades)
CREATE TABLE IF NOT EXISTS notas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina VARCHAR(100) NOT NULL,
    nota DECIMAL(4,2) NOT NULL,
    trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 3),
    ano_lectivo VARCHAR(20) DEFAULT '2024/2025',
    tipo_avaliacao VARCHAR(50) DEFAULT 'trimestral',
    professor_id UUID REFERENCES auth.users(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. HORARIOS (Schedules)
CREATE TABLE IF NOT EXISTS horarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    turma VARCHAR(50) NOT NULL,
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    sala VARCHAR(50),
    professor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated can view all profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for alunos
CREATE POLICY "Students can view own record" ON alunos
    FOR SELECT USING (user_id = auth.uid() OR encarregado_id = auth.uid());

CREATE POLICY "Authenticated full access alunos" ON alunos
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for pagamentos
CREATE POLICY "View own payments" ON pagamentos
    FOR SELECT USING (
        aluno_id IN (SELECT id FROM alunos WHERE user_id = auth.uid() OR encarregado_id = auth.uid())
    );

CREATE POLICY "Authenticated full access pagamentos" ON pagamentos
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for notas
CREATE POLICY "View own grades" ON notas
    FOR SELECT USING (
        aluno_id IN (SELECT id FROM alunos WHERE user_id = auth.uid() OR encarregado_id = auth.uid())
    );

CREATE POLICY "Authenticated full access notas" ON notas
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for horarios
CREATE POLICY "Anyone can view horarios" ON horarios
    FOR SELECT USING (true);

CREATE POLICY "Authenticated full access horarios" ON horarios
    FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alunos_user_id ON alunos(user_id);
CREATE INDEX IF NOT EXISTS idx_alunos_encarregado_id ON alunos(encarregado_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turma ON alunos(turma);
CREATE INDEX IF NOT EXISTS idx_pagamentos_aluno_id ON pagamentos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_notas_aluno_id ON notas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_horarios_turma ON horarios(turma);
