
// =========================================
//  THEME TOGGLE (Global)
// =========================================
const themeBtn = document.getElementById('themeToggle');
const body = document.body;

function updateThemeBtn() {
  const isLight = body.classList.contains('light-mode');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Check saved theme
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  updateThemeBtn();
}

themeBtn?.addEventListener('click', () => {
  // Add transition class to body to smooth out color changes
  body.style.transition = 'background 0.4s ease, color 0.4s ease';

  body.classList.toggle('light-mode');
  updateThemeBtn();
});


// =========================================
//  PARALLAX (Global)
// =========================================
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  const offset = Math.min(60, y * 0.06);
  document.body.style.setProperty('--parallaxY', offset + 'px');
}, { passive: true });


// =========================================
//  PAGE: ACTIVITÉS (Search + Filters)
// =========================================
const searchInput = document.getElementById('projectSearch');

if (searchInput) {
  // We are on the 'activites' page
  const noResults = document.getElementById('noResults');
  const searchCount = document.getElementById('searchCount');
  const tagButtons = document.querySelectorAll('#tagFilters .tag-filter');

  const gridSchool = document.getElementById('projectsSchool');
  const gridPersonal = document.getElementById('projectsPersonal');
  const countSchool = document.getElementById('countSchool');
  const countPersonal = document.getElementById('countPersonal');

  const grids = [gridSchool, gridPersonal].filter(Boolean);
  const activeTags = new Set(['all']);

  function getAllCards() {
    return grids.flatMap(g => Array.from(g.querySelectorAll('.project-card')));
  }

  function updateSectionCounts() {
    if (!gridSchool || !gridPersonal) return;

    const visibleSchool = Array.from(gridSchool.querySelectorAll('.project-card'))
      .filter(c => c.style.display !== 'none').length;

    const visiblePersonal = Array.from(gridPersonal.querySelectorAll('.project-card'))
      .filter(c => c.style.display !== 'none').length;

    if (countSchool) countSchool.textContent = `${visibleSchool} projet(s) scolaire(s) affiché(s)`;
    if (countPersonal) countPersonal.textContent = `${visiblePersonal} projet(s) personnel(s) affiché(s)`;
  }

  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cards = getAllCards();
    let visible = 0;

    cards.forEach(card => {
      const hay = (card.dataset.title || card.textContent).toLowerCase();
      const tags = (card.dataset.tags || '').split(',').map(t => t.trim());

      const matchText = !q || hay.includes(q);
      const matchTag =
        activeTags.has('all') ||
        tags.some(t => activeTags.has(t));

      const match = matchText && matchTag;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    if (searchCount) {
      searchCount.textContent = q ? `${visible} projet(s) trouvé(s)` : `${visible} projet(s)`;
    }

    updateSectionCounts();
  }

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag || 'all';

      if (tag === 'all') {
        activeTags.clear();
        activeTags.add('all');
        tagButtons.forEach(b => b.classList.toggle('is-on', b.dataset.tag === 'all'));
      } else {
        activeTags.delete('all');

        if (activeTags.has(tag)) activeTags.delete(tag);
        else activeTags.add(tag);

        if (activeTags.size === 0) activeTags.add('all');

        tagButtons.forEach(b => {
          const t = b.dataset.tag;
          b.classList.toggle('is-on', activeTags.has(t));
        });
      }

      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  // Stagger animation for cards on load
  function staggerCards() {
    const cards = getAllCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--stagger', `${i * 70}ms`);
      // Force animation replay if needed, or rely on CSS
      card.style.animation = 'none';
      card.offsetHeight; /* trigger reflow */
      card.style.animation = `cardIn .6s cubic-bezier(.2, .8, .2, 1) forwards ${i * 0.05}s`;
    });
  }

  staggerCards();
  applyFilters();


  // =========================================
  //  PROJECT MODAL (Only needed on Activities page)
  // =========================================
  const modal = document.getElementById('projectModal');
  const closeModal = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalActions = document.querySelector('.modal-actions');

  function openProjectModal(card) {
    if (!modal) return;

    const h3 = card.querySelector('h3')?.innerText || 'Projet';
    const img = card.querySelector('img')?.src;

    // Content extraction
    const content = Array.from(card.children).filter(el =>
      el.tagName !== 'H3' && el.tagName !== 'IMG' && !el.classList.contains('actions')
    );

    modalTitle.textContent = h3;
    modalBody.innerHTML = '';

    if (img) {
      const startImg = document.createElement('img');
      startImg.src = img;
      startImg.style.width = '100%';
      startImg.style.borderRadius = '12px';
      startImg.style.marginBottom = '1rem';
      startImg.style.maxHeight = '300px';
      startImg.style.objectFit = 'cover';
      modalBody.appendChild(startImg);
    }

    content.forEach(el => modalBody.appendChild(el.cloneNode(true)));

    // Actions
    modalActions.innerHTML = '';
    const actions = card.querySelector('.actions');
    if (actions) {
      Array.from(actions.children).forEach(act => modalActions.appendChild(act.cloneNode(true)));
    }

    modal.showModal();
  }

  getAllCards().forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openProjectModal(card);
    });
  });

  closeModal?.addEventListener('click', () => modal.close());

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}

// =========================================
//  SCROLL ANIMATIONS (IntersectionObserver)
// =========================================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // Animates only once
    }
  });
}, observerOptions);

// Target elements to animate
// Wait for DOM to be ready + dynamic elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section > *, .project-card, .skill-card, .article-card').forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
});

// =========================================
//  CONTACT FORM (EmailJS)
// =========================================
(function () {
  const contactModal = document.getElementById('contactModal');
  const contactForm = document.getElementById('contactForm');
  const closeContactBtn = document.getElementById('closeContact');
  const contactBtns = document.querySelectorAll('a[href^="mailto:"]');
  const sendBtn = document.getElementById('sendBtn');
  const formStatus = document.getElementById('formStatus');

  // Initialize EmailJS
  // PUBLIC KEY: B33KUw_SRxXz54Mn
  if (typeof emailjs !== 'undefined') {
    emailjs.init("B33KUw_SRxXz54Mn");
  } else {
    console.error("EmailJS SDK not loaded.");
  }

  // Open Modal logic
  contactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactModal) contactModal.showModal();
    });
  });

  // Close Modal logic
  closeContactBtn?.addEventListener('click', () => contactModal.close());
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.close();
  });

  // Form Submit
  contactForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!sendBtn) return;

    sendBtn.textContent = 'Envoi en cours...';
    sendBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.style.color = 'var(--text-secondary)';

    // Service: service_irwg4qn
    // Template: template_h2a018w
    emailjs.sendForm('service_irwg4qn', 'template_h2a018w', this)
      .then(function () {
        console.log('SUCCESS!');
        sendBtn.textContent = 'Envoyé !';
        formStatus.textContent = 'Merci ! Votre message a bien été envoyé.';
        formStatus.style.color = '#10b981'; // Green
        contactForm.reset();
        setTimeout(() => {
          contactModal.close();
          sendBtn.textContent = 'Envoyer';
          sendBtn.disabled = false;
          formStatus.textContent = '';
        }, 2000);
      }, function (error) {
        console.log('FAILED...', error);
        sendBtn.textContent = 'Erreur';
        formStatus.textContent = 'Une erreur est survenue. Réessayez plus tard.';
        formStatus.style.color = '#ef4444'; // Red
        sendBtn.disabled = false;
      });
  });
})();
