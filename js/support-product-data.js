const initialSupportProductData = [
    {
        id: 1733011200000, // 2024-12-01
        title: "F#1 Status System Manual (Gen 3)",
        date: "2024-12-01",
        content: "Manual for the 3rd Generation F#1 Status System.\nIncludes installation and tuning guide.",
        author: "Admin",
        files: [{ name: "F1_Status_Gen3_Manual.pdf", path: "assets/files/F1_Status_Gen3_Manual.pdf" }]
    },
    {
        id: 1731628800000, // 2024-11-15
        title: "HDP-H900 Firmware Update v2.0",
        date: "2024-11-15",
        content: "Latest firmware for HDP-H900 DSP/Amplifier.\nFixes minor bugs and improves stability.",
        author: "Admin",
        files: [{ name: "HDP-H900_FW_v2.0.zip", path: "assets/files/HDP-H900_FW_v2.0.zip" }]
    },
    {
        id: 1730246400000, // 2024-10-30
        title: "HDZ-9000 Installation Guide",
        date: "2024-10-30",
        content: "Installation instructions for HDZ-9000 speakers.",
        author: "Admin",
        files: [{ name: "HDZ-9000_Install_Guide.pdf", path: "assets/files/HDZ-9000_Install_Guide.pdf" }]
    }
];

let supportProductData = [];

if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('supportProductData');
    if (stored) {
        supportProductData = JSON.parse(stored);
    } else {
        supportProductData = JSON.parse(JSON.stringify(initialSupportProductData));
        localStorage.setItem('supportProductData', JSON.stringify(supportProductData));
    }
} else {
    supportProductData = initialSupportProductData;
}
