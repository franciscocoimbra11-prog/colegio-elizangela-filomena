// ============================================
// AUTHENTICATION MODULE
// Colégio Elizângela Filomena - Back Office
// ============================================

const Auth = {
    // Check if user is authenticated
    async checkAuth() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    },

    // Redirect to login if not authenticated
    async requireAuth() {
        const session = await this.checkAuth();
        if (!session) {
            window.location.href = 'index.html';
            return null;
        }
        return session;
    },

    // Login with email and password
    async login(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        return data;
    },

    // Logout
    async logout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            throw error;
        }
        window.location.href = 'index.html';
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    }
};

// ============================================
// LOGIN PAGE HANDLERS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check if we're on the login page
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        // Check if already logged in
        const session = await Auth.checkAuth();
        if (session) {
            window.location.href = 'dashboard.html';
            return;
        }

        // Handle login form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('.btn-login');
            const errorDiv = document.getElementById('login-error');

            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A entrar...';
            errorDiv.style.display = 'none';

            try {
                await Auth.login(email, password);
                window.location.href = 'dashboard.html';
            } catch (error) {
                errorDiv.style.display = 'flex';
                errorDiv.querySelector('span').textContent = error.message || 'Credenciais inválidas';
                btn.disabled = false;
                btn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
            }
        });

        // Toggle password visibility
        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                const icon = togglePassword.querySelector('i');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }
    }

    // Handle logout button on other pages
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => Auth.logout());
    }
});
