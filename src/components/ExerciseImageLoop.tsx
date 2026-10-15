import { Asset } from 'expo-asset';
import { createElement, useSyncExternalStore } from 'react';
import { Image, Platform, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { useTheme } from '../theme';

export const IMAGE_FRAME_MS = 1500;
const ASPECT = 850 / 567; // 원본 이미지 비율

/**
 * 웹에서 react-native-web의 Image는 로드된 원본 크기(850x567)를 인라인 style로 강제해서
 * 컨테이너 크기를 무시한다. 그래서 웹에서는 일반 <img>를 쓰고, 네이티브에서는 Image를 쓴다.
 */
function Frame({ source, visible }: { source: ImageSourcePropType; visible: boolean }) {
  if (Platform.OS === 'web') {
    const uri = Asset.fromModule(source as number).uri;
    return createElement('img', {
      src: uri,
      alt: '',
      draggable: false,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: visible ? 1 : 0,
        userSelect: 'none',
      },
    });
  }
  return (
    <Image
      source={source}
      // 크기와 resizeMode를 style에 명시해서 원본 크기(850x567)로 그려지며 잘리는 일을 막는다
      style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', resizeMode: 'contain', opacity: visible ? 1 : 0 }]}
    />
  );
}

// 화면 안의 모든 이미지가 타이머 하나를 같이 쓴다. (카드마다 setInterval을 두면 목록에서 렉이 생긴다)
let tickCount = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      tickCount += 1;
      listeners.forEach((l) => l());
    }, IMAGE_FRAME_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
const getTick = () => tickCount;

/** 번호 순서대로 1.5초마다 이미지를 돌려 보여준다. 모든 프레임을 미리 그려두고 투명도만 바꿔서 깜빡임을 막는다. */
export function ExerciseImageLoop({ images, width }: { images: ImageSourcePropType[]; width?: number }) {
  const t = useTheme();
  const count = images.length;
  const tick = useSyncExternalStore(subscribe, getTick);
  const frame = count > 1 ? tick % count : 0;

  // width를 주면 그 크기의 작은 썸네일(목록용), 안 주면 화면 너비에 맞춘다(상세용)
  const size = width ? { width, maxWidth: width, borderRadius: 10 } : null;

  if (count === 0) {
    return (
      <View style={[styles.box, styles.empty, size, { backgroundColor: t.chip }]}>
        <Text style={{ color: t.subtext, fontSize: width ? 11 : 14, textAlign: 'center' }}>
          {width ? '이미지 없음' : '이미지가 없는 운동이에요'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.box, size, { backgroundColor: '#FFFFFF' }]}>
      {images.map((src, i) => (
        <Frame key={i} source={src} visible={i === frame} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', maxWidth: 520, alignSelf: 'center', aspectRatio: ASPECT, borderRadius: 14, overflow: 'hidden' },
  empty: { alignItems: 'center', justifyContent: 'center' },
});
