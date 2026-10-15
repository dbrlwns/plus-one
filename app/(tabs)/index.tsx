import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Btn, Card, Heading, Screen, Sub } from '../../src/components/ui';
import { unitOf } from '../../src/data/exercises';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useAppData } from '../../src/state/AppData';
import { useTheme } from '../../src/theme';
import type { Routine, WorkoutRecord } from '../../src/types';
import { formatDuration, formatKeyKorean, fromKey, toKey, todayKey, weekdayIndex } from '../../src/utils/date';

type Status = 'done' | 'missed' | 'rest' | 'planned' | 'none';

const STATUS_LABEL: Record<Status, string> = {
  done: '참여',
  missed: '불참',
  rest: '휴식',
  planned: '예정',
  none: '',
};

function statusOf(key: string, routine: Routine, byDate: Map<string, WorkoutRecord[]>, today: string, startKey: string): Status {
  if (byDate.has(key)) return 'done';
  if (routine[weekdayIndex(fromKey(key))].part === '휴식') return 'rest';
  if (key >= today) return 'planned';
  if (key < startKey) return 'none';
  return 'missed';
}

export default function CalendarScreen() {
  const t = useTheme();
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
    s === 'done' ? t.success : s === 'missed' ? t.danger : s === 'rest' ? t.rest : s === 'planned' ? t.primary : 'transparent';

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

  const selStatus = statusOf(selected, routine, byDate, today, settings.startDate);
  const selRecords = byDate.get(selected) ?? [];
  const selDay = routine[weekdayIndex(fromKey(selected))];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading>{settings.name ? `${settings.name}님의 기록` : '운동 기록'}</Heading>

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
                const filled = s === 'done' || s === 'missed' || s === 'rest';
                return (
                  <Pressable key={key} style={styles.cell} onPress={() => setSelected(key)}>
                    <View
                      style={[
                        styles.dayBox,
                        {
                          backgroundColor: filled ? colorOf(s) : 'transparent',
                          borderColor: isSel ? t.text : s === 'planned' ? t.primary : 'transparent',
                          borderWidth: isSel ? 2 : 1,
                          opacity: s === 'rest' ? 0.55 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: filled ? '#FFFFFF' : t.text,
                          fontWeight: isToday ? '900' : '600',
                          fontSize: 15,
                        }}
                      >
                        {Number(key.slice(8))}
                      </Text>
                    </View>
                    {isToday ? <View style={[styles.todayDot, { backgroundColor: t.primary }]} /> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}

          <View style={styles.legend}>
            {(['done', 'missed', 'rest', 'planned'] as Status[]).map((s) => (
              <View key={s} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendSwatch,
                    s === 'planned'
                      ? { borderColor: t.primary, borderWidth: 2 }
                      : { backgroundColor: colorOf(s), opacity: s === 'rest' ? 0.55 : 1 },
                  ]}
                />
                <Sub>{STATUS_LABEL[s]}</Sub>
              </View>
            ))}
          </View>
        </Card>

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
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  weekRow: { flexDirection: 'row' },
  weekHead: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '700', paddingVertical: 6 },
  cell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayBox: { width: '82%', aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  todayDot: { position: 'absolute', bottom: 2, width: 5, height: 5, borderRadius: 3 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 14, height: 14, borderRadius: 7 },
  exRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, gap: 2 },
});
