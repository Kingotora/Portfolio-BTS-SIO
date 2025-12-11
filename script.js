
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
    const mainImgSrc = card.querySelector('img')?.src;
    const galleryImages = [mainImgSrc];

    // MOCK: Add extra dummy images for demonstration if it's the first card
    if (card.dataset.tags && card.dataset.tags.includes('glpi')) {
      galleryImages.push('images/glpi.png'); // Placeholder reuse or real images
      // galleryImages.push('https://via.placeholder.com/600x400?text=Screen+2');
    }

    // Content extraction
    const content = Array.from(card.children).filter(el =>
      el.tagName !== 'H3' && el.tagName !== 'IMG' && !el.classList.contains('actions')
    );

    if (modalTitle) modalTitle.textContent = h3;
    if (modalBody) {
      modalBody.innerHTML = '';

      // Gallery Construction
      if (galleryImages.length > 0 && galleryImages[0]) {
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'gallery-container';
        galleryContainer.style.position = 'relative';

        const imgEl = document.createElement('img');
        imgEl.src = galleryImages[0];
        imgEl.style.width = '100%';
        imgEl.style.borderRadius = '12px';
        imgEl.style.marginBottom = '1rem';
        imgEl.style.maxHeight = '300px';
        imgEl.style.objectFit = 'cover';

        galleryContainer.appendChild(imgEl);

        if (galleryImages.length > 1) {
          // Controls
          const controls = document.createElement('div');
          controls.className = 'gallery-controls';
          controls.innerHTML = `
                  <button class="gallery-btn" id="prevBtn" type="button">← Précédent</button>
                  <span id="imgCounter">1 / ${galleryImages.length}</span>
                  <button class="gallery-btn" id="nextBtn" type="button">Suivant →</button>
              `;
          modalBody.appendChild(controls);

          // Logic
          let currentIndex = 0;
          setTimeout(() => {
            const prev = modalBody.querySelector('#prevBtn');
            const next = modalBody.querySelector('#nextBtn');
            const counter = modalBody.querySelector('#imgCounter');

            if (prev) prev.addEventListener('click', (e) => {
              e.stopPropagation();
              currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
              imgEl.src = galleryImages[currentIndex];
              if (counter) counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
            });

            if (next) next.addEventListener('click', (e) => {
              e.stopPropagation();
              currentIndex = (currentIndex + 1) % galleryImages.length;
              imgEl.src = galleryImages[currentIndex];
              if (counter) counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
            });
          }, 50);
        }

        modalBody.appendChild(galleryContainer);
      }

      // Append text content
      content.forEach(el => modalBody.appendChild(el.cloneNode(true)));
    }

    // Actions
    if (modalActions) {
      modalActions.innerHTML = '';
      const actions = card.querySelector('.actions');
      if (actions) {
        Array.from(actions.children).forEach(act => modalActions.appendChild(act.cloneNode(true)));
      }
    }

    modal.showModal();
  }

  // Attach Listeners
  const allCards = getAllCards();
  allCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on a link or button
      if (e.target.closest('a') || e.target.closest('button')) return;
      openProjectModal(card);
    });
  });

  if (closeModal && modal) {
    closeModal.addEventListener('click', () => modal.close());
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  }

} // END if(searchInput)

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
  // PUBLIC KEY: B33KUw_SRxXz54Mng
  if (typeof emailjs !== 'undefined') {
    emailjs.init("B33KUw_SRxXz54Mng");
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

  // Close Modal logic (fix)
  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', () => {
      contactModal.close();
    });
  }
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
    // Public Key: B33KUw_SRxXz54Mng
    emailjs.sendForm('service_irwg4qn', 'template_h2a018w', this, 'B33KUw_SRxXz54Mng')
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
        formStatus.textContent = 'Une erreur est survenue. Vérifiez votre connexion.';
        formStatus.style.color = '#ef4444'; // Red
        sendBtn.disabled = false;
      });
  });
})();

// =========================================
//  PREMIUM WOW EFFECTS
// =========================================
(function () {
  // 1. Scroll Progress
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }, { passive: true });
  }

  // 2. Custom Cursor
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }, { passive: true });

    // Smooth ring follow
    function animCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Hover effect
    document.querySelectorAll('a, button, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // 3. Typing Effect (Hero)
  const subtitle = document.querySelector('.subtitle');
  if (subtitle && subtitle.classList.contains('typing-cursor')) { // Only if prepared
    const text = "Étudiant BTS SIO – option SISR";
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50); // Speed
      }
    }
    // Start after a delay
    setTimeout(typeWriter, 1000);
  }

  // 4. Spotlight & Tilt (Cards)
  // Apply class 'premium-card' to all cards first
  document.querySelectorAll('.project-card, .skill-card, .article-card').forEach(card => {
    card.classList.add('premium-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

// =========================================
//  BACK TO TOP BUTTON
// =========================================
(function () {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '↑';
  btn.ariaLabel = 'Retour en haut';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const themeBtn = document.getElementById('themeToggle');
    if (window.scrollY > 300) {
      btn.classList.add('visible');
      // Move theme toggle to top right inside header (in the padding area)
      if (themeBtn) {
        themeBtn.style.bottom = 'auto';
        themeBtn.style.top = '1.25rem'; // Vertically centered in header (approx)
        themeBtn.style.right = '1rem';  // To the right of the contact button (which has 2rem margin)
        themeBtn.style.transition = 'all 0.4s ease';
        themeBtn.style.zIndex = '100';
      }
    } else {
      btn.classList.remove('visible');
      // Reset theme toggle to bottom right
      if (themeBtn) {
        themeBtn.style.bottom = '2rem';
        themeBtn.style.top = 'auto';
        themeBtn.style.right = '2rem';
      }
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
