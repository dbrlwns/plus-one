import type { ExerciseType } from '../data/exercises';
import type { RecordExercise, WorkoutRecord } from '../types';
import { toKey } from '../utils/date';

/**
 * 운동 진행 상태 머신 (UI와 무관한 순수 reducer).
 * 시간은 TICK(0.5초) 액션으로만 흐른다. 소리/진동은 state.cue 변화를 UI가 구독해서 처리한다.
 * 템포는 0.5초 단위로 설정할 수 있어서 틱을 반 초 단위로 쪼갰고, 초 단위 동작(카운트다운/휴식/시간형)은
 * half 플래그로 두 틱에 한 번만 처리한다.
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
export const DEFAULT_TEMPO = 3;
export const TEMPO_MIN = 0.5;
export const TEMPO_MAX = 10;
export const TEMPO_STEP = 0.5;

export interface WorkoutState {
  plan: PlanItem[];
  restSec: number;
  /** 운동별 템포(초). 없는 운동은 DEFAULT_TEMPO */
  tempos: Record<string, number>;
  /** 0.5초 틱 중 현재가 초의 두 번째 틱이면 1 */
  half: 0 | 1;
  phase: Phase;
  exIdx: number;
  setIdx: number;
  countdown: number;
  /** 현재 세트의 반복 수(시간형은 초) */
  count: number;
  /** 마지막 반복 이후 흐른 시간 (0.5초 단위) */
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
  | { type: 'RESET_SET' }
  /** 지금 하는 운동의 템포를 바꾼다 */
  | { type: 'SET_TEMPO'; tempoSec: number }
  | { type: 'ABORT' };

export function clampTempo(sec: number): number {
  const v = Math.round(sec / TEMPO_STEP) * TEMPO_STEP;
  return Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, v));
}

export function createInitialState(
  plan: PlanItem[],
  restSec: number,
  tempos: Record<string, number> = {},
): WorkoutState {
  return {
    plan,
    restSec,
    tempos,
    half: 0,
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
    { ...state, phase: 'countdown', countdown: COUNTDOWN_FROM, count: 0, tempoElapsed: 0, half: 0 },
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
  const next = { ...state, results, count: 0, tempoElapsed: 0, half: 0 as const };
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

/** 지금 하는 운동의 템포(초) */
export function currentTempo(state: WorkoutState): number {
  return state.tempos[state.plan[state.exIdx].exerciseId] ?? DEFAULT_TEMPO;
}

const tempoHalves = (state: WorkoutState) => Math.max(1, Math.round(currentTempo(state) * 2));

function tick(state: WorkoutState): WorkoutState {
  if (state.phase !== 'countdown' && state.phase !== 'active' && state.phase !== 'rest') return state;
  const second = state.half === 1;
  const base: WorkoutState = {
    ...state,
    half: second ? 0 : 1,
    elapsed: state.elapsed + (second ? 1 : 0),
  };

  switch (state.phase) {
    case 'countdown': {
      if (!second) return base;
      const c = base.countdown - 1;
      if (c <= 0) {
        return withCue({ ...base, phase: 'active', countdown: 0, count: 0, tempoElapsed: 0, half: 0 }, 'countdown');
      }
      return withCue({ ...base, countdown: c }, 'countdown');
    }
    case 'active': {
      const item = base.plan[base.exIdx];
      if (item.type === 'time') {
        if (!second) return base;
        const s = { ...base, count: base.count + 1 };
        return s.count >= item.target ? finishSet(s, s.count) : withCue(s, 'sec');
      }
      const te = base.tempoElapsed + 1;
      if (te < tempoHalves(base)) return { ...base, tempoElapsed: te };
      const s = { ...base, count: base.count + 1, tempoElapsed: 0 };
      return s.count >= item.target ? finishSet(s, s.count) : withCue(s, 'rep');
    }
    case 'rest': {
      if (!second) return base;
      const s = { ...base, restLeft: base.restLeft - 1 };
      return s.restLeft <= 0 ? endRest(s) : s;
    }
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
    case 'RESET_SET': {
      // 진행 중이거나 방금 끝난 세트를 처음부터 다시 한다 (방금 끝난 세트의 기록은 버린다)
      if (state.phase === 'ready' || state.phase === 'summary') return state;
      const results = state.results.map((r, i) => (i === state.exIdx ? r.slice(0, state.setIdx) : r));
      return startCountdown({ ...state, results, restLeft: 0 });
    }
    case 'SET_TEMPO': {
      const id = state.plan[state.exIdx].exerciseId;
      return { ...state, tempos: { ...state.tempos, [id]: clampTempo(action.tempoSec) } };
    }
    case 'ABORT': {
      if (state.phase === 'summary') return state;
      // 세트 도중에 끝내면 지금까지 한 반복 수도 기록한다
      let results = state.results;
      if (state.phase === 'active' && state.count > 0) {
        results = state.results.map((r) => r.slice());
        results[state.exIdx][state.setIdx] = state.count;
      }
      return { ...state, results, phase: 'summary' };
    }
  }
}

/**
 * 앱이 백그라운드로 갔을 때 예약할 "휴식 종료 임박" 알림 정보.
 * 휴식 중이고 남은 시간이 lead초보다 길 때만 있다 (seconds = 지금부터 알림까지 남은 초).
 */
export function restWarningInfo(state: WorkoutState, leadSec: number): { seconds: number; body: string } | null {
  if (state.phase !== 'rest' || state.restLeft <= leadSec) return null;
  const item = state.plan[state.exIdx];
  const next = state.plan[state.exIdx + 1];
  const body =
    isLastSet(state) && next ? `다음 운동: ${next.name}` : `${item.name} 세트 ${state.setIdx + 2} / ${item.sets} 준비하세요`;
  return { seconds: state.restLeft - leadSec, body };
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
