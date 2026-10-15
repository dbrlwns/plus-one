import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../src/theme';

const icon = (emoji: string) =>
  function TabIcon() {
    return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
  };

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.subtext,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '달력', tabBarIcon: icon('📅') }} />
      <Tabs.Screen name="routine" options={{ title: '루틴', tabBarIcon: icon('📋') }} />
      <Tabs.Screen name="workout" options={{ title: '운동', tabBarIcon: icon('💪') }} />
      <Tabs.Screen name="learn" options={{ title: '배우기', tabBarIcon: icon('📖') }} />
      <Tabs.Screen name="settings" options={{ title: '설정', tabBarIcon: icon('⚙️') }} />
    </Tabs>
  );
}
