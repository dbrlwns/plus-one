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
      // 뒤로가기로 다른 탭(달력)으로 튕기지 않게 한다. 종료 처리는 useBackPress에서 한다.
      backBehavior="none"
      // 안 보이는 탭을 화면 계층에서 떼어내면(안드로이드 기본값) 다시 돌아올 때 붙이고 레이아웃을 다시 잡느라 탭 전환이 끊긴다
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        // 탭을 처음 열 때 화면을 만드느라 생기는 끊김을 없애려고 시작할 때 미리 만들어 둔다.
        // (freezeOnBlur는 탭으로 돌아올 때마다 화면을 다시 그려서 오히려 끊김을 만들 수 있어 쓰지 않는다)
        lazy: false,
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
    </Tabs>
  );
}
