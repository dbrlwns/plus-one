import { useEffect, useReducer, useRef } from 'react';
import { BackHandler, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { playCue } from '../feedback';
import { useAppData } from '../state/AppData';
import { useTheme } from '../theme';
import { unitOf } from '../data/exercises';
import { formatClock, formatDuration } from '../utils/date';
import { confirmAction } from '../utils/confirm';
import {
  buildRecord,
  createInitialState,
  isLastExercise,
  isLastSet,
  TEMPO_MAX,
  clampTempo,
  currentTempo,
  TEMPO_MIN,
  TEMPO_STEP,
  workoutReducer,
  type PlanItem,
} from '../workout/machine';
import { Body, Btn, Card, Heading, Sub } from './ui';

const KEEP_AWAKE_TAG = 'workout-session';
const TICK_MS = 500;

/** 0.5초 단위 틱. 백그라운드에서 타이머가 늦게 돌아도 밀린 만큼 따라잡는다. */
function useTicker(running: boolean, onTick: () => void) {
  const cb = useRef(onTick);
  useEffect(() => {
    cb.current = onTick;
  });
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const id = setInterval(() => {
      const owed = Math.min(Math.floor((Date.now() - last) / TICK_MS), 240);
      if (owed <= 0) return;
      last += owed * TICK_MS;
      for (let i = 0; i < owed; i++) cb.current();
    }, 100);
    return () => clearInterval(id);
  }, [running]);
}

export function WorkoutSession({ plan, onExit }: { plan: PlanItem[]; onExit: () => void }) {
  const t = useTheme();
  const { settings, addRecord, updateSettings } = useAppData();
  const [state, dispatch] = useReducer(workoutReducer, undefined, () =>
    createInitialState(plan, settings.restSec, settings.tempos ?? {}),
  );

  // 운동 중 화면 꺼짐 방지
  useEffect(() => {
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    return () => {
      void deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, []);

  // 운동 탭의 [시작]을 누르면 바로 3·2·1 카운트다운부터 시작한다
  useEffect(() => {
    dispatch({ type: 'START', now: Date.now() });
  }, []);

  const ticking = state.phase === 'countdown' || state.phase === 'active' || state.phase === 'rest';
  useTicker(ticking, () => dispatch({ type: 'TICK' }));

  // 소리/진동
  const cueN = state.cue?.n;
  useEffect(() => {
    if (state.cue) playCue(state.cue.kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cueN]);

  // 요약 화면에 들어가면 기록을 한 번 저장
  const saved = useRef(false);
  useEffect(() => {
    if (state.phase !== 'summary' || saved.current) return;
    saved.current = true;
    const record = buildRecord(state);
    if (record) addRecord(record);
  }, [state, addRecord]);

  const setTempo = (tempoSec: number) => {
    dispatch({ type: 'SET_TEMPO', tempoSec });
    // 운동별로 저장해서 다음에 같은 운동을 하면 그 템포로 시작한다
    updateSettings({ tempos: { ...settings.tempos, [item.exerciseId]: clampTempo(tempoSec) } });
  };

  const item = state.plan[state.exIdx];
  const unit = unitOf(item.type);
  const tempo = currentTempo(state);
  const setLabel = `세트 ${state.setIdx + 1} / ${item.sets}`;
  const nextEx = state.plan[state.exIdx + 1];

  const abort = () =>
    confirmAction('운동 종료', '지금까지 한 기록을 저장하고 운동을 끝낼까요?', () => dispatch({ type: 'ABORT' }));

  // 뒤로가기(안드로이드 하드웨어 키 / 웹 브라우저 뒤로가기)
  // - 요약 화면, 시작 전 준비 화면: 그냥 나간다
  // - 운동 중: "운동 종료" 버튼과 똑같이 기록 저장 후 끝낼지 묻는다
  const backRef = useRef<() => void>(() => {});
  useEffect(() => {
    backRef.current = state.phase === 'summary' || state.phase === 'ready' ? onExit : abort;
  });
  useEffect(() => {
    if (Platform.OS === 'android') {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        backRef.current();
        return true;
      });
      return () => sub.remove();
    }
    if (Platform.OS === 'web') {
      // 같은 주소의 기록을 하나 쌓아두고, 뒤로가기가 눌리면(popstate) 다시 쌓아서 페이지가 바뀌지 않게 한다
      window.history.pushState({ workout: true }, '');
      const onPop = () => {
        window.history.pushState({ workout: true }, '');
        backRef.current();
      };
      window.addEventListener('popstate', onPop);
      return () => window.removeEventListener('popstate', onPop);
    }
  }, []);

  if (state.phase === 'summary') {
    const doneAny = state.results.some((r) => r.length > 0);
    return (
      <ScrollView contentContainerStyle={styles.summary}>
        <Heading>운동 완료 🎉</Heading>
        <Body style={{ fontSize: 20 }}>총 운동 시간 {formatDuration(state.elapsed)}</Body>
        {doneAny ? (
          state.plan.map((p, i) =>
            state.results[i].length === 0 ? null : (
              <Card key={i} style={{ gap: 4 }}>
                <Body style={{ fontWeight: '800', fontSize: 18 }}>{p.name}</Body>
                <Sub>
                  {state.results[i].map((n, si) => `${si + 1}세트 ${n}${unitOf(p.type)}`).join(' · ')}
                </Sub>
              </Card>
            ),
          )
        ) : (
          <Sub>수행한 세트가 없어 기록이 저장되지 않았습니다.</Sub>
        )}
        {doneAny ? <Sub>기록이 달력에 저장되었습니다.</Sub> : null}
        <Btn title="확인" size="xl" onPress={onExit} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Sub>
            운동 {state.exIdx + 1} / {state.plan.length} · 경과 {formatClock(state.elapsed)}
          </Sub>
          <Text style={[styles.exName, { color: t.text }]}>{item.name}</Text>
        </View>
        <Btn title="운동 종료" kind="ghost" size="sm" onPress={abort} />
      </View>

      {item.type === 'reps' && state.phase !== 'transition' ? (
        <View style={[styles.tempoRow, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={{ color: t.subtext, fontSize: 15, fontWeight: '700' }}>템포</Text>
          <Btn
            title="−"
            kind="secondary"
            size="sm"
            disabled={tempo <= TEMPO_MIN}
            onPress={() => setTempo(tempo - TEMPO_STEP)}
          />
          <Text style={{ color: t.text, fontSize: 20, fontWeight: '800', minWidth: 64, textAlign: 'center' }}>
            {tempo}초
          </Text>
          <Btn
            title="+"
            kind="secondary"
            size="sm"
            disabled={tempo >= TEMPO_MAX}
            onPress={() => setTempo(tempo + TEMPO_STEP)}
          />
          <Sub>{item.name} 반복 1회당</Sub>
        </View>
      ) : null}

      <View style={styles.center}>
        {state.phase === 'ready' && (
          <>
            <Text style={[styles.label, { color: t.subtext }]}>{setLabel}</Text>
            <Text style={[styles.mid, { color: t.text }]}>
              목표 {item.target}
              {unit}
            </Text>
            <Sub>
              세트 사이 휴식 {settings.restSec}초
            </Sub>
          </>
        )}

        {state.phase === 'countdown' && (
          <>
            <Text style={[styles.label, { color: t.subtext }]}>{setLabel} 준비</Text>
            <Text style={[styles.huge, { color: t.warn }]}>{state.countdown}</Text>
          </>
        )}

        {state.phase === 'active' && (
          <>
            <Text style={[styles.label, { color: t.subtext }]}>{setLabel}</Text>
            <Text style={[styles.huge, { color: t.primary }]}>{state.count}</Text>
            <Text style={[styles.mid, { color: t.subtext }]}>
              / {item.target}
              {unit}
            </Text>
          </>
        )}

        {state.phase === 'rest' && (
          <>
            <Text style={[styles.label, { color: t.subtext }]}>휴식</Text>
            <Text style={[styles.huge, styles.clock, { color: t.success }]}>{formatClock(state.restLeft)}</Text>
            <Sub style={{ fontSize: 18 }}>
              {isLastSet(state) && !isLastExercise(state)
                ? `다음 운동: ${nextEx.name}`
                : `다음: 세트 ${state.setIdx + 2} / ${item.sets}`}
            </Sub>
          </>
        )}

        {state.phase === 'transition' && (
          <>
            <Text style={[styles.label, { color: t.subtext }]}>{item.name} 완료!</Text>
            <Text style={[styles.mid, { color: t.subtext }]}>다음 운동</Text>
            <Text style={[styles.exNext, { color: t.text }]}>{nextEx.name}</Text>
            <Sub style={{ fontSize: 16 }}>
              {nextEx.sets}세트 × {nextEx.target}
              {unitOf(nextEx.type)}
            </Sub>
          </>
        )}
      </View>

      <View style={styles.bottom}>
        {state.phase === 'ready' && <Btn title="시작" size="xl" onPress={() => dispatch({ type: 'START', now: Date.now() })} />}
        {state.phase === 'active' && (
          <Btn title="여기서 종료" kind="secondary" size="xl" onPress={() => dispatch({ type: 'END_SET' })} />
        )}
        {state.phase === 'rest' && (
          <>
            <Btn title="+30초" kind="secondary" size="xl" onPress={() => dispatch({ type: 'ADD_REST', sec: 30 })} />
            <Btn title="휴식 건너뛰기" size="xl" onPress={() => dispatch({ type: 'SKIP_REST' })} />
          </>
        )}
        {state.phase === 'transition' && (
          <Btn title="확인" size="xl" onPress={() => dispatch({ type: 'CONFIRM_NEXT' })} />
        )}
        {state.phase !== 'ready' && (
          <Btn
            title="운동 초기화 (세트 다시 하기)"
            kind="ghost"
            onPress={() => dispatch({ type: 'RESET_SET' })}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  exName: { fontSize: 28, fontWeight: '800', marginTop: 2 },
  exNext: { fontSize: 36, fontWeight: '900', textAlign: 'center' },
  tempoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    marginTop: 12,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 22, fontWeight: '700' },
  huge: { fontSize: 168, fontWeight: '900', lineHeight: 190, fontVariant: ['tabular-nums'] },
  clock: { fontSize: 112, lineHeight: 130 },
  mid: { fontSize: 34, fontWeight: '800' },
  bottom: { gap: 12, paddingBottom: 8 },
  summary: { padding: 16, gap: 14 },
});
