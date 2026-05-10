/**
 * 剧作家用：非公开信息表（闭剧本）
 * 主人公侧：同版式「剧本信息」，敏感项以模组内下拉自选后展示，不直接带出剧本配置。
 */
import React, { useMemo, useState } from 'react';
import { INCIDENT_PERSON_AREA_CROWD_OPTIONS, npcRoleAssignments, type NpcRole, type Scenario } from '../scenarios/basicInfo_scenario';
import { Person, normalizeRoleFeatureTags, type RoleFeatureTag } from '../modules/basicInfo/basicInfo_role';
import type { RuleBasicInfo, RuleRoleLimitMaxCount } from '../modules/basicInfo/basicInfo_rule';
import type { ModuleBasicInfo } from '../modules/basicInfo/basicInfo_module';
import moduleIndex from '../modules/moduleIndex';
import { rolesIndex } from '../modules/firstSteps_Example/roles';

function roleFeaturesValue(roleId: string): RoleFeatureTag[] {
  if (roleId === Person.roleId) return normalizeRoleFeatureTags(Person.features);
  const role = Object.values(rolesIndex).find(r => r.roleId === roleId);
  return normalizeRoleFeatureTags(role?.features);
}

function findRuleInScenarioModule(scenario: Scenario, ruleId: string): RuleBasicInfo | undefined {
  if (!ruleId || !ruleId.trim()) return undefined;
  const mod = moduleIndex.find(m => m.id === scenario.moduleId);
  return mod?.rules.find(r => r.ruleId === ruleId);
}

function formatRuleLimitCell(maxCount: RuleRoleLimitMaxCount): string {
  return maxCount === '' ? '' : String(maxCount);
}

export type ClosedScriptScenarioViewMode = 'mastermind' | 'protagonist';

/** 主人公「公开信息表」编辑草稿（规则自选、身份自选、当事人自选）；建议由父组件持久化 */
export interface ProtagonistPublicSheetDraft {
  pickRuleY: string;
  pickRuleX1: string;
  pickRuleX2: string;
  /** npcId → 主人公自选身份 roleId（非 AHR；AHR 也可用单格作旧数据兼容） */
  castRoleByNpcId: Record<string, string>;
  /**
   * 仅 Another Horizon Revised：主人公为每名登场人物分别自选的表世界 / 里世界 roleId
   *（选项为当前模组内全部身份，含 Person）
   */
  castRoleAhrLiByNpcId?: Record<string, { surface: string; inner: string }>;
  /** 事件日 → 当事人：npcId 或版图群众 / 旧版群众 ID */
  incidentPersonByDay: Record<number, string>;
}

export function createEmptyProtagonistPublicSheetDraft(): ProtagonistPublicSheetDraft {
  return {
    pickRuleY: '',
    pickRuleX1: '',
    pickRuleX2: '',
    castRoleByNpcId: {},
    incidentPersonByDay: {},
  };
}

const MODULE_ID_ANOTHER_HORIZON_REVISED = 'Another_Horizon_Revised' as const;

/** 主人公在棋盘上展示的「身份」摘要（AHR 含表/里；已做显示名转换） */
export function protagonistCastRoleSummary(
  scenario: Scenario,
  draft: ProtagonistPublicSheetDraft,
  npcId: string,
  roleDisplayName: (roleId: string) => string,
): string {
  if (scenario.moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED) {
    const pair = draft.castRoleAhrLiByNpcId?.[npcId];
    const s = pair?.surface?.trim() ?? '';
    const inn = pair?.inner?.trim() ?? '';
    if (s || inn) {
      if (s && inn) {
        return s === inn
          ? roleDisplayName(s)
          : `表 ${roleDisplayName(s)} / 里 ${roleDisplayName(inn)}`;
      }
      return roleDisplayName(s || inn);
    }
    const legacy = draft.castRoleByNpcId[npcId]?.trim() ?? '';
    return legacy ? roleDisplayName(legacy) : '';
  }
  const single = draft.castRoleByNpcId[npcId]?.trim() ?? '';
  return single ? roleDisplayName(single) : '';
}

export interface ClosedScriptScenarioSheetProps {
  scenario: Scenario;
  /** mastermind：剧作家全量；protagonist：同样式，规则/身份/当事人不直出，以下拉自选后展示 */
  viewMode?: ClosedScriptScenarioViewMode;
  selectedLoopCount?: number;
  ruleDisplayName: (ruleId: string) => string;
  incidentDisplayName: (incidentId: string) => string;
  roleDisplayName: (roleId: string) => string;
  npcDisplayName: (npcId: string) => string;
  /** 主人公模式：由父组件持有并持久化；与 onProtagonistDraftChange 成对传入 */
  protagonistDraft?: ProtagonistPublicSheetDraft;
  /** 合并进当前草稿（主人公模式） */
  onProtagonistDraftChange?: (patch: Partial<ProtagonistPublicSheetDraft>) => void;
}

/** 登場人物 / 事件日程 共用宽度与外框 */
const sheetTableWrap: React.CSSProperties = {
  marginTop: '4px',
  maxWidth: 'min(100%, 560px)',
  borderRadius: '8px',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  overflow: 'hidden',
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
};

const sheetStyles = {
  title: {
    margin: '0 0 16px',
    fontSize: 'clamp(17px, 2.2vw, 21px)',
    fontWeight: 700,
    color: '#f2efe6',
    letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(167, 151, 255, 0.35)',
    paddingBottom: '10px',
  },
  section: {
    marginTop: '20px',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#c4b5fd',
    letterSpacing: '0.12em',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px 16px',
    fontSize: '14px',
    color: '#e2e8f0',
    lineHeight: 1.5,
  },
  rulesBlock: {
    marginTop: '12px',
    padding: '12px 14px',
    backgroundColor: 'rgba(15, 52, 96, 0.45)',
    borderRadius: '6px',
    border: '1px solid rgba(78, 204, 163, 0.25)',
    fontSize: '14px',
    lineHeight: 1.55,
    color: '#e2e8f0',
  },
  specialRulesBlock: {
    marginTop: '12px',
    padding: '12px 14px',
    backgroundColor: 'rgba(69, 26, 3, 0.35)',
    borderRadius: '6px',
    border: '1px solid rgba(251, 191, 36, 0.35)',
    fontSize: '14px',
    lineHeight: 1.55,
    color: '#fde68a',
    whiteSpace: 'pre-wrap' as const,
  },
  specialRulesEmpty: {
    color: '#94a3b8',
    fontStyle: 'italic' as const,
  },
  /** 规则（Y/X）名称下一行的完整条目 */
  ruleDetailNest: {
    marginTop: '8px',
    marginBottom: '2px',
    paddingLeft: '10px',
    borderLeft: '2px solid rgba(78, 204, 163, 0.45)',
  },
  /** 身份上限横置 + 每条追加一列；身份名单行不换行 */
  ruleDetailLimitsWrap: {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    marginTop: '2px',
    overflowX: 'auto' as const,
  },
  ruleDetailLimitsGrid: {
    display: 'grid',
    width: '100%',
    columnGap: '4px',
    rowGap: '4px',
    fontSize: '11px',
    color: '#cbd5e1',
    boxSizing: 'border-box' as const,
  },
  ruleDetailLimitsHead: {
    padding: '5px 8px',
    textAlign: 'center' as const,
    fontWeight: 600,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    color: '#94a3b8',
    borderBottom: '1px solid rgba(71, 85, 105, 0.6)',
    lineHeight: 1.25,
    boxSizing: 'border-box' as const,
    whiteSpace: 'nowrap' as const,
  },
  ruleDetailLimitsHeadAdd: {
    minWidth: 0,
    padding: '5px 8px',
    textAlign: 'center' as const,
    fontWeight: 600,
    backgroundColor: 'rgba(55, 38, 86, 0.55)',
    color: '#c4b5fd',
    borderBottom: '1px solid rgba(71, 85, 105, 0.6)',
    lineHeight: 1.25,
    boxSizing: 'border-box' as const,
    whiteSpace: 'nowrap' as const,
  },
  ruleDetailLimitsVal: {
    padding: '5px 8px',
    textAlign: 'center' as const,
    borderBottom: '1px solid rgba(51, 65, 85, 0.55)',
    lineHeight: 1.25,
    boxSizing: 'border-box' as const,
    whiteSpace: 'nowrap' as const,
  },
  ruleDetailLimitsValAdd: {
    minWidth: 0,
    padding: '5px 8px',
    textAlign: 'left' as const,
    borderBottom: '1px solid rgba(51, 65, 85, 0.55)',
    whiteSpace: 'nowrap' as const,
    lineHeight: 1.4,
    color: '#e2e8f0',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis' as const,
  },
  castTable: {
    width: '100%',
    tableLayout: 'fixed' as const,
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  castTh: {
    textAlign: 'left' as const,
    padding: '10px 10px',
    fontWeight: 600,
    color: '#f8fafc',
    background: 'linear-gradient(180deg, rgba(83, 52, 131, 0.95) 0%, rgba(55, 38, 86, 0.9) 100%)',
    borderBottom: '1px solid rgba(167, 151, 255, 0.45)',
  },
  castThPerson: {
    width: '26%',
  },
  castThFeat: {
    width: '14%',
    textAlign: 'center' as const,
    fontSize: '12px',
    paddingLeft: '6px',
    paddingRight: '6px',
    lineHeight: 1.25,
  },
  castThRoleLast: {
    width: '32%',
  },
  castTd: {
    padding: '10px 10px',
    verticalAlign: 'middle' as const,
    color: '#f1f5f9',
    borderBottom: '1px solid rgba(71, 85, 105, 0.45)',
    wordBreak: 'break-word' as const,
  },
  castNpcName: {
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  castRoleName: {
    color: '#bae6fd',
    lineHeight: 1.45,
  },
  castTdFeat: {
    padding: '10px 6px',
    verticalAlign: 'middle' as const,
    textAlign: 'center' as const,
    color: '#fde68a',
    fontSize: '13px',
    fontWeight: 700,
    borderBottom: '1px solid rgba(71, 85, 105, 0.45)',
  },
  castFeatEmpty: {
    color: '#64748b',
    fontWeight: 400,
    fontSize: '12px',
  },
  prose: {
    fontSize: '14px',
    lineHeight: 1.65,
    color: '#cbd5e1',
    whiteSpace: 'pre-wrap' as const,
  },
  incidentTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  incidentTh: {
    textAlign: 'left' as const,
    padding: '8px 10px',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    color: '#94a3b8',
    fontWeight: 600,
    borderBottom: '1px solid #475569',
  },
  incidentTd: {
    padding: '8px 10px',
    borderBottom: '1px solid rgba(71, 85, 105, 0.4)',
    color: '#e2e8f0',
    verticalAlign: 'top' as const,
  },
  /** 主人公模式下模组内下拉 */
  selectProtagonist: {
    marginTop: '4px',
    maxWidth: '100%',
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '6px 10px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid rgba(71, 85, 105, 0.85)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    color: '#e2e8f0',
    cursor: 'pointer' as const,
  },
  /** 剧作家侧：剧本特征 / 故事背景 / 给剧作家的指引 — 可折叠 */
  mastermindCollapsible: {
    marginTop: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    overflow: 'hidden' as const,
  },
  mastermindCollapsibleFirst: {
    marginTop: 0,
  },
  mastermindCollapsibleSummary: {
    margin: 0,
    padding: '10px 14px',
    cursor: 'pointer' as const,
    fontSize: '15px',
    fontWeight: 700,
    color: '#c4b5fd',
    letterSpacing: '0.12em',
    listStylePosition: 'outside' as const,
    outline: 'none',
  },
  mastermindCollapsibleBody: {
    padding: '0 14px 12px 14px',
    borderTop: '1px solid rgba(148, 163, 184, 0.22)',
  },
};

function scenarioModule(scenario: Scenario): ModuleBasicInfo | undefined {
  return moduleIndex.find(m => m.id === scenario.moduleId);
}

/** 剧作家非公开表：单列可折叠文本块（默认收起） */
function MastermindCollapsibleTextSection(props: {
  title: string;
  text: string;
  /** 本节为区块内第一项时置顶边距 */
  isFirst?: boolean;
}) {
  const body = props.text.trim() ? props.text : '（无）';
  return (
    <details
      style={
        props.isFirst
          ? { ...sheetStyles.mastermindCollapsible, ...sheetStyles.mastermindCollapsibleFirst }
          : sheetStyles.mastermindCollapsible
      }
    >
      <summary style={sheetStyles.mastermindCollapsibleSummary}>{props.title}</summary>
      <div style={sheetStyles.mastermindCollapsibleBody}>
        <p style={{ ...sheetStyles.prose, margin: 0 }}>{body}</p>
      </div>
    </details>
  );
}

function roleFeaturesForModule(mod: ModuleBasicInfo | undefined, roleId: string): RoleFeatureTag[] {
  if (roleId === Person.roleId) return normalizeRoleFeatureTags(Person.features);
  const fromMod = mod?.roles.find(r => r.roleId === roleId);
  if (fromMod) return normalizeRoleFeatureTags(fromMod.features);
  return roleFeaturesValue(roleId);
}

function mergedRoleFeaturesForNpcRow(mod: ModuleBasicInfo | undefined, nr: NpcRole): RoleFeatureTag[] {
  const set = new Set<RoleFeatureTag>();
  for (const rid of npcRoleAssignments(nr)) {
    for (const t of roleFeaturesForModule(mod, rid)) set.add(t);
  }
  return [...set];
}

/** 主人公 AHR：已选表 / 里身份合并特征（同一列去重） */
function mergedProtagonistPickedRoleFeatures(
  mod: ModuleBasicInfo | undefined,
  surfaceRoleId: string,
  innerRoleId: string,
): RoleFeatureTag[] {
  const set = new Set<RoleFeatureTag>();
  const s = surfaceRoleId.trim();
  const inn = innerRoleId.trim();
  if (s) for (const t of roleFeaturesForModule(mod, s)) set.add(t);
  if (inn) for (const t of roleFeaturesForModule(mod, inn)) set.add(t);
  return [...set];
}

function RuleYXFullDetail({ scenario, ruleId }: { scenario: Scenario; ruleId: string }) {
  if (!ruleId || !ruleId.trim()) {
    return null;
  }
  const rule = findRuleInScenarioModule(scenario, ruleId);
  if (!rule) {
    return (
      <div style={sheetStyles.ruleDetailNest}>
        <span style={sheetStyles.specialRulesEmpty}>
          当前模组规则数据中未找到 ID「{ruleId}」对应的完整条目。
        </span>
      </div>
    );
  }
  const n = rule.rolesLimits.length;
  const m = rule.addRules.length;
  const gridColParts: string[] = [];
  if (n > 0) gridColParts.push(`repeat(${n}, max-content)`);
  if (m > 0) {
    gridColParts.push(...Array.from({ length: m }, () => 'minmax(0, 1fr)'));
  } else {
    gridColParts.push('minmax(0, 1fr)');
  }
  const gridCols = gridColParts.join(' ') || '1fr';

  return (
    <div style={sheetStyles.ruleDetailNest}>
      <div style={sheetStyles.ruleDetailLimitsWrap}>
        <div
          style={{
            ...sheetStyles.ruleDetailLimitsGrid,
            gridTemplateColumns: gridCols,
          }}
        >
          {rule.rolesLimits.map((lim) => (
            <div key={`h-${lim.roleId}`} style={sheetStyles.ruleDetailLimitsHead}>
              {lim.roleName}
            </div>
          ))}
          {m > 0
            ? rule.addRules.map((ar, idx) => (
              <div key={`ah-${ar.ruleId}`} style={sheetStyles.ruleDetailLimitsHeadAdd}>
                {m === 1 ? '追加' : `追加 ${idx + 1}`}
              </div>
            ))
            : (
              <div key="ah-addrules-empty" style={sheetStyles.ruleDetailLimitsHeadAdd}>
                追加规则
              </div>
            )}
          {rule.rolesLimits.map((lim) => (
            <div key={`v-${lim.roleId}`} style={sheetStyles.ruleDetailLimitsVal}>
              {formatRuleLimitCell(lim.maxCount)}
            </div>
          ))}
          {m > 0
            ? rule.addRules.map((ar) => (
              <div
                key={`av-${ar.ruleId}`}
                style={sheetStyles.ruleDetailLimitsValAdd}
                title={ar.description || undefined}
              >
                {ar.description ?? ''}
              </div>
            ))
            : (
              <div key="av-addrules-empty" style={sheetStyles.ruleDetailLimitsValAdd} />
            )}
        </div>
      </div>
    </div>
  );
}

export function ClosedScriptScenarioSheet({
  scenario,
  viewMode = 'mastermind',
  selectedLoopCount,
  ruleDisplayName,
  incidentDisplayName,
  roleDisplayName,
  npcDisplayName,
  protagonistDraft,
  onProtagonistDraftChange,
}: ClosedScriptScenarioSheetProps) {
  const isProtagonist = viewMode === 'protagonist';
  const info = scenario.ScenarioInfo;
  const mod = useMemo(() => scenarioModule(scenario), [scenario]);
  const rulesY = useMemo(() => (mod?.rules ?? []).filter(r => r.ruleType === 'Y'), [mod]);
  const rulesX = useMemo(() => (mod?.rules ?? []).filter(r => r.ruleType === 'X'), [mod]);
  const incidentNpcOptions = useMemo(() => {
    const ids = [...new Set(info.NpcRoles.map(nr => nr.npcId))];
    return [...ids, ...INCIDENT_PERSON_AREA_CROWD_OPTIONS.map((o) => o.id)];
  }, [info.NpcRoles]);

  /** 主人公身份下拉：模组内全部身份（含 Person，与模组列表去重） */
  const castRoleDropdownOptions = useMemo(() => {
    const r = mod?.roles ?? [];
    return r.some(x => x.roleId === Person.roleId) ? r : [Person, ...r];
  }, [mod]);

  const protagonistAhrDualCast = isProtagonist && scenario.moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED;

  const controlledProtagonist =
    isProtagonist && protagonistDraft != null && onProtagonistDraftChange != null;

  const [localDraft, setLocalDraft] = useState<ProtagonistPublicSheetDraft>(() =>
    createEmptyProtagonistPublicSheetDraft(),
  );

  const d = controlledProtagonist ? protagonistDraft! : localDraft;
  const patchDraft = (patch: Partial<ProtagonistPublicSheetDraft>) => {
    if (controlledProtagonist) onProtagonistDraftChange!(patch);
    else setLocalDraft(prev => ({ ...prev, ...patch }));
  };

  const roundLabel =
    selectedLoopCount != null && selectedLoopCount > 0
      ? `${selectedLoopCount} 轮`
      : Array.isArray(info.roundCount) && info.roundCount.length > 0
        ? `可选：${info.roundCount.join(' / ')} 轮`
        : '—';

  const titleSuffix = isProtagonist ? '公开信息表（主人公）' : '非公开信息表';

  const scenarioTitleForMastermind = scenario.name.trim() || scenario.id;

  return (
    <div style={{ maxHeight: 'min(78vh, 720px)', overflowY: 'auto' as const, paddingRight: '4px' }}>
      <h2
        style={sheetStyles.title}
        aria-label={isProtagonist ? titleSuffix : undefined}
      >
        {isProtagonist ? '公开信息表（主人公）' : `${scenarioTitleForMastermind} · ${titleSuffix}`}
      </h2>

      <div style={sheetStyles.metaGrid}>
        <div>
          <strong style={{ color: '#94a3b8' }}>难度</strong> {scenario.difficulty}
        </div>
        <div>
          <strong style={{ color: '#94a3b8' }}>轮回</strong> {roundLabel}
        </div>
        <div>
          <strong style={{ color: '#94a3b8' }}>天数 / 轮回</strong> {info.dayCount} 天
        </div>
      </div>

      <div style={sheetStyles.section}>
        <h3 style={sheetStyles.sectionTitle}>规则（Y / X）</h3>
        <div style={sheetStyles.rulesBlock}>
          {isProtagonist ? (
            <>
              <div>
                <strong style={{ color: '#4ecca3' }}>规则 Y</strong>：
                <select
                  style={sheetStyles.selectProtagonist}
                  value={d.pickRuleY}
                  onChange={e => patchDraft({ pickRuleY: e.target.value })}
                  aria-label="选择规则 Y"
                >
                  <option value="">选择规则…</option>
                  {rulesY.map(r => (
                    <option key={r.ruleId} value={r.ruleId}>{r.ruleName}</option>
                  ))}
                </select>
                {d.pickRuleY ? <RuleYXFullDetail scenario={scenario} ruleId={d.pickRuleY} /> : null}
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#f87171' }}>规则 X1</strong>：
                <select
                  style={sheetStyles.selectProtagonist}
                  value={d.pickRuleX1}
                  onChange={e => patchDraft({ pickRuleX1: e.target.value })}
                  aria-label="选择规则 X1"
                >
                  <option value="">选择规则…</option>
                  {rulesX.map(r => (
                    <option key={r.ruleId} value={r.ruleId}>{r.ruleName}</option>
                  ))}
                </select>
                {d.pickRuleX1 ? <RuleYXFullDetail scenario={scenario} ruleId={d.pickRuleX1} /> : null}
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#f87171' }}>规则 X2</strong>：
                <select
                  style={sheetStyles.selectProtagonist}
                  value={d.pickRuleX2}
                  onChange={e => patchDraft({ pickRuleX2: e.target.value })}
                  aria-label="选择规则 X2"
                >
                  <option value="">选择规则…</option>
                  {rulesX.map(r => (
                    <option key={r.ruleId} value={r.ruleId}>{r.ruleName}</option>
                  ))}
                </select>
                {d.pickRuleX2 ? <RuleYXFullDetail scenario={scenario} ruleId={d.pickRuleX2} /> : null}
              </div>
            </>
          ) : (
            <>
              <div>
                <strong style={{ color: '#4ecca3' }}>规则 Y</strong>：{ruleDisplayName(info.rule_Y)}
                <RuleYXFullDetail scenario={scenario} ruleId={info.rule_Y} />
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#f87171' }}>规则 X1</strong>：{ruleDisplayName(info.rule_X_1)}
                <RuleYXFullDetail scenario={scenario} ruleId={info.rule_X_1} />
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#f87171' }}>规则 X2</strong>：{ruleDisplayName(info.rule_X_2)}
                <RuleYXFullDetail scenario={scenario} ruleId={info.rule_X_2} />
              </div>
            </>
          )}
        </div>
      </div>

      <div style={sheetStyles.section}>
        <h3 style={sheetStyles.sectionTitle}>特殊规则</h3>
        <div style={sheetStyles.specialRulesBlock}>
          {info.specialRules != null && info.specialRules.trim() !== '' ? (
            info.specialRules
          ) : (
            <span style={sheetStyles.specialRulesEmpty}>（无）</span>
          )}
        </div>
      </div>

      <div style={sheetStyles.section}>
        <h3 style={sheetStyles.sectionTitle}>登場人物</h3>
        <div
          style={
            protagonistAhrDualCast
              ? { ...sheetTableWrap, maxWidth: 'min(100%, 640px)' }
              : sheetTableWrap
          }
        >
          <table style={sheetStyles.castTable}>
            <thead>
              <tr>
                <th scope="col" style={{ ...sheetStyles.castTh, ...sheetStyles.castThPerson }}>人物</th>
                <th scope="col" style={{ ...sheetStyles.castTh, ...sheetStyles.castThFeat }} title="必定无视友好">
                  必定
                </th>
                <th
                  scope="col"
                  style={{ ...sheetStyles.castTh, ...sheetStyles.castThFeat }}
                  title="无视友好；数据为「必定无视友好」时本列亦打勾"
                >
                  无视友好
                </th>
                <th scope="col" style={{ ...sheetStyles.castTh, ...sheetStyles.castThFeat }}>不死</th>
                <th scope="col" style={{ ...sheetStyles.castTh, ...sheetStyles.castThFeat }} title="傀儡无视友好">
                  傀儡
                </th>
                <th scope="col" style={{ ...sheetStyles.castTh, ...sheetStyles.castThRoleLast }}>
                  {protagonistAhrDualCast ? '表里身份' : '身份'}
                </th>
              </tr>
            </thead>
            <tbody>
              {info.NpcRoles.map((nr, i) => {
                const pickedRole = d.castRoleByNpcId[nr.npcId] ?? '';
                const scriptedRoleIds = npcRoleAssignments(nr);
                const ahrPair = d.castRoleAhrLiByNpcId?.[nr.npcId];
                const pickedSurface = ahrPair?.surface ?? '';
                const pickedInner = ahrPair?.inner ?? '';
                const useAhrDualUi = protagonistAhrDualCast && scriptedRoleIds.length >= 2;

                const feats = isProtagonist
                  ? useAhrDualUi
                    ? mergedProtagonistPickedRoleFeatures(mod, pickedSurface, pickedInner)
                    : pickedRole
                      ? roleFeaturesForModule(mod, pickedRole)
                      : []
                  : mergedRoleFeaturesForNpcRow(mod, nr);
                const showFeat =
                  !isProtagonist
                  || (useAhrDualUi
                    ? Boolean(pickedSurface.trim()) || Boolean(pickedInner.trim())
                    : Boolean(pickedRole));
                const rowKey = `${nr.npcId}-${scriptedRoleIds.join('|')}-${i}`;
                return (
                  <tr
                    key={rowKey}
                    style={{
                      backgroundColor: i % 2 === 1 ? 'rgba(30, 41, 59, 0.35)' : 'transparent',
                    }}
                  >
                    <td style={{ ...sheetStyles.castTd, verticalAlign: 'top' }}>
                      <span style={sheetStyles.castNpcName}>{npcDisplayName(nr.npcId)}</span>
                      {(nr.remark ?? '').trim() ? (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: '12px',
                            color: '#94a3b8',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.45,
                            fontWeight: 'normal',
                          }}
                        >
                          备注：{(nr.remark ?? '').trim()}
                        </div>
                      ) : null}
                    </td>
                    <td style={sheetStyles.castTdFeat}>
                      {showFeat && feats.includes('必定无视友好') ? '✓' : <span style={sheetStyles.castFeatEmpty}>—</span>}
                    </td>
                    <td style={sheetStyles.castTdFeat}>
                      {showFeat && (feats.includes('无视友好') || feats.includes('必定无视友好')) ? '✓' : <span style={sheetStyles.castFeatEmpty}>—</span>}
                    </td>
                    <td style={sheetStyles.castTdFeat}>
                      {showFeat && feats.includes('不死') ? '✓' : <span style={sheetStyles.castFeatEmpty}>—</span>}
                    </td>
                    <td style={sheetStyles.castTdFeat}>
                      {showFeat && feats.includes('傀儡无视友好') ? '✓' : <span style={sheetStyles.castFeatEmpty}>—</span>}
                    </td>
                    <td style={{ ...sheetStyles.castTd, verticalAlign: 'top' }}>
                      {isProtagonist ? (
                        useAhrDualUi ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                              minWidth: 0,
                              maxWidth: '100%',
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                fontSize: '11px',
                                color: '#94a3b8',
                              }}
                            >
                              表世界
                              <select
                                style={{ ...sheetStyles.selectProtagonist, marginTop: 0 }}
                                value={pickedSurface}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  patchDraft({
                                    castRoleAhrLiByNpcId: {
                                      ...(d.castRoleAhrLiByNpcId ?? {}),
                                      [nr.npcId]: { surface: v, inner: pickedInner },
                                    },
                                  });
                                }}
                                aria-label={`${npcDisplayName(nr.npcId)} 表世界身份`}
                              >
                                <option value="">选择身份…</option>
                                {castRoleDropdownOptions.map((role) => (
                                  <option key={`s-${role.roleId}`} value={role.roleId}>
                                    {role.roleName}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                fontSize: '11px',
                                color: '#94a3b8',
                              }}
                            >
                              里世界
                              <select
                                style={{ ...sheetStyles.selectProtagonist, marginTop: 0 }}
                                value={pickedInner}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  patchDraft({
                                    castRoleAhrLiByNpcId: {
                                      ...(d.castRoleAhrLiByNpcId ?? {}),
                                      [nr.npcId]: { surface: pickedSurface, inner: v },
                                    },
                                  });
                                }}
                                aria-label={`${npcDisplayName(nr.npcId)} 里世界身份`}
                              >
                                <option value="">选择身份…</option>
                                {castRoleDropdownOptions.map((role) => (
                                  <option key={`i-${role.roleId}`} value={role.roleId}>
                                    {role.roleName}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        ) : (
                          <select
                            style={{ ...sheetStyles.selectProtagonist, marginTop: 0 }}
                            value={pickedRole}
                            onChange={(e) => {
                              const v = e.target.value;
                              patchDraft({ castRoleByNpcId: { ...d.castRoleByNpcId, [nr.npcId]: v } });
                            }}
                            aria-label={`${npcDisplayName(nr.npcId)} 身份`}
                          >
                            <option value="">选择身份…</option>
                            {castRoleDropdownOptions.map(role => (
                              <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                            ))}
                          </select>
                        )
                      ) : (
                        <span style={sheetStyles.castRoleName}>
                          {scenario.moduleId === MODULE_ID_ANOTHER_HORIZON_REVISED && scriptedRoleIds.length >= 2
                            ? `表 ${roleDisplayName(scriptedRoleIds[0])} / 里 ${roleDisplayName(scriptedRoleIds[1])}`
                            : scriptedRoleIds.map((rid) => roleDisplayName(rid)).join('、')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={sheetStyles.section}>
        <h3 style={sheetStyles.sectionTitle}>事件日程</h3>
        <div style={sheetTableWrap}>
          <table style={sheetStyles.incidentTable}>
            <thead>
              <tr>
                <th style={sheetStyles.incidentTh}>天</th>
                <th style={sheetStyles.incidentTh}>事件</th>
                <th style={sheetStyles.incidentTh}>特殊事件</th>
                <th style={sheetStyles.incidentTh}>当事人</th>
              </tr>
            </thead>
            <tbody>
              {info.incident_days.map((row) => {
                const pickedPerson = d.incidentPersonByDay[row.day] ?? '';
                const hasIncident = Boolean(row.incidentId?.trim());
                return (
                  <tr key={`day-${row.day}`}>
                    <td style={sheetStyles.incidentTd}>第 {row.day} 天</td>
                    <td style={sheetStyles.incidentTd}>{incidentDisplayName(row.incidentId)}</td>
                    <td style={sheetStyles.incidentTd}>{row.specialEventFlag === 'true' ? '是' : '否'}</td>
                    <td style={sheetStyles.incidentTd}>
                      {isProtagonist ? (
                        hasIncident ? (
                          <select
                            style={{ ...sheetStyles.selectProtagonist, marginTop: 0 }}
                            value={pickedPerson}
                            onChange={e => {
                              const v = e.target.value;
                              patchDraft({
                                incidentPersonByDay: { ...d.incidentPersonByDay, [row.day]: v },
                              });
                            }}
                            aria-label={`第 ${row.day} 天 当事人`}
                          >
                            <option value="">选择人物…</option>
                            {incidentNpcOptions.map(pid => (
                              <option key={pid} value={pid}>{npcDisplayName(pid)}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={sheetStyles.castFeatEmpty} title="该天无事件，无当事人">—</span>
                        )
                      ) : (
                        hasIncident && row.personId ? npcDisplayName(row.personId) : '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isProtagonist ? (
        <>
          {scenario.features ? (
            <div style={sheetStyles.section}>
              <h3 style={sheetStyles.sectionTitle}>剧本特征</h3>
              <p style={sheetStyles.prose}>{scenario.features}</p>
            </div>
          ) : null}
          {scenario.story ? (
            <div style={sheetStyles.section}>
              <h3 style={sheetStyles.sectionTitle}>故事背景</h3>
              <p style={sheetStyles.prose}>{scenario.story}</p>
            </div>
          ) : null}
        </>
      ) : (
        <div style={sheetStyles.section}>
          <MastermindCollapsibleTextSection isFirst title="剧本特征" text={scenario.features} />
          <MastermindCollapsibleTextSection title="故事背景" text={scenario.story} />
          <MastermindCollapsibleTextSection title="给剧作家的指引" text={scenario.directorGuide} />
        </div>
      )}
    </div>
  );
}
