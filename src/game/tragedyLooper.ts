// filepath: src/game/tragedyLooper.ts
/**
 * 惨剧轮回 - boardgame.io 游戏定义
 *
 * 时间与出牌：`day` = 全局「天」（每 1 天 1 回合）；`loop` = 「轮回」轮次，含多「天」。
 * 剧作家每日可打出次数固定为 3；主人公非轮限牌每日可打出次数 = 该天开始时手牌中此类牌张数（见 `beginNewDayForAllPlayers`）。
 */
import { Game, type Ctx, type PlayerID } from 'boardgame.io';
import { INVALID_MOVE, Stage } from 'boardgame.io/core';
import { Area } from './basicData/areas';
import {
  getTragedyHandCardById,
  handPoolIdsForRole,
  defaultStartingHandIds,
  toFieldSnapshot,
  MASTERMIND_FULL_HAND_IDS,
  PROTAGONIST_FULL_HAND_IDS,
  OPTIONAL_TRAGEDY_HAND_CARD_IDS,
  countDailyBudgetSnapshotForHand,
  type TragedyFieldCardSnapshot,
} from './data/tragedyHandCards';
import { TRAGEDY_EX_CARD_IDS, TRAGEDY_EX_CARD_ORDERED_IDS } from './data/tragedyExCards';
import { defaultSeatRoles, type PlayerSeatRole } from './players/playerSeats';
import { Steps, TRAGEDY_DAY_MAIN_FLOW_FLAT } from './basicData/steps';
import { normalizeProtagonistExtraTokenIds } from './protagonistExtraTokens';

// ==================== 游戏状态 ====================

export interface TragedyState {
  /** 当前轮回（轮次）序号 */
  loop: number;
  /** 当前天序号（每个「天」= 1 回合） */
  day: number;
  hands: { [playerID: string]: string[] };
  /** 本局打出的惨剧轮回手牌快照 */
  field: TragedyFieldCardSnapshot[];
  gameOver: boolean;
  winner: string | null;
  failedLoops: number;
  seatRole: { [playerID: string]: PlayerSeatRole };
  boardAreaConspiracy: Record<Area, number>;
  /** 剧作家本轮回已使用过的「每轮回限一次」卡牌 id */
  mastermindOncePerLoopUsedIds: string[];
  /** 剧作家：本日可打出非轮限牌次数上限（固定 3） */
  mastermindDailyPlayAllowance: number;
  /** 剧作家：本天已打出的非轮限牌次数 */
  mastermindDailyPlayUsed: number;
  /** 主人公：各玩家本天非轮限出牌上限（天开始时按手牌快照） */
  protagonistDailyPlayAllowance: { [playerID: string]: number };
  /** 主人公：各玩家本天已打出非轮限牌次数 */
  protagonistDailyPlayUsed: { [playerID: string]: number };
  /** 主人公：各玩家本轮回已使用过的「每轮回限一次」卡牌 id（每名主人公牌组相同，按玩家分别记） */
  protagonistOncePerLoopUsedIds: { [playerID: string]: string[] };
  /** 每轮回天数（开局由 setupData 注入） */
  daysPerLoop: number;
  /** 当前天在 Ⅰ–Ⅴ 主流程中的扁平子阶段下标（见 `TRAGEDY_DAY_MAIN_FLOW_FLAT`） */
  dayFlowFlatIndex: number;
  /** 当前子阶段是否已完成「结算」，可点「下一阶段」 */
  dayFlowSubPhaseReady: boolean;
  /** 进入时之缝隙（失败中途，或当轮回最后一日夜晚成功结束后、非最终轮回时） */
  inTimeSpiral: boolean;
  /** 剧本设定的轮回总数上限（与开局 setupData 一致） */
  maxLoops: number;
  /** 因何进入时之缝隙；`day_start`=每日开场，`loop_end`=轮回末，`failure`=中途失败 */
  timeSpiralEntryReason: null | 'failure' | 'loop_end' | 'day_start';
  /** 最终轮回最后一日夜晚结束后进入终盘（跳过隙） */
  inFinalGuess: boolean;
  /** 最终轮回最后一日夜晚已结算完毕，等待三名主人公各自确认后才可进入终盘 */
  awaitingProtagonistFinalConsensus: boolean;
  /** 主人公玩家 id → 是否已确认进入最终决战（满 3 人则进入 `inFinalGuess`） */
  protagonistFinalGuessVotes: Record<string, true>;
  /**
   * 剧作家暗置 3 槽（仍为当前手牌中的牌，结算前仅剧作家可见牌面；他人见占位）。
   * 公开结算时须 3 槽皆有牌且两两不同 id。
   */
  secretMastermindSlots: (string | null)[];
  /** 各主人公玩家 id → 本阶段暗置 1 张（结算前仅本人可见牌面；他人见 `SECRET_CARD_MASK`） */
  secretProtagonistCardByPlayer: Record<string, string | null>;
  /** UI：版图区域上的剧作家卡牌选择（联机同步） */
  uiSelectedMastermindCardByArea: Record<Area, string>;
  /** UI：NPC 上的剧作家卡牌选择（联机同步） */
  uiSelectedMastermindCardByNpcId: Record<string, string>;
  /** UI：版图区域上的主人公卡牌选择（联机同步） */
  uiSelectedProtagonistCardByAreaByPid: Record<string, Partial<Record<Area, string>>>;
  /** UI：NPC 上的主人公卡牌选择（联机同步） */
  uiSelectedProtagonistCardByNpcByPid: Record<string, Record<string, string>>;
  /**
   * 剧作家 EX 扩充手牌（tl_ui_ex_*；与 `hands` 完全独立）。
   * 非剧作家连接在 playerView 中恒为空数组。
   */
  mastermindExHandIds: string[];
  /** UI：各版图区域至多一张 EX；可与不同 NPC 及各区域并存；每张 EX id 在全图最多出现一处（仅剧作家可改） */
  uiMastermindExCardByArea: Record<Area, string>;
  /** UI：各 NPC 至多一张 EX；每张 EX id 与其它区域/NPC 互斥（仅剧作家可改） */
  uiMastermindExCardByNpcId: Record<string, string>;
  /** UI：NPC 指示物覆盖值（联机同步；希望/绝望仅额外卡牌 UI 使用） */
  uiNpcTokenOverrideByNpcId: Record<
    string,
    { friendly: number; unrest: number; plot: number; hope: number; despair: number }
  >;
  /**
   * UI：版图上该 NPC 立绘上额外展示的特殊 token 图（`specialTokenImage` 路径，与 npc 数据一致；可多选；联机同步）
   */
  uiNpcDisplayedSpecialTokenPathsByNpcId: Record<string, string[]>;
  /** UI：各 NPC 上主人公标记的额外 token（`communicated` / `communicated_ignore_friendly` / `dead`；可多选；联机同步；仅主人公可写） */
  uiNpcProtagonistExtraTokenIdsByNpcId: Record<string, string[]>;
  /** UI：各版图区域（含远方）上叠放的特殊 token 图路径（规则同 NPC；可多选；联机同步） */
  uiAreaDisplayedSpecialTokenPathsByArea: Partial<Record<Area, string[]>>;
  /** UI：NPC 区域覆盖（联机同步） */
  uiNpcAreaOverrideByNpcId: Record<string, Area>;
  /** UI：NPC 存活覆盖（联机同步） */
  uiNpcAliveOverrideByNpcId: Record<string, boolean>;
  /** UI：NPC 是否已弃置（联机同步） */
  uiNpcDiscardedByNpcId: Record<string, boolean>;
  /** UI：NPC 弃置前区域（用于还原；联机同步） */
  uiNpcDiscardOriginAreaByNpcId: Record<string, Area>;
  /** UI：NPC 是否在远方（联机同步） */
  uiNpcFarawayByNpcId: Record<string, boolean>;
  /** UI：NPC 进入远方前区域（用于还原；联机同步） */
  uiNpcFarawayOriginAreaByNpcId: Record<string, Area>;
  /** UI：延迟登场 NPC 是否已登场（联机同步） */
  uiNpcAppearedByNpcId: Record<string, boolean>;
  /** UI：按玩家记录手牌弃置（联机同步） */
  uiDiscardedHandCardIdsByPid: Record<string, string[]>;
  /**
   * UI：剧作家本轮回因桌面选牌标记为「轮限已用」的手牌 id（联机同步；弃置区展示用）。
   * 与 `playCard` / `revealSecretPlays` 写入的 `mastermindOncePerLoopUsedIds` 独立，避免自助盘面与正式打出混用。
   */
  uiMastermindOncePerLoopUsedHandCardIds: string[];
  /** UI：各主人公本轮回因桌面选牌标记的「轮限已用」手牌 id（联机同步；弃置区展示用） */
  uiProtagonistOncePerLoopUsedHandCardIdsByPid: Record<string, string[]>;
  /**
   * UI：Another Horizon Revised 表世界 / 里世界示意（联机同步；仅剧作家可切换，全员可见）
   */
  uiAhrWorldLine: 'surface' | 'inner';
  /** UI：主人公A宣言弹窗是否显示（联机同步） */
  uiProtagonistADeclarationVisible: boolean;
  /** UI：事件阶段结果选择（联机同步，所有视角可见） */
  uiEventPhaseOutcome: '' | 'not_happened' | 'happened' | 'happened_no_phenomenon';
  /** UI：最终决战中各角色当前选择的身份（联机同步，主人公共享） */
  uiFinalGuessSelectedRoleByNpcId: Record<string, string>;
  /** UI：最终决战中已猜对并锁定的角色顺序（联机同步，主人公共享） */
  uiFinalGuessSolvedNpcIds: string[];
  /** UI：最终决战中每个角色最近一次提交结果（联机同步，主人公共享） */
  uiFinalGuessStatusByNpcId: Record<string, 'correct' | 'wrong'>;
  /** 联机重连：各座位最近一次上报的 credentials（仅剧作家与本人可见） */
  reconnectCredentialsByPid: Record<string, string>;
}

/** boardgame.io 0.50：moves 首参为 `{ G, ctx, playerID, … }`，不是 `(G, ctx)` */
type TragedyMoveCtx = { G: TragedyState; ctx: Ctx; playerID: PlayerID | null | undefined };

function moveActorId(c: TragedyMoveCtx): PlayerID {
  return c.playerID != null && c.playerID !== '' ? c.playerID : c.ctx.currentPlayer;
}

/** playerView 中非所有者看到的占位 id（勿当真实牌 id 解析） */
export const SECRET_CARD_MASK = '__TL_HIDDEN__';

function mastermindPlayerId(seatRole: Record<string, PlayerSeatRole>): string | undefined {
  return Object.keys(seatRole).find(pid => seatRole[pid] === 'mastermind');
}

const MAIN_FLOW_LEN = TRAGEDY_DAY_MAIN_FLOW_FLAT.length;

function mainFlowMetaAt(index: number) {
  return TRAGEDY_DAY_MAIN_FLOW_FLAT[Math.max(0, Math.min(index, MAIN_FLOW_LEN - 1))]!.meta;
}

function isActionCardPhaseStep(step: Steps): boolean {
  return step === Steps.PlaywrightAction || step === Steps.ProtagonistAction || step === Steps.ActionResolution;
}

function canUseHandCardsAtCurrentFlowStep(G: TragedyState): boolean {
  if (G.inTimeSpiral || G.inFinalGuess || G.awaitingProtagonistFinalConsensus) return false;
  return isActionCardPhaseStep(mainFlowMetaAt(G.dayFlowFlatIndex).step);
}

function applySubPhaseEntryFlags(G: TragedyState) {
  const meta = mainFlowMetaAt(G.dayFlowFlatIndex);
  G.dayFlowSubPhaseReady = meta.settleBy === 'none';
}

function enterDayStartTimeSpiral(G: TragedyState) {
  G.dayFlowFlatIndex = 0;
  G.inTimeSpiral = true;
  G.timeSpiralEntryReason = 'day_start';
  // 时之缝隙只需要“下一阶段”按钮，不需要额外结算
  G.dayFlowSubPhaseReady = true;
}

function clearProtagonistFinalGuessVotes(G: TragedyState) {
  G.protagonistFinalGuessVotes = {};
}

function protagonistSeatIds(G: TragedyState): string[] {
  return Object.entries(G.seatRole)
    .filter(([, r]) => r === 'protagonist')
    .map(([id]) => id)
    .sort();
}

function emptySecretProtagonistBySeats(seatRole: Record<string, PlayerSeatRole>): Record<string, string | null> {
  return Object.fromEntries(
    Object.entries(seatRole)
      .filter(([, r]) => r === 'protagonist')
      .map(([pid]) => [pid, null as string | null]),
  );
}

function clearSecretPlays(G: TragedyState) {
  G.secretMastermindSlots = [null, null, null];
  G.secretProtagonistCardByPlayer = emptySecretProtagonistBySeats(G.seatRole);
}

/** 从存档（字符串或数组等）取出至多一张合法的 EX id */
function normalizeMastermindExSlotId(raw: unknown, handIds: string[]): string {
  const list = normalizeMastermindExCardIdsFromLegacyRaw(raw, handIds);
  return list[0] ?? '';
}

/** 校验 EX id：须在常量集且在剧作家当前 EX 手牌中；去重并保持 `TRAGEDY_EX_CARD_ORDERED_IDS` 顺序（用于读取旧存档） */
function normalizeMastermindExCardIdsFromLegacyRaw(raw: unknown, handIds: string[]): string[] {
  const handSet = new Set(handIds ?? []);
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (s: string) => {
    const t = s.trim();
    if (!t || !TRAGEDY_EX_CARD_IDS.has(t) || !handSet.has(t) || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  if (Array.isArray(raw)) {
    for (const x of raw) push(String(x ?? ''));
  } else if (typeof raw === 'string') {
    push(raw);
  }
  out.sort(
    (a, b) => TRAGEDY_EX_CARD_ORDERED_IDS.indexOf(a) - TRAGEDY_EX_CARD_ORDERED_IDS.indexOf(b),
  );
  return out;
}

/** 从版图与 NPC 上移除指定 EX id（不写 `ensureUiSyncState`） */
function clearMastermindExCardIdEverywhere(G: TragedyState, cardId: string) {
  const id = cardId.trim();
  if (!id) return;
  for (const a of Object.values(Area)) {
    if ((G.uiMastermindExCardByArea[a] ?? '') === id) G.uiMastermindExCardByArea[a] = '';
  }
  for (const nid of Object.keys(G.uiMastermindExCardByNpcId)) {
    if ((G.uiMastermindExCardByNpcId[nid] ?? '') === id) delete G.uiMastermindExCardByNpcId[nid];
  }
}

/** 保证每张 EX id 至多挂在一处（区域先于 NPC）；调用前已由 `ensureUiSyncState` 保证结构合法 */
function reconcileMastermindExAssignmentsUnique(G: TragedyState) {
  const seen = new Set<string>();
  for (const area of Object.values(Area)) {
    const id = String(G.uiMastermindExCardByArea[area] ?? '').trim();
    G.uiMastermindExCardByArea[area] = '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    G.uiMastermindExCardByArea[area] = id;
  }
  const npcIdsSorted = Object.keys(G.uiMastermindExCardByNpcId).sort();
  const nextNpc: Record<string, string> = {};
  for (const nid of npcIdsSorted) {
    const id = String(G.uiMastermindExCardByNpcId[nid] ?? '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    nextNpc[nid] = id;
  }
  G.uiMastermindExCardByNpcId = nextNpc;
}

function normalizeUiOncePerLoopHandIdsForMastermind(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    const id = String(x ?? '').trim();
    if (!id || seen.has(id)) continue;
    const def = getTragedyHandCardById(id);
    if (!def || def.side !== 'mastermind' || !def.oncePerLoop) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function normalizeUiOncePerLoopHandIdsForProtagonist(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    const id = String(x ?? '').trim();
    if (!id || seen.has(id)) continue;
    const def = getTragedyHandCardById(id);
    if (!def || def.side !== 'protagonist' || !def.oncePerLoop) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function clearUiCardSelections(G: TragedyState) {
  ensureUiSyncState(G);
  G.uiSelectedMastermindCardByArea = {
    [Area.Hospital]: '',
    [Area.Shrine]: '',
    [Area.City]: '',
    [Area.School]: '',
    [Area.Faraway]: '',
  };
  G.uiSelectedMastermindCardByNpcId = {};
  G.uiSelectedProtagonistCardByAreaByPid = {};
  G.uiSelectedProtagonistCardByNpcByPid = {};
}

/** 新轮回：重置剧作家 EX 扩充手牌为四张，并清空版图/NPC 上的 EX 展示 */
function resetMastermindExForNewLoop(G: TragedyState) {
  ensureUiSyncState(G);
  G.mastermindExHandIds = [...TRAGEDY_EX_CARD_ORDERED_IDS];
  G.uiMastermindExCardByArea = {
    [Area.Hospital]: '',
    [Area.Shrine]: '',
    [Area.City]: '',
    [Area.School]: '',
    [Area.Faraway]: '',
  };
  G.uiMastermindExCardByNpcId = {};
}

function clearUiFinalGuessState(G: TragedyState) {
  ensureUiSyncState(G);
  G.uiFinalGuessSelectedRoleByNpcId = {};
  G.uiFinalGuessSolvedNpcIds = [];
  G.uiFinalGuessStatusByNpcId = {};
}

function ensureUiSyncState(G: TragedyState) {
  if (!G.uiSelectedMastermindCardByArea) {
    G.uiSelectedMastermindCardByArea = {
      [Area.Hospital]: '',
      [Area.Shrine]: '',
      [Area.City]: '',
      [Area.School]: '',
      [Area.Faraway]: '',
    };
  }
  if (!G.uiSelectedMastermindCardByNpcId) G.uiSelectedMastermindCardByNpcId = {};
  if (!G.uiSelectedProtagonistCardByAreaByPid) G.uiSelectedProtagonistCardByAreaByPid = {};
  if (!G.uiSelectedProtagonistCardByNpcByPid) G.uiSelectedProtagonistCardByNpcByPid = {};
  if (!Array.isArray(G.mastermindExHandIds) || G.mastermindExHandIds.length === 0) {
    G.mastermindExHandIds = [...TRAGEDY_EX_CARD_ORDERED_IDS];
  }
  if (!G.uiMastermindExCardByArea || typeof G.uiMastermindExCardByArea !== 'object') {
    G.uiMastermindExCardByArea = {
      [Area.Hospital]: '',
      [Area.Shrine]: '',
      [Area.City]: '',
      [Area.School]: '',
      [Area.Faraway]: '',
    };
  } else {
    const handIds = G.mastermindExHandIds ?? [];
    for (const a of Object.values(Area)) {
      G.uiMastermindExCardByArea[a] = normalizeMastermindExSlotId(G.uiMastermindExCardByArea[a], handIds);
    }
  }
  if (!G.uiMastermindExCardByNpcId || typeof G.uiMastermindExCardByNpcId !== 'object') {
    G.uiMastermindExCardByNpcId = {};
  } else {
    const handIds = G.mastermindExHandIds ?? [];
    const nextNpc: Record<string, string> = {};
    for (const [npcId, raw] of Object.entries(G.uiMastermindExCardByNpcId)) {
      const sid = normalizeMastermindExSlotId(raw, handIds);
      if (sid) nextNpc[npcId] = sid;
    }
    G.uiMastermindExCardByNpcId = nextNpc;
  }
  reconcileMastermindExAssignmentsUnique(G);
  if (!G.uiNpcTokenOverrideByNpcId) G.uiNpcTokenOverrideByNpcId = {};
  if (!G.uiNpcDisplayedSpecialTokenPathsByNpcId) G.uiNpcDisplayedSpecialTokenPathsByNpcId = {};
  if (!G.uiNpcProtagonistExtraTokenIdsByNpcId) G.uiNpcProtagonistExtraTokenIdsByNpcId = {};
  if (!G.uiAreaDisplayedSpecialTokenPathsByArea || typeof G.uiAreaDisplayedSpecialTokenPathsByArea !== 'object') {
    G.uiAreaDisplayedSpecialTokenPathsByArea = {};
  }
  if (!G.uiNpcAreaOverrideByNpcId) G.uiNpcAreaOverrideByNpcId = {};
  if (!G.uiNpcAliveOverrideByNpcId) G.uiNpcAliveOverrideByNpcId = {};
  if (!G.uiNpcDiscardedByNpcId) G.uiNpcDiscardedByNpcId = {};
  if (!G.uiNpcDiscardOriginAreaByNpcId) G.uiNpcDiscardOriginAreaByNpcId = {};
  if (!G.uiNpcFarawayByNpcId) G.uiNpcFarawayByNpcId = {};
  if (!G.uiNpcFarawayOriginAreaByNpcId) G.uiNpcFarawayOriginAreaByNpcId = {};
  if (!G.uiNpcAppearedByNpcId) G.uiNpcAppearedByNpcId = {};
  if (!G.uiDiscardedHandCardIdsByPid) G.uiDiscardedHandCardIdsByPid = {};
  if (!Array.isArray(G.uiMastermindOncePerLoopUsedHandCardIds)) {
    G.uiMastermindOncePerLoopUsedHandCardIds = [];
  }
  if (!G.uiProtagonistOncePerLoopUsedHandCardIdsByPid || typeof G.uiProtagonistOncePerLoopUsedHandCardIdsByPid !== 'object') {
    G.uiProtagonistOncePerLoopUsedHandCardIdsByPid = {};
  }
  for (const [pid, role] of Object.entries(G.seatRole)) {
    if (role === 'protagonist' && !Array.isArray(G.uiProtagonistOncePerLoopUsedHandCardIdsByPid[pid])) {
      G.uiProtagonistOncePerLoopUsedHandCardIdsByPid[pid] = [];
    }
  }
  if (typeof G.uiProtagonistADeclarationVisible !== 'boolean') G.uiProtagonistADeclarationVisible = false;
  if (typeof G.uiEventPhaseOutcome !== 'string') G.uiEventPhaseOutcome = '';
  if (!G.uiFinalGuessSelectedRoleByNpcId) G.uiFinalGuessSelectedRoleByNpcId = {};
  if (!Array.isArray(G.uiFinalGuessSolvedNpcIds)) G.uiFinalGuessSolvedNpcIds = [];
  if (!G.uiFinalGuessStatusByNpcId) G.uiFinalGuessStatusByNpcId = {};
  if (G.uiAhrWorldLine !== 'surface' && G.uiAhrWorldLine !== 'inner') G.uiAhrWorldLine = 'surface';
  if (!G.reconnectCredentialsByPid) G.reconnectCredentialsByPid = {};
}

/** 是否允许从当前手牌打出该牌（与 `playCard` 规则一致，不改状态） */
function canPlayCardCore(g: TragedyState, playerID: string, cardId: string): boolean {
  if (!canUseHandCardsAtCurrentFlowStep(g)) return false;
  const hand = g.hands[playerID];
  if (!hand || hand.indexOf(cardId) === -1) return false;
  const def = getTragedyHandCardById(cardId);
  if (!def) return false;
  const seat = g.seatRole[playerID] ?? 'protagonist';
  if (def.side === 'mastermind' && seat !== 'mastermind') return false;
  if (def.side === 'protagonist' && seat === 'mastermind') return false;
  if (def.side === 'mastermind' && def.oncePerLoop && g.mastermindOncePerLoopUsedIds.includes(cardId)) {
    return false;
  }
  if (
    def.side === 'protagonist' &&
    def.oncePerLoop &&
    (g.protagonistOncePerLoopUsedIds[playerID] ?? []).includes(cardId)
  ) {
    return false;
  }
  if (def.side === 'mastermind' && !def.oncePerLoop) {
    if (g.mastermindDailyPlayUsed >= g.mastermindDailyPlayAllowance) return false;
  }
  if (def.side === 'protagonist' && !def.oncePerLoop) {
    const used = g.protagonistDailyPlayUsed[playerID] ?? 0;
    const cap = g.protagonistDailyPlayAllowance[playerID] ?? 0;
    if (used >= cap) return false;
  }
  return true;
}

/** 执行打出：假定已通过 `canPlayCardCore` */
function applyPlayCardCore(g: TragedyState, playerID: string, cardId: string) {
  const hand = g.hands[playerID]!;
  const cardIndex = hand.indexOf(cardId);
  const def = getTragedyHandCardById(cardId)!;
  if (def.discardOnPlay) {
    hand.splice(cardIndex, 1);
  }
  if (def.side === 'mastermind') {
    if (def.oncePerLoop) {
      g.mastermindOncePerLoopUsedIds.push(cardId);
    } else {
      g.mastermindDailyPlayUsed += 1;
    }
  }
  if (def.side === 'protagonist') {
    if (def.oncePerLoop) {
      if (!g.protagonistOncePerLoopUsedIds[playerID]) {
        g.protagonistOncePerLoopUsedIds[playerID] = [];
      }
      g.protagonistOncePerLoopUsedIds[playerID].push(cardId);
    } else {
      g.protagonistDailyPlayUsed[playerID] = (g.protagonistDailyPlayUsed[playerID] ?? 0) + 1;
    }
  }
  g.field.push(toFieldSnapshot(def));
}

/** 新轮回：各版图区域「密谋」指示物枚数归零 */
function resetBoardAreaConspiracyForNewLoop(G: TragedyState) {
  for (const area of Object.values(Area)) {
    G.boardAreaConspiracy[area] = 0;
  }
}

function advanceLoopAndResetDay(G: TragedyState) {
  G.loop += 1;
  G.day = 1;
  G.field = [];
  resetBoardAreaConspiracyForNewLoop(G);
  refreshHandsForNewLoop(G);
  G.inFinalGuess = false;
  G.awaitingProtagonistFinalConsensus = false;
  clearProtagonistFinalGuessVotes(G);
  clearUiFinalGuessState(G);
  beginNewDayForAllPlayers(G);
  enterDayStartTimeSpiral(G);
}

/** 新轮回：重置剧作家与三名主人公的轮限记录，并补满各自手牌。 */
function refreshHandsForNewLoop(G: TragedyState) {
  G.mastermindOncePerLoopUsedIds = [];
  ensureUiSyncState(G);
  G.uiMastermindOncePerLoopUsedHandCardIds = [];
  for (const [pid, role] of Object.entries(G.seatRole)) {
    if (role !== 'protagonist') continue;
    G.uiProtagonistOncePerLoopUsedHandCardIdsByPid[pid] = [];
  }
  const mid = mastermindPlayerId(G.seatRole);
  if (mid) {
    G.hands[mid] = [...MASTERMIND_FULL_HAND_IDS];
  }
  for (const [pid, role] of Object.entries(G.seatRole)) {
    if (role !== 'protagonist') continue;
    G.hands[pid] = [...PROTAGONIST_FULL_HAND_IDS];
    G.protagonistOncePerLoopUsedIds[pid] = [];
  }
  clearSecretPlays(G);
  resetMastermindExForNewLoop(G);
}

/** 进入新的一天：重置各座位「非轮限」每日出牌计数；剧作家固定 3，主人公按手牌快照上限。 */
function beginNewDayForAllPlayers(G: TragedyState) {
  const mid = mastermindPlayerId(G.seatRole);
  if (mid) {
    // 剧作家固定为「一天出三张牌」
    G.mastermindDailyPlayAllowance = 3;
    G.mastermindDailyPlayUsed = 0;
  }
  for (const [pid, role] of Object.entries(G.seatRole)) {
    if (role !== 'protagonist') continue;
    G.protagonistDailyPlayAllowance[pid] = countDailyBudgetSnapshotForHand(G.hands[pid] ?? [], 'protagonist');
    G.protagonistDailyPlayUsed[pid] = 0;
  }
  clearSecretPlays(G);
  clearUiCardSelections(G);
}

// ==================== 游戏初始化 ====================

export interface TragedySetupData {
  daysPerLoop?: number;
  /** 与 UI 剧本轮回数一致；用于最终轮回判定（最后一轮夜晚后不进隙而进终） */
  maxLoops?: number;
  /** 联机对局元数据：供客户端还原开始页；`setup()` 不使用 */
  moduleId?: string;
  scenarioId?: string;
  /** 与开始页「轮回数」选择一致 */
  selectedRoundCount?: number;
}

export const TragedyLooperGame: Game<TragedyState> = {
  name: 'tragedy-looper',

  setup: (_ctx, setupData?: TragedySetupData): TragedyState => {
    const raw = setupData?.daysPerLoop;
    const daysPerLoop =
      typeof raw === 'number' && raw > 0 ? Math.min(8, Math.floor(raw)) : 3;
    const rawMax = setupData?.maxLoops;
    const maxLoops =
      typeof rawMax === 'number' && rawMax >= 2 ? Math.min(8, Math.floor(rawMax)) : 3;
    const seatRole = defaultSeatRoles();
    const hands: { [playerID: string]: string[] } = {};
    for (const pid of Object.keys(seatRole)) {
      hands[pid] = defaultStartingHandIds(seatRole[pid]);
    }

    const protagonistOncePerLoopUsedIds: { [playerID: string]: string[] } = {};
    for (const [pid, r] of Object.entries(seatRole)) {
      if (r === 'protagonist') protagonistOncePerLoopUsedIds[pid] = [];
    }

    const G: TragedyState = {
      loop: 1,
      day: 1,
      hands,
      field: [],
      gameOver: false,
      winner: null,
      failedLoops: 0,
      seatRole,
      boardAreaConspiracy: {
        [Area.Hospital]: 0,
        [Area.Shrine]: 0,
        [Area.City]: 0,
        [Area.School]: 0,
        [Area.Faraway]: 0,
      },
      mastermindOncePerLoopUsedIds: [],
      mastermindDailyPlayAllowance: 0,
      mastermindDailyPlayUsed: 0,
      protagonistDailyPlayAllowance: {},
      protagonistDailyPlayUsed: {},
      protagonistOncePerLoopUsedIds,
      daysPerLoop,
      dayFlowFlatIndex: 0,
      dayFlowSubPhaseReady: true,
      inTimeSpiral: true,
      maxLoops,
      timeSpiralEntryReason: 'day_start',
      inFinalGuess: false,
      awaitingProtagonistFinalConsensus: false,
      protagonistFinalGuessVotes: {},
      secretMastermindSlots: [null, null, null],
      secretProtagonistCardByPlayer: emptySecretProtagonistBySeats(seatRole),
      uiSelectedMastermindCardByArea: {
        [Area.Hospital]: '',
        [Area.Shrine]: '',
        [Area.City]: '',
        [Area.School]: '',
        [Area.Faraway]: '',
      },
      uiSelectedMastermindCardByNpcId: {},
      uiSelectedProtagonistCardByAreaByPid: {},
      uiSelectedProtagonistCardByNpcByPid: {},
      mastermindExHandIds: [...TRAGEDY_EX_CARD_ORDERED_IDS],
      uiMastermindExCardByArea: {
        [Area.Hospital]: '',
        [Area.Shrine]: '',
        [Area.City]: '',
        [Area.School]: '',
        [Area.Faraway]: '',
      },
      uiMastermindExCardByNpcId: {},
      uiNpcTokenOverrideByNpcId: {},
      uiNpcDisplayedSpecialTokenPathsByNpcId: {},
      uiNpcProtagonistExtraTokenIdsByNpcId: {},
      uiAreaDisplayedSpecialTokenPathsByArea: {},
      uiNpcAreaOverrideByNpcId: {},
      uiNpcAliveOverrideByNpcId: {},
      uiNpcDiscardedByNpcId: {},
      uiNpcDiscardOriginAreaByNpcId: {},
      uiNpcFarawayByNpcId: {},
      uiNpcFarawayOriginAreaByNpcId: {},
      uiNpcAppearedByNpcId: {},
      uiDiscardedHandCardIdsByPid: {},
      uiMastermindOncePerLoopUsedHandCardIds: [],
      uiProtagonistOncePerLoopUsedHandCardIdsByPid: Object.fromEntries(
        Object.entries(seatRole)
          .filter(([, r]) => r === 'protagonist')
          .map(([pid]) => [pid, [] as string[]]),
      ),
      uiAhrWorldLine: 'surface',
      uiProtagonistADeclarationVisible: false,
      uiEventPhaseOutcome: '',
      uiFinalGuessSelectedRoleByNpcId: {},
      uiFinalGuessSolvedNpcIds: [],
      uiFinalGuessStatusByNpcId: {},
      reconnectCredentialsByPid: {},
    };
    beginNewDayForAllPlayers(G);
    enterDayStartTimeSpiral(G);
    return G;
  },

  // ==================== 玩家操作 ====================

  moves: {
    /**
     * 将「额外手牌」加入当前操作者手牌（须与卡牌阵营一致；不可重复加入）。
     * 不计入开局/轮回重置补牌；加入后参与出牌、弃置等与手牌相同的 `G.hands` 规则。
     */
    addOptionalHandCardToHand({ G, ctx, playerID }: TragedyMoveCtx, arg: { cardId: string }) {
      const g = G;
      const pid = moveActorId({ G, ctx, playerID });
      const cardId = String(arg?.cardId ?? '');
      if (!pid || !cardId) return INVALID_MOVE;
      if (!OPTIONAL_TRAGEDY_HAND_CARD_IDS.has(cardId)) return INVALID_MOVE;
      const def = getTragedyHandCardById(cardId);
      if (!def) return INVALID_MOVE;
      const role = g.seatRole[pid] ?? 'protagonist';
      if (def.side === 'mastermind' && role !== 'mastermind') return INVALID_MOVE;
      if (def.side === 'protagonist' && role !== 'protagonist') return INVALID_MOVE;
      const hand = g.hands[pid] ?? [];
      if (hand.includes(cardId)) return INVALID_MOVE;
      g.hands[pid] = [...hand, cardId];
      if (role === 'protagonist') {
        g.protagonistDailyPlayAllowance[pid] = countDailyBudgetSnapshotForHand(
          g.hands[pid] ?? [],
          'protagonist',
        );
      }
    },

    // 抽卡
    drawCard({ G, ctx, playerID }: TragedyMoveCtx, count: number = 1) {
      const g = G;
      const pid = moveActorId({ G, ctx, playerID });
      if (pid !== ctx.currentPlayer) return INVALID_MOVE;
      if (!g.hands[pid]) {
        g.hands[pid] = [];
      }

      const role: PlayerSeatRole = g.seatRole[pid] ?? 'protagonist';
      const myHand = g.hands[pid] ?? [];
      const pool = handPoolIdsForRole(role).filter(id => !myHand.includes(id));

      for (let i = 0; i < count && pool.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const id = pool.splice(randomIndex, 1)[0];
        g.hands[pid].push(id);
      }
    },

    // 打出手牌
    playCard({ G, ctx, playerID }: TragedyMoveCtx, cardId: string) {
      const g = G;
      const pid = moveActorId({ G, ctx, playerID });
      if (pid !== ctx.currentPlayer) return INVALID_MOVE;
      if (!canPlayCardCore(g, pid, cardId)) return INVALID_MOVE;
      applyPlayCardCore(g, pid, cardId);
    },

    /** 剧作家设置暗置槽（0–2）；牌须仍在手牌中，且三槽之间不得重复同一张 id */
    commitSecretMastermindSlot(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { slotIndex: number; cardId: string | null },
    ) {
      const g = G;
      const pid = moveActorId({ G, ctx, playerID });
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      if (!canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      if (g.seatRole[pid] !== 'mastermind') return INVALID_MOVE;
      const slotIndex = arg.slotIndex;
      if (slotIndex !== 0 && slotIndex !== 1 && slotIndex !== 2) return INVALID_MOVE;
      let cardId = arg.cardId;
      if (cardId === '') cardId = null;
      if (cardId != null) {
        const def = getTragedyHandCardById(cardId);
        if (!def || def.side !== 'mastermind') return INVALID_MOVE;
        const hand = g.hands[pid] ?? [];
        if (!hand.includes(cardId)) return INVALID_MOVE;
        for (let i = 0; i < 3; i++) {
          if (i !== slotIndex && g.secretMastermindSlots[i] === cardId) return INVALID_MOVE;
        }
      }
      const next = [...g.secretMastermindSlots];
      next[slotIndex] = cardId;
      g.secretMastermindSlots = next;
    },

    /**
     * 主人公设置本阶段唯一暗置牌；须仍在手牌中。
     * 三名主人公本阶段不得宣言同一张牌 id（同槽位共用牌池规则）。
     */
    commitSecretProtagonistCard({ G, ctx, playerID }: TragedyMoveCtx, cardId: string | null) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      if (!canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      const pid = moveActorId({ G, ctx, playerID });
      if (g.seatRole[pid] !== 'protagonist') return INVALID_MOVE;
      if (cardId === '') cardId = null;
      if (cardId != null) {
        const def = getTragedyHandCardById(cardId);
        if (!def || def.side !== 'protagonist') return INVALID_MOVE;
        const hand = g.hands[pid] ?? [];
        if (!hand.includes(cardId)) return INVALID_MOVE;
        for (const [otherId, chosen] of Object.entries(g.secretProtagonistCardByPlayer)) {
          if (otherId !== pid && chosen === cardId) return INVALID_MOVE;
        }
      }
      g.secretProtagonistCardByPlayer[pid] = cardId;
    },

    /** UI：版图密谋值调整（联机同步） */
    adjustAreaConspiracy({ G }: TragedyMoveCtx, arg: { area: Area; delta: number }) {
      const g = G;
      ensureUiSyncState(g);
      const area = arg?.area;
      const delta = Number(arg?.delta ?? 0);
      if (!Object.values(Area).includes(area)) return INVALID_MOVE;
      if (!Number.isFinite(delta) || delta === 0) return INVALID_MOVE;
      g.boardAreaConspiracy[area] = Math.max(0, Number(g.boardAreaConspiracy[area] ?? 0) + Math.trunc(delta));
    },

    /** UI：区域剧作家卡牌选择（联机同步） */
    setUiMastermindCardByArea({ G }: TragedyMoveCtx, arg: { area: Area; cardId: string | null }) {
      const g = G;
      ensureUiSyncState(g);
      const area = arg?.area;
      if (!Object.values(Area).includes(area)) return INVALID_MOVE;
      const next = (arg?.cardId ?? '') || '';
      // 非「Ⅱ 使用行动牌」阶段禁止新出牌；允许清空已选，避免卡死
      if (next && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      g.uiSelectedMastermindCardByArea[area] = next;
    },

    /** UI：NPC 剧作家卡牌选择（联机同步） */
    setUiMastermindCardByNpcId({ G }: TragedyMoveCtx, arg: { npcId: string; cardId: string | null }) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      if (!npcId) return INVALID_MOVE;
      const next = (arg?.cardId ?? '') || '';
      // 非「Ⅱ 使用行动牌」阶段禁止新出牌；允许清空已选，避免卡死
      if (next && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      if (next) g.uiSelectedMastermindCardByNpcId[npcId] = next;
      else delete g.uiSelectedMastermindCardByNpcId[npcId];
    },

    /** UI：区域主人公卡牌选择（联机同步） */
    setUiProtagonistCardByArea(
      { G }: TragedyMoveCtx,
      arg: { pid: string; area: Area; cardId: string | null },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const pid = String(arg?.pid ?? '');
      const area = arg?.area;
      if (!pid || !Object.values(Area).includes(area)) return INVALID_MOVE;
      const next = (arg?.cardId ?? '') || '';
      // 非「Ⅱ 使用行动牌」阶段禁止新出牌；允许清空已选，避免卡死
      if (next && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      g.uiSelectedProtagonistCardByAreaByPid[pid] = {
        ...(g.uiSelectedProtagonistCardByAreaByPid[pid] ?? {}),
        [area]: next,
      };
    },

    /** UI：NPC 主人公卡牌选择（联机同步） */
    setUiProtagonistCardByNpc(
      { G }: TragedyMoveCtx,
      arg: { pid: string; npcId: string; cardId: string | null },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const pid = String(arg?.pid ?? '');
      const npcId = String(arg?.npcId ?? '');
      if (!pid || !npcId) return INVALID_MOVE;
      const next = (arg?.cardId ?? '') || '';
      // 非「Ⅱ 使用行动牌」阶段禁止新出牌；允许清空已选，避免卡死
      if (next && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      g.uiSelectedProtagonistCardByNpcByPid[pid] = {
        ...(g.uiSelectedProtagonistCardByNpcByPid[pid] ?? {}),
        [npcId]: next,
      };
    },

    /**
     * UI：指定版图区域的 EX（至多一张；空为清除该区域）。
     * 每一张 EX id 全图至多挂在一处；挂到新目标时从其它区域/NPC 上自动移除。
     */
    setUiMastermindExCardByArea(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { area: Area; cardId: string | null },
    ) {
      const g = G;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      ensureUiSyncState(g);
      const area = arg?.area;
      if (!Object.values(Area).includes(area)) return INVALID_MOVE;
      const raw = arg?.cardId;
      let next = typeof raw === 'string' ? raw.trim() : '';
      if (next === '') {
        g.uiMastermindExCardByArea[area] = '';
        return;
      }
      if (!TRAGEDY_EX_CARD_IDS.has(next)) return INVALID_MOVE;
      if (!(g.mastermindExHandIds ?? []).includes(next)) return INVALID_MOVE;
      clearMastermindExCardIdEverywhere(g, next);
      g.uiMastermindExCardByArea[area] = next;
    },

    /**
     * UI：指定 NPC 的 EX（至多一张；空为清除该 NPC）。
     */
    setUiMastermindExCardByNpcId(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { npcId: string; cardId: string | null },
    ) {
      const g = G;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '').trim();
      if (!npcId) return INVALID_MOVE;
      const raw = arg?.cardId;
      let next = typeof raw === 'string' ? raw.trim() : '';
      if (next === '') {
        delete g.uiMastermindExCardByNpcId[npcId];
        return;
      }
      if (!TRAGEDY_EX_CARD_IDS.has(next)) return INVALID_MOVE;
      if (!(g.mastermindExHandIds ?? []).includes(next)) return INVALID_MOVE;
      clearMastermindExCardIdEverywhere(g, next);
      g.uiMastermindExCardByNpcId[npcId] = next;
    },

    /** UI：NPC 指示物调整（联机同步） */
    adjustUiNpcToken(
      { G }: TragedyMoveCtx,
      arg: {
        npcId: string;
        token: 'friendly' | 'unrest' | 'plot' | 'hope' | 'despair';
        delta: number;
        /** 首次写入覆盖时的完整基准快照（避免单字段 base 污染其它指示物） */
        fullBase?: { friendly: number; unrest: number; plot: number; hope: number; despair: number };
      },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      const token = arg?.token;
      const delta = Number(arg?.delta ?? 0);
      if (
        !npcId
        || (
          token !== 'friendly'
          && token !== 'unrest'
          && token !== 'plot'
          && token !== 'hope'
          && token !== 'despair'
        )
      ) return INVALID_MOVE;
      if (!Number.isFinite(delta) || delta === 0) return INVALID_MOVE;
      const snap = arg?.fullBase;
      const prev = g.uiNpcTokenOverrideByNpcId[npcId] as
        | { friendly?: number; unrest?: number; plot?: number; hope?: number; despair?: number }
        | undefined;
      const curr =
        prev
        ?? (snap
          ? {
              friendly: Number(snap.friendly ?? 0),
              unrest: Number(snap.unrest ?? 0),
              plot: Number(snap.plot ?? 0),
              hope: Number(snap.hope ?? 0),
              despair: Number(snap.despair ?? 0),
            }
          : {
              friendly: 0,
              unrest: 0,
              plot: 0,
              hope: 0,
              despair: 0,
            });
      g.uiNpcTokenOverrideByNpcId[npcId] = {
        friendly: Math.max(0, Number(curr.friendly ?? 0)),
        unrest: Math.max(0, Number(curr.unrest ?? 0)),
        plot: Math.max(0, Number(curr.plot ?? 0)),
        hope: Math.max(0, Number(curr.hope ?? 0)),
        despair: Math.max(0, Number(curr.despair ?? 0)),
        [token]: Math.max(0, Number(curr[token] ?? 0) + Math.trunc(delta)),
      };
    },

    /** UI：NPC 主人公额外 token（可多选；联机同步；仅主人公席位可改） */
    setUiNpcProtagonistExtraTokens(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { npcId: string; tokenIds: string[] },
    ) {
      const g = G;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'protagonist') return INVALID_MOVE;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '').trim();
      if (!npcId) return INVALID_MOVE;
      const next = normalizeProtagonistExtraTokenIds(arg?.tokenIds);
      if (next.length === 0) {
        delete g.uiNpcProtagonistExtraTokenIdsByNpcId[npcId];
      } else {
        g.uiNpcProtagonistExtraTokenIdsByNpcId[npcId] = next;
      }
    },

    /** UI：NPC 卡面选用「当前版图上可得」的特殊 token 图（路径与 `npc.specialTokenImage` 一致；可多选；联机同步；仅剧作家） */
    setUiNpcDisplayedSpecialTokens(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { npcId: string; imagePaths: string[] },
    ) {
      const g = G;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      if (!npcId) return INVALID_MOVE;
      const paths = arg?.imagePaths;
      if (!Array.isArray(paths)) return INVALID_MOVE;
      const next = [...new Set(paths.map((s) => String(s ?? '').trim()).filter(Boolean))];
      if (next.length === 0) {
        delete g.uiNpcDisplayedSpecialTokenPathsByNpcId[npcId];
      } else {
        g.uiNpcDisplayedSpecialTokenPathsByNpcId[npcId] = next;
      }
    },

    /** UI：版图区域（含远方）选用特殊 token 图（可多选；联机同步；仅剧作家） */
    setUiAreaDisplayedSpecialTokens(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { area: Area; imagePaths: string[] },
    ) {
      const g = G;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      ensureUiSyncState(g);
      const area = arg?.area;
      if (!Object.values(Area).includes(area)) return INVALID_MOVE;
      const paths = arg?.imagePaths;
      if (!Array.isArray(paths)) return INVALID_MOVE;
      const next = [...new Set(paths.map((s) => String(s ?? '').trim()).filter(Boolean))];
      if (next.length === 0) {
        delete g.uiAreaDisplayedSpecialTokenPathsByArea[area];
      } else {
        g.uiAreaDisplayedSpecialTokenPathsByArea[area] = next;
      }
    },

    /** UI：NPC 区域调整（联机同步） */
    setUiNpcArea(
      { G }: TragedyMoveCtx,
      arg: { npcId: string; area: Area },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      const area = arg?.area;
      if (!npcId || !Object.values(Area).includes(area)) return INVALID_MOVE;
      delete g.uiNpcFarawayByNpcId[npcId];
      delete g.uiNpcFarawayOriginAreaByNpcId[npcId];
      g.uiNpcAreaOverrideByNpcId[npcId] = area;
    },

    /** UI：延迟登场 NPC 登场/撤回（联机同步，仅剧作家） */
    setUiNpcAppeared(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { npcId: string; appeared: boolean; area?: Area | null; originArea?: Area | null },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      const npcId = String(arg?.npcId ?? '');
      if (!npcId || typeof arg?.appeared !== 'boolean') return INVALID_MOVE;
      if (!arg.appeared) {
        delete g.uiNpcAppearedByNpcId[npcId];
        delete g.uiNpcDiscardedByNpcId[npcId];
        delete g.uiNpcDiscardOriginAreaByNpcId[npcId];
        delete g.uiNpcFarawayByNpcId[npcId];
        delete g.uiNpcFarawayOriginAreaByNpcId[npcId];
        return;
      }
      g.uiNpcAppearedByNpcId[npcId] = true;
      delete g.uiNpcDiscardedByNpcId[npcId];
      delete g.uiNpcDiscardOriginAreaByNpcId[npcId];
      delete g.uiNpcFarawayByNpcId[npcId];
      delete g.uiNpcFarawayOriginAreaByNpcId[npcId];
      const area = arg?.area;
      if (!area || !Object.values(Area).includes(area)) return;
      if (area === Area.Faraway) {
        g.uiNpcFarawayByNpcId[npcId] = true;
        const originArea = arg?.originArea;
        if (originArea && originArea !== Area.Faraway && Object.values(Area).includes(originArea)) {
          g.uiNpcFarawayOriginAreaByNpcId[npcId] = originArea;
          g.uiNpcAreaOverrideByNpcId[npcId] = originArea;
        }
        return;
      }
      g.uiNpcAreaOverrideByNpcId[npcId] = area;
    },

    /** UI：NPC 存活切换（联机同步） */
    setUiNpcAlive(
      { G }: TragedyMoveCtx,
      arg: { npcId: string; alive: boolean },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      if (!npcId || typeof arg?.alive !== 'boolean') return INVALID_MOVE;
      g.uiNpcAliveOverrideByNpcId[npcId] = arg.alive;
    },

    /** UI：NPC 弃置/还原（联机同步） */
    setUiNpcDiscarded(
      { G }: TragedyMoveCtx,
      arg: { npcId: string; discarded: boolean; originArea?: Area | null },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      if (!npcId || typeof arg?.discarded !== 'boolean') return INVALID_MOVE;
      if (arg.discarded) {
        g.uiNpcDiscardedByNpcId[npcId] = true;
        const originArea = arg?.originArea;
        if (originArea && Object.values(Area).includes(originArea)) {
          g.uiNpcDiscardOriginAreaByNpcId[npcId] = originArea;
        }
        return;
      }
      delete g.uiNpcDiscardedByNpcId[npcId];
      const origin = g.uiNpcDiscardOriginAreaByNpcId[npcId];
      if (origin && Object.values(Area).includes(origin)) {
        g.uiNpcAreaOverrideByNpcId[npcId] = origin;
      }
      delete g.uiNpcDiscardOriginAreaByNpcId[npcId];
    },

    /** UI：NPC 远方/还原（联机同步） */
    setUiNpcFaraway(
      { G }: TragedyMoveCtx,
      arg: { npcId: string; faraway: boolean; originArea?: Area | null },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const npcId = String(arg?.npcId ?? '');
      if (!npcId || typeof arg?.faraway !== 'boolean') return INVALID_MOVE;
      if (arg.faraway) {
        g.uiNpcFarawayByNpcId[npcId] = true;
        const originArea = arg?.originArea;
        if (originArea && Object.values(Area).includes(originArea)) {
          g.uiNpcFarawayOriginAreaByNpcId[npcId] = originArea;
        }
        return;
      }
      delete g.uiNpcFarawayByNpcId[npcId];
      const origin = g.uiNpcFarawayOriginAreaByNpcId[npcId];
      if (origin && Object.values(Area).includes(origin)) {
        g.uiNpcAreaOverrideByNpcId[npcId] = origin;
      }
      delete g.uiNpcFarawayOriginAreaByNpcId[npcId];
    },

    /** UI：手牌弃置/还原（联机同步） */
    setUiHandDiscardedCard(
      { G }: TragedyMoveCtx,
      arg: { pid: string; cardId: string; discarded: boolean },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const pid = String(arg?.pid ?? '');
      const cardId = String(arg?.cardId ?? '');
      const discarded = Boolean(arg?.discarded);
      if (!pid || !cardId) return INVALID_MOVE;
      const prev = g.uiDiscardedHandCardIdsByPid[pid] ?? [];
      if (discarded) {
        g.uiDiscardedHandCardIdsByPid[pid] = prev.includes(cardId) ? prev : [...prev, cardId];
        return;
      }
      g.uiDiscardedHandCardIdsByPid[pid] = prev.filter((id) => id !== cardId);
    },

    /** UI：剧作家桌面选牌导致的「本轮回限已用」手牌 id（联机同步；弃置区展示） */
    setUiMastermindOncePerLoopUsedHandCards(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { cardIds: string[] },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      const raw = arg?.cardIds;
      const next = normalizeUiOncePerLoopHandIdsForMastermind(raw);
      if (next.length > 0 && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      g.uiMastermindOncePerLoopUsedHandCardIds = next;
    },

    /** UI：主人公桌面选牌导致的「本轮回限已用」手牌 id（联机同步；弃置区展示） */
    setUiProtagonistOncePerLoopUsedHandCards(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { pid: string; cardIds: string[] },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      const pid = String(arg?.pid ?? '');
      if (!pid || g.seatRole[actor] !== 'protagonist' || actor !== pid) return INVALID_MOVE;
      if (g.seatRole[pid] !== 'protagonist') return INVALID_MOVE;
      const next = normalizeUiOncePerLoopHandIdsForProtagonist(arg?.cardIds);
      if (next.length > 0 && !canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      g.uiProtagonistOncePerLoopUsedHandCardIdsByPid[pid] = next;
    },

    /** UI：主人公A宣言弹窗显示/隐藏（联机同步） */
    setUiProtagonistADeclarationVisible(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { visible: boolean },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      if (actor !== '1') return INVALID_MOVE;
      g.uiProtagonistADeclarationVisible = Boolean(arg?.visible);
    },

    /** UI：Another Horizon Revised 表世界 / 里世界示意切换（仅剧作家；全员同步可见） */
    toggleUiAhrWorldLine({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      g.uiAhrWorldLine = g.uiAhrWorldLine === 'inner' ? 'surface' : 'inner';
    },

    /** UI：事件阶段结果（仅剧作家可改；所有人可见） */
    setUiEventPhaseOutcome(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { outcome: '' | 'not_happened' | 'happened' | 'happened_no_phenomenon' },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      const outcome = arg?.outcome;
      if (
        outcome !== ''
        && outcome !== 'not_happened'
        && outcome !== 'happened'
        && outcome !== 'happened_no_phenomenon'
      ) {
        return INVALID_MOVE;
      }
      g.uiEventPhaseOutcome = outcome;
    },

    /** UI：最终决战身份下拉选择（联机同步，主人公共享） */
    setUiFinalGuessRoleChoice(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { npcId: string; roleId: string },
    ) {
      const g = G;
      ensureUiSyncState(g);
      if (!g.inFinalGuess) return INVALID_MOVE;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'protagonist') return INVALID_MOVE;
      const npcId = String(arg?.npcId ?? '');
      if (!npcId) return INVALID_MOVE;
      const roleId = String(arg?.roleId ?? '');
      g.uiFinalGuessSelectedRoleByNpcId[npcId] = roleId;
    },

    /** UI：最终决战提交身份猜测（联机同步，主人公共享） */
    submitUiFinalGuessRole(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: {
        npcId: string;
        roleId: string;
        correctRoleId: string;
        /** 登场人物含多身份时使用；任选其一即为正确（缺省则用 correctRoleId 单一项） */
        correctRoleIds?: string[];
        orderedNpcIds: string[];
      },
    ) {
      const g = G;
      ensureUiSyncState(g);
      if (!g.inFinalGuess) return INVALID_MOVE;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'protagonist') return INVALID_MOVE;
      const npcId = String(arg?.npcId ?? '');
      const roleId = String(arg?.roleId ?? '');
      const orderedNpcIdsRaw = Array.isArray(arg?.orderedNpcIds) ? arg.orderedNpcIds : [];
      const orderedNpcIds = orderedNpcIdsRaw
        .map((id) => String(id ?? '').trim())
        .filter((id, idx, arr) => Boolean(id) && arr.indexOf(id) === idx);
      const acceptableRaw = Array.isArray(arg?.correctRoleIds)
        ? arg.correctRoleIds.map((x) => String(x ?? '').trim()).filter(Boolean)
        : [];
      const acceptable =
        acceptableRaw.length > 0 ? acceptableRaw : [String(arg?.correctRoleId ?? '').trim()].filter(Boolean);
      if (!npcId || !roleId || acceptable.length === 0 || orderedNpcIds.length === 0) return INVALID_MOVE;
      if (!orderedNpcIds.includes(npcId)) return INVALID_MOVE;
      if (g.uiFinalGuessSolvedNpcIds.includes(npcId)) return INVALID_MOVE;

      const isCorrect = acceptable.includes(roleId);
      g.uiFinalGuessSelectedRoleByNpcId[npcId] = roleId;
      g.uiFinalGuessStatusByNpcId[npcId] = isCorrect ? 'correct' : 'wrong';
      if (!isCorrect) return;

      g.uiFinalGuessSolvedNpcIds = [...g.uiFinalGuessSolvedNpcIds, npcId];
      if (g.uiFinalGuessSolvedNpcIds.length >= orderedNpcIds.length) {
        g.gameOver = true;
        g.winner = 'protagonist';
      }
    },

    /** 联机重连：上报当前座位 credentials，供剧作家生成“接管离线座位”链接 */
    registerReconnectCredential(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg: { credentials: string },
    ) {
      const g = G;
      ensureUiSyncState(g);
      const pid = moveActorId({ G, ctx, playerID });
      const credentials = String(arg?.credentials ?? '');
      if (!pid || !credentials) return INVALID_MOVE;
      g.reconnectCredentialsByPid[pid] = credentials;
    },

    /**
     * 公开结算暗置：剧作家须满 3 槽且 id 两两不同；三名主人公各须有牌且 id 互不相同。
     * 按剧作家 3 张再主人公座位序依次打出并写入 field，然后清空暗置区。
     */
    revealSecretPlays({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      if (!canUseHandCardsAtCurrentFlowStep(g)) return INVALID_MOVE;
      const actor = moveActorId({ G, ctx, playerID });
      if (g.seatRole[actor] !== 'mastermind') return INVALID_MOVE;
      const mid = mastermindPlayerId(g.seatRole);
      if (!mid) return INVALID_MOVE;
      const slots = g.secretMastermindSlots;
      if (slots.length !== 3 || slots.some(c => c == null || c === '')) return INVALID_MOVE;
      if (new Set(slots).size !== 3) return INVALID_MOVE;
      const protagIds = protagonistSeatIds(g);
      if (protagIds.length !== 3) return INVALID_MOVE;
      for (const pid of protagIds) {
        const c = g.secretProtagonistCardByPlayer[pid];
        if (c == null || c === '') return INVALID_MOVE;
      }
      const protagCards = protagIds.map(pid => g.secretProtagonistCardByPlayer[pid]!);
      if (new Set(protagCards).size !== 3) return INVALID_MOVE;

      const playOrder: { pid: string; cardId: string }[] = [
        { pid: mid, cardId: slots[0]! },
        { pid: mid, cardId: slots[1]! },
        { pid: mid, cardId: slots[2]! },
        ...protagIds.map(pid => ({ pid, cardId: g.secretProtagonistCardByPlayer[pid]! })),
      ];
      for (const { pid, cardId } of playOrder) {
        if (!canPlayCardCore(g, pid, cardId)) return INVALID_MOVE;
      }
      for (const { pid, cardId } of playOrder) {
        applyPlayCardCore(g, pid, cardId);
      }
      clearSecretPlays(g);
    },

    /** 当前子阶段「结算」：仅当该步需要剧作家/主人公点结算时有效 */
    settleCurrentFlowPhase({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      const mid = mastermindPlayerId(g.seatRole);
      if (!mid) return INVALID_MOVE;
      const meta = mainFlowMetaAt(g.dayFlowFlatIndex);
      if (meta.settleBy === 'none') return INVALID_MOVE;
      // 结算推进只允许剧作家触发，避免多人联机抢阶段
      if (moveActorId({ G, ctx, playerID }) !== mid) return INVALID_MOVE;
      g.dayFlowSubPhaseReady = true;
    },

    /** 进入下一子阶段；若本日 Ⅰ–Ⅴ 已全部结束则进入下一天；若当轮回最后一日夜晚结束则进时之缝隙（非最终轮回）或终盘（最终轮回） */
    advanceMainFlowPhase({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      const mid = mastermindPlayerId(g.seatRole);
      if (!mid) return INVALID_MOVE;
      if (moveActorId({ G, ctx, playerID }) !== mid) return INVALID_MOVE;
      const meta = mainFlowMetaAt(g.dayFlowFlatIndex);
      const subReady = g.dayFlowSubPhaseReady || meta.settleBy === 'none';
      if (!subReady) return INVALID_MOVE;
      if (meta.settleBy === 'none' && !g.dayFlowSubPhaseReady) {
        // 兼容旧局/HMR 残留状态：自动结算阶段默认视为已完成
        g.dayFlowSubPhaseReady = true;
      }
      if (g.dayFlowFlatIndex < MAIN_FLOW_LEN - 1) {
        g.dayFlowFlatIndex += 1;
        applySubPhaseEntryFlags(g);
        return;
      }
      // 本日最后一子阶段结束 → 下一天；若已为当轮回最后一日夜晚结束 → 隙或终
      if (g.day < g.daysPerLoop) {
        g.day += 1;
        beginNewDayForAllPlayers(g);
        enterDayStartTimeSpiral(g);
        return;
      }
      if (g.loop < g.maxLoops) {
        g.inTimeSpiral = true;
        g.timeSpiralEntryReason = 'loop_end';
        g.dayFlowSubPhaseReady = true;
        return;
      }
      g.inFinalGuess = true;
      g.awaitingProtagonistFinalConsensus = false;
      clearProtagonistFinalGuessVotes(g);
      clearUiFinalGuessState(g);
      g.timeSpiralEntryReason = null;
      g.dayFlowSubPhaseReady = false;
    },

    /** 返回上一子阶段（仅 Ⅰ–Ⅴ 内可回退；仅剧作家可操作） */
    retreatMainFlowPhase({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess || g.awaitingProtagonistFinalConsensus) return INVALID_MOVE;
      const mid = mastermindPlayerId(g.seatRole);
      if (!mid) return INVALID_MOVE;
      if (moveActorId({ G, ctx, playerID }) !== mid) return INVALID_MOVE;
      if (g.dayFlowFlatIndex <= 0) return INVALID_MOVE;
      g.dayFlowFlatIndex -= 1;
      // 回退后按进入该子阶段时的默认规则重置可推进状态
      applySubPhaseEntryFlags(g);
    },

    /** 主人公确认：三名主人公各确认一次后进入最终决战（支持代未登录主人公确认） */
    protagonistAckEnterFinalGuess(
      { G, ctx, playerID }: TragedyMoveCtx,
      arg?: { targetPid?: string | null },
    ) {
      const g = G;
      if (g.inFinalGuess || g.inTimeSpiral) return INVALID_MOVE;
      const actorPid = moveActorId({ G, ctx, playerID });
      const seat = g.seatRole[actorPid] ?? 'protagonist';
      if (seat !== 'protagonist') return INVALID_MOVE;
      const ids = protagonistSeatIds(g);
      if (ids.length !== 3) return INVALID_MOVE;
      const targetPid = String(arg?.targetPid ?? actorPid);
      if (!ids.includes(targetPid)) return INVALID_MOVE;
      if (g.protagonistFinalGuessVotes[targetPid]) return INVALID_MOVE;
      g.protagonistFinalGuessVotes[targetPid] = true;
      const n = ids.filter(id => g.protagonistFinalGuessVotes[id]).length;
      if (n >= 3) {
        g.inFinalGuess = true;
        g.awaitingProtagonistFinalConsensus = false;
        clearProtagonistFinalGuessVotes(g);
        clearUiFinalGuessState(g);
      }
    },

    /** 剧作家宣告本轮回失败：非最终轮回进时之缝隙；最终轮回直接进入最终决战 */
    enterTimeSpiralFromLoopFailure({ G, ctx, playerID }: TragedyMoveCtx) {
      const g = G;
      if (g.inTimeSpiral || g.inFinalGuess) return INVALID_MOVE;
      const pid = moveActorId({ G, ctx, playerID });
      const seat = g.seatRole[pid] ?? 'protagonist';
      if (seat !== 'mastermind') return INVALID_MOVE;
      g.failedLoops += 1;
      if (g.loop >= g.maxLoops) {
        g.inFinalGuess = true;
        g.inTimeSpiral = false;
        clearUiFinalGuessState(g);
        g.timeSpiralEntryReason = null;
        g.dayFlowSubPhaseReady = false;
      } else {
        g.inTimeSpiral = true;
        g.timeSpiralEntryReason = 'failure';
        g.dayFlowSubPhaseReady = true;
      }
      g.awaitingProtagonistFinalConsensus = false;
      clearProtagonistFinalGuessVotes(g);
    },

    /** 时之缝隙结束：主人公方确认 → 进入下一轮回第 1 天第 1 阶段 */
    leaveTimeSpiralNextLoop({ G }: TragedyMoveCtx) {
      const g = G;
      if (!g.inTimeSpiral) return INVALID_MOVE;
      if (g.timeSpiralEntryReason === 'day_start') {
        g.inTimeSpiral = false;
        g.timeSpiralEntryReason = null;
        g.dayFlowFlatIndex = 0;
        applySubPhaseEntryFlags(g);
        return;
      }
      advanceLoopAndResetDay(g);
    },

    // 进入下一天（新「天」= 新回合，重快照每日非轮限出牌上限）
    nextDay({ G }: TragedyMoveCtx) {
      const g = G;
      if (g.day < g.daysPerLoop) {
        g.day++;
      } else {
        g.loop++;
        g.day = 1;
        g.field = [];
        resetBoardAreaConspiracyForNewLoop(g);
        refreshHandsForNewLoop(g);
      }
      g.inFinalGuess = false;
      g.awaitingProtagonistFinalConsensus = false;
      clearProtagonistFinalGuessVotes(g);
      clearUiFinalGuessState(g);
      beginNewDayForAllPlayers(g);
      enterDayStartTimeSpiral(g);
    },

    // 重置循环（时间倒流）
    resetLoop({ G }: TragedyMoveCtx) {
      const g = G;
      g.day = 1;
      g.field = [];
      refreshHandsForNewLoop(g);
      beginNewDayForAllPlayers(g);
      g.inFinalGuess = false;
      g.awaitingProtagonistFinalConsensus = false;
      clearProtagonistFinalGuessVotes(g);
      clearUiFinalGuessState(g);
      enterDayStartTimeSpiral(g);
    },
  },

  // ==================== 回合流程 ====================
  // 一昼夜各阶段定义见 `basicData/steps.ts`（`TRAGEDY_DAY_MAIN_FLOW_FLAT` 等）；右栏顺序与局内 `dayFlowFlatIndex` 对齐。

  turn: {
    // 允许所有玩家在联机下提交各自 UI/暗置相关 move（不再被 "player not active" 拦截）
    activePlayers: { all: Stage.NULL },
    onBegin: ({ G, ctx }: Pick<TragedyMoveCtx, 'G' | 'ctx'>) => {
      const g = G;
      const playerID = ctx.currentPlayer;
      if (!g.hands[playerID]) {
        g.hands[playerID] = [];
      }
      if (g.hands[playerID].length === 0) {
        const role: PlayerSeatRole = g.seatRole[playerID] ?? 'protagonist';
        g.hands[playerID] = defaultStartingHandIds(role);
      }
    },
  },

  // ==================== 玩家元数据 ====================

  playerView: ({ G, playerID }) => {
    const g = G as unknown as TragedyState;
    const vid = playerID as string | undefined;
    const seat = vid != null ? g.seatRole[vid] : undefined;
    const viewerIsMastermind = seat === 'mastermind';

    const secretMastermindSlots = g.secretMastermindSlots.map(c => {
      if (c == null) return null;
      if (viewerIsMastermind) return c;
      return SECRET_CARD_MASK;
    });

    const secretProtagonistCardByPlayer: Record<string, string | null> = {};
    for (const [pid, raw] of Object.entries(g.secretProtagonistCardByPlayer)) {
      if (raw == null) {
        secretProtagonistCardByPlayer[pid] = null;
        continue;
      }
      secretProtagonistCardByPlayer[pid] = vid === pid ? raw : SECRET_CARD_MASK;
    }

    const hands: { [pid: string]: string[] } = {};
    for (const pid of Object.keys(g.hands)) {
      hands[pid] = vid === pid ? [...(g.hands[pid] ?? [])] : [];
    }

    const mastermindExHandIds = viewerIsMastermind ? [...(g.mastermindExHandIds ?? [])] : [];

    const reconnectCredentialsByPid: Record<string, string> = {};
    for (const [pid, cred] of Object.entries(g.reconnectCredentialsByPid ?? {})) {
      if (!cred) continue;
      // 为支持“离线接管链接”由在线玩家转发，这里对所有在线视角开放各座位重连凭据。
      reconnectCredentialsByPid[pid] = cred;
    }

    return {
      ...g,
      secretMastermindSlots,
      secretProtagonistCardByPlayer,
      hands,
      mastermindExHandIds,
      reconnectCredentialsByPid,
    };
  },
};

export default TragedyLooperGame;