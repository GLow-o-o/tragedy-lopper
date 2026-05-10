import { useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Area, AreaOptions } from '../basicData/areas';
import { Steps, StepsOptions } from '../basicData/steps';
import { RoleType, RoleTypeOptions } from '../basicData/roleTypes';

type AppendNpcPageProps = {
  onClose: () => void;
};

type AbilityDraft = {
  id: string;
  friendlyPoints: number;
  description: string;
  steps: Steps[];
  /** 勾选时生成 useLimitRoope: 1（每轮 1 次） */
  useLimitRoope: boolean;
};

/** 各输入项参考文案（范本：NPC「男学生」`NPC_01_Boy_Student`） */
const REF_BOY_STUDENT = {
  exportName: 'Boy_Student',
  npcId: 'npc_01',
  displayName: '男学生',
  instability: '2',
  thoughts: '普通的男学生，在学校很常见吧',
  img: 'assert/images/npcs/男学生.png',
  roleTypes: '勾选「学生」「少年」',
  initialAreas: '勾选「学校」',
  forbiddenAreas: '可不勾选（范本无任何禁行区域）',
  abilityId: 'ability1',
  friendlyPoints: '2',
  abilityDesc: '移除同一区域另外1名角色身上的1枚不安指示物',
  steps: '勾选「主人公能力阶段」',
  generatedCode: '结构与 NPC_01_Boy_Student.ts 一致（单能力、同一导出形态）',
} as const;

/** 轮限字段说明（范本含 useLimitRoope 的 NPC，如 NPC_06_Shrine_Maiden） */
const REF_USE_LIMIT_ROOPE = '勾选「每轮 1 次」（对应 useLimitRoope: 1）';

function escapeTsSingleQuoted(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function enumMemberFromValue<E extends Record<string, string>>(enumObj: E, value: string): string | null {
  const key = (Object.keys(enumObj) as Array<keyof E>).find((k) => enumObj[k] === value);
  return key != null ? String(key) : null;
}

function roleTypesToCode(selected: RoleType[]): string {
  return selected
    .map((v) => {
      const name = enumMemberFromValue(RoleType as unknown as Record<string, string>, v);
      return name ? `RoleType.${name}` : null;
    })
    .filter(Boolean)
    .join(', ');
}

function stepsToCode(selected: Steps[]): string {
  return selected
    .map((v) => {
      const name = enumMemberFromValue(Steps as unknown as Record<string, string>, v);
      return name ? `Steps.${name}` : null;
    })
    .filter(Boolean)
    .join(', ');
}

function areasToCode(selected: Area[]): string {
  return selected
    .map((v) => {
      const name = enumMemberFromValue(Area as unknown as Record<string, string>, v);
      return name ? `Area.${name}` : null;
    })
    .filter(Boolean)
    .join(', ');
}

function clampNonNegativeFriendlyPoints(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? Math.max(0, v) : 0;
}

export function generateNpcModuleTs(params: {
  exportVarName: string;
  npcId: string;
  displayName: string;
  instability: number;
  thoughts: string;
  img: string;
  roleTypes: RoleType[];
  initialAreas: Area[];
  forbiddenAreas: Area[];
  abilities: AbilityDraft[];
}): string {
  const primaryArea = params.initialAreas[0] ?? Area.School;
  const primaryAreaCode = enumMemberFromValue(Area as unknown as Record<string, string>, primaryArea);
  const currentAreaExpr = primaryAreaCode ? `Area.${primaryAreaCode}` : `Area.School`;

  const imgBlock =
    params.img.trim().length > 0
      ? [`    img: '${escapeTsSingleQuoted(params.img.trim())}', // NPC卡牌图片URL`]
      : [];

  const abilityInner =
    params.abilities.length === 0
      ? ''
      : `\n${params.abilities
          .map((ab) => {
            const times = stepsToCode(ab.steps);
            const timeExpr = times.length > 0 ? `[${times}]` : '[]';
            const lines = [
              '        {',
              `            id: '${escapeTsSingleQuoted(ab.id)}',`,
              `            friendlyPoints: ${clampNonNegativeFriendlyPoints(ab.friendlyPoints)},`,
              `            abilityDescription: '${escapeTsSingleQuoted(ab.description)}',`,
              `            excuteTime: ${timeExpr},`,
            ];
            if (ab.useLimitRoope) lines.push('            useLimitRoope: 1,');
            lines.push('        }');
            return lines.join('\n');
          })
          .join(',\n')}\n    `;

  return [
    'import { Area } from "../../../basicData/areas";',
    'import { Steps } from "../../../basicData/steps";',
    'import { RoleType } from "../../../basicData/roleTypes";',
    'import { npc } from "../../basicInfo_npc";',
    '',
    `export const ${params.exportVarName}: npc = {`,
    `    id: '${escapeTsSingleQuoted(params.npcId)}',`,
    `    name: '${escapeTsSingleQuoted(params.displayName)}',`,
    `    roleType: [${roleTypesToCode(params.roleTypes)}],`,
    ...imgBlock,
    `    abilitys: [${abilityInner}],`,
    `    thoughts: '${escapeTsSingleQuoted(params.thoughts)}',`,
    `    initialArea: [${areasToCode(params.initialAreas)}],`,
    `    forbiddenAreas: [${areasToCode(params.forbiddenAreas)}],`,
    `    instability: ${Number.isFinite(params.instability) ? params.instability : 0},`,
    '    npcState: {',
    `        currentArea: ${currentAreaExpr},`,
    '        instability: 0,',
    '        friendlyPoints: 0,',
    '        conspiracyPoints: 0,',
    '        isAlive: true',
    '    }',
    '}',
    '',
  ].join('\n');
}

function sanitizeNpcExportName(raw: string): string {
  let s = raw.trim().replace(/[^a-zA-Z0-9_]/g, '_');
  if (/^\d/.test(s)) s = `_${s}`;
  return s || 'Custom_NPC';
}

function sanitizeNpcFileSlug(raw: string): string {
  const s = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return s || 'custom_npc';
}

type AppendNpcInstructionsProps = { compact?: boolean };

/** 与页面共用的新增 NPC 说明正文（可在弹层中复用） */
export function AppendNpcInstructions({ compact }: AppendNpcInstructionsProps = {}) {
  if (compact) {
    return (
      <section style={instructionStyles.section}>
        <p style={instructionStyles.lead}>
          请返回主界面打开「追加NPC」，在运行游戏服（<code style={instructionStyles.code}>npm run server</code>）时使用表单保存；文件将写入{' '}
          <code style={instructionStyles.code}>npcData/custom/</code> 并更新 <code style={instructionStyles.code}>npcIndex.ts</code>。
        </p>
        <p style={instructionStyles.note}>
          版图立绘：将 PNG 等放在 <code style={instructionStyles.code}>src/game/assert/images/npcs/</code>，并在本页「图片路径」或 NPC 数据的{' '}
          <code style={instructionStyles.code}>img</code> 中填写该目录下文件的相对路径或文件名（与所选剧本中的 npcId 对应卡牌一致即可）。
        </p>
      </section>
    );
  }
  return (
    <section style={instructionStyles.section}>
      <p style={instructionStyles.lead}>
        使用下方表单生成代码后，在运行本机游戏服（<code style={instructionStyles.code}>npm run server</code>）时可通过「保存到工程」写入{' '}
        <code style={instructionStyles.code}>src/game/npc/npcData/custom/</code>，并自动更新{' '}
        <code style={instructionStyles.code}>npcIndex.ts</code>（与模组 / 剧本相同机制）。
      </p>
      <ol style={instructionStyles.ol}>
        <li style={instructionStyles.li}>
          保存前请确认导出常量名（英文字母开头）与卡牌 <code style={instructionStyles.code}>id</code> 不与现有 NPC 冲突。
        </li>
        <li style={instructionStyles.li}>
          若要在版图显示立绘：把图片放入 <code style={instructionStyles.code}>src/game/assert/images/npcs/</code>（可建子目录），并在 NPC 卡牌的{' '}
          <code style={instructionStyles.code}>img</code> 字段写明路径片段（含 <code style={instructionStyles.code}>assert/images/npcs/</code>）或仅文件名；打包时会自动收录该目录下静态图。
        </li>
      </ol>
      <p style={instructionStyles.note}>追加或覆盖保存后请刷新页面；必要时重启 Vite 与游戏服。</p>
    </section>
  );
}

const defaultAbility = (): AbilityDraft => ({
  id: 'ability_1',
  friendlyPoints: 1,
  description: '在此填写能力效果描述',
  steps: [Steps.ProtagonistAbility],
  useLimitRoope: false,
});

export function AppendNpcPage({ onClose }: AppendNpcPageProps) {
  const [exportNameInput, setExportNameInput] = useState('Custom_NPC');
  const [npcId, setNpcId] = useState('npc_custom');
  const [displayName, setDisplayName] = useState('自定义NPC');
  const [instability, setInstability] = useState(2);
  const [thoughts, setThoughts] = useState('');
  const [img, setImg] = useState('');
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([RoleType.Student]);
  const [initialAreas, setInitialAreas] = useState<Area[]>([Area.School]);
  const [forbiddenAreas, setForbiddenAreas] = useState<Area[]>([]);
  const [abilities, setAbilities] = useState<AbilityDraft[]>([defaultAbility()]);
  const [copyMessage, setCopyMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveConflictPending, setSaveConflictPending] = useState(false);

  const npcPortraitFileRef = useRef<HTMLInputElement>(null);

  const onNpcPortraitFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base = file.name.trim();
    if (!base) return;
    setImg(`assert/images/npcs/${base}`);
    e.target.value = '';
  };

  const npcExportVarName = useMemo(() => sanitizeNpcExportName(exportNameInput), [exportNameInput]);
  const npcFileName = useMemo(() => sanitizeNpcFileSlug(npcExportVarName), [npcExportVarName]);

  const npcCode = useMemo(
    () =>
      generateNpcModuleTs({
        exportVarName: npcExportVarName,
        npcId,
        displayName,
        instability,
        thoughts,
        img,
        roleTypes,
        initialAreas,
        forbiddenAreas,
        abilities,
      }),
    [npcExportVarName, npcId, displayName, instability, thoughts, img, roleTypes, initialAreas, forbiddenAreas, abilities],
  );

  const exportHint =
    exportNameInput.trim() !== '' && sanitizeNpcExportName(exportNameInput) !== exportNameInput.trim()
      ? `保存使用的导出名为：${npcExportVarName}`
      : null;

  const toggleRole = (rt: RoleType) => {
    setRoleTypes((prev) => (prev.includes(rt) ? prev.filter((x) => x !== rt) : [...prev, rt]));
  };

  const toggleInitialArea = (a: Area) => {
    setInitialAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleForbiddenArea = (a: Area) => {
    setForbiddenAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const toggleAbilityStep = (abiIdx: number, step: Steps) => {
    setAbilities((prev) => {
      const next = [...prev];
      const row = next[abiIdx];
      if (!row) return prev;
      const has = row.steps.includes(step);
      next[abiIdx] = { ...row, steps: has ? row.steps.filter((s) => s !== step) : [...row.steps, step] };
      return next;
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(npcCode);
      setCopyMessage('代码已复制到剪贴板');
    } catch {
      setCopyMessage('复制失败，请手动复制');
    }
  };

  const saveNpc = async (overwrite = false) => {
    setSaveConflictPending(false);
    setSaveMessage('');
    setSaveError('');
    if (!npcId.trim()) {
      setSaveError('请填写 NPC 卡牌 id（如 npc_99）。');
      return;
    }
    if (!displayName.trim()) {
      setSaveError('请填写 NPC 名称。');
      return;
    }
    if (initialAreas.length === 0) {
      setSaveError('请至少选择一个初始区域。');
      return;
    }
    for (let i = 0; i < abilities.length; i++) {
      const ab = abilities[i];
      if (!ab.description.trim()) {
        setSaveError(`第 ${i + 1} 条能力缺少描述。`);
        return;
      }
      if (ab.steps.length === 0) {
        setSaveError(`第 ${i + 1} 条能力请至少勾选一个触发时机。`);
        return;
      }
    }

    setSaveBusy(true);
    try {
      const res = await fetch('/api/npcs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcVarName: npcExportVarName,
          npcFileName,
          npcCode,
          overwrite,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        message?: string;
        conflict?: boolean;
        npcFile?: string;
        overwritten?: boolean;
      };

      if (!res.ok) {
        if (res.status === 409 && payload.conflict) {
          setSaveConflictPending(true);
          setSaveError(payload.message || 'NPC 文件已存在，可选择覆盖保存。');
          return;
        }
        if (res.status === 404) {
          throw new Error(
            '保存接口返回 404：游戏服上没有 /api/npcs/save。请先在本机重启 `npm run server`（仓库更新后必须用新进程才能载入）；并确认已在另一终端运行游戏服且端口与 `vite.config.ts` 里 proxy 指向一致（默认 8000）。',
          );
        }
        throw new Error(payload.message || `保存失败 (${res.status})`);
      }
      setSaveConflictPending(false);
      setSaveMessage(
        payload.overwritten
          ? `已覆盖保存到 ${payload.npcFile ?? `npcData/custom/${npcFileName}.ts`}，并更新 npcIndex.ts`
          : `已保存到 ${payload.npcFile ?? `npcData/custom/${npcFileName}.ts`}，并更新 npcIndex.ts`,
      );
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.innerWide}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>追加NPC</h2>
          <button type="button" style={styles.primaryBtn} onClick={onClose}>
            返回主界面
          </button>
        </div>

        <section style={styles.block}>
          <h3 style={styles.h3}>说明</h3>
          <AppendNpcInstructions />
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>基础字段</h3>
          <div style={styles.grid}>
            <label style={styles.label}>
              导出常量名（英文）
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.exportName}</span>
              <input
                style={styles.input}
                value={exportNameInput}
                onChange={(e) => setExportNameInput(e.target.value)}
                placeholder={REF_BOY_STUDENT.exportName}
              />
              {exportHint ? <span style={styles.hintMuted}>{exportHint}</span> : null}
              <span style={styles.hintMuted}>保存文件名：npcData/custom/{npcFileName}.ts</span>
            </label>
            <label style={styles.label}>
              卡牌 id
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.npcId}</span>
              <input
                style={styles.input}
                value={npcId}
                onChange={(e) => setNpcId(e.target.value)}
                placeholder={REF_BOY_STUDENT.npcId}
              />
            </label>
            <label style={styles.label}>
              显示名称
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.displayName}</span>
              <input
                style={styles.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={REF_BOY_STUDENT.displayName}
              />
            </label>
            <label style={styles.label}>
              不安限度
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.instability}</span>
              <input
                style={styles.input}
                type="number"
                value={instability}
                onChange={(e) => setInstability(Number(e.target.value) || 0)}
                placeholder={REF_BOY_STUDENT.instability}
              />
            </label>
            <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
              感想
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.thoughts}</span>
              <textarea
                style={styles.textareaShort}
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder={REF_BOY_STUDENT.thoughts}
              />
            </label>
            <div style={{ ...styles.label, gridColumn: '1 / -1' }}>
              <span>图片路径（可选）</span>
              <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.img}</span>
              <div style={styles.imgPathRow}>
                <input
                  style={{ ...styles.input, flex: '1 1 200px', minWidth: 0 }}
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder={REF_BOY_STUDENT.img}
                />
                <button type="button" style={styles.chooseFileBtn} onClick={() => npcPortraitFileRef.current?.click()}>
                  选择图片文件…
                </button>
              </div>
              <input
                ref={npcPortraitFileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={onNpcPortraitFileSelected}
              />
              <span style={styles.hintMuted}>
                使用系统文件对话框选取后，会自动填入路径（浏览器不会提供磁盘绝对路径）。请将所选文件的同名副本复制到工程的{' '}
                <code style={instructionStyles.code}>src/game/assert/images/npcs/</code>，保存 NPC 并刷新后版图即可解析立绘。
              </span>
            </div>
          </div>

          <h4 style={styles.h4}>角色类型（多选）</h4>
          <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.roleTypes}</span>
          <div style={styles.chipRow}>
            {RoleTypeOptions.map((rt) => (
              <label key={rt} style={styles.chip}>
                <input type="checkbox" checked={roleTypes.includes(rt)} onChange={() => toggleRole(rt)} />
                <span>{rt}</span>
              </label>
            ))}
          </div>

          <h4 style={styles.h4}>初始区域（至少一项）</h4>
          <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.initialAreas}</span>
          <div style={styles.chipRow}>
            {AreaOptions.map((a) => (
              <label key={a} style={styles.chip}>
                <input type="checkbox" checked={initialAreas.includes(a)} onChange={() => toggleInitialArea(a)} />
                <span>{a}</span>
              </label>
            ))}
          </div>

          <h4 style={styles.h4}>禁行区域</h4>
          <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.forbiddenAreas}</span>
          <div style={styles.chipRow}>
            {AreaOptions.map((a) => (
              <label key={`f-${a}`} style={styles.chip}>
                <input type="checkbox" checked={forbiddenAreas.includes(a)} onChange={() => toggleForbiddenArea(a)} />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>能力</h3>
          {abilities.map((ab, abiIdx) => (
            <div key={abiIdx} style={styles.abilityCard}>
              <div style={styles.grid}>
                <label style={styles.label}>
                  能力 id
                  <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.abilityId}</span>
                  <input
                    style={styles.input}
                    value={ab.id}
                    onChange={(e) =>
                      setAbilities((prev) => {
                        const next = [...prev];
                        next[abiIdx] = { ...next[abiIdx], id: e.target.value };
                        return next;
                      })
                    }
                    placeholder={REF_BOY_STUDENT.abilityId}
                  />
                </label>
                <label style={styles.label}>
                  友好点数
                  <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.friendlyPoints}</span>
                  <input
                    style={styles.input}
                    type="number"
                    min={0}
                    step={1}
                    value={ab.friendlyPoints}
                    onChange={(e) =>
                      setAbilities((prev) => {
                        const next = [...prev];
                        next[abiIdx] = {
                          ...next[abiIdx],
                          friendlyPoints: clampNonNegativeFriendlyPoints(e.target.value),
                        };
                        return next;
                      })
                    }
                    placeholder={REF_BOY_STUDENT.friendlyPoints}
                  />
                </label>
                <label style={styles.chip}>
                  <span style={{ ...styles.refBoyStudent, display: 'block', marginBottom: 4 }}>
                    范本｜巫女等：{REF_USE_LIMIT_ROOPE}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={ab.useLimitRoope}
                      onChange={(e) =>
                        setAbilities((prev) => {
                          const next = [...prev];
                          next[abiIdx] = { ...next[abiIdx], useLimitRoope: e.target.checked };
                          return next;
                        })
                      }
                    />
                    <span>轮限：每轮 1 次（useLimitRoope: 1）</span>
                  </span>
                </label>
              </div>
              <label style={{ ...styles.label, marginTop: 8 }}>
                描述
                <span style={styles.refBoyStudent}>范本｜男学生：{REF_BOY_STUDENT.abilityDesc}</span>
                <textarea
                  style={styles.textareaShort}
                  value={ab.description}
                  onChange={(e) =>
                    setAbilities((prev) => {
                      const next = [...prev];
                      next[abiIdx] = { ...next[abiIdx], description: e.target.value };
                      return next;
                    })
                  }
                  placeholder={REF_BOY_STUDENT.abilityDesc}
                />
              </label>
              <div style={{ marginTop: 8 }}>
                <span style={styles.subtle}>触发时机（可多选）</span>
                <span style={{ ...styles.refBoyStudent, display: 'block', marginTop: 4 }}>范本｜男学生：{REF_BOY_STUDENT.steps}</span>
                <div style={styles.chipRow}>
                  {StepsOptions.map((st) => (
                    <label key={`${abiIdx}-${st}`} style={styles.chip}>
                      <input
                        type="checkbox"
                        checked={ab.steps.includes(st)}
                        onChange={() => toggleAbilityStep(abiIdx, st)}
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="button"
                style={styles.smallBtn}
                onClick={() =>
                  setAbilities((prev) => {
                    if (prev.length <= 1) return prev;
                    return prev.filter((_, i) => i !== abiIdx);
                  })
                }
              >
                删除本条能力
              </button>
            </div>
          ))}
          <button
            type="button"
            style={styles.secondaryBtn}
            onClick={() =>
              setAbilities((prev) => [
                ...prev,
                {
                  id: `ability_${prev.length + 1}`,
                  friendlyPoints: 1,
                  description: '',
                  steps: [Steps.ProtagonistAbility],
                  useLimitRoope: false,
                },
              ])
            }
          >
            新增能力
          </button>
          <span style={{ ...styles.refBoyStudent, display: 'block', marginTop: 10 }}>
            范本｜男学生：仅配置一条能力时可完全对照；多条时需自行拆分 id / 描述。
          </span>
        </section>

        <section style={styles.block}>
          <h3 style={styles.h3}>生成代码与保存</h3>
          <div style={styles.codeActions}>
            <button type="button" style={styles.primaryBtn} onClick={() => void copyCode()}>
              复制代码
            </button>
            <button type="button" style={styles.primaryBtn} disabled={saveBusy} onClick={() => void saveNpc(false)}>
              {saveBusy ? '保存中...' : '保存到工程'}
            </button>
            {saveConflictPending ? (
              <button type="button" style={styles.warnBtn} disabled={saveBusy} onClick={() => void saveNpc(true)}>
                覆盖保存到工程
              </button>
            ) : null}
          </div>
          {copyMessage ? <p style={styles.successText}>{copyMessage}</p> : null}
          {saveMessage ? <p style={styles.successText}>{saveMessage}</p> : null}
          {saveError ? <p style={styles.errorText}>{saveError}</p> : null}
          <span style={{ ...styles.refBoyStudent, display: 'block', marginBottom: 8 }}>范本｜男学生：{REF_BOY_STUDENT.generatedCode}</span>
          <textarea readOnly style={styles.codeArea} value={npcCode} />
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', width: '100%', backgroundColor: '#0f172a', color: '#e2e8f0' },
  innerWide: { maxWidth: '1100px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  block: { backgroundColor: '#16213e', border: '1px solid #1e2e52', borderRadius: '10px', padding: '14px', marginBottom: 14 },
  h3: { margin: '0 0 10px', fontSize: '16px', color: '#f8fafc' },
  h4: { margin: '14px 0 8px', color: '#f8fafc', fontSize: '14px' },
  grid: { display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1' },
  refBoyStudent: {
    fontSize: '11px',
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 1.35,
  },
  input: { backgroundColor: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' },
  hintMuted: { fontSize: '12px', color: '#94a3b8' },
  textareaShort: {
    width: '100%',
    minHeight: 64,
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '8px 10px',
    boxSizing: 'border-box',
    fontSize: '13px',
  },
  primaryBtn: { backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  secondaryBtn: { backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  chooseFileBtn: {
    flex: '0 0 auto',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  imgPathRow: { display: 'flex', gap: '10px', alignItems: 'stretch', flexWrap: 'wrap' },
  warnBtn: { backgroundColor: '#b45309', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' },
  smallBtn: { backgroundColor: '#0f3460', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', marginTop: 8 },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' },
  chip: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' },
  subtle: { fontSize: '12px', color: '#94a3b8' },
  abilityCard: {
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  codeActions: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 8 },
  successText: { margin: '6px 0', color: '#86efac', fontSize: '12px' },
  errorText: { margin: '6px 0', color: '#fca5a5', fontSize: '12px' },
  codeArea: {
    width: '100%',
    minHeight: 280,
    backgroundColor: '#020617',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '10px',
    boxSizing: 'border-box',
    fontSize: '12px',
    fontFamily: 'Consolas, monospace',
  },
};

const instructionStyles: Record<string, CSSProperties> = {
  section: { fontSize: '14px', lineHeight: 1.65, color: '#cbd5e1' },
  lead: { marginTop: 0 },
  ol: { paddingLeft: '1.25rem', margin: '12px 0' },
  li: { marginBottom: '10px' },
  code: {
    fontFamily: 'Consolas, monospace',
    fontSize: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #334155',
  },
  note: { marginBottom: 0, fontSize: '13px', color: '#94a3b8' },
};
