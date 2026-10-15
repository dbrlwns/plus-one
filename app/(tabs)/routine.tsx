import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Stepper, Sub } from '../../src/components/ui';
import { PARTS, WEEKDAYS, exercisesForPart, getExercise, unitOf, type Part } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import { newItemId } from '../../src/storage/storage';
import { useTheme } from '../../src/theme';
import type { RoutineDay } from '../../src/types';
import { weekdayIndex } from '../../src/utils/date';

export default function RoutineScreen() {
  const t = useTheme();
  const { routine, setRoutine } = useAppData();
  const [dayIdx, setDayIdx] = useState(() => weekdayIndex(new Date()));
  const [picking, setPicking] = useState(false);

  // 운동 추가 목록이 열려 있으면 뒤로가기로 먼저 닫는다
  useBackPress(() => {
    if (!picking) return false;
    setPicking(false);
    return true;
  });

  const day = routine[dayIdx];

  const patchDay = (patch: (d: RoutineDay) => RoutineDay) =>
    setRoutine((prev) => prev.map((d, i) => (i === dayIdx ? patch(d) : d)));

  const setPart = (part: Part) => {
    patchDay((d) => ({ ...d, part }));
    setPicking(false);
  };

  const addExercise = (exerciseId: string) => {
    const ex = getExercise(exerciseId);
    if (!ex) return;
    patchDay((d) => ({
      ...d,
      items: [...d.items, { id: newItemId(), exerciseId, sets: ex.defaultSets, target: ex.defaultTarget }],
    }));
  };

  const updateItem = (id: string, patch: { sets?: number; target?: number }) =>
    patchDay((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));

  const moveItem = (index: number, delta: number) =>
    patchDay((d) => {
      const items = d.items.slice();
      const j = index + delta;
      if (j < 0 || j >= items.length) return d;
      [items[index], items[j]] = [items[j], items[index]];
      return { ...d, items };
    });

  const removeItem = (id: string) => patchDay((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));

  const isRest = day.part === '휴식';
  const pool = exercisesForPart(day.part);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading>루틴</Heading>

        <View style={styles.row}>
          {WEEKDAYS.map((w, i) => (
            <View key={w} style={{ flex: 1 }}>
              <Chip compact label={w} sub={routine[i].part} selected={i === dayIdx} onPress={() => { setDayIdx(i); setPicking(false); }} />
            </View>
          ))}
        </View>

        <Card style={{ gap: 12 }}>
          <Body style={{ fontWeight: '700' }}>{WEEKDAYS[dayIdx]}요일 부위</Body>
          <View style={[styles.row, { flexWrap: 'wrap' }]}>
            {PARTS.map((p) => (
              <Chip key={p} label={p} selected={day.part === p} onPress={() => setPart(p)} />
            ))}
          </View>
        </Card>

        {isRest ? (
          <Card>
            <Sub>휴식일입니다. 부위를 고르면 운동을 추가할 수 있어요.</Sub>
          </Card>
        ) : (
          <>
            {day.items.length === 0 ? (
              <Card>
                <Sub>아직 운동이 없습니다. 아래에서 추가해 보세요.</Sub>
              </Card>
            ) : null}

            {day.items.map((item, i) => {
              const ex = getExercise(item.exerciseId);
              if (!ex) return null;
              const isTime = ex.type === 'time';
              return (
                <Card key={item.id} style={{ gap: 10 }}>
                  <View style={styles.titleRow}>
                    <Text style={{ color: t.text, fontSize: 17, fontWeight: '800', flex: 1 }}>
                      {i + 1}. {ex.name}
                    </Text>
                    <Btn title="↑" kind="secondary" size="sm" disabled={i === 0} onPress={() => moveItem(i, -1)} />
                    <Btn
                      title="↓"
                      kind="secondary"
                      size="sm"
                      disabled={i === day.items.length - 1}
                      onPress={() => moveItem(i, 1)}
                    />
                    <Btn title="삭제" kind="ghost" size="sm" onPress={() => removeItem(item.id)} />
                  </View>
                  <Stepper label="세트" value={item.sets} unit="세트" onChange={(sets) => updateItem(item.id, { sets })} />
                  <Stepper
                    label={isTime ? '시간' : '반복'}
                    value={item.target}
                    unit={unitOf(ex.type)}
                    step={isTime ? 5 : 1}
                    onChange={(target) => updateItem(item.id, { target })}
                  />
                </Card>
              );
            })}

            <Btn
              title={picking ? '닫기' : '+ 운동 추가'}
              kind={picking ? 'secondary' : 'primary'}
              onPress={() => setPicking((v) => !v)}
            />

            {picking ? (
              <Card style={{ gap: 8 }}>
                <Sub>{day.part} 운동 · 누르면 추가됩니다</Sub>
                <View style={[styles.row, { flexWrap: 'wrap' }]}>
                  {pool.map((ex) => (
                    <Chip
                      key={ex.id}
                      label={ex.name}
                      sub={ex.type === 'time' ? '시간형' : ex.group}
                      onPress={() => addExercise(ex.id)}
                    />
                  ))}
                </View>
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
