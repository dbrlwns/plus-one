import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'rest-warning';
/** 휴식이 끝나기 이 초 전에 알린다 */
export const REST_WARNING_LEAD_SEC = 10;

let granted = false;
let scheduledId: string | null = null;

// 앱이 화면에 떠 있을 때는 앱 안의 소리/진동이 있으니 알림 배너는 띄우지 않는다.
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** 알림 권한을 요청하고(안드로이드는 채널도 만든다) 허용 여부를 기억한다. 웹에서는 아무것도 하지 않는다. */
export async function setupRestNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: '휴식 알림',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    granted = current.granted || (current.canAskAgain && (await Notifications.requestPermissionsAsync()).granted);
  } catch {
    granted = false;
  }
  return granted;
}

/** seconds 뒤에 알림을 예약한다. 이미 예약된 게 있으면 바꾼다. */
export async function scheduleRestWarning(seconds: number, body: string): Promise<void> {
  if (!granted || seconds < 1) return;
  try {
    await cancelRestWarning();
    scheduledId = await Notifications.scheduleNotificationAsync({
      content: { title: `휴식이 ${REST_WARNING_LEAD_SEC}초 남았어요`, body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.ceil(seconds),
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    scheduledId = null;
  }
}

export async function cancelRestWarning(): Promise<void> {
  const id = scheduledId;
  scheduledId = null;
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
}
