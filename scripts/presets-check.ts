import { ROUTINE_PRESETS, findUnknownExercises, presetToRoutine } from '../src/data/routinePresets';

const bad = findUnknownExercises();
console.log(bad.length === 0 ? 'OK: all preset exercises exist, every preset has 7 days' : 'PROBLEMS: ' + JSON.stringify(bad));
for (const p of ROUTINE_PRESETS) {
  const r = presetToRoutine(p);
  const ids = new Set(r.flatMap((d) => d.items.map((i) => i.id)));
  const total = r.reduce((n, d) => n + d.items.length, 0);
  console.log(`${p.name}: ${r.map((d) => d.part).join('/')} | ${total} items, unique ids=${ids.size === total}`);
}
