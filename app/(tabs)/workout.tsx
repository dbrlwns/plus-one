import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Stepper, Sub } from '../../src/components/ui';
import { WorkoutSession } from '../../src/components/WorkoutSession';
import { WEEKDAYS, exercisesForPart, getExercise, unitOf, type Exercise, type Part } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import type { PlanItem } from '../../src/workout/machine';
import { weekdayIndex } from '../../src/utils/date';

type Mode =
  | { kind: 'menu' }
  | { kind: 'routineEmpty'; reason: 'rest' | 'noItems' }
  | { kind: 'free' }
  | { kind: 'session'; plan: PlanItem[]; key: number };

const FREE_PARTS: Part[] = ['상체', '하체', '밀기', '당기기', '전신'];

export default function WorkoutScreen() {
  const { routine } = useAppData();
  const [mode, setMode] = useState<Mode>({ kind: 'menu' });

  // 자유 운동 설정/안내 화면 → 메뉴. 운동 중에는 WorkoutSession이 직접 처리하므로 여기서는 삼킨다.
  useBackPress(() => {
    if (mode.kind === 'menu') return false;
    if (mode.kind !== 'session') setMode({ kind: 'menu' });
    return true;
  });

  const startRoutine = () => {
    const day = routine[weekdayIndex(new Date())];
    if (day.part === '휴식') return setMode({ kind: 'routineEmpty', reason: 'rest' });
    const plan: PlanItem[] = day.items.flatMap((it) => {
      const ex = getExercise(it.exerciseId);
      return ex ? [{ exerciseId: ex.id, name: ex.name, type: ex.type, sets: it.sets, target: it.target }] : [];
    });
    if (plan.length === 0) return setMode({ kind: 'routineEmpty', reason: 'noItems' });
    setMode({ kind: 'session', plan, key: Date.now() });
  };

  if (mode.kind === 'session') {
    return (
      <Screen>
        <WorkoutSession key={mode.key} plan={mode.plan} onExit={() => setMode({ kind: 'menu' })} />
      </Screen>
    );
  }

  if (mode.kind === 'free') {
    return (
      <Screen>
        <FreeSetup
          onBack={() => setMode({ kind: 'menu' })}
          onStart={(plan) => setMode({ kind: 'session', plan: [plan], key: Date.now() })}
        />
      </Screen>
    );
  }

  const today = routine[weekdayIndex(new Date())];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading>운동</Heading>

        {mode.kind === 'routineEmpty' ? (
          <Card style={{ gap: 12 }}>
            <Body style={{ fontWeight: '800', fontSize: 18 }}>
              {mode.reason === 'rest' ? '오늘은 휴식일이에요 😴' : '오늘 루틴에 운동이 없어요'}
            </Body>
            <Sub>
              {mode.reason === 'rest'
                ? '루틴상 오늘은 쉬는 날입니다. 그래도 운동하고 싶다면 자유 운동으로 전환할 수 있어요.'
                : '루틴 탭에서 오늘 요일에 운동을 추가하거나, 자유 운동을 해보세요.'}
            </Sub>
            <Btn title="자유 운동으로 전환" onPress={() => setMode({ kind: 'free' })} />
            <Btn title="돌아가기" kind="secondary" onPress={() => setMode({ kind: 'menu' })} />
          </Card>
        ) : (
          <>
            <Card style={{ gap: 6 }}>
              <Sub>오늘 ({WEEKDAYS[weekdayIndex(new Date())]}요일) 루틴</Sub>
              <Body style={{ fontWeight: '800', fontSize: 20 }}>
                {today.part}
                {today.part !== '휴식' ? ` · 운동 ${today.items.length}개` : ''}
              </Body>
            </Card>
            <Btn title="루틴으로 하기" size="xl" onPress={startRoutine} />
            <Btn title="자유 운동" kind="secondary" size="xl" onPress={() => setMode({ kind: 'free' })} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function FreeSetup({ onBack, onStart }: { onBack: () => void; onStart: (plan: PlanItem) => void }) {
  const [part, setPart] = useState<Part>('전신');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState(3);
  const [target, setTarget] = useState(10);

  const pool = useMemo(() => exercisesForPart(part), [part]);

  const pick = (ex: Exercise) => {
    setExercise(ex);
    setSets(ex.defaultSets);
    setTarget(ex.defaultTarget);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Heading>자유 운동</Heading>
        <Btn title="뒤로" kind="ghost" size="sm" onPress={onBack} />
      </View>

      <Card style={{ gap: 10 }}>
        <Body style={{ fontWeight: '700' }}>1. 부위</Body>
        <View style={styles.wrapRow}>
          {FREE_PARTS.map((p) => (
            <Chip
              key={p}
              label={p}
              selected={p === part}
              onPress={() => {
                setPart(p);
                setExercise(null);
              }}
            />
          ))}
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <Body style={{ fontWeight: '700' }}>2. 운동</Body>
        <View style={styles.wrapRow}>
          {pool.map((ex) => (
            <Chip
              key={ex.id}
              label={ex.name}
              sub={ex.type === 'time' ? '시간형' : undefined}
              selected={exercise?.id === ex.id}
              onPress={() => pick(ex)}
            />
          ))}
        </View>
      </Card>

      {exercise ? (
        <Card style={{ gap: 12 }}>
          <Body style={{ fontWeight: '700' }}>3. {exercise.name}</Body>
          <Stepper label="세트" value={sets} unit="세트" onChange={setSets} />
          <Stepper
            label={exercise.type === 'time' ? '시간' : '반복'}
            value={target}
            unit={unitOf(exercise.type)}
            step={exercise.type === 'time' ? 5 : 1}
            onChange={setTarget}
          />
        </Card>
      ) : null}

      <Btn
        title="운동 시작"
        size="xl"
        disabled={!exercise}
        onPress={() =>
          exercise &&
          onStart({ exerciseId: exercise.id, name: exercise.name, type: exercise.type, sets, target })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
