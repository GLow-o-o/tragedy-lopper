/** 规则表每一格：人数上限、未使用、或表/里世界标记（如 AHR 剧本矩阵） */
export type RuleRoleLimitMaxCount = number | '' | '表' | '里';

/** 单条追加规则；description 允许为空字符串 */
export interface AddRule {
    ruleId: string;
    description: string;
}

export interface RuleBasicInfo {
    ruleId: string;
    ruleName: string;
    rolesLimits: { roleId: string; roleName: string; maxCount: RuleRoleLimitMaxCount }[]; // 规则适用的身份限制
    ruleType: 'Y' | 'X'; // 规则类型，'Y' 或 'X'
    /** 可为空数组；各条 description 均可为空 */
    addRules: AddRule[];
}