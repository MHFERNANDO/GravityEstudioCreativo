/* ============================================
   GRAVITY ESTUDIO CREATIVO — script.js v5.0
   ============================================ */

/* ── PRELOADER ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loader-hidden');
            document.body.classList.remove('loading');
        }
    }, 1800);
});

/* ── NAVBAR — scroll behavior ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (navbar) {
        if (current > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    lastScroll = current;
}, { passive: true });

/* ── MENÚ MÓVIL ── */
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!navLinks || !hamburger) return;

    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Cerrar menú al hacer clic en un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks) navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ── SCROLL REVEAL ── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Dejar de observar una vez revelado
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ── FORMULARIO DE CONTACTO ── */
function handleForm(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (!form || !success) return;

    // Simulación de envío — integrar con backend/FormSubmit/Formspree cuando esté listo
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
    }

    setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        // Reset para reutilización
        form.reset();
    }, 1200);
}

/* ── WHATSAPP WIDGET ── */
let wapOpen = false;

function toggleWap() {
    const panel = document.getElementById('wapPanel');
    const btn = document.getElementById('wapBtn');
    const bubble = document.getElementById('wapBubble');

    if (!panel || !btn) return;

    wapOpen = !wapOpen;

    panel.classList.toggle('open', wapOpen);
    btn.classList.toggle('open', wapOpen);

    if (bubble) {
        bubble.style.display = wapOpen ? 'none' : 'flex';
    }
}

function openWap(message) {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/593984990787?text=${encoded}`, '_blank');
}

function sendWap() {
    const input = document.getElementById('wapInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    openWap(msg);
    input.value = '';
}

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ── VIDEO HERO FALLBACK ── */
const heroVideo = document.querySelector('.hero-video-bg');
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        // Si el video falla, el poster (imagen de fondo) se mostrará automáticamente
        heroVideo.style.display = 'none';
    });

    // Pausar video cuando no es visible (rendimiento)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(() => {});
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.1 });

    videoObserver.observe(heroVideo);
}