// 自动赛历同步：外部数据只在完整校验后写入 KV，静态数据始终作为回退。

const DEFAULT_SOURCE = "https://api.jolpi.ca/ergast/f1";
const DELETE_CONFIRMATIONS = 2;

export const keys = {
  schedule: (year) => `schedule:${year}`,
  meta: (year) => `schedule-meta:${year}`,
};

function seasonList(payload) {
  return (payload?.MRData?.SeasonTable?.Seasons || [])
    .map((item) => Number(item.season))
    .filter((year) => Number.isInteger(year) && year >= 2020 && year <= 2100);
}

function raceFromJolpica(race, staticRace) {
  const date = race.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const round = Number(race.round);
  const location = race.Circuit?.Location || {};
  const enName = staticRace?.enName || race.Circuit?.circuitName || "";
  const staticRaceDate = staticRace?.sessions?.find((session) => session.type === "RACE")?.start?.slice(0, 10);
  // 此来源只提供周末日期；日期未变时绝不能用它覆盖已有的具体场次时间。
  if (staticRace?.sessions && staticRaceDate === date) return { ...staticRace };
  const endDate = new Date(`${date}T00:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() + 3);
  return {
    round,
    name: staticRace?.name || race.raceName || "F1 大奖赛",
    enName,
    country: staticRace?.country || location.country || "",
    city: staticRace?.city || location.locality || "",
    circuit: staticRace?.circuit || enName,
    ...(staticRace?.lat != null ? { lat: staticRace.lat, lng: staticRace.lng } : {}),
    sprint: Boolean(staticRace?.sprint),
    weekend: { start: date, end: endDate.toISOString().slice(0, 10) },
  };
}

function normalizeSchedule(year, payload, staticSeason) {
  const races = payload?.MRData?.RaceTable?.Races;
  if (!Array.isArray(races) || races.length === 0) throw new Error(`赛季 ${year} 数据为空`);
  const staticRounds = new Map((staticSeason?.rounds || []).map((race) => [Number(race.round), race]));
  const rounds = races.map((race) => raceFromJolpica(race, staticRounds.get(Number(race.round)))).filter(Boolean);
  if (rounds.length !== races.length || rounds.length < 3) throw new Error(`赛季 ${year} 数据不完整`);
  rounds.sort((a, b) => a.round - b.round);
  return { year, rounds };
}

async function fetchJson(url, fetcher) {
  const response = await fetcher(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`上游请求失败 ${response.status}`);
  return response.json();
}

export async function syncSchedules({ env, staticSeasons, now = new Date(), fetcher = fetch }) {
  if (!env?.SCHEDULES) throw new Error("未配置 SCHEDULES KV");
  const base = env.SCHEDULE_SOURCE_URL || DEFAULT_SOURCE;
  const seasonPayload = await fetchJson(`${base}/seasons.json?limit=100`, fetcher);
  const years = seasonList(seasonPayload);
  if (!years.length) throw new Error("上游未返回赛季");
  const results = [];
  for (const year of years) {
    const staticSeason = staticSeasons.find((item) => item.year === year);
    try {
      const candidate = normalizeSchedule(year, await fetchJson(`${base}/${year}.json`, fetcher), staticSeason);
      const metaText = await env.SCHEDULES.get(keys.meta(year));
      const scheduleText = await env.SCHEDULES.get(keys.schedule(year));
      const oldMeta = metaText ? JSON.parse(metaText) : {};
      const oldSchedule = scheduleText ? JSON.parse(scheduleText) : null;
      const incoming = new Set(candidate.rounds.map((race) => race.round));
      const missingCounts = { ...(oldMeta.missingCounts || {}) };
      for (const round of incoming) delete missingCounts[round];
      for (const oldRace of oldSchedule?.rounds || []) {
        if (incoming.has(oldRace.round) || oldRace.cancelled || oldRace.weekend?.end < now.toISOString().slice(0, 10)) continue;
        missingCounts[oldRace.round] = (missingCounts[oldRace.round] || 0) + 1;
        candidate.rounds.push(missingCounts[oldRace.round] < DELETE_CONFIRMATIONS
          ? { ...oldRace, pendingRemoval: true }
          : { ...oldRace, cancelled: true, cancelledAt: now.toISOString(), cancelReason: "上游连续多次缺失" });
      }
      candidate.rounds.sort((a, b) => a.round - b.round);
      const meta = { year, source: base, updatedAt: now.toISOString(), version: Number(oldMeta.version || 0) + 1, missingCounts };
      await env.SCHEDULES.put(keys.schedule(year), JSON.stringify(candidate));
      await env.SCHEDULES.put(keys.meta(year), JSON.stringify(meta));
      results.push({ year, ok: true, version: meta.version });
    } catch (error) {
      results.push({ year, ok: false, error: error.message });
    }
  }
  return { updatedAt: now.toISOString(), years, results };
}

export async function readSchedule(env, year, staticSeasons) {
  const stored = env?.SCHEDULES ? await env.SCHEDULES.get(keys.schedule(year), "json") : null;
  return stored?.year === year && Array.isArray(stored.rounds) && stored.rounds.length
    ? stored
    : staticSeasons.find((season) => season.year === year) || null;
}

export async function readMeta(env) {
  if (!env?.SCHEDULES?.list) return [];
  const listed = await env.SCHEDULES.list({ prefix: "schedule-meta:" });
  const items = await Promise.all((listed.keys || []).map((key) => env.SCHEDULES.get(key.name, "json")));
  return items.filter(Boolean).sort((a, b) => a.year - b.year);
}
