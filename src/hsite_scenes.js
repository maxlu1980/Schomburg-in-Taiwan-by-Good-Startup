
/* ===== (V89) The jobsites of the hands-on simulators: the scenes at true scale and the guidance of every step =====
   HSX: the stage (parts that follow the steps, the man with the tool of the step, the mixing station, particles), segments that appear or go
   (a chase, a fill, a cove), and the drawings to scale (SVG, in millimetres). The scenes: one basement for three jobs (wp: mineral sealing
   slurry from the negative side, rc: crystalline slurry, inj: crack injection), an RC column in a parking garage (cr), a private garage
   (pf), the excavation with the base slab and the wall kicker (ca). Dimensions in metres, after the construction as it is built:
   - basement wall 30 cm (WU concrete, D13 @ 150 both faces, cover 50 mm earth side / 40 mm room side), clear height 2.80 m, base slab 30 cm on
     5 cm blinding, roof slab 25 cm; wall kicker 15 cm cast with the slab — the construction joint above it is where the water comes in;
     formwork panels 2.00 × 1.50 m with tie holes Ø 22 mm at ≤ 1.0 m; groundwater 1.20 m above the floor. */
var HSX = (function () {
  var V3 = THREE.Vector3, PI = Math.PI;
  function E(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, b) { return t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* the man and his tools: one crew for the scene, a kit per frame of work (the back wall, the floor, …), the tools made when first used */
  function Rig(kit, scene, o) {
    var keep = kit.keep, kits = {}, frames = { w: scene }, tools = {}, all = [];
    var crew = new Crew({ keep: keep, group: scene, floor: o.floor || 0, bounds: o.bounds || null, scale: 1, avoid: o.avoid || null, floorDir: o.floorDir || null, headroom: o.headroom || null, standOff: o.standOff || 0, squat: o.squat || false });
    this.crew = crew;
    this.frame = function (name, g) { frames[name] = g; };
    function K(name) { name = name || 'w'; if (!kits[name]) { var k = new CRPrepKit.Kit(keep, frames[name] || scene); k.crew = crew; k.W = new WPKit(k, keep, frames[name] || scene); kits[name] = k; } return kits[name]; }
    this.K = K;
    this.tool = function (name, frame, make) { var key = (frame || 'w') + ':' + name; if (!tools[key]) { var k = K(frame); tools[key] = make(k, k.W); tools[key].userData.kit = k; all.push(tools[key]); } return tools[key]; };
    this.begin = function (T) { var k; all.forEach(function (t) { t.visible = false; if (t.userData.mode) t.userData.mode(null); if (t.userData.stream) t.userData.stream(T, false); }); crew.begin(); for (k in kits) kits[k].now = T; };
    this.end = function () { crew.resolve(); };
  }
  /* placing the tools (the kit's own recipes): pressed on a face (trowel, brush, sponge), aimed at it (lance, nozzle, hose), the chipper at its chisel */
  function press(tool, x, y, z, tilt, yaw) { tool.userData.kit.press(tool, x, y, z, tilt, yaw, 0); }
  function aim(tool, p, d, off) { tool.userData.kit.aim(tool, p, d, off, 0); }
  function chip(tool, x, y, z, T) { var k = tool.userData.kit; tool.visible = true; tool.position.set(x + 0.02, y + 0.012, z + 0.004 + 0.006 * Math.abs(Math.sin(T * 38))); tool.rotation.set(-0.5, 0.3, 0); if (k.crew) k.crew.follow(tool, 0, 0, 0, 0); }
  function dir(x, y, z) { return new V3(x, y, z).normalize(); }

  /* the stage: parts follow the steps (each a function of the progress of the steps), the driver of the step places the man and his tool */
  function Stage(kit, scene, cfg, o) {
    var self = this, I = {}, parts = [], drivers = {}, T = 0, fx = [], rig = null;
    cfg.phases.forEach(function (p, i) { I[p.id] = i; });
    this.I = I; this.kit = kit; this.scene = scene; this.cfg = cfg; o = o || {};
    this.f = function (id, i, tw) { var k = I[id]; return k == null ? 0 : i > k ? 1 : i < k ? 0 : tw; };
    this.on = function (fn) { parts.push(fn); };
    this.set = function (i, tw) { var F = function (id) { return self.f(id, i, tw); }; F.i = i; F.tw = tw; F.id = cfg.phases[i].id; F.past = function (id) { return I[id] != null && i > I[id]; }; F.at = function (id) { return I[id] === i; }; parts.forEach(function (fn) { fn(F); }); };
    this.work = function (id, fn) { [].concat(id).forEach(function (k) { drivers[k] = fn; }); };
    this.rig = function () { if (!rig) rig = new Rig(kit, scene, o.crew || {}); return rig; };
    this.fx = function (kind, n, opt, frame) { var K2 = self.rig().K(frame); var c = kind === 'debris' ? K2.debris(n) : K2.cloud(n, opt); var e = { c: c, h: [], g: opt && opt.ground != null ? opt.ground : 0 }; fx.push(e); return e; };
    this.emit = function (e, p) { if (p) e.h.push([T, p[0], p[1], p[2]]); };
    function look(e, born) { var h = e.h, lo = 0, hi = h.length - 1; if (hi < 0) return null; while (lo < hi) { var mid = (lo + hi) >> 1; if (h[mid][0] < born) lo = mid + 1; else hi = mid; } var b = h[lo], a = lo > 0 ? h[lo - 1] : b, q = Math.abs(a[0] - born) < Math.abs(b[0] - born) ? a : b; return Math.abs(q[0] - born) < 0.05 ? [q[1], q[2], q[3]] : null; }
    this.tick = function (i, tw, active, time, dt, info) {
      if (active) T += dt; info = info || {};
      var id = cfg.phases[i].id, d = drivers[id], r = rig;
      if (r) r.begin(T);
      if (d && !info.lapse) d(tw, active, T, dt, info);
      if (r) { if (info.mix && o.mixAt) r.crew.mixAt(o.mixAt[0], o.mixAt[1], o.mixAt[2], o.mixAt[3], time); r.end(); }
      fx.forEach(function (e) { while (e.h.length && e.h[0][0] < T - 3) e.h.shift(); var ob = e.c.points || e.c; if (active) e.c.update(T, function (b) { return look(e, b); }, e.g); else ob.visible = false; });
    };
  }

  /* pieces that appear (or go) one after the other along a run: the chase being cut, its fill, a cove; order(k) 0…1 */
  function Pieces(list, inv) { var last = -1; this.list = list; this.set = function (t) { if (Math.abs(t - last) < 1e-4) return; last = t; list.forEach(function (p) { var on = p.o < t; p.m.visible = inv ? !on : on; }); }; }
  function run(kit, n, a0, a1, make, inv) { var list = [], k; for (k = 0; k < n; k++) { var s0 = lerp(a0, a1, k / n), s1 = lerp(a0, a1, (k + 1) / n); list.push({ m: make(s0, s1, k), o: (k + 0.5) / n }); } var P = new Pieces(list, inv); P.set(0); return P; }
  /* a cove of radius r along x (concave, against the wall z = 0 and the floor y = 0), one piece from x0 to x1; the end cap shows the section */
  function coveGeo(r, n) { var pos = [], idx = [], k, pts = []; for (k = 0; k <= n; k++) { var a = k / n * PI / 2; pts.push([r - r * Math.cos(a), r - r * Math.sin(a)]); } /* (z, y): from (0, r) on the wall down to (r, 0) on the floor */
    pts.forEach(function (p) { pos.push(0, p[1], p[0], 1, p[1], p[0]); }); for (k = 0; k < n; k++) { var a0 = k * 2, b0 = a0 + 2; idx.push(a0, a0 + 1, b0, a0 + 1, b0 + 1, b0); }
    var c0 = pos.length / 3; pos.push(0, 0, 0); pts.forEach(function (p) { pos.push(0, p[1], p[0]); }); for (k = 0; k < n; k++) idx.push(c0, c0 + 2 + k, c0 + 1 + k); /* the cap at x = 0 */
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; }

  /* ----- drawings to scale: SVG in millimetres ----- */
  var DW = (function () {
    var C = { ink: '#1d2733', conc: '#d9d6cf', concL: '#e9e7e1', soil: '#b79f7c', gravel: '#cfc5b0', blind: '#c9c4ba', water: '#3d8fc4', steel: '#3a3a3a', red: '#c8102e', mortar: '#b9b4aa', slurry: '#8e9396', coat1: '#7f8b95', coat2: '#5e6b76', band: '#46525d', ic: '#6d7d74', plug: '#5d5f5c', note: '#5a6573', epoxy: '#c9a227', pu: '#e0b04a' };
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function svg(vb, inner, alt) { return '<svg class="hs2__svg" viewBox="' + vb.join(' ') + '" role="img" aria-label="' + esc(alt || '') + '" xmlns="http://www.w3.org/2000/svg"><defs>' +
      '<pattern id="hcC" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="' + C.conc + '"/><path d="M6 8l5 3-5 2zM26 22l4 4-6 1zM14 30l3-4 2 5zM33 6l3 2-3 3z" fill="#a9a59c"/><circle cx="20" cy="12" r="1.6" fill="#9b978f"/><circle cx="8" cy="26" r="1.2" fill="#9b978f"/><circle cx="34" cy="34" r="1.4" fill="#9b978f"/></pattern>' +
      '<pattern id="hcS" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="30" fill="' + C.soil + '"/><path d="M0 0v30M15 0v30" stroke="#8f7a5c" stroke-width="2.2"/></pattern>' +
      '<pattern id="hcG" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="' + C.gravel + '"/><circle cx="6" cy="6" r="4" fill="none" stroke="#9c927c" stroke-width="1.6"/><circle cx="18" cy="16" r="5" fill="none" stroke="#9c927c" stroke-width="1.6"/></pattern>' +
      '<pattern id="hcW" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="' + C.water + '" fill-opacity=".18"/></pattern>' +
      '</defs>' + inner + '</svg>'; }
    function R(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 2) + '"' : '') + (o.op ? ' fill-opacity="' + o.op + '"' : '') + '/>'; }
    function P(d, f, o) { o = o || {}; return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 2) + '"' : '') + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.op ? ' fill-opacity="' + o.op + '"' : '') + ' stroke-linejoin="round" stroke-linecap="round"/>'; }
    function L(x1, y1, x2, y2, s, w, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (s || C.ink) + '" stroke-width="' + (w || 2) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>'; }
    function Ci(x, y, r, f, s) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (f || C.steel) + '"' + (s ? ' stroke="' + s + '" stroke-width="1.5"' : '') + '/>'; }
    function T(x, y, s, fs, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + fs + '" fill="' + (o.f || C.ink) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.b ? ' font-weight="700"' : '') + (o.rot ? ' transform="rotate(' + o.rot + ' ' + x + ' ' + y + ')"' : '') + ' font-family="system-ui,-apple-system,Segoe UI,Noto Sans TC,sans-serif">' + esc(s) + '</text>'; }
    /* a dimension: from a to b (horizontal or vertical), offset to the side, its text */
    function D(x1, y1, x2, y2, s, fs, o) { o = o || {}; var h = Math.abs(y1 - y2) < 1e-6, t = fs * 0.35, out = '', mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      out += L(x1, y1, x2, y2, o.c || C.ink, fs * 0.08); out += h ? L(x1 - t, y1 + t, x1 + t, y1 - t, o.c || C.ink, fs * 0.1) + L(x2 - t, y2 + t, x2 + t, y2 - t, o.c || C.ink, fs * 0.1) : L(x1 - t, y1 + t, x1 + t, y1 - t, o.c || C.ink, fs * 0.1) + L(x2 - t, y2 + t, x2 + t, y2 - t, o.c || C.ink, fs * 0.1);
      out += h ? T(mx, my - fs * 0.35, s, fs, { a: 'middle', f: o.c }) : T(mx - fs * 0.35, my, s, fs, { a: 'middle', f: o.c, rot: -90 }); return out; }
    /* a leader: from the point to the text */
    function N(x, y, tx2, ty, s, fs, o) { o = o || {}; var left = tx2 < x; return L(x, y, tx2, ty, o.c || C.note, fs * 0.07) + Ci(x, y, fs * 0.14, o.c || C.note) + T(tx2 + (left ? -fs * 0.25 : fs * 0.25), ty + fs * 0.35, s, fs, { a: left ? 'end' : 'start', f: o.c || C.ink, b: o.b }); }
    return { C: C, svg: svg, R: R, P: P, L: L, Ci: Ci, T: T, D: D, N: N };
  })();

  /* the lights of a room lit by the site lamp on its tripod; the lamp itself */
  function lamp(kit, scene, at, to, o) { o = o || {}; var M = kit.M, g = new THREE.Group(), legM = M.dark, k;
    for (k = 0; k < 3; k++) { var a = k * 2.094 + 0.3, leg = new THREE.Mesh(kit.keep(new THREE.CylinderGeometry(0.012, 0.012, at[1] * 1.04, 8)), legM); leg.position.set(Math.cos(a) * 0.22, at[1] / 2, Math.sin(a) * 0.22); leg.lookAt(0, at[1], 0); leg.rotateX(PI / 2); leg.castShadow = true; g.add(leg); }
    var head = new THREE.Mesh(kit.keep(new THREE.BoxGeometry(0.3, 0.22, 0.08)), kit.std({ color: 0xd59a12, roughness: 0.5, metalness: mt(0.2) })), lens = new THREE.Mesh(kit.keep(new THREE.PlaneGeometry(0.25, 0.17)), kit.std({ color: 0xffffff, emissive: 0xfff6e0, emissiveIntensity: 1.4 }));
    head.position.set(0, at[1], 0); lens.position.set(0, 0, 0.041); head.add(lens); g.add(head); g.position.set(at[0], 0, at[2]); scene.add(g); head.lookAt(new V3(to[0], to[1], to[2]));
    var sp = new THREE.SpotLight(0xfff3e2, o.i || 1.5, o.dist || 11, o.ang || 0.85, 0.55, 1.1); sp.position.set(at[0], at[1], at[2]); sp.target.position.set(to[0], to[1], to[2]); sp.castShadow = true; sp.shadow.mapSize.set(SMALL3D ? 1024 : 2048, SMALL3D ? 1024 : 2048); sp.shadow.bias = -0.0004; sp.shadow.normalBias = 0.02; sp.shadow.camera.near = 0.3; sp.shadow.camera.far = 12; scene.add(sp, sp.target); return { g: g, light: sp }; }
  /* material on the pallet: bags of 25 kg and pails */
  function pallet(kit, scene, x, z, n, o) { o = o || {}; var M = kit.M, g = new THREE.Group(), wood = M.wood, bag = kit.std({ color: o.bag || 0xd7cdb3, roughness: 0.92 }), band = kit.std({ color: o.band || 0x1f4e8c, roughness: 0.8 }), k;
    var deck = new THREE.Mesh(kit.keep(new THREE.BoxGeometry(1.2, 0.022, 0.8)), wood); deck.position.y = 0.133; g.add(deck); [-0.55, 0, 0.55].forEach(function (bx) { var b = new THREE.Mesh(kit.keep(new THREE.BoxGeometry(0.1, 0.1, 0.8)), wood); b.position.set(bx, 0.061, 0); g.add(b); });
    for (k = 0; k < n; k++) { var row = k % 2, lay = Math.floor(k / 2), bg = new THREE.Mesh(kit.keep(new THREE.BoxGeometry(0.58, 0.11, 0.38)), bag); bg.position.set(row ? 0.29 : -0.29, 0.2 + lay * 0.112, 0.0); bg.rotation.y = (lay % 2) * 0.04; bg.castShadow = true; bg.receiveShadow = true; g.add(bg); var st = new THREE.Mesh(kit.keep(new THREE.BoxGeometry(0.585, 0.02, 0.385)), band); st.position.copy(bg.position); st.position.y += 0.02; g.add(st); }
    g.position.set(x, 0, z); g.rotation.y = o.yaw || 0; g.traverse(function (m) { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); scene.add(g); return g; }
  function canvasOf(w, h, fn) { var c = mkCanvas(w, h), q = c.getContext('2d'); fn(q, w, h); return c; }
  function rnd(seed) { var s = seed >>> 0; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

  return { E: E, seg: seg, lerp: lerp, Rig: Rig, Stage: Stage, press: press, aim: aim, chip: chip, dir: dir, run: run, Pieces: Pieces, coveGeo: coveGeo, DW: DW, lamp: lamp, pallet: pallet, canvasOf: canvasOf, rnd: rnd };
})();

/* ===== the basement (wp, rc, inj) =====
   The room: x −2.20 (the section cut, open to the visitor) … 2.20 (the right-hand wall, inner face), the back wall's inner face at z = 0, the room
   towards +z, the floor (top of the base slab) at y = 0, the soffit at 2.80. Behind the wall the working space of the excavation (backfilled with
   gravel, 0.60 m) and the natural soil, the groundwater at 1.20 m. */
var HSB = (function () {
  var X0 = -2.2, X1 = 2.2, XR = 2.5, TW = 0.30, H = 2.8, TS = 0.30, TB = 0.05, TC = 0.25, ZF = 3.9, KJ = 0.15, VJ = 0.35, GW = 1.2, GL = 2.85;
  var HC = [1.05, 1.45, 0.16, 0.40], TIES = [], LEAK = [-0.85, 0.15];
  [-1.15, -0.15, 0.85, 1.85].forEach(function (x) { [0.45, 1.25, 2.05].forEach(function (y) { TIES.push([x, y]); }); });
  function txt(zh, en, de) { return { zh: zh, en: en, de: de }; }
  var V3 = THREE.Vector3;

  /* the old surface of the wall: a dispersion paint, yellowed and flaking where the water came through; the damp rising from the floor and running
     down from the joints; calcite runs; rust below two tie holes. Drawn at true scale over the whole wall, x −2.2…2.2, y 0…2.8 */
  function grime() { return HSX.canvasOf(Math.round(4.4 * 170), Math.round(2.8 * 170), function (q, w, h) { var S = 170, r = HSX.rnd(77), i, k;
    function X(x) { return (x - X0) * S; } function Y(y) { return (H - y) * S; }
    q.fillStyle = '#e4e0d5'; q.fillRect(0, 0, w, h); for (i = 0; i < 900; i++) { q.fillStyle = 'rgba(' + (180 + r() * 50 | 0) + ',' + (170 + r() * 50 | 0) + ',' + (150 + r() * 50 | 0) + ',.08)'; q.beginPath(); q.arc(r() * w, r() * h, 8 + r() * 40, 0, 7); q.fill(); }
    var gd = q.createLinearGradient(0, Y(0.9), 0, Y(0)); gd.addColorStop(0, 'rgba(120,110,95,0)'); gd.addColorStop(1, 'rgba(98,90,78,.55)'); q.fillStyle = gd; q.fillRect(0, Y(0.9), w, Y(0) - Y(0.9));
    /* flaking: the paint is gone in patches along the joints and at the base */
    q.globalCompositeOperation = 'destination-out'; function flake(cx, cy, rx, ry, n) { for (k = 0; k < n; k++) { var x = cx + (r() - 0.5) * rx * 2, y = cy + (r() - 0.5) * ry * 2, rr = (0.02 + r() * 0.07) * S; q.beginPath(); var a0 = r() * 6.3, m; for (m = 0; m <= 9; m++) { var a = a0 + m / 9 * 6.283, rq = rr * (0.6 + r() * 0.6); q.lineTo(x + Math.cos(a) * rq, y + Math.sin(a) * rq * 0.8); } q.closePath(); q.fill(); } }
    flake(X(VJ), Y(1.1), 0.18 * S, 0.9 * S, 70); flake(w / 2, Y(0.2), w / 2, 0.12 * S, 140); flake(X(LEAK[0]), Y(0.4), 0.3 * S, 0.25 * S, 30); flake(X(1.25), Y(0.35), 0.35 * S, 0.2 * S, 30);
    q.globalCompositeOperation = 'source-over';
    /* lifted edges of the paint, a shadow under them */
    q.strokeStyle = 'rgba(70,64,56,.25)'; q.lineWidth = 1.2; for (i = 0; i < 140; i++) { var lx = X(VJ) + (r() - 0.5) * 0.4 * S, ly = Y(0.3 + r() * 2.2); q.beginPath(); q.arc(lx, ly, 3 + r() * 9, r() * 3, r() * 3 + 2); q.stroke(); }
    /* damp: dark along the vertical joint (widening down) and above the kicker joint */
    q.save(); q.beginPath(); q.moveTo(X(VJ) - 4, 0); q.lineTo(X(VJ) + 4, 0); q.lineTo(X(VJ) + 0.42 * S, h); q.lineTo(X(VJ) - 0.46 * S, h); q.closePath(); var gj = q.createLinearGradient(X(VJ) - 0.4 * S, 0, X(VJ) + 0.4 * S, 0); gj.addColorStop(0, 'rgba(60,62,64,0)'); gj.addColorStop(0.5, 'rgba(60,62,64,.42)'); gj.addColorStop(1, 'rgba(60,62,64,0)'); q.fillStyle = gj; q.fill(); q.restore();
    var gk = q.createLinearGradient(0, Y(0.75), 0, Y(0)); gk.addColorStop(0, 'rgba(55,58,60,0)'); gk.addColorStop(0.6, 'rgba(55,58,60,.3)'); gk.addColorStop(1, 'rgba(50,52,54,.5)'); q.fillStyle = gk; q.fillRect(0, Y(0.75), w, Y(0) - Y(0.75));
    /* calcite runs from the joints */
    function runs(x0, y0, n, len) { for (i = 0; i < n; i++) { var sx = X(x0) + (r() - 0.5) * 0.04 * S, sy = Y(y0 + (r() - 0.3) * 0.02), L = len * S * (0.4 + r() * 0.8), wd = 1.5 + r() * 4, gl = q.createLinearGradient(0, sy, 0, sy + L); gl.addColorStop(0, 'rgba(246,244,236,.8)'); gl.addColorStop(1, 'rgba(246,244,236,0)'); q.fillStyle = gl; q.beginPath(); q.moveTo(sx - wd / 2, sy); q.lineTo(sx + wd / 2, sy); q.lineTo(sx + wd * 1.8, sy + L); q.lineTo(sx - wd * 1.8, sy + L); q.closePath(); q.fill(); } }
    for (k = 0; k < 14; k++) runs(VJ, 0.3 + k * 0.17, 2, 0.35); for (k = 0; k < 26; k++) runs(X0 + 0.1 + k * 0.165, KJ, 1, 0.12);
    /* rust runs below two tie holes */
    [[-0.15, 0.45], [0.85, 1.25]].forEach(function (t) { var gl = q.createLinearGradient(0, Y(t[1]), 0, Y(t[1] - 0.35)); gl.addColorStop(0, 'rgba(140,72,30,.75)'); gl.addColorStop(1, 'rgba(140,72,30,0)'); q.fillStyle = gl; q.beginPath(); q.moveTo(X(t[0]) - 4, Y(t[1])); q.lineTo(X(t[0]) + 4, Y(t[1])); q.lineTo(X(t[0]) + 9, Y(t[1] - 0.35)); q.lineTo(X(t[0]) - 9, Y(t[1] - 0.35)); q.closePath(); q.fill(); });
  }); }
  /* the honeycomb: stones with dark voids between them */
  function honeyTex() { return HSX.canvasOf(256, 160, function (q, w, h) { var r = HSX.rnd(91), i; q.fillStyle = '#4a4640'; q.fillRect(0, 0, w, h); for (i = 0; i < 260; i++) { var x = r() * w, y = r() * h, s = 3 + r() * 9, t = 0.55 + r() * 0.45; q.fillStyle = 'rgb(' + (150 * t | 0) + ',' + (145 * t | 0) + ',' + (136 * t | 0) + ')'; q.beginPath(); q.ellipse(x, y, s, s * (0.6 + r() * 0.4), r() * 3, 0, 7); q.fill(); q.fillStyle = 'rgba(255,255,255,.15)'; q.beginPath(); q.ellipse(x - s * 0.25, y - s * 0.25, s * 0.4, s * 0.25, 0, 0, 7); q.fill(); } }); }
  function hessian() { return HSX.canvasOf(128, 128, function (q, w, h) { var i; q.fillStyle = '#8d7350'; q.fillRect(0, 0, w, h); for (i = 0; i < w; i += 4) { q.fillStyle = i % 8 ? 'rgba(60,45,28,.35)' : 'rgba(190,160,115,.35)'; q.fillRect(i, 0, 2, h); q.fillRect(0, i, w, 2); } }); }

  /* the structure: everything that is concrete, steel and soil */
  function build(kit, scene, ctx, o) {
    o = o || {}; var M = kit.M, box = kit.box, F = { ox: VJ, oy: KJ }, k, hasHoney = o.honey !== false;
    scene.add(new THREE.HemisphereLight(0xe9eef3, 0x5d5a55, 0.32));
    var fill = new THREE.DirectionalLight(0xffffff, 0.22); fill.position.set(-1.5, 2.2, 5); scene.add(fill);
    var cutL = new THREE.DirectionalLight(0xfff8ee, 0.55); cutL.position.set(-6, 3.5, 2.5); cutL.target.position.set(-2.2, 1, 0); scene.add(cutL, cutL.target);
    HSX.lamp(kit, scene, [1.75, 1.85, 2.7], [0.1, 1.05, 0], { i: 1.55 });
    var cutM = kit.std({ color: 0xc9c5bd, map: M.cut.map, roughness: 0.9, envMapIntensity: 0.3 });
    /* the back wall: a core and a 3 cm skin built around the chases, the honeycomb and the tie holes; the kicker (0…0.15) cast with the slab */
    box(X0, XR, 0, H, -TW, -0.03, M.formed, F);
    box(X0, X1, 0, KJ - 0.01, -0.03, 0, M.formed, F);
    box(X0, VJ - 0.01, KJ + 0.01, H, -0.03, 0, M.formed, F); box(VJ + 0.01, HC[0], KJ + 0.01, H, -0.03, 0, M.formed, F); box(HC[0], HC[1], HC[3], H, -0.03, 0, M.formed, F); box(HC[1], X1, KJ + 0.01, H, -0.03, 0, M.formed, F);
    box(X0, X1, KJ - 0.01, KJ + 0.01, -0.03, -0.025, M.formed, F); box(VJ - 0.01, VJ + 0.01, KJ + 0.01, H, -0.03, -0.025, M.formed, F); /* the bottoms of the chases, 25 mm deep */
    if (hasHoney) kit.plane('z', HC[0], HC[1], KJ + 0.01, HC[3], -0.0299, cutM); else box(HC[0], HC[1], KJ + 0.01, HC[3], -0.03, 0, M.formed, F);
    /* the right-hand wall and its kicker joint */
    box(X1, XR, 0, H, -TW, ZF, M.formed, { ox: 0, oy: KJ, oz: 0.35 });
    /* the base slab, the blinding, the roof slab */
    box(X0, XR, -TS, 0, -TW - 0.15, ZF, M.slab, { ts: [2, 2] }); box(X0, XR + 0.15, -TS - TB, -TS, -TW - 0.35, ZF, M.blind);
    box(X0, XR, H, H + TC, -TW, ZF, M.slab, { ts: [2, 2] });
    /* the soil: the working space backfilled with gravel, the natural ground; under the blinding */
    box(X0, XR + 0.6, -TS - TB, GL, -TW - 0.6, -TW, M.gravel); box(X0, XR + 0.6, -1.0, GL, -2.0, -TW - 0.6, M.soil); box(X0, XR + 0.6, -1.0, -TS - TB, -TW - 0.6, ZF, M.soil);
    var topsoil = kit.std({ color: 0x5b4a36, roughness: 1 }); box(X0, XR + 0.6, GL, GL + 0.25, -2.0, -TW, topsoil);
    /* the section: the cut faces in sawn concrete, the groundwater in the soil, the reinforcement cut through */
    var CX = X0 - 0.0015;
    kit.plane('x', -TW, 0, 0, H, CX, cutM, {}); kit.plane('x', -TW - 0.15, ZF, -TS, 0, CX, cutM); kit.plane('x', -TW, ZF, H, H + TC, CX, cutM); kit.plane('x', -TW - 0.35, ZF, -TS - TB, -TS, CX, kit.std({ color: 0xa29d93, map: M.cut.map, roughness: 0.95 }));
    var gwM = kit.std({ color: 0x2f7fb8, transparent: true, opacity: 0.32, roughness: 0.3, depthWrite: false }); kit.plane('x', -2.0, -TW, -1.0, GW, CX - 0.001, gwM); kit.plane('x', -TW - 0.35, ZF, -1.0, -TS - TB, CX - 0.001, gwM);
    var gwL = kit.std({ color: 0x1f6fa8, roughness: 0.4 }); kit.box(CX - 0.006, CX - 0.002, GW - 0.004, GW + 0.004, -2.0, -TW, gwL);
    var bars = [], d13 = 0.013, d16 = 0.016, y;
    for (y = 0.075; y < H - 0.05; y += 0.15) { bars.push([CX - 0.012, y, -0.040 - 0.0065, X0 + 0.02, y, -0.040 - 0.0065]); bars.push([CX - 0.012, y, -TW + 0.050 + 0.0065, X0 + 0.02, y, -TW + 0.050 + 0.0065]); } /* the horizontal bars, outside, cut: dots */
    kit.bars(d13, bars, M.rebar); bars = [];
    bars.push([X0, KJ * 0.2 + 0.05, -0.040 - 0.013 - 0.0065, X0, H - 0.04, -0.040 - 0.013 - 0.0065]); bars.push([X0, 0.05, -TW + 0.05 + 0.013 + 0.0065, X0, H - 0.04, -TW + 0.05 + 0.013 + 0.0065]); /* the vertical bars in the plane of the cut: lines */
    bars.push([X0, -TS + 0.05 + 0.03, -0.040 - 0.026 - 0.0065, X0, 0.85, -0.040 - 0.026 - 0.0065]); bars.push([X0, -TS + 0.05 + 0.03, -TW + 0.05 + 0.026 + 0.0065, X0, 0.85, -TW + 0.05 + 0.026 + 0.0065]); /* the starter bars from the slab, lapped */
    kit.bars(d13, bars, M.rebar); bars = [];
    for (k = 0; k < 25; k++) { var zz = -TW - 0.1 + k * 0.15; if (zz > ZF - 0.05) break; bars.push([CX - 0.012, -0.040 - 0.008, zz, X0 + 0.02, -0.040 - 0.008, zz]); bars.push([CX - 0.012, -TS + 0.050 + 0.008, zz, X0 + 0.02, -TS + 0.050 + 0.008, zz]); bars.push([CX - 0.012, H + TC - 0.03 - 0.006, zz, X0 + 0.02, H + TC - 0.03 - 0.006, zz]); bars.push([CX - 0.012, H + 0.03 + 0.006, zz, X0 + 0.02, H + 0.03 + 0.006, zz]); }
    kit.bars(d16, bars, M.rebar); bars = [];
    bars.push([X0, -0.040 - 0.024, -TW - 0.12, X0, -0.040 - 0.024, ZF]); bars.push([X0, -TS + 0.05 + 0.024, -TW - 0.12, X0, -TS + 0.05 + 0.024, ZF]); bars.push([X0, H + TC - 0.03 - 0.018, -TW + 0.04, X0, H + TC - 0.03 - 0.018, ZF]); bars.push([X0, H + 0.03 + 0.018, -TW + 0.04, X0, H + 0.03 + 0.018, ZF]);
    kit.bars(d16, bars, M.rebar);
    /* the joints on the wall's face: the kicker joint, the vertical pour joint (both as a fine dark line) */
    var jM = kit.std({ color: 0x3e3b37, roughness: 0.9 });
    var kick = HSX.run(kit, 22, X0, X1, function (a, b) { var g = new THREE.Group(); kit.box(a, b, KJ - 0.01, KJ + 0.01, -0.025, 0, M.formed, { parent: g, ox: VJ, oy: KJ }); kit.box(a, b, KJ - 0.0012, KJ + 0.0012, 0, 0.0004, jM, { parent: g, cast: false }); scene.add(g); return g; }, true);
    var vjn = HSX.run(kit, 13, KJ + 0.01, H, function (a, b) { var g = new THREE.Group(); kit.box(VJ - 0.01, VJ + 0.01, a, b, -0.025, 0, M.formed, { parent: g, ox: VJ, oy: KJ }); kit.box(VJ - 0.0012, VJ + 0.0012, a, b, 0, 0.0004, jM, { parent: g, cast: false }); scene.add(g); return g; }, true);
    kit.box(X1 - 0.0004, X1, KJ - 0.0012, KJ + 0.0012, 0, ZF, jM, { cast: false });
    /* the tie holes: a cone Ø 40 to the hole Ø 22 */
    var holeM = kit.std({ color: 0x24221f, roughness: 1 }), coneM = kit.std({ color: 0x8e8a82, roughness: 0.95 }), plugM = kit.std({ color: 0xa8a399, roughness: 0.9 });
    var holes = TIES.map(function (t) { var g = new THREE.Group(), c = new THREE.Mesh(kit.keep(new THREE.RingGeometry(0.011, 0.02, 24)), coneM), h = new THREE.Mesh(kit.keep(new THREE.CircleGeometry(0.011, 20)), holeM), p = new THREE.Mesh(kit.keep(new THREE.CircleGeometry(0.021, 24)), plugM); c.position.z = 0.0003; h.position.z = 0.0004; p.position.z = 0.0006; p.visible = false; g.add(c, h, p); g.position.set(t[0], t[1], 0); g.userData.plug = p; scene.add(g); return g; });
    /* the honeycomb at the base, in chunks for the chipper */
    var hm = kit.std({ map: kit.keep(canvasTex(honeyTex(), {})), roughness: 0.98 });
    var hon = [], hx, hy; if (hasHoney) for (hy = 0; hy < 2; hy++) for (hx = 0; hx < 4; hx++) { var x0 = HC[0] + hx * 0.1, y0 = KJ + 0.01 + hy * 0.115; hon.push({ m: kit.box(x0, x0 + 0.1, y0, y0 + 0.115, -0.03 + 0.004 * ((hx + hy) % 2), -0.002, hm, { ts: [0.4, 0.23], ox: HC[0], oy: KJ }), o: ((1 - hy) * 4 + (hy ? 3 - hx : hx) + 0.5) / 8 }); }
    var honey = new HSX.Pieces(hon, true); honey.set(0);
    /* the old paint, the damp and the lime over everything (taken off by the jet) */
    var oldM = kit.std({ color: 0xffffff, roughness: 0.92, envMapIntensity: 0.2 });
    var LJ = SK.lanes(X0, X1, 0, H, 8, true, true, 0.012), old = new SK.Layer(kit, 'z', X0, X1, 0, H, 0.0009, oldM, LJ.order, { inv: true, map: grime(), alphaTest: 0.02, res: 48, lift: 1 });
    var wetM = kit.std({ color: 0x1a1d20, transparent: true, opacity: 0.26, roughness: 0.14, envMapIntensity: 1.3, depthWrite: false });
    return { M: M, kick: kick, vjn: vjn, holes: holes, honey: honey, old: old, LJ: LJ, wetM: wetM, jM: jM, plugM: plugM, cutM: cutM };
  }

  /* ----- the jobs on the wall: shared pieces ----- */
  function slurryMat(kit, tone) { var c = new THREE.Color(tone); c.lerp(new THREE.Color(0xffffff), 0.35); return kit.std({ color: c, roughness: 0.7, envMapIntensity: 0.45 }); }
  function coat(kit, tone, kind, a0, a1, b0, b1, c, order, lift, tile) { return new SK.Layer(kit, kind, a0, a1, b0, b1, c, slurryMat(kit, tone), order, { map: WPTX.slurry(tone, { seed: 1 + Math.abs(Math.round(c * 1e5)) % 997 }), rep: [(a1 - a0) / (tile || 0.5), (b1 - b0) / (tile || 0.5)], lift: lift, res: 40 }); }
  /* a coat on the wall (vertical lanes, from the top) and on the floor band (z 0…0.5): one path for the man, one order for the layers */
  function coatRun(kit, tone, lift, wallTo) { var n = 8, LW = SK.lanes(X0, X1, 0, H, n, true, true, 0.01), LF = SK.lanes(X0, X1, -0.5, 0, 2, false, true, 0.01), w = wallTo || 0.8;
    var lw = coat(kit, tone, 'z', X0, X1, 0, H, 0.0012 + lift * 0.0004, function (a, b) { return w * LW.order(a, b); }, lift + 1),
      lf = coat(kit, tone, 'y', X0, X1, 0, 0.5, 0.0012 + lift * 0.0004, function (a, b) { return w + (1 - w) * LF.order(a, -b); }, lift + 1);
    return { set: function (t) { lw.set(t); lf.set(t); }, at: function (t) { if (t < w) { var p = LW.at(t / w); return { f: 'w', x: p.a, y: p.b, lane: p.lane }; } var q = LF.at((t - w) / (1 - w)); return { f: 'f', x: q.a, y: q.b, lane: q.lane }; } }; }
  function coveRun(kit, scene, mat, r) { var g = kit.keep(HSX.coveGeo(r, 10)); return HSX.run(kit, 22, X0, X1, function (a, b) { var m = new THREE.Mesh(g, mat); m.position.x = a; m.scale.x = b - a; m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; }); }

  return { X0: X0, X1: X1, XR: XR, TW: TW, H: H, TS: TS, TB: TB, TC: TC, ZF: ZF, KJ: KJ, VJ: VJ, GW: GW, GL: GL, HC: HC, TIES: TIES, LEAK: LEAK, build: build, coat: coat, coatRun: coatRun, coveRun: coveRun, hessian: hessian, txt: txt };
})();
