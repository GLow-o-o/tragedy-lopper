import { Fragment, type CSSProperties } from 'react';
import type { ModuleBasicInfo } from '../modules/basicInfo/basicInfo_module';
import { formatRoleFeaturesList } from '../modules/basicInfo/basicInfo_role';

type ModuleOverviewPageProps = {
  modules: ModuleBasicInfo[];
  selectedModuleId: string;
  onSelectModule: (moduleId: string) => void;
  onOpenAppend: () => void;
  onEditSelected: () => void;
  onDeleteSelected: (moduleInfo: ModuleBasicInfo) => void | Promise<void>;
  onClose: () => void;
};

export function ModuleOverviewPage({
  modules,
  selectedModuleId,
  onSelectModule,
  onOpenAppend,
  onEditSelected,
  onDeleteSelected,
  onClose,
}: ModuleOverviewPageProps) {
  const selected = modules.find((m) => m.id === selectedModuleId) ?? null;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.topBar}>
          <select
            style={styles.select}
            value={selectedModuleId}
            onChange={(e) => onSelectModule(e.target.value)}
          >
            <option value="">-- 请选择模组 --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>
          <button type="button" style={styles.infoButton} onClick={onOpenAppend}>
            追加模组
          </button>
          {selected ? (
            <button type="button" style={styles.infoButton} onClick={onEditSelected}>
              编辑模组
            </button>
          ) : null}
          {selected ? (
            <button
              type="button"
              style={styles.deleteButton}
              onClick={() => {
                const confirmText = `确定要删除模组「${selected.fullName}」吗？该操作会从工程中移除对应文件。`;
                if (!window.confirm(confirmText)) return;
                void onDeleteSelected(selected);
              }}
            >
              删除模组
            </button>
          ) : null}
          <button type="button" style={styles.closeButton} onClick={onClose}>
            返回主界面
          </button>
        </div>
        <p style={styles.noticeText}>
          追加删除后请尝试刷新网页，如果还未生效请重启工程和服务器。
        </p>

        {selected ? (
          <div style={styles.moduleInfo}>
            <h3>{selected.fullName} （规则，身份，事件速查表）</h3>

            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>模组描述</h4>
              <p style={styles.moduleMetaText}>
                {selected.description?.trim() ? selected.description : '（无）'}
              </p>
            </div>
            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>Ex 槽名称</h4>
              <p style={styles.moduleMetaText}>
                {selected.exSlot?.name?.trim() ? selected.exSlot.name : '（无）'}
              </p>
            </div>
            <div style={styles.moduleMetaBlock}>
              <h4 style={styles.moduleMetaTitle}>Ex 槽描述</h4>
              <p style={styles.moduleMetaText}>
                {selected.exSlot?.description?.trim() ? selected.exSlot.description : '（无）'}
              </p>
            </div>

            <h4>规则</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.moduleRuleMiddle}></th>
                  <th style={styles.moduleRuleLeft}>规则名</th>
                  {selected.roles.map((r) => (
                    <th key={r.roleId} style={{ ...styles.moduleRuleMiddle, verticalAlign: 'top', textAlign: 'center' }}>
                      {r.roleName}
                    </th>
                  ))}
                  <th style={{ ...styles.moduleRuleRight, textAlign: 'center' }}>追加规则</th>
                </tr>
              </thead>
              <tbody style={{ border: '1px solid #ddd' }}>
                {selected.rules.map((rule, ruleIdx) => {
                  const addRulesCount = rule.addRules?.length || 1;
                  return (
                    <Fragment key={`${rule.ruleId}-${ruleIdx}`}>
                      <tr>
                        <td
                          rowSpan={addRulesCount}
                          style={{
                            ...styles.moduleRuleMiddle,
                            verticalAlign: 'middle',
                            textAlign: 'center',
                            width: '15px',
                            color: rule.ruleType === 'X' ? '#a797ff' : '#ff6565',
                          }}
                        >
                          {rule.ruleType}
                        </td>
                        <td rowSpan={addRulesCount} style={{ ...styles.moduleRuleLeft, textAlign: 'left', verticalAlign: 'middle' }}>
                          {rule.ruleName}
                        </td>
                        {selected.roles.map((role, roleIdx) => {
                          const byRoleId = rule.rolesLimits?.find((limit) => limit.roleId === role.roleId);
                          const fallback = rule.rolesLimits?.[roleIdx];
                          const limit = byRoleId ?? fallback;
                          return (
                            <td
                              key={`${rule.ruleId}-${role.roleId}-${roleIdx}`}
                              rowSpan={addRulesCount}
                              style={{
                                ...styles.moduleRuleMiddle,
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                backgroundColor: limit?.maxCount === '' ? '#16213e' : '#0f3460',
                                color: limit?.maxCount === '' ? '#fff' : '#e94560',
                                fontWeight: limit?.maxCount === '' ? 'normal' : 'bold',
                              }}
                            >
                              {limit?.maxCount ?? ''}
                            </td>
                          );
                        })}
                        <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}>{rule.addRules?.[0]?.description || ''}</td>
                      </tr>
                      {rule.addRules?.slice(1).map((addRule, addIdx) => (
                        <tr key={`${ruleIdx}-add-${addIdx}`}>
                          <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top' }}>{addRule.description}</td>
                        </tr>
                      ))}
                    </Fragment>
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
                {selected.roles.map((role, idx) => {
                  const abilityCount = role.abilitys?.length || 1;
                  return (
                    <Fragment key={`${role.roleId}-${idx}`}>
                      <tr style={{ border: '1px solid #ddd' }}>
                        <td rowSpan={abilityCount} style={{ ...styles.moduleRuleLeft, textAlign: 'left', verticalAlign: 'middle', paddingLeft: '8px' }}>
                          {role.roleName}
                        </td>
                        <td rowSpan={abilityCount} style={{ ...styles.roleMaxCountColumn, textAlign: 'center', verticalAlign: 'middle' }}>
                          {role.maxCount}
                        </td>
                        <td rowSpan={abilityCount} style={{ ...styles.moduleMiddle, textAlign: 'left', border: '1px solid #ddd', verticalAlign: 'middle', paddingLeft: '8px' }}>
                          {formatRoleFeaturesList(role.features) || '—'}
                        </td>
                        <td style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}>
                          {role.abilitys?.[0]?.description || ''}
                        </td>
                      </tr>
                      {role.abilitys?.slice(1).map((ability, aidx) => (
                        <tr key={`${idx}-${aidx}`} style={{ border: '1px solid #ddd' }}>
                          <td style={{ ...styles.moduleRuleRight, textAlign: 'left', border: '1px solid #ddd' }}>
                            {ability.description}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
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
                {selected.incidents.map((incident, idx) => {
                  const descriptionCount = incident.Incident_Effects?.length || 1;
                  return (
                    <Fragment key={`${incident.incidentId}-${idx}`}>
                      <tr>
                        <td rowSpan={descriptionCount} style={{ ...styles.moduleRuleLeft, verticalAlign: 'middle', textAlign: 'left', paddingLeft: '8px' }}>
                          {incident.incidentName}
                        </td>
                        <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}>
                          {incident.Incident_Effects?.[0]?.description || ''}
                        </td>
                      </tr>
                      {incident.Incident_Effects?.slice(1).map((effect, descIdx) => (
                        <tr key={`${idx}-desc-${descIdx}`}>
                          <td style={{ ...styles.moduleRuleRight, verticalAlign: 'top', paddingLeft: '8px' }}>
                            {effect.description}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyHint}>请先在顶部下拉框选择一个模组。</div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1a1a2e',
    color: '#fff',
  },
  inner: {
    boxSizing: 'border-box',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'sans-serif',
  },
  topBar: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  select: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #e94560',
    backgroundColor: '#16213e',
    color: '#fff',
    minWidth: '260px',
    cursor: 'pointer',
  },
  infoButton: {
    padding: '10px 20px',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#7f1d1d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyHint: {
    marginTop: '22px',
    color: '#94a3b8',
  },
  noticeText: {
    margin: '0 0 14px 0',
    fontSize: '13px',
    color: '#fce38a',
  },
  moduleInfo: {
    backgroundColor: '#16213e',
    padding: '20px',
    borderRadius: '8px',
    color: '#fff',
    maxHeight: 'calc(100vh - 130px)',
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
    whiteSpace: 'pre-wrap',
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
};

