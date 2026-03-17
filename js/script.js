/* ============================================
   GRAVITY ESTUDIO CREATIVO — script.js
   ============================================ */

// ── PRELOADER ──────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    // La barra termina en 0.7s + 0.9s = 1.6s
    // Pequeño margen → fade arranca a los 1.7s
    setTimeout(() => {
        loader.classList.add('loader-hidden');
        document.body.classList.remove('loading');

        // Eliminar del DOM tras el fade (0.55s)
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600);
    }, 1700);
});

// ── NAVBAR DINÁMICA ────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 60) {
        nav.style.padding = '0.7rem 7%';
        nav.style.background = 'rgba(246, 245, 240, 0.97)';
        nav.style.boxShadow = '0 4px 24px rgba(12,11,9,0.06)';
    } else {
        nav.style.padding = '1.1rem 7%';
        nav.style.background = 'rgba(246, 245, 240, 0.88)';
        nav.style.boxShadow = 'none';
    }
});

// ── MENÚ MÓVIL ─────────────────────────────
function toggleMenu() {
    const links = document.querySelector('.nav-links');
    const ham   = document.querySelector('.hamburger');
    const isOpen = links.classList.toggle('open');
    ham.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    document.querySelector('.nav-links').classList.remove('open');
    document.querySelector('.hamburger').classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// ── SMOOTH SCROLL ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ── SCROLL REVEAL (Intersection Observer) ──
const revealElements = document.querySelectorAll(
    '.service-card, .pack-card, .portfolio-item, .hero-card'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Pequeño delay escalonado según índice
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('pack-featured')
                    ? 'scale(1.03) translateY(0)'
                    : 'translateY(0)';
            }, i * 60);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = el.classList.contains('pack-featured')
        ? 'scale(1.03) translateY(20px)'
        : 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    revealObserver.observe(el);
});

// ── FILTROS DE PORTAFOLIO ──────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const show = filter === 'all' || item.dataset.cat === filter;
            item.style.opacity    = show ? '1' : '0.25';
            item.style.transform  = show ? 'scale(1)' : 'scale(0.97)';
            item.style.pointerEvents = show ? 'auto' : 'none';
        });
    });
});

// ── WHATSAPP CHAT FLOTANTE ─────────────────
const WA_NUMBER = '593984990787'; // Gravity Estudio Creativo

function toggleWap() {
    const widget = document.getElementById('wapWidget');
    const bubble = document.getElementById('wapBubble');
    const isOpen = widget.classList.toggle('open');

    // Ocultar burbuja al abrir
    if (isOpen) {
        bubble.classList.add('hidden');
        // Animar mensajes con delay escalonado
        setTimeout(() => animateWapMsgs(), 200);
    }
}

function animateWapMsgs() {
    const msgs = document.querySelectorAll('.wap-msg');
    msgs.forEach((m, i) => {
        m.style.animation = 'none';
        m.offsetHeight; // reflow
        m.style.animation = `msgSlide 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.15}s both`;
    });
}

function openWap(msg) {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

function sendWap() {
    const input = document.getElementById('wapInput');
    const text  = input.value.trim();
    if (!text) return;
    openWap(text);
    input.value = '';
}

// Mostrar burbuja de notificación después de 4s si el panel está cerrado
setTimeout(() => {
    const widget = document.getElementById('wapWidget');
    const bubble = document.getElementById('wapBubble');
    if (!widget.classList.contains('open')) {
        bubble.classList.remove('hidden');
        // Pequeña animación de rebote extra para llamar la atención
        bubble.style.animation = 'none';
        bubble.offsetHeight;
        bubble.style.animation = 'bubblePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both';
    }
}, 4000);
function handleForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulación de envío — reemplaza con tu lógica real (EmailJS, Formspree, etc.)
    setTimeout(() => {
        btn.textContent = '¡Mensaje enviado! ✦';
        btn.style.background = '#1a1a1a';
        btn.style.color = '#ffffff';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    }, 1400);
}