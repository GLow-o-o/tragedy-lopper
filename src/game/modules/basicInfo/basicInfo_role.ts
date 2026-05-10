/**
 * 惨剧轮回 - 模组身份的基础信息格式
 * 定义模组身份的基础信息格式
 */

/** 模组身份可选特征标签（可多选并存） */
export type RoleFeatureTag = '无视友好' | '必定无视友好' | '不死' | '傀儡无视友好';

export const ROLE_FEATURE_TAGS: readonly RoleFeatureTag[] = [
  '无视友好',
  '必定无视友好',
  '不死',
  '傀儡无视友好',
];

export function normalizeRoleFeatureTags(raw: unknown): RoleFeatureTag[] {
  const set = new Set<RoleFeatureTag>();
  const tryAdd = (s: string) => {
    const t = s.trim();
    if (t === '无视友好' || t === '必定无视友好' || t === '不死' || t === '傀儡无视友好') {
      set.add(t);
    }
  };
  if (Array.isArray(raw)) {
    for (const x of raw) {
      if (typeof x === 'string') tryAdd(x);
    }
  } else if (typeof raw === 'string') {
    tryAdd(raw);
  }
  return ROLE_FEATURE_TAGS.filter((tag) => set.has(tag));
}

/** 一览 / 主界面展示用 */
export function formatRoleFeaturesList(raw: unknown): string {
  const list = normalizeRoleFeatureTags(raw);
  return list.length ? list.join('、') : '';
}

export interface RoleBasicInfo {
  roleId: string; // 身份ID
  roleName: string; // 身份名称
  maxCount: '' | number; // 身份上限
  /** 身份特征，可多选 */
  features: RoleFeatureTag[];
  /** 可为空数组；各条 ability 的 description 允许为空字符串 */
  abilitys: ability[];
}

export interface ability {
  abilityId: string;
  abilityType: '强制' | '任意能力' | '失败条件';
  /** 能力正文，允许为空字符串 */
  description: string;
}

export const Person: RoleBasicInfo = {
  roleId: 'Person',
  roleName: '平民',
  maxCount: '',
  features: [],
  abilitys: [],
};
