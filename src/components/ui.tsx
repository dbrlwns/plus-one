import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

export function Screen({ children }: { children: ReactNode }) {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }, style]}>{children}</View>
  );
}

export function Heading({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return <Text style={[styles.heading, { color: t.text }, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return <Text style={[{ color: t.text, fontSize: 16 }, style]}>{children}</Text>;
}

export function Sub({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return <Text style={[{ color: t.subtext, fontSize: 14 }, style]}>{children}</Text>;
}

type BtnKind = 'primary' | 'secondary' | 'danger' | 'ghost';

export function Btn({
  title,
  onPress,
  kind = 'primary',
  size = 'md',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: BtnKind;
  size?: 'sm' | 'md' | 'xl';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const bg =
    kind === 'primary' ? t.primary : kind === 'danger' ? t.danger : kind === 'secondary' ? t.chip : 'transparent';
  const fg = kind === 'primary' || kind === 'danger' ? t.onPrimary : kind === 'ghost' ? t.primary : t.text;
  const pad = size === 'xl' ? 26 : size === 'md' ? 14 : 8;
  const fontSize = size === 'xl' ? 28 : size === 'md' ? 17 : 14;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, paddingVertical: pad, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        size === 'sm' && { paddingHorizontal: 12 },
        style,
      ]}
    >
      <Text style={{ color: fg, fontSize, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  sub,
  compact,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  sub?: string;
  compact?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? t.primary : t.chip,
        },
        compact && { paddingHorizontal: 0 },
      ]}
    >
      <Text style={{ color: selected ? t.onPrimary : t.text, fontWeight: '700', fontSize: 15 }}>{label}</Text>
      {sub ? (
        <Text numberOfLines={1} style={{ color: selected ? t.onPrimary : t.subtext, fontSize: 11, marginTop: 2 }}>
          {sub}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  unit: string;
}) {
  const t = useTheme();
  return (
    <View style={styles.stepper}>
      <Text style={{ color: t.subtext, fontSize: 13, width: 40 }}>{label}</Text>
      <Btn title="−" kind="secondary" size="sm" onPress={() => onChange(Math.max(min, value - step))} />
      <Text style={{ color: t.text, fontSize: 17, fontWeight: '700', minWidth: 56, textAlign: 'center' }}>
        {value}
        {unit}
      </Text>
      <Btn title="+" kind="secondary" size="sm" onPress={() => onChange(value + step)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: '800' },
  btn: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  chip: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
