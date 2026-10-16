import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Sub } from '../src/components/ui';
import { getExercise, unitOf } from '../src/data/exercises';
import { ROUTINE_PRESETS, presetToRoutine, type RoutinePreset } from '../src/data/routinePresets';
import { sendTestNotification, type NotificationTestResult } from '../src/notifications';
import { useAppData } from '../src/state/AppData';
import { useTheme } from '../src/theme';
import { confirmAction, notify } from '../src/utils/confirm';
import { WEEKDAYS } from '../src/data/exercises';

const THEME_OPTIONS: { value: 'system' | 'light' | 'dark'; label: string }[] = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
];

export default function SettingsScreen() {
  const t = useTheme();
  const router = useRouter();
  const { settings, updateSettings, resetAll, setRoutine } = useAppData();
  const [openPreset, setOpenPreset] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<NotificationTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const runNotificationTest = async () => {
    setTesting(true);
    setTestResult(await sendTestNotification());
    setTesting(false);
  };

  // 이름/휴식시간은 입력 중에는 임시 값으로 두고, [저장하기]를 눌러야 저장한다
  const [name, setName] = useState(settings.name);
  const [restText, setRestText] = useState(String(settings.restSec));
  const [justSaved, setJustSaved] = useState(false);
  useEffect(() => {
    // 데이터 초기화처럼 밖에서 값이 바뀌면 입력칸도 맞춘다
    setName(settings.name);
    setRestText(String(settings.restSec));
  }, [settings.name, settings.restSec]);

  const restNum = parseInt(restText, 10);
  const restValid = Number.isFinite(restNum) && restNum >= 1;
  const dirty =
    name.trim() !== settings.name || (restValid ? restNum !== settings.restSec : restText !== String(settings.restSec));

  const save = () => {
    if (!restValid) {
      notify('저장할 수 없어요', '기본 휴식시간은 1초 이상으로 입력해 주세요.');
      return;
    }
    updateSettings({ name: name.trim(), restSec: restNum });
    setName(name.trim());
    setJustSaved(true);
  };
  useEffect(() => {
    if (!justSaved) return;
    const id = setTimeout(() => setJustSaved(false), 1500);
    return () => clearTimeout(id);
  }, [justSaved]);

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));
  // 저장하지 않은 변경이 있으면 나가기 전에 한 번 물어본다
  const goBack = () => {
    if (!dirty) return leave();
    confirmAction('저장하지 않았어요', '변경한 내용을 저장하지 않고 나갈까요?', leave);
  };
  const goBackRef = useRef(goBack);
  goBackRef.current = goBack;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!dirtyRef.current) return false; // 저장할 게 없으면 기본 동작(이전 화면)
        goBackRef.current();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

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
              value={name}
              onChangeText={setName}
              placeholder="이름 입력"
              placeholderTextColor={t.subtext}
              style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.bg, flex: 2 }]}
            />
          </View>
          <View style={styles.row}>
            <Body style={{ flex: 1 }}>기본 휴식시간</Body>
            <TextInput
              value={restText}
              onChangeText={(v) => setRestText(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.bg, width: 80, textAlign: 'right' }]}
            />
            <Text style={{ color: t.subtext, width: 24 }}>초</Text>
          </View>
          <Sub>반복 템포(기본 3초)는 운동 중 화면에서 바로 조절하며, 운동별로 저장됩니다.</Sub>
          <Btn
            title={justSaved ? '저장했어요 ✓' : dirty ? '저장하기' : '저장됨'}
            disabled={!dirty && !justSaved}
            onPress={save}
          />
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
          <Body style={{ fontWeight: '700' }}>알림 테스트</Body>
          <Sub>휴식 종료 10초 전 알림이 오는지 확인해요. 누른 뒤 홈 버튼으로 앱을 내리면 8초 뒤에 알림이 와요.</Sub>
          <Btn title={testing ? '확인 중…' : '알림 테스트'} kind="secondary" disabled={testing} onPress={runNotificationTest} />
          {testResult ? (
            <Text style={{ color: testResult.ok ? t.success : t.danger, fontSize: 14, lineHeight: 20 }}>
              {testResult.message}
            </Text>
          ) : null}
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
