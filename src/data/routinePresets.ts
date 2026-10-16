import type { Part } from './exercises';
import { getExercise } from './exercises';
import { newItemId } from '../storage/storage';
import type { Routine } from '../types';

/** [운동 id, 세트 수, 목표(반복 수 또는 초)] */
type Entry = [exerciseId: string, sets: number, target: number];
type PresetDay = { part: Part; items: Entry[] };

export interface RoutinePreset {
  id: string;
  name: string;
  summary: string;
  description: string;
  /** 월~일 순서 7개 */
  days: PresetDay[];
}

const REST: PresetDay = { part: '휴식', items: [] };

// 전신 A/B (입문·전신 프리셋에서 같이 쓴다)
const FULL_A: Entry[] = [
  ['db-squat', 3, 15],
  ['push-up', 3, 12],
  ['one-arm-db-row', 3, 12],
  ['db-rdl', 3, 12],
  ['db-shoulder-press', 3, 12],
  ['leg-raise', 3, 12],
];
const FULL_B: Entry[] = [
  ['bulgarian-split-squat', 3, 10],
  ['db-floor-press', 3, 12],
  ['db-reverse-fly', 3, 15],
  ['glute-bridge', 3, 15],
  ['side-lateral-raise', 3, 15],
  ['hanging-knee-raise', 3, 12],
];

export const ROUTINE_PRESETS: RoutinePreset[] = [
  {
    id: 'developer',
    name: '개발자 루틴',
    summary: '주 5일 · 부위당 2세트 · 덤벨과 철봉',
    description:
      '앉아서 일하는 사람을 위한 상체·하체·당기기·밀기 분할이에요. 부위당 2세트로 짧게 끝나요. "최대 반복" 운동(푸쉬업, 풀업 등)은 목표를 넉넉히 잡아 두었으니 한계에 오면 "여기서 종료"를 누르세요.',
    days: [
      {
        part: '상체',
        items: [
          ['push-up', 2, 20],
          ['one-arm-db-row', 2, 15],
          ['db-shoulder-press', 2, 15],
          ['side-lateral-raise', 2, 20],
          ['db-curl', 2, 15],
          ['overhead-triceps-ext', 2, 15],
        ],
      },
      {
        part: '하체',
        items: [
          ['db-squat', 2, 20],
          ['bulgarian-split-squat', 2, 12],
          ['db-rdl', 2, 15],
          ['glute-bridge', 2, 20],
          ['calf-raise', 2, 20],
        ],
      },
      {
        part: '당기기',
        items: [
          ['pull-up', 2, 8],
          ['chin-up', 2, 8],
          ['one-arm-db-row', 2, 15],
          ['db-reverse-fly', 2, 15],
          ['hammer-curl', 2, 15],
          ['hanging-knee-raise', 2, 15],
        ],
      },
      {
        part: '밀기',
        items: [
          ['decline-push-up', 2, 20],
          ['db-floor-press', 2, 20],
          ['db-shoulder-press', 2, 15],
          ['side-lateral-raise', 2, 20],
          ['diamond-push-up', 2, 15],
        ],
      },
      {
        part: '하체',
        items: [
          ['single-leg-rdl', 2, 12],
          ['reverse-lunge', 2, 12],
          ['single-leg-glute-bridge', 2, 15],
          ['db-squat', 2, 20],
          ['calf-raise', 2, 20],
        ],
      },
      REST,
      REST,
    ],
  },
  {
    id: 'bodyweight-split',
    name: '맨몸 위주 3분할',
    summary: '주 3일 · 하루 쉬고 하루 운동',
    description: '밀기·당기기·하체를 하루씩 번갈아 해요. 철봉과 의자만 있으면 돼서 장비 부담이 적어요.',
    days: [
      {
        part: '밀기',
        items: [
          ['push-up', 3, 15],
          ['decline-push-up', 3, 12],
          ['diamond-push-up', 3, 10],
          ['dips', 3, 10],
        ],
      },
      REST,
      {
        part: '당기기',
        items: [
          ['pull-up', 3, 6],
          ['chin-up', 3, 6],
          ['dead-hang', 3, 30],
          ['hanging-knee-raise', 3, 12],
        ],
      },
      REST,
      {
        part: '하체',
        items: [
          ['bulgarian-split-squat', 3, 10],
          ['reverse-lunge', 3, 12],
          ['glute-bridge', 3, 15],
          ['single-leg-glute-bridge', 3, 12],
          ['calf-raise', 3, 20],
        ],
      },
      REST,
      REST,
    ],
  },
  {
    id: 'upper-lower',
    name: '상하체 분할',
    summary: '주 4일 · 상체/하체를 번갈아',
    description: '상체와 하체를 이틀씩 번갈아 해서 같은 부위를 주 2번 자극해요. 운동량이 넉넉한 중급자용이에요.',
    days: [
      {
        part: '상체',
        items: [
          ['push-up', 3, 15],
          ['one-arm-db-row', 3, 12],
          ['db-shoulder-press', 3, 12],
          ['db-curl', 3, 12],
        ],
      },
      {
        part: '하체',
        items: [
          ['db-squat', 3, 15],
          ['db-rdl', 3, 12],
          ['reverse-lunge', 3, 12],
          ['calf-raise', 3, 20],
        ],
      },
      REST,
      {
        part: '상체',
        items: [
          ['pull-up', 3, 6],
          ['dips', 3, 10],
          ['side-lateral-raise', 3, 15],
          ['overhead-triceps-ext', 3, 12],
        ],
      },
      {
        part: '하체',
        items: [
          ['bulgarian-split-squat', 3, 10],
          ['single-leg-rdl', 3, 10],
          ['glute-bridge', 3, 15],
          ['leg-raise', 3, 12],
        ],
      },
      REST,
      REST,
    ],
  },
  {
    id: 'full-body-3',
    name: '전신 주 3일',
    summary: '주 3일 · 월·수·금 전신 A/B',
    description: '월·수·금에 전신 운동을 해요. A와 B 두 가지 구성을 번갈아 해서 지루하지 않아요.',
    days: [
      { part: '전신', items: FULL_A },
      REST,
      { part: '전신', items: FULL_B },
      REST,
      { part: '전신', items: FULL_A },
      REST,
      REST,
    ],
  },
  {
    id: 'beginner',
    name: '입문자 가볍게',
    summary: '주 3일 · 부위당 2세트 · 낮은 횟수',
    description: '처음 시작하는 사람을 위한 가벼운 전신 루틴이에요. 세트 수와 횟수를 낮춰서 부담 없이 습관부터 만들 수 있어요.',
    days: [
      {
        part: '전신',
        items: [
          ['db-squat', 2, 10],
          ['push-up', 2, 8],
          ['one-arm-db-row', 2, 10],
          ['glute-bridge', 2, 12],
          ['db-shoulder-press', 2, 10],
          ['leg-raise', 2, 8],
        ],
      },
      REST,
      {
        part: '전신',
        items: [
          ['db-squat', 2, 10],
          ['push-up', 2, 8],
          ['one-arm-db-row', 2, 10],
          ['glute-bridge', 2, 12],
          ['db-shoulder-press', 2, 10],
          ['leg-raise', 2, 8],
        ],
      },
      REST,
      {
        part: '전신',
        items: [
          ['db-squat', 2, 10],
          ['push-up', 2, 8],
          ['one-arm-db-row', 2, 10],
          ['glute-bridge', 2, 12],
          ['db-shoulder-press', 2, 10],
          ['leg-raise', 2, 8],
        ],
      },
      REST,
      REST,
    ],
  },
];

/** 프리셋을 실제 루틴(7일)으로 만든다. 운동 카드 id는 새로 발급한다. */
export function presetToRoutine(preset: RoutinePreset): Routine {
  return preset.days.map((day) => ({
    part: day.part,
    items: day.items.map(([exerciseId, sets, target]) => ({
      id: newItemId(),
      exerciseId,
      sets,
      target,
    })),
  }));
}

/** 프리셋에 쓰인 운동 id가 모두 운동 DB에 있는지 확인한다 (없는 id 목록을 돌려준다). */
export function findUnknownExercises(): string[] {
  const bad = new Set<string>();
  for (const p of ROUTINE_PRESETS) {
    if (p.days.length !== 7) bad.add(`${p.id}: days=${p.days.length}`);
    for (const d of p.days) for (const [id] of d.items) if (!getExercise(id)) bad.add(`${p.id}: ${id}`);
  }
  return [...bad];
}
