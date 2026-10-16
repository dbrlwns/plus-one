import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import {
  clearAll,
  defaultRoutine,
  defaultSettings,
  loadRecords,
  loadRoutine,
  loadSettings,
  saveRecords,
  saveRoutine,
  saveSettings,
} from '../storage/storage';
import type { Routine, Settings, WorkoutRecord } from '../types';

interface AppData {
  ready: boolean;
  settings: Settings;
  routine: Routine;
  records: WorkoutRecord[];
  updateSettings: (patch: Partial<Settings>) => void;
  setRoutine: (next: Routine | ((prev: Routine) => Routine)) => void;
  addRecord: (record: WorkoutRecord) => void;
  resetAll: () => Promise<void>;
}

const Ctx = createContext<AppData | null>(null);

const SAVE_DELAY_MS = 400;

/**
 * 값이 바뀔 때마다 바로 저장하면 +/- 버튼을 연타할 때 저장(JSON 변환 + 디스크 쓰기)이 매번 일어난다.
 * 마지막 변경 후 잠깐 기다렸다가 한 번만 저장하고, 앱이 백그라운드로 가거나 닫힐 때는 바로 저장한다.
 */
function useDebouncedSave<T>(value: T, ready: boolean, save: (v: T) => Promise<void>) {
  const latest = useRef(value);
  const dirty = useRef(false);

  const flush = useCallback(() => {
    if (!dirty.current) return;
    dirty.current = false;
    void save(latest.current);
  }, [save]);

  useEffect(() => {
    if (!ready) return;
    latest.current = value;
    dirty.current = true;
    const id = setTimeout(flush, SAVE_DELAY_MS);
    return () => clearTimeout(id);
  }, [value, ready, flush]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') flush();
    });
    return () => {
      sub.remove();
      flush();
    };
  }, [flush]);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [routine, setRoutineState] = useState<Routine>(defaultRoutine);
  const [records, setRecords] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, r, rec] = await Promise.all([loadSettings(), loadRoutine(), loadRecords()]);
      if (!alive) return;
      setSettings(s);
      setRoutineState(r);
      setRecords(rec);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 상태가 바뀌면 잠깐 모았다가 저장 (불러오기 전에는 덮어쓰지 않는다)
  useDebouncedSave(settings, ready, saveSettings);
  useDebouncedSave(routine, ready, saveRoutine);
  useDebouncedSave(records, ready, saveRecords);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setRoutine = useCallback((next: Routine | ((prev: Routine) => Routine)) => {
    setRoutineState(next);
  }, []);

  const addRecord = useCallback((record: WorkoutRecord) => {
    setRecords((prev) => [...prev.filter((r) => r.id !== record.id), record]);
  }, []);

  const resetAll = useCallback(async () => {
    await clearAll();
    setSettings(defaultSettings());
    setRoutineState(defaultRoutine());
    setRecords([]);
  }, []);

  const value = useMemo(
    () => ({ ready, settings, routine, records, updateSettings, setRoutine, addRecord, resetAll }),
    [ready, settings, routine, records, updateSettings, setRoutine, addRecord, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData(): AppData {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppDataProvider가 필요합니다');
  return v;
}
