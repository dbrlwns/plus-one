export type Part = '상체' | '하체' | '밀기' | '당기기' | '전신' | '휴식';
export type Group = '밀기' | '당기기' | '하체' | '복근';
export type ExerciseType = 'reps' | 'time';

export interface Exercise {
  id: string;
  name: string;
  group: Group;
  type: ExerciseType;
  defaultSets: number;
  defaultTarget: number; // 반복 수 또는 초
}

export const PARTS: Part[] = ['상체', '하체', '밀기', '당기기', '전신', '휴식'];
export const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const reps = (id: string, name: string, group: Group, target = 10, sets = 3): Exercise => ({
  id,
  name,
  group,
  type: 'reps',
  defaultSets: sets,
  defaultTarget: target,
});

export const EXERCISES: Exercise[] = [
  // 밀기
  reps('push-up', '푸쉬업', '밀기', 15),
  reps('decline-push-up', '디클라인 푸쉬업', '밀기', 12),
  reps('diamond-push-up', '다이아몬드 푸쉬업', '밀기', 10),
  reps('dips', '딥스', '밀기', 10),
  reps('db-floor-press', '덤벨 플로어 프레스', '밀기', 12),
  reps('db-shoulder-press', '덤벨 숄더프레스', '밀기', 12),
  reps('side-lateral-raise', '사이드 레터럴 레이즈', '밀기', 15),
  reps('overhead-triceps-ext', '오버헤드 트라이셉스 익스텐션', '밀기', 12),
  // 당기기
  reps('pull-up', '풀업', '당기기', 6),
  reps('chin-up', '친업', '당기기', 6),
  reps('one-arm-db-row', '원암 덤벨 로우', '당기기', 12),
  reps('db-reverse-fly', '덤벨 리버스 플라이', '당기기', 15),
  reps('db-curl', '덤벨 컬', '당기기', 12),
  reps('hammer-curl', '해머 컬', '당기기', 12),
  {
    id: 'dead-hang',
    name: '매달려 버티기',
    group: '당기기',
    type: 'time',
    defaultSets: 3,
    defaultTarget: 30,
  },
  // 하체
  reps('db-squat', '덤벨 스쿼트', '하체', 15),
  reps('bulgarian-split-squat', '불가리안 스플릿 스쿼트', '하체', 10),
  reps('db-rdl', '덤벨 루마니안 데드리프트', '하체', 12),
  reps('single-leg-rdl', '싱글 레그 루마니안 데드리프트', '하체', 10),
  reps('reverse-lunge', '리버스 런지', '하체', 12),
  reps('glute-bridge', '글루트 브릿지', '하체', 15),
  reps('single-leg-glute-bridge', '싱글 레그 글루트 브릿지', '하체', 12),
  reps('calf-raise', '카프레이즈', '하체', 20),
  // 복근
  reps('leg-raise', '레그레이즈', '복근', 12),
  reps('hanging-knee-raise', '행잉 니레이즈', '복근', 12),
];

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

/** 부위별로 고를 수 있는 운동 그룹 (상체/전신은 여러 그룹에서 자유롭게 선택) */
export function groupsForPart(part: Part): Group[] {
  switch (part) {
    case '밀기':
      return ['밀기'];
    case '당기기':
      return ['당기기'];
    case '하체':
      return ['하체', '복근'];
    case '상체':
      return ['밀기', '당기기'];
    case '전신':
      return ['밀기', '당기기', '하체', '복근'];
    case '휴식':
      return [];
  }
}

export function exercisesForPart(part: Part): Exercise[] {
  const groups = groupsForPart(part);
  return EXERCISES.filter((e) => groups.includes(e.group));
}

export function unitOf(type: ExerciseType): string {
  return type === 'time' ? '초' : '회';
}
