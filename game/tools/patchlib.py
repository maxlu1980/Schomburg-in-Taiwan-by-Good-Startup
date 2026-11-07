# Patch library copies for the Köln build. Run from anywhere; edits src/koeln/lib/*.js from game/ref/mods originals.
import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
if not REF.is_dir():
    raise SystemExit(__file__ + ': needs the reference engine (game/ref/), which is not in the repository — see README.')
import re, sys
REF = str(REF / 'mods') + '/'; OUT = str(SRC / 'lib') + '/'
def rep(s, a, b, cnt=1, name=''):
    n = s.count(a)
    if n < 1 or (cnt and n != cnt):
        raise SystemExit('patch failed (%s): found %d of %r' % (name, n, a[:120]))
    return s.replace(a, b)

# ---------- SKY ----------
s = open(REF+'SKY.js').read()
# season of Central Europe (Köln): bare trees in winter, fresh green in April-May, deep in summer, gold and russet in October-November
a = s[s.index('  /* ---------- the season (Taiwan)'):s.index('  /* ---------- the weather ---------- */')]
s = s.replace(a, '''  /* ---------- the season (the Rhineland): a smooth year, the colour of the green ----------
     fresh in late April and May, deep in summer, gold and russet in October and November, dull olive-brown in winter; no blossom season */
  function season(date) { var start = Date.UTC(date.getUTCFullYear(), 0, 1), doy = (date.getTime() - start) / 86400000, y = doy / 365.25;
    function bump(c, w) { var dd = Math.abs(y - c); dd = Math.min(dd, 1 - dd); return Math.exp(-dd * dd / (2 * w * w)); }
    var key = y < 0.16 || y >= 0.915 ? 'winter' : y < 0.414 ? 'spring' : y < 0.665 ? 'summer' : 'autumn';
    var spring = bump(0.34, 0.06), summer = bump(0.57, 0.09), autumn = bump(0.82, 0.06), winter = bump(0.04, 0.1), tot = spring + summer + autumn + winter;
    var T = [[1.0, 1.1, 0.9], [0.92, 1.0, 0.86], [1.22, 0.96, 0.66], [1.0, 0.94, 0.84]], tint = [0, 0, 0], ws = [spring, summer, autumn, winter], k, j;
    for (k = 0; k < 4; k++) for (j = 0; j < 3; j++) tint[j] += T[k][j] * ws[k] / tot;
    return { key: key, doy: doy, tint: tint, bloom: 0 }; }

''')
# no open-meteo: the city's anchor answers; the fallback is the city's own climate model
s = rep(s, "    if ((!WX.list && WX.src !== 'model' && !WX.busy) || (Date.now() - WX.t > (WX.src === 'live' ? 900000 : 300000) && WX.err < 3)) fetchNow();\n", '', name='nofetch')
# the city's time zone may change with the date (CET / CEST)
s = rep(s, "function model(date) { var jt = new Date(date.getTime() + CF.tz * 3600000)", "function model(date) { var jt = new Date(date.getTime() + (typeof CF.tz === 'function' ? CF.tz(date) : CF.tz) * 3600000)", name='tz')
s = rep(s, "LAT: LAT, LON: LON, KEY: KEY, TZ: CF.tz };", "LAT: LAT, LON: LON, KEY: KEY, TZ: CF.tz, tz: function (d) { return typeof CF.tz === 'function' ? CF.tz(d || new Date()) : CF.tz; } };", name='tzexp')
# the cities of Taiwan and Tokyo go; Köln comes
i = s.index('/* Tokyo: the Japan Meteorological Agency')
s = s[:i] + '''/* Köln: AccuWeather's Altstadt-Nord cell (location key 2601535, 50.942 N 6.955 E, over the cathedral and the main station) when the connector
   is there; otherwise the climate of the Köln/Bonn station of the Deutscher Wetterdienst, 1991–2020 normals (mean, mean daily maximum and minimum,
   precipitation, days with 1 mm or more; cloud from the sunshine hours): mild, grey winters, the showers and thunderstorms of summer afternoons,
   the south-westerly wind most of the year. Central European time, summer time from the last Sunday of March to the last Sunday of October. */
function KOLN_TZ(d) { var y = d.getUTCFullYear(); function lastSun(m) { var t = new Date(Date.UTC(y, m + 1, 0, 1)); t.setUTCDate(t.getUTCDate() - t.getUTCDay()); return t.getTime(); } var t = d.getTime(); return t >= lastSun(2) && t < lastSun(9) ? 2 : 1; }
var KOLNWEA = WXSRC({ lat: 50.942, lon: 6.955, key: '2601535', tz: KOLN_TZ, site: 'Altstadt-Nord', fake: 'KOWX_FAKE', salt: 53, hum0: 64,
  tm: [3.0, 3.6, 6.7, 10.4, 14.1, 17.1, 19.0, 18.5, 14.8, 10.8, 6.7, 3.8], tx: [5.9, 7.2, 11.4, 16.1, 19.7, 22.7, 24.9, 24.5, 20.4, 15.2, 9.8, 6.5], tn: [0.0, 0.1, 2.0, 4.5, 8.1, 11.2, 13.3, 12.8, 9.7, 6.8, 3.5, 1.0],
  pr: [61.7, 53.8, 55.0, 48.2, 62.1, 86.3, 87.4, 83.3, 66.9, 64.7, 63.5, 69.2], rd: [17.2, 16.3, 16.0, 13.0, 14.4, 14.4, 15.4, 14.5, 14.2, 15.6, 17.4, 19.1],
  cloud: [0.79, 0.73, 0.66, 0.58, 0.59, 0.59, 0.58, 0.56, 0.6, 0.68, 0.78, 0.81], thu: [4, 7, 0.22], wind: [225, 230, 250, 250, 250, 245, 245, 240, 230, 225, 225, 225] });
'''
open(OUT+'SKY.js','w').write(s)
print('SKY ok', len(s))

# ---------- TPE3D: German signals, German vehicles, Köln's clock ----------
s = open(REF+'TPE3D.js').read()
a = s.index('  function drawSig(T, grp, now) {'); b = s.index('  function signalsInit(T)')
s = s[:a] + '''  /* (Köln) the faces of a group's signals, German style, on one canvas: the cars' heads (three lamps one above the other; red and yellow
     together before the green) for traffic along x (cell x 0..100) and along z (100..200); the walkers' heads (the red man standing over the
     green man walking) for crossings of an east-west road (200..300) and of a north-south road (300..400) */
  function sigLamp(g, cx, cy, r, col, on, dim) { g.fillStyle = '#050505'; g.beginPath(); g.arc(cx, cy, r + 4, 0, 7); g.fill(); var rg = g.createRadialGradient(cx - r * 0.25, cy - r * 0.3, 2, cx, cy, r); rg.addColorStop(0, on ? '#ffffff' : dim); rg.addColorStop(0.3, on ? col : dim); rg.addColorStop(1, on ? col : '#0a0a0a'); g.fillStyle = rg; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); }
  function drawSig(T, grp, now) { var S = T.sigC[grp], e = carLight(T, grp, 'ew'), n = carLight(T, grp, 'ns'), pe = pedLight(T, grp, 'ew'), pn = pedLight(T, grp, 'ns'), ry = function (L) { return L[0] === 'R' && L[1] <= 1.2; }, key = e[0] + (ry(e) ? 'y' : '') + n[0] + (ry(n) ? 'y' : '') + pe[0] + pn[0]; if (key === S.key) return; S.key = key; var g = S.g;
    g.fillStyle = '#0a0b0c'; g.fillRect(0, 0, 512, 256);
    [[0, e], [100, n]].forEach(function (q) { var x0 = q[0], L = q[1], cx = x0 + 50; g.fillStyle = '#16181a'; g.fillRect(x0 + 6, 4, 88, 248); sigLamp(g, cx, 46, 32, '#ff2a1e', L[0] === 'R', '#3a0806'); sigLamp(g, cx, 128, 32, '#ffb21a', L[0] === 'Y' || ry(L), '#3a2606'); sigLamp(g, cx, 210, 32, '#24e08a', L[0] === 'G', '#06301c'); });
    [[200, pe], [300, pn]].forEach(function (q) { var x0 = q[0], L = q[1], cx = x0 + 50, walkOn = L[0] === 'W' || L[0] === 'F'; g.fillStyle = '#121416'; g.fillRect(x0 + 6, 4, 88, 248); g.fillStyle = '#050505'; g.fillRect(x0 + 12, 12, 76, 112); g.fillRect(x0 + 12, 132, 76, 112); man(g, cx, 92, 1.25, false, 0, L[0] === 'D' ? '#ff2a1e' : '#3a0806'); man(g, cx, 214, 1.25, true, 0.25, walkOn ? '#24e08a' : '#06301c'); });
    S.tex.needsUpdate = true; }
''' + s[b:]
# German vehicles: ivory taxis with the yellow roof sign, the city's red-and-white buses, the police in silver and blue (blue lamps only)
s = s.replace("VK.twtaxi = Object.assign({}, sed, { cols: [0xf2c21a, 0xf0be14, 0xf4c628], roof: true, hl: [0.62, 0.72] }); VK.twsedan = Object.assign({}, sed, { cols: [0xe8e8ea, 0x1a1c20, 0x8a9096, 0xc8ccd0, 0x6a2026, 0x2a3a5a, 0xf2f2f0] });",
              "VK.twtaxi = Object.assign({}, sed, { cols: [0xefe7c8, 0xece2c0, 0xf0e8cc], roof: true, hl: [0.62, 0.72] }); VK.twsedan = Object.assign({}, sed, { cols: [0xc8ccd0, 0x1a1c20, 0x4a4e54, 0xf2f2f0, 0x1e3a6a, 0x8a1a1e, 0x9aa2a8, 0x2a4a3a] });")
s = s.replace("band: [0x1a5aa8, 0x1a8a4a, 0xc83a2a][i], door: [3.0, 4.1] }); });", "band: [0xc8102e, 0xc8102e, 0xb80e28][i], door: [3.0, 4.1] }); });")
s = s.replace("VK.twpatrol = Object.assign({}, sed, { cols: [0xf8f8f6] });", "VK.twpatrol = Object.assign({}, sed, { cols: [0xd8dcde] });")
s = s.replace("var lm = new THREE.Mesh(K.rbox(0.5, 0.12, 0.26, 0.05, 2), K.curved(new THREE.MeshBasicMaterial({ color: s < 0 ? 0x5a0a08 : 0x08184a, toneMapped: false }))); lm.position.set(s * 0.29, 1.33, -0.2); lm.userData.on = s < 0 ? 0xff2010 : 0x1a5aff; lm.userData.off = s < 0 ? 0x3a0806 : 0x06103a;",
              "var lm = new THREE.Mesh(K.rbox(0.5, 0.12, 0.26, 0.05, 2), K.curved(new THREE.MeshBasicMaterial({ color: 0x08184a, toneMapped: false }))); lm.position.set(s * 0.29, 1.33, -0.2); lm.userData.on = s < 0 ? 0x2a6aff : 0x1a5aff; lm.userData.off = 0x06103a;")
s = s.replace("var tb = new THREE.Mesh(K.box(0.36, 0.1, 0.22), K.curved(new THREE.MeshBasicMaterial({ color: 0xf2f2ea, toneMapped: false })));", "var tb = new THREE.Mesh(K.box(0.42, 0.13, 0.2), K.curved(new THREE.MeshBasicMaterial({ color: 0xf2d84a, toneMapped: false })));")
# Köln's clock for the boards
a = s.index('  function tpeNow() {'); b = s.index('  function hm(t)')
s = s[:a] + "  function tpeNow() { var d = new Date(); if (window.ISLE_HOUR != null) { var h = window.ISLE_HOUR; return { h: Math.floor(h), m: Math.floor((h % 1) * 60), s: 0 }; } try { var s = d.toLocaleString('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), m = s.match(/(\\d+):(\\d+):(\\d+)/); return { h: +m[1] % 24, m: +m[2], s: +m[3] }; } catch (e) { var tz = typeof KOLN_TZ === 'function' ? KOLN_TZ(d) : 1; return { h: (d.getUTCHours() + tz) % 24, m: d.getUTCMinutes(), s: d.getUTCSeconds() }; } }\n" + s[b:]
for chk in ["0xefe7c8", "0xc8102e", "0xd8dcde", "0x2a6aff", "0xf2d84a", "Europe/Berlin", "sigLamp"]:
    assert chk in s, chk
open(OUT+'TPE3D.js','w').write(s); print('TPE3D ok', len(s))
