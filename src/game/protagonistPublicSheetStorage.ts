import { createEmptyProtagonistPublicSheetDraft, type ProtagonistPublicSheetDraft } from './components/ClosedScriptScenarioSheet';

const PUBLIC_SHEET_STORAGE_PREFIX = 'tl-public-sheet';

/** 含模组 ID，避免同剧本 id 换模组后草稿错位；未传 moduleId 时与旧版键一致 */
export function publicSheetStorageKey(playerId: string, scenarioId: string, moduleId?: string): string {
  const base = `${PUBLIC_SHEET_STORAGE_PREFIX}:${encodeURIComponent(playerId)}:${encodeURIComponent(scenarioId)}`;
  if (moduleId && moduleId.trim()) {
    return `${base}:${encodeURIComponent(moduleId)}`;
  }
  return base;
}

export function loadProtagonistPublicSheetDraft(
  playerId: string,
  scenarioId: string,
  moduleId?: string,
): ProtagonistPublicSheetDraft {
  const empty = createEmptyProtagonistPublicSheetDraft();
  if (typeof window === 'undefined') return empty;
  try {
    const keysTryOrder =
      moduleId && moduleId.trim()
        ? [publicSheetStorageKey(playerId, scenarioId, moduleId), publicSheetStorageKey(playerId, scenarioId)]
        : [publicSheetStorageKey(playerId, scenarioId)];
    let raw: string | null = null;
    for (const k of keysTryOrder) {
      raw = sessionStorage.getItem(k);
      if (raw) break;
    }
    if (!raw) return empty;
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (typeof o !== 'object' || o === null) return empty;
    const cast: Record<string, string> = {};
    if (
      typeof o.castRoleByNpcId === 'object' &&
      o.castRoleByNpcId !== null &&
      !Array.isArray(o.castRoleByNpcId)
    ) {
      for (const [k, v] of Object.entries(o.castRoleByNpcId as Record<string, unknown>)) {
        if (typeof v === 'string') cast[k] = v;
      }
    }
    const castAhrLi: Record<string, { surface: string; inner: string }> = {};
    if (
      typeof o.castRoleAhrLiByNpcId === 'object' &&
      o.castRoleAhrLiByNpcId !== null &&
      !Array.isArray(o.castRoleAhrLiByNpcId)
    ) {
      for (const [k, v] of Object.entries(o.castRoleAhrLiByNpcId as Record<string, unknown>)) {
        if (typeof v !== 'object' || v === null || Array.isArray(v)) continue;
        const vv = v as Record<string, unknown>;
        const surface = typeof vv.surface === 'string' ? vv.surface : '';
        const inner = typeof vv.inner === 'string' ? vv.inner : '';
        if (surface.trim() !== '' || inner.trim() !== '') castAhrLi[k] = { surface, inner };
      }
    }
    const byDay: Record<number, string> = {};
    if (
      typeof o.incidentPersonByDay === 'object' &&
      o.incidentPersonByDay !== null &&
      !Array.isArray(o.incidentPersonByDay)
    ) {
      for (const [k, v] of Object.entries(o.incidentPersonByDay as Record<string, unknown>)) {
        if (typeof v !== 'string') continue;
        const day = Number(k);
        if (Number.isFinite(day)) byDay[day] = v;
      }
    }
    return {
      ...empty,
      pickRuleY: typeof o.pickRuleY === 'string' ? o.pickRuleY : '',
      pickRuleX1: typeof o.pickRuleX1 === 'string' ? o.pickRuleX1 : '',
      pickRuleX2: typeof o.pickRuleX2 === 'string' ? o.pickRuleX2 : '',
      castRoleByNpcId: cast,
      ...(Object.keys(castAhrLi).length > 0 ? { castRoleAhrLiByNpcId: castAhrLi } : {}),
      incidentPersonByDay: byDay,
    };
  } catch {
    return empty;
  }
}

export function saveProtagonistPublicSheetDraft(
  playerId: string,
  scenarioId: string,
  draft: ProtagonistPublicSheetDraft,
  moduleId?: string,
): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(publicSheetStorageKey(playerId, scenarioId, moduleId), JSON.stringify(draft));
  } catch {
    /* quota / private mode */
  }
}
