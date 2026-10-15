import { createInitialState, workoutReducer, buildRecord, type PlanItem } from '../src/workout/machine';

const plan: PlanItem[] = [
  { exerciseId: 'a', name: 'A', type: 'reps', sets: 2, target: 2 },
  { exerciseId: 'b', name: 'B', type: 'time', sets: 1, target: 3 },
];
let s = createInitialState(plan, 2, 3);
const tick = (n = 1) => { for (let i = 0; i < n; i++) s = workoutReducer(s, { type: 'TICK' }); };
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
