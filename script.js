// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Legacy mobile menu for index.html
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                if (q.nextElementSibling) {
                    q.nextElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Admission Form
    const admissaoForm = document.getElementById('admissao-form');
    const formSuccess = document.getElementById('form-success');

    if (admissaoForm && formSuccess) {
        admissaoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form
            if (validateForm(this)) {
                // Hide form, show success
                admissaoForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Contact Form
    const contactoForm = document.getElementById('contacto-form');
    const contactoSuccess = document.getElementById('contacto-success');

    if (contactoForm && contactoSuccess) {
        contactoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(this)) {
                contactoForm.style.display = 'none';
                contactoSuccess.style.display = 'block';
                contactoSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const successMsg = this.nextElementSibling;

            if (successMsg) {
                this.style.display = 'none';
                successMsg.style.display = 'block';
            }
        });
    }

    // News Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noticiaCards = document.querySelectorAll('.noticia-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            noticiaCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.mvv-card, .equipa-card, .instalacao-item, .documento-card, .noticia-card, .metodologia-card, .atividade-item').forEach(el => {
        observer.observe(el);
    });
});

// Form validation helper
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
        } else {
            field.style.borderColor = '';
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
            }
        }

        // Checkbox validation
        if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
        }
    });

    return isValid;
}

// Reset contact form
function resetContactForm() {
    const form = document.getElementById('contacto-form');
    const success = document.getElementById('contacto-success');

    if (form && success) {
        form.reset();
        form.style.display = 'block';
        success.style.display = 'none';
    }
}

// Sticky header effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header, #main-header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ==========================================
// PORTAL DO ALUNO MODAL
// ==========================================

// Portal Modal Elements
const portalBtn = document.getElementById('portal-btn');
const portalModal = document.getElementById('portal-modal');
const modalClose = document.getElementById('modal-close');
const portalForm = document.getElementById('portal-form');

// Open Portal Modal
if (portalBtn && portalModal) {
    portalBtn.addEventListener('click', function (e) {
        e.preventDefault();
        portalModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Re-initialize icons in modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// Close Portal Modal
if (modalClose && portalModal) {
    modalClose.addEventListener('click', function () {
        portalModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close on overlay click
if (portalModal) {
    portalModal.addEventListener('click', function (e) {
        if (e.target === portalModal) {
            portalModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && portalModal && portalModal.classList.contains('active')) {
        portalModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Portal Form Submission
if (portalForm) {
    portalForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('portal-email');
        const password = document.getElementById('portal-password');
        const submitBtn = this.querySelector('.btn-login');

        if (email && password && email.value && password.value) {
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A entrar...';
            submitBtn.disabled = true;

            // Simulate login (replace with actual API call)
            setTimeout(() => {
                // Show success message
                alert('Bem-vindo ao Portal do Aluno!\n\nEsta funcionalidade será integrada com o sistema escolar em breve.');

                // Reset form and close modal
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                portalModal.classList.remove('active');
                document.body.style.overflow = '';

                // Re-create icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 1500);
        }
    });
}

// ==========================================
// ENHANCED ANIMATIONS
// ==========================================

// Scroll Reveal Animation
const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);

// ==========================================
// ANIMATED COUNTERS
// ==========================================

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Trigger counters when in view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ==========================================
// PARTICLE SYSTEM
// ==========================================

const createParticles = (container, count = 20) => {
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
};

// Create particles in hero
const heroSection = document.getElementById('hero');
if (heroSection) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-bg';
    heroSection.insertBefore(particlesContainer, heroSection.firstChild);
    createParticles(particlesContainer, 15);
}

// ==========================================
// PARALLAX EFFECT
// ==========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');

    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ==========================================
// MAGNETIC BUTTON EFFECT
// ==========================================

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ==========================================
// SMOOTH SCROLL WITH PROGRESS
// ==========================================

// Add shine effect to cards on hover
document.querySelectorAll('.card, .teaching-card, .news-card').forEach(card => {
    card.classList.add('card-shine');
});

// ==========================================
// DYNAMIC STATS SECTION
// ==========================================

const statsHTML = `
<section class="stats-section">
    <div class="container">
        <div class="stats-grid">
            <div class="counter-box reveal stagger-1">
                <div class="counter-number" data-target="1200">0</div>
                <div class="counter-label">Alunos</div>
            </div>
            <div class="counter-box reveal stagger-2">
                <div class="counter-number" data-target="85">0</div>
                <div class="counter-label">Professores</div>
            </div>
            <div class="counter-box reveal stagger-3">
                <div class="counter-number" data-target="31">0</div>
                <div class="counter-label">Anos de História</div>
            </div>
            <div class="counter-box reveal stagger-4">
                <div class="counter-number" data-target="98">0</div>
                <div class="counter-label">% Taxa de Sucesso</div>
            </div>
        </div>
    </div>
</section>
`;

// Insert stats section after features section
const featuresSection = document.getElementById('diferenciais');
if (featuresSection) {
    featuresSection.insertAdjacentHTML('afterend', statsHTML);

    // Re-observe new counter elements
    document.querySelectorAll('.counter-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // Re-run reveal for new elements
    revealElements();
}

// ==========================================
// LOADING ANIMATION
// ==========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add reveal classes to existing elements
    document.querySelectorAll('.card, .teaching-card, .feature-item').forEach((el, index) => {
        el.classList.add('reveal');
        el.classList.add(`stagger-${(index % 6) + 1}`);
    });

    // Trigger reveal check
    setTimeout(revealElements, 100);
});

// ==========================================
// CURSOR TRAIL EFFECT (Optional)
// ==========================================

const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.opacity = '0.5';
    });

    const animateTrail = () => {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    };

    animateTrail();
};

// Enable cursor trail on desktop only
if (window.innerWidth > 768) {
    createCursorTrail();
}

// ==========================================
// TYPING EFFECT FOR HERO
// ==========================================

const typewriterEffect = (element, text, speed = 50) => {
    if (!element) return;
    element.textContent = '';
    let i = 0;

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// Apply to hero subtitle if present
const heroSubtitle = document.querySelector('.hero-content p');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    setTimeout(() => {
        typewriterEffect(heroSubtitle, originalText, 30);
    }, 1000);
}

