// =========================================
//  RSS MANAGER (Source-based Filtering)
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
        // activeSources: Set of IDs. Empty means 'all' (or use logic similar to projects)
        // Let's use array of strings for simplicity
        this.activeSources = [];

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
            // Insert before the article grid
            this.container.parentNode.insertBefore(filterContainer, this.container);
            this.renderFilters(filterContainer);
        }

        this.renderLoader();
        await this.fetchAll();
        this.render();
    }

    renderFilters(container) {
        // "All" button
        let html = `
            <button class="rss-filter-btn active" data-source="all" onclick="rssManager.filterBy('all')">
                Tout
            </button>
        `;

        // Source buttons
        html += FEEDS.map(feed => `
            <button class="rss-filter-btn" data-source="${feed.id}" onclick="rssManager.filterBy('${feed.id}')">
                ${feed.name}
            </button>
        `).join('');

        container.innerHTML = html;
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
        this.container.innerHTML = '<div class="spinner"></div>';
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

        // Filter articles
        const isAll = this.activeSources.length === 0;
        const filtered = isAll
            ? this.allArticles
            : this.allArticles.filter(item => this.activeSources.includes(item.sourceId));

        if (filtered.length === 0) {
            this.container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-secondary);">
                     <p>Aucun article trouvé pour cette sélection.</p>
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
