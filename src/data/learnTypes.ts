import type { ImageSourcePropType } from 'react-native';
import type { Slug } from 'react-native-body-highlighter';

export interface LearnHighlight {
  slug: Slug;
  /** 2 = 주동근, 1 = 보조근 */
  intensity: number;
}

export interface LearnExercise {
  id: string;
  nameKo: string;
  nameEn: string;
  category: 'push' | 'pull' | 'legs' | 'core';
  type: 'reps' | 'time';
  level: 'beginner' | 'intermediate' | 'expert';
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  highlight: LearnHighlight[];
  bodyViews: ('front' | 'back')[];
  instructionsKo: string[];
  noteKo: string | null;
  /** 번호 순서(0, 1, 2 ...)대로 정렬된 이미지. 없을 수 있다. */
  images: ImageSourcePropType[];
}
