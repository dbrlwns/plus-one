// 앱 아이콘/스플래시 이미지를 만든다. (SVG → PNG, Google Chrome headless 사용)
// 사용: node scripts/gen-brand.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.join(__dirname, '..', 'assets');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'plusone-brand-'));

const COLORS = {
  darkBg: '#0E1013',
  lightBg: '#F4F5F7',
  figDark: '#5B8CFF',
  figLight: '#2F6BFF',
  red: '#FF8A8A',
};

/** 로고 그림. 좌표는 180x180 타일 기준이고 그림의 중심은 (90, 90) 근처다. */
function art({ fig, red, floorOpacity = 0.4 }) {
  return `
  <rect x="28" y="147" width="124" height="4" rx="2" fill="${fig}" opacity="${floorOpacity}"/>
  <polyline points="40,138 82,114 122,98" fill="none" stroke="${fig}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="122" y1="98" x2="124" y2="139" stroke="${fig}" stroke-width="11" stroke-linecap="round"/>
  <circle cx="139" cy="86" r="11" fill="${fig}"/>
  <rect x="28" y="40" width="36" height="12" rx="6" fill="${red}"/>
  <rect x="40" y="28" width="12" height="36" rx="6" fill="${red}"/>
  <polyline points="80,39 88,34 88,58" fill="none" stroke="${red}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const placed = (inner, size, scale, cx = size / 2, cy = size / 2) =>
  `<g transform="translate(${cx - 90 * scale} ${cy - 90 * scale}) scale(${scale})">${inner}</g>`;

function render(file, size, body, bg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${
    bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''
  }${body}</svg>`;
  const html = path.join(TMP, file + '.html');
  fs.writeFileSync(html, `<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
  const png = path.join(OUT, file);
  execFileSync(
    CHROME,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000', `--window-size=${size},${size}`, `--screenshot=${png}`, 'file://' + html],
    { stdio: 'ignore' },
  );
  console.log('wrote', file);
}

// 앱 아이콘 (타일 디자인 그대로 1024로 키운다. 모서리 둥글림은 OS가 처리한다)
render('icon.png', 1024, placed(art({ fig: COLORS.figDark, red: COLORS.red }), 1024, 1024 / 180), COLORS.darkBg);

// 안드로이드 적응형 아이콘: 가운데 66% 안쪽에 그림을 둔다
const adaptive = (a) => placed(art(a), 1024, 4.4);
render('android-icon-foreground.png', 1024, adaptive({ fig: COLORS.figDark, red: COLORS.red }), null);
// (배경은 app.json의 adaptiveIcon.backgroundColor 단색을 쓴다)
render('android-icon-monochrome.png', 1024, adaptive({ fig: '#FFFFFF', red: '#FFFFFF', floorOpacity: 0.5 }), null);

// 웹 파비콘
render(
  'favicon.png',
  64,
  `<rect width="64" height="64" rx="14" fill="${COLORS.darkBg}"/>` +
    placed(art({ fig: COLORS.figDark, red: COLORS.red }), 64, 64 / 180 * 1.15),
  null,
);

// 스플래시: 로고만 (안드로이드 네이티브 스플래시 + 앱 안 스플래시 화면에서 쓴다)
const SPLASH_SCALE = 3.6;
render('splash-logo-dark.png', 1024, placed(art({ fig: COLORS.figDark, red: COLORS.red }), 1024, SPLASH_SCALE), null);
render('splash-logo-light.png', 1024, placed(art({ fig: COLORS.figLight, red: COLORS.red }), 1024, SPLASH_SCALE), null);

// 스플래시: 로고 + 글자 (iOS 네이티브 스플래시). 로고가 이미지 정중앙에 오도록 글자는 아래쪽에 둔다.
const font = `font-family="-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"`;
const withText = (theme) => {
  const dark = theme === 'dark';
  const title = dark ? '#F2F4F7' : '#14171C';
  const sub = dark ? '#9AA3B2' : '#6A7280';
  return (
    placed(art({ fig: dark ? COLORS.figDark : COLORS.figLight, red: COLORS.red }), 1024, SPLASH_SCALE) +
    `<text x="512" y="850" text-anchor="middle" ${font} font-size="104" font-weight="700" fill="${title}">Plus one</text>` +
    `<text x="512" y="925" text-anchor="middle" ${font} font-size="44" font-weight="400" letter-spacing="3" fill="${sub}">for home fitness</text>`
  );
};
render('splash-ios-dark.png', 1024, withText('dark'), null);
render('splash-ios-light.png', 1024, withText('light'), null);

fs.rmSync(TMP, { recursive: true, force: true });
