const fs = require("fs");
const path = require("path");

const srcDir =
  "C:\\Users\\bijja\\.gemini\\antigravity\\brain\\e7715606-4600-466f-97c4-162b6ab8044e";
const destDir = path.join(__dirname, "public", "images");

const files = [
  { src: "cookie_product_final_1771693969136.png", dest: "cookie.png" },
  { src: "strawberry_product_1771691127654.png", dest: "strawberry.png" },
  { src: "podi_product_1771691152754.png", dest: "podi.png" },
];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (err) {
    console.error(`Failed to copy ${src}: ${err.message}`);
  }
});

console.log("\\nFiles in images dir:");
fs.readdirSync(destDir).forEach((f) => {
  const stats = fs.statSync(path.join(destDir, f));
  console.log(`  ${f} (${stats.size} bytes)`);
});
