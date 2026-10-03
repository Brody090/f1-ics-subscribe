<div align="center">

# F1 赛历订阅

**在 iPhone 日历里粘贴一个链接，自动同步整个 F1 赛季的赛程（北京时间）**

![Cloudflare Workers](https://img.shields.io/badge/平台-Cloudflare%20Workers-F38020?style=flat-square)
![时区](https://img.shields.io/badge/时区-Asia%2FShanghai-1a1a1a?style=flat-square)
![数据源](https://img.shields.io/badge/数据-f1calendar.com-0b6e4f?style=flat-square)

[快速部署](#快速部署) · [iPhone 订阅](#在-iphone-上订阅) · [更新赛历](#如何更新赛历) · [项目结构](#项目结构)

</div>

---

## 简介

一个部署到 Cloudflare Worker 的小项目，对外提供 iCalendar（`.ics`）订阅源，让日历 App 自动同步 F1 赛程。

| 特性 | 说明 |
| --- | --- |
| 内容 | 完整比赛周末（练习赛 FP1/2/3、排位赛、冲刺赛、正赛） |
| 时区 | 统一北京时间（Asia/Shanghai，UTC+8） |
| 数据来源 | f1calendar.com（sportstimes/f1），已转换为北京时间 |
| 维护 | 改数据不改代码，日常只维护一个 `data.js` |

## 快速部署

> 需要先有一个 [Cloudflare](https://dash.cloudflare.com) 账号（免费）。

```bash
npm install          # 1. 安装依赖（安装 wrangler）
npx wrangler login   # 2. 首次需登录 Cloudflare（会打开浏览器授权）
npm run deploy       # 3. 部署
```

部署成功后终端会输出类似地址：

```
https://f1-ics-subscribe.<你的子域>.workers.dev
```

对应的**订阅链接**：

```
https://f1-ics-subscribe.<你的子域>.workers.dev/calendar.ics
```

> 没有 Node 环境？直接跑 `npx wrangler login` + `npx wrangler deploy` 即可（npx 会自动临时下载 wrangler）。

## 在 iPhone 上订阅

| 方式 | 步骤 |
| --- | --- |
| Safari | 打开订阅链接 → 弹窗点「订阅」→「添加」 |
| 设置 | 设置 → 日历 → 账户 → 添加账户 → 其他 → 添加已订阅的日历 → 粘贴链接 |

订阅后打开「日历」App 即可看到全部赛程，客户端会自动定期刷新（配合缓存策略，一般每小时重拉一次）。

## 如何更新赛历

**所有改动只改 `src/data.js` 这一个文件**，改完重新 `npm run deploy`。

### 改一场比赛的时间

找到对应站的 `sessions`，改 `start` 为新的北京时间：

```js
{ type: "RACE", start: "2026-03-08T12:00" }   // 改成新时间
```

### 新增 / 删除一站

在对应赛季的 `rounds` 数组里增删对象（`round` 序号保持连续）：

```js
{
  round: 24,
  name: "某某大奖赛",
  country: "某国",
  city: "某市",
  circuit: "某赛道",
  sprint: false,
  sessions: [
    { type: "FP1",   start: "2026-xx-xxTxx:xx" },
    { type: "QUALI", start: "2026-xx-xxTxx:xx" },
    { type: "RACE",  start: "2026-xx-xxTxx:xx" },
  ],
}
```

### 新增一个赛季（如 2027）

往 `SEASONS` 数组末尾追加 `{ year: 2027, rounds: [...] }`。默认订阅自动取**最新**赛季，也可指定年份：

```
https://xxx.workers.dev/calendar.ics?year=2027
```

### 改时区

修改 `data.js` 顶部的 `CALENDAR_TZ` 常量（默认 `Asia/Shanghai`）。

## 环节类型速查

| type | 含义 |
| --- | --- |
| `FP1` / `FP2` / `FP3` | 第 1/2/3 次练习赛 |
| `QUALI` | 排位赛 |
| `SPRINT_QUALI` | 冲刺排位赛（仅冲刺赛周末） |
| `SPRINT` | 冲刺赛（仅冲刺赛周末） |
| `RACE` | 正赛 |

时长自动派生：正赛 2 小时，其余 1 小时，无需手填结束时间。

## 项目结构

```
├── src/
│   ├── index.js        # Worker 入口：路由 + 落地页 + ?year= 赛季选择
│   ├── data.js         # ★ 唯一需要日常维护的赛程数据文件
│   └── ics.js          # ICS 生成器（一般无需改动）
├── wrangler.toml       # Cloudflare Worker 配置
├── package.json
└── README.md
```

## 本地预览

```bash
npm run dev
```

浏览器打开 `http://localhost:8787`（落地页）或 `http://localhost:8787/calendar.ics`（ICS）。

## 说明

- 2026 赛季原定 24 站，其中**巴林大奖赛因故改期至马来西亚雪邦**（暂定 10 月 2–4 日，状态 TBC），沙特阿拉伯站未出现在当前赛历中，末两站中东场次有伊莫拉备选预案；以上已在 `data.js` 中加注说明，请以 F1 官方 / f1calendar.com 最新数据为准。
- 正赛及各环节时间可能随官方确认而调整，届时按「如何更新赛历」更新即可。
