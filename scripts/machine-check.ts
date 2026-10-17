import { createInitialState, workoutReducer, buildRecord, restWarningInfo, type PlanItem } from '../src/workout/machine';

const plan: PlanItem[] = [
  { exerciseId: 'a', name: 'A', type: 'reps', sets: 2, target: 2 },
  { exerciseId: 'b', name: 'B', type: 'time', sets: 1, target: 3 },
];
let s = createInitialState(plan, 2);
// 1틱 = 0.5초, 아래 tick(n)은 n초
const tick = (n = 1) => { for (let i = 0; i < n * 2; i++) s = workoutReducer(s, { type: 'TICK' }); };
const log = (m: string) => console.log(m.padEnd(22), s.phase, `ex${s.exIdx} set${s.setIdx} count=${s.count} rest=${s.restLeft} el=${s.elapsed}`);

s = workoutReducer(s, { type: 'START', now: 1_700_000_000_000 }); log('start');
tick(3); log('countdown done');
tick(6); log('2 reps @3s tempo');       // set 1 done -> rest
tick(2); log('rest over');              // -> countdown set 2
tick(3 + 6); log('set 2 done');         // -> rest
tick(2); log('rest over (ex end)');     // -> transition
tick(5); log('ticks ignored');
s = workoutReducer(s, { type: 'CONFIRM_NEXT' }); log('confirm');
tick(3 + 3); log('time ex done');       // last set last ex -> summary
console.log(JSON.stringify(s.results), JSON.stringify(buildRecord(s)));

// --- 0.5초 템포, 템포 변경, 세트 초기화 ---
const plan2: PlanItem[] = [{ exerciseId: 'a', name: 'A', type: 'reps', sets: 2, target: 10 }];
s = createInitialState(plan2, 2);
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3);
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 0.5 });
tick(2); log('tempo 0.5s, 2s -> count 4');
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 1.5 }); tick(3); log('tempo 1.5s, +3s -> count 6');
s = workoutReducer(s, { type: 'RESET_SET' }); log('reset during set');
tick(3); s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 0.5 }); tick(5); log('set 1 done -> rest');
s = workoutReducer(s, { type: 'RESET_SET' }); log('reset from rest (redo set 1)');
console.log('results after reset:', JSON.stringify(s.results));

// --- 운동별 템포 ---
const plan3: PlanItem[] = [
  { exerciseId: 'a', name: 'A', type: 'reps', sets: 1, target: 2 },
  { exerciseId: 'b', name: 'B', type: 'reps', sets: 1, target: 2 },
];
s = createInitialState(plan3, 1, { b: 1 });
console.log('initial tempos', JSON.stringify(s.tempos));
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3);
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 1 }); // A만 1초로
console.log('after SET_TEMPO on A', JSON.stringify(s.tempos));
tick(2); log('A done in 2s (tempo 1s)');          // rest
tick(1); log('rest over -> transition');
s = workoutReducer(s, { type: 'CONFIRM_NEXT' }); tick(3);
tick(1); log('B @1s tempo, 1s -> count 1');
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 2 }); console.log('after SET_TEMPO on B', JSON.stringify(s.tempos));

// --- 세트 도중 종료 시 진행 중이던 반복 수도 기록 ---
s = createInitialState(plan3, 1);
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3); tick(6); // 3초 템포 → 2회
s = workoutReducer(s, { type: 'ABORT' });
console.log('abort mid-set results:', JSON.stringify(s.results), s.phase);

// --- 백그라운드 알림 예약 정보 (휴식 90초 설정, 10초 전 알림) ---
const planN: PlanItem[] = [
  { exerciseId: 'a', name: 'A', type: 'reps', sets: 2, target: 1 },
  { exerciseId: 'b', name: 'B', type: 'reps', sets: 1, target: 1 },
];
s = createInitialState(planN, 90);
console.log('not resting ->', JSON.stringify(restWarningInfo(s, 10)));
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3); tick(3);   // 1회 = 3초 → 세트 끝 → 휴식
console.log('rest start (90s) ->', JSON.stringify(restWarningInfo(s, 10)));
tick(30); console.log('rest 60s left ->', JSON.stringify(restWarningInfo(s, 10)));
tick(52); console.log('rest 8s left ->', JSON.stringify(restWarningInfo(s, 10)));

// --- 일시정지/재개 ---
s = createInitialState(plan3, 1);
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3);          // active
tick(3);                                                           // 1회
const before = JSON.stringify([s.count, s.elapsed, s.tempoElapsed]);
s = workoutReducer(s, { type: 'PAUSE' });
tick(10); s = workoutReducer(s, { type: 'END_SET' });               // 멈춘 동안 시간/버튼 무시
console.log('paused: time frozen =', before === JSON.stringify([s.count, s.elapsed, s.tempoElapsed]), '| phase', s.phase, '| paused', s.paused);
s = workoutReducer(s, { type: 'RESUME' }); tick(3);
console.log('resumed: set finished after 3s more -> phase', s.phase, 'results', JSON.stringify(s.results));
s = workoutReducer(s, { type: 'PAUSE' }); s = workoutReducer(s, { type: 'RESET_SET' });
console.log('reset while paused -> paused', s.paused, 'phase', s.phase);
s = createInitialState(plan3, 1);
console.log('pause before start ignored:', workoutReducer(s, { type: 'PAUSE' }).paused === false);
