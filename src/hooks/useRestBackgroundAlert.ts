import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { cancelRestWarning, REST_WARNING_LEAD_SEC, scheduleRestWarning, setupRestNotifications } from '../notifications';
import { restWarningInfo, type WorkoutState } from '../workout/machine';

/**
 * 휴식 중에 앱이 백그라운드로 가면 "휴식 종료 10초 전" 알림을 예약하고, 앱으로 돌아오면 취소한다.
 * (앱 안의 타이머는 백그라운드에서 멈출 수 있어서, OS가 대신 띄우는 예약 알림을 쓴다.)
 */
export function useRestBackgroundAlert(state: WorkoutState) {
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    void setupRestNotifications();
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        void cancelRestWarning();
        return;
      }
      const info = restWarningInfo(stateRef.current, REST_WARNING_LEAD_SEC);
      if (info) void scheduleRestWarning(info.seconds, info.body);
      else void cancelRestWarning();
    });
    return () => {
      sub.remove();
      void cancelRestWarning();
    };
  }, []);
}
