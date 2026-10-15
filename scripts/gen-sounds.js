// 알림음(WAV) 생성 스크립트: node scripts/gen-sounds.js
const fs = require('fs');
const path = require('path');

const RATE = 22050;

function tone(segments) {
  const samples = [];
  for (const { freq, ms, vol = 0.6 } of segments) {
    const n = Math.floor((RATE * ms) / 1000);
    for (let i = 0; i < n; i++) {
      const env = Math.min(1, i / 200, (n - i) / 400); // 클릭 노이즈 방지
      samples.push(Math.sin((2 * Math.PI * freq * i) / RATE) * vol * Math.max(0, env));
    }
  }
  return samples;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(s * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

const out = path.join(__dirname, '..', 'assets', 'sounds');
fs.writeFileSync(path.join(out, 'tick.wav'), wav(tone([{ freq: 880, ms: 120 }])));
fs.writeFileSync(
  path.join(out, 'done.wav'),
  wav(tone([{ freq: 660, ms: 160 }, { freq: 880, ms: 160 }, { freq: 1320, ms: 280 }])),
);
console.log('sounds generated');
