# +1

맨몸/홈트 운동용 앱 프로토타입. Expo (React Native) + TypeScript.

## 실행

```bash
npm install
npm run web      # 웹 (http://localhost:8081)
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `app/(tabs)/` | expo-router 하단 탭 4개: 달력(`index`), 루틴, 운동, 배우기 (설정은 달력 우측 상단 아이콘 → `app/settings.tsx`) |
| `src/workout/machine.ts` | 운동 진행 상태 머신 (UI와 분리된 순수 reducer) |
| `src/components/WorkoutSession.tsx` | 상태 머신을 화면에 연결 (1초 틱, 소리/진동, 화면 꺼짐 방지) |
| `src/storage/storage.ts` | AsyncStorage 저장/불러오기 모듈 |
| `src/state/AppData.tsx` | 설정/루틴/기록 컨텍스트 (변경 시 자동 저장) |
| `src/data/exercises.ts` | 기본 운동 DB (부위별) |
| `app/(tabs)/learn.tsx` | 배우기 탭: 운동 목록 → 상세(순환 이미지, 자극 부위, 운동 방법) |
| `src/components/ExerciseImageLoop.tsx` | 번호 순서대로 1.5초마다 이미지 순환 |
| `src/components/MuscleMap.tsx` | react-native-body-highlighter로 자극 부위 표시 |
| `repup-exercise-data/` | 운동 설명/이미지 원본 (free-exercise-db 기반) |
| `scripts/gen-thumbs.js` | 목록용 작은 이미지(`repup-exercise-data/thumbs/`) 생성, macOS `sips` 사용 |
| `scripts/gen-learn-data.js` | 위 JSON → `src/data/learnData.generated.ts` 변환 (데이터 수정 후 재실행) |
| `scripts/gen-brand.js` | 앱 아이콘/스플래시 이미지 생성 (Chrome headless 사용, 결과는 `assets/`) |
| `src/components/AppSplash.tsx` | 앱 안 스플래시 화면 (로고 + "Plus one" + "for home fitness") |
| `scripts/gen-sounds.js` | 알림음(WAV) 생성 |
| `scripts/machine-check.ts` | 상태 머신 흐름 점검 (`npx tsx scripts/machine-check.ts`) |

## 운동 흐름

시작 → 3·2·1 → 템포마다 반복 +1 → 목표 도달(또는 "여기서 종료") → 휴식(+30초 / 건너뛰기) → 다음 세트 자동 시작 → 운동 하나가 끝나면 "다음 운동" 안내 후 [확인] → 마지막 운동 후 요약, 기록 저장.

## 메모

- 달력의 '불참'은 앱을 처음 사용한 날 이후의 지난 루틴 운동일만 표시합니다.
- 처음 실행하면 예시 루틴이 들어 있습니다. 루틴 탭에서 수정하거나 설정에서 초기화할 수 있습니다.
- 운동 이미지는 추후 추가 예정 (현재는 텍스트 선택지).
