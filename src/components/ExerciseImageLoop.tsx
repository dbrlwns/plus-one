import { Asset } from 'expo-asset';
import { createElement, useEffect, useState } from 'react';
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

/** 번호 순서대로 1.5초마다 이미지를 돌려 보여준다. 모든 프레임을 미리 그려두고 투명도만 바꿔서 깜빡임을 막는다. */
export function ExerciseImageLoop({ images }: { images: ImageSourcePropType[] }) {
  const t = useTheme();
  const [frame, setFrame] = useState(0);
  const count = images.length;

  useEffect(() => {
    setFrame(0);
    if (count <= 1) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % count), IMAGE_FRAME_MS);
    return () => clearInterval(id);
  }, [count, images]);

  if (count === 0) {
    return (
      <View style={[styles.box, styles.empty, { backgroundColor: t.chip }]}>
        <Text style={{ color: t.subtext }}>이미지가 없는 운동이에요</Text>
      </View>
    );
  }

  return (
    <View style={[styles.box, { backgroundColor: '#FFFFFF' }]}>
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
