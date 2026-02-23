/* ============================================================
   SHOPIFY PLUS LANDING — REDEGAL MEXICO
   script.js — vanilla JS, no dependencies
   ============================================================ */

'use strict';

/* ── Navbar scroll behavior ── */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Smooth scroll for anchor links ── */
(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navbarH = document.querySelector('.navbar')
      ? document.querySelector('.navbar').offsetHeight
      : 70;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
    // Close mobile menu if open
    closeMobileMenu();
  });
})();

/* ── Mobile hamburger menu ── */
let mobileMenuOpen = false;

function closeMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const ham = document.querySelector('.hamburger');
  if (!menu || !ham) return;
  mobileMenuOpen = false;
  menu.classList.remove('open');
  ham.classList.remove('open');
  document.body.style.overflow = '';
}

(function initMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', function () {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      menu.classList.add('open');
      ham.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
  });
})();

/* ── IntersectionObserver — scroll reveal ── */
(function initScrollReveal() {
  const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ── Counter animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const countersStarted = new WeakSet();

  function animateCounter(el) {
    if (countersStarted.has(el)) return;
    countersStarted.add(el);

    const target = parseFloat(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(function (el) { obs.observe(el); });
})();

/* ── Timeline progress bar ── */
(function initTimelineProgress() {
  const bar = document.querySelector('.timeline-progress');
  if (!bar) return;

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            bar.style.width = '75%';
          }, 300);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  obs.observe(bar.parentElement || bar);
})();

/* ── Step circles animate on scroll ── */
(function initStepCircles() {
  const steps = document.querySelectorAll('.step-circle');
  if (!steps.length) return;

  const obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  steps.forEach(function (el) { obs.observe(el); });
})();

/* ── Floating CTA pill show/hide ── */
(function initFloatingCta() {
  const pill = document.querySelector('.floating-cta');
  if (!pill) return;

  let ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrolled = window.scrollY;
          const total = document.documentElement.scrollHeight - window.innerHeight;
          const pct = total > 0 ? scrolled / total : 0;
          if (scrolled > 600 && pct < 0.9) {
            pill.classList.add('show');
          } else {
            pill.classList.remove('show');
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
})();

/* ── Contact form validation ── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const formSuccess = document.querySelector('.form-success');

  function validateField(group) {
    const input = group.querySelector('input, select, textarea');
    if (!input) return true;
    const value = input.value.trim();
    let valid = true;

    if (input.required && value === '') {
      valid = false;
    } else if (input.type === 'email' && value !== '') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) valid = false;
    } else if (input.tagName === 'SELECT' && value === '') {
      valid = false;
    }

    if (!valid) {
      group.classList.add('error');
    } else {
      group.classList.remove('error');
    }
    return valid;
  }

  // Live validation
  form.querySelectorAll('.form-group').forEach(function (group) {
    const input = group.querySelector('input, select, textarea');
    if (!input) return;
    input.addEventListener('blur', function () { validateField(group); });
    input.addEventListener('input', function () {
      if (group.classList.contains('error')) validateField(group);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('.form-group').forEach(function (group) {
      if (!validateField(group)) allValid = false;
    });
    if (!allValid) return;

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Simulate async submit
    setTimeout(function () {
      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    }, 1200);
  });
})();

/* ── Card hover tilt effect (subtle, desktop only) ── */
(function initCardTilt() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.story-card, .problem-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-5px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

/* ── Table — highlight Shopify Plus column on hover ── */
(function initTableHighlight() {
  const table = document.querySelector('.comparison-table');
  if (!table) return;

  const shopifyCells = table.querySelectorAll('td[data-shopify], th[data-shopify]');
  shopifyCells.forEach(function (cell) {
    cell.style.background = 'rgba(0,212,170,0.04)';
    cell.style.borderLeft = '1px solid rgba(0,212,170,0.15)';
    cell.style.borderRight = '1px solid rgba(0,212,170,0.15)';
  });
})();
