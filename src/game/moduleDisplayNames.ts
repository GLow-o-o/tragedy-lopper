/**
 * 规则 / 事件 / 身份显示名：优先当前模组数据，回落到 First Steps 示例模组（兼容旧剧本）。
 */
import moduleIndex from './modules/moduleIndex';
import { Person } from './modules/basicInfo/basicInfo_role';
import { rulesIndex } from './modules/firstSteps_Example/rules';
import { incidentsIndex } from './modules/firstSteps_Example/incidents';
import { rolesIndex } from './modules/firstSteps_Example/roles';

export function ruleDisplayNameForModule(moduleId: string | undefined, ruleId: string): string {
  if (!ruleId) return '（无）';
  const mod = moduleIndex.find(m => m.id === moduleId);
  const rule = mod?.rules.find(r => r.ruleId === ruleId);
  if (rule) return rule.ruleName;
  const fallback = Object.values(rulesIndex).find(r => r.ruleId === ruleId);
  return fallback ? fallback.ruleName : ruleId;
}

export function incidentDisplayNameForModule(moduleId: string | undefined, incidentId: string): string {
  if (!incidentId) return '（无）';
  const mod = moduleIndex.find(m => m.id === moduleId);
  const inc = mod?.incidents.find(i => i.incidentId === incidentId);
  if (inc) return inc.incidentName;
  const fallback = Object.values(incidentsIndex).find(i => i.incidentId === incidentId);
  return fallback ? fallback.incidentName : incidentId;
}

export function roleDisplayNameForModule(moduleId: string | undefined, roleId: string): string {
  if (roleId === Person.roleId) return Person.roleName;
  const mod = moduleIndex.find(m => m.id === moduleId);
  const role = mod?.roles.find(r => r.roleId === roleId);
  if (role) return role.roleName;
  const fallback = Object.values(rolesIndex).find(r => r.roleId === roleId);
  return fallback ? fallback.roleName : roleId;
}
