import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Stepper, Sub } from '../../src/components/ui';
import { PARTS, WEEKDAYS, exercisesForPart, getExercise, unitOf, type Part } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import { newItemId } from '../../src/storage/storage';
import { useTheme } from '../../src/theme';
import type { RoutineDay } from '../../src/types';
import { weekdayIndex } from '../../src/utils/date';

export default function RoutineScreen() {
  const { routine } = useAppData();
  const [dayIdx, setDayIdx] = useState(() => weekdayIndex(new Date()));
  const [picking, setPicking] = useState(false);
  const [pageWidth, setPageWidth] = useState(0);
  const pager = useRef<ScrollView>(null);
  const placed = useRef(false);

  // 운동 추가 목록이 열려 있으면 뒤로가기로 먼저 닫는다
  useBackPress(() => {
    if (!picking) return false;
    setPicking(false);
    return true;
  });

  // 처음에 오늘 요일 페이지로 이동
  useEffect(() => {
    if (pageWidth > 0 && !placed.current) {
      placed.current = true;
      pager.current?.scrollTo({ x: dayIdx * pageWidth, animated: false });
    }
  }, [pageWidth, dayIdx]);

  const goTo = (i: number) => {
    setDayIdx(i);
    setPicking(false);
    pager.current?.scrollTo({ x: i * pageWidth, animated: false });
  };

  // 쓸어 넘기는 중에 절반을 넘으면 그 요일로 바뀐다
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) return;
    const i = Math.min(6, Math.max(0, Math.round(e.nativeEvent.contentOffset.x / pageWidth)));
    if (i !== dayIdx) {
      setDayIdx(i);
      setPicking(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Heading>루틴</Heading>
        <View style={styles.row}>
          {WEEKDAYS.map((w, i) => (
            <View key={w} style={{ flex: 1 }}>
              <Chip compact label={w} sub={routine[i].part} selected={i === dayIdx} onPress={() => goTo(i)} />
            </View>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }} onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}>
        {pageWidth > 0 ? (
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
          >
            {WEEKDAYS.map((_, i) => (
              <View key={i} style={{ width: pageWidth }}>
                <DayPage
                  dayIdx={i}
                  picking={picking && i === dayIdx}
                  onTogglePicking={() => setPicking((v) => !v)}
                  onClosePicking={() => setPicking(false)}
                />
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </Screen>
  );
}

function DayPage({
  dayIdx,
  picking,
  onTogglePicking,
  onClosePicking,
}: {
  dayIdx: number;
  picking: boolean;
  onTogglePicking: () => void;
  onClosePicking: () => void;
}) {
  const t = useTheme();
  const { routine, setRoutine } = useAppData();
  const day = routine[dayIdx];

  const patchDay = (patch: (d: RoutineDay) => RoutineDay) =>
    setRoutine((prev) => prev.map((d, i) => (i === dayIdx ? patch(d) : d)));

  const setPart = (part: Part) => {
    patchDay((d) => ({ ...d, part }));
    onClosePicking();
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
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={{ gap: 12 }}>
        <Body style={{ fontWeight: '700' }}>{WEEKDAYS[dayIdx]}요일 부위</Body>
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {PARTS.map((p) => (
            <Chip key={p} label={p} selected={day.part === p} onPress={() => setPart(p)} />
          ))}
        </View>
        <Sub>좌우로 쓸어 넘겨서 다른 요일을 볼 수 있어요.</Sub>
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
            onPress={onTogglePicking}
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
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  content: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
