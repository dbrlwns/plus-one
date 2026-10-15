import { memo, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Btn, Card, Chip, Heading, Screen, Sub } from '../../src/components/ui';
import { ExerciseImageLoop } from '../../src/components/ExerciseImageLoop';
import { MuscleMap } from '../../src/components/MuscleMap';
import { LEARN_EXERCISES } from '../../src/data/learnData.generated';
import type { LearnExercise } from '../../src/data/learnTypes';
import { useBackPress } from '../../src/hooks/useBackPress';
import { useTheme } from '../../src/theme';

type Category = LearnExercise['category'];

const CATEGORY_LABEL: Record<Category, string> = {
  push: '밀기',
  pull: '당기기',
  legs: '하체',
  core: '복근',
};
const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const LEVEL_LABEL: Record<LearnExercise['level'], string> = {
  beginner: '초급',
  intermediate: '중급',
  expert: '고급',
};
const EQUIPMENT_LABEL: Record<string, string> = {
  'body only': '맨몸',
  dumbbell: '덤벨',
  kettlebells: '케틀벨',
  other: '기타 도구',
};

export default function LearnScreen() {
  const t = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = LEARN_EXERCISES.find((e) => e.id === selectedId) ?? null;

  // 상세 화면에서 뒤로가기 → 목록
  useBackPress(() => {
    if (!selected) return false;
    setSelectedId(null);
    return true;
  });

  // 목록을 계속 그려둔 채 상세를 위에 덮는다. 목록을 없애지 않아야 돌아왔을 때 보던 위치가 유지된다.
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <ExerciseList onSelect={setSelectedId} />
        {selected ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: t.bg }]}>
            <ExerciseDetail exercise={selected} onBack={() => setSelectedId(null)} />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const ListItem = memo(function ListItem({ e, onSelect }: { e: LearnExercise; onSelect: (id: string) => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => onSelect(e.id)} accessibilityRole="button">
      <Card style={styles.listCard}>
        <ExerciseImageLoop images={e.thumbs} width={104} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ color: t.text, fontSize: 17, fontWeight: '800' }}>{e.nameKo}</Text>
          <Sub>
            {CATEGORY_LABEL[e.category]} · {LEVEL_LABEL[e.level]}
            {e.equipment && EQUIPMENT_LABEL[e.equipment] ? ` · ${EQUIPMENT_LABEL[e.equipment]}` : ''}
          </Sub>
          <Sub>자극 부위: {e.primaryMuscles.join(', ')}</Sub>
        </View>
        <Text style={{ color: t.subtext, fontSize: 22 }}>›</Text>
      </Card>
    </Pressable>
  );
});

function ExerciseList({ onSelect }: { onSelect: (id: string) => void }) {
  const [category, setCategory] = useState<Category | 'all'>('all');

  const list = useMemo(
    () => (category === 'all' ? LEARN_EXERCISES : LEARN_EXERCISES.filter((e) => e.category === category)),
    [category],
  );

  // 화면에 보이는 카드만 그려서 이미지/타이머 수를 줄인다 (FlatList 가상화)
  return (
    <FlatList
      data={list}
      keyExtractor={(e) => e.id}
      renderItem={({ item }) => <ListItem e={item} onSelect={onSelect} />}
      contentContainerStyle={styles.content}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={3}
      removeClippedSubviews
      ListHeaderComponent={
        <View style={{ gap: 14 }}>
          <Heading>배우기</Heading>
          <Sub>운동을 눌러 자세와 자극 부위를 확인해 보세요.</Sub>
          <View style={styles.wrapRow}>
            <Chip label="전체" selected={category === 'all'} onPress={() => setCategory('all')} />
            {CATEGORIES.map((c) => (
              <Chip key={c} label={CATEGORY_LABEL[c]} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </View>
      }
    />
  );
}

function ExerciseDetail({ exercise: e, onBack }: { exercise: LearnExercise; onBack: () => void }) {
  const t = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Btn title="‹ 목록" kind="ghost" size="sm" onPress={onBack} />
      </View>

      <View style={{ gap: 4 }}>
        <Heading>{e.nameKo}</Heading>
        <Sub>
          {e.nameEn} · {CATEGORY_LABEL[e.category]} · {LEVEL_LABEL[e.level]}
          {e.equipment && EQUIPMENT_LABEL[e.equipment] ? ` · ${EQUIPMENT_LABEL[e.equipment]}` : ''}
        </Sub>
      </View>

      <Card style={{ gap: 12 }}>
        <Body style={{ fontWeight: '800', fontSize: 18 }}>자극 부위</Body>
        <MuscleMap highlight={e.highlight} views={e.bodyViews} />
        <View style={{ gap: 2 }}>
          <Sub>
            <Text style={{ color: t.danger, fontWeight: '700' }}>주동근 </Text>
            {e.primaryMuscles.join(', ')}
          </Sub>
          {e.secondaryMuscles.length > 0 ? (
            <Sub>
              <Text style={{ color: t.warn, fontWeight: '700' }}>보조근 </Text>
              {e.secondaryMuscles.join(', ')}
            </Sub>
          ) : null}
        </View>
      </Card>

      <ExerciseImageLoop images={e.images} />

      <Card style={{ gap: 10 }}>
        <Body style={{ fontWeight: '800', fontSize: 18 }}>운동 방법</Body>
        {e.instructionsKo.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: t.primary }]}>
              <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: 13 }}>{i + 1}</Text>
            </View>
            <Body style={{ flex: 1, lineHeight: 23 }}>{step}</Body>
          </View>
        ))}
      </Card>

      {e.noteKo ? (
        <Card style={{ gap: 6 }}>
          <Body style={{ fontWeight: '800' }}>💡 참고</Body>
          <Sub style={{ lineHeight: 21 }}>{e.noteKo}</Sub>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  listCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  stepRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
});
