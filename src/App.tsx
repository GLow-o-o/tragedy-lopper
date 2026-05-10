//鸣谢名单：感谢惨剧轮回联机群和数据库的群友无偿帮我纠错和提意见
//特别感谢@小叶摸鱼儿的打赏
//本项目仅供学习交流使用，请勿用于商业用途
// filepath: src/App.tsx
/// <reference types="vite/client" />
import React from 'react';
import { useEffect, useState } from 'react';
import logoBg from './game/assert/images/logos/logo.png';
import TragedyClient from './game/Client';
import { GameSetupProvider, type MultiplayerSession } from './game/gameSetupContext';
import {
    lobbyCreateMatch,
    lobbyGetMatch,
    lobbyJoinMatch,
    normalizeLobbyServerUrl,
    type LobbyMatchPlayer,
} from './game/lobbyApi';
import moduleIndex from './game/modules/moduleIndex';
import { scenariosIndex } from './game/scenarios/secenariosIndex';
import { npcIndex } from './game/npc/npcIndex';
import { formatRoleFeaturesList } from './game/modules/basicInfo/basicInfo_role';
import {
    incidentDisplayNameForModule,
    roleDisplayNameForModule,
    ruleDisplayNameForModule,
} from './game/moduleDisplayNames';
import {
  ClosedScriptScenarioSheet,
  createEmptyProtagonistPublicSheetDraft,
  type ProtagonistPublicSheetDraft,
} from './game/components/ClosedScriptScenarioSheet';
import { AppendModulePage } from './game/components/AppendModulePage';
import { ModuleOverviewPage } from './game/components/ModuleOverviewPage';
import { AppendScenarioPage } from './game/components/AppendScenarioPage';
import { ScenarioOverviewPage } from './game/components/ScenarioOverviewPage';
import { AppendNpcPage } from './game/components/AppendNpcPage';
import { NpcOverviewPage } from './game/components/NpcOverviewPage';
import { TRAGEDY_LOOPER_SEATS, isMastermind } from './game/players/playerSeats';
import { loadProtagonistPublicSheetDraft, saveProtagonistPublicSheetDraft } from './game/protagonistPublicSheetStorage';
import type { ModuleBasicInfo } from './game/modules/basicInfo/basicInfo_module';
import { labelForStoredIncidentPerson, type Scenario } from './game/scenarios/basicInfo_scenario';

const scenarios = Object.values(scenariosIndex);

const guestMpJoinDedupe = new Set<string>();
const MP_GUEST_SEAT_IDS = TRAGEDY_LOOPER_SEATS
    .filter((seat) => !isMastermind(seat.playerId))
    .map((seat) => seat.playerId);

function isSeatOccupied(players: LobbyMatchPlayer[] | undefined, seatId: string): boolean {
    if (!Array.isArray(players)) return false;
    const p = players.find((item) => String(item?.id) === seatId);
    if (!p) return false;
    if (typeof p.name === 'string' && p.name.trim()) return true;
    return p.isConnected === true;
}

function buildGuestJoinSeatCandidates(linkSeatId: string | null, players: LobbyMatchPlayer[] | undefined): string[] {
    const candidates: string[] = [];
    if (typeof linkSeatId === 'string' && /^[0123]$/.test(linkSeatId)) {
        candidates.push(linkSeatId);
    }
    for (const seatId of MP_GUEST_SEAT_IDS) {
        if (seatId === linkSeatId) continue;
        if (!isSeatOccupied(players, seatId)) {
            candidates.push(seatId);
        }
    }
    return candidates;
}

function friendlyLobbyErrorMessage(err: unknown): string {
    const raw = err instanceof Error ? err.message : String(err);
    const msg = raw.trim();
    const lower = msg.toLowerCase();
    const serverUnavailable =
        lower.includes('econnrefused') ||
        lower.includes('failed to fetch') ||
        lower.includes('networkerror') ||
        lower.includes('fetch failed') ||
        /创建房间失败\s*\(500\)/.test(msg);

    if (serverUnavailable) {
        return '无法连接到游戏服务。请先在项目目录运行 npm run server（默认端口 8000），再重试邀请。';
    }
    return msg || '联机请求失败，请稍后重试。';
}

function defaultGameServerUrl(): string {
    const raw = import.meta.env.VITE_BGIO_SERVER as string | undefined;
    if (raw && typeof raw === 'string' && raw.trim()) {
        return normalizeLobbyServerUrl(raw);
    }
    /** 单隧道：游戏服与前端同 Origin，由 Vite 代理到本机 8000（见 vite.config.ts） */
    if (import.meta.env.VITE_BGIO_THROUGH_VITE === 'true') {
        if (typeof window === 'undefined') return 'http://127.0.0.1:5173';
        return normalizeLobbyServerUrl(window.location.origin);
    }
    if (typeof window === 'undefined') return 'http://localhost:8000';
    return normalizeLobbyServerUrl(
        `${window.location.protocol}//${window.location.hostname}:8000`,
    );
}

/**
 * 发给外网玩家的 Lobby/Socket 地址：
 * 单隧道模式下可强制使用公网前端 Origin，避免邀请链接携带局域网/localhost。
 */
function publicInviteServerUrl(serverUrl: string): string {
    if (import.meta.env.VITE_BGIO_THROUGH_VITE === 'true') {
        const raw = import.meta.env.VITE_PUBLIC_APP_ORIGIN as string | undefined;
        if (raw && typeof raw === 'string' && raw.trim()) {
            return normalizeLobbyServerUrl(raw);
        }
    }
    return normalizeLobbyServerUrl(serverUrl);
}

/** 邀请链接里的前端地址：穿透开发时可设为公网 Origin；未设则用当前页。会保留本页 pathname（含 Vite base）。 */
function publicAppPageBase(): string {
    const raw = import.meta.env.VITE_PUBLIC_APP_ORIGIN as string | undefined;
    if (raw && typeof raw === 'string' && raw.trim()) {
        const base = normalizeLobbyServerUrl(raw);
        if (typeof window === 'undefined') return `${base}/`;
        const path = window.location.pathname || '/';
        return `${base}${path.startsWith('/') ? path : `/${path}`}`;
    }
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}`;
}

/** 房间链接（首次加入）：`mp=1&match=&srv=`，可选 `seat`。带密钥重连使用同一域名参数另加 `cred` 与 `pid` 或 `seat`（见 Client `buildTakeoverJoinUrl`）。 */
function buildPlayerJoinPageUrl(serverUrl: string, matchID: string, seatPlayerId?: string): string {
    const u = new URL(publicAppPageBase());
    u.searchParams.set('mp', '1');
    u.searchParams.set('match', matchID);
    if (seatPlayerId && /^[0123]$/.test(seatPlayerId)) {
        u.searchParams.set('seat', seatPlayerId);
    } else {
        u.searchParams.delete('seat');
    }
    u.searchParams.set('srv', normalizeLobbyServerUrl(serverUrl));
    return u.toString();
}

function setupNumsForInvite(
    scenario: (typeof scenarios)[number] | undefined,
    roundSel: number | '',
): { daysPerLoop: number; maxLoops: number } {
    const d = scenario?.ScenarioInfo?.dayCount;
    const daysPerLoop = typeof d === 'number' && d > 0 ? Math.min(8, d) : 8;
    let n = 7;
    if (roundSel !== '' && roundSel > 0) n = roundSel;
    else {
        const rc = scenario?.ScenarioInfo?.roundCount;
        if (Array.isArray(rc) && rc.length > 0) n = Math.max(...rc);
    }
    const maxLoops = Math.max(2, Math.min(8, Math.floor(n)));
    return { daysPerLoop, maxLoops };
}

/** 叠在 logo 上的主题色遮罩，alpha 越大背景图越不显（等效降低图的不透明度） */
const VIEWPORT_BG_OVERLAY = 'rgba(26, 26, 46, 0.78)';

const viewportBackground: React.CSSProperties = {
    backgroundColor: '#1a1a2e',
    backgroundImage: `linear-gradient(${VIEWPORT_BG_OVERLAY}, ${VIEWPORT_BG_OVERLAY}), url(${logoBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
};

function npcDisplayName(npcId: string): string {
    const incidentLabel = labelForStoredIncidentPerson(npcId);
    if (incidentLabel) return incidentLabel;
    const npc = Object.values(npcIndex).find(n => n.id === npcId);
    return npc ? npc.name : npcId;
}

const LOCAL_SEAT_STORAGE_KEY = 'tl-local-seat-player-id';
const MULTIPLAYER_RECONNECT_STORAGE_KEY = 'tl-mp-reconnect-session';

function saveMultiplayerReconnectSession(session: MultiplayerSession): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MULTIPLAYER_RECONNECT_STORAGE_KEY, JSON.stringify(session));
    } catch {
        /* */
    }
}

function loadMultiplayerReconnectSession(): MultiplayerSession | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(MULTIPLAYER_RECONNECT_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<MultiplayerSession>;
        if (
            typeof parsed?.serverUrl === 'string' &&
            typeof parsed?.matchID === 'string' &&
            typeof parsed?.playerID === 'string' &&
            typeof parsed?.credentials === 'string' &&
            parsed.serverUrl.trim() &&
            parsed.matchID.trim() &&
            parsed.playerID.trim() &&
            parsed.credentials.trim()
        ) {
            return {
                serverUrl: normalizeLobbyServerUrl(parsed.serverUrl),
                matchID: parsed.matchID,
                playerID: parsed.playerID,
                credentials: parsed.credentials,
            };
        }
    } catch {
        /* */
    }
    return null;
}

function clearMultiplayerReconnectSession(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(MULTIPLAYER_RECONNECT_STORAGE_KEY);
    } catch {
        /* */
    }
}

function readInitialLocalSeatPlayerId(): string {
    if (typeof window === 'undefined') return '0';
    try {
        const v = sessionStorage.getItem(LOCAL_SEAT_STORAGE_KEY);
        if (v === '0' || v === '1' || v === '2' || v === '3') return v;
    } catch {
        /* private mode */
    }
    return '0';
}

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [localSeatPlayerId, setLocalSeatPlayerId] = useState<string>(readInitialLocalSeatPlayerId);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [showModuleInfo, setShowModuleInfo] = useState<boolean>(false);
    const [showScenarioInfo, setShowScenarioInfo] = useState<boolean>(false);
    const [showAppendModulePage, setShowAppendModulePage] = useState<boolean>(false);
    const [showModuleOverviewPage, setShowModuleOverviewPage] = useState<boolean>(false);
    const [appendEditingModule, setAppendEditingModule] = useState<ModuleBasicInfo | undefined>(undefined);
    const [showAppendScenarioPage, setShowAppendScenarioPage] = useState<boolean>(false);
    const [showScenarioOverviewPage, setShowScenarioOverviewPage] = useState<boolean>(false);
    const [showNpcOverviewPage, setShowNpcOverviewPage] = useState<boolean>(false);
    const [showAppendNpcPage, setShowAppendNpcPage] = useState<boolean>(false);
    const [appendEditingScenario, setAppendEditingScenario] = useState<Scenario | undefined>(undefined);
    const [overviewScenarioModuleId, setOverviewScenarioModuleId] = useState<string>('');
    const [overviewScenarioId, setOverviewScenarioId] = useState<string>('');
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [selectedRoundCount, setSelectedRoundCount] = useState<number | ''>('');
    const [protagonistSheetDraft, setProtagonistSheetDraft] = useState<ProtagonistPublicSheetDraft>(() =>
        createEmptyProtagonistPublicSheetDraft(),
    );
    const [activeMultiplayer, setActiveMultiplayer] = useState<MultiplayerSession | null>(null);
    const [pendingOnlineInvite, setPendingOnlineInvite] = useState<{
        serverUrl: string;
        matchID: string;
        hostCredentials: string;
    } | null>(null);
    const [inviteBusy, setInviteBusy] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteCopyMessage, setInviteCopyMessage] = useState<string | null>(null);
    const [guestJoinLoading, setGuestJoinLoading] = useState(false);
    const [guestJoinError, setGuestJoinError] = useState<string | null>(null);
    const [reconnectBusy, setReconnectBusy] = useState(false);
    const [savedReconnectSession, setSavedReconnectSession] = useState<MultiplayerSession | null>(null);
    /** 房主等待开始时：各座位是否已与房间建立 Socket（来自 Lobby 轮询） */
    const [lobbySeatSocketOnline, setLobbySeatSocketOnline] = useState<Record<string, boolean>>({});

    const isLocalMastermind = isMastermind(localSeatPlayerId);

    useEffect(() => {
        try {
            sessionStorage.setItem(LOCAL_SEAT_STORAGE_KEY, localSeatPlayerId);
        } catch {
            /* */
        }
    }, [localSeatPlayerId]);

    // 根据选中的模组筛选剧本
    const filteredScenarios = selectedModule
        ? scenarios.filter(s => s.moduleId === selectedModule)
        : scenarios;

    const selectedModuleData = moduleIndex.find(m => m.id === selectedModule);
    const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);

    const clearStoredReconnectSession = () => {
        clearMultiplayerReconnectSession();
        setSavedReconnectSession(null);
    };

    const applyLobbySetupData = (meta: Awaited<ReturnType<typeof lobbyGetMatch>>) => {
        const sd = meta.setupData;
        if (typeof sd?.moduleId === 'string') setSelectedModule(sd.moduleId);
        if (typeof sd?.scenarioId === 'string') {
            setSelectedScenario(sd.scenarioId);
            const sc = scenarios.find(s => s.id === sd.scenarioId);
            const rounds = sc?.ScenarioInfo.roundCount ?? [];
            if (typeof sd?.selectedRoundCount === 'number' && Number.isFinite(sd.selectedRoundCount)) {
                setSelectedRoundCount(sd.selectedRoundCount);
            } else if (rounds.length) {
                setSelectedRoundCount(rounds[0]);
            }
        }
    };

    const enterMultiplayerSession = (
        session: MultiplayerSession,
        options?: { clearInviteQuery?: boolean },
    ) => {
        const normalized: MultiplayerSession = {
            ...session,
            serverUrl: normalizeLobbyServerUrl(session.serverUrl),
        };
        setActiveMultiplayer(normalized);
        setLocalSeatPlayerId(String(normalized.playerID));
        saveMultiplayerReconnectSession(normalized);
        setSavedReconnectSession(normalized);
        setGameStarted(true);
        if (options?.clearInviteQuery) {
            window.history.replaceState({}, '', window.location.pathname);
        }
    };

    const tryReconnectSavedSession = async (session?: MultiplayerSession | null) => {
        const saved = session ?? loadMultiplayerReconnectSession();
        if (!saved) {
            setGuestJoinError('未检测到可重连的上一局信息');
            setSavedReconnectSession(null);
            return;
        }
        const dedupeKey = `${saved.serverUrl}|${saved.matchID}|reconnect|${saved.playerID}`;
        if (guestMpJoinDedupe.has(dedupeKey)) return;
        guestMpJoinDedupe.add(dedupeKey);
        setReconnectBusy(true);
        setGuestJoinLoading(true);
        setGuestJoinError(null);
        try {
            const meta = await lobbyGetMatch(saved.serverUrl, saved.matchID);
            applyLobbySetupData(meta);
            enterMultiplayerSession(saved);
        } catch {
            clearStoredReconnectSession();
            setGuestJoinError('检测到上次联机会话，但恢复失败，请重新使用邀请链接加入房间。');
        } finally {
            guestMpJoinDedupe.delete(dedupeKey);
            setReconnectBusy(false);
            setGuestJoinLoading(false);
        }
    };

    useEffect(() => {
        const refresh = () => setSavedReconnectSession(loadMultiplayerReconnectSession());
        refresh();
        if (typeof window === 'undefined') return;
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    useEffect(() => {
        if (isLocalMastermind || !selectedScenarioData?.id) {
            setProtagonistSheetDraft(createEmptyProtagonistPublicSheetDraft());
            return;
        }
        setProtagonistSheetDraft(
            loadProtagonistPublicSheetDraft(localSeatPlayerId, selectedScenarioData.id, selectedScenarioData.moduleId),
        );
    }, [isLocalMastermind, localSeatPlayerId, selectedScenarioData?.id, selectedScenarioData?.moduleId]);

    useEffect(() => {
        if (isLocalMastermind || !selectedScenarioData?.id) return;
        saveProtagonistPublicSheetDraft(
            localSeatPlayerId,
            selectedScenarioData.id,
            protagonistSheetDraft,
            selectedScenarioData.moduleId,
        );
    }, [
        isLocalMastermind,
        localSeatPlayerId,
        selectedScenarioData?.id,
        selectedScenarioData?.moduleId,
        protagonistSheetDraft,
    ]);

    useEffect(() => {
        if (!pendingOnlineInvite) {
            setLobbySeatSocketOnline({});
            setInviteCopyMessage(null);
            return;
        }
        const { serverUrl, matchID } = pendingOnlineInvite;
        let cancelled = false;
        const poll = () => {
            void lobbyGetMatch(serverUrl, matchID)
                .then((meta) => {
                    if (cancelled) return;
                    const next: Record<string, boolean> = {};
                    const players = meta.players;
                    if (Array.isArray(players)) {
                        for (const p of players) {
                            if (p && typeof p.id !== 'undefined') {
                                next[String(p.id)] = p.isConnected === true;
                            }
                        }
                    }
                    setLobbySeatSocketOnline(next);
                })
                .catch(() => {
                    /* 轮询失败时保留上一轮结果 */
                });
        };
        poll();
        const timer = window.setInterval(poll, 2000);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [pendingOnlineInvite]);

    /** 联机链接：`mp=1&match=&srv=`；可选 `seat`；若带 `cred` 与 `pid`/`seat` 则重连（与加入共用同一套参数名）。兼容旧版 `resume=1`。 */
    useEffect(() => {
        const sp = new URLSearchParams(window.location.search);
        const mpFlag = sp.get('mp');
        if (mpFlag !== '1') return;
        const match = sp.get('match');
        const seatRaw = sp.get('seat');
        const srv = sp.get('srv');
        const resumeLegacy = sp.get('resume') === '1';
        const pidRaw = sp.get('pid');
        const credRaw = sp.get('cred');
        const credTrimmed = typeof credRaw === 'string' ? credRaw.trim() : '';

        if (!match || !srv) {
            setGuestJoinError('联机链接无效');
            return;
        }

        if (resumeLegacy && !credTrimmed) {
            setGuestJoinError('重连链接无效');
            return;
        }

        const validPid = pidRaw && /^[0123]$/.test(pidRaw) ? pidRaw : '';
        const validSeat = seatRaw && /^[0123]$/.test(seatRaw) ? seatRaw : '';
        const reconnectPlayerId = credTrimmed ? validPid || validSeat : '';

        if (credTrimmed && !reconnectPlayerId) {
            setGuestJoinError('重连链接无效');
            return;
        }

        const seatParamInvalid =
            seatRaw !== null && seatRaw !== '' && !/^[0123]$/.test(seatRaw);
        const isReconnect = Boolean(reconnectPlayerId);
        if (!isReconnect && seatParamInvalid) {
            setGuestJoinError('联机链接无效');
            return;
        }

        if (isReconnect) {
            const normSrv = normalizeLobbyServerUrl(srv);
            const dedupeKey = `${normSrv}|${match}|cred|${reconnectPlayerId}`;
            if (guestMpJoinDedupe.has(dedupeKey)) return;
            guestMpJoinDedupe.add(dedupeKey);
            void (async () => {
                setGuestJoinLoading(true);
                setGuestJoinError(null);
                try {
                    const meta = await lobbyGetMatch(normSrv, match);
                    applyLobbySetupData(meta);
                    enterMultiplayerSession({
                        serverUrl: normSrv,
                        matchID: match,
                        playerID: reconnectPlayerId,
                        credentials: credTrimmed,
                    }, { clearInviteQuery: true });
                } catch (e) {
                    guestMpJoinDedupe.delete(dedupeKey);
                    setGuestJoinError(e instanceof Error ? e.message : String(e));
                } finally {
                    setGuestJoinLoading(false);
                }
            })();
            return;
        }

        const preferredSeat = validSeat;
        const normSrv = normalizeLobbyServerUrl(srv);
        const dedupeKey = `${normSrv}|${match}|${preferredSeat || 'auto'}`;
        if (guestMpJoinDedupe.has(dedupeKey)) return;
        guestMpJoinDedupe.add(dedupeKey);
        void (async () => {
            setGuestJoinLoading(true);
            setGuestJoinError(null);
            try {
                const meta = await lobbyGetMatch(normSrv, match);
                applyLobbySetupData(meta);
                const joinSeatCandidates = buildGuestJoinSeatCandidates(preferredSeat || null, meta.players);
                if (joinSeatCandidates.length === 0) {
                    throw new Error('房间已满，暂无可加入的空位');
                }
                let lastJoinError: unknown = null;
                for (const seatId of joinSeatCandidates) {
                    try {
                        const join = await lobbyJoinMatch(normSrv, match, seatId, `座位${seatId}`);
                        enterMultiplayerSession({
                            serverUrl: normSrv,
                            matchID: match,
                            playerID: join.playerID,
                            credentials: join.playerCredentials,
                        }, { clearInviteQuery: true });
                        return;
                    } catch (err) {
                        lastJoinError = err;
                    }
                }
                throw lastJoinError instanceof Error ? lastJoinError : new Error('加入房间失败');
            } catch (e) {
                guestMpJoinDedupe.delete(dedupeKey);
                setGuestJoinError(e instanceof Error ? e.message : String(e));
            } finally {
                setGuestJoinLoading(false);
            }
        })();
    }, []);

    const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(e.target.value);
        setSelectedScenario('');
        setSelectedRoundCount('');
    };

    const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedScenario(id);
        const sc = scenarios.find(s => s.id === id);
        const rounds = sc?.ScenarioInfo.roundCount ?? [];
        setSelectedRoundCount(rounds.length ? rounds[0] : '');
    };

    const roundOptions = selectedScenarioData?.ScenarioInfo.roundCount ?? [];
    const roundSelectionReady =
        roundOptions.length > 0 &&
        selectedRoundCount !== '' &&
        roundOptions.includes(selectedRoundCount);
    const canStart = Boolean(selectedModule && selectedScenario && roundSelectionReady);
    const canPressStart = canStart && isLocalMastermind;
    const setupControlsLocked = !isLocalMastermind;
    const currentInviteJoinUrl = pendingOnlineInvite
        ? buildPlayerJoinPageUrl(
            publicInviteServerUrl(pendingOnlineInvite.serverUrl),
            pendingOnlineInvite.matchID,
        )
        : '';

    const copyInviteLink = async () => {
        if (!currentInviteJoinUrl) return;
        try {
            await navigator.clipboard.writeText(currentInviteJoinUrl);
            setInviteCopyMessage('链接已复制');
        } catch {
            setInviteCopyMessage('复制失败，请手动全选链接复制');
        }
    };

    const handleInvitePlayers = async () => {
        if (!canPressStart || !selectedScenarioData) return;
        setInviteError(null);
        setInviteCopyMessage(null);
        setInviteBusy(true);
        try {
            const serverUrl = defaultGameServerUrl();
            const { daysPerLoop, maxLoops } = setupNumsForInvite(selectedScenarioData, selectedRoundCount);
            const { matchID } = await lobbyCreateMatch(serverUrl, {
                numPlayers: 4,
                setupData: {
                    daysPerLoop,
                    maxLoops,
                    moduleId: selectedModule,
                    scenarioId: selectedScenario,
                    selectedRoundCount: selectedRoundCount === '' ? undefined : selectedRoundCount,
                },
            });
            const norm = normalizeLobbyServerUrl(serverUrl);
            const hostJoin = await lobbyJoinMatch(norm, matchID, '0', '剧作家');
            setPendingOnlineInvite({
                serverUrl: norm,
                matchID,
                hostCredentials: hostJoin.playerCredentials,
            });
        } catch (e) {
            setInviteError(friendlyLobbyErrorMessage(e));
        } finally {
            setInviteBusy(false);
        }
    };

    const handleDeleteScenarioFromProject = async (scenarioData: Scenario) => {
        try {
            const res = await fetch('/api/scenarios/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenarioFileName: scenarioData.id,
                    scenarioVarName: scenarioData.id,
                    scenarioModuleId: scenarioData.moduleId,
                }),
            });
            const payload = (await res.json().catch(() => ({}))) as { message?: string };
            if (!res.ok) throw new Error(payload.message || `删除失败 (${res.status})`);
            window.alert(`已删除剧本：${scenarioData.name}`);
            window.location.reload();
        } catch (error) {
            window.alert(error instanceof Error ? error.message : String(error));
        }
    };

    const handleDeleteModuleFromProject = async (moduleInfo: ModuleBasicInfo) => {
        try {
            const res = await fetch('/api/modules/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleFileName: moduleInfo.id,
                    moduleVarName: moduleInfo.shortName,
                }),
            });
            const payload = (await res.json().catch(() => ({}))) as { message?: string };
            if (!res.ok) {
                throw new Error(payload.message || `删除失败 (${res.status})`);
            }
            window.alert(`已删除模组：${moduleInfo.fullName}`);
            window.location.reload();
        } catch (error) {
            window.alert(error instanceof Error ? error.message : String(error));
        }
    };

    if (!gameStarted) {
        if (showAppendModulePage) {
            return (
                <AppendModulePage
                    initialModuleData={appendEditingModule}
                    onClose={() => setShowAppendModulePage(false)}
                />
            );
        }
        if (showAppendScenarioPage) {
            return (
                <AppendScenarioPage
                    initialScenarioData={appendEditingScenario}
                    onClose={() => setShowAppendScenarioPage(false)}
                />
            );
        }
        if (showModuleOverviewPage) {
            return (
                <ModuleOverviewPage
                    modules={moduleIndex}
                    selectedModuleId={selectedModule}
                    onSelectModule={setSelectedModule}
                    onOpenAppend={() => {
                        setAppendEditingModule(undefined);
                        setShowAppendModulePage(true);
                    }}
                    onEditSelected={() => {
                        const target = moduleIndex.find((m) => m.id === selectedModule);
                        if (!target) return;
                        setAppendEditingModule(target);
                        setShowAppendModulePage(true);
                    }}
                    onDeleteSelected={(moduleInfo) => void handleDeleteModuleFromProject(moduleInfo)}
                    onClose={() => setShowModuleOverviewPage(false)}
                />
            );
        }
        if (showScenarioOverviewPage) {
            return (
                <ScenarioOverviewPage
                    modules={moduleIndex}
                    scenarios={scenarios}
                    selectedModuleId={overviewScenarioModuleId}
                    selectedScenarioId={overviewScenarioId}
                    onSelectModule={(moduleId) => {
                        setOverviewScenarioModuleId(moduleId);
                        setOverviewScenarioId('');
                    }}
                    onSelectScenario={setOverviewScenarioId}
                    onEditSelected={(scenarioData) => {
                        setAppendEditingScenario(scenarioData);
                        setShowAppendScenarioPage(true);
                    }}
                    onDeleteSelected={(scenarioData) => void handleDeleteScenarioFromProject(scenarioData)}
                    onClose={() => setShowScenarioOverviewPage(false)}
                />
            );
        }
        if (showAppendNpcPage) {
            return <AppendNpcPage onClose={() => setShowAppendNpcPage(false)} />;
        }
        if (showNpcOverviewPage) {
            return (
                <NpcOverviewPage
                    npcEntries={Object.entries(npcIndex)}
                    onClose={() => setShowNpcOverviewPage(false)}
                    onOpenAppend={() => {
                        setShowNpcOverviewPage(false);
                        setShowAppendNpcPage(true);
                    }}
                />
            );
        }
        return (
            <div style={styles.pageFill}>
            <div style={styles.startScreenInner}>
                <h1 style={styles.title}>🔄 惨剧轮回</h1>
                <p style={styles.subtitle}>Tragedy Looper</p>
                <p style={styles.seatHint}>点击下方座位选择本机身份（仅剧作家可更改模组、剧本、轮回数并开始游戏）</p>
                {savedReconnectSession ? (
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                style={{ ...styles.infoButton, ...(reconnectBusy ? styles.startButtonDisabled : {}) }}
                                disabled={reconnectBusy}
                                onClick={() => void tryReconnectSavedSession(savedReconnectSession)}
                                title="尝试恢复上一次联机对局"
                            >
                                {reconnectBusy ? '正在重连上一局…' : `重连上一局（P${savedReconnectSession.playerID}）`}
                            </button>
                            <button
                                type="button"
                                style={styles.infoButton}
                                onClick={() => {
                                    clearStoredReconnectSession();
                                    setGuestJoinError(null);
                                }}
                                title="彻底退出联机并清除本机保存的重连信息"
                            >
                                彻底退出联机并清除重连
                            </button>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>
                            match: {savedReconnectSession.matchID} · server: {savedReconnectSession.serverUrl}
                        </p>
                    </div>
                ) : null}
                {guestJoinLoading ? (
                    <p style={{ color: '#fce38a', marginBottom: 10 }}>正在通过联机链接加入房间…</p>
                ) : null}
                {guestJoinError ? (
                    <p style={{ color: '#f87171', marginBottom: 10 }}>{guestJoinError}</p>
                ) : null}
                <div style={styles.playerStrip}>
                    {TRAGEDY_LOOPER_SEATS.map((seat) => {
                        const isYou = localSeatPlayerId === seat.playerId;
                        const sideLabel = seat.role === 'mastermind' ? '剧作家方' : '主人公方';
                        const showOnline = Boolean(pendingOnlineInvite && lobbySeatSocketOnline[seat.playerId]);
                        return (
                            <button
                                key={seat.playerId}
                                type="button"
                                onClick={() => setLocalSeatPlayerId(seat.playerId)}
                                style={{
                                    ...styles.playerChip,
                                    ...(seat.role === 'mastermind' ? styles.playerChipMastermind : styles.playerChipProtagonist),
                                    ...(isYou ? styles.playerChipYou : {}),
                                }}
                                title={`${seat.displayName}（${sideLabel}）${showOnline ? ' · 在线' : ''}`}
                            >
                                <span style={{ ...styles.playerChipId, ...styles.playerChipText }}>P{seat.playerId}</span>
                                <span style={{ ...styles.playerChipName, ...styles.playerChipText }}>{seat.displayName}</span>
                                {showOnline ? (
                                    <span style={{ ...styles.playerChipOnline, ...styles.playerChipText }}>在线</span>
                                ) : null}
                                {isYou ? <span style={{ ...styles.playerChipBadge, ...styles.playerChipText }}>本机</span> : null}
                            </button>
                        );
                    })}
                </div>
                <div style={styles.selectionContainer}>
                    <div style={styles.selectionRow}>
                        <label style={styles.label}>选择模组：</label>
                        <select
                            style={styles.select}
                            value={selectedModule}
                            onChange={handleModuleChange}
                            disabled={setupControlsLocked}
                            title={setupControlsLocked ? '仅剧作家可更改' : undefined}
                        >
                            <option value="">-- 请选择模组 --</option>
                            {moduleIndex.map(m => (
                                <option key={m.id} value={m.id}>{m.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.selectionRow}>
                        <label style={styles.label}>选择剧本：</label>
                        <select
                            style={styles.select}
                            value={selectedScenario}
                            onChange={handleScenarioChange}
                            disabled={!selectedModule || setupControlsLocked}
                            title={setupControlsLocked ? '仅剧作家可更改' : undefined}
                        >
                            <option value="">-- 请选择剧本 --</option>
                            {filteredScenarios.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {isLocalMastermind
                                        ? s.name
                                        : (s.id.trim() || '（未命名剧本 ID）')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.selectionRow}>
                        <label style={styles.label}>轮回数：</label>
                        <select
                            style={styles.select}
                            value={selectedRoundCount === '' ? '' : String(selectedRoundCount)}
                            onChange={(e) => {
                                const v = e.target.value;
                                setSelectedRoundCount(v === '' ? '' : Number(v));
                            }}
                            disabled={!selectedScenario || roundOptions.length === 0 || setupControlsLocked}
                            title={setupControlsLocked ? '仅剧作家可更改' : undefined}
                        >
                            <option value="">-- 请选择轮回数 --</option>
                            {roundOptions.map((n) => (
                                <option key={n} value={n}>{n} 轮</option>
                            ))}
                        </select>
                        {selectedScenarioData && (
                            <span style={{ ...styles.label, marginLeft: 4 }}>
                                每轮回 {selectedScenarioData.ScenarioInfo.dayCount} 天
                            </span>
                        )}
                    </div>
                </div>

                <button
                    style={{ ...styles.startButton, ...(canPressStart ? {} : styles.startButtonDisabled) }}
                    onClick={() => {
                        if (!canPressStart) return;
                        if (pendingOnlineInvite) {
                            enterMultiplayerSession({
                                serverUrl: pendingOnlineInvite.serverUrl,
                                matchID: pendingOnlineInvite.matchID,
                                playerID: '0',
                                credentials: pendingOnlineInvite.hostCredentials,
                            });
                        } else {
                            setActiveMultiplayer(null);
                            setPendingOnlineInvite(null);
                            setInviteError(null);
                        }
                        setGameStarted(true);
                    }}
                    disabled={!canPressStart}
                    title={!isLocalMastermind ? '仅剧作家可开始游戏' : undefined}
                >
                    开始游戏
                </button>
                <div
                    style={{
                        marginTop: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            style={styles.infoButton}
                            onClick={() => {
                                setShowModuleOverviewPage(false);
                                setAppendEditingModule(undefined);
                                setShowAppendModulePage(true);
                            }}
                        >
                            追加模组
                        </button>
                        <button
                            style={styles.infoButton}
                            onClick={() => setShowModuleOverviewPage(true)}
                        >
                            查看模组一览
                        </button>
                        <button
                            style={{ ...styles.infoButton, ...(selectedModule ? {} : styles.startButtonDisabled) }}
                            onClick={() => setShowModuleInfo(true)}
                            disabled={!selectedModule}
                        >
                            显示模组信息
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            style={styles.infoButton}
                            onClick={() => {
                                setShowScenarioOverviewPage(false);
                                setAppendEditingScenario(undefined);
                                setShowAppendScenarioPage(true);
                            }}
                        >
                            追加剧本
                        </button>
                        <button
                            style={styles.infoButton}
                            onClick={() => setShowScenarioOverviewPage(true)}
                        >
                            查看剧本一览
                        </button>
                        <button
                            style={{ ...styles.infoButton, ...(selectedScenario ? {} : styles.startButtonDisabled) }}
                            onClick={() => setShowScenarioInfo(true)}
                            disabled={!selectedScenario}
                            title={
                                isLocalMastermind
                                    ? '剧作家：完整非公开信息表'
                                    : '主人公：与对局内相同版式，规则/身份/当事人请从模组候选项中选择后查看'
                            }
                        >
                            {isLocalMastermind ? '非公开信息表' : '公开信息表'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            style={styles.infoButton}
                            onClick={() => {
                                setShowNpcOverviewPage(false);
                                setShowAppendNpcPage(true);
                            }}
                        >
                            追加NPC
                        </button>
                        <button style={styles.infoButton} onClick={() => setShowNpcOverviewPage(true)}>
                            查看NPC一览
                        </button>
                    </div>
                </div>
                {isLocalMastermind ? (
                    <div style={{ marginTop: 14, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
                        <button
                            type="button"
                            style={{
                                ...styles.inviteButton,
                                ...(!canPressStart || inviteBusy ? styles.startButtonDisabled : {}),
                            }}
                            disabled={!canPressStart || inviteBusy}
                            onClick={() => void handleInvitePlayers()}
                            title={
                                canPressStart
                                    ? '在本机启动 boardgame.io 服务（npm run server）后，生成供其他玩家加入的链接'
                                    : '请先完成模组、剧本与轮回数选择'
                            }
                        >
                            邀请玩家
                        </button>
                        {inviteError ? (
                            <p style={{ color: '#f87171', fontSize: 14, marginTop: 10 }}>{inviteError}</p>
                        ) : null}
                        {pendingOnlineInvite ? (
                            <div style={styles.inviteUrlBlock}>
                                <p style={styles.inviteHelp}>
                                    请房主在本机另开终端运行 <code style={styles.inviteCode}>npm run server</code>（默认端口 8000，仅本机即可）。把下方房间链接发给玩家：首次打开会加入空位；对局中复制的同一格式链接在带上座位密钥后即为重连。房主选 P0 后点「开始游戏」。
                                    {import.meta.env.VITE_BGIO_THROUGH_VITE === 'true' ? (
                                        <> 当前为<strong>单隧道穿透</strong>：仅穿透 Vite（5173），游戏服经 Vite 代理，外网玩家只需能打开与房主相同的公网前端地址。详见 <code style={styles.inviteCode}>env.example</code>。</>
                                    ) : (
                                        <> <strong>局域网</strong>直连即可。<strong>双隧道穿透</strong>时在 <code style={styles.inviteCode}>.env</code> 配置 <code style={styles.inviteCode}>VITE_BGIO_SERVER</code>；单隧道请设 <code style={styles.inviteCode}>VITE_BGIO_THROUGH_VITE=true</code>（见 <code style={styles.inviteCode}>env.example</code>）。</>
                                    )}
                                </p>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={styles.inviteSeatLabel}>房间链接（加入 / 重连同格式）</div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            readOnly
                                            aria-label="房间联机链接"
                                            style={styles.inviteUrlInput}
                                            value={currentInviteJoinUrl}
                                            onFocus={(e) => e.currentTarget.select()}
                                        />
                                        <button
                                            type="button"
                                            style={{ ...styles.infoButton, padding: '8px 12px', whiteSpace: 'nowrap' }}
                                            onClick={() => void copyInviteLink()}
                                        >
                                            复制链接
                                        </button>
                                    </div>
                                    {inviteCopyMessage ? (
                                        <p style={{ marginTop: 6, marginBottom: 0, color: '#a7f3d0', fontSize: 12 }}>
                                            {inviteCopyMessage}
                                        </p>
                                    ) : null}
                                </div>
                                <button
                                    type="button"
                                    style={{ ...styles.infoButton, marginTop: 8 }}
                                    onClick={() => {
                                        setPendingOnlineInvite(null);
                                        setInviteError(null);
                                    }}
                                >
                                    取消联机房间
                                </button>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {showModuleInfo && selectedModuleData && (
                    <div style={styles.moduleInfoOverlay} onClick={() => setShowModuleInfo(false)} >
                        <div style={styles.moduleInfo} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>{selectedModuleData.fullName} （规则，身份，事件速查表）</h3>
                                <button style={styles.closeButton} onClick={() => setShowModuleInfo(false)}>关闭</button>
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
                                                    {/* 第一行：除 addRules 外的所有列 + 第一个 addRule */}
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

                                                    {/* 剩余 addRules 行：只显示追加规则列 */}
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
                                                    {/* 第一行：前三列 + 第一个能力 */}
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

                                                    {/* 剩余能力行：只显示第四列 */}
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
                                                    {/* 第一行：事件名 + 第一个描述 */}
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
                                                            {incident.Incident_Effects[0].description}
                                                        </td>
                                                    </tr>

                                                    {/* 剩余描述行：只显示事件描述列 */}
                                                    {incident.Incident_Effects?.slice(1).map((_, descIdx) => (
                                                        <tr key={`${idx}-desc-${descIdx}`}>
                                                            <td
                                                                style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}
                                                            >
                                                                {incident.Incident_Effects[0].description}
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
                )
                }

                {showScenarioInfo && selectedScenarioData && (
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
                                viewMode={isLocalMastermind ? 'mastermind' : 'protagonist'}
                                selectedLoopCount={selectedRoundCount === '' ? undefined : selectedRoundCount}
                                ruleDisplayName={(id) => ruleDisplayNameForModule(selectedScenarioData.moduleId, id)}
                                incidentDisplayName={(id) =>
                                    incidentDisplayNameForModule(selectedScenarioData.moduleId, id)
                                }
                                roleDisplayName={(id) => roleDisplayNameForModule(selectedScenarioData.moduleId, id)}
                                npcDisplayName={npcDisplayName}
                                protagonistDraft={isLocalMastermind ? undefined : protagonistSheetDraft}
                                onProtagonistDraftChange={
                                    isLocalMastermind
                                        ? undefined
                                        : (patch) => setProtagonistSheetDraft((prev) => ({ ...prev, ...patch }))
                                }
                            />
                        </div>
                    </div>
                )}

                {/* <div style={styles.rules}>
                    <h3>游戏规则</h3>
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div> */}
            </div>
            </div>
        );
    }




    return (
        <div style={styles.gameContainer}>
            <div style={styles.gameTopBar}>
                <button
                    type="button"
                    style={styles.infoButton}
                    onClick={() => {
                        setGameStarted(false);
                        setActiveMultiplayer(null);
                        setPendingOnlineInvite(null);
                        setInviteError(null);
                    }}
                >
                    返回上一页
                </button>
            </div>
            <GameSetupProvider
                selectedModuleData={selectedModuleData}
                selectedScenarioData={selectedScenarioData ?? undefined}
                selectedRoundCount={selectedRoundCount === '' ? undefined : selectedRoundCount}
                multiplayer={activeMultiplayer}
                localSeatPlayerId={localSeatPlayerId}
            >
                <TragedyClient />
            </GameSetupProvider>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    pageFill: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
        minWidth: '100%',
        color: '#fff',
        ...viewportBackground,
    },
    startScreenInner: {
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '40px',
        textAlign: 'center',
    },
    moduleRuleLeft: {
        border: '1px solid #ddd',
        textAlign: 'center',
        width: '100px',
    },
    moduleRuleMiddle: {
        border: '1px solid #ddd',
        width: '10px',

    },
    moduleRuleRight: {
        border: '1px solid #ddd',

        width: '700px',
    },
    moduleMiddle: {
        border: '1px solid #ddd',
        width: '10px',
    },
    roleMaxCountColumn: {
        border: '1px solid #ddd',
        width: '30px',
        minWidth: '30px',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '48px',
        color: '#e94560',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '24px',
        color: '#888',
        marginBottom: '12px',
    },
    seatHint: {
        fontSize: '14px',
        color: '#94a3b8',
        marginBottom: '14px',
        lineHeight: 1.5,
        maxWidth: '640px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    playerStrip: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '22px',
    },
    playerChip: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90px',
        height: '90px',
        padding: '4px 5px',
        borderRadius: '4px',
        border: '1px solid transparent',
        fontSize: '16px',
        lineHeight: 1.25,
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: 'pointer',
        color: '#fff',
        fontFamily: 'inherit',
    },
    playerChipMastermind: {
        backgroundColor: 'rgba(83, 52, 131, 0.95)',
        borderColor: '#a797ff',
    },
    playerChipProtagonist: {
        backgroundColor: 'rgba(15, 52, 96, 0.95)',
        borderColor: '#4ecca3',
    },
    playerChipYou: {
        outline: '1px solid #fce38a',
        outlineOffset: '1px',
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
        fontSize: '12px',
        color: '#fce38a',
    },
    description: {
        fontSize: '18px',
        lineHeight: '1.6',
        marginBottom: '30px',
    },
    startButton: {
        padding: '15px 40px',
        fontSize: '20px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '12px',
    },
    inviteButton: {
        padding: '12px 28px',
        fontSize: '16px',
        backgroundColor: '#4ecca3',
        color: '#0f172a',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
    },
    inviteUrlBlock: {
        marginTop: 14,
        textAlign: 'left' as const,
        padding: '14px 16px',
        borderRadius: '8px',
        backgroundColor: 'rgba(22, 33, 62, 0.92)',
        border: '1px solid #0f3460',
    },
    inviteHelp: {
        fontSize: '13px',
        color: '#94a3b8',
        lineHeight: 1.55,
        marginBottom: '14px',
    },
    inviteCode: {
        backgroundColor: 'rgba(15, 52, 96, 0.6)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
    },
    inviteSeatLabel: {
        fontSize: '13px',
        color: '#a797ff',
        marginBottom: '4px',
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
    startButtonDisabled: {
        backgroundColor: '#666',
        cursor: 'not-allowed',
    },
    selectionContainer: {
        marginBottom: '30px',
    },
    selectionRow: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    label: {
        fontSize: '16px',
        color: '#fff',
    },
    select: {
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '2px solid #e94560',
        backgroundColor: '#16213e',
        color: '#fff',
        minWidth: '200px',
        cursor: 'pointer',
    },
    rules: {
        textAlign: 'left',
        backgroundColor: '#16213e',
        padding: '20px',
        borderRadius: '8px',
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
        alignItems: 'left',
        textAlign: 'left',
        justifyContent: 'center',
        zIndex: 1000,
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
    closeButton: {
        padding: '6px 12px',
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    gameContainer: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        width: '100%',
        minWidth: '100%',
        color: '#fff',
        ...viewportBackground,
    },
    gameTopBar: {
        padding: '12px 20px',
        borderBottom: '1px solid #0f3460',
    },
};

export default App;