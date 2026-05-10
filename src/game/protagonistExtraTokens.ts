/** 主人公专用「额外 token」：仅存 id，图路径固定在下列表中（与模组资源一致）。 */
export const PROTAGONIST_EXTRA_TOKEN_ORDER = ['communicated', 'communicated_ignore_friendly', 'dead'] as const;
export type ProtagonistExtraTokenId = (typeof PROTAGONIST_EXTRA_TOKEN_ORDER)[number];

export const PROTAGONIST_EXTRA_TOKEN_DEFS = [
  {
    id: 'communicated' as const,
    imagePath: 'assert/images/tokens/token_02.png',
    label: '已沟通',
  },
  {
    id: 'communicated_ignore_friendly' as const,
    imagePath: 'assert/images/tokens/token_03.png',
    label: '已沟通（无视友好）',
  },
  {
    id: 'dead' as const,
    imagePath: 'assert/images/tokens/token_01.png',
    label: '已死亡',
  },
] as const satisfies ReadonlyArray<{ id: ProtagonistExtraTokenId; imagePath: string; label: string }>;

/** 与各 NPC 「指示物数字」一栏配套的完整占位说明（可选用） */
export const PROTAGONIST_EXTRA_TOKEN_LEGEND_ROW = '（已沟通 已沟通（无视友好） 已死亡）';

const ID_TO_LABEL: Record<string, string> = Object.fromEntries(
  PROTAGONIST_EXTRA_TOKEN_DEFS.map((d) => [d.id, d.label]),
);

const ID_SET = new Set<string>(PROTAGONIST_EXTRA_TOKEN_ORDER);

export function normalizeProtagonistExtraTokenIds(raw: unknown): ProtagonistExtraTokenId[] {
  if (!Array.isArray(raw)) return [];
  const picked = new Set<ProtagonistExtraTokenId>();
  for (const x of raw) {
    const id = String(x ?? '').trim();
    if (ID_SET.has(id)) picked.add(id as ProtagonistExtraTokenId);
  }
  return PROTAGONIST_EXTRA_TOKEN_ORDER.filter((id) => picked.has(id));
}

/** 根据当前 NPC 已选的主人公额外 token，生成一行说明文案；未选任一 token 时返回空串 */
export function protagonistExtraTokensLegendForNpc(ids: unknown): string {
  const normalized = normalizeProtagonistExtraTokenIds(ids);
  if (normalized.length === 0) return '';
  const parts = normalized.map((id) => ID_TO_LABEL[id] ?? id);
  return `（${parts.join(' ')}）`;
}
