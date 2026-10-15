import type { ExerciseType, Part } from './data/exercises';

export interface Settings {
  name: string;
  restSec: number;
  /** 운동별 반복 템포(초). 없으면 기본값(3초). 키는 exerciseId. */
  tempos: Record<string, number>;
  /** 앱을 처음 사용한 날(YYYY-MM-DD). 이 날 이전은 '불참'으로 표시하지 않는다. */
  startDate: string;
}

export interface RoutineItem {
  id: string;
  exerciseId: string;
  sets: number;
  target: number; // 반복 수 또는 초
}

export interface RoutineDay {
  part: Part;
  items: RoutineItem[];
}

/** 인덱스 0 = 월 ... 6 = 일 */
export type Routine = RoutineDay[];

export interface RecordExercise {
  exerciseId: string;
  name: string;
  type: ExerciseType;
  targetSets: number;
  target: number;
  /** 세트별 실제 반복 수(시간형은 초) */
  sets: number[];
}

export interface WorkoutRecord {
  id: string;
  date: string; // YYYY-MM-DD
  startedAt: number;
  durationSec: number;
  exercises: RecordExercise[];
}
