import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Btn, Card, Heading, Screen, Sub } from '../../src/components/ui';
import { useAppData } from '../../src/state/AppData';
import { useTheme } from '../../src/theme';
import { confirmAction } from '../../src/utils/confirm';

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
  const { settings, updateSettings, resetAll } = useAppData();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading>설정</Heading>

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
          <Sub>반복 템포(기본 3초)는 운동 중 화면에서 바로 조절할 수 있습니다.</Sub>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
});
