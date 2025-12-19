// ============================================
// INSCRICOES MODULE
// Colégio Elizângela Filomena - Back Office
// ============================================

let currentInscricao = null;

document.addEventListener('DOMContentLoaded', async () => {
    const session = await Auth.requireAuth();
    if (!session) return;

    await loadInscricoes();
    setupEventListeners();
});

// ============================================
// LOAD INSCRICOES
// ============================================

async function loadInscricoes() {
    const tbody = document.getElementById('inscricoes-tbody');
    const loading = document.getElementById('loading');

    loading.style.display = 'flex';
    tbody.innerHTML = '';

    try {
        let query = supabaseClient
            .from('inscricoes_2025')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        const nivelFilter = document.getElementById('filter-nivel').value;
        const statusFilter = document.getElementById('filter-status').value;
        const searchTerm = document.getElementById('search-input').value;

        if (nivelFilter) query = query.eq('nivel_ensino', nivelFilter);
        if (statusFilter) query = query.eq('status', statusFilter);
        if (searchTerm) query = query.ilike('nome_aluno', `%${searchTerm}%`);

        const { data, error } = await query;

        if (error) throw error;

        loading.style.display = 'none';

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h4>Nenhuma inscrição encontrada</h4>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr data-id="${item.id}">
                <td><strong>${item.nome_aluno}</strong></td>
                <td>${item.nome_encarregado}</td>
                <td>${item.nivel_ensino}</td>
                <td>${item.telefone}</td>
                <td><span class="status-badge ${item.status}">${item.status}</span></td>
                <td>${formatDate(item.created_at)}</td>
                <td>
                    <button class="btn-icon btn-view" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                await viewInscricao(id);
            });
        });

    } catch (error) {
        console.error('Error loading inscricoes:', error);
        loading.style.display = 'none';
        showToast('Erro ao carregar inscrições', 'error');
    }
}

// ============================================
// VIEW INSCRICAO
// ============================================

async function viewInscricao(id) {
    try {
        const { data, error } = await supabaseClient
            .from('inscricoes_2025')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        currentInscricao = data;

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="detail-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Dados do Aluno</h4>
                    <div class="detail-row">
                        <span class="label">Nome:</span>
                        <span class="value">${data.nome_aluno}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Data Nascimento:</span>
                        <span class="value">${new Date(data.data_nascimento).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Nível Pretendido:</span>
                        <span class="value">${data.nivel_ensino}</span>
                    </div>
                    ${data.classe_pretendida ? `
                    <div class="detail-row">
                        <span class="label">Classe:</span>
                        <span class="value">${data.classe_pretendida}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="detail-section">
                    <h4><i class="fas fa-users"></i> Encarregado de Educação</h4>
                    <div class="detail-row">
                        <span class="label">Nome:</span>
                        <span class="value">${data.nome_encarregado}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Telefone:</span>
                        <span class="value">${data.telefone}</span>
                    </div>
                    ${data.telefone_alternativo ? `
                    <div class="detail-row">
                        <span class="label">Tel. Alternativo:</span>
                        <span class="value">${data.telefone_alternativo}</span>
                    </div>
                    ` : ''}
                    ${data.email ? `
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${data.email}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="detail-section full-width">
                    <h4><i class="fas fa-info-circle"></i> Estado</h4>
                    <div class="detail-row">
                        <span class="label">Estado Atual:</span>
                        <span class="status-badge ${data.status}">${data.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Data Inscrição:</span>
                        <span class="value">${new Date(data.created_at).toLocaleString('pt-PT')}</span>
                    </div>
                </div>
                ${data.observacoes ? `
                <div class="detail-section full-width">
                    <h4><i class="fas fa-comment"></i> Observações</h4>
                    <p>${data.observacoes}</p>
                </div>
                ` : ''}
            </div>
        `;

        document.getElementById('view-modal').classList.add('active');

    } catch (error) {
        console.error('Error viewing inscricao:', error);
        showToast('Erro ao carregar detalhes', 'error');
    }
}

// ============================================
// UPDATE STATUS
// ============================================

async function updateStatus(status) {
    if (!currentInscricao) return;

    try {
        const { error } = await supabaseClient
            .from('inscricoes_2025')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', currentInscricao.id);

        if (error) throw error;

        showToast(`Inscrição ${status === 'aprovado' ? 'aprovada' : 'rejeitada'} com sucesso!`, 'success');
        closeModal();
        await loadInscricoes();

    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Erro ao atualizar estado', 'error');
    }
}

function closeModal() {
    document.getElementById('view-modal').classList.remove('active');
    currentInscricao = null;
}

// ============================================
// EXPORT
// ============================================

async function exportToCSV() {
    try {
        const { data, error } = await supabaseClient
            .from('inscricoes_2025')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const headers = ['Nome Aluno', 'Data Nascimento', 'Nível Ensino', 'Encarregado', 'Telefone', 'Email', 'Estado', 'Data Inscrição'];
        const rows = data.map(item => [
            item.nome_aluno,
            item.data_nascimento,
            item.nivel_ensino,
            item.nome_encarregado,
            item.telefone,
            item.email || '',
            item.status,
            new Date(item.created_at).toLocaleDateString('pt-PT')
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscricoes_2025_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        showToast('Exportação concluída!', 'success');

    } catch (error) {
        console.error('Error exporting:', error);
        showToast('Erro na exportação', 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    // Filters
    document.getElementById('filter-nivel').addEventListener('change', loadInscricoes);
    document.getElementById('filter-status').addEventListener('change', loadInscricoes);

    // Search with debounce
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadInscricoes, 300);
    });

    // Modal actions
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('view-modal').addEventListener('click', (e) => {
        if (e.target.id === 'view-modal') closeModal();
    });

    document.getElementById('btn-approve').addEventListener('click', () => updateStatus('aprovado'));
    document.getElementById('btn-reject').addEventListener('click', () => updateStatus('rejeitado'));

    // Export
    document.getElementById('btn-export').addEventListener('click', exportToCSV);
}

// Add styles for detail grid
const style = document.createElement('style');
style.textContent = `
    .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    .detail-section {
        padding: 1rem;
        background: var(--gray-50);
        border-radius: var(--radius);
    }
    .detail-section.full-width {
        grid-column: span 2;
    }
    .detail-section h4 {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: var(--primary);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-200);
    }
    .detail-row:last-child {
        border-bottom: none;
    }
    .detail-row .label {
        color: var(--gray-500);
        font-size: 0.9rem;
    }
    .detail-row .value {
        font-weight: 500;
        color: var(--gray-800);
    }
`;
document.head.appendChild(style);
