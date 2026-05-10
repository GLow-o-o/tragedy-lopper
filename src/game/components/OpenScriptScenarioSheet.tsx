/**
 * 开始页 / 主人公侧：剧本公开信息（不含身份对应等闭剧本内容）
 */
import React from 'react';
import type { Scenario } from '../scenarios/basicInfo_scenario';

export interface OpenScriptScenarioSheetProps {
  scenario: Scenario;
  selectedLoopCount?: number;
  ruleDisplayName: (ruleId: string) => string;
  incidentDisplayName: (incidentId: string) => string;
  roleDisplayName: (roleId: string) => string;
  npcDisplayName: (npcId: string) => string;
}

export function OpenScriptScenarioSheet(props: OpenScriptScenarioSheetProps) {
  const { scenario, selectedLoopCount, ruleDisplayName, incidentDisplayName, npcDisplayName } = props;
  const info = scenario.ScenarioInfo;
  const roundLabel =
    selectedLoopCount != null && selectedLoopCount > 0
      ? `${selectedLoopCount} 轮`
      : Array.isArray(info.roundCount) && info.roundCount.length > 0
        ? `可选：${info.roundCount.join(' / ')} 轮`
        : '—';

  return (
    <div style={{ maxHeight: 'min(72vh, 640px)', overflowY: 'auto' as const }}>
      <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: '#f2efe6' }}>{scenario.name} · 剧本信息</h2>
      <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.55 }}>
        <div>难度 {scenario.difficulty} · 轮回 {roundLabel} · 每轮回 {info.dayCount} 天</div>
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#4ecca3' }}>规则 Y</strong>：{ruleDisplayName(info.rule_Y)}
        </div>
        <div style={{ marginTop: '6px' }}>
          <strong style={{ color: '#f87171' }}>规则 X1</strong>：{ruleDisplayName(info.rule_X_1)}
        </div>
        <div style={{ marginTop: '6px' }}>
          <strong style={{ color: '#f87171' }}>规则 X2</strong>：{ruleDisplayName(info.rule_X_2)}
        </div>
      </div>
      <h3 style={{ margin: '18px 0 8px', fontSize: '15px', color: '#94a3b8' }}>登场人物（公开）</h3>
      <ul style={{ margin: 0, paddingLeft: '20px', color: '#e2e8f0', fontSize: '14px', lineHeight: 1.7 }}>
        {info.NpcRoles.map((nr) => (
          <li key={nr.npcId}>{npcDisplayName(nr.npcId)}</li>
        ))}
      </ul>
      <h3 style={{ margin: '18px 0 8px', fontSize: '15px', color: '#94a3b8' }}>事件日程（公开）</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b' }}>天</th>
            <th style={{ textAlign: 'left', padding: '6px 8px', color: '#64748b' }}>事件</th>
          </tr>
        </thead>
        <tbody>
          {info.incident_days.map((row) => (
            <tr key={`d-${row.day}`}>
              <td style={{ padding: '6px 8px', borderTop: '1px solid #334155', color: '#e2e8f0' }}>第 {row.day} 天</td>
              <td style={{ padding: '6px 8px', borderTop: '1px solid #334155', color: '#e2e8f0' }}>
                {incidentDisplayName(row.incidentId)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {scenario.features ? (
        <>
          <h3 style={{ margin: '18px 0 8px', fontSize: '15px', color: '#94a3b8' }}>剧本特征</h3>
          <p style={{ fontSize: '14px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{scenario.features}</p>
        </>
      ) : null}
      {scenario.story ? (
        <>
          <h3 style={{ margin: '18px 0 8px', fontSize: '15px', color: '#94a3b8' }}>故事背景</h3>
          <p style={{ fontSize: '14px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{scenario.story}</p>
        </>
      ) : null}
    </div>
  );
}
