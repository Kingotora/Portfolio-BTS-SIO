
// =========================================
//  RSS MANAGER (8 Sources + Load More)
// =========================================
// Link to container handled in DOMContentLoaded

const RSS_SOURCES = [
    "https://www.it-connect.fr/feed/",              // SysAdmin
    "https://www.cert.ssi.gouv.fr/feed/",           // Sécurité (ANSSI)
    "https://korben.info/feed",                     // Tech
    "https://www.zdnet.fr/feeds/rss/actualites/",   // Pro
    "https://www.cnil.fr/fr/rss.xml",               // Droit
    "https://www.lemagit.fr/rss/",                  // Enterprise IT (New)
    "https://www.journalduhacker.net/rss",          // Hacker News FR (New)
    "https://www.clubic.com/feed/news.xml"          // Grand Public Tech (New)
];

const DISPLAY_BATCH = 9;

class RSSManager {
    constructor(container) {
        this.container = container;
        this.allArticles = [];
        this.visibleCount = 0;
        this.isLoading = false;

        // Bind loadMore to this instance
        this.loadMore = this.loadMore.bind(this);
    }

    async init() {
        if (!this.container) return;
        this.renderLoader();
        await this.fetchAll();
        this.render();
    }

    renderLoader() {
        this.container.innerHTML = '<div class="spinner"></div>';
    }

    async fetchAll() {
        this.isLoading = true;
        try {
            const promises = RSS_SOURCES.map(url =>
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
                    .then(res => res.json())
                    .catch(err => null)
            );

            const results = await Promise.all(promises);

            this.allArticles = [];

            results.forEach(data => {
                if (data && data.status === 'ok' && data.items) {
                    data.items.forEach(item => item.sourceName = data.feed.title);
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

        if (this.allArticles.length === 0) {
            this.container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-secondary);">
                     <p>⚠️ Impossible de récupérer les articles (serveurs surchargés).</p>
                     <button onclick="rssManager.init()" class="btn" style="margin-top:1rem;">Réessayer</button>
                </div>`;
            return;
        }

        // Reset if full re-render
        if (this.visibleCount === 0) this.visibleCount = Math.min(DISPLAY_BATCH, this.allArticles.length);

        // Render articles
        this.appendArticles(0, this.visibleCount);

        // Render Load More logic
        this.updateLoadMoreButton();
    }

    appendArticles(start, end) {
        const slice = this.allArticles.slice(start, end);

        slice.forEach(item => {
            const card = this.createCard(item);
            this.container.appendChild(card);
        });
    }

    createCard(item) {
        let image = 'images/banner.jpg'; // Default changed to existing banner.jpg
        // 1. Thumbnail
        if (item.thumbnail && item.thumbnail.match(/^https?:\/\//)) image = item.thumbnail;
        // 2. Enclosure
        else if (item.enclosure && item.enclosure.link) image = item.enclosure.link;
        // 3. Regex
        else {
            const imgMatch = (item.content || item.description || "").match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) image = imgMatch[1];
        }

        const dateObj = new Date(item.pubDate);
        const dateStr = dateObj.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' });

        let source = item.sourceName || 'Actu';
        // Normalize names
        if (source.toLowerCase().includes('it-connect')) source = 'IT-Connect';
        if (source.toLowerCase().includes('cert-fr')) source = 'ANSSI';
        if (source.toLowerCase().includes('korben')) source = 'Korben';
        if (source.toLowerCase().includes('zdnet')) source = 'ZDNet';
        if (source.toLowerCase().includes('cnil')) source = 'CNIL';
        if (source.toLowerCase().includes('lemagit')) source = 'LeMagIT';
        if (source.toLowerCase().includes('hacker')) source = 'J. du Hacker';
        if (source.toLowerCase().includes('clubic')) source = 'Clubic';

        const card = document.createElement('article');
        card.className = 'article-card blog-card';
        card.innerHTML = `
           <a class="thumb" href="${item.link}" target="_blank" rel="noopener noreferrer">
              <span class="category-badge">${source}</span>
              <img loading="lazy" src="${image}" alt="${item.title}" style="object-fit:cover; width:100%; height:100%;" onerror="this.onerror=null; this.src='images/banner.jpg'">
           </a>
           <div class="content">
              <div class="meta">
                 <span class="date">📅 ${dateStr}</span>
                 <span class="source">${source}</span>
              </div>
              <h3>${item.title}</h3>
              <p>${this.stripHtml(item.description).substring(0, 100)}...</p>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="read-more">
                 ${currentLang === 'fr' ? "Lire la suite →" : "Read more →"}
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

    loadMore() {
        const total = this.allArticles.length;
        const nextCount = Math.min(total, this.visibleCount + DISPLAY_BATCH);

        if (nextCount > this.visibleCount) {
            this.appendArticles(this.visibleCount, nextCount);
            this.visibleCount = nextCount;
            this.updateLoadMoreButton();
        }
    }

    updateLoadMoreButton() {
        // Remove existing button if any
        const existingBtn = document.getElementById('loadMoreBtn');
        if (existingBtn) existingBtn.remove();

        if (this.visibleCount < this.allArticles.length) {
            const btnContainer = document.createElement('div');
            btnContainer.id = 'loadMoreBtn';
            btnContainer.style.gridColumn = '1 / -1';
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '2rem';

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.innerText = currentLang === 'fr' ? 'Afficher plus d\'articles' : 'Load more articles';
            btn.onclick = this.loadMore;

            btnContainer.appendChild(btn);
            this.container.appendChild(btnContainer);
        }
    }
}

// Global Instance
document.addEventListener('DOMContentLoaded', () => {
    const rssContainer = document.getElementById('rss-feed');
    if (rssContainer) {
        // RSS Manager initialized
        const manager = new RSSManager(rssContainer);
        manager.init();
    } else {
        // Only log if we are on the veille page (heuristic: pathname)
        if (window.location.pathname.includes('veille.html')) {
            console.error("RSS: Container #rss-feed not found on Veille page.");
        }
    }
});
