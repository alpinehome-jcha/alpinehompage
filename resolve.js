const fs = require('fs');
let c = fs.readFileSync('js/popup-data.js', 'utf8');
c = c.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n/, '');
c = c.replace(/[\s]+"dealerOnly": true,\r?\n[\s]+"imagePath": "assets\/images\/popupimage\/alpine_dealer_popup\.jpg",\r?\n>>>>>>>.*?\n/, '\n        "dealerOnly": true,\n        "imagePath": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/images/popups/alpine_dealer_popup2.jpg",\n');
c = c.replace(/\?\파\?\?\?\리점 모집/g, '알파인 대리점 모집');
fs.writeFileSync('js/popup-data.js', c);
