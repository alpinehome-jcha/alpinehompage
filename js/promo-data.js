const initialPromoData = [
    {
        id: 1733020000000,
        title: "2025 Brand Campaign 'Sound of Emotion'",
        date: "2025-01-10",
        author: "Admin",
        contentBlocks: [
            { type: 'text', value: "Experience the new wave of sound with our 2025 campaign." },
            { type: 'image', value: 'assets/images/promo_main.jpg' },
            { type: 'text', value: "Download the high-res posters below for your showroom." }
        ],
        files: [{ name: "Campaign_Poster_A1.pdf", path: "assets/files/Campaign_Poster_A1.pdf" }]
    },
    {
        id: 1732150000000,
        title: "Winter Season Promotional Assets",
        date: "2024-11-20",
        author: "Admin",
        contentBlocks: [
            { type: 'text', value: "Seasonal assets for the winter sales event." }
        ],
        files: [{ name: "Winter_Banner_Set.zip", path: "assets/files/Winter_Banner_Set.zip" }]
    }
];

let promoData = [];

if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('promoData');
    if (stored) {
        promoData = JSON.parse(stored);
    } else {
        promoData = JSON.parse(JSON.stringify(initialPromoData));
        localStorage.setItem('promoData', JSON.stringify(promoData));
    }
} else {
    promoData = initialPromoData;
}
