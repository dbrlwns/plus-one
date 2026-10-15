import type { ExerciseType } from '../data/exercises';
import type { RecordExercise, WorkoutRecord } from '../types';
import { toKey } from '../utils/date';

/**
 * 운동 진행 상태 머신 (UI와 무관한 순수 reducer).
 * 시간은 TICK(1초) 액션으로만 흐른다. 소리/진동은 state.cue 변화를 UI가 구독해서 처리한다.
 */

export interface PlanItem {
  exerciseId: string;
  name: string;
  type: ExerciseType;
  sets: number;
  target: number;
}

export type Phase = 'ready' | 'countdown' | 'active' | 'rest' | 'transition' | 'summary';
export type CueKind = 'countdown' | 'rep' | 'sec' | 'setDone' | 'restEnd' | 'finish';

export const COUNTDOWN_FROM = 3;

export interface WorkoutState {
  plan: PlanItem[];
  restSec: number;
  tempoSec: number;
  phase: Phase;
  exIdx: number;
  setIdx: number;
  countdown: number;
  /** 현재 세트의 반복 수(시간형은 초) */
  count: number;
  /** 마지막 반복 이후 흐른 초 */
  tempoElapsed: number;
  restLeft: number;
  /** results[운동][세트] = 실제 반복 수 */
  results: number[][];
  elapsed: number;
  startedAt: number | null;
  cue: { n: number; kind: CueKind } | null;
}

export type WorkoutAction =
  | { type: 'START'; now: number }
  | { type: 'TICK' }
  | { type: 'END_SET' }
  | { type: 'ADD_REST'; sec: number }
  | { type: 'SKIP_REST' }
  | { type: 'CONFIRM_NEXT' }
  | { type: 'ABORT' };

export function createInitialState(plan: PlanItem[], restSec: number, tempoSec: number): WorkoutState {
  return {
    plan,
    restSec,
    tempoSec,
    phase: 'ready',
    exIdx: 0,
    setIdx: 0,
    countdown: COUNTDOWN_FROM,
    count: 0,
    tempoElapsed: 0,
    restLeft: 0,
    results: plan.map(() => []),
    elapsed: 0,
    startedAt: null,
    cue: null,
  };
}

function withCue(state: WorkoutState, kind: CueKind): WorkoutState {
  return { ...state, cue: { n: (state.cue?.n ?? 0) + 1, kind } };
}

function startCountdown(state: WorkoutState): WorkoutState {
  return withCue(
    { ...state, phase: 'countdown', countdown: COUNTDOWN_FROM, count: 0, tempoElapsed: 0 },
    'countdown',
  );
}

export function isLastSet(state: WorkoutState): boolean {
  return state.setIdx >= state.plan[state.exIdx].sets - 1;
}

export function isLastExercise(state: WorkoutState): boolean {
  return state.exIdx >= state.plan.length - 1;
}

function finishSet(state: WorkoutState, actual: number): WorkoutState {
  const results = state.results.map((r) => r.slice());
  results[state.exIdx][state.setIdx] = actual;
  const next = { ...state, results, count: 0, tempoElapsed: 0 };
  if (isLastSet(state) && isLastExercise(state)) {
    return withCue({ ...next, phase: 'summary' }, 'finish');
  }
  return withCue({ ...next, phase: 'rest', restLeft: state.restSec }, 'setDone');
}

function endRest(state: WorkoutState): WorkoutState {
  if (isLastSet(state)) {
    // 운동 하나가 끝남 → 다음 운동 안내 후 [확인]을 눌러야 진행
    return withCue({ ...state, phase: 'transition', restLeft: 0 }, 'restEnd');
  }
  const next = { ...state, setIdx: state.setIdx + 1, restLeft: 0 };
  return withCue(startCountdown(next), 'restEnd');
}

function tick(state: WorkoutState): WorkoutState {
  switch (state.phase) {
    case 'countdown': {
      const s = { ...state, elapsed: state.elapsed + 1 };
      const c = s.countdown - 1;
      if (c <= 0) return withCue({ ...s, phase: 'active', countdown: 0, count: 0, tempoElapsed: 0 }, 'countdown');
      return withCue({ ...s, countdown: c }, 'countdown');
    }
    case 'active': {
      const item = state.plan[state.exIdx];
      let s = { ...state, elapsed: state.elapsed + 1 };
      if (item.type === 'time') {
        s = { ...s, count: s.count + 1 };
        return s.count >= item.target ? finishSet(s, s.count) : withCue(s, 'sec');
      }
      const te = s.tempoElapsed + 1;
      if (te < s.tempoSec) return { ...s, tempoElapsed: te };
      s = { ...s, count: s.count + 1, tempoElapsed: 0 };
      return s.count >= item.target ? finishSet(s, s.count) : withCue(s, 'rep');
    }
    case 'rest': {
      const s = { ...state, elapsed: state.elapsed + 1, restLeft: state.restLeft - 1 };
      return s.restLeft <= 0 ? endRest(s) : s;
    }
    default:
      return state;
  }
}

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START':
      if (state.phase !== 'ready') return state;
      return startCountdown({ ...state, startedAt: action.now });
    case 'TICK':
      return tick(state);
    case 'END_SET':
      return state.phase === 'active' ? finishSet(state, state.count) : state;
    case 'ADD_REST':
      return state.phase === 'rest' ? { ...state, restLeft: state.restLeft + action.sec } : state;
    case 'SKIP_REST':
      return state.phase === 'rest' ? endRest({ ...state, restLeft: 0 }) : state;
    case 'CONFIRM_NEXT':
      if (state.phase !== 'transition') return state;
      return startCountdown({ ...state, exIdx: state.exIdx + 1, setIdx: 0 });
    case 'ABORT':
      return state.phase === 'summary' ? state : { ...state, phase: 'summary' };
  }
}

/** 수행한 세트가 하나라도 있는 운동만 기록으로 만든다. 없으면 null. */
export function buildRecord(state: WorkoutState): WorkoutRecord | null {
  const exercises: RecordExercise[] = [];
  state.plan.forEach((item, i) => {
    const sets = state.results[i].filter((n) => typeof n === 'number');
    if (sets.length === 0) return;
    exercises.push({
      exerciseId: item.exerciseId,
      name: item.name,
      type: item.type,
      targetSets: item.sets,
      target: item.target,
      sets,
    });
  });
  if (exercises.length === 0 || state.startedAt === null) return null;
  return {
    id: String(state.startedAt),
    date: toKey(new Date(state.startedAt)),
    startedAt: state.startedAt,
    durationSec: state.elapsed,
    exercises,
  };
}
