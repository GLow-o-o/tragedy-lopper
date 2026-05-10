/**
 * 惨剧轮回（桌游）风格：剧作家 vs 主人公「手牌」数据模型。
 *
 * **时间与回合（与游戏状态 `loop` / `day` 对齐）**
 * - **天**：每个「天」为 1 **回合**（全局 `day`）。
 * - **轮回**：每个「轮回」为 1 **轮次**，由多「天」组成（全局 `loop`）。
 *
 * **出牌上限（逻辑在 tragedyLooper）**
 * - **每轮回限一次**（`oncePerLoop`）：仅受轮回内已用表约束，不占「每日手牌张数上限」。
 * - **非轮限**：每个「天」开始时，按**当时手牌中**非轮限牌**张数**快照为本日该阵营可成功打出次数上限；当日累计打出不得超过该上限。
 */
import { Steps } from '../basicData/steps';
import type { PlayerSeatRole } from '../players/playerSeats';

/** 与座位阵营一致 */
export type TragedyHandCardSide = Extract<PlayerSeatRole, 'mastermind' | 'protagonist'>;

/** 主人公手牌效果类型（结算层分支用） */
export type ProtagonistCanonicalAction =
  | 'forbid_conspiracy'//禁止密谋
  | 'forbid_move'//禁止移动
  | 'goodwill_plus_one'//友好+1
  | 'goodwill_plus_two'//友好+2
  | 'hope_plus_one'//希望+1
  | 'move_vertical'//上下移动
  | 'move_horizontal'//左右移动
  | 'anxiety_plus_one'//不安+1
  | 'anxiety_plus_two'//不安+2
  | 'anxiety_minus_one'//不安-1

/** 剧作家手牌效果类型（供结算层分支） */
export type MastermindCanonicalAction =
  | 'move_vertical'//上下移动
  | 'move_horizontal'//左右移动
  | 'move_diagonal'//斜向移动
  | 'anxiety_plus_one'//不安+1  
  | 'anxiety_minus_one'//不安-1
  | 'forbid_anxiety'//禁止不安
  | 'forbid_goodwill'//禁止友好
  | 'goodwill_plus_one'//友好+1
  | 'despair_plus_one'//绝望+1
  | 'conspiracy_plus_one'//密谋+1
  | 'conspiracy_plus_two'//密谋+2

export interface TragedyHandCardDef {
  id: string;//手牌id
  side: TragedyHandCardSide;//手牌阵营
  name: string;//手牌名称
  imageUrl?: string;//剧作家手牌图片链接
  imageUrlA?: string;//主人公A手牌图片链接
  imageUrlB?: string;//主人公B手牌图片链接
  imageUrlC?: string;//主人公C手牌图片链接
  description: string;//手牌描述
  effect: string;//手牌效果
  primaryPhases: Steps[];//手牌触发时机
  protagonistAction?: ProtagonistCanonicalAction;//主人公行动
  mastermindAction?: MastermindCanonicalAction;//剧作家行动
  /**
   * true：打出后从手牌移除（本轮回内不再持有该张，下轮回开局可随整手重置补回）。
   * false：打出后仍留在手牌（用于「每轮回限一次」类：用 oncePerLoop + 局内已用表禁止重复打出）。
   */
  discardOnPlay: boolean;
  /** 每个轮回内至多成功打出一次（与 discardOnPlay:false 搭配）；为 true 时不计入「每日手牌张数上限」快照 */
  oncePerLoop?: boolean;
}

/**
 * 主人公固定手牌（每名主人公相同，共 8 张）：
 * - 禁止移动、友好+2、不安-1：每轮回限 1 次；
 * - 其余：非轮限，打出多消耗（下轮回整手重置时补回），每日上限见 `countDailyBudgetSnapshotForHand`。
 */
export const PROTAGONIST_STANDARD_HAND: readonly TragedyHandCardDef[] = [
  {
    id: 'tl_pa_forbid_conspiracy',
    side: 'protagonist',
    name: '禁止密谋',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_05.png',//主人公A手牌图片链接
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_05.png',//主人公B手牌图片链接
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_05.png',//主人公C手牌图片链接
    description: '',
    effect: '禁止密谋效果。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'forbid_conspiracy',
    discardOnPlay: true,
  },
  {
    id: 'tl_pa_forbid_move',
    side: 'protagonist',
    name: '禁止移动',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_08.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_08.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_08.png',
    description: '',
    effect: '禁止移动效果。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'forbid_move',
    discardOnPlay: false,
    oncePerLoop: true,
  },
  {
    id: 'tl_pa_goodwill_plus1',
    side: 'protagonist',
    name: '友好+1',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_03.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_03.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_03.png',
    description: '',
    effect: '友好 +1。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'goodwill_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_pa_goodwill_plus2',
    side: 'protagonist',
    name: '友好+2',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_04.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_04.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_04.png',
    description: '',
    effect: '友好 +2。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'goodwill_plus_two',
    discardOnPlay: false,
    oncePerLoop: true,
  },
  {
    id: 'tl_pa_move_ud',
    side: 'protagonist',
    name: '上下移动',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_06.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_06.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_06.png',
    description: '',
    effect: '纵轴方向移动 ×1。',
    primaryPhases: [Steps.ProtagonistAction],
    protagonistAction: 'move_vertical',
    discardOnPlay: true,
  },
  {
    id: 'tl_pa_move_lr',
    side: 'protagonist',
    name: '左右移动',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_07.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_07.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_07.png',
    description: '',
    effect: '横轴方向移动 ×1。',
    primaryPhases: [Steps.ProtagonistAction],
    protagonistAction: 'move_horizontal',
    discardOnPlay: true,
  },
  {
    id: 'tl_pa_anxiety_plus1',
    side: 'protagonist',
    name: '不安+1',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_01.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_01.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_01.png',
    description: '',
    effect: '不安 +1。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'anxiety_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_pa_anxiety_minus1',
    side: 'protagonist',
    name: '不安-1',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_02.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_02.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_02.png',
    description: '',
    effect: '不安 -1。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'anxiety_minus_one',
    discardOnPlay: false,
    oncePerLoop: true,
  },
] as const;

/**
 * 主人公可选「额外」手牌：不在开局/轮回重置补牌之列，须经 UI「加入手牌」写入 `G.hands` 后方可打出。
 */
export const PROTAGONIST_EXTRA_HAND: readonly TragedyHandCardDef[] = [
  {
    id: 'tl_pa_anxiety_plus2',
    side: 'protagonist',
    name: '不安+2',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_09.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_09.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_09.png',
    description: '',
    effect: '不安 +2（1 轮回 1 回）。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'anxiety_plus_two',
    discardOnPlay: false,
    oncePerLoop: true,
  },
  {
    id: 'tl_pa_hope_plus1',
    side: 'protagonist',
    name: '希望+1',
    imageUrlA: '../assert/images/action_cards/protagonistA_cards_10.png',
    imageUrlB: '../assert/images/action_cards/protagonistB_cards_10.png',
    imageUrlC: '../assert/images/action_cards/protagonistC_cards_10.png',
    description: '',
    effect: '希望 +1。',
    primaryPhases: [Steps.ProtagonistAction, Steps.ProtagonistAbility],
    protagonistAction: 'hope_plus_one',
    discardOnPlay: true,
  },
] as const;

/** 主人公完整手牌 id（开局与每轮回重置用；三名主人公各持一套相同 id） */
export const PROTAGONIST_FULL_HAND_IDS: readonly string[] = PROTAGONIST_STANDARD_HAND.map(c => c.id);

/**
 * 剧作家固定手牌（共 10 张）：
 * - 上下/左右/斜向移动 各 1：每轮回限 1 次（不占「每日手牌张数上限」快照）；
 * - 不安+1 ×2、不安-1 ×1、禁止不安 ×1、禁止友好 ×1、密谋+1 ×1：非轮限，打出消耗（剧作家本日总出牌上限固定为 3）；
 * - 密谋+2 ×1：每轮回限 1 次。
 */
export const MASTERMIND_ABILITY_HAND: readonly TragedyHandCardDef[] = [
  {
    id: 'tl_mm_move_ud',
    side: 'mastermind',
    name: '上下移动',
    imageUrl: '../assert/images/action_cards/mastermind_cards_08.png',
    description: '',
    effect: '纵轴方向移动 ×1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'move_vertical',
    discardOnPlay: false,
  },
  {
    id: 'tl_mm_move_lr',
    side: 'mastermind',
    name: '左右移动',
    imageUrl: '../assert/images/action_cards/mastermind_cards_09.png',
    description: '',
    effect: '横轴方向移动 ×1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'move_horizontal',
    discardOnPlay: false,
  },
  {
    id: 'tl_mm_move_diag',
    side: 'mastermind',
    name: '斜向移动',
    imageUrl: '../assert/images/action_cards/mastermind_cards_10.png',
    description: '',
    effect: '斜向移动 ×1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'move_diagonal',
    discardOnPlay: false,
    oncePerLoop: true,
  },
  {
    id: 'tl_mm_anxiety_plus_a',
    side: 'mastermind',
    name: '不安+1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_01.png',
    description: '',
    effect: '不安 +1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'anxiety_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_anxiety_plus_b',
    side: 'mastermind',
    name: '不安+1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_02.png',
    description: '',
    effect: '不安 +1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'anxiety_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_anxiety_minus',
    side: 'mastermind',
    name: '不安-1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_03.png',
    description: '',
    effect: '不安 -1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'anxiety_minus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_forbid_anxiety',
    side: 'mastermind',
    name: '禁止不安',
    imageUrl: '../assert/images/action_cards/mastermind_cards_04.png',
    description: '',
    effect: '宣言禁止不安效果。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'forbid_anxiety',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_forbid_goodwill',
    side: 'mastermind',
    name: '禁止友好',
    imageUrl: '../assert/images/action_cards/mastermind_cards_05.png',
    description: '',
    effect: '宣言禁止友好效果。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'forbid_goodwill',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_conspiracy_plus1',
    side: 'mastermind',
    name: '密谋+1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_06.png',
    description: '',
    effect: '密谋 +1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'conspiracy_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_conspiracy_plus2',
    side: 'mastermind',
    name: '密谋+2',
    imageUrl: '../assert/images/action_cards/mastermind_cards_07.png',
    description: '',
    effect: '密谋 +2。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'conspiracy_plus_two',
    discardOnPlay: false,
    oncePerLoop: true,
  },
] as const;

/**
 * 剧作家可选「额外」手牌：不在开局/轮回重置补牌之列，须经 UI「加入手牌」写入 `G.hands` 后方可打出。
 */
export const MASTERMIND_EXTRA_HAND: readonly TragedyHandCardDef[] = [
  {
    id: 'tl_mm_goodwill_plus1_opt',
    side: 'mastermind',
    name: '友好+1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_11.png',
    description: '',
    effect: '友好 +1。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'goodwill_plus_one',
    discardOnPlay: true,
  },
  {
    id: 'tl_mm_despair_plus1',
    side: 'mastermind',
    name: '绝望+1',
    imageUrl: '../assert/images/action_cards/mastermind_cards_12.png',
    description: '',
    effect: '绝望 +1（1 轮回 1 回）。',
    primaryPhases: [Steps.PlaywrightAction, Steps.PlaywrightAbility],
    mastermindAction: 'despair_plus_one',
    discardOnPlay: false,
    oncePerLoop: true,
  },
] as const;

/** 剧作家完整手牌 id 列表（开局与每轮回重置用） */
export const MASTERMIND_FULL_HAND_IDS: readonly string[] = MASTERMIND_ABILITY_HAND.map(c => c.id);

/** 可用于 UI 下拉的剧作家牌定义（标准 + 已加入手牌的额外牌由客户端按 `G.hands` 过滤额外部分） */
export const MASTERMIND_ALL_HAND_DEFS: readonly TragedyHandCardDef[] = [
  ...MASTERMIND_ABILITY_HAND,
  ...MASTERMIND_EXTRA_HAND,
];

/** 可用于 UI 下拉的主人公牌定义 */
export const PROTAGONIST_ALL_HAND_DEFS: readonly TragedyHandCardDef[] = [
  ...PROTAGONIST_STANDARD_HAND,
  ...PROTAGONIST_EXTRA_HAND,
];

/** 仅能通过「加入手牌」取得的卡牌 id（不在 `defaultStartingHandIds` / 轮回重置补牌中） */
export const OPTIONAL_TRAGEDY_HAND_CARD_IDS: ReadonlySet<string> = new Set([
  ...MASTERMIND_EXTRA_HAND.map(c => c.id),
  ...PROTAGONIST_EXTRA_HAND.map(c => c.id),
]);

const BY_ID: ReadonlyMap<string, TragedyHandCardDef> = new Map(
  [...PROTAGONIST_STANDARD_HAND, ...PROTAGONIST_EXTRA_HAND, ...MASTERMIND_ABILITY_HAND, ...MASTERMIND_EXTRA_HAND].map(
    c => [c.id, c],
  ),
);

export function getTragedyHandCardById(id: string): TragedyHandCardDef | undefined {
  return BY_ID.get(id);
}

/**
 * 本日「非每轮回限一次」牌在手牌中的张数，即该阵营本日可打出张数上限（天开始时快照）。
 */
export function countDailyBudgetSnapshotForHand(
  hand: string[],
  side: TragedyHandCardSide
): number {
  return hand.filter(id => {
    const d = getTragedyHandCardById(id);
    return Boolean(d && d.side === side && !d.oncePerLoop);
  }).length;
}

export function handPoolIdsForRole(role: PlayerSeatRole): readonly string[] {
  if (role === 'mastermind') {
    return MASTERMIND_FULL_HAND_IDS;
  }
  return [...PROTAGONIST_FULL_HAND_IDS];
}

/**
 * 开局手牌。
 * - 主人公：完整 8 张（每名主人公相同）。
 * - 剧作家：完整 10 张。
 */
export function defaultStartingHandIds(role: PlayerSeatRole): string[] {
  if (role === 'protagonist') {
    return [...PROTAGONIST_FULL_HAND_IDS];
  }
  return [...MASTERMIND_FULL_HAND_IDS];
}

export interface TragedyFieldCardSnapshot {
  id: string;
  name: string;
  side: TragedyHandCardSide;
}

export function toFieldSnapshot(def: TragedyHandCardDef): TragedyFieldCardSnapshot {
  return { id: def.id, name: def.name, side: def.side };
}
