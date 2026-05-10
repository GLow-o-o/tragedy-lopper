/// <reference types="vite/client" />

/**
 * 版图 NPC 立绘 URL：由 `assert/images/npcs/**` 下的静态资源经 Vite 打包，
 * 再根据 NPC 数据里的 `img` 字段解析（剧本仅配置 npcId，立绘来自 npcIndex 对应卡牌的 img）。
 */
const portraitModules = import.meta.glob<{ default: string }>('./assert/images/npcs/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
});

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, '/');
}

/** 多种路径写法 → 打包后的 URL */
const portraitUrlByPathVariant = new Map<string, string>();
const portraitUrlByBasename = new Map<string, string>();

for (const [rawPath, mod] of Object.entries(portraitModules)) {
  const url = mod.default;
  const k = normalizeSlashes(rawPath);
  const variants = new Set<string>([k, k.replace(/^\.\//, '')]);
  const needleIdx = k.indexOf('assert/images/npcs/');
  if (needleIdx !== -1) {
    const fromAssert = k.slice(needleIdx);
    variants.add(fromAssert);
    variants.add(`./${fromAssert}`);
  }
  const base = k.split('/').pop();
  if (base) portraitUrlByBasename.set(base.toLowerCase(), url);
  for (const v of variants) portraitUrlByPathVariant.set(v, url);
}

/**
 * 根据 NPC 卡牌上的 `img` 字段解析版图可用的图片 URL。
 * 支持：完整/绝对路径（含历史 Windows 路径）、以 assert/images/npcs 开头的相对路径、纯文件名、http(s) 外链。
 */
export function resolveNpcBoardPortraitUrl(imgField: string | undefined): string | undefined {
  if (!imgField?.trim()) return undefined;
  const raw = imgField.trim();
  if (/^https?:\/\//i.test(raw)) return raw;

  const norm = normalizeSlashes(raw);
  const needle = 'assert/images/npcs/';
  const idx = norm.toLowerCase().indexOf(needle);

  const tryKeys: string[] = [];
  if (idx !== -1) {
    const tail = norm.slice(idx);
    tryKeys.push(`./${tail}`, tail);
  }
  tryKeys.push(norm);

  for (const key of tryKeys) {
    const hit = portraitUrlByPathVariant.get(key);
    if (hit) return hit;
  }

  const base = norm.split('/').pop();
  if (base) return portraitUrlByBasename.get(base.toLowerCase());
  return undefined;
}

/** 特殊标识等：`assert/images/tokens/**` */
const tokenPortraitModules = import.meta.glob<{ default: string }>('./assert/images/tokens/**/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
});

const tokenUrlByPathVariant = new Map<string, string>();
const tokenUrlByBasename = new Map<string, string>();

for (const [rawPath, mod] of Object.entries(tokenPortraitModules)) {
  const url = mod.default;
  const k = normalizeSlashes(rawPath);
  const variants = new Set<string>([k, k.replace(/^\.\//, '')]);
  const needleIdx = k.indexOf('assert/images/tokens/');
  if (needleIdx !== -1) {
    const fromAssert = k.slice(needleIdx);
    variants.add(fromAssert);
    variants.add(`./${fromAssert}`);
  }
  const base = k.split('/').pop();
  if (base) tokenUrlByBasename.set(base.toLowerCase(), url);
  for (const v of variants) tokenUrlByPathVariant.set(v, url);
}

export function resolveTokenImageUrl(imgField: string | undefined): string | undefined {
  if (!imgField?.trim()) return undefined;
  const raw = imgField.trim();
  if (/^https?:\/\//i.test(raw)) return raw;

  const norm = normalizeSlashes(raw);
  const needle = 'assert/images/tokens/';
  const idx = norm.toLowerCase().indexOf(needle);
  const tryKeys: string[] = [];
  if (idx !== -1) {
    const tail = norm.slice(idx);
    tryKeys.push(`./${tail}`, tail);
  }
  tryKeys.push(norm);
  for (const key of tryKeys) {
    const hit = tokenUrlByPathVariant.get(key);
    if (hit) return hit;
  }
  const base = norm.split('/').pop();
  if (base) return tokenUrlByBasename.get(base.toLowerCase());
  return undefined;
}

/** 立绘路径或 tokens 路径 → 可用于 `<img src>` 的打包 URL（或外链） */
export function resolveAssertImageUrl(imgField: string | undefined): string | undefined {
  return resolveNpcBoardPortraitUrl(imgField) ?? resolveTokenImageUrl(imgField);
}
