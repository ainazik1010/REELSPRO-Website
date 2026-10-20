// =========================================================
// Reelspro — One-Page Website
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Portfolio category tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const verticalGrid = document.getElementById('verticalGrid');
  const horizontalGrid = document.getElementById('horizontalGrid');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.tab === 'vertical') {
        verticalGrid.hidden = false;
        horizontalGrid.hidden = true;
      } else {
        verticalGrid.hidden = true;
        horizontalGrid.hidden = false;
      }

      trackEvent('portfolio_tab_' + btn.dataset.tab);
    });
  });

  /* ---------- Video placeholders: play on click (no autoplay, no sound) ---------- */
  const videoModal = document.getElementById('videoModal');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalClose = document.getElementById('videoModalClose');

  document.querySelectorAll('[data-video-placeholder]').forEach(el => {
    el.addEventListener('click', () => {
      videoModalTitle.textContent = el.dataset.title || 'Videoplatzhalter';
      videoModal.classList.add('open');
      trackEvent('portfolio_video_click', { title: el.dataset.title });
    });
  });

  function closeModal() {
    videoModal.classList.remove('open');
  }

  videoModalClose.addEventListener('click', closeModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length > 0,
    company: (v) => v.trim().length > 0,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  };

  function validateField(field) {
    const name = field.name;
    if (!validators[name]) return true;
    const valid = validators[name](field.value);
    const errorEl = field.closest('.form-group').querySelector('.field-error');

    if (valid) {
      field.classList.remove('invalid');
      errorEl && errorEl.classList.remove('show');
    } else {
      field.classList.add('invalid');
      errorEl && errorEl.classList.add('show');
    }
    return valid;
  }

  ['name', 'company', 'email'].forEach(fieldName => {
    const field = form.elements[fieldName];
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot spam check
    if (form.elements['_gotcha'].value !== '') {
      return;
    }

    let allValid = true;
    ['name', 'company', 'email'].forEach(fieldName => {
      const field = form.elements[fieldName];
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const isPlaceholderEndpoint = form.action.includes('DEINE_FORM_ID');

    if (isPlaceholderEndpoint) {
      // Kein echter Versand-Endpoint konfiguriert (Demo-/Platzhalter-Modus).
      console.warn('Reelspro: Formular-Endpoint ist noch ein Platzhalter. Bitte vor Launch durch echten Formspree/Web3Forms-Endpoint ersetzen.');
      showSuccess();
      trackEvent('form_submit_demo');
      return;
    }

    submitForm();
  });

  function submitForm() {
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          showSuccess();
          trackEvent('form_submit_success');
        } else {
          alert('Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
        }
      })
      .catch(() => {
        alert('Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
      });
  }

  function showSuccess() {
    form.classList.add('hidden');
    formSuccess.classList.add('show');
  }

  /* ---------- Simple event tracking hook (placeholder) ---------- */
  function trackEvent(name, data) {
    // Platzhalter für datenschutzkonformes Tracking (z.B. Plausible, Matomo, GA4 mit Consent).
    // Aktuell nur Konsolen-Log zur Entwicklung/Debugging.
    console.log('[track]', name, data || {});
  }

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => trackEvent(el.dataset.track));
  });

});
