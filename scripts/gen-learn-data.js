// repup-exercise-data/exercises.ko.json 을 앱에서 쓰는 모듈로 변환한다.
// Metro는 이미지 require 경로가 정적이어야 하므로 require() 맵을 코드로 생성한다.
// 사용: node scripts/gen-learn-data.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'repup-exercise-data');
const json = JSON.parse(fs.readFileSync(path.join(dataDir, 'exercises.ko.json'), 'utf8'));

const entries = json.exercises.map((e) => {
  const { images, instructionsEn, source, ...rest } = e;
  const imgs = images
    .slice()
    .sort((a, b) => parseInt(path.basename(a), 10) - parseInt(path.basename(b), 10))
    .map((p) => `require('../../repup-exercise-data/${p}')`);
  const body = JSON.stringify(rest, null, 2).replace(/\n}$/, '').replace(/^{/, '');
  return `  {${body},\n    "images": [${imgs.join(', ')}],\n  }`;
});

const out = `// 자동 생성 파일 — 직접 수정하지 말고 scripts/gen-learn-data.js 를 다시 실행하세요.
// 원본: repup-exercise-data/exercises.ko.json (${json.license})
import type { LearnExercise } from './learnTypes';

export const LEARN_EXERCISES: LearnExercise[] = [
${entries.join(',\n')},
];
`;
fs.writeFileSync(path.join(root, 'src', 'data', 'learnData.generated.ts'), out);
console.log(`generated ${json.exercises.length} exercises`);
