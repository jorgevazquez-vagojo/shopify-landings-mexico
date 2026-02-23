/**
 * Redegal Landing System — Shopify Plus Migration
 * Premium Interactive Experience
 */

'use strict';

/* ── Utilities ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function lerp(a, b, t) { return a + (b - a) * t; }

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

/* ── Navbar ────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ── Mobile Menu ───────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  $$('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar || (!hamburger.contains(e.target) && !mobileNav.contains(e.target))) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

const navbar = document.getElementById('navbar');

/* ── Scroll Animations ─────────────────────────────────────── */
function initScrollAnimations() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Counter Animation ─────────────────────────────────────── */
function animateCounter(el, target, suffix = '', prefix = '', duration = 2000) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  const decimals = isDecimal ? 1 : 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = lerp(0, target, eased);

    el.textContent = prefix + current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counterEls = $$('[data-counter]');
  if (!counterEls.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterEls.forEach(el => {
          const target = parseFloat(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = parseInt(el.dataset.duration || '2000');
          animateCounter(el, target, suffix, prefix, duration);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsEl = $('#hero-stats');
  if (statsEl) observer.observe(statsEl);
}

/* ── Progress Bar Animation ────────────────────────────────── */
function initProgressBar() {
  const fill = $('#progress-fill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(fill);
}

/* ── Smooth Scroll ─────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Marquee ───────────────────────────────────────────────── */
function initMarquee() {
  const track = $('#marquee-track');
  if (!track) return;

  // Clone items for seamless loop
  const items = $$('.marquee-item', track);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
}

/* ── Table Row Hover ───────────────────────────────────────── */
function initTableInteractions() {
  const rows = $$('.comparison-table tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      rows.forEach(r => r.style.background = '');
      row.style.background = 'rgba(0,102,204,0.05)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });
}

/* ── Form Validation & Submission ──────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const fields = {
    name:     { el: $('#field-name'),     msg: $('#err-name'),     validate: v => v.trim().length >= 2 },
    email:    { el: $('#field-email'),    msg: $('#err-email'),    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    company:  { el: $('#field-company'),  msg: $('#err-company'),  validate: v => v.trim().length >= 2 },
    platform: { el: $('#field-platform'), msg: $('#err-platform'), validate: v => v !== '' },
  };

  function validateField(key) {
    const f = fields[key];
    if (!f.el) return true;
    const valid = f.validate(f.el.value);
    f.el.classList.toggle('error', !valid);
    if (f.msg) f.msg.classList.toggle('show', !valid);
    return valid;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const f = fields[key];
    if (!f.el) return;
    f.el.addEventListener('blur', () => validateField(key));
    f.el.addEventListener('input', () => {
      if (f.el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
    if (!allValid) return;

    const btn = $('#submit-btn');
    const successEl = $('#form-success');
    const formBody = $('#form-body');

    btn.classList.add('loading');
    btn.textContent = 'Enviando...';

    // Simulate async submit
    await new Promise(r => setTimeout(r, 1800));

    btn.classList.remove('loading');
    formBody.style.display = 'none';
    successEl.classList.add('show');
  });
}

/* ── Bento Card Micro-interactions ────────────────────────── */
function initBentoCards() {
  $$('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

/* ── Story Card Entrance ───────────────────────────────────── */
function initStaggeredCards(selector, delay = 120) {
  const cards = $$(selector);
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.classList.add('reveal');
    observer.observe(card);
  });
}

/* ── Floating Card Parallax ────────────────────────────────── */
function initParallax() {
  const hero = $('#hero');
  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
          const ratio = scrollY / heroHeight;
          const meshEl = $('.hero-mesh');
          if (meshEl) {
            meshEl.style.transform = `translateY(${scrollY * 0.35}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Highlight Active Nav on Scroll ───────────────────────── */
function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initProgressBar();
  initSmoothScroll();
  initMarquee();
  initTableInteractions();
  initContactForm();
  initBentoCards();
  initParallax();
  initActiveNav();

  // Staggered card groups
  setTimeout(() => {
    initStaggeredCards('.story-card', 150);
    initStaggeredCards('.problem-card', 100);
    initStaggeredCards('.bento-card', 80);
  }, 100);

  // Hero entrance animation
  const heroTitle = $('.hero-title');
  const heroBadge = $('.hero-badge');
  const heroSubtitle = $('.hero-subtitle');

  [heroBadge, heroTitle, heroSubtitle].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
});
