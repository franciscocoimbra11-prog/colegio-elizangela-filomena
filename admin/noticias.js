// ============================================
// NOTICIAS MODULE
// Colégio Elizângela Filomena - Back Office
// ============================================

let currentNews = null;

document.addEventListener('DOMContentLoaded', async () => {
    const session = await Auth.requireAuth();
    if (!session) return;

    await loadNews();
    setupEventListeners();
    setupEditor();
});

// ============================================
// LOAD NEWS
// ============================================

async function loadNews() {
    const grid = document.getElementById('news-grid');
    const loading = document.getElementById('loading');

    loading.style.display = 'flex';
    grid.innerHTML = '';

    try {
        let query = supabaseClient
            .from('noticias')
            .select('*')
            .order('created_at', { ascending: false });

        const categoryFilter = document.getElementById('filter-category').value;
        const publishedFilter = document.getElementById('filter-published').value;
        const searchTerm = document.getElementById('search-input').value;

        if (categoryFilter) query = query.eq('categoria', categoryFilter);
        if (publishedFilter) query = query.eq('is_published', publishedFilter === 'true');
        if (searchTerm) query = query.ilike('titulo', `%${searchTerm}%`);

        const { data, error } = await query;

        if (error) throw error;

        loading.style.display = 'none';

        if (!data || data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: span 3;">
                    <i class="fas fa-newspaper"></i>
                    <h4>Nenhuma notícia encontrada</h4>
                    <p>Clique em "Nova Notícia" para começar</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = data.map(item => `
            <div class="news-card" data-id="${item.id}">
                <div class="news-card-image">
                    ${item.imagem_url
                ? `<img src="${item.imagem_url}" alt="${item.titulo}">`
                : '<i class="fas fa-image"></i>'
            }
                </div>
                <div class="news-card-body">
                    <span class="news-card-category">${item.categoria}</span>
                    <h4 class="news-card-title">${item.titulo}</h4>
                    <p class="news-card-date">${formatDate(item.created_at)}</p>
                </div>
                <div class="news-card-footer">
                    <span class="news-status ${item.is_published ? 'published' : 'draft'}">
                        <i class="fas fa-${item.is_published ? 'check-circle' : 'clock'}"></i>
                        ${item.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                    <div>
                        <button class="btn-icon btn-edit" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.news-card .btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.closest('.news-card').dataset.id;
                editNews(id);
            });
        });

        document.querySelectorAll('.news-card .btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.closest('.news-card').dataset.id;
                deleteNews(id);
            });
        });

    } catch (error) {
        console.error('Error loading news:', error);
        loading.style.display = 'none';
        showToast('Erro ao carregar notícias', 'error');
    }
}

// ============================================
// CREATE / EDIT NEWS
// ============================================

function openNewModal() {
    currentNews = null;
    document.getElementById('modal-title').textContent = 'Nova Notícia';
    document.getElementById('news-form').reset();
    document.getElementById('news-id').value = '';
    document.getElementById('news-content').innerHTML = '';
    document.getElementById('editor-modal').classList.add('active');
}

async function editNews(id) {
    try {
        const { data, error } = await supabaseClient
            .from('noticias')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        currentNews = data;

        document.getElementById('modal-title').textContent = 'Editar Notícia';
        document.getElementById('news-id').value = data.id;
        document.getElementById('news-title').value = data.titulo;
        document.getElementById('news-category').value = data.categoria;
        document.getElementById('news-summary').value = data.resumo || '';
        document.getElementById('news-content').innerHTML = data.corpo || '';
        document.getElementById('news-image').value = data.imagem_url || '';
        document.getElementById('news-published').checked = data.is_published;

        document.getElementById('editor-modal').classList.add('active');

    } catch (error) {
        console.error('Error loading news:', error);
        showToast('Erro ao carregar notícia', 'error');
    }
}

async function saveNews() {
    const id = document.getElementById('news-id').value;
    const newsData = {
        titulo: document.getElementById('news-title').value,
        categoria: document.getElementById('news-category').value,
        resumo: document.getElementById('news-summary').value,
        corpo: document.getElementById('news-content').innerHTML,
        imagem_url: document.getElementById('news-image').value || null,
        is_published: document.getElementById('news-published').checked,
        updated_at: new Date().toISOString()
    };

    if (document.getElementById('news-published').checked && !currentNews?.is_published) {
        newsData.data_publicacao = new Date().toISOString();
    }

    try {
        let error;

        if (id) {
            ({ error } = await supabaseClient
                .from('noticias')
                .update(newsData)
                .eq('id', id));
        } else {
            ({ error } = await supabaseClient
                .from('noticias')
                .insert([newsData]));
        }

        if (error) throw error;

        showToast(id ? 'Notícia atualizada!' : 'Notícia criada!', 'success');
        closeModal();
        await loadNews();

    } catch (error) {
        console.error('Error saving news:', error);
        showToast('Erro ao guardar notícia', 'error');
    }
}

async function deleteNews(id) {
    if (!confirm('Tem a certeza que deseja eliminar esta notícia?')) return;

    try {
        const { error } = await supabaseClient
            .from('noticias')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast('Notícia eliminada!', 'success');
        await loadNews();

    } catch (error) {
        console.error('Error deleting news:', error);
        showToast('Erro ao eliminar notícia', 'error');
    }
}

function closeModal() {
    document.getElementById('editor-modal').classList.remove('active');
    currentNews = null;
}

// ============================================
// RICH TEXT EDITOR
// ============================================

function setupEditor() {
    document.querySelectorAll('.editor-toolbar button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;
            const value = btn.dataset.value || null;
            document.execCommand(command, false, value);
        });
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Filters
    document.getElementById('filter-category').addEventListener('change', loadNews);
    document.getElementById('filter-published').addEventListener('change', loadNews);

    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadNews, 300);
    });

    // Modal
    document.getElementById('btn-new-news').addEventListener('click', openNewModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('btn-cancel').addEventListener('click', closeModal);
    document.getElementById('btn-save').addEventListener('click', saveNews);

    document.getElementById('editor-modal').addEventListener('click', (e) => {
        if (e.target.id === 'editor-modal') closeModal();
    });
}
