// ============================================
// DASHBOARD MODULE
// Colégio Elizângela Filomena - Back Office
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    const session = await Auth.requireAuth();
    if (!session) return;

    // Initialize dashboard
    await initDashboard();
});

async function initDashboard() {
    // Load user info
    await loadUserInfo();

    // Load statistics
    await loadStats();

    // Load recent inscriptions
    await loadRecentInscricoes();

    // Load recent messages
    await loadRecentMessages();

    // Update badges
    await updateBadges();

    // Setup event listeners
    setupEventListeners();
}

// ============================================
// USER INFO
// ============================================

async function loadUserInfo() {
    const user = await Auth.getCurrentUser();
    const userName = document.getElementById('user-name');
    if (userName && user) {
        userName.textContent = user.email.split('@')[0];
    }
}

// ============================================
// STATISTICS
// ============================================

async function loadStats() {
    try {
        // Total inscriptions
        const { count: totalInscricoes } = await supabaseClient
            .from('inscricoes_2025')
            .select('*', { count: 'exact', head: true });

        document.getElementById('stat-inscricoes').textContent = totalInscricoes || 0;

        // Approved inscriptions
        const { count: aprovadas } = await supabaseClient
            .from('inscricoes_2025')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'aprovado');

        document.getElementById('stat-aprovadas').textContent = aprovadas || 0;

        // Pending inscriptions
        const { count: pendentes } = await supabaseClient
            .from('inscricoes_2025')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente');

        document.getElementById('stat-pendentes').textContent = pendentes || 0;

        // Unread messages
        const { count: mensagens } = await supabaseClient
            .from('contactos')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        document.getElementById('stat-mensagens').textContent = mensagens || 0;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// RECENT INSCRIPTIONS
// ============================================

async function loadRecentInscricoes() {
    try {
        const { data, error } = await supabaseClient
            .from('inscricoes_2025')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        const tbody = document.querySelector('#recent-inscricoes tbody');
        if (!tbody) return;

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--gray-400);">
                        Nenhuma inscrição registada
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td><strong>${item.nome_aluno}</strong></td>
                <td>${item.nivel_ensino}</td>
                <td><span class="status-badge ${item.status}">${item.status}</span></td>
                <td>${formatDate(item.created_at)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading inscricoes:', error);
    }
}

// ============================================
// RECENT MESSAGES
// ============================================

async function loadRecentMessages() {
    try {
        const { data, error } = await supabaseClient
            .from('contactos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4);

        if (error) throw error;

        const container = document.getElementById('recent-messages');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h4>Sem mensagens</h4>
                    <p>Não há mensagens por ler</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(msg => `
            <div class="message-item ${msg.is_read ? '' : 'unread'}" data-id="${msg.id}">
                <div class="message-avatar">${msg.nome.charAt(0).toUpperCase()}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-name">${msg.nome}</span>
                        <span class="message-time">${formatDate(msg.created_at)}</span>
                    </div>
                    <p class="message-preview">${msg.assunto || msg.mensagem.substring(0, 50)}...</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// ============================================
// BADGES
// ============================================

async function updateBadges() {
    try {
        // Pending inscriptions badge
        const { count: pendentes } = await supabaseClient
            .from('inscricoes_2025')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente');

        const inscricoesBadge = document.getElementById('inscricoes-badge');
        if (inscricoesBadge) {
            inscricoesBadge.textContent = pendentes || 0;
            inscricoesBadge.style.display = pendentes > 0 ? 'block' : 'none';
        }

        // Unread messages badge
        const { count: mensagens } = await supabaseClient
            .from('contactos')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        const mensagensBadge = document.getElementById('mensagens-badge');
        if (mensagensBadge) {
            mensagensBadge.textContent = mensagens || 0;
            mensagensBadge.style.display = mensagens > 0 ? 'block' : 'none';
        }

    } catch (error) {
        console.error('Error updating badges:', error);
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
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.querySelector('i').classList.add('fa-spin');
            await initDashboard();
            setTimeout(() => {
                refreshBtn.querySelector('i').classList.remove('fa-spin');
            }, 500);
        });
    }
}

// ============================================
// UTILITIES
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // If less than 24 hours, show relative time
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) {
            const minutes = Math.floor(diff / 60000);
            return minutes < 1 ? 'Agora' : `${minutes}m`;
        }
        return `${hours}h`;
    }

    // Otherwise show date
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit'
    });
}

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Export utilities
window.formatDate = formatDate;
window.showToast = showToast;
