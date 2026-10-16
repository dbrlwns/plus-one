import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

const CHANNEL_ID = 'rest-warning';
/** 휴식이 끝나기 이 초 전에 알린다 */
export const REST_WARNING_LEAD_SEC = 10;

let granted = false;
let scheduledId: string | null = null;

// expo-notifications가 불러올 때 필요한 네이티브 모듈 (이 앱의 빌드에 포함되어 있어야 알림을 쓸 수 있다)
const NATIVE_MODULES = ['ExpoTopicSubscriptionModule', 'ExpoNotificationScheduler', 'ExpoNotificationPermissionsModule'];

let loaded: NotificationsModule | null | undefined;

/**
 * expo-notifications는 네이티브 모듈이 들어 있는 빌드에서만 쓸 수 있다.
 * (모듈이 없는 개발 빌드/APK에서 import 하면 앱이 죽으므로, 필요할 때 try/catch로 불러서 알림만 포기한다.)
 */
function getNotifications(): NotificationsModule | null {
  if (loaded !== undefined) return loaded;
  if (Platform.OS === 'web') return (loaded = null);
  // 네이티브 모듈이 없는 빌드에서는 require 자체가 에러(+ 개발 화면의 빨간 로그)를 내므로 먼저 확인하고 건너뛴다.
  if (!NATIVE_MODULES.every((name) => requireOptionalNativeModule(name))) return (loaded = null);
  try {
    const mod: NotificationsModule = require('expo-notifications');
    // 앱이 화면에 떠 있을 때는 앱 안의 소리/진동이 있으니 알림 배너는 띄우지 않는다.
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: false,
        shouldShowList: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    loaded = mod;
  } catch {
    loaded = null;
  }
  return loaded;
}

/** 알림 권한을 요청하고(안드로이드는 채널도 만든다) 허용 여부를 기억한다. 웹에서는 아무것도 하지 않는다. */
export async function setupRestNotifications(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
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
  const Notifications = getNotifications();
  if (!Notifications || !granted || seconds < 1) return;
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
  const Notifications = getNotifications();
  if (!id || !Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
}
