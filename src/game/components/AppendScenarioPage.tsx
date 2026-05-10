import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ClosedScriptScenarioSheet } from './ClosedScriptScenarioSheet';
import {
  INCIDENT_PERSON_AREA_CROWD_OPTIONS,
  labelForStoredIncidentPerson,
  npcRoleAssignments,
  type NpcRole,
  type Scenario,
} from '../scenarios/basicInfo_scenario';
import moduleIndex from '../modules/moduleIndex';
import { npcIndex } from '../npc/npcIndex';
import { Person } from '../modules/basicInfo/basicInfo_role';
import type { RuleRoleLimitMaxCount } from '../modules/basicInfo/basicInfo_rule';
import { NpcOverviewBody } from './NpcOverviewPage';
import { AppendNpcInstructions } from './AppendNpcPage';

/** 临时工 npc id（登场含此人时提示需与「临时工？」成对配置） */
const NPC_ID_PART_TIMER = 'npc_32';
const MODULE_ID_ANOTHER_HORIZON_REVISED = 'Another_Horizon_Revised' as const;

/** AHR：roleIds 固定为 [表世界身份, 里世界身份] */
function anotherHorizonSurfaceInnerPair(row: NpcRole): [string, string] {
  const ids = npcRoleAssignments(row);
  const surface = ids[0] ?? Person.roleId;
  const inner = ids[1] ?? Person.roleId;
  return [surface, inner];
}

/** 规则格是否为「表」「里」（可变身份侧；不计数值上限） */
function ruleLimitIsLiBiaoCell(raw: RuleRoleLimitMaxCount | unknown): boolean {
  if (raw === '表' || raw === '里') return true;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t === '表' || t === '里';
  }
  return false;
}

/** 规则格：是否视为「须至少分配 1 名登场人物」（兼容 JSON/导入后数字以字符串形式存在） */
function ruleRolesLimitRequiresAssignment(raw: RuleRoleLimitMaxCount | unknown): boolean {
  if (ruleLimitIsLiBiaoCell(raw)) return true;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return true;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t === '') return false;
    const n = Number(t);
    if (Number.isFinite(n) && n > 0) return true;
  }
  return false;
}

/** 参与「启用规则之和」的数值型上限。「表」「里」不向数值折算；仍可通过「须分配」要求至少编入一人 */
function ruleRolesLimitNumericSumPart(raw: RuleRoleLimitMaxCount | unknown): number | undefined {
  if (ruleLimitIsLiBiaoCell(raw)) return undefined;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t === '') return undefined;
    const n = Number(t);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

type AppendScenarioPageProps = {
  onClose: () => void;
  initialScenarioData?: Scenario;
};

function createEmptyScenario(): Scenario {
  const moduleId = moduleIndex[0]?.id ?? '';
  const firstNpc = Object.values(npcIndex)[0];
  const firstRole = moduleIndex[0]?.roles[0]?.roleId ?? Person.roleId;
  return {
    id: 'NEW_SCENARIO',
    moduleId,
    name: '新剧本',
    difficulty: 1,
    features: '',
    story: '',
    directorGuide: '',
    ScenarioInfo: {
      rule_Y: '',
      rule_X_1: '',
      rule_X_2: '',
      npcCount: 1,
      roundCount: [3],
      dayCount: 3,
      NpcRoles: firstNpc
        ? [
            {
              npcId: firstNpc.id,
              roleId: firstRole,
              ...(moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED
                ? { roleIds: [firstRole, firstRole] as string[] }
                : {}),
              delayedAppearance: false,
              appearanceTimingDescription: '',
            },
          ]
        : [],
      incident_days: [{ day: 1, incidentId: '', personId: firstNpc?.id ?? '', specialEventFlag: 'false' }],
      specialRules: null,
    },
  };
}

function cloneScenario(s: Scenario): Scenario {
  return JSON.parse(JSON.stringify(s)) as Scenario;
}

function parseNumberCsv(raw: string): number[] {
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function AppendScenarioPage({ onClose, initialScenarioData }: AppendScenarioPageProps) {
  const [scenario, setScenario] = useState<Scenario>(() => (initialScenarioData ? cloneScenario(initialScenarioData) : createEmptyScenario()));
  const [roundCountInput, setRoundCountInput] = useState(() => (initialScenarioData?.ScenarioInfo.roundCount ?? [3]).join(','));
  const [dayCountInput, setDayCountInput] = useState(() => String(initialScenarioData?.ScenarioInfo.dayCount ?? 3));
  const [copyMessage, setCopyMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveConflictPending, setSaveConflictPending] = useState(false);
  const [npcOverviewOpen, setNpcOverviewOpen] = useState(false);
  const [appendNpcHelpOpen, setAppendNpcHelpOpen] = useState(false);

  useEffect(() => {
    setScenario(initialScenarioData ? cloneScenario(initialScenarioData) : createEmptyScenario());
    setRoundCountInput((initialScenarioData?.ScenarioInfo.roundCount ?? [3]).join(','));
    setDayCountInput(String(initialScenarioData?.ScenarioInfo.dayCount ?? 3));
    setCopyMessage('');
    setSaveMessage('');
    setSaveError('');
    setSaveConflictPending(false);
  }, [initialScenarioData]);

  useEffect(() => {
    setScenario((prev) => {
      const normalizedDayCount = Math.max(1, Math.floor(prev.ScenarioInfo.dayCount) || 1);
      const currentRows = prev.ScenarioInfo.incident_days ?? [];
      const nextRows = Array.from({ length: normalizedDayCount }, (_, idx) => {
        const day = idx + 1;
        const byDay = currentRows.find((r) => r.day === day);
        const fallback = currentRows[idx];
        const picked = byDay ?? fallback;
        return {
          day,
          incidentId: picked?.incidentId ?? '',
          personId: picked?.personId ?? '',
          specialEventFlag: (picked?.specialEventFlag === 'true' ? 'true' : 'false') as 'true' | 'false',
        };
      });

      const unchanged =
        currentRows.length === nextRows.length &&
        currentRows.every((row, idx) => {
          const next = nextRows[idx];
          return (
            row.day === next.day &&
            row.incidentId === next.incidentId &&
            row.personId === next.personId &&
            row.specialEventFlag === next.specialEventFlag
          );
        });
      if (unchanged) return prev;
      return {
        ...prev,
        ScenarioInfo: {
          ...prev.ScenarioInfo,
          dayCount: normalizedDayCount,
          incident_days: nextRows,
        },
      };
    });
  }, [scenario.ScenarioInfo.dayCount]);

  const selectedModule = useMemo(
    () => moduleIndex.find((m) => m.id === scenario.moduleId),
    [scenario.moduleId],
  );
  const isFirstStepsModule =
    selectedModule?.id === 'First_Steps' ||
    selectedModule?.id === 'firstSteps_Example' ||
    selectedModule?.id === 'First_Steps_Example';
  const yRuleOptions = useMemo(
    () => (selectedModule?.rules ?? []).filter((r) => r.ruleType === 'Y'),
    [selectedModule],
  );
  const xRuleOptions = useMemo(
    () => (selectedModule?.rules ?? []).filter((r) => r.ruleType === 'X'),
    [selectedModule],
  );
  const x2RuleOptions = useMemo(
    () => xRuleOptions.filter((r) => r.ruleId !== scenario.ScenarioInfo.rule_X_1),
    [xRuleOptions, scenario.ScenarioInfo.rule_X_1],
  );

  const isAnotherHorizonRevisedModule = selectedModule?.id === MODULE_ID_ANOTHER_HORIZON_REVISED;
  /** 登场身份下拉：Person + 模组身份（Person 未在模组列表中时置于首项） */
  const mastermindRoleSelectOptions = useMemo(() => {
    const r = selectedModule?.roles ?? [];
    return r.some((x) => x.roleId === Person.roleId) ? r : [Person, ...r];
  }, [selectedModule]);

  /** 切换模组或载入剧本后：规则 id 须属于当前模组，否则「须分配身份」等校验会静默失效 */
  useEffect(() => {
    const mod = moduleIndex.find((m) => m.id === scenario.moduleId);
    if (!mod) return;

    setScenario((prev) => {
      if (prev.moduleId !== mod.id) return prev;

      const rules = mod.rules;
      const yOpts = rules.filter((r) => r.ruleType === 'Y');
      const xOpts = rules.filter((r) => r.ruleType === 'X');
      const lockX2 =
        mod.id === 'First_Steps' || mod.id === 'firstSteps_Example' || mod.id === 'First_Steps_Example';

      let rule_Y = prev.ScenarioInfo.rule_Y;
      let rule_X_1 = prev.ScenarioInfo.rule_X_1;
      let rule_X_2 = prev.ScenarioInfo.rule_X_2;
      let changed = false;

      if (yOpts.length === 0) {
        if (rule_Y !== '') {
          rule_Y = '';
          changed = true;
        }
      } else {
        const ty = rule_Y.trim();
        const nextY = ty && yOpts.some((r) => r.ruleId === ty) ? rule_Y : yOpts[0].ruleId;
        if (nextY !== rule_Y) {
          rule_Y = nextY;
          changed = true;
        }
      }

      if (xOpts.length === 0) {
        if (rule_X_1 !== '') {
          rule_X_1 = '';
          changed = true;
        }
      } else {
        const tx = rule_X_1.trim();
        const nextX1 = tx && xOpts.some((r) => r.ruleId === tx) ? rule_X_1 : xOpts[0].ruleId;
        if (nextX1 !== rule_X_1) {
          rule_X_1 = nextX1;
          changed = true;
        }
      }

      if (lockX2) {
        if (rule_X_2 !== '') {
          rule_X_2 = '';
          changed = true;
        }
      } else if (xOpts.length === 0) {
        if (rule_X_2 !== '') {
          rule_X_2 = '';
          changed = true;
        }
      } else {
        const x1t = rule_X_1.trim();
        const x2Candidates = xOpts.filter((r) => r.ruleId !== x1t);
        const t2 = rule_X_2.trim();
        const nextX2 =
          t2 && x2Candidates.some((r) => r.ruleId === t2) ? rule_X_2 : (x2Candidates[0]?.ruleId ?? '');
        if (nextX2 !== rule_X_2) {
          rule_X_2 = nextX2;
          changed = true;
        }
      }

      if (!changed) return prev;
      return {
        ...prev,
        ScenarioInfo: { ...prev.ScenarioInfo, rule_Y, rule_X_1, rule_X_2 },
      };
    });
  }, [scenario.moduleId]);

  /** Another Horizon Revised：roleIds 固定为 [表世界, 里世界]；其余模组不写 roleIds */
  useEffect(() => {
    setScenario((prev) => {
      const isAhr = prev.moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED;
      const NpcRoles = prev.ScenarioInfo.NpcRoles.map((row) => {
        const base = npcRoleAssignments(row);
        const ids = base.length > 0 ? base : [Person.roleId];
        if (isAhr) {
          const surface = ids[0] ?? Person.roleId;
          const innerWorld = ids.length >= 2 ? String(ids[1]) : Person.roleId;
          return {
            ...row,
            roleIds: [surface, innerWorld],
            roleId: surface,
          };
        }
        const { roleIds: _omitRoleIds, ...rest } = row;
        void _omitRoleIds;
        return { ...rest, roleId: ids[0] ?? Person.roleId };
      });
      if (JSON.stringify(prev.ScenarioInfo.NpcRoles) === JSON.stringify(NpcRoles)) return prev;
      return {
        ...prev,
        ScenarioInfo: {
          ...prev.ScenarioInfo,
          NpcRoles,
          npcCount: NpcRoles.length,
        },
      };
    });
  }, [scenario.moduleId]);

  const selectedRuleEntries = useMemo(() => {
    const ids = [scenario.ScenarioInfo.rule_Y, scenario.ScenarioInfo.rule_X_1, scenario.ScenarioInfo.rule_X_2]
      .map((s) => s.trim())
      .filter(Boolean);
    return ids
      .map((ruleId) => selectedModule?.rules.find((r) => r.ruleId === ruleId))
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
  }, [scenario.ScenarioInfo.rule_Y, scenario.ScenarioInfo.rule_X_1, scenario.ScenarioInfo.rule_X_2, selectedModule]);

  const roleCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of scenario.ScenarioInfo.NpcRoles) {
      /** 同一 NPC 表/里可为同一身份：人数统计按「每名 NPC 每个身份 id 至多计 1」 */
      const distinct = [...new Set(npcRoleAssignments(row))];
      for (const rid of distinct) {
        map.set(rid, (map.get(rid) ?? 0) + 1);
      }
    }
    return map;
  }, [scenario.ScenarioInfo.NpcRoles]);

  const roleSelfLimitMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const role of selectedModule?.roles ?? []) {
      if (typeof role.maxCount === 'number' && Number.isFinite(role.maxCount)) {
        map.set(role.roleId, role.maxCount);
      }
    }
    return map;
  }, [selectedModule]);

  /** 各身份在「当前启用的多条规则」中，数值型上限之和（「表」「里」格不参与求和）；每条规则至多计一次同名身份列 */
  const roleRuleSumMap = useMemo(() => {
    const sums = new Map<string, number>();
    for (const rule of selectedRuleEntries) {
      for (const lim of rule.rolesLimits ?? []) {
        if (!lim.roleId) continue;
        const part = ruleRolesLimitNumericSumPart(lim.maxCount);
        if (part === undefined) continue;
        sums.set(lim.roleId, (sums.get(lim.roleId) ?? 0) + part);
      }
    }
    return sums;
  }, [selectedRuleEntries]);

  /** 登场身份上限：min(启用规则数值之和, 模组上限)；在已选任一规则中为「表」「里」格子的身份完全不参与上限校验 */
  const roleLimitViolations = useMemo(() => {
    const exemptLiBiao = new Set<string>();
    for (const rule of selectedRuleEntries) {
      for (const lim of rule.rolesLimits ?? []) {
        if (!lim.roleId) continue;
        if (ruleLimitIsLiBiaoCell(lim.maxCount)) exemptLiBiao.add(lim.roleId);
      }
    }

    const rows: Array<{
      roleId: string;
      count: number;
      allowed: number;
      ruleSum?: number;
      moduleCap?: number;
    }> = [];
    for (const [roleId, count] of roleCountMap.entries()) {
      if (exemptLiBiao.has(roleId)) continue;

      const moduleCap = roleSelfLimitMap.get(roleId);
      const ruleSum = roleRuleSumMap.get(roleId);

      let allowed: number | undefined;
      if (ruleSum !== undefined && moduleCap !== undefined) allowed = Math.min(ruleSum, moduleCap);
      else if (ruleSum !== undefined) allowed = ruleSum;
      else if (moduleCap !== undefined) allowed = moduleCap;

      if (allowed === undefined) continue;
      if (count > allowed) {
        rows.push({ roleId, count, allowed, ruleSum, moduleCap });
      }
    }
    return rows;
  }, [roleCountMap, roleRuleSumMap, roleSelfLimitMap, selectedRuleEntries]);

  const violatingRoleIds = useMemo(
    () => new Set(roleLimitViolations.map((v) => v.roleId)),
    [roleLimitViolations],
  );

  const missingRoleAssignments = useMemo(() => {
    const requiredRoleIds = new Set<string>();
    for (const rule of selectedRuleEntries) {
      for (const lim of rule.rolesLimits ?? []) {
        // 规则里标出且上限大于 0 的身份，若完全未分配则给出提示
        if (!lim.roleId) continue;
        if (ruleRolesLimitRequiresAssignment(lim.maxCount)) {
          requiredRoleIds.add(lim.roleId);
        }
      }
    }
    const missing: string[] = [];
    for (const roleId of requiredRoleIds) {
      if ((roleCountMap.get(roleId) ?? 0) === 0) {
        missing.push(roleId);
      }
    }
    return missing;
  }, [roleCountMap, selectedRuleEntries]);

  const duplicateNpcIds = useMemo(() => {
    const count = new Map<string, number>();
    for (const row of scenario.ScenarioInfo.NpcRoles) {
      if (!row.npcId) continue;
      count.set(row.npcId, (count.get(row.npcId) ?? 0) + 1);
    }
    return new Set(Array.from(count.entries()).filter(([, c]) => c > 1).map(([npcId]) => npcId));
  }, [scenario.ScenarioInfo.NpcRoles]);

  const showPartTimerPairReminder = useMemo(
    () => scenario.ScenarioInfo.NpcRoles.some((row) => row.npcId === NPC_ID_PART_TIMER),
    [scenario.ScenarioInfo.NpcRoles],
  );

  /** 事件日程当事人：登场人物 npcId（去重、顺序同 NpcRoles）+ 各版图群众 id */
  const incidentPersonDropdownIds = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const nr of scenario.ScenarioInfo.NpcRoles) {
      const id = (nr.npcId ?? '').trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
    for (const o of INCIDENT_PERSON_AREA_CROWD_OPTIONS) {
      if (seen.has(o.id)) continue;
      seen.add(o.id);
      out.push(o.id);
    }
    return out;
  }, [scenario.ScenarioInfo.NpcRoles]);

  const duplicateXRules = useMemo(() => {
    const x1 = scenario.ScenarioInfo.rule_X_1.trim();
    const x2 = scenario.ScenarioInfo.rule_X_2.trim();
    return Boolean(x1 && x2 && x1 === x2);
  }, [scenario.ScenarioInfo.rule_X_1, scenario.ScenarioInfo.rule_X_2]);

  const incidentPersonMissingRows = useMemo(
    () =>
      scenario.ScenarioInfo.incident_days
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => row.incidentId.trim() !== '' && row.personId.trim() === ''),
    [scenario.ScenarioInfo.incident_days],
  );

  const incidentEventMissingRows = useMemo(
    () =>
      scenario.ScenarioInfo.incident_days
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => row.personId.trim() !== '' && row.incidentId.trim() === ''),
    [scenario.ScenarioInfo.incident_days],
  );
  const delayedAppearanceMissingRows = useMemo(
    () =>
      scenario.ScenarioInfo.NpcRoles
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => row.delayedAppearance && !(row.appearanceTimingDescription ?? '').trim()),
    [scenario.ScenarioInfo.NpcRoles],
  );

  const requiredMissing = useMemo(() => ({
    scenarioId: !scenario.id.trim(),
    scenarioName: !scenario.name.trim(),
    moduleId: !scenario.moduleId?.trim(),
    roundCount: !roundCountInput.trim(),
    dayCount: !dayCountInput.trim(),
  }), [dayCountInput, roundCountInput, scenario.id, scenario.moduleId, scenario.name]);

  const hasRequiredMissing = requiredMissing.scenarioId
    || requiredMissing.scenarioName
    || requiredMissing.moduleId
    || requiredMissing.roundCount
    || requiredMissing.dayCount;

  const roundCountFormatValid = useMemo(
    () => /^(\s*\d+\s*)(,\s*\d+\s*)*$/.test(roundCountInput.trim()),
    [roundCountInput],
  );
  const roundCountParsed = useMemo(() => parseNumberCsv(roundCountInput), [roundCountInput]);
  const roundCountRangeValid = useMemo(
    () => roundCountParsed.every((n) => n >= 1 && n <= 9),
    [roundCountParsed],
  );
  const roundCountNoDuplicate = useMemo(
    () => new Set(roundCountParsed).size === roundCountParsed.length,
    [roundCountParsed],
  );
  const roundCountInputValid = useMemo(
    () =>
      Boolean(roundCountInput.trim()) &&
      roundCountFormatValid &&
      roundCountParsed.length > 0 &&
      roundCountRangeValid &&
      roundCountNoDuplicate,
    [roundCountFormatValid, roundCountInput, roundCountNoDuplicate, roundCountParsed.length, roundCountRangeValid],
  );
  const roundCountInputError = Boolean(roundCountInput.trim()) && !roundCountInputValid;

  const dayCountDigitsValid = useMemo(() => /^\d+$/.test(dayCountInput.trim()), [dayCountInput]);
  const dayCountParsed = useMemo(() => Number(dayCountInput.trim()), [dayCountInput]);
  const dayCountRangeValid = useMemo(
    () => dayCountDigitsValid && dayCountParsed >= 1 && dayCountParsed <= 9,
    [dayCountDigitsValid, dayCountParsed],
  );
  const dayCountInputValid = Boolean(dayCountInput.trim()) && dayCountRangeValid;
  const dayCountInputError = Boolean(dayCountInput.trim()) && !dayCountInputValid;

  const scenarioVarName = useMemo(() => {
    const safe = (scenario.id || 'new_scenario').replace(/[^a-zA-Z0-9_]/g, '_');
    return safe || 'new_scenario';
  }, [scenario.id]);

  const scenarioFileName = useMemo(() => {
    const safe = (scenario.id || 'new_scenario').replace(/[^a-zA-Z0-9_-]/g, '_');
    return safe || 'new_scenario';
  }, [scenario.id]);

  const scenarioModuleSlug = useMemo(() => {
    const s = String(scenario.moduleId ?? '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return s || 'new_module';
  }, [scenario.moduleId]);

  const scenarioCode = useMemo(() => {
    const payload = JSON.stringify(scenario, null, 2);
    return [
      "import type { Scenario } from '../../basicInfo_scenario';",
      '',
      `export const ${scenarioVarName}: Scenario = ${payload};`,
      '',
      `export default ${scenarioVarName};`,
    ].join('\n');
  }, [scenario, scenarioVarName]);

  const ruleDisplayName = (ruleId: string) => {
    for (const mod of moduleIndex) {
      const r = mod.rules.find((x) => x.ruleId === ruleId);
      if (r) return r.ruleName;
    }
    return ruleId || '（无）';
  };
  const incidentDisplayName = (incidentId: string) => {
    for (const mod of moduleIndex) {
      const inc = mod.incidents.find((x) => x.incidentId === incidentId);
      if (inc) return inc.incidentName;
    }
    return incidentId || '（无）';
  };
  const roleDisplayName = (roleId: string) => {
    if (roleId === Person.roleId) return Person.roleName;
    for (const mod of moduleIndex) {
      const r = mod.roles.find((x) => x.roleId === roleId);
      if (r) return r.roleName;
    }
    return roleId || '（无）';
  };
  const npcDisplayName = (npcId: string) => {
    const incidentLabel = labelForStoredIncidentPerson(npcId);
    if (incidentLabel) return incidentLabel;
    const npc = Object.values(npcIndex).find((n) => n.id === npcId);
    return npc ? npc.name : npcId || '（无）';
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(scenarioCode);
      setCopyMessage('代码已复制到剪贴板');
    } catch {
      setCopyMessage('复制失败，请手动复制');
    }
  };

  const saveScenario = async (overwrite = false) => {
    if (hasRequiredMissing) {
      setSaveConflictPending(false);
      setSaveError('请先填写：剧本 ID、剧本名称、所属模组、轮回数、每轮天数。');
      setSaveMessage('');
      return;
    }
    if (incidentPersonMissingRows.length > 0) {
      setSaveConflictPending(false);
      setSaveError('事件日程校验失败：已选择事件的行必须选择当事人。');
      setSaveMessage('');
      return;
    }
    if (roundCountInputError || dayCountInputError) {
      setSaveConflictPending(false);
      setSaveError('轮回数或每轮天数输入不合规，请按提示修正后再保存。');
      setSaveMessage('');
      return;
    }
    if (incidentEventMissingRows.length > 0) {
      setSaveConflictPending(false);
      setSaveError('事件日程校验失败：已选择当事人的行必须选择事件。');
      setSaveMessage('');
      return;
    }
    if (delayedAppearanceMissingRows.length > 0) {
      setSaveConflictPending(false);
      setSaveError('延迟登场校验失败：已设为延迟登场的 NPC 必须填写登场时机描述。');
      setSaveMessage('');
      return;
    }
    if (duplicateXRules) {
      setSaveConflictPending(false);
      setSaveError('规则 X1 与规则 X2 不能重复，请调整后再保存。');
      setSaveMessage('');
      return;
    }
    if (roleLimitViolations.length > 0) {
      setSaveConflictPending(false);
      setSaveError('身份上限校验失败：登场人物中存在身份数量超限，请先修正后再保存。');
      setSaveMessage('');
      return;
    }
    setSaveBusy(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const res = await fetch('/api/scenarios/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioVarName,
          scenarioFileName,
          scenarioModuleId: scenario.moduleId,
          scenarioCode,
          overwrite,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        message?: string;
        conflict?: boolean;
        scenarioFile?: string;
        overwritten?: boolean;
      };
      if (!res.ok) {
        if (res.status === 409 || payload.conflict) {
          setSaveConflictPending(true);
          setSaveError(payload.message || '剧本文件已存在，可选择覆盖保存。');
          return;
        }
        throw new Error(payload.message || `保存失败 (${res.status})`);
      }
      setSaveConflictPending(false);
      setSaveMessage(
        payload.overwritten
          ? `已覆盖保存到 ${payload.scenarioFile ?? `custom/${scenarioModuleSlug}/${scenarioFileName}.ts`}，并更新 secenariosIndex.ts`
          : `已保存到 ${payload.scenarioFile ?? `custom/${scenarioModuleSlug}/${scenarioFileName}.ts`}，并更新 secenariosIndex.ts`,
      );
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>追加剧本</h2>
          <button type="button" style={styles.primaryBtn} onClick={onClose}>返回主界面</button>
        </div>

        <section style={styles.block}>
          <h3 style={styles.h3}>剧本基础信息</h3>
          <div style={styles.grid}>
            <label style={styles.label}>剧本 ID
              <input
                style={requiredMissing.scenarioId ? { ...styles.input, ...styles.inputWarning } : styles.input}
                value={scenario.id}
                onChange={(e) => setScenario((p) => ({ ...p, id: e.target.value }))}
              />
              {requiredMissing.scenarioId ? <span style={styles.fieldWarningText}>剧本 ID 未输入</span> : null}
            </label>
            <label style={styles.label}>剧本名称
              <input
                style={requiredMissing.scenarioName ? { ...styles.input, ...styles.inputWarning } : styles.input}
                value={scenario.name}
                onChange={(e) => setScenario((p) => ({ ...p, name: e.target.value }))}
              />
              {requiredMissing.scenarioName ? <span style={styles.fieldWarningText}>剧本名称未输入</span> : null}
            </label>
            <label style={styles.label}>所属模组
              <select
                style={requiredMissing.moduleId ? { ...styles.select, ...styles.selectWarning } : styles.select}
                value={scenario.moduleId}
                onChange={(e) =>
                  setScenario((p) => {
                    const nextModuleId = e.target.value;
                    const lockX2 =
                      nextModuleId === 'First_Steps' ||
                      nextModuleId === 'firstSteps_Example' ||
                      nextModuleId === 'First_Steps_Example';
                    return {
                      ...p,
                      moduleId: nextModuleId,
                      ScenarioInfo: {
                        ...p.ScenarioInfo,
                        rule_X_2: lockX2 ? '' : p.ScenarioInfo.rule_X_2,
                      },
                    };
                  })
                }
              >
                {moduleIndex.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
              </select>
              {requiredMissing.moduleId ? (
                <span style={styles.fieldWarningText}>请选择所属模组；保存时会在 custom 下按模组 id 自动创建同名文件夹（若尚不存在）并写入剧本文件</span>
              ) : null}
            </label>
            <label style={styles.label}>难度
              <input
                style={styles.input}
                value={scenario.difficulty}
                onChange={(e) => setScenario((p) => ({ ...p, difficulty: Number(e.target.value) || 1 }))}
              />
            </label>
            <label style={styles.label}>轮回数（逗号分隔）
              <input
                style={requiredMissing.roundCount || roundCountInputError ? { ...styles.input, ...styles.inputWarning } : styles.input}
                value={roundCountInput}
                onChange={(e) => {
                  const next = e.target.value;
                  setRoundCountInput(next);
                  const rounds = parseNumberCsv(next);
                  const formatOk = /^(\s*\d+\s*)(,\s*\d+\s*)*$/.test(next.trim());
                  const rangeOk = rounds.every((n) => n >= 1 && n <= 9);
                  const noDup = new Set(rounds).size === rounds.length;
                  if (next.trim() && formatOk && rounds.length > 0 && rangeOk && noDup) {
                    setScenario((p) => ({
                      ...p,
                      ScenarioInfo: { ...p.ScenarioInfo, roundCount: rounds },
                    }));
                  }
                }}
              />
              {requiredMissing.roundCount ? <span style={styles.fieldWarningText}>轮回数未输入</span> : null}
              {!requiredMissing.roundCount && roundCountInputError ? (
                <span style={styles.fieldWarningText}>请输入 1-9 的整数，使用英文逗号分隔，且不可重复（例如：1,3,5）</span>
              ) : null}
            </label>
            <label style={styles.label}>每轮天数
              <input
                style={requiredMissing.dayCount || dayCountInputError ? { ...styles.input, ...styles.inputWarning } : styles.input}
                value={dayCountInput}
                onChange={(e) =>
                  {
                    const next = e.target.value;
                    setDayCountInput(next);
                    const parsed = Number(next);
                    if (next.trim() && /^\d+$/.test(next.trim()) && Number.isFinite(parsed) && parsed >= 1 && parsed <= 9) {
                      setScenario((p) => ({
                        ...p,
                        ScenarioInfo: { ...p.ScenarioInfo, dayCount: Math.max(1, parsed) },
                      }));
                    }
                  }
                }
              />
              {requiredMissing.dayCount ? <span style={styles.fieldWarningText}>每轮天数未输入</span> : null}
              {!requiredMissing.dayCount && dayCountInputError ? (
                <span style={styles.fieldWarningText}>每轮天数请输入 1-9 的整数</span>
              ) : null}
            </label>
          </div>
          <label style={{ ...styles.label, marginTop: 8 }}>剧本特征
            <textarea style={styles.textarea} value={scenario.features} onChange={(e) => setScenario((p) => ({ ...p, features: e.target.value }))} />
          </label>
          <label style={{ ...styles.label, marginTop: 8 }}>故事背景
            <textarea style={styles.textarea} value={scenario.story} onChange={(e) => setScenario((p) => ({ ...p, story: e.target.value }))} />
          </label>
          <label style={{ ...styles.label, marginTop: 8 }}>给剧作家的指引
            <textarea style={styles.textarea} value={scenario.directorGuide} onChange={(e) => setScenario((p) => ({ ...p, directorGuide: e.target.value }))} />
          </label>
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>剧本信息（规则 / 出场 / 事件）</h3>
          <div style={styles.grid}>
            <label style={styles.label}>规则Y
              <select style={styles.select} value={scenario.ScenarioInfo.rule_Y} onChange={(e) => setScenario((p) => ({ ...p, ScenarioInfo: { ...p.ScenarioInfo, rule_Y: e.target.value } }))}>
                {yRuleOptions.length === 0 ? <option value="">-- 无可选规则Y --</option> : null}
                {yRuleOptions.map((r) => <option key={r.ruleId} value={r.ruleId}>{r.ruleName}</option>)}
              </select>
            </label>
            <label style={styles.label}>规则X1
              <select
                style={duplicateXRules ? { ...styles.select, ...styles.selectWarning } : styles.select}
                value={scenario.ScenarioInfo.rule_X_1}
                onChange={(e) => setScenario((p) => ({ ...p, ScenarioInfo: { ...p.ScenarioInfo, rule_X_1: e.target.value } }))}
              >
                {xRuleOptions.length === 0 ? <option value="">-- 无可选规则X --</option> : null}
                {xRuleOptions.map((r) => (
                  <option
                    key={r.ruleId}
                    value={r.ruleId}
                    disabled={scenario.ScenarioInfo.rule_X_2 === r.ruleId && scenario.ScenarioInfo.rule_X_1 !== r.ruleId}
                  >
                    {r.ruleName}
                  </option>
                ))}
              </select>
            </label>
            <label style={styles.label}>规则X2
              <select
                style={isFirstStepsModule ? { ...styles.select, ...styles.selectDisabled } : (duplicateXRules ? { ...styles.select, ...styles.selectWarning } : styles.select)}
                value={scenario.ScenarioInfo.rule_X_2}
                disabled={isFirstStepsModule}
                onChange={(e) => setScenario((p) => ({ ...p, ScenarioInfo: { ...p.ScenarioInfo, rule_X_2: e.target.value } }))}
              >
                {isFirstStepsModule || x2RuleOptions.length === 0 ? <option value="">-- 无可选规则X2 --</option> : null}
                {x2RuleOptions.map((r) => (
                  <option key={r.ruleId} value={r.ruleId}>
                    {r.ruleName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {duplicateXRules ? (
            <div style={styles.warningBlock}>
              <div style={styles.warningLine}>规则 X1 与规则 X2 当前重复，请设置为不同规则。</div>
            </div>
          ) : null}

          <div style={styles.npcSectionTitleRow}>
            <h4 style={{ ...styles.h4, margin: 0 }}>登场人物（NpcRoles）</h4>
            <button type="button" style={styles.secondaryBtn} onClick={() => setAppendNpcHelpOpen(true)}>
              追加NPC
            </button>
            <button type="button" style={styles.secondaryBtn} onClick={() => setNpcOverviewOpen(true)}>
              查看NPC一览
            </button>
          </div>
          {isAnotherHorizonRevisedModule ? (
            <div style={styles.tipBlock}>
              <div style={styles.tipLine}>
                当前为 Another Horizon Revised：每名登场人物恰好分配两项身份——表世界（
                <code style={{ fontSize: '11px', color: '#94a3b8' }}>roleIds[0]</code>
                ）与里世界（
                <code style={{ fontSize: '11px', color: '#94a3b8' }}>roleIds[1]</code>
                ）。
              </div>
            </div>
          ) : null}
          {duplicateNpcIds.size > 0 ? (
            <div style={styles.warningBlock}>
              {Array.from(duplicateNpcIds).map((npcId) => (
                <div key={npcId} style={styles.warningLine}>
                  【{npcDisplayName(npcId)}】重复登场，请调整为不重复的 NPC。
                </div>
              ))}
            </div>
          ) : null}
          {showPartTimerPairReminder ? (
            <div style={styles.tipBlock}>
              <div style={styles.tipLine}>
                当前登场人物中包含【临时工】。涉及临时工的剧本请同时将【{npcDisplayName('npc_33')}】加入登场人物：
                【临时工】请设为「{Person.roleName}」；【{npcDisplayName('npc_33')}】请设为剧本所安排的模组身份。
              </div>
            </div>
          ) : null}
          {missingRoleAssignments.length > 0 ? (
            <div style={styles.warningBlockSoft}>
              {missingRoleAssignments.map((roleId) => (
                <div key={roleId} style={styles.warningLineSoft}>
                  规则要求涉及身份【{roleDisplayName(roleId)}】，但当前未分配给任何登场人物。
                </div>
              ))}
            </div>
          ) : null}
          {roleLimitViolations.length > 0 ? (
            <div style={styles.warningBlock}>
              {roleLimitViolations.map((v) => (
                <div key={v.roleId} style={styles.warningLine}>
                  【{roleDisplayName(v.roleId)}】当前 {v.count}，允许上限 {v.allowed}
                  {typeof v.ruleSum === 'number' ? `（启用规则之和 ${v.ruleSum}` : '（启用规则无数值上限'}
                  {typeof v.moduleCap === 'number' ? `，模组身份上限 ${v.moduleCap}）` : '，模组未设身份上限）'}
                </div>
              ))}
            </div>
          ) : null}
          {scenario.ScenarioInfo.NpcRoles.map((row, idx) => (
            <div key={idx} style={styles.row}>
              <select
                style={duplicateNpcIds.has(row.npcId) ? { ...styles.select, ...styles.selectWarning } : styles.select}
                value={row.npcId}
                onChange={(e) =>
                  setScenario((p) => {
                    const next = [...p.ScenarioInfo.NpcRoles];
                    next[idx] = { ...next[idx], npcId: e.target.value };
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next, npcCount: next.length } };
                  })
                }
              >
                {Object.values(npcIndex).map((n) => {
                  const pickedByOtherRow = scenario.ScenarioInfo.NpcRoles.some(
                    (nr, nrIdx) => nrIdx !== idx && nr.npcId === n.id,
                  );
                  return (
                    <option key={n.id} value={n.id} disabled={pickedByOtherRow}>
                      {n.name}{pickedByOtherRow ? '（已登场）' : ''}
                    </option>
                  );
                })}
              </select>
              {isAnotherHorizonRevisedModule ? (
                <div
                  style={{
                    ...styles.roleAhrPairWrap,
                    ...(anotherHorizonSurfaceInnerPair(row).some((rid) => violatingRoleIds.has(rid))
                      ? styles.roleAhrPairWarning
                      : {}),
                  }}
                >
                  {(() => {
                    const [surfaceId, innerId] = anotherHorizonSurfaceInnerPair(row);
                    const setSlot = (slot: 0 | 1, roleId: string) => {
                      setScenario((p) => {
                        const next = [...p.ScenarioInfo.NpcRoles];
                        const cur = next[idx];
                        if (!cur) return p;
                        const [s0, s1] = anotherHorizonSurfaceInnerPair(cur);
                        const nextPair: [string, string] =
                          slot === 0 ? [roleId, s1] : [s0, roleId];
                        next[idx] = {
                          ...cur,
                          roleIds: nextPair,
                          roleId: nextPair[0],
                        };
                        return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next } };
                      });
                    };
                    return (
                      <>
                        <label style={styles.roleAhrSelectLabel}>
                          <span style={styles.roleAhrSelectCaption}>表世界</span>
                          <select
                            style={styles.select}
                            value={surfaceId}
                            onChange={(e) => setSlot(0, e.target.value)}
                            aria-label={`${npcDisplayName(row.npcId)} 表世界身份`}
                          >
                            {mastermindRoleSelectOptions.map((r) => (
                              <option key={r.roleId} value={r.roleId}>
                                {r.roleName}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label style={styles.roleAhrSelectLabel}>
                          <span style={styles.roleAhrSelectCaption}>里世界</span>
                          <select
                            style={styles.select}
                            value={innerId}
                            onChange={(e) => setSlot(1, e.target.value)}
                            aria-label={`${npcDisplayName(row.npcId)} 里世界身份`}
                          >
                            {mastermindRoleSelectOptions.map((r) => (
                              <option key={r.roleId} value={r.roleId}>
                                {r.roleName}
                              </option>
                            ))}
                          </select>
                        </label>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <select
                  style={
                    npcRoleAssignments(row).some((rid) => violatingRoleIds.has(rid))
                      ? { ...styles.select, ...styles.selectWarning }
                      : styles.select
                  }
                  value={row.roleId}
                  onChange={(e) =>
                    setScenario((p) => {
                      const next = [...p.ScenarioInfo.NpcRoles];
                      next[idx] = { ...next[idx], roleId: e.target.value };
                      return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next } };
                    })
                  }
                >
                  <option value={Person.roleId}>{Person.roleName}</option>
                  {(selectedModule?.roles ?? []).map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
              )}
              <select
                style={styles.select}
                value={row.delayedAppearance ? 'true' : 'false'}
                onChange={(e) =>
                  setScenario((p) => {
                    const next = [...p.ScenarioInfo.NpcRoles];
                    const delayed = e.target.value === 'true';
                    next[idx] = {
                      ...next[idx],
                      delayedAppearance: delayed,
                      appearanceTimingDescription: delayed ? (next[idx].appearanceTimingDescription ?? '') : '',
                    };
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next } };
                  })
                }
              >
                <option value="false">正常登场</option>
                <option value="true">延迟登场</option>
              </select>
              {row.delayedAppearance ? (
                <input
                  style={
                    delayedAppearanceMissingRows.some(({ idx: missingIdx }) => missingIdx === idx)
                      ? { ...styles.input, ...styles.inputWarning, minWidth: 220, flex: '1 1 220px' }
                      : { ...styles.input, minWidth: 220, flex: '1 1 220px' }
                  }
                  placeholder="登场时机描述（例如：第2日行动阶段后）"
                  value={row.appearanceTimingDescription ?? ''}
                  onChange={(e) =>
                    setScenario((p) => {
                      const next = [...p.ScenarioInfo.NpcRoles];
                      next[idx] = { ...next[idx], appearanceTimingDescription: e.target.value };
                      return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next } };
                    })
                  }
                />
              ) : null}
              <button
                type="button"
                style={styles.smallBtn}
                onClick={() =>
                  setScenario((p) => {
                    const next = p.ScenarioInfo.NpcRoles.filter((_, i) => i !== idx);
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, NpcRoles: next, npcCount: next.length } };
                  })
                }
              >
                删除
              </button>
            </div>
          ))}
          {delayedAppearanceMissingRows.length > 0 ? (
            <div style={styles.warningBlock}>
              {delayedAppearanceMissingRows.map(({ idx, row }) => (
                <div key={`delay-missing-${idx}`} style={styles.warningLine}>
                  【{npcDisplayName(row.npcId)}】已设为延迟登场，但未填写登场时机描述。
                </div>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            style={styles.secondaryBtn}
            onClick={() =>
              setScenario((p) => ({
                ...p,
                ScenarioInfo: {
                  ...p.ScenarioInfo,
                  NpcRoles: [
                    ...p.ScenarioInfo.NpcRoles,
                    {
                      npcId: Object.values(npcIndex)[0]?.id ?? '',
                      roleId: Person.roleId,
                      ...(p.moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED
                        ? { roleIds: [Person.roleId, Person.roleId] as string[] }
                        : {}),
                      delayedAppearance: false,
                      appearanceTimingDescription: '',
                    },
                  ],
                  npcCount: p.ScenarioInfo.NpcRoles.length + 1,
                },
              }))
            }
          >
            新增登场人物
          </button>

          <h4 style={styles.h4}>事件日程（incident_days）</h4>
          {incidentPersonMissingRows.length > 0 ? (
            <div style={styles.warningBlock}>
              {incidentPersonMissingRows.map(({ row, idx }) => (
                <div key={`${row.day}-${idx}`} style={styles.warningLine}>
                  第 {row.day} 天已选择事件，但未选择当事人。
                </div>
              ))}
            </div>
          ) : null}
          {incidentEventMissingRows.length > 0 ? (
            <div style={styles.warningBlock}>
              {incidentEventMissingRows.map(({ row, idx }) => (
                <div key={`event-${row.day}-${idx}`} style={styles.warningLine}>
                  第 {row.day} 天已选择当事人，但未选择事件。
                </div>
              ))}
            </div>
          ) : null}
          {scenario.ScenarioInfo.incident_days.map((row, idx) => (
            <div key={idx} style={styles.row}>
              <div style={styles.dayCellReadonly}>第 {row.day} 天</div>
              <select
                style={row.personId.trim() !== '' && row.incidentId.trim() === '' ? { ...styles.select, ...styles.selectWarning } : styles.select}
                value={row.incidentId}
                onChange={(e) =>
                  setScenario((p) => {
                    const next = [...p.ScenarioInfo.incident_days];
                    next[idx] = { ...next[idx], incidentId: e.target.value };
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, incident_days: next } };
                  })
                }
              >
                <option value="">-- 无事件 --</option>
                {(selectedModule?.incidents ?? []).map((inc) => <option key={inc.incidentId} value={inc.incidentId}>{inc.incidentName}</option>)}
              </select>
              <select
                style={row.incidentId.trim() !== '' && row.personId.trim() === '' ? { ...styles.select, ...styles.selectWarning } : styles.select}
                value={row.personId}
                onChange={(e) =>
                  setScenario((p) => {
                    const next = [...p.ScenarioInfo.incident_days];
                    next[idx] = { ...next[idx], personId: e.target.value };
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, incident_days: next } };
                  })
                }
              >
                <option value="">-- 无当事人 --</option>
                {incidentPersonDropdownIds.map((pid) => (
                  <option key={pid} value={pid}>{npcDisplayName(pid)}</option>
                ))}
              </select>
              <select
                style={styles.select}
                value={row.specialEventFlag}
                onChange={(e) =>
                  setScenario((p) => {
                    const next = [...p.ScenarioInfo.incident_days];
                    next[idx] = { ...next[idx], specialEventFlag: e.target.value as 'true' | 'false' };
                    return { ...p, ScenarioInfo: { ...p.ScenarioInfo, incident_days: next } };
                  })
                }
              >
                <option value="false">普通</option>
                <option value="true">特殊</option>
              </select>
            </div>
          ))}
          <label style={{ ...styles.label, marginTop: 10 }}>特殊规则
            <textarea
              style={styles.textarea}
              value={scenario.ScenarioInfo.specialRules ?? ''}
              onChange={(e) =>
                setScenario((p) => ({
                  ...p,
                  ScenarioInfo: { ...p.ScenarioInfo, specialRules: e.target.value.trim() ? e.target.value : null },
                }))
              }
            />
          </label>
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>非公开信息表预览</h3>
          <ClosedScriptScenarioSheet
            scenario={scenario}
            viewMode="mastermind"
            ruleDisplayName={ruleDisplayName}
            incidentDisplayName={incidentDisplayName}
            roleDisplayName={roleDisplayName}
            npcDisplayName={npcDisplayName}
          />
        </section>

        <section style={styles.block}>
          <div style={styles.codeActions}>
            <button type="button" style={styles.primaryBtn} onClick={() => void copyCode()}>复制代码</button>
            <button type="button" style={styles.primaryBtn} disabled={saveBusy} onClick={() => void saveScenario(false)}>
              {saveBusy ? '保存中...' : '保存到工程'}
            </button>
            {saveConflictPending ? (
              <button type="button" style={styles.warnBtn} disabled={saveBusy} onClick={() => void saveScenario(true)}>
                覆盖保存到工程
              </button>
            ) : null}
          </div>
          {copyMessage ? <p style={styles.successText}>{copyMessage}</p> : null}
          {saveMessage ? <p style={styles.successText}>{saveMessage}</p> : null}
          {saveError ? <p style={styles.errorText}>{saveError}</p> : null}
          <textarea readOnly style={styles.codeArea} value={scenarioCode} />
        </section>
      </div>

      {npcOverviewOpen ? (
        <div
          role="dialog"
          aria-modal
          style={styles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setNpcOverviewOpen(false);
          }}
        >
          <div style={styles.modalPanel} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#f8fafc' }}>NPC 一览</h3>
              <button type="button" style={styles.primaryBtn} onClick={() => setNpcOverviewOpen(false)}>
                关闭
              </button>
            </div>
            <div style={styles.modalScroll}>
              <NpcOverviewBody npcEntries={Object.entries(npcIndex)} />
            </div>
          </div>
        </div>
      ) : null}

      {appendNpcHelpOpen ? (
        <div
          role="dialog"
          aria-modal
          style={styles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setAppendNpcHelpOpen(false);
          }}
        >
          <div style={{ ...styles.modalPanel, maxWidth: 720 }} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#f8fafc' }}>追加 NPC（工程说明）</h3>
              <button type="button" style={styles.primaryBtn} onClick={() => setAppendNpcHelpOpen(false)}>
                关闭
              </button>
            </div>
            <div style={styles.modalScroll}>
              <AppendNpcInstructions compact />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', width: '100%', backgroundColor: '#0f172a', color: '#e2e8f0' },
  inner: { maxWidth: '1300px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  block: { backgroundColor: '#16213e', border: '1px solid #1e2e52', borderRadius: '10px', padding: '14px', marginBottom: 14 },
  h3: { margin: 0, fontSize: '16px', color: '#f8fafc' },
  h4: { margin: '14px 0 8px', color: '#f8fafc' },
  grid: { display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' },
  row: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 },
  roleAhrPairWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px 14px',
    alignItems: 'flex-end',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    minWidth: 220,
    flex: '2 1 300px',
  },
  roleAhrPairWarning: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.35) inset',
  },
  roleAhrSelectLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 140,
    fontSize: 12,
    color: '#cbd5e1',
  },
  roleAhrSelectCaption: {
    fontSize: 11,
    color: '#94a3b8',
  },
  dayCellReadonly: {
    minWidth: '92px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    color: '#cbd5e1',
    fontSize: '13px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1' },
  input: { backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' },
  inputWarning: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px #ef4444 inset',
  },
  fieldWarningText: {
    color: '#fca5a5',
    fontSize: '12px',
    lineHeight: 1.3,
  },
  select: { backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' },
  textarea: { width: '100%', minHeight: 72, backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', boxSizing: 'border-box', fontSize: '13px' },
  primaryBtn: { backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  secondaryBtn: { backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  warnBtn: { backgroundColor: '#b45309', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  warningBlock: {
    marginBottom: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(127, 29, 29, 0.25)',
    border: '1px solid rgba(239, 68, 68, 0.65)',
    borderRadius: '6px',
  },
  warningLine: { color: '#fca5a5', fontSize: '12px', lineHeight: 1.5 },
  warningBlockSoft: {
    marginBottom: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(120, 53, 15, 0.25)',
    border: '1px solid rgba(251, 191, 36, 0.65)',
    borderRadius: '6px',
  },
  warningLineSoft: { color: '#fde68a', fontSize: '12px', lineHeight: 1.5 },
  tipBlock: {
    marginBottom: '10px',
    padding: '8px 10px',
    backgroundColor: 'rgba(30, 58, 95, 0.4)',
    border: '1px solid rgba(99, 179, 237, 0.55)',
    borderRadius: '6px',
  },
  tipLine: { color: '#bae6fd', fontSize: '12px', lineHeight: 1.55 },
  selectWarning: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px #ef4444 inset',
  },
  selectDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    borderColor: '#64748b',
  },
  smallBtn: { backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer' },
  codeActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  successText: { margin: '6px 0', color: '#86efac', fontSize: '12px' },
  errorText: { margin: '6px 0', color: '#fca5a5', fontSize: '12px' },
  codeArea: { width: '100%', minHeight: 300, backgroundColor: '#020617', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', padding: '10px', boxSizing: 'border-box', fontSize: '12px', fontFamily: 'Consolas, monospace' },
  npcSectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    margin: '14px 0 8px',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    overflow: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
  },
  modalPanel: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#16213e',
    borderRadius: '10px',
    border: '1px solid #1e2e52',
    padding: '14px',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  modalScroll: {
    maxHeight: 'calc(100vh - 140px)',
    overflow: 'auto',
    paddingRight: '4px',
  },
};

