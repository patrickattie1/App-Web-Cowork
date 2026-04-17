/* ============================================================
   KETLEN CELESTIN — Main JavaScript
   Features: navigation · scroll reveal · sparkles ·
             animated counter · gallery lightbox · support form
   ============================================================ */

'use strict';

/* ── Navigation: shrink on scroll + mobile toggle ──────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

/* ── Scroll reveal ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .journey-card').forEach(el => {
  revealObserver.observe(el);
});

/* ── Hero sparkles ──────────────────────────────────────── */
(function createSparkles() {
  const container = document.querySelector('.hero-sparkles');
  if (!container) return;

  const points = [
    { top:'14%', left:'7%'   }, { top:'18%', right:'9%'  },
    { top:'72%', left:'4%'   }, { top:'68%', right:'6%'  },
    { top:'42%', left:'1.5%' }, { top:'38%', right:'2%'  },
    { top:'82%', left:'22%'  }, { top:'10%', right:'22%' },
    { top:'55%', left:'12%'  }, { top:'25%', right:'15%' },
  ];

  points.forEach((pos, i) => {
    const el = document.createElement('span');
    el.textContent = i % 3 === 0 ? '✦' : (i % 3 === 1 ? '·' : '✧');
    el.style.cssText = `
      position:absolute;
      ${pos.top   ? 'top:'   + pos.top   + ';' : ''}
      ${pos.left  ? 'left:'  + pos.left  + ';' : ''}
      ${pos.right ? 'right:' + pos.right + ';' : ''}
      color:rgba(201,165,92,${(0.18 + Math.random() * 0.45).toFixed(2)});
      font-size:${i % 3 === 0 ? '0.7rem' : '0.35rem'};
      animation:twinkle ${(2.2 + Math.random() * 3).toFixed(1)}s ease-in-out infinite;
      animation-delay:${(Math.random() * 2.5).toFixed(1)}s;
      pointer-events:none; user-select:none;
    `;
    container.appendChild(el);
  });
})();

/* ── Animated counter ───────────────────────────────────── */
// Reads `data-target` attribute and animates from 0 to that number on scroll
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2200; // ms
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic for a natural deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// When the support form is submitted successfully, bump the counter by 1
function incrementCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const current = parseInt(el.textContent, 10) || parseInt(el.dataset.target, 10);
    el.dataset.target = current + 1;
    el.textContent = current + 1;
  });
}

/* ── Gallery lightbox ───────────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');

let galleryItems = [];
let currentIndex = 0;

// Build the gallery item list and attach click handlers
document.querySelectorAll('.gallery-item').forEach((item, index) => {
  galleryItems.push({ src: item.dataset.src, caption: item.dataset.caption || '' });

  item.addEventListener('click', () => { currentIndex = index; openLightbox(currentIndex); });

  // Allow keyboard navigation (Enter / Space on focusable items)
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      currentIndex = index;
      openLightbox(currentIndex);
    }
  });
});

function openLightbox(index) {
  const item = galleryItems[index];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.caption || '';
  lightboxCaption.textContent = item.caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation in lightbox
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft'  || e.key === 'Left')  showPrev();
  if (e.key === 'ArrowRight' || e.key === 'Right') showNext();
  if (e.key === 'Escape')                          closeLightbox();
});

/* ── Support form (Formspree AJAX) ──────────────────────── */
const form          = document.getElementById('support-form');
const formSuccess   = document.getElementById('form-success');
const successMsg    = document.getElementById('success-message');
const submitBtn     = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side required field check
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderBottomColor = '';
      if (!field.value.trim()) {
        field.style.borderBottomColor = '#A05088'; // plum for error
        valid = false;
      }
    });
    if (!valid) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.7';

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        incrementCounters(); // update the live counter
        const newCount = parseInt(document.getElementById('support-count').textContent, 10);
        successMsg.textContent = `Your support has been received — you are supporter #${newCount}. Together, we amplify the voices of women and girls everywhere.`;
        form.style.display = 'none';
        formSuccess.removeAttribute('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        submitBtn.textContent = 'Something went wrong — please try again';
        submitBtn.disabled    = false;
        submitBtn.style.opacity = '1';
      }
    } catch {
      submitBtn.textContent = 'Network error — please try again';
      submitBtn.disabled    = false;
      submitBtn.style.opacity = '1';
    }
  });
}
