// README용 화면 캡처를 만든다. 사용: (다른 터미널에서 `npm run web` 실행 후) node scripts/gen-screenshots.mjs
// Chrome을 모바일 크기로 띄우고 예시 데이터를 넣은 뒤 화면을 docs/screenshots/*.png 로 저장한다.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.APP_URL ?? 'http://localhost:8081';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots');
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

// ---- 예시 데이터 (10월 기준) ----
const ex = (exerciseId, name, sets, target = 15) => ({ exerciseId, name, type: 'reps', targetSets: sets.length, target, sets });
const rec = (date, durationSec, exercises) => ({ id: date, date, startedAt: new Date(date + 'T19:00:00').getTime(), durationSec, exercises });
const records = [
  rec('2026-10-05', 1510, [ex('push-up', '푸쉬업', [15, 14, 12]), ex('dips', '딥스', [10, 9, 8], 10)]),
  rec('2026-10-06', 1320, [ex('pull-up', '풀업', [6, 5, 4], 6), ex('db-curl', '덤벨 컬', [12, 12, 10], 12)]),
  rec('2026-10-07', 1680, [ex('db-squat', '덤벨 스쿼트', [15, 15, 14]), ex('glute-bridge', '글루트 브릿지', [15, 15, 15])]),
  rec('2026-10-09', 1440, [ex('push-up', '푸쉬업', [15, 15, 13]), ex('hammer-curl', '해머 컬', [12, 12, 12], 12)]),
  rec('2026-10-12', 1590, [ex('push-up', '푸쉬업', [16, 15, 14]), ex('dips', '딥스', [10, 10, 9], 10)]),
  rec('2026-10-14', 1730, [ex('db-squat', '덤벨 스쿼트', [15, 15, 15]), ex('calf-raise', '카프레이즈', [20, 20, 18], 20)]),
  rec('2026-10-16', 1480, [ex('push-up', '푸쉬업', [17, 15, 14]), ex('chin-up', '친업', [6, 6, 5], 6)]),
];
const settings = { name: '', restSec: 90, theme: 'system', tempos: {}, startDate: '2026-10-01' };
const notes = { '2026-10-16': '어깨 컨디션 좋음. 푸쉬업 1회 늘었다!' };

// ---- Chrome DevTools 연결 ----
const profile = mkdtempSync(join(tmpdir(), 'plusone-shot-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let ws;
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch { /* 아직 안 떴다 */ }
    if (!target) await sleep(250);
  }
  if (!target) throw new Error('Chrome에 연결하지 못했어요');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const waiting = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res) => { const n = ++id; waiting.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

  const setup = async (scheme) => {
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  };
  const open = async (path, scheme = 'light') => {
    await setup(scheme);
    await send('Page.navigate', { url: BASE + path });
    await sleep(4500); // 시작 화면이 사라질 때까지
  };
  const click = (text, exact = true) => evaluate(`(async()=>{const b=[...document.querySelectorAll('[role=button]')].filter(e=>e.offsetParent!==null).find(e=>${exact ? `e.textContent.trim()===${JSON.stringify(text)}` : `e.textContent.includes(${JSON.stringify(text)})`}); if(!b) return false; b.click(); await new Promise(r=>setTimeout(r,400)); return true;})()`);
  // 역할(role)이 없는 요소(달력 날짜 등)도 글자로 찾아서 누른다
  const clickText = (text) => evaluate(`(async()=>{const el=[...document.querySelectorAll('div,span')].filter(e=>e.offsetParent!==null&&e.children.length===0&&e.textContent.trim()===${JSON.stringify(text)}).pop(); if(!el) return false; el.click(); await new Promise(r=>setTimeout(r,400)); return true;})()`);
  const clickLabel = (label) => evaluate(`(async()=>{const el=[...document.querySelectorAll('[role=button]')].find(e=>e.getAttribute('aria-label')===${JSON.stringify(label)}); if(!el) return false; el.click(); await new Promise(r=>setTimeout(r,400)); return true;})()`);
  const shot = async (name, clipHeight) => {
    const r = await send('Page.captureScreenshot', {
      format: 'png',
      ...(clipHeight ? { clip: { x: 0, y: 0, width: 375, height: clipHeight, scale: 1 } } : {}),
    });
    writeFileSync(join(OUT, name), Buffer.from(r.result.data, 'base64'));
    console.log('saved', name);
  };

  // 예시 데이터 넣기
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(3000);
  await evaluate(`localStorage.setItem('plusone/records', ${JSON.stringify(JSON.stringify(records))}); localStorage.setItem('plusone/settings', ${JSON.stringify(JSON.stringify(settings))}); localStorage.setItem('plusone/notes', ${JSON.stringify(JSON.stringify(notes))}); true`);

  await open('/');
  console.log('stored records:', (await evaluate(`(JSON.parse(localStorage.getItem('plusone/records')||'[]')).length`)));
  await clickText('16');
  await shot('calendar.png');

  await open('/routine');
  await shot('routine.png');

  // 오늘이 휴식일이면 운동이 있는 요일이 나올 때까지 이전 요일로 넘긴다
  const toWorkoutDay = async () => {
    for (let i = 0; i < 7; i++) {
      if (await evaluate(`[...document.querySelectorAll('[role=button]')].some(e=>(e.getAttribute('aria-label')||'').endsWith('만 시작'))`)) return;
      await clickLabel('이전 요일');
    }
  };
  await open('/workout');
  await toWorkoutDay();
  await shot('workout.png');

  await open('/workout', 'dark');
  await toWorkoutDay();
  await click('시작', true);
  await sleep(9000);
  await shot('session-dark.png');

  await open('/learn');
  await click('푸쉬업', false);
  await sleep(800);
  // 개발 모드 경고 배지(Unknown event handler ...)가 화면 아래에 뜨므로, 이 화면은 그 위쪽만 잘라서 저장한다
  await shot('learn.png', 740);
} finally {
  try { ws?.close(); } catch { /* ignore */ }
  chrome.kill();
  await sleep(1500); // Chrome이 임시 폴더를 놓을 때까지 기다린다
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* 임시 폴더라 남아도 괜찮다 */ }
}
