const Creatomate = require('creatomate');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { parse } = require('csv-parse/sync');
const config = require('./config');

// API 키 확인
if (!config.apiKey || config.apiKey === 'your_api_key_here') {
  console.error('❌ .env 파일에 CREATOMATE_API_KEY를 설정해주세요.');
  console.error('   .env.example 파일을 참고하여 .env 파일을 생성하세요.');
  process.exit(1);
}

if (!config.templateId || config.templateId === 'your_template_id_here') {
  console.error('❌ .env 파일에 TEMPLATE_ID를 설정해주세요.');
  console.error('   Creatomate 에디터에서 템플릿을 만든 후 ID를 복사하세요.');
  process.exit(1);
}

// ffmpeg 설치 확인
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch {
  console.error('❌ ffmpeg가 설치되어 있지 않습니다.');
  console.error('   macOS: brew install ffmpeg');
  console.error('   Ubuntu: sudo apt install ffmpeg');
  process.exit(1);
}

const client = new Creatomate.Client(config.apiKey);

/**
 * URL에서 파일을 다운로드하여 로컬에 저장
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

/**
 * ffmpeg로 MP4 → 고품질 GIF 변환 (2-pass 팔레트 방식)
 */
function convertToGif(mp4Path, gifPath, fps = 15) {
  const palette = mp4Path.replace('.mp4', '_palette.png');

  // 1단계: 최적 팔레트 생성
  execSync(
    `ffmpeg -y -i "${mp4Path}" -vf "fps=${fps},palettegen=max_colors=256:stats_mode=full" "${palette}"`,
    { stdio: 'ignore' }
  );

  // 2단계: 팔레트 기반 GIF 변환
  execSync(
    `ffmpeg -y -i "${mp4Path}" -i "${palette}" -lavfi "fps=${fps}[x];[x][1:v]paletteuse=dither=floyd_steinberg" "${gifPath}"`,
    { stdio: 'ignore' }
  );

  // 팔레트 임시 파일 삭제
  if (fs.existsSync(palette)) fs.unlinkSync(palette);
}

/**
 * ffmpeg로 MP4 → WebM 변환
 */
function convertToWebm(mp4Path, webmPath) {
  execSync(
    `ffmpeg -y -i "${mp4Path}" -c:v libvpx-vp9 -b:v 0 -crf 30 -an "${webmPath}"`,
    { stdio: 'ignore' }
  );
}

/**
 * ffmpeg로 MP4 첫 프레임 → WebP 정적 이미지 (poster용)
 */
function extractPoster(mp4Path, webpPath) {
  execSync(
    `ffmpeg -y -i "${mp4Path}" -vframes 1 -q:v 80 "${webpPath}"`,
    { stdio: 'ignore' }
  );
}

/**
 * SEO 친화적 파일명 생성
 * - slug 컬럼이 있으면 그대로 사용
 * - 없으면 title에서 자동 생성 (비ASCII 제거, kebab-case)
 */
function toFilename(row, index) {
  if (row.slug) {
    return row.slug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 60);
  }
  const title = row.title || row.Title || `item-${index + 1}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

/**
 * CSV 데이터를 읽어 MP4 → GIF / WebM / WebP 대량 생성
 */
async function generate() {
  // 1. CSV 데이터 읽기
  const csvPath = path.join(__dirname, '../data/texts.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ data/texts.csv 파일을 찾을 수 없습니다.');
    console.error('   data/texts.csv 파일을 만들어주세요.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (records.length === 0) {
    console.error('❌ CSV 파일에 데이터가 없습니다.');
    process.exit(1);
  }

  // 2. output 디렉토리 확인 (날짜별 폴더 생성)
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const outputDir = path.join(__dirname, '..', config.outputDir, today);
  const mp4Dir = path.join(outputDir, 'mp4');
  const gifDir = path.join(outputDir, 'gif');
  const webmDir = path.join(outputDir, 'webm');
  const posterDir = path.join(outputDir, 'poster');

  [mp4Dir, gifDir, webmDir, posterDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log(`\n🎬 총 ${records.length}개 에셋 생성 시작...\n`);
  console.log('─'.repeat(50));

  let successCount = 0;
  let failCount = 0;

  // 3. 각 행별로 렌더링 요청
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const label = row.title || row.Title || `item-${i + 1}`;
    const filename = toFilename(row, i);

    console.log(`[${i + 1}/${records.length}] "${label}" 처리 중...`);

    try {
      // CSV 컬럼명을 Creatomate 템플릿의 동적 변수에 매핑 (slug 제외)
      const modifications = {};
      for (const [key, value] of Object.entries(row)) {
        if (key !== 'slug') modifications[key] = value;
      }

      // ① Creatomate API로 MP4 렌더링
      console.log('  → MP4 렌더링 중...');
      const renders = await client.render({
        templateId: config.templateId,
        outputFormat: 'mp4',
        modifications,
      });

      const render = renders[0];
      const mp4Path = path.join(mp4Dir, `${filename}.mp4`);
      await downloadFile(render.url, mp4Path);
      console.log(`  ✅ MP4 저장: mp4/${filename}.mp4`);

      // ② ffmpeg: MP4 → 고품질 GIF (2-pass 팔레트)
      console.log('  → GIF 변환 중...');
      const gifPath = path.join(gifDir, `${filename}.gif`);
      convertToGif(mp4Path, gifPath);
      console.log(`  ✅ GIF 저장: gif/${filename}.gif`);

      // ③ ffmpeg: MP4 → WebM (VP9)
      console.log('  → WebM 변환 중...');
      const webmPath = path.join(webmDir, `${filename}.webm`);
      convertToWebm(mp4Path, webmPath);
      console.log(`  ✅ WebM 저장: webm/${filename}.webm`);

      // ④ ffmpeg: MP4 첫 프레임 → WebP (poster용)
      console.log('  → Poster(WebP) 추출 중...');
      const posterPath = path.join(posterDir, `${filename}.webp`);
      extractPoster(mp4Path, posterPath);
      console.log(`  ✅ Poster 저장: poster/${filename}.webp`);

      successCount++;
      console.log('');
    } catch (error) {
      console.error(`  ❌ 실패: ${error.message}\n`);
      failCount++;
    }
  }

  // 4. 결과 요약
  console.log('─'.repeat(50));
  console.log(`\n🏁 완료! 성공: ${successCount}개 / 실패: ${failCount}개`);
  console.log(`   저장 위치: ${outputDir}`);
  console.log(`   ├── mp4/     원본 영상`);
  console.log(`   ├── gif/     고품질 GIF (ffmpeg 팔레트)`);
  console.log(`   ├── webm/    WebM (VP9, 가장 가벼움)`);
  console.log(`   └── poster/  정적 썸네일 (WebP)\n`);

  console.log('💡 웹앱에서 사용 예시:');
  console.log('   <video autoplay loop muted playsinline');
  console.log('     poster="poster/파일명.webp"');
  console.log('     aria-label="프로모션 설명">');
  console.log('     <source src="webm/파일명.webm" type="video/webm">');
  console.log('     <source src="mp4/파일명.mp4" type="video/mp4">');
  console.log('   </video>\n');
}

generate();
