(function () {
  'use strict';

  // ── Mobile nav ──────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteNav.classList.toggle('open', !open);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('open');
      });
    });
  }

  // ── Header scroll shadow ────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Scroll reveal ───────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // ── Before / After slider ───────────────────────────────────
  const slider = document.getElementById('ba-slider');
  if (!slider) return;

  const beforeWrap = slider.querySelector('.ba-before-wrap');
  const handle = slider.querySelector('.ba-handle');
  const beforeImg = slider.querySelector('.ba-before');
  if (!beforeWrap || !handle || !beforeImg) return;

  let position = 50;
  let dragging = false;

  function setPosition(percent) {
    position = Math.max(2, Math.min(98, percent));
    beforeWrap.style.width = position + '%';
    handle.style.left = position + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(position)));

    const sliderWidth = slider.offsetWidth;
    beforeImg.style.width = sliderWidth + 'px';
  }

  function positionFromEvent(e) {
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function startDrag(e) {
    dragging = true;
    setPosition(positionFromEvent(e));
    e.preventDefault();
  }

  function moveDrag(e) {
    if (!dragging) return;
    setPosition(positionFromEvent(e));
  }

  function endDrag() {
    dragging = false;
  }

  handle.addEventListener('mousedown', startDrag);
  handle.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('touchmove', moveDrag, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  slider.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    setPosition(positionFromEvent(e));
  });

  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { setPosition(position - 2); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPosition(position + 2); e.preventDefault(); }
  });

  window.addEventListener('resize', () => setPosition(position));
  setPosition(50);

  // ── Active nav on scroll ────────────────────────────────────
  const sections = document.querySelectorAll('section[id], .hero');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionMap = [...navLinks].map((link) => ({
      link,
      id: link.getAttribute('href').slice(1),
    }));

    const highlightNav = () => {
      const scrollPos = window.scrollY + 120;
      let current = '';

      sections.forEach((section) => {
        const id = section.id || 'top';
        if (section.offsetTop <= scrollPos) current = id;
      });

      sectionMap.forEach(({ link, id }) => {
        link.classList.toggle('active', id === current);
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  // ── Form demo handler ───────────────────────────────────────
  const form = document.querySelector('.quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Request Sent!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }
})();
