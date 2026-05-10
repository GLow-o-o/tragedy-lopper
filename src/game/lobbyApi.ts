/** boardgame.io Lobby REST（与 `Server` 同端口） */

export const TRAGEDY_GAME_NAME = 'tragedy-looper';

export function normalizeLobbyServerUrl(server: string): string {
  return server.trim().replace(/\/+$/, '');
}

export async function lobbyCreateMatch(
  server: string,
  body: { numPlayers: number; setupData?: Record<string, unknown>; unlisted?: boolean },
): Promise<{ matchID: string }> {
  const base = normalizeLobbyServerUrl(server);
  const res = await fetch(`${base}/games/${TRAGEDY_GAME_NAME}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `创建房间失败 (${res.status})`);
  }
  return res.json() as Promise<{ matchID: string }>;
}

export async function lobbyJoinMatch(
  server: string,
  matchID: string,
  playerID: string,
  playerName: string,
): Promise<{ playerID: string; playerCredentials: string }> {
  const base = normalizeLobbyServerUrl(server);
  const res = await fetch(`${base}/games/${TRAGEDY_GAME_NAME}/${encodeURIComponent(matchID)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerID, playerName }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `加入房间失败 (${res.status})`);
  }
  return res.json() as Promise<{ playerID: string; playerCredentials: string }>;
}

/** Lobby GET 返回的玩家条目（无 credentials） */
export type LobbyMatchPlayer = {
  id: number;
  name?: string;
  isConnected?: boolean;
};

export async function lobbyGetMatch(server: string, matchID: string): Promise<{
  matchID: string;
  setupData?: Record<string, unknown>;
  players?: LobbyMatchPlayer[];
  [key: string]: unknown;
}> {
  const base = normalizeLobbyServerUrl(server);
  const res = await fetch(`${base}/games/${TRAGEDY_GAME_NAME}/${encodeURIComponent(matchID)}`);
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `读取房间失败 (${res.status})`);
  }
  return res.json() as Promise<{ matchID: string; setupData?: Record<string, unknown> }>;
}
