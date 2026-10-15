// 자동 생성 파일 — 직접 수정하지 말고 scripts/gen-learn-data.js 를 다시 실행하세요.
// 원본: repup-exercise-data/exercises.ko.json (Exercise data and images from yuhonas/free-exercise-db (Unlicense, public domain). Korean translations and notes added.)
import type { LearnExercise } from './learnTypes';

export const LEARN_EXERCISES: LearnExercise[] = [
  {
  "id": "push-up",
  "nameKo": "푸쉬업",
  "nameEn": "Push-Up",
  "category": "push",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "가슴"
  ],
  "secondaryMuscles": [
    "어깨",
    "삼두"
  ],
  "highlight": [
    {
      "slug": "chest",
      "intensity": 2
    },
    {
      "slug": "deltoids",
      "intensity": 1
    },
    {
      "slug": "triceps",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "바닥에 엎드려 양손을 약 90cm 간격으로 짚고, 팔을 뻗어 상체를 들어 올린 자세를 유지합니다.",
    "숨을 들이마시며 가슴이 바닥에 거의 닿을 때까지 몸을 내립니다.",
    "숨을 내쉬며 가슴을 조이면서 상체를 시작 자세로 밀어 올립니다.",
    "위에서 잠깐 멈춘 뒤, 원하는 횟수만큼 다시 내려가기를 반복합니다."
  ],
  "noteKo": "원문의 손 간격(약 90cm)은 넓은 편이에요. 어깨너비보다 조금 넓게 잡아도 되고, 손목 보호를 위해 푸쉬업바 사용을 권장합니다.",
    "images": [require('../../repup-exercise-data/images/push-up/0.jpg'), require('../../repup-exercise-data/images/push-up/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/push-up/0.jpg'), require('../../repup-exercise-data/thumbs/push-up/1.jpg')],
  },
  {
  "id": "decline-push-up",
  "nameKo": "디클라인 푸쉬업",
  "nameEn": "Decline Push-Up",
  "category": "push",
  "type": "reps",
  "level": "beginner",
  "equipment": null,
  "primaryMuscles": [
    "가슴"
  ],
  "secondaryMuscles": [
    "어깨",
    "삼두"
  ],
  "highlight": [
    {
      "slug": "chest",
      "intensity": 2
    },
    {
      "slug": "deltoids",
      "intensity": 1
    },
    {
      "slug": "triceps",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "바닥에 엎드려 양손을 약 90cm 간격으로 짚고, 팔을 뻗어 상체를 들어 올린 뒤 발을 박스나 벤치 위에 올립니다. 이것이 시작 자세입니다.",
    "숨을 들이마시며 가슴이 바닥에 거의 닿을 때까지 몸을 내립니다.",
    "숨을 내쉬며 가슴을 조이면서 상체를 시작 자세로 밀어 올립니다.",
    "위에서 잠깐 멈춘 뒤, 원하는 횟수만큼 다시 내려가기를 반복합니다."
  ],
  "noteKo": "집에서는 의자나 침대에 발을 올려도 됩니다. 발 위치가 높을수록 난이도가 올라가요.",
    "images": [require('../../repup-exercise-data/images/decline-push-up/0.jpg'), require('../../repup-exercise-data/images/decline-push-up/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/decline-push-up/0.jpg'), require('../../repup-exercise-data/thumbs/decline-push-up/1.jpg')],
  },
  {
  "id": "diamond-push-up",
  "nameKo": "다이아몬드 푸쉬업",
  "nameEn": "Close-Grip Push-Up",
  "category": "push",
  "type": "reps",
  "level": "intermediate",
  "equipment": "body only",
  "primaryMuscles": [
    "삼두"
  ],
  "secondaryMuscles": [
    "가슴",
    "어깨"
  ],
  "highlight": [
    {
      "slug": "triceps",
      "intensity": 2
    },
    {
      "slug": "chest",
      "intensity": 1
    },
    {
      "slug": "deltoids",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "바닥에 엎드려 양손을 어깨너비보다 좁게 짚습니다. 팔을 뻗어 상체를 들어 올린 자세를 유지합니다.",
    "숨을 들이마시며 가슴이 바닥에 거의 닿을 때까지 몸을 내립니다.",
    "삼두와 가슴 근육 일부를 사용해 상체를 시작 자세로 밀어 올리고 가슴을 조입니다. 이때 숨을 내쉽니다.",
    "수축된 자세에서 1초 멈춘 뒤, 정해진 횟수만큼 반복합니다."
  ],
  "noteKo": "원문은 좁은 그립 푸쉬업이에요. 다이아몬드 푸쉬업은 양손 엄지·검지로 다이아몬드 모양을 만드는 변형이며, 손목이 불편하면 원문처럼 손을 어깨보다 살짝 좁게만 짚어도 됩니다.",
    "images": [require('../../repup-exercise-data/images/diamond-push-up/0.jpg'), require('../../repup-exercise-data/images/diamond-push-up/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/diamond-push-up/0.jpg'), require('../../repup-exercise-data/thumbs/diamond-push-up/1.jpg')],
  },
  {
  "id": "dips",
  "nameKo": "딥스",
  "nameEn": "Parallel Bar Dip",
  "category": "push",
  "type": "reps",
  "level": "beginner",
  "equipment": "other",
  "primaryMuscles": [
    "삼두"
  ],
  "secondaryMuscles": [
    "가슴",
    "어깨"
  ],
  "highlight": [
    {
      "slug": "triceps",
      "intensity": 2
    },
    {
      "slug": "chest",
      "intensity": 1
    },
    {
      "slug": "deltoids",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "평행봉 사이에 서서 양손으로 각 봉을 잡고, 살짝 점프해 팔을 완전히 편 시작 자세를 만듭니다.",
    "팔꿈치를 굽혀 팔이 90도보다 조금 더 굽혀질 때까지 몸을 내립니다. 몸이 흔들리지 않게 하고 내려가는 동안 바른 자세를 유지합니다.",
    "팔꿈치를 펴면서 반대로 움직여 시작 자세로 몸을 밀어 올립니다.",
    "원하는 횟수만큼 반복합니다."
  ],
  "noteKo": "처음에는 팔꿈치 90도 정도까지만 내려가세요. 상체를 앞으로 숙이면 가슴, 세우면 삼두에 더 자극이 갑니다.",
    "images": [require('../../repup-exercise-data/images/dips/0.jpg'), require('../../repup-exercise-data/images/dips/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dips/0.jpg'), require('../../repup-exercise-data/thumbs/dips/1.jpg')],
  },
  {
  "id": "dumbbell-floor-press",
  "nameKo": "덤벨 플로어 프레스",
  "nameEn": "Dumbbell Floor Press",
  "category": "push",
  "type": "reps",
  "level": "intermediate",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "삼두"
  ],
  "secondaryMuscles": [
    "가슴",
    "어깨"
  ],
  "highlight": [
    {
      "slug": "triceps",
      "intensity": 2
    },
    {
      "slug": "chest",
      "intensity": 1
    },
    {
      "slug": "deltoids",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "양손에 덤벨을 들고 바닥에 눕습니다. 무릎은 굽혀도 됩니다. 덤벨을 위로 완전히 뻗은 상태에서 시작합니다.",
    "위팔이 바닥에 닿을 때까지 덤벨을 내립니다. 팔꿈치를 몸 쪽으로 붙이면 삼두, 팔을 옆으로 벌리면 가슴에 더 집중할 수 있습니다.",
    "아래에서 잠깐 멈춘 뒤, 팔꿈치를 펴면서 덤벨을 위로 밀어 올려 모읍니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/dumbbell-floor-press/0.jpg'), require('../../repup-exercise-data/images/dumbbell-floor-press/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-floor-press/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-floor-press/1.jpg')],
  },
  {
  "id": "dumbbell-shoulder-press",
  "nameKo": "덤벨 숄더프레스",
  "nameEn": "Dumbbell Shoulder Press",
  "category": "push",
  "type": "reps",
  "level": "intermediate",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "어깨"
  ],
  "secondaryMuscles": [
    "삼두"
  ],
  "highlight": [
    {
      "slug": "deltoids",
      "intensity": 2
    },
    {
      "slug": "triceps",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "양손에 덤벨을 들고 등받이가 있는 벤치에 앉습니다. 덤벨을 허벅지 위에 세워 둡니다.",
    "허벅지 반동을 이용해 덤벨을 하나씩 어깨 높이로 들어 올립니다.",
    "손목을 돌려 손바닥이 앞을 향하게 합니다. 이것이 시작 자세입니다.",
    "숨을 내쉬며 덤벨이 위에서 맞닿을 때까지 밀어 올립니다.",
    "위에서 잠깐 멈춘 뒤, 숨을 들이마시며 천천히 시작 자세로 내립니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "등받이 있는 의자에 앉거나 서서 해도 됩니다.",
    "images": [require('../../repup-exercise-data/images/dumbbell-shoulder-press/0.jpg'), require('../../repup-exercise-data/images/dumbbell-shoulder-press/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-shoulder-press/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-shoulder-press/1.jpg')],
  },
  {
  "id": "lateral-raise",
  "nameKo": "사이드 레터럴 레이즈",
  "nameEn": "Side Lateral Raise",
  "category": "push",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "어깨"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "deltoids",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "덤벨 두 개를 들고 상체를 곧게 세운 채 섭니다. 팔은 몸 옆에 늘어뜨리고 손바닥이 몸을 향하게 합니다. 이것이 시작 자세입니다.",
    "상체를 고정한 채(반동 없이) 팔꿈치를 살짝 굽히고, 컵에 물을 따르듯 손을 약간 앞으로 기울이며 덤벨을 옆으로 들어 올립니다. 팔이 바닥과 평행이 될 때까지 올리고, 올리면서 숨을 내쉰 뒤 위에서 1초 멈춥니다.",
    "숨을 들이마시며 천천히 시작 자세로 내립니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/lateral-raise/0.jpg'), require('../../repup-exercise-data/images/lateral-raise/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/lateral-raise/0.jpg'), require('../../repup-exercise-data/thumbs/lateral-raise/1.jpg')],
  },
  {
  "id": "overhead-triceps-extension",
  "nameKo": "오버헤드 트라이셉스 익스텐션",
  "nameEn": "Standing Dumbbell Triceps Extension",
  "category": "push",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "삼두"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "triceps",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "양발을 어깨너비로 벌리고 서서 덤벨 하나를 양손으로 잡습니다. 천천히 머리 위로 들어 올려 양팔을 완전히 폅니다.",
    "덤벨이 손바닥에 걸쳐지도록 하고 엄지로 감싸 쥡니다. 손바닥은 천장을 향합니다. 이것이 시작 자세입니다.",
    "위팔을 머리 옆에 붙이고 팔꿈치를 모아 바닥과 수직으로 유지한 채, 전완이 이두에 닿을 때까지 덤벨을 머리 뒤로 반원을 그리며 내립니다. 위팔은 고정하고 전완만 움직이세요. 이때 숨을 들이마십니다.",
    "삼두를 사용해 덤벨을 들어 올려 시작 자세로 돌아옵니다. 이때 숨을 내쉽니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/overhead-triceps-extension/0.jpg'), require('../../repup-exercise-data/images/overhead-triceps-extension/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/overhead-triceps-extension/0.jpg'), require('../../repup-exercise-data/thumbs/overhead-triceps-extension/1.jpg')],
  },
  {
  "id": "pull-up",
  "nameKo": "풀업",
  "nameEn": "Pull-Up",
  "category": "pull",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "광배"
  ],
  "secondaryMuscles": [
    "이두",
    "등 중앙"
  ],
  "highlight": [
    {
      "slug": "upper-back",
      "intensity": 2
    },
    {
      "slug": "biceps",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "손바닥이 앞을 향하게 철봉을 잡습니다. 넓은 그립은 어깨너비보다 넓게, 중간 그립은 어깨너비로, 좁은 그립은 어깨너비보다 좁게 잡습니다.",
    "선택한 그립으로 팔을 뻗어 매달린 상태에서 상체를 뒤로 약 30도 기울이고, 허리를 살짝 아치형으로 만들며 가슴을 내밉니다. 이것이 시작 자세입니다.",
    "어깨와 위팔을 아래·뒤로 당기며 철봉이 윗가슴에 닿을 때까지 몸을 끌어올립니다. 이때 숨을 내쉽니다. 완전히 수축된 지점에서 등 근육을 조이는 데 집중하세요. 상체는 고정된 채 움직이고 팔만 움직여야 하며, 전완은 철봉을 잡는 역할만 합니다.",
    "수축 자세에서 1초 유지한 뒤, 숨을 들이마시며 팔이 완전히 펴지고 광배가 충분히 늘어날 때까지 천천히 내려옵니다.",
    "정해진 횟수만큼 반복합니다."
  ],
  "noteKo": "어깨너비 그립이 어깨에 부담이 적어요. 올라가기 전에 어깨를 먼저 아래로 끌어내리고, 팔꿈치를 옆구리로 내리꽂는다는 느낌으로 당기세요.",
    "images": [require('../../repup-exercise-data/images/pull-up/0.jpg'), require('../../repup-exercise-data/images/pull-up/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/pull-up/0.jpg'), require('../../repup-exercise-data/thumbs/pull-up/1.jpg')],
  },
  {
  "id": "chin-up",
  "nameKo": "친업",
  "nameEn": "Chin-Up",
  "category": "pull",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "광배"
  ],
  "secondaryMuscles": [
    "이두",
    "전완",
    "등 중앙"
  ],
  "highlight": [
    {
      "slug": "upper-back",
      "intensity": 2
    },
    {
      "slug": "biceps",
      "intensity": 1
    },
    {
      "slug": "forearm",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "손바닥이 몸을 향하게 하고 어깨너비보다 좁게 철봉을 잡습니다.",
    "팔을 뻗어 매달린 상태에서 상체를 최대한 곧게 세우고, 허리를 살짝 아치형으로 만들며 가슴을 내밉니다. 이것이 시작 자세입니다. 상체를 곧게 세울수록 등보다 이두 자극이 커집니다.",
    "숨을 내쉬며 머리가 철봉 높이 정도에 올 때까지 몸을 끌어올립니다. 이두를 사용하는 데 집중하고 팔꿈치는 몸에 붙입니다. 상체는 고정된 채 움직이고 팔만 움직이며, 전완은 철봉을 잡는 역할만 합니다.",
    "수축 자세에서 1초 동안 이두를 조인 뒤, 숨을 들이마시며 팔이 완전히 펴질 때까지 천천히 내려옵니다.",
    "정해진 횟수만큼 반복합니다."
  ],
  "noteKo": "손목·팔꿈치가 불편하면 W형 바의 꺾인 부분을 잡아보세요.",
    "images": [require('../../repup-exercise-data/images/chin-up/0.jpg'), require('../../repup-exercise-data/images/chin-up/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/chin-up/0.jpg'), require('../../repup-exercise-data/thumbs/chin-up/1.jpg')],
  },
  {
  "id": "one-arm-dumbbell-row",
  "nameKo": "원암 덤벨 로우",
  "nameEn": "One-Arm Dumbbell Row",
  "category": "pull",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "등 중앙"
  ],
  "secondaryMuscles": [
    "이두",
    "광배",
    "어깨"
  ],
  "highlight": [
    {
      "slug": "upper-back",
      "intensity": 2
    },
    {
      "slug": "biceps",
      "intensity": 1
    },
    {
      "slug": "deltoids",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "평평한 벤치 양옆에 덤벨을 하나씩 둡니다.",
    "오른쪽 무릎을 벤치 끝에 올리고, 상체가 바닥과 평행이 될 때까지 허리를 숙인 뒤 오른손으로 벤치 반대쪽을 짚어 몸을 지탱합니다.",
    "허리를 곧게 편 채 왼손으로 바닥의 덤벨을 들어 올립니다. 손바닥은 몸을 향합니다. 이것이 시작 자세입니다.",
    "위팔을 옆구리에 붙이고 상체를 고정한 채 덤벨을 가슴 옆까지 곧게 당겨 올립니다. 이때 숨을 내쉽니다. 완전히 수축된 지점에서 등 근육을 조이고, 팔이 아닌 등 근육으로 당기는 데 집중하세요. 전완은 덤벨을 잡는 역할만 합니다.",
    "숨을 들이마시며 덤벨을 시작 자세로 곧게 내립니다.",
    "정해진 횟수만큼 반복합니다.",
    "반대쪽으로 바꿔 같은 방법으로 반복합니다."
  ],
  "noteKo": "벤치 대신 의자나 침대에 손과 무릎을 짚어도 됩니다.",
    "images": [require('../../repup-exercise-data/images/one-arm-dumbbell-row/0.jpg'), require('../../repup-exercise-data/images/one-arm-dumbbell-row/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/one-arm-dumbbell-row/0.jpg'), require('../../repup-exercise-data/thumbs/one-arm-dumbbell-row/1.jpg')],
  },
  {
  "id": "dumbbell-reverse-fly",
  "nameKo": "덤벨 리버스 플라이",
  "nameEn": "Seated Bent-Over Rear Delt Raise",
  "category": "pull",
  "type": "reps",
  "level": "intermediate",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "어깨"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "deltoids",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "평평한 벤치 앞에 덤벨 두 개를 앞을 향하게 둡니다.",
    "다리를 모으고 벤치 끝에 앉아 덤벨이 종아리 뒤쪽에 오게 합니다.",
    "등을 곧게 편 채 허리를 숙여 덤벨을 집습니다. 손바닥은 서로 마주 보게 합니다. 이것이 시작 자세입니다.",
    "상체를 앞으로 숙인 채 고정하고 팔꿈치를 살짝 굽힌 상태로, 양팔이 바닥과 평행이 될 때까지 덤벨을 옆으로 곧게 들어 올립니다. 올리면서 숨을 내쉽니다. 상체를 흔들거나 팔을 옆이 아닌 뒤로 당기지 않도록 주의합니다.",
    "위에서 1초 수축한 뒤 천천히 시작 자세로 내립니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "의자 끝에 앉아서 하거나, 서서 상체를 숙여 해도 같은 동작입니다.",
    "images": [require('../../repup-exercise-data/images/dumbbell-reverse-fly/0.jpg'), require('../../repup-exercise-data/images/dumbbell-reverse-fly/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-reverse-fly/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-reverse-fly/1.jpg')],
  },
  {
  "id": "dumbbell-curl",
  "nameKo": "덤벨 컬",
  "nameEn": "Dumbbell Bicep Curl",
  "category": "pull",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "이두"
  ],
  "secondaryMuscles": [
    "전완"
  ],
  "highlight": [
    {
      "slug": "biceps",
      "intensity": 2
    },
    {
      "slug": "forearm",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "양손에 덤벨을 들고 팔을 늘어뜨린 채 곧게 섭니다. 팔꿈치는 몸통에 붙이고 손바닥이 앞을 향하게 돌립니다. 이것이 시작 자세입니다.",
    "위팔을 고정한 채 숨을 내쉬며 이두를 수축해 덤벨을 들어 올립니다. 이두가 완전히 수축되고 덤벨이 어깨 높이에 올 때까지 올린 뒤, 잠깐 멈추며 이두를 조입니다.",
    "숨을 들이마시며 천천히 덤벨을 시작 자세로 내립니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/dumbbell-curl/0.jpg'), require('../../repup-exercise-data/images/dumbbell-curl/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-curl/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-curl/1.jpg')],
  },
  {
  "id": "hammer-curl",
  "nameKo": "해머 컬",
  "nameEn": "Hammer Curl",
  "category": "pull",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "이두"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "biceps",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "상체를 곧게 세우고 양손에 덤벨을 들어 팔을 늘어뜨립니다. 팔꿈치는 몸통에 가깝게 둡니다.",
    "손바닥이 몸을 향하게 합니다. 이것이 시작 자세입니다.",
    "위팔을 고정한 채 숨을 내쉬며 이두를 수축해 덤벨을 앞으로 들어 올립니다. 이두가 완전히 수축되고 덤벨이 어깨 높이에 올 때까지 올린 뒤 잠깐 멈추며 이두를 조입니다. 팔꿈치는 고정하고 전완만 움직이세요.",
    "잠깐 멈춘 뒤 숨을 들이마시며 천천히 시작 자세로 내립니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/hammer-curl/0.jpg'), require('../../repup-exercise-data/images/hammer-curl/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/hammer-curl/0.jpg'), require('../../repup-exercise-data/thumbs/hammer-curl/1.jpg')],
  },
  {
  "id": "dead-hang",
  "nameKo": "매달려 버티기",
  "nameEn": "Dead Hang",
  "category": "pull",
  "type": "time",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "전완",
    "광배"
  ],
  "secondaryMuscles": [
    "어깨"
  ],
  "highlight": [
    {
      "slug": "forearm",
      "intensity": 2
    },
    {
      "slug": "upper-back",
      "intensity": 2
    },
    {
      "slug": "deltoids",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "back"
  ],
  "instructionsKo": [
    "어깨너비 정도로 철봉을 잡고 팔을 완전히 편 채 매달립니다.",
    "어깨가 귀 쪽으로 너무 올라가지 않도록 살짝 끌어내린 상태를 유지합니다.",
    "몸이 흔들리지 않게 복부에 힘을 주고 정해진 시간 동안 버팁니다.",
    "발을 바닥에 내려 천천히 내려옵니다."
  ],
  "noteKo": "free-exercise-db에 양손 매달리기 항목이 없어 직접 작성한 설명입니다. 이미지가 없습니다.",
    "images": [],
    "thumbs": [],
  },
  {
  "id": "dumbbell-squat",
  "nameKo": "덤벨 스쿼트",
  "nameEn": "Dumbbell Squat",
  "category": "legs",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "대퇴사두"
  ],
  "secondaryMuscles": [
    "종아리",
    "둔근",
    "햄스트링",
    "허리"
  ],
  "highlight": [
    {
      "slug": "quadriceps",
      "intensity": 2
    },
    {
      "slug": "calves",
      "intensity": 1
    },
    {
      "slug": "gluteal",
      "intensity": 1
    },
    {
      "slug": "hamstring",
      "intensity": 1
    },
    {
      "slug": "lower-back",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "양손에 덤벨을 하나씩 들고 곧게 섭니다(손바닥이 다리 옆을 향하게).",
    "발은 어깨너비로 벌리고 발끝은 살짝 바깥을 향하게 합니다. 시선은 항상 앞을 보고(아래를 보면 균형을 잃기 쉽습니다) 등을 곧게 유지합니다. 이것이 시작 자세입니다.",
    "고개를 들고 곧은 자세를 유지하며 무릎을 굽혀 천천히 몸을 내립니다. 허벅지가 바닥과 평행이 될 때까지 내려갑니다.",
    "숨을 내쉬며 주로 발뒤꿈치로 바닥을 밀어 다리를 펴고 시작 자세로 돌아옵니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "원문에는 '무릎이 발끝을 넘으면 안 된다'는 팁이 있지만, 최근에는 발 전체로 무게를 지지하고 무릎이 발끝 방향과 일치하면 발끝을 넘어도 괜찮다고 봅니다.",
    "images": [require('../../repup-exercise-data/images/dumbbell-squat/0.jpg'), require('../../repup-exercise-data/images/dumbbell-squat/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-squat/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-squat/1.jpg')],
  },
  {
  "id": "bulgarian-split-squat",
  "nameKo": "불가리안 스플릿 스쿼트",
  "nameEn": "Split Squat with Dumbbells",
  "category": "legs",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "대퇴사두"
  ],
  "secondaryMuscles": [
    "둔근",
    "햄스트링"
  ],
  "highlight": [
    {
      "slug": "quadriceps",
      "intensity": 2
    },
    {
      "slug": "gluteal",
      "intensity": 1
    },
    {
      "slug": "hamstring",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "뒷발을 높은 곳에 올리고 앞발은 앞으로 내딛어 앞뒤로 벌린 자세를 만듭니다.",
    "양손에 덤벨을 들어 몸 옆에 늘어뜨립니다. 이것이 시작 자세입니다.",
    "무릎과 고관절을 굽혀 몸을 내립니다. 동작 내내 바른 자세를 유지하고, 앞 무릎이 발과 같은 방향을 향하게 합니다.",
    "가장 아래에서 뒤꿈치로 밀어 무릎과 고관절을 펴며 시작 자세로 돌아옵니다."
  ],
  "noteKo": "뒷발은 의자나 침대에 올리면 됩니다. 한쪽 세트를 마친 뒤 다리를 바꿔 반복하세요.",
    "images": [require('../../repup-exercise-data/images/bulgarian-split-squat/0.jpg'), require('../../repup-exercise-data/images/bulgarian-split-squat/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/bulgarian-split-squat/0.jpg'), require('../../repup-exercise-data/thumbs/bulgarian-split-squat/1.jpg')],
  },
  {
  "id": "dumbbell-romanian-deadlift",
  "nameKo": "덤벨 루마니안 데드리프트",
  "nameEn": "Stiff-Legged Dumbbell Deadlift",
  "category": "legs",
  "type": "reps",
  "level": "beginner",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "햄스트링"
  ],
  "secondaryMuscles": [
    "둔근",
    "허리"
  ],
  "highlight": [
    {
      "slug": "hamstring",
      "intensity": 2
    },
    {
      "slug": "gluteal",
      "intensity": 1
    },
    {
      "slug": "lower-back",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "back"
  ],
  "instructionsKo": [
    "덤벨 두 개를 잡고 팔을 늘어뜨려 몸 옆에 둡니다.",
    "상체를 곧게 세우고 발은 어깨너비 또는 그보다 좁게 섭니다. 무릎은 살짝 굽힙니다. 이것이 시작 자세입니다.",
    "무릎 각도를 유지한 채 등을 곧게 펴고 허리를 숙여 덤벨을 발등 위까지 내립니다. 바닥의 물건을 집듯 계속 숙이다가 햄스트링이 늘어나는 느낌이 들면 멈춥니다. 이때 숨을 내쉽니다.",
    "고관절과 허리를 펴며 상체를 다시 곧게 세워 시작 자세로 돌아옵니다. 이때 숨을 들이마십니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "원문은 스티프 레그 데드리프트예요. 루마니안 데드리프트는 거의 같지만 엉덩이를 뒤로 빼는 느낌을 더 강조하고, 덤벨이 허벅지를 따라 내려갑니다.",
    "images": [require('../../repup-exercise-data/images/dumbbell-romanian-deadlift/0.jpg'), require('../../repup-exercise-data/images/dumbbell-romanian-deadlift/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/dumbbell-romanian-deadlift/0.jpg'), require('../../repup-exercise-data/thumbs/dumbbell-romanian-deadlift/1.jpg')],
  },
  {
  "id": "single-leg-romanian-deadlift",
  "nameKo": "싱글 레그 루마니안 데드리프트",
  "nameEn": "One-Legged Deadlift",
  "category": "legs",
  "type": "reps",
  "level": "intermediate",
  "equipment": "kettlebells",
  "primaryMuscles": [
    "햄스트링"
  ],
  "secondaryMuscles": [
    "둔근",
    "허리"
  ],
  "highlight": [
    {
      "slug": "hamstring",
      "intensity": 2
    },
    {
      "slug": "gluteal",
      "intensity": 1
    },
    {
      "slug": "lower-back",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "back"
  ],
  "instructionsKo": [
    "한 손으로 케틀벨 손잡이를 잡습니다. 케틀벨을 든 쪽과 같은 쪽 다리로 한 발 서기를 합니다.",
    "그 다리의 무릎을 살짝 굽힌 채 고관절을 접어 스티프 레그 데드리프트를 하며, 반대쪽 다리는 균형을 위해 뒤로 뻗습니다.",
    "상체가 바닥과 평행이 될 때까지 케틀벨을 내린 뒤, 다시 곧게 선 자세로 돌아옵니다."
  ],
  "noteKo": "원문은 케틀벨 동작이에요. 덤벨 하나를 한 손에 들거나 양손에 하나씩 들고 해도 됩니다.",
    "images": [require('../../repup-exercise-data/images/single-leg-romanian-deadlift/0.jpg'), require('../../repup-exercise-data/images/single-leg-romanian-deadlift/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/single-leg-romanian-deadlift/0.jpg'), require('../../repup-exercise-data/thumbs/single-leg-romanian-deadlift/1.jpg')],
  },
  {
  "id": "reverse-lunge",
  "nameKo": "리버스 런지",
  "nameEn": "Dumbbell Rear Lunge",
  "category": "legs",
  "type": "reps",
  "level": "intermediate",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "대퇴사두"
  ],
  "secondaryMuscles": [
    "종아리",
    "둔근",
    "햄스트링"
  ],
  "highlight": [
    {
      "slug": "quadriceps",
      "intensity": 2
    },
    {
      "slug": "calves",
      "intensity": 1
    },
    {
      "slug": "gluteal",
      "intensity": 1
    },
    {
      "slug": "hamstring",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "상체를 곧게 세우고 양손에 덤벨을 들어 몸 옆에 둡니다. 이것이 시작 자세입니다.",
    "오른발을 왼발에서 약 60cm 정도 뒤로 내딛으며, 상체를 곧게 세우고 균형을 유지한 채 몸을 내립니다. 내려가면서 숨을 들이마십니다. 앞쪽 정강이는 바닥과 수직을 유지하고, 상체를 곧게 세우세요(고관절 굴곡근의 유연성이 중요합니다). 보폭이 길면 둔근, 짧으면 대퇴사두에 더 자극이 갑니다.",
    "숨을 내쉬며 밀어 올려 시작 자세로 돌아옵니다. 발 앞쪽으로 밀면 대퇴사두, 뒤꿈치로 밀면 둔근에 더 집중됩니다.",
    "반대쪽 다리로 반복합니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/reverse-lunge/0.jpg'), require('../../repup-exercise-data/images/reverse-lunge/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/reverse-lunge/0.jpg'), require('../../repup-exercise-data/thumbs/reverse-lunge/1.jpg')],
  },
  {
  "id": "glute-bridge",
  "nameKo": "글루트 브릿지",
  "nameEn": "Glute Bridge",
  "category": "legs",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "둔근"
  ],
  "secondaryMuscles": [
    "햄스트링"
  ],
  "highlight": [
    {
      "slug": "gluteal",
      "intensity": 2
    },
    {
      "slug": "hamstring",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "back"
  ],
  "instructionsKo": [
    "바닥에 등을 대고 누워 손은 몸 옆에 두고 무릎을 굽힙니다. 발은 어깨너비 정도로 둡니다. 이것이 시작 자세입니다.",
    "주로 뒤꿈치로 바닥을 밀며 등을 곧게 유지한 채 엉덩이를 바닥에서 들어 올립니다. 이때 숨을 내쉬고, 위에서 1초 유지합니다.",
    "숨을 들이마시며 천천히 시작 자세로 돌아옵니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/glute-bridge/0.jpg'), require('../../repup-exercise-data/images/glute-bridge/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/glute-bridge/0.jpg'), require('../../repup-exercise-data/thumbs/glute-bridge/1.jpg')],
  },
  {
  "id": "single-leg-glute-bridge",
  "nameKo": "싱글 레그 글루트 브릿지",
  "nameEn": "Single Leg Glute Bridge",
  "category": "legs",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "둔근"
  ],
  "secondaryMuscles": [
    "햄스트링"
  ],
  "highlight": [
    {
      "slug": "gluteal",
      "intensity": 2
    },
    {
      "slug": "hamstring",
      "intensity": 1
    }
  ],
  "bodyViews": [
    "back"
  ],
  "instructionsKo": [
    "바닥에 누워 발바닥을 바닥에 대고 무릎을 굽힙니다.",
    "한쪽 다리를 바닥에서 들어 무릎을 가슴 쪽으로 당깁니다. 이것이 시작 자세입니다.",
    "바닥에 있는 발의 뒤꿈치로 밀어 고관절을 위로 펴며 엉덩이를 바닥에서 들어 올립니다.",
    "최대한 들어 올린 뒤 잠깐 멈추고 시작 자세로 돌아옵니다."
  ],
  "noteKo": null,
    "images": [require('../../repup-exercise-data/images/single-leg-glute-bridge/0.jpg'), require('../../repup-exercise-data/images/single-leg-glute-bridge/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/single-leg-glute-bridge/0.jpg'), require('../../repup-exercise-data/thumbs/single-leg-glute-bridge/1.jpg')],
  },
  {
  "id": "calf-raise",
  "nameKo": "카프레이즈",
  "nameEn": "Standing Dumbbell Calf Raise",
  "category": "legs",
  "type": "reps",
  "level": "intermediate",
  "equipment": "dumbbell",
  "primaryMuscles": [
    "종아리"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "calves",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front",
    "back"
  ],
  "instructionsKo": [
    "상체를 곧게 세우고 양손에 덤벨을 들어 몸 옆에 둡니다. 5~8cm 높이의 튼튼한 받침 위에 발 앞쪽을 올리고, 뒤꿈치는 받침 밖으로 내려 바닥에 닿게 합니다. 이것이 시작 자세입니다.",
    "발끝을 정면(전체 균형 있게), 안쪽(바깥쪽 갈래 강조), 또는 바깥쪽(안쪽 갈래 강조)으로 두고, 종아리를 수축하며 숨을 내쉬면서 뒤꿈치를 들어 올립니다. 가장 위에서 1초 유지합니다.",
    "숨을 들이마시며 천천히 뒤꿈치를 내려 시작 자세로 돌아옵니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "받침 대신 계단 끝을 활용해도 됩니다.",
    "images": [require('../../repup-exercise-data/images/calf-raise/0.jpg'), require('../../repup-exercise-data/images/calf-raise/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/calf-raise/0.jpg'), require('../../repup-exercise-data/thumbs/calf-raise/1.jpg')],
  },
  {
  "id": "leg-raise",
  "nameKo": "레그레이즈",
  "nameEn": "Lying Leg Raise",
  "category": "core",
  "type": "reps",
  "level": "beginner",
  "equipment": "body only",
  "primaryMuscles": [
    "복근"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "abs",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "벤치에 등을 평평하게 대고 누워 다리를 벤치 끝 밖으로 뻗습니다.",
    "손은 손바닥을 아래로 해서 엉덩이 밑에 두거나, 몸 옆에서 벤치를 잡습니다. 이것이 시작 자세입니다.",
    "무릎을 살짝 굽힌 채 고정하고 다리를 최대한 곧게 편 상태로, 다리가 바닥과 90도가 될 때까지 들어 올립니다. 올리면서 숨을 내쉬고 위에서 1초 유지합니다.",
    "숨을 들이마시며 천천히 다리를 시작 자세로 내립니다."
  ],
  "noteKo": "원문은 벤치 위 동작이에요. 집에서는 바닥에 누워서 해도 되며, 허리가 뜨지 않게 바닥에 붙이고 하세요.",
    "images": [require('../../repup-exercise-data/images/leg-raise/0.jpg'), require('../../repup-exercise-data/images/leg-raise/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/leg-raise/0.jpg'), require('../../repup-exercise-data/thumbs/leg-raise/1.jpg')],
  },
  {
  "id": "hanging-knee-raise",
  "nameKo": "행잉 니레이즈",
  "nameEn": "Hanging Leg Raise",
  "category": "core",
  "type": "reps",
  "level": "expert",
  "equipment": "body only",
  "primaryMuscles": [
    "복근"
  ],
  "secondaryMuscles": [],
  "highlight": [
    {
      "slug": "abs",
      "intensity": 2
    }
  ],
  "bodyViews": [
    "front"
  ],
  "instructionsKo": [
    "넓은 그립이나 중간 그립으로 철봉을 잡고 팔을 완전히 편 채 매달립니다. 다리는 아래로 곧게 내리고 골반은 살짝 뒤로 말아 둡니다. 이것이 시작 자세입니다.",
    "상체와 다리가 90도가 될 때까지 다리를 들어 올립니다. 올리면서 숨을 내쉬고 1초 정도 유지합니다.",
    "숨을 들이마시며 천천히 시작 자세로 돌아옵니다.",
    "권장 횟수만큼 반복합니다."
  ],
  "noteKo": "원문은 다리를 편 채 올리는 행잉 레그레이즈(고급)예요. 니레이즈는 무릎을 굽혀 가슴 쪽으로 당기는 쉬운 버전입니다.",
    "images": [require('../../repup-exercise-data/images/hanging-knee-raise/0.jpg'), require('../../repup-exercise-data/images/hanging-knee-raise/1.jpg')],
    "thumbs": [require('../../repup-exercise-data/thumbs/hanging-knee-raise/0.jpg'), require('../../repup-exercise-data/thumbs/hanging-knee-raise/1.jpg')],
  },
];
