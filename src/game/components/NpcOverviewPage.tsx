import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { npc, ability } from '../npc/basicInfo_npc';
import { Area, AreaOptions } from '../basicData/areas';
import { Steps, StepsOptions } from '../basicData/steps';
import { RoleType, RoleTypeOptions } from '../basicData/roleTypes';
import { resolveAssertImageUrl, resolveNpcBoardPortraitUrl } from '../npcBoardPortraitResolve';
import {
  canonicalNpcTsFileName,
  generateNpcModuleTsFromData,
  npcIdToExportKeyMap,
} from '../npc/npcCodegen';

export type NpcIndexEntry = readonly [string, npc];

function isAreaValue(v: unknown): v is Area {
  return typeof v === 'string' && (Object.values(Area) as string[]).includes(v as string);
}

function formatAreas(areas: npc['initialArea'] | npc['forbiddenAreas'] | undefined): string {
  if (!areas?.length) return '—';
  return areas.join('、');
}

function formatFeatures(f: string[] | undefined): string {
  if (!f?.length) return '—';
  return f.map((line) => `· ${line}`).join('\n');
}

function formatExecuteTimes(ab: Pick<ability, 'excuteTime'>): string {
  const raw = ab.excuteTime;
  return !Array.isArray(raw) || raw.length === 0 ? '—' : raw.join('、');
}

function formatUseLimitAreaPrint(limit: ability['useLimitArea']): string {
  if (limit == null) return '';
  if (typeof limit === 'string') return limit;
  if (Array.isArray(limit)) return limit.join('、');
  return String(limit);
}

function formatUseLimitRolePrint(limit: ability['useLimitRole']): string {
  if (!Array.isArray(limit) || limit.length === 0) return '';
  const first = limit[0];
  if (typeof first === 'object' && first !== null && 'id' in first) {
    return `NPC 引用 · ${(limit as npc[]).map((x) => x.name).join('、')}`;
  }
  return (limit as RoleType[]).join('、');
}

function formatAbilityLimits(ab: ability): string {
  const parts: string[] = [];
  if (ab.useLimitDay != null) parts.push(`每日 ${ab.useLimitDay} 次`);
  if (ab.useLimitRoope != null) parts.push(`每轮 ${ab.useLimitRoope} 次`);
  if (ab.useLimitArea != null) parts.push(`区域 · ${formatUseLimitAreaPrint(ab.useLimitArea)}`);
  const r = formatUseLimitRolePrint(ab.useLimitRole);
  if (r) parts.push(`角色 · ${r}`);
  return parts.length ? parts.join('；') : '—';
}

function deepCloneNpc(n: npc): npc {
  return structuredClone(n) as npc;
}

/** 编辑表单：英文字段名 + 中文说明；unused 表示当前局内逻辑未读取该字段（仍可写入 TS 存档） */
function FieldCaption(props: { code: string; zh: string; unused?: boolean }) {
  return (
    <div style={styles.fieldCaption}>
      <code style={styles.fieldCode}>{props.code}</code>
      <span style={styles.fieldZhInline}>{props.zh}</span>
      {props.unused ? <span style={styles.fieldUnused}>〔局内未使用〕</span> : null}
    </div>
  );
}

function AbilityUseLimitAreaEdit(props: {
  value?: ability['useLimitArea'];
  onChange: (next: ability['useLimitArea'] | undefined) => void;
}) {
  const { value, onChange } = props;

  type Mode = 'none' | 'current' | 'one' | 'many' | 'not';
  const mode: Mode =
    value == null ? 'none' :
    value === 'currentArea' ? 'current' :
    Array.isArray(value) ? 'many' :
    typeof value === 'string' && value.startsWith('not:') ? 'not' :
    isAreaValue(value) ? 'one' :
    'none';

  const notAreaLabel =
    typeof value === 'string' && value.startsWith('not:') ? (value.slice(4) as Area) : Area.School;
  const singleArea = isAreaValue(value) ? value : Area.School;

  const toggleMany = (a: Area) => {
    const cur = Array.isArray(value) ? [...value] : [];
    if (cur.includes(a)) onChange(cur.filter((x) => x !== a));
    else onChange([...cur, a]);
  };

  return (
    <>
      <label style={styles.editLabel}>
        <FieldCaption
          code="useLimitArea"
          zh="能力可用区域约束（字面量 Area / currentArea / 多选数组 /「not:+区域」）；仅写入数据"
          unused
        />
        <select
          style={styles.editInput}
          value={mode}
          onChange={(e) => {
            const m = e.target.value as Mode;
            if (m === 'none') onChange(undefined);
            if (m === 'current') onChange('currentArea');
            if (m === 'one') onChange(singleArea);
            if (m === 'many') onChange([]);
            if (m === 'not') onChange(`not:${notAreaLabel}` as ability['useLimitArea']);
          }}
        >
          <option value="none">（无）</option>
          <option value="current">currentArea</option>
          <option value="one">单个 Area</option>
          <option value="many">Area 数组（多选）</option>
          <option value="not">not:某区域</option>
        </select>
      </label>
      {mode === 'one' ? (
        <label style={styles.editLabel}>
          <FieldCaption code="useLimitArea · 单区域" zh="常量 Area.xxx（仅存档）" unused />
          <select style={styles.editInput} value={singleArea} onChange={(e) => onChange(e.target.value as Area)}>
            {AreaOptions.map((a) => (
              <option key={String(a)} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {mode === 'many' ? (
        <>
          <FieldCaption code="useLimitArea · Area[]" zh="多区域或关系（勾选组成数组；仅存档）" unused />
          <div style={styles.chipRow}>
          {AreaOptions.map((a) => (
            <label key={`mla-${String(a)}`} style={styles.chip}>
              <input type="checkbox" checked={Array.isArray(value) && value.includes(a)} onChange={() => toggleMany(a)} />
              <span>{a}</span>
            </label>
          ))}
        </div>
        </>
      ) : null}
      {mode === 'not' ? (
        <label style={styles.editLabel}>
          <FieldCaption code="useLimitArea · not:+Area" zh="模板字面量形如 not:${Area.xxx}（仅存档）" unused />
          <select
            style={styles.editInput}
            value={notAreaLabel}
            onChange={(e) => {
              const v = e.target.value as Area;
              onChange(`not:${v}` as ability['useLimitArea']);
            }}
          >
            {AreaOptions.map((a) => (
              <option key={`n-${String(a)}`} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </>
  );
}

/** 与设计数据一致的只读视图 */
export function NpcOverviewView({ exportKey, npcData }: { exportKey: string; npcData: npc }) {
  const portraitUrl = resolveNpcBoardPortraitUrl(npcData.img);
  const tokUrl = npcData.specialTokenImage?.trim() ? resolveAssertImageUrl(npcData.specialTokenImage) : undefined;
  const tokBlock = Boolean(npcData.hasSpecialToken || npcData.specialToken?.trim() || npcData.specialTokenDescription?.trim() || npcData.specialTokenImage?.trim());

  return (
    <div style={styles.viewRoot}>
      <div style={styles.portraitBlock}>
        {portraitUrl ? (
          <img src={portraitUrl} alt="" role="presentation" style={styles.portraitImg} />
        ) : (
          <div style={styles.portraitMissing}>暂无立绘或路径无法在打包资源中解析</div>
        )}
      </div>

      <h3 style={styles.h3}>
        {npcData.name} <span style={styles.metaMuted}>· {npcData.id}</span>
      </h3>

      <h4 style={styles.h4}>基础</h4>
      <table style={styles.table}>
        <tbody>
          <tr>
            <th style={styles.thLeft}>索引键（导出常量名）</th>
            <td style={styles.td}>{exportKey}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>不安限度 instability</th>
            <td style={styles.td}>{npcData.instability}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>角色类型 roleType</th>
            <td style={styles.td}>{npcData.roleType?.length ? npcData.roleType.join('、') : '—'}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>初始区域 initialArea</th>
            <td style={styles.td}>{formatAreas(npcData.initialArea)}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>禁行区域 forbiddenAreas</th>
            <td style={styles.td}>{formatAreas(npcData.forbiddenAreas)}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>感想 thoughts</th>
            <td style={styles.td}>{npcData.thoughts?.trim() ? npcData.thoughts : '—'}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>图片路径 img</th>
            <td style={{ ...styles.td, wordBreak: 'break-all' }}>{npcData.img?.trim() ? npcData.img : '—'}</td>
          </tr>
          <tr>
            <th style={styles.thLeft}>特性 features</th>
            <td style={{ ...styles.td, whiteSpace: 'pre-wrap' }}>{formatFeatures(npcData.features)}</td>
          </tr>
        </tbody>
      </table>

      {tokBlock ? (
        <>
          <h4 style={styles.h4}>特殊标识 token</h4>
          <table style={styles.table}>
            <tbody>
              <tr>
                <th style={styles.thLeft}>hasSpecialToken</th>
                <td style={styles.td}>{npcData.hasSpecialToken ? 'true' : 'false / 未设'}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>specialToken</th>
                <td style={styles.td}>{npcData.specialToken?.trim() ?? '—'}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>specialTokenDescription</th>
                <td style={{ ...styles.td, wordBreak: 'break-all' }}>
                  {npcData.specialTokenDescription?.trim() ? npcData.specialTokenDescription : '—'}
                </td>
              </tr>
              <tr>
                <th style={styles.thLeft}>specialTokenImage</th>
                <td style={{ ...styles.td, wordBreak: 'break-all' }}>{npcData.specialTokenImage?.trim() ?? '—'}</td>
              </tr>
            </tbody>
          </table>
          {tokUrl ? (
            <div style={{ marginTop: 8 }}>
              <img src={tokUrl} alt="" role="presentation" style={{ maxWidth: 88, borderRadius: 8 }} />
            </div>
          ) : npcData.specialTokenImage?.trim() ? (
            <p style={styles.muted}>（无法在打包资源中解析该 token 图路径）</p>
          ) : null}
        </>
      ) : null}

      {npcData.npcState ? (
        <>
          <h4 style={styles.h4}>初始状态 npcState</h4>
          <table style={styles.table}>
            <tbody>
              <tr>
                <th style={styles.thLeft}>currentArea</th>
                <td style={styles.td}>{npcData.npcState.currentArea ?? 'null'}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>不安 instability</th>
                <td style={styles.td}>{npcData.npcState.instability}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>friendlyPoints · 开局友好指示物</th>
                <td style={styles.td}>{npcData.npcState.friendlyPoints}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>conspiracyPoints · 开局密谋指示物</th>
                <td style={styles.td}>{npcData.npcState.conspiracyPoints}</td>
              </tr>
              <tr>
                <th style={styles.thLeft}>存活 isAlive</th>
                <td style={styles.td}>{npcData.npcState.isAlive ? 'true' : 'false'}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : null}

      <h4 style={styles.h4}>能力 abilitys</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={styles.th}>id</th>
            <th style={styles.th}>友好点</th>
            <th style={styles.thWide}>description</th>
            <th style={styles.th}>excuteTime</th>
            <th style={styles.th}>limits</th>
          </tr>
        </thead>
        <tbody>
          {(npcData.abilitys ?? []).map((ab, idx) => (
            <tr key={ab.id || `abi-${idx}`}>
              <td style={styles.tdCenter}>{ab.id}</td>
              <td style={styles.tdCenter}>{ab.friendlyPoints}</td>
              <td style={styles.td}>{ab.abilityDescription}</td>
              <td style={styles.tdSmall}>{formatExecuteTimes(ab)}</td>
              <td style={styles.tdSmall}>{formatAbilityLimits(ab)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(npcData.abilitys ?? []).length === 0 ? <p style={styles.muted}>（无）</p> : null}
    </div>
  );
}

function NpcEditForm(props: {
  exportKey: string;
  npc: npc;
  idToNpc: Map<string, npc>;
  idToExport: Map<string, string>;
  onChange: (next: npc) => void;
}) {
  const { exportKey, npc, idToNpc, idToExport, onChange } = props;

  const patch = useCallback((p: Partial<npc>) => onChange({ ...npc, ...p }), [npc, onChange]);

  const patchState = useCallback(
    (p: Partial<NonNullable<npc['npcState']>>) => {
      const base = npc.npcState ?? {
        currentArea: null,
        instability: 0,
        friendlyPoints: 0,
        conspiracyPoints: 0,
        isAlive: true,
      };
      onChange({ ...npc, npcState: { ...base, ...p } });
    },
    [npc, onChange],
  );

  const ensureAbilities = (): ability[] => (npc.abilitys?.length ? [...npc.abilitys] : []);

  const patchAbility = (idx: number, part: Partial<ability>) => {
    const arr = ensureAbilities();
    const row = arr[idx];
    if (!row) return;
    arr[idx] = { ...row, ...part };
    onChange({ ...npc, abilitys: arr });
  };

  const pushAbility = () => {
    const arr = ensureAbilities();
    arr.push({
      id: `ability_${arr.length + 1}`,
      friendlyPoints: 1,
      abilityDescription: '',
      excuteTime: [Steps.ProtagonistAbility],
    });
    onChange({ ...npc, abilitys: arr });
  };

  const removeAbility = (idx: number) => {
    const arr = ensureAbilities().filter((_, i) => i !== idx);
    onChange({ ...npc, abilitys: arr.length ? arr : undefined });
  };

  const toggleRole = (rt: RoleType) => {
    const cur = npc.roleType ?? [];
    patch({ roleType: cur.includes(rt) ? cur.filter((x) => x !== rt) : [...cur, rt] });
  };

  const toggleInitial = (a: Area) => {
    const cur = npc.initialArea ?? [];
    patch({ initialArea: cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a] });
  };

  const toggleForbidden = (a: Area) => {
    const cur = npc.forbiddenAreas ?? [];
    patch({ forbiddenAreas: cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a] });
  };

  const otherNpcsOptions = useMemo(() => {
    const meId = npc.id;
    return Array.from(idToExport.entries())
      .filter(([nid]) => nid !== meId)
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([nid, ek]) => ({ nid, ek }));
  }, [idToExport, npc.id]);

  return (
    <div style={styles.editRoot}>
      <p style={styles.editHint}>正在编辑：<strong>{exportKey}</strong> · {npc.id}</p>

      <div style={styles.editGrid}>
        <label style={styles.editLabel}>
          <FieldCaption code="id" zh="NPC 卡牌主键字符串；剧本 npcId 引用本值，本页只读" />
          <input style={styles.editInputMuted} readOnly disabled value={npc.id} />
        </label>
        <label style={styles.editLabel}>
          <FieldCaption code="name" zh="卡牌显示名称（局内展示）" />
          <input style={styles.editInput} value={npc.name} onChange={(e) => patch({ name: e.target.value })} />
        </label>
        <label style={styles.editLabel}>
          <FieldCaption
            code="instability"
            zh="不安上限（与 npcState.instability 不同）；版面不安指示物最大值取此字段"
          />
          <input
            style={styles.editInput}
            type="number"
            value={npc.instability}
            onChange={(e) => patch({ instability: Number(e.target.value) || 0 })}
          />
        </label>
      </div>

      <label style={styles.editLabel}>
        <FieldCaption code="img" zh="立绘路径（assert/images/npcs/…）；版图与一览解析" />
        <input style={styles.editInput} value={npc.img ?? ''} onChange={(e) => patch({ img: e.target.value || undefined })} />
      </label>

      <label style={styles.editLabel}>
        <FieldCaption code="thoughts" zh="感想说明（NPC 大卡弹层展示）" />
        <textarea style={styles.editTextarea} value={npc.thoughts ?? ''} onChange={(e) => patch({ thoughts: e.target.value })} />
      </label>

      <label style={styles.editLabel}>
        <FieldCaption
          code="features"
          zh="卡牌特性字符串列表（每行一项）；与模组「身份 features」不同，局内主板不读取本字段"
          unused
        />
        <textarea
          style={styles.editTextarea}
          value={(npc.features ?? []).join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
            patch({ features: lines.length ? lines : undefined });
          }}
        />
      </label>

      <div style={styles.chipSection}>
        <FieldCaption
          code="hasSpecialToken / specialToken / specialTokenDescription / specialTokenImage"
          zh="特殊标识四字段；可作扩展数据，局内主板流程未读取"
          unused
        />
        <div style={styles.chkBlock}>
          <label style={{ ...styles.chk, marginTop: 0 }}>
            <input
              type="checkbox"
              checked={Boolean(npc.hasSpecialToken)}
              onChange={(e) => patch({ hasSpecialToken: e.target.checked || undefined })}
            />
            <span>
              <code style={styles.fieldCode}>hasSpecialToken</code>
              <span style={styles.fieldZhInline}> 是否视作带特殊标记</span>
            </span>
          </label>
        </div>
        <label style={styles.editLabel}>
          <FieldCaption code="specialToken" zh="标记名称字面量" unused />
          <input style={styles.editInput} value={npc.specialToken ?? ''} onChange={(e) => patch({ specialToken: e.target.value || undefined })} />
        </label>
        <label style={styles.editLabel}>
          <FieldCaption code="specialTokenDescription" zh="标记说明文案占位" unused />
          <textarea
            style={styles.editTextarea}
            value={npc.specialTokenDescription ?? ''}
            onChange={(e) => patch({ specialTokenDescription: e.target.value || undefined })}
          />
        </label>
        <label style={styles.editLabel}>
          <FieldCaption code="specialTokenImage" zh="标记图标路径" unused />
          <input style={styles.editInput} value={npc.specialTokenImage ?? ''} onChange={(e) => patch({ specialTokenImage: e.target.value || undefined })} />
        </label>
      </div>

      <div style={styles.chipSection}>
        <FieldCaption code="roleType: RoleType[]" zh="角色类型多选；大卡弹层标签" />
        <div style={styles.chipRow}>
          {RoleTypeOptions.map((rt) => (
            <label key={rt} style={styles.chip}>
              <input type="checkbox" checked={(npc.roleType ?? []).includes(rt)} onChange={() => toggleRole(rt)} />
              <span>{rt}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.chipSection}>
        <FieldCaption code="initialArea: Area[]" zh="初始可登场区域（多选）；至少一项；用于开局落位推导" />
        <div style={styles.chipRow}>
          {AreaOptions.map((a) => (
            <label key={String(a)} style={styles.chip}>
              <input type="checkbox" checked={(npc.initialArea ?? []).includes(a)} onChange={() => toggleInitial(a)} />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.chipSection}>
        <FieldCaption code="forbiddenAreas?: Area[]" zh="禁行区域；大卡/移动相关逻辑读取" />
        <div style={styles.chipRow}>
          {AreaOptions.map((a) => (
            <label key={`f-${String(a)}`} style={styles.chip}>
              <input type="checkbox" checked={(npc.forbiddenAreas ?? []).includes(a)} onChange={() => toggleForbidden(a)} />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.chipSection}>
        <FieldCaption code="npcState" zh="开局盘面状态（不安/友好/密谋/存活/当前格）；局内指示物初值来源" />
        <div style={styles.editGrid}>
          <label style={styles.editLabel}>
            <FieldCaption code="currentArea" zh="开局所在区域枚举；空为 null" />
            <select
              style={styles.editInput}
              value={npc.npcState?.currentArea ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                patchState({ currentArea: v === '' ? null : (v as Area) });
              }}
            >
              <option value="">null</option>
              {AreaOptions.map((a) => (
                <option key={String(a)} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label style={styles.editLabel}>
            <FieldCaption code="npcState.instability" zh="开局不安度数（≠ 卡牌 instability 上限）；版图不安指示物当前值初始" />
            <input
              style={styles.editInput}
              type="number"
              value={npc.npcState?.instability ?? 0}
              onChange={(e) => patchState({ instability: Number(e.target.value) || 0 })}
            />
          </label>
          <div style={styles.fullWidthStack}>
            <label style={styles.editLabel}>
              <FieldCaption code="friendlyPoints" zh="开局友好指示物数量" />
              <input
                style={styles.editInput}
                type="number"
                value={npc.npcState?.friendlyPoints ?? 0}
                onChange={(e) => patchState({ friendlyPoints: Number(e.target.value) || 0 })}
              />
            </label>
            <label style={styles.editLabel}>
              <FieldCaption code="conspiracyPoints" zh="开局密谋指示物数量" />
              <input
                style={styles.editInput}
                type="number"
                value={npc.npcState?.conspiracyPoints ?? 0}
                onChange={(e) => patchState({ conspiracyPoints: Number(e.target.value) || 0 })}
              />
            </label>
          </div>
          <div style={styles.chkBlock}>
            <FieldCaption code="isAlive" zh="开局是否视作存活（与 UI 存亡覆盖配合）" />
            <label style={{ ...styles.chk, marginTop: 0 }}>
              <input
                type="checkbox"
                checked={npc.npcState?.isAlive !== false}
                onChange={(e) => patchState({ isAlive: e.target.checked })}
              />
              <code style={styles.fieldCode}>isAlive</code>
            </label>
          </div>
        </div>
      </div>

      <div style={styles.chipSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <FieldCaption code="abilitys?: ability[]" zh="能力列表；大卡弹层列出 abilityDescription / friendlyPoints / excuteTime（拼写沿用数据）" />
          <button type="button" style={styles.smallBtn} onClick={pushAbility}>
            新增一条
          </button>
        </div>
        {(npc.abilitys ?? []).map((ab, idx) => (
          <div key={`ab-${idx}`} style={styles.abilityCard}>
            <div style={styles.editGrid}>
              <label style={styles.editLabel}>
                <FieldCaption code="id" zh="能力条目键名（React 列表 key）；局内逻辑未单独读取" unused />
                <input style={styles.editInput} value={ab.id} onChange={(e) => patchAbility(idx, { id: e.target.value })} />
              </label>
              <label style={styles.editLabel}>
                <FieldCaption code="friendlyPoints" zh="发动所需友好点数（大卡「需友好」展示）" />
                <input
                  style={styles.editInput}
                  type="number"
                  min={0}
                  value={ab.friendlyPoints}
                  onChange={(e) => patchAbility(idx, { friendlyPoints: Math.max(0, Number(e.target.value) || 0) })}
                />
              </label>
              <div style={styles.chkBlock}>
                <FieldCaption code="useLimitDay: 1" zh="可选：每日次数限制字面量；引擎未自动扣次" unused />
                <label style={{ ...styles.chk, marginTop: 0 }}>
                  <input type="checkbox" checked={ab.useLimitDay === 1} onChange={(e) => patchAbility(idx, { useLimitDay: e.target.checked ? 1 : undefined })} />
                  <span style={styles.chkLabelText}>勾选写入</span>
                  <code style={styles.fieldCode}>useLimitDay: 1</code>
                </label>
              </div>
              <div style={styles.chkBlock}>
                <FieldCaption code="useLimitRoope: 1" zh="可选：每轮回次数限制字面量；引擎未自动扣次" unused />
                <label style={{ ...styles.chk, marginTop: 0 }}>
                  <input
                    type="checkbox"
                    checked={ab.useLimitRoope === 1}
                    onChange={(e) => patchAbility(idx, { useLimitRoope: e.target.checked ? 1 : undefined })}
                  />
                  <span style={styles.chkLabelText}>勾选写入</span>
                  <code style={styles.fieldCode}>useLimitRoope: 1</code>
                </label>
              </div>
            </div>
            <AbilityUseLimitAreaEdit value={ab.useLimitArea} onChange={(u) => patchAbility(idx, { useLimitArea: u })} />
            <label style={styles.editLabel}>
              <FieldCaption code="abilityDescription" zh="效果全文（大卡弹层主文案）" />
              <textarea
                style={styles.editTextarea}
                value={ab.abilityDescription}
                onChange={(e) => patchAbility(idx, { abilityDescription: e.target.value })}
              />
            </label>
            <div style={{ marginTop: 8 }}>
              <FieldCaption
                code="excuteTime: Steps[]"
                zh="触发阶段多选（接口字段名 excuteTime 拼写沿用）；大卡展示各阶段文案"
              />
              <div style={styles.chipRow}>
                {StepsOptions.map((st) => (
                  <label key={`${idx}-${st}`} style={styles.chip}>
                    <input
                      type="checkbox"
                      checked={ab.excuteTime.includes(st)}
                      onChange={() =>
                        patchAbility(idx, {
                          excuteTime: ab.excuteTime.includes(st) ? ab.excuteTime.filter((s) => s !== st) : [...ab.excuteTime, st],
                        })
                      }
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <FieldCaption code="useLimitRole: npc[]" zh="NPC 交叉引用数组（存档生成 import）；引擎未校验发动对象" unused />
              <div style={styles.chipRow}>
                {otherNpcsOptions.map(({ nid, ek }) => {
                  const cur = Array.isArray(ab.useLimitRole) ? ab.useLimitRole : [];
                  const isNpcRefs = cur.length > 0 && typeof cur[0] === 'object' && cur[0] !== null && 'id' in cur[0];
                  const refs = isNpcRefs ? (cur as npc[]) : [];
                  const on = refs.some((r) => r.id === nid);
                  return (
                    <label key={nid} style={styles.chip}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => {
                          const tgt = idToNpc.get(nid);
                          if (!tgt) return;
                          let refs: npc[] = [];
                          if (
                            Array.isArray(ab.useLimitRole) &&
                            ab.useLimitRole.length > 0 &&
                            typeof ab.useLimitRole[0] === 'object'
                          ) {
                            refs = [...(ab.useLimitRole as npc[])];
                          }
                          const onNpc = refs.some((r) => r.id === nid);
                          const merged = onNpc ? refs.filter((r) => r.id !== nid) : [...refs, tgt];
                          patchAbility(idx, { useLimitRole: merged.length ? merged : undefined });
                        }}
                      />
                      <span>{ek}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <FieldCaption code="useLimitRole: RoleType[]" zh="NPC 能力与角色类型限制（数据）；引擎未读取" unused />
              <div style={styles.chipRow}>
                {RoleTypeOptions.map((rt) => {
                  const cur = Array.isArray(ab.useLimitRole) ? ab.useLimitRole : [];
                  const roles = cur.length > 0 && typeof cur[0] === 'string' ? (cur as unknown as RoleType[]) : [];
                  const on = roles.includes(rt);
                  return (
                    <label key={`rr-${idx}-${rt}`} style={styles.chip}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => {
                          const curUr = Array.isArray(ab.useLimitRole) ? ab.useLimitRole : [];
                          const baseRoles =
                            curUr.length > 0 && typeof curUr[0] === 'string' ? [...(curUr as unknown as RoleType[])] : [];
                          const roleOn = baseRoles.includes(rt);
                          const next = roleOn ? baseRoles.filter((x) => x !== rt) : [...baseRoles, rt];
                          patchAbility(idx, { useLimitRole: next.length ? next : undefined });
                        }}
                      />
                      <span>{rt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {(npc.abilitys ?? []).length > 1 ? (
              <button type="button" style={styles.removeBtn} onClick={() => removeAbility(idx)}>
                删除本条
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

type NpcOverviewBodyProps = {
  npcEntries: NpcIndexEntry[];
};

/** 弹窗等处复用：列表 + 只读明细 */
export function NpcOverviewBody({ npcEntries }: NpcOverviewBodyProps) {
  const keys = useMemo(() => npcEntries.map(([k]) => k), [npcEntries]);
  const [selectedKey, setSelectedKey] = useState(() => keys[0] ?? '');
  const selected = npcEntries.find(([k]) => k === selectedKey)?.[1] ?? null;

  useEffect(() => {
    if (keys.length === 0) return;
    if (!keys.includes(selectedKey)) setSelectedKey(keys[0]!);
  }, [keys, selectedKey]);

  if (npcEntries.length === 0) {
    return <div style={styles.emptyHint}>暂无已注册的 NPC。</div>;
  }

  return (
    <div>
      <div style={styles.selectorRow}>
        <label style={styles.selectorLabel}>
          选择 NPC
          <select style={styles.select} value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
            {npcEntries.map(([key, n]) => (
              <option key={key} value={key}>
                {n.name}（{key} · {n.id}）
              </option>
            ))}
          </select>
        </label>
      </div>
      {selected ? <NpcOverviewView exportKey={selectedKey} npcData={selected} /> : null}
    </div>
  );
}

type NpcOverviewPageProps = {
  npcEntries: NpcIndexEntry[];
  onClose: () => void;
  onOpenAppend?: () => void;
};

export function NpcOverviewPage({ npcEntries, onClose, onOpenAppend }: NpcOverviewPageProps) {
  const keys = useMemo(() => npcEntries.map(([k]) => k).sort((a, b) => {
    const idA = npcEntries.find(([k]) => k === a)?.[1].id ?? '';
    const idB = npcEntries.find(([k]) => k === b)?.[1].id ?? '';
    return idA.localeCompare(idB, undefined, { numeric: true }) || a.localeCompare(b);
  }), [npcEntries]);

  const [selectedKey, setSelectedKey] = useState(() => keys[0] ?? '');
  const selected = npcEntries.find(([k]) => k === selectedKey)?.[1] ?? null;

  useEffect(() => {
    if (keys.length === 0) return;
    if (!keys.includes(selectedKey)) setSelectedKey(keys[0]!);
  }, [keys, selectedKey]);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<npc | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  const idToExport = useMemo(() => npcIdToExportKeyMap(npcEntries), [npcEntries]);
  const idToNpc = useMemo(() => new Map(npcEntries.map(([, n]) => [n.id, n])), [npcEntries]);

  const beginEdit = () => {
    if (!selected) return;
    setSaveMsg('');
    setSaveErr('');
    setDraft(deepCloneNpc(selected));
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
    setSaveErr('');
  };

  const validateDraft = (d: npc): string | null => {
    if (!d.name.trim()) return '请填写 NPC 名称。';
    if (!d.roleType?.length) return '至少选择一项 roleType。';
    if (!d.initialArea?.length) return '至少选择一项初始区域 initialArea。';
    for (let i = 0; i < (d.abilitys ?? []).length; i++) {
      const ai = d.abilitys![i]!;
      if (!ai.abilityDescription.trim()) return `第 ${i + 1} 条能力缺少描述。`;
      if (!ai.excuteTime?.length) return `第 ${i + 1} 条能力请至少勾选一项触发时机。`;
    }
    return null;
  };

  const performSave = async () => {
    if (!draft) return;
    const errText = validateDraft(draft);
    if (errText) {
      setSaveErr(errText);
      return;
    }
    const fileName = canonicalNpcTsFileName(selectedKey, draft.id);
    if (!fileName) {
      setSaveErr(
        '该 NPC 卡牌 id 不是 npc_XX 形式，无法用本页写入主数据目录。请在「追加 NPC」页写入 npcData/custom/。',
      );
      return;
    }
    const code = generateNpcModuleTsFromData({
      exportVarName: selectedKey,
      data: draft,
      depth: 'npcData',
      npcIdToExportKey: idToExport,
    });

    setSaveBusy(true);
    setSaveErr('');
    setSaveMsg('');
    try {
      const res = await fetch('/api/npcs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canonicalFileName: fileName,
          npcCode: code,
          overwrite: true,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        message?: string;
        npcFile?: string;
        overwritten?: boolean;
      };
      if (!res.ok) {
        if (res.status === 404) {
          setSaveErr(
            '接口 404：未找到 /api/npcs/save。请在本机终端运行 npm run server，并经由 Vite 代理访问。',
          );
          return;
        }
        throw new Error(payload.message || `保存失败 (${res.status})`);
      }
      setSaveMsg(
        (payload.overwritten ? `已写入（覆盖）${payload.npcFile ?? fileName}` : `已写入 ${payload.npcFile ?? fileName}`) +
          ' — 请刷新页面以重新加载 npc 数据。',
      );
      setEditing(false);
      setDraft(null);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaveBusy(false);
    }
  };

  if (npcEntries.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.inner}>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            返回
          </button>
          <p style={styles.emptyHint}>暂无已注册的 NPC。</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.topBar}>
          {onOpenAppend ? (
            <button type="button" style={styles.infoButton} onClick={onOpenAppend}>
              追加 NPC
            </button>
          ) : null}
          {!editing ? (
            <button type="button" style={styles.infoButton} onClick={() => selected && beginEdit()}>
              编辑所选并入工程文件
            </button>
          ) : (
            <>
              <button type="button" style={styles.infoButton} disabled={saveBusy} onClick={() => void performSave()}>
                {saveBusy ? '保存…' : '保存到 npcData/*.ts'}
              </button>
              <button type="button" style={styles.secondaryButton} disabled={saveBusy} onClick={cancelEdit}>
                取消编辑
              </button>
            </>
          )}
          <button type="button" style={styles.closeButton} onClick={onClose}>
            返回主界面
          </button>
        </div>

        <p style={styles.noticeText}>
          以下为 npcIndex 中的 NPC 数据结构。立绘取自 <code style={styles.codeInline}>img</code>；
          token 预览支持 <code style={styles.codeInline}>assert/images/tokens/</code>。
          保存到工程需同时运行游戏服：<code style={styles.codeInline}>npm run server</code>（Vite dev 已将 /api 代理到默认 8000 端口）。
        </p>

        <div style={styles.sheetWrap}>
          <label style={styles.selectorLabelWide}>
            选择 NPC
            <select style={styles.selectWide} value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)} disabled={saveBusy}>
              {keys.map((key) => {
                const pair = npcEntries.find(([k]) => k === key);
                const n = pair?.[1];
                if (!n) return null;
                return (
                  <option key={key} value={key}>
                    [{n.id}] {n.name} · {key}
                  </option>
                );
              })}
            </select>
          </label>

          {saveMsg ? <p style={styles.successText}>{saveMsg}</p> : null}
          {saveErr ? <p style={styles.errorText}>{saveErr}</p> : null}

          {!editing && selected ? (
            <NpcOverviewView exportKey={selectedKey} npcData={selected} />
          ) : null}

          {editing && draft ? (
            <NpcEditForm exportKey={selectedKey} npc={draft} idToNpc={idToNpc} idToExport={idToExport} onChange={setDraft} />
          ) : null}

          {!editing && selected ? (
            <details style={styles.details}>
              <summary style={styles.summary}>预览将写入磁盘的内容（校验用）</summary>
              <textarea
                readOnly
                style={styles.previewCode}
                value={generateNpcModuleTsFromData({
                  exportVarName: selectedKey,
                  data: selected,
                  depth: 'npcData',
                  npcIdToExportKey: idToExport,
                })}
              />
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', width: '100%', backgroundColor: '#1a1a2e', color: '#fff' },
  inner: { boxSizing: 'border-box', maxWidth: '1280px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui,sans-serif' },
  topBar: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' },
  infoButton: { padding: '10px 16px', backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 13 },
  secondaryButton: { padding: '10px 16px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 13 },
  closeButton: { padding: '10px 20px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: 'auto', fontSize: 13 },
  noticeText: { margin: '0 0 14px 0', fontSize: '13px', color: '#fce38a', lineHeight: 1.55 },
  codeInline: {
    fontFamily: 'Consolas,monospace',
    fontSize: 12,
    backgroundColor: 'rgba(30,41,82,0.9)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  sheetWrap: { backgroundColor: '#16213e', borderRadius: '8px', border: '1px solid #1e2e52', padding: '16px', maxHeight: 'calc(100vh - 132px)', overflow: 'auto' },
  selectorLabelWide: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#cbd5e1', marginBottom: 12 },
  selectWide: { padding: '10px 14px', fontSize: 15, borderRadius: '8px', border: '2px solid #e94560', backgroundColor: '#0f172a', color: '#fff', cursor: 'pointer' },

  selectorRow: { marginBottom: 12 },
  selectorLabel: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#cbd5e1' },
  select: { padding: '10px 14px', fontSize: '15px', borderRadius: '8px', border: '2px solid #e94560', backgroundColor: '#16213e', color: '#fff', maxWidth: '520px', cursor: 'pointer' },

  emptyHint: { marginTop: '22px', color: '#94a3b8' },

  viewRoot: { color: '#e2e8f0' },
  portraitBlock: { marginBottom: '12px' },
  portraitImg: { width: 'min(260px, 38vw)', maxHeight: '360px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a' },
  portraitMissing: { padding: '24px', backgroundColor: '#0f172a', borderRadius: 8, border: '1px dashed #475569', color: '#94a3b8' },

  h3: { margin: '0 0 10px', fontSize: '19px' },
  h4: { margin: '16px 0 8px', fontSize: '15px', color: '#f8fafc' },
  metaMuted: { fontSize: '14px', color: '#94a3b8', fontWeight: 'normal' },
  muted: { color: '#94a3b8', fontSize: '13px' },
  successText: { color: '#86efac', fontSize: '13px' },
  errorText: { color: '#fca5a5', fontSize: '13px' },

  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 8 },
  th: { border: '1px solid #cbd5e1', padding: '8px', backgroundColor: '#0f3460', fontSize: '12px', color: '#f1f5f9' },
  thLeft: { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left', width: '160px', backgroundColor: '#0f3460', verticalAlign: 'top', fontSize: 13 },
  thWide: { border: '1px solid #cbd5e1', padding: '8px', backgroundColor: '#0f3460', minWidth: '200px', fontSize: 12 },
  td: { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left', verticalAlign: 'top', fontSize: 13 },
  tdCenter: { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center', verticalAlign: 'top', fontSize: 13 },
  tdSmall: { border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left', verticalAlign: 'top', fontSize: 12, color: '#cbd5e1' },

  details: { marginTop: '18px' },
  summary: { cursor: 'pointer', color: '#94a3b8', marginBottom: 8 },
  previewCode: {
    width: '100%',
    minHeight: '240px',
    boxSizing: 'border-box',
    backgroundColor: '#020617',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: 12,
    fontSize: '11px',
    fontFamily: 'Consolas,monospace',
  },

  editRoot: { paddingTop: 8 },
  editHint: { color: '#e2e8f0', fontSize: '14px', marginBottom: 12 },
  fieldCaption: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px', marginBottom: 4 },
  fieldCode: { fontFamily: 'Consolas,monospace', fontSize: '12px', color: '#a5b4fc' },
  fieldZhInline: { fontSize: '12px', color: '#94a3b8', lineHeight: 1.45 },
  fieldUnused: { fontSize: '11px', color: '#fca5a5', fontWeight: 700, whiteSpace: 'nowrap' },
  chkBlock: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4 },
  fullWidthStack: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 12 },
  editGrid: { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' },
  editLabel: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#cbd5e1' },
  editInput: { backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '6px', padding: '8px 10px', fontSize: 13 },
  editInputMuted: { backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', fontSize: 13 },
  editTextarea: { width: '100%', minHeight: 72, backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: 6, padding: 10, boxSizing: 'border-box', fontSize: 13 },
  chk: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1', marginTop: 6 },
  chkLabelText: { fontSize: 13, color: '#cbd5e1' },
  chipSection: { marginTop: '14px' },
  subHeading: { display: 'block', fontWeight: 600, color: '#f8fafc', marginBottom: 8 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' },
  chip: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' },
  abilityCard: { border: '1px solid #334155', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: 'rgba(15,23,42,0.65)' },
  smallBtn: { backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: 12 },
  removeBtn: { marginTop: 10, backgroundColor: '#7f1d1d', color: '#fecaca', border: 'none', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontSize: 12 },
  smallMuted: { display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 },
};
