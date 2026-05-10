
// NPC卡牌相关接口定义
import { Steps } from "../basicData/steps";
import { Area } from "../basicData/areas";
import { RoleType } from "../basicData/roleTypes";

export interface npc {
    id: string; // NPC卡牌ID
    name: string; // NPC卡牌名称
    img?: string; // NPC卡牌图片URL
    roleType: RoleType[]; // NPC角色类型（多选）
    thoughts?: string; // NPC的感想（可选）
    initialArea: Area[]; // NPC初始所在区域（多选）
    forbiddenAreas?: Area[]; // NPC禁行区域列表（可选，多选）
    instability: number; // NPC不安限度
    npcState?: npcState; // NPC当前状态
    features?: string[]; // NPC特性描述（可选）
    abilitys?: ability[]; // NPC能力描述（可选）
    //是否拥有特殊token（可选）
    hasSpecialToken?: boolean;
    specialToken?: string; // 特殊token名称
    specialTokenDescription?: string; // 特殊token描述
    specialTokenImage?: string; // 特殊token图片URL
}
// NPC能力接口
export interface ability {
    id: string; // 能力ID
    friendlyPoints: number; // 需要的友好点数（≥0）
    abilityDescription: string; // 能力描述
    // 能力触发时机（可多选）
    excuteTime: Steps[];
    useLimitDay?: 1; // 能力使用次数限制(每天1次)
    useLimitRoope?: 1; // 能力使用总次数限制（可选 每轮1次）
    useLimitArea?: Area | 'currentArea' | `not:${Area}` | Area[]//能力使用区域限制
    useLimitRole?: RoleType[] | npc[]//能力使用角色限制
}

// NPC当前状态接口
export interface npcState {
    currentArea: Area | null; // 当前所在区域
    instability: number; // 当前不安程度
    friendlyPoints: number; // 当前友好点数
    conspiracyPoints: number; // 当前密谋点数
    isAlive: boolean; // 是否存活
}
