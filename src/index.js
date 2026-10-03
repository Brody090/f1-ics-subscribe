// ============================================================================
// Cloudflare Worker 入口
//   GET /              → 落地页（显示订阅链接 + iOS 订阅步骤）
//   GET /calendar.ics  → ICS 订阅源（可用 ?year= 指定赛季，默认最新赛季）
// ============================================================================

import { SEASONS, CALENDAR_TZ } from "./data.js";
import { buildICS } from "./ics.js";

const ICS_PATH = "/calendar.ics";

function findSeason(year) {
  if (year) {
    return SEASONS.find((s) => String(s.year) === String(year)) || null;
  }
  return SEASONS[SEASONS.length - 1] || null;
}

function landingPage(subscribeUrl) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>F1 赛历订阅</title>
<style>
  :root { --red:#E10600; --ink:#1a1a1a; --muted:#666; --line:#e5e5e5; --bg:#fff; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",Roboto,sans-serif; color:var(--ink); background:var(--bg); line-height:1.6; }
  .wrap { max-width:640px; margin:0 auto; padding:48px 20px 64px; }
  .logo { font-size:13px; font-weight:700; letter-spacing:.14em; color:var(--red); text-transform:uppercase; }
  h1 { font-size:28px; margin:10px 0 6px; }
  .sub { color:var(--muted); margin:0 0 28px; }
  .card { border:1px solid var(--line); border-radius:12px; padding:18px 20px; margin-bottom:24px; background:#fafafa; }
  .url-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .url { flex:1 1 auto; min-width:0; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; background:#fff; border:1px solid var(--line); border-radius:8px; padding:10px 12px; word-break:break-all; color:#333; }
  button { border:none; border-radius:8px; padding:11px 18px; font-size:14px; font-weight:600; cursor:pointer; background:var(--red); color:#fff; white-space:nowrap; }
  button:hover { filter:brightness(.92); }
  button.copied { background:#1c9b4c; }
  h2 { font-size:16px; margin:28px 0 12px; }
  ol { margin:0; padding-left:20px; color:var(--ink); }
  ol li { margin-bottom:10px; }
  .hint { color:var(--muted); font-size:13px; margin-top:6px; }
  a { color:var(--red); }
</style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Formula 1 · 2026</div>
    <h1>F1 赛历订阅</h1>
    <p class="sub">在 iPhone 日历里订阅即可自动同步整个赛季的比赛日程（北京时间）。</p>

    <div class="card">
      <div style="font-weight:600;margin-bottom:10px;">订阅链接</div>
      <div class="url-row">
        <div class="url" id="url">${subscribeUrl}</div>
        <button id="copy">复制</button>
      </div>
      <div class="hint">直接点击也会在浏览器打开 .ics 文件。</div>
    </div>

    <h2>在 iPhone 上订阅</h2>
    <ol>
      <li>打开「设置」→「日历」→「账户」。</li>
      <li>点「添加账户」→ 选「其他」→「添加已订阅的日历」。</li>
      <li>粘贴上面的订阅链接，点「下一步」并保存。</li>
      <li>打开「日历」App，即可看到整个 2026 赛季的练习赛、排位赛、冲刺赛与正赛。</li>
    </ol>
    <p class="hint">也可以用 Safari 直接打开订阅链接，弹窗点击「订阅」即可。</p>

    <p class="hint" style="margin-top:28px;">数据来源：f1calendar.com（已转换为北京时间）。正赛时间可能随官方确认而调整。</p>
  </div>
  <script>
    const btn = document.getElementById("copy");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(document.getElementById("url").textContent);
      } catch (e) {
        const r = document.createRange(); r.selectNode(document.getElementById("url"));
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        document.execCommand("copy"); s.removeAllRanges();
      }
      btn.textContent = "已复制"; btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "复制"; btn.classList.remove("copied"); }, 2000);
    });
  </script>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = url.origin;

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (path === ICS_PATH) {
      const year = url.searchParams.get("year");
      const season = findSeason(year);
      if (!season) {
        return new Response("未找到该赛季数据", { status: 404 });
      }
      const ics = buildICS(season, CALENDAR_TZ);
      return new Response(ics, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `inline; filename="f1-${season.year}.ics"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    if (path === "/" || path === "/index.html") {
      const subscribeUrl = `${origin}${ICS_PATH}`;
      return new Response(landingPage(subscribeUrl), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
