/**
 * 将运行时 `npc` 对象序列化为可写入工程的 TypeScript 模块源码。
 * 用于 NPC 一览「保存到工程」；路径深度与 `npcData/*.ts`、`npcData/custom/*.ts` 对齐。
 */
import { Area } from '../basicData/areas';
import { Steps } from '../basicData/steps';
import { RoleType } from '../basicData/roleTypes';
import type { ability, npc } from './basicInfo_npc';

export type NpcCodegenDepth = 'npcData' | 'npcDataCustom';

function escapeTsSingleQuoted(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function enumMemberFromValue<E extends Record<string, string>>(enumObj: E, value: string): string | null {
  const key = (Object.keys(enumObj) as Array<keyof E>).find((k) => enumObj[k] === value);
  return key != null ? String(key) : null;
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

/** npcId → 导出常量名（如 Boy_Student），用于 useLimitRole 中的 `[Patient]` */
export function npcIdToExportKeyMap(npcIndexEntries: Iterable<readonly [string, npc]>): Map<string, string> {
  return new Map(
    Array.from(npcIndexEntries, ([exportKey, n]) => [n.id, exportKey]),
  );
}

function formatUseLimitAreaCode(limit: ability['useLimitArea']): string | undefined {
  if (limit === undefined || limit === null) return undefined;
  if (limit === 'currentArea') return `'currentArea'`;
  if (Array.isArray(limit)) {
    const inner = areasToCode(limit);
    return inner.length > 0 ? `[${inner}]` : undefined;
  }
  if (typeof limit === 'string' && limit.startsWith('not:')) {
    const areaLabel = limit.slice('not:'.length);
    const ek = enumMemberFromValue(Area as unknown as Record<string, string>, areaLabel as Area);
    if (ek) return '`not:${Area.' + ek + '}`'; // emits TS template literal in output
    return '`not:' + escapeTsSingleQuoted(areaLabel) + '`';
  }
  const key = enumMemberFromValue(Area as unknown as Record<string, string>, limit as Area);
  if (key) return `Area.${key}`;
  return String(limit);
}

function formatUseLimitRoleCode(
  limit: ability['useLimitRole'],
  idToExport: Map<string, string>,
): string | undefined {
  if (limit == null) return undefined;
  if (!Array.isArray(limit) || limit.length === 0) return undefined;
  const first = limit[0];
  if (typeof first === 'string' || first === undefined) {
    const roleParts = limit.map((x) =>
      typeof x === 'string' ? enumMemberFromValue(RoleType as unknown as Record<string, string>, x as RoleType) : null,
    );
    if (roleParts.every(Boolean))
      return `[${roleParts.map((nm) => `RoleType.${nm}`).join(', ')}]`;
    return undefined;
  }
  const npcRefs = limit as npc[];
  const names = npcRefs.map((r) => idToExport.get(r.id)).filter(Boolean) as string[];
  if (names.length !== npcRefs.length) return undefined;
  return `[${names.join(', ')}]`;
}

function linesForImports(opts: {
  depth: NpcCodegenDepth;
  usesArea: boolean;
  usesSteps: boolean;
  usesRoleType: boolean;
}): string[] {
  const base = opts.depth === 'npcData' ? '../..' : '../../..';
  const npcRel = opts.depth === 'npcData' ? '..' : '../..';
  const out: string[] = [];
  if (opts.usesArea) out.push(`import { Area } from "${base}/basicData/areas";`);
  if (opts.usesSteps) out.push(`import { Steps } from "${base}/basicData/steps";`);
  if (opts.usesRoleType) out.push(`import { RoleType } from "${base}/basicData/roleTypes";`);
  out.push(`import { npc } from "${npcRel}/basicInfo_npc";`);
  return out;
}

function stringifyAbility(ab: ability, idToExport: Map<string, string>): string[] {
  const rows: string[] = ['        {', `            id: '${escapeTsSingleQuoted(ab.id)}',`];
  rows.push(`            friendlyPoints: ${Number.isFinite(ab.friendlyPoints) ? Math.max(0, ab.friendlyPoints) : 0},`);
  rows.push(`            abilityDescription: '${escapeTsSingleQuoted(ab.abilityDescription)}',`);
  rows.push(`            excuteTime: [${stepsToCode(ab.excuteTime)}],`);

  const useDay = `            useLimitDay: 1,`;
  const hasDay = ab.useLimitDay === 1;
  if (hasDay) rows.push(useDay);

  const hasRoop = ab.useLimitRoope === 1;
  if (hasRoop) rows.push('            useLimitRoope: 1,');

  const areaCode = formatUseLimitAreaCode(ab.useLimitArea);
  if (areaCode) rows.push(`            useLimitArea: ${areaCode},`);

  const roleCode = formatUseLimitRoleCode(ab.useLimitRole, idToExport);
  if (roleCode) rows.push(`            useLimitRole: ${roleCode},`);

  rows.push('        }');
  return rows;
}

function collectNpcCrossRefImports(
  abilities: ability[] | undefined,
  selfExportKey: string,
  idToExport: Map<string, string>,
): { exportKey: string; relativePathNoExt: string }[] {
  const seen = new Map<string, { exportKey: string; relativePathNoExt: string }>();
  if (!abilities) return [];
  for (const ab of abilities) {
    const ur = ab.useLimitRole;
    if (!Array.isArray(ur) || ur.length === 0 || typeof ur[0] !== 'object') continue;
    for (const n of ur as npc[]) {
      const ek = idToExport.get(n.id);
      const fn = ek ? canonicalNpcTsFileName(ek, n.id) : null;
      if (!ek || !fn || ek === selfExportKey) continue;
      const base = fn.replace(/\.ts$/, '');
      seen.set(ek, { exportKey: ek, relativePathNoExt: `./${base}` });
    }
  }
  return [...seen.values()];
}

function abilityUsesArea(ab: ability): boolean {
  const u = ab.useLimitArea;
  if (u == null || u === 'currentArea') return false;
  if (Array.isArray(u)) return u.length > 0;
  if (typeof u === 'string' && u.startsWith('not:')) return true;
  return Object.values(Area).includes(u as Area);
}

function collectAbilityDeps(abilities: ability[] | undefined): { area: boolean; steps: boolean; roleType: boolean } {
  let area = false;
  let steps = false;
  let roleType = false;
  if (!abilities) return { area: false, steps: false, roleType: false };
  for (const ab of abilities) {
    steps = true;
    if (abilityUsesArea(ab)) area = true;
    const ur = ab.useLimitRole;
    if (Array.isArray(ur) && ur.length > 0) {
      const first = ur[0];
      if (typeof first === 'string') roleType = true;
    }
  }
  return { area, steps, roleType };
}

export function canonicalNpcTsFileName(exportVarName: string, npcId: string): string | null {
  const m = /^npc_(\d+)$/.exec(npcId.trim());
  if (!m) return null;
  const num = m[1]!.padStart(2, '0');
  if (!/^[_A-Za-z][_A-Za-z0-9]*$/.test(exportVarName)) return null;
  return `NPC_${num}_${exportVarName}.ts`;
}

export type GenerateNpcModuleOptions = {
  exportVarName: string;
  data: npc;
  depth?: NpcCodegenDepth;
  /** 默认取 `npcIdToExportKeyMap` 或由调用方传入，用于 `[Patient]` 等 */
  npcIdToExportKey?: Map<string, string>;
};

export function generateNpcModuleTsFromData(opts: GenerateNpcModuleOptions): string {
  const depth = opts.depth ?? 'npcData';
  const idToExport = opts.npcIdToExportKey ?? new Map<string, string>();
  const d = opts.data;

  const abDeps = collectAbilityDeps(d.abilitys);
  const usesArea =
    abDeps.area || d.initialArea.length > 0 || (d.forbiddenAreas != null && d.forbiddenAreas.length > 0);
  const usesSteps = Boolean(d.abilitys && d.abilitys.length > 0);
  const usesRoleType =
    abDeps.roleType || Boolean(d.roleType?.length);

  const importBlock = linesForImports({
    depth,
    usesArea,
    usesSteps,
    usesRoleType,
  });

  const body: string[] = [];
  body.push('', `export const ${opts.exportVarName}: npc = {`);
  body.push(`    id: '${escapeTsSingleQuoted(d.id)}',`);
  body.push(`    name: '${escapeTsSingleQuoted(d.name)}',`);
  body.push(`    roleType: [${roleTypesToCode(d.roleType ?? [])}],`);

  if (d.img?.trim()) body.push(`    img: '${escapeTsSingleQuoted(d.img.trim())}',`);

  const abilityLines: string[] = [];
  if (d.abilitys && d.abilitys.length > 0) {
    for (let i = 0; i < d.abilitys.length; i++) {
      const ab = d.abilitys[i]!;
      if (i > 0) abilityLines.push(',');
      abilityLines.push(...stringifyAbility(ab, idToExport));
    }
    body.push(`    abilitys: [`);
    body.push(abilityLines.join('\n'));
    body.push(`    ],`);
  }

  body.push(`    thoughts: '${escapeTsSingleQuoted(d.thoughts ?? '')}',`);
  body.push(`    initialArea: [${areasToCode(d.initialArea)}],`);

  const fa = d.forbiddenAreas ?? [];
  body.push(`    forbiddenAreas: [${areasToCode(fa)}],`);
  body.push(`    instability: ${Number.isFinite(d.instability) ? d.instability : 0},`);

  const ns = d.npcState;
  const curAreaCode =
    ns?.currentArea == null
      ? 'null'
      : enumMemberFromValue(Area as unknown as Record<string, string>, ns.currentArea as Area)
        ? `Area.${enumMemberFromValue(Area as unknown as Record<string, string>, ns.currentArea as Area)}`
        : `'${escapeTsSingleQuoted(String(ns.currentArea))}'`;

  if (ns) {
    body.push('    npcState: {');
    body.push(`        currentArea: ${curAreaCode},`);
    body.push(`        instability: ${Number.isFinite(ns.instability) ? ns.instability : 0},`);
    body.push(`        friendlyPoints: ${Number.isFinite(ns.friendlyPoints) ? ns.friendlyPoints : 0},`);
    body.push(`        conspiracyPoints: ${Number.isFinite(ns.conspiracyPoints) ? ns.conspiracyPoints : 0},`);
    body.push(`        isAlive: ${Boolean(ns.isAlive)}`);
    body.push('    },');
  }

  if (d.features?.length) {
    const parts = d.features.map((x) => `'${escapeTsSingleQuoted(x)}'`);
    body.push(`    features: [${parts.join(', ')}],`);
  }

  const hasTok = Boolean(d.hasSpecialToken && d.specialToken?.trim());
  if (hasTok || d.specialToken?.trim()) {
    if (d.hasSpecialToken !== undefined) body.push(`    hasSpecialToken: ${Boolean(d.hasSpecialToken)},`);
    if (d.specialToken?.trim()) body.push(`    specialToken: '${escapeTsSingleQuoted(d.specialToken.trim())}',`);
    body.push(`    specialTokenDescription: '${escapeTsSingleQuoted(d.specialTokenDescription ?? '')}',`);
    if (d.specialTokenImage?.trim())
      body.push(`    specialTokenImage: '${escapeTsSingleQuoted(d.specialTokenImage.trim())}',`);
  }

  body.push('}', '');
  const cross = collectNpcCrossRefImports(d.abilitys, opts.exportVarName, idToExport);
  const crossImportLines = cross.map((c) => `import { ${c.exportKey} } from "${c.relativePathNoExt}";`);

  return [...importBlock, ...crossImportLines, ...body].join('\n');
}
