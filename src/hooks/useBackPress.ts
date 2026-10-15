import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

const EXIT_WINDOW_MS = 2000;
const EXIT_HINT = '종료하려면 뒤로가기 버튼을 한 번 더 누르세요';

/**
 * 안드로이드 뒤로가기 처리 (화면이 포커스일 때만 등록된다).
 * - onBack이 true를 반환하면 그 화면 안에서 처리한 것이다 (예: 상세 → 목록).
 * - 처리할 게 없으면(탭의 기본 화면) 다른 탭으로 보내지 않고, 두 번 눌러야 앱이 종료된다.
 */
export function useBackPress(onBack?: () => boolean) {
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  });
  const lastPress = useRef(0);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (onBackRef.current?.()) return true;

        const now = Date.now();
        if (now - lastPress.current < EXIT_WINDOW_MS) {
          BackHandler.exitApp();
          return true;
        }
        lastPress.current = now;
        ToastAndroid.show(EXIT_HINT, ToastAndroid.SHORT);
        return true;
      });
      return () => sub.remove();
    }, []),
  );
}
