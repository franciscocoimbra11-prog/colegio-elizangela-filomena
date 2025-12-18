// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

// Form Submission Simulation
const admissionForm = document.getElementById('admission-form');

if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = admissionForm.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = 'Enviando...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('A sua pré-inscrição foi enviada com sucesso! A nossa secretaria entrará em contacto em breve.');
            admissionForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

// Newsletter Simulation
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado por subscrever a nossa newsletter!');
        newsletterForm.reset();
    });
}

// Scroll effects
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
    } else {
        header.style.padding = '1rem 0';
    }
});
