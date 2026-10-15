import { createInitialState, workoutReducer, buildRecord, type PlanItem } from '../src/workout/machine';

const plan: PlanItem[] = [
  { exerciseId: 'a', name: 'A', type: 'reps', sets: 2, target: 2 },
  { exerciseId: 'b', name: 'B', type: 'time', sets: 1, target: 3 },
];
let s = createInitialState(plan, 2, 3);
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
s = createInitialState(plan2, 2, 3);
s = workoutReducer(s, { type: 'START', now: 1 }); tick(3);
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 0.5 });
tick(2); log('tempo 0.5s, 2s -> count 4');
s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 1.5 }); tick(3); log('tempo 1.5s, +3s -> count 6');
s = workoutReducer(s, { type: 'RESET_SET' }); log('reset during set');
tick(3); s = workoutReducer(s, { type: 'SET_TEMPO', tempoSec: 0.5 }); tick(5); log('set 1 done -> rest');
s = workoutReducer(s, { type: 'RESET_SET' }); log('reset from rest (redo set 1)');
console.log('results after reset:', JSON.stringify(s.results));
