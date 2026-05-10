/**
 * 惨剧轮回 - 剧本数据
 * 定义不同剧本
 */

import { Area } from '../basicData/areas';

const CROWD_ID_BY_AREA: Record<Area, string> = {
  [Area.Hospital]: '__tl_incident_crowd_hospital__',
  [Area.Shrine]: '__tl_incident_crowd_shrine__',
  [Area.City]: '__tl_incident_crowd_city__',
  [Area.School]: '__tl_incident_crowd_school__',
  [Area.Faraway]: '__tl_incident_crowd_faraway__',
};

/** 写入 personId：各版图「群众」当事人（医院/神社/都市/学校/远方） */
export const INCIDENT_PERSON_AREA_CROWD_OPTIONS: readonly { readonly id: string; readonly label: string }[] = (
  Object.values(Area) as Area[]
).map((area) => ({
  id: CROWD_ID_BY_AREA[area],
  label: `${area}群众`,
}));

const crowdLabelById = new Map(INCIDENT_PERSON_AREA_CROWD_OPTIONS.map((o) => [o.id, o.label]));

/** 旧版单一「【版图】+群众」；仅兼容已存剧本 / 公开表草稿 */
export const INCIDENT_PERSON_BOARD_CROWD_ID_LEGACY = '__tl_incident_board_crowd__' as const;
export const INCIDENT_PERSON_BOARD_CROWD_LABEL_LEGACY = '【版图】+群众';

/** 解析 incident_days[].personId：若为版图群众或旧版群众 ID，返回展示名，否则 undefined */
export function labelForStoredIncidentPerson(personId: string): string | undefined {
  if (!personId) return undefined;
  const crowd = crowdLabelById.get(personId);
  if (crowd) return crowd;
  if (personId === INCIDENT_PERSON_BOARD_CROWD_ID_LEGACY) return INCIDENT_PERSON_BOARD_CROWD_LABEL_LEGACY;
  return undefined;
}

export interface Scenario {
  id: string;
  moduleId: string; // 所属模组
  name: string;
  difficulty: number; // 难度
  features: string; // 剧本特征
  story: string; // 故事背景
  directorGuide: string; // 给剧作家的指引
  ScenarioInfo: ScenarioInfo; // 剧本信息
}

export interface ScenarioInfo {
  rule_Y: string;  //规则Y
  rule_X_1: string; // 规则X1
  rule_X_2: string; // 规则X2
  npcCount: number; // NPC数量
  roundCount: number[];//剧本轮回总数(最多7轮，默认1轮，可为无限轮)；可多选一，如：[1,3,5]
  dayCount: number;//一个轮回中的天数(最多7天，默认1天)
  NpcRoles: NpcRole[];//npc对应的身份id
  incident_days: Incident_day[];//事件发生天数
  //特殊规则描述
  specialRules: string | null;
}

// npc 对应的身份 id；可配置是否延迟登场
export interface NpcRole {
  npcId: string;
  /** 主身份（兼容单身份及旧数据）；Another Horizon Revised 时为表世界身份且应与 roleIds[0] 一致 */
  roleId: string;
  /** 仅 Another Horizon Revised：两项 [表世界, 里世界]；若非空则以本数组为准，`roleId` 须与第一项一致 */
  roleIds?: string[];
  delayedAppearance?: boolean;
  /** 仅 delayedAppearance=true 时有效：描述登场时机 */
  appearanceTimingDescription?: string;
  /** 登场人物备注（编辑页填写，在剧本信息表中同步展示） */
  remark?: string;
}

/** 登场人物配置的模组身份 id 列表。AHR 等双列 `roleIds` 时保留 [表, 里] 两项且允许相同 id；其余情况与旧数据兼容 */
export function npcRoleAssignments(nr: NpcRole): string[] {
  const singleFromRoleId = (): string => String(nr.roleId ?? '').trim();

  if (Array.isArray(nr.roleIds) && nr.roleIds.length >= 2) {
    const fb = singleFromRoleId() || 'Person';
    const a = String(nr.roleIds[0] ?? '').trim() || fb;
    const b = String(nr.roleIds[1] ?? '').trim() || fb;
    return [a, b];
  }
  if (Array.isArray(nr.roleIds) && nr.roleIds.length === 1) {
    const t = String(nr.roleIds[0] ?? '').trim();
    if (t) return [t];
  }
  const single = singleFromRoleId();
  return single ? [single] : [];
}

interface Incident_day {
  day: number;
  incidentId: string;
  //特殊事件flag
  specialEventFlag: 'true' | 'false';
  /** 当事人：登场 NPC 的 npcId，或 INCIDENT_PERSON_AREA_CROWD_OPTIONS / 旧版 LEGACY ID */
  personId: string;
}


