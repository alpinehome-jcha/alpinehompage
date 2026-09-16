
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
html = html.replace(/dontShowPopup\(\x27\x27, 1\)/g, "dontShowPopup(\x27${p.id}\x27, 1)");
fs.writeFileSync("index.html", html);
console.log("Fixed index.html");

