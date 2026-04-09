/* ============================================
   GRAVITY ESTUDIO CREATIVO — script.js v5.1
   ============================================ */

const isTouchDevice = () =>
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* ── PRELOADER ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loader-hidden');
            document.body.classList.remove('loading');
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }
    }, 1800);
});

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MENÚ MÓVIL ── */
function toggleMenu() {
    const navLinks  = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!navLinks || !hamburger) return;
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks  = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks)  navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const navLinks  = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks)  navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* ── SMOOTH SCROLL ── */
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

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── TOUCH: SERVICIOS ── */
// En móvil el texto es siempre visible (CSS lo maneja)
// En tablet/touch el tap activa/desactiva el estado expandido
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', function () {
        // Si estamos en móvil pequeño el CSS ya muestra el texto, no hacer nada
        if (window.innerWidth <= 640) return;

        const isActive = this.classList.contains('touch-active');
        // Cerrar todos
        document.querySelectorAll('.service-item.touch-active')
            .forEach(el => el.classList.remove('touch-active'));
        // Abrir el tocado si no estaba activo
        if (!isActive) this.classList.add('touch-active');
    });
});

// Cerrar al tocar fuera
document.addEventListener('click', e => {
    if (!e.target.closest('.service-item')) {
        document.querySelectorAll('.service-item.touch-active')
            .forEach(el => el.classList.remove('touch-active'));
    }
});

/* ── FORMULARIO ── */
function handleForm(e) {
    e.preventDefault();
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const btn     = form ? form.querySelector('button[type="submit"]') : null;

    if (btn) { btn.disabled = true; btn.textContent = 'Abriendo correo...'; }

    const name    = document.getElementById('formName')?.value    || '';
    const email   = document.getElementById('formEmail')?.value   || '';
    const brand   = document.getElementById('formBrand')?.value   || '';
    const pack    = document.getElementById('formPack')?.value    || '';
    const message = document.getElementById('formMessage')?.value || '';

    const targetEmail = 'info@gravityestudiocreativo.com';
    const subject = encodeURIComponent(`Nuevo contacto web — ${name}`);
    let body = `Hola equipo Gravity!\n\nNombre: ${name}\nEmail: ${email}`;
    if (brand)   body += `\nMarca: ${brand}`;
    if (pack)    body += `\nPack de interés: ${pack}`;
    if (message) body += `\n\nMensaje:\n${message}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
        window.open(gmailUrl, '_blank');
        if (form)    form.style.display    = 'none';
        if (success) success.style.display = 'block';
        if (form)    form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje ✦'; }
    }, 600);
}

/* ── WHATSAPP WIDGET ── */
let wapOpen = false;

function toggleWap() {
    const panel  = document.getElementById('wapPanel');
    const btn    = document.getElementById('wapBtn');
    const bubble = document.getElementById('wapBubble');
    if (!panel || !btn) return;

    wapOpen = !wapOpen;
    panel.classList.toggle('open', wapOpen);
    btn.classList.toggle('open', wapOpen);
    if (bubble) bubble.style.display = wapOpen ? 'none' : 'flex';

    // Cerrar al tocar fuera en mobile
    if (wapOpen && isTouchDevice()) {
        setTimeout(() => {
            document.addEventListener('touchstart', closeWapOutside,
                { once: true, passive: true });
        }, 300);
    }
}

function closeWapOutside(e) {
    const widget = document.getElementById('wapWidget');
    if (widget && !widget.contains(e.target)) {
        const panel = document.getElementById('wapPanel');
        const btn   = document.getElementById('wapBtn');
        const bubble = document.getElementById('wapBubble');
        wapOpen = false;
        if (panel)  panel.classList.remove('open');
        if (btn)    btn.classList.remove('open');
        if (bubble) bubble.style.display = 'flex';
    }
}

function openWap(message) {
    window.open(`https://wa.me/593984990787?text=${encodeURIComponent(message)}`, '_blank');
}

function sendWap() {
    const input = document.getElementById('wapInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    openWap(msg);
    input.value = '';
}

/* ── VIDEO HERO — pausa cuando no está visible ── */
const heroVideo = document.querySelector('.hero-video-bg');
if (heroVideo) {
    heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; });

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
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video-bg');
    
    // Intentar reproducir apenas cargue
    video.play().catch(error => {
        console.log("El autoplay fue bloqueado por el sistema, intentando de nuevo...");
        
        // Si falla (por ahorro de batería), lo intentamos al primer toque del usuario
        document.addEventListener('touchstart', () => {
            video.play();
        }, { once: true });
    });
});

const video = document.querySelector('.hero-video-bg');

// Función para intentar reproducir
const forceAutoplay = () => {
    video.play().catch(() => {
        // Si falla (por bloqueo del cel), intentamos de nuevo al primer toque del usuario
        window.addEventListener('touchstart', () => {
            video.play();
        }, { once: true });
    });
};

// Ejecutar cuando el video esté listo
video.addEventListener('canplaythrough', forceAutoplay);

// Por si acaso, intentar de nuevo después de 1 segundo
setTimeout(forceAutoplay, 1000);