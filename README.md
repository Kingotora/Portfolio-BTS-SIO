# Portfolio Brieuc Métairie

> Portfolio professionnel d'un étudiant BTS SIO option SISR, passionné par l'administration système, les réseaux et la cybersécurité.

🌐 **Site web** : [brieuc-metairie.fr](https://brieuc-metairie.fr)  
📧 **Contact** : metairiebrieuc@gmail.com  
💼 **LinkedIn** : [brieuc-metairie](https://www.linkedin.com/in/brieuc-metairie)  
💻 **GitHub** : [Kingotora](https://github.com/Kingotora)

---

## 📋 À Propos

Ce portfolio présente mon parcours, mes compétences techniques et mes réalisations dans le domaine de l'administration systèmes et réseaux.

### Technologies Utilisées

- **Frontend** : HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Design** : Glassmorphism, Dark/Light mode, animations 3D
- **Fonts** : Google Fonts (Outfit, Inter)
- **Services** : EmailJS pour le formulaire de contact
- **SEO** : OpenGraph, Twitter Cards, JSON-LD Schema, Sitemap

### Fonctionnalités

✨ **Design Moderne**
- Mode sombre/clair adaptatif
- Effets glassmorphism et gradients
- Animations fluides (3D tilt, spotlight)
- Responsive mobile avec menu hamburger

🌍 **Multilingue**
- Support FR/EN complet
- Switching dynamique sans rechargement

📊 **Projets**
- Filtrage par tags et recherche
- Pages détaillées pour chaque projet
- Catégorisation (scolaire/personnel)

📱 **Expérience Mobile**
- Menu hamburger animé
- Touch-friendly
- Optimisé pour tous les écrans

🔒 **Conformité RGPD**
- Mentions légales
- Politique de confidentialité
- Gestion des cookies

---

## 🚀 Installation & Développement

### Prérequis

- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel pour développement)

### Lancement en Local

**Option 1 : Live Server (VS Code)**
```bash
# Installer l'extension Live Server dans VS Code
# Clic droit sur index.html > Open with Live Server
```

**Option 2 : Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Ouvrir http://localhost:8000
```

**Option 3 : Node.js HTTP Server**
```bash
npx serve .
```

---

## 📁 Structure du Projet

```
Portfolio/
├── index.html                  # Page d'accueil
├── entreprise.html             # Présentation entreprise
├── activites.html              # Portfolio projets
├── veille.html                 # Blog & veille tech
├── mentions-legales.html       # Page légale
├── politique-confidentialite.html # RGPD
├── 404.html                    # Page d'erreur
│
├── style.css                   # Styles principaux (~52KB)
├── script.js                   # Logique JavaScript
├── rss_manager.js              # Gestion flux RSS
│
├── js/
│   ├── lang.js                 # Traductions FR/EN
│   ├── projects.js             # Données projets
│   └── console.js              # Easter egg console
│
├── images/                     # Assets visuels
│   ├── favicon.ico
│   ├── banner.webp
│   └── ...
│
├── docs/                       # Documents téléchargeables
│   ├── cv_brieuc.pdf
│   └── ...
│
├── projet-*.html               # Pages détail projets
│
├── .env.example                # Template variables
├── .gitignore                  # Fichiers ignorés
├── CHANGELOG.md                # Historique modifications
├── README.md                   # Ce fichier
├── robots.txt                  # SEO
└── sitemap.xml                 # SEO
```

---

## ⚙️ Configuration

### Variables d'Environnement

Copier `.env.example` vers `.env` et renseigner les valeurs :

```bash
cp .env.example .env
```

**Variables EmailJS** :
```env
EMAILJS_PUBLIC_KEY=votre_cle
EMAILJS_SERVICE_ID=votre_service
EMAILJS_TEMPLATE_ID=votre_template
```

> ⚠️ **Sécurité** : Les clés EmailJS sont actuellement exposées côté client. Voir section Sécurité ci-dessous.

---

## 🔒 Sécurité

### ⚠️ Points d'Attention Actuels

1. **Clés API exposées** (`script.js:393,450`)
   - Les identifiants EmailJS sont visibles côté client
   - Risque d'utilisation abusive

2. **Recommandation** : Backend Proxy
   ```
   Client → API Backend → EmailJS
   ```
   - Masquer les clés
   - Rate limiting
   - Validation serveur

### Solutions Recommandées

**Option 1 : Netlify Functions**
```javascript
// netlify/functions/contact.js
exports.handler = async (event) => {
  // Appel EmailJS avec clés côté serveur
};
```

**Option 2 : Cloudflare Workers**
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
```

---

## 🎨 Personnalisation

### Changer les Couleurs

Modifier les variables CSS dans `style.css` :

```css
:root {
  --p-brand: #38bdf8;        /* Couleur principale */
  --p-accent: #a78bfa;       /* Couleur accent */
  --bg-page: #0f172a;        /* Fond dark mode */
}
```

### Ajouter un Projet

Modifier `js/projects.js` :

```javascript
const PROJECTS = [
  {
    id: "mon-projet",
    type: "personal",
    titleKey: "projects.monprojet.title",
    // ...
  }
];
```

Puis ajouter les traductions dans `js/lang.js`.

---

## 📊 Performance

### Optimisations Actuelles

- ✅ Images WebP (format moderne)
- ✅ Lazy loading images
- ✅ Preload fonts critiques
- ✅ Prefetch liens internes

### Optimisations Futures

- 🔲 Minification CSS/JS (~35% réduction)
- 🔲 Compression images (favicon surtout)
- 🔲 Service Worker (PWA)
- 🔲 Critical CSS inline

---

## 🌐 SEO

### Implémenté

- ✅ Sitemap.xml & robots.txt
- ✅ OpenGraph & Twitter Cards
- ✅ JSON-LD Schema (Person)
- ✅ Meta descriptions uniques
- ✅ URLs canoniques
- ✅ Balises alt images

### À Améliorer

- 🔲 Rich Snippets (FAQ, HowTo)
- 🔲 BreadcrumbList Schema
- 🔲 Article Schema (projets)

---

## ♿ Accessibilité

### Conformité Actuelle

- ✅ ARIA labels
- ✅ Focus visible
- ✅ Navigation clavier
- ✅ Titres hiérarchiques
- ✅ Contraste couleurs

### Audit WCAG

```bash
# TODO: Installer Pa11y pour audit automatique
npm install -g pa11y
pa11y index.html
```

---

## 🧪 Tests

### Tests Manuels

1. **Navigation** : Tester tous les liens
2. **Formulaire** : Vérifier envoi email
3. **Responsive** : Chrome DevTools devices
4. **Multilingue** : Switcher FR/EN
5. **Dark Mode** : Toggle thème

### Tests Automatisés (À implémenter)

```bash
# Lighthouse CI
npm run lighthouse

# Tests E2E avec Playwright
npm run test:e2e
```

---

## 🚢 Déploiement

### Recommandations Hébergement

**Netlify** (Recommandé)
```bash
# Drag & drop dans Netlify
# Ou CLI :
netlify deploy --prod
```

**Vercel**
```bash
vercel --prod
```

**GitHub Pages**
```bash
# Pusher sur branche gh-pages
```

### Checklist Pré-déploiement

- [ ] Minifier CSS/JS
- [ ] Optimiser images
- [ ] Vérifier liens
- [ ] Tester formulaire
- [ ] Valider HTML/CSS
- [ ] Check console errors

---

## 📝 TODO

### Priorité Haute
- [ ] Sécuriser EmailJS (backend proxy)
- [ ] Minifier assets
- [ ] Optimiser favicon.ico (158KB → <10KB)

### Priorité Moyenne
- [ ] Enrichir pages projets (screenshots)
- [ ] Ajouter blog/articles
- [ ] Installer analytics (Plausible)

### Priorité Basse
- [ ] PWA avec Service Worker
- [ ] Tests automatisés
- [ ] CI/CD pipeline
- [ ] Animations GSAP avancées

---

## 🤝 Contribution

Ce portfolio est personnel, mais les retours sont les bienvenus !

- 🐛 **Bugs** : Ouvrir une issue
- 💡 **Suggestions** : Me contacter par email
- 🔧 **Améliorations** : Pull requests acceptées

---

## 📄 Licence

© 2025 Brieuc Métairie - Tous droits réservés

Le code source de ce portfolio peut être consulté à titre éducatif, mais ne peut être utilisé commercialement sans autorisation.

---

## 📞 Contact

Pour toute question technique ou collaboration :

- 📧 Email : metairiebrieuc@gmail.com
- 💼 LinkedIn : [brieuc-metairie](https://www.linkedin.com/in/brieuc-metairie)
- 💻 GitHub : [Kingotora](https://github.com/Kingotora)

---

**Dernière mise à jour** : 4 février 2026  
**Version** : 2.0.0
