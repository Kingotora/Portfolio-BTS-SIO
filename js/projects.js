const PROJECTS = [
    // SCHOOL PROJECTS
    {
        id: "mediawiki",
        type: "school",
        titleKey: "projects.mediawiki.title",
        goalKey: "projects.mediawiki.goal",
        envKey: "projects.env_label",
        envText: "Windows + XAMPP",
        img: "images/mediawiki.webp",
        tags: ["windows", "wiki"],
        listKeys: [
            "projects.mediawiki.list1",
            "projects.mediawiki.list2",
            "projects.mediawiki.list3",
            "projects.mediawiki.list4",
            "projects.mediawiki.list5"
        ],
        detailLink: "projet-mediawiki.html",
        pdfLink: "docs/Manuel_Installation_Windows.pdf"
    },
    {
        id: "glpi",
        type: "school",
        titleKey: "projects.glpi.title",
        goalKey: "projects.glpi.goal",
        envKey: "projects.env_label",
        envText: "Windows + WAMP/XAMPP",
        img: "images/glpi.webp",
        tags: ["windows", "helpdesk"],
        listKeys: [
            "projects.glpi.list1",
            "projects.glpi.list2",
            "projects.glpi.list3",
            "projects.glpi.list4",
            "projects.glpi.list5"
        ],
        detailLink: "projet-glpi.html",
        pdfLink: "docs/GLPI_Cours.pdf"
    },
    // PERSONAL PROJECTS
    {
        id: "plex",
        type: "personal",
        titleKey: "projects.plex.title",
        goalKey: "projects.plex.goal",
        matKey: "projects.material_label",
        matText: "NAS Synology DS920+ + Docker",
        img: "images/plex.webp",
        tags: ["docker", "nas"],
        listKeys: [
            "projects.plex.list1",
            "projects.plex.list2",
            "projects.plex.list3",
            "projects.plex.list4",
            "projects.plex.list5"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.plex.result",
        detailLink: "projet-plex.html"
    },
    {
        id: "pihole",
        type: "personal",
        titleKey: "projects.pihole.title",
        goalKey: "projects.pihole.goal",
        envKey: "projects.env_label",
        envText: "Raspberry Pi + Raspberry Pi OS",
        img: "images/pihole.webp",
        tags: ["raspberry", "reseau", "securite"],
        listKeys: [
            "projects.pihole.list1",
            "projects.pihole.list2",
            "projects.pihole.list3",
            "projects.pihole.list4",
            "projects.pihole.list5",
            "projects.pihole.list6"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.pihole.result",
        detailLink: "projet-pihole.html"
    },
    {
        id: "vpn",
        type: "personal",
        titleKey: "projects.vpn.title",
        goalKey: "projects.vpn.goal",
        envKey: "projects.env_label",
        envText: "Raspberry Pi + OpenVPN",
        img: "images/vpn.webp",
        tags: ["raspberry", "reseau", "securite"],
        listKeys: [
            "projects.vpn.list1",
            "projects.vpn.list2",
            "projects.vpn.list3",
            "projects.vpn.list4",
            "projects.vpn.list5",
            "projects.vpn.list6"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.vpn.result",
        detailLink: "projet-vpn.html"
    },
    {
        id: "restaurant",
        type: "personal",
        title: "Site vitrine pour un restaurant",
        goal: "réaliser un site vitrine simple et élégant pour présenter le restaurant, l’ambiance, les menus et les informations pratiques.",
        content: "pages essentielles (Accueil, Carte/Menu, Infos pratiques, Contact) avec un design cohérent et une navigation fluide.",
        img: "images/restaurant.webp",
        tags: ["web", "personnel"],
        listRaw: [
            "Maquettage puis intégration HTML/CSS/JS",
            "Responsive complet (mobile → desktop)",
            "Optimisation des images et du chargement",
            "Formulaire de contact et liens réseaux sociaux"
        ],
        detailLink: "projet-restaurant.html",
        siteLink: "https://mom-s-restaurant-1ddpi.kinsta.page/"
    }
];
