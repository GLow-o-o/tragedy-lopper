// filepath: src/game/Client.tsx
/// <reference types="vite/client" />
/**
 * 惨剧轮回 - React 客户端
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Client } from 'boardgame.io/react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { TragedyLooperGame } from './tragedyLooper';
import { useGameSetup } from './gameSetupContext';
import { getSeatByPlayerId, isMastermind, TRAGEDY_LOOPER_NUM_PLAYERS, TRAGEDY_LOOPER_SEATS } from './players/playerSeats';
import { npcIndex } from './npc/npcIndex';
import { formatRoleFeaturesList, Person } from './modules/basicInfo/basicInfo_role';
import {
  incidentDisplayNameForModule,
  roleDisplayNameForModule,
  ruleDisplayNameForModule,
} from './moduleDisplayNames';
import { Area, AreaOptions } from './basicData/areas';

/** 避免在 G 尚未带上新 UI 字段时 `?? []` 每次渲染产生新引用 */
const EMPTY_STRING_ARRAY: readonly string[] = [];
import {
  TRAGEDY_DAY_MAIN_FLOW_FLAT,
  TRAGEDY_TIME_SPIRAL_GROUP,
  canUseStepFlowButton,
  type FlowPanelView,
  type StepFlowButtonOp,
  Steps,
} from './basicData/steps';
import hospitalImg from './assert/images/areas/hospital.png';
import shrineImg from './assert/images/areas/shrine.png';
import cityImg from './assert/images/areas/city.png';
import schoolImg from './assert/images/areas/school.png';
import mastermindCardBackImg0b from './assert/images/action_cards/mastermind_cards_0b.png';
import mastermindCardImg01 from './assert/images/action_cards/mastermind_cards_01.png';
import mastermindCardImg02 from './assert/images/action_cards/mastermind_cards_02.png';
import mastermindCardImg03 from './assert/images/action_cards/mastermind_cards_03.png';
import mastermindCardImg04 from './assert/images/action_cards/mastermind_cards_04.png';
import mastermindCardImg05 from './assert/images/action_cards/mastermind_cards_05.png';
import mastermindCardImg06 from './assert/images/action_cards/mastermind_cards_06.png';
import mastermindCardImg07 from './assert/images/action_cards/mastermind_cards_07.png';
import mastermindCardImg08 from './assert/images/action_cards/mastermind_cards_08.png';
import mastermindCardImg09 from './assert/images/action_cards/mastermind_cards_09.png';
import mastermindCardImg10 from './assert/images/action_cards/mastermind_cards_10.png';
import mastermindCardImg11 from './assert/images/action_cards/mastermind_cards_11.png';
import mastermindCardImg12 from './assert/images/action_cards/mastermind_cards_12.png';
import protagonistCardImgA0b from './assert/images/action_cards/protagonistA_cards_0b.png';
import protagonistCardImgB0b from './assert/images/action_cards/protagonistB_cards_0b.png';
import protagonistCardImgC0b from './assert/images/action_cards/protagonistC_cards_0b.png';
import tokenChipFriendly from './assert/images/tokens/chip_01.png';
import tokenChipUnrest from './assert/images/tokens/chip_02.png';
import tokenChipPlot from './assert/images/tokens/chip_03.png';
import deadOverlayImg from './assert/images/extra/生成DEAD的PNG素材.png';
import protagonistExCardImgA from './assert/images/extra/extra_a.png';
import protagonistExCardImgB from './assert/images/extra/extra_b.png';
import protagonistExCardImgC from './assert/images/extra/extra_c.png';
import protagonistExCardImgD from './assert/images/extra/extra_d.png';
import {
  ClosedScriptScenarioSheet,
  createEmptyProtagonistPublicSheetDraft,
  protagonistCastRoleSummary,
  type ProtagonistPublicSheetDraft,
} from './components/ClosedScriptScenarioSheet.tsx';
import { loadProtagonistPublicSheetDraft, saveProtagonistPublicSheetDraft } from './protagonistPublicSheetStorage';
import {
  MASTERMIND_ABILITY_HAND,
  MASTERMIND_ALL_HAND_DEFS,
  MASTERMIND_EXTRA_HAND,
  PROTAGONIST_STANDARD_HAND,
  PROTAGONIST_EXTRA_HAND,
  PROTAGONIST_ALL_HAND_DEFS,
  getTragedyHandCardById,
} from './data/tragedyHandCards';
import { TRAGEDY_EX_CARD_DEFS, TRAGEDY_EX_CARD_IDS } from './data/tragedyExCards';
import { labelForStoredIncidentPerson, npcRoleAssignments, type Scenario } from './scenarios/basicInfo_scenario';
import { resolveNpcBoardPortraitUrl, resolveTokenImageUrl } from './npcBoardPortraitResolve';
import type { npc as NpcCardDef } from './npc/basicInfo_npc';
import {
  PROTAGONIST_EXTRA_TOKEN_DEFS,
  protagonistExtraTokensLegendForNpc,
  normalizeProtagonistExtraTokenIds,
} from './protagonistExtraTokens';

/** 座位条卡片：正方形边长 = 原先长方形的高度 */
const PLAYER_CHIP_SIDE_PX = 90;

const AREA_IMAGES: Record<Area, string> = {
  [Area.Hospital]: hospitalImg,
  [Area.Shrine]: shrineImg,
  [Area.City]: cityImg,
  [Area.School]: schoolImg,
  [Area.Faraway]: '',
};
const AREA_DISPLAY_NAME: Record<Area, string> = {
  [Area.Hospital]: '医院',
  [Area.Shrine]: '神社',
  [Area.City]: '都市',
  [Area.School]: '学校',
  [Area.Faraway]: '远方',
};

const EVENT_PHASE_OUTCOME_OPTIONS = [
  { value: 'not_happened', label: '事件未发生' },
  { value: 'happened', label: '事件发生了' },
  { value: 'happened_no_phenomenon', label: '事件发生了但是无现象' },
] as const;

type GameLogLevel = 'info' | 'warn' | 'success';

interface GameLogEntry {
  id: string;
  ts: string;
  loop: number;
  day: number;
  phase: string;
  actor: string;
  action: string;
  detail: string;
  level: GameLogLevel;
}

const MAX_GAME_LOG_ENTRIES = 120;//游戏日志最大条数

function formatGameLogLine(log: GameLogEntry): string {
  const header = `[${log.ts}] [L${log.loop}-D${log.day}] [${log.phase}]`;
  const body = `${log.actor}：${log.action}`;
  return log.detail ? `${header}\n${body}\n${log.detail}` : `${header}\n${body}`;
}

/** 版图 2×2 顺序：左上医院、右上神社、左下都市、右下学校 */
const BOARD_QUADRANT_AREAS: readonly Area[] = [Area.Hospital, Area.Shrine, Area.City, Area.School];

/** 数据上「自带可选用特殊 token」的 NPC（与 `boardSpecialTokenSelectOptions` 入选条件一致） */
function npcProvidesAssignableSpecialToken(def: NpcCardDef | undefined): boolean {
  if (!def) return false;
  const path = def.specialTokenImage?.trim();
  if (!path) return false;
  return Boolean((def.specialToken ?? '').trim()) || def.hasSpecialToken === true;
}

function parseSpecialTokenAssignTargetKey(
  key: string,
): { kind: 'area'; area: Area } | { kind: 'npc'; npcId: string } | null {
  if (key.startsWith('area:')) {
    const raw = key.slice('area:'.length);
    if ((Object.values(Area) as string[]).includes(raw)) return { kind: 'area', area: raw as Area };
    return null;
  }
  if (key.startsWith('npc:')) {
    const npcId = key.slice('npc:'.length).trim();
    if (npcId) return { kind: 'npc', npcId };
  }
  return null;
}

/** 远方栏：`【角色名的标记名】`（优先全 NPC 表；否则由盘面选项 `标记（角色）` 转写） */
function farawaySpecialTokenBracketText(
  imagePath: string,
  bracketByPath: Map<string, string>,
  boardOptionLabelByPath: Map<string, string>,
): string {
  const primary = bracketByPath.get(imagePath);
  if (primary) return primary;
  const boardLb = boardOptionLabelByPath.get(imagePath);
  if (boardLb) {
    const mm = boardLb.match(/^(.+)（(.+)）$/);
    if (mm) return `【${mm[2]}的${mm[1]}】`;
    return `【${boardLb}】`;
  }
  return '【未知标记】';
}

/** 版图上已打出行动牌：描边 + 外发光（叠于原有 drop shadow 之前） */
const BOARD_PLAYED_HAND_CARD_HIGHLIGHT =
  '0 0 0 2px rgba(252, 227, 138, 0.92), 0 0 12px rgba(252, 227, 138, 0.42)';

const BOARD_PLAYED_CARD_SHADOW_QUADRANT = '0 3px 12px rgba(0, 0, 0, 0.55)';
const BOARD_PLAYED_CARD_SHADOW_NPC_MINI = '0 2px 10px rgba(0, 0, 0, 0.55)';
const BOARD_PLAYED_CARD_SHADOW_NPC_PORTRAIT = '0 2px 8px rgba(0, 0, 0, 0.35)';

const BOARD_PLAYED_CARD_OUTLINE_STORAGE_KEY = 'tragedy-ui-boardPlayedCardOutline';
const EXTRA_HAND_CARDS_UI_STORAGE_KEY = 'tragedy-ui-extraHandCardsPanel';
const EX_CARDS_UI_STORAGE_KEY = 'tragedy-ui-exCardPanelSwitch';
/** 主人公额外 token（已沟通／已死亡 等）：是否显示版图叠图、下拉与说明行（本机偏好，不同步房间） */
const PROTAGONIST_EXTRA_TOKENS_UI_STORAGE_KEY = 'tragedy-ui-protagonistExtraTokens';

/** 当前玩家手牌：指定卡牌右上角「?」点击后展示的特别规则（与 `tragedyHandCards` id 对应） */
const HAND_CARD_SPECIAL_RULE_BY_ID: Record<string, string> = {
  tl_pa_forbid_conspiracy: '多名玩家同时打出禁止密谋时，无效所有禁止密谋卡牌的效果',
  tl_pa_hope_plus1:
    '多名玩家同时打出希望+1时，作为友好+1结算。如果作为希望+1结算，则从全员的手牌中移除希望+1',
};

function boardPlayedActionCardBoxShadow(showOutline: boolean, baseShadow: string): string {
  return showOutline ? `${BOARD_PLAYED_HAND_CARD_HIGHLIGHT}, ${baseShadow}` : baseShadow;
}

interface NpcBoardPlacement {
  npcId: string;
  name: string;
  /** 展示/排序用首项身份；多身份时同 correctRoleIds[0] */
  roleId: string;
  /** 最终决战：猜中任一即正确 */
  correctRoleIds: string[];
  area: Area;
  imgUrl?: string;
  delayedAppearance?: boolean;
  appearanceTimingDescription?: string;
}

function npcPlacementFromScenarioRow(
  row: import('./scenarios/basicInfo_scenario').NpcRole,
  npc: NpcCardDef,
  area: Area,
  extra?: Pick<NpcBoardPlacement, 'delayedAppearance' | 'appearanceTimingDescription'>,
): NpcBoardPlacement {
  const ids = npcRoleAssignments(row);
  const roleId = ids[0] ?? Person.roleId;
  const correctRoleIds = ids.length > 0 ? [...ids] : [Person.roleId];
  return {
    npcId: row.npcId,
    name: npc.name,
    roleId,
    correctRoleIds,
    area,
    imgUrl: resolveNpcBoardPortraitUrl(npc.img),
    ...extra,
  };
}

/** @internal 棋盘上剧作家视图：多身份并列展示 */
function mastermindRoleLabels(
  p: NpcBoardPlacement,
  roleDisplayName: (roleId: string) => string,
): string {
  const ids =
    Array.isArray(p.correctRoleIds) && p.correctRoleIds.length > 0
      ? p.correctRoleIds
      : p.roleId
        ? [p.roleId]
        : [];
  if (ids.length === 0) return '';
  if (ids.length === 2 && ids[0] === ids[1]) return roleDisplayName(ids[0]);
  return ids.map(roleDisplayName).join('／');
}
function npcPlacementsByArea(
  scenario: Scenario | undefined,
  areaOverrideByNpcId: Record<string, Area> = {},
  discardedByNpcId: Record<string, boolean> = {},
  farawayByNpcId: Record<string, boolean> = {},
  appearedByNpcId: Record<string, boolean> = {},
): Record<Area, NpcBoardPlacement[]> {
  const byArea: Record<Area, NpcBoardPlacement[]> = {
    [Area.Hospital]: [],
    [Area.Shrine]: [],
    [Area.City]: [],
    [Area.School]: [],
    [Area.Faraway]: [],
  };
  const rows = scenario?.ScenarioInfo?.NpcRoles;
  if (!Array.isArray(rows)) return byArea;

  for (const row of rows) {
    const appeared = !row.delayedAppearance || Boolean(appearedByNpcId[row.npcId]);
    if (!appeared) continue;
    if (discardedByNpcId[row.npcId]) continue;
    if (farawayByNpcId[row.npcId]) continue;
    const npc = Object.values(npcIndex).find(n => n.id === row.npcId);
    if (!npc) continue;
    const baseArea = npc.initialArea?.[0] ?? npc.npcState?.currentArea;
    const area = areaOverrideByNpcId[row.npcId] ?? baseArea;
    if (area == null || byArea[area] === undefined) continue;
    byArea[area].push(
      npcPlacementFromScenarioRow(row, npc, area),
    );
  }
  return byArea;
}

function npcPlacementsAll(
  scenario: Scenario | undefined,
  areaOverrideByNpcId: Record<string, Area> = {},
  appearedByNpcId: Record<string, boolean> = {},
): NpcBoardPlacement[] {
  const rows = scenario?.ScenarioInfo?.NpcRoles;
  if (!Array.isArray(rows)) return [];
  const out: NpcBoardPlacement[] = [];
  for (const row of rows) {
    const appeared = !row.delayedAppearance || Boolean(appearedByNpcId[row.npcId]);
    if (!appeared) continue;
    const npc = Object.values(npcIndex).find(n => n.id === row.npcId);
    if (!npc) continue;
    const baseArea = npc.initialArea?.[0] ?? npc.npcState?.currentArea;
    const area = areaOverrideByNpcId[row.npcId] ?? baseArea;
    if (area == null) continue;
    out.push(npcPlacementFromScenarioRow(row, npc, area));
  }
  return out;
}

/** 剧本 `NpcRoles` 中的全部角色（含延后登场且尚未标记登场），用于最终决战列表 */
function npcPlacementsAllFromScenario(
  scenario: Scenario | undefined,
  areaOverrideByNpcId: Record<string, Area> = {},
): NpcBoardPlacement[] {
  const rows = scenario?.ScenarioInfo?.NpcRoles;
  if (!Array.isArray(rows)) return [];
  const out: NpcBoardPlacement[] = [];
  for (const row of rows) {
    const npc = Object.values(npcIndex).find(n => n.id === row.npcId);
    if (!npc) continue;
    const baseArea = npc.initialArea?.[0] ?? npc.npcState?.currentArea;
    const area = areaOverrideByNpcId[row.npcId] ?? baseArea ?? BOARD_QUADRANT_AREAS[0];
    out.push(
      npcPlacementFromScenarioRow(row, npc, area, row.delayedAppearance ? { delayedAppearance: true } : undefined),
    );
  }
  out.sort((a, b) =>
    String(a.roleId).localeCompare(String(b.roleId), undefined, { numeric: true, sensitivity: 'base' }),
  );
  return out;
}

function npcUnappearedPlacements(
  scenario: Scenario | undefined,
  appearedByNpcId: Record<string, boolean> = {},
): NpcBoardPlacement[] {
  const rows = scenario?.ScenarioInfo?.NpcRoles;
  if (!Array.isArray(rows)) return [];
  const out: NpcBoardPlacement[] = [];
  for (const row of rows) {
    if (!row.delayedAppearance || appearedByNpcId[row.npcId]) continue;
    const npc = Object.values(npcIndex).find(n => n.id === row.npcId);
    if (!npc) continue;
    const baseArea = npc.initialArea?.[0] ?? npc.npcState?.currentArea;
    if (baseArea == null) continue;
    out.push(
      npcPlacementFromScenarioRow(row, npc, baseArea, {
        delayedAppearance: true,
        appearanceTimingDescription: row.appearanceTimingDescription ?? '',
      }),
    );
  }
  return out;
}

/** assert/images/areas 下 PNG 的实际像素尺寸（四张一致） */
const AREA_IMAGE_WIDTH = 1519;
const AREA_IMAGE_HEIGHT = 1076;

/** 左侧状态面板 data.png 像素尺寸（用于保持与背景一致的长宽比） */
const DATA_PANEL_IMG_WIDTH = 591;
const DATA_PANEL_IMG_HEIGHT = 2150;

// 为了让主界面在常见视口内无需滚动，按视口高度扣除顶部标题/按钮区预留后再限制中间三栏高度
const MIDDLE_MAX_HEIGHT = 'min(86vh, calc(100dvh - 160px), 1020px)';
/** 与 `styles.boardNpcChipTokenIcon` 高宽一致，用于计算立绘内可容纳颗数 */
const BOARD_NPC_PORTRAIT_TOKEN_ICON_PX = 28;
const BOARD_NPC_PORTRAIT_TOKEN_STACK_GAP_PX = 2;
const BOARD_NPC_PORTRAIT_TOKEN_TOP_INSET_PX = 4;
const BOARD_NPC_PORTRAIT_TOKEN_BOTTOM_RESERVE_PX = 4;

function npcPortraitTokenColumnLimit(portraitClientHeightPx: number): number {
  if (!Number.isFinite(portraitClientHeightPx) || portraitClientHeightPx <= 0) return 0;
  const slot = BOARD_NPC_PORTRAIT_TOKEN_ICON_PX + BOARD_NPC_PORTRAIT_TOKEN_STACK_GAP_PX;
  const usable =
    portraitClientHeightPx - BOARD_NPC_PORTRAIT_TOKEN_TOP_INSET_PX - BOARD_NPC_PORTRAIT_TOKEN_BOTTOM_RESERVE_PX;
  if (usable < BOARD_NPC_PORTRAIT_TOKEN_ICON_PX) return 0;
  return Math.floor(usable / slot);
}

const PROTAGONIST_CARD_IMAGES = [protagonistCardImgA0b, protagonistCardImgB0b, protagonistCardImgC0b] as const;
const MASTERMIND_CARD_IMAGE_BY_ID: Record<string, string> = {
  // 顺序对应用户要求：
  // 不安+1 不安+1 不安-1 禁止不安 禁止友好 密谋+1 密谋+2 上下移动 左右移动 斜向移动
  tl_mm_anxiety_plus_a: mastermindCardImg01,
  tl_mm_anxiety_plus_b: mastermindCardImg02,
  tl_mm_anxiety_minus: mastermindCardImg03,
  tl_mm_forbid_anxiety: mastermindCardImg04,
  tl_mm_forbid_goodwill: mastermindCardImg05,
  tl_mm_conspiracy_plus1: mastermindCardImg06,
  tl_mm_conspiracy_plus2: mastermindCardImg07,
  tl_mm_move_ud: mastermindCardImg08,
  tl_mm_move_lr: mastermindCardImg09,
  tl_mm_move_diag: mastermindCardImg10,
  tl_mm_goodwill_plus1_opt: mastermindCardImg11,
  tl_mm_despair_plus1: mastermindCardImg12,
};

const MASTERMIND_EX_CARD_FACE_IMPORTS = [
  protagonistExCardImgA,
  protagonistExCardImgB,
  protagonistExCardImgC,
  protagonistExCardImgD,
] as const;
const MASTERMIND_EX_CARD_FACE_BY_ID: Record<string, string> = Object.fromEntries(
  TRAGEDY_EX_CARD_DEFS.map((def, i) => [def.id, MASTERMIND_EX_CARD_FACE_IMPORTS[i]!] as const),
);

function maxLoopCountFromSetup(
  selectedRoundCount: number | null | undefined,
  scenario: { ScenarioInfo?: { roundCount?: number[] } } | null | undefined,
): number {
  let n = 7;
  if (selectedRoundCount != null && selectedRoundCount > 0) n = selectedRoundCount;
  else {
    const rc = scenario?.ScenarioInfo?.roundCount;
    if (Array.isArray(rc) && rc.length > 0) n = Math.max(...rc);
  }
  return Math.max(2, n);
}

function dayCountFromSetup(
  scenario: { ScenarioInfo?: { dayCount?: number } } | null | undefined,
): number {
  const d = scenario?.ScenarioInfo?.dayCount;
  if (typeof d === 'number' && d > 0) return Math.min(8, d);
  return 8;
}

function npcDisplayName(npcId: string): string {
  const incidentLabel = labelForStoredIncidentPerson(npcId);
  if (incidentLabel) return incidentLabel;
  const npc = Object.values(npcIndex).find(n => n.id === npcId);
  return npc ? npc.name : npcId;
}

/** 版图卡上展示的友好 / 不安 / 密谋（当前值来自 npc.npcState；不安上限来自 npc.instability）；希望/绝望为额外卡牌 UI 计数，剧本无实体字段时为 0 */
function getNpcBoardTokenCounts(
  npcId: string,
): {
  friendly: number;
  unrest: number;
  unrestMax: number;
  plot: number;
  hope: number;
  despair: number;
} {
  const npc = Object.values(npcIndex).find(n => n.id === npcId);
  const s = npc?.npcState;
  return {
    friendly: s?.friendlyPoints ?? 0,
    unrest: s?.instability ?? 0,
    unrestMax: npc?.instability ?? 0,
    plot: s?.conspiracyPoints ?? 0,
    hope: 0,
    despair: 0,
  };
}

function quadrantImageStyle(imageUrl: string): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${imageUrl})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
    fontWeight: 600,
  };
}

/** 单版图格内 NPC 较多（如 2×3）时，立绘角标行动牌默认会向下/向侧伸出，易压住下一行或邻列；按人数收紧位置并加大芯片行间距 */
function boardNpcPlayedHandImgStyle(
  areaNpcCount: number,
  side: 'mastermind' | 'protagonist',
): React.CSSProperties {
  if (areaNpcCount <= 4) return {};
  if (areaNpcCount === 5) {
    return side === 'mastermind'
      ? { bottom: '-10%', left: '-15%', width: '38%' }
      : { bottom: '-10%', right: '-13%', width: '38%' };
  }
  return side === 'mastermind'
    ? { bottom: '5%', left: '3%', width: '32%' }
    : { bottom: '5%', right: '3%', width: '32%' };
}

function quadrantChipsGapStyle(areaNpcCount: number): React.CSSProperties {
  if (areaNpcCount <= 4) return {};
  if (areaNpcCount === 5) {
    return { gap: 'clamp(8px, 2.6cqh, 17px) clamp(2px, 0.28vw, 5px)' };
  }
  return { gap: 'clamp(12px, 4cqh, 24px) clamp(3px, 0.35vw, 6px)' };
}

/** 与右栏流程及 `dayFlowFlatIndex` 一致的主线阶段名（含隙 / 终 / 等待终盘） */
function boardPhaseDisplayName(G: Record<string, unknown> | null | undefined): string {
  if (G == null) return '—';
  if (G.inFinalGuess === true) return Steps.FinalGuess;
  if (G.awaitingProtagonistFinalConsensus === true && G.inFinalGuess !== true) {
    return '等待三名主人公确认终盘';
  }
  if (G.inTimeSpiral === true) return Steps.TimeSpiral;
  const flat = TRAGEDY_DAY_MAIN_FLOW_FLAT;
  const idx = typeof G.dayFlowFlatIndex === 'number' ? G.dayFlowFlatIndex : 0;
  const clamped = Math.max(0, Math.min(idx, flat.length - 1));
  return flat[clamped]?.meta.step ?? '—';
}

function normalizeServerUrlForInvite(serverUrl: string): string {
  return String(serverUrl ?? '').trim().replace(/\/+$/, '');
}

function publicInviteServerUrl(serverUrl: string): string {
  if (import.meta.env.VITE_BGIO_THROUGH_VITE === 'true') {
    const raw = import.meta.env.VITE_PUBLIC_APP_ORIGIN as string | undefined;
    if (raw && typeof raw === 'string' && raw.trim()) {
      return normalizeServerUrlForInvite(raw);
    }
  }
  return normalizeServerUrlForInvite(serverUrl);
}

function currentAppJoinBaseUrl(): string {
  const raw = import.meta.env.VITE_PUBLIC_APP_ORIGIN as string | undefined;
  if (raw && typeof raw === 'string' && raw.trim()) {
    const base = normalizeServerUrlForInvite(raw);
    if (typeof window === 'undefined') return `${base}/`;
    const path = window.location.pathname || '/';
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}

/** 与房主邀请链接同格式：`cred`+`pid` 触发重连解析（无需 `resume`）。 */
function buildTakeoverJoinUrl(
  serverUrl: string,
  matchID: string,
  targetPlayerID: string,
  credentials: string,
): string {
  const u = new URL(currentAppJoinBaseUrl());
  u.searchParams.set('mp', '1');
  u.searchParams.set('match', matchID);
  u.searchParams.set('srv', publicInviteServerUrl(serverUrl));
  u.searchParams.set('pid', targetPlayerID);
  u.searchParams.set('cred', credentials);
  return u.toString();
}

function currentCaptainProtagonistId(
  G: Record<string, unknown> | null | undefined,
  fallbackDaysPerLoop: number,
): string | undefined {
  const protagonistIds = TRAGEDY_LOOPER_SEATS
    .filter(seat => seat.role === 'protagonist')
    .map(seat => seat.playerId);
  if (protagonistIds.length === 0) return undefined;
  const rawDays = Number(G?.daysPerLoop ?? fallbackDaysPerLoop);
  const daysPerLoop = Number.isFinite(rawDays) ? Math.max(1, Math.floor(rawDays)) : 1;
  const rawLoop = Number(G?.loop ?? 1);
  const rawDay = Number(G?.day ?? 1);
  const loopOffset = Number.isFinite(rawLoop) ? Math.max(0, Math.floor(rawLoop - 1)) : 0;
  const dayOffset = Number.isFinite(rawDay) ? Math.max(0, Math.floor(rawDay - 1)) : 0;
  const absoluteDayIndex = loopOffset * daysPerLoop + dayOffset;
  return protagonistIds[absoluteDayIndex % protagonistIds.length];
}

/** 立绘 + 指示物：指示物裁切在卡图矩形内，竖向放不下时改为 +N */
function NpcBoardPortraitClipped({
  imgUrl,
  name,
  alive,
  tok,
  portraitImgStyle,
}: {
  imgUrl: string;
  name: string;
  alive: boolean;
  tok: { friendly: number; unrest: number; plot: number; hope?: number; despair?: number };
  portraitImgStyle: React.CSSProperties;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [colLimit, setColLimit] = useState(32);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const update = () => setColLimit(npcPortraitTokenColumnLimit(img.clientHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(img);
    img.addEventListener('load', update);
    return () => {
      ro.disconnect();
      img.removeEventListener('load', update);
    };
  }, [imgUrl]);

  const renderTokenColumn = (count: number, iconSrc: string, iconAlt: string) => {
    if (count <= 0) return null;
    const visible = Math.min(count, colLimit);
    const overflow = count - visible;
    return (
      <>
        {Array.from({ length: visible }, (_, idx) => (
          <img
            key={`${iconAlt}-${idx}`}
            src={iconSrc}
            alt={iconAlt}
            style={styles.boardNpcChipTokenIcon}
            draggable={false}
          />
        ))}
        {overflow > 0 ? (
          <span style={styles.boardNpcChipTokenOverflow}>+{overflow}</span>
        ) : null}
      </>
    );
  };

  const showTok = tok.friendly > 0 || tok.unrest > 0 || tok.plot > 0;

  return (
    <div style={styles.boardNpcChipPortraitClip}>
      <img
        ref={imgRef}
        src={imgUrl}
        alt={name}
        style={{ ...styles.boardNpcChipImgSized, ...portraitImgStyle }}
        draggable={false}
      />
      {!alive ? (
        <img
          src={deadOverlayImg}
          alt="死亡标记"
          style={styles.boardNpcChipDeadOverlay}
          draggable={false}
        />
      ) : null}
      {showTok ? (
        <div style={styles.boardNpcChipTokenOverlay}>
          <div style={styles.boardNpcChipTokenOverlayGroup}>
            {renderTokenColumn(tok.friendly, tokenChipFriendly, '友好指示物')}
          </div>
          <div style={styles.boardNpcChipTokenOverlayGroup}>
            {renderTokenColumn(tok.unrest, tokenChipUnrest, '不安指示物')}
          </div>
          <div style={styles.boardNpcChipTokenOverlayGroup}>
            {renderTokenColumn(tok.plot, tokenChipPlot, '密谋指示物')}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// 游戏面板组件（模组 / 剧本 / 轮回数来自 App 侧 GameSetupProvider）
/** 剧作家顶栏：多行指定 EX 挂点（每行一个版图格或 NPC） */
type MastermindExToolbarRow = {
  key: string;
  targetKind: 'area' | 'npc';
  area: Area;
  npcId: string;
};

const Board = ({ G, ctx, moves, playerID, matchData, isMultiplayer }: any) => {
  const { selectedModuleData, selectedScenarioData, selectedRoundCount, multiplayer } = useGameSetup();
  const scenarioMid = selectedScenarioData?.moduleId;
  const ruleDisplayName = useCallback((ruleId: string) => ruleDisplayNameForModule(scenarioMid, ruleId), [scenarioMid]);
  const incidentDisplayName = useCallback(
    (incidentId: string) => incidentDisplayNameForModule(scenarioMid, incidentId),
    [scenarioMid],
  );
  const roleDisplayName = useCallback((roleId: string) => roleDisplayNameForModule(scenarioMid, roleId), [scenarioMid]);
  const isFsModule = (
    (selectedModuleData?.shortName ?? '').trim().toLowerCase() === 'fs' ||
    (selectedModuleData?.id ?? '').trim().toLowerCase() === 'first_steps'
  );
  const [showModuleInfo, setShowModuleInfo] = useState(false);
  const [showScenarioInfo, setShowScenarioInfo] = useState(false);
  const [boardPlayedCardOutline, setBoardPlayedCardOutline] = useState(() => {
    try {
      return localStorage.getItem(BOARD_PLAYED_CARD_OUTLINE_STORAGE_KEY) !== '0';
    } catch {
      return true;
    }
  });
  const toggleBoardPlayedCardOutline = useCallback(() => {
    setBoardPlayedCardOutline((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(BOARD_PLAYED_CARD_OUTLINE_STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const [extraHandCardsUiEnabled, setExtraHandCardsUiEnabled] = useState(() => {
    try {
      return localStorage.getItem(EXTRA_HAND_CARDS_UI_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const toggleExtraHandCardsUi = useCallback(() => {
    setExtraHandCardsUiEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(EXTRA_HAND_CARDS_UI_STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const [exCardsUiEnabled, setExCardsUiEnabled] = useState(() => {
    try {
      return localStorage.getItem(EX_CARDS_UI_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const toggleExCardsUi = useCallback(() => {
    setExCardsUiEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(EX_CARDS_UI_STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const [protagonistExtraTokensUiEnabled, setProtagonistExtraTokensUiEnabled] = useState(() => {
    try {
      return localStorage.getItem(PROTAGONIST_EXTRA_TOKENS_UI_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const toggleProtagonistExtraTokensUi = useCallback(() => {
    setProtagonistExtraTokensUiEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(PROTAGONIST_EXTRA_TOKENS_UI_STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  const [reinviteCopyMessage, setReinviteCopyMessage] = useState<string | null>(null);
  const [npcZoomPlacement, setNpcZoomPlacement] = useState<NpcBoardPlacement | null>(null);
  /** 剧作家在「自带特殊 token」的 NPC 放大图中：为所选作用对象勾选 token */
  const [specialTokenAssignTargetKey, setSpecialTokenAssignTargetKey] = useState('');
  const [isFinalGuessModalOpen, setIsFinalGuessModalOpen] = useState(false);
  const [handCardSpecialRulePopup, setHandCardSpecialRulePopup] = useState<
    { cardId: string; openerPlayerId: string } | null
  >(null);
  useEffect(() => {
    setHandCardSpecialRulePopup(null);
  }, [playerID]);
  const [isProtagonistADeclarationHiddenLocal, setIsProtagonistADeclarationHiddenLocal] = useState(false);
  const selectedMastermindCardByArea = useMemo<Record<Area, string>>(() => ({
    [Area.Hospital]: G?.uiSelectedMastermindCardByArea?.[Area.Hospital] ?? '',
    [Area.Shrine]: G?.uiSelectedMastermindCardByArea?.[Area.Shrine] ?? '',
    [Area.City]: G?.uiSelectedMastermindCardByArea?.[Area.City] ?? '',
    [Area.School]: G?.uiSelectedMastermindCardByArea?.[Area.School] ?? '',
    [Area.Faraway]: G?.uiSelectedMastermindCardByArea?.[Area.Faraway] ?? '',
  }), [G?.uiSelectedMastermindCardByArea]);
  const selectedProtagonistCardByAreaByPid = useMemo<Record<string, Partial<Record<Area, string>>>>(
    () => (G?.uiSelectedProtagonistCardByAreaByPid ?? {}),
    [G?.uiSelectedProtagonistCardByAreaByPid],
  );
  const selectedProtagonistCardByNpcByPid = useMemo<Record<string, Record<string, string>>>(
    () => (G?.uiSelectedProtagonistCardByNpcByPid ?? {}),
    [G?.uiSelectedProtagonistCardByNpcByPid],
  );
  /** AHR：表世界 / 里世界示意（`G.uiAhrWorldLine`，全员同步） */
  const uiAhrWorldLine = G?.uiAhrWorldLine === 'inner' ? 'inner' : 'surface';
  const mastermindExHandIds = useMemo((): string[] => {
    const raw = G?.mastermindExHandIds;
    return Array.isArray(raw) ? raw : [];
  }, [G?.mastermindExHandIds]);
  const uiMastermindExCardByArea = useMemo((): Record<Area, string> => {
    const raw = G?.uiMastermindExCardByArea as Record<Area, unknown> | undefined;
    const readOne = (v: unknown): string => {
      if (typeof v === 'string') {
        const t = v.trim();
        return t && TRAGEDY_EX_CARD_IDS.has(t) ? t : '';
      }
      if (Array.isArray(v) && v.length > 0) {
        const t = String(v[0] ?? '').trim();
        return t && TRAGEDY_EX_CARD_IDS.has(t) ? t : '';
      }
      return '';
    };
    return {
      [Area.Hospital]: readOne(raw?.[Area.Hospital]),
      [Area.Shrine]: readOne(raw?.[Area.Shrine]),
      [Area.City]: readOne(raw?.[Area.City]),
      [Area.School]: readOne(raw?.[Area.School]),
      [Area.Faraway]: readOne(raw?.[Area.Faraway]),
    };
  }, [G?.uiMastermindExCardByArea]);
  const uiMastermindExCardByNpcId = useMemo((): Record<string, string> => {
    const raw = G?.uiMastermindExCardByNpcId ?? {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === 'string') {
        const t = v.trim();
        if (t && TRAGEDY_EX_CARD_IDS.has(t)) out[k] = t;
      } else if (Array.isArray(v) && v.length > 0) {
        const t = String(v[0] ?? '').trim();
        if (t && TRAGEDY_EX_CARD_IDS.has(t)) out[k] = t;
      }
    }
    return out;
  }, [G?.uiMastermindExCardByNpcId]);
  const npcAreaOverrideByNpcId = useMemo<Record<string, Area>>(
    () => (G?.uiNpcAreaOverrideByNpcId ?? {}),
    [G?.uiNpcAreaOverrideByNpcId],
  );
  const npcAliveOverrideByNpcId = useMemo<Record<string, boolean>>(
    () => (G?.uiNpcAliveOverrideByNpcId ?? {}),
    [G?.uiNpcAliveOverrideByNpcId],
  );
  const npcDiscardedByNpcId = useMemo<Record<string, boolean>>(
    () => (G?.uiNpcDiscardedByNpcId ?? {}),
    [G?.uiNpcDiscardedByNpcId],
  );
  const npcDiscardOriginAreaByNpcId = useMemo<Record<string, Area>>(
    () => (G?.uiNpcDiscardOriginAreaByNpcId ?? {}),
    [G?.uiNpcDiscardOriginAreaByNpcId],
  );
  const npcFarawayByNpcId = useMemo<Record<string, boolean>>(
    () => (G?.uiNpcFarawayByNpcId ?? {}),
    [G?.uiNpcFarawayByNpcId],
  );
  const npcFarawayOriginAreaByNpcId = useMemo<Record<string, Area>>(
    () => (G?.uiNpcFarawayOriginAreaByNpcId ?? {}),
    [G?.uiNpcFarawayOriginAreaByNpcId],
  );
  const npcAppearedByNpcId = useMemo<Record<string, boolean>>(
    () => (G?.uiNpcAppearedByNpcId ?? {}),
    [G?.uiNpcAppearedByNpcId],
  );
  const discardedHandCardIdsByPid = useMemo<Record<string, string[]>>(
    () => (G?.uiDiscardedHandCardIdsByPid ?? {}),
    [G?.uiDiscardedHandCardIdsByPid],
  );
  const mastermindUsedOncePerLoopIds = Array.isArray(G?.uiMastermindOncePerLoopUsedHandCardIds)
    ? G.uiMastermindOncePerLoopUsedHandCardIds
    : EMPTY_STRING_ARRAY;
  const protagonistUsedOncePerLoopIdsByPid = useMemo(() => {
    const raw = G?.uiProtagonistOncePerLoopUsedHandCardIdsByPid;
    return raw && typeof raw === 'object' ? raw : {};
  }, [G?.uiProtagonistOncePerLoopUsedHandCardIdsByPid]);
  const selectedMastermindCardByNpcId = useMemo<Record<string, string>>(
    () => (G?.uiSelectedMastermindCardByNpcId ?? {}),
    [G?.uiSelectedMastermindCardByNpcId],
  );
  const [mastermindUsedTodayIds, setMastermindUsedTodayIds] = useState<string[]>([]);
  const [protagonistUsedTodayIdsByPid, setProtagonistUsedTodayIdsByPid] = useState<Record<string, string[]>>({});
  const [leftExValue, setLeftExValue] = useState<number>(0);
  const [exSlotDescPanelOpen, setExSlotDescPanelOpen] = useState(false);
  const [exToolbarRows, setExToolbarRows] = useState<MastermindExToolbarRow[]>(() => [
    { key: 'ex-toolbar-row-0', targetKind: 'area', area: Area.Hospital, npcId: '' },
  ]);
  useEffect(() => {
    setExSlotDescPanelOpen(false);
  }, [selectedModuleData?.id]);
  const [selectedUnappearedSpawnAreaByNpcId, setSelectedUnappearedSpawnAreaByNpcId] = useState<Record<string, Area>>({});
  const [selectedIncidentDay, setSelectedIncidentDay] = useState<number | null>(null);
  const [showTimeSpiralHint, setShowTimeSpiralHint] = useState<boolean>(false);
  const [gameLogs, setGameLogs] = useState<GameLogEntry[]>([]);
  const npcTokenOverrideByNpcId = useMemo<
    Record<string, { friendly: number; unrest: number; plot: number; hope: number; despair: number }>
  >(
    () => (G?.uiNpcTokenOverrideByNpcId ?? {}),
    [G?.uiNpcTokenOverrideByNpcId],
  );
  const uiNpcDisplayedSpecialTokenPathsByNpcId = useMemo<Record<string, string[]>>(
    () => (G?.uiNpcDisplayedSpecialTokenPathsByNpcId ?? {}),
    [G?.uiNpcDisplayedSpecialTokenPathsByNpcId],
  );
  const uiNpcProtagonistExtraTokenIdsByNpcId = useMemo<Record<string, string[]>>(() => {
    const raw = G?.uiNpcProtagonistExtraTokenIdsByNpcId ?? {};
    const out: Record<string, string[]> = {};
    for (const [npcId, v] of Object.entries(raw)) {
      const normalized = normalizeProtagonistExtraTokenIds(v);
      if (normalized.length > 0) out[npcId] = normalized;
    }
    return out;
  }, [G?.uiNpcProtagonistExtraTokenIdsByNpcId]);
  const uiAreaDisplayedSpecialTokenPathsByArea = useMemo<Partial<Record<Area, string[]>>>(
    () => (G?.uiAreaDisplayedSpecialTokenPathsByArea ?? {}),
    [G?.uiAreaDisplayedSpecialTokenPathsByArea],
  );
  const prevLoopRef = useRef<number | null>(null);
  const prevDayRef = useRef<number | null>(null);
  const prevPhaseKeyRef = useRef<string | null>(null);
  const prevLoggedDayLoopRef = useRef<string | null>(null);
  const prevEventOutcomeRef = useRef<string>('');
  const prevCaptainPhaseKeyRef = useRef<string | null>(null);
  const prevCardSelectionSnapshotRef = useRef<string | null>(null);
  const currentPlayer = ctx?.currentPlayer ?? '-';
  /** 仅本机视角为剧作家时可见剧本名与剧本信息（与实体桌游信息隔离一致） */
  const isMastermindView = playerID != null && isMastermind(String(playerID));
  const isProtagonistView = playerID != null && !isMastermind(String(playerID));
  const isProtagonistAView = String(playerID ?? '') === '1';
  /** 版图 / NPC / 放大图上的剧作家 EX 牌面：主人公默认始终显示；剧作家仍受顶栏 EX 开关控制 */
  const showMastermindExCardFacesOnBoard = isProtagonistView || exCardsUiEnabled;
  const dayFlowView: FlowPanelView = isMastermindView
    ? 'mastermind'
    : isProtagonistView
      ? 'protagonist'
      : 'spectator';

  const seatSocketOnline = useMemo(() => {
    const m: Record<string, boolean> = {};
    if (!isMultiplayer || !Array.isArray(matchData)) return m;
    for (const p of matchData) {
      if (p && typeof p.id !== 'undefined') {
        m[String(p.id)] = p.isConnected === true;
      }
    }
    return m;
  }, [isMultiplayer, matchData]);
  const reconnectCredentialsByPid = useMemo<Record<string, string>>(
    () => (G?.reconnectCredentialsByPid ?? {}),
    [G?.reconnectCredentialsByPid],
  );
  const mastermindSeatId = '0';
  const mastermindOffline = isMultiplayer && seatSocketOnline[mastermindSeatId] !== true;
  const mastermindReconnectCred = reconnectCredentialsByPid[mastermindSeatId] ?? '';
  const mastermindTakeoverUrl = (isMultiplayer && multiplayer && mastermindReconnectCred)
    ? buildTakeoverJoinUrl(multiplayer.serverUrl, multiplayer.matchID, mastermindSeatId, mastermindReconnectCred)
    : '';

  const [protagonistSheetDraft, setProtagonistSheetDraft] = useState<ProtagonistPublicSheetDraft>(() => {
    if (typeof window === 'undefined' || playerID == null || !selectedScenarioData?.id) {
      return createEmptyProtagonistPublicSheetDraft();
    }
    if (isMastermind(String(playerID))) return createEmptyProtagonistPublicSheetDraft();
    return loadProtagonistPublicSheetDraft(
      String(playerID),
      selectedScenarioData.id,
      selectedScenarioData.moduleId,
    );
  });

  useEffect(() => {
    if (!isProtagonistView || playerID == null || !selectedScenarioData?.id) {
      setProtagonistSheetDraft(createEmptyProtagonistPublicSheetDraft());
      return;
    }
    setProtagonistSheetDraft(
      loadProtagonistPublicSheetDraft(String(playerID), selectedScenarioData.id, selectedScenarioData.moduleId),
    );
  }, [isProtagonistView, playerID, selectedScenarioData?.id, selectedScenarioData?.moduleId]);

  useEffect(() => {
    if (!isProtagonistView || playerID == null || !selectedScenarioData?.id) return;
    saveProtagonistPublicSheetDraft(String(playerID), selectedScenarioData.id, protagonistSheetDraft, selectedScenarioData.moduleId);
  }, [
    isProtagonistView,
    playerID,
    selectedScenarioData?.id,
    selectedScenarioData?.moduleId,
    protagonistSheetDraft,
  ]);

  const onProtagonistDraftChange = useCallback((patch: Partial<ProtagonistPublicSheetDraft>) => {
    setProtagonistSheetDraft((prev: ProtagonistPublicSheetDraft) => ({ ...prev, ...patch }));
  }, []);

  const maxLoops = maxLoopCountFromSetup(selectedRoundCount, selectedScenarioData);
  const scenarioDayCount = dayCountFromSetup(selectedScenarioData);
  const incidentIdByDay = useMemo(() => {
    const map: Record<number, string> = {};
    for (const row of selectedScenarioData?.ScenarioInfo?.incident_days ?? []) {
      map[row.day] = row.incidentId ?? '';
    }
    return map;
  }, [selectedScenarioData?.ScenarioInfo?.incident_days]);
  const leftTableDayRows = useMemo(
    () => Array.from({ length: Math.max(1, Number(scenarioDayCount ?? 1)) }, (_, i) => i + 1),
    [scenarioDayCount],
  );
  const leftTableLoopRows = useMemo(
    () => Array.from({ length: Math.max(1, Number(maxLoops ?? 1)) }, (_, i) => i + 1),
    [maxLoops],
  );
  const protagonistSeatIds = useMemo(
    () => TRAGEDY_LOOPER_SEATS.filter((seat) => seat.role === 'protagonist').map((seat) => seat.playerId),
    [],
  );
  const selfProtagonistId = isProtagonistView && playerID != null ? String(playerID) : '';
  const connectedProtagonistSeatIds = useMemo(
    () =>
      protagonistSeatIds.filter((pid) => seatSocketOnline[pid] === true),
    [protagonistSeatIds, seatSocketOnline],
  );
  const canProxyDisconnectedProtagonists =
    isProtagonistView &&
    isMultiplayer &&
    connectedProtagonistSeatIds.length > 0 &&
    connectedProtagonistSeatIds.length < protagonistSeatIds.length;
  const controllableProtagonistSeatIds = useMemo(() => {
    if (!isProtagonistView || !selfProtagonistId) return [] as string[];
    if (!canProxyDisconnectedProtagonists) return [selfProtagonistId];
    const set = new Set<string>([selfProtagonistId]);
    for (const pid of protagonistSeatIds) {
      if (seatSocketOnline[pid] !== true) set.add(pid);
    }
    return protagonistSeatIds.filter((pid) => set.has(pid));
  }, [
    isProtagonistView,
    selfProtagonistId,
    canProxyDisconnectedProtagonists,
    protagonistSeatIds,
    seatSocketOnline,
  ]);
  const [actingProtagonistId, setActingProtagonistId] = useState<string>(selfProtagonistId);
  useEffect(() => {
    if (!isProtagonistView || !selfProtagonistId) {
      setActingProtagonistId('');
      return;
    }
    if (controllableProtagonistSeatIds.length === 0) {
      setActingProtagonistId(selfProtagonistId);
      return;
    }
    if (!controllableProtagonistSeatIds.includes(actingProtagonistId)) {
      setActingProtagonistId(controllableProtagonistSeatIds[0]);
    }
  }, [
    isProtagonistView,
    selfProtagonistId,
    controllableProtagonistSeatIds,
    actingProtagonistId,
  ]);
  const currentProtagonistId = actingProtagonistId || selfProtagonistId;
  const mastermindHandIdSet = useMemo(
    () => new Set(G?.hands?.[mastermindSeatId] ?? []),
    [G?.hands, mastermindSeatId],
  );
  const protagonistHandIdSetForCurrent = useMemo(
    () => new Set(G?.hands?.[currentProtagonistId ?? ''] ?? []),
    [G?.hands, currentProtagonistId],
  );
  const mastermindSelectableHandDefs = useMemo(
    () => [
      ...MASTERMIND_ABILITY_HAND,
      ...MASTERMIND_EXTRA_HAND.filter((c) => mastermindHandIdSet.has(c.id)),
    ],
    [mastermindHandIdSet],
  );
  const protagonistSelectableHandDefs = useMemo(
    () => [
      ...PROTAGONIST_STANDARD_HAND,
      ...PROTAGONIST_EXTRA_HAND.filter((c) => protagonistHandIdSetForCurrent.has(c.id)),
    ],
    [protagonistHandIdSetForCurrent],
  );
  const captainPlayerId = currentCaptainProtagonistId(G, scenarioDayCount);
  const captainSeat = captainPlayerId != null ? getSeatByPlayerId(captainPlayerId) : undefined;
  const canUseFlowButtonBySeat = (op: StepFlowButtonOp) =>
    op === 'protagonist' ? true : canUseStepFlowButton(op, dayFlowView);
  const offlineProtagonistSeats = useMemo(
    () =>
      TRAGEDY_LOOPER_SEATS
        .filter((seat) => seat.role === 'protagonist' && seatSocketOnline[seat.playerId] !== true),
    [seatSocketOnline],
  );
  const placementsByArea = useMemo(
    () => npcPlacementsByArea(
      selectedScenarioData,
      npcAreaOverrideByNpcId,
      npcDiscardedByNpcId,
      npcFarawayByNpcId,
      npcAppearedByNpcId,
    ),
    [selectedScenarioData, npcAreaOverrideByNpcId, npcDiscardedByNpcId, npcFarawayByNpcId, npcAppearedByNpcId],
  );
  const farawayNpcPlacements = useMemo(
    () => npcPlacementsAll(selectedScenarioData, npcAreaOverrideByNpcId, npcAppearedByNpcId).filter((p) => npcFarawayByNpcId[p.npcId]),
    [selectedScenarioData, npcAreaOverrideByNpcId, npcFarawayByNpcId, npcAppearedByNpcId],
  );
  /** 四格版图 + 左栏「远方」条：与可见 NPC 芯片一致，用于汇总可选用特殊 token */
  const boardOnScreenNpcPlacements = useMemo(() => {
    const list: NpcBoardPlacement[] = [];
    for (const area of BOARD_QUADRANT_AREAS) {
      list.push(...(placementsByArea[area] ?? []));
    }
    list.push(...farawayNpcPlacements);
    return list;
  }, [placementsByArea, farawayNpcPlacements]);
  useEffect(() => {
    const ids = boardOnScreenNpcPlacements.map((p) => p.npcId);
    setExToolbarRows((rows) =>
      rows.map((r) => {
        if (r.targetKind !== 'npc') return r;
        if (ids.includes(r.npcId)) return r;
        return { ...r, npcId: ids[0] ?? '' };
      }),
    );
  }, [boardOnScreenNpcPlacements]);
  /** 按 `specialTokenImage` 路径去重；标签含 token 名与来源角色 */
  const boardSpecialTokenSelectOptions = useMemo(() => {
    const byPath = new Map<string, { path: string; label: string }>();
    for (const p of boardOnScreenNpcPlacements) {
      const def = Object.values(npcIndex).find((n) => n.id === p.npcId);
      if (!def) continue;
      const path = def.specialTokenImage?.trim();
      if (!path) continue;
      const named = Boolean((def.specialToken ?? '').trim()) || def.hasSpecialToken === true;
      if (!named) continue;
      const tokName = (def.specialToken ?? '').trim() || '特殊 token';
      const label = `${tokName}（${def.name}）`;
      if (!byPath.has(path)) byPath.set(path, { path, label });
    }
    return [...byPath.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-Hans-CN'));
  }, [boardOnScreenNpcPlacements]);
  const specialTokenPathToLabel = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of boardSpecialTokenSelectOptions) m.set(o.path, o.label);
    return m;
  }, [boardSpecialTokenSelectOptions]);
  /** 远方栏文案：【角色名的标记名】（按全 NPC 表解析路径，不依赖当前是否在盘面） */
  const specialTokenFarawayBracketLabelByPath = useMemo(() => {
    const m = new Map<string, string>();
    for (const def of Object.values(npcIndex)) {
      const p = def.specialTokenImage?.trim();
      if (!p) continue;
      const named = Boolean((def.specialToken ?? '').trim()) || def.hasSpecialToken === true;
      if (!named) continue;
      const tokName = (def.specialToken ?? '').trim() || '特殊 token';
      if (!m.has(p)) m.set(p, `【${def.name}的${tokName}】`);
    }
    return m;
  }, []);
  /** 特殊 token 可放置的作用对象：四格版图 + 远方 + 当前盘面上 NPC（去重） */
  const specialTokenAssignTargetOptions = useMemo(() => {
    const opts: { key: string; label: string }[] = [];
    for (const a of BOARD_QUADRANT_AREAS) {
      opts.push({ key: `area:${a}`, label: `${a}版图` });
    }
    opts.push({ key: `area:${Area.Faraway}`, label: '远方版图' });
    const seen = new Set<string>();
    for (const p of boardOnScreenNpcPlacements) {
      if (seen.has(p.npcId)) continue;
      seen.add(p.npcId);
      opts.push({
        key: `npc:${p.npcId}`,
        label: `${p.name}（${AREA_DISPLAY_NAME[p.area] ?? p.area}）`,
      });
    }
    return opts;
  }, [boardOnScreenNpcPlacements]);
  /** 每张 EX 当前挂在何处（便于下拉里提示）；与服务器「全图互斥」一致 */
  const mastermindExCardPinnedLabelById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const a of AreaOptions) {
      const id = (uiMastermindExCardByArea[a] ?? '').trim();
      if (id) m[id] = `${AREA_DISPLAY_NAME[a] ?? a}版图`;
    }
    for (const p of boardOnScreenNpcPlacements) {
      const id = (uiMastermindExCardByNpcId[p.npcId] ?? '').trim();
      if (id && !m[id]) m[id] = `${p.name}（${AREA_DISPLAY_NAME[p.area] ?? p.area}）`;
    }
    return m;
  }, [uiMastermindExCardByArea, uiMastermindExCardByNpcId, boardOnScreenNpcPlacements]);
  const discardedNpcPlacements = useMemo(
    () => npcPlacementsAll(selectedScenarioData, npcAreaOverrideByNpcId, npcAppearedByNpcId).filter((p) => npcDiscardedByNpcId[p.npcId]),
    [selectedScenarioData, npcAreaOverrideByNpcId, npcDiscardedByNpcId, npcAppearedByNpcId],
  );
  const unappearedNpcPlacements = useMemo(
    () => npcUnappearedPlacements(selectedScenarioData, npcAppearedByNpcId),
    [selectedScenarioData, npcAppearedByNpcId],
  );
  const finalGuessCharacters = useMemo(
    () => npcPlacementsAllFromScenario(selectedScenarioData, npcAreaOverrideByNpcId),
    [selectedScenarioData, npcAreaOverrideByNpcId],
  );
  const finalGuessRoleOptions = useMemo(() => {
    const roleIds: string[] = [];
    const pushUnique = (id: string) => {
      const roleId = String(id ?? '').trim();
      if (!roleId || roleIds.includes(roleId)) return;
      roleIds.push(roleId);
    };
    for (const row of selectedScenarioData?.ScenarioInfo?.NpcRoles ?? []) {
      for (const rid of npcRoleAssignments(row)) {
        pushUnique(rid);
      }
    }
    for (const role of selectedModuleData?.roles ?? []) {
      const roleId = String(role?.roleId ?? '');
      if (!roleId || roleIds.includes(roleId)) continue;
      roleIds.push(roleId);
    }
    if (Person.roleId && !roleIds.includes(Person.roleId)) roleIds.push(Person.roleId);
    return roleIds.map((roleId) => ({
      roleId,
      roleName: roleDisplayName(roleId),
    }));
  }, [selectedScenarioData?.ScenarioInfo?.NpcRoles, selectedModuleData?.roles]);
  const finalGuessSelectedRoleByNpcId = useMemo<Record<string, string>>(
    () => (G?.uiFinalGuessSelectedRoleByNpcId ?? {}),
    [G?.uiFinalGuessSelectedRoleByNpcId],
  );
  const finalGuessSolvedNpcIds = useMemo<string[]>(
    () => (Array.isArray(G?.uiFinalGuessSolvedNpcIds) ? G.uiFinalGuessSolvedNpcIds : []),
    [G?.uiFinalGuessSolvedNpcIds],
  );
  const finalGuessStatusByNpcId = useMemo<Record<string, 'correct' | 'wrong'>>(
    () => (G?.uiFinalGuessStatusByNpcId ?? {}),
    [G?.uiFinalGuessStatusByNpcId],
  );
  const finalGuessOrderedNpcIds = useMemo(
    () => finalGuessCharacters.map((row) => row.npcId),
    [finalGuessCharacters],
  );
  const finalGuessAllSolved = useMemo(
    () => finalGuessCharacters.length > 0 && finalGuessSolvedNpcIds.length >= finalGuessCharacters.length,
    [finalGuessCharacters.length, finalGuessSolvedNpcIds.length],
  );
  const canOperateFinalGuess = isProtagonistView && Boolean(G?.inFinalGuess) && !finalGuessAllSolved;

  useEffect(() => {
    if (!npcZoomPlacement) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNpcZoomPlacement(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [npcZoomPlacement]);

  useEffect(() => {
    if (!npcZoomPlacement) return;
    const zoomNpcDefForTok = Object.values(npcIndex).find((n) => n.id === npcZoomPlacement.npcId);
    if (!npcProvidesAssignableSpecialToken(zoomNpcDefForTok) || boardSpecialTokenSelectOptions.length === 0) return;
    setSpecialTokenAssignTargetKey((prev) => {
      if (specialTokenAssignTargetOptions.some((o) => o.key === prev)) return prev;
      return specialTokenAssignTargetOptions[0]?.key ?? `area:${BOARD_QUADRANT_AREAS[0]}`;
    });
  }, [
    npcZoomPlacement?.npcId,
    boardSpecialTokenSelectOptions.length,
    specialTokenAssignTargetOptions,
  ]);

  useEffect(() => {
    setIsFinalGuessModalOpen(Boolean(G?.inFinalGuess));
  }, [G?.inFinalGuess]);

  useEffect(() => {
    if (G?.uiProtagonistADeclarationVisible) {
      setIsProtagonistADeclarationHiddenLocal(false);
    }
  }, [G?.uiProtagonistADeclarationVisible]);

  useEffect(() => {
    setLeftExValue(0);
    setSelectedIncidentDay(null);
  }, [selectedScenarioData?.id]);

  useEffect(() => {
    const currentLoop = typeof G?.loop === 'number' ? G.loop : null;
    const currentDay = typeof G?.day === 'number' ? G.day : null;
    if (currentLoop == null || currentDay == null) return;
    if (prevLoopRef.current == null) {
      prevLoopRef.current = currentLoop;
      prevDayRef.current = currentDay;
      return;
    }
    if (prevLoopRef.current !== currentLoop) {
      setMastermindUsedTodayIds([]);
      setProtagonistUsedTodayIdsByPid({});
      prevLoopRef.current = currentLoop;
      prevDayRef.current = currentDay;
      return;
    }
    if (prevDayRef.current !== currentDay) {
      setMastermindUsedTodayIds([]);
      setProtagonistUsedTodayIdsByPid({});
      prevDayRef.current = currentDay;
    }
  }, [G?.loop, G?.day]);

  useEffect(() => {
    if (!multiplayer?.credentials || !playerID) return;
    moves.registerReconnectCredential?.({ credentials: multiplayer.credentials });
  }, [multiplayer?.credentials, playerID, moves]);

  const selectedMastermindCardCount = useMemo(() => {
    const areaCount = Object.values(selectedMastermindCardByArea).filter((id) => Boolean(id)).length;
    const npcCount = Object.values(selectedMastermindCardByNpcId).filter((id) => Boolean(id)).length;
    return areaCount + npcCount;
  }, [selectedMastermindCardByArea, selectedMastermindCardByNpcId]);
  const mastermindReachedDailyLimit = selectedMastermindCardCount >= 3;
  const actionResolutionFlatIndex = useMemo(
    () => TRAGEDY_DAY_MAIN_FLOW_FLAT.findIndex((entry) => entry.meta.step === Steps.ActionResolution),
    [],
  );
  const shouldRevealMastermindCardFace = useMemo(() => {
    const idx = Number(G?.dayFlowFlatIndex ?? 0);
    if (actionResolutionFlatIndex < 0) return false;
    return idx >= actionResolutionFlatIndex;
  }, [G?.dayFlowFlatIndex, actionResolutionFlatIndex]);
  const currentPhaseName = useMemo(
    () => boardPhaseDisplayName(G as Record<string, unknown> | null | undefined),
    [G],
  );
  const isActionCardPhaseActive = useMemo(() => {
    return (
      currentPhaseName === Steps.PlaywrightAction
      || currentPhaseName === Steps.ProtagonistAction
      || currentPhaseName === Steps.ActionResolution
    );
  }, [currentPhaseName]);
  const mastermindCardNameById = useMemo<Record<string, string>>(
    () => Object.fromEntries(MASTERMIND_ALL_HAND_DEFS.map((card) => [card.id, card.name] as const)),
    [],
  );
  const protagonistCardNameById = useMemo<Record<string, string>>(
    () => Object.fromEntries(PROTAGONIST_ALL_HAND_DEFS.map((card) => [card.id, card.name] as const)),
    [],
  );

  const getProtagonistCardBackByPid = useCallback((pid: string) => {
    const idx = protagonistSeatIds.indexOf(pid);
    return idx >= 0 && idx < PROTAGONIST_CARD_IMAGES.length ? PROTAGONIST_CARD_IMAGES[idx] : PROTAGONIST_CARD_IMAGES[0];
  }, [protagonistSeatIds]);

  const resolveProtagonistCardAssetUrl = useCallback((rawPath: string | undefined, fallback: string) => {
    if (!rawPath) return fallback;
    const normalized = rawPath.startsWith('../assert/')
      ? rawPath.replace('../assert/', './assert/')
      : rawPath;
    try {
      return new URL(normalized, import.meta.url).href;
    } catch {
      return fallback;
    }
  }, []);

  const getProtagonistCardFaceByPidAndCardId = useCallback((pid: string, cardId: string) => {
    const back = getProtagonistCardBackByPid(pid);
    if (!cardId) return back;
    const def = getTragedyHandCardById(cardId);
    if (!def || def.side !== 'protagonist') return back;
    const idx = protagonistSeatIds.indexOf(pid);
    if (idx === 0) return resolveProtagonistCardAssetUrl(def.imageUrlA, back);
    if (idx === 1) return resolveProtagonistCardAssetUrl(def.imageUrlB, back);
    if (idx === 2) return resolveProtagonistCardAssetUrl(def.imageUrlC, back);
    return resolveProtagonistCardAssetUrl(def.imageUrlA, back);
  }, [getProtagonistCardBackByPid, protagonistSeatIds, resolveProtagonistCardAssetUrl]);

  const getVisibleProtagonistSelectorForArea = useCallback((area: Area): string => {
    if (!isMastermindView && !isProtagonistView) return '';
    return protagonistSeatIds.find((pid) => Boolean(selectedProtagonistCardByAreaByPid[pid]?.[area])) ?? '';
  }, [isMastermindView, isProtagonistView, protagonistSeatIds, selectedProtagonistCardByAreaByPid]);

  const getVisibleProtagonistSelectorForNpc = useCallback((npcId: string): string => {
    if (!isMastermindView && !isProtagonistView) return '';
    return protagonistSeatIds.find((pid) => Boolean(selectedProtagonistCardByNpcByPid[pid]?.[npcId])) ?? '';
  }, [isMastermindView, isProtagonistView, protagonistSeatIds, selectedProtagonistCardByNpcByPid]);

  const protagonistSelectedCardCountForPid = useCallback((pid: string): number => {
    const areaCount = Object.values(selectedProtagonistCardByAreaByPid[pid] ?? {}).filter((id) => Boolean(id)).length;
    const npcCount = Object.values(selectedProtagonistCardByNpcByPid[pid] ?? {}).filter((id) => Boolean(id)).length;
    return areaCount + npcCount;
  }, [selectedProtagonistCardByAreaByPid, selectedProtagonistCardByNpcByPid]);

  const isProtagonistCardUsedByPid = useCallback((pid: string, cardId: string, oncePerLoop?: boolean) => {
    return oncePerLoop
      ? (protagonistUsedOncePerLoopIdsByPid[pid] ?? []).includes(cardId)
      : (protagonistUsedTodayIdsByPid[pid] ?? []).includes(cardId);
  }, [protagonistUsedOncePerLoopIdsByPid, protagonistUsedTodayIdsByPid]);

  const isAreaSelectedByOtherProtagonist = useCallback((pid: string, area: Area): boolean => {
    return protagonistSeatIds.some((otherPid) => otherPid !== pid && Boolean(selectedProtagonistCardByAreaByPid[otherPid]?.[area]));
  }, [protagonistSeatIds, selectedProtagonistCardByAreaByPid]);

  const isNpcSelectedByOtherProtagonist = useCallback((pid: string, npcId: string): boolean => {
    return protagonistSeatIds.some((otherPid) => otherPid !== pid && Boolean(selectedProtagonistCardByNpcByPid[otherPid]?.[npcId]));
  }, [protagonistSeatIds, selectedProtagonistCardByNpcByPid]);

  const applyProtagonistCardSelection = useCallback(
    (
      pid: string,
      nextCardId: string,
      currentCardId: string,
      assignCardId: (cardId: string) => void,
      targetLockedByOther: boolean,
    ) => {
      if (!isActionCardPhaseActive) return;
      const selectedDef = nextCardId ? getTragedyHandCardById(nextCardId) : undefined;
      if (selectedDef && selectedDef.side !== 'protagonist') return;
      const alreadyUsed = selectedDef ? isProtagonistCardUsedByPid(pid, selectedDef.id, selectedDef.oncePerLoop) : false;
      const reachedSinglePlayLimit = protagonistSelectedCardCountForPid(pid) >= 1;
      if (targetLockedByOther && nextCardId !== currentCardId) return;
      if (selectedDef && alreadyUsed && nextCardId !== currentCardId) return;
      if (nextCardId && nextCardId !== currentCardId && reachedSinglePlayLimit) return;

      const prevOnceKey = (G?.uiProtagonistOncePerLoopUsedHandCardIdsByPid?.[pid] ?? EMPTY_STRING_ARRAY).join('\0');
      let nextOnceList = [...(G?.uiProtagonistOncePerLoopUsedHandCardIdsByPid?.[pid] ?? [])];

      if (currentCardId && currentCardId !== nextCardId) {
        const currentDef = getTragedyHandCardById(currentCardId);
        if (currentDef?.side === 'protagonist') {
          if (currentDef.oncePerLoop) {
            nextOnceList = nextOnceList.filter((id) => id !== currentCardId);
          } else {
            setProtagonistUsedTodayIdsByPid((prev) => ({
              ...prev,
              [pid]: (prev[pid] ?? []).filter((id) => id !== currentCardId),
            }));
          }
        }
      }

      assignCardId(nextCardId);
      if (selectedDef && nextCardId && nextCardId !== currentCardId) {
        if (selectedDef.oncePerLoop) {
          nextOnceList = nextOnceList.includes(nextCardId) ? nextOnceList : [...nextOnceList, nextCardId];
        } else {
          setProtagonistUsedTodayIdsByPid((prev) => ({
            ...prev,
            [pid]: (prev[pid] ?? []).includes(nextCardId) ? (prev[pid] ?? []) : [...(prev[pid] ?? []), nextCardId],
          }));
        }
      }

      const nextOnceKey = nextOnceList.join('\0');
      if (prevOnceKey !== nextOnceKey) {
        moves.setUiProtagonistOncePerLoopUsedHandCards?.({ pid, cardIds: nextOnceList });
      }
    },
    [G?.uiProtagonistOncePerLoopUsedHandCardIdsByPid, isActionCardPhaseActive, isProtagonistCardUsedByPid, moves, protagonistSelectedCardCountForPid],
  );

  const isMastermindCardUsed = useCallback((cardId: string, oncePerLoop?: boolean) => {
    return oncePerLoop
      ? mastermindUsedOncePerLoopIds.includes(cardId)
      : mastermindUsedTodayIds.includes(cardId);
  }, [mastermindUsedOncePerLoopIds, mastermindUsedTodayIds]);

  const applyMastermindCardSelection = useCallback(
    (
      nextCardId: string,
      currentCardId: string,
      assignCardId: (cardId: string) => void,
    ) => {
      if (!isActionCardPhaseActive) return;
      const selectedDef = nextCardId ? getTragedyHandCardById(nextCardId) : undefined;
      if (selectedDef && selectedDef.side !== 'mastermind') return;
      const alreadyUsed = selectedDef ? isMastermindCardUsed(selectedDef.id, selectedDef.oncePerLoop) : false;
      if (selectedDef && alreadyUsed && nextCardId !== currentCardId) return;

      const prevOnceKey = (G?.uiMastermindOncePerLoopUsedHandCardIds ?? EMPTY_STRING_ARRAY).join('\0');
      let nextOnceList = [...(G?.uiMastermindOncePerLoopUsedHandCardIds ?? [])];

      if (currentCardId && currentCardId !== nextCardId) {
        const currentDef = getTragedyHandCardById(currentCardId);
        if (currentDef?.side === 'mastermind') {
          if (currentDef.oncePerLoop) {
            nextOnceList = nextOnceList.filter((id) => id !== currentCardId);
          } else {
            setMastermindUsedTodayIds((prev) => prev.filter((id) => id !== currentCardId));
          }
        }
      }

      assignCardId(nextCardId);
      if (selectedDef && nextCardId && nextCardId !== currentCardId) {
        if (selectedDef.oncePerLoop) {
          nextOnceList = nextOnceList.includes(nextCardId) ? nextOnceList : [...nextOnceList, nextCardId];
        } else {
          setMastermindUsedTodayIds((prev) => (prev.includes(nextCardId) ? prev : [...prev, nextCardId]));
        }
      }

      const nextOnceKey = nextOnceList.join('\0');
      if (prevOnceKey !== nextOnceKey) {
        moves.setUiMastermindOncePerLoopUsedHandCards?.({ cardIds: nextOnceList });
      }
    },
    [G?.uiMastermindOncePerLoopUsedHandCardIds, isActionCardPhaseActive, isMastermindCardUsed, moves],
  );

  const currentHandOwnerPid = isMastermindView ? mastermindSeatId : (isProtagonistView ? currentProtagonistId : '');
  const currentPlayerHandCards = useMemo(() => {
    if (isMastermindView) {
      const autoDiscardedIds = new Set(mastermindUsedOncePerLoopIds);
      const manualDiscardedIds = new Set(discardedHandCardIdsByPid[mastermindSeatId] ?? []);
      const selectedIds = new Set(
        [...Object.values(selectedMastermindCardByArea), ...Object.values(selectedMastermindCardByNpcId)].filter(
          (id): id is string => Boolean(id),
        ),
      );
      const mapCard = (card: (typeof MASTERMIND_ABILITY_HAND)[number] | (typeof MASTERMIND_EXTRA_HAND)[number]) => ({
        id: card.id,
        name: card.name,
        description: card.description,
        imageUrl: MASTERMIND_CARD_IMAGE_BY_ID[card.id] ?? mastermindCardBackImg0b,
        oncePerLoop: Boolean(card.oncePerLoop),
        used: isMastermindCardUsed(card.id, card.oncePerLoop),
        selected: selectedIds.has(card.id),
        discarded: autoDiscardedIds.has(card.id) || manualDiscardedIds.has(card.id),
        autoDiscarded: autoDiscardedIds.has(card.id),
      });
      return [
        ...MASTERMIND_ABILITY_HAND.map(mapCard),
        ...MASTERMIND_EXTRA_HAND.filter((c) => mastermindHandIdSet.has(c.id)).map(mapCard),
      ];
    }
    if (isProtagonistView && currentProtagonistId) {
      const autoDiscardedIds = new Set(protagonistUsedOncePerLoopIdsByPid[currentProtagonistId] ?? []);
      const manualDiscardedIds = new Set(discardedHandCardIdsByPid[currentProtagonistId] ?? []);
      const selectedIds = new Set(
        [
          ...Object.values(selectedProtagonistCardByAreaByPid[currentProtagonistId] ?? {}),
          ...Object.values(selectedProtagonistCardByNpcByPid[currentProtagonistId] ?? {}),
        ].filter((id): id is string => Boolean(id)),
      );
      const mapPCard = (card: (typeof PROTAGONIST_STANDARD_HAND)[number] | (typeof PROTAGONIST_EXTRA_HAND)[number]) => ({
        id: card.id,
        name: card.name,
        description: card.description,
        imageUrl: getProtagonistCardFaceByPidAndCardId(currentProtagonistId, card.id),
        oncePerLoop: Boolean(card.oncePerLoop),
        used: isProtagonistCardUsedByPid(currentProtagonistId, card.id, card.oncePerLoop),
        selected: selectedIds.has(card.id),
        discarded: autoDiscardedIds.has(card.id) || manualDiscardedIds.has(card.id),
        autoDiscarded: autoDiscardedIds.has(card.id),
      });
      return [
        ...PROTAGONIST_STANDARD_HAND.map(mapPCard),
        ...PROTAGONIST_EXTRA_HAND.filter((c) => protagonistHandIdSetForCurrent.has(c.id)).map(mapPCard),
      ];
    }
    return [] as Array<{
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      oncePerLoop: boolean;
      used: boolean;
      selected: boolean;
      discarded: boolean;
      autoDiscarded: boolean;
    }>;
  }, [
    currentProtagonistId,
    currentHandOwnerPid,
    discardedHandCardIdsByPid,
    getProtagonistCardFaceByPidAndCardId,
    isMastermindCardUsed,
    isMastermindView,
    isProtagonistCardUsedByPid,
    isProtagonistView,
    mastermindUsedOncePerLoopIds,
    protagonistUsedOncePerLoopIdsByPid,
    selectedMastermindCardByArea,
    selectedMastermindCardByNpcId,
    selectedProtagonistCardByAreaByPid,
    selectedProtagonistCardByNpcByPid,
    mastermindHandIdSet,
    protagonistHandIdSetForCurrent,
  ]);
  const discardedHandCardsForAllPlayers = useMemo(() => {
    const entries: Array<{ pid: string; playerName: string; cardId: string; cardName: string; autoDiscarded: boolean }> = [];
    for (const seat of TRAGEDY_LOOPER_SEATS) {
      const pid = seat.playerId;
      const manualSet = new Set(discardedHandCardIdsByPid[pid] ?? []);
      const autoSet = seat.role === 'mastermind'
        ? new Set(mastermindUsedOncePerLoopIds)
        : new Set(protagonistUsedOncePerLoopIdsByPid[pid] ?? []);
      const defs = seat.role === 'mastermind' ? MASTERMIND_ALL_HAND_DEFS : PROTAGONIST_ALL_HAND_DEFS;
      for (const card of defs) {
        const isAuto = autoSet.has(card.id);
        if (!isAuto && !manualSet.has(card.id)) continue;
        entries.push({
          pid,
          playerName: seat.displayName,
          cardId: card.id,
          cardName: card.name,
          autoDiscarded: isAuto,
        });
      }
    }
    return entries;
  }, [discardedHandCardIdsByPid, mastermindUsedOncePerLoopIds, protagonistUsedOncePerLoopIdsByPid]);

  const getNpcTokenCounts = useCallback((npcId: string) => {
    const base = getNpcBoardTokenCounts(npcId);
    const override = npcTokenOverrideByNpcId[npcId] as
      | { friendly?: number; unrest?: number; plot?: number; hope?: number; despair?: number }
      | undefined;
    if (!override) return base;
    return {
      friendly: Number(override.friendly ?? base.friendly),
      unrest: Number(override.unrest ?? base.unrest),
      unrestMax: base.unrestMax,
      plot: Number(override.plot ?? base.plot),
      hope: Number(override.hope ?? base.hope),
      despair: Number(override.despair ?? base.despair),
    };
  }, [npcTokenOverrideByNpcId]);

  const appendGameLog = useCallback((entry: Omit<GameLogEntry, 'id' | 'ts'>) => {
    const now = new Date();
    const ts = now.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const id = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
    setGameLogs((prev) => {
      const next = [...prev, { ...entry, id, ts }];
      if (next.length <= MAX_GAME_LOG_ENTRIES) return next;
      return next.slice(next.length - MAX_GAME_LOG_ENTRIES);
    });
  }, []);

  const buildRoleTokenSnapshotText = useCallback((): string => {
    const areaOrder: Area[] = [Area.Hospital, Area.Shrine, Area.City, Area.School, Area.Faraway];
    const lines: string[] = [];
    for (const area of areaOrder) {
      const placements = area === Area.Faraway ? farawayNpcPlacements : (placementsByArea[area] ?? []);
      for (const p of placements) {
        const tok = getNpcTokenCounts(p.npcId);
        lines.push(`${p.name}（${mastermindRoleLabels(p, roleDisplayName)}）@${AREA_DISPLAY_NAME[area]}：友${tok.friendly} / 不${tok.unrest}/${tok.unrestMax} / 密${tok.plot}`);
      }
    }
    return lines.length > 0 ? lines.join('\n') : '暂无角色在版图上';
  }, [farawayNpcPlacements, getNpcTokenCounts, placementsByArea]);

  const buildBoardTokenSummaryText = useCallback((): string => {
    const areaOrder: Area[] = [Area.Hospital, Area.Shrine, Area.City, Area.School, Area.Faraway];
    return areaOrder
      .map((area) => {
        const placements = area === Area.Faraway ? farawayNpcPlacements : (placementsByArea[area] ?? []);
        const totals = placements.reduce(
          (acc, p) => {
            const tok = getNpcTokenCounts(p.npcId);
            acc.plot += Number(tok.plot ?? 0);
            return acc;
          },
          { plot: 0 },
        );
        return `${AREA_DISPLAY_NAME[area]}：密${totals.plot}`;
      })
      .join('\n');
  }, [farawayNpcPlacements, getNpcTokenCounts, placementsByArea]);

  const buildActionResolutionUsageSummaryText = useCallback((): string => {
    const lines: string[] = [];
    for (const area of Object.values(Area)) {
      const cardId = selectedMastermindCardByArea[area] ?? '';
      if (!cardId) continue;
      const cardName = mastermindCardNameById[cardId] ?? cardId;
      lines.push(`【剧作家】对【${AREA_DISPLAY_NAME[area]}】使用了【${cardName}】`);
    }
    for (const [npcId, cardId] of Object.entries(selectedMastermindCardByNpcId)) {
      if (!cardId) continue;
      const cardName = mastermindCardNameById[cardId] ?? cardId;
      lines.push(`【剧作家】对【${npcDisplayName(npcId)}】使用了【${cardName}】`);
    }
    for (const pid of protagonistSeatIds) {
      const seatName = getSeatByPlayerId(pid)?.displayName ?? `主人公${pid}`;
      const areaMap = selectedProtagonistCardByAreaByPid[pid] ?? {};
      for (const area of Object.values(Area)) {
        const cardId = areaMap[area] ?? '';
        if (!cardId) continue;
        const cardName = protagonistCardNameById[cardId] ?? cardId;
        lines.push(`【${seatName}】对【${AREA_DISPLAY_NAME[area]}】使用了【${cardName}】`);
      }
      const npcMap = selectedProtagonistCardByNpcByPid[pid] ?? {};
      for (const [npcId, cardId] of Object.entries(npcMap)) {
        if (!cardId) continue;
        const cardName = protagonistCardNameById[cardId] ?? cardId;
        lines.push(`【${seatName}】对【${npcDisplayName(npcId)}】使用了【${cardName}】`);
      }
    }
    return lines.length > 0 ? lines.join('\n') : '当前无已使用行动牌';
  }, [
    mastermindCardNameById,
    protagonistCardNameById,
    protagonistSeatIds,
    selectedMastermindCardByArea,
    selectedMastermindCardByNpcId,
    selectedProtagonistCardByAreaByPid,
    selectedProtagonistCardByNpcByPid,
  ]);

  useEffect(() => {
    const phaseKey = [
      currentPhaseName,
      String(Boolean(G?.inTimeSpiral)),
      String(Boolean(G?.inFinalGuess)),
      String(Boolean(G?.awaitingProtagonistFinalConsensus)),
      String(Number(G?.dayFlowFlatIndex ?? -1)),
    ].join('|');
    if (prevPhaseKeyRef.current == null) {
      prevPhaseKeyRef.current = phaseKey;
      return;
    }
    if (prevPhaseKeyRef.current === phaseKey) return;
    prevPhaseKeyRef.current = phaseKey;
    appendGameLog({
      loop: Number(G?.loop ?? 1),
      day: Number(G?.day ?? 1),
      phase: currentPhaseName,
      actor: '※系统',
      action: '角色状态播报※',
      detail: buildRoleTokenSnapshotText(),
      level: 'info',
    });
    appendGameLog({
      loop: Number(G?.loop ?? 1),
      day: Number(G?.day ?? 1),
      phase: currentPhaseName,
      actor: '※系统',
      action: '版图状态播报※',
      detail: buildBoardTokenSummaryText(),
      level: 'info',
    });
    if (currentPhaseName === Steps.ActionResolution) {
      appendGameLog({
        loop: Number(G?.loop ?? 1),
        day: Number(G?.day ?? 1),
        phase: currentPhaseName,
        actor: '※系统',
        action: '玩家卡牌使用播报※',
        detail: buildActionResolutionUsageSummaryText(),
        level: 'info',
      });
    }
  }, [
    G?.awaitingProtagonistFinalConsensus,
    G?.day,
    G?.dayFlowFlatIndex,
    G?.inFinalGuess,
    G?.inTimeSpiral,
    G?.loop,
    appendGameLog,
    buildActionResolutionUsageSummaryText,
    buildBoardTokenSummaryText,
    buildRoleTokenSnapshotText,
    currentPhaseName,
  ]);

  useEffect(() => {
    const loop = Number(G?.loop ?? 1);
    const day = Number(G?.day ?? 1);
    const key = `${loop}-${day}`;
    if (prevLoggedDayLoopRef.current == null) {
      prevLoggedDayLoopRef.current = key;
      return;
    }
    if (prevLoggedDayLoopRef.current === key) return;
    prevLoggedDayLoopRef.current = key;
    appendGameLog({
      loop,
      day,
      phase: Steps.DownPhase,
      actor: '系统',
      action: '进入新的一天',
      detail: '',
      level: 'success',
    });
  }, [G?.day, G?.loop, appendGameLog]);

  useEffect(() => {
    const raw = String(G?.uiEventPhaseOutcome ?? '');
    if (prevEventOutcomeRef.current === '') {
      prevEventOutcomeRef.current = raw;
      return;
    }
    if (raw === prevEventOutcomeRef.current) return;
    prevEventOutcomeRef.current = raw;
    const outcomeLabel = EVENT_PHASE_OUTCOME_OPTIONS.find((opt) => opt.value === raw)?.label ?? '';
    if (!outcomeLabel) return;
    if (currentPhaseName !== Steps.EventPhase) return;
    const incidentName = incidentDisplayName(incidentIdByDay[Number(G?.day ?? 1)] ?? '');
    appendGameLog({
      loop: Number(G?.loop ?? 1),
      day: Number(G?.day ?? 1),
      phase: Steps.EventPhase,
      actor: '※系统',
      action: '事件发生情况播报※',
      detail: `【${incidentName}】：【${outcomeLabel}】`,
      level: 'info',
    });
  }, [G?.day, G?.loop, G?.uiEventPhaseOutcome, appendGameLog, currentPhaseName, incidentIdByDay]);

  useEffect(() => {
    const loop = Number(G?.loop ?? 1);
    const day = Number(G?.day ?? 1);
    const snapshot = JSON.stringify({
      mArea: selectedMastermindCardByArea,
      mNpc: selectedMastermindCardByNpcId,
      pArea: selectedProtagonistCardByAreaByPid,
      pNpc: selectedProtagonistCardByNpcByPid,
    });
    if (prevCardSelectionSnapshotRef.current == null) {
      prevCardSelectionSnapshotRef.current = snapshot;
      return;
    }
    const prev = JSON.parse(prevCardSelectionSnapshotRef.current) as {
      mArea: Record<Area, string>;
      mNpc: Record<string, string>;
      pArea: Record<string, Partial<Record<Area, string>>>;
      pNpc: Record<string, Record<string, string>>;
    };
    prevCardSelectionSnapshotRef.current = snapshot;
    if (!isActionCardPhaseActive) return;
    const shouldRevealCardName = currentPhaseName === Steps.ActionResolution;
    const toCardLabel = (cardName: string) => (shouldRevealCardName ? `【${cardName}】` : '【行动牌】');

    const pushUsageLog = (line: string) => {
      appendGameLog({
        loop,
        day,
        phase: currentPhaseName,
        actor: '※系统',
        action: '玩家卡牌使用播报※',
        detail: line,
        level: 'info',
      });
    };

    for (const area of Object.values(Area)) {
      const nowCardId = selectedMastermindCardByArea[area] ?? '';
      const prevCardId = prev.mArea?.[area] ?? '';
      if (prevCardId && prevCardId !== nowCardId) {
        const prevCardName = mastermindCardNameById[prevCardId] ?? prevCardId;
        pushUsageLog(`【剧作家】撤销了对【${AREA_DISPLAY_NAME[area]}】使用的${toCardLabel(prevCardName)}`);
      }
      if (nowCardId && nowCardId !== prevCardId) {
        const nowCardName = mastermindCardNameById[nowCardId] ?? nowCardId;
        pushUsageLog(`【剧作家】对【${AREA_DISPLAY_NAME[area]}】使用了${toCardLabel(nowCardName)}`);
      }
    }
    for (const [npcId, nowCardId] of Object.entries(selectedMastermindCardByNpcId)) {
      const prevCardId = prev.mNpc?.[npcId] ?? '';
      if (prevCardId && prevCardId !== nowCardId) {
        const prevCardName = mastermindCardNameById[prevCardId] ?? prevCardId;
        pushUsageLog(`【剧作家】撤销了对【${npcDisplayName(npcId)}】使用的${toCardLabel(prevCardName)}`);
      }
      if (nowCardId && nowCardId !== prevCardId) {
        const nowCardName = mastermindCardNameById[nowCardId] ?? nowCardId;
        pushUsageLog(`【剧作家】对【${npcDisplayName(npcId)}】使用了${toCardLabel(nowCardName)}`);
      }
    }
    for (const pid of protagonistSeatIds) {
      const seatName = getSeatByPlayerId(pid)?.displayName ?? `主人公${pid}`;
      const nowAreaMap = selectedProtagonistCardByAreaByPid[pid] ?? {};
      const prevAreaMap = prev.pArea?.[pid] ?? {};
      for (const area of Object.values(Area)) {
        const nowCardId = nowAreaMap[area] ?? '';
        const prevCardId = prevAreaMap[area] ?? '';
        if (prevCardId && prevCardId !== nowCardId) {
          const prevCardName = protagonistCardNameById[prevCardId] ?? prevCardId;
          pushUsageLog(`【${seatName}】撤销了对【${AREA_DISPLAY_NAME[area]}】使用的${toCardLabel(prevCardName)}`);
        }
        if (nowCardId && nowCardId !== prevCardId) {
          const nowCardName = protagonistCardNameById[nowCardId] ?? nowCardId;
          pushUsageLog(`【${seatName}】对【${AREA_DISPLAY_NAME[area]}】使用了${toCardLabel(nowCardName)}`);
        }
      }
      const nowNpcMap = selectedProtagonistCardByNpcByPid[pid] ?? {};
      const prevNpcMap = prev.pNpc?.[pid] ?? {};
      for (const [npcId, nowCardId] of Object.entries(nowNpcMap)) {
        const prevCardId = prevNpcMap[npcId] ?? '';
        if (prevCardId && prevCardId !== nowCardId) {
          const prevCardName = protagonistCardNameById[prevCardId] ?? prevCardId;
          pushUsageLog(`【${seatName}】撤销了对【${npcDisplayName(npcId)}】使用的${toCardLabel(prevCardName)}`);
        }
        if (nowCardId && nowCardId !== prevCardId) {
          const nowCardName = protagonistCardNameById[nowCardId] ?? nowCardId;
          pushUsageLog(`【${seatName}】对【${npcDisplayName(npcId)}】使用了${toCardLabel(nowCardName)}`);
        }
      }
    }
  }, [
    G?.day,
    G?.loop,
    appendGameLog,
    currentPhaseName,
    isActionCardPhaseActive,
    mastermindCardNameById,
    protagonistCardNameById,
    protagonistSeatIds,
    selectedMastermindCardByArea,
    selectedMastermindCardByNpcId,
    selectedProtagonistCardByAreaByPid,
    selectedProtagonistCardByNpcByPid,
  ]);

  useEffect(() => {
    const phaseKey = `${Number(G?.loop ?? 1)}-${Number(G?.day ?? 1)}-${currentPhaseName}`;
    if (currentPhaseName !== Steps.CaptainRotation) {
      prevCaptainPhaseKeyRef.current = phaseKey;
      return;
    }
    if (prevCaptainPhaseKeyRef.current === phaseKey) return;
    prevCaptainPhaseKeyRef.current = phaseKey;
    appendGameLog({
      loop: Number(G?.loop ?? 1),
      day: Number(G?.day ?? 1),
      phase: currentPhaseName,
      actor: '※系统',
      action: '夜晚阶段播报※',
      detail: `队长切换为：【${captainSeat?.displayName ?? '主人公A'}】`,
      level: 'info',
    });
  }, [G?.day, G?.loop, appendGameLog, captainSeat?.displayName, currentPhaseName]);

  const getNpcAlive = useCallback((npcId: string) => {
    const override = npcAliveOverrideByNpcId[npcId];
    if (typeof override === 'boolean') return override;
    return Object.values(npcIndex).find((n) => n.id === npcId)?.npcState?.isAlive ?? true;
  }, [npcAliveOverrideByNpcId]);

  const adjustNpcTokenValue = useCallback((
    npcId: string,
    token: 'friendly' | 'unrest' | 'plot' | 'hope' | 'despair',
    delta: number,
  ) => {
    const base = getNpcBoardTokenCounts(npcId);
    const merged = getNpcTokenCounts(npcId);
    const cur = Number(merged[token] ?? 0);
    const nextValue = Math.max(0, cur + delta);
    moves.adjustUiNpcToken?.({
      npcId,
      token,
      delta: nextValue - cur,
      fullBase: {
        friendly: base.friendly,
        unrest: base.unrest,
        plot: base.plot,
        hope: base.hope,
        despair: base.despair,
      },
    });
  }, [moves, getNpcTokenCounts]);

  const getDisplayedSpecialTokenUrlsForNpc = useCallback((npcId: string) => {
    const paths = uiNpcDisplayedSpecialTokenPathsByNpcId[npcId] ?? [];
    const urls: string[] = [];
    for (const p of paths) {
      const u = resolveTokenImageUrl(p);
      if (u) urls.push(u);
    }
    return urls;
  }, [uiNpcDisplayedSpecialTokenPathsByNpcId]);

  const getProtagonistExtraTokenUrlsForNpc = useCallback((npcId: string) => {
    const ids = uiNpcProtagonistExtraTokenIdsByNpcId[npcId] ?? [];
    const urls: string[] = [];
    for (const id of ids) {
      const def = PROTAGONIST_EXTRA_TOKEN_DEFS.find((d) => d.id === id);
      if (!def) continue;
      const u = resolveTokenImageUrl(def.imagePath);
      if (u) urls.push(u);
    }
    return urls;
  }, [uiNpcProtagonistExtraTokenIdsByNpcId]);

  const getAreaConspiracy = useCallback((area: Area): number => {
    return Number(G?.boardAreaConspiracy?.[area] ?? 0);
  }, [G?.boardAreaConspiracy]);

  const npcCardSizeByAreaCount = useCallback((
    count: number,
  ): { width: string; maxWidth: string; boardActionCardImgWidth: string } => {
    if (count <= 6) {
      const col = 'min(calc(33.333% - clamp(3px, 0.45vw, 6px)), 32cqh)';
      return {
        width: col,
        maxWidth: col,
        boardActionCardImgWidth: `calc(0.42 * (${col}))`,
      };
    }
    // 超过 6 张时自动增列并缩小，尽量把 NPC 填满版图区域
    const cols = Math.max(4, Math.ceil(count / 2));
    const col = `calc(${(100 / cols).toFixed(3)}% - clamp(3px, 0.42vw, 6px))`;
    return {
      width: col,
      maxWidth: col,
      boardActionCardImgWidth: `calc(0.42 * (${col}))`,
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.playerStrip}>
        {TRAGEDY_LOOPER_SEATS.map((seat) => {
          const isTurn = String(currentPlayer) === seat.playerId;
          const isYou = String(playerID) === seat.playerId;
          const isCaptain = seat.role === 'protagonist' && seat.playerId === captainPlayerId;
          const sideLabel = seat.role === 'mastermind' ? '剧作家方' : '主人公方';
          const showOnline = isMultiplayer && seatSocketOnline[seat.playerId];
          const isProtagonistASeat = seat.playerId === '1';
          const canTriggerADeclaration = isProtagonistASeat && isProtagonistAView;
          return (
            <div
              key={seat.playerId}
              style={{
                ...styles.playerChip,
                ...(seat.role === 'mastermind' ? styles.playerChipMastermind : styles.playerChipProtagonist),
                ...(isTurn ? styles.playerChipActive : {}),
                ...(isYou ? styles.playerChipYou : {}),
                ...(canTriggerADeclaration ? styles.playerChipClickable : {}),
              }}
              title={`${seat.displayName}（${sideLabel}）${isCaptain ? ' · 当日队长' : ''}${showOnline ? ' · 在线' : ''}`}
              onClick={() => {
                if (!canTriggerADeclaration) return;
                moves.setUiProtagonistADeclarationVisible?.({ visible: true });
              }}
            >
              <span style={{ ...styles.playerChipId, ...styles.playerChipText }}>P{seat.playerId}</span>
              <span style={{ ...styles.playerChipName, ...styles.playerChipText }}>{seat.displayName}</span>
              {showOnline ? (
                <span style={{ ...styles.playerChipOnline, ...styles.playerChipText }}>在线</span>
              ) : null}
              {isCaptain ? <span style={{ ...styles.playerChipCaptain, ...styles.playerChipText }}>队长</span> : null}
              {isYou ? <span style={{ ...styles.playerChipBadge, ...styles.playerChipText }}>本机</span> : null}
            </div>
          );
        })}
      </div>
      {G?.uiProtagonistADeclarationVisible && !isProtagonistADeclarationHiddenLocal ? (
        <div
          style={styles.protagonistADeclarationOverlay}
          onClick={() => {
            if (isProtagonistAView) {
              moves.setUiProtagonistADeclarationVisible?.({ visible: false });
              return;
            }
            setIsProtagonistADeclarationHiddenLocal(true);
          }}
        >
          <div style={styles.protagonistADeclarationModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.protagonistADeclarationText}>争取杀掉所有人！</div>
            <button
              type="button"
              style={styles.protagonistADeclarationCloseBtn}
              onClick={() => {
                if (isProtagonistAView) {
                  moves.setUiProtagonistADeclarationVisible?.({ visible: false });
                  return;
                }
                setIsProtagonistADeclarationHiddenLocal(true);
              }}
            >
              关闭
            </button>
          </div>
        </div>
      ) : null}
      {isMastermindView && isMultiplayer && multiplayer ? (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ color: '#c4b5fd', fontSize: 13, marginBottom: 6 }}>离线主人公接管邀请链接</div>
          {offlineProtagonistSeats.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 12 }}>当前主人公均在线</div>
          ) : (
            offlineProtagonistSeats.map((seat) => {
              const cred = reconnectCredentialsByPid[seat.playerId] ?? '';
              const takeoverUrl = cred
                ? buildTakeoverJoinUrl(multiplayer.serverUrl, multiplayer.matchID, seat.playerId, cred)
                : '';
              return (
                <div key={seat.playerId} style={{ maxWidth: 820, margin: '0 auto 8px', textAlign: 'left' }}>
                  <div style={{ color: '#a78bfa', fontSize: 12, marginBottom: 4 }}>
                    {seat.displayName}（离线）
                  </div>
                  {takeoverUrl ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        readOnly
                        value={takeoverUrl}
                        style={styles.inviteUrlInput}
                        onFocus={(e) => e.currentTarget.select()}
                        aria-label={`${seat.displayName}接管邀请链接`}
                      />
                      <button
                        type="button"
                        style={{ ...styles.actionButton, ...styles.smallAction, padding: '8px 12px', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          void navigator.clipboard.writeText(takeoverUrl)
                            .then(() => setReinviteCopyMessage(`${seat.displayName} 接管链接已复制`))
                            .catch(() => setReinviteCopyMessage('复制失败，请手动复制链接'));
                        }}
                      >
                        复制接管链接
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>
                      该座位尚未上报重连凭据（需该玩家至少成功进入过一次对局）
                    </div>
                  )}
                </div>
              );
            })
          )}
          {reinviteCopyMessage ? (
            <div style={{ color: '#86efac', fontSize: 12, marginTop: 4 }}>{reinviteCopyMessage}</div>
          ) : null}
        </div>
      ) : null}
      {!isMastermindView && isMultiplayer ? (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ color: '#c4b5fd', fontSize: 13, marginBottom: 6 }}>剧作家离线接管入口</div>
          {!mastermindOffline ? (
            <div style={{ color: '#94a3b8', fontSize: 12 }}>当前剧作家在线</div>
          ) : mastermindTakeoverUrl ? (
            <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
              <div style={{ color: '#a78bfa', fontSize: 12, marginBottom: 4 }}>剧作家（离线）</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  readOnly
                  value={mastermindTakeoverUrl}
                  style={styles.inviteUrlInput}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label="剧作家接管邀请链接"
                />
                <button
                  type="button"
                  style={{ ...styles.actionButton, ...styles.smallAction, padding: '8px 12px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    void navigator.clipboard.writeText(mastermindTakeoverUrl)
                      .then(() => setReinviteCopyMessage('剧作家接管链接已复制'))
                      .catch(() => setReinviteCopyMessage('复制失败，请手动复制链接'));
                  }}
                >
                  复制接管链接
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', fontSize: 12 }}>
              剧作家尚未上报重连凭据（需剧作家至少成功进入过一次对局）
            </div>
          )}
          {reinviteCopyMessage ? (
            <div style={{ color: '#86efac', fontSize: 12, marginTop: 4 }}>{reinviteCopyMessage}</div>
          ) : null}
        </div>
      ) : null}
      {isProtagonistView && controllableProtagonistSeatIds.length > 1 ? (
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <label style={{ color: '#c4b5fd', fontSize: 13, marginRight: 8 }}>代操作座位：</label>
          <select
            value={currentProtagonistId}
            onChange={(e) => setActingProtagonistId(e.target.value)}
            style={{ ...styles.select, minWidth: 170, fontSize: 13, padding: '6px 10px', borderColor: '#a78bfa' }}
          >
            {controllableProtagonistSeatIds.map((pid) => {
              const seat = getSeatByPlayerId(pid);
              const isSelf = pid === selfProtagonistId;
              return (
                <option key={pid} value={pid}>
                  {seat?.displayName ?? `P${pid}`}{isSelf ? '（你）' : '（代操作）'}
                </option>
              );
            })}
          </select>
          <span style={{ marginLeft: 10, color: '#94a3b8', fontSize: 12 }}>
            当前在线主人公 {connectedProtagonistSeatIds.length}/3，未登录座位可由你代操作
          </span>
        </div>
      ) : null}

      <div style={styles.actionsOuter}>
      <div style={styles.actions}>
        <div style={styles.actionsToolbarRow}>
        <label style={styles.boardCardOutlineToggleLabel}>
          <span>卡牌描边</span>
          <button
            type="button"
            role="switch"
            aria-checked={boardPlayedCardOutline}
            aria-label="版图上已打出行动牌的金色描边与高亮"
            onClick={(e) => {
              e.preventDefault();
              toggleBoardPlayedCardOutline();
            }}
            style={{
              ...styles.boardCardOutlineSwitch,
              backgroundColor: boardPlayedCardOutline
                ? 'rgba(34, 197, 94, 0.5)'
                : 'rgba(51, 65, 85, 0.95)',
            }}
          >
            <span
              style={{
                ...styles.boardCardOutlineSwitchKnob,
                left: boardPlayedCardOutline ? '22px' : '2px',
              }}
            />
          </button>
        </label>
        <label style={styles.boardCardOutlineToggleLabel}>
          <span>额外卡牌</span>
          <button
            type="button"
            role="switch"
            aria-checked={extraHandCardsUiEnabled}
            aria-label="显示额外可选手牌区域并可加入手牌"
            onClick={(e) => {
              e.preventDefault();
              toggleExtraHandCardsUi();
            }}
            style={{
              ...styles.boardCardOutlineSwitch,
              backgroundColor: extraHandCardsUiEnabled
                ? 'rgba(34, 197, 94, 0.5)'
                : 'rgba(51, 65, 85, 0.95)',
            }}
          >
            <span
              style={{
                ...styles.boardCardOutlineSwitchKnob,
                left: extraHandCardsUiEnabled ? '22px' : '2px',
              }}
            />
          </button>
        </label>
        <label style={styles.boardCardOutlineToggleLabel}>
          <span>额外 token（主人公）</span>
          <button
            type="button"
            role="switch"
            aria-checked={protagonistExtraTokensUiEnabled}
            aria-label="显示主人公额外标记：已沟通、已沟通（无视友好）、已死亡"
            onClick={(e) => {
              e.preventDefault();
              toggleProtagonistExtraTokensUi();
            }}
            style={{
              ...styles.boardCardOutlineSwitch,
              backgroundColor: protagonistExtraTokensUiEnabled
                ? 'rgba(167, 139, 250, 0.45)'
                : 'rgba(51, 65, 85, 0.95)',
            }}
          >
            <span
              style={{
                ...styles.boardCardOutlineSwitchKnob,
                left: protagonistExtraTokensUiEnabled ? '22px' : '2px',
              }}
            />
          </button>
        </label>
        {isMastermindView ? (
        <label style={styles.boardCardOutlineToggleLabel}>
          <span>EX 扩充手牌（剧作家）</span>
          <button
            type="button"
            role="switch"
            aria-checked={exCardsUiEnabled}
            aria-label="显示与普通手牌独立的 EX 扩充手牌面板（仅剧作家）"
            onClick={(e) => {
              e.preventDefault();
              toggleExCardsUi();
            }}
            style={{
              ...styles.boardCardOutlineSwitch,
              backgroundColor: exCardsUiEnabled
                ? 'rgba(56, 189, 248, 0.45)'
                : 'rgba(51, 65, 85, 0.95)',
            }}
          >
            <span
              style={{
                ...styles.boardCardOutlineSwitchKnob,
                left: exCardsUiEnabled ? '22px' : '2px',
              }}
            />
          </button>
        </label>
        ) : null}
        {selectedModuleData?.id === 'Another_Horizon_Revised' ? (
          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...styles.actionsToolbarCompactAction,
              alignSelf: 'center',
              whiteSpace: 'nowrap',
              ...(!isMastermindView ? styles.actionButtonDisabled : {}),
            }}
            disabled={!isMastermindView}
            onClick={() => {
              if (!isMastermindView) return;
              moves.toggleUiAhrWorldLine?.();
            }}
            title={
              isMastermindView
                ? '切换表世界 / 里世界示意（全员同步可见，未接入 Ex 奇偶判定）'
                : '仅剧作家可切换表世界 / 里世界示意'
            }
          >
            {uiAhrWorldLine === 'surface' ? '表世界（示意）' : '里世界（示意）'}
          </button>
        ) : null}
        <div style={styles.actionsToolbarTrailingButtons}>
          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...styles.actionsToolbarCompactAction,
              ...(!selectedModuleData ? styles.actionButtonDisabled : {}),
            }}
            onClick={() => setShowModuleInfo(true)}
            disabled={!selectedModuleData}
          >
            显示模组信息
          </button>
          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...styles.actionsToolbarCompactAction,
              ...(!selectedScenarioData || playerID == null ? styles.actionButtonDisabled : {}),
            }}
            onClick={() => selectedScenarioData != null && playerID != null && setShowScenarioInfo(true)}
            disabled={!selectedScenarioData || playerID == null}
            title={
              isMastermindView
                ? '剧作家：完整非公开信息表'
                : isProtagonistView
                  ? '主人公：与闭本同版式，规则/身份/当事人请从模组候选项中选择后查看'
                  : undefined
            }
          >
            {isMastermindView ? '非公开信息表' : '公开信息表'}
          </button>
        </div>
        </div>
      </div>
      {exCardsUiEnabled && isMastermindView ? (
        <div style={styles.exCardsToolbar} aria-label="剧作家扩展 EX：独立手牌与按目标版图展示">
          <div style={styles.exCardsToolbarTitle}>
            EX 与普通手牌（下方列表）分开管理。可多行同时为不同版图区域或 NPC 各挂一张 EX（点「增加一行」）；每张 EX id 全图仅一处，选到新位置时自动从旧处移除（不按日清空，新轮回重置）。
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '10px',
              width: '100%',
            }}
          >
            {exToolbarRows.map((row, rowIndex) => {
              const cardOnRow =
                row.targetKind === 'area'
                  ? (uiMastermindExCardByArea[row.area] ?? '').trim()
                  : row.npcId
                    ? (uiMastermindExCardByNpcId[row.npcId] ?? '').trim()
                    : '';
              const npcDisabled = row.targetKind === 'npc' && boardOnScreenNpcPlacements.length === 0;
              return (
                <div
                  key={row.key}
                  style={{
                    ...styles.exCardsToolbarRow,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                  aria-label={`EX 指派第 ${rowIndex + 1} 行`}
                >
                  <span style={styles.exCardsToolbarSeatLabel}>{`第 ${rowIndex + 1} 行`}</span>
                  <span style={styles.exCardsToolbarSeatLabel}>展示对象</span>
                  <select
                    value={row.targetKind}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v !== 'area' && v !== 'npc') return;
                      const ids = boardOnScreenNpcPlacements.map((p) => p.npcId);
                      setExToolbarRows((rows) =>
                        rows.map((rr) =>
                          rr.key !== row.key
                            ? rr
                            : {
                                ...rr,
                                targetKind: v,
                                ...(v === 'npc' ? { npcId: rr.npcId && ids.includes(rr.npcId) ? rr.npcId : (ids[0] ?? '') } : {}),
                              },
                        ),
                      );
                    }}
                    style={{ ...styles.exCardsToolbarSelect, flex: '0 1 160px' }}
                    aria-label={`第 ${rowIndex + 1} 行 EX 展示对象类型`}
                  >
                    <option value="area">版图区域</option>
                    <option value="npc">版图中的 NPC</option>
                  </select>
                  {row.targetKind === 'area' ? (
                    <select
                      value={row.area}
                      onChange={(e) =>
                        setExToolbarRows((rows) =>
                          rows.map((rr) =>
                            rr.key !== row.key ? rr : { ...rr, area: e.target.value as Area },
                          ),
                        )
                      }
                      style={{ ...styles.exCardsToolbarSelect, flex: '1 1 140px', maxWidth: '200px' }}
                      aria-label={`第 ${rowIndex + 1} 行 EX 版图区域`}
                    >
                      {AreaOptions.map((a) => (
                        <option key={a} value={a}>
                          {AREA_DISPLAY_NAME[a] ?? a}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={row.npcId}
                      onChange={(e) =>
                        setExToolbarRows((rows) =>
                          rows.map((rr) =>
                            rr.key !== row.key ? rr : { ...rr, npcId: e.target.value },
                          ),
                        )
                      }
                      style={{ ...styles.exCardsToolbarSelect, flex: '1 1 200px', maxWidth: '320px' }}
                      aria-label={`第 ${rowIndex + 1} 行 EX 挂载 NPC`}
                      disabled={boardOnScreenNpcPlacements.length === 0}
                    >
                      {boardOnScreenNpcPlacements.length === 0 ? (
                        <option value="">（暂无版图 NPC）</option>
                      ) : (
                        boardOnScreenNpcPlacements
                          .slice()
                          .sort((a, b) => {
                            const ac = AREA_DISPLAY_NAME[a.area] ?? String(a.area);
                            const bc = AREA_DISPLAY_NAME[b.area] ?? String(b.area);
                            const c = ac.localeCompare(bc, 'zh-Hans-CN');
                            if (c !== 0) return c;
                            return a.name.localeCompare(b.name, 'zh-Hans-CN');
                          })
                          .map((p) => (
                            <option key={p.npcId} value={p.npcId}>
                              {`${p.name}（${AREA_DISPLAY_NAME[p.area] ?? p.area}）`}
                            </option>
                          ))
                      )}
                    </select>
                  )}
                  <span style={styles.exCardsToolbarSeatLabel}>EX</span>
                  <select
                    value={cardOnRow}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      if (row.targetKind === 'area') {
                        moves.setUiMastermindExCardByArea?.({ area: row.area, cardId: v || null });
                      } else if (row.npcId) {
                        moves.setUiMastermindExCardByNpcId?.({ npcId: row.npcId, cardId: v || null });
                      }
                    }}
                    style={{ ...styles.exCardsToolbarSelect, flex: '1 1 200px', maxWidth: '300px' }}
                    aria-label={`第 ${rowIndex + 1} 行在此目标上的 EX`}
                    disabled={npcDisabled}
                  >
                    <option value="">（不展示）</option>
                    {mastermindExHandIds.map((id) => {
                      const meta = TRAGEDY_EX_CARD_DEFS.find((d) => d.id === id);
                      let hint = '';
                      const pin = mastermindExCardPinnedLabelById[id];
                      const onCur = cardOnRow === id;
                      if (pin && !onCur) hint = ` （当前：${pin}，改选此处会移至此处）`;
                      return (
                        <option key={id} value={id}>
                          {`${meta?.shortLabel ?? id}${hint}`}
                        </option>
                      );
                    })}
                  </select>
                  {exToolbarRows.length > 1 ? (
                    <button
                      type="button"
                      style={styles.exCardsToolbarInlineButton}
                      onClick={() => setExToolbarRows((rows) => rows.filter((r) => r.key !== row.key))}
                      aria-label={`移除第 ${rowIndex + 1} 行`}
                      title="仅移除此编辑行（不会自动清空盘上该处的 EX）"
                    >
                      移除此行
                    </button>
                  ) : null}
                  {rowIndex === 0 ? (
                    <button
                      type="button"
                      style={styles.exCardsToolbarInlineButton}
                      onClick={() =>
                        setExToolbarRows((rows) => [
                          ...rows,
                          {
                            key: `ex-toolbar-row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                            targetKind: 'area',
                            area: Area.Hospital,
                            npcId: '',
                          },
                        ])
                      }
                      aria-label="增加一行 EX 指派"
                    >
                      增加一行
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      </div>

      <div style={styles.boardRowOuter}>
        <div style={styles.boardRow}>
          {/* 左侧：文字版日程状态区 */}
          <aside style={styles.leftPanel} aria-label="日程与轮回状态">
            <div style={styles.leftTextPanel}>
              <section style={styles.leftSection}>
                <div style={styles.leftSectionTitle}>剧本基础信息</div>
                <div style={styles.leftTextRow}>
                  <span style={styles.leftTextLabel}>
                    {`Days（${Number(G?.day ?? 1)}/${scenarioDayCount}）`}
                  </span>
                  <div style={styles.leftTagList}>
                    {leftTableDayRows.map((day) => {
                      const currentDay = Number(G?.day ?? 1);
                      const stateStyle = day === currentDay
                        ? styles.leftTagBlue
                        : day > currentDay
                          ? styles.leftTagGreen
                          : styles.leftTagGray;
                      return (
                        <span key={`day-tag-${day}`} style={{ ...styles.leftTag, ...stateStyle }}>
                          {`D${day}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={styles.leftTextRow}>
                  <span style={styles.leftTextLabel}>Incident</span>
                  <div style={styles.leftTagList}>
                    {leftTableDayRows.map((day) => {
                      const incidentId = incidentIdByDay[day];
                      return (
                        <button
                          type="button"
                          key={`incident-tag-${day}`}
                          style={{
                            ...styles.leftTagButton,
                            ...styles.leftTag,
                            ...(incidentId ? styles.leftTagRed : styles.leftTagGray),
                            ...(selectedIncidentDay === day ? styles.leftTagSelected : {}),
                          }}
                          title={incidentId ? incidentDisplayName(incidentId) : '无事件'}
                          onClick={() => setSelectedIncidentDay(day)}
                        >
                          {`D${day}`}
                        </button>
                      );
                    })}
                  </div>
                  {selectedIncidentDay != null ? (
                    <div style={styles.leftIncidentDetail}>
                      {`D${selectedIncidentDay}：${
                        incidentIdByDay[selectedIncidentDay]
                          ? incidentDisplayName(incidentIdByDay[selectedIncidentDay])
                          : '无事件'
                      }`}
                    </div>
                  ) : null}
                </div>
                <div style={styles.leftTextRow}>
                  <span style={styles.leftTextLabel}>
                    {`Loop（${Number(G?.loop ?? 1)}/${maxLoops}）`}
                  </span>
                  <div style={styles.leftTagList}>
                    {leftTableLoopRows.map((loopN) => {
                      const currentLoop = Number(G?.loop ?? 1);
                      const stateStyle = loopN === currentLoop
                        ? styles.leftTagBlue
                        : loopN > currentLoop
                          ? styles.leftTagGreen
                          : styles.leftTagGray;
                      return (
                        <span
                          key={`loop-tag-${loopN}`}
                          style={{
                            ...styles.leftTag,
                            ...stateStyle,
                            ...(loopN < currentLoop ? styles.leftTagStrikethrough : {}),
                          }}
                        >
                          {`L${loopN}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={styles.leftTextRow}>
                  <div style={styles.leftExTitleRow}>
                    <span style={styles.leftTextLabel}>
                      {selectedModuleData?.exSlot
                        ? `Ex：【${(selectedModuleData.exSlot.name || '').trim() || 'Ex'}】`
                        : 'Ex'}
                    </span>
                    {selectedModuleData?.exSlot ? (
                      <button
                        type="button"
                        style={styles.leftExSlotHelpBtn}
                        onClick={() => setExSlotDescPanelOpen((open) => !open)}
                        aria-label="查看 Ex 槽说明"
                        title="查看 Ex 槽说明"
                      >
                        ?
                      </button>
                    ) : null}
                  </div>
                  {exSlotDescPanelOpen && selectedModuleData?.exSlot ? (
                    <div style={styles.leftExSlotDescBox}>
                      {(selectedModuleData.exSlot.description || '').trim() || '（未填写槽位描述）'}
                    </div>
                  ) : null}
                  <div style={styles.leftExControlRow}>
                    <button
                      type="button"
                      style={styles.leftExButton}
                      onClick={() => setLeftExValue((prev) => Math.max(0, prev - 1))}
                      aria-label="降低 Ex"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={leftExValue}
                      min={0}
                      step={1}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setLeftExValue(Number.isFinite(next) ? Math.max(0, Math.floor(next)) : 0);
                      }}
                      style={styles.leftExInput}
                      aria-label="Ex 数值"
                    />
                    <button
                      type="button"
                      style={styles.leftExButton}
                      onClick={() => setLeftExValue((prev) => prev + 1)}
                      aria-label="提升 Ex"
                    >
                      +
                    </button>
                  </div>
                </div>
              </section>
              <section style={styles.leftSection}>
                <div style={{ ...styles.leftSectionTitle, ...styles.leftSectionTitleWithInlineControl }}>
                  <span>远方</span>
                  <div style={styles.leftFarawayConspiracyRow}>
                    <span style={styles.leftFarawayConspiracyLabel}>密谋</span>
                    <button
                      type="button"
                      style={styles.leftExButton}
                      onClick={() => {
                        moves.adjustAreaConspiracy?.({ area: Area.Faraway, delta: -1 });
                      }}
                      aria-label="远方密谋减一"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={String(getAreaConspiracy(Area.Faraway))}
                      style={styles.leftExInput}
                      aria-label="远方密谋值"
                    />
                    <button
                      type="button"
                      style={styles.leftExButton}
                      onClick={() => {
                        moves.adjustAreaConspiracy?.({ area: Area.Faraway, delta: 1 });
                      }}
                      aria-label="远方密谋加一"
                    >
                      +
                    </button>
                  </div>
                </div>
                {(() => {
                  const farawayMastermindCardId = selectedMastermindCardByArea[Area.Faraway] ?? '';
                  const visibleProtagonistSelector = getVisibleProtagonistSelectorForArea(Area.Faraway);
                  const farawayProtagonistCardId = visibleProtagonistSelector
                    ? (selectedProtagonistCardByAreaByPid[visibleProtagonistSelector]?.[Area.Faraway] ?? '')
                    : '';
                  const visibleProtagonistDisplayName = visibleProtagonistSelector
                    ? (getSeatByPlayerId(visibleProtagonistSelector)?.displayName ?? `主人公${visibleProtagonistSelector}`)
                    : '主人公';
                  const showMastermindReadonlyForProtagonist = isProtagonistView && Boolean(farawayMastermindCardId);
                  const showProtagonistReadonlyForMastermind = isMastermindView && Boolean(farawayProtagonistCardId);
                  const showProtagonistEditable = isProtagonistView && Boolean(currentProtagonistId);
                  const showMastermindEditable = isMastermindView;
                  if (
                    !showMastermindEditable
                    && !showMastermindReadonlyForProtagonist
                    && !showProtagonistEditable
                    && !showProtagonistReadonlyForMastermind
                  ) {
                    return null;
                  }
                  return (
                    <div style={styles.leftFarawayCardRow}>
                      {showMastermindEditable ? (() => {
                        const currentCardId = farawayMastermindCardId;
                        const selectDisabledByDailyLimit = mastermindReachedDailyLimit && !currentCardId;
                        return (
                          <select
                            value={currentCardId}
                            onChange={(e) => {
                              const nextCardId = e.target.value;
                              applyMastermindCardSelection(nextCardId, currentCardId, (cardId) => {
                                moves.setUiMastermindCardByArea?.({ area: Area.Faraway, cardId: cardId || null });
                              });
                            }}
                            style={{ ...styles.leftFarawayCardSelect, ...(selectDisabledByDailyLimit ? styles.controlDisabled : {}) }}
                            aria-label="远方剧作家卡牌"
                            disabled={!isActionCardPhaseActive || selectDisabledByDailyLimit}
                          >
                            <option value="">剧作家卡牌</option>
                            {mastermindSelectableHandDefs.map((card) => {
                              const used = isMastermindCardUsed(card.id, card.oncePerLoop);
                              const disabled = (used && currentCardId !== card.id)
                                || (mastermindReachedDailyLimit && currentCardId !== card.id);
                              return (
                                <option key={card.id} value={card.id} disabled={disabled}>
                                  {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                </option>
                              );
                            })}
                          </select>
                        );
                      })() : null}
                      {showMastermindReadonlyForProtagonist ? (
                        <select
                          value={farawayMastermindCardId}
                          style={{ ...styles.leftFarawayCardSelect, ...styles.controlDisabled }}
                          aria-label="远方剧作家已出牌"
                          disabled
                        >
                          <option value={farawayMastermindCardId}>
                            {shouldRevealMastermindCardFace
                              ? (mastermindCardNameById[farawayMastermindCardId] ?? '未知卡牌')
                              : '剧作家已出牌'}
                          </option>
                        </select>
                      ) : null}
                      {showProtagonistEditable ? (() => {
                        const pid = currentProtagonistId as string;
                        const currentCardId = selectedProtagonistCardByAreaByPid[pid]?.[Area.Faraway] ?? '';
                        const selectDisabledBySinglePlayLimit = protagonistSelectedCardCountForPid(pid) >= 1 && !currentCardId;
                        const targetLockedByOther = isAreaSelectedByOtherProtagonist(pid, Area.Faraway);
                        return (
                          <select
                            value={currentCardId}
                            onChange={(e) => {
                              const nextCardId = e.target.value;
                              applyProtagonistCardSelection(
                                pid,
                                nextCardId,
                                currentCardId,
                                (cardId) => {
                                  moves.setUiProtagonistCardByArea?.({
                                    pid,
                                    area: Area.Faraway,
                                    cardId: cardId || null,
                                  });
                                },
                                targetLockedByOther,
                              );
                            }}
                            style={{
                              ...styles.leftFarawayCardSelect,
                              ...((!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther)
                                ? styles.controlDisabled
                                : {}),
                            }}
                            aria-label="远方主人公卡牌"
                            disabled={!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther}
                          >
                            <option value="">主人公卡牌</option>
                            {protagonistSelectableHandDefs.map((card) => {
                              const used = isProtagonistCardUsedByPid(pid, card.id, card.oncePerLoop);
                              const disabled = (used && currentCardId !== card.id)
                                || ((protagonistSelectedCardCountForPid(pid) >= 1) && currentCardId !== card.id)
                                || (targetLockedByOther && currentCardId !== card.id);
                              return (
                                <option key={card.id} value={card.id} disabled={disabled}>
                                  {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                </option>
                              );
                            })}
                          </select>
                        );
                      })() : null}
                      {showProtagonistReadonlyForMastermind ? (
                        <select
                          value={farawayProtagonistCardId}
                          style={{ ...styles.leftFarawayCardSelect, ...styles.controlDisabled }}
                          aria-label={`远方${visibleProtagonistDisplayName}已出牌`}
                          disabled
                        >
                          <option value={farawayProtagonistCardId}>
                            {shouldRevealMastermindCardFace
                              ? (protagonistCardNameById[farawayProtagonistCardId] ?? '未知卡牌')
                              : `${visibleProtagonistDisplayName}已出牌`}
                          </option>
                        </select>
                      ) : null}
                    </div>
                  );
                })()}
                {(() => {
                  const exFa =
                    showMastermindExCardFacesOnBoard ? (uiMastermindExCardByArea[Area.Faraway] ?? '').trim() : '';
                  const exShortLabel =
                    exFa ? (TRAGEDY_EX_CARD_DEFS.find((d) => d.id === exFa)?.shortLabel ?? exFa) : '';
                  const pathsFarTok = uiAreaDisplayedSpecialTokenPathsByArea[Area.Faraway] ?? [];
                  if (!exShortLabel && pathsFarTok.length === 0) return null;
                  const a11yParts: string[] = [];
                  if (exShortLabel) a11yParts.push(`远方 EX：${exShortLabel}`);
                  if (pathsFarTok.length > 0) a11yParts.push('远方特殊 token');
                  return (
                    <div
                      style={styles.leftFarawayExAndTokensRow}
                      aria-label={a11yParts.join(' · ')}
                    >
                      {exShortLabel ? (
                        <span style={styles.leftFarawayExName}>EX：{exShortLabel}</span>
                      ) : null}
                      {pathsFarTok.map((path, idx) => (
                        <span
                          key={`far-${path}-${idx}`}
                          style={styles.leftFarawaySpecialTokenNameChip}
                        >
                          {farawaySpecialTokenBracketText(
                            path,
                            specialTokenFarawayBracketLabelByPath,
                            specialTokenPathToLabel,
                          )}
                        </span>
                      ))}
                    </div>
                  );
                })()}
                {farawayNpcPlacements.length > 0 ? (
                  <div style={styles.leftDiscardList}>
                    {farawayNpcPlacements.map((npc) => {
                      const tok = getNpcTokenCounts(npc.npcId);
                      const mastermindCardId = selectedMastermindCardByNpcId[npc.npcId] ?? '';
                      const hasMastermindCard = Boolean(mastermindCardId);
                      const visibleProtagonistSelector = getVisibleProtagonistSelectorForNpc(npc.npcId);
                      const protagonistCardId = visibleProtagonistSelector
                        ? (selectedProtagonistCardByNpcByPid[visibleProtagonistSelector]?.[npc.npcId] ?? '')
                        : '';
                      const hasProtagonistCard = Boolean(visibleProtagonistSelector && protagonistCardId);
                      const visibleProtagonistDisplayName = visibleProtagonistSelector
                        ? (getSeatByPlayerId(visibleProtagonistSelector)?.displayName ?? `主人公${visibleProtagonistSelector}`)
                        : '主人公';
                      const showMastermindInfoForProtagonist = isProtagonistView && hasMastermindCard;
                      const showProtagonistInfoForOthers = hasProtagonistCard && (
                        isMastermindView
                        || (isProtagonistView && visibleProtagonistSelector !== currentProtagonistId)
                      );
                      return (
                        <article key={`faraway-npc-${npc.npcId}`} style={{ ...styles.leftHandDiscardItem, ...styles.leftFarawayItem }}>
                          <div style={styles.leftFarawayMainRow}>
                            <button
                              type="button"
                              style={{ ...styles.leftDiscardItem, ...styles.leftFarawayNpcButton }}
                              onClick={() => setNpcZoomPlacement(npc)}
                              title={`点击查看 ${npc.name}`}
                            >
                              <span>{npc.name}</span>
                              <span style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'stretch', gap: 3 }}>
                                <span style={styles.leftFarawayTokenRow}>
                                  <span style={{ ...styles.boardNpcChipTokenCell, ...styles.boardNpcChipTokenFriendly, ...styles.leftFarawayTokenCellLeftAlign }}>
                                    {tok.friendly}
                                  </span>
                                  <span
                                    style={{
                                      ...styles.boardNpcChipTokenCell,
                                      ...styles.boardNpcChipTokenUnrest,
                                      ...styles.leftFarawayTokenCellLeftAlign,
                                      ...styles.leftFarawayUnrestCell,
                                      ...(tok.unrestMax > 0 && tok.unrest >= tok.unrestMax
                                        ? styles.boardNpcChipTokenCellUnrestAtMax
                                        : {}),
                                    }}
                                  >
                                    {`${tok.unrest}/${tok.unrestMax}`}
                                  </span>
                                  <span style={{ ...styles.boardNpcChipTokenCell, ...styles.boardNpcChipTokenPlot, ...styles.leftFarawayTokenCellLeftAlign }}>
                                    {tok.plot}
                                  </span>
                                </span>
                                {extraHandCardsUiEnabled ? (
                                  <div
                                    style={{ ...styles.boardNpcChipTokenRowExtra, alignSelf: 'stretch', width: '100%' }}
                                    aria-label={`希望：${tok.hope}，绝望：${tok.despair}`}
                                  >
                                    <span style={styles.boardNpcChipTokenCell}>{`希望：${tok.hope}`}</span>
                                    <span style={styles.boardNpcChipTokenCell}>{`绝望：${tok.despair}`}</span>
                                  </div>
                                ) : null}
                                {protagonistExtraTokensUiEnabled ? (() => {
                                  const fl = protagonistExtraTokensLegendForNpc(
                                    uiNpcProtagonistExtraTokenIdsByNpcId[npc.npcId],
                                  );
                                  return fl ? (
                                    <div style={styles.boardNpcChipExtraLegendRow}>{fl}</div>
                                  ) : null;
                                })() : null}
                              </span>
                            </button>
                          </div>
                          {(isMastermindView || (isProtagonistView && currentProtagonistId) || showMastermindInfoForProtagonist || showProtagonistInfoForOthers) ? (
                            <div style={styles.leftFarawayCardRow}>
                              {isMastermindView ? (
                                <select
                                  value={mastermindCardId}
                                  onChange={(e) => {
                                    const nextCardId = e.target.value;
                                    applyMastermindCardSelection(nextCardId, mastermindCardId, (cardId) => {
                                      moves.setUiMastermindCardByNpcId?.({ npcId: npc.npcId, cardId: cardId || null });
                                    });
                                  }}
                                  style={{
                                    ...styles.leftFarawayCardSelect,
                                    ...((!isActionCardPhaseActive || (mastermindReachedDailyLimit && !mastermindCardId))
                                      ? styles.controlDisabled
                                      : {}),
                                  }}
                                  aria-label={`${npc.name}剧作家卡牌`}
                                  disabled={!isActionCardPhaseActive || (mastermindReachedDailyLimit && !mastermindCardId)}
                                >
                                  <option value="">剧作家卡牌</option>
                                  {mastermindSelectableHandDefs.map((card) => {
                                    const used = isMastermindCardUsed(card.id, card.oncePerLoop);
                                    const disabled = (used && mastermindCardId !== card.id)
                                      || (mastermindReachedDailyLimit && mastermindCardId !== card.id);
                                    return (
                                      <option key={card.id} value={card.id} disabled={disabled}>
                                        {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : null}
                              {showMastermindInfoForProtagonist ? (
                                <select
                                  value={mastermindCardId}
                                  style={{ ...styles.leftFarawayCardSelect, ...styles.controlDisabled }}
                                  aria-label={`${npc.name}剧作家已出牌`}
                                  disabled
                                >
                                  <option value={mastermindCardId}>
                                    {shouldRevealMastermindCardFace
                                      ? (mastermindCardNameById[mastermindCardId] ?? '未知卡牌')
                                      : '剧作家已出牌'}
                                  </option>
                                </select>
                              ) : null}
                              {isProtagonistView && currentProtagonistId ? (() => {
                                const pidLeft = currentProtagonistId as string;
                                const currentCardId = selectedProtagonistCardByNpcByPid[pidLeft]?.[npc.npcId] ?? '';
                                const selectDisabledBySinglePlayLimit = protagonistSelectedCardCountForPid(pidLeft) >= 1 && !currentCardId;
                                const targetLockedByOther = isNpcSelectedByOtherProtagonist(pidLeft, npc.npcId);
                                return (
                                    <select
                                      value={currentCardId}
                                      onChange={(e) => {
                                        const nextCardId = e.target.value;
                                        applyProtagonistCardSelection(
                                          pidLeft,
                                          nextCardId,
                                          currentCardId,
                                          (cardId) => {
                                            moves.setUiProtagonistCardByNpc?.({
                                              pid: pidLeft,
                                              npcId: npc.npcId,
                                              cardId: cardId || null,
                                            });
                                          },
                                          targetLockedByOther,
                                        );
                                      }}
                                      style={{
                                        ...styles.leftFarawayCardSelect,
                                        ...((!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther)
                                          ? styles.controlDisabled
                                          : {}),
                                      }}
                                      aria-label={`${npc.name}主人公卡牌`}
                                      disabled={!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther}
                                    >
                                      <option value="">主人公卡牌</option>
                                      {protagonistSelectableHandDefs.map((card) => {
                                        const used = isProtagonistCardUsedByPid(pidLeft, card.id, card.oncePerLoop);
                                        const disabled = (used && currentCardId !== card.id)
                                          || ((protagonistSelectedCardCountForPid(pidLeft) >= 1) && currentCardId !== card.id)
                                          || (targetLockedByOther && currentCardId !== card.id);
                                        return (
                                          <option key={card.id} value={card.id} disabled={disabled}>
                                            {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                          </option>
                                        );
                                      })}
                                    </select>
                                );
                              })() : null}
                              {showProtagonistInfoForOthers ? (
                                <select
                                  value={protagonistCardId}
                                  style={{ ...styles.leftFarawayCardSelect, ...styles.controlDisabled }}
                                  aria-label={`${npc.name}${visibleProtagonistDisplayName}已出牌`}
                                  disabled
                                >
                                  <option value={protagonistCardId}>
                                    {shouldRevealMastermindCardFace
                                      ? (protagonistCardNameById[protagonistCardId] ?? '未知卡牌')
                                      : `${visibleProtagonistDisplayName}已出牌`}
                                  </option>
                                </select>
                              ) : null}
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div style={styles.leftPlaceholder}>暂无远方 NPC</div>
                )}
              </section>
              <section style={styles.leftSection}>
                <div style={styles.leftSectionTitle}>弃置区</div>
                <div style={styles.leftDiscardSubTitle}>NPC</div>
                {discardedNpcPlacements.length > 0 ? (
                  <div style={styles.leftDiscardList}>
                    {discardedNpcPlacements.map((npc) => (
                      <article key={`discarded-npc-${npc.npcId}`} style={styles.leftHandDiscardItem}>
                        <button
                          type="button"
                          style={styles.leftDiscardItem}
                          onClick={() => setNpcZoomPlacement(npc)}
                          title={`点击查看 ${npc.name}`}
                        >
                          {npc.name}
                        </button>
                        <button
                          type="button"
                          style={styles.leftHandDiscardRestoreBtn}
                          onClick={() => moves.setUiNpcDiscarded?.({ npcId: npc.npcId, discarded: false })}
                          title={`还原 ${npc.name}`}
                        >
                          还原
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div style={styles.leftPlaceholder}>暂无弃置 NPC</div>
                )}
                <div style={styles.leftDiscardSubTitle}>手牌（所有玩家）</div>
                {discardedHandCardsForAllPlayers.length > 0 ? (
                  <div style={styles.leftDiscardList}>
                    {discardedHandCardsForAllPlayers.map((card) => (
                      <article key={`left-discard-hand-${card.pid}-${card.cardId}`} style={styles.leftHandDiscardItem}>
                        <span style={styles.leftHandDiscardName}>{`${card.playerName}：${card.cardName}`}</span>
                        <button
                          type="button"
                          style={{ ...styles.leftHandDiscardRestoreBtn, ...(card.autoDiscarded ? styles.controlDisabled : {}) }}
                          disabled={card.autoDiscarded}
                          title={card.autoDiscarded ? '轮限已使用：下轮回自动收回' : '还原到手牌'}
                          onClick={() => {
                            if (card.autoDiscarded) return;
                            moves.setUiHandDiscardedCard?.({ pid: card.pid, cardId: card.cardId, discarded: false });
                          }}
                        >
                          还原
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div style={styles.leftPlaceholder}>暂无弃置手牌</div>
                )}
              </section>
              {!isProtagonistView ? (
                <section style={styles.leftSection}>
                  <div style={styles.leftSectionTitle}>未登场 NPC</div>
                  {unappearedNpcPlacements.length > 0 ? (
                    <div style={styles.leftDiscardList}>
                      {unappearedNpcPlacements.map((npc) => (
                        <article key={`unappeared-npc-${npc.npcId}`} style={{ ...styles.leftHandDiscardItem, ...styles.leftUnappearedItem }}>
                          <button
                            type="button"
                            style={styles.leftDiscardItem}
                            onClick={() => setNpcZoomPlacement(npc)}
                            title={`点击查看 ${npc.name}`}
                          >
                            {npc.name}
                          </button>
                          {npc.appearanceTimingDescription?.trim() ? (
                            <div style={styles.leftUnappearedHint}>
                              登场时机：{npc.appearanceTimingDescription.trim()}
                            </div>
                          ) : (
                            <div style={styles.leftUnappearedHint}>登场时机：待触发</div>
                          )}
                          {isMastermindView ? (
                            <div style={styles.leftUnappearedSpawnRow}>
                              <select
                                value={selectedUnappearedSpawnAreaByNpcId[npc.npcId] ?? npc.area}
                                onChange={(e) => {
                                  const nextArea = e.target.value as Area;
                                  if (!Object.values(Area).includes(nextArea)) return;
                                  setSelectedUnappearedSpawnAreaByNpcId((prev) => ({
                                    ...prev,
                                    [npc.npcId]: nextArea,
                                  }));
                                }}
                                style={styles.leftUnappearedSpawnSelect}
                                aria-label={`${npc.name}登场区域`}
                              >
                                {Object.values(Area).map((area) => (
                                  <option key={`spawn-${npc.npcId}-${area}`} value={area}>
                                    {AREA_DISPLAY_NAME[area]}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                style={styles.leftUnappearedSpawnBtn}
                                onClick={() => {
                                  const targetArea = selectedUnappearedSpawnAreaByNpcId[npc.npcId] ?? npc.area;
                                  moves.setUiNpcAppeared?.({
                                    npcId: npc.npcId,
                                    appeared: true,
                                    area: targetArea,
                                    originArea: npc.area,
                                  });
                                }}
                                title={`让 ${npc.name} 登场到所选区域`}
                              >
                                登场
                              </button>
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.leftPlaceholder}>暂无未登场 NPC</div>
                  )}
                </section>
              ) : null}
            </div>
          </aside>

          {/* 中间主体：2x2 四象限（医院/神社/都市/学校），剧本角色按初始区域显示 */}
          <div style={styles.middlePanel}>
            {BOARD_QUADRANT_AREAS.map((area) => {
              const areaPlacements = placementsByArea[area] ?? [];
              const areaNpcCardSize = npcCardSizeByAreaCount(areaPlacements.length);
              const areaConspiracy = getAreaConspiracy(area);
              return (
                <div
                  key={area}
                  style={{
                    ...styles.quadrant,
                    ...quadrantImageStyle(AREA_IMAGES[area]),
                  }}
                >
                  {(() => {
                    const pathsTokArea = uiAreaDisplayedSpecialTokenPathsByArea[area] ?? [];
                    if (pathsTokArea.length === 0) return null;
                    return (
                      <div style={styles.quadrantAreaSpecialTokens} aria-label={`${area}特殊 token`}>
                        {pathsTokArea.map((path, idx) => {
                          const u = resolveTokenImageUrl(path);
                          if (!u) return null;
                          return (
                            <img
                              key={`${area}-st-${path}-${idx}`}
                              src={u}
                              alt=""
                              style={styles.quadrantAreaSpecialTokenImg}
                              draggable={false}
                            />
                          );
                        })}
                      </div>
                    );
                  })()}
                  <div style={styles.quadrantStack}>
                    <div style={styles.quadrantAreaHeader}>
                      <div style={styles.quadrantBoardConspiracy} aria-label={`${area}版图密谋`}>
                        <span>密谋</span>
                        <button
                          type="button"
                          style={styles.quadrantConspiracyButton}
                          onClick={() => {
                            moves.adjustAreaConspiracy?.({ area, delta: -1 });
                          }}
                          aria-label={`${area}密谋减一`}
                        >
                          -
                        </button>
                        <span style={styles.quadrantConspiracyValue}>{areaConspiracy}</span>
                        <button
                          type="button"
                          style={styles.quadrantConspiracyButton}
                          onClick={() => {
                            moves.adjustAreaConspiracy?.({ area, delta: 1 });
                          }}
                          aria-label={`${area}密谋加一`}
                        >
                          +
                        </button>
                      </div>
                      {isMastermindView ? (
                        <div style={styles.quadrantAreaControlRow}>
                          {(() => {
                            const currentCardId = selectedMastermindCardByArea[area] ?? '';
                            const selectDisabledByDailyLimit = mastermindReachedDailyLimit && !currentCardId;
                            return (
                          <select
                            value={currentCardId}
                            onChange={(e) => {
                              const nextCardId = e.target.value;
                              applyMastermindCardSelection(nextCardId, currentCardId, (cardId) => {
                                moves.setUiMastermindCardByArea?.({ area, cardId: cardId || null });
                              });
                            }}
                            style={{ ...styles.quadrantAreaCardSelect, ...(selectDisabledByDailyLimit ? styles.controlDisabled : {}) }}
                            aria-label={`${area}剧作家卡牌`}
                            disabled={!isActionCardPhaseActive || selectDisabledByDailyLimit}
                          >
                            <option value="">剧作家卡牌</option>
                            {mastermindSelectableHandDefs.map((card) => {
                              const used = isMastermindCardUsed(card.id, card.oncePerLoop);
                              const disabled = (used && currentCardId !== card.id)
                                || (mastermindReachedDailyLimit && currentCardId !== card.id);
                              return (
                                <option key={card.id} value={card.id} disabled={disabled}>
                                  {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                </option>
                              );
                            })}
                          </select>
                            );
                          })()}
                        </div>
                      ) : null}
                      {isProtagonistView && currentProtagonistId ? (
                        <div style={styles.quadrantAreaControlRow}>
                          {(() => {
                            const currentCardId = selectedProtagonistCardByAreaByPid[currentProtagonistId]?.[area] ?? '';
                            const selectDisabledBySinglePlayLimit = protagonistSelectedCardCountForPid(currentProtagonistId) >= 1 && !currentCardId;
                            const targetLockedByOther = isAreaSelectedByOtherProtagonist(currentProtagonistId, area);
                            return (
                              <select
                                value={currentCardId}
                                onChange={(e) => {
                                  const nextCardId = e.target.value;
                                  applyProtagonistCardSelection(
                                    currentProtagonistId,
                                    nextCardId,
                                    currentCardId,
                                    (cardId) => {
                                      moves.setUiProtagonistCardByArea?.({
                                        pid: currentProtagonistId,
                                        area,
                                        cardId: cardId || null,
                                      });
                                    },
                                    targetLockedByOther,
                                  );
                                }}
                                style={{
                                  ...styles.quadrantAreaCardSelect,
                                  ...((!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther)
                                    ? styles.controlDisabled
                                    : {}),
                                }}
                                aria-label={`${area}主人公卡牌`}
                                disabled={!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther}
                              >
                                <option value="">主人公卡牌</option>
                                {protagonistSelectableHandDefs.map((card) => {
                                  const used = isProtagonistCardUsedByPid(currentProtagonistId, card.id, card.oncePerLoop);
                                  const disabled = (used && currentCardId !== card.id)
                                    || ((protagonistSelectedCardCountForPid(currentProtagonistId) >= 1) && currentCardId !== card.id)
                                    || (targetLockedByOther && currentCardId !== card.id);
                                  return (
                                    <option key={card.id} value={card.id} disabled={disabled}>
                                      {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                                    </option>
                                  );
                                })}
                              </select>
                            );
                          })()}
                        </div>
                      ) : null}
                    </div>
                    {selectedMastermindCardByArea[area] ? (
                      <img
                        src={
                          shouldRevealMastermindCardFace
                            ? (MASTERMIND_CARD_IMAGE_BY_ID[selectedMastermindCardByArea[area]] ?? mastermindCardBackImg0b)
                            : mastermindCardBackImg0b
                        }
                        alt={`${area}剧作家卡牌`}
                        style={{
                          ...styles.quadrantMastermindCard,
                          boxShadow: boardPlayedActionCardBoxShadow(
                            boardPlayedCardOutline,
                            BOARD_PLAYED_CARD_SHADOW_QUADRANT,
                          ),
                          width: areaNpcCardSize.boardActionCardImgWidth,
                          maxWidth: 'none',
                        }}
                        draggable={false}
                      />
                    ) : null}
                    {(() => {
                      const exIdArea =
                        showMastermindExCardFacesOnBoard ? (uiMastermindExCardByArea[area] ?? '').trim() : '';
                      const exSrcArea = exIdArea ? MASTERMIND_EX_CARD_FACE_BY_ID[exIdArea] : '';
                      return exSrcArea ? (
                        <img
                          src={exSrcArea}
                          alt=""
                          style={{
                            ...styles.quadrantProtagonistExCard,
                            width: areaNpcCardSize.boardActionCardImgWidth,
                            maxWidth: 'none',
                          }}
                          draggable={false}
                        />
                      ) : null;
                    })()}
                    {(() => {
                      const visibleProtagonistSelector = getVisibleProtagonistSelectorForArea(area);
                      const selectedCardId = visibleProtagonistSelector
                        ? (selectedProtagonistCardByAreaByPid[visibleProtagonistSelector]?.[area] ?? '')
                        : '';
                      const hasProtagonistCard = Boolean(visibleProtagonistSelector && selectedCardId);
                      return hasProtagonistCard ? (
                        <img
                          src={
                            shouldRevealMastermindCardFace
                              ? getProtagonistCardFaceByPidAndCardId(visibleProtagonistSelector, selectedCardId)
                              : getProtagonistCardBackByPid(visibleProtagonistSelector)
                          }
                          alt={`${area}主人公卡牌`}
                          style={{
                            ...styles.quadrantProtagonistCard,
                            boxShadow: boardPlayedActionCardBoxShadow(
                              boardPlayedCardOutline,
                              BOARD_PLAYED_CARD_SHADOW_QUADRANT,
                            ),
                            width: areaNpcCardSize.boardActionCardImgWidth,
                            maxWidth: 'none',
                          }}
                          draggable={false}
                        />
                      ) : null;
                    })()}
                    <div style={{ ...styles.quadrantChips, ...quadrantChipsGapStyle(areaPlacements.length) }}>
                      {areaPlacements.map((p) => {
                      const protagonistCastSummary =
                        isProtagonistView && selectedScenarioData
                          ? protagonistCastRoleSummary(
                              selectedScenarioData,
                              protagonistSheetDraft,
                              p.npcId,
                              roleDisplayName,
                            )
                          : '';
                      return (
                      <div
                        key={p.npcId}
                        style={{
                          ...styles.boardNpcChip,
                          ...(p.imgUrl ? styles.boardNpcChipWithArt : {}),
                          ...(p.imgUrl ? areaNpcCardSize : {}),
                        }}
                        title={
                          (isMastermindView
                            ? `${p.name} · ${mastermindRoleLabels(p, roleDisplayName)}`
                            : protagonistCastSummary
                              ? `${p.name} · ${protagonistCastSummary}`
                              : p.name) + ' · 点击放大'
                        }
                      >
                        {p.imgUrl ? (() => {
                          const tok = getNpcTokenCounts(p.npcId);
                          const playedHandVisibleProtagonist = getVisibleProtagonistSelectorForNpc(p.npcId);
                          const protagonistPlayedCardId = playedHandVisibleProtagonist
                            ? (selectedProtagonistCardByNpcByPid[playedHandVisibleProtagonist]?.[p.npcId] ?? '')
                            : '';
                          const hasProtagonistPlayedOnNpc = Boolean(protagonistPlayedCardId);
                          const highlightNpcPortraitForPlayedHand =
                            Boolean(selectedMastermindCardByNpcId[p.npcId]) || hasProtagonistPlayedOnNpc;
                          return (
                          <div
                            style={styles.boardNpcChipArtPanel}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNpcZoomPlacement(p);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setNpcZoomPlacement(p);
                              }
                            }}
                            aria-label={
                              protagonistCastSummary
                                ? `${p.name}，${protagonistCastSummary}，点击放大`
                                : `${p.name}，点击放大`
                            }
                          >
                            <div style={styles.boardNpcChipTokenStack}>
                              <div
                                style={styles.boardNpcChipTokenRow}
                                aria-label={`指示物：友好 ${tok.friendly}，不安 ${tok.unrest}/${tok.unrestMax}，密谋 ${tok.plot}`}
                              >
                                <span style={{ ...styles.boardNpcChipTokenCell, ...styles.boardNpcChipTokenFriendly }}>
                                  {tok.friendly}
                                </span>
                                <span
                                  style={{
                                    ...styles.boardNpcChipTokenCell,
                                    ...styles.boardNpcChipTokenUnrest,
                                    ...(tok.unrestMax > 0 && tok.unrest >= tok.unrestMax
                                      ? styles.boardNpcChipTokenCellUnrestAtMax
                                      : {}),
                                  }}
                                >
                                  {`${tok.unrest}/${tok.unrestMax}`}
                                </span>
                                <span style={{ ...styles.boardNpcChipTokenCell, ...styles.boardNpcChipTokenPlot }}>
                                  {tok.plot}
                                </span>
                              </div>
                              {extraHandCardsUiEnabled ? (
                                <div
                                  style={styles.boardNpcChipTokenRowExtra}
                                  aria-label={`希望：${tok.hope}，绝望：${tok.despair}`}
                                >
                                  <span style={styles.boardNpcChipTokenCell}>
                                    {`希望：${tok.hope}`}
                                  </span>
                                  <span style={styles.boardNpcChipTokenCell}>
                                    {`绝望：${tok.despair}`}
                                  </span>
                                </div>
                              ) : null}
                              {protagonistExtraTokensUiEnabled ? (() => {
                                const legend = protagonistExtraTokensLegendForNpc(
                                  uiNpcProtagonistExtraTokenIdsByNpcId[p.npcId],
                                );
                                return legend ? (
                                  <div style={styles.boardNpcChipExtraLegendRow}>{legend}</div>
                                ) : null;
                              })() : null}
                            </div>
                            <div style={styles.boardNpcChipImageWrap}>
                              <NpcBoardPortraitClipped
                                imgUrl={p.imgUrl}
                                name={p.name}
                                alive={getNpcAlive(p.npcId)}
                                tok={tok}
                                portraitImgStyle={{
                                  ...(highlightNpcPortraitForPlayedHand
                                    ? {
                                        ...styles.boardNpcChipImgPlayedHandHighlight,
                                        boxShadow: boardPlayedActionCardBoxShadow(
                                          boardPlayedCardOutline,
                                          BOARD_PLAYED_CARD_SHADOW_NPC_PORTRAIT,
                                        ),
                                      }
                                    : {}),
                                }}
                              />
                              {(() => {
                                const exIdNpc =
                                  showMastermindExCardFacesOnBoard ? (uiMastermindExCardByNpcId[p.npcId] ?? '').trim() : '';
                                const exSrcNpc = exIdNpc ? MASTERMIND_EX_CARD_FACE_BY_ID[exIdNpc] : '';
                                return exSrcNpc ? (
                                  <img
                                    src={exSrcNpc}
                                    alt=""
                                    style={styles.boardNpcChipProtagonistExCard}
                                    draggable={false}
                                  />
                                ) : null;
                              })()}
                              {(() => {
                                const extraUrls = protagonistExtraTokensUiEnabled
                                  ? getProtagonistExtraTokenUrlsForNpc(p.npcId)
                                  : [];
                                const specialUrls = getDisplayedSpecialTokenUrlsForNpc(p.npcId);
                                if (!extraUrls.length && !specialUrls.length) return null;
                                return (
                                  <div
                                    style={styles.boardNpcChipCenterTokenCluster}
                                    aria-label="NPC 叠放标记"
                                  >
                                    {extraUrls.length > 0 ? (
                                      <div style={styles.boardNpcChipProtagonistExtraCluster}>
                                        {extraUrls.map((u, idx) => (
                                          <img
                                            key={`${p.npcId}-pex-${idx}`}
                                            src={u}
                                            alt=""
                                            style={styles.boardNpcChipProtagonistExtraImg}
                                            draggable={false}
                                          />
                                        ))}
                                      </div>
                                    ) : null}
                                    {specialUrls.length > 0 ? (
                                      <div style={styles.boardNpcChipSpecialTokenClusterInner}>
                                        {specialUrls.map((u, idx) => (
                                          <img
                                            key={`${p.npcId}-st-${idx}`}
                                            src={u}
                                            alt=""
                                            style={styles.boardNpcChipSpecialTokenImg}
                                            draggable={false}
                                          />
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })()}
                              {selectedMastermindCardByNpcId[p.npcId] ? (
                                <img
                                  src={
                                    shouldRevealMastermindCardFace
                                      ? (MASTERMIND_CARD_IMAGE_BY_ID[selectedMastermindCardByNpcId[p.npcId]] ?? mastermindCardBackImg0b)
                                      : mastermindCardBackImg0b
                                  }
                                  alt="剧作家卡牌示意图"
                                  style={{
                                    ...styles.boardNpcChipMastermindCard,
                                    ...boardNpcPlayedHandImgStyle(areaPlacements.length, 'mastermind'),
                                    boxShadow: boardPlayedActionCardBoxShadow(
                                      boardPlayedCardOutline,
                                      BOARD_PLAYED_CARD_SHADOW_NPC_MINI,
                                    ),
                                  }}
                                  draggable={false}
                                />
                              ) : null}
                              {hasProtagonistPlayedOnNpc && playedHandVisibleProtagonist ? (
                                <img
                                  src={
                                    shouldRevealMastermindCardFace
                                      ? getProtagonistCardFaceByPidAndCardId(
                                          playedHandVisibleProtagonist,
                                          protagonistPlayedCardId,
                                        )
                                      : getProtagonistCardBackByPid(playedHandVisibleProtagonist)
                                  }
                                  alt="主人公卡牌示意图"
                                  style={{
                                    ...styles.boardNpcChipProtagonistCard,
                                    ...boardNpcPlayedHandImgStyle(areaPlacements.length, 'protagonist'),
                                    boxShadow: boardPlayedActionCardBoxShadow(
                                      boardPlayedCardOutline,
                                      BOARD_PLAYED_CARD_SHADOW_NPC_MINI,
                                    ),
                                  }}
                                  draggable={false}
                                />
                              ) : null}
                              <div style={styles.boardNpcChipCaptionOverlay}>
                                <span style={styles.boardNpcChipNameOnCard}>{p.name}</span>
                                {isMastermindView ? (
                                  <span style={styles.boardNpcChipRoleOnCard}>
                                    {mastermindRoleLabels(p, roleDisplayName)}
                                  </span>
                                ) : protagonistCastSummary ? (
                                  <span style={styles.boardNpcChipRoleOnCard}>
                                    {protagonistCastSummary}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          );
                        })() : (
                          <div
                            style={styles.boardNpcChipNoArtClick}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNpcZoomPlacement(p);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setNpcZoomPlacement(p);
                              }
                            }}
                            aria-label={
                              protagonistCastSummary
                                ? `${p.name}，${protagonistCastSummary}，点击放大`
                                : `${p.name}，点击放大`
                            }
                          >
                            <span style={{ ...styles.boardNpcChipName, ...styles.boardNpcChipTextLayer }}>{p.name}</span>
                            {isMastermindView ? (
                              <span style={{ ...styles.boardNpcChipRole, ...styles.boardNpcChipTextLayer }}>
                                {mastermindRoleLabels(p, roleDisplayName)}
                              </span>
                            ) : protagonistCastSummary ? (
                              <span style={{ ...styles.boardNpcChipRole, ...styles.boardNpcChipTextLayer }}>
                                {protagonistCastSummary}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 右侧：隙（时之缝隙）→ Ⅰ–Ⅴ（FS 模组不显示终） */}
          <div style={styles.rightPanel}>
            <h3 style={styles.dayFlowTitle}>{isFsModule ? '阶段流程（隙 · Ⅰ–Ⅴ）' : '阶段流程（隙 · Ⅰ–Ⅴ · 终）'}</h3>
            {(() => {
              const inTimeSpiral = Boolean(G?.inTimeSpiral);
              const inFinalGuess = Boolean(G?.inFinalGuess);
              const waitingFinalConsensus = Boolean(G?.awaitingProtagonistFinalConsensus) && !inFinalGuess;
              const clampedIdx = Math.max(
                0,
                Math.min(Number(G?.dayFlowFlatIndex ?? 0), TRAGEDY_DAY_MAIN_FLOW_FLAT.length - 1),
              );
              const currentMeta = TRAGEDY_DAY_MAIN_FLOW_FLAT[clampedIdx]?.meta;
              let nextDisabled = true;
              let nextTitle = '当前阶段不可推进';
              let onAdvance: (() => void) | null = null;
              let prevDisabled = true;
              let prevTitle = '当前阶段不可回退';
              let onRetreat: (() => void) | null = null;

              if (inFinalGuess) {
                nextDisabled = true;
                nextTitle = '终盘阶段不可通过此按钮推进';
                prevDisabled = true;
                prevTitle = '终盘阶段不可通过此按钮回退';
              } else if (waitingFinalConsensus) {
                nextDisabled = true;
                nextTitle = '等待三名主人公确认后进入终盘';
                prevDisabled = true;
                prevTitle = '等待终盘确认期间不可回退阶段';
              } else if (inTimeSpiral) {
                const spiralMeta = TRAGEDY_TIME_SPIRAL_GROUP.phases[0]!;
                const canSpiralNext = Boolean(G?.dayFlowSubPhaseReady) && canUseFlowButtonBySeat(spiralMeta.nextBy);
                nextDisabled = !canSpiralNext;
                nextTitle = G?.timeSpiralEntryReason === 'day_start'
                  ? '由主人公方进入今日流程（Ⅰ）'
                  : '由主人公方推进至下一轮回';
                onAdvance = () => {
                  moves.leaveTimeSpiralNextLoop?.();
                };
                prevDisabled = true;
                prevTitle = '时之缝隙阶段不支持回退';
              } else if (currentMeta) {
                if (currentMeta.nextBy === 'none') {
                  nextDisabled = true;
                  nextTitle = '本阶段不通过此处推进';
                } else {
                  const canAdvance = canUseFlowButtonBySeat(currentMeta.nextBy);
                  nextDisabled = !canAdvance;
                  nextTitle = canAdvance ? '点击后自动结算并推进' : '请由对应座位操作本机客户端';
                  onAdvance = () => {
                    if (currentMeta.settleBy !== 'none' && !Boolean(G?.dayFlowSubPhaseReady)) {
                      moves.settleCurrentFlowPhase?.();
                    }
                    moves.advanceMainFlowPhase?.();
                  };
                }
                const canRetreat = isMastermindView && clampedIdx > 0;
                prevDisabled = !canRetreat;
                prevTitle = canRetreat ? '返回上一子阶段' : '仅剧作家可回退，且当前已是首子阶段';
                onRetreat = () => {
                  moves.retreatMainFlowPhase?.();
                };
              }

              return (
                <div style={styles.dayFlowGlobalNextRow}>
                  <button
                    type="button"
                    style={{
                      ...styles.dayFlowMiniBtn,
                      ...(prevDisabled ? styles.dayFlowMiniBtnOff : styles.dayFlowMiniBtnOn),
                      ...styles.dayFlowGlobalPrevBtn,
                    }}
                    disabled={prevDisabled}
                    title={prevTitle}
                    onClick={() => {
                      if (prevDisabled) return;
                      onRetreat?.();
                    }}
                  >
                    上一阶段
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.dayFlowMiniBtn,
                      ...(nextDisabled ? styles.dayFlowMiniBtnOff : styles.dayFlowMiniBtnOn),
                      ...styles.dayFlowGlobalNextBtn,
                    }}
                    disabled={nextDisabled}
                    title={nextTitle}
                    onClick={() => {
                      if (nextDisabled) return;
                      onAdvance?.();
                    }}
                  >
                    下一阶段
                  </button>
                </div>
              );
            })()}
            {!G?.inFinalGuess ? (
              <>
                {isMastermindView && !G?.inTimeSpiral ? (
                  <div style={styles.loopFailRow}>
                    {(() => {
                      const isFinalLoop = !isFsModule && Number(G?.loop ?? 1) >= Number(G?.maxLoops ?? maxLoops);
                      const loopFailTitle = isFinalLoop
                        ? '当前为最终轮次：立即进入最终决战阶段'
                        : '宣告本轮回失败，立即进入时之缝隙';
                      const loopFailLabel = isFinalLoop
                        ? '本轮回失败 → 进入最终决战'
                        : '本轮回失败 → 进入时之缝隙';
                      return (
                    <button
                      type="button"
                      style={{
                        ...styles.dayFlowMiniBtn,
                        ...styles.dayFlowMiniBtnOn,
                        ...styles.loopFailBtn,
                      }}
                      title={loopFailTitle}
                      onClick={() => moves.enterTimeSpiralFromLoopFailure?.()}
                    >
                      {loopFailLabel}
                    </button>
                      );
                    })()}
                  </div>
                ) : null}
                {isProtagonistView
                  && !isFsModule
                  ? (() => {
                      const protagIds = TRAGEDY_LOOPER_SEATS.filter((s) => s.role === 'protagonist').map(
                        (s) => s.playerId,
                      );
                      const votes = (G?.protagonistFinalGuessVotes ?? {}) as Record<string, true>;
                      const n = protagIds.filter((id) => Boolean(votes[id])).length;
                      const votePid = currentProtagonistId;
                      const voteSeat = votePid ? getSeatByPlayerId(votePid) : undefined;
                      const myVoted = Boolean(votePid && votes[votePid]);
                      const inSpiral = Boolean(G?.inTimeSpiral);
                      return (
                        <div style={styles.finalVoteRow}>
                          <button
                            type="button"
                            style={{
                              ...styles.dayFlowMiniBtn,
                              ...(!myVoted && !inSpiral ? styles.dayFlowMiniBtnOn : styles.dayFlowMiniBtnOff),
                              ...styles.finalVoteBtn,
                            }}
                            disabled={myVoted || inSpiral}
                            title={
                              myVoted
                                ? `${voteSeat?.displayName ?? '该主人公'}已确认，待其余主人公确认`
                                : inSpiral
                                  ? '时之缝隙中不可确认，请先进入今日流程'
                                  : '三名主人公均确认后进入最终决战环节'
                            }
                            onClick={() => moves.protagonistAckEnterFinalGuess?.({ targetPid: votePid })}
                          >
                            {`进入最终决战（${n}/3）${voteSeat ? ` · 当前操作：${voteSeat.displayName}` : ''}`}
                          </button>
                        </div>
                      );
                    })()
                  : null}
              </>
            ) : null}
            <div style={styles.dayFlowScroll}>
              <section
                style={{
                  ...styles.dayFlowGroup,
                  marginTop: 0,
                  opacity: G?.inFinalGuess ? 0.55 : 1,
                }}
              >
                <header style={styles.dayFlowGroupHeader}>
                  <span style={styles.dayFlowRoman}>{TRAGEDY_TIME_SPIRAL_GROUP.romanBand}</span>
                  <span style={styles.dayFlowBandTitleWrap}>
                    <span style={styles.dayFlowBandTitle}>{TRAGEDY_TIME_SPIRAL_GROUP.bandTitle}</span>
                    <button
                      type="button"
                      style={styles.dayFlowHelpBtn}
                      onClick={() => setShowTimeSpiralHint((prev) => !prev)}
                      aria-label="查看时之缝隙说明"
                      title="查看时之缝隙说明"
                    >
                      ?
                    </button>
                  </span>
                </header>
                {(() => {
                  const spiralMeta = TRAGEDY_TIME_SPIRAL_GROUP.phases[0]!;
                  const inSpiral = Boolean(G?.inTimeSpiral);
                  return (
                    <>
                      {showTimeSpiralHint ? (
                        <p style={{ ...styles.timeSpiralBody, marginTop: 0, marginBottom: '10px' }}>
                          非最终轮回时，在当轮回最后一日夜晚结束后进入此处；中途失败时剧作家也可宣告进入此处。
                        </p>
                      ) : null}
                      <div
                        style={{
                          ...styles.dayFlowPhaseRow,
                          ...(inSpiral ? styles.dayFlowPhaseRowCurrent : {}),
                        }}
                      >
                        <div style={styles.dayFlowPhaseBody}>
                          <div style={styles.dayFlowStepName}>{spiralMeta.step}</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </section>

              <div
                style={{
                  opacity:
                    G?.inTimeSpiral || G?.inFinalGuess || G?.awaitingProtagonistFinalConsensus ? 0.38 : 1,
                  pointerEvents:
                    G?.inTimeSpiral || G?.inFinalGuess || G?.awaitingProtagonistFinalConsensus ? 'none' : 'auto',
                }}
              >
              {TRAGEDY_DAY_MAIN_FLOW_FLAT.map((entry, flatIdx) => {
                const { meta, group } = entry;
                const prev = flatIdx > 0 ? TRAGEDY_DAY_MAIN_FLOW_FLAT[flatIdx - 1] : undefined;
                const showGroupHeader = !prev || prev.group.romanBand !== group.romanBand;
                const flowIdx = G?.dayFlowFlatIndex ?? 0;
                const isCurrent =
                  !G?.inTimeSpiral &&
                  !G?.inFinalGuess &&
                  !G?.awaitingProtagonistFinalConsensus &&
                  flatIdx === flowIdx;
                return (
                  <React.Fragment key={`${group.romanBand}-${flatIdx}-${meta.step}`}>
                    {showGroupHeader ? (
                      <header style={{ ...styles.dayFlowGroupHeader, marginTop: flatIdx > 0 ? '10px' : 0 }}>
                        <span style={styles.dayFlowRoman}>{group.romanBand}</span>
                        <span style={styles.dayFlowBandTitle}>{group.bandTitle}</span>
                      </header>
                    ) : null}
                    <div
                      style={{
                        ...styles.dayFlowPhaseRow,
                        ...(isCurrent ? styles.dayFlowPhaseRowCurrent : {}),
                      }}
                    >
                      <div style={styles.dayFlowPhaseBody}>
                        <div style={styles.dayFlowStepName}>{meta.step}</div>
                      </div>
                    </div>
                    {meta.step === Steps.EventPhase ? (
                      <div style={styles.eventOutcomeRow}>
                        <span style={styles.dayFlowMetaChip}>事件结果</span>
                        <select
                          value={String(G?.uiEventPhaseOutcome ?? '')}
                          onChange={(e) => {
                            moves.setUiEventPhaseOutcome?.({
                              outcome: e.target.value as '' | 'not_happened' | 'happened' | 'happened_no_phenomenon',
                            });
                          }}
                          style={{
                            ...styles.eventOutcomeSelect,
                            ...(!isMastermindView ? styles.controlDisabled : {}),
                          }}
                          disabled={!isMastermindView}
                          aria-label="事件阶段结果"
                        >
                          <option value="">请选择事件结果</option>
                          {EVENT_PHASE_OUTCOME_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
              </div>

              {!isFsModule ? (
              <section style={{ ...styles.dayFlowGroup, marginTop: '12px' }}>
                <header style={styles.dayFlowGroupHeader}>
                  <span style={styles.dayFlowRoman}>终</span>
                  <span style={styles.dayFlowBandTitle}>最终决战</span>
                </header>
                <div
                  style={{
                    ...styles.dayFlowPhaseRow,
                    borderColor: 'rgba(148, 163, 184, 0.35)',
                    ...(G?.inFinalGuess ? styles.dayFlowPhaseRowCurrent : {}),
                  }}
                >
                  <div style={styles.dayFlowPhaseBody}>
                    <div style={styles.dayFlowStepName}>{Steps.FinalGuess}</div>
                    <div style={styles.dayFlowStepMeta}>
                      <span style={styles.dayFlowMetaChip}>
                        {G?.inFinalGuess
                          ? '三名主人公均已确认，已进入终盘（规则占位）'
                          : G?.awaitingProtagonistFinalConsensus
                            ? '请三名主人公在下方分别确认后进入终盘'
                            : '需三名主人公均确认「进入最终决战」后进入'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              ) : null}
            </div>
            <section style={styles.gameLogPanel} aria-label="游戏日志">
              <header style={styles.gameLogHeader}>游戏日志</header>
              <div style={styles.gameLogList}>
                {gameLogs.length === 0 ? (
                  <div style={styles.gameLogEmpty}>阶段切换后将自动播报五个版图上的角色 token 状态。</div>
                ) : (
                  [...gameLogs].reverse().map((log) => (
                    <article key={log.id} style={styles.gameLogItem}>
                      <div style={styles.gameLogLine}>{formatGameLogLine(log)}</div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <div style={styles.currentHandRowOuter}>
        {extraHandCardsUiEnabled && (isMastermindView || isProtagonistView) && currentHandOwnerPid ? (
          <section style={styles.extraHandCardsPanel} aria-label="额外可选手牌">
            <div style={styles.extraHandCardsTitle}>额外卡牌</div>
            <div style={styles.extraHandCardsHint}>非开局所持；加入后与本方其它手牌一致，可弃置、可参与行动选择。</div>
            {(isMastermindView ? MASTERMIND_EXTRA_HAND : PROTAGONIST_EXTRA_HAND).map((card) => {
              const inHand = isMastermindView
                ? mastermindHandIdSet.has(card.id)
                : protagonistHandIdSetForCurrent.has(card.id);
              const img = isMastermindView
                ? (MASTERMIND_CARD_IMAGE_BY_ID[card.id] ?? mastermindCardBackImg0b)
                : getProtagonistCardFaceByPidAndCardId(String(currentProtagonistId), card.id);
              return (
                <div key={card.id} style={styles.extraHandCardRow}>
                  <div style={styles.extraHandCardThumbWrap}>
                    <img src={img} alt="" style={styles.extraHandCardThumb} draggable={false} />
                    {HAND_CARD_SPECIAL_RULE_BY_ID[card.id] ? (
                      <button
                        type="button"
                        style={styles.extraHandCardRuleHintBtn}
                        aria-label={`${card.name}特别规则说明`}
                        title="特别规则"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setHandCardSpecialRulePopup({ cardId: card.id, openerPlayerId: String(playerID ?? '') });
                        }}
                      >
                        ?
                      </button>
                    ) : null}
                  </div>
                  <span style={styles.extraHandCardName}>{card.name}</span>
                  <button
                    type="button"
                    style={{ ...styles.extraHandCardAddBtn, ...(inHand ? styles.controlDisabled : {}) }}
                    disabled={inHand}
                    onClick={() => moves.addOptionalHandCardToHand?.({ cardId: card.id })}
                  >
                    {inHand ? '已在手牌' : '加入手牌'}
                  </button>
                </div>
              );
            })}
          </section>
        ) : null}
      <section style={{ ...styles.currentHandPanel, ...(extraHandCardsUiEnabled && (isMastermindView || isProtagonistView) && currentHandOwnerPid ? styles.currentHandPanelBesideExtras : {}) }} aria-label="当前玩家手牌">
        <div style={styles.currentHandTitle}>
          当前玩家手牌
          {isMastermindView ? '（剧作家）' : isProtagonistView ? '（主人公）' : '（观战）'}
        </div>
        {exCardsUiEnabled && isMastermindView ? (
          <div style={styles.currentHandMastermindExSection}>
            <div style={styles.currentHandMastermindExHeading}>
              EX 扩充手牌（共 {mastermindExHandIds.length} 张；在顶栏可多行同时为不同版图格/NPC 各指定一张）
            </div>
            <div style={styles.currentHandMastermindExStrip}>
              {mastermindExHandIds.map((id) => {
                const src = MASTERMIND_EX_CARD_FACE_BY_ID[id];
                const def = TRAGEDY_EX_CARD_DEFS.find((d) => d.id === id);
                return (
                  <div
                    key={`mastermind-ex-hand-${id}`}
                    title={def?.shortLabel ?? id}
                    style={styles.currentHandMastermindExThumbStill}
                  >
                    <img src={src} alt={def?.shortLabel ?? ''} style={styles.currentHandMastermindExThumbImg} draggable={false} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {currentPlayerHandCards.length > 0 ? (
          <div style={styles.currentHandList}>
            {currentPlayerHandCards.filter((card) => !card.discarded).map((card) => (
              <article
                key={`current-hand-${card.id}`}
                style={{
                  ...styles.currentHandCard,
                  ...(card.selected ? styles.currentHandCardSelected : {}),
                }}
              >
                <div style={styles.currentHandCardImageWrap}>
                  <img src={card.imageUrl} alt={card.name} style={styles.currentHandCardImage} draggable={false} />
                  {HAND_CARD_SPECIAL_RULE_BY_ID[card.id] ? (
                    <button
                      type="button"
                      style={styles.currentHandCardRuleHintBtn}
                      aria-label={`${card.name}特别规则说明`}
                      title="特别规则"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setHandCardSpecialRulePopup({ cardId: card.id, openerPlayerId: String(playerID ?? '') });
                      }}
                    >
                      ?
                    </button>
                  ) : null}
                </div>
                <div style={styles.currentHandCardHeader}>
                  <span>{card.name}</span>
                  <span style={styles.currentHandCardTags}>
                    {[card.oncePerLoop ? '轮限' : '', card.selected ? '已选择' : '', card.used ? '已使用' : '']
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                <button
                  type="button"
                  style={styles.currentHandDiscardBtn}
                  onClick={() => {
                    if (card.autoDiscarded || !currentHandOwnerPid) return;
                    moves.setUiHandDiscardedCard?.({ pid: currentHandOwnerPid, cardId: card.id, discarded: true });
                  }}
                >
                  弃置
                </button>
                {card.description ? <div style={styles.currentHandCardBody}>{card.description}</div> : null}
                {card.used ? <div style={styles.currentHandCardUsedMask}>已使用</div> : null}
              </article>
            ))}
          </div>
        ) : (
          <div style={styles.currentHandEmpty}>当前视角未绑定玩家手牌。</div>
        )}
      </section>
      </div>

      {(() => {
        const p = handCardSpecialRulePopup;
        const ruleText = p && HAND_CARD_SPECIAL_RULE_BY_ID[p.cardId];
        const visible =
          Boolean(ruleText)
          && p != null
          && p.openerPlayerId === String(playerID ?? '');
        if (!visible || !p || !ruleText) return null;
        return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hand-card-special-rule-title"
          style={styles.handCardSpecialRuleBackdrop}
          onClick={() => setHandCardSpecialRulePopup(null)}
        >
          <div style={styles.handCardSpecialRulePanel} onClick={(e) => e.stopPropagation()}>
            <h3 id="hand-card-special-rule-title" style={styles.handCardSpecialRuleTitle}>
              特别规则
            </h3>
            <p style={styles.handCardSpecialRuleText}>{ruleText}</p>
            <button
              type="button"
              style={styles.handCardSpecialRuleCloseBtn}
              onClick={() => setHandCardSpecialRulePopup(null)}
            >
              关闭
            </button>
          </div>
        </div>
        );
      })()}

      {G?.inFinalGuess && isFinalGuessModalOpen ? (
        <div style={styles.finalGuessOverlay}>
          <div style={styles.finalGuessModal} role="dialog" aria-modal="true" aria-labelledby="final-guess-title">
            <div style={styles.finalGuessHeader}>
              <h3 id="final-guess-title" style={styles.finalGuessTitle}>最终决战</h3>
              <button
                type="button"
                style={styles.finalGuessCloseBtn}
                onClick={() => setIsFinalGuessModalOpen(false)}
                aria-label="关闭最终决战面板"
                title="关闭"
              >
                ×
              </button>
            </div>
            <div style={styles.finalGuessSubTitle}>
              三名主人公共享本界面操作；列表默认按身份 ID 排序，可任意选择 NPC 猜测，须全员猜对获胜。
            </div>
            {finalGuessCharacters.length === 0 ? (
              <div style={styles.finalGuessEmpty}>当前剧本没有定义 NPC 角色，无法进行最终决战。</div>
            ) : (
              <div style={styles.finalGuessList}>
                {finalGuessCharacters.map((row) => {
                  const selectedRoleId = finalGuessSelectedRoleByNpcId[row.npcId] ?? '';
                  const status = finalGuessStatusByNpcId[row.npcId];
                  const solved = finalGuessSolvedNpcIds.includes(row.npcId);
                  const editable = canOperateFinalGuess && !solved;
                  return (
                    <div key={`final-guess-row-${row.npcId}`} style={styles.finalGuessRow}>
                      <button
                        type="button"
                        style={styles.finalGuessNpcNameBtn}
                        onClick={() => setNpcZoomPlacement(row)}
                        title={`查看 ${row.name} 卡面与能力`}
                      >
                        {row.name}
                      </button>
                      <select
                        value={selectedRoleId}
                        onChange={(e) => {
                          moves.setUiFinalGuessRoleChoice?.({
                            npcId: row.npcId,
                            roleId: e.target.value,
                          });
                        }}
                        style={{
                          ...styles.finalGuessSelect,
                          ...(editable ? {} : styles.controlDisabled),
                        }}
                        disabled={!editable}
                        aria-label={`${row.name}身份选择`}
                      >
                        <option value="">选择身份</option>
                        {finalGuessRoleOptions.map((role) => (
                          <option key={`${row.npcId}-${role.roleId}`} value={role.roleId}>
                            {role.roleName}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        style={{
                          ...styles.finalGuessSubmitBtn,
                          ...(editable && selectedRoleId ? {} : styles.controlDisabled),
                        }}
                        disabled={!editable || !selectedRoleId}
                        onClick={() => {
                          if (!selectedRoleId) return;
                          moves.submitUiFinalGuessRole?.({
                            npcId: row.npcId,
                            roleId: selectedRoleId,
                            correctRoleId: row.correctRoleIds[0] ?? row.roleId,
                            correctRoleIds: row.correctRoleIds,
                            orderedNpcIds: finalGuessOrderedNpcIds,
                          });
                        }}
                      >
                        提交
                      </button>
                      <div
                        style={{
                          ...styles.finalGuessResult,
                          ...(status === 'correct'
                            ? styles.finalGuessResultCorrect
                            : status === 'wrong'
                              ? styles.finalGuessResultWrong
                              : {}),
                        }}
                      >
                        {status === 'correct'
                          ? '正确'
                          : status === 'wrong'
                            ? '错误'
                            : solved
                              ? '已通过'
                              : '待猜测'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={styles.finalGuessFooter}>
              {finalGuessAllSolved
                ? '所有身份猜测正确：最终决战主人公胜利。'
                : `进度：${finalGuessSolvedNpcIds.length}/${finalGuessCharacters.length}`}
            </div>
          </div>
        </div>
      ) : null}
      {G?.inFinalGuess && !isFinalGuessModalOpen ? (
        <button
          type="button"
          style={styles.finalGuessReopenBtn}
          onClick={() => setIsFinalGuessModalOpen(true)}
          aria-label="打开最终决战面板"
          title="打开最终决战面板"
        >
          打开最终决战
        </button>
      ) : null}

      {showModuleInfo && selectedModuleData && (
        <div style={styles.moduleInfoOverlay} onClick={() => setShowModuleInfo(false)}>
          <div style={styles.moduleInfo} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{selectedModuleData.fullName} （规则，身份，事件速查表）</h3>
              <button type="button" style={styles.closeButton} onClick={() => setShowModuleInfo(false)}>关闭</button>
            </div>
            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>模组描述</h4>
              <p style={styles.moduleMetaText}>
                {selectedModuleData.description?.trim() ? selectedModuleData.description : '（无）'}
              </p>
            </div>
            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>Ex 槽名称</h4>
              <p style={styles.moduleMetaText}>
                {selectedModuleData.exSlot?.name?.trim() ? selectedModuleData.exSlot.name : '（无）'}
              </p>
            </div>
            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>Ex 槽描述</h4>
              <p style={styles.moduleMetaText}>
                {selectedModuleData.exSlot?.description?.trim() ? selectedModuleData.exSlot.description : '（无）'}
              </p>
            </div>
            <div>
              <h4>规则</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.moduleRuleMiddle}></th>
                    <th style={styles.moduleRuleLeft}>规则名</th>
                    {selectedModuleData.roles.map((r) => (
                      <th key={r.roleId} style={{ ...styles.moduleRuleMiddle, verticalAlign: 'top', textAlign: 'center' }}> {r.roleName} </th>
                    ))}
                    <th style={{ ...styles.moduleRuleRight, verticalAlign: '', textAlign: 'center' }}>追加规则</th>
                  </tr>
                </thead>
                <tbody style={{ border: '1px solid #ddd' }}>
                  {selectedModuleData.rules.map((rule, ruleIdx) => {
                    const addRulesCount = rule.addRules?.length || 1;

                    return (
                      <React.Fragment key={rule.ruleId}>
                        <tr>
                          <td
                            rowSpan={addRulesCount}
                            style={{ ...styles.moduleRuleMiddle, verticalAlign: 'middle', textAlign: 'center', width: '15px', color: rule.ruleType === 'X' ? '#a797ff' : '#ff6565' }}
                          >
                            {rule.ruleType}
                          </td>
                          <td
                            rowSpan={addRulesCount}
                            style={{ ...styles.moduleRuleLeft, textAlign: 'left', verticalAlign: 'middle' }}
                          >
                            {rule.ruleName}
                          </td>
                          {rule.rolesLimits.map((limit, idx) => (
                            <td
                              key={idx}
                              rowSpan={addRulesCount}
                              style={{ ...styles.moduleRuleMiddle, textAlign: 'center', verticalAlign: 'middle', backgroundColor: limit.maxCount === '' ? '#16213e' : '#0f3460', color: limit.maxCount === '' ? '#fff' : '#e94560', fontWeight: limit.maxCount === '' ? 'normal' : 'bold' }}
                            >
                              {limit.maxCount}
                            </td>
                          ))}
                          <td
                            style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}
                          >
                            {rule.addRules[0]?.description || ''}
                          </td>
                        </tr>

                        {rule.addRules?.slice(1).map((addRule, addIdx) => (
                          <tr key={`${ruleIdx}-add-${addIdx}`}>
                            <td
                              style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}
                            >
                              {addRule.description}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              <h4>身份</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.moduleRuleLeft}>身份名</th>
                    <th style={{ ...styles.roleMaxCountColumn, textAlign: 'center' }}>上限</th>
                    <th style={{ ...styles.moduleMiddle, border: '1px solid #ddd', width: '80px', textAlign: 'center' }}>身份特征</th>
                    <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>能力</th>
                  </tr>
                </thead>
                <tbody style={{ border: '1px solid #ddd' }}>
                  {selectedModuleData.roles.map((role, idx) => {
                    const abilityCount = role.abilitys?.length || 1;

                    return (
                      <React.Fragment key={idx}>
                        <tr style={{ border: '1px solid #ddd' }}>
                          <td
                            rowSpan={abilityCount}
                            style={{ ...styles.moduleRuleLeft, textAlign: 'left', verticalAlign: 'middle', paddingLeft: '8px' }}
                          >
                            {role.roleName}
                          </td>
                          <td
                            rowSpan={abilityCount}
                            style={{ ...styles.roleMaxCountColumn, textAlign: 'center', verticalAlign: 'middle' }}
                          >
                            {role.maxCount}
                          </td>
                          <td
                            rowSpan={abilityCount}
                            style={{ ...styles.moduleMiddle, textAlign: 'left', border: '1px solid #ddd', verticalAlign: 'middle', paddingLeft: '8px' }}
                          >
                            {formatRoleFeaturesList(role.features) || '—'}
                          </td>
                          <td
                            style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}
                          >
                            {role.abilitys[0]?.description || ''}
                          </td>
                        </tr>

                        {role.abilitys?.slice(1).map((ability, aidx) => (
                          <tr key={`${idx}-${aidx}`} style={{ border: '1px solid #ddd' }}>
                            <td
                              style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}
                            >
                              {ability.description}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              <h4>事件</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.moduleRuleLeft}>事件名</th>
                    <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>事件效果</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedModuleData.incidents.map((incident, idx) => {
                    const descriptionCount = incident.Incident_Effects?.length || 1;

                    return (
                      <React.Fragment key={idx}>
                        <tr>
                          <td
                            rowSpan={descriptionCount}
                            style={{ ...styles.moduleRuleLeft, verticalAlign: 'middle', textAlign: 'left', paddingLeft: '8px' }}
                          >
                            {incident.incidentName}
                          </td>
                          <td
                            style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}
                          >
                            {incident.Incident_Effects[0]?.description ?? ''}
                          </td>
                        </tr>

                        {incident.Incident_Effects?.slice(1).map((eff, descIdx) => (
                          <tr key={`${idx}-desc-${descIdx}`}>
                            <td
                              style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}
                            >
                              {eff.description}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showScenarioInfo && selectedScenarioData && playerID != null && (
        <div style={styles.moduleInfoOverlay} onClick={() => setShowScenarioInfo(false)}>
          <div
            style={{
              ...styles.moduleInfo,
              backgroundColor: 'rgba(22, 33, 62, 0.96)',
              maxWidth: 'min(98vw, 1040px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12 }}>
              <button type="button" style={styles.closeButton} onClick={() => setShowScenarioInfo(false)}>关闭</button>
            </div>
            <ClosedScriptScenarioSheet
              scenario={selectedScenarioData}
              viewMode={isMastermindView ? 'mastermind' : 'protagonist'}
              selectedLoopCount={selectedRoundCount == null || selectedRoundCount <= 0 ? undefined : selectedRoundCount}
              ruleDisplayName={ruleDisplayName}
              incidentDisplayName={incidentDisplayName}
              roleDisplayName={roleDisplayName}
              npcDisplayName={npcDisplayName}
              protagonistDraft={isProtagonistView ? protagonistSheetDraft : undefined}
              onProtagonistDraftChange={isProtagonistView ? onProtagonistDraftChange : undefined}
            />
          </div>
        </div>
      )}

      {npcZoomPlacement && (
        (() => {
          const zoomNpcDef = Object.values(npcIndex).find((n) => n.id === npcZoomPlacement.npcId);
          const zoomNpcForbiddenAreas = new Set((zoomNpcDef?.forbiddenAreas ?? []) as Area[]);
          const zoomNpcDiscarded = Boolean(npcDiscardedByNpcId[npcZoomPlacement.npcId]);
          const zoomNpcFaraway = Boolean(npcFarawayByNpcId[npcZoomPlacement.npcId]);
          return (
        <div
          style={styles.npcZoomOverlay}
          onClick={() => setNpcZoomPlacement(null)}
          role="presentation"
        >
          <div
            style={styles.npcZoomModal}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="npc-zoom-title"
          >
            <div style={styles.npcZoomHeader}>
              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setNpcZoomPlacement(null)}
              >
                关闭
              </button>
            </div>
            <div style={styles.npcZoomTopControlRow}>
              <div style={styles.npcZoomTopControlCol}>
                <label htmlFor="npc-alive-select" style={{ ...styles.npcZoomControlLabel, marginTop: 0 }}>
                  是否存活
                </label>
                <select
                  id="npc-alive-select"
                  value={getNpcAlive(npcZoomPlacement.npcId) ? 'alive' : 'dead'}
                  onChange={(e) => {
                    const npcId = npcZoomPlacement.npcId;
                    moves.setUiNpcAlive?.({ npcId, alive: e.target.value === 'alive' });
                  }}
                  style={styles.npcZoomSelect}
                >
                  <option value="alive">存活</option>
                  <option value="dead">死亡</option>
                </select>
              </div>
              <div style={styles.npcZoomTopControlCol}>
                <label htmlFor="npc-area-select" style={{ ...styles.npcZoomControlLabel, marginTop: 0 }}>
                  当前角色区域
                </label>
                <select
                  id="npc-area-select"
                  value={zoomNpcFaraway ? '远方' : (npcAreaOverrideByNpcId[npcZoomPlacement.npcId] ?? npcZoomPlacement.area)}
                  onChange={(e) => {
                    const npcId = npcZoomPlacement.npcId;
                    if (e.target.value === Area.Faraway) {
                      const originArea =
                        npcFarawayOriginAreaByNpcId[npcId]
                        ?? npcAreaOverrideByNpcId[npcId]
                        ?? npcZoomPlacement.area;
                      moves.setUiNpcFaraway?.({ npcId, faraway: true, originArea });
                      return;
                    }
                    const nextArea = e.target.value as Area;
                    moves.setUiNpcFaraway?.({ npcId, faraway: false });
                    moves.setUiNpcArea?.({ npcId, area: nextArea });
                  }}
                  style={styles.npcZoomSelect}
                >
                  {AreaOptions.map((area) => (
                    <option key={area} value={area}>
                      {zoomNpcForbiddenAreas.has(area) ? `${area}（禁行）` : area}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.npcZoomTopControlCol}>
                <label style={{ ...styles.npcZoomControlLabel, marginTop: 0 }}>
                  弃置状态
                </label>
                <button
                  type="button"
                  style={styles.npcZoomDiscardToggleBtn}
                  onClick={() => {
                    const npcId = npcZoomPlacement.npcId;
                    if (zoomNpcDiscarded) {
                      moves.setUiNpcDiscarded?.({ npcId, discarded: false });
                      return;
                    }
                    const originArea =
                      npcDiscardOriginAreaByNpcId[npcId]
                      ?? npcAreaOverrideByNpcId[npcId]
                      ?? npcZoomPlacement.area;
                    moves.setUiNpcDiscarded?.({ npcId, discarded: true, originArea });
                  }}
                >
                  {zoomNpcDiscarded ? '还原' : '弃置'}
                </button>
              </div>
            </div>
            {(() => {
              const tok = getNpcTokenCounts(npcZoomPlacement.npcId);
              return (
                <>
                  <div
                    style={styles.npcZoomTokenRow}
                    aria-label={`指示物：友好 ${tok.friendly}，不安 ${tok.unrest}/${tok.unrestMax}，密谋 ${tok.plot}`}
                  >
                    <div style={styles.npcZoomTokenEditor}>
                      <span style={styles.npcZoomTokenLabel}>友好</span>
                      <div style={styles.npcZoomTokenStepper}>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'friendly', -1)}
                          aria-label="友好减一"
                        >
                          -
                        </button>
                        <span style={styles.npcZoomTokenValue}>{tok.friendly}</span>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'friendly', 1)}
                          aria-label="友好加一"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={styles.npcZoomTokenEditor}>
                      <span style={styles.npcZoomTokenLabel}>不安</span>
                      <div style={styles.npcZoomTokenStepper}>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'unrest', -1)}
                          aria-label="不安减一"
                        >
                          -
                        </button>
                        <span
                          style={{
                            ...styles.npcZoomTokenValue,
                            ...(tok.unrestMax > 0 && tok.unrest >= tok.unrestMax
                              ? styles.npcZoomTokenCellUnrestAtMax
                              : {}),
                          }}
                        >
                          {tok.unrest}/{tok.unrestMax}
                        </span>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'unrest', 1)}
                          aria-label="不安加一"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div style={styles.npcZoomTokenEditor}>
                      <span style={styles.npcZoomTokenLabel}>密谋</span>
                      <div style={styles.npcZoomTokenStepper}>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'plot', -1)}
                          aria-label="密谋减一"
                        >
                          -
                        </button>
                        <span style={styles.npcZoomTokenValue}>{tok.plot}</span>
                        <button
                          type="button"
                          style={styles.npcZoomTokenButton}
                          onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'plot', 1)}
                          aria-label="密谋加一"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {protagonistExtraTokensUiEnabled ? (() => {
                    const zl = protagonistExtraTokensLegendForNpc(
                      uiNpcProtagonistExtraTokenIdsByNpcId[npcZoomPlacement.npcId],
                    );
                    return zl ? (
                      <div style={{ ...styles.boardNpcChipExtraLegendRow, marginTop: 8, marginBottom: 2 }}>{zl}</div>
                    ) : null;
                  })() : null}
                  {extraHandCardsUiEnabled ? (
                    <div
                      style={styles.npcZoomTokenRowHopeDespair}
                      aria-label={`希望 ${tok.hope}，绝望 ${tok.despair}`}
                    >
                      <div style={styles.npcZoomTokenEditor}>
                        <span style={styles.npcZoomTokenLabel}>希望</span>
                        <div style={styles.npcZoomTokenStepper}>
                          <button
                            type="button"
                            style={styles.npcZoomTokenButton}
                            onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'hope', -1)}
                            aria-label="希望减一"
                          >
                            -
                          </button>
                          <span style={styles.npcZoomTokenValue}>
                            {tok.hope}
                          </span>
                          <button
                            type="button"
                            style={styles.npcZoomTokenButton}
                            onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'hope', 1)}
                            aria-label="希望加一"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div style={styles.npcZoomTokenEditor}>
                        <span style={styles.npcZoomTokenLabel}>绝望</span>
                        <div style={styles.npcZoomTokenStepper}>
                          <button
                            type="button"
                            style={styles.npcZoomTokenButton}
                            onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'despair', -1)}
                            aria-label="绝望减一"
                          >
                            -
                          </button>
                          <span style={styles.npcZoomTokenValue}>
                            {tok.despair}
                          </span>
                          <button
                            type="button"
                            style={styles.npcZoomTokenButton}
                            onClick={() => adjustNpcTokenValue(npcZoomPlacement.npcId, 'despair', 1)}
                            aria-label="绝望加一"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {(() => {
                    const zoomPathsAccepted =
                      uiNpcDisplayedSpecialTokenPathsByNpcId[npcZoomPlacement.npcId] ?? [];
                    const zoomNpcDefinesAssignableTok =
                      npcProvidesAssignableSpecialToken(zoomNpcDef);
                    const readOnlyAccepted =
                      zoomPathsAccepted.length > 0 ? (
                        <div style={styles.npcZoomSpecialTokenReadOnlyBlock}>
                          <div style={{ ...styles.npcZoomControlLabel, width: '100%', marginBottom: 6 }}>
                            此角色已接受的特殊 token
                          </div>
                          <div style={styles.npcZoomSpecialTokenReadOnlyRow}>
                            {zoomPathsAccepted.map((path) => {
                              const thumb = resolveTokenImageUrl(path);
                              const lb =
                                specialTokenPathToLabel.get(path)
                                ?? (path.includes('/') ? path.replace(/^.*\//, '') : path);
                              return (
                                <div key={path} style={styles.npcZoomSpecialTokenReadOnlyItem}>
                                  {thumb ? (
                                    <img src={thumb} alt="" style={styles.npcZoomSpecialTokenThumb} draggable={false} />
                                  ) : null}
                                  <span style={styles.npcZoomSpecialTokenCheckboxText}>{lb}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null;
                    const effectiveAssignTargetKey =
                      specialTokenAssignTargetOptions.some((o) => o.key === specialTokenAssignTargetKey)
                        ? specialTokenAssignTargetKey
                        : (specialTokenAssignTargetOptions[0]?.key ?? '');
                    const assignTargetParsed =
                      parseSpecialTokenAssignTargetKey(effectiveAssignTargetKey);
                    const assignUi =
                      boardSpecialTokenSelectOptions.length > 0
                      && isMastermindView
                      && zoomNpcDefinesAssignableTok ? (
                        <div style={styles.npcZoomSpecialTokenBlock}>
                          <div style={{ ...styles.npcZoomControlLabel, width: '100%', marginBottom: 6 }}>
                            分配特殊 token（作用对象含版图与各角色）
                          </div>
                          <label htmlFor="special-token-assign-target" style={{ ...styles.npcZoomControlLabel, marginTop: 4 }}>
                            作用对象
                          </label>
                          <select
                            id="special-token-assign-target"
                            value={effectiveAssignTargetKey}
                            onChange={(e) => setSpecialTokenAssignTargetKey(e.target.value)}
                            style={styles.npcZoomSelect}
                          >
                            {specialTokenAssignTargetOptions.map((o) => (
                              <option key={o.key} value={o.key}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          <div style={{ ...styles.npcZoomSpecialTokenCheckboxWrap, marginTop: 10 }}>
                            {boardSpecialTokenSelectOptions.map((opt) => {
                              const pathsForTgt =
                                assignTargetParsed?.kind === 'area'
                                  ? (uiAreaDisplayedSpecialTokenPathsByArea[assignTargetParsed.area] ?? [])
                                  : assignTargetParsed?.kind === 'npc'
                                    ? (uiNpcDisplayedSpecialTokenPathsByNpcId[assignTargetParsed.npcId] ?? [])
                                    : [];
                              const selectedSet = new Set(pathsForTgt);
                              const isOn = selectedSet.has(opt.path);
                              const thumb = resolveTokenImageUrl(opt.path);
                              return (
                                <label key={opt.path} style={styles.npcZoomSpecialTokenCheckboxLabel}>
                                  <input
                                    type="checkbox"
                                    checked={isOn}
                                    disabled={!assignTargetParsed}
                                    onChange={(e) => {
                                      const tgt = assignTargetParsed;
                                      if (!tgt) return;
                                      const nextSet = new Set(pathsForTgt);
                                      if (e.target.checked) nextSet.add(opt.path);
                                      else nextSet.delete(opt.path);
                                      const imagePaths = [...nextSet];
                                      if (tgt.kind === 'area') {
                                        moves.setUiAreaDisplayedSpecialTokens?.({
                                          area: tgt.area,
                                          imagePaths,
                                        });
                                      } else {
                                        moves.setUiNpcDisplayedSpecialTokens?.({
                                          npcId: tgt.npcId,
                                          imagePaths,
                                        });
                                      }
                                    }}
                                  />
                                  {thumb ? (
                                    <img src={thumb} alt="" style={styles.npcZoomSpecialTokenThumb} draggable={false} />
                                  ) : null}
                                  <span style={styles.npcZoomSpecialTokenCheckboxText}>{opt.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ) : null;
                    const protagonistHint =
                      boardSpecialTokenSelectOptions.length > 0
                      && !isMastermindView
                      && zoomNpcDefinesAssignableTok ? (
                        <div style={styles.npcZoomSpecialTokenProtagonistHint}>
                          特殊 token 的放置仅剧作家可在「自带该标记」的角色放大图中操作。
                        </div>
                      ) : null;
                    return (
                      <>
                        {readOnlyAccepted}
                        {assignUi}
                        {protagonistHint}
                      </>
                    );
                  })()}
                </>
              );
            })()}
            {isMastermindView ? (
              <>
                <label htmlFor="mastermind-card-select" style={styles.npcZoomControlLabel}>
                  剧作家卡牌
                </label>
                <select
                  id="mastermind-card-select"
                  value={npcZoomPlacement ? selectedMastermindCardByNpcId[npcZoomPlacement.npcId] ?? '' : ''}
                  onChange={(e) => {
                    const npcId = npcZoomPlacement?.npcId;
                    if (!npcId) return;
                    const nextCardId = e.target.value;
                    const currentCardId = selectedMastermindCardByNpcId[npcId] ?? '';
                    applyMastermindCardSelection(nextCardId, currentCardId, (cardId) => {
                      moves.setUiMastermindCardByNpcId?.({ npcId, cardId: cardId || null });
                    });
                  }}
                  style={{
                    ...styles.npcZoomSelect,
                    ...((!isActionCardPhaseActive
                      || (mastermindReachedDailyLimit && !((npcZoomPlacement && selectedMastermindCardByNpcId[npcZoomPlacement.npcId]) ?? '')))
                      ? styles.controlDisabled
                      : {}),
                  }}
                  disabled={
                    !isActionCardPhaseActive
                    || (mastermindReachedDailyLimit && !((npcZoomPlacement && selectedMastermindCardByNpcId[npcZoomPlacement.npcId]) ?? ''))
                  }
                >
                  <option value="">请选择剧作家卡牌</option>
                                  {mastermindSelectableHandDefs.map((card) => {
                    const currentCardId = npcZoomPlacement ? selectedMastermindCardByNpcId[npcZoomPlacement.npcId] ?? '' : '';
                    const used = isMastermindCardUsed(card.id, card.oncePerLoop);
                    const disabled = (used && currentCardId !== card.id)
                      || (mastermindReachedDailyLimit && currentCardId !== card.id);
                    return (
                      <option key={card.id} value={card.id} disabled={disabled}>
                        {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                      </option>
                    );
                  })}
                </select>
              </>
            ) : null}
            {protagonistExtraTokensUiEnabled && isMastermindView && npcZoomPlacement
              ? (() => {
                  const pecId = npcZoomPlacement.npcId;
                  const extraIdsLive = uiNpcProtagonistExtraTokenIdsByNpcId[pecId] ?? [];
                  if (!extraIdsLive.length) return null;
                  return (
                    <div style={{ marginTop: 10, marginBottom: 0, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(30,27,54,0.35)' }}>
                      <div style={{ ...styles.npcZoomControlLabel, marginTop: 0 }}>主人公标记的额外 token（只读）</div>
                      <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
                        {extraIdsLive.map(
                          (id) => PROTAGONIST_EXTRA_TOKEN_DEFS.find((d) => d.id === id)?.label ?? id,
                        ).join('、')}
                      </div>
                    </div>
                  );
                })()
              : null}
            {isProtagonistView && currentProtagonistId ? (
              <>
                <label htmlFor="protagonist-card-select" style={styles.npcZoomControlLabel}>
                  主人公卡牌
                </label>
                {(() => {
                  const currentCardId = selectedProtagonistCardByNpcByPid[currentProtagonistId]?.[npcZoomPlacement.npcId] ?? '';
                  const selectDisabledBySinglePlayLimit = protagonistSelectedCardCountForPid(currentProtagonistId) >= 1 && !currentCardId;
                  const targetLockedByOther = isNpcSelectedByOtherProtagonist(currentProtagonistId, npcZoomPlacement.npcId);
                  return (
                    <select
                      id="protagonist-card-select"
                      value={currentCardId}
                      onChange={(e) => {
                        const nextCardId = e.target.value;
                        applyProtagonistCardSelection(
                          currentProtagonistId,
                          nextCardId,
                          currentCardId,
                          (cardId) => {
                            moves.setUiProtagonistCardByNpc?.({
                              pid: currentProtagonistId,
                              npcId: npcZoomPlacement.npcId,
                              cardId: cardId || null,
                            });
                          },
                          targetLockedByOther,
                        );
                      }}
                      style={{
                        ...styles.npcZoomSelect,
                        ...((!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther)
                          ? styles.controlDisabled
                          : {}),
                      }}
                      disabled={!isActionCardPhaseActive || selectDisabledBySinglePlayLimit || targetLockedByOther}
                    >
                      <option value="">请选择主人公卡牌</option>
                                    {protagonistSelectableHandDefs.map((card) => {
                        const used = isProtagonistCardUsedByPid(currentProtagonistId, card.id, card.oncePerLoop);
                        const disabled = (used && currentCardId !== card.id)
                          || ((protagonistSelectedCardCountForPid(currentProtagonistId) >= 1) && currentCardId !== card.id)
                          || (targetLockedByOther && currentCardId !== card.id);
                        return (
                          <option key={card.id} value={card.id} disabled={disabled}>
                            {`${card.name}${card.oncePerLoop ? '【轮限】' : ''}${used ? '【已使用】' : ''}`}
                          </option>
                        );
                      })}
                    </select>
                  );
                })()}
                {protagonistExtraTokensUiEnabled ? (
                  <>
                    <div style={styles.npcZoomControlLabel}>主人公额外标记（多选）</div>
                    {(() => {
                      const nid = npcZoomPlacement.npcId;
                      const selectedSet = new Set(uiNpcProtagonistExtraTokenIdsByNpcId[nid] ?? []);
                      return (
                        <div style={styles.npcZoomSpecialTokenCheckboxWrap} role="group" aria-label="主人公额外标记">
                          {PROTAGONIST_EXTRA_TOKEN_DEFS.map((d) => {
                            const thumb = resolveTokenImageUrl(d.imagePath);
                            const isOn = selectedSet.has(d.id);
                            return (
                              <label key={d.id} htmlFor={`prot-extra-tok-${nid}-${d.id}`} style={styles.npcZoomSpecialTokenCheckboxLabel}>
                                <input
                                  id={`prot-extra-tok-${nid}-${d.id}`}
                                  type="checkbox"
                                  checked={isOn}
                                  onChange={(e) => {
                                    const next = new Set(selectedSet);
                                    if (e.target.checked) next.add(d.id);
                                    else next.delete(d.id);
                                    moves.setUiNpcProtagonistExtraTokens?.({
                                      npcId: nid,
                                      tokenIds: normalizeProtagonistExtraTokenIds([...next]),
                                    });
                                  }}
                                />
                                {thumb ? (
                                  <img src={thumb} alt="" style={styles.npcZoomSpecialTokenThumb} draggable={false} />
                                ) : null}
                                <span style={styles.npcZoomSpecialTokenCheckboxText}>{d.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </>
                ) : null}
              </>
            ) : null}
            {npcZoomPlacement.imgUrl ? (
              <div style={styles.npcZoomPortraitStage}>
                <img
                  src={npcZoomPlacement.imgUrl}
                  alt={npcZoomPlacement.name}
                  style={styles.npcZoomImg}
                  draggable={false}
                />
                {showMastermindExCardFacesOnBoard ? (() => {
                  const exZoom = (uiMastermindExCardByNpcId[npcZoomPlacement.npcId] ?? '').trim();
                  const exSrc = exZoom ? MASTERMIND_EX_CARD_FACE_BY_ID[exZoom] : '';
                  return exSrc ? (
                    <img
                      src={exSrc}
                      alt=""
                      style={{
                        ...styles.boardNpcChipProtagonistExCard,
                        width: '38%',
                      }}
                      draggable={false}
                    />
                  ) : null;
                })() : null}
                {(() => {
                  const extraZoom = protagonistExtraTokensUiEnabled
                    ? getProtagonistExtraTokenUrlsForNpc(npcZoomPlacement.npcId)
                    : [];
                  const specZoom = getDisplayedSpecialTokenUrlsForNpc(npcZoomPlacement.npcId);
                  const anyTok = extraZoom.length + specZoom.length;
                  if (anyTok === 0) return null;
                  return (
                    <div style={styles.npcZoomPortraitTokenCluster} aria-label="叠放标记">
                      {extraZoom.length > 0 ? (
                        <div style={styles.npcZoomPortraitProtagonistExtras}>
                          {extraZoom.map((u, idx) => (
                            <img
                              key={`pex-${idx}`}
                              src={u}
                              alt=""
                              style={styles.npcZoomProtagonistExtraPortraitImg}
                              draggable={false}
                            />
                          ))}
                        </div>
                      ) : null}
                      {specZoom.length > 0 ? (
                        <div style={styles.npcZoomPortraitSpecialTokens}>
                          {specZoom.map((u, idx) => (
                            <img
                              key={`st-${idx}`}
                              src={u}
                              alt=""
                              style={styles.npcZoomSpecialTokenOnPortraitImg}
                              draggable={false}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            ) : null}
            {(() => {
              const exU = protagonistExtraTokensUiEnabled
                ? getProtagonistExtraTokenUrlsForNpc(npcZoomPlacement.npcId)
                : [];
              const spU = getDisplayedSpecialTokenUrlsForNpc(npcZoomPlacement.npcId);
              const allPreview = [...exU, ...spU];
              if (npcZoomPlacement.imgUrl || allPreview.length === 0) return null;
              return (
                <div style={styles.npcZoomSpecialTokenPreviewRow} aria-label="叠放标记">
                  {allPreview.map((u, idx) => (
                    <img
                      key={`${u}-${idx}`}
                      src={u}
                      alt=""
                      style={styles.npcZoomSpecialTokenPreviewImg}
                      draggable={false}
                    />
                  ))}
                </div>
              );
            })()}
            <div id="npc-zoom-title" style={styles.npcZoomTitle}>
              {npcZoomPlacement.name}
            </div>
            {(() => {
              const protagonistZoomSummary =
                !isMastermindView && selectedScenarioData
                  ? protagonistCastRoleSummary(
                      selectedScenarioData,
                      protagonistSheetDraft,
                      npcZoomPlacement.npcId,
                      roleDisplayName,
                    )
                  : '';
              if (isMastermindView) {
                const label = mastermindRoleLabels(npcZoomPlacement, roleDisplayName);
                return label ? <div style={styles.npcZoomRole}>{label}</div> : null;
              }
              return protagonistZoomSummary ? (
                <div style={styles.npcZoomRole}>{protagonistZoomSummary}</div>
              ) : null;
            })()}
            {zoomNpcDef ? (
              <div style={styles.npcZoomCardInfo}>
                <div style={styles.npcZoomCardInfoTitle}>卡牌信息</div>
                {zoomNpcDef.roleType?.length ? (
                  <div style={styles.npcZoomCardInfoLine}>
                    <span style={styles.npcZoomCardInfoLabel}>类型</span>
                    <span>{zoomNpcDef.roleType.join('、')}</span>
                  </div>
                ) : null}
                <div style={styles.npcZoomCardInfoLine}>
                  <span style={styles.npcZoomCardInfoLabel}>不安限度</span>
                  <span>{zoomNpcDef.instability}</span>
                </div>
                {zoomNpcDef.initialArea?.length ? (
                  <div style={styles.npcZoomCardInfoLine}>
                    <span style={styles.npcZoomCardInfoLabel}>初始区域</span>
                    <span>
                      {zoomNpcDef.initialArea
                        .map((a) => AREA_DISPLAY_NAME[a] || String(a))
                        .join('、')}
                    </span>
                  </div>
                ) : null}
                {zoomNpcDef.thoughts?.trim() ? (
                  <div style={styles.npcZoomCardInfoLine}>
                    <span style={styles.npcZoomCardInfoLabel}>感想</span>
                    <span>{zoomNpcDef.thoughts.trim()}</span>
                  </div>
                ) : null}
                {zoomNpcDef.features && zoomNpcDef.features.length > 0 ? (
                  <div style={styles.npcZoomCardInfoLine}>
                    <span style={styles.npcZoomCardInfoLabel}>角色特性</span>
                    <span style={styles.npcZoomFeaturesText}>
                      {zoomNpcDef.features.map((t) => t.trim()).filter(Boolean).join('\n')}
                    </span>
                  </div>
                ) : null}
                {Array.isArray(zoomNpcDef.abilitys) && zoomNpcDef.abilitys.length > 0 ? (
                  <ul style={styles.npcZoomAbilityList}>
                    {zoomNpcDef.abilitys.map((ab) => (
                      <li key={ab.id} style={styles.npcZoomAbilityItem}>
                        <div style={styles.npcZoomAbilityDesc}>{ab.abilityDescription}</div>
                        <div style={styles.npcZoomAbilityMeta}>
                          需友好 {ab.friendlyPoints}
                          {Array.isArray(ab.excuteTime) && ab.excuteTime.length > 0
                            ? ` · ${ab.excuteTime.join('、')}`
                            : ''}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
          );
        })()
      )}
    </div>
  );
};

const TragedyLocalBoardgameClient = Client({
  game: TragedyLooperGame,
  board: Board,
  numPlayers: TRAGEDY_LOOPER_NUM_PLAYERS,
  multiplayer: Local(),
});

/** 注入剧本「每轮回天数」等 setupData，须放在 GameSetupProvider 内 */
export default function TragedyClient() {
  const { selectedScenarioData, selectedRoundCount, multiplayer, localSeatPlayerId } = useGameSetup();
  const daysPerLoop = dayCountFromSetup(selectedScenarioData);
  const maxLoops = maxLoopCountFromSetup(selectedRoundCount, selectedScenarioData);

  const OnlineBoardgameClient = useMemo(() => {
    if (!multiplayer?.serverUrl) return null;
    const server = multiplayer.serverUrl.replace(/\/+$/, '');
    return Client({
      game: TragedyLooperGame,
      board: Board,
      numPlayers: TRAGEDY_LOOPER_NUM_PLAYERS,
      debug: false,
      multiplayer: SocketIO({ server }),
    });
  }, [multiplayer]);

  if (multiplayer && OnlineBoardgameClient) {
    const OC = OnlineBoardgameClient;
    return (
      <OC
        matchID={multiplayer.matchID}
        playerID={multiplayer.playerID}
        credentials={multiplayer.credentials}
      />
    );
  }

  return (
    <TragedyLocalBoardgameClient
      playerID={localSeatPlayerId}
      setupData={{ daysPerLoop, maxLoops }}
    />
  );
}

// 样式
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'sans-serif',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px clamp(12px, 2vw, 28px)',
    backgroundColor: 'transparent',
    minHeight: '100vh',
    color: '#fff',
    boxSizing: 'border-box',
  },
  playerStrip: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '5px',
    marginBottom: '6px',
  },
  /** 角色座位条：正方形，边长 = 原长方形高度 */
  playerChip: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: `${PLAYER_CHIP_SIDE_PX}px`,
    height: `${PLAYER_CHIP_SIDE_PX}px`,
    padding: '4px 5px',
    borderRadius: '4px',
    border: '1px solid transparent',
    fontSize: '16px',
    lineHeight: 1.25,
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  playerChipMastermind: {
    backgroundColor: 'rgba(83, 52, 131, 0.95)',
    borderColor: '#a797ff',
  },
  playerChipProtagonist: {
    backgroundColor: 'rgba(15, 52, 96, 0.95)',
    borderColor: '#4ecca3',
  },
  playerChipActive: {
    boxShadow: '0 0 0 1px #e94560, 0 0 6px rgba(233, 69, 96, 0.45)',
  },
  playerChipYou: {
    outline: '1px solid #fce38a',
    outlineOffset: '1px',
  },
  playerChipClickable: {
    cursor: 'pointer',
  },
  protagonistADeclarationOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  protagonistADeclarationModal: {
    backgroundColor: 'rgba(18, 26, 44, 0.98)',
    border: '1px solid rgba(255, 248, 220, 0.3)',
    borderRadius: '10px',
    padding: '18px 20px',
    minWidth: '280px',
    maxWidth: '80vw',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
    textAlign: 'center' as const,
  },
  protagonistADeclarationText: {
    color: '#ffe9a8',
    fontSize: 'clamp(16px, 1.5vw, 22px)',
    fontWeight: 700,
    marginBottom: '12px',
  },
  protagonistADeclarationCloseBtn: {
    border: '1px solid rgba(255, 248, 220, 0.35)',
    borderRadius: '6px',
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  playerChipText: {
    position: 'relative' as const,
    zIndex: 1,
    textShadow: '0 1px 3px rgba(0,0,0,0.95)',
  },
  playerChipId: {
    fontSize: '14px',
    opacity: 0.95,
    marginBottom: '2px',
  },
  playerChipName: {
    fontWeight: 700,
  },
  playerChipOnline: {
    marginTop: '2px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#86efac',
    letterSpacing: '0.02em',
  },
  playerChipBadge: {
    marginTop: '3px',
    fontSize: '14px',
    color: '#fce38a',
  },
  playerChipCaptain: {
    marginTop: '2px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#93c5fd',
    letterSpacing: '0.02em',
  },
  /** 相对视口全宽，使内联左中右可在浏览器水平居中 */
  boardRowOuter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    height: MIDDLE_MAX_HEIGHT,
    maxHeight: MIDDLE_MAX_HEIGHT,
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
    marginBottom: '20px',
    overflowX: 'auto',
    boxSizing: 'border-box' as const,
  },
  currentHandRowOuter: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '10px',
    margin: '10px 0 16px',
    flexWrap: 'wrap' as const,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
  },
  extraHandCardsPanel: {
    flex: '0 1 240px',
    minWidth: '200px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 248, 220, 0.24)',
    backgroundColor: 'rgba(12, 19, 34, 0.82)',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  },
  extraHandCardsTitle: {
    color: '#ffe8a3',
    fontSize: 'clamp(12px, 0.95vw, 15px)',
    fontWeight: 700,
    marginBottom: '6px',
  },
  extraHandCardsHint: {
    color: '#94a3b8',
    fontSize: 'clamp(9px, 0.72vw, 11px)',
    lineHeight: 1.35,
    marginBottom: '10px',
  },
  extraHandCardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(30, 41, 59, 0.58)',
    padding: '6px 8px',
    marginBottom: '8px',
  },
  extraHandCardThumbWrap: {
    position: 'relative' as const,
    flexShrink: 0,
  },
  extraHandCardRuleHintBtn: {
    position: 'absolute' as const,
    top: '1px',
    right: '1px',
    width: '18px',
    height: '18px',
    padding: 0,
    borderRadius: '50%',
    border: '1px solid rgba(252, 227, 138, 0.85)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    color: '#fce38a',
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: '16px',
    cursor: 'pointer',
    zIndex: 2,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.45)',
  },
  extraHandCardThumb: {
    width: '44px',
    height: 'auto',
    borderRadius: '4px',
    border: '1px solid rgba(255, 248, 220, 0.28)',
    flexShrink: 0,
    objectFit: 'contain' as const,
    backgroundColor: 'rgba(8, 12, 22, 0.75)',
  },
  extraHandCardName: {
    color: '#dce9ff',
    fontSize: 'clamp(10px, 0.78vw, 12px)',
    fontWeight: 600,
    flex: 1,
    minWidth: 0,
  },
  extraHandCardAddBtn: {
    border: '1px solid rgba(167, 139, 250, 0.45)',
    borderRadius: '4px',
    backgroundColor: 'rgba(72, 38, 120, 0.82)',
    color: '#f2ebff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    padding: '4px 10px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  currentHandPanelBesideExtras: {
    flex: '1 1 320px',
    margin: 0,
    minWidth: 0,
  },
  currentHandPanel: {
    flex: '1 1 100%',
    minWidth: 0,
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 248, 220, 0.24)',
    backgroundColor: 'rgba(12, 19, 34, 0.82)',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  },
  currentHandTitle: {
    color: '#ffe8a3',
    fontSize: 'clamp(13px, 1vw, 16px)',
    fontWeight: 700,
    marginBottom: '8px',
  },
  currentHandMastermindExSection: {
    marginBottom: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(56, 189, 248, 0.38)',
    backgroundColor: 'rgba(12, 30, 46, 0.48)',
    boxSizing: 'border-box' as const,
  },
  currentHandMastermindExHeading: {
    color: '#bae6fd',
    fontSize: 'clamp(10px, 0.82vw, 12px)',
    fontWeight: 600,
    marginBottom: '6px',
    lineHeight: 1.35,
  },
  currentHandMastermindExStrip: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    alignItems: 'center',
  },
  currentHandMastermindExThumbBtn: {
    padding: 0,
    border: '2px solid rgba(56, 189, 248, 0.25)',
    borderRadius: '6px',
    backgroundColor: 'rgba(8, 16, 28, 0.75)',
    cursor: 'pointer',
    lineHeight: 0,
  },
  currentHandMastermindExThumbBtnActive: {
    borderColor: 'rgba(56, 189, 248, 0.95)',
    boxShadow: '0 0 12px rgba(56, 189, 248, 0.45)',
  },
  currentHandMastermindExThumbStill: {
    padding: 0,
    border: '2px solid rgba(56, 189, 248, 0.2)',
    borderRadius: '6px',
    backgroundColor: 'rgba(8, 16, 28, 0.75)',
    lineHeight: 0,
  },
  currentHandMastermindExThumbImg: {
    display: 'block',
    width: '52px',
    height: 'auto',
    borderRadius: '4px',
  },
  currentHandList: {
    display: 'flex',
    flexWrap: 'nowrap' as const,
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    gap: '6px',
    paddingBottom: '2px',
  },
  currentHandCard: {
    flex: '0 0 180px',
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(30, 41, 59, 0.58)',
    padding: '6px',
    minHeight: '64px',
    boxSizing: 'border-box' as const,
  },
  currentHandCardSelected: {
    borderColor: 'rgba(59, 130, 246, 0.85)',
    boxShadow: 'inset 0 0 0 1px rgba(147, 197, 253, 0.45)',
  },
  currentHandCardUsedMask: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(60, 64, 72, 0.58)',
    color: '#f6f7fb',
    fontSize: 'clamp(12px, 1vw, 15px)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
    pointerEvents: 'none' as const,
  },
  currentHandCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    color: '#f8f1cf',
    fontWeight: 700,
    fontSize: 'clamp(10px, 0.82vw, 12px)',
    marginBottom: '3px',
  },
  currentHandCardImageWrap: {
    position: 'relative' as const,
    width: '100%',
    marginBottom: '4px',
  },
  currentHandCardRuleHintBtn: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    width: '22px',
    height: '22px',
    padding: 0,
    borderRadius: '50%',
    border: '1px solid rgba(252, 227, 138, 0.85)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    color: '#fce38a',
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: '20px',
    cursor: 'pointer',
    zIndex: 3,
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.45)',
  },
  handCardSpecialRuleBackdrop: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 10050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    boxSizing: 'border-box' as const,
  },
  handCardSpecialRulePanel: {
    width: '100%',
    maxWidth: '440px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 248, 220, 0.38)',
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
    padding: '20px 22px',
    boxSizing: 'border-box' as const,
  },
  handCardSpecialRuleTitle: {
    margin: '0 0 12px',
    color: '#ffe8a3',
    fontSize: '16px',
    fontWeight: 700,
  },
  handCardSpecialRuleText: {
    margin: '0 0 18px',
    color: '#e2e8f0',
    fontSize: '15px',
    lineHeight: 1.55,
  },
  handCardSpecialRuleCloseBtn: {
    display: 'block',
    marginLeft: 'auto',
    border: '1px solid rgba(167, 139, 250, 0.5)',
    borderRadius: '6px',
    backgroundColor: 'rgba(72, 38, 120, 0.88)',
    color: '#f2ebff',
    fontSize: '14px',
    padding: '8px 20px',
    cursor: 'pointer',
  },
  currentHandCardImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '6px',
    border: '1px solid rgba(255, 248, 220, 0.28)',
    objectFit: 'contain' as const,
    backgroundColor: 'rgba(8, 12, 22, 0.75)',
    display: 'block',
  },
  currentHandCardTags: {
    color: '#b7d5ff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    whiteSpace: 'nowrap' as const,
  },
  currentHandCardBody: {
    color: '#d8e6ff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    lineHeight: 1.28,
  },
  currentHandDiscardBtn: {
    width: '100%',
    marginBottom: '4px',
    border: '1px solid rgba(255, 198, 198, 0.45)',
    borderRadius: '4px',
    backgroundColor: 'rgba(110, 24, 33, 0.85)',
    color: '#ffecec',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    lineHeight: 1.2,
    padding: '3px 6px',
    cursor: 'pointer',
  },
  currentHandEmpty: {
    color: '#b9c8ee',
    fontSize: 'clamp(11px, 0.9vw, 13px)',
  },
  currentHandDiscardTitle: {
    marginTop: '8px',
    marginBottom: '6px',
    color: '#f0d6d6',
    fontSize: 'clamp(11px, 0.9vw, 13px)',
    fontWeight: 700,
  },
  currentHandDiscardList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    maxHeight: '170px',
    overflowY: 'auto' as const,
  },
  currentHandDiscardItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(30, 41, 59, 0.58)',
    padding: '6px 8px',
  },
  currentHandDiscardName: {
    color: '#dce9ff',
    fontSize: 'clamp(10px, 0.8vw, 12px)',
    fontWeight: 600,
  },
  currentHandDiscardRestoreBtn: {
    border: '1px solid rgba(167, 139, 250, 0.45)',
    borderRadius: '4px',
    backgroundColor: 'rgba(72, 38, 120, 0.82)',
    color: '#f2ebff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    lineHeight: 1.2,
    padding: '3px 8px',
    cursor: 'pointer',
  },
  currentHandDiscardEmpty: {
    color: '#b9c8ee',
    fontSize: 'clamp(10px, 0.82vw, 12px)',
    border: '1px dashed rgba(255, 248, 220, 0.26)',
    borderRadius: '6px',
    padding: '6px 8px',
    backgroundColor: 'rgba(10, 18, 36, 0.4)',
  },
  /** 左 + 中 + 右 同一行、无间隙，宽度随内容 */
  boardRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 0,
    height: '100%',
    maxHeight: '100%',
    width: 'max-content',
    maxWidth: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
  },
  leftPanel: {
    alignSelf: 'stretch',
    aspectRatio: `${DATA_PANEL_IMG_WIDTH} / ${DATA_PANEL_IMG_HEIGHT}`,
    flex: '0 0 auto',
    height: '100%',
    maxHeight: '100%',
    minHeight: 0,
    minWidth: 0,
    margin: 0,
    padding: 0,
    position: 'relative' as const,
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
    background: 'linear-gradient(180deg, rgba(18, 26, 44, 0.94) 0%, rgba(11, 18, 34, 0.94) 100%)',
    border: '1px solid rgba(255, 248, 220, 0.28)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.42)',
  },
  leftTextPanel: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    gap: '10px',
    padding: '10px',
    boxSizing: 'border-box' as const,
    color: '#f2efe6',
    fontSize: 'clamp(10px, 0.9vw, 13px)',
    lineHeight: 1.4,
    overflowY: 'auto' as const,
    scrollbarWidth: 'thin' as const,
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 248, 220, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    minHeight: 0,
  },
  leftSectionTitle: {
    fontSize: 'clamp(11px, 1vw, 14px)',
    fontWeight: 700,
    color: '#ffe8a3',
    borderBottom: '1px solid rgba(255, 248, 220, 0.24)',
    paddingBottom: '4px',
  },
  leftSectionTitleWithInlineControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  leftTextRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3px',
  },
  leftTextLabel: {
    fontWeight: 700,
    letterSpacing: '0.03em',
    color: '#f7f0ca',
  },
  leftTextValues: {
    wordBreak: 'break-word' as const,
    color: '#dbe6ff',
    fontSize: 'clamp(9px, 0.84vw, 12px)',
  },
  leftTagList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '5px',
  },
  leftTag: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30px',
    height: '22px',
    padding: '0 7px',
    borderRadius: '999px',
    fontSize: 'clamp(10px, 0.84vw, 12px)',
    fontWeight: 700,
    border: '1px solid transparent',
    boxSizing: 'border-box' as const,
  },
  leftTagButton: {
    cursor: 'pointer',
    appearance: 'none' as const,
    background: 'none',
    outline: 'none',
  },
  leftTagBlue: {
    color: '#eaf4ff',
    borderColor: 'rgba(147, 197, 253, 0.85)',
    backgroundColor: 'rgba(37, 99, 235, 0.65)',
  },
  leftTagGreen: {
    color: '#e6ffef',
    borderColor: 'rgba(110, 231, 183, 0.8)',
    backgroundColor: 'rgba(6, 95, 70, 0.65)',
  },
  leftTagGray: {
    color: '#d7dfef',
    borderColor: 'rgba(148, 163, 184, 0.7)',
    backgroundColor: 'rgba(71, 85, 105, 0.55)',
  },
  leftTagRed: {
    color: '#ffe3e3',
    borderColor: 'rgba(248, 113, 113, 0.8)',
    backgroundColor: 'rgba(153, 27, 27, 0.62)',
  },
  leftTagSelected: {
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.5)',
  },
  leftTagStrikethrough: {
    textDecoration: 'line-through',
    textDecorationThickness: '1.5px',
  },
  leftIncidentDetail: {
    marginTop: '2px',
    fontSize: 'clamp(9px, 0.84vw, 12px)',
    color: '#f8f3d0',
    lineHeight: 1.35,
    wordBreak: 'break-word' as const,
  },
  leftExControlRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  leftExTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  leftExSlotHelpBtn: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 248, 220, 0.4)',
    backgroundColor: 'rgba(25, 39, 68, 0.95)',
    color: '#f2efe6',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    padding: 0,
    flexShrink: 0,
  },
  leftExSlotDescBox: {
    marginTop: '2px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 248, 220, 0.28)',
    backgroundColor: 'rgba(12, 20, 38, 0.88)',
    color: '#e7efff',
    fontSize: 'clamp(9px, 0.82vw, 11px)',
    lineHeight: 1.45,
    wordBreak: 'break-word' as const,
  },
  leftFarawayConspiracyRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  leftFarawayConspiracyLabel: {
    color: '#f7f0ca',
    fontSize: 'clamp(10px, 0.86vw, 12px)',
    fontWeight: 700,
    minWidth: '28px',
  },
  leftExButton: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    backgroundColor: 'rgba(25, 39, 68, 0.9)',
    color: '#f2efe6',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: 0,
  },
  leftExInput: {
    width: '40px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    backgroundColor: 'rgba(12, 20, 38, 0.9)',
    color: '#f2efe6',
    textAlign: 'center' as const,
    fontSize: 'clamp(10px, 0.84vw, 12px)',
    padding: '0 4px',
    boxSizing: 'border-box' as const,
  },
  leftPlaceholder: {
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    border: '1px dashed rgba(255, 248, 220, 0.28)',
    color: '#b9c8ee',
    fontSize: 'clamp(10px, 0.88vw, 12px)',
    backgroundColor: 'rgba(10, 18, 36, 0.4)',
  },
  leftDiscardList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    maxHeight: '170px',
    overflowY: 'auto' as const,
  },
  leftDiscardSubTitle: {
    color: '#f7f0ca',
    fontSize: 'clamp(10px, 0.86vw, 12px)',
    fontWeight: 700,
    marginTop: '2px',
    marginBottom: '2px',
  },
  leftDiscardItem: {
    flex: 1,
    textAlign: 'left' as const,
    border: '1px solid rgba(255, 248, 220, 0.26)',
    borderRadius: '6px',
    backgroundColor: 'rgba(14, 24, 44, 0.65)',
    color: '#e7efff',
    padding: '6px 8px',
    fontSize: 'clamp(10px, 0.84vw, 12px)',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
  },
  leftFarawayNpcButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  leftFarawayTokenRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
  },
  leftFarawayTokenCellLeftAlign: {
    textAlign: 'left' as const,
  },
  leftFarawayUnrestCell: {
    flex: '0 0 auto',
    minWidth: '42px',
    overflow: 'visible',
    textOverflow: 'clip',
  },
  leftFarawayItem: {
    flexDirection: 'column' as const,
    alignItems: 'stretch',
    gap: '6px',
  },
  leftFarawayMainRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: '100%',
  },
  leftFarawayCardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap' as const,
    width: '100%',
  },
  /** 远方：EX 与特殊 token 文案同一行（可换行折行） */
  leftFarawayExAndTokensRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '6px',
    marginBottom: '4px',
    paddingLeft: 'clamp(2px, 0.6vw, 8px)',
    boxSizing: 'border-box' as const,
  },
  leftFarawayExName: {
    display: 'inline-block',
    fontSize: 'clamp(8px, 0.72vw, 10px)',
    fontWeight: 600,
    color: '#7dd3fc',
    padding: '2px 6px',
    borderRadius: '6px',
    border: '1px solid rgba(56, 189, 248, 0.45)',
    backgroundColor: 'rgba(14, 36, 54, 0.75)',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.35)',
    letterSpacing: '0.02em',
    flexShrink: 0,
  },
  leftFarawaySpecialTokenNameChip: {
    fontSize: 'clamp(9px, 0.82vw, 12px)',
    fontWeight: 600,
    color: '#e9d5ff',
    lineHeight: 1.4,
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.75)',
  },
  leftFarawayCardSelect: {
    flex: '1 1 0',
    minWidth: '96px',
    backgroundColor: 'rgba(18, 24, 36, 0.88)',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: 'clamp(8px, 0.8vw, 11px)',
    lineHeight: 1.2,
    boxSizing: 'border-box' as const,
  },
  leftHandDiscardItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(30, 41, 59, 0.58)',
    padding: '6px 8px',
  },
  leftUnappearedItem: {
    flexDirection: 'column' as const,
    alignItems: 'stretch',
    gap: '4px',
  },
  leftUnappearedHint: {
    color: '#cbd5e1',
    fontSize: 'clamp(9px, 0.76vw, 11px)',
    lineHeight: 1.3,
    padding: '0 2px',
  },
  leftUnappearedSpawnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
  },
  leftUnappearedSpawnSelect: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(18, 24, 36, 0.88)',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: 'clamp(8px, 0.8vw, 11px)',
    lineHeight: 1.2,
    boxSizing: 'border-box' as const,
  },
  leftUnappearedSpawnBtn: {
    border: '1px solid rgba(167, 139, 250, 0.45)',
    borderRadius: '4px',
    backgroundColor: 'rgba(72, 38, 120, 0.82)',
    color: '#f2ebff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    lineHeight: 1.2,
    padding: '3px 10px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  leftHandDiscardName: {
    color: '#dce9ff',
    fontSize: 'clamp(10px, 0.8vw, 12px)',
    fontWeight: 600,
  },
  leftHandDiscardRestoreBtn: {
    border: '1px solid rgba(167, 139, 250, 0.45)',
    borderRadius: '4px',
    backgroundColor: 'rgba(72, 38, 120, 0.82)',
    color: '#f2ebff',
    fontSize: 'clamp(9px, 0.74vw, 11px)',
    lineHeight: 1.2,
    padding: '3px 8px',
    cursor: 'pointer',
  },
  middlePanel: {
    // 与左右栏同高，宽度由 1519:1076 比例推出
    flex: '0 0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    gap: 0,
    height: '100%',
    aspectRatio: `${AREA_IMAGE_WIDTH} / ${AREA_IMAGE_HEIGHT}`,
    width: 'auto',
    boxSizing: 'border-box' as const,
  },
  quadrant: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    fontSize: 'clamp(18px, 2.2vw, 26px)',
    borderRadius: 0,
    overflow: 'visible',
    minHeight: 0,
    position: 'relative' as const,
    /** 供立绘使用 cqh / cqw：一块版图格的高、宽 */
    containerType: 'size' as const,
  },
  /** 叠在四格版图顶部、横向居中（区域上的特殊 token） */
  quadrantAreaSpecialTokens: {
    position: 'absolute' as const,
    top: 'clamp(6px, 1vw, 12px)',
    left: 0,
    right: 0,
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    paddingLeft: 'clamp(6px, 1vw, 12px)',
    paddingRight: 'clamp(6px, 1vw, 12px)',
    boxSizing: 'border-box' as const,
    zIndex: 5,
    pointerEvents: 'none' as const,
  },
  quadrantAreaSpecialTokenImg: {
    width: 'clamp(32px, 4.4cqh, 52px)',
    height: 'clamp(32px, 4.4cqh, 52px)',
    objectFit: 'contain' as const,
    filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85))',
  },
  quadrantStack: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    minHeight: 0,
    boxSizing: 'border-box' as const,
    padding: 'clamp(4px, 1vw, 10px)',
  },
  quadrantAreaHeader: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '3px',
    paddingBottom: '4px',
  },
  quadrantAreaControlRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '2px',
  },
  quadrantAreaCardSelect: {
    width: '96px',
    backgroundColor: 'rgba(18, 24, 36, 0.88)',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: 'clamp(8px, 0.8vw, 11px)',
    lineHeight: 1.2,
    boxSizing: 'border-box' as const,
  },
  quadrantBoardConspiracy: {
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    borderRadius: '6px',
    backgroundColor: 'rgba(10, 16, 28, 0.55)',
    border: '1px solid rgba(255, 248, 220, 0.25)',
    fontSize: 'clamp(8px, 0.8vw, 11px)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums' as const,
    color: '#fce38a',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)',
    lineHeight: 1.2,
  },
  quadrantConspiracyButton: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 248, 220, 0.4)',
    backgroundColor: 'rgba(16, 28, 52, 0.9)',
    color: '#f2efe6',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
    fontSize: '13px',
  },
  quadrantConspiracyValue: {
    minWidth: '18px',
    textAlign: 'center' as const,
    color: '#fff4c2',
  },
  /** 宽高由每条象限内 `areaNpcCardSize.boardActionCardImgWidth` 注入，与 NPC 立绘角标牌（42% 列宽）一致 */
  quadrantMastermindCard: {
    position: 'absolute' as const,
    left: '8px',
    bottom: '8px',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '5px',
    boxShadow: BOARD_PLAYED_CARD_SHADOW_QUADRANT,
    zIndex: 3,
    pointerEvents: 'none' as const,
  },
  quadrantProtagonistCard: {
    position: 'absolute' as const,
    right: '8px',
    bottom: '8px',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '5px',
    boxShadow: BOARD_PLAYED_CARD_SHADOW_QUADRANT,
    zIndex: 3,
    pointerEvents: 'none' as const,
  },
  /** 版图格内 EX：叠于区域右上角（与正中特殊 token / 底部行动牌区分开） */
  quadrantProtagonistExCard: {
    position: 'absolute' as const,
    top: 'clamp(4px, 0.85vw, 10px)',
    right: 'clamp(4px, 0.85vw, 10px)',
    left: 'auto',
    bottom: 'auto',
    transform: 'none',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '5px',
    boxShadow: '0 2px 14px rgba(56, 189, 248, 0.35)',
    zIndex: 6,
    opacity: 0.95,
    pointerEvents: 'none' as const,
  },
  quadrantChips: {
    position: 'relative' as const,
    zIndex: 8,
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 'clamp(2px, 0.28vw, 4px)',
    minHeight: 0,
    marginTop: 'auto',
    paddingLeft: 'clamp(4px, 0.6vw, 8px)',
    paddingRight: 'clamp(4px, 0.6vw, 8px)',
    paddingBottom: 'clamp(4px, 0.6vw, 8px)',
    boxSizing: 'border-box' as const,
  },
  boardNpcChip: {
    position: 'relative' as const,
    zIndex: 9,
    maxWidth: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(3px, 0.5vw, 6px) clamp(4px, 0.6vw, 8px)',
    paddingTop: 'clamp(18px, 2.2vw, 24px)',
    borderRadius: '6px',
    backgroundColor: 'rgba(15, 24, 46, 0.82)',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
    fontSize: 'clamp(10px, 1.15vw, 13px)',
    lineHeight: 1.2,
    textAlign: 'center' as const,
    color: '#f2efe6',
  },
  /** 外层仅包一层；卡面在 boardNpcChipArtPanel 内 */
  boardNpcChipWithArt: {
    // 固定三列，同时受版块高度约束，避免 6 张时卡片被挤裁
    width: 'min(calc(33.333% - clamp(3px, 0.45vw, 6px)), 32cqh)',
    maxWidth: 'min(calc(33.333% - clamp(3px, 0.45vw, 6px)), 32cqh)',
    minWidth: 0,
    padding: 0,
    paddingTop: 0,
    paddingLeft: 'clamp(4px, 0.6vw, 8px)',
    paddingBottom: 'clamp(4px, 0.6vw, 8px)',
    alignItems: 'stretch',
    overflow: 'visible',
    borderRadius: 0,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  boardNpcDiscardBtn: {
    position: 'absolute' as const,
    top: '2px',
    right: '2px',
    zIndex: 20,
    border: '1px solid rgba(255, 190, 190, 0.55)',
    borderRadius: '4px',
    backgroundColor: 'rgba(110, 24, 33, 0.9)',
    color: '#ffe9e9',
    fontSize: '10px',
    lineHeight: 1.1,
    padding: '2px 4px',
    cursor: 'pointer',
  },
  /** 指示物 + 卡图；点击整块放大 */
  boardNpcChipArtPanel: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'stretch',
    width: '100%',
    maxWidth: '100%',
    borderRadius: '6px',
    overflow: 'visible',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.55)',
    backgroundColor: 'transparent',
    cursor: 'zoom-in',
  },
  /** 无立绘占位：点击名称区放大 */
  boardNpcChipNoArtClick: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    minHeight: '36px',
    cursor: 'zoom-in',
    padding: '4px 6px',
    boxSizing: 'border-box' as const,
  },
  /** 指示物两行：叠在卡图上方 */
  boardNpcChipTokenStack: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 6,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'stretch',
    boxSizing: 'border-box' as const,
  },
  boardNpcChipTokenRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
    padding: '2px 6px 3px',
    fontSize: 'clamp(7px, 0.72vw, 9px)',
    lineHeight: 1.2,
    color: '#e8e4dc',
    borderBottom: '1px solid rgba(255, 248, 220, 0.1)',
    backgroundColor: 'rgba(8, 14, 28, 0.55)',
    fontVariantNumeric: 'tabular-nums' as const,
    boxSizing: 'border-box' as const,
  },
  boardNpcChipTokenRowExtra: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    padding: '1px 6px 2px',
    fontSize: 'clamp(6px, 0.65vw, 8px)',
    lineHeight: 1.2,
    color: '#e8e4dc',
    borderBottom: '1px solid rgba(255, 248, 220, 0.14)',
    backgroundColor: 'rgba(10, 18, 32, 0.62)',
    fontVariantNumeric: 'tabular-nums' as const,
    boxSizing: 'border-box' as const,
  },
  boardNpcChipTokenCell: {
    flex: '1 1 0',
    minWidth: 0,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 700,
  },
  boardNpcChipTokenFriendly: {
    color: '#ff78c8',
  },
  boardNpcChipTokenUnrest: {
    color: '#b084ff',
  },
  boardNpcChipTokenPlot: {
    color: '#ffd84d',
  },
  boardNpcChipTokenIcon: {
    width: '28px',
    height: '28px',
    objectFit: 'contain' as const,
    flexShrink: 0,
  },
  boardNpcChipTokenOverflow: {
    fontSize: 'clamp(10px, 1.1vw, 14px)',
    color: '#f2efe6',
    lineHeight: 1,
    fontWeight: 700,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.85)',
  },
  /** 当前不安 ≥ 不安上限（且上限大于 0） */
  boardNpcChipTokenCellUnrestAtMax: {
    color: '#f87171',
    fontWeight: 700,
  },
  boardNpcChipImageWrap: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
    paddingBottom: '2px',
    overflow: 'visible',
  },
  /** 与立绘同宽高裁切区：指示物不得画出卡图外；角标行动牌放在外层仍可向外出界 */
  boardNpcChipPortraitClip: {
    position: 'relative' as const,
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'stretch',
    lineHeight: 0,
  },
  /** 立绘上指示物：无背板，固定友好 / 不安 / 密谋三列，列内纵向叠放 */
  boardNpcChipTokenOverlay: {
    position: 'absolute' as const,
    top: '4px',
    left: '4px',
    right: '4px',
    zIndex: 4,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    alignItems: 'start',
    justifyItems: 'center',
    columnGap: '2px',
    rowGap: 0,
    padding: 0,
    pointerEvents: 'none' as const,
  },
  boardNpcChipTokenOverlayGroup: {
    minWidth: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    flexWrap: 'nowrap' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '2px',
  },
  /** 版图 NPC 立绘正中：主人公额外标记（左）+ 剧作家选用特殊 token（右）*/
  boardNpcChipCenterTokenCluster: {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 12,
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    maxWidth: '88%',
    pointerEvents: 'none' as const,
  },
  boardNpcChipProtagonistExtraCluster: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '3px',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '48%',
  },
  boardNpcChipProtagonistExtraImg: {
    width: 'clamp(28px, 36%, 50px)',
    height: 'clamp(28px, 36%, 50px)',
    objectFit: 'contain' as const,
    flexShrink: 0,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))',
  },
  boardNpcChipSpecialTokenClusterInner: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    maxWidth: '62%',
  },
  boardNpcChipExtraLegendRow: {
    fontSize: 'clamp(7px, 0.82vw, 9px)',
    color: '#cbd5e1',
    textAlign: 'center' as const,
    lineHeight: 1.25,
    width: '100%',
    marginTop: '1px',
    boxSizing: 'border-box' as const,
    padding: '4px 5px',
    borderRadius: '4px',
    backgroundColor: 'rgba(22, 33, 62, 0.88)',
    border: '1px solid rgba(148, 163, 184, 0.28)',
  },
  boardNpcChipSpecialTokenImg: {
    width: 'clamp(44px, 52%, 80px)',
    height: 'clamp(44px, 52%, 80px)',
    objectFit: 'contain' as const,
    flexShrink: 0,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.9))',
  },
  boardNpcChipMastermindCard: {
    position: 'absolute' as const,
    left: '-22%',
    bottom: '-16%',
    width: '42%',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '4px',
    boxShadow: BOARD_PLAYED_CARD_SHADOW_NPC_MINI,
    /** 高于正中特殊 token（12），便于角落打出卡仍压在 token 与 EX 之上 */
    zIndex: 14,
    pointerEvents: 'none' as const,
  },
  boardNpcChipProtagonistCard: {
    position: 'absolute' as const,
    right: '-20%',
    bottom: '-16%',
    width: '42%',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '4px',
    boxShadow: BOARD_PLAYED_CARD_SHADOW_NPC_MINI,
    zIndex: 14,
    pointerEvents: 'none' as const,
  },
  /** NPC 立绘上 EX：右上角，略缩小以免挡脸过多 */
  boardNpcChipProtagonistExCard: {
    position: 'absolute' as const,
    top: '3%',
    right: '4%',
    left: 'auto',
    bottom: 'auto',
    transform: 'none',
    width: '38%',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '4px',
    boxShadow: '0 2px 12px rgba(56, 189, 248, 0.4)',
    zIndex: 11,
    opacity: 0.96,
    pointerEvents: 'none' as const,
  },
  boardNpcChipDeadOverlay: {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
    zIndex: 5,
    pointerEvents: 'none' as const,
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6))',
  },
  boardNpcChipImgSized: {
    display: 'block',
    width: '100%',
    height: 'auto',
    maxHeight: 'none',
    maxWidth: '100%',
    flexShrink: 0,
    objectFit: 'contain' as const,
    borderRadius: 0,
  },
  /** 该 NPC 上已挂剧作家/主人公行动牌时，立绘圆角与出牌高亮一致（金色描边由 Board 按开关注入 boxShadow） */
  boardNpcChipImgPlayedHandHighlight: {
    borderRadius: '4px',
  },
  boardNpcChipCaptionOverlay: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '5px 6px 6px',
    background: 'linear-gradient(180deg, transparent 0%, rgba(12, 18, 32, 0.55) 40%, rgba(12, 18, 32, 0.92) 100%)',
    textAlign: 'center' as const,
    zIndex: 2,
    pointerEvents: 'none' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1px',
  },
  boardNpcChipNameOnCard: {
    fontSize: 'clamp(9px, 1.05vw, 12px)',
    fontWeight: 700,
    color: '#f2efe6',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.95)',
    lineHeight: 1.15,
  },
  boardNpcChipRoleOnCard: {
    fontSize: 'clamp(8px, 0.95vw, 11px)',
    fontWeight: 600,
    color: '#fce38a',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.95)',
    lineHeight: 1.15,
  },
  boardNpcChipTextLayer: {
    position: 'relative' as const,
    zIndex: 1,
  },
  boardNpcChipName: {
    fontWeight: 700,
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)',
  },
  boardNpcChipRole: {
    marginTop: '2px',
    fontSize: '0.85em',
    opacity: 0.92,
    color: '#fce38a',
    fontWeight: 500,
  },
  rightPanel: {
    flex: '0 0 auto',
    width: 'min(300px, 30vw)',
    alignSelf: 'stretch',
    height: '100%',
    maxHeight: '100%',
    minWidth: 0,
    backgroundColor: 'rgba(22, 33, 62, 0.96)',
    padding: '10px clamp(8px, 1.2vw, 14px)',
    borderRadius: '8px',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: '1px solid rgba(79, 99, 140, 0.55)',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
  },
  dayFlowTitle: {
    margin: '0 0 6px 0',
    fontSize: 'clamp(14px, 1.35vw, 16px)',
    fontWeight: 700,
    color: '#fce38a',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap' as const,
  },
  dayFlowGlobalNextRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  dayFlowGlobalPrevBtn: {
    flex: 1,
    padding: '6px 8px',
    fontSize: 'clamp(11px, 1vw, 12px)',
  },
  dayFlowGlobalNextBtn: {
    flex: 1,
    padding: '6px 8px',
    fontSize: 'clamp(11px, 1vw, 12px)',
  },
  dayFlowViewHint: {
    margin: '0 0 10px 0',
    fontSize: 'clamp(10px, 1vw, 12px)',
    lineHeight: 1.45,
    color: 'rgba(220, 224, 235, 0.78)',
  },
  dayFlowScroll: {
    flex: '0 0 50%',
    minHeight: 0,
    maxHeight: '50%',
    overflowY: 'auto' as const,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  gameLogPanel: {
    marginTop: '10px',
    minHeight: 0,
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: '8px',
    border: '1px solid rgba(79, 99, 140, 0.45)',
    backgroundColor: 'rgba(12, 20, 38, 0.65)',
  },
  gameLogHeader: {
    padding: '8px 10px',
    fontSize: 'clamp(11px, 1vw, 13px)',
    fontWeight: 700,
    color: '#fce38a',
    borderBottom: '1px solid rgba(79, 99, 140, 0.35)',
  },
  gameLogList: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto' as const,
    padding: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  gameLogItem: {
    borderRadius: '6px',
    border: '1px solid rgba(79, 99, 140, 0.32)',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    padding: '6px 7px',
  },
  gameLogLine: {
    fontSize: 'clamp(9px, 0.84vw, 11px)',
    lineHeight: 1.35,
    color: 'rgba(226, 232, 240, 0.94)',
    whiteSpace: 'pre-line' as const,
    wordBreak: 'break-word' as const,
  },
  gameLogMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    flexWrap: 'wrap' as const,
    marginBottom: '4px',
  },
  gameLogTime: {
    fontSize: 'clamp(9px, 0.84vw, 11px)',
    color: '#cbd5e1',
    fontVariantNumeric: 'tabular-nums' as const,
  },
  gameLogTag: {
    fontSize: 'clamp(8px, 0.78vw, 10px)',
    color: '#e2e8f0',
    border: '1px solid rgba(148, 163, 184, 0.32)',
    borderRadius: '999px',
    padding: '1px 6px',
    lineHeight: 1.2,
  },
  gameLogLevel: {
    fontSize: 'clamp(8px, 0.76vw, 10px)',
    borderRadius: '4px',
    padding: '1px 4px',
    lineHeight: 1.2,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  gameLogLevelInfo: {
    color: '#bfdbfe',
    backgroundColor: 'rgba(30, 64, 175, 0.35)',
    border: '1px solid rgba(96, 165, 250, 0.45)',
  },
  gameLogLevelWarn: {
    color: '#fde68a',
    backgroundColor: 'rgba(180, 83, 9, 0.35)',
    border: '1px solid rgba(251, 191, 36, 0.45)',
  },
  gameLogLevelSuccess: {
    color: '#bbf7d0',
    backgroundColor: 'rgba(22, 101, 52, 0.35)',
    border: '1px solid rgba(74, 222, 128, 0.45)',
  },
  gameLogAction: {
    fontSize: 'clamp(10px, 0.9vw, 12px)',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '3px',
  },
  gameLogDetail: {
    fontSize: 'clamp(9px, 0.82vw, 11px)',
    lineHeight: 1.35,
    color: 'rgba(226, 232, 240, 0.92)',
    whiteSpace: 'normal' as const,
    wordBreak: 'break-word' as const,
  },
  gameLogEmpty: {
    color: 'rgba(203, 213, 225, 0.76)',
    fontSize: 'clamp(10px, 0.9vw, 12px)',
    lineHeight: 1.35,
    padding: '8px 2px',
  },
  dayFlowGroup: {
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 52, 96, 0.45)',
    border: '1px solid rgba(83, 52, 131, 0.35)',
    padding: '8px 8px 6px 8px',
  },
  dayFlowGroupHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(233, 69, 96, 0.25)',
  },
  dayFlowRoman: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 'clamp(17px, 1.6vw, 20px)',
    fontWeight: 700,
    color: '#e94560',
    minWidth: '1.2em',
  },
  dayFlowBandTitle: {
    fontSize: 'clamp(12px, 1.15vw, 14px)',
    fontWeight: 600,
    color: '#e8ecf5',
  },
  dayFlowBandTitleWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  dayFlowHelpBtn: {
    width: '18px',
    height: '18px',
    borderRadius: '999px',
    border: '1px solid rgba(252, 227, 138, 0.65)',
    backgroundColor: 'rgba(25, 39, 68, 0.9)',
    color: '#fce38a',
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
  },
  dayFlowPhaseRow: {
    display: 'flex',
    flexDirection: 'column-reverse' as const,
    alignItems: 'stretch',
    gap: '8px',
    marginBottom: '8px',
    padding: '6px 4px',
    borderRadius: '6px',
    backgroundColor: 'rgba(22, 33, 62, 0.55)',
  },
  dayFlowPhaseRowCurrent: {
    outline: '2px solid rgba(252, 227, 138, 0.85)',
    outlineOffset: '1px',
    backgroundColor: 'rgba(45, 55, 95, 0.72)',
  },
  timeSpiralBody: {
    margin: '0 0 12px 0',
    fontSize: 'clamp(11px, 1vw, 13px)',
    lineHeight: 1.5,
    color: 'rgba(226, 232, 240, 0.92)',
  },
  loopFailRow: {
    marginBottom: '8px',
  },
  loopFailBtn: {
    width: '100%',
    padding: '7px 8px',
    fontSize: 'clamp(11px, 1vw, 12px)',
    borderColor: 'rgba(233, 69, 96, 0.55)',
  },
  finalVoteRow: {
    marginBottom: '8px',
  },
  finalVoteBtn: {
    width: '100%',
    padding: '7px 8px',
    fontSize: 'clamp(11px, 1vw, 12px)',
    borderColor: 'rgba(167, 139, 250, 0.55)',
  },
  dayFlowBtnCol: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dayFlowMiniBtn: {
    padding: '3px 6px',
    fontSize: 'clamp(10px, 0.95vw, 11px)',
    lineHeight: 1.25,
    fontWeight: 600,
    borderRadius: '4px',
    cursor: 'pointer' as const,
    border: '1px solid transparent',
    whiteSpace: 'nowrap' as const,
  },
  dayFlowMiniBtnOn: {
    color: '#1a1a2e',
    background: 'linear-gradient(180deg, #fce38a 0%, #f0c14d 100%)',
    borderColor: 'rgba(255, 248, 220, 0.65)',
  },
  dayFlowMiniBtnOff: {
    color: 'rgba(200, 206, 220, 0.45)',
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    borderColor: 'rgba(120, 130, 155, 0.25)',
    cursor: 'not-allowed' as const,
    opacity: 0.72,
  },
  dayFlowBlockReason: {
    marginTop: '2px',
    maxWidth: '190px',
    fontSize: '10px',
    lineHeight: 1.35,
    color: '#fda4af',
    whiteSpace: 'normal' as const,
  },
  dayFlowPhaseBody: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    justifyContent: 'center',
  },
  dayFlowStepName: {
    fontSize: 'clamp(11px, 1.05vw, 13px)',
    fontWeight: 600,
    color: '#f2efe6',
    lineHeight: 1.35,
  },
  dayFlowStepMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
  },
  dayFlowMetaChip: {
    fontSize: 'clamp(9px, 0.85vw, 10px)',
    lineHeight: 1.2,
    padding: '2px 5px',
    borderRadius: '4px',
    backgroundColor: 'rgba(15, 52, 96, 0.75)',
    color: 'rgba(200, 210, 230, 0.88)',
    border: '1px solid rgba(79, 99, 140, 0.4)',
  },
  eventOutcomeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
    marginBottom: '2px',
  },
  eventOutcomeSelect: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(18, 24, 36, 0.88)',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: 'clamp(9px, 0.85vw, 11px)',
    lineHeight: 1.2,
    boxSizing: 'border-box' as const,
  },
  status: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  gameOver: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#e94560',
    borderRadius: '8px',
    fontSize: '24px',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
  },
  card: {
    backgroundColor: '#16213e',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
  },
  cardName: {
    fontWeight: 'bold',
    color: '#e94560',
  },
  cardType: {
    fontSize: '12px',
    color: '#888',
  },
  cardDesc: {
    fontSize: '14px',
    margin: '10px 0',
  },
  playButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  field: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  fieldCard: {
    backgroundColor: '#533483',
    padding: '10px 20px',
    borderRadius: '8px',
  },
  characterGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  characterButton: {
    padding: '10px 20px',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  actionsOuter: {
    width: '100%',
    marginBottom: '20px',
    boxSizing: 'border-box' as const,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 0,
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  actionsToolbarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexWrap: 'wrap' as const,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
  },
  exCardsToolbar: {
    marginTop: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(56, 189, 248, 0.38)',
    backgroundColor: 'rgba(12, 30, 46, 0.55)',
    boxSizing: 'border-box' as const,
  },
  exCardsToolbarTitle: {
    color: '#bae6fd',
    fontSize: 'clamp(10px, 0.85vw, 12px)',
    lineHeight: 1.4,
    marginBottom: '8px',
  },
  exCardsToolbarRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end',
    gap: '12px',
  },
  exCardsToolbarCell: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    minWidth: '104px',
    flex: '1 1 140px',
  },
  exCardsToolbarSeatLabel: {
    color: '#e2e8f0',
    fontSize: 'clamp(10px, 0.8vw, 12px)',
    fontWeight: 600,
  },
  exCardsToolbarSelect: {
    width: '100%',
    backgroundColor: 'rgba(14, 36, 54, 0.92)',
    color: '#dbeafe',
    border: '1px solid rgba(56, 189, 248, 0.42)',
    borderRadius: '6px',
    padding: '5px 8px',
    fontSize: 'clamp(10px, 0.82vw, 12px)',
    boxSizing: 'border-box' as const,
  },
  exCardsToolbarInlineButton: {
    padding: '5px 12px',
    margin: 0,
    fontSize: 'clamp(10px, 0.82vw, 12px)',
    lineHeight: 1.25,
    borderRadius: '6px',
    border: '1px solid transparent',
    backgroundColor: '#e94560',
    color: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
    flexShrink: 0,
  },
  actionsToolbarTrailingButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  actionsToolbarCompactAction: {
    padding: '0 12px',
    height: '30px',
    fontSize: '13px',
    lineHeight: '30px',
    boxSizing: 'border-box' as const,
  },
  boardCardOutlineToggleLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    color: '#cbd5e1',
    fontSize: '13px',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  boardCardOutlineSwitch: {
    position: 'relative' as const,
    width: '44px',
    height: '24px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 248, 220, 0.4)',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    boxSizing: 'border-box' as const,
  },
  boardCardOutlineSwitchKnob: {
    position: 'absolute' as const,
    top: '2px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
    pointerEvents: 'none' as const,
  },
  actionButton: {
    padding: '12px 24px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  accuseSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
  },
  accuseButton: {
    padding: '10px 20px',
    backgroundColor: '#533483',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  smallAction: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  actionButtonDisabled: {
    backgroundColor: '#555',
    cursor: 'not-allowed',
    opacity: 0.75,
  },
  inviteUrlInput: {
    width: '100%',
    boxSizing: 'border-box' as const,
    fontSize: '12px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #4ecca3',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
  },
  moduleRuleLeft: {
    border: '1px solid #ddd',
    textAlign: 'center' as const,
    width: '100px',
  },
  moduleRuleMiddle: {
    border: '1px solid #ddd',
    width: '10px',
  },
  moduleMiddle: {
    border: '1px solid #ddd',
  },
  roleMaxCountColumn: {
    border: '1px solid #ddd',
    width: '30px',
    minWidth: '30px',
    boxSizing: 'border-box',
  },
  moduleRuleRight: {
    border: '1px solid #ddd',
    width: '700px',
  },
  infoButton: {
    padding: '10px 20px',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  moduleInfoOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  finalGuessOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1080,
    padding: '16px',
    boxSizing: 'border-box' as const,
  },
  finalGuessModal: {
    width: 'min(900px, 96vw)',
    maxHeight: '88vh',
    overflowY: 'auto' as const,
    backgroundColor: 'rgba(12, 20, 38, 0.98)',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    borderRadius: '10px',
    boxSizing: 'border-box' as const,
    padding: '14px 16px 16px',
    color: '#f2efe6',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  finalGuessHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },
  finalGuessTitle: {
    margin: 0,
    fontSize: 'clamp(16px, 1.6vw, 22px)',
    color: '#ffe8a3',
  },
  finalGuessCloseBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    backgroundColor: 'rgba(20, 28, 46, 0.95)',
    color: '#f8fafc',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  finalGuessSubTitle: {
    fontSize: 'clamp(10px, 0.9vw, 13px)',
    color: '#c9d4ef',
    lineHeight: 1.4,
  },
  finalGuessEmpty: {
    border: '1px dashed rgba(255, 248, 220, 0.25)',
    borderRadius: '8px',
    padding: '12px',
    color: '#cbd5e1',
    textAlign: 'center' as const,
  },
  finalGuessList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  finalGuessRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(100px, 1fr) minmax(120px, 1.2fr) 74px 64px',
    gap: '8px',
    alignItems: 'center',
    border: '1px solid rgba(148, 163, 184, 0.26)',
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'rgba(18, 24, 36, 0.78)',
  },
  finalGuessNpcName: {
    color: '#f8fafc',
    fontWeight: 700,
    fontSize: 'clamp(10px, 0.9vw, 13px)',
  },
  finalGuessNpcNameBtn: {
    color: '#f8fafc',
    fontWeight: 700,
    fontSize: 'clamp(10px, 0.9vw, 13px)',
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    fontFamily: 'inherit',
  },
  finalGuessSelect: {
    width: '100%',
    minWidth: 0,
    backgroundColor: 'rgba(20, 28, 46, 0.95)',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.45)',
    borderRadius: '6px',
    padding: '5px 8px',
    fontSize: 'clamp(9px, 0.82vw, 12px)',
    boxSizing: 'border-box' as const,
  },
  finalGuessSubmitBtn: {
    border: '1px solid rgba(167, 139, 250, 0.5)',
    borderRadius: '6px',
    backgroundColor: 'rgba(79, 70, 229, 0.86)',
    color: '#f8fafc',
    fontSize: 'clamp(9px, 0.82vw, 12px)',
    lineHeight: 1.2,
    padding: '6px 8px',
    cursor: 'pointer',
  },
  finalGuessResult: {
    textAlign: 'center' as const,
    fontWeight: 700,
    fontSize: 'clamp(9px, 0.8vw, 12px)',
    color: '#94a3b8',
  },
  finalGuessResultCorrect: {
    color: '#4ade80',
  },
  finalGuessResultWrong: {
    color: '#f87171',
  },
  finalGuessFooter: {
    marginTop: '2px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 248, 220, 0.2)',
    color: '#fde68a',
    fontWeight: 700,
    fontSize: 'clamp(10px, 0.9vw, 13px)',
  },
  finalGuessReopenBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: 1085,
    border: '1px solid rgba(167, 139, 250, 0.58)',
    borderRadius: '999px',
    backgroundColor: 'rgba(79, 70, 229, 0.92)',
    color: '#f8fafc',
    fontSize: 'clamp(10px, 0.9vw, 12px)',
    fontWeight: 700,
    lineHeight: 1.2,
    padding: '8px 14px',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(30, 41, 59, 0.45)',
  },
  npcZoomOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '16px',
    boxSizing: 'border-box' as const,
  },
  npcZoomModal: {
    backgroundColor: 'rgba(22, 33, 62, 0.98)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    padding: '16px 20px 20px',
    maxWidth: 'min(92vw, 480px)',
    maxHeight: '90vh',
    overflow: 'auto',
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    color: '#f2efe6',
  },
  npcZoomHeader: {
    alignSelf: 'flex-end',
    marginBottom: '8px',
  },
  npcZoomTokenRow: {
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '8px',
    padding: '8px',
    fontSize: '12px',
    lineHeight: 1.2,
    color: '#e8e4dc',
    border: '1px solid rgba(255, 248, 220, 0.2)',
    borderRadius: '6px',
    backgroundColor: 'rgba(8, 14, 28, 0.45)',
    fontVariantNumeric: 'tabular-nums' as const,
    boxSizing: 'border-box' as const,
  },
  npcZoomTokenEditor: {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  },
  npcZoomTokenLabel: {
    fontSize: '12px',
    color: '#d9d4cc',
    whiteSpace: 'nowrap' as const,
  },
  npcZoomTokenStepper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
  },
  npcZoomTokenButton: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 248, 220, 0.38)',
    backgroundColor: 'rgba(16, 28, 52, 0.92)',
    color: '#f2efe6',
    fontSize: '15px',
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
  },
  npcZoomTokenValue: {
    minWidth: '56px',
    textAlign: 'center' as const,
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
  },
  npcZoomTokenCellUnrestAtMax: {
    color: '#f87171',
    fontWeight: 700,
  },
  npcZoomTokenRowHopeDespair: {
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
    padding: '8px',
    fontSize: '12px',
    lineHeight: 1.2,
    color: '#e8e4dc',
    border: '1px solid rgba(255, 248, 220, 0.2)',
    borderRadius: '6px',
    backgroundColor: 'rgba(8, 14, 28, 0.45)',
    boxSizing: 'border-box' as const,
  },
  npcZoomSpecialTokenReadOnlyBlock: {
    width: '100%',
    flexShrink: 0,
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '6px',
    backgroundColor: 'rgba(10, 16, 30, 0.5)',
    boxSizing: 'border-box' as const,
  },
  npcZoomSpecialTokenReadOnlyRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: '10px',
    alignItems: 'center',
    width: '100%',
  },
  npcZoomSpecialTokenReadOnlyItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  npcZoomSpecialTokenProtagonistHint: {
    width: '100%',
    marginBottom: '10px',
    padding: '8px 10px',
    fontSize: '12px',
    lineHeight: 1.45,
    color: '#cbd5e1',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.28)',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    boxSizing: 'border-box' as const,
  },
  npcZoomSpecialTokenBlock: {
    width: '100%',
    flexShrink: 0,
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid rgba(167, 139, 250, 0.35)',
    borderRadius: '6px',
    backgroundColor: 'rgba(12, 18, 40, 0.55)',
    boxSizing: 'border-box' as const,
  },
  npcZoomSpecialTokenCheckboxWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    width: '100%',
  },
  npcZoomSpecialTokenCheckboxLabel: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#e8e4dc',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  npcZoomSpecialTokenThumb: {
    width: '52px',
    height: '52px',
    objectFit: 'contain' as const,
    flexShrink: 0,
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  npcZoomSpecialTokenCheckboxText: {
    flex: '1 1 auto',
    minWidth: 0,
    lineHeight: 1.35,
  },
  npcZoomSpecialTokenPreviewRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '10px',
    width: '100%',
  },
  npcZoomSpecialTokenPreviewImg: {
    width: '72px',
    height: '72px',
    objectFit: 'contain' as const,
  },
  /** 放大弹窗：立绘与 EX / 特殊 token 叠放参照版图卡面 */
  npcZoomPortraitStage: {
    position: 'relative' as const,
    display: 'inline-block',
    maxWidth: '100%',
    lineHeight: 0,
  },
  /** 放大弹窗立绘正中：主人公额外标记 + 选用特殊 token */
  npcZoomPortraitTokenCluster: {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 12,
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '76%',
    pointerEvents: 'none' as const,
  },
  npcZoomPortraitProtagonistExtras: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '6px',
    maxWidth: '48%',
    alignItems: 'center',
  },
  npcZoomPortraitSpecialTokens: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '8px',
    maxWidth: '58%',
    alignItems: 'center',
  },
  npcZoomProtagonistExtraPortraitImg: {
    width: 'clamp(56px, 16vw, 108px)',
    height: 'clamp(56px, 16vw, 108px)',
    objectFit: 'contain' as const,
    flexShrink: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
  },
  npcZoomSpecialTokenOnPortraitImg: {
    width: 'clamp(72px, 20vw, 144px)',
    height: 'clamp(72px, 20vw, 144px)',
    objectFit: 'contain' as const,
    flexShrink: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85))',
  },
  npcZoomImg: {
    maxWidth: '100%',
    maxHeight: 'min(72vh, 640px)',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain' as const,
    borderRadius: '8px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.55)',
  },
  npcZoomTitle: {
    marginTop: '14px',
    fontSize: 'clamp(18px, 2.4vw, 22px)',
    fontWeight: 700,
    textAlign: 'center' as const,
  },
  npcZoomRole: {
    marginTop: '6px',
    fontSize: '15px',
    color: '#fce38a',
    fontWeight: 600,
  },
  npcZoomCardInfo: {
    width: '100%',
    maxWidth: '520px',
    marginTop: '16px',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(12, 18, 32, 0.92)',
    border: '1px solid rgba(148, 163, 184, 0.28)',
    boxSizing: 'border-box' as const,
    textAlign: 'left' as const,
  },
  npcZoomCardInfoTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '10px',
    letterSpacing: '0.02em',
  },
  npcZoomCardInfoLine: {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: 1.55,
    marginBottom: '6px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  npcZoomCardInfoLabel: {
    color: '#94a3b8',
    flex: '0 0 auto',
  },
  npcZoomFeaturesText: {
    flex: '1 1 auto',
    minWidth: 0,
    whiteSpace: 'pre-wrap' as const,
    color: '#e2e8f0',
  },
  npcZoomAbilityList: {
    margin: '10px 0 0 0',
    paddingLeft: '18px',
    color: '#e2e8f0',
    fontSize: '13px',
    lineHeight: 1.45,
  },
  npcZoomAbilityItem: {
    marginBottom: '10px',
  },
  npcZoomAbilityDesc: {
    color: '#f1f5f9',
  },
  npcZoomAbilityMeta: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  npcZoomControlLabel: {
    width: '100%',
    marginTop: '14px',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#f2efe6',
    textAlign: 'left' as const,
  },
  npcZoomTopControlRow: {
    width: '100%',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  npcZoomTopControlCol: {
    flex: '1 1 0',
    minWidth: 0,
  },
  npcZoomSelect: {
    width: '100%',
    backgroundColor: '#101c34',
    color: '#f2efe6',
    border: '1px solid rgba(255, 248, 220, 0.35)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  npcZoomDiscardToggleBtn: {
    width: '100%',
    backgroundColor: '#632737',
    color: '#fff1f1',
    border: '1px solid rgba(255, 198, 198, 0.45)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
  },
  moduleInfo: {
    backgroundColor: '#16213e',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '1300px',
    color: '#fff',
    maxHeight: '100vh',
    overflow: 'auto',
  },
  moduleMetaBlock: {
    marginBottom: '14px',
  },
  moduleMetaTitle: {
    margin: '0 0 6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#94a3b8',
  },
  moduleMetaText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.55,
    color: '#cbd5e1',
    whiteSpace: 'pre-wrap' as const,
  },
  controlDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  closeButton: {
    padding: '6px 12px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};