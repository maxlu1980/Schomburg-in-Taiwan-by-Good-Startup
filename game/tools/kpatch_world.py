# Köln patches for parts f (04_island_f) and f2 (05_island_f2): the inline words a player in Köln sees, plus four small guards
# that keep the island-only code of part f2 from breaking the Köln build (TWG, the island's distance field, does not exist here).
# Exec'd by Python 3; each patch(part, old, new) needs `old` exactly once in the reference part.
# NOT touched here (already patched in port.py): "var east = [[121.62, 23.62], [121.48, 23.25], [121.25, 22.85]]; east.forEach("

# ---- part f: the food card's small line names the stall (K_STALL in kt_world.js) before STN / LN; no `ja`
patch('04_island_f', "STN[d[1]] || LN[d[1]] || { zh: '', en: '', ja: '' }", "(typeof K_STALL !== 'undefined' && K_STALL[d[1]]) || STN[d[1]] || LN[d[1]] || { en: '', zh: '', de: '' }")

# ---- part f2: the roles of the street people (the talk's header): Köln equivalents, en / zh / de
patch('05_island_f2', "Object.assign(ROLEN, { ol: { zh: '軟體公司業務', en: 'Software account manager', ja: 'ソフトウェア会社の営業' }, kang: { zh: '康先生', en: 'Mr Kang', ja: '康さん' }, guide: { zh: '城市嚮導', en: 'City guide', ja: '街の案内人' }, gang: { zh: '黑衣人', en: 'Man in black', ja: '黒服の男' } });", "Object.assign(ROLEN, { ol: { en: 'Newspaper seller', zh: '報紙小販', de: 'Zeitungsverkäuferin' }, kang: { en: 'Old fisherman', zh: '老漁夫', de: 'Alter Fischer' }, guide: { en: 'City guide', zh: '城市嚮導', de: 'Stadtguide' }, gang: { en: 'Rust pirate', zh: '鏽蝕海盜', de: 'Rostpirat' } });")

# ---- part f2: the city guide's lists and buttons, the phone's "from" line: the Chinese comma / colon only in Chinese
patch('05_island_f2', ".join('、') })); if (NL.f.length)", ".join(LANG === 'zh' ? '、' : ', ') })); if (NL.f.length)")
patch('05_island_f2', ".join('、') })); L.push(G2.ask);", ".join(LANG === 'zh' ? '、' : ', ') })); L.push(G2.ask);")
patch('05_island_f2', "esc(tx('guideSight')) + '：' + ", "esc(tx('guideSight')) + (LANG === 'zh' ? '：' : ': ') + ")
patch('05_island_f2', "esc(tx('guideFood')) + '：' + ", "esc(tx('guideFood')) + (LANG === 'zh' ? '：' : ': ') + ")
patch('05_island_f2', "esc(tx('rideFrom')) + '：' + esc(hn)", "esc(tx('rideFrom')) + (LANG === 'zh' ? '：' : ': ') + esc(hn)")

# ---- part f2: the phone's ride app counts in euros and in Köln's metres (1 unit = 1.2 m), not in NT$ and island kilometres
patch('05_island_f2', "' · NT$' + fare + ' · '", "' · €' + fare + ' · '")
patch('05_island_f2', "  /* the quote: city speed for short hops, the freeway for the long ones; NT$85 flag-fall, NT$15 a km, NT$3 a minute (an estimate, not a real tariff) */\n  function rideQuote(o) { var km = Math.hypot(o.x - pos.x, o.z - pos.z) * 1.15, min = Math.max(3, Math.round(km < 10 ? km / 0.45 + 2 : 24 + (km - 10) / 1.35)), fare = Math.round(85 + km * 15 + min * 3), coins = Math.max(2, Math.round(Math.sqrt(km) * 1.6)); return { km: km, min: min, fare: fare, coins: coins }; }", "  /* the quote (Köln: 1 unit = 1.2 m, a city taxi's pace): €4 flag-fall, €2.40 a km, €0.40 a minute (an estimate, not a real tariff) */\n  function rideQuote(o) { var km = Math.hypot(o.x - pos.x, o.z - pos.z) * 1.2 / 1000 * 1.15, min = Math.max(3, Math.round(km / 0.3 + 2)), fare = Math.round(4 + km * 2.4 + min * 0.4), coins = Math.max(2, Math.round(Math.sqrt(km) * 3)); return { km: km, min: min, fare: fare, coins: coins }; }")

# ---- part f2: guards (mechanics, not words): without the island's TWG, roadNear threw on every ride, and the dolphin set-up at
#      W.places.taitung (in Köln: the Dom's south tower) threw inside extraBuild, so the waypoint arrow (#isWpA) was never made
patch('05_island_f2', "function roadNear(x, z) { var GG = TWG,", "function roadNear(x, z) { if (typeof TWG === 'undefined') return [x, z]; var GG = TWG,")
patch('05_island_f2', "var tt = W.places.taitung; if (tt) {", "var tt = typeof TWG !== 'undefined' && TWG.sdf ? W.places.taitung : null; if (tt) {")

# ---- part f2: island-only literals (unreachable in Köln: no TWG, no W.nanwan) — `ja` replaced by `de` so no Japanese is left
patch('05_island_f2', "lx({ zh: '綠島 · 蘭嶼', en: 'Green Island · Orchid Island', ja: '緑島・蘭嶼' }) : lx({ zh: '小琉球', en: 'Xiaoliuqiu', ja: '小琉球' })", "lx({ en: 'A round on the Rhine', zh: '萊茵河上繞一圈', de: 'Eine Runde auf dem Rhein' }) : lx({ en: 'Over to Deutz', zh: '到對岸的道依茨', de: 'Rüber nach Deutz' })")
patch('05_island_f2', r"var NM = { green: [{ zh: '綠島', en: 'Green Island', ja: '緑島' }, { zh: '綠島燈塔 · 朝日溫泉 · 海底的珊瑚', en: 'The lighthouse · Zhaori hot spring · the coral below', ja: '緑島灯台・朝日温泉・海の珊瑚' }], orchid: [{ zh: '蘭嶼', en: 'Orchid Island', ja: '蘭嶼' }, { zh: '達悟族的拼板舟 · 飛魚的季節', en: 'The Tao people\'s plank boats · the flying-fish season', ja: 'タオ族の板船・トビウオの季節' }], liuqiu: [{ zh: '小琉球', en: 'Xiaoliuqiu', ja: '小琉球' }, { zh: '花瓶岩 · 海龜 · 珊瑚礁島', en: 'Vase Rock · sea turtles · a coral island', ja: '花瓶岩・ウミガメ・珊瑚礁の島' }] }[Pq.id];", r"var NM = { green: [{ en: 'Green Island', zh: '綠島', de: 'Grüne Insel' }, { en: 'The lighthouse · Zhaori hot spring · the coral below', zh: '綠島燈塔 · 朝日溫泉 · 海底的珊瑚', de: 'Der Leuchtturm · die heiße Quelle Zhaori · die Korallen darunter' }], orchid: [{ en: 'Orchid Island', zh: '蘭嶼', de: 'Orchideeninsel' }, { en: 'The Tao people\'s plank boats · the flying-fish season', zh: '達悟族的拼板舟 · 飛魚的季節', de: 'Die Plankenboote der Tao · die Zeit der Fliegenden Fische' }], liuqiu: [{ en: 'Xiaoliuqiu', zh: '小琉球', de: 'Xiaoliuqiu' }, { en: 'Vase Rock · sea turtles · a coral island', zh: '花瓶岩 · 海龜 · 珊瑚礁島', de: 'Vasenfelsen · Meeresschildkröten · eine Koralleninsel' }] }[Pq.id];")
patch('05_island_f2', "{ zh: ['花蓮外海', '石梯坪外海', '台東外海'][k], en: ['off Hualien', 'off Shitiping', 'off Taitung'][k], ja: ['花蓮沖', '石梯坪沖', '台東沖'][k] }", "{ en: ['off Hualien', 'off Shitiping', 'off Taitung'][k], zh: ['花蓮外海', '石梯坪外海', '台東外海'][k], de: ['vor Hualien', 'vor Shitiping', 'vor Taitung'][k] }")
patch('05_island_f2', "{ zh: '南灣', en: 'Nanwan', ja: '南湾' }", "{ en: 'Nanwan', zh: '南灣', de: 'Nanwan' }")
