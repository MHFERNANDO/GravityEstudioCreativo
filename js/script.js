/* ============================================
   GRAVITY ESTUDIO CREATIVO — script.js
   Mobile-first · Touch optimizado
   ============================================ */

// ── DETECCIÓN DE DISPOSITIVO ───────────────
const isTouchDevice = () =>
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// ── PRELOADER ──────────────────────────────
window.addEventListener('load', removePreloader);
const maxLoaderTime = setTimeout(removePreloader, 4000);
let preloaderRemoved = false;

function removePreloader() {
    if (preloaderRemoved) return;
    preloaderRemoved = true;
    clearTimeout(maxLoaderTime);
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
        loader.classList.add('loader-hidden');
        document.body.classList.remove('loading');
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 1700);
}

// ── NAVBAR DINÁMICA ────────────────────────
let lastScroll = 0, rafPending = false;

window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateNavbar);
    }
}, { passive: true });

function updateNavbar() {
    rafPending = false;
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (lastScroll > 60) {
        nav.style.padding    = '0.7rem 6%';
        nav.style.background = 'rgba(250, 250, 248, 0.97)';
        nav.style.boxShadow  = '0 4px 24px rgba(10,10,10,0.08)';
    } else {
        nav.style.padding    = '1rem 6%';
        nav.style.background = 'rgba(250, 250, 248, 0.9)';
        nav.style.boxShadow  = 'none';
    }
}

// ── MENÚ MÓVIL ─────────────────────────────
function toggleMenu() {
    const links = document.querySelector('.nav-links');
    const ham   = document.querySelector('.hamburger');
    const isOpen = links.classList.toggle('open');
    ham.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    const links = document.querySelector('.nav-links');
    const ham   = document.querySelector('.hamburger');
    if (!links) return;
    links.classList.remove('open');
    ham.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// ── SMOOTH SCROLL ──────────────────────────
const supportsSmooth = 'scrollBehavior' in document.documentElement.style;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        target.scrollIntoView({
            behavior: supportsSmooth ? 'smooth' : 'auto'
        });
    });
});

// ── SCROLL REVEAL + IN-VIEW PARA TOUCH ─────
// En desktop: revealed solo quita la opacidad inicial
// En touch:   revealed + in-view activa las animaciones que normalmente son hover
const revealElements = document.querySelectorAll(
    '.service-card, .pack-card, .portfolio-item, .hero-card, .team-card'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = isTouchDevice() ? i * 30 : i * 60;
            setTimeout(() => {
                entry.target.classList.remove('will-reveal');
                entry.target.classList.add('revealed');
                // En touch: activar estado visual que normalmente es hover
                if (isTouchDevice()) {
                    entry.target.classList.add('in-view');
                }
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(el => {
    el.classList.add('will-reveal');
    revealObserver.observe(el);
});

// ── FILTROS DE PORTAFOLIO ──────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn')
            .forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const show = filter === 'all' || item.dataset.cat === filter;
            item.style.opacity       = show ? '1'        : '0.25';
            item.style.transform     = show ? 'scale(1)' : 'scale(0.97)';
            item.style.pointerEvents = show ? 'auto'     : 'none';
        });
    });
});

// ── WHATSAPP CHAT FLOTANTE ─────────────────
const WA_NUMBER = '593984990787';
let wapTimeout;

function toggleWap() {
    const widget = document.getElementById('wapWidget');
    const bubble = document.getElementById('wapBubble');
    if (!widget) return;
    const isOpen = widget.classList.toggle('open');

    if (isOpen) {
        bubble.classList.add('hidden');
        clearTimeout(wapTimeout);
        wapTimeout = setTimeout(() => {
            if (widget.classList.contains('open')) animateWapMsgs();
        }, 200);
        if (isTouchDevice()) {
            setTimeout(() => {
                document.addEventListener('touchstart', closeWapOutside,
                    { once: true, passive: true });
            }, 300);
        }
    } else {
        clearTimeout(wapTimeout);
    }
}

function closeWapOutside(e) {
    const widget = document.getElementById('wapWidget');
    if (widget && !widget.contains(e.target)) {
        widget.classList.remove('open');
    }
}

function animateWapMsgs() {
    document.querySelectorAll('.wap-msg').forEach((m, i) => {
        m.style.animation = 'none';
        m.offsetHeight;
        m.style.animation =
            `msgSlide 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.15}s both`;
    });
}

function openWap(msg) {
    window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
        '_blank'
    );
}

function sendWap() {
    const input = document.getElementById('wapInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    openWap(text);
    input.value = '';
}

// Burbuja de notificación a los 4s
setTimeout(() => {
    const widget = document.getElementById('wapWidget');
    const bubble = document.getElementById('wapBubble');
    if (!widget || widget.classList.contains('open')) return;
    bubble.classList.remove('hidden');
    bubble.style.animation = 'none';
    bubble.offsetHeight;
    bubble.style.animation =
        'bubblePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both';
}, 4000);

// ── FORMULARIO ─────────────────────────────
function handleForm(e) {
    e.preventDefault();
    const btn      = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled    = true;

    setTimeout(() => {
        btn.textContent      = '¡Mensaje enviado! ✦';
        btn.style.background = '#0a0a0a';
        btn.style.color      = '#ffffff';
        setTimeout(() => {
            btn.textContent      = original;
            btn.style.background = '';
            btn.style.color      = '';
            btn.disabled         = false;
            e.target.reset();
        }, 3000);
    }, 1400);
}