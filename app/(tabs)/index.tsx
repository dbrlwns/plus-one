import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Btn, Card, Heading, Screen, Sub } from '../../src/components/ui';
import { unitOf } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import { useTheme } from '../../src/theme';
import type { Routine, WorkoutRecord } from '../../src/types';
import { formatDuration, formatKeyKorean, fromKey, toKey, todayKey, weekdayIndex } from '../../src/utils/date';

type Status = 'done' | 'missed' | 'rest' | 'none';

const STATUS_LABEL: Record<Status, string> = {
  done: '참여',
  missed: '불참',
  rest: '휴식',
  none: '',
};

function statusOf(key: string, routine: Routine, byDate: Map<string, WorkoutRecord[]>, today: string, startKey: string): Status {
  if (byDate.has(key)) return 'done';
  if (routine[weekdayIndex(fromKey(key))].part === '휴식') return 'rest';
  // 오늘 이후(아직 끝나지 않은 날)와 앱 사용 전 날짜는 표시하지 않는다
  if (key >= today || key < startKey) return 'none';
  return 'missed';
}

export default function CalendarScreen() {
  const t = useTheme();
  const router = useRouter();
  useBackPress();
  const { routine, records, settings } = useAppData();
  const today = todayKey();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(today);

  const byDate = useMemo(() => {
    const m = new Map<string, WorkoutRecord[]>();
    for (const r of records) m.set(r.date, [...(m.get(r.date) ?? []), r]);
    return m;
  }, [records]);

  const colorOf = (s: Status) =>
    s === 'done' ? t.success : s === 'missed' ? t.danger : s === 'rest' ? t.rest : 'transparent';

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = weekdayIndex(new Date(year, month, 1));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toKey(new Date(year, month, i + 1))),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const move = (delta: number) => setCursor(new Date(year, month + delta, 1));

  // 좌우로 쓸어 넘기면 다음/이전 달 (세로 스크롤과 겹치지 않게 가로 움직임이 확실할 때만)
  const moveRef = useRef(move);
  moveRef.current = move;
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) < 50) return;
        moveRef.current(g.dx < 0 ? 1 : -1);
      },
    }),
  ).current;

  const selStatus = statusOf(selected, routine, byDate, today, settings.startDate);
  const selRecords = byDate.get(selected) ?? [];
  const selDay = routine[weekdayIndex(fromKey(selected))];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Heading>{settings.name ? `${settings.name}님의 기록` : '운동 기록'}</Heading>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="설정"
            hitSlop={10}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={26} color={t.text} />
          </Pressable>
        </View>

        <View {...swipe.panHandlers}>
        <Card>
          <View style={styles.monthRow}>
            <Btn title="‹" kind="secondary" size="sm" onPress={() => move(-1)} />
            <Body style={{ fontWeight: '800', fontSize: 18 }}>
              {year}년 {month + 1}월
            </Body>
            <Btn title="›" kind="secondary" size="sm" onPress={() => move(1)} />
          </View>

          <View style={styles.weekRow}>
            {['월', '화', '수', '목', '금', '토', '일'].map((w) => (
              <Text key={w} style={[styles.weekHead, { color: t.subtext }]}>
                {w}
              </Text>
            ))}
          </View>

          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((key, di) => {
                if (!key) return <View key={di} style={styles.cell} />;
                const s = statusOf(key, routine, byDate, today, settings.startDate);
                const isSel = key === selected;
                const isToday = key === today;
                return (
                  <Pressable key={key} style={styles.cell} onPress={() => setSelected(key)}>
                    <View
                      style={[
                        styles.dayNum,
                        {
                          backgroundColor: isToday ? t.primary : 'transparent',
                          borderColor: isSel ? t.text : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: isToday ? t.onPrimary : t.text,
                          fontWeight: isToday ? '900' : '600',
                          fontSize: 15,
                        }}
                      >
                        {Number(key.slice(8))}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dash,
                        { backgroundColor: colorOf(s), opacity: s === 'rest' ? 0.5 : 1 },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}

          <View style={styles.legend}>
            {(['done', 'missed', 'rest'] as Status[]).map((s) => (
              <View key={s} style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: colorOf(s), opacity: s === 'rest' ? 0.5 : 1 }]} />
                <Sub>{STATUS_LABEL[s]}</Sub>
              </View>
            ))}
          </View>
        </Card>
        </View>

        <Card style={{ gap: 10 }}>
          <View style={styles.monthRow}>
            <Body style={{ fontWeight: '800', fontSize: 18 }}>{formatKeyKorean(selected)}</Body>
            {STATUS_LABEL[selStatus] ? (
              <Text style={{ color: colorOf(selStatus), fontWeight: '800' }}>{STATUS_LABEL[selStatus]}</Text>
            ) : null}
          </View>

          {selRecords.length === 0 ? (
            <Sub>
              {selDay.part === '휴식'
                ? '휴식일입니다.'
                : `루틴: ${selDay.part} · 이 날의 운동 기록이 없습니다.`}
            </Sub>
          ) : (
            selRecords.map((rec) => (
              <View key={rec.id} style={{ gap: 8 }}>
                <Sub>총 운동 시간 {formatDuration(rec.durationSec)}</Sub>
                {rec.exercises.map((ex, i) => (
                  <View key={i} style={[styles.exRow, { borderColor: t.border }]}>
                    <Body style={{ fontWeight: '700' }}>{ex.name}</Body>
                    <Sub>
                      {ex.sets.map((n, si) => `${si + 1}세트 ${n}${unitOf(ex.type)}`).join(' · ')}
                    </Sub>
                  </View>
                ))}
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  weekRow: { flexDirection: 'row' },
  weekHead: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '700', paddingVertical: 6 },
  cell: { flex: 1, height: 52, alignItems: 'center', justifyContent: 'center', gap: 3 },
  dayNum: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dash: { width: 16, height: 3, borderRadius: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 16, height: 3, borderRadius: 2 },
  exRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, gap: 2 },
});
