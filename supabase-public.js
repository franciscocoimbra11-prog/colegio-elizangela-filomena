// ============================================
// SUPABASE INTEGRATION - PUBLIC SITE
// Colégio Elizângela Filomena
// ============================================

// IMPORTANTE: Substitua com as suas credenciais do Supabase
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON-PUBLICA';

// Initialize Supabase (only if Supabase JS is loaded)
let supabase = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized');
        return true;
    }
    return false;
}

// ============================================
// ADMISSÕES FORM HANDLER
// ============================================

async function submitAdmissao(formData) {
    if (!supabase) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Sistema indisponível' };
    }

    try {
        const { data, error } = await supabase
            .from('inscricoes_2025')
            .insert([{
                nome_aluno: formData.nomeAluno,
                data_nascimento: formData.dataNascimento,
                genero: formData.genero,
                nivel_ensino: formData.nivelEnsino,
                classe_pretendida: formData.classe,
                nome_encarregado: formData.nomeEncarregado,
                telefone: formData.telefone,
                telefone_alternativo: formData.telefoneAlt,
                email: formData.email,
                morada: formData.morada,
                escola_anterior: formData.escolaAnterior,
                observacoes: formData.observacoes,
                status: 'pendente'
            }]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting admissao:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// CONTACTOS FORM HANDLER
// ============================================

async function submitContacto(formData) {
    if (!supabase) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Sistema indisponível' };
    }

    try {
        const { data, error } = await supabase
            .from('contactos')
            .insert([{
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone,
                assunto: formData.assunto,
                mensagem: formData.mensagem
            }]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting contacto:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// NEWSLETTER FORM HANDLER
// ============================================

async function submitNewsletter(email) {
    if (!supabase) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Sistema indisponível' };
    }

    try {
        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return { success: false, error: 'Este email já está subscrito' };
        }

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, is_active: true }]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error subscribing newsletter:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOAD PUBLIC NEWS
// ============================================

async function loadPublicNews(limit = 6) {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('noticias')
            .select('id, titulo, resumo, imagem_url, categoria, data_publicacao')
            .eq('is_published', true)
            .order('data_publicacao', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading news:', error);
        return [];
    }
}

// ============================================
// LOAD PUBLIC DOCUMENTS
// ============================================

async function loadPublicDocuments(categoria = null) {
    if (!supabase) return [];

    try {
        let query = supabase
            .from('documentos_escolares')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });

        if (categoria) {
            query = query.eq('categoria', categoria);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading documents:', error);
        return [];
    }
}

// ============================================
// AUTO-INITIALIZE ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize Supabase
    if (!initSupabase()) {
        console.log('Supabase JS not loaded - using simulation mode');
    }

    // Hook into existing forms
    hookAdmissaoForm();
    hookContactoForm();
    hookNewsletterForm();
});

function hookAdmissaoForm() {
    const form = document.getElementById('admissao-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            nomeAluno: form.querySelector('[name="nome_aluno"]')?.value,
            dataNascimento: form.querySelector('[name="data_nascimento"]')?.value,
            genero: form.querySelector('[name="genero"]')?.value,
            nivelEnsino: form.querySelector('[name="nivel_ensino"]')?.value,
            classe: form.querySelector('[name="classe"]')?.value,
            nomeEncarregado: form.querySelector('[name="nome_encarregado"]')?.value,
            telefone: form.querySelector('[name="telefone"]')?.value,
            telefoneAlt: form.querySelector('[name="telefone_alt"]')?.value,
            email: form.querySelector('[name="email"]')?.value,
            morada: form.querySelector('[name="morada"]')?.value,
            escolaAnterior: form.querySelector('[name="escola_anterior"]')?.value,
            observacoes: form.querySelector('[name="observacoes"]')?.value
        };

        if (supabase) {
            const result = await submitAdmissao(formData);
            if (result.success) {
                showFormSuccess(form, 'Inscrição enviada com sucesso! Entraremos em contacto em breve.');
            } else {
                showFormError(form, result.error);
            }
        } else {
            // Fallback for simulation
            showFormSuccess(form, 'Inscrição enviada com sucesso! (Modo de demonstração)');
        }
    });
}

function hookContactoForm() {
    const form = document.getElementById('contacto-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            nome: form.querySelector('[name="nome"]')?.value,
            email: form.querySelector('[name="email"]')?.value,
            telefone: form.querySelector('[name="telefone"]')?.value,
            assunto: form.querySelector('[name="assunto"]')?.value,
            mensagem: form.querySelector('[name="mensagem"]')?.value
        };

        if (supabase) {
            const result = await submitContacto(formData);
            if (result.success) {
                showFormSuccess(form, 'Mensagem enviada com sucesso!');
            } else {
                showFormError(form, result.error);
            }
        } else {
            showFormSuccess(form, 'Mensagem enviada com sucesso! (Modo de demonstração)');
        }
    });
}

function hookNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('[name="email"]')?.value || form.querySelector('input[type="email"]')?.value;

        if (supabase && email) {
            const result = await submitNewsletter(email);
            if (result.success) {
                showFormSuccess(form, 'Subscrição efetuada com sucesso!');
            } else {
                showFormError(form, result.error);
            }
        } else if (email) {
            showFormSuccess(form, 'Subscrição efetuada! (Modo de demonstração)');
        }
    });
}

function showFormSuccess(form, message) {
    const successDiv = form.nextElementSibling;
    if (successDiv && successDiv.id && successDiv.id.includes('success')) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
    } else {
        alert(message);
        form.reset();
    }
}

function showFormError(form, message) {
    alert('Erro: ' + message);
}

// Export for external use
window.CEFSupabase = {
    submitAdmissao,
    submitContacto,
    submitNewsletter,
    loadPublicNews,
    loadPublicDocuments
};
