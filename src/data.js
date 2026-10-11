// ============================================================================
// F1 赛历数据文件（唯一需要日常维护的文件）
// ============================================================================
//
// 【如何更新】——改数据不改代码，未来任何变动都只改这个文件：
//
//   1. 改一场比赛的时间：
//      找到对应站的 sessions，把 start 改成新时间即可（北京时间）。
//
//   2. 新增 / 删除一站：
//      在对应赛季的 rounds 数组里增删一个对象（注意 round 序号不要重复）。
//
//   3. 新增一个赛季（如 2027）：
//      往 SEASONS 数组末尾追加一个 { year: 2027, rounds: [...] } 即可。
//      默认订阅会取“最新”赛季；也可以通过 URL 加 ?year=2027 指定。
//
//   4. 改时区：
//      修改下方 CALENDAR_TZ（默认统一北京时间，Asia/Shanghai = UTC+8，无夏令时）。
//
// 【字段说明】
//   year     赛季年份
//   round    轮次序号（1 起）
//   name     分站显示名（中文）
//   country  国家/地区
//   city     举办城市
//   circuit  赛道名
//   sprint   是否为冲刺赛周末（含冲刺排位赛 + 冲刺赛）
//   sessions 环节列表：type = 环节类型，start = 开始时间（北京时间 "YYYY-MM-DDTHH:mm"）
//
// 【环节类型 type 取值】
//   FP1 / FP2 / FP3          第1/2/3次练习赛
//   QUALI                    排位赛
//   SPRINT_QUALI             冲刺排位赛（仅冲刺赛周末）
//   SPRINT                   冲刺赛（仅冲刺赛周末）
//   RACE                     正赛
//
// 【数据来源】f1calendar.com（sportstimes/f1），时间已转换为北京时间。
//   正赛时间可能随官方确认而调整，请以 F1 官方 / f1calendar.com 最新数据为准。
// ============================================================================

export const CALENDAR_TZ = "Asia/Shanghai";

export const SEASONS = [
  {
    year: 2026,
    rounds: [
      {
        round: 1,
        name: "澳大利亚大奖赛",
        enName: "Albert Park Circuit",
        country: "澳大利亚",
        city: "墨尔本",
        circuit: "阿尔伯特公园赛道",
        lat: -37.8373,
        lng: 144.9666,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-03-06T09:30" },
          { type: "FP2", start: "2026-03-06T13:00" },
          { type: "FP3", start: "2026-03-07T09:30" },
          { type: "QUALI", start: "2026-03-07T13:00" },
          { type: "RACE", start: "2026-03-08T12:00" },
        ],
      },
      {
        round: 2,
        name: "中国大奖赛",
        enName: "Shanghai International Circuit",
        country: "中国",
        city: "上海",
        circuit: "上海国际赛车场",
        lat: 31.3807,
        lng: 121.2498,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-03-13T11:30" },
          { type: "SPRINT_QUALI", start: "2026-03-13T15:30" },
          { type: "SPRINT", start: "2026-03-14T11:00" },
          { type: "QUALI", start: "2026-03-14T15:00" },
          { type: "RACE", start: "2026-03-15T15:00" },
        ],
      },
      {
        round: 3,
        name: "日本大奖赛",
        enName: "Suzuka International Racing Course",
        country: "日本",
        city: "铃鹿",
        circuit: "铃鹿赛道",
        lat: 34.8448408,
        lng: 136.5334551,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-03-27T10:30" },
          { type: "FP2", start: "2026-03-27T14:00" },
          { type: "FP3", start: "2026-03-28T10:30" },
          { type: "QUALI", start: "2026-03-28T14:00" },
          { type: "RACE", start: "2026-03-29T13:00" },
        ],
      },
      {
        round: 4,
        name: "迈阿密大奖赛",
        enName: "Miami International Autodrome",
        country: "美国",
        city: "迈阿密",
        circuit: "迈阿密国际赛道",
        lat: 25.957764,
        lng: -80.238835,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-05-02T00:00" },
          { type: "SPRINT_QUALI", start: "2026-05-02T04:30" },
          { type: "SPRINT", start: "2026-05-03T00:00" },
          { type: "QUALI", start: "2026-05-03T04:00" },
          { type: "RACE", start: "2026-05-04T01:00" },
        ],
      },
      {
        round: 5,
        name: "加拿大大奖赛",
        enName: "Circuit Gilles Villeneuve",
        country: "加拿大",
        city: "蒙特利尔",
        circuit: "吉尔斯·维伦纽夫赛道",
        lat: 45.5034,
        lng: -73.5267,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-05-23T00:30" },
          { type: "SPRINT_QUALI", start: "2026-05-23T04:30" },
          { type: "SPRINT", start: "2026-05-24T00:00" },
          { type: "QUALI", start: "2026-05-24T04:00" },
          { type: "RACE", start: "2026-05-25T04:00" },
        ],
      },
      {
        round: 6,
        name: "摩纳哥大奖赛",
        enName: "Circuit de Monaco",
        country: "摩纳哥",
        city: "蒙特卡洛",
        circuit: "蒙特卡洛赛道",
        lat: 43.7338,
        lng: 7.4215,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-06-05T19:30" },
          { type: "FP2", start: "2026-06-05T23:00" },
          { type: "FP3", start: "2026-06-06T18:30" },
          { type: "QUALI", start: "2026-06-06T22:00" },
          { type: "RACE", start: "2026-06-07T21:00" },
        ],
      },
      {
        round: 7,
        name: "巴塞罗那-加泰罗尼亚大奖赛",
        enName: "Circuit de Barcelona-Catalunya",
        country: "西班牙",
        city: "巴塞罗那",
        circuit: "巴塞罗那-加泰罗尼亚赛道",
        lat: 41.5638,
        lng: 2.2585,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-06-12T19:30" },
          { type: "FP2", start: "2026-06-12T23:00" },
          { type: "FP3", start: "2026-06-13T18:30" },
          { type: "QUALI", start: "2026-06-13T22:00" },
          { type: "RACE", start: "2026-06-14T21:00" },
        ],
      },
      {
        round: 8,
        name: "奥地利大奖赛",
        enName: "Red Bull Ring",
        country: "奥地利",
        city: "斯皮尔伯格",
        circuit: "红牛环赛道",
        lat: 47.2225,
        lng: 14.7607,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-06-26T19:30" },
          { type: "FP2", start: "2026-06-26T23:00" },
          { type: "FP3", start: "2026-06-27T18:30" },
          { type: "QUALI", start: "2026-06-27T22:00" },
          { type: "RACE", start: "2026-06-28T21:00" },
        ],
      },
      {
        round: 9,
        name: "英国大奖赛",
        enName: "Silverstone Circuit",
        country: "英国",
        city: "银石",
        circuit: "银石赛道",
        lat: 52.0706,
        lng: -1.0174,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-07-03T19:30" },
          { type: "SPRINT_QUALI", start: "2026-07-03T23:30" },
          { type: "SPRINT", start: "2026-07-04T19:00" },
          { type: "QUALI", start: "2026-07-04T23:00" },
          { type: "RACE", start: "2026-07-05T22:00" },
        ],
      },
      {
        round: 10,
        name: "比利时大奖赛",
        enName: "Circuit de Spa-Francorchamps",
        country: "比利时",
        city: "斯帕-弗朗科尔尚",
        circuit: "斯帕-弗朗科尔尚赛道",
        lat: 50.444,
        lng: 5.9687,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-07-17T19:30" },
          { type: "FP2", start: "2026-07-17T23:00" },
          { type: "FP3", start: "2026-07-18T18:30" },
          { type: "QUALI", start: "2026-07-18T22:00" },
          { type: "RACE", start: "2026-07-19T21:00" },
        ],
      },
      {
        round: 11,
        name: "匈牙利大奖赛",
        enName: "Hungaroring",
        country: "匈牙利",
        city: "布达佩斯",
        circuit: "亨格罗宁赛道",
        lat: 47.583,
        lng: 19.2526,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-07-24T19:30" },
          { type: "FP2", start: "2026-07-24T23:00" },
          { type: "FP3", start: "2026-07-25T18:30" },
          { type: "QUALI", start: "2026-07-25T22:00" },
          { type: "RACE", start: "2026-07-26T21:00" },
        ],
      },
      {
        round: 12,
        name: "荷兰大奖赛",
        enName: "Circuit Zandvoort",
        country: "荷兰",
        city: "赞德沃特",
        circuit: "赞德沃特赛道",
        lat: 52.388408,
        lng: 4.547122,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-08-21T18:30" },
          { type: "SPRINT_QUALI", start: "2026-08-21T22:30" },
          { type: "SPRINT", start: "2026-08-22T18:00" },
          { type: "QUALI", start: "2026-08-22T22:00" },
          { type: "RACE", start: "2026-08-23T21:00" },
        ],
      },
      {
        round: 13,
        name: "意大利大奖赛",
        enName: "Autodromo Nazionale di Monza",
        country: "意大利",
        city: "蒙扎",
        circuit: "蒙扎赛道",
        lat: 45.6169,
        lng: 9.2825,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-09-04T18:30" },
          { type: "FP2", start: "2026-09-04T22:00" },
          { type: "FP3", start: "2026-09-05T18:30" },
          { type: "QUALI", start: "2026-09-05T22:00" },
          { type: "RACE", start: "2026-09-06T21:00" },
        ],
      },
      {
        round: 14,
        name: "西班牙大奖赛（马德里）",
        enName: "Madring",
        country: "西班牙",
        city: "马德里",
        circuit: "马德里街道赛道",
        lat: 40.4168,
        lng: -3.7038,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-09-11T19:30" },
          { type: "FP2", start: "2026-09-11T23:00" },
          { type: "FP3", start: "2026-09-12T18:30" },
          { type: "QUALI", start: "2026-09-12T22:00" },
          { type: "RACE", start: "2026-09-13T21:00" },
        ],
      },
      {
        round: 15,
        name: "阿塞拜疆大奖赛",
        enName: "Baku City Circuit",
        country: "阿塞拜疆",
        city: "巴库",
        circuit: "巴库城市赛道",
        lat: 40.3699,
        lng: 49.8433,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-09-24T16:30" },
          { type: "FP2", start: "2026-09-24T20:00" },
          { type: "FP3", start: "2026-09-25T16:30" },
          { type: "QUALI", start: "2026-09-25T20:00" },
          { type: "RACE", start: "2026-09-26T19:00" },
        ],
      },
      {
        round: 16,
        name: "巴林大奖赛（马来西亚）",
        enName: "Sepang International Circuit",
        country: "马来西亚",
        city: "雪邦",
        circuit: "雪邦国际赛道",
        lat: 2.760278,
        lng: 101.738056,
        sprint: false,
        // 注：原定巴林萨基尔站，因故改期至马来西亚雪邦举行，状态 TBC（待定），
        // 时间按雪邦历史赛程估算，请以官方最终确认为准。
        sessions: [
          { type: "FP1", start: "2026-10-02T12:30" },
          { type: "FP2", start: "2026-10-02T16:00" },
          { type: "FP3", start: "2026-10-03T12:30" },
          { type: "QUALI", start: "2026-10-03T16:00" },
          { type: "RACE", start: "2026-10-04T15:00" },
        ],
      },
      {
        round: 17,
        name: "新加坡大奖赛",
        enName: "Marina Bay Street Circuit",
        country: "新加坡",
        city: "新加坡",
        circuit: "滨海湾街道赛道",
        lat: 1.2857,
        lng: 103.8575,
        sprint: true,
        sessions: [
          { type: "FP1", start: "2026-10-09T16:30" },
          { type: "SPRINT_QUALI", start: "2026-10-09T20:30" },
          { type: "SPRINT", start: "2026-10-10T17:00" },
          { type: "QUALI", start: "2026-10-10T21:00" },
          { type: "RACE", start: "2026-10-11T20:00" },
        ],
      },
      {
        round: 18,
        name: "美国大奖赛",
        enName: "Circuit of the Americas",
        country: "美国",
        city: "奥斯汀",
        circuit: "美洲赛道",
        lat: 30.1328,
        lng: -97.6411,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-10-24T01:30" },
          { type: "FP2", start: "2026-10-24T05:00" },
          { type: "FP3", start: "2026-10-25T01:30" },
          { type: "QUALI", start: "2026-10-25T05:00" },
          { type: "RACE", start: "2026-10-26T04:00" },
        ],
      },
      {
        round:19,
        name: "墨西哥城大奖赛",
        enName: "Autodromo Hermanos Rodriguez",
        country: "墨西哥",
        city: "墨西哥城",
        circuit: "罗德里格斯兄弟赛道",
        lat: 19.4028,
        lng: -99.0986,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-10-31T02:30" },
          { type: "FP2", start: "2026-10-31T06:00" },
          { type: "FP3", start: "2026-11-01T01:30" },
          { type: "QUALI", start: "2026-11-01T05:00" },
          { type: "RACE", start: "2026-11-02T04:00" },
        ],
      },
      {
        round: 20,
        name: "巴西大奖赛",
        enName: "Interlagos",
        country: "巴西",
        city: "圣保罗",
        circuit: "英特拉格斯赛道",
        lat: -23.7014,
        lng: -46.6969,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-11-06T23:30" },
          { type: "FP2", start: "2026-11-07T03:00" },
          { type: "FP3", start: "2026-11-07T22:30" },
          { type: "QUALI", start: "2026-11-08T02:00" },
          { type: "RACE", start: "2026-11-09T01:00" },
        ],
      },
      {
        round: 21,
        name: "拉斯维加斯大奖赛",
        enName: "Las Vegas Strip Circuit",
        country: "美国",
        city: "拉斯维加斯",
        circuit: "拉斯维加斯街道赛道",
        lat: 36.166747,
        lng: -115.148708,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-11-20T08:30" },
          { type: "FP2", start: "2026-11-20T12:00" },
          { type: "FP3", start: "2026-11-21T08:30" },
          { type: "QUALI", start: "2026-11-21T12:00" },
          { type: "RACE", start: "2026-11-22T12:00" },
        ],
      },
      {
        round: 22,
        name: "卡塔尔大奖赛",
        enName: "Lusail International Circuit",
        country: "卡塔尔",
        city: "多哈",
        circuit: "卢塞尔国际赛道",
        lat: 25.490292,
        lng: 51.45303,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-11-27T21:30" },
          { type: "FP2", start: "2026-11-28T01:00" },
          { type: "FP3", start: "2026-11-28T22:30" },
          { type: "QUALI", start: "2026-11-29T02:00" },
          { type: "RACE", start: "2026-11-30T00:00" },
        ],
      },
      {
        round: 23,
        name: "阿布扎比大奖赛",
        enName: "Yas Marina Circuit",
        country: "阿联酋",
        city: "亚斯码头",
        circuit: "亚斯码头赛道",
        lat: 24.4821,
        lng: 54.3482,
        sprint: false,
        sessions: [
          { type: "FP1", start: "2026-12-04T17:30" },
          { type: "FP2", start: "2026-12-04T21:00" },
          { type: "FP3", start: "2026-12-05T18:30" },
          { type: "QUALI", start: "2026-12-05T22:00" },
          { type: "RACE", start: "2026-12-06T21:00" },
        ],
      },
    ],
  },
];
