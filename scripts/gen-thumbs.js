// 목록용 작은 이미지(가로 320px)를 만든다. macOS의 sips를 사용한다.
// 원본(850x567)은 디코딩하면 장당 약 1.9MB라서 목록에서 25개를 동시에 돌리면 메모리/렉 문제가 생긴다.
// 사용: node scripts/gen-thumbs.js && node scripts/gen-learn-data.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..', 'repup-exercise-data');
const src = path.join(root, 'images');
const dst = path.join(root, 'thumbs');
let count = 0;

for (const dir of fs.readdirSync(src, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  fs.mkdirSync(path.join(dst, dir.name), { recursive: true });
  for (const f of fs.readdirSync(path.join(src, dir.name))) {
    if (!/\.jpe?g$/i.test(f)) continue;
    execFileSync('sips', ['--resampleWidth', '320', '-s', 'formatOptions', '70', path.join(src, dir.name, f), '--out', path.join(dst, dir.name, f)], { stdio: 'ignore' });
    count++;
  }
}
console.log(`generated ${count} thumbnails`);
