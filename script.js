
// =========================================
//  LANG TOGGLE (FR/EN) - GLOBAL
// =========================================
const langBtn = document.getElementById('langToggle');

// Translations are now loaded from js/lang.js

let currentLang = localStorage.getItem('lang') || 'fr';

function updateLang() {
  // 1. Update Language Button
  const icon = langBtn?.querySelector('.lang-icon');
  if (icon) {
    icon.textContent = currentLang === 'fr' ? 'FR' : 'EN';
    icon.style.filter = 'none';
  }

  // 2. Parse all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[currentLang][key];

    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // 3. Update Typing Effect (if on Home)
  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    // Reset animation by removing/adding class
    subtitle.style.animation = 'none';
    subtitle.offsetHeight; /* trigger reflow */
    subtitle.style.animation = null;
  }

  // 4. Re-render projects if function exists (to update language in dynamic cards)
  if (typeof renderProjects === 'function') {
    renderProjects();
  }
}

// Event Listener
if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', currentLang);
    updateLang();
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateLang();
  if (typeof renderProjects === 'function') renderProjects();
});


// =========================================
//  SCROLL INDICATOR
// =========================================
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  const bar = document.getElementById("scrollProgress");
  if (bar) bar.style.width = scrolled + "%";
});


// =========================================
//  THEME TOGGLE
// =========================================
const themeBtn = document.getElementById('themeToggle');
const body = document.body;
// Check local storage or system preference
// Default is Dark (no class). 'light' theme adds .light-mode
let isLight = localStorage.getItem('theme') === 'light';

function updateTheme() {
  if (isLight) {
    body.classList.add('light-mode');
    if (themeBtn) themeBtn.textContent = '☀️';
  } else {
    body.classList.remove('light-mode');
    if (themeBtn) themeBtn.textContent = '🌙';
  }
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    isLight = !isLight;
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateTheme();
  });
}
// Init Theme
updateTheme();

// =========================================
//  TYPEWRITER EFFECT
// =========================================
const typeWriterEffect = () => {
  const subtitle = document.querySelector('.subtitle');
  if (!subtitle) return;

  // Just ensure the animation class is there or reset it
  // The CSS 'typing-cursor' class handles the blinking cursor
  // The 'typing' animation might be in CSS. 
  // If we lost the CSS keyframes, we need to check style.css too.
  // Assuming the animation was originally CSS-only or simple JS.
  // Previous code had a simple "typing-cursor" class.
  // Let's ensure the text is visible.
};

// =========================================
//  AOS INIT
// =========================================
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    once: true,
    offset: 50
  });
}

// =========================================
//  PROJECTS RENDERING & FILTERING
// =========================================
function renderProjects() {
  // 1. Render School Projects (activites.html)
  const schoolContainer = document.getElementById('projectsSchool');
  const personalContainer = document.getElementById('projectsPersonal');

  // 2. Render Latest Projects (index.html)
  const latestContainer = document.getElementById('projectsLatest');

  if (!schoolContainer && !personalContainer && !latestContainer) return;

  // Clear content before re-rendering
  if (schoolContainer) schoolContainer.innerHTML = '';
  if (personalContainer) personalContainer.innerHTML = '';
  if (latestContainer) latestContainer.innerHTML = '';

  const query = (document.getElementById('projectSearch')?.value || '').toLowerCase();

  // Get active tags from DOM (multi-select)
  const activeBtns = Array.from(document.querySelectorAll('.tag-filter.is-on'));
  const activeTags = activeBtns.map(btn => btn.getAttribute('data-tag'));

  // Default to 'all' if nothing selected or 'all' is explicitly selected
  const isAll = activeTags.length === 0 || activeTags.includes('all');

  let visibleCount = 0;
  let schoolCount = 0;
  let personalCount = 0;

  // Helper to create card
  const createCard = (project) => {
    const card = document.createElement('article');
    card.className = 'project-card aos-animate';
    card.setAttribute('data-aos', 'fade-up');

    const titleText = (project.titleKey && translations[currentLang][project.titleKey]) || project.title;

    let imgHTML = '';
    if (project.img) imgHTML = `<img loading="lazy" src="${project.img}" alt="${titleText}" />`;

    let titleHTML = '';
    if (project.titleKey) {
      titleHTML = `<h3 data-i18n="${project.titleKey}">${translations[currentLang][project.titleKey]}</h3>`;
    } else {
      titleHTML = `<h3>${project.title}</h3>`;
    }

    let detailsHTML = '';
    if (project.goalKey) {
      detailsHTML += `<p><strong data-i18n="projects.goal_label">${translations[currentLang]['projects.goal_label']}</strong> <span data-i18n="${project.goalKey}">${translations[currentLang][project.goalKey]}</span></p>`;
    } else if (project.goal) {
      detailsHTML += `<p><strong>Objectif :</strong> ${project.goal}</p>`;
    }

    // Environment or Material
    if (project.envKey && project.envText) {
      detailsHTML += `<p><strong data-i18n="${project.envKey}">${translations[currentLang][project.envKey]}</strong> ${project.envText}</p>`;
    } else if (project.matKey && project.matText) {
      detailsHTML += `<p><strong data-i18n="${project.matKey}">${translations[currentLang][project.matKey]}</strong> ${project.matText}</p>`;
    } else if (project.content) {
      detailsHTML += `<p><strong>Contenu :</strong> ${project.content}</p>`;
    }

    // List
    let listHTML = '';
    if (project.listKeys) {
      listHTML += '<ul>';
      project.listKeys.forEach(k => {
        listHTML += `<li data-i18n="${k}">${translations[currentLang][k]}</li>`;
      });
      listHTML += '</ul>';
    } else if (project.listRaw) {
      listHTML += '<ul>';
      project.listRaw.forEach(item => listHTML += `<li>${item}</li>`);
      listHTML += '</ul>';
    }

    // Result
    let resultHTML = '';
    if (project.resultKey) {
      resultHTML += `<p><strong data-i18n="${project.resultKey}">${translations[currentLang][project.resultKey]}</strong> <span data-i18n="${project.resultTextKey}">${translations[currentLang][project.resultTextKey]}</span></p>`;
    }

    // Actions
    let actionsHTML = '';
    if (project.detailLink) {
      actionsHTML += `<a href="${project.detailLink}" class="btn" style="text-decoration:none; text-align:center;" data-i18n="projects.btn_detail">${translations[currentLang]['projects.btn_detail']}</a>`;
    }
    if (project.pdfLink) {
      actionsHTML += `<a class="btn" href="${project.pdfLink}" download style="text-decoration:none; text-align:center; margin-top:0.5rem;" data-i18n="projects.btn_pdf">${translations[currentLang]['projects.btn_pdf']}</a>`;
    }
    if (project.siteLink) {
      actionsHTML += `<a class="btn" href="${project.siteLink}" target="_blank" rel="noopener" style="text-decoration:none; text-align:center; margin-top:0.5rem;" data-i18n="projects.restaurant.btn_site">${translations[currentLang]['projects.restaurant.btn_site'] || '🌐 Site'}</a>`;
    }

    card.innerHTML = `
            ${imgHTML}
            ${titleHTML}
            ${detailsHTML}
            ${listHTML}
            ${resultHTML}
            <div class="actions" style="display:flex; flex-direction:column; align-items:stretch; gap:0.5rem; margin: 1rem 1rem 0;">
                ${actionsHTML}
            </div>
        `;
    return card;
  };

  if (typeof PROJECTS !== 'undefined') {
    // Decide which projects to show on Home (Latest)
    // For now, let's just pick the first 3
    const latestProjects = PROJECTS.slice(0, 3);

    if (latestContainer) {
      latestProjects.forEach(project => {
        const card = createCard(project);
        latestContainer.appendChild(card);
      });
    }

    // Logic for Activites page
    PROJECTS.forEach(project => {
      if (schoolContainer || personalContainer) {
        const tags = project.tags || [];
        // Multi-tag Logic: OR logic (inclusive)
        const matchesTag = isAll || activeTags.some(t => tags.includes(t));

        // Search
        const titleText = (project.titleKey && translations[currentLang][project.titleKey]) || project.title || '';
        const searchable = (titleText + ' ' + (project.id || '') + ' ' + tags.join(' ')).toLowerCase();
        const matchesSearch = searchable.includes(query);

        if (matchesTag && matchesSearch) {
          visibleCount++;
          const card = createCard(project);

          if (project.type === 'school' && schoolContainer) {
            schoolContainer.appendChild(card);
            schoolCount++;
          } else if (project.type === 'personal' && personalContainer) {
            personalContainer.appendChild(card);
            personalCount++;
          }
        }
      }
    });
  }

  // Update Titles Visibility on Activites Page
  const tSchool = document.querySelector('[data-i18n="projects.school_title"]');
  const tPerso = document.querySelector('[data-i18n="projects.personal_title"]');
  if (tSchool) tSchool.style.display = schoolCount > 0 ? 'block' : 'none';
  if (tPerso) tPerso.style.display = personalCount > 0 ? 'block' : 'none';

  // No Results
  const noResults = document.getElementById('noResults');
  if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';

  // Count
  const countSpan = document.getElementById('searchCount');
  if (countSpan) countSpan.textContent = `(${visibleCount})`;

  if (typeof initTiltEffect === 'function') initTiltEffect();
}

// Event Listeners for Filters
const projectSearch = document.getElementById('projectSearch');
if (projectSearch) {
  projectSearch.addEventListener('input', renderProjects);
}

document.querySelectorAll('.tag-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.getAttribute('data-tag');

    if (tag === 'all') {
      // If "All" clicked, clear others, select All
      document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
    } else {
      // If specific tag clicked
      const allBtn = document.querySelector('.tag-filter[data-tag="all"]');
      if (allBtn) allBtn.classList.remove('is-on'); // Deselect "All"

      btn.classList.toggle('is-on'); // Toggle state

      // If no tags left, re-select "All" (Optional UX, but good for "reset")
      const anyActive = document.querySelectorAll('.tag-filter.is-on').length > 0;
      if (!anyActive && allBtn) {
        allBtn.classList.add('is-on');
      }
    }

    renderProjects();
  });
});


// =========================================
//  CONTACT FORM (EMAILJS)
// =========================================
// Initialize EmailJS
(function () {
  // PUBLIC KEY
  emailjs.init("5_JtM2w3yC-mK3U_n");
})();

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const status = document.getElementById('formStatus');
    const btn = document.getElementById('sendBtn');

    btn.textContent = 'Envoi...';
    btn.disabled = true;

    // Send params
    const templateParams = {
      user_name: document.getElementById('name').value,
      user_email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    emailjs.send('service_gmail_brieuc', 'template_portfolio_contact', templateParams)
      .then(() => {
        status.textContent = "✅ Message envoyé avec succès !";
        status.style.color = "var(--color-brand)";
        contactForm.reset();
        setTimeout(() => {
          const modal = document.getElementById('contactModal');
          if (modal) modal.close();
          status.textContent = "";
        }, 3000);
      }, (error) => {
        console.error('FAILED...', error);
        status.textContent = "❌ Erreur : " + JSON.stringify(error);
        status.style.color = "red";
      })
      .finally(() => {
        btn.textContent = 'Envoyer';
        btn.disabled = false;
      });
  });
}

// =========================================
//  MODALS (CONTACT)
// =========================================
const contactModal = document.getElementById('contactModal');
const openContactData = document.querySelectorAll('[data-i18n="nav.contact"]'); // Links with text
// Also handle the footer email button if needed, or specific buttons
// Let's attach to any <a> that is href="mailto:..." but we want to intercept
// Actually, specifically for the header button:
const headerContactBtn = document.querySelector('.header-contact .btn');

if (contactModal && headerContactBtn) {
  headerContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.showModal();
  });
}
const closeContactBtn = document.getElementById('closeContact');
if (closeContactBtn && contactModal) {
  closeContactBtn.addEventListener('click', () => {
    contactModal.close();
  });
}
// CLICK OUTSIDE
if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    const rect = contactModal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      contactModal.close();
    }
  });
}


// =========================================
//  FADE IN UP INTERSECTION OBSERVER
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
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el);
});

// =========================================
//  SCROLL TO TOP BUTTON
// =========================================
const scrollTopBtn = document.getElementById('scrollTop');
const headerInner = document.querySelector('.header-inner');

// Optimized Scroll Listener
let isScrolling = false;
window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateScrollUI();
      isScrolling = false;
    });
    isScrolling = true;
  }
});

function updateScrollUI() {
  // 1. Scroll Button Visibility
  if (window.scrollY > 300) {
    scrollTopBtn?.classList.add('show');

    // 2. Move Theme Button to Header Inner (Right of Contact)
    if (themeBtn && headerInner && !headerInner.contains(themeBtn)) {
      headerInner.appendChild(themeBtn);
      themeBtn.classList.add('in-menu');
    }
  } else {
    scrollTopBtn?.classList.remove('show');

    // 3. Move Theme Button back to Body (or original spot)
    if (themeBtn && headerInner && headerInner.contains(themeBtn)) {
      document.body.appendChild(themeBtn);
      themeBtn.classList.remove('in-menu');
    }
  }
}

// 3D TILT LOGIC (Performance Optimized)
function initTiltEffect() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    // Clean up old listeners if any (optional, but good practice)
    // For simplicity, we assume re-render replaces DOM nodes so usually fine.

    card.addEventListener('mouseenter', () => {
      card.style.setProperty('transition', 'none', 'important');
      card.style.zIndex = '10';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.zIndex = '1';
    });
  });
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
