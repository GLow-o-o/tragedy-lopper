/**
 * 惨剧轮回（桌游）标准 4 人局：1 名剧作家 vs 3 名主人公（同一阵营，共用胜利条件）。
 * boardgame.io 座位 ID 为字符串 "0".."n-1"，与 numPlayers 一致。
 */

export type PlayerSeatRole = 'mastermind' | 'protagonist';

export interface PlayerSeat {
  /** boardgame.io playerID */
  playerId: string;
  role: PlayerSeatRole;
  /** 界面显示名 */
  displayName: string;
  /** 主人公序号 1–3，剧作家为 null */
  protagonistSlot: number | null;
  /** 与原版术语对照 */
  termEn: 'Mastermind' | 'Protagonist';
}

/** 固定 4 人：玩家 0 = 剧作家，玩家 1–3 = 三名主人公 */
export const TRAGEDY_LOOPER_SEATS: readonly PlayerSeat[] = [
  {
    playerId: '0',
    role: 'mastermind',
    displayName: '剧作家',
    protagonistSlot: null,
    termEn: 'Mastermind',
  },
  {
    playerId: '1',
    role: 'protagonist',
    displayName: '主人公A',
    protagonistSlot: 1,
    termEn: 'Protagonist',
  },
  {
    playerId: '2',
    role: 'protagonist',
    displayName: '主人公B',
    protagonistSlot: 2,
    termEn: 'Protagonist',
  },
  {
    playerId: '3',
    role: 'protagonist',
    displayName: '主人公C',
    protagonistSlot: 3,
    termEn: 'Protagonist',
  },
] as const;

export const TRAGEDY_LOOPER_NUM_PLAYERS = TRAGEDY_LOOPER_SEATS.length;

export function getSeatByPlayerId(playerId: string): PlayerSeat | undefined {
  return TRAGEDY_LOOPER_SEATS.find(s => s.playerId === playerId);
}

export function isMastermind(playerId: string): boolean {
  return getSeatByPlayerId(playerId)?.role === 'mastermind';
}

/** setup 用：座位 → 阵营 */
export function defaultSeatRoles(): Record<string, PlayerSeatRole> {
  return Object.fromEntries(TRAGEDY_LOOPER_SEATS.map(s => [s.playerId, s.role]));
}
