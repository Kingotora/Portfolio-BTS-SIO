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
    // PROFESSIONAL ACTIVITIES (Althec)
    {
        id: "support-glpi",
        type: "professional",
        titleKey: "projects.support_glpi.title",
        goalKey: "projects.support_glpi.goal",
        envKey: "projects.env_label",
        envText: "GLPI + FusionInventory",
        img: "images/support-glpi.png",
        tags: ["helpdesk", "windows"],
        listKeys: [
            "projects.support_glpi.list1",
            "projects.support_glpi.list2",
            "projects.support_glpi.list3",
            "projects.support_glpi.list4"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.support_glpi.result",
        detailLink: "projet-support-glpi.html"
    },
    {
        id: "m365-ad",
        type: "professional",
        titleKey: "projects.m365_ad.title",
        goalKey: "projects.m365_ad.goal",
        envKey: "projects.env_label",
        envText: "Windows Server + Microsoft 365",
        img: "images/m365-admin.png",
        tags: ["windows", "reseau"],
        listKeys: [
            "projects.m365_ad.list1",
            "projects.m365_ad.list2",
            "projects.m365_ad.list3",
            "projects.m365_ad.list4"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.m365_ad.result",
        detailLink: "projet-m365-ad.html"
    },
    {
        id: "omada",
        type: "professional",
        titleKey: "projects.omada.title",
        goalKey: "projects.omada.goal",
        envKey: "projects.env_label",
        envText: "TP-Link Omada SDN",
        img: "images/omada-dashboard.png",
        tags: ["reseau"],
        listKeys: [
            "projects.omada.list1",
            "projects.omada.list2",
            "projects.omada.list3",
            "projects.omada.list4"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.omada.result",
        detailLink: "projet-omada.html"
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
        titleKey: "projects.restaurant.title",
        goalKey: "projects.restaurant.goal",
        contentKey: "projects.restaurant.content",
        img: "images/restaurant.webp",
        tags: ["web", "personnel"],
        listKeys: [
            "projects.restaurant.list1",
            "projects.restaurant.list2",
            "projects.restaurant.list3",
            "projects.restaurant.list4"
        ],
        detailLink: "projet-restaurant.html",
        siteLink: "https://mom-s-restaurant-1ddpi.kinsta.page/"
    },
    {
        id: "newsletter",
        type: "personal",
        titleKey: "projects.newsletter.title",
        goalKey: "projects.newsletter.goal",
        envKey: "projects.env_label",
        envText: "Node.js + SQLite + Brevo API",
        img: "images/newsletter.webp",
        tags: ["web"],
        listKeys: [
            "projects.newsletter.list1",
            "projects.newsletter.list2",
            "projects.newsletter.list3",
            "projects.newsletter.list4",
            "projects.newsletter.list5"
        ],
        resultKey: "projects.result_label",
        resultTextKey: "projects.newsletter.result",
        detailLink: "projet-newsletter.html"
    }
];
