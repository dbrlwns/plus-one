import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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

  // 상태가 바뀔 때마다 저장 (불러오기 전에는 덮어쓰지 않는다)
  useEffect(() => {
    if (ready) void saveSettings(settings);
  }, [ready, settings]);
  useEffect(() => {
    if (ready) void saveRoutine(routine);
  }, [ready, routine]);
  useEffect(() => {
    if (ready) void saveRecords(records);
  }, [ready, records]);

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
