# Köln: exact-string patches for the inline words of the street play (part i), the language chip and the district's name (part o) and
# NO AFTERLIFE's menu board (part s). Read by the port (and by patchcheck.py) as patch(part, old, new); every `old` occurs once in the
# reference part. Parts l (12) and t (20) show no inline words in Köln: their words all come from TPX / NVX (kt_street.js).

# ---- part i: the phone's avatars (Max, Kalle, the Polizeiwache, the Brauhaus, Elif, DB staff; Willi, Hilde, Mira), the DB-red staff thread,
#      and the typing time of an alphabetic language (German reads like English, not like Chinese) ----
patch('08_island_i', "({ boss: '中', kage: '影', koban: TK && TK.id !== 'tokyo' ? '警' : '交', master: '灯', vendor: '便', staff: '高' })[id]", "({ boss: 'M', kage: 'K', koban: 'P', master: 'B', vendor: 'E', staff: 'DB' })[id]")
patch('08_island_i', "m.who === 'r1' ? '田' : m.who === 'r2' ? '千' : m.who === 'me2' ? 'ル'", "m.who === 'r1' ? 'W' : m.who === 'r2' ? 'H' : m.who === 'me2' ? 'M'")
patch('08_island_i', "['staff', 's', '#f07a1a']", "['staff', 's', '#ec0016']")
patch('08_island_i', "l[1].length * (LANG === 'en' ? 0.018 : 0.045)", "l[1].length * (LANG === 'zh' ? 0.045 : 0.018)")

# ---- part o: the language chip (中 / EN / DE) and its menu (English, 繁體中文, Deutsch); the district's name is Köln ----
patch('15_island_o', "lbl = { zh: '中', en: 'EN', ja: '日' }[L] || 'EN'", "lbl = { zh: '中', en: 'EN', de: 'DE' }[L] || 'EN'")
patch('15_island_o', "b.setAttribute('aria-label', { zh: '語言', en: 'Language', ja: '言語' }[L] || 'Language')", "b.setAttribute('aria-label', { zh: '語言', en: 'Language', de: 'Sprache' }[L] || 'Language')")
patch('15_island_o', "[['zh', '繁體中文'], ['en', 'English'], ['ja', '日本語']]", "[['en', 'English'], ['zh', '繁體中文'], ['de', 'Deutsch']]")
patch('15_island_o', "['zh', 'en', 'ja'].forEach(function (lg) { var a = TXH[lg]; if (a && a.tokyo) a.tokyo = { zh: '新東都', en: 'Neo-Tōto', ja: '新東都' }[lg];", "['zh', 'en', 'de'].forEach(function (lg) { var a = TXH[lg]; if (a && a.tokyo) a.tokyo = { zh: '科隆', en: 'Köln', de: 'Köln' }[lg];")

# ---- part s: NO AFTERLIFE's LED menu board over the back bar — German names on the left, Chinese on the right (Max's Taiwan), and the
#      zero-proof line in both ----
patch('19_island_s', "TXX.zh.cocktails.forEach(function (q, i) {", "TXX.de.cocktails.forEach(function (q, i) {")
patch('19_island_s', "g.font = '600 26px sans-serif'; g.fillText(TXX.en.cocktails[i][1], 560, y);", "g.font = '600 26px \"Noto Sans TC\",\"PingFang TC\",sans-serif'; g.fillText(TXX.zh.cocktails[i][1], 560, y);")
patch('19_island_s', "'工作中的客人：無酒精版本 · Zero-proof for guests on duty'", "'Gäste im Dienst: alkoholfrei · 工作中的客人：無酒精版本'")
