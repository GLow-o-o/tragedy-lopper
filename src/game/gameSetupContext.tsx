import React, { createContext, useContext } from 'react';
import type { ModuleBasicInfo } from './modules/basicInfo/basicInfo_module';
import type { Scenario } from './scenarios/basicInfo_scenario';

/** 联机：连接本机或其它机器上运行的 boardgame.io `Server` */
export interface MultiplayerSession {
  serverUrl: string;
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface GameSetupContextValue {
  selectedModuleData: ModuleBasicInfo | undefined;
  selectedScenarioData: Scenario | undefined;
  selectedRoundCount: number | undefined;
  /** 非空时使用 Socket.IO 对局；为空时使用本地 Local 传输 */
  multiplayer: MultiplayerSession | null;
  /** 本地模式下本机所选座位（"0".."3"） */
  localSeatPlayerId: string;
}

const defaultGameSetup: GameSetupContextValue = {
  selectedModuleData: undefined,
  selectedScenarioData: undefined,
  selectedRoundCount: undefined,
  multiplayer: null,
  localSeatPlayerId: '0',
};

export const GameSetupContext = createContext<GameSetupContextValue>(defaultGameSetup);

export function useGameSetup(): GameSetupContextValue {
  return useContext(GameSetupContext);
}

export interface GameSetupProviderProps extends GameSetupContextValue {
  children: React.ReactNode;
}

/** 将开始页选中的模组 / 剧本 / 轮回数注入对局界面 */
export function GameSetupProvider({
  children,
  selectedModuleData,
  selectedScenarioData,
  selectedRoundCount,
  multiplayer,
  localSeatPlayerId,
}: GameSetupProviderProps) {
  const value: GameSetupContextValue = {
    selectedModuleData,
    selectedScenarioData,
    selectedRoundCount,
    multiplayer: multiplayer ?? null,
    localSeatPlayerId,
  };
  return <GameSetupContext.Provider value={value}>{children}</GameSetupContext.Provider>;
}
