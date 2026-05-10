# 惨剧轮回 · 桌游助手

基于 [boardgame.io](https://boardgame.io/) 与 React 的《惨剧轮回》（Tragedy Looper）类桌游辅助与联机客户端。前端为 Vite + TypeScript，游戏逻辑与多人房间由独立 Node 进程承载。

> **声明**：本项目仅供学习交流，请勿用于商业用途。致谢与鸣谢见源码 `src/App.tsx` 顶部注释。

## 技术栈

- **前端**：React 18、TypeScript、Vite 6
- **多人与状态**：boardgame.io（Lobby API + Socket）
- **游戏服**：`server/host.ts`（默认端口 `8000`，通过 `jiti` 运行）

## 环境要求

- Node.js（建议当前 LTS）
- npm

## 快速开始

```bash
npm install
```

复制环境变量模板并按需修改：

```bash
# Windows PowerShell
Copy-Item env.example .env
```

### 本地开发（局域网）

需要**两个终端**同时运行：

1. **游戏服**（boardgame.io）

   ```bash
   npm run server
   ```

2. **前端**

   ```bash
   npm run dev
   ```

浏览器访问 Vite 提示的地址（默认 `http://localhost:5173`）。联机或创建房间前请确保游戏服已启动，否则会出现无法连接 Lobby / Socket 的提示。

### 通过内网穿透联机（外网玩家）

推荐 **单隧道**：只穿透 Vite（例如 `5173`），在 `.env` 中设置 `VITE_BGIO_THROUGH_VITE=true`，由 Vite 将 `/games`、`/socket.io`、`/api` 代理到本机 `8000`。`vite.config.ts` 已启用 `allowedHosts: true`，便于 ngrok 等子域频繁的公网入口。更完整的变量说明见 **`env.example`**。

若房主用 `http://localhost:5173` 打开页面，但需要邀请链接中的地址指向公网，可在 `.env` 中设置 **`VITE_PUBLIC_APP_ORIGIN`** 为穿透得到的根地址（**无末尾斜杠**），例如 `https://xxxx.ngrok-free.dev`。

穿透场景下若遇 CORS（常见于**双隧道**：前端与游戏服不同 Origin），可在启动 `npm run server` 时设置 **`BGIO_EXTRA_ORIGINS`** 为前端所在的完整 Origin（逗号分隔多个），详见下文与 **`env.example`**。

#### 使用 ngrok（推荐单隧道）

##### 注册与 CLI 准备（含免费 ngrok）

1. 打开 [ngrok 官网](https://ngrok.com/) 注册并登录（可使用 GitHub、Google 等，免费档即可用于穿透开发）。  
2. 登录后在 **Dashboard**（控制面板）找到 **Your Authtoken**（或 **Credentials** 下的 authtoken），复制整段令牌。  
3. 在本机安装 ngrok CLI：从官网下载对应系统的压缩包，或用你环境中的包管理器安装（详见 ngrok 文档的 *Install*）。  
4. 在终端执行一次（将 `<你的 Authtoken>` 换成上一步复制的内容）：

   ```bash
   ngrok config add-authtoken <你的 Authtoken>
   ```

5. 可运行 `ngrok version` 确认 CLI 可用。之后即可使用下文中的 `ngrok http 5173` 等命令。

##### 免费版：浏览器警示页

ngrok **免费**隧道在浏览器里首次打开 `https://*.ngrok-free.*` 时，常会出现 **ngrok 提示页 / 拦截页**（提醒「You are about to visit…」之类），需要人工点击 **Visit Site**（或「继续访问」等）才能进入真正的站点。

- **房主与外网玩家**第一次用邀请链接打开时，都可能遇到该页，属正常情况；通过一次后，同一浏览器一段时间内通常可直接进入（仍以你当前 ngrok 版本策略为准）。  
- 若点击通过后页面异常、联机一直断线，可尝试**硬刷新**（Ctrl+F5）或**重新从邀请链接进入**，并确认已完成警示页操作。  
- 仅用普通浏览器游玩**无需**额外配置；若你用脚本、`curl` 等直连隧道却拿到 HTML 而不是 JSON，属于警示页机制，需查阅 ngrok 文档中关于 **browser warning / skip** 的说明（日常桌面游玩可忽略）。

##### WebSocket 注意点（与本项目联机相关）

boardgame.io 联机依赖 **WebSocket**（经同源路径 `/socket.io` 等）。在**单隧道 + Vite 代理**模式下，浏览器会连到 `wss://<你的 ngrok 主机>/socket.io…`，由 Vite 再转发到本机 `8000` 上的游戏服。

- **务必在警示页通过之后**再让单页应用完成加载；若 Socket 在拦截页阶段就开始握手，可能失败或表现为一直重连，可刷新重试。  
- 请保持 **`npm run dev` 与 `npm run server` 始终运行**；隧道断开后子域可能变化，需把新地址同步给玩家并更新 `.env` 中的 `VITE_PUBLIC_APP_ORIGIN`（若你使用该变量）。  
- 免费档可能存在**并发连接数、在线时长或带宽**等限制，表现为偶发断线或多开标签页异常；可收窄浏览器标签数量、必要时重启 `ngrok http 5173` 再发新链接。  
- 若仅在某一网络失败，检查是否对公司代理、校园网或浏览器扩展拦截了 **WebSocket**；本地用 `localhost:5173` 正常而仅 ngrok 失败时，优先对照上文警示页与双进程是否就绪。

---

**联机时的终端顺序**（已完成上文「注册与 CLI 准备」后每次联机可照此执行）：

1. 终端 A：`npm run server`（默认 `8000`）  
2. 终端 B：`npm run dev`（默认 `5173`）  
3. 终端 C：把 **Vite** 暴露到公网（只开这一条隧道即可配合代理）：

   ```bash
   ngrok http 5173
   ```

4. `.env` 至少包含：

   ```env
   VITE_BGIO_THROUGH_VITE=true
   ```

5. 房主在浏览器打开 ngrok 给出的 **`https://…ngrok-free.app`**、**`…ngrok-free.dev`** 等地址（以你账号显示为准），再使用「邀请玩家」；外网玩家同样用该 https 入口。

若你**本地仍用** `http://localhost:5173` 调试，但希望生成的邀请链接里是 ngrok 地址，请同时设置：

```env
VITE_PUBLIC_APP_ORIGIN=https://你的子域.ngrok-free.dev
```

（将示例域名换成 `ngrok http 5173` 输出中的主机名，仍不要末尾 `/`。）

**双隧道（备选）**：前端一条 ngrok（5173）、游戏服再开一条 ngrok（8000）。此时应**关掉** `VITE_BGIO_THROUGH_VITE`，在 `.env` 中设置 **`VITE_BGIO_SERVER`** 为游戏服隧道根 URL（与 `npm run server` 透出的一致）。若浏览器报跨域，在跑游戏服的终端为前端 Origin 设置 `BGIO_EXTRA_ORIGINS`，例如：

```powershell
# PowerShell
$env:BGIO_EXTRA_ORIGINS = "https://你的前端.ngrok-free.dev"
npm run server
```

游戏服侧已对常见 ngrok 域名做了 Origin 匹配；若你使用自定义域或其他域名未命中规则，同样用 **`BGIO_EXTRA_ORIGINS`** 显式补上前端完整 Origin。

## npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（默认 `5173`） |
| `npm run server` | 启动 boardgame.io 游戏服（默认 `8000`，可用 `PORT` 覆盖） |
| `npm run build` | TypeScript 检查并构建生产静态资源 |
| `npm run preview` | 本地预览构建结果 |
| `npm run lint` | 运行 ESLint |

## 项目结构（节选）

- `src/App.tsx` — 应用入口、大厅与路由相关 UI
- `src/game/` — 游戏规则、客户端 UI、模组/剧本/NPC 等数据与编辑页
- `server/host.ts` — 游戏服、Lobby、以及「保存到工程」等开发用 HTTP API

更新仓库后若「追加模组/剧本/NPC → 保存」报 404，请先结束旧的游戏服进程并重新执行 `npm run server`，以载入最新的 `host.ts`。

## 许可证与使用范围

以源码与 package.json 中 `private: true` 为准；使用请遵守上述非商业声明及原作相关权利。
