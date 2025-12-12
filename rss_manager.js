// =========================================
//  RSS MANAGER (Source-based Filtering + Search)
// =========================================

const FEEDS = [
    { id: 'it-connect', name: 'IT-Connect', url: "https://www.it-connect.fr/feed/" },
    { id: 'cert-fr', name: 'ANSSI', url: "https://www.cert.ssi.gouv.fr/feed/" },
    { id: 'korben', name: 'Korben', url: "https://korben.info/feed" },
    { id: 'zdnet', name: 'ZDNet', url: "https://www.zdnet.fr/feeds/rss/actualites/" },
    { id: 'cnil', name: 'CNIL', url: "https://www.cnil.fr/fr/rss.xml", logo: 'images/cnil.webp' },
    { id: 'journalduhacker', name: 'J. du Hacker', url: "https://www.journalduhacker.net/rss" },
    { id: 'numerama', name: 'Numerama', url: "https://www.numerama.com/feed/" },
    { id: 'developpez', name: 'Developpez', url: "https://www.developpez.com/rss/actualites.xml" }
];
// Clubic & LeMagIT removed (API Error 422)
// Frandroid removed as requested.

const DISPLAY_BATCH = 9;

class RSSManager {
    constructor(container) {
        this.container = container;
        this.allArticles = [];
        this.visibleCount = 0;
        this.isLoading = false;
        // activeSources: Set of IDs. Empty means 'all'
        this.activeSources = [];
        this.searchQuery = ''; // [NEW] Search Query

        // Bind methods
        this.filterBy = this.filterBy.bind(this);
    }

    async init() {
        if (!this.container) return;

        // Create Filter UI wrapper if not exists
        if (!document.getElementById('rss-filters')) {
            const filterContainer = document.createElement('div');
            filterContainer.id = 'rss-filters';
            filterContainer.className = 'rss-filters';
            filterContainer.style.flexDirection = 'column'; // Allow stacking search + tags
            filterContainer.style.alignItems = 'center';
            // Insert before the article grid
            this.container.parentNode.insertBefore(filterContainer, this.container);
            this.renderFilters(filterContainer);
        }

        this.renderLoader();
        await this.fetchAll();
        this.render();
    }

    renderFilters(container) {
        // [NEW] Search Input + Tags Wrapper
        const searchHTML = `
            <div style="width:100%; display:flex; justify-content:center; margin-bottom:1.5rem;">
                <input type="search" id="rssSearch" placeholder="Rechercher dans la veille (titre, description)..." 
                       style="padding:0.8rem 1.2rem; border-radius:99px; border:1px solid var(--border-subtle); background:var(--bg-surface); color:var(--text-primary); width:100%; max-width:480px; font-family:var(--font-body); outline:none; transition:border-color 0.2s, box-shadow 0.2s;">
            </div>
        `;

        // Tags wrapper
        let tagsHTML = `<div class="rss-tags" style="display:flex; justify-content:center; flex-wrap:wrap; gap:0.6rem;">`;

        // "All" button
        tagsHTML += `
            <button class="rss-filter-btn active" data-source="all" onclick="rssManager.filterBy('all')">
                Tout
            </button>
        `;

        // Source buttons
        tagsHTML += FEEDS.map(feed => `
            <button class="rss-filter-btn" data-source="${feed.id}" onclick="rssManager.filterBy('${feed.id}')">
                ${feed.name}
            </button>
        `).join('');

        tagsHTML += `</div>`;

        container.innerHTML = searchHTML + tagsHTML;

        // [NEW] Attach Search Listener
        const searchInput = document.getElementById('rssSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.visibleCount = 0; // Reset pagination on search
                this.render();
            });

            // Focus style
            searchInput.addEventListener('focus', () => {
                searchInput.style.borderColor = 'var(--color-brand)';
                searchInput.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.2)';
            });
            searchInput.addEventListener('blur', () => {
                searchInput.style.borderColor = 'var(--border-subtle)';
                searchInput.style.boxShadow = 'none';
            });
        }
    }

    filterBy(sourceId) {
        this.visibleCount = 0; // Reset pagination

        if (sourceId === 'all') {
            // Select All, unique logic
            this.activeSources = [];
            // UI Update
            document.querySelectorAll('.rss-filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.rss-filter-btn[data-source="all"]').classList.add('active');
        } else {
            // Specific source
            // 1. Remove 'all' active
            document.querySelector('.rss-filter-btn[data-source="all"]').classList.remove('active');

            // 2. Toggle in state
            if (this.activeSources.includes(sourceId)) {
                this.activeSources = this.activeSources.filter(id => id !== sourceId);
            } else {
                this.activeSources.push(sourceId);
            }

            // 3. Update UI button
            const btn = document.querySelector(`.rss-filter-btn[data-source="${sourceId}"]`);
            if (btn) btn.classList.toggle('active');

            // 4. Fallback to All if empty?
            if (this.activeSources.length === 0) {
                document.querySelector('.rss-filter-btn[data-source="all"]').classList.add('active');
            }
        }

        this.render();
    }

    renderLoader() {
        this.container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding: 4rem;">
                <div class="spinner" style="border: 4px solid rgba(255,255,255,0.1); border-left-color: var(--color-brand); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color:var(--text-secondary)">Chargement des actualités...</p>
            </div>`;
    }

    async fetchAll() {
        this.isLoading = true;
        try {
            const promises = FEEDS.map(feed =>
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
                    .then(res => res.json())
                    .then(data => ({ ...data, metaInfo: feed })) // Attach config info
                    .catch(err => null)
            );

            const results = await Promise.all(promises);

            this.allArticles = [];

            results.forEach(data => {
                if (data && data.status === 'ok' && data.items) {
                    data.items.forEach(item => {
                        // Attach source info to the item
                        item.sourceId = data.metaInfo.id;
                        item.sourceName = data.metaInfo.name;
                        item.sourceLogo = data.metaInfo.logo;
                    });
                    this.allArticles = this.allArticles.concat(data.items);
                }
            });

            // Sort: Newest first
            this.allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        } catch (error) {
            console.error("RSS Global Error:", error);
        } finally {
            this.isLoading = false;
        }
    }

    render() {
        this.container.innerHTML = '';

        // [UPDATED] Filter logic: Source AND Search
        const isAll = this.activeSources.length === 0;

        const filtered = this.allArticles.filter(item => {
            // Source Filter
            const matchesSource = isAll || this.activeSources.includes(item.sourceId);

            // Search Filter
            const textToSearch = (item.title + ' ' + (item.description || '')).toLowerCase();
            const matchesSearch = !this.searchQuery || textToSearch.includes(this.searchQuery);

            return matchesSource && matchesSearch;
        });

        if (filtered.length === 0) {
            this.container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-secondary);">
                     <p style="font-size:1.1rem;">🔍 Aucun article trouvé pour cette recherche.</p>
                     <p style="font-size:0.9rem;">Essayez d'autres mots-clés ou désactivez les filtres.</p>
                </div>`;
            return;
        }

        // Initialize visible count
        if (this.visibleCount === 0) this.visibleCount = Math.min(DISPLAY_BATCH, filtered.length);

        // Render subset
        const slice = filtered.slice(0, this.visibleCount);
        slice.forEach(item => {
            const card = this.createCard(item);
            this.container.appendChild(card);
        });

        // Re-init Spotlight for new cards
        if (typeof initSpotlight === 'function') initSpotlight();

        // "Load More" Button Logic
        const existingBtn = document.getElementById('rss-load-more');
        if (existingBtn) existingBtn.remove();

        if (this.visibleCount < filtered.length) {
            const btnContainer = document.createElement('div');
            btnContainer.id = 'rss-load-more';
            btnContainer.style.gridColumn = "1 / -1";
            btnContainer.style.textAlign = "center";
            btnContainer.style.marginTop = "2rem";

            const btn = document.createElement('button');
            btn.className = "btn";
            btn.textContent = (typeof currentLang !== 'undefined' && currentLang === 'en') ? "Load more articles" : "Charger plus d'articles";
            btn.onclick = () => {
                this.visibleCount += DISPLAY_BATCH;
                this.render(); // Re-render with new limit
            };

            btnContainer.appendChild(btn);
            this.container.appendChild(btnContainer);
        }
    }

    createCard(item) {
        let image = 'images/banner.webp';
        // 1. Thumbnail
        if (item.thumbnail && item.thumbnail.match(/^https?:\/\//)) image = item.thumbnail;
        // 2. Enclosure
        else if (item.enclosure && item.enclosure.link) image = item.enclosure.link;
        // 3. Regex
        else {
            const imgMatch = (item.content || item.description || "").match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) image = imgMatch[1];
        }

        // 4. Fallback to Source Logo if still default
        if (image === 'images/banner.webp' && item.sourceLogo) {
            image = item.sourceLogo;
        }

        const dateObj = new Date(item.pubDate);
        // Safely check currentLang
        const langCode = (typeof currentLang !== 'undefined' && currentLang === 'fr') ? 'fr-FR' : 'en-GB';
        const dateStr = dateObj.toLocaleDateString(langCode, { day: 'numeric', month: 'short' });

        const readMoreText = (typeof currentLang !== 'undefined' && currentLang === 'fr') ? "Lire la suite →" : "Read more →";

        const card = document.createElement('article');
        card.className = 'article-card blog-card';
        // Add lazy loading if not present in template? Yes, added below.
        card.innerHTML = `
           <a class="thumb" href="${item.link}" target="_blank" rel="noopener noreferrer">
              <span class="category-badge">${item.sourceName}</span>
              <img loading="lazy" src="${image}" alt="${item.title}" style="object-fit:cover; width:100%; height:100%;" onerror="this.onerror=null; this.src='images/banner.webp'">
           </a>
           <div class="content">
              <div class="meta">
                 <span class="date">📅 ${dateStr}</span>
                 <span class="source">${item.sourceName}</span>
              </div>
              <h3>${item.title}</h3>
              <p>${this.stripHtml(item.description).substring(0, 100)}...</p>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="read-more">
                 ${readMoreText}
              </a>
           </div>
        `;
        return card;
    }

    stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
}

// Global instance for onclick handlers
let rssManager;

document.addEventListener('DOMContentLoaded', () => {
    const rssContainer = document.getElementById('rss-feed');
    if (rssContainer) {
        rssManager = new RSSManager(rssContainer);
        rssManager.init();
    }
});
