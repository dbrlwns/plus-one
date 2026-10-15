import { StyleSheet, Text, View } from 'react-native';
import Body from 'react-native-body-highlighter';
import type { LearnHighlight } from '../data/learnTypes';
import { useTheme } from '../theme';

type Side = 'front' | 'back';

/** 자극 부위를 앞/뒤 몸 그림에 표시한다. intensity 2 = 주동근, 1 = 보조근. */
export function MuscleMap({ highlight, views }: { highlight: LearnHighlight[]; views: Side[] }) {
  const t = useTheme();
  const colors = [t.warn, t.danger]; // intensity 1(보조근), 2(주동근)

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.bodies}>
        {views.map((side) => (
          <View key={side} style={styles.body}>
            <Body
              data={highlight}
              colors={colors}
              side={side}
              gender="male"
              scale={0.7}
              border={t.border}
              defaultFill={t.chip}
            />
            <Text style={{ color: t.subtext, fontSize: 12, marginTop: 2 }}>{side === 'front' ? '앞' : '뒤'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <LegendDot color={colors[1]} label="주동근" />
        <LegendDot color={colors[0]} label="보조근" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const t = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={{ color: t.subtext, fontSize: 13 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bodies: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start' },
  body: { alignItems: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
