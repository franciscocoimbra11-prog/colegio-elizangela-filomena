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
