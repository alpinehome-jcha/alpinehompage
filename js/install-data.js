const initialInstallData = [
    {
        id: 1733875200000, // 2024-12-10
        title: "Mercedes-Benz S-Class (W223) Integration Guide",
        date: "2024-12-10",
        author: "Admin",
        // Rich Content Structure: array of blocks
        contentBlocks: [
            { type: 'text', value: "Full integration guide for the new S-Class chassis. Includes wiring diagrams and DSP tuning profiles." },
            { type: 'image', value: 'assets/images/w223_01.jpg' },
            { type: 'text', value: "Step 1: Disassemble the door panel carefully using the trim tool." },
            { type: 'image', value: 'assets/images/w223_02.jpg' },
            { type: 'text', value: "Step 2: Connect the PNP cable to the factory amp location in the trunk." }
        ],
        files: [{ name: "W223_Guide.pdf", path: "assets/files/W223_Guide.pdf" }]
    },
    {
        id: 1732233600000, // 2024-11-22
        title: "DSP Tuning Best Practices",
        date: "2024-11-22",
        author: "Admin",
        contentBlocks: [
            { type: 'text', value: "Achieving the perfect soundstage requires precise time alignment and EQ adjustments." },
            { type: 'image', value: 'assets/images/dsp_curve.jpg' },
            { type: 'text', value: "Recommended target curve for pop/rock genres." }
        ],
        files: []
    }
];

let installData = [];

if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('installData');
    if (stored) {
        installData = JSON.parse(stored);
    } else {
        installData = JSON.parse(JSON.stringify(initialInstallData));
        localStorage.setItem('installData', JSON.stringify(installData));
    }
} else {
    installData = initialInstallData;
}
