import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXERCISES, getExercise } from '../data/exercises';
import type { Part } from '../data/exercises';
import type { Routine, RoutineDay, Settings, WorkoutRecord } from '../types';
import { todayKey } from '../utils/date';

const KEYS = {
  settings: 'plusone/settings',
  routine: 'plusone/routine',
  records: 'plusone/records',
  notes: 'plusone/notes',
} as const;

export function defaultSettings(): Settings {
  return { name: '', restSec: 90, theme: 'system', tempos: {}, startDate: todayKey() };
}

let itemSeq = 0;
export function newItemId(): string {
  itemSeq += 1;
  return `${Date.now().toString(36)}-${itemSeq}`;
}

function day(part: Part, exerciseIds: string[]): RoutineDay {
  return {
    part,
    items: exerciseIds.map((exerciseId) => {
      const ex = getExercise(exerciseId) ?? EXERCISES[0];
      return { id: newItemId(), exerciseId: ex.id, sets: ex.defaultSets, target: ex.defaultTarget };
    }),
  };
}

/** 처음 실행했을 때 보여줄 예시 루틴 (루틴 탭에서 자유롭게 수정 가능) */
export function defaultRoutine(): Routine {
  return [
    day('밀기', ['push-up', 'dips', 'db-shoulder-press', 'overhead-triceps-ext']),
    day('당기기', ['pull-up', 'one-arm-db-row', 'db-curl', 'dead-hang']),
    day('하체', ['db-squat', 'reverse-lunge', 'glute-bridge', 'calf-raise']),
    day('휴식', []),
    day('상체', ['push-up', 'chin-up', 'side-lateral-raise', 'hammer-curl']),
    day('전신', ['db-squat', 'push-up', 'db-rdl', 'leg-raise']),
    day('휴식', []),
  ];
}

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패는 프로토타입에서는 무시한다.
  }
}

export async function loadSettings(): Promise<Settings> {
  const saved = await readJson<Partial<Settings>>(KEYS.settings);
  return { ...defaultSettings(), ...saved };
}
export const saveSettings = (s: Settings) => writeJson(KEYS.settings, s);

export async function loadRoutine(): Promise<Routine> {
  const saved = await readJson<Routine>(KEYS.routine);
  return saved && saved.length === 7 ? saved : defaultRoutine();
}
export const saveRoutine = (r: Routine) => writeJson(KEYS.routine, r);

export async function loadRecords(): Promise<WorkoutRecord[]> {
  return (await readJson<WorkoutRecord[]>(KEYS.records)) ?? [];
}
export const saveRecords = (r: WorkoutRecord[]) => writeJson(KEYS.records, r);

/** 날짜(YYYY-MM-DD) → 그날의 메모 */
export type Notes = Record<string, string>;

export async function loadNotes(): Promise<Notes> {
  return (await readJson<Notes>(KEYS.notes)) ?? {};
}
export const saveNotes = (n: Notes) => writeJson(KEYS.notes, n);

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch {
    // ignore
  }
}
