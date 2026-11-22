
/* ===== (V89) The hands-on simulators as guided jobsites at true scale (SiteSim) =====
   Up to V88 the simulators were exercises in aiming: pick the right tool from a row of nine, keep the pointer on a ring that moves with
   the work, brush whole walls by hand and hunt for the missed spots, turn the view to find the next place of work. A training on a jobsite
   is for the order of the work and for the details that get lost. So:
   - the scene is the jobsite at 1 : 1, in metres: wall and slab thicknesses, the construction joints and the kicker, the formwork's panel
     joints and tie holes, the reinforcement and its cover where the structure is cut open, the excavation, the garage bay;
   - every step frames its own work: the camera goes there by itself and the tool is in the man's hands; the visitor holds one button (or
     the space bar, or a finger on the picture) and the crew works along the right path — let go and they pause;
   - a coat first asks for its consumption (the figure of the data sheet), then goes on in lanes with the gauge in kg/m²;
   - each step names its key details, shows the dimensions on the work itself and a section drawn to scale.
   Mixing, pot life, waiting times, quizzes and dosing come from the configurations of HandsOn (HSIMS); the scenes and the guidance of each
   step from HSITES (hsite_scenes.js). Strings: HS2_T (generic), the configurations' own t, and HSITES' texts (zh / en / de). */
var HS2_T = {
  zh: { introNote: '畫面上標示的是實際尺寸；右上「剖面詳圖」可看比例剖面。', introH: '工地現況', introGo: '開始第一步', hold: '按住施作', holdNo: '請先完成上方面板', paused: '放開即暫停，再按住繼續', keys: '關鍵細節', detail: '剖面詳圖', show: '剖面詳圖', hide: '收合',
    rateH: '這一道用多少？', rateQ: '依技術資料表，{P} 這一道的用量約為：', rateOk: '正確。', rateBad: '不對——技術資料表約為 {t} kg/m²。', applying: '按住施作——班組依序塗布', gauge: '已塗布 {k} / 約 {t} kg/m²',
    tool: '工具', look: '拖曳可環顧四周，放開後回到工作視角', play: '施作中…', done: '完成', back: '回到工作視角', scale: '比例',
    keysDesk: [['按住按鈕或空白鍵', '班組沿正確路徑施作；放開即暫停'], ['在畫面上按住', '同上；拖曳則環顧四周，放開後自動回到工作視角'], ['滾輪／按鈕', '縮放'], ['D', '剖面詳圖'], ['M', '聲音開／關'], ['Esc', '離開']],
    keysTouch: [['按住「按住施作」', '班組沿正確路徑施作；放開即暫停'], ['拖曳畫面', '環顧四周——放開後自動回到工作視角'], ['雙指／按鈕', '縮放'], ['剖面詳圖', '每一步的構造與尺寸']] },
  en: { introNote: 'The marks show the real dimensions; "Section to scale" at the top right opens the drawing.', introH: 'The site', introGo: 'Start the first step', hold: 'Hold to work', holdNo: 'Finish the panel above first', paused: 'Let go to pause, hold again to go on', keys: 'Key details', detail: 'Section to scale', show: 'Section to scale', hide: 'Close',
    rateH: 'How much for this coat?', rateQ: 'By the data sheet, this coat of {P} needs approx.:', rateOk: 'Correct.', rateBad: 'Not quite — the data sheet gives approx. {t} kg/m².', applying: 'Hold to work — the crew applies the coat lane by lane', gauge: 'Applied {k} / approx. {t} kg/m²',
    tool: 'Tool', look: 'Drag to look around; let go and the view returns to the work', play: 'Working…', done: 'Done', back: 'Back to the work', scale: 'Scale',
    keysDesk: [['Hold the button or the space bar', 'the crew works along the right path; let go to pause'], ['Hold on the picture', 'the same; drag to look around — the view returns to the work by itself'], ['Wheel / buttons', 'zoom'], ['D', 'section to scale'], ['M', 'sound on / off'], ['Esc', 'exit']],
    keysTouch: [['Hold "Hold to work"', 'the crew works along the right path; let go to pause'], ['Drag the picture', 'look around — the view returns to the work by itself'], ['Pinch / buttons', 'zoom'], ['Section to scale', 'the build-up and dimensions of every step']] },
  de: { introNote: 'Die Marken zeigen die echten Maße; „Schnitt maßstäblich“ oben rechts öffnet die Zeichnung.', introH: 'Die Baustelle', introGo: 'Ersten Schritt beginnen', hold: 'Gedrückt halten', holdNo: 'Erst das Feld oben abschließen', paused: 'Loslassen = Pause, erneut halten = weiter', keys: 'Wichtige Details', detail: 'Schnitt maßstäblich', show: 'Schnitt maßstäblich', hide: 'Schließen',
    rateH: 'Wie viel für diese Lage?', rateQ: 'Laut Merkblatt braucht diese Lage {P} ca.:', rateOk: 'Richtig.', rateBad: 'Nicht ganz — das Merkblatt nennt ca. {t} kg/m².', applying: 'Gedrückt halten — die Kolonne trägt Bahn für Bahn auf', gauge: 'Aufgetragen {k} / ca. {t} kg/m²',
    tool: 'Werkzeug', look: 'Ziehen zum Umsehen; beim Loslassen kehrt die Ansicht zur Arbeit zurück', play: 'Arbeit läuft …', done: 'Fertig', back: 'Zurück zur Arbeit', scale: 'Maßstab',
    keysDesk: [['Knopf oder Leertaste gedrückt halten', 'die Kolonne arbeitet auf dem richtigen Weg; loslassen = Pause'], ['Auf dem Bild gedrückt halten', 'ebenso; ziehen zum Umsehen — die Ansicht kehrt von selbst zurück'], ['Mausrad / Knöpfe', 'Zoom'], ['D', 'Schnitt maßstäblich'], ['M', 'Ton an / aus'], ['Esc', 'Beenden']],
    keysTouch: [['„Gedrückt halten“ halten', 'die Kolonne arbeitet auf dem richtigen Weg; loslassen = Pause'], ['Bild ziehen', 'umsehen — die Ansicht kehrt von selbst zurück'], ['Zwei Finger / Knöpfe', 'Zoom'], ['Schnitt maßstäblich', 'Aufbau und Maße jedes Schritts']] }
};
var HSITES = {}; /* the scenes and the guidance of each step, per simulator (hsite_scenes.js) */

/* ----- the structural kit: true-scale geometry in metres, materials with world-scaled textures, reinforcement, reveal layers ----- */
var SK = (function () {
  var V3 = THREE.Vector3;
  function Kit(keep, root) {
    var self = this, cache = {};
    function k(o) { keep.push(o); return o; }
    this.keep = k;
    function std(o) { return k(new THREE.MeshStandardMaterial(o)); }
    this.std = std;
    function tex(key, fn, o) { var id = key + JSON.stringify(o || {}); if (!cache[id]) cache[id] = k(canvasTex(fn(), o)); return cache[id]; }
    var RW = THREE.RepeatWrapping;
    /* materials. Texture sizes: the formed face is one panel of 2.0 × 1.5 m; the aggregate (sawn or broken concrete) 0.5 m; soil 1 m */
    var F = TEX.formed();
    this.M = {
      formed: std({ map: tex('formed', function () { return F.base; }, { wrap: RW }), bumpMap: tex('formedB', function () { return WPTX.softBump(F.bump); }, { wrap: RW, srgb: false }), bumpScale: 0.0016, roughness: 0.92, envMapIntensity: 0.35 }),
      slab: std({ map: tex('slab', function () { return TEX.slab(); }, { wrap: RW }), roughness: 0.9, envMapIntensity: 0.35 }),
      cut: std({ map: tex('agg', function () { return TEX.aggregate(); }, { wrap: RW }), roughness: 0.88, envMapIntensity: 0.3 }),
      blind: std({ color: 0x8f8b84, map: tex('agg2', function () { return TEX.aggregate(); }, { wrap: RW }), roughness: 0.95, envMapIntensity: 0.2 }),
      soil: std({ map: tex('soil', function () { return CRTX.soil; }, { wrap: RW }), roughness: 1, envMapIntensity: 0.1 }),
      gravel: std({ color: 0x9a948a, map: tex('agg3', function () { return TEX.aggregate(); }, { wrap: RW }), roughness: 1, envMapIntensity: 0.1 }),
      rebar: std({ color: 0x5d5a55, metalness: mt(0.55), roughness: 0.55, envMapIntensity: 0.6 }),
      rust: std({ color: 0x8a4a22, map: tex('rust', function () { return CRTX.rust; }, { wrap: RW }), roughness: 0.95, metalness: mt(0.1), envMapIntensity: 0.3 }),
      bright: std({ color: 0xb9bcc0, metalness: mt(0.85), roughness: 0.38, envMapIntensity: 1 }),
      wood: std({ color: 0xb98a55, roughness: 0.8, envMapIntensity: 0.3 }),
      ply: std({ color: 0xc9a66b, roughness: 0.75, envMapIntensity: 0.3 }),
      formFace: std({ color: 0xd9c38f, roughness: 0.55, envMapIntensity: 0.4 }),
      frame: std({ color: 0xd8a11c, metalness: mt(0.3), roughness: 0.5, envMapIntensity: 0.6 }),
      steelGrey: std({ color: 0x8d9298, metalness: mt(0.6), roughness: 0.45, envMapIntensity: 0.7 }),
      dark: std({ color: 0x2b2d30, roughness: 0.6 }),
      water: std({ color: 0x2a86b8, transparent: true, opacity: 0.45, roughness: 0.08, metalness: 0, envMapIntensity: 1.2, depthWrite: false }),
      plug: std({ color: 0x9c9a94, roughness: 0.85 }),
      lime: std({ color: 0xf1efe8, transparent: true, opacity: 0.85, roughness: 0.95, depthWrite: false }),
      damp: std({ color: 0x3a3833, transparent: true, opacity: 0.32, roughness: 0.6, depthWrite: false }),
      paint: std({ color: 0xe7e4dc, roughness: 0.85, envMapIntensity: 0.3 }),
      ceiling: std({ color: 0xbdbab3, roughness: 0.95, envMapIntensity: 0.2 })
    };
    var M = this.M;
    this.TS = { formed: [2.0, 1.5], slab: [2.0, 2.0], cut: [0.5, 0.5], blind: [0.6, 0.6], soil: [1.2, 1.2], gravel: [0.6, 0.6], rust: [0.3, 0.3] };
    function tsOf(m) { var key; for (key in M) if (M[key] === m) return self.TS[key] || null; return null; }
    /* a box from x0…x1, y0…y1, z0…z1. Texture coordinates follow the world (planar, per face direction, at the material's true tile size; o.ox, o.oy, o.oz
       shift the grid — the formwork's panel joints), so pieces of one wall built around an opening carry on without a seam */
    this.box = function (x0, x1, y0, y1, z0, z1, m, o) { o = o || {}; var w = x1 - x0, h = y1 - y0, d = z1 - z0, g = new THREE.BoxGeometry(w, h, d), ts = o.ts || tsOf(m), uv = g.attributes.uv, pos = g.attributes.position, nor = g.attributes.normal, i, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, cz = (z0 + z1) / 2, ox = o.ox || 0, oy = o.oy || 0, oz = o.oz || 0;
      if (ts) for (i = 0; i < pos.count; i++) { var X = pos.getX(i) + cx - ox, Y = pos.getY(i) + cy - oy, Z = pos.getZ(i) + cz - oz; if (Math.abs(nor.getZ(i)) > 0.5) uv.setXY(i, X / ts[0], Y / ts[1]); else if (Math.abs(nor.getX(i)) > 0.5) uv.setXY(i, Z / ts[0], Y / ts[1]); else uv.setXY(i, X / ts[0], Z / ts[1]); }
      var me = new THREE.Mesh(k(g), m); me.position.set(cx, cy, cz); me.castShadow = o.cast !== false; me.receiveShadow = true; (o.parent || root).add(me); return me; };
    /* a flat rectangle on a face: 'z' (normal +z, x × y), 'x' (normal −x, z × y: a right-hand wall seen from the room), 'y' (normal +y, x × z), 'X' (normal +x),
       'Z' (normal −z). Texture coordinates as the boxes' (world), or 0…1 over the rectangle (o.uv01) */
    this.plane = function (kind, a0, a1, b0, b1, c, m, o) { o = o || {}; var w = a1 - a0, h = b1 - b0, g = new THREE.PlaneGeometry(w, h), ts = o.ts || tsOf(m), uv = g.attributes.uv, i, ra = kind === 'X' || kind === 'Z', rb = kind === 'y';
      if (!o.uv01 && ts) for (i = 0; i < uv.count; i++) { var U = uv.getX(i), Vv = uv.getY(i); uv.setXY(i, ((ra ? a1 - U * w : a0 + U * w) - (o.ox || 0)) / ts[0], ((rb ? b1 - Vv * h : b0 + Vv * h) - (o.oy || 0)) / ts[1]); }
      var me = new THREE.Mesh(k(g), m); if (kind === 'z' || kind === 'Z') { me.rotation.y = kind === 'Z' ? Math.PI : 0; me.position.set((a0 + a1) / 2, (b0 + b1) / 2, c); } else if (kind === 'x' || kind === 'X') { me.rotation.y = kind === 'x' ? -Math.PI / 2 : Math.PI / 2; me.position.set(c, (b0 + b1) / 2, (a0 + a1) / 2); } else { me.rotation.x = -Math.PI / 2; me.position.set((a0 + a1) / 2, c, (b0 + b1) / 2); }
      me.receiveShadow = true; me.castShadow = !!o.cast; (o.parent || root).add(me); return me; };
    /* straight reinforcing bars: one instanced mesh per diameter. bars: [[x0, y0, z0, x1, y1, z1], …] */
    this.bars = function (d, list, m, o) { o = o || {}; var g = k(new THREE.CylinderGeometry(d / 2, d / 2, 1, o.seg || 8, 1)), im = new THREE.InstancedMesh(g, m || M.rebar, list.length), M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new V3(), Sc = new V3(), A = new V3(), B = new V3(), Y = new V3(0, 1, 0);
      list.forEach(function (b, i) { A.set(b[0], b[1], b[2]); B.set(b[3], b[4], b[5]); P.copy(A).add(B).multiplyScalar(0.5); var dir = B.clone().sub(A), len = dir.length(); Q.setFromUnitVectors(Y, dir.normalize()); Sc.set(1, len, 1); M4.compose(P, Q, Sc); im.setMatrixAt(i, M4); });
      im.castShadow = true; im.receiveShadow = true; (o.parent || root).add(im); return im; };
    /* a dimension line between two points, drawn over everything (with end ticks); its label is the engine's (marks) */
    this.dimLine = function (a, b, o) { o = o || {}; var A = new V3(a[0], a[1], a[2]), B = new V3(b[0], b[1], b[2]), dir = B.clone().sub(A).normalize(), n = new V3(o.tick ? o.tick[0] : 0, o.tick ? o.tick[1] : 0, o.tick ? o.tick[2] : 1), t = 0.03, pts = [A, B, A.clone().addScaledVector(n, t).addScaledVector(dir, t * 0.6), A.clone().addScaledVector(n, -t).addScaledVector(dir, -t * 0.6), B.clone().addScaledVector(n, t).addScaledVector(dir, t * 0.6), B.clone().addScaledVector(n, -t).addScaledVector(dir, -t * 0.6)];
      var g = k(new THREE.BufferGeometry().setFromPoints(pts)), mm = k(new THREE.LineBasicMaterial({ color: o.color || 0xffd24a, depthTest: false, transparent: true })), ln = new THREE.LineSegments(g, mm); ln.renderOrder = 999; (o.parent || root).add(ln); return ln; };
  }
  /* a layer that appears as the work goes on: a plane on a face whose alpha follows an order map (0…1, the moment each point is reached);
     set(t) shows what is done by t (o.inv: what is not yet done — the old paint that the jet takes off). The order comes from the same path the tool
     follows, so the coat appears where the man works. o.map (a canvas) with o.rep: the coat's own surface, repeated at its true size; the mask is read
     at the plane's own 0…1 coordinates (CRPrepKit.rawAlpha) whatever the repeat of the map. */
  function Layer(kit, kind, a0, a1, b0, b1, c, m, order, o) {
    o = o || {}; var res = o.res || 64, W = Math.max(8, Math.round((a1 - a0) * res)), Hh = Math.max(8, Math.round((b1 - b0) * res)), cv = mkCanvas(W, Hh), g = cv.getContext('2d'), img = g.createImageData(W, Hh), ord = new Float32Array(W * Hh), i, j;
    var ra = kind === 'X' || kind === 'Z', rb = kind === 'y';
    for (j = 0; j < Hh; j++) for (i = 0; i < W; i++) { var a = ra ? a1 - (i + 0.5) / W * (a1 - a0) : a0 + (i + 0.5) / W * (a1 - a0), b = rb ? b0 + (j + 0.5) / Hh * (b1 - b0) : b1 - (j + 0.5) / Hh * (b1 - b0); ord[j * W + i] = order(a, b); }
    var at = kit.keep(new THREE.CanvasTexture(cv)), mt2 = m.clone(); kit.keep(mt2); mt2.alphaMap = at; mt2.transparent = true; mt2.alphaTest = o.alphaTest != null ? o.alphaTest : 0.5; mt2.depthWrite = o.alphaTest == null || o.alphaTest >= 0.5; mt2.polygonOffset = true; mt2.polygonOffsetFactor = -1 - (o.lift || 1); mt2.polygonOffsetUnits = -2 - 2 * (o.lift || 1);
    if (o.map) { var mp = kit.keep(canvasTex(o.map, { wrap: THREE.RepeatWrapping, repeat: o.rep || [1, 1] })); mt2.map = mp; }
    if (typeof CRPrepKit !== 'undefined') CRPrepKit.rawAlpha(mt2);
    var me = kit.plane(kind, a0, a1, b0, b1, c, mt2, { uv01: true, parent: o.parent }); me.castShadow = false; me.renderOrder = o.order || 1; var lastT = -1, inv = !!o.inv;
    this.mesh = me; this.mat = mt2;
    this.set = function (t) { if (Math.abs(t - lastT) < 0.002 && !(t >= 1 && lastT < 1) && !(t <= 0 && lastT > 0)) return; lastT = t; var d = img.data, n = W * Hh, q; for (q = 0; q < n; q++) { var on = (inv ? ord[q] >= t : ord[q] < t) ? 255 : 0; d[q * 4] = d[q * 4 + 1] = d[q * 4 + 2] = on; d[q * 4 + 3] = 255; } g.putImageData(img, 0, 0); at.needsUpdate = true; me.visible = inv ? t < 1 : t > 0; };
    this.set(0); if (inv) { lastT = -1; this.set(0); }
  }
  /* the order of a lane-by-lane raster over a rectangle: lanes along b (columns, worked from b1 down to b0 — a wall from the top) or along a
     (rows); `noise` frays the front so the edge of the work reads as worked, not as a ruler line */
  function lanes(a0, a1, b0, b1, n, alongB, fromTop, noise) {
    function ord(a, b) { var u = alongB ? (a - a0) / (a1 - a0) : (fromTop ? (b1 - b) : (b - b0)) / (b1 - b0), v = alongB ? (fromTop ? (b1 - b) / (b1 - b0) : (b - b0) / (b1 - b0)) : (a - a0) / (a1 - a0), k2 = Math.min(n - 1, Math.max(0, Math.floor(u * n))), f = v; if (!alongB && k2 % 2 === 1) f = 1 - v; var o2 = (k2 + Math.max(0, Math.min(1, f))) / n; if (noise) o2 += (SK.hash(Math.floor(a * 40), Math.floor(b * 40), 3) - 0.5) * noise; return Math.max(0.0005, Math.min(0.9995, o2)); }
    function at(t) { t = Math.max(0, Math.min(0.99999, t)); var k2 = Math.floor(t * n), f = t * n - k2, uC = (k2 + 0.5) / n, a, b; if (alongB) { a = a0 + uC * (a1 - a0); b = fromTop ? b1 - f * (b1 - b0) : b0 + f * (b1 - b0); } else { var v = k2 % 2 === 1 ? 1 - f : f; a = a0 + v * (a1 - a0); b = fromTop ? b1 - uC * (b1 - b0) : b0 + uC * (b1 - b0); } return { a: a, b: b, lane: k2, f: f }; }
    return { order: ord, at: at, n: n };
  }
  /* along a polyline (a joint, a cove, an edge): order = the length reached */
  function along(pts) { var segs = [], tot = 0, i; for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], (pts[i][2] || 0) - (pts[i - 1][2] || 0)); segs.push({ a: pts[i - 1], b: pts[i], s: tot, l: l }); tot += l; }
    return { total: tot, at: function (t) { var s = Math.max(0, Math.min(1, t)) * tot, j; for (j = 0; j < segs.length; j++) { var e = segs[j]; if (s <= e.s + e.l + 1e-9 || j === segs.length - 1) { var f = e.l ? Math.max(0, Math.min(1, (s - e.s) / e.l)) : 0; return [e.a[0] + (e.b[0] - e.a[0]) * f, e.a[1] + (e.b[1] - e.a[1]) * f, (e.a[2] || 0) + ((e.b[2] || 0) - (e.a[2] || 0)) * f, j, f]; } } return pts[0]; } }; }
  function hash(i, j, s) { var q = Math.imul(i + 11, 374761393) + Math.imul(j + 7, 668265263) + Math.imul(s + 3, 1442695041) | 0; q = Math.imul(q ^ (q >>> 13), 1274126177); q ^= q >>> 16; return (q >>> 0) / 4294967296; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function seg(t, a, b) { return t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a); } /* the part of t between a and b, as 0…1 */
  return { Kit: Kit, Layer: Layer, lanes: lanes, along: along, hash: hash, ease: ease, seg: seg };
})();

/* ----- the engine ----- */
function SiteSim(cat, cfg, site) {
  var self = this, root = document.getElementById('hsim'), el = {}, host = null, canvas = null, R = null, scene = null, cam = null, gov = null, H = null, keep = [];
  var raf = 0, open = false, last = 0, opener = null, S = null, RATE = 20, V3 = THREE.Vector3, PTR = {}, pinch = null;
  var COARSE = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  function L() { return HS2_T[LANG] || HS2_T.en; } function L0() { return HSIM_T[LANG] || HSIM_T.en; } function T() { return cfg.t[LANG] || cfg.t.en; }
  function ph() { return cfg.phases[S.phase]; } function PT() { return T().phases[S.phase]; } function G() { if (S && S.introOn && site.intro) return site.intro; return (site.ph && site.ph[ph().id]) || {}; }
  function mat(k) { return cfg.mats[k]; } function MT(k) { var m = mat(k); return m.t[LANG] || m.t.en; }
  function tx(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[LANG] != null ? o[LANG] : (o.en != null ? o.en : ''); }
  function E(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function clock() { var h = S.clock, d = Math.floor(h / 24) + 1, hh = Math.floor(h % 24), mm = Math.floor((h % 1) * 60); return (LANG === 'zh' ? '第 ' + d + ' 天 · ' : L0().day + ' ' + d + ' · ') + ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2); }
  function fmtH(h) { var l = L0(); return h >= 24 ? (Math.round(h / 24 * 10) / 10) + ' ' + l.days : (Math.round(h * 10) / 10) + ' ' + l.hours; }
  function needsOf(p) { return !p.needs ? [] : typeof p.needs === 'string' ? [p.needs] : p.needs; }
  function toolIdx(p) { var t = p.tool; return t == null ? -1 : (t.length != null ? t[0] : t); }
  function toolName(p) { var i = toolIdx(p), tt = T().tools; return i >= 0 && i < tt.length ? tt[i] : ''; }
  function snd(name, arg) { if (HASA) HSA.event(name, arg); }
  function sndFor(p) { var ov = p.snd; if (typeof ov === 'string') return ov; var i = toolIdx(p), key = cfg.tools[i]; if (ov && ov[i] != null) return ov[i]; if (!key) return null; if (cfg.snd && cfg.snd[key] !== undefined) return cfg.snd[key]; return HSA_TOOLSND[key] || null; }
  function addScore(n) { S.score = Math.max(0, S.score + n); }
  function vib(p) { try { if (COARSE && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function feed(msg, bad) { var lastEl = el.hsFeed.lastChild; if (lastEl && lastEl.textContent === msg) el.hsFeed.removeChild(lastEl); var d = document.createElement('div'); d.textContent = msg; if (bad) d.className = 'bad'; el.hsFeed.appendChild(d); while (el.hsFeed.children.length > 3) el.hsFeed.removeChild(el.hsFeed.firstChild); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 4600); }
  function fresh() { var m = {}, k; for (k in cfg.mats) m[k] = { mixed: false, pot: 0, potOn: false, step: 0, hold: 0, mature: 0, batches: 0 };
    return { phase: 0, score: 0, t0: performance.now(), clock: cfg.clock0 || 7.5, mats: m, mixing: false, mixKey: null, quiz: null, rate: null, tw: 0, mode: null, dur: 6, cons: {}, notes: [], fin: false, lapse: null, play: null, warned: {},
      holdBtn: false, holdKey: false, holdCv: false, drag: null, yaw: 0, pitch: 0, zoom: 1, idle: 0, view: null, goal: null, marks: [], dims: [], detOpen: null }; }

  /* ----- the scene ----- */
  function build() {
    host = document.createElement('div'); host.className = 'hsim__view hs2__view'; root.insertBefore(host, root.firstChild); canvas = document.createElement('canvas'); canvas.className = 'sim__canvas'; canvas.setAttribute('aria-label', T().title.replace(/<[^>]*>/g, '')); host.appendChild(canvas);
    R = makeRenderer(canvas, site.bg || 0x2e3843); R.toneMappingExposure = site.exposure || 1.0; scene = new THREE.Scene(); scene.background = new THREE.Color(site.bg || 0x2e3843); if (site.fog) scene.fog = new THREE.Fog(site.bg || 0x2e3843, site.fog[0], site.fog[1]);
    try { scene.environment = makeEnv(R); GLBudget.env(R, scene); } catch (e) {}
    cam = new THREE.PerspectiveCamera(60, 1.6, 0.05, 120); gov = new Governor(R, scene);
    var kit = new SK.Kit(keep, scene); H = site.build(kit, scene, { cat: cat, lang: function () { return LANG; }, renderer: R }); if (!H.kit) H.kit = kit;
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') up(e); });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); S.zoom = Math.max(0.55, Math.min(1.3, S.zoom * (e.deltaY > 0 ? 1.07 : 0.93))); }, { passive: false });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    resize(); window.addEventListener('resize', function () { if (open) resize(); });
  }
  function resize() { if (!R || !host) return; var w = host.clientWidth || window.innerWidth, h = host.clientHeight || window.innerHeight; R.setSize(w, h, false); cam.aspect = w / Math.max(1, h); cam.updateProjectionMatrix(); }
  /* the frame of a step: where the eye is, what it looks at, the lens; on a narrow screen the lens widens so the same width is in view */
  function frameOf(i) { var p = cfg.phases[i], g = (site.ph && site.ph[p.id]) || {}, f = g.frame || (H.frames && H.frames[p.id]) || H.frame0; return f; }
  function fovFor(f) { var asp = cam.aspect || 1.6, v = f.fov || 55, ref = f.asp || 1.6; if (asp >= ref) return v; var hf = 2 * Math.atan(Math.tan(v * Math.PI / 360) * ref), v2 = 2 * Math.atan(Math.tan(hf / 2) / asp) * 180 / Math.PI; return Math.min(f.maxFov || 92, Math.max(v, v2)); }
  function goTo(f, snap) { S.goal = { p: new V3(f.p[0], f.p[1], f.p[2]), t: new V3(f.t[0], f.t[1], f.t[2]), fov: f.fov || 55, f: f }; if (snap || !S.view) S.view = { p: S.goal.p.clone(), t: S.goal.t.clone(), fov: S.goal.fov }; S.yaw = 0; S.pitch = 0; S.zoom = 1; }
  var DIR = new V3(), UPV = new V3(0, 1, 0), RGT = new V3(), LK = new V3();
  function camTick(dt) { if (!S.view || !S.goal) return; var k = 1 - Math.exp(-dt * 2.6); S.view.p.lerp(S.goal.p, k); S.view.t.lerp(S.goal.t, k); S.view.fov += (fovFor(S.goal.f) - S.view.fov) * k;
    if (!S.drag && !pinch) { S.idle += dt; if (S.idle > 1.4) { var d2 = Math.exp(-dt * 2.2); S.yaw *= d2; S.pitch *= d2; } }
    DIR.copy(S.view.t).sub(S.view.p); var dist = DIR.length(); DIR.normalize(); RGT.crossVectors(DIR, UPV).normalize(); DIR.applyAxisAngle(UPV, S.yaw); RGT.crossVectors(DIR, UPV).normalize(); DIR.applyAxisAngle(RGT, S.pitch);
    cam.position.copy(S.view.p); LK.copy(S.view.p).addScaledVector(DIR, dist); cam.lookAt(LK); cam.fov = S.view.fov * S.zoom; cam.updateProjectionMatrix(); }

  /* ----- the input: hold to work; drag to look; pinch to zoom ----- */
  function down(e) { if (!S || S.fin || !el.hsCard.hidden) return; PTR[e.pointerId] = { x: e.clientX, y: e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
    var ks = Object.keys(PTR); if (ks.length === 2) { var a = PTR[ks[0]], b = PTR[ks[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: S.zoom }; S.drag = null; S.holdCv = false; clearTimeout(S.holdTimer); return; }
    S.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: S.yaw, pitch: S.pitch, moved: false }; clearTimeout(S.holdTimer); S.holdTimer = setTimeout(function () { if (S.drag && !S.drag.moved) S.holdCv = true; }, 160); }
  function move(e) { if (!S) return; if (PTR[e.pointerId]) { PTR[e.pointerId].x = e.clientX; PTR[e.pointerId].y = e.clientY; }
    if (pinch) { var ks = Object.keys(PTR); if (ks.length < 2) return; var a = PTR[ks[0]], b = PTR[ks[1]], d = Math.hypot(a.x - b.x, a.y - b.y); S.zoom = Math.max(0.55, Math.min(1.3, pinch.z * pinch.d / Math.max(20, d))); return; }
    var D = S.drag; if (!D || D.id !== e.pointerId) return; var dx = e.clientX - D.x, dy = e.clientY - D.y; if (!D.moved && Math.hypot(dx, dy) > 9 && !S.holdCv) { D.moved = true; clearTimeout(S.holdTimer); }
    if (D.moved) { var r = canvas.getBoundingClientRect(), s = (cam.fov * Math.PI / 180) / Math.max(200, r.height); S.yaw = Math.max(-0.75, Math.min(0.75, D.yaw + dx * s)); S.pitch = Math.max(-0.45, Math.min(0.45, D.pitch + dy * s)); S.idle = 0; } }
  function up(e) { delete PTR[e.pointerId]; if (Object.keys(PTR).length < 2) pinch = null; clearTimeout(S && S.holdTimer); if (S) { S.drag = null; S.holdCv = false; S.idle = 0; } }
  function key(e) { if (!open) return; var tg = e.target && e.target.tagName; if (e.key === 'Escape') { self.close(); return; }
    if ((e.key === ' ' || e.code === 'Space') && tg !== 'INPUT' && tg !== 'BUTTON' && tg !== 'SELECT') { e.preventDefault(); if (e.type === 'keydown') S.holdKey = true; return; }
    if (e.type === 'keydown' && (e.key === 'd' || e.key === 'D') && tg !== 'INPUT') { toggleDetail(); return; }
    if (e.type === 'keydown' && (e.key === 'm' || e.key === 'M') && HASA && tg !== 'INPUT') { HSA.init(); HSA.toggle(); } }
  function keyUp(e) { if (!open || !S) return; if (e.key === ' ' || e.code === 'Space') S.holdKey = false; }
  function canWork() { return S && !S.fin && el.hsCard.hidden && (S.mode === 'work' || S.mode === 'coat') && !S.mixKey && !S.quiz && !S.rate; }
  function holding() { return canWork() && (S.holdBtn || S.holdKey || S.holdCv); }

  /* ----- the panels ----- */
  function hud() {
    if (S.introOn) return; var l = L(), l0 = L0(), t = PT(), p = ph(), n = cfg.phases.length, c = '';
    el.hsPhase.textContent = l0.phase + ' ' + (S.phase + 1) + ' ' + l0.of + ' ' + n + ' — ' + t.n; if (!S.lapse) el.hsPrompt.textContent = tx(G().p) || t.p;
    if (S.mode === 'work' || S.mode === 'play') c = Math.round(100 * E(S.tw)) + ' % · ' + (t.c || '');
    else if (S.mode === 'coat' || (S.mode === 'work' && G().paint)) { var pr = p.paint || G().paint || {}, rt = pr.rate || 0; c = l.gauge.replace('{k}', (rt * E(S.tw)).toFixed(2)).replace('{t}', rt.toFixed(2)); }
    else c = t.c || '';
    el.hsCount.textContent = c; el.hsScore.textContent = S.score; el.hsClock.textContent = clock();
    var tn = toolName(p); el.hsToolName.textContent = tn ? l.tool + ': ' + tn : '';
    var pk = needsOf(p), on = null; pk.forEach(function (k) { if (!on && S.mats[k].potOn) on = k; });
    el.hsPot.hidden = !on; if (on) { var m = S.mats[on], s = Math.max(0, Math.round(m.pot)); el.hsPotName.textContent = l0.pot + ' · ' + MT(on).name; el.hsPotTime.textContent = fmt(s); el.hsPotBar.style.width = (100 * s / (mat(on).pot * 60)) + '%'; el.hsPot.classList.toggle('is-low', s < 300); }
    holdUi();
  }
  function holdUi() { var b = el.hs2Hold; if (!b) return; var ok = canWork(), wk = S && (S.mode === 'work' || S.mode === 'coat'); b.hidden = !wk || !el.hsCard.hidden || S.fin; b.disabled = !ok; b.classList.toggle('is-on', !!(S && holding())); b.querySelector('.hs2__holdL').textContent = ok ? L().hold : L().holdNo;
    var tn = S ? toolName(ph()) : ''; b.querySelector('.hs2__holdT').textContent = tn; var arc = b.querySelector('.hs2__arc'); if (arc) arc.setAttribute('stroke-dashoffset', (163.4 * (1 - E(S ? S.tw : 0))).toFixed(1)); }
  function keysUi() { var g = G(), ks = g.keys ? (g.keys[LANG] || g.keys.en || []) : [], box = el.hs2Keys; if (!box) return; box.hidden = !ks.length; if (!ks.length) return; var h = '<b>' + L().keys + ' · ' + ks.length + '</b><ul>'; ks.forEach(function (x) { h += '<li>' + x + '</li>'; }); box.innerHTML = h + '</ul>'; }
  /* the section drawn to scale for this step (an SVG of the scene's own), in a card that can be closed */
  function detailUi() { var g = G(), key = g.detail, f = key && site.details ? site.details[key] : null, card = el.hs2Det, btn = el.hs2DetBtn; if (!card) return;
    if (!f) { card.hidden = true; btn.hidden = true; return; } btn.hidden = false; if (!S.detUser) S.detOpen = false; if (S.lastDet !== key) { if (S.lastDet != null) { btn.classList.remove('is-new'); void btn.offsetWidth; btn.classList.add('is-new'); } S.lastDet = key; }
    card.innerHTML = '<div class="hs2__dethead"><b>' + L().detail + '</b><button type="button" class="hs2__detx" aria-label="' + L().hide + '">×</button></div>' + f(LANG); card.hidden = !S.detOpen; btn.setAttribute('aria-expanded', S.detOpen ? 'true' : 'false'); btn.textContent = L().show;
    card.querySelector('.hs2__detx').onclick = function () { S.detUser = true; S.detOpen = false; detailUi(); try { btn.focus({ preventScroll: true }); } catch (e) {} }; }
  function toggleDetail() { if (!S || el.hs2DetBtn.hidden) return; S.detUser = true; S.detOpen = !S.detOpen; el.hs2DetBtn.classList.remove('is-new'); detailUi(); }
  /* the marks of a step: labels anchored on the work, dimension lines over the scene */
  function marksUi() { var lay = el.hs2Marks; S.dims.forEach(function (o) { scene.remove(o); }); S.dims = []; lay.innerHTML = '<svg class="hs2__lead" aria-hidden="true"></svg>'; S.marks = [];
    (G().marks || []).forEach(function (m) { var at = m.at; if (m.dim) { var o = H.kit.dimLine(m.dim[0], m.dim[1], { tick: m.tick }); S.dims.push(o); at = [(m.dim[0][0] + m.dim[1][0]) / 2, (m.dim[0][1] + m.dim[1][1]) / 2, (m.dim[0][2] + m.dim[1][2]) / 2]; }
      var d = document.createElement('div'); d.className = 'hs2__mark' + (m.dim ? ' is-dim' : '') + (m.warn ? ' is-warn' : ''); d.textContent = tx(m.txt); lay.appendChild(d); S.marks.push({ el: d, at: new V3(at[0], at[1], at[2]), dx: m.dx != null ? m.dx : (m.dim ? 0 : 26), dy: m.dy != null ? m.dy : (m.dim ? -14 : -30), dim: !!m.dim, when: m.when }); }); }
  var PV = new V3();
  function marksTick() { var lay = el.hs2Marks; if (!lay || !S.marks.length) return; var r = canvas.getBoundingClientRect(), svg = lay.firstChild, lines = '', busy = [];
    S.marks.forEach(function (m) { var show = !m.when || (m.when[0] <= S.tw && S.tw <= m.when[1]); PV.copy(m.at).project(cam); var vis = show && PV.z < 1 && PV.x > -1.1 && PV.x < 1.1 && PV.y > -1.1 && PV.y < 1.1; m.el.style.display = vis ? '' : 'none'; if (!vis) return;
      var x = r.left + (PV.x + 1) / 2 * r.width, y = r.top + (1 - PV.y) / 2 * r.height, lx = x + m.dx, ly = y + m.dy, w = m.el.offsetWidth || 80, h = m.el.offsetHeight || 22, tries = 0;
      if (m.dim) { lx -= w / 2; } else if (m.dx < 0) lx -= w; ly -= h / 2;
      while (tries < 6 && busy.some(function (b) { return lx < b[2] && lx + w > b[0] && ly < b[3] && ly + h > b[1]; })) { ly += (m.dy < 0 ? -1 : 1) * (h + 4); tries++; }
      lx = Math.max(6, Math.min((window.innerWidth || 1200) - w - 6, lx)); ly = Math.max(70, Math.min((window.innerHeight || 800) - h - 96, ly)); busy.push([lx, ly, lx + w, ly + h]);
      m.el.style.transform = 'translate(' + Math.round(lx) + 'px,' + Math.round(ly) + 'px)';
      if (!m.dim) lines += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4"/><line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (lx + (m.dx < 0 ? w : 0)).toFixed(1) + '" y2="' + (ly + h / 2).toFixed(1) + '"/>'; });
    if (svg) svg.innerHTML = lines; }

  /* ----- mixing, pot life (from the configuration) ----- */
  function unmixed() { var p = ph(), pk = needsOf(p), k; for (k = 0; k < pk.length; k++) if (!S.mats[pk[k]].mixed) return pk[k]; return null; }
  function mixPanel() {
    var key = (S.mode === 'work' || S.mode === 'coat') && !S.lapse && !S.fin && !S.rate ? unmixed() : null; S.mixKey = key; if (S.quiz || S.rate) return; el.hsMix.hidden = !key; holdUi(); if (!key) return;
    var m = mat(key), st = S.mats[key], l = L0(), mt2 = MT(key), steps = m.steps, i = st.step, h = '<h3>' + l.mixTitle.replace('{P}', mt2.name) + '</h3><ol>';
    steps.forEach(function (sp, k) { h += '<li' + (k < i ? ' class="done"' : '') + '>' + mt2.steps[k] + '</li>'; }); h += '</ol>'; var sp = steps[i];
    if (sp && sp.k === 'hold') h += '<div class="sim__mixbar"><u id="hsMixU" style="width:' + Math.round(st.hold / sp.s * 100) + '%"></u></div><button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + l.mixHold + ' · <span id="hsMixClock">' + fmt(st.hold * sp.real / sp.s) + '</span> / ' + fmt(sp.real) + '</button>';
    else if (sp && sp.k === 'mature') h += '<div class="sim__mixbar"><u id="hsMixU" style="width:' + Math.round(st.mature / sp.s * 100) + '%"></u></div><p class="hsim__mixnote">' + l.mixMature + ' <span id="hsMixClock">' + fmt(st.mature * sp.real / sp.s) + '</span> / ' + fmt(sp.real) + '</p>';
    else if (sp && sp.k === 'slider') h += '<label class="hsim__slider"><span>' + (mt2.slider || '') + ' <b id="hsSlVal">' + sp.v0 + '</b> ' + sp.unit + '</span><input type="range" id="hsSl" min="' + sp.min + '" max="' + sp.max + '" step="' + sp.step + '" value="' + sp.v0 + '"></label><button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + l.set + '</button>';
    else if (sp) h += '<button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + (sp.k === 'done' ? l.mixDone : (mt2.btn && mt2.btn[i]) || l.mixNext) + '</button>';
    if (mt2.note) h += '<p class="hsim__mixnote">' + mt2.note + '</p>';
    el.hsMix.innerHTML = h; var b = document.getElementById('hsMixBtn'); if (!b) return;
    if (sp.k === 'hold') { var on = function (e) { e.preventDefault(); S.mixing = true; }, off = function () { S.mixing = false; }; b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); S.mixing = true; } }); b.addEventListener('keyup', off); }
    else if (sp.k === 'slider') { var inp = document.getElementById('hsSl'), val = document.getElementById('hsSlVal'); inp.addEventListener('input', function () { val.textContent = inp.value; }); b.addEventListener('click', function () { var v = parseFloat(inp.value), ok = v >= sp.ok[0] && v <= sp.ok[1]; if (ok) { addScore(100); feed(l.doseOk); snd('doseOk'); } else { addScore(-50); feed(l.doseBad + (mt2.sliderBad ? ' ' + mt2.sliderBad : ''), true); S.notes.push(mt2.name + ': ' + v + ' ' + sp.unit); snd('doseBad'); } st.step++; mixStep(key); }); }
    else b.addEventListener('click', function () { st.step++; mixStep(key); snd('click'); });
    try { b.focus({ preventScroll: true }); } catch (e) {}
  }
  function mixStep(key) { var m = mat(key), st = S.mats[key]; if (st.step >= m.steps.length) { st.mixed = true; st.potOn = true; st.pot = m.pot * 60; st.batches++; addScore(100); feed(L0().potGo.replace('{P}', MT(key).name).replace('{m}', m.pot)); snd('ding'); } mixPanel(); hud(); }
  function needsNow(k) { return needsOf(ph()).indexOf(k) >= 0; }
  function potTick(dts) { var k; for (k in S.mats) { var st = S.mats[k]; if (!st.potOn) continue; st.pot -= dts; if (st.pot <= 0) { st.potOn = false; st.mixed = false; st.step = 0; st.hold = 0; st.mature = 0; if (needsNow(k)) { addScore(-200); feed(L0().potOut.replace('{P}', MT(k).name), true); mixPanel(); snd('potOut'); } } } }
  function expireAll() { var k; for (k in S.mats) { var st = S.mats[k]; if (st.mixed) { st.mixed = false; st.potOn = false; st.step = 0; st.hold = 0; st.mature = 0; } } }

  /* ----- a quiz, a dose, and the consumption of a coat: questions the data sheet answers ----- */
  function quizPanel() {
    var p = ph(), l = L0(); if (p.kind !== 'quiz' && p.kind !== 'dose') { S.quiz = null; return; }
    var t = PT(); S.quiz = true; el.hsMix.hidden = false; var h = '<h3>' + t.n + '</h3><p class="hsim__q">' + t.q + '</p>';
    if (p.kind === 'quiz') { h += '<div class="hsim__opts">'; t.opts.forEach(function (o, i) { h += '<button class="sb-btn sb-btn--secondary" type="button" data-opt="' + i + '">' + o + '</button>'; }); h += '</div>'; }
    else h += '<label class="hsim__slider"><span>' + t.label + ' <b id="hsSlVal">' + p.dose.v0 + '</b> ' + p.dose.unit + '</span><input type="range" id="hsSl" min="' + p.dose.min + '" max="' + p.dose.max + '" step="' + p.dose.step + '" value="' + p.dose.v0 + '"></label><button class="sb-btn sb-btn--primary" type="button" id="hsDoseBtn">' + l.set + '</button>';
    el.hsMix.innerHTML = h;
    if (p.kind === 'quiz') [].forEach.call(el.hsMix.querySelectorAll('[data-opt]'), function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-opt'); if (i === p.ok) { addScore(100); feed(l.quizOk + ' ' + (t.why || '')); snd('quizOk'); } else { addScore(-50); feed(l.quizBad + (t.why || ''), true); S.notes.push(t.n + ': ' + t.opts[i]); snd('quizBad'); } S.quiz = null; el.hsMix.hidden = true; nextPhase(); }); });
    else { var inp = document.getElementById('hsSl'), val = document.getElementById('hsSlVal'); inp.addEventListener('input', function () { val.textContent = inp.value; }); document.getElementById('hsDoseBtn').addEventListener('click', function () { var v = parseFloat(inp.value), ok = v >= p.dose.ok[0] && v <= p.dose.ok[1]; if (ok) { addScore(100); feed(l.doseOk + ' ' + (t.why || '')); snd('doseOk'); } else { addScore(-50); feed(l.doseBad + ' ' + (t.why || ''), true); S.notes.push(t.n + ': ' + v + ' ' + p.dose.unit); snd('doseBad'); } S.cons[t.n] = v + ' ' + p.dose.unit; S.quiz = null; el.hsMix.hidden = true; nextPhase(); }); }
    var fb = el.hsMix.querySelector('button'); if (fb) try { fb.focus({ preventScroll: true }); } catch (e) {}
  }
  function num(v) { return (Math.round(v * 100) / 100).toLocaleString(LANG === 'zh' ? 'zh-TW' : LANG === 'de' ? 'de-DE' : 'en-GB'); }
  function ratePanel() { var p = ph(), g = G(), pr = p.paint || g.paint || {}, rt = pr.rate; if (!rt || g.noRate) { S.rate = null; return; }
    var opts = g.rateOpts || [Math.round(rt * 0.5 * 100) / 100, rt, Math.round(rt * 2 * 100) / 100], ord = (S.phase % 3 === 0) ? [1, 0, 2] : (S.phase % 3 === 1) ? [0, 2, 1] : [2, 1, 0], l = L(), name = pr.label || '';
    S.rate = true; el.hsMix.hidden = false; var h = '<h3>' + l.rateH + '</h3><p class="hsim__q">' + l.rateQ.replace('{P}', name) + '</p><div class="hsim__opts">';
    ord.forEach(function (j) { h += '<button class="sb-btn sb-btn--secondary" type="button" data-rate="' + j + '">' + (g.rateLbl ? g.rateLbl[j] : num(opts[j])) + ' kg/m²</button>'; }); h += '</div>' + (g.rateNote ? '<p class="hsim__mixnote">' + tx(g.rateNote) + '</p>' : '');
    el.hsMix.innerHTML = h;
    [].forEach.call(el.hsMix.querySelectorAll('[data-rate]'), function (b) { b.addEventListener('click', function () { var j = +b.getAttribute('data-rate'), ok = Math.abs(opts[j] - rt) < 1e-6, why = tx(g.rateWhy); if (ok) { addScore(100); feed(l.rateOk + (why ? ' ' + why : '')); snd('quizOk'); } else { addScore(-50); feed(l.rateBad.replace('{t}', g.rateLbl ? g.rateLbl[1] : num(rt)) + (why ? ' ' + why : ''), true); S.notes.push(name + ': ' + num(opts[j]) + ' kg/m²'); snd('quizBad'); } S.rate = null; el.hsMix.hidden = true; mixPanel(); hud(); }); });
    var fb = el.hsMix.querySelector('button'); if (fb) try { fb.focus({ preventScroll: true }); } catch (e) {} }

  /* ----- the steps ----- */
  function enterPhase() {
    var p = ph(), g = G(); S.tw = 0; S.lapse = null; S.play = null; S.quiz = null; S.rate = null; S.mixKey = null; S.mode = null; el.hsMix.hidden = true;
    H.set(S.phase, 0); goTo(frameOf(S.phase)); marksUi(); keysUi(); detailUi();
    if (p.kind === 'drive' || p.kind === 'hold') { S.mode = 'work'; S.dur = g.dur || Math.max(4, Math.min(9, (p.secs || 8) * 0.75)); if (g.paint) ratePanel(); }
    else if (p.kind === 'paint') { S.mode = 'coat'; S.dur = g.dur || 6.5; ratePanel(); }
    else if (p.kind === 'wait') { S.mode = 'wait'; S.lapse = { t: 0, dur: p.secs || 2.6, h0: S.clock, h1: S.clock + (p.hours || 1) }; expireAll(); snd('lapse', S.lapse.dur); }
    else if (p.kind === 'play') { S.mode = 'play'; S.play = { t: 0, dur: g.dur || 4.5 }; }
    else if (p.kind === 'quiz' || p.kind === 'dose') { S.mode = 'quiz'; quizPanel(); }
    mixPanel(); hud(); boxOpen(!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches));
  }
  function boxOpen(on) { el.hsBox.classList.toggle('is-open', !!on); el.hsBox.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  function nextPhase() { var t = PT(); if (t.done) feed(t.done); addScore(150); vib([20, 40, 20]); if (S.phase >= cfg.phases.length - 1) { finish(); return; } S.phase++; enterPhase(); }
  function completeWork() { var p = ph(), pr = p.paint || G().paint; S.tw = 1; H.set(S.phase, 1); if (pr && pr.rate) S.cons[pr.label || p.id] = { kg: pr.rate, rate: pr.rate, cover: 1 }; snd('done'); nextPhase(); }

  /* ----- the frame ----- */
  function frame(now) { raf = requestAnimationFrame(frame); var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016, ms = last ? now - last : 0; last = now; if (!S) return; var key2 = null, lvl = 1;
    try { tick(dt, now / 1000); var hk = holding(); if (hk) { key2 = sndFor(ph()); } else if (S.mixing) key2 = 'mixer'; if (S.play && G().snd) key2 = G().snd;
      H.tick(S.phase, S.tw, hk || !!S.play, now / 1000, dt, { mix: !!S.mixKey && !S.rate, mixing: S.mixing, lapse: !!S.lapse || !!S.introOn }); camTick(dt); marksTick(); } catch (e) { if (window.console) console.error('site', cat, e); }
    if (HASA && open) HSA.work(key2, lvl, null);
    R.render(scene, cam); if (gov) gov.tick(ms); }
  function tick(dt, now) {
    if (S.fin || !el.hsCard.hidden) return;
    if (S.lapse) { var W = S.lapse; W.t += dt; var f = E(W.t / W.dur), e2 = f * f * (3 - 2 * f); S.clock = W.h0 + (W.h1 - W.h0) * e2; S.tw = e2; H.set(S.phase, e2); el.hsClock.textContent = clock(); el.hsCount.textContent = '+ ' + fmtH(S.clock - W.h0); if (f >= 1) { S.lapse = null; nextPhase(); } return; }
    if (S.play) { S.play.t += dt; S.tw = E(S.play.t / S.play.dur); S.clock += dt / 60; H.set(S.phase, S.tw); if (S.tw >= 1) { S.play = null; addScore(50); nextPhase(); } else hud(); return; }
    if (S.mixing && S.mixKey) { var m = mat(S.mixKey), st = S.mats[S.mixKey], sp = m.steps[st.step]; if (sp && sp.k === 'hold') { st.hold = Math.min(sp.s, st.hold + dt); var u = document.getElementById('hsMixU'), c = document.getElementById('hsMixClock'); if (u) u.style.width = (st.hold / sp.s * 100) + '%'; if (c) c.textContent = fmt(st.hold * sp.real / sp.s); if (st.hold >= sp.s) { S.mixing = false; st.step++; addScore(50); mixStep(S.mixKey); } } }
    if (S.mixKey) { var m2 = mat(S.mixKey), st2 = S.mats[S.mixKey], sp2 = m2.steps[st2.step]; if (sp2 && sp2.k === 'mature') { st2.mature = Math.min(sp2.s, st2.mature + dt); S.clock += dt * (sp2.real / sp2.s) / 3600; var u2 = document.getElementById('hsMixU'), c2 = document.getElementById('hsMixClock'); if (u2) u2.style.width = (st2.mature / sp2.s * 100) + '%'; if (c2) c2.textContent = fmt(st2.mature * sp2.real / sp2.s); if (st2.mature >= sp2.s) { st2.step++; mixStep(S.mixKey); } } }
    if (holding()) { S.tw = Math.min(1, S.tw + dt / S.dur); S.clock += dt * RATE / 3600; potTick(dt * RATE); H.set(S.phase, S.tw); if (S.tw >= 1) { completeWork(); return; } hud(); }
    else if (el.hs2Hold && !el.hs2Hold.hidden) holdUi();
  }

  /* ----- the cards ----- */
  function briefing() {
    var l = L0(), l2 = L(), t = T(), h = '<div class="sim__cardin"><p class="sim__phase">' + t.eyebrow + '</p><h2 id="hsTitle">' + t.title + '</h2><p>' + t.sub + '</p><ol class="sim__brief">';
    t.brief.forEach(function (b) { h += '<li>' + b + '</li>'; }); h += '</ol>' + (site.brief ? '<p class="hs2__site">' + tx(site.brief) + '</p>' : '') + '<div class="sim__keys">'; (COARSE ? l2.keysTouch : l2.keysDesk).forEach(function (k) { h += '<span><b>' + k[0] + '</b> ' + k[1] + '</span>'; });
    h += '</div><div class="sim__cardact"><button class="sb-btn sb-btn--inverse sb-btn--lg" type="button" id="hsStart">' + l.start + '</button><button class="sb-link" type="button" id="hsBack">' + l.back + '</button></div></div>';
    el.hsCard.innerHTML = h; el.hsCard.hidden = false; holdUi(); el.hs2Det.hidden = true; el.hs2DetBtn.hidden = true;
    document.getElementById('hsStart').addEventListener('click', function () { el.hsCard.hidden = true; S.t0 = performance.now(); if (HASA) HSA.resume(); snd('click'); if (site.intro) intro(); else enterPhase(); });
    document.getElementById('hsBack').addEventListener('click', self.close); try { document.getElementById('hsStart').focus({ preventScroll: true }); } catch (e) {}
  }
  /* the site as it is found: the section with its dimensions, the facts of the structure, before the first step */
  function intro() { var g = site.intro, l = L(); S.introOn = true; S.mode = 'intro'; S.tw = 0; H.set(0, 0); goTo(g.frame || H.frame0); marksUi(); keysUi(); detailUi();
    el.hsPhase.textContent = l.introH; el.hsPrompt.textContent = tx(g.p); el.hsCount.textContent = ''; el.hsToolName.textContent = ''; el.hsBox.classList.add('is-open'); holdUi();
    el.hsMix.innerHTML = '<p class="hsim__mixnote">' + l.introNote + '</p><button class="sb-btn sb-btn--primary" type="button" id="hs2Go">' + l.introGo + '</button>'; el.hsMix.hidden = false; el.hsMix.classList.add('hs2__go');
    var b = document.getElementById('hs2Go'); b.addEventListener('click', function () { S.introOn = false; el.hsMix.classList.remove('hs2__go'); snd('click'); enterPhase(); }); try { b.focus({ preventScroll: true }); } catch (e) {} }
  function finish() {
    S.fin = true; S.mode = null; snd('finish'); var l = L0(), t = T(), secs = Math.round((performance.now() - S.t0) / 1000), max = cfg.maxScore || 2000, rank = S.score >= max * 0.82 ? 2 : S.score >= max * 0.6 ? 1 : 0, k;
    S.dims.forEach(function (o) { scene.remove(o); }); S.dims = []; S.marks = []; el.hs2Marks.innerHTML = ''; el.hs2Det.hidden = true; el.hs2DetBtn.hidden = true; el.hs2Keys.hidden = true; if (H.finale) goTo(H.finale);
    var h = '<div class="sim__cardin"><p class="sim__phase">' + l.rank + ' — ' + l.ranks[rank] + '</p><h2>' + t.res_title + '</h2><div class="sim__result"><div><b>' + S.score + '</b><span>' + l.res[0] + '</span></div><div><b>' + fmt(secs) + '</b><span>' + l.res[1] + '</span></div><div><b>' + (Math.floor(S.clock / 24) + 1) + '</b><span>' + l.res[2] + '</span></div></div>';
    var lines = []; for (k in S.cons) { var c = S.cons[k]; lines.push(typeof c === 'string' ? k + ': ' + c : k + ': ' + c.kg.toFixed(2) + ' kg/m² (' + (LANG === 'zh' ? '技術資料表約 ' : LANG === 'de' ? 'Merkblatt ca. ' : 'data sheet approx. ') + c.rate.toFixed(2) + ')'); }
    if (lines.length) { h += '<p class="sim__phase" style="margin-top:20px">' + l.cons + '</p><ul class="hsim__cons">'; lines.forEach(function (x) { h += '<li>' + x + '</li>'; }); h += '</ul>'; }
    if (S.notes.length) { h += '<p class="sim__phase" style="margin-top:16px">' + (LANG === 'zh' ? '需要再確認的地方' : LANG === 'de' ? 'Noch einmal ansehen' : 'Worth another look') + '</p><ul class="hsim__cons">'; S.notes.forEach(function (x) { h += '<li>' + x + '</li>'; }); h += '</ul>'; }
    var vd = cfg.verdict ? cfg.verdict(S, LANG) : null; if (vd) h += '<p class="sim__phase" style="margin-top:20px">' + l.verdict + '</p><p style="margin-top:6px">' + vd + '</p>';
    h += '<p>' + t.res_sub + '</p><p style="font-weight:700">Problems solved.</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse sb-btn--lg" type="button" id="hsAgain">' + l.again + '</button><button class="sb-link" type="button" id="hsBack2">' + l.back + '</button></div><p class="sim__dev">' + (LANG === 'zh' ? '系統由好時新創 Good Startup 開發' : LANG === 'de' ? 'System entwickelt von Good Startup' : 'System developed by Good Startup') + '</p></div>';
    el.hsCard.innerHTML = h; el.hsCard.hidden = false; el.hsMix.hidden = true; el.hsPot.hidden = true; holdUi();
    document.getElementById('hsAgain').addEventListener('click', function () { S = fresh(); H.set(0, 0); goTo(H.frame0, true); hud(); briefing(); }); document.getElementById('hsBack2').addEventListener('click', self.close); try { document.getElementById('hsAgain').focus({ preventScroll: true }); } catch (e) {}
  }

  /* ----- the overlay's own controls for the guided mode (made once, shared) ----- */
  function ensureUi() {
    if (!document.getElementById('hs2Hold')) {
      var b = document.createElement('button'); b.type = 'button'; b.id = 'hs2Hold'; b.className = 'hs2__hold'; b.hidden = true; b.innerHTML = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" class="hs2__ring0"/><circle cx="30" cy="30" r="26" class="hs2__arc" stroke-dasharray="163.4" stroke-dashoffset="163.4" transform="rotate(-90 30 30)"/><path d="M22 20l18 10-18 10z" class="hs2__play"/></svg><span class="hs2__holdTx"><b class="hs2__holdL"></b><small class="hs2__holdT"></small></span>'; root.appendChild(b);
      var k = document.createElement('div'); k.id = 'hs2Keys'; k.className = 'hs2__keys'; k.hidden = true; document.getElementById('hsBox').appendChild(k);
      var mk = document.createElement('div'); mk.id = 'hs2Marks'; mk.className = 'hs2__marks'; mk.setAttribute('aria-hidden', 'true'); root.insertBefore(mk, document.getElementById('hsFeed'));
      var db = document.createElement('button'); db.type = 'button'; db.id = 'hs2DetBtn'; db.className = 'sim__exit hs2__detbtn'; db.hidden = true; db.setAttribute('aria-controls', 'hs2Det'); document.querySelector('#hsim .sim__right').appendChild(db);
      var dc = document.createElement('div'); dc.id = 'hs2Det'; dc.className = 'hs2__det'; dc.hidden = true; dc.setAttribute('role', 'region'); root.appendChild(dc);
    }
    ['hsBox', 'hsPhase', 'hsPrompt', 'hsCount', 'hsScore', 'hsPot', 'hsPotName', 'hsPotTime', 'hsPotBar', 'hsClock', 'hsLook', 'hsFeed', 'hsMix', 'hsToolName', 'hsCard', 'hsView', 'hsZin', 'hsZout', 'hs2Hold', 'hs2Keys', 'hs2Marks', 'hs2DetBtn', 'hs2Det'].forEach(function (id) { el[id] = document.getElementById(id); });
    var hb = el.hs2Hold; hb.onpointerdown = function (e) { e.preventDefault(); if (!S) return; S.holdBtn = true; try { hb.setPointerCapture(e.pointerId); } catch (er) {} }; hb.onpointerup = hb.onpointercancel = hb.onlostpointercapture = function () { if (S) S.holdBtn = false; };
    hb.onkeydown = function (e) { if ((e.key === ' ' || e.key === 'Enter') && S) { e.preventDefault(); S.holdKey = true; } }; hb.onkeyup = function (e) { if ((e.key === ' ' || e.key === 'Enter') && S) S.holdKey = false; }; hb.oncontextmenu = function (e) { e.preventDefault(); };
    el.hs2DetBtn.onclick = toggleDetail;
    if (!el.hsBox.userData) { el.hsBox.userData = 1; el.hsBox.addEventListener('click', function () { boxOpen(!el.hsBox.classList.contains('is-open')); }); el.hsBox.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); boxOpen(!el.hsBox.classList.contains('is-open')); } }); }
  }

  /* ----- open / close ----- */
  this.open = function () {
    opener = document.activeElement; ensureUi(); root.hidden = false; root.classList.add('is-site'); document.body.style.overflow = 'hidden'; open = true; last = 0; root.setAttribute('data-hs', cat);
    if (!HAS3D) { el.hsCard.hidden = false; el.hsCard.innerHTML = '<div class="sim__cardin"><h2>' + T().title + '</h2><p>' + L0().no3d + '</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse" type="button" id="hsBack3">' + L0().back + '</button></div></div>'; document.getElementById('hsBack3').addEventListener('click', self.close); return; }
    if (!H) { try { build(); } catch (e) { if (window.console) console.error('site', cat, e); el.hsCard.hidden = false; el.hsCard.innerHTML = '<div class="sim__cardin"><h2>' + T().title + '</h2><p>' + L0().no3d + '</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse" type="button" id="hsBack3">' + L0().back + '</button></div></div>'; document.getElementById('hsBack3').addEventListener('click', self.close); return; } }
    HSIM.showHost(host); resize();
    document.addEventListener('keydown', key); document.addEventListener('keyup', keyUp); S = fresh(); H.set(0, 0); goTo(H.frame0, true); el.hsFeed.innerHTML = ''; el.hsMix.hidden = true; el.hs2Marks.innerHTML = ''; el.hs2Keys.hidden = true; hud(); briefing(); raf = requestAnimationFrame(frame);
    el.hsView.onclick = function () { if (S) { S.yaw = 0; S.pitch = 0; S.zoom = 1; } }; el.hsZin.onclick = function () { if (S) S.zoom = Math.max(0.55, S.zoom * 0.85); }; el.hsZout.onclick = function () { if (S) S.zoom = Math.min(1.3, S.zoom * 1.15); };
    el.hsLook.textContent = L0().site || '';
  };
  this.close = function () { open = false; cancelAnimationFrame(raf); root.hidden = true; root.classList.remove('is-site'); document.body.style.overflow = ''; document.removeEventListener('keydown', key); document.removeEventListener('keyup', keyUp); if (el.hs2Hold) el.hs2Hold.hidden = true; if (el.hs2Det) el.hs2Det.hidden = true; if (el.hs2Marks) el.hs2Marks.innerHTML = ''; if (HASA) HSA.close(); if (opener && opener.focus) opener.focus(); };
  this.relabel = function () { if (open && S) { if (S.introOn) { intro(); return; } hud(); mixPanel(); keysUi(); detailUi(); marksUi(); if (S.quiz) quizPanel(); if (S.rate) ratePanel(); if (!el.hsCard.hidden) { if (S.fin) finish(); else briefing(); } } };
  this.isOpen = function () { return open; };
  this.dispose = function () { if (!R) return; cancelAnimationFrame(raf); try { GLBudget.drop(R); R.dispose(); if (R.forceContextLoss) R.forceContextLoss(); } catch (e) {} keep.forEach(function (o) { try { if (o.dispose) o.dispose(); } catch (e) {} }); keep = []; if (host && host.parentNode) host.parentNode.removeChild(host); R = null; H = null; host = null; canvas = null; scene = null; };
  /* for automated checks: the state, the scene's handle, and the steps' controls */
  this.peek = function (f) { return f(S, { H: H, cam: cam, scene: scene, canvas: canvas, R: R }, { intro: intro, enter: enterPhase, next: nextPhase, complete: completeWork, hud: hud, hold: function (on) { if (S) S.holdBtn = !!on; }, holding: holding, canWork: canWork, frameOf: frameOf }); };
  this.site = true;
}
