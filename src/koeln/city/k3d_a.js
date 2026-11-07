/* ===== KOELN3D — Köln downtown at true scale: the cathedral, the main station, the Hohenzollern Bridge and the Rhine =====
   The one city of SCHOMBURG · KÖLN, built on the shared city engine of the reference game (TPE3D: its signals, road network, traffic,
   people, boards and sounds; the street play on top). One unit is 1.2 m; +x east, +z south; the origin is the middle of the cathedral.
   What stands where (plan positions from the real city, simplified where a street bends):
   · the cathedral (Hohe Domkirche St. Petrus), 144.6 m long, its west front 61.5 m wide, the two towers 157.3 m, the nave's ridge 61.1 m,
     the transept 86.25 m across, the ridge turret over the crossing 109 m; the Domplatte round it, Roncalliplatz to the south with the
     Roman-Germanic Museum, the Bahnhofsvorplatz between the cathedral and the station;
   · the main station (Köln Hbf): the hall of 1894 (255 m, a central span of 64 m and two aisles of 13 m) turned some thirty degrees off
     east–west, its tracks raised six metres over the street, eleven platform tracks, the passages and shops under them, the entrance
     hall facing the cathedral and Breslauer Platz behind;
   · the tracks curving out of the hall onto the Hohenzollernbrücke on the cathedral's own axis: 409.19 m over the Rhine in three spans
     (118.88, 167.75, 122.56 m), tied arches over six tracks, the footpaths either side (the southern one hung with love locks), the
     four equestrian statues at the bridge heads;
   · the Rhine, its quays and lower promenades (Frankenwerft, Konrad-Adenauer-Ufer; the Rheinboulevard's great steps in Deutz), the
     Rheingarten over the riverside tunnel, Museum Ludwig behind the cathedral's choir, Groß St. Martin and the gabled houses of the
     Fischmarkt, the Musical Dome by Breslauer Platz, and on the far bank the Deutz towers.
   Original models throughout; real names appear only as place labels and street plates, no brand or logo is shown. */
var KOELN3D = (function () {
  var V3 = THREE.Vector3, H = null, KT = null, K = null, M = null, MT = null, MX = null;
  function init() { if (H) return; H = TPE3D.H; KT = H.kit(); K = H.K(); M = H.M(); MT = H.MT(); }
  function rnd(s) { return K.seeded(s); }
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  var FONT = '"Jost","Noto Sans TC","Helvetica Neue",Arial,' + (typeof KIT !== 'undefined' && KIT.FONT ? KIT.FONT : 'sans-serif');
  function bx(B, x0, x1, y0, y1, z0, z1, col) { H.bx(B, x0, x1, y0, y1, z0, z1, col); }
  function ubx(B, x0, x1, y0, y1, z0, z1, su, sv) { H.ubx(B, x0, x1, y0, y1, z0, z1, su, sv); }
  function flat(B, x0, x1, z0, z1, y, su, sv, down) { H.flat(B, x0, x1, z0, z1, y, su, sv, down); }
  function cylY(B, x, y0, y1, z, r, col, seg) { H.cylY(B, x, y0, y1, z, r, col, seg); }
  function inR(x, z, q, m) { m = m || 0; return x > q[0] - m && x < q[1] + m && z > q[2] - m && z < q[3] + m; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------------- the plan (local units of 1.2 m) ---------------- */
  var MAPX = [-192, 700], MAPZ = [-317, 282];
  var Y1 = 0.12, TY = 5.0, RAIL = 4.37, BED = 4.12, SLAB = 3.62, PROM = -5.0, WATER = -9.0;
  /* the cathedral: the west towers, the nave and its double aisles, the transept, the choir with its ambulatory and the crown of chapels */
  /* (V67) the plan on the cathedral's own grid: a bay of 7.5 m (6.25 units) along the church, the piers of the main arcade 15 m apart
     (the nave 12.5 m clear), two aisles either side (45.2 m across inside); the nave of four bays between the west towers and the
     transept, the transept of three aisles (the crossing in the middle), the choir of four bays and its apse of seven sides with the
     ambulatory and the crown of seven chapels. Heights: the floor a step over the Domplatte, the high vaults 43.35 m (36.1 units) with
     their springing at 25.3, the triforium from 19.75 m (16.46) to 21.3, the clerestory windows 17.8 m tall above it, the aisles' vaults
     18.7 m (15.6) springing at 10. */
  var DOM = { x0: -60.25, x1: 60.25, tw: [-60.25, -36.0], tz: 25.6, tg: 6.25, bay: 6.25, xW: -58.45,
    nave: [-36.0, -11.0], tr: [-11.0, 14.0], cr: [-4.75, 7.75], ch: [14.0, 39.0], ax: 39.0, zN: 6.25, zM: 12.5, zA: 18.75, zTw: 31.25, zT: 36.0,
    fl: 0.55, chF: 1.0, spA: 10.0, apA: 15.6, tri0: 16.46, tri1: 21.3, spN: 25.3, apN: 36.1,
    vault: 36.1, ridge: 50.9, aisle: 15.6, aisleR: 18.6, tower: 131.1, sq: 62.5, oct: 85.0, turret: 90.8 };
  var DOMPL = [-118, 76, -48, 46]; /* the Domplatte round it (its north part meets the Bahnhofsvorplatz) */
  var RONC = [-44, 96, 46, 96]; /* Roncalliplatz, south of the cathedral */
  var RGM = [14, 78, 54, 84]; /* the Roman-Germanic Museum on its south side */
  var VORPL = [-118, 30, -96, -48]; /* the Bahnhofsvorplatz */
  /* the Rhine: the quays (x), the lower promenades, the water between; the Rheingarten over the riverside tunnel south of the bridge */
  var QW = 292, QE = 596, LPR = [280, 292], RPR = [596, 612], RSTEP = [612, 628], RGART = [196, 262, 14, 282];
  /* the bridge: the west abutment, the two river piers, the east abutment; the deck on the cathedral's axis */
  var BRX = [252, 593], PIERS = [351.07, 490.86], BRZ = [-12.4, 12.4], DECK = [-9.6, 9.6], BRTRK = [-7.2, -4.4, -1.6, 1.6, 4.4, 7.2], ARCHZ = [-9.6, -3.0, 3.0, 9.6], FOOT = 4.6;
  /* the main station: the hall's middle, its axis (east-south-east), the half-length, the half-widths of the main span and the aisles */
  var HB = { cx: -16, cz: -110, th: Math.PI / 6, hl: 106, span: 26.7, aisle: 37.5 };
  var HA = [Math.cos(HB.th), Math.sin(HB.th)], HN = [-Math.sin(HB.th), Math.cos(HB.th)];
  /* the tracks across the hall (v: across the axis, + towards the cathedral) and the platforms between them */
  var HT = { 1: 29.2, 2: 25.45, 3: 14.5, 4: 10.75, 5: -0.2, 6: -3.95, 7: -14.9, 8: -18.65, 9: -29.6, 10: -33.35, 11: -44.3 };
  var HP = [[31.0, 37.0, [1]], [16.3, 23.65, [2, 3]], [1.6, 8.95, [4, 5]], [-13.1, -5.75, [6, 7]], [-27.8, -20.45, [8, 9]], [-42.5, -35.15, [10, 11]]];
  var HPASS = [[-10, 10], [48, 64]]; /* (stairs rise from inside them: each platform's stair foot 3 units in from the passage's west side) */ /* the two passages under the tracks (u ranges) */
  /* the streets: x ranges for the north–south ones, z ranges for the east–west ones */
  var RMZ = [-150, -140], RKO = [-66, -56], RMA = [-262, -252], RKA = [252, 266], RKE = [634, 648], ROT = [-60, -50];
  var TUN = 12; /* the riverside tunnel's mouth (z) on Konrad-Adenauer-Ufer, just south of the bridge */
  var INT = { J1: { x: RMZ, z: RKO, legs: 'NSW' }, J2: { x: RMZ, z: RMA, legs: 'NSE' }, J3: { x: RKA, z: RMA, legs: 'NSW' }, J5: { x: RKE, z: ROT, legs: 'NSE' } };
  var CWW = 4.0; /* a zebra crossing's width */
  /* the other places of the city */
  var LUD = [92, 196, 22, 84]; /* Museum Ludwig and the Philharmonie under Heinrich-Böll-Platz */
  var HBP = [92, 196, 4, 22]; /* Heinrich-Böll-Platz */
  var MDOME = [196, 240, -214, -168]; /* the Musical Dome */
  var BRES = [-6, 150, -232, -170]; /* Breslauer Platz (the bus station and the north entrance) */
  var GSM = { x: 206, z: 258 }; /* Groß St. Martin */
  var TRI = { x: 668, z: -82 }; /* the Deutz tower (an original tower on the plot by the station) */

  /* ---------------- the station's own frame: u along the tracks, v across them ---------------- */
  function hW(u, v) { return [HB.cx + u * HA[0] + v * HN[0], HB.cz + u * HA[1] + v * HN[1]]; }
  function hL(x, z) { var dx = x - HB.cx, dz = z - HB.cz; return [dx * HA[0] + dz * HA[1], dx * HN[0] + dz * HN[1]]; }
  /* a rectangle in the station's frame as world corners */
  function hRect(u0, u1, v0, v1) { return [hW(u0, v0), hW(u1, v0), hW(u1, v1), hW(u0, v1)]; }

  /* ---------------- turned rectangles into the engine's axis-aligned boxes ----------------
     The engine's floors, walks, colliders and camera boxes are axis-aligned. Anything turned (the station, the curve onto the bridge) is
     cut into strips along x; inside: only what the strip lies wholly within (floors and walks: no overhang), outside: all it touches
     (solids: no gap). Strips of `s` units. */
  function zRange(P, x) { var lo = 1e9, hi = -1e9, n = P.length, i; for (i = 0; i < n; i++) { var a = P[i], b = P[(i + 1) % n]; if ((a[0] - x) * (b[0] - x) > 0 && a[0] !== x && b[0] !== x) continue; if (Math.abs(b[0] - a[0]) < 1e-9) { lo = Math.min(lo, a[1], b[1]); hi = Math.max(hi, a[1], b[1]); continue; } var t = (x - a[0]) / (b[0] - a[0]); if (t < -1e-9 || t > 1 + 1e-9) continue; var z = a[1] + (b[1] - a[1]) * t; lo = Math.min(lo, z); hi = Math.max(hi, z); } return lo <= hi ? [lo, hi] : null; }
  function strips(P, s, inner) { var x0 = 1e9, x1 = -1e9, out = [], i; P.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); }); for (var xa = x0; xa < x1 - 1e-6; xa += s) { var xb = Math.min(x1, xa + s), A = zRange(P, xa + (inner ? 1e-4 : 0)), Bq = zRange(P, xb - (inner ? 1e-4 : 0)); if (!A || !Bq) continue;
      if (inner) { var lo = Math.max(A[0], Bq[0]), hi = Math.min(A[1], Bq[1]); if (hi - lo > 0.05) out.push([xa, xb, lo, hi]); }
      else { var lo2 = Math.min(A[0], Bq[0]), hi2 = Math.max(A[1], Bq[1]); P.forEach(function (p) { if (p[0] > xa && p[0] < xb) { lo2 = Math.min(lo2, p[1]); hi2 = Math.max(hi2, p[1]); } }); out.push([xa, xb, lo2, hi2]); } } return out; }

  /* ---------------- the curve of the tracks from the hall onto the bridge ----------------
     The bundle's middle line: along the hall's axis to its east end and on for a short straight, then a circular arc (radius 288 units,
     about 346 m) turning left onto the cathedral's axis, then straight east over the bridge to the map's edge. Westward it runs on along
     the hall's axis over its viaduct to the map's edge. Positions by arc length s (s = 0 at the hall's middle). */
  var CRV = (function () { var a0 = HB.hl + 36.8, R = 288, th = HB.th, p0 = hW(a0, 0), c = { a0: a0, R: R, p0: p0 };
    /* the arc's centre lies to the left of the heading (left of (cos h, sin h) is (sin h, -cos h): north of an eastward heading) */
    c.c = [p0[0] + Math.sin(th) * R, p0[1] - Math.cos(th) * R]; c.L = R * th; c.p1 = [c.c[0], c.c[1] + R]; return c; })();
  /* (x, z, heading) of the point s along the middle line, lat units to its right (the heading (cos h, sin h); right of it (-sin h, cos h)) */
  function trackAt(s, lat) { lat = lat || 0; var th = HB.th;
    if (s <= CRV.a0) { var p = hW(s, lat); return [p[0], p[1], th]; }
    if (s <= CRV.a0 + CRV.L) { var a = th - (s - CRV.a0) / CRV.R, r = CRV.R + lat; return [CRV.c[0] - r * Math.sin(a), CRV.c[1] + r * Math.cos(a), a]; }
    var d = s - CRV.a0 - CRV.L; return [CRV.p1[0] + d, CRV.p1[1] + lat, 0]; }
  /* the arc length along the middle line where a world x is reached (east of the hall) */
  function sAtX(x) { var lo = CRV.a0 - 300, hi = CRV.a0 + CRV.L + 600, k; for (k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (trackAt(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* ---------------- generated textures ---------------- */
  function tset(key, w, h, dc, dh, nk, o) { return KT.texSet('kln_' + key, w, h, dc, dh, nk, o); }
  function N(g, w, h, n, a, col, r0, r1, seed) { KT.noise(g, w, h, n, a, col, r0, r1, seed); }
  /* the cathedral's stone: ashlar courses of a grey-brown trachyte and sandstone, darkened by a century and a half of soot, washed paler
     in streaks and patches where the masons of the cathedral works have renewed it (one tile = 4 × 4 units) */
  function domStoneT() { return tset('dstone', 512, 512, function (g, w, h) { var r = rnd(9101), y, x; g.fillStyle = '#4c4944'; g.fillRect(0, 0, w, h);
      for (y = 0; y < 16; y++) { var ch = 32; x = -r() * 60; while (x < w) { var bw = 50 + r() * 70, t = r(), sh = 82 + t * 18 | 0; g.fillStyle = 'rgb(' + sh + ',' + (sh - 3) + ',' + (sh - 9) + ')'; g.fillRect(x + 1, y * ch + 1, bw - 2, ch - 2); if (r() < 0.06) { g.fillStyle = 'rgba(168,160,142,' + (0.14 + r() * 0.16) + ')'; g.fillRect(x + 1, y * ch + 1, bw - 2, ch - 2); } x += bw; } }
      N(g, w, h, 5000, 0.16, '#1c1b19', 0.6, 2.2, 9102); N(g, w, h, 1600, 0.08, '#a8a090', 0.6, 1.8, 9103);
      for (var k = 0; k < 26; k++) { var sx = r() * w, sw = 6 + r() * 30, gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(30,28,26,0.0)'); gr.addColorStop(0.3 + r() * 0.4, 'rgba(18,17,16,' + (0.14 + r() * 0.2) + ')'); gr.addColorStop(1, 'rgba(30,28,26,0.0)'); g.fillStyle = gr; g.fillRect(sx, 0, sw, h); }
      g.strokeStyle = 'rgba(40,38,34,0.42)'; g.lineWidth = 2; for (y = 0; y <= 16; y++) { g.beginPath(); g.moveTo(0, y * 32); g.lineTo(w, y * 32); g.stroke(); } },
    function (g, w, h) { var r = rnd(9104); g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, w, h); N(g, w, h, 3000, 0.25, '#6a6a6a', 0.8, 2.4, 9105); g.fillStyle = '#3a3a3a'; for (var y = 0; y <= 16; y++) g.fillRect(0, y * 32 - 2, w, 3); for (y = 0; y < 16; y++) { var x = -r() * 60; while (x < w) { var bw = 50 + r() * 70; g.fillRect(x, y * 32, 3, 32); x += bw; } } }, 2.2); }
  /* one bay of the cathedral's wall: a tall pointed window (two lancets under a rose of tracery), its glass dark by day, glowing by night;
     the stone round it; a blind arcade below (one tile = one bay, 6.6 × 13 units) */
  function domBayT(kind) { var em = cv(128, 256), eg = em.getContext('2d'); eg.fillStyle = '#000'; eg.fillRect(0, 0, 128, 256);
    var R = tset('dbay' + kind, 256, 512, function (g, w, h) { var r = rnd(9120 + kind); g.fillStyle = '#403d38'; g.fillRect(0, 0, w, h); N(g, w, h, 4000, 0.16, '#1e1d1a', 0.6, 2, 9121); N(g, w, h, 1200, 0.08, '#9a9282', 0.6, 1.6, 9122);
      for (var y = 0; y < h; y += 24) { g.fillStyle = 'rgba(30,28,25,0.35)'; g.fillRect(0, y, w, 2); }
      var x0 = 34, x1 = w - 34, top = kind === 2 ? 30 : 46, sp = kind === 2 ? 420 : 330, cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      function arch(g2, a, b, yt, yb) { var c2 = (a + b) / 2, rr = (b - a) * 0.8; g2.beginPath(); g2.moveTo(a, yb); g2.lineTo(a, yt + rr * 0.6); g2.arc(b - rr, yt + rr * 0.6, rr, Math.PI, Math.PI * 1.5 + 0.12, false); g2.arc(a + rr, yt + rr * 0.6, rr, Math.PI * 1.5 - 0.12, 0, false); g2.lineTo(b, yb); g2.closePath(); }
      /* the deep reveal, then the glass */ g.fillStyle = '#26241f'; arch(g, x0 - 10, x1 + 10, top - 10, sp + 10); g.fill(); var gl = g.createLinearGradient(0, top, 0, sp); gl.addColorStop(0, '#1d2632'); gl.addColorStop(1, '#141a22'); g.fillStyle = gl; arch(g, x0, x1, top, sp); g.fill();
      /* the glass's colour, faint: the panes of the medieval and later windows */ for (var k = 0; k < 220; k++) { var px = x0 + r() * (x1 - x0), py = top + 20 + r() * (sp - top - 20); g.fillStyle = ['rgba(120,40,40,.32)', 'rgba(40,70,140,.32)', 'rgba(150,120,50,.28)', 'rgba(40,110,80,.25)'][k % 4]; g.fillRect(px, py, 6, 9); }
      /* the tracery: the mullion, two lancets, the rose over them, the transom bars */ g.strokeStyle = '#57534b'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx, top + hw * 1.25); g.lineTo(cx, sp); g.stroke(); g.lineWidth = 3; arch(g, x0 + 4, cx - 3, top + hw * 1.05, sp); g.stroke(); arch(g, cx + 3, x1 - 4, top + hw * 1.05, sp); g.stroke();
      g.lineWidth = 4; g.beginPath(); g.arc(cx, top + hw * 0.72, hw * 0.46, 0, 7); g.stroke(); g.lineWidth = 2; for (var q = 0; q < 6; q++) { var a = q / 6 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(a) * hw * 0.24, top + hw * 0.72 + Math.sin(a) * hw * 0.24, hw * 0.2, 0, 7); g.stroke(); }
      g.lineWidth = 2; for (var yy = top + hw * 1.6; yy < sp; yy += 26) { g.beginPath(); g.moveTo(x0 + 2, yy); g.lineTo(x1 - 2, yy); g.stroke(); }
      /* the gable over the window (wimperg) and the blind arcade below */ if (kind !== 2) { g.strokeStyle = '#77736a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 - 16, top + 30); g.lineTo(cx, top - 40); g.lineTo(x1 + 16, top + 30); g.stroke(); }
      if (kind === 0) for (var b = 0; b < 4; b++) { var ax = 18 + b * 56; g.fillStyle = '#4c4943'; arch(g, ax, ax + 44, sp + 40, h - 16); g.fill(); g.strokeStyle = '#6c6860'; g.lineWidth = 2; arch(g, ax, ax + 44, sp + 40, h - 16); g.stroke(); }
      /* the night's glow behind the glass */ eg.fillStyle = '#c89a58'; eg.globalAlpha = 0.85; arch(eg, x0 / 2, x1 / 2, top / 2, sp / 2); eg.fill(); eg.globalAlpha = 1; },
    function (g, w, h) { g.fillStyle = '#7a7a7a'; g.fillRect(0, 0, w, h); N(g, w, h, 2000, 0.25, '#5a5a5a', 0.8, 2.2, 9123); }, 2.0);
    R.emi = KT.toTex(em); return R; }
  /* the spires' openwork: stone ribs and tracery round openings (alpha) for the octagonal pyramids and the gables' pinnacles */
  function spireT() { var c = cv(256, 512), g = c.getContext('2d'); g.clearRect(0, 0, 256, 512); var r = rnd(9131);
    g.fillStyle = '#5a5650'; g.fillRect(0, 0, 18, 512); g.fillRect(238, 0, 18, 512); for (var y = 0; y < 512; y += 64) { g.fillRect(0, y, 256, 10); var cx = 128, cy = y + 36; g.beginPath(); g.arc(cx, cy, 30, 0, 7); g.lineWidth = 9; g.strokeStyle = '#5a5650'; g.stroke(); g.beginPath(); g.moveTo(18, y + 10); g.lineTo(cx, cy); g.lineTo(238, y + 10); g.stroke(); g.beginPath(); g.moveTo(cx, cy + 30); g.lineTo(cx, y + 64); g.stroke(); }
    var d = g.getImageData(0, 0, 256, 512); for (var i = 0; i < d.data.length; i += 4) if (d.data[i + 3] > 0) { var t = r(); d.data[i] = 74 + t * 30; d.data[i + 1] = 71 + t * 28; d.data[i + 2] = 65 + t * 24; d.data[i + 3] = 255; } g.putImageData(d, 0, 0);
    var t = KT.toTex(c); t.wrapS = THREE.ClampToEdgeWrapping; return t; }
  /* the roofs of the cathedral: lead sheet in long bays, a dull blue-grey with paler seams */
  function leadT() { return tset('lead2', 256, 256, function (g, w, h) { g.fillStyle = '#585c5e'; g.fillRect(0, 0, w, h); for (var x = 0; x < w; x += 32) { g.fillStyle = 'rgba(150,152,150,0.3)'; g.fillRect(x, 0, 3, h); } N(g, w, h, 2000, 0.12, '#33363a', 0.6, 2, 9141); N(g, w, h, 800, 0.08, '#8c9090', 0.6, 2, 9142); }, function (g, w, h) { for (var x = 0; x < w; x += 32) { g.fillStyle = '#ffffff'; g.fillRect(x, 0, 4, h); } }, 1.4); }
  /* the Domplatte: big pale granite slabs in a running bond */
  function slabT() { return tset('slab', 256, 256, function (g, w, h) { var r = rnd(9151); for (var y = 0; y < 4; y++) for (var x = -1; x < 3; x++) { var t = r(), ox = (y % 2) * 64; g.fillStyle = 'rgb(' + (190 + t * 18 | 0) + ',' + (186 + t * 16 | 0) + ',' + (178 + t * 14 | 0) + ')'; g.fillRect(x * 128 + ox + 1, y * 64 + 1, 126, 62); }
      N(g, w, h, 5000, 0.12, '#6a665e', 0.4, 1.3, 9152); N(g, w, h, 1500, 0.1, '#ffffff', 0.4, 1.0, 9153); g.fillStyle = 'rgba(80,76,70,0.6)'; for (y = 0; y <= 4; y++) g.fillRect(0, y * 64 - 1, w, 2); for (y = 0; y < 4; y++) for (x = 0; x < 3; x++) g.fillRect(x * 128 + (y % 2) * 64 - 1, y * 64, 2, 64); },
    function (g, w, h) { g.fillStyle = '#303030'; for (var y = 0; y <= 4; y++) g.fillRect(0, y * 64 - 1, w, 3); for (y = 0; y < 4; y++) for (var x = 0; x < 3; x++) g.fillRect(x * 128 + (y % 2) * 64 - 1, y * 64, 3, 64); }, 0.8); }
  /* the pavements: grey concrete slabs of 30 cm with a strip of small basalt setts along the kerb (one tile = 2 × 2 units) */
  function walkT() { return tset('walk', 256, 256, function (g, w, h) { var r = rnd(9161); for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) { var t = r(); g.fillStyle = 'rgb(' + (156 + t * 22 | 0) + ',' + (154 + t * 20 | 0) + ',' + (150 + t * 18 | 0) + ')'; g.fillRect(x * 32 + 1, y * 32 + 1, 30, 30); }
      N(g, w, h, 4000, 0.12, '#55524c', 0.4, 1.2, 9162); for (var k = 0; k < 20; k++) { g.fillStyle = 'rgba(40,38,34,' + (0.05 + r() * 0.08) + ')'; g.beginPath(); g.arc(r() * w, r() * h, 3 + r() * 8, 0, 7); g.fill(); } },
    function (g, w, h) { g.fillStyle = '#404040'; for (var i = 0; i <= 8; i++) { g.fillRect(i * 32 - 1, 0, 2, h); g.fillRect(0, i * 32 - 1, w, 2); } }, 0.7); }
  /* the old town's setts: dark basalt cobbles in arcs (one tile = 2 × 2 units) */
  function settT() { return tset('sett', 256, 256, function (g, w, h) { var r = rnd(9171); g.fillStyle = '#3a3a3c'; g.fillRect(0, 0, w, h); for (var y = 0; y < 18; y++) for (var x = 0; x < 18; x++) { var t = r(), ox = (y % 2) * 7; g.fillStyle = 'rgb(' + (70 + t * 40 | 0) + ',' + (70 + t * 38 | 0) + ',' + (74 + t * 36 | 0) + ')'; g.beginPath(); g.ellipse(x * 14.2 + ox + 7, y * 14.2 + 7, 6.2, 6.0, r(), 0, 7); g.fill(); } N(g, w, h, 1500, 0.1, '#cfcfd4', 0.4, 1, 9172); },
    function (g, w, h) { g.fillStyle = '#202020'; g.fillRect(0, 0, w, h); for (var y = 0; y < 18; y++) for (var x = 0; x < 18; x++) { var ox = (y % 2) * 7, rg = g.createRadialGradient(x * 14.2 + ox + 7, y * 14.2 + 7, 0, x * 14.2 + ox + 7, y * 14.2 + 7, 7); rg.addColorStop(0, '#d0d0d0'); rg.addColorStop(1, '#303030'); g.fillStyle = rg; g.fillRect(x * 14.2 + ox, y * 14.2, 14.2, 14.2); } }, 2.4); }
  /* German facades: four floors of a block's face per tile — plaster in the city's quiet colours, white window frames, roller-shutter boxes,
     the odd balcony rail or a stone band (eight styles; the night lights some windows) */
  function deFacadeT(style) { var em = cv(256, 256), eg = em.getContext('2d'); eg.fillStyle = '#000'; eg.fillRect(0, 0, 256, 256);
    var R = tset('defac' + style, 512, 512, function (g, w, h) { var r = rnd(9200 + style * 13), base = ['#e2dccd', '#c9ccce', '#e7d6b6', '#d8c4b0', '#bfc3bd', '#ece8de', '#c8b49a', '#d6d9de'][style % 8]; g.fillStyle = base; g.fillRect(0, 0, w, h); N(g, w, h, 1800, 0.05, '#4a463e', 0.5, 2, 9201 + style);
      var cols = [5, 4, 6, 3, 5, 7, 4, 6][style % 8], rows = 4, cw = w / cols, rh = h / rows;
      if (style === 4 || style === 6) for (var b = 0; b < rows; b++) { g.fillStyle = 'rgba(120,110,96,0.35)'; g.fillRect(0, b * rh + rh - 10, w, 6); }
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { var ww = cw * (style === 5 ? 0.62 : 0.5), hh = rh * (style % 3 === 0 ? 0.6 : 0.55), x0 = x * cw + (cw - ww) / 2, y0 = y * rh + rh * 0.2;
        var lit = r() < 0.18; if (lit || r() < 0.2) { eg.fillStyle = lit ? '#fff2d0' : '#6a5a40'; eg.fillRect(x0 / 2, y0 / 2, ww / 2, hh / 2); }
        g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x0 - 4, y0 - 4, ww + 8, hh + 10); var gg = g.createLinearGradient(0, y0, 0, y0 + hh); gg.addColorStop(0, lit ? '#f4e4ba' : '#556676'); gg.addColorStop(1, lit ? '#d8bc80' : '#2e3a46'); g.fillStyle = gg; g.fillRect(x0, y0, ww, hh);
        /* the roller shutter's box over the window, now and then the shutter half down */ g.fillStyle = 'rgba(250,250,246,0.95)'; g.fillRect(x0 - 3, y0 - 9, ww + 6, 7); if (r() < 0.25) { var sd = hh * (0.2 + r() * 0.6); g.fillStyle = '#d8d6d0'; g.fillRect(x0, y0, ww, sd); g.fillStyle = 'rgba(120,118,110,0.6)'; for (var k = 0; k < sd; k += 4) g.fillRect(x0, y0 + k, ww, 1); }
        g.strokeStyle = '#f6f6f2'; g.lineWidth = 4; g.strokeRect(x0, y0, ww, hh); g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + ww / 2, y0); g.lineTo(x0 + ww / 2, y0 + hh); g.moveTo(x0, y0 + hh * 0.3); g.lineTo(x0 + ww, y0 + hh * 0.3); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + ww * 0.45, y0); g.lineTo(x0, y0 + hh * 0.55); g.fill(); g.fillStyle = 'rgba(120,116,108,0.9)'; g.fillRect(x0 - 5, y0 + hh, ww + 10, 5);
        if ((style === 1 || style === 7) && r() < 0.5) { g.fillStyle = 'rgba(60,62,64,0.85)'; g.fillRect(x0 - 6, y0 + hh * 0.62, ww + 12, 3); for (var bb = 0; bb < 7; bb++) g.fillRect(x0 - 6 + bb * (ww + 12) / 6, y0 + hh * 0.62, 2, hh * 0.38); g.fillRect(x0 - 6, y0 + hh - 2, ww + 12, 3); } } },
      function (g, w, h) { var cols = [5, 4, 6, 3, 5, 7, 4, 6][style % 8], cw = w / cols, rh = h / 4; for (var y = 0; y < 4; y++) for (var x = 0; x < cols; x++) { var ww = cw * (style === 5 ? 0.62 : 0.5), hh = rh * (style % 3 === 0 ? 0.6 : 0.55), x0 = x * cw + (cw - ww) / 2, y0 = y * rh + rh * 0.2; g.fillStyle = '#3a3a3a'; g.fillRect(x0, y0, ww, hh); g.fillStyle = '#c0c0c0'; g.fillRect(x0 - 3, y0 - 9, ww + 6, 7); g.fillStyle = '#a8a8a8'; g.fillRect(x0 - 5, y0 + hh, ww + 10, 5); } }, 1.6);
    R.emi = KT.toTex(em); return R; }
  /* the old town's narrow gabled houses (the Fischmarkt row): a white facade with windows and a shop below, tinted per house by its
     vertex colour (one tile = one house front, 6 × 14 units: the ground floor, three floors and the gable) */
  function gableT() { var em = cv(128, 256), eg = em.getContext('2d'); eg.fillStyle = '#000'; eg.fillRect(0, 0, 128, 256);
    var R = tset('gable', 256, 512, function (g, w, h) { var r = rnd(9251); g.fillStyle = '#f4f0e6'; g.fillRect(0, 0, w, h); N(g, w, h, 1500, 0.05, '#6a645a', 0.5, 2, 9252);
      for (var f = 0; f < 3; f++) for (var k = 0; k < 3; k++) { var x0 = 28 + k * 72, y0 = 120 + f * 96, ww = 40, hh = 58, lit = r() < 0.3; g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(x0 - 5, y0 - 5, ww + 10, hh + 10); var gg = g.createLinearGradient(0, y0, 0, y0 + hh); gg.addColorStop(0, lit ? '#f2dca8' : '#4c5e6c'); gg.addColorStop(1, lit ? '#d8b878' : '#283440'); g.fillStyle = gg; g.fillRect(x0, y0, ww, hh); g.strokeStyle = '#fbfbf8'; g.lineWidth = 4; g.strokeRect(x0, y0, ww, hh); g.beginPath(); g.moveTo(x0 + ww / 2, y0); g.lineTo(x0 + ww / 2, y0 + hh); g.stroke(); if (lit) { eg.fillStyle = '#ffe6b8'; eg.fillRect(x0 / 2, y0 / 2, ww / 2, hh / 2); } }
      /* the gable's little window, the shop below with its awning */ g.fillStyle = '#3a4652'; g.fillRect(108, 46, 40, 44); g.strokeStyle = '#fbfbf8'; g.lineWidth = 4; g.strokeRect(108, 46, 40, 44);
      g.fillStyle = '#2a2420'; g.fillRect(14, 420, 228, 92); var sg = g.createLinearGradient(0, 430, 0, 512); sg.addColorStop(0, '#f0d8a0'); sg.addColorStop(1, '#a87a48'); g.fillStyle = sg; g.fillRect(22, 434, 150, 70); g.fillStyle = '#4a3a2a'; g.fillRect(186, 434, 46, 78); eg.fillStyle = '#e8c890'; eg.fillRect(11, 217, 75, 35); },
      null, 1); R.emi = KT.toTex(em); return R; }
  /* the station's glass roof seen from below: panes between the steel purlins, the sky pale behind them */
  /* (V68) the hall's roof as restored in 1983–87: bands of clear glazing in slim frames (half of each 9.6 m) between bands of coated corrugated sheet */
  function hallRoofT() { return tset('hroof2', 256, 256, function (g, w, h) { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(214,226,234,0.42)'; g.fillRect(0, 0, w, h / 2); for (var y = 0; y < h / 2; y += 21) { g.fillStyle = 'rgba(70,80,86,1)'; g.fillRect(0, y, w, 3); } for (var x = 0; x < w; x += 64) { g.fillStyle = 'rgba(70,80,86,1)'; g.fillRect(x, 0, 4, h / 2); }
      g.fillStyle = '#8c9296'; g.fillRect(0, h / 2, w, h / 2); for (x = 0; x < w; x += 8) { g.fillStyle = 'rgba(40,46,50,0.35)'; g.fillRect(x, h / 2, 3, h / 2); g.fillStyle = 'rgba(230,236,240,0.25)'; g.fillRect(x + 4, h / 2, 2, h / 2); } g.fillStyle = 'rgba(60,66,70,1)'; g.fillRect(0, h / 2, w, 4); g.fillRect(0, h - 4, w, 4); N(g, w, h / 2, 400, 0.06, '#7a8a96', 1, 3, 9261); }, null, 1); }

  /* ---------------- materials ---------------- */
  function mats() { if (MX) return MX; init(); var LL = function (m) { return K.llights ? K.llights(m) : m; }, C = function (m) { return LL(K.curved(m)); }, S = function (m) { return LL(K.see(K.curved(m))); };
    function tm(t, o) { o = o || {}; var m = new THREE.MeshStandardMaterial({ map: t.map, normalMap: t.normalMap || null, normalScale: new THREE.Vector2(o.ns || 1, o.ns || 1), roughness: o.r == null ? 0.8 : o.r, metalness: o.m || 0, envMapIntensity: o.e == null ? 0.6 : o.e, vertexColors: !!o.vc }); if (o.emi) { m.emissive = new THREE.Color(o.ec || 0xffd8a0); m.emissiveMap = o.emi; m.emissiveIntensity = 0; } return o.see ? S(m) : C(m); }
    MX = {}; MX.dstone = tm(domStoneT(), { r: 0.86, e: 0.45, ns: 1.0, see: true }); MX.dstone.color.setHex(0x8f8a83); /* (V68) the weathered, soot-darkened stone; the masons' renewed stone is the same, unweathered: */ MX.dstoneR = tm(domStoneT(), { r: 0.84, e: 0.45, ns: 1.0, see: true }); MX.dstoneR.color.setHex(0xf2ece0);
    MX.dbay = []; for (var i = 0; i < 3; i++) { var bt = domBayT(i); MX.dbay.push(tm(bt, { r: 0.8, e: 0.5, see: true, emi: bt.emi, ec: 0xffc888 })); }
    MX.spire = S(new THREE.MeshStandardMaterial({ map: spireT(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85, envMapIntensity: 0.4 }));
    MX.lead = tm(leadT(), { r: 0.72, m: 0.2, e: 0.45, see: true }); MX.slab = tm(slabT(), { r: 0.62, e: 0.5 }); MX.walk = tm(walkT(), { r: 0.86, e: 0.35 }); MX.sett = tm(settT(), { r: 0.7, e: 0.45, ns: 1.2 });
    MX.fac = []; for (i = 0; i < 8; i++) { var ft = deFacadeT(i); MX.fac.push(tm(ft, { r: 0.78, m: 0.02, e: 0.6, see: true, emi: ft.emi, ec: 0xffd8a0 })); }
    var gt = gableT(); MX.gable = tm(gt, { r: 0.75, e: 0.5, see: true, emi: gt.emi, vc: true });
    MX.hroof = C(new THREE.MeshStandardMaterial({ map: hallRoofT().map, roughness: 0.35, metalness: 0.25, transparent: true, opacity: 1.0, side: THREE.DoubleSide, envMapIntensity: 1.1, depthWrite: true }));
    MX.water = null; /* made at build (it shares the sky's uniforms) */
    MX.neon = C(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })); natMats(MX, M); K.wind(MX.bark); return MX; }

  /* ---------------- the city's sign atlas: street plates, the station's and the museums' names, shops, the police, the bar ---------------- */
  var SA = null;
  function signs() { if (SA) return SA; init(); var A = K.Atlas(2048), C2 = {};
    function put(k, w, h, fn) { C2[k] = A.put(w, h, fn); }
    function txt(g, s, x, y, size, col, wt, al) { g.font = (wt || 700) + ' ' + size + 'px ' + FONT; g.fillStyle = col; g.textAlign = al || 'center'; g.textBaseline = 'middle'; g.fillText(s, x, y); }
    /* street-name plates: white, a thin black frame, the name in black (Köln's plates) */
    ['Komödienstraße', 'Marzellenstraße', 'An den Dominikanern', 'Machabäerstraße', 'Konrad-Adenauer-Ufer', 'Kennedy-Ufer', 'Ottoplatz', 'Trankgasse', 'Domkloster', 'Am Hof', 'Frankenwerft', 'Heinrich-Böll-Platz', 'Roncalliplatz', 'Breslauer Platz', 'Rheingarten', 'Bahnhofsvorplatz', 'Hohe Straße', 'Rheinboulevard'].forEach(function (s, i) {
      put('st' + i, 384, 80, function (g, w, h) { g.fillStyle = '#f8f8f4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1a1a1a'; g.lineWidth = 5; g.strokeRect(6, 6, w - 12, h - 12); txt(g, s, w / 2, h / 2 + 2, s.length > 16 ? 30 : 36, '#141414', 600); }); C2['st:' + s] = C2['st' + i]; });
    /* the station's name over the entrance hall (white letters on the glass front's dark band) and the platform numbers */
    put('hbf', 1024, 128, function (g, w, h) { g.fillStyle = '#20262c'; g.fillRect(0, 0, w, h); txt(g, 'Köln Hauptbahnhof', w / 2, h / 2 + 4, 76, '#ffffff', 700); });
    for (var gl = 1; gl <= 11; gl++) (function (n) { put('gl' + n, 128, 128, function (g, w, h) { g.fillStyle = '#1a3a8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.fillRect(8, 8, w - 16, h - 16); txt(g, String(n), w / 2, h / 2 + 4, 86, '#1a3a8a', 800); }); })(gl);
    put('gleis', 512, 96, function (g, w, h) { g.fillStyle = '#1a3a8a'; g.fillRect(0, 0, w, h); txt(g, 'Gleis  ·  Platform  ·  月台', w / 2, h / 2 + 3, 40, '#ffffff', 600); });
    put('reise', 512, 96, function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8102e'; g.fillRect(0, h - 12, w, 12); txt(g, 'Reisezentrum · Tickets', w / 2, h / 2 - 3, 42, '#20262c', 700); });
    put('info', 256, 96, function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); txt(g, 'i', 46, h / 2 + 2, 70, '#1a3a8a', 800); txt(g, 'Information', 156, h / 2 + 2, 30, '#20262c', 600); });
    put('ubahn', 128, 128, function (g, w, h) { g.fillStyle = '#1a4aa0'; g.fillRect(0, 0, w, h); txt(g, 'U', w / 2, h / 2 + 5, 100, '#ffffff', 800); });
    put('sbahn', 128, 128, function (g, w, h) { g.fillStyle = '#ffffff'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 4, 0, 7); g.fill(); g.fillStyle = '#1e8a3a'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 12, 0, 7); g.fill(); txt(g, 'S', w / 2, h / 2 + 5, 84, '#ffffff', 800); });
    /* the police: blue with white letters (as Germany's police signs) */ put('pol', 512, 96, function (g, w, h) { g.fillStyle = '#1e3f82'; g.fillRect(0, 0, w, h); txt(g, 'POLIZEI', w / 2, h / 2 + 3, 64, '#ffffff', 800); });
    /* the museums' and the hall's names as plates */ [['lud', 'MUSEUM LUDWIG'], ['rgm', 'RÖMISCH-GERMANISCHES MUSEUM'], ['mdome', 'MUSICAL DOME'], ['phil', 'PHILHARMONIE']].forEach(function (q) { put(q[0], 1024, 112, function (g, w, h) { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(30,32,36,0.92)'; g.fillRect(0, 0, w, h); txt(g, q[1], w / 2, h / 2 + 3, q[1].length > 18 ? 52 : 70, '#f2f2ee', 600); }); });
    /* the shops (made-up names): a bakery, a pharmacy, a kiosk ("Büdchen"), a brewery tavern, a bookshop, a café, a flower stall, a chocolatier */
    [['Bäckerei Hennes', '#a8521e', '#fff6e8'], ['Apotheke am Dom', '#d42020', '#ffffff'], ['Büdchen', '#1e5aa8', '#ffe34a'], ['Brauhaus Zum Alten Pegel', '#2a2420', '#e8c87a'], ['Buchhandlung Rhein', '#2a4a3a', '#f2ecd8'], ['Café Domblick', '#5a3a2a', '#f8eedc'], ['Blumen Marie', '#3a7a3a', '#ffffff'], ['Schokolade & Co.', '#4a2a1a', '#f0d8a8'], ['Reisebüro Tünnes', '#2a3a6a', '#ffffff'], ['Optik Schäl', '#20262c', '#ffffff'], ['Imbiss Halve Hahn', '#c8102e', '#ffffff'], ['Souvenirs Dom', '#6a2a6a', '#ffffff']].forEach(function (q, i) {
      put('shop' + i, 512, 96, function (g, w, h) { g.fillStyle = q[1]; g.fillRect(0, 0, w, h); txt(g, q[0], w / 2, h / 2 + 3, q[0].length > 18 ? 34 : 42, q[2], 700); }); });
    /* (V65) the shops' insides seen through their windows: a lit room in perspective (side walls, floor, the back wall with its shelves,
       the counter, ceiling lights), filled for its trade: a bakery, a pharmacy, a kiosk, a café, a bookshop, a florist */
    [0, 1, 2, 3, 4, 5].forEach(function (th) { put('shin' + th, 512, 200, function (g, w, h) { var R0 = 7 + th * 13, rn = function () { R0 = (R0 * 16807) % 2147483647; return R0 / 2147483647; };
      var wall = ['#f3e2c4', '#f4f6f4', '#f1ead9', '#e9d3b4', '#efe6d2', '#eef2e6'][th], wallD = ['#d9bf95', '#d9dedb', '#d6cdb6', '#c9a985', '#d2c6aa', '#cfd8c2'][th], floor = ['#b98a5a', '#cfd2d0', '#a9a39a', '#8a6446', '#9b7a58', '#a8a08a'][th];
      var bx0 = w * 0.16, bx1 = w * 0.84, by0 = h * 0.12, by1 = h * 0.74; /* the back wall */
      g.fillStyle = wallD; g.beginPath(); g.moveTo(0, 0); g.lineTo(bx0, by0); g.lineTo(bx0, by1); g.lineTo(0, h); g.closePath(); g.fill(); g.beginPath(); g.moveTo(w, 0); g.lineTo(bx1, by0); g.lineTo(bx1, by1); g.lineTo(w, h); g.closePath(); g.fill();
      g.fillStyle = '#fbf6ec'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(bx1, by0); g.lineTo(bx0, by0); g.closePath(); g.fill();
      g.fillStyle = floor; g.beginPath(); g.moveTo(0, h); g.lineTo(bx0, by1); g.lineTo(bx1, by1); g.lineTo(w, h); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 1; for (var fx = 0; fx <= 8; fx++) { g.beginPath(); g.moveTo(bx0 + (bx1 - bx0) * fx / 8, by1); g.lineTo(w * fx / 8, h); g.stroke(); }
      g.fillStyle = wall; g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      /* the ceiling lights */ for (var lx = 0; lx < 3; lx++) { var cx = w * (0.3 + lx * 0.2); var gr = g.createRadialGradient(cx, by0 * 0.5, 2, cx, by0 * 0.5, 40); gr.addColorStop(0, 'rgba(255,250,235,1)'); gr.addColorStop(1, 'rgba(255,250,235,0)'); g.fillStyle = gr; g.fillRect(cx - 40, 0, 80, by0 + 30); }
      /* the shelves along the back wall and what is on them */ var rows = 3, rh = (by1 - by0 - 18) / rows, cols = { 0: ['#c8853e', '#a8642a', '#e0a860', '#8a5228'], 1: ['#ffffff', '#3a9a5a', '#e8eef2', '#d0e4f0', '#f2c0c0'], 2: ['#d42a2a', '#2a6ad4', '#f2c230', '#2aa04a', '#f07a2a', '#7a3ad4'], 3: ['#6a4028', '#e8dcc8', '#a87048', '#3a2418'], 4: ['#8a2a2a', '#2a4a8a', '#2a6a3a', '#c8a03a', '#5a2a6a', '#3a3a3a', '#d06a2a'], 5: ['#3a8a3a', '#e84a6a', '#f2d23a', '#ffffff', '#7a3ab4', '#f07a3a'] }[th];
      for (var r = 0; r < rows; r++) { var y1 = by0 + 10 + (r + 1) * rh; g.fillStyle = 'rgba(90,70,50,0.55)'; g.fillRect(bx0 + 6, y1 - 3, bx1 - bx0 - 12, 4);
        for (var x = bx0 + 10; x < bx1 - 14;) { var iw = th === 4 ? 4 + rn() * 5 : th === 0 ? 16 + rn() * 10 : th === 5 ? 12 + rn() * 8 : 7 + rn() * 9, ih = th === 4 ? rh * (0.55 + rn() * 0.3) : th === 0 ? rh * (0.32 + rn() * 0.2) : rh * (0.4 + rn() * 0.35);
          g.fillStyle = cols[Math.floor(rn() * cols.length)]; if (th === 0 || th === 5) { g.beginPath(); g.ellipse(x + iw / 2, y1 - 3 - ih / 2, iw / 2, ih / 2, 0, 0, 7); g.fill(); } else g.fillRect(x, y1 - 3 - ih, iw - 1.5, ih); x += iw + (th === 4 ? 0.6 : 2); } }
      /* the trade's mark on the back wall */ if (th === 1) { g.fillStyle = '#2aa04a'; g.fillRect(w / 2 - 7, by0 + 2, 14, 30); g.fillRect(w / 2 - 15, by0 + 10, 30, 14); }
      /* the counter in front, its top lit */ g.fillStyle = ['#8a5a32', '#e8ecee', '#3a4250', '#5a3a24', '#6a4a30', '#7a6a4a'][th]; g.fillRect(w * 0.08, h * 0.74, w * 0.5, h * 0.26); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(w * 0.08, h * 0.74, w * 0.5, 4);
      if (th === 3) { g.fillStyle = '#c8c8cc'; g.fillRect(w * 0.14, h * 0.6, 34, 34); g.fillStyle = '#2a2a2e'; g.fillRect(w * 0.14 + 6, h * 0.6 + 8, 22, 12); [0.68, 0.82].forEach(function (tx) { g.fillStyle = '#5a3a24'; g.fillRect(w * tx - 18, h * 0.8, 36, 5); g.fillRect(w * tx - 2, h * 0.8, 4, 24); }); }
      if (th === 5) { for (var bq = 0; bq < 7; bq++) { var px = w * (0.64 + bq * 0.045), py = h * (0.8 + (bq % 2) * 0.04); g.fillStyle = '#7a5a3a'; g.fillRect(px - 7, py, 14, 18); g.fillStyle = cols[bq % cols.length]; g.beginPath(); g.arc(px, py - 4, 10, 0, 7); g.fill(); } }
      /* a soft vignette (the room's depth) */ var vg = g.createLinearGradient(0, 0, 0, h); vg.addColorStop(0, 'rgba(255,248,230,0.12)'); vg.addColorStop(1, 'rgba(40,30,20,0.18)'); g.fillStyle = vg; g.fillRect(0, 0, w, h); }); });
    /* the bar's neon over its door (an original word-mark: two lines of tube, magenta and cyan) */ put('bar', 1024, 160, function (g, w, h) { g.fillStyle = '#05060a'; g.fillRect(0, 0, w, h); g.shadowColor = '#ff3ab8'; g.shadowBlur = 24; txt(g, 'NO AFTERLIFE', w / 2, 62, 78, '#ff6ad0', 800); g.shadowColor = '#3af0ff'; txt(g, 'BAR · KÖLN · ALTSTADT', w / 2, 126, 34, '#7af6ff', 600); g.shadowBlur = 0; });
    /* the training sites' banners (SCHOMBURG red; the six guides) */ ['inj', 'cr', 'wp', 'rc', 'ca', 'pf'].forEach(function (k, i) { put('tr' + k, 512, 128, function (g, w, h) { g.fillStyle = '#e3000f'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.fillRect(0, h - 22, w, 22); txt(g, 'SCHOMBURG', w / 2, 42, 50, '#ffffff', 800); txt(g, ['Rissinjektion · Crack injection', 'Betoninstandsetzung · Concrete repair', 'Mineralische Abdichtung · Waterproofing', 'Nachträgliche Abdichtung · Retrofit', 'Betontechnologie · Crystalline admixture', 'Bodenbeschichtung · Floor coatings'][i], w / 2, 86, 26, '#ffffff', 600); txt(g, 'Trainingsplatz · Training site', w / 2, h - 11, 16, '#e3000f', 700); }); });
    put('trhq', 1024, 128, function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#e3000f'; g.fillRect(0, 0, 24, h); txt(g, 'SCHOMBURG  ·  Trainingszentrum Köln', w / 2 + 12, h / 2 + 3, 54, '#20262c', 700); });
    put('gs', 512, 128, function (g, w, h) { g.fillStyle = '#20262c'; g.fillRect(0, 0, w, h); txt(g, 'Good Startup', w / 2, 52, 58, '#ffffff', 800); txt(g, '好時新創 · Taiwan', w / 2, 100, 28, '#ffb84a', 600); });
    /* the play's places: the Brauhaus, the Büdchen, the tower climb, the fountain's plaque, the right bank's DLC booth */
    put('brau', 1024, 160, function (g, w, h) { g.fillStyle = '#2a1a10'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c89a4a'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); txt(g, 'Brauhaus Heinzelstube', w / 2, 66, 64, '#f2d8a0', 700); txt(g, 'Kölsch vom Fass · seit 1894', w / 2, 122, 32, '#c89a4a', 600); });
    put('kiosk', 512, 96, function (g, w, h) { g.fillStyle = '#f2c230'; g.fillRect(0, 0, w, h); txt(g, 'BÜDCHEN · KIOSK', w / 2, h / 2 + 3, 50, '#1a1a1a', 800); });
    put('turm', 512, 128, function (g, w, h) { g.fillStyle = '#20262c'; g.fillRect(0, 0, w, h); txt(g, 'Turmbesteigung', w / 2, 50, 50, '#ffffff', 700); txt(g, '533 Stufen · 97 m · Tower climb', w / 2, 100, 28, '#d8c8a8', 600); });
    put('heinz', 512, 128, function (g, w, h) { g.fillStyle = '#3a4a3a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c8b070'; g.lineWidth = 5; g.strokeRect(8, 8, w - 16, h - 16); txt(g, 'Heinzelmännchen', w / 2, 54, 52, '#f0e0b0', 700); txt(g, 'Wie war zu Cölln es doch vordem …', w / 2, 100, 26, '#d8c890', 500); });
    put('dlc', 512, 128, function (g, w, h) { g.fillStyle = '#101418'; g.fillRect(0, 0, w, h); txt(g, 'SCHÄL SICK', w / 2, 54, 60, '#3af0ff', 800); txt(g, 'DLC · Download hier!', w / 2, 102, 30, '#ff6ad0', 700); });
    put('hall', 512, 128, function (g, w, h) { g.fillStyle = '#1a1c24'; g.fillRect(0, 0, w, h); txt(g, 'DOJO AM RHEIN', w / 2, 52, 56, '#ffffff', 800); txt(g, 'Gasthalle · Guest hall', w / 2, 100, 28, '#ff9a4a', 600); });
    SA = { A: A, tex: A.texture(), c: C2 }; return SA; }
  function sUV(k) { var r = signs().c[k]; return r ? { u0: r.u0, u1: r.u1, v0: r.v0, v1: r.v1 } : { u0: 0, u1: 0.001, v0: 0, v1: 0.001 }; }
  /* a sign quad from the atlas (w × h units, facing ry) into a uv batch */
  function signQ(B, key, w, h, x, y, z, ry) { B.add(new THREE.PlaneGeometry(w, h), { p: [x, y, z], r: [0, ry || 0, 0] }, 0xffffff, { uvRect: sUV(key) }); }
