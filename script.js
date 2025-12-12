
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
  if (noResults) {
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      noResults.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <p style="font-size:1.1rem; color:var(--text-primary); margin-bottom:0.5rem;" data-i18n="projects.no_results_title">Aucun projet trouvé</p>
          <p style="color:var(--text-secondary); font-size:0.9rem;" data-i18n="projects.no_results_desc">Essayez de modifier votre recherche ou les filtres.</p>
          <button class="btn" style="margin-top:1rem;" onclick="document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('is-on')); renderProjects();">Réinitialiser</button>
        </div>
      `;
    } else {
      noResults.style.display = 'none';
    }
  }

  // Count
  const countSpan = document.getElementById('searchCount');
  if (countSpan) countSpan.textContent = `(${visibleCount})`;

  if (typeof initTiltEffect === 'function') initTiltEffect();
  if (typeof initSpotlight === 'function') initSpotlight();
}

// =========================================
//  SPOTLIGHT EFFECT (Premium)
// =========================================
function initSpotlight() {
  const cards = document.querySelectorAll('.project-card, .skill-card, .article-card, .tech-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Call initSpotlight on load and after renderProjects
document.addEventListener('DOMContentLoaded', initSpotlight);
// We also need to call it inside renderProjects (already handled by calling initTiltEffect? No, separate)
// Let's hook into existing logic or just observer.

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
  // ⚠️ IMPORTANT: Remplacez ces valeurs par les vôtres depuis https://dashboard.emailjs.com/
  // PUBLIC KEY
  emailjs.init("B33KUw_SRxXz54Mng");
})();

// =========================================
//  TOAST NOTIFICATIONS (Global)
// =========================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideOutToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
      if (container.children.length === 0) container.remove();
    });
  }, 4000);
}

// =========================================
//  EMAILJS INTEGRATION
// =========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');

    btn.textContent = 'Envoi...';
    btn.disabled = true;

    // Send params (Standard EmailJS names)
    const templateParams = {
      from_name: contactForm.querySelector('[name="user_name"]').value,
      reply_to: contactForm.querySelector('[name="user_email"]').value,
      message: contactForm.querySelector('[name="message"]').value
    };

    // ⚠️ IMPORTANT: Remplacez 'YOUR_SERVICE_ID' et 'YOUR_TEMPLATE_ID'
    emailjs.send('service_irwg4qn', 'template_h2a018w', templateParams)
      .then(() => {
        showToast('Message envoyé avec succès !', 'success');
        contactForm.reset();
        setTimeout(() => {
          const modal = document.getElementById('contactModal');
          if (modal) modal.close();
          if (status) status.textContent = "";
        }, 1000);
      }, (error) => {
        console.error('FAILED...', error);
        showToast("Erreur lors de l'envoi du message.", 'error');
        if (status) {
          status.textContent = "❌ Erreur technique. Contactez-moi par LinkedIn.";
          status.style.color = "red";
        }
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

// Mobile FAB Listener
const mobileContactBtn = document.getElementById('mobileContactBtn');
if (contactModal && mobileContactBtn) {
  mobileContactBtn.addEventListener('click', (e) => {
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

    let ticking = false;
    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

          ticking = false;
        });
        ticking = true;
      }
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


// =========================================
//  INSTANT PAGE LOAD (PREFETCH ON HOVER)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a').forEach(link => {
    if (link.href.includes(window.location.hostname)) { // Internal links only
      link.addEventListener('mouseenter', () => {
        try {
          const url = new URL(link.href).href; // Normalize
          if (!document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = url;
            document.head.appendChild(prefetchLink);
          }
        } catch (e) { }
      });
    }
  });
});

// =========================================
//  ADMIN CONSOLE (Easter Egg)
// =========================================
function initConsole() {
  // --- VIRTUAL FILE SYSTEM ---
  const vfs = {
    '/': {
      type: 'dir',
      children: {
        'home': {
          type: 'dir',
          children: {
            'brieuc': {
              type: 'dir',
              children: {
                'cv.pdf': { type: 'file', content: '[BINARY DATA] Use "cv" command to download.' },
                'todo.txt': { type: 'file', content: '- Finish Portfolio\n- Learn Kubernetes\n- Sleep (optional)' },
                'projects': {
                  type: 'dir',
                  children: {
                    'portfolio': { type: 'dir', children: {} },
                    'homelab.md': { type: 'file', content: '# My Homelab\nRaspberry Pi 4 (Pi-hole, VPN)\nNAS Synology (Plex)' }
                  }
                },
                'secrets': {
                  type: 'dir',
                  children: {
                    'password.txt': { type: 'file', content: 'admin:admin (Do not share!)' }
                  }
                }
              }
            },
            'guest': { type: 'dir', children: {} }
          }
        },
        'var': { type: 'dir', children: { 'www': { type: 'dir', children: {} } } },
        'etc': { type: 'dir', children: { 'hosts': { type: 'file', content: '127.0.0.1 localhost' } } },
        'bin': { type: 'dir', children: {} }
      }
    }
  };

  let currentPath = ['/', 'home', 'brieuc'];
  let commandHistory = [];
  let historyIndex = -1;
  let currentUser = 'admin';

  // Helper: Get node from path
  const resolvePath = (pathArr) => {
    let current = vfs['/'];
    if (pathArr.length === 1 && pathArr[0] === '/') return current;

    // Start from 1 because 0 is root
    for (let i = 1; i < pathArr.length; i++) {
      if (current.children && current.children[pathArr[i]]) {
        current = current.children[pathArr[i]];
      } else {
        return null;
      }
    }
    return current;
  };

  // Helper: Format Path string
  const getPathString = () => {
    if (currentPath.length === 1) return '/';
    return '/' + currentPath.slice(1).join('/');
  };

  // 1. Inject HTML
  const consoleHTML = `
    <div id="consoleTrigger" class="console-trigger" title="Open Admin Console">>_</div>
    <div id="consoleOverlay" class="console-overlay">
      <div class="console-window">
        <div class="console-header">
          <span>admin@brieuc-portfolio:~</span>
          <button id="closeConsole" style="background:none;border:none;color:#888;cursor:pointer;">[x]</button>
        </div>
        <div class="console-body" id="consoleBody">
          <div class="console-output">
            <div>Welcome to BrieucOS v1.0.0 LTS</div>
            <div>Type <span class="info">'help'</span> to see available commands.</div>
            <br>
          </div>
          <div class="console-input-line">
            <span class="console-prompt" id="promptPath">admin@brieuc:~/home/brieuc$</span>
            <input type="text" id="consoleInput" class="console-input" autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', consoleHTML);

  // 2. DOM Elements
  const trigger = document.getElementById('consoleTrigger');
  const overlay = document.getElementById('consoleOverlay');
  const closeBtn = document.getElementById('closeConsole');
  const input = document.getElementById('consoleInput');
  const output = document.querySelector('.console-output');
  const body = document.getElementById('consoleBody');
  const promptSpan = document.getElementById('promptPath');

  // Update Prompt
  const updatePrompt = () => {
    let displayPath = getPathString();
    if (displayPath.startsWith('/home/brieuc')) {
      displayPath = displayPath.replace('/home/brieuc', '~');
    }
    promptSpan.textContent = `admin@brieuc:${displayPath}$`;
  };
  updatePrompt();

  // 3. Functions
  const print = (text, type = '') => {
    const div = document.createElement('div');
    if (type) div.className = type;
    div.innerHTML = text;
    output.appendChild(div);
    body.scrollTop = body.scrollHeight;
  };

  const triggerBSOD = () => {
    print('WARNING: DESTRUCTIVE COMMAND DETECTED.', 'error');
    setTimeout(() => print('Deleting /var/www/html...', 'error'), 500);
    setTimeout(() => print('Deleting /home/brieuc...', 'error'), 1000);
    setTimeout(() => print('Deleting /etc/hosts...', 'error'), 1500);
    setTimeout(() => print('KERNEL PANIC: INIT KILLED.', 'error'), 2000);
    setTimeout(() => {
      document.body.innerHTML = '<div style="background:#0078D7;color:white;height:100vh;display:flex;align-items:center;justify-content:center;font-family:Segoe UI, sans-serif;font-size:2rem;flex-direction:column;text-align:center;">' +
        '<div style="font-size:8rem;margin-bottom:20px;">:(</div>' +
        '<div style="font-size:1.5rem;max-width:800px;">Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then we\'ll restart for you.</div>' +
        '<div style="font-size:1rem;margin-top:40px;">0% complete</div>' +
        '</div>';
    }, 3000);
    setTimeout(() => location.reload(), 7000);
  };

  const executeCommand = (cmd) => {
    // Add to history
    if (cmd.trim() !== '') {
      commandHistory.push(cmd);
      historyIndex = commandHistory.length;
    }

    const args = cmd.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    // Print Command
    let displayPath = getPathString();
    if (displayPath.startsWith('/home/brieuc')) displayPath = displayPath.replace('/home/brieuc', '~');
    print(`<span class="console-prompt" style="color:#0f0">admin@brieuc:${displayPath}$</span> ${cmd}`);

    switch (command) {
      // --- SHELL COMMANDS ---
      case 'pwd':
        print(getPathString());
        break;
      case 'ls':
        const node = resolvePath(currentPath);
        if (node && node.type === 'dir') {
          const files = Object.keys(node.children).map(name => {
            const isDir = node.children[name].type === 'dir';
            return isDir ? `<span style="color:#00f">${name}/</span>` : name;
          }).join('  ');
          print(files || '(empty)');
        } else {
          print('Error: Directory not found.', 'error');
        }
        break;
      case 'cd': {
        const targetDir = args[1];
        if (!targetDir || targetDir === '~') {
          currentPath = ['/', 'home', 'brieuc'];
        } else if (targetDir === '..') {
          if (currentPath.length > 1) currentPath.pop();
        } else {
          const currNode = resolvePath(currentPath);
          if (currNode.children[targetDir] && currNode.children[targetDir].type === 'dir') {
            currentPath.push(targetDir);
          } else {
            print(`cd: ${targetDir}: No such directory`, 'error');
          }
        }
        updatePrompt();
        break;
      }
      case 'cat':
        const file = args[1];
        if (!file) {
          print('Usage: cat [filename]', 'warn');
        } else {
          const cNode = resolvePath(currentPath);
          if (cNode.children[file]) {
            if (cNode.children[file].type === 'file') {
              print(cNode.children[file].content.replace(/\n/g, '<br>'));
            } else {
              print(`cat: ${file}: Is a directory`, 'error');
            }
          } else {
            print(`cat: ${file}: No such file`, 'error');
          }
        }
        break;
      case 'mkdir':
        print('Permission denied: Read-only file system.', 'error');
        break;

      // --- GENERAL ---
      case 'help':
        print('Available commands:', 'info');

        const helpMap = {
          '--- SHELL ---': [
            ['ls', 'List directory contents'],
            ['cd &lt;dir&gt;', 'Change directory'],
            ['cat &lt;file&gt;', 'Read file content'],
            ['pwd', 'Print working directory'],
            ['clear', 'Clear terminal screen']
          ],
          '--- GENERAL ---': [
            ['whoami', 'Display user info'],
            ['social', 'List social networks'],
            ['cv', 'Download PDF Resume'],
            ['projects', 'Go to projects page'],
            ['contact', 'Open contact form']
          ],
          '--- SYSADMIN ---': [
            ['ping &lt;url&gt;', 'Test network latency'],
            ['ipconfig', 'Show network config'],
            ['htop', 'Monitor system resources'],
            ['weather', 'Check server room temp'],
            ['date', 'Show system date']
          ],
          '--- GAMES ---': [
            ['invaders', 'Play Space Invaders'],
            ['snake', 'Play Snake (Arrow Keys)'],
            ['game', 'Play Number Guessing']
          ],
          '--- UTILS ---': [
            ['theme &lt;mode&gt;', 'Set theme (retro/ocean/matrix)'],
            ['calc &lt;expr&gt;', 'Evaluate math expression'],
            ['coffee', 'Brew infinite coffee'],
            ['fortune', 'Get a developer quote']
          ],
          '--- SYSTEM ---': [
            ['sudo su', 'Switch to root user'],
            ['exit', 'Close terminal session'],
            ['shutdown', 'Reboot system']
          ]
        };

        for (const [section, commands] of Object.entries(helpMap)) {
          print(section, 'warn');
          commands.forEach(([cmd, desc]) => {
            // simple padding
            const paddedCmd = cmd.padEnd(15, ' ');
            print(`${paddedCmd} : ${desc}`);
          });
          print(' '); // spacer
        }
        break;
      case 'whoami':
        print('User: Brieuc Métairie', 'success');
        print('Role: Future SysAdmin & Network Expert');
        print('Location: France');
        break;
      case 'social':
        print('-----------------------------', 'info');
        print('LinkedIn: <a href="https://linkedin.com/in/brieuc-metairie" target="_blank" style="color:#00f">linkedin.com/in/brieuc-metairie</a>');
        print('GitHub:   <a href="https://github.com/brieuc-metairie" target="_blank" style="color:#00f">github.com/brieuc-metairie</a>');
        print('Email:    <a href="mailto:metairiebrieuc@gmail.com" style="color:#00f">metairiebrieuc@gmail.com</a>');
        print('-----------------------------', 'info');
        break;
      case 'projects':
        print('Redirecting to /activites.html...', 'warn');
        setTimeout(() => window.location.href = 'activites.html', 800);
        break;
      case 'contact':
        print('Opening secure channel...', 'warn');
        setTimeout(() => {
          overlay.classList.remove('open');
          const modal = document.getElementById('contactModal');
          if (modal) modal.showModal();
        }, 500);
        break;
      case 'cv':
        print('Downloading CV...', 'success');
        const link = document.createElement('a');
        link.href = 'assets/cv.pdf';
        link.download = 'CV_Brieuc_Metairie.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      // --- PHASE 5 FEATURES ---
      case 'theme':
        const mode = args[1];
        const consoleWin = document.querySelector('.console-window');
        if (mode === 'retro') {
          consoleWin.classList.add('theme-retro');
          consoleWin.classList.remove('theme-ocean');
          print('Theme set to RETRO.', 'success');
        } else if (mode === 'ocean') {
          consoleWin.classList.add('theme-ocean');
          consoleWin.classList.remove('theme-retro');
          print('Theme set to OCEAN.', 'success');
        } else if (mode === 'matrix' || mode === 'green') {
          consoleWin.classList.remove('theme-retro', 'theme-ocean');
          print('Theme set to DEFAULT (MATRIX).', 'success');
        } else {
          print('Usage: theme <retro|ocean|matrix>', 'warn');
        }
        break;
      case 'calc':
        const expr = args.slice(1).join('');
        if (!expr) {
          print('Usage: calc <expression> (ex: 2+2)', 'warn');
        } else {
          try {
            if (/[^0-9+\-*/().]/.test(expr)) {
              print('Error: Invalid characters.', 'error');
            } else {
              const result = new Function('return ' + expr)();
              print(`${expr} = ${result}`, 'success');
            }
          } catch (e) {
            print('Error: Invalid expression.', 'error');
          }
        }
        break;
      case 'vim':
      case 'vi':
        print('You are trapped in a text editor.', 'error');
        print('Press ESC to exit...', 'info');
        setTimeout(() => print('Just kidding. Type :q! to quit.', 'info'), 1500);
        break;
      case ':q!':
      case ':q':
        print('Phew! You escaped.', 'success');
        break;
      case 'sudo':
        if (args[1] === 'rm' && args[2] === '-rf' && args[3] === '/') {
          triggerBSOD();
        } else if (args[1] === 'su' || args[1] === '-i') {
          print('Switched to user root', 'success');
          currentUser = 'root';
          document.getElementById('promptPath').innerText = 'root@brieuc:~#';
        } else {
          print('Permission denied: You are not root.', 'error');
        }
        break;
      case 'rm':
        if (currentUser === 'root' && args[1] === '-rf' && args[2] === '/') {
          triggerBSOD();
        } else if (currentUser !== 'root') {
          print('Permission denied: You are not root.', 'error');
        } else {
          print('Usage: rm -rf / (Do not try this)', 'warn');
        }
        break;

      // --- SYSADMIN ---
      case 'ping': {
        const target = args[1] || 'google.com';
        print(`Pinging ${target} [142.250.178.14] with 32 bytes of data:`);
        let pings = 0;
        const pingInterval = setInterval(() => {
          if (pings >= 4) {
            clearInterval(pingInterval);
            print(`Ping statistics for ${target}:`, 'info');
            return;
          }
          const time = Math.floor(Math.random() * 20) + 10;
          print(`Reply from 142.250.178.14: bytes=32 time=${time}ms TTL=115`);
          pings++;
        }, 800);
        break;
      }
      case 'ipconfig':
        print('Windows IP Configuration');
        print('IPv4 Address. . . . . . . . . . . : 192.168.1.42');
        break;
      case 'htop':
        print('CPU[| 23%] MEM[|| 1.2G]');
        break;
      case 'weather':
        setTimeout(() => {
          print('🌡️ Server Room Temperature: 19°C');
        }, 500);
        break;

      // --- GAMES ---
      case 'snake':
        print('Starting Snake... (Arrow Keys)', 'success');
        const sCanvas = document.createElement('canvas');
        sCanvas.width = 300;
        sCanvas.height = 300;
        sCanvas.style.border = '2px solid #0f0';
        sCanvas.style.marginTop = '10px';
        sCanvas.style.background = '#000';
        output.appendChild(sCanvas);
        body.scrollTop = body.scrollHeight;
        const sCtx = sCanvas.getContext('2d');
        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 0; let dy = 0; let score = 0;
        const tile = 15;
        const tileCount = sCanvas.width / tile;
        const drawSnake = () => {
          sCtx.fillStyle = '#000'; sCtx.fillRect(0, 0, 300, 300);
          sCtx.fillStyle = '#f00'; sCtx.fillRect(food.x * tile, food.y * tile, tile - 2, tile - 2);
          sCtx.fillStyle = '#0f0'; snake.forEach(p => sCtx.fillRect(p.x * tile, p.y * tile, tile - 2, tile - 2));
          const head = { x: snake[0].x + dx, y: snake[0].y + dy };
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            score++; food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
          } else snake.pop();
          if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            clearInterval(gameInterval); print(`Game Over. Score: ${score}`, 'error'); sCanvas.remove();
          }
        };
        const keyDownEvent = (e) => {
          if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; } if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
          if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; } if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
        };
        document.addEventListener('keydown', keyDownEvent);
        const gameInterval = setInterval(drawSnake, 100);
        const stopGame = () => { clearInterval(gameInterval); document.removeEventListener('keydown', keyDownEvent); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') stopGame(); }, { once: true });
        break;

      case 'invaders':
        print('Space Invaders launched.', 'success');
        const iCanvas = document.createElement('canvas');
        iCanvas.width = 300; iCanvas.height = 300;
        iCanvas.style.border = '2px solid #0f0'; iCanvas.style.background = '#000';
        output.appendChild(iCanvas);
        const iCtx = iCanvas.getContext('2d');
        let iScore = 0;
        let player = { x: 135, y: 270, w: 30, h: 10 };
        let bullets = [];
        let enemies = [];
        for (let r = 0; r < 3; r++) { for (let c = 0; c < 6; c++) enemies.push({ x: 30 + c * 40, y: 30 + r * 30, w: 20, h: 20, alive: true }); }
        const drawInvaders = () => {
          iCtx.fillStyle = '#000'; iCtx.fillRect(0, 0, 300, 300);
          iCtx.fillStyle = '#0f0'; iCtx.fillRect(player.x, player.y, player.w, player.h);
          iCtx.fillStyle = '#fff'; bullets.forEach((b, i) => { b.y -= 5; iCtx.fillRect(b.x, b.y, 4, 10); if (b.y < 0) bullets.splice(i, 1) });
          iCtx.fillStyle = '#f00';
          enemies.forEach(e => {
            if (e.alive) {
              iCtx.fillRect(e.x, e.y, e.w, e.h);
              bullets.forEach((b, bi) => { if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) { e.alive = false; bullets.splice(bi, 1); iScore += 10; } });
            }
          });
        };
        const iKeyEvents = (e) => {
          if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 10;
          if (e.key === 'ArrowRight' && player.x < 270) player.x += 10;
          if (e.key === ' ') bullets.push({ x: player.x + 13, y: player.y - 10 });
        };
        document.addEventListener('keydown', iKeyEvents);
        const invInt = setInterval(drawInvaders, 50);
        const stopInv = () => { clearInterval(invInt); document.removeEventListener('keydown', iKeyEvents); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') stopInv(); }, { once: true });
        break;

      case 'game':
        print('Guess the number (0-100). Type "guess [number]".');
        window.targetNumber = Math.floor(Math.random() * 101);
        break;
      case 'coffee':
        print('Here is your coffee! ☕', 'success');
        break;
      case 'fortune':
        print('"It works on my machine."', 'success');
        break;
      case 'matrix':
        print('Wake up, Neo...', 'success');
        print('(Matrix effect simulation running...)', 'warn');
        break;
      case 'hack':
        print('Hacking in progress... [████████] 100%', 'success');
        break;
      case 'shutdown':
        print('Rebooting...', 'warn');
        setTimeout(() => location.reload(), 2000);
        break;
      case 'date':
        print(new Date().toString());
        break;
      case 'clear':
        output.innerHTML = '';
        break;
      case 'exit':
        overlay.classList.remove('open');
        break;
      case '':
        break;
      default:
        if (cmd.startsWith('guess ')) {
          const guess = parseInt(cmd.split(' ')[1]);
          if (isNaN(guess)) { print('Invalid number.', 'error'); return; }
          if (!window.targetNumber && window.targetNumber !== 0) { print('Start game first with "game".', 'error'); return; }
          if (guess === window.targetNumber) {
            print(`🎉 WIN! The number was ${window.targetNumber}.`, 'success'); window.targetNumber = null;
          } else if (guess < window.targetNumber) {
            print('Higher ↑', 'warn');
          } else {
            print('Lower ↓', 'warn');
          }
          return;
        }
        print(`Command not found: ${command}`, 'error');
    }
  };

  // 4. Event Listeners
  trigger.addEventListener('click', () => {
    overlay.classList.add('open');
    input.focus();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      input.value = '';
      historyIndex = -1; // Reset navigation
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value; // Don't trim to allow typing arguments, but for command completion we care about start
      const args = val.split(' ');
      const prefix = args[args.length - 1]; // Autocomplete last word? Or just command?
      // Let's just autocomplete the COMMAND for now (first word)
      if (args.length > 1) return; // Only autocomplete command

      const potentialCommands = ['ls', 'cd', 'cat', 'pwd', 'clear', 'whoami', 'social', 'cv', 'projects', 'contact', 'ping', 'ipconfig', 'htop', 'weather', 'date', 'invaders', 'snake', 'game', 'theme', 'calc', 'coffee', 'fortune', 'sudo', 'exit', 'shutdown', 'matrix', 'hack', 'vim', 'help'];

      const matches = potentialCommands.filter(c => c.startsWith(val));

      if (matches.length === 1) {
        input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        print(matches.join('  '), 'info');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) historyIndex = commandHistory.length;
        if (historyIndex > 0) historyIndex--;
        input.value = commandHistory[historyIndex];
      } else {
        // No history
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initConsole();
});
