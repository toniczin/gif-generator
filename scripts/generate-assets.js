import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontsDir = path.join(__dirname, "..", "public", "fonts");
const imagesDir = path.join(__dirname, "..", "public", "backgrounds");
const cssOut = path.join(__dirname, "..", "src", "fonts.css");
const fontsJsonOut = path.join(__dirname, "..", "src", "fonts.json");
const imagesJsonOut = path.join(__dirname, "..", "src", "images.json");

const FONT_FORMAT_MAP = {
  ".woff2": "woff2",
  ".woff": "woff",
  ".ttf": "truetype",
  ".otf": "opentype",
};

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

const REMOTE_FONTS = [
  {
    family: "MangoByeolbyeol",
    src: "https://cdn.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/MangoByeolbyeol.woff2",
    format: "woff2",
  },
];

function fileToFamily(filename) {
  return path.basename(filename, path.extname(filename));
}

function scanFonts() {
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  const files = fs
    .readdirSync(fontsDir)
    .filter((f) => FONT_FORMAT_MAP[path.extname(f).toLowerCase()])
    .sort();

  const localFonts = files.map((f) => ({
    family: fileToFamily(f),
    src: `/fonts/${f}`,
    format: FONT_FORMAT_MAP[path.extname(f).toLowerCase()],
  }));

  const allFonts = [...REMOTE_FONTS, ...localFonts];

  const cssRules = allFonts
    .map(
      (font) => `@font-face {
  font-family: "${font.family}";
  src: url("${font.src}") format("${font.format}");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`,
    )
    .join("\n\n");

  fs.writeFileSync(cssOut, cssRules + "\n");

  const familyList = allFonts.map((f) => f.family);
  fs.writeFileSync(fontsJsonOut, JSON.stringify(familyList, null, 2) + "\n");

  return allFonts;
}

function scanImages() {
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort();

  fs.writeFileSync(imagesJsonOut, JSON.stringify(files, null, 2) + "\n");

  return files;
}

function main() {
  const fonts = scanFonts();
  const images = scanImages();

  console.log(`Generated ${fonts.length} fonts:`);
  fonts.forEach((f) => console.log(`  - ${f.family} (${f.src.startsWith("http") ? "remote" : "local"})`));

  console.log(`\nGenerated ${images.length} images:`);
  images.forEach((f) => console.log(`  - ${f}`));
}

main();
