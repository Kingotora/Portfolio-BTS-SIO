
// =========================================
//  LANG TOGGLE (FR/EN) - GLOBAL
// =========================================
const langBtn = document.getElementById('langToggle');

// TRANSLATION DICTIONARY
const translations = {
  fr: {
    // NAV
    "nav.accueil": "Accueil",
    "nav.activites": "Activités",
    "nav.entreprise": "Entreprise",
    "nav.veille": "Veille",
    "nav.contact": "Me contacter",
    // HERO
    "hero.subtitle": "Étudiant BTS SIO – option SISR",
    "hero.title": "Futur Administrateur Système & Réseau",
    "hero.desc": "Passionné par la <strong>cybersécurité</strong> et l'infrastructure. J'apprends à concevoir des architectures robustes.",
    "hero.cta": "Voir mes projets",
    "index.hero.text2": "Ce que j’aime dans l’informatique, c’est comprendre comment une infrastructure fonctionne concrètement : installer, configurer, sécuriser, puis garder le tout stable dans le temps. J’accorde aussi beaucoup d’importance à la documentation : une solution claire et bien expliquée est une solution durable.",
    // SECTIONS - INDEX
    "section.skills": "Compétences",
    "index.skills.intro": "Le BTS SIO propose deux spécialisations. J’ai choisi <strong>SISR (Solutions d’Infrastructure, Systèmes et Réseaux)</strong> car elle correspond à ce que je veux faire plus tard : travailler sur les serveurs, le réseau, la sécurité, et l’exploitation au quotidien. On y apprend à mettre en place des services (AD, DNS, DHCP, virtualisation…), à les superviser, et à gérer les incidents proprement.",
    "index.skills.list1": "Installation et configuration de postes clients (OS, pilotes, mises à jour, outils)",
    "index.skills.list2": "Administration de serveurs et réseaux (sauvegardes, supervision, VLAN, DHCP/DNS)",
    "index.skills.list3": "Sécurisation des accès et des systèmes (droits, chiffrement, mises à jour)",
    "index.skills.list4": "Support utilisateur et rédaction de procédures",
    "section.projects": "Derniers Projets",
    "index.school.title": "Mon école — Faculté des Métiers de l’Essonne",
    "index.school.text": "Je prépare mon diplôme à la <strong>FDME</strong> en alternance. Le vrai plus, c’est le lien direct entre cours et terrain : ce que j’apprends à l’école, je le mets rapidement en pratique en entreprise. Ça m’aide à progresser vite et à prendre des réflexes professionnels.",
    "index.school.btn": "Découvrir la FDME",
    "index.cv.title": "Mon CV",
    "index.cv.text": "Mon CV résume mes compétences techniques, mes projets principaux et ce que je sais faire en entreprise. Je le tiens à jour au fil de mes missions.",
    "index.cv.btn": "📄 Télécharger mon CV (PDF)",
    "section.contact": "Restons en contact",
    // ENTREPRISE
    "company.title": "Mon Stage chez Althec",
    "company.intro_title": "Présentation de l’entreprise",
    "company.desc": "<strong>ALTHEC Sécurité Systèmes</strong> est une PME spécialisée dans la sûreté électronique. Elle accompagne ses clients de manière complète : analyse du besoin, choix de la solution, installation sur site, puis maintenance dans la durée. La relation client est directe, ce qui permet d’adapter rapidement les solutions.",
    "company.details.social": "Raison sociale :",
    "company.details.legal": "Forme juridique :",
    "company.details.creation": "Date de création :",
    "company.details.hq": "Siège social :",
    "company.details.sector": "Secteur :",
    "company.details.zone": "Zone :",
    "company.details.clients": "Clientèle :",
    "company.details.turnover": "Chiffre d’affaires :",
    "company.activity.title": "Activité principale",
    "company.activity.text": "L’entreprise installe des solutions de protection adaptées à chaque site : caméras IP, centrales d’alarme, badges d’accès, interphonie… Une fois le système en place, elle assure un suivi dans le temps grâce à la maintenance préventive et corrective.",
    "company.services.title": "Offre de services",
    "company.services.list1.title": "Étude & conseil :",
    "company.services.list1.desc": "analyse des risques, choix technique, chiffrage",
    "company.services.list2.title": "Installation :",
    "company.services.list2.desc": "câblage, pose, configuration, mise en service",
    "company.services.list3.title": "Intégration réseau :",
    "company.services.list3.desc": "IP, accès distant sécurisé, supervision simple",
    "company.services.list4.title": "Maintenance :",
    "company.services.list4.desc": "préventif/correctif, support utilisateur",
    // ACTIVITES - GENERAL
    "projects.title": "Activités",
    "projects.search_placeholder": "Rechercher un projet (ex. MediaWiki, GLPI, Plex, Pi-hole)…",
    "projects.filter_all": "Tous",
    "projects.filter_network": "Réseau",
    "projects.filter_security": "Sécurité",
    "projects.intro": "Je présente ici deux types de projets : ceux réalisés dans le cadre de ma formation, et ceux montés chez moi en autonomie pour aller plus loin ou répondre à un besoin concret.",
    "projects.school_title": "📘 Projets scolaires",
    "projects.personal_title": "🛠️ Projets personnels",
    "projects.goal_label": "Objectif :",
    "projects.env_label": "Environnement :",
    "projects.material_label": "Matériel :",
    "projects.result_label": "Résultat :",
    "projects.btn_detail": "Voir le détail →",
    "projects.btn_pdf": "📄 Doc PDF",
    // ACTIVITES - CARDS
    "projects.mediawiki.title": "MediaWiki sous Windows",
    "projects.mediawiki.goal": "mettre en place un wiki interne pour centraliser les procédures de support et d’exploitation.",
    "projects.mediawiki.list1": "Installation / configuration XAMPP",
    "projects.mediawiki.list2": "BDD <code>mediawiki</code> via phpMyAdmin",
    "projects.mediawiki.list3": "Déploiement dans <code>C:\\xampp\\htdocs\\mediawiki</code>",
    "projects.mediawiki.list4": "Assistant + extensions (VisualEditor)",
    "projects.mediawiki.list5": "Sauvegardes SQL + répertoire images",
    "projects.glpi.title": "GLPI sous Windows",
    "projects.glpi.goal": "déployer une plateforme helpdesk et gestion de parc.",
    "projects.glpi.list1": "Stack Web (Apache / PHP / MariaDB)",
    "projects.glpi.list2": "BDD <code>glpi</code> via phpMyAdmin",
    "projects.glpi.list3": "Déploiement dans <code>C:\\xampp\\htdocs\\glpi</code>",
    "projects.glpi.list4": "Configuration profils, entités, SLA",
    "projects.glpi.list5": "Inventaire auto (FusionInventory)",
    "projects.plex.title": "Serveur Plex sur NAS",
    "projects.plex.goal": "centraliser une médiathèque personnelle et la diffuser à la maison.",
    "projects.plex.list1": "Plex Media Server via Docker",
    "projects.plex.list2": "Volumes persistants config + bibliothèques",
    "projects.plex.list3": "Organisation Films / Séries / Musiques",
    "projects.plex.list4": "Accès multi-appareils",
    "projects.plex.list5": "Transcodage matériel activé",
    "projects.plex.result": "serveur stable et simple à utiliser.",
    "projects.pihole.title": "Pi-hole sur Raspberry Pi",
    "projects.pihole.goal": "bloquer publicités/trackers au niveau DNS pour tout le réseau domestique.",
    "projects.pihole.list1": "Installation système + mises à jour",
    "projects.pihole.list2": "Déploiement Pi-hole et DNS local",
    "projects.pihole.list3": "DNS routeur redirigé vers Pi-hole",
    "projects.pihole.list4": "Listes de blocage (ads/tracking/malware)",
    "projects.pihole.list5": "Supervision via interface Web",
    "projects.pihole.list6": "Sauvegarde configuration + IP fixe",
    "projects.pihole.result": "réseau plus propre et plus sécurisé.",
    "projects.vpn.title": "Serveur VPN sur Raspberry Pi",
    "projects.vpn.goal": "accéder à mon réseau domestique depuis l’extérieur en sécurité.",
    "projects.vpn.list1": "Durcissement du Raspberry Pi",
    "projects.vpn.list2": "Déploiement serveur VPN",
    "projects.vpn.list3": "Profils clients (PC/mobile)",
    "projects.vpn.list4": "Port-forward + DDNS sur la box",
    "projects.vpn.list5": "Règles firewall pour limiter l’accès interne",
    "projects.vpn.list6": "Tests externes + documentation utilisateur",
    "projects.vpn.result": "accès distant fiable et chiffré.",
    "projects.restaurant.btn_site": "🌐 Accéder au site",
    // VEILLE
    "blog.title": "Blog & Veille Tech",
    "blog.intro": "Mes explorations sur l'administration système, la cybersécurité et les nouveautés tech. Je décrypte l'essentiel pour rester à jour.",
    "blog.read_more": "Lire l'article complet →",
    "blog.read_analysis": "Lire l'analyse →",
    "blog.stack_title": "📚 Ma Stack de Veille",
    "blog.cat_law": "Législation & Droit",
    "blog.cat_ia": "IA & Souveraineté",
    "blog.article1.date": "📅 15 Nov 2024",
    "blog.article1.source": "Source : IT-Connect",
    "blog.article1.title": "Windows Server 2025 : Quoi de neuf pour les admins ?",
    "blog.article1.desc": "Microsoft prépare la relève. Active Directory, Hotpatching, performance NVMe... Voici mon résumé des fonctionnalités clés qui vont changer notre quotidien d'admin.",
    "blog.article2.date": "📅 02 Oct 2024",
    "blog.article2.source": "Source : CNIL",
    "blog.article2.title": "RGPD : Quel impact économique réel ?",
    "blog.article2.desc": "Le respect de la vie privée est-il un frein ou un moteur pour les entreprises ? Retour sur les débats de la CNIL et les enjeux pour les DSI.",
    "blog.article3.date": "📅 28 Sept 2024",
    "blog.article3.source": "Source : ZDNet",
    "blog.article3.title": "Souveraineté Numérique et IA Open Source",
    "blog.article3.desc": "La France peut-elle rivaliser avec les géants US ? L'enjeu de l'IA Open Source (Mistral, Hugging Face) est crucial pour notre indépendance technologique.",
    // FOOTER
    "footer.rights": "© 2025 Brieuc Métairie – Portfolio",
    "404.title": "404",
    "404.msg": "Oups ! La ressource que vous cherchez a peut-être été déplacée, supprimée ou n'a jamais existé.",
    "404.back": "Retour à l'accueil"
  },
  en: {
    // NAV
    "nav.accueil": "Home",
    "nav.activites": "Projects",
    "nav.entreprise": "Career",
    "nav.veille": "Blog & Watch",
    "nav.contact": "Contact Me",
    // HERO
    "hero.subtitle": "IT Student – System & Network Option",
    "hero.title": "Future System & Network Administrator",
    "hero.desc": "Passionate about <strong>cybersecurity</strong> and infrastructure. Learning to build robust and secure architectures.",
    "hero.cta": "View My Projects",
    "index.hero.text2": "What I love about IT is understanding how infrastructure works concretely: installing, configuring, securing, and then keeping it stable over time. I also value documentation highly: a clear and well-explained solution is a sustainable solution.",
    // SECTIONS - INDEX
    "section.skills": "Skills",
    "index.skills.intro": "The BTS SIO offers two specializations. I chose <strong>SISR (Infrastructure Solutions, Systems and Networks)</strong> because it matches what I want to do: work on servers, networks, security, and daily operations. We learn to set up services (AD, DNS, DHCP, virtualization...), monitor them, and manage incidents cleanly.",
    "index.skills.list1": "Client station installation and configuration (OS, drivers, updates, tools)",
    "index.skills.list2": "Server and network administration (backups, monitoring, VLAN, DHCP/DNS)",
    "index.skills.list3": "System and access security (permissions, encryption, updates)",
    "index.skills.list4": "User support and procedure drafting",
    "section.projects": "Latest Projects",
    "index.school.title": "My School — Faculté des Métiers de l’Essonne",
    "index.school.text": "I am preparing my degree at <strong>FDME</strong> in a work-study program. The real plus is the direct link between classes and the field: what I learn at school, I quickly put into practice at work. It helps me progress fast and develop professional reflexes.",
    "index.school.btn": "Discover FDME",
    "index.cv.title": "My Resume",
    "index.cv.text": "My CV summarizes my technical skills, my main projects, and what I can do in a company. I keep it updated as my missions progress.",
    "index.cv.btn": "📄 Download my Resume (PDF)",
    "section.contact": "Get In Touch",
    // ENTREPRISE
    "company.title": "My Internship at Althec",
    "company.intro_title": "Company Overview",
    "company.desc": "<strong>ALTHEC Sécurité Systèmes</strong> is an SME specializing in electronic security. It supports its clients comprehensively: needs analysis, solution choice, on-site installation, and long-term maintenance. The client relationship is direct, allowing for quick solution adaptation.",
    "company.details.social": "Company Name:",
    "company.details.legal": "Legal Form:",
    "company.details.creation": "Creation Date:",
    "company.details.hq": "Headquarters:",
    "company.details.sector": "Sector:",
    "company.details.zone": "Zone:",
    "company.details.clients": "Clientele:",
    "company.details.turnover": "Turnover:",
    "company.activity.title": "Main Activity",
    "company.activity.text": "The company installs protection solutions adapted to each site: IP cameras, alarm units, access badges, intercoms... Once the system is in place, it ensures follow-up over time through preventive and corrective maintenance.",
    "company.services.title": "Service Offer",
    "company.services.list1.title": "Study & Advice:",
    "company.services.list1.desc": "risk analysis, technical choice, costing",
    "company.services.list2.title": "Installation:",
    "company.services.list2.desc": "cabling, mounting, configuration, commissioning",
    "company.services.list3.title": "Network Integration:",
    "company.services.list3.desc": "IP, secure remote access, simple monitoring",
    "company.services.list4.title": "Maintenance:",
    "company.services.list4.desc": "preventive/corrective, user support",
    // ACTIVITES - GENERAL
    "projects.title": "Projects",
    "projects.search_placeholder": "Search a project (e.g. MediaWiki, GLPI, Plex, Pi-hole)...",
    "projects.filter_all": "All",
    "projects.filter_network": "Network",
    "projects.filter_security": "Security",
    "projects.intro": "I present here two types of projects: those carried out during my training, and those set up at home independently to go further or meet a concrete need.",
    "projects.school_title": "📘 School Projects",
    "projects.personal_title": "🛠️ Personal Projects",
    "projects.goal_label": "Goal:",
    "projects.env_label": "Environment:",
    "projects.material_label": "Hardware:",
    "projects.result_label": "Result:",
    "projects.btn_detail": "View Details →",
    "projects.btn_pdf": "📄 PDF Doc",
    // ACTIVITES - CARDS
    "projects.mediawiki.title": "MediaWiki on Windows",
    "projects.mediawiki.goal": "set up an internal wiki to centralize support and operation procedures.",
    "projects.mediawiki.list1": "XAMPP installation / configuration",
    "projects.mediawiki.list2": "<code>mediawiki</code> DB via phpMyAdmin",
    "projects.mediawiki.list3": "Deployment in <code>C:\\xampp\\htdocs\\mediawiki</code>",
    "projects.mediawiki.list4": "Wizard + extensions (VisualEditor)",
    "projects.mediawiki.list5": "SQL backups + images directory",
    "projects.glpi.title": "GLPI on Windows",
    "projects.glpi.goal": "deploy a helpdesk and asset management platform.",
    "projects.glpi.list1": "Web Stack (Apache / PHP / MariaDB)",
    "projects.glpi.list2": "<code>glpi</code> DB via phpMyAdmin",
    "projects.glpi.list3": "Deployment in <code>C:\\xampp\\htdocs\\glpi</code>",
    "projects.glpi.list4": "Profiles, entities, SLA configuration",
    "projects.glpi.list5": "Auto inventory (FusionInventory)",
    "projects.plex.title": "Plex Server on NAS",
    "projects.plex.goal": "centralize a personal library and stream it at home.",
    "projects.plex.list1": "Plex Media Server via Docker",
    "projects.plex.list2": "Persistent volumes config + libraries",
    "projects.plex.list3": "Movies / Series / Music organization",
    "projects.plex.list4": "Multi-device access",
    "projects.plex.list5": "Hardware transcoding enabled",
    "projects.plex.result": "stable and easy-to-use server.",
    "projects.pihole.title": "Pi-hole on Raspberry Pi",
    "projects.pihole.goal": "block ads/trackers at DNS level for the entire home network.",
    "projects.pihole.list1": "System installation + updates",
    "projects.pihole.list2": "Pi-hole deployment and local DNS",
    "projects.pihole.list3": "Router DNS redirected to Pi-hole",
    "projects.pihole.list4": "Blocklists (ads/tracking/malware)",
    "projects.pihole.list5": "Monitoring via Web interface",
    "projects.pihole.list6": "Configuration backup + static IP",
    "projects.pihole.result": "cleaner and more secure network.",
    "projects.vpn.title": "VPN Server on Raspberry Pi",
    "projects.vpn.goal": "access my home network from outside securely.",
    "projects.vpn.list1": "Raspberry Pi hardening",
    "projects.vpn.list2": "VPN server deployment",
    "projects.vpn.list3": "Client profiles (PC/mobile)",
    "projects.vpn.list4": "Port-forward + DDNS on router",
    "projects.vpn.list5": "Firewall rules to restrict internal access",
    "projects.vpn.list6": "External tests + user documentation",
    "projects.vpn.result": "reliable and encrypted remote access.",
    "projects.restaurant.btn_site": "🌐 Visit Website",
    // VEILLE
    "blog.title": "Blog & Tech Watch",
    "blog.intro": "My explorations on system administration, cybersecurity, and tech news. I decode the essentials to stay updated.",
    "blog.read_more": "Read full article →",
    "blog.read_analysis": "Read analysis →",
    "blog.stack_title": "📚 My Watch Stack",
    "blog.cat_law": "Law & Rights",
    "blog.cat_ia": "AI & Sovereignty",
    "blog.article1.date": "📅 Nov 15, 2024",
    "blog.article1.source": "Source: IT-Connect",
    "blog.article1.title": "Windows Server 2025: What's new for admins?",
    "blog.article1.desc": "Microsoft is preparing the successor. Active Directory, Hotpatching, NVMe performance... Here is my summary of key features that will change our daily admin life.",
    "blog.article2.date": "📅 Oct 02, 2024",
    "blog.article2.source": "Source: CNIL",
    "blog.article2.title": "GDPR: What is the real economic impact?",
    "blog.article2.desc": "Is privacy compliance a brake or a driver for companies? Breakdown of CNIL debates and stakes for CIOs.",
    "blog.article3.date": "📅 Sept 28, 2024",
    "blog.article3.source": "Source: ZDNet",
    "blog.article3.title": "Digital Sovereignty and Open Source AI",
    "blog.article3.desc": "Can France compete with US giants? The stake of Open Source AI (Mistral, Hugging Face) is crucial for our technological independence.",
    // FOOTER
    "footer.rights": "© 2025 Brieuc Métairie – Portfolio",
    "404.title": "404",
    "404.msg": "Oops! The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    "404.back": "Back to Home"
  }
};

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

  // 3. Update HTML lang attribute
  document.documentElement.lang = currentLang;

  // 4. Update Typewriter Immediately
  const subtitle = document.querySelector('.subtitle');
  if (subtitle && subtitle.classList.contains('typing-cursor')) {
    if (window.typingTimer) clearTimeout(window.typingTimer);
    subtitle.textContent = "";

    let text = translations[currentLang]['hero.subtitle'] || "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        window.typingTimer = setTimeout(typeWriter, 50);
      }
    }
    window.typingTimer = setTimeout(typeWriter, 100);
  }
}

if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', currentLang);
    updateLang();
  });
  document.addEventListener('DOMContentLoaded', updateLang);
}

// =========================================
//  THEME TOGGLE
// =========================================
const themeBtn = document.getElementById('themeToggle');
const body = document.body;

function updateThemeBtn() {
  const isLight = body.classList.contains('light-mode');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  updateThemeBtn();
}

themeBtn?.addEventListener('click', () => {
  body.style.transition = 'background 0.4s ease, color 0.4s ease';
  body.classList.toggle('light-mode');
  updateThemeBtn();
});


// =========================================
//  PARALLAX
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
      const matchTag = activeTags.has('all') || tags.some(t => activeTags.has(t));
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
          b.classList.toggle('is-on', activeTags.has(b.dataset.tag));
        });
      }
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  function staggerCards() {
    const cards = getAllCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--stagger', `${i * 70}ms`);
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = `cardIn .6s cubic-bezier(.2, .8, .2, 1) forwards ${i * 0.05}s`;
    });
  }
  staggerCards();
  applyFilters();

  // Modal Logic
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

    if (card.dataset.tags && card.dataset.tags.includes('glpi')) {
      galleryImages.push('images/glpi.png');
    }

    const content = Array.from(card.children).filter(el =>
      el.tagName !== 'H3' && el.tagName !== 'IMG' && !el.classList.contains('actions')
    );

    if (modalTitle) modalTitle.textContent = h3;
    if (modalBody) {
      modalBody.innerHTML = '';
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
          const controls = document.createElement('div');
          controls.className = 'gallery-controls';
          controls.innerHTML = `
                  <button class="gallery-btn" id="prevBtn" type="button">← Précédent</button>
                  <span id="imgCounter">1 / ${galleryImages.length}</span>
                  <button class="gallery-btn" id="nextBtn" type="button">Suivant →</button>
              `;
          modalBody.appendChild(controls);

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
      content.forEach(el => modalBody.appendChild(el.cloneNode(true)));
    }

    if (modalActions) {
      modalActions.innerHTML = '';
      const actions = card.querySelector('.actions');
      if (actions) {
        Array.from(actions.children).forEach(act => modalActions.appendChild(act.cloneNode(true)));
      }
    }
    modal.showModal();
  }

  const allCards = getAllCards();
  allCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      openProjectModal(card);
    });
  });

  if (closeModal && modal) closeModal.addEventListener('click', () => modal.close());
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });
  }
}

// =========================================
//  SCROLL ANIMATIONS
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

  if (typeof emailjs !== 'undefined') {
    emailjs.init("B33KUw_SRxXz54Mng");
  } else {
    console.error("EmailJS SDK not loaded.");
  }

  contactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactModal) contactModal.showModal();
    });
  });

  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', () => {
      contactModal.close();
    });
  }
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.close();
  });

  contactForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!sendBtn) return;

    sendBtn.textContent = 'Envoi en cours...';
    sendBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.style.color = 'var(--text-secondary)';

    emailjs.sendForm('service_irwg4qn', 'template_h2a018w', this, 'B33KUw_SRxXz54Mng')
      .then(function () {
        // Success logged internally or handled by UI
        sendBtn.textContent = 'Envoyé !';
        formStatus.textContent = 'Merci ! Votre message a bien été envoyé.';
        formStatus.style.color = '#10b981';
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
        formStatus.style.color = '#ef4444';
        sendBtn.disabled = false;
      });
  });
})();

// =========================================
//  PREMIUM WOW EFFECTS
// =========================================
(function () {
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }, { passive: true });
  }

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }, { passive: true });

    function animCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Hover
    document.querySelectorAll('a, button, input, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorRing.style.borderColor = 'var(--color-brand)';
        cursorDot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(255,255,255,0.5)';
        cursorDot.style.opacity = '1';
      });
    });
  }

  // Spotlight & Tilt
  document.querySelectorAll('.premium-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
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
      if (themeBtn) {
        themeBtn.style.bottom = 'auto';
        themeBtn.style.top = '0.9rem';
        themeBtn.style.right = '1rem';
        themeBtn.style.zIndex = '100';
      }
    } else {
      btn.classList.remove('visible');
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

// =========================================
//  RSS FEEDS
// =========================================
// Loading handled by rss_manager.js for Veille page
