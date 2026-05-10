import { Fragment, useEffect, useMemo, useState, type CSSProperties, type FocusEventHandler } from 'react';
import type { ModuleBasicInfo } from '../modules/basicInfo/basicInfo_module';
import type { RuleRoleLimitMaxCount } from '../modules/basicInfo/basicInfo_rule';
import {
  ROLE_FEATURE_TAGS,
  type RoleFeatureTag,
  normalizeRoleFeatureTags,
} from '../modules/basicInfo/basicInfo_role';

type RuleLimitDraft = {
  roleId: string;
  roleName: string;
  maxCount: RuleRoleLimitMaxCount;
};

type RuleAddDraft = {
  ruleId: string;
  description: string;
};

type RuleDraft = {
  ruleId: string;
  ruleName: string;
  ruleType: 'Y' | 'X';
  rolesLimits: RuleLimitDraft[];
  addRules: RuleAddDraft[];
};

type RoleAbilityDraft = {
  abilityId: string;
  abilityType: '强制' | '任意能力' | '失败条件';
  description: string;
};

type RoleDraft = {
  roleId: string;
  roleName: string;
  maxCount: number | '';
  features: RoleFeatureTag[];
  abilitys: RoleAbilityDraft[];
};

type IncidentEffectDraft = {
  eventEffectId: string;
  description: string;
};

type IncidentDraft = {
  incidentId: string;
  incidentName: string;
  Incident_Effects: IncidentEffectDraft[];
};

type AppendModulePageProps = {
  onClose: () => void;
  initialModuleData?: ModuleBasicInfo;
};

function createRuleDraft(index: number): RuleDraft {
  const id = `Rule_${index}`;
  return {
    ruleId: id,
    ruleName: `规则${index}`,
    ruleType: index % 2 === 0 ? 'X' : 'Y',
    rolesLimits: [{ roleId: 'Role_1', roleName: '身份1', maxCount: '' }],
    addRules: [{ ruleId: id, description: '请输入规则描述' }],
  };
}

function createRoleDraft(index: number): RoleDraft {
  return {
    roleId: `Role_${index}`,
    roleName: `身份${index}`,
    maxCount: '',
    features: [],
    abilitys: [{ abilityId: `Ability_${index}_1`, abilityType: '任意能力', description: '请输入能力描述' }],
  };
}

function createIncidentDraft(index: number): IncidentDraft {
  return {
    incidentId: `Incident_${index}`,
    incidentName: `事件${index}`,
    Incident_Effects: [{ eventEffectId: `Incident_${index}_Effect_1`, description: '请输入事件效果' }],
  };
}

function parseMaxCount(value: string): number | '' {
  const raw = value.trim();
  if (raw === '') return '';
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : '';
}

/** 规则表格子：数字、空、或 表/里 */
function parseRuleLimitMaxCount(value: string): RuleRoleLimitMaxCount {
  const raw = value.trim();
  if (raw === '') return '';
  if (raw === '表' || raw === '里') return raw;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : '';
}

/** 规则矩阵每一格默认值：缺失或非法一律按 ''（未录入）处理 */
function defaultRuleRoleLimitMaxCount(raw: unknown): RuleRoleLimitMaxCount {
  if (raw === '' || raw === '表' || raw === '里') return raw;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  return '';
}

function cloneRuleDrafts(rules: ModuleBasicInfo['rules'] | undefined): RuleDraft[] {
  if (!rules || rules.length === 0) return [createRuleDraft(1)];
  return rules.map((rule) => ({
    ruleId: rule.ruleId,
    ruleName: rule.ruleName,
    ruleType: rule.ruleType,
    rolesLimits: (rule.rolesLimits ?? []).map((limit) => ({
      roleId: limit.roleId,
      roleName: limit.roleName,
      maxCount: defaultRuleRoleLimitMaxCount(limit.maxCount),
    })),
    addRules: (rule.addRules?.length ? rule.addRules : [{ ruleId: rule.ruleId, description: '请输入规则描述' }]).map((add) => ({
      ruleId: add.ruleId,
      description: add.description,
    })),
  }));
}

function cloneRoleDrafts(roles: ModuleBasicInfo['roles'] | undefined): RoleDraft[] {
  if (!roles || roles.length === 0) return [createRoleDraft(1)];
  return roles.map((role, idx) => ({
    roleId: role.roleId || `Role_${idx + 1}`,
    roleName: role.roleName,
    maxCount: role.maxCount,
    features: normalizeRoleFeatureTags(role.features),
    abilitys: (role.abilitys?.length
      ? role.abilitys
      : [{ abilityId: `Ability_${idx + 1}_1`, abilityType: '任意能力', description: '请输入能力描述' }]
    ).map((ability) => ({
      abilityId: ability.abilityId,
      abilityType:
        ability.abilityType === '强制' || ability.abilityType === '任意能力' || ability.abilityType === '失败条件'
          ? ability.abilityType
          : '任意能力',
      description: ability.description,
    })),
  }));
}

function cloneIncidentDrafts(incidents: ModuleBasicInfo['incidents'] | undefined): IncidentDraft[] {
  if (!incidents || incidents.length === 0) return [createIncidentDraft(1)];
  return incidents.map((incident, idx) => ({
    incidentId: incident.incidentId || `Incident_${idx + 1}`,
    incidentName: incident.incidentName,
    Incident_Effects: (incident.Incident_Effects?.length
      ? incident.Incident_Effects
      : [{ eventEffectId: `Incident_${idx + 1}_Effect_1`, description: '请输入事件效果' }]
    ).map((effect) => ({
      eventEffectId: effect.eventEffectId,
      description: effect.description,
    })),
  }));
}

type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;

/** 失焦时去掉首尾空格 */
const trimOnBlur =
  (commit: (trimmed: string) => void): FocusEventHandler<TextFieldElement> =>
  (e) => {
    commit(e.target.value.trim());
  };

export function AppendModulePage({ onClose, initialModuleData }: AppendModulePageProps) {
  const [moduleId, setModuleId] = useState(initialModuleData?.id ?? 'New_Module');
  const [moduleName, setModuleName] = useState(initialModuleData?.fullName ?? '新模组');
  const [moduleShortName, setModuleShortName] = useState(initialModuleData?.shortName ?? 'NM');
  const [moduleDescription, setModuleDescription] = useState(initialModuleData?.description ?? '请填写模组说明');
  const [exSlotName, setExSlotName] = useState(initialModuleData?.exSlot?.name ?? '');
  const [exSlotDescription, setExSlotDescription] = useState(initialModuleData?.exSlot?.description ?? '');
  const [rules, setRules] = useState<RuleDraft[]>(cloneRuleDrafts(initialModuleData?.rules));
  const [roles, setRoles] = useState<RoleDraft[]>(cloneRoleDrafts(initialModuleData?.roles));
  const [incidents, setIncidents] = useState<IncidentDraft[]>(cloneIncidentDrafts(initialModuleData?.incidents));
  const [copyMessage, setCopyMessage] = useState('');
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveConflictPending, setSaveConflictPending] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    setModuleId(initialModuleData?.id ?? 'New_Module');
    setModuleName(initialModuleData?.fullName ?? '新模组');
    setModuleShortName(initialModuleData?.shortName ?? 'NM');
    setModuleDescription(initialModuleData?.description ?? '请填写模组说明');
    setExSlotName(initialModuleData?.exSlot?.name ?? '');
    setExSlotDescription(initialModuleData?.exSlot?.description ?? '');
    setRules(cloneRuleDrafts(initialModuleData?.rules));
    setRoles(cloneRoleDrafts(initialModuleData?.roles));
    setIncidents(cloneIncidentDrafts(initialModuleData?.incidents));
    setInvalidFields(new Set());
    setSaveError('');
    setSaveMessage('');
    setCopyMessage('');
  }, [initialModuleData]);

  const moduleVarName = useMemo(() => {
    const safe = (moduleId || 'new_module').replace(/[^a-zA-Z0-9_]/g, '_');
    return safe || 'new_module';
  }, [moduleId]);

  const moduleFileName = useMemo(() => {
    const safe = (moduleId || moduleShortName || 'new_module').replace(/[^a-zA-Z0-9_-]/g, '_');
    return safe || 'new_module';
  }, [moduleId, moduleShortName]);

  const moduleDraft: ModuleBasicInfo = useMemo(() => {
    const exName = exSlotName.trim();
    const exDesc = exSlotDescription.trim();
    const exSlot =
      exName || exDesc
        ? {
            name: exName || 'Ex',
            description: exDesc,
          }
        : undefined;
    return {
      id: moduleId.trim(),
      fullName: moduleName.trim(),
      shortName: moduleShortName.trim(),
      description: moduleDescription.trim(),
      rules,
      roles,
      incidents,
      ...(exSlot ? { exSlot } : {}),
    };
  }, [
    exSlotDescription,
    exSlotName,
    incidents,
    moduleDescription,
    moduleId,
    moduleName,
    moduleShortName,
    roles,
    rules,
  ]);

  const exportCode = useMemo(() => {
    const payload = JSON.stringify(moduleDraft, null, 2);
    return [
      "import { ModuleBasicInfo } from '../basicInfo/basicInfo_module';",
      '',
      `export const ${moduleVarName}: ModuleBasicInfo = ${payload};`,
      '',
      `export default ${moduleVarName};`,
    ].join('\n');
  }, [moduleDraft, moduleVarName]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopyMessage('代码已复制到剪贴板');
    } catch {
      setCopyMessage('复制失败，请手动复制下方代码');
    }
  };

  const withInvalid = (baseStyle: CSSProperties, fieldKey: string): CSSProperties =>
    invalidFields.has(fieldKey) ? { ...baseStyle, ...styles.invalidField } : baseStyle;

  const clearInvalidField = (fieldKey: string) => {
    setInvalidFields((prev) => {
      if (!prev.has(fieldKey)) return prev;
      const next = new Set(prev);
      next.delete(fieldKey);
      return next;
    });
  };

  /** 与「身份」表行顺序对齐：交换两行并同步各规则中对应列的上限格 */
  const moveRoleRow = (fromIdx: number, delta: -1 | 1) => {
    const toIdx = fromIdx + delta;
    setRoles((prevRoles) => {
      if (toIdx < 0 || toIdx >= prevRoles.length) return prevRoles;
      const nextRoles = [...prevRoles];
      [nextRoles[fromIdx], nextRoles[toIdx]] = [nextRoles[toIdx], nextRoles[fromIdx]];

      setRules((prevRules) =>
        prevRules.map((rule) => {
          let lim = [...rule.rolesLimits];
          while (lim.length < nextRoles.length) {
            const k = lim.length;
            lim.push({
              roleId: nextRoles[k].roleId,
              roleName: nextRoles[k].roleName,
              maxCount: '' as RuleRoleLimitMaxCount,
            });
          }
          if (lim.length > nextRoles.length) lim = lim.slice(0, nextRoles.length);
          [lim[fromIdx], lim[toIdx]] = [lim[toIdx], lim[fromIdx]];
          return {
            ...rule,
            rolesLimits: nextRoles.map((r, idx) => ({
              maxCount: defaultRuleRoleLimitMaxCount(lim[idx]?.maxCount),
              roleId: r.roleId,
              roleName: r.roleName,
            })),
          };
        }),
      );

      setInvalidFields((prev) => {
        const next = new Set<string>();
        for (const k of prev) {
          if (!k.startsWith('roles.')) next.add(k);
        }
        return next;
      });

      return nextRoles;
    });
  };

  const validateBeforeSave = (): Set<string> => {
    const failed = new Set<string>();
    if (!moduleId.trim()) failed.add('moduleId');
    if (!moduleName.trim()) failed.add('moduleName');
    if (!moduleShortName.trim()) failed.add('moduleShortName');

    rules.forEach((rule, ruleIdx) => {
      if (!rule.ruleName.trim()) failed.add(`rules.${ruleIdx}.ruleName`);
    });

    roles.forEach((role, roleIdx) => {
      if (!role.roleName.trim()) failed.add(`roles.${roleIdx}.roleName`);
    });

    incidents.forEach((incident, incidentIdx) => {
      if (!incident.incidentName.trim()) failed.add(`incidents.${incidentIdx}.incidentName`);
      incident.Incident_Effects.forEach((effect, effectIdx) => {
        if (!effect.description.trim()) failed.add(`incidents.${incidentIdx}.effects.${effectIdx}.description`);
      });
    });

    return failed;
  };

  const saveToProject = async (overwrite = false) => {
    const failed = validateBeforeSave();
    if (failed.size > 0) {
      setInvalidFields(failed);
      setSaveConflictPending(false);
      setSaveError('请先补全标红字段后再保存。');
      setSaveMessage('');
      return;
    }
    setSaveBusy(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const res = await fetch('/api/modules/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleVarName,
          moduleFileName,
          moduleCode: exportCode,
          overwrite,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        conflict?: boolean;
        message?: string;
        moduleFile?: string;
        overwritten?: boolean;
      };
      if (!res.ok) {
        if (res.status === 409 || payload.conflict) {
          setSaveConflictPending(true);
          setSaveError(payload.message || '模组文件已存在，可选择覆盖保存。');
          return;
        }
        throw new Error(payload.message || `保存失败 (${res.status})`);
      }
      setSaveConflictPending(false);
      setInvalidFields(new Set());
      setSaveMessage(
        payload.overwritten
          ? `已覆盖保存到 ${payload.moduleFile ?? `custom/${moduleFileName}.ts`}，并更新 moduleIndex.ts`
          : `已保存到 ${payload.moduleFile ?? `custom/${moduleFileName}.ts`}，并更新 moduleIndex.ts`,
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>追加模组页面</h2>
          <button type="button" style={styles.primaryBtn} onClick={onClose}>
            返回主界面
          </button>
        </div>

        <section style={styles.block}>
          <h3 style={styles.h3}>模组基础信息</h3>
          <div style={styles.grid}>
            <label style={styles.label}>
              模组 ID
              <input
                style={withInvalid(styles.input, 'moduleId')}
                value={moduleId}
                onChange={(e) => {
                  setModuleId(e.target.value);
                  clearInvalidField('moduleId');
                }}
                onBlur={trimOnBlur(setModuleId)}
              />
            </label>
            <label style={styles.label}>
              模组全称
              <input
                style={withInvalid(styles.input, 'moduleName')}
                value={moduleName}
                onChange={(e) => {
                  setModuleName(e.target.value);
                  clearInvalidField('moduleName');
                }}
                onBlur={trimOnBlur(setModuleName)}
              />
            </label>
            <label style={styles.label}>
              模组简称
              <input
                style={withInvalid(styles.input, 'moduleShortName')}
                value={moduleShortName}
                onChange={(e) => {
                  setModuleShortName(e.target.value);
                  clearInvalidField('moduleShortName');
                }}
                onBlur={trimOnBlur(setModuleShortName)}
              />
            </label>
          </div>
          <label style={{ ...styles.label, marginTop: 10 }}>
            模组描述
            <textarea
              style={styles.textarea}
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              onBlur={trimOnBlur(setModuleDescription)}
            />
          </label>
          <div style={{ ...styles.grid, marginTop: 10 }}>
            <label style={styles.label}>
              Ex 槽名称
              <input
                style={styles.input}
                value={exSlotName}
                onChange={(e) => setExSlotName(e.target.value)}
                onBlur={trimOnBlur(setExSlotName)}
                placeholder="版块左侧 Ex 旁显示，留空则不导出 Ex 槽字段"
              />
            </label>
            <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
              Ex 槽描述
              <textarea
                style={styles.textarea}
                value={exSlotDescription}
                onChange={(e) => setExSlotDescription(e.target.value)}
                onBlur={trimOnBlur(setExSlotDescription)}
                placeholder="点击版图左侧「？」时显示；可与名称二选一填写以启用 Ex 槽配置"
              />
            </label>
          </div>
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>模组信息预览（参照主界面显示模组信息，直接编辑）</h3>
          <p style={styles.previewDesc}>{moduleDraft.fullName || '未命名模组'}（规则，身份，事件速查表）</p>
          <div style={styles.previewMetaBlock}>
            <h4 style={styles.previewMetaTitle}>模组描述</h4>
            <p style={styles.previewMetaText}>
              {moduleDraft.description?.trim() ? moduleDraft.description : '（无）'}
            </p>
          </div>
          <div style={styles.previewMetaBlock}>
            <h4 style={styles.previewMetaTitle}>Ex 槽名称</h4>
            <p style={styles.previewMetaText}>
              {moduleDraft.exSlot?.name?.trim() ? moduleDraft.exSlot.name : '（无）'}
            </p>
          </div>
          <div style={styles.previewMetaBlock}>
            <h4 style={styles.previewMetaTitle}>Ex 槽描述</h4>
            <p style={styles.previewMetaText}>
              {moduleDraft.exSlot?.description?.trim() ? moduleDraft.exSlot.description : '（无）'}
            </p>
          </div>

          <div style={styles.subHeader}>
            <h4 style={styles.previewH4}>规则</h4>
            <button type="button" style={styles.secondaryBtn} onClick={() => setRules((prev) => [...prev, createRuleDraft(prev.length + 1)])}>
              新增规则
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.moduleRuleMiddle}></th>
                <th style={styles.moduleRuleLeft}>规则名</th>
                {roles.map((role, roleIdx) => (
                  <th key={`${role.roleId}-${roleIdx}`} style={{ ...styles.roleHeaderCell, verticalAlign: 'top', textAlign: 'center' }}>
                    <input
                      style={withInvalid(styles.verticalRoleInput, `roles.${roleIdx}.roleName`)}
                      value={role.roleName}
                      onChange={(e) => {
                        setRoles((prev) => prev.map((it, i) => (i === roleIdx ? { ...it, roleName: e.target.value } : it)));
                        clearInvalidField(`roles.${roleIdx}.roleName`);
                      }}
                      onBlur={trimOnBlur((t) =>
                        setRoles((prev) => prev.map((it, i) => (i === roleIdx ? { ...it, roleName: t } : it))),
                      )}
                      placeholder="身份名"
                    />
                  </th>
                ))}
                <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>追加规则</th>
              </tr>
            </thead>
            <tbody style={{ border: '1px solid #ddd' }}>
              {rules.map((rule, ruleIdx) => {
                const addRulesCount = rule.addRules.length || 1;
                return (
                  <Fragment key={`${rule.ruleId}-${ruleIdx}`}>
                    <tr>
                      <td rowSpan={addRulesCount} style={styles.ruleTypeCell}>
                        <select
                          style={styles.ruleTypeSelect}
                          value={rule.ruleType}
                          onChange={(e) =>
                            setRules((prev) =>
                              prev.map((it, i) => (i === ruleIdx ? { ...it, ruleType: e.target.value as 'Y' | 'X' } : it)),
                            )
                          }
                        >
                          <option value="Y">Y</option>
                          <option value="X">X</option>
                        </select>
                      </td>
                      <td rowSpan={addRulesCount} style={{ ...styles.moduleRuleLeft, textAlign: 'left', verticalAlign: 'middle' }}>
                        <input
                          style={withInvalid(styles.inlineInput, `rules.${ruleIdx}.ruleName`)}
                          value={rule.ruleName}
                          onChange={(e) =>
                            {
                              setRules((prev) => prev.map((it, i) => (i === ruleIdx ? { ...it, ruleName: e.target.value } : it)));
                              clearInvalidField(`rules.${ruleIdx}.ruleName`);
                            }
                          }
                          onBlur={trimOnBlur((t) =>
                            setRules((prev) => prev.map((it, i) => (i === ruleIdx ? { ...it, ruleName: t } : it))),
                          )}
                          placeholder="规则名"
                        />
                        <div style={styles.inlineActions}>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            disabled={rules.length <= 1}
                            onClick={() => setRules((prev) => prev.filter((_, i) => i !== ruleIdx))}
                          >
                            删除规则
                          </button>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            onClick={() =>
                              setRules((prev) =>
                                prev.map((it, i) =>
                                  i === ruleIdx
                                    ? { ...it, addRules: [...it.addRules, { ruleId: it.ruleId, description: '请输入追加规则' }] }
                                    : it,
                                ),
                              )
                            }
                          >
                            新增追加规则
                          </button>
                        </div>
                      </td>
                      {roles.map((role, roleIdx) => {
                        const limit = rule.rolesLimits[roleIdx] ?? { roleId: role.roleId, roleName: role.roleName, maxCount: '' as const };
                        return (
                          <td key={`${rule.ruleId}-${role.roleId}-${roleIdx}`} rowSpan={addRulesCount} style={{ ...styles.moduleRuleMiddle, textAlign: 'center', verticalAlign: 'middle' }}>
                            <input
                              style={styles.inlineInput}
                              value={defaultRuleRoleLimitMaxCount(limit.maxCount)}
                              onChange={(e) =>
                                setRules((prev) =>
                                  prev.map((it, i) => {
                                    if (i !== ruleIdx) return it;
                                    const nextLimits = [...it.rolesLimits];
                                    nextLimits[roleIdx] = {
                                      roleId: role.roleId,
                                      roleName: role.roleName,
                                      maxCount: parseRuleLimitMaxCount(e.target.value),
                                    };
                                    return { ...it, rolesLimits: nextLimits };
                                  }),
                                )
                              }
                              onBlur={(e) =>
                                setRules((prev) =>
                                  prev.map((it, i) => {
                                    if (i !== ruleIdx) return it;
                                    const nextLimits = [...it.rolesLimits];
                                    nextLimits[roleIdx] = {
                                      roleId: role.roleId,
                                      roleName: role.roleName,
                                      maxCount: parseRuleLimitMaxCount(e.target.value),
                                    };
                                    return { ...it, rolesLimits: nextLimits };
                                  }),
                                )
                              }
                              placeholder="上限/表/里"
                            />
                          </td>
                        );
                      })}
                      <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}>
                        <textarea
                          style={withInvalid(styles.ruleTextField, `rules.${ruleIdx}.addRules.0.description`)}
                          value={rule.addRules[0]?.description ?? ''}
                          onChange={(e) =>
                            {
                              setRules((prev) =>
                                prev.map((it, i) => {
                                  if (i !== ruleIdx) return it;
                                  const addRules = it.addRules.length ? [...it.addRules] : [{ ruleId: it.ruleId, description: '' }];
                                  addRules[0] = { ...addRules[0], description: e.target.value };
                                  return { ...it, addRules };
                                }),
                              );
                              clearInvalidField(`rules.${ruleIdx}.addRules.0.description`);
                            }
                          }
                          onBlur={trimOnBlur((t) =>
                            setRules((prev) =>
                              prev.map((it, i) => {
                                if (i !== ruleIdx) return it;
                                const addRules = it.addRules.length ? [...it.addRules] : [{ ruleId: it.ruleId, description: '' }];
                                addRules[0] = { ...addRules[0], description: t };
                                return { ...it, addRules };
                              }),
                            ),
                          )}
                          placeholder="请输入规则描述"
                        />
                      </td>
                    </tr>
                    {rule.addRules.slice(1).map((addRule, addIdx) => (
                      <tr key={`${ruleIdx}-add-${addIdx}`}>
                        <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}>
                          <div style={styles.inlineRow}>
                            <textarea
                              style={withInvalid(styles.ruleTextField, `rules.${ruleIdx}.addRules.${addIdx + 1}.description`)}
                              value={addRule.description}
                              onChange={(e) =>
                                {
                                  setRules((prev) =>
                                    prev.map((it, i) => {
                                      if (i !== ruleIdx) return it;
                                      const addRules = [...it.addRules];
                                      addRules[addIdx + 1] = { ...addRules[addIdx + 1], description: e.target.value };
                                      return { ...it, addRules };
                                    }),
                                  );
                                  clearInvalidField(`rules.${ruleIdx}.addRules.${addIdx + 1}.description`);
                                }
                              }
                              onBlur={trimOnBlur((t) =>
                                setRules((prev) =>
                                  prev.map((it, i) => {
                                    if (i !== ruleIdx) return it;
                                    const addRules = [...it.addRules];
                                    addRules[addIdx + 1] = { ...addRules[addIdx + 1], description: t };
                                    return { ...it, addRules };
                                  }),
                                ),
                              )}
                              placeholder="请输入规则描述"
                            />
                            <button
                              type="button"
                              style={styles.smallBtn}
                              onClick={() =>
                                setRules((prev) =>
                                  prev.map((it, i) =>
                                    i === ruleIdx ? { ...it, addRules: it.addRules.filter((_, idx) => idx !== addIdx + 1) } : it,
                                  ),
                                )
                              }
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          <div style={styles.subHeader}>
            <h4 style={styles.previewH4}>身份</h4>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => {
                setRoles((prev) => {
                  const nextRoles = [...prev, createRoleDraft(prev.length + 1)];
                  setRules((prevRules) =>
                    prevRules.map((rule) => ({
                      ...rule,
                      rolesLimits: nextRoles.map((r, idx) => {
                        const prevLim = rule.rolesLimits[idx];
                        return prevLim
                          ? {
                              ...prevLim,
                              roleId: r.roleId,
                              roleName: r.roleName,
                              maxCount: defaultRuleRoleLimitMaxCount(prevLim.maxCount),
                            }
                          : { roleId: r.roleId, roleName: r.roleName, maxCount: '' };
                      }),
                    })),
                  );
                  return nextRoles;
                });
              }}
            >
              新增身份
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.roleNameColumn}>身份名</th>
                <th style={{ ...styles.roleMaxCountColumn, textAlign: 'center' }}>上限</th>
                <th style={{ ...styles.moduleMiddle, border: '1px solid #ddd', width: '80px', textAlign: 'center' }}>身份特征</th>
                <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>能力</th>
              </tr>
            </thead>
            <tbody style={{ border: '1px solid #ddd' }}>
              {roles.map((role, roleIdx) => {
                const abilityCount = role.abilitys.length || 1;
                return (
                  <Fragment key={`${role.roleId}-${roleIdx}`}>
                    <tr style={{ border: '1px solid #ddd' }}>
                      <td rowSpan={abilityCount} style={styles.roleNameCell}>
                        <input
                          style={withInvalid(styles.inlineInputLarge, `roles.${roleIdx}.roleName`)}
                          value={role.roleName}
                          onChange={(e) => {
                            setRoles((prev) => prev.map((it, i) => (i === roleIdx ? { ...it, roleName: e.target.value } : it)));
                            clearInvalidField(`roles.${roleIdx}.roleName`);
                          }}
                          onBlur={trimOnBlur((t) =>
                            setRoles((prev) => prev.map((it, i) => (i === roleIdx ? { ...it, roleName: t } : it))),
                          )}
                          placeholder="身份名"
                        />
                        <div style={styles.inlineActions}>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            disabled={roleIdx === 0}
                            onClick={() => moveRoleRow(roleIdx, -1)}
                            title="与上一行交换"
                          >
                            上移
                          </button>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            disabled={roleIdx >= roles.length - 1}
                            onClick={() => moveRoleRow(roleIdx, 1)}
                            title="与下一行交换"
                          >
                            下移
                          </button>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            disabled={roles.length <= 1}
                            onClick={() => {
                              setRoles((prev) => prev.filter((_, i) => i !== roleIdx));
                              setRules((prevRules) =>
                                prevRules.map((rule) => ({
                                  ...rule,
                                  rolesLimits: rule.rolesLimits.filter((_, i) => i !== roleIdx),
                                })),
                              );
                            }}
                          >
                            删除身份
                          </button>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            onClick={() =>
                              setRoles((prev) =>
                                prev.map((it, i) =>
                                  i === roleIdx
                                    ? {
                                        ...it,
                                        abilitys: [
                                          ...it.abilitys,
                                          { abilityId: `Ability_${roleIdx + 1}_${it.abilitys.length + 1}`, abilityType: '任意能力', description: '请输入能力描述' },
                                        ],
                                      }
                                    : it,
                                ),
                              )
                            }
                          >
                            新增能力
                          </button>
                        </div>
                      </td>
                      <td rowSpan={abilityCount} style={{ ...styles.roleMaxCountColumn, textAlign: 'center', verticalAlign: 'middle' }}>
                        <input
                          style={styles.inlineInput}
                          value={role.maxCount}
                          onChange={(e) =>
                            setRoles((prev) =>
                              prev.map((it, i) => (i === roleIdx ? { ...it, maxCount: parseMaxCount(e.target.value) } : it)),
                            )
                          }
                          onBlur={(e) =>
                            setRoles((prev) =>
                              prev.map((it, i) => (i === roleIdx ? { ...it, maxCount: parseMaxCount(e.target.value) } : it)),
                            )
                          }
                          placeholder="上限"
                        />
                      </td>
                      <td rowSpan={abilityCount} style={{ ...styles.moduleMiddle, textAlign: 'left', border: '1px solid #ddd', verticalAlign: 'middle', padding: '6px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                          {ROLE_FEATURE_TAGS.map((tag) => (
                            <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#e2e8f0' }}>
                              <input
                                type="checkbox"
                                checked={role.features.includes(tag)}
                                onChange={() => {
                                  setRoles((prev) =>
                                    prev.map((it, i) => {
                                      if (i !== roleIdx) return it;
                                      const has = it.features.includes(tag);
                                      const nextSet = new Set(it.features);
                                      if (has) nextSet.delete(tag);
                                      else nextSet.add(tag);
                                      const nextFeatures = ROLE_FEATURE_TAGS.filter((t) => nextSet.has(t));
                                      return { ...it, features: nextFeatures };
                                    }),
                                  );
                                }}
                              />
                              <span>{tag}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}>
                        <input
                          style={withInvalid(styles.inlineInput, `roles.${roleIdx}.abilitys.0.description`)}
                          value={role.abilitys[0]?.description ?? ''}
                          onChange={(e) =>
                            {
                              setRoles((prev) =>
                                prev.map((it, i) => {
                                  if (i !== roleIdx) return it;
                                  const abilitys = it.abilitys.length
                                    ? [...it.abilitys]
                                    : [{ abilityId: `Ability_${roleIdx + 1}_1`, abilityType: '任意能力' as const, description: '' }];
                                  abilitys[0] = { ...abilitys[0], description: e.target.value };
                                  return { ...it, abilitys };
                                }),
                              );
                              clearInvalidField(`roles.${roleIdx}.abilitys.0.description`);
                            }
                          }
                          onBlur={trimOnBlur((t) =>
                            setRoles((prev) =>
                              prev.map((it, i) => {
                                if (i !== roleIdx) return it;
                                const abilitys = it.abilitys.length
                                  ? [...it.abilitys]
                                  : [{ abilityId: `Ability_${roleIdx + 1}_1`, abilityType: '任意能力' as const, description: '' }];
                                abilitys[0] = { ...abilitys[0], description: t };
                                return { ...it, abilitys };
                              }),
                            ),
                          )}
                          placeholder="能力描述"
                        />
                      </td>
                    </tr>
                    {role.abilitys.slice(1).map((ability, abilityIdx) => (
                      <tr key={`${roleIdx}-${abilityIdx}`} style={{ border: '1px solid #ddd' }}>
                        <td style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}>
                          <div style={styles.inlineRow}>
                            <input
                              style={withInvalid(styles.inlineInput, `roles.${roleIdx}.abilitys.${abilityIdx + 1}.description`)}
                              value={ability.description}
                              onChange={(e) =>
                                {
                                  setRoles((prev) =>
                                    prev.map((it, i) => {
                                      if (i !== roleIdx) return it;
                                      const abilitys = [...it.abilitys];
                                      abilitys[abilityIdx + 1] = { ...abilitys[abilityIdx + 1], description: e.target.value };
                                      return { ...it, abilitys };
                                    }),
                                  );
                                  clearInvalidField(`roles.${roleIdx}.abilitys.${abilityIdx + 1}.description`);
                                }
                              }
                              onBlur={trimOnBlur((t) =>
                                setRoles((prev) =>
                                  prev.map((it, i) => {
                                    if (i !== roleIdx) return it;
                                    const abilitys = [...it.abilitys];
                                    abilitys[abilityIdx + 1] = { ...abilitys[abilityIdx + 1], description: t };
                                    return { ...it, abilitys };
                                  }),
                                ),
                              )}
                              placeholder="能力描述"
                            />
                            <button
                              type="button"
                              style={styles.smallBtn}
                              onClick={() =>
                                setRoles((prev) =>
                                  prev.map((it, i) =>
                                    i === roleIdx ? { ...it, abilitys: it.abilitys.filter((_, idx) => idx !== abilityIdx + 1) } : it,
                                  ),
                                )
                              }
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          <div style={styles.subHeader}>
            <h4 style={styles.previewH4}>事件</h4>
            <button type="button" style={styles.secondaryBtn} onClick={() => setIncidents((prev) => [...prev, createIncidentDraft(prev.length + 1)])}>
              新增事件
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.moduleRuleLeft}>事件名</th>
                <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>事件效果</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, incidentIdx) => {
                const descriptionCount = incident.Incident_Effects.length || 1;
                return (
                  <Fragment key={`${incident.incidentId}-${incidentIdx}`}>
                    <tr>
                      <td rowSpan={descriptionCount} style={{ ...styles.moduleRuleLeft, verticalAlign: 'middle', textAlign: 'left', paddingLeft: '8px' }}>
                        <input
                          style={withInvalid(styles.inlineInput, `incidents.${incidentIdx}.incidentName`)}
                          value={incident.incidentName}
                          onChange={(e) =>
                            {
                              setIncidents((prev) =>
                                prev.map((it, i) => (i === incidentIdx ? { ...it, incidentName: e.target.value } : it)),
                              );
                              clearInvalidField(`incidents.${incidentIdx}.incidentName`);
                            }
                          }
                          onBlur={trimOnBlur((t) =>
                            setIncidents((prev) =>
                              prev.map((it, i) => (i === incidentIdx ? { ...it, incidentName: t } : it)),
                            ),
                          )}
                          placeholder="事件名"
                        />
                        <div style={styles.inlineActions}>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            disabled={incidents.length <= 1}
                            onClick={() => setIncidents((prev) => prev.filter((_, i) => i !== incidentIdx))}
                          >
                            删除事件
                          </button>
                          <button
                            type="button"
                            style={styles.smallBtn}
                            onClick={() =>
                              setIncidents((prev) =>
                                prev.map((it, i) =>
                                  i === incidentIdx
                                    ? {
                                        ...it,
                                        Incident_Effects: [
                                          ...it.Incident_Effects,
                                          { eventEffectId: `${it.incidentId}_Effect_${it.Incident_Effects.length + 1}`, description: '请输入事件效果' },
                                        ],
                                      }
                                    : it,
                                ),
                              )
                            }
                          >
                            新增效果
                          </button>
                        </div>
                      </td>
                      <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}>
                        <input
                          style={withInvalid(styles.inlineInput, `incidents.${incidentIdx}.effects.0.description`)}
                          value={incident.Incident_Effects[0]?.description ?? ''}
                          onChange={(e) =>
                            {
                              setIncidents((prev) =>
                                prev.map((it, i) => {
                                  if (i !== incidentIdx) return it;
                                  const effects = it.Incident_Effects.length
                                    ? [...it.Incident_Effects]
                                    : [{ eventEffectId: `${it.incidentId}_Effect_1`, description: '' }];
                                  effects[0] = { ...effects[0], description: e.target.value };
                                  return { ...it, Incident_Effects: effects };
                                }),
                              );
                              clearInvalidField(`incidents.${incidentIdx}.effects.0.description`);
                            }
                          }
                          onBlur={trimOnBlur((t) =>
                            setIncidents((prev) =>
                              prev.map((it, i) => {
                                if (i !== incidentIdx) return it;
                                const effects = it.Incident_Effects.length
                                  ? [...it.Incident_Effects]
                                  : [{ eventEffectId: `${it.incidentId}_Effect_1`, description: '' }];
                                effects[0] = { ...effects[0], description: t };
                                return { ...it, Incident_Effects: effects };
                              }),
                            ),
                          )}
                          placeholder="事件效果"
                        />
                      </td>
                    </tr>
                    {incident.Incident_Effects.slice(1).map((effect, effectIdx) => (
                      <tr key={`${incidentIdx}-desc-${effectIdx}`}>
                        <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}>
                          <div style={styles.inlineRow}>
                            <input
                              style={withInvalid(styles.inlineInput, `incidents.${incidentIdx}.effects.${effectIdx + 1}.description`)}
                              value={effect.description}
                              onChange={(e) =>
                                {
                                  setIncidents((prev) =>
                                    prev.map((it, i) => {
                                      if (i !== incidentIdx) return it;
                                      const effects = [...it.Incident_Effects];
                                      effects[effectIdx + 1] = { ...effects[effectIdx + 1], description: e.target.value };
                                      return { ...it, Incident_Effects: effects };
                                    }),
                                  );
                                  clearInvalidField(`incidents.${incidentIdx}.effects.${effectIdx + 1}.description`);
                                }
                              }
                              onBlur={trimOnBlur((t) =>
                                setIncidents((prev) =>
                                  prev.map((it, i) => {
                                    if (i !== incidentIdx) return it;
                                    const effects = [...it.Incident_Effects];
                                    effects[effectIdx + 1] = { ...effects[effectIdx + 1], description: t };
                                    return { ...it, Incident_Effects: effects };
                                  }),
                                ),
                              )}
                              placeholder="事件效果"
                            />
                            <button
                              type="button"
                              style={styles.smallBtn}
                              onClick={() =>
                                setIncidents((prev) =>
                                  prev.map((it, i) =>
                                    i === incidentIdx
                                      ? { ...it, Incident_Effects: it.Incident_Effects.filter((_, idx) => idx !== effectIdx + 1) }
                                      : it,
                                  ),
                                )
                              }
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </section>

        <section style={styles.block}>
          <div style={styles.subHeader}>
            <h3 style={styles.h3}>生成的模组代码</h3>
            <div style={styles.codeActions}>
              <button type="button" style={styles.primaryBtn} onClick={() => void copyCode()}>
                复制代码
              </button>
              <button type="button" style={styles.primaryBtn} disabled={saveBusy} onClick={() => void saveToProject(false)}>
                {saveBusy ? '保存中...' : '保存到工程'}
              </button>
              {saveConflictPending ? (
                <button type="button" style={styles.warnBtn} disabled={saveBusy} onClick={() => void saveToProject(true)}>
                  {saveBusy ? '覆盖中...' : '覆盖保存到工程'}
                </button>
              ) : null}
            </div>
          </div>
          {copyMessage ? <p style={styles.copyMessage}>{copyMessage}</p> : null}
          {saveMessage ? <p style={styles.saveMessage}>{saveMessage}</p> : null}
          {saveError ? <p style={styles.saveError}>{saveError}</p> : null}
          <textarea readOnly style={styles.code} value={exportCode} />
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '28px 24px 32px',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  block: {
    backgroundColor: '#16213e',
    border: '1px solid #1e2e52',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '14px',
  },
  h3: {
    margin: 0,
    fontSize: '16px',
    color: '#f8fafc',
  },
  subHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  grid: {
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    color: '#cbd5e1',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '13px',
  },
  select: {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '13px',
  },
  textarea: {
    width: '100%',
    minHeight: '72px',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '13px',
    boxSizing: 'border-box',
  },
  itemCard: {
    border: '1px solid #24335a',
    borderRadius: '8px',
    padding: '10px',
    marginTop: '10px',
  },
  primaryBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  warnBtn: {
    backgroundColor: '#b45309',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  removeBtn: {
    marginTop: '8px',
    backgroundColor: '#7f1d1d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
  },
  copyMessage: {
    margin: '6px 0',
    color: '#86efac',
    fontSize: '12px',
  },
  saveMessage: {
    margin: '6px 0',
    color: '#86efac',
    fontSize: '12px',
  },
  saveError: {
    margin: '6px 0',
    color: '#fca5a5',
    fontSize: '12px',
  },
  codeActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  code: {
    width: '100%',
    minHeight: '300px',
    backgroundColor: '#020617',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '10px',
    boxSizing: 'border-box',
    fontSize: '12px',
    fontFamily: 'Consolas, monospace',
  },
  inlineInput: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '4px 6px',
    fontSize: '12px',
  },
  inlineInputLarge: {
    width: '100%',
    minWidth: '120px',
    minHeight: '30px',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '6px 8px',
    fontSize: '13px',
  },
  inlineSelect: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '4px 6px',
    fontSize: '12px',
  },
  ruleTypeSelect: {
    width: '40px',
    minWidth: '40px',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '13px',
  },
  ruleTypeCell: {
    border: '1px solid #ddd',
    width: '30px',
    minWidth: '30px',
    verticalAlign: 'middle',
    textAlign: 'center',
    padding: '4px',
  },
  roleHeaderCell: {
    border: '1px solid #ddd',
    width: '15px',
    minWidth: '15px',
    padding: '0px',
    height: '170px',
  },
  verticalRoleInput: {
    width: '36px',
    height: '150px',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '6px 4px',
    fontSize: '13px',
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    letterSpacing: '0.05em',
    textAlign: 'start',
  },
  roleNameColumn: {
    border: '1px solid #ddd',
    textAlign: 'center',
    width: '220px',
    minWidth: '220px',
  },
  roleNameCell: {
    border: '1px solid #ddd',
    textAlign: 'left',
    verticalAlign: 'middle',
    padding: '8px',
    minWidth: '220px',
  },
  inlineActions: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
    flexWrap: 'wrap',
  },
  inlineRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start',
  },
  ruleTextField: {
    width: '100%',
    minHeight: '56px',
    boxSizing: 'border-box',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '4px',
    padding: '6px 8px',
    fontSize: '12px',
    resize: 'vertical',
    lineHeight: 1.4,
  },
  invalidField: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px #ef4444 inset',
  },
  smallBtn: {
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '12px',
  },
  previewDesc: {
    margin: '8px 0 12px',
    color: '#cbd5e1',
    fontSize: '14px',
  },
  previewMetaBlock: {
    marginBottom: '12px',
  },
  previewMetaTitle: {
    margin: '0 0 6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#94a3b8',
  },
  previewMetaText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#cbd5e1',
    whiteSpace: 'pre-wrap',
  },
  previewH4: {
    marginTop: '14px',
    marginBottom: '8px',
    color: '#f8fafc',
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
  roleMaxCountColumn: {
    border: '1px solid #ddd',
    width: '30px',
    minWidth: '30px',
    boxSizing: 'border-box',
  },
  moduleMiddle: {
    border: '1px solid #ddd',
    width: '10px',
  },
};

