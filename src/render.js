import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ─── CLI 옵션 파싱 ───
const args = process.argv.slice(2);
const format = args.find((a) => a.startsWith("--format="))?.split("=")[1] || "all";
const jsonFile = args.find((a) => a.startsWith("--json="))?.split("=")[1];

// ─── JSON 단일 렌더링 모드 ───
if (jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    console.error(`JSON 파일을 찾을 수 없습니다: ${jsonFile}`);
    process.exit(1);
  }
  const jsonProps = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
  const slug = path.basename(jsonFile, ".json");

  (async () => {
    const bundleLocation = await bundle({ entryPoint: path.join(__dirname, "Root.tsx") });
    const today = new Date().toISOString().slice(0, 10);
    const outputDir = path.join(__dirname, "..", "output", today);
    const dirs = { png: "png", mp4: "mp4", gif: "gif", webm: "webm", poster: "poster" };
    for (const dir of Object.values(dirs)) {
      const p = path.join(outputDir, dir);
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    }

    const comp = await getCompWithProps(bundleLocation, "CardPromo", jsonProps);

    if (format === "all" || format === "still") {
      const pngPath = path.join(outputDir, dirs.png, `${slug}.png`);
      await renderStill({ composition: comp, serveUrl: bundleLocation, output: pngPath, frame: 45 });
      console.log(`PNG: ${pngPath}`);
    }
    if (format === "all" || format === "gif" || format === "mp4") {
      const mp4Path = path.join(outputDir, dirs.mp4, `${slug}.mp4`);
      await renderMedia({ composition: comp, serveUrl: bundleLocation, codec: "h264", outputLocation: mp4Path });
      console.log(`MP4: ${mp4Path}`);
      if (format === "all" || format === "gif") {
        const gifPath = path.join(outputDir, dirs.gif, `${slug}.gif`);
        convertToGif(mp4Path, gifPath);
        console.log(`GIF: ${gifPath}`);
      }
      if (format === "all") {
        const webmPath = path.join(outputDir, dirs.webm, `${slug}.webm`);
        convertToWebm(mp4Path, webmPath);
        console.log(`WebM: ${webmPath}`);
        const posterPath = path.join(outputDir, dirs.poster, `${slug}.webp`);
        extractPoster(mp4Path, posterPath);
        console.log(`Poster: ${posterPath}`);
      }
    }
    console.log("Done!");
  })().catch((e) => { console.error(e.message); process.exit(1); });
} else {

// ─── CSV 파싱 ───
const csvPath = path.join(__dirname, "../data/texts.csv");
if (!fs.existsSync(csvPath)) {
  console.error("data/texts.csv 파일을 찾을 수 없습니다.");
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, "utf-8");
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

if (records.length === 0) {
  console.error("CSV 파일에 데이터가 없습니다.");
  process.exit(1);
}

// ─── SEO 파일명 생성 ───
function toFilename(row, index) {
  if (row.slug) {
    return row.slug.toLowerCase().replace(/[^a-z0-9-]/g, "").substring(0, 60);
  }
  return `card-${index + 1}`;
}

// ─── 기본 텍스트 요소 ───
function defaultTextElement(overrides = {}) {
  const { gradient, effect, bg, ...rest } = overrides;
  return {
    text: "",
    top: 50,
    left: 50,
    fontSize: 40,
    fontWeight: 900,
    rotation: 0,
    letterSpacing: 3,
    color: "#c8a0e8",
    gradient: { enabled: false, angle: 180, color1: "#ffffff", color2: "#c8a0e8", ...gradient },
    effect: { strokeColor: "#4a2070", strokeWidth: 4, shadowColor: "#1a0a30", shadowOffset: 5, glowColor: "rgba(160, 120, 255, 0.4)", glowSize: 20, ...effect },
    bg: { enabled: false, color: "rgba(74, 32, 112, 0.7)", paddingX: 12, paddingY: 4, borderRadius: 6, ...bg },
    animType: "fadeUp",
    animDelay: 0,
    endFrame: -1,
    ...rest,
  };
}

// ─── 기본 배지 ───
const DEFAULT_BADGE = {
  text: "",
  bgColor: "#ff4444",
  textColor: "#ffffff",
  fontSize: 16,
  top: 5,
  left: 8,
  paddingX: 14,
  paddingY: 6,
  borderRadius: 6,
  animType: "bounce",
  animDelay: 20,
  endFrame: -1,
  enabled: false,
};

// ─── 기본 오브제 슬롯 ───
const DEFAULT_OBJECT_SLOTS = [
  { top: 2, left: 78, size: 110, floatSpeed: 3, floatRange: 10, opacity: 1, delay: 0, rotation: 0, zIndex: 1, blendMode: "normal", endFrame: -1 },
  { top: 55, left: 80, size: 95, floatSpeed: 2, floatRange: 8, opacity: 0.8, delay: 5, rotation: 0, zIndex: 1, blendMode: "normal", endFrame: -1 },
  { top: 65, left: 3, size: 70, floatSpeed: 4, floatRange: 12, opacity: 0.7, delay: 10, rotation: 0, zIndex: 1, blendMode: "normal", endFrame: -1 },
  { top: 3, left: 5, size: 60, floatSpeed: 3, floatRange: 8, opacity: 0.9, delay: 3, rotation: 0, zIndex: 1, blendMode: "normal", endFrame: -1 },
  { top: 40, left: 85, size: 80, floatSpeed: 2.5, floatRange: 10, opacity: 0.8, delay: 8, rotation: 0, zIndex: 1, blendMode: "normal", endFrame: -1 },
];

// ─── CSV row → Remotion props 변환 ───
function rowToProps(row) {
  // textElements: JSON 컬럼 또는 기존 title/subtitle 컬럼에서 생성
  let textElements;
  if (row.textElements) {
    textElements = JSON.parse(row.textElements);
  } else {
    textElements = [];
    if (row.location) {
      textElements.push(defaultTextElement({
        text: row.location, top: 32, left: 50, fontSize: 28, animDelay: 0,
        effect: { strokeWidth: 2 },
      }));
    }
    if (row.title) {
      const parts = row.title.split("\\\\n");
      const baseTop = 48;
      const lineGap = 14;
      parts.forEach((t, idx) => {
        textElements.push(defaultTextElement({
          text: t,
          top: baseTop + idx * lineGap,
          left: 50,
          fontSize: parseFloat(row["title-font-size"]) || 70,
          color: row["title-color"] || "#c8a0e8",
          effect: {
            strokeColor: row["title-stroke-color"] || "#4a2070",
            strokeWidth: parseFloat(row["title-stroke-width"]) || 5,
            shadowColor: row["title-shadow-color"] || "#1a0a30",
            shadowOffset: parseFloat(row["title-shadow-offset"]) || 6,
            glowColor: row["title-glow-color"] || "rgba(160, 120, 255, 0.4)",
          },
          animType: "scaleIn",
          animDelay: 6 + idx * 2,
        }));
      });
    }
    if (row.subtitle) {
      textElements.push(defaultTextElement({
        text: row.subtitle, top: 78, left: 50,
        fontSize: parseFloat(row["subtitle-font-size"]) || 20,
        color: row["subtitle-color"] || "#b8a8d0",
        fontWeight: 400,
        effect: { strokeWidth: 0, shadowOffset: 0, glowSize: 0 },
        animDelay: 16,
      }));
    }
  }

  // badge: JSON 컬럼 또는 기본값
  let badge;
  if (row.badge) {
    badge = JSON.parse(row.badge);
  } else {
    badge = { ...DEFAULT_BADGE };
  }

  // objects: JSON 컬럼 또는 기존 obj1~obj5 컬럼
  let objects;
  if (row.objects) {
    objects = JSON.parse(row.objects);
  } else {
    objects = [];
    for (let i = 1; i <= 5; i++) {
      const file = row[`obj${i}`];
      if (file) {
        const slot = DEFAULT_OBJECT_SLOTS[i - 1];
        objects.push({
          file,
          top: parseFloat(row[`obj${i}-top`]) || slot.top,
          left: parseFloat(row[`obj${i}-left`]) || slot.left,
          size: parseFloat(row[`obj${i}-size`]) || slot.size,
          floatSpeed: parseFloat(row[`obj${i}-float-speed`]) || slot.floatSpeed,
          floatRange: parseFloat(row[`obj${i}-float-range`]) || slot.floatRange,
          opacity: parseFloat(row[`obj${i}-opacity`]) || slot.opacity,
          delay: parseFloat(row[`obj${i}-delay`]) || slot.delay,
          rotation: parseFloat(row[`obj${i}-rotation`]) || slot.rotation,
          zIndex: parseInt(row[`obj${i}-zindex`]) || slot.zIndex,
          blendMode: row[`obj${i}-blend`] || "normal",
        });
      }
    }
  }

  return {
    background: {
      imageBlendMode: row["bg-image-blend"] || "normal",
      color: row["bg-color"] || "#0d0a1a",
      gradient: {
        enabled: row["bg-gradient-enabled"] !== "false",
        angle: parseFloat(row["bg-gradient-angle"]) || 160,
        color1: row["bg-gradient-color1"] || "#1a1040",
        stop1: parseFloat(row["bg-gradient-stop1"]) || 0,
        color2: row["bg-gradient-color2"] || "#0d0a1a",
        stop2: parseFloat(row["bg-gradient-stop2"]) || 40,
        color3: row["bg-gradient-color3"] || "#060412",
        stop3: parseFloat(row["bg-gradient-stop3"]) || 100,
      },
      image: row["bg-image"] || "",
    },
    fontFamily: row["font-family"] || "MangoByeolbyeol",
    textElements,
    badge,
    decoration: {
      objects,
      sparkleCount: parseInt(row["sparkle-count"]) || 10,
      sparkleColor: row["sparkle-color"] || "#ffffff",
    },
    durationInFrames: parseInt(row["duration-in-frames"]) || 90,
  };
}

// ─── ffmpeg 변환 ───
function convertToGif(mp4Path, gifPath, fps = 15) {
  const palette = mp4Path.replace(".mp4", "_palette.png");
  execSync(`ffmpeg -y -i "${mp4Path}" -vf "fps=${fps},palettegen=max_colors=256:stats_mode=full" "${palette}"`, { stdio: "ignore" });
  execSync(`ffmpeg -y -i "${mp4Path}" -i "${palette}" -lavfi "fps=${fps}[x];[x][1:v]paletteuse=dither=floyd_steinberg" "${gifPath}"`, { stdio: "ignore" });
  if (fs.existsSync(palette)) fs.unlinkSync(palette);
}

function convertToWebm(mp4Path, webmPath) {
  execSync(`ffmpeg -y -i "${mp4Path}" -c:v libvpx-vp9 -b:v 0 -crf 30 -an "${webmPath}"`, { stdio: "ignore" });
}

function extractPoster(mp4Path, webpPath) {
  execSync(`ffmpeg -y -i "${mp4Path}" -vframes 1 -q:v 80 "${webpPath}"`, { stdio: "ignore" });
}

// ─── composition을 inputProps로 재평가 ───
async function getCompWithProps(bundleLocation, compId, props) {
  const comps = await getCompositions(bundleLocation, { inputProps: props });
  return comps.find((c) => c.id === compId);
}

// ─── 메인 렌더링 ───
async function main() {
  console.log("\n Remotion 번들링 중...\n");

  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, "Root.tsx"),
  });

  const today = new Date().toISOString().slice(0, 10);
  const outputDir = path.join(__dirname, "..", "output", today);
  const dirs = { png: "png", mp4: "mp4", gif: "gif", webm: "webm", poster: "poster" };

  for (const dir of Object.values(dirs)) {
    const p = path.join(outputDir, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }

  console.log(`총 ${records.length}개 에셋 생성 시작...\n`);
  console.log("-".repeat(50));

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const filename = toFilename(row, i);
    const props = rowToProps(row);
    const label = row.title?.replace(/\\\\n/g, " ") || row.slug || `card-${i + 1}`;

    console.log(`[${i + 1}/${records.length}] "${label}" 처리 중...`);

    try {
      if (format === "all" || format === "still") {
        const pngPath = path.join(outputDir, dirs.png, `${filename}.png`);
        const stillComp = await getCompWithProps(bundleLocation, "CardPromo", props);
        await renderStill({
          composition: stillComp,
          serveUrl: bundleLocation,
          output: pngPath,
          frame: 45,
        });
        console.log(`  PNG: ${dirs.png}/${filename}.png`);
      }

      if (format === "all" || format === "gif" || format === "mp4") {
        const mp4Path = path.join(outputDir, dirs.mp4, `${filename}.mp4`);
        const videoComp = await getCompWithProps(bundleLocation, "CardPromo", props);
        await renderMedia({
          composition: videoComp,
          serveUrl: bundleLocation,
          codec: "h264",
          outputLocation: mp4Path,
        });
        console.log(`  MP4: ${dirs.mp4}/${filename}.mp4`);

        if (format === "all" || format === "gif") {
          const gifPath = path.join(outputDir, dirs.gif, `${filename}.gif`);
          convertToGif(mp4Path, gifPath);
          console.log(`  GIF: ${dirs.gif}/${filename}.gif`);
        }

        if (format === "all") {
          const webmPath = path.join(outputDir, dirs.webm, `${filename}.webm`);
          convertToWebm(mp4Path, webmPath);
          console.log(`  WebM: ${dirs.webm}/${filename}.webm`);
        }

        if (format === "all") {
          const posterPath = path.join(outputDir, dirs.poster, `${filename}.webp`);
          extractPoster(mp4Path, posterPath);
          console.log(`  Poster: ${dirs.poster}/${filename}.webp`);
        }
      }

      successCount++;
      console.log("");
    } catch (error) {
      console.error(`  실패: ${error.message}\n`);
      failCount++;
    }
  }

  console.log("-".repeat(50));
  console.log(`\n완료! 성공: ${successCount}개 / 실패: ${failCount}개`);
  console.log(`   저장 위치: ${outputDir}\n`);
}

main().catch((e) => {
  console.error("렌더링 실패:", e.message);
  process.exit(1);
});

} // end of else (CSV mode)
