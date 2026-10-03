// ============================================================================
// ICS 生成器：把 data.js 里的赛程数据渲染成 iCalendar(.ics) 文本
// 无需改动本文件；日常维护只改 src/data.js
// ============================================================================

// 环节类型 → 中文标签 + 默认时长（分钟）。正赛按 2 小时，其余按 1 小时。
const SESSION_META = {
  FP1:          { label: "第1次练习赛", minutes: 60 },
  FP2:          { label: "第2次练习赛", minutes: 60 },
  FP3:          { label: "第3次练习赛", minutes: 60 },
  QUALI:        { label: "排位赛",       minutes: 60 },
  SPRINT_QUALI: { label: "冲刺排位赛",   minutes: 60 },
  SPRINT:       { label: "冲刺赛",       minutes: 60 },
  RACE:         { label: "正赛",         minutes: 120 },
};

const pad = (n) => String(n).padStart(2, "0");

// 转义 ICS 文本值中的特殊字符
function escapeText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 行折行：逻辑行超过 75 字节时，用 CRLF + 空格续行
function foldLine(line) {
  if (line.length <= 75) return line;
  const out = [];
  let rest = line;
  while (rest.length > 75) {
    out.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  out.push(rest);
  return out.join("\r\n");
}

// "YYYY-MM-DDTHH:mm" → Date（按北京墙钟处理，内部借 UTC 做算术；北京无夏令时）
function toWallClock(dtStr) {
  const [d, t] = dtStr.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, da, h, mi));
}

// Date → "YYYYMMDDTHHMMSS"（取 UTC 分量 = 北京墙钟分量）
function fmtLocal(date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`
  );
}

function dtstamp() {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

// 生成 VTIMEZONE（Asia/Shanghai，固定 +08:00，无夏令时）
function vtimezone(tzid) {
  return [
    "BEGIN:VTIMEZONE",
    `TZID:${tzid}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:CST",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
}

// 生成单个 VEVENT
function vevent({ year, round, race, type, start }, tzid) {
  const meta = SESSION_META[type];
  if (!meta) return null;

  const startDate = toWallClock(start);
  const endDate = new Date(startDate.getTime() + meta.minutes * 60000);

  const uid = `f1-${year}-r${pad(round)}-${type.toLowerCase()}@f1calendar.local`;
  const summary = `F1 ${race.name} · ${meta.label}`;
  const location = `${race.circuit}，${race.city}`;
  const descParts = [`${year} F1 世界锦标赛 · 第 ${round} 站`, `${race.country} · ${race.city}`];
  if (race.sprint) descParts.push("冲刺赛周末");
  descParts.push("（时间：北京时间）");
  const description = descParts.join(" · ");

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp()}`,
    `DTSTART;TZID=${tzid}:${fmtLocal(startDate)}`,
    `DTEND;TZID=${tzid}:${fmtLocal(endDate)}`,
    `SUMMARY:${escapeText(summary)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(description)}`,
    "END:VEVENT",
  ];
}

// 主入口：传入赛季对象与全局时区，返回完整 ICS 文本
export function buildICS(season, tz) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//F1 Calendar//F1 ${season.year}//ZH-CN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:F1 ${season.year} 赛历`,
    `X-WR-TIMEZONE:${tz}`,
    ...vtimezone(tz),
  ];

  for (const race of season.rounds) {
    for (const session of race.sessions) {
      const block = vevent({ year: season.year, round: race.round, race, ...session }, tz);
      if (block) lines.push(...block);
    }
  }
  lines.push("END:VCALENDAR");

  return lines.map(foldLine).join("\r\n") + "\r\n";
}
