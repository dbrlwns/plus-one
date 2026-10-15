import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { CueKind } from './workout/machine';

let tickPlayer: AudioPlayer | null = null;
let donePlayer: AudioPlayer | null = null;
let inited = false;

function init() {
  if (inited) return;
  inited = true;
  try {
    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    tickPlayer = createAudioPlayer(require('../assets/sounds/tick.wav'));
    donePlayer = createAudioPlayer(require('../assets/sounds/done.wav'));
  } catch {
    // 오디오를 쓸 수 없는 환경에서는 진동만 사용
  }
}

function play(p: AudioPlayer | null) {
  if (!p) return;
  try {
    void p.seekTo(0);
    p.play();
  } catch {
    // ignore
  }
}

function haptic(fn: () => Promise<void>) {
  try {
    void fn().catch(() => {});
  } catch {
    // 웹 등 햅틱 미지원 환경
  }
}

/** 상태 머신이 내보내는 cue를 소리/진동으로 바꾼다. */
export function playCue(kind: CueKind): void {
  init();
  switch (kind) {
    case 'countdown':
    case 'rep':
      play(tickPlayer);
      haptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      break;
    case 'sec':
      haptic(() => Haptics.selectionAsync());
      break;
    case 'setDone':
      play(donePlayer);
      haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      break;
    case 'restEnd':
      play(donePlayer);
      haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
      break;
    case 'finish':
      play(donePlayer);
      haptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      break;
  }
}
