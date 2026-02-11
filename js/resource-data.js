const initialResourceData = [
    {
        id: 1770123456789,
        date: "2026-02-04",
        title: "Marketing Guidelines 2026",
        content: "Standard operating procedures for brand representation and logo usage.",
        image: "../assets/images/alpine_logo.png",
        files: [
            { name: "Brand_Guide_v1.pdf", path: "" }
        ],
        author: "Admin"
    },
    {
        id: 1770123456790,
        date: "2026-02-03",
        title: "Technical Schematics - Advanced",
        content: "Deep dive into DSP wiring diagrams for F#1 Status systems.",
        image: "",
        files: [],
        author: "Admin"
    }
];

let resourceData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('resourceData');
    if (stored) {
        resourceData = JSON.parse(stored);
    } else {
        resourceData = JSON.parse(JSON.stringify(initialResourceData));
    }
} else {
    resourceData = initialResourceData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = resourceData;
}
