/**
 * 本机 boardgame.io 游戏服（Socket + Lobby API）。
 * 与 Vite 前端分开运行：默认端口 8000，与 `VITE_BGIO_SERVER` / 邀请链接一致。
 *
 * 内网穿透：用两条隧道分别暴露 Vite 与游戏服后，在前端 `.env` 设置 `VITE_BGIO_SERVER` 为游戏服公网 URL；
 * 游戏服侧可用 `BGIO_EXTRA_ORIGINS` 补充 CORS（逗号分隔完整 Origin，如 `https://xxx.trycloudflare.com`）。
 */
import { Server, Origins } from 'boardgame.io/server';
import { TragedyLooperGame } from '../src/game/tragedyLooper';
import { promises as fs } from 'node:fs';
import path from 'node:path';

/** 允许局域网内任意来源的前端（端口不限）连接 Lobby / Socket */
const LAN_HTTP_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/;

/**
 * 常见内网穿透域名（子域任意）。若你的隧道域名未命中，请设环境变量 `BGIO_EXTRA_ORIGINS`。
 * 覆盖：ngrok、Cloudflare Quick Tunnel、localtunnel、localhost.run、VS Dev Tunnels 等。
 */
const TUNNEL_HTTP_ORIGIN =
  /^https?:\/\/([\w-]+\.)*(ngrok-free\.app|ngrok-free\.dev|ngrok\.io|ngrok\.app|trycloudflare\.com|loca\.lt|localhost\.run|lhr\.life|devtunnels\.ms)(:\d+)?$/i;

function extraOriginsFromEnv(): string[] {
  const raw = process.env.BGIO_EXTRA_ORIGINS;
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const origins: (string | RegExp | false)[] = [
  LAN_HTTP_ORIGIN,
  TUNNEL_HTTP_ORIGIN,
  ...extraOriginsFromEnv(),
  Origins.LOCALHOST_IN_DEVELOPMENT,
].filter((x): x is string | RegExp => Boolean(x));

const server = Server({
  games: [TragedyLooperGame],
  origins,
});

type SaveModuleRequestBody = {
  moduleVarName?: string;
  moduleFileName?: string;
  moduleCode?: string;
  overwrite?: boolean;
};

type DeleteModuleRequestBody = {
  moduleVarName?: string;
  moduleFileName?: string;
};

type SaveScenarioRequestBody = {
  scenarioVarName?: string;
  scenarioFileName?: string;
  /** 模组 id（与 Scenario.moduleId 一致），用于写入 `custom/<模组目录>/剧本.ts` */
  scenarioModuleId?: string;
  scenarioCode?: string;
  overwrite?: boolean;
};

type DeleteScenarioRequestBody = {
  scenarioVarName?: string;
  scenarioFileName?: string;
  scenarioModuleId?: string;
};

type SaveNpcRequestBody = {
  npcVarName?: string;
  npcFileName?: string;
  npcCode?: string;
  overwrite?: boolean;
  /** 写入 `src/game/npc/npcData/NPC_xx_Name.ts`，不修改 npcIndex */
  canonicalFileName?: string;
};

type DeleteNpcRequestBody = {
  npcVarName?: string;
  npcFileName?: string;
};

async function readJsonBody<T extends Record<string, unknown>>(
  ctx: { request: { body?: unknown }; req: NodeJS.ReadableStream },
): Promise<T> {
  const parsedByMiddleware = ctx.request.body;
  if (parsedByMiddleware && typeof parsedByMiddleware === 'object') {
    return parsedByMiddleware as T;
  }

  let raw = '';
  for await (const chunk of ctx.req) {
    raw += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
  }
  if (!raw.trim()) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

function normalizeSafeName(raw: string): string {
  const sanitized = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return sanitized || 'new_module';
}

/** 若尚无该文件夹则新建（同名已存在则无操作），再将文件写入其子路径。 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/** 与写入的模组 TS 一致：以文件中 ModuleBasicInfo 导出名为准，避免 moduleIndex 与文件不同步 */
function parseModuleExportName(moduleCode: string): string | null {
  const m = moduleCode.match(/export\s+const\s+([A-Za-z0-9_]+)\s*:\s*ModuleBasicInfo\b/);
  return m?.[1] ?? null;
}

/**
 * 修正 moduleIndex 中同一 `./custom/…` 路径下多条 import / 绑定名与磁盘上 `export const …: ModuleBasicInfo` 不一致的问题
 * （例如历史上曾写入 AnotherHorizonRevised 与 Another_Horizon_Revised 两行）。
 */
async function reconcileModuleIndexCustomImports(): Promise<void> {
  const moduleIndexPath = path.resolve(process.cwd(), 'src/game/modules/moduleIndex.ts');
  const origin = await fs.readFile(moduleIndexPath, 'utf8');
  let source = origin;

  const importRe = /^import \{\s*([A-Za-z0-9_]+)\s*\} from '(\.\/custom\/[^']+)';(?:\r?\n)?/gm;
  const rows: { binding: string; path: string }[] = [];
  for (const m of origin.matchAll(importRe)) {
    rows.push({ binding: m[1], path: m[2] });
  }

  const byPath = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!byPath.has(r.path)) byPath.set(r.path, new Set());
    byPath.get(r.path)!.add(r.binding);
  }

  const wrongPaths: { importPath: string; expected: string; bindings: Set<string> }[] = [];
  for (const [importPath, bindings] of byPath) {
    const base = importPath.replace(/^\.\/custom\//, '');
    const tsPath = path.join(process.cwd(), 'src/game/modules/custom', `${base}.ts`);
    let expected: string | null = null;
    try {
      const code = await fs.readFile(tsPath, 'utf8');
      expected = parseModuleExportName(code);
    } catch {
      continue;
    }
    if (!expected) continue;
    const needFix = bindings.size > 1 || ![...bindings].every((b) => b === expected);
    if (needFix) {
      wrongPaths.push({ importPath, expected, bindings: new Set(bindings) });
    }
  }

  for (const { importPath, expected, bindings } of wrongPaths) {
    const escaped = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lineRe = new RegExp(`^import \\{\\s*[A-Za-z0-9_]+\\s*\\} from '${escaped}';\\r?\\n?`, 'gm');
    source = source.replace(lineRe, '');
    const importLine = `import { ${expected} } from '${importPath}';`;
    const moduleBasicImport = "import { ModuleBasicInfo } from './basicInfo/basicInfo_module';";
    if (!source.includes(importLine)) {
      source = source.includes(moduleBasicImport)
        ? source.replace(moduleBasicImport, `${moduleBasicImport}\n${importLine}`)
        : `${importLine}\n${source}`;
    }

    const listPattern = /export const moduleIndex: ModuleBasicInfo\[] = \[([\s\S]*?)\];/m;
    const listMatch = source.match(listPattern);
    if (listMatch) {
      let items = listMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => (bindings.has(name) ? expected : name));
      const seen = new Set<string>();
      items = items.filter((name) => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
      if (!items.includes(expected)) items.push(expected);
      const formattedItems = items.map((name) => `    ${name},`).join('\n');
      source = source.replace(listPattern, `export const moduleIndex: ModuleBasicInfo[] = [\n${formattedItems}\n];`);
    }
  }

  if (source !== origin) {
    await fs.writeFile(moduleIndexPath, source, 'utf8');
  }
}

async function upsertModuleIndex(importName: string, importPath: string): Promise<void> {
  const moduleIndexPath = path.resolve(process.cwd(), 'src/game/modules/moduleIndex.ts');
  const source = await fs.readFile(moduleIndexPath, 'utf8');
  let next = source;

  const escapedPath = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const importFromPathRe = new RegExp(
    `^import \\{\\s*([A-Za-z0-9_]+)\\s*\\} from '${escapedPath}';\\r?\\n?`,
    'gm',
  );
  const oldNames = new Set<string>();
  next = next.replace(importFromPathRe, (_full, binding: string) => {
    oldNames.add(binding);
    return '';
  });

  const importLine = `import { ${importName} } from '${importPath}';`;
  if (!next.includes(importLine)) {
    const moduleBasicImport = "import { ModuleBasicInfo } from './basicInfo/basicInfo_module';";
    next = next.includes(moduleBasicImport)
      ? next.replace(moduleBasicImport, `${moduleBasicImport}\n${importLine}`)
      : `${importLine}\n${next}`;
  }

  const listPattern = /export const moduleIndex: ModuleBasicInfo\[] = \[([\s\S]*?)\];/m;
  const match = next.match(listPattern);
  if (!match) {
    throw new Error('moduleIndex.ts 格式不符合预期，无法自动更新');
  }
  const itemsRaw = match[1];
  let existingItems = itemsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => (oldNames.has(name) ? importName : name));
  const seen = new Set<string>();
  existingItems = existingItems.filter((name) => {
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  if (!existingItems.includes(importName)) {
    existingItems.push(importName);
  }
  const formattedItems = existingItems.map((name) => `    ${name},`).join('\n');
  next = next.replace(listPattern, `export const moduleIndex: ModuleBasicInfo[] = [\n${formattedItems}\n];`);

  if (next !== source) {
    await fs.writeFile(moduleIndexPath, next, 'utf8');
  }
}

async function removeFromModuleIndex(importPath: string, importNameHint?: string): Promise<boolean> {
  const moduleIndexPath = path.resolve(process.cwd(), 'src/game/modules/moduleIndex.ts');
  const source = await fs.readFile(moduleIndexPath, 'utf8');
  let next = source;

  const importLineRegex = new RegExp(`^import \\{\\s*([A-Za-z0-9_]+)\\s*\\} from '${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}';\\r?\\n?`, 'gm');
  const importedNames = new Set<string>();
  if (importNameHint) importedNames.add(importNameHint);
  next = next.replace(importLineRegex, (_full, binding: string) => {
    importedNames.add(binding);
    return '';
  });

  if (importedNames.size > 0) {
    const listPattern = /export const moduleIndex: ModuleBasicInfo\[] = \[([\s\S]*?)\];/m;
    const listMatch = next.match(listPattern);
    if (listMatch) {
      const items = listMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((name) => !importedNames.has(name));
      const formattedItems = items.map((name) => `    ${name},`).join('\n');
      next = next.replace(listPattern, `export const moduleIndex: ModuleBasicInfo[] = [\n${formattedItems}\n];`);
    }
  }

  if (next !== source) {
    await fs.writeFile(moduleIndexPath, next, 'utf8');
    return true;
  }
  return false;
}

async function upsertScenariosIndex(importName: string, importPath: string): Promise<void> {
  const indexPath = path.resolve(process.cwd(), 'src/game/scenarios/secenariosIndex.ts');
  const source = await fs.readFile(indexPath, 'utf8');
  let next = source;

  const bindingEscaped = importName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prevImportRe = new RegExp(`^import \\{\\s*${bindingEscaped}\\s*\\} from "[^"]+";\\r?\\n?`, 'm');
  next = next.replace(prevImportRe, '');

  const importLine = `import { ${importName} } from "${importPath}";`;
  next = `${importLine}\n${next}`;

  const objectPattern = /export const scenariosIndex = \{([\s\S]*?)\}/m;
  const match = next.match(objectPattern);
  if (!match) {
    throw new Error('secenariosIndex.ts 格式不符合预期，无法自动更新');
  }
  const objectBody = match[1];
  const existingKeys = Array.from(objectBody.matchAll(/([A-Za-z0-9_]+)\s*:/g)).map((m) => m[1]);
  if (!existingKeys.includes(importName)) {
    existingKeys.push(importName);
  }
  const rebuiltBody = existingKeys.map((k) => `  ${k}: ${k},`).join('\n');
  next = next.replace(objectPattern, `export const scenariosIndex = {\n${rebuiltBody}\n}`);

  if (next !== source) {
    await fs.writeFile(indexPath, next, 'utf8');
  }
}

async function removeFromScenariosIndex(importPath: string, importNameHint?: string): Promise<boolean> {
  const indexPath = path.resolve(process.cwd(), 'src/game/scenarios/secenariosIndex.ts');
  const source = await fs.readFile(indexPath, 'utf8');
  let next = source;

  const importLineRegex = new RegExp(`^import \\{\\s*([A-Za-z0-9_]+)\\s*\\} from "${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}";\\r?\\n?`, 'm');
  const importMatch = next.match(importLineRegex);
  const importedName = importMatch?.[1] ?? importNameHint ?? '';
  next = next.replace(importLineRegex, '');

  if (importedName) {
    const objectPattern = /export const scenariosIndex = \{([\s\S]*?)\}/m;
    const match = next.match(objectPattern);
    if (match) {
      const existingKeys = Array.from(match[1].matchAll(/([A-Za-z0-9_]+)\s*:/g))
        .map((m) => m[1])
        .filter((k) => k !== importedName);
      const rebuiltBody = existingKeys.map((k) => `  ${k}: ${k},`).join('\n');
      next = next.replace(objectPattern, `export const scenariosIndex = {\n${rebuiltBody}\n}`);
    }
  }

  if (next !== source) {
    await fs.writeFile(indexPath, next, 'utf8');
    return true;
  }
  return false;
}

function findNpcIndexObjectBounds(src: string): { open: number; close: number } | null {
  const marker = 'export const npcIndex';
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) return null;
  const braceOpen = src.indexOf('{', startIdx);
  if (braceOpen === -1) return null;
  let depth = 0;
  for (let i = braceOpen; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return { open: braceOpen, close: i };
    }
  }
  return null;
}

async function upsertNpcIndex(importName: string, importPath: string): Promise<void> {
  const npcIndexPath = path.resolve(process.cwd(), 'src/game/npc/npcIndex.ts');
  const source = await fs.readFile(npcIndexPath, 'utf8');
  let next = source;

  const importLine = `import { ${importName} } from "${importPath}";`;
  const exportMatch = next.match(/^export const npcIndex/m);
  if (!exportMatch || exportMatch.index === undefined) {
    throw new Error('npcIndex.ts 格式不符合预期：未找到 export const npcIndex');
  }
  if (!next.includes(importLine)) {
    next = next.slice(0, exportMatch.index) + importLine + '\n' + next.slice(exportMatch.index);
  }

  const bounds = findNpcIndexObjectBounds(next);
  if (!bounds) {
    throw new Error('npcIndex.ts 格式不符合预期：无法解析 npcIndex 对象');
  }
  const inner = next.slice(bounds.open + 1, bounds.close);
  const keyDup = new RegExp(`\\b${importName}\\s*:\\s*${importName}\\b`);
  if (!keyDup.test(inner)) {
    const insertion = `\n    ${importName}: ${importName},`;
    next = next.slice(0, bounds.close) + insertion + next.slice(bounds.close);
  }

  if (next !== source) {
    await fs.writeFile(npcIndexPath, next, 'utf8');
  }
}

async function removeFromNpcIndex(importPath: string, importNameHint?: string): Promise<boolean> {
  const npcIndexPath = path.resolve(process.cwd(), 'src/game/npc/npcIndex.ts');
  const source = await fs.readFile(npcIndexPath, 'utf8');
  let next = source;

  const escapedPath = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const importLineRegex = new RegExp(`^import \\{\\s*([A-Za-z0-9_]+)\\s*\\} from "${escapedPath}";\\r?\\n?`, 'm');
  const importMatch = next.match(importLineRegex);
  const importedName = importMatch?.[1] ?? importNameHint ?? '';
  next = next.replace(importLineRegex, '');

  if (importedName) {
    next = next.replace(new RegExp(`^\\s*${importedName}\\s*:\\s*${importedName}\\s*,[^\\n]*\\r?\\n?`, 'm'), '');
  }

  if (next !== source) {
    await fs.writeFile(npcIndexPath, next, 'utf8');
    return true;
  }
  return false;
}

server.router.post('/api/modules/save', async (ctx) => {
  try {
    const body = await readJsonBody<SaveModuleRequestBody>(ctx);
    const moduleVarName = normalizeSafeName(String(body.moduleVarName ?? ''));
    const moduleFileName = normalizeSafeName(String(body.moduleFileName ?? moduleVarName));
    const moduleCode = String(body.moduleCode ?? '');
    const overwrite = body.overwrite === true;

    if (!moduleCode.trim()) {
      ctx.status = 400;
      ctx.body = { ok: false, message: 'moduleCode 不能为空' };
      return;
    }

    const modulesCustomDir = path.resolve(process.cwd(), 'src/game/modules/custom');
    await fs.mkdir(modulesCustomDir, { recursive: true });
    const targetPath = path.join(modulesCustomDir, `${moduleFileName}.ts`);

    let fileExists = false;
    try {
      await fs.access(targetPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists && !overwrite) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        conflict: true,
        message: `模组文件已存在：custom/${moduleFileName}.ts`,
      };
      return;
    }

    await fs.writeFile(targetPath, moduleCode, 'utf8');
    const indexImportName = parseModuleExportName(moduleCode) ?? moduleVarName;
    await upsertModuleIndex(indexImportName, `./custom/${moduleFileName}`);
    await reconcileModuleIndexCustomImports();

    ctx.status = 200;
    ctx.body = {
      ok: true,
      overwritten: fileExists,
      moduleFile: `custom/${moduleFileName}.ts`,
      moduleVarName: indexImportName,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

server.router.post('/api/modules/delete', async (ctx) => {
  try {
    const body = await readJsonBody<DeleteModuleRequestBody>(ctx);
    const moduleFileName = normalizeSafeName(String(body.moduleFileName ?? ''));
    const moduleVarName = normalizeSafeName(String(body.moduleVarName ?? ''));
    const modulesCustomDir = path.resolve(process.cwd(), 'src/game/modules/custom');
    const targetPath = path.join(modulesCustomDir, `${moduleFileName}.ts`);

    try {
      await fs.access(targetPath);
    } catch {
      ctx.status = 404;
      ctx.body = { ok: false, message: `未找到可删除文件：custom/${moduleFileName}.ts` };
      return;
    }

    await fs.unlink(targetPath);
    await removeFromModuleIndex(`./custom/${moduleFileName}`, moduleVarName || undefined);

    ctx.status = 200;
    ctx.body = { ok: true, moduleFile: `custom/${moduleFileName}.ts` };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

server.router.post('/api/scenarios/save', async (ctx) => {
  try {
    const body = await readJsonBody<SaveScenarioRequestBody>(ctx);
    const scenarioVarName = normalizeSafeName(String(body.scenarioVarName ?? ''));
    const scenarioFileName = normalizeSafeName(String(body.scenarioFileName ?? scenarioVarName));
    const rawModuleId = String(body.scenarioModuleId ?? '').trim();
    const scenarioCode = String(body.scenarioCode ?? '');
    const overwrite = body.overwrite === true;

    if (!scenarioCode.trim()) {
      ctx.status = 400;
      ctx.body = { ok: false, message: 'scenarioCode 不能为空' };
      return;
    }
    if (!rawModuleId) {
      ctx.status = 400;
      ctx.body = { ok: false, message: '未指定所属模组（scenarioModuleId），无法写入与模组对应的子文件夹' };
      return;
    }

    const moduleDirName = normalizeSafeName(rawModuleId);
    const customDir = path.resolve(process.cwd(), 'src/game/scenarios/custom');
    const moduleDir = path.join(customDir, moduleDirName);
    await ensureDirectoryExists(moduleDir);
    const targetPath = path.join(moduleDir, `${scenarioFileName}.ts`);
    const relForIndex = `./custom/${moduleDirName}/${scenarioFileName}`;
    const relForMessage = `custom/${moduleDirName}/${scenarioFileName}.ts`;

    let fileExists = false;
    try {
      await fs.access(targetPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists && !overwrite) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        conflict: true,
        message: `剧本文件已存在：${relForMessage}`,
      };
      return;
    }

    await fs.writeFile(targetPath, scenarioCode, 'utf8');
    await upsertScenariosIndex(scenarioVarName, relForIndex);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      overwritten: fileExists,
      scenarioFile: relForMessage,
      scenarioVarName,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

server.router.post('/api/scenarios/delete', async (ctx) => {
  try {
    const body = await readJsonBody<DeleteScenarioRequestBody>(ctx);
    const scenarioFileName = normalizeSafeName(String(body.scenarioFileName ?? ''));
    const scenarioVarName = normalizeSafeName(String(body.scenarioVarName ?? ''));
    const moduleDirName = normalizeSafeName(String(body.scenarioModuleId ?? ''));
    const customDir = path.resolve(process.cwd(), 'src/game/scenarios/custom');

    const nestedPath = path.join(customDir, moduleDirName, `${scenarioFileName}.ts`);
    const flatPath = path.join(customDir, `${scenarioFileName}.ts`);
    let targetPath: string | null = null;
    let indexImportPath = '';

    if (moduleDirName) {
      try {
        await fs.access(nestedPath);
        targetPath = nestedPath;
        indexImportPath = `./custom/${moduleDirName}/${scenarioFileName}`;
      } catch {
        /* */
      }
    }
    if (!targetPath) {
      try {
        await fs.access(flatPath);
        targetPath = flatPath;
        indexImportPath = `./custom/${scenarioFileName}`;
      } catch {
        /* */
      }
    }

    if (!targetPath) {
      ctx.status = 404;
      ctx.body = {
        ok: false,
        message: moduleDirName
          ? `未找到可删除剧本文件：custom/${moduleDirName}/${scenarioFileName}.ts 或旧的 custom/${scenarioFileName}.ts`
          : `未找到可删除剧本文件：custom/${scenarioFileName}.ts`,
      };
      return;
    }

    await fs.unlink(targetPath);
    await removeFromScenariosIndex(indexImportPath, scenarioVarName || undefined);

    const scenarioFileResp =
      indexImportPath.startsWith('./custom/') ? `${indexImportPath.slice(2)}.ts` : `custom/${scenarioFileName}.ts`;
    ctx.status = 200;
    ctx.body = { ok: true, scenarioFile: scenarioFileResp };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

function isSafeCanonicalNpcFileName(name: string): boolean {
  const n = name.trim();
  return /^NPC_\d{2,}_[A-Za-z0-9_]+\.ts$/.test(n) && !n.includes('..') && !n.includes('/') && !n.includes('\\');
}

server.router.post('/api/npcs/save', async (ctx) => {
  try {
    const body = await readJsonBody<SaveNpcRequestBody>(ctx);
    const canonicalFileNameRaw = String(body.canonicalFileName ?? '').trim();
    const npcCode = String(body.npcCode ?? '');
    const overwrite = body.overwrite === true;

    if (!npcCode.trim()) {
      ctx.status = 400;
      ctx.body = { ok: false, message: 'npcCode 不能为空' };
      return;
    }

    if (canonicalFileNameRaw && !isSafeCanonicalNpcFileName(canonicalFileNameRaw)) {
      ctx.status = 400;
      ctx.body = { ok: false, message: 'canonicalFileName 格式非法（需形如 NPC_01_Boy_Student.ts）' };
      return;
    }

    if (canonicalFileNameRaw && isSafeCanonicalNpcFileName(canonicalFileNameRaw)) {
      const npcDataRoot = path.resolve(process.cwd(), 'src/game/npc/npcData');
      const targetPath = path.resolve(npcDataRoot, canonicalFileNameRaw);
      if (!targetPath.startsWith(npcDataRoot + path.sep)) {
        ctx.status = 400;
        ctx.body = { ok: false, message: '非法 NPC 文件名' };
        return;
      }

      let fileExists = false;
      try {
        await fs.access(targetPath);
        fileExists = true;
      } catch {
        fileExists = false;
      }

      await fs.mkdir(npcDataRoot, { recursive: true });
      await fs.writeFile(targetPath, npcCode, 'utf8');

      ctx.status = 200;
      ctx.body = {
        ok: true,
        overwritten: fileExists,
        npcFile: `npcData/${canonicalFileNameRaw}`,
        mode: 'canonical',
      };
      return;
    }

    let npcVarName = normalizeSafeName(String(body.npcVarName ?? '')).replace(/-/g, '_');
    if (/^\d/.test(npcVarName)) npcVarName = `_${npcVarName}`;
    if (!npcVarName.trim()) npcVarName = 'Custom_NPC';
    const npcFileName = normalizeSafeName(String(body.npcFileName ?? npcVarName)).replace(/-/g, '_');

    const npcCustomDir = path.resolve(process.cwd(), 'src/game/npc/npcData/custom');
    await fs.mkdir(npcCustomDir, { recursive: true });
    const targetPath = path.join(npcCustomDir, `${npcFileName}.ts`);

    let fileExists = false;
    try {
      await fs.access(targetPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists && !overwrite) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        conflict: true,
        message: `NPC 文件已存在：npcData/custom/${npcFileName}.ts`,
      };
      return;
    }

    await fs.writeFile(targetPath, npcCode, 'utf8');
    await upsertNpcIndex(npcVarName, `./npcData/custom/${npcFileName}`);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      overwritten: fileExists,
      npcFile: `npcData/custom/${npcFileName}.ts`,
      npcVarName,
      mode: 'custom',
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

server.router.post('/api/npcs/delete', async (ctx) => {
  try {
    const body = await readJsonBody<DeleteNpcRequestBody>(ctx);
    const npcFileName = normalizeSafeName(String(body.npcFileName ?? ''));
    const npcVarName = normalizeSafeName(String(body.npcVarName ?? ''));
    const npcCustomDir = path.resolve(process.cwd(), 'src/game/npc/npcData/custom');
    const targetPath = path.join(npcCustomDir, `${npcFileName}.ts`);

    try {
      await fs.access(targetPath);
    } catch {
      ctx.status = 404;
      ctx.body = { ok: false, message: `未找到可删除文件：npcData/custom/${npcFileName}.ts` };
      return;
    }

    await fs.unlink(targetPath);
    await removeFromNpcIndex(`./npcData/custom/${npcFileName}`, npcVarName || undefined);

    ctx.status = 200;
    ctx.body = { ok: true, npcFile: `npcData/custom/${npcFileName}.ts` };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

const port = Number(process.env.PORT) || 8000;

// eslint-disable-next-line no-console
console.log(
  '[tragedy-looper] 开发写入 API（经 Vite 代理 /api）：/api/modules/scenarios/npcs ··· 若无响应请确认已重启本进程以载入最新路由',
);

server.run(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[tragedy-looper] boardgame.io 服务已监听 http://0.0.0.0:${port}`);
});
