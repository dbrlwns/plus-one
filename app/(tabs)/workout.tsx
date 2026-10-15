import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Stepper, Sub } from '../../src/components/ui';
import { WorkoutSession } from '../../src/components/WorkoutSession';
import { WEEKDAYS, exercisesForPart, getExercise, unitOf, type Exercise, type Part } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import { useTheme } from '../../src/theme';
import type { PlanItem } from '../../src/workout/machine';
import { weekdayIndex } from '../../src/utils/date';

type Mode = { kind: 'menu' } | { kind: 'free' } | { kind: 'session'; plan: PlanItem[]; key: number };

const FREE_PARTS: Part[] = ['상체', '하체', '밀기', '당기기', '전신'];

export default function WorkoutScreen() {
  const t = useTheme();
  const { routine } = useAppData();
  const [mode, setMode] = useState<Mode>({ kind: 'menu' });

  // 자유 운동 설정 화면 → 메뉴. 운동 중에는 WorkoutSession이 직접 처리하므로 여기서는 삼킨다.
  useBackPress(() => {
    if (mode.kind === 'menu') return false;
    if (mode.kind !== 'session') setMode({ kind: 'menu' });
    return true;
  });

  const todayIdx = weekdayIndex(new Date());
  const today = routine[todayIdx];
  const isRest = today.part === '휴식';
  const plan: PlanItem[] = isRest
    ? []
    : today.items.flatMap((it) => {
        const ex = getExercise(it.exerciseId);
        return ex ? [{ exerciseId: ex.id, name: ex.name, type: ex.type, sets: it.sets, target: it.target }] : [];
      });

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
          onStart={(item) => setMode({ kind: 'session', plan: [item], key: Date.now() })}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} style={{ flex: 1 }}>
        <Heading>운동</Heading>

        <Card style={{ gap: 6 }}>
          <Sub>오늘 ({WEEKDAYS[todayIdx]}요일) 루틴</Sub>
          <Body style={{ fontWeight: '800', fontSize: 20 }}>
            {today.part}
            {!isRest && plan.length > 0 ? ` · 운동 ${plan.length}개` : ''}
          </Body>
        </Card>

        {isRest ? (
          <Card style={{ gap: 6 }}>
            <Body style={{ fontWeight: '800', fontSize: 18 }}>오늘은 휴식일이에요 😴</Body>
            <Sub>그래도 운동하고 싶다면 아래의 "자유 운동 하기"를 눌러보세요.</Sub>
          </Card>
        ) : plan.length === 0 ? (
          <Card style={{ gap: 6 }}>
            <Body style={{ fontWeight: '800', fontSize: 18 }}>오늘 루틴에 운동이 없어요</Body>
            <Sub>루틴 탭에서 오늘 요일에 운동을 추가하거나, 아래의 "자유 운동 하기"를 눌러보세요.</Sub>
          </Card>
        ) : (
          plan.map((p, i) => (
            <Card key={i} style={styles.planRow}>
              <Text style={{ color: t.subtext, fontWeight: '800', width: 22 }}>{i + 1}</Text>
              <Text style={{ color: t.text, fontSize: 17, fontWeight: '700', flex: 1 }}>{p.name}</Text>
              <Sub>
                {p.sets}세트 × {p.target}
                {unitOf(p.type)}
              </Sub>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setMode({ kind: 'free' })}>
          <Text style={{ color: t.subtext, fontSize: 14, textAlign: 'center' }}>자유 운동 하기</Text>
        </Pressable>
        <Btn
          title="시작"
          size="xl"
          disabled={plan.length === 0}
          onPress={() => setMode({ kind: 'session', plan, key: Date.now() })}
        />
      </View>
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
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  bottom: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
