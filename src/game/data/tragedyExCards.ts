/**
 * 剧作家 EX 扩充牌：与常规 `hands` 完全独立的一层手牌（新轮回重置为四张）；
 * 仅剧作家可操作与在 playerView 中查看牌面列表；不参与标准打出/日用清空逻辑。
 */

export type TragedyExCardSide = 'A' | 'B' | 'C' | 'D';

export interface TragedyExCardDef {
  id: string;
  letter: TragedyExCardSide;
  shortLabel: string;
}

/** 与其它惨剧手牌区分的前缀（不得写入 hands / OPTIONAL_TRAGEDY_HAND_CARD_IDS） */
export const TRAGEDY_EX_CARD_ID_PREFIX = 'tl_ui_ex_' as const;

export const TRAGEDY_EX_CARD_DEFS: readonly TragedyExCardDef[] = [
  { id: `${TRAGEDY_EX_CARD_ID_PREFIX}a`, letter: 'A', shortLabel: 'EX-A' },
  { id: `${TRAGEDY_EX_CARD_ID_PREFIX}b`, letter: 'B', shortLabel: 'EX-B' },
  { id: `${TRAGEDY_EX_CARD_ID_PREFIX}c`, letter: 'C', shortLabel: 'EX-C' },
  { id: `${TRAGEDY_EX_CARD_ID_PREFIX}d`, letter: 'D', shortLabel: 'EX-D' },
] as const;

export const TRAGEDY_EX_CARD_IDS: ReadonlySet<string> = new Set(TRAGEDY_EX_CARD_DEFS.map((c) => c.id));

/** 开局 / 每轮回重置 EX 手牌顺序 */
export const TRAGEDY_EX_CARD_ORDERED_IDS: readonly string[] = TRAGEDY_EX_CARD_DEFS.map((d) => d.id);

export function isTragedyExCardId(cardId: string): boolean {
  return TRAGEDY_EX_CARD_IDS.has(cardId);
}
