import type { CSSProperties } from 'react';
import type { ModuleBasicInfo } from '../modules/basicInfo/basicInfo_module';
import { labelForStoredIncidentPerson, type Scenario } from '../scenarios/basicInfo_scenario';
import { ClosedScriptScenarioSheet } from './ClosedScriptScenarioSheet';
import moduleIndex from '../modules/moduleIndex';
import { npcIndex } from '../npc/npcIndex';
import { Person } from '../modules/basicInfo/basicInfo_role';

type ScenarioOverviewPageProps = {
  modules: ModuleBasicInfo[];
  scenarios: Scenario[];
  selectedModuleId: string;
  selectedScenarioId: string;
  onSelectModule: (moduleId: string) => void;
  onSelectScenario: (scenarioId: string) => void;
  onEditSelected: (scenario: Scenario) => void;
  onDeleteSelected: (scenario: Scenario) => void | Promise<void>;
  onClose: () => void;
};

export function ScenarioOverviewPage({
  modules,
  scenarios,
  selectedModuleId,
  selectedScenarioId,
  onSelectModule,
  onSelectScenario,
  onEditSelected,
  onDeleteSelected,
  onClose,
}: ScenarioOverviewPageProps) {
  const filteredScenarios = selectedModuleId
    ? scenarios.filter((s) => s.moduleId === selectedModuleId)
    : scenarios;
  const selected = filteredScenarios.find((s) => s.id === selectedScenarioId)
    ?? scenarios.find((s) => s.id === selectedScenarioId)
    ?? null;

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

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.topBar}>
          <select style={styles.select} value={selectedModuleId} onChange={(e) => onSelectModule(e.target.value)}>
            <option value="">-- 选择模组 --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>{m.fullName}</option>
            ))}
          </select>
          <select style={styles.select} value={selectedScenarioId} onChange={(e) => onSelectScenario(e.target.value)}>
            <option value="">-- 选择剧本 --</option>
            {filteredScenarios.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {selected ? (
            <button type="button" style={styles.infoButton} onClick={() => onEditSelected(selected)}>
              编辑剧本
            </button>
          ) : null}
          {selected ? (
            <button
              type="button"
              style={styles.deleteButton}
              onClick={() => {
                if (!window.confirm(`确定删除剧本「${selected.name}」吗？`)) return;
                void onDeleteSelected(selected);
              }}
            >
              删除剧本
            </button>
          ) : null}
          <button type="button" style={styles.closeButton} onClick={onClose}>
            返回主界面
          </button>
        </div>

        {selected ? (
          <div style={styles.sheetWrap}>
            <ClosedScriptScenarioSheet
              scenario={selected}
              viewMode="mastermind"
              ruleDisplayName={ruleDisplayName}
              incidentDisplayName={incidentDisplayName}
              roleDisplayName={roleDisplayName}
              npcDisplayName={npcDisplayName}
            />
          </div>
        ) : (
          <div style={styles.emptyHint}>请选择模组与剧本后查看一览。</div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', width: '100%', backgroundColor: '#1a1a2e', color: '#fff' },
  inner: { boxSizing: 'border-box', maxWidth: '1400px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' },
  topBar: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' },
  select: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #e94560',
    backgroundColor: '#16213e',
    color: '#fff',
    minWidth: '240px',
    cursor: 'pointer',
  },
  infoButton: { padding: '10px 20px', backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteButton: { padding: '10px 20px', backgroundColor: '#7f1d1d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  closeButton: { padding: '10px 20px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: 'auto' },
  emptyHint: { marginTop: '22px', color: '#94a3b8' },
  sheetWrap: { backgroundColor: '#16213e', borderRadius: '8px', border: '1px solid #1e2e52', padding: '16px' },
};

