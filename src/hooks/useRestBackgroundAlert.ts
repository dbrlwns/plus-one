import { useEffect, useRef } from 'react';
import { cancelRestWarning, REST_WARNING_LEAD_SEC, scheduleRestWarning, setupRestNotifications } from '../notifications';
import { restWarningInfo, type WorkoutState } from '../workout/machine';

/**
 * 휴식이 시작되면 바로 "휴식 종료 10초 전" 알림을 예약해 둔다.
 * 앱이 화면에 떠 있을 때는 알림 배너를 숨기도록 되어 있어서(src/notifications.ts) 앱 안에서는 보이지 않고,
 * 앱이 백그라운드에 있을 때만 OS가 띄운다.
 *
 * 앱이 백그라운드로 가는 순간에 예약하는 방식은 그 순간 JS가 멈춰서 예약이 빠질 수 있어서 쓰지 않는다.
 * 휴식이 끝나거나, 건너뛰거나, 일시정지하거나, 시간이 늘어나면(+30초) 예약을 취소하고 필요하면 다시 잡는다.
 */
export function useRestBackgroundAlert(state: WorkoutState) {
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // 권한/채널 준비는 세션이 시작될 때 한 번. 이게 끝나기 전에 휴식이 시작돼도 되도록 아래에서도 한 번 더 기다린다.
  const ready = useRef<Promise<boolean> | null>(null);
  useEffect(() => {
    ready.current = setupRestNotifications();
    return () => {
      void cancelRestWarning();
    };
  }, []);

  const resting = state.phase === 'rest' && !state.paused;
  useEffect(() => {
    if (!resting) {
      void cancelRestWarning();
      return;
    }
    const info = restWarningInfo(stateRef.current, REST_WARNING_LEAD_SEC);
    if (!info) {
      void cancelRestWarning();
      return;
    }
    let alive = true;
    void (async () => {
      await ready.current;
      if (alive) await scheduleRestWarning(info.seconds, info.body);
    })();
    return () => {
      alive = false;
    };
    // restSeq: 휴식이 새로 시작되거나 +30초로 길어질 때 다시 예약한다
  }, [resting, state.restSeq]);
}
