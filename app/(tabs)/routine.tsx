import { memo, useCallback, useEffect, useRef, useState } from 'react';
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
import type { Routine, RoutineDay, RoutineItem } from '../../src/types';
import { weekdayIndex } from '../../src/utils/date';

export default function RoutineScreen() {
  const { routine, setRoutine } = useAppData();
  const [dayIdx, setDayIdx] = useState(() => weekdayIndex(new Date()));
  const [picking, setPicking] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const pager = useRef<ScrollView>(null);
  const placed = useRef(false);
  const pageWidth = size.width;

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

  const togglePicking = useCallback(() => setPicking((v) => !v), []);
  const closePicking = useCallback(() => setPicking(false), []);

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

      <View
        style={{ flex: 1 }}
        onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
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
              // 페이지 높이를 고정해야 안쪽 세로 스크롤이 제대로 동작한다
              <View key={i} style={{ width: pageWidth, height: size.height }}>
                <DayPage
                  dayIdx={i}
                  day={routine[i]}
                  setRoutine={setRoutine}
                  picking={picking && i === dayIdx}
                  onTogglePicking={togglePicking}
                  onClosePicking={closePicking}
                />
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </Screen>
  );
}

/**
 * 한 요일 페이지. day 객체가 바뀐 요일만 다시 그려진다 (memo).
 * 버튼 하나를 눌러도 7개 요일 전체가 다시 그려지면 렉이 심해지기 때문이다.
 */
const DayPage = memo(function DayPage({
  dayIdx,
  day,
  setRoutine,
  picking,
  onTogglePicking,
  onClosePicking,
}: {
  dayIdx: number;
  day: RoutineDay;
  /** context를 직접 구독하면 memo가 소용없어서(값이 바뀔 때마다 전부 다시 그려짐) 부모에서 받는다 */
  setRoutine: (next: Routine | ((prev: Routine) => Routine)) => void;
  picking: boolean;
  onTogglePicking: () => void;
  onClosePicking: () => void;
}) {

  const patchDay = useCallback(
    (patch: (d: RoutineDay) => RoutineDay) =>
      setRoutine((prev) => prev.map((d, i) => (i === dayIdx ? patch(d) : d))),
    [dayIdx, setRoutine],
  );

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

  const updateItem = useCallback(
    (id: string, patch: { sets?: number; target?: number }) =>
      patchDay((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
    [patchDay],
  );

  const moveItem = useCallback(
    (index: number, delta: number) =>
      patchDay((d) => {
        const items = d.items.slice();
        const j = index + delta;
        if (j < 0 || j >= items.length) return d;
        [items[index], items[j]] = [items[j], items[index]];
        return { ...d, items };
      }),
    [patchDay],
  );

  const removeItem = useCallback(
    (id: string) => patchDay((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) })),
    [patchDay],
  );

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

          {day.items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              index={i}
              isLast={i === day.items.length - 1}
              onUpdate={updateItem}
              onMove={moveItem}
              onRemove={removeItem}
            />
          ))}

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
});

/** 운동 카드 하나. item이 그대로면(다른 카드를 눌렀을 때) 다시 그려지지 않는다. */
const ItemCard = memo(function ItemCard({
  item,
  index,
  isLast,
  onUpdate,
  onMove,
  onRemove,
}: {
  item: RoutineItem;
  index: number;
  isLast: boolean;
  onUpdate: (id: string, patch: { sets?: number; target?: number }) => void;
  onMove: (index: number, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const t = useTheme();
  const ex = getExercise(item.exerciseId);
  if (!ex) return null;
  const isTime = ex.type === 'time';

  return (
    <Card style={{ gap: 10 }}>
      <View style={styles.titleRow}>
        <Text style={{ color: t.text, fontSize: 17, fontWeight: '800', flex: 1 }}>
          {index + 1}. {ex.name}
        </Text>
        <Btn title="↑" kind="secondary" size="sm" disabled={index === 0} onPress={() => onMove(index, -1)} />
        <Btn title="↓" kind="secondary" size="sm" disabled={isLast} onPress={() => onMove(index, 1)} />
        <Btn title="삭제" kind="ghost" size="sm" onPress={() => onRemove(item.id)} />
      </View>
      <Stepper label="세트" value={item.sets} unit="세트" onChange={(sets) => onUpdate(item.id, { sets })} />
      <Stepper
        label={isTime ? '시간' : '반복'}
        value={item.target}
        unit={unitOf(ex.type)}
        step={isTime ? 5 : 1}
        onChange={(target) => onUpdate(item.id, { target })}
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  content: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
