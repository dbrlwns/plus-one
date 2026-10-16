import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Sub } from '../src/components/ui';
import { getExercise, unitOf } from '../src/data/exercises';
import { ROUTINE_PRESETS, presetToRoutine, type RoutinePreset } from '../src/data/routinePresets';
import { useAppData } from '../src/state/AppData';
import { useTheme } from '../src/theme';
import { confirmAction, notify } from '../src/utils/confirm';
import { WEEKDAYS } from '../src/data/exercises';

const THEME_OPTIONS: { value: 'system' | 'light' | 'dark'; label: string }[] = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
];

function NumberField({
  label,
  unit,
  value,
  onCommit,
}: {
  label: string;
  unit: string;
  value: number;
  onCommit: (v: number) => void;
}) {
  const t = useTheme();
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);

  const commit = () => {
    const n = parseInt(text, 10);
    if (Number.isFinite(n) && n >= 1) onCommit(n);
    else setText(String(value));
  };

  return (
    <View style={styles.row}>
      <Body style={{ flex: 1 }}>{label}</Body>
      <TextInput
        value={text}
        onChangeText={(v) => setText(v.replace(/[^0-9]/g, ''))}
        onBlur={commit}
        onSubmitEditing={commit}
        keyboardType="number-pad"
        style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.bg, width: 80, textAlign: 'right' }]}
      />
      <Text style={{ color: t.subtext, width: 24 }}>{unit}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const t = useTheme();
  const router = useRouter();
  // 스택 화면이라 안드로이드 뒤로가기는 기본 동작(이전 화면으로)을 쓴다
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const { settings, updateSettings, resetAll, setRoutine } = useAppData();
  const [openPreset, setOpenPreset] = useState<string | null>(null);

  const loadPreset = (preset: RoutinePreset) =>
    confirmAction('루틴 불러오기', `지금 루틴이 "${preset.name}"(으)로 바뀝니다. 계속할까요?`, () => {
      setRoutine(presetToRoutine(preset));
      notify('불러왔어요', '루틴 탭에서 확인하고 고칠 수 있어요.');
    });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Btn title="‹ 뒤로" kind="ghost" size="sm" onPress={goBack} />
          <Heading>설정</Heading>
        </View>

        <Card style={{ gap: 14 }}>
          <View style={styles.row}>
            <Body style={{ flex: 1 }}>이름</Body>
            <TextInput
              value={settings.name}
              onChangeText={(name) => updateSettings({ name })}
              placeholder="이름 입력"
              placeholderTextColor={t.subtext}
              style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.bg, flex: 2 }]}
            />
          </View>
          <NumberField
            label="기본 휴식시간"
            unit="초"
            value={settings.restSec}
            onCommit={(restSec) => updateSettings({ restSec })}
          />
          <Sub>반복 템포(기본 3초)는 운동 중 화면에서 바로 조절하며, 운동별로 저장됩니다.</Sub>
        </Card>

        <Card style={{ gap: 10 }}>
          <Body style={{ fontWeight: '700' }}>화면 테마</Body>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((o) => (
              <View key={o.value} style={{ flex: 1 }}>
                <Chip
                  label={o.label}
                  selected={(settings.theme ?? 'system') === o.value}
                  onPress={() => updateSettings({ theme: o.value })}
                />
              </View>
            ))}
          </View>
          <Sub>"시스템"은 휴대폰의 라이트/다크 설정을 따라가요.</Sub>
        </Card>

        <Card style={{ gap: 10 }}>
          <Body style={{ fontWeight: '700' }}>루틴 불러오기</Body>
          <Sub>미리 만들어 둔 루틴을 골라 불러올 수 있어요. 불러오면 지금 루틴이 바뀌고, 운동 기록은 그대로예요.</Sub>
          {ROUTINE_PRESETS.map((p) => {
            const open = openPreset === p.id;
            return (
              <View key={p.id} style={[styles.preset, { borderColor: t.border }]}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setOpenPreset(open ? null : p.id)}
                  style={styles.presetHead}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: t.text, fontSize: 16, fontWeight: '800' }}>{p.name}</Text>
                    <Sub>{p.summary}</Sub>
                  </View>
                  <Text style={{ color: t.subtext, fontSize: 18 }}>{open ? '∧' : '∨'}</Text>
                </Pressable>

                {open ? (
                  <View style={{ gap: 8, marginTop: 6 }}>
                    <Sub>{p.description}</Sub>
                    {p.days.map((d, i) => (
                      <View key={i} style={{ gap: 2 }}>
                        <Text style={{ color: t.text, fontWeight: '700' }}>
                          {WEEKDAYS[i]} · {d.part}
                        </Text>
                        {d.items.map(([id, sets, target], j) => {
                          const ex = getExercise(id);
                          return (
                            <Sub key={j}>
                              {ex?.name ?? id} {sets}세트 × {target}
                              {ex ? unitOf(ex.type) : ''}
                            </Sub>
                          );
                        })}
                      </View>
                    ))}
                    <Btn title="이 루틴 불러오기" onPress={() => loadPreset(p)} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </Card>

        <Card style={{ gap: 10 }}>
          <Body style={{ fontWeight: '700' }}>데이터</Body>
          <Sub>설정, 루틴, 운동 기록을 모두 지우고 처음 상태로 되돌립니다.</Sub>
          <Btn
            title="데이터 초기화"
            kind="danger"
            onPress={() =>
              confirmAction('데이터 초기화', '모든 설정, 루틴, 운동 기록이 삭제됩니다. 계속할까요?', () => {
                void resetAll();
              })
            }
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  themeRow: { flexDirection: 'row', gap: 8 },
  preset: { borderWidth: 1, borderRadius: 12, padding: 12 },
  presetHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
});
