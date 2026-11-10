
/* ===== Hands-on simulators (HSIM): the jobsite of every guide as an exercise =====
   One engine, five configurations. Each simulator borrows the guide's own 3D sample (CRView / PFView / CAView) with its crew and rigs:
   - drive phases: the user guides the applicator's tool through a stage of the sample (the pointer held on the tool, which moves with the work);
   - paint phases: the user applies a coat himself — the brush, trowel or spray gun follows the pointer, the coat appears where he works, the
     consumption (kg/m²) and the coverage are measured against the technical data sheet;
   - mixing of every material with its mixing time, maturing time and pot life (the clock runs 20× while the work is done);
   - waiting times (overcoat after …, curing) as time lapses on the site clock; quizzes on the decisions a data sheet asks for; dosing.
   Strings: HSIM_T (generic) and each configuration's t (EN / Taiwan Traditional Chinese). */
var HSIM_T = {
en: {
 exit: 'Exit to the guide', score: 'Score', pot: 'Pot life', phase: 'Phase', of: 'of', start: 'Begin the works', enter: 'Enter the simulator', again: 'Run again', back: 'Back to the guide',
 keys: [['Point at the red ring', 'the tool works while the pointer is on it — no button needed'], ['Drag on the surface', 'apply the material yourself'], ['Drag anywhere else', 'look around — the view returns to the work by itself'], ['Wheel / buttons', 'zoom'], ['1–9', 'tools'], ['M', 'sound on / off'], ['Esc', 'exit']],
 touch: [['Touch and hold the red ring', 'the tool works while your finger is on it'], ['Drag on the surface', 'apply the material yourself'], ['Drag anywhere else', 'look around — the view returns to the work by itself'], ['Pinch / buttons', 'zoom'], ['Tap a tool', 'select it'], ['Speaker button', 'sound on / off'], ['Tap the task box', 'show the whole instruction']],
 wrongTool: 'Select the right tool: ', follow: 'Keep the pointer on the aiming ring — the work goes on while you are on it.', zone: 'Work on the marked area.', men: 'Stay with the crew — keep the pointer on the man at work.', toolOn: 'Tool', toolPick: 'Select', aimOn: 'on the work', aimOff: 'move to the ring', tipPoint: 'Point here', tipHold: 'Hold here', tipWork: 'Working', tipZone: 'Point at the marked area', tipFollow: 'Follow the ring', tipTool: 'Select: ', sound: 'Sound', soundOn: 'Sound on', soundOff: 'Sound off',
 notMixed: 'Mix the material first.', potOut: '{P}: pot life exceeded — the batch has set in the bucket. Mix a fresh batch.', potGo: 'The pot life of {P} runs: approx. {m} minutes.',
 thick: 'Too much material here — more than the data sheet allows in one step.', thin: 'The coat is thin here — brush more material in.', covered: 'Coverage {c} % · approx. {k} kg/m² (data sheet: approx. {t} kg/m²)',
 coverNeed: 'Cover the whole area free of pores: {c} % so far.', edge: 'Hold the brush at the edge of the view — the view turns with it.', mixTitle: 'Mix {P}', mixHold: 'Hold to mix', mixMature: 'Maturing time …', mixNext: 'Next', mixDone: 'Ready — the pot life runs',
 waitTitle: 'Waiting time', day: 'Day', site: 'Site clock', look: 'Look around', view: 'Reset view', zin: 'Zoom in', zout: 'Zoom out',
 quizOk: 'Correct.', quizBad: 'Not what the data sheet says: ', doseOk: 'Within the data sheet range.', doseBad: 'Outside the data sheet range.', set: 'Set',
 res: ['Score', 'Time', 'Site days'], rank: 'Rating', ranks: ['Trainee', 'Applicator', 'Site specialist'], cons: 'Material rates of this run', verdict: 'Result',
 no3d: 'The simulator needs WebGL and an internet connection to load the 3D library.', toolNext: 'next tool', hours: 'h', days: 'd'
},
zh: {
 exit: '返回指南', score: '分數', pot: '可使用時間', phase: '階段', of: '／', start: '開始施工', enter: '進入模擬器', again: '再來一次', back: '返回指南',
 keys: [['指向紅色瞄準環', '指標在環上時工具就會施作——不必按住'], ['在表面拖曳', '親自塗布材料'], ['在其他任何處拖曳', '環顧四周——視角會自動回到施作處'], ['滾輪／按鈕', '縮放'], ['1–9', '工具'], ['M', '音效開／關'], ['Esc', '離開']],
 touch: [['觸按並按住紅色瞄準環', '手指在環上時工具就會施作'], ['在表面拖曳', '親自塗布材料'], ['在其他任何處拖曳', '環顧四周——視角會自動回到施作處'], ['雙指縮放／按鈕', '縮放'], ['點一下工具', '選取'], ['喇叭按鈕', '音效開／關'], ['點一下任務框', '顯示完整說明']],
 wrongTool: '請選擇正確的工具：', follow: '請將指標保持在瞄準環上——指標在環上時施作就會進行。', zone: '請在標示的區域施作。', men: '請跟著施工人員——將指標保持在作業中的人員上。', toolOn: '工具', toolPick: '請選擇', aimOn: '對準中', aimOff: '請移到瞄準環', tipPoint: '指向這裡', tipHold: '按住這裡', tipWork: '施作中', tipZone: '請指向標示區域', tipFollow: '跟著瞄準環', tipTool: '請選：', sound: '音效', soundOn: '音效：開', soundOff: '音效：關',
 notMixed: '請先攪拌材料。', potOut: '{P}：已超過可使用時間——材料已在桶中硬化。請重新攪拌一批。', potGo: '{P} 的可使用時間開始計時：約 {m} 分鐘。',
 thick: '此處材料過多——超過技術資料表單道施作的容許量。', thin: '此處塗層偏薄——請再刷入材料。', covered: '覆蓋率 {c} %・約 {k} kg/m²（技術資料表：約 {t} kg/m²）',
 coverNeed: '請將整個區域無孔洞地覆蓋：目前 {c} %。', edge: '按住筆刷移到畫面邊緣，視角會隨之轉動。', mixTitle: '攪拌 {P}', mixHold: '長按攪拌', mixMature: '熟化時間 …', mixNext: '下一步', mixDone: '就緒——可使用時間開始計時',
 waitTitle: '等待時間', day: '第', site: '工地時鐘', look: '環顧四周', view: '重設視角', zin: '放大', zout: '縮小',
 quizOk: '正確。', quizBad: '與技術資料表不符：', doseOk: '在技術資料表範圍內。', doseBad: '超出技術資料表範圍。', set: '確定',
 res: ['分數', '時間', '工地天數'], rank: '評等', ranks: ['見習', '施工人員', '工地專家'], cons: '本次施作的材料用量', verdict: '結果',
 no3d: '模擬器需要 WebGL 並連線載入 3D 程式庫。', toolNext: '下一工具', hours: '小時', days: '天'
}
};
/* tool icons (24 × 24 strokes) by key */
var HSIM_ICONS = {
 lance: '<path d="M3 20l9-9M12 11l3-3M15 8l2-2 3 3-2 2zM13 6l2-2M20 2l2 2"/><path d="M4 12c2 0 3-1 3-3"/>',
 chipper: '<path d="M4 20l6-6M10 14l2-2 4 4-2 2zM14 10l4-4 2 2-4 4M18 6V3M20 8h3"/>',
 trowel: '<path d="M3 15l8-8 6 6-8 8zM11 7l3-3 2 2M17 13l3 3"/>',
 broom: '<path d="M14 3l7 7M16 9l-6 6M4 21l3-7 4 4-7 3zM7 14l-3 7"/>',
 notched: '<path d="M3 16l8-8 6 6-8 8zM11 8l3-3 2 2M4 15l1 1M6 13l1 1M8 11l1 1M10 9l1 1"/>',
 spray: '<path d="M3 13h9v4H3zM12 14h4l2 2-2 2h-4M6 17v5M18 12l3-2M18 16l3 2M19 14h3"/>',
 hose: '<path d="M3 12h7M10 9v6l5-3zM17 7c3 2 3 8 0 10M20 5c4 3 4 11 0 14"/>',
 cutter: '<path d="M3 12a9 9 0 0 1 18 0H3zM12 12v5M8 20h8M12 3v3"/>',
 blaster: '<path d="M3 14h8v4H3zM11 15h4l2 1-2 2h-4M6 18v4M17 9l2-2M19 12l3-1M18 6l1-3M20 15l3 1"/>',
 sponge: '<path d="M3 13h18v6H3zM7 13V9h10v4M10 9V6h4v3"/>',
 rule: '<path d="M2 15h20v4H2zM6 15v2M10 15v3M14 15v2M18 15v3"/>',
 roller: '<path d="M3 4h12v5H3zM15 6h4v5h-7M12 11v10M10 21h4"/>',
 vacuum: '<path d="M4 20h7v-5H4zM7 15V9c0-3 3-4 6-2l5 5M16 10l3 3"/>',
 cm: '<path d="M8 3h8v6l3 8v4H5v-4l3-8zM10 12h4"/>',
 gun: '<path d="M3 11h11l2 2-2 2H3zM14 9h3M9 15v5M17 12h5"/>',
 waterstop: '<path d="M2 14h20M4 14l3-5h10l3 5M8 14v5M16 14v5M12 9v10"/>',
 poker: '<path d="M11 2h2v12h-2zM9 14h6l1 8H8zM4 6h4M16 6h4"/>',
 sheet: '<path d="M3 8l9-4 9 4v10l-9 4-9-4zM3 8l9 4 9-4M12 12v10"/>',
 hand: '<path d="M8 11V5a1.5 1.5 0 0 1 3 0v5M11 4a1.5 1.5 0 0 1 3 0v6M14 6a1.5 1.5 0 0 1 3 0v6M17 10a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-2a5 5 0 0 1-4-2l-4-5a1.6 1.6 0 0 1 2.5-2L8 14"/>',
 look: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
 pail: '<path d="M5 8h14l-2 13H7zM5 8a7 3 0 0 1 14 0M8 5a4 4 0 0 1 8 0"/>',
 mixer: '<path d="M12 2v14M7 16h10l-3 5H10zM5 9h14M8 9c0 3 8 3 8 0"/>'
};

/* ----- the engine ----- */
function HandsOn(cat, cfg) {
  var self = this, L = function () { return HSIM_T[LANG] || HSIM_T.en; }, T = function () { return cfg.t[LANG] || cfg.t.en; };
  var root = document.getElementById('hsim'), host = null, canvas = null, view = null, S = null, open = false, raf = 0, last = 0, opener = null, feedAt = 0, tipLast = '';
  var el = {}, ids = ['hsPhase', 'hsPrompt', 'hsCount', 'hsScore', 'hsFeed', 'hsPot', 'hsPotName', 'hsPotTime', 'hsPotBar', 'hsRing', 'hsRingArc', 'hsTip', 'hsSnd', 'hsMix', 'hsTools', 'hsCard', 'hsToolName', 'hsClock', 'hsLook', 'hsView', 'hsZin', 'hsZout', 'hsExit', 'hsBox'];
  var ray = new THREE.Raycaster(), V2 = new THREE.Vector2(), V3 = new THREE.Vector3(), V3b = new THREE.Vector3();
  var COARSE = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches), PTRS = {}, pinch = null, boxTimer = 0;
  function tolFor(ptype) { var r = rect(), m = Math.min(r.width, r.height); return ptype === 'touch' || (ptype == null && COARSE) ? Math.max(76, m * 0.22) : Math.max(60, m * 0.16); } /* a finger covers more than a cursor: the hold stays valid further from the tool */
  function vib(p) { try { if (COARSE && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function boxOpen(on) { if (!el.hsBox) return; el.hsBox.classList.toggle('is-open', !!on); }
  function boxShow() { boxOpen(true); clearTimeout(boxTimer); boxTimer = setTimeout(function () { if (S && S.hold) boxOpen(false); }, 6000); } /* the whole instruction at the start of a phase; folded once he is at work (phones clamp it to two lines) */
  var RATE = 12; /* the pot life runs 12× — a batch of 45 minutes lasts 225 seconds of work, of 60 minutes 5 minutes */
  this.cat = cat; this.cfg = cfg;
  function E(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ph() { return cfg.phases[S.phase]; }
  function PT() { return T().phases[S.phase]; }
  function tools() { return cfg.tools; }
  function mat(k) { return cfg.mats[k]; }
  function MT(k) { var m = mat(k); return (m.t[LANG] || m.t.en); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function clock() { var h = S.clock, d = Math.floor(h / 24) + 1, hh = Math.floor(h % 24), mm = Math.floor((h % 1) * 60); return (LANG === 'zh' ? L().day + ' ' + d + ' 天 · ' : L().day + ' ' + d + ' · ') + ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2); }

  /* ----- the view: the guide's sample with its crew and rigs ----- */
  function build() {
    host = document.createElement('div'); host.className = 'hsim__view'; host.id = 'hsimView-' + cat; host.innerHTML = '<canvas role="img" aria-label="' + String((T().title || '')).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').replace(/"/g, '&quot;').trim() + '"></canvas>'; root.insertBefore(host, root.firstChild); canvas = host.querySelector('canvas');
    var o = { scenario: cfg.scenario, mode: 'full' };
    view = cfg.view === 'pf' ? new PFView(host, o) : cfg.view === 'ca' ? new CAView(host, o) : new CRView(host, o);
    view.afterState = afterState;
    if (cfg.fps) { view.fps = fpsCam; fpsScene(); }
    canvas.addEventListener('pointerdown', down, true); canvas.addEventListener('pointermove', move, true); canvas.addEventListener('pointerleave', function (e) { if (S && e.pointerType !== 'touch' && !S.hold && !S.drag) S.ptr = null; }, true); ['pointerup', 'pointercancel'].forEach(function (n) { canvas.addEventListener(n, up, true); });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); e.stopImmediatePropagation(); zoomBy(e.deltaY > 0 ? 1.08 : 0.92); }, { passive: false, capture: true });
    self.view = view;
  }
  function zoomBy(f) { if (cfg.fps && S && S.look) { S.look.fov = Math.max(32, Math.min(84, S.look.fov * f)); } else if (view && view.zoom) view.zoom(f); }
  function applyHome(keepOrbit) { /* the frame of the sample: closer on portrait screens, where the view's own narrow-screen rule would leave it small */
    if (!view || cfg.fps || !cfg.cam || !view.setHome) return; var r = rect(), asp = r.height ? r.width / r.height : 1.6, c = { az: cfg.cam.az, el: cfg.cam.el, dist: cfg.cam.dist * (asp < 0.8 ? 0.66 : asp < 1.15 ? 0.82 : 1), t: cfg.cam.t.slice() };
    view.lockCam = true; if (keepOrbit && S && S.orbited) return; view.setHome(c); }
  /* ----- first person: the camera stands where the applicator stands, the tools are held from it, the crew's man is you ----- */
  var LAMP = null, CV = new THREE.Vector3(), CF = new THREE.Vector3(), CR = new THREE.Vector3(), CU = new THREE.Vector3(0, 1, 0);
  function fovFor() { var r = rect(), asp = r.height ? r.width / r.height : 1.6, f = S && S.look ? S.look.fov : (cfg.fps.fov || 58); return Math.max(30, Math.min(95, f + (asp < 0.8 ? 16 : asp < 1.15 ? 8 : 0))); } /* a tall screen sees less sideways: a wider lens on phones held upright */
  /* (V82) the step back: where the work of a phase reaches the floor in front of you (a floor band, the strip at the wall's foot), you stand far enough back to see its near edge at your lowest look — otherwise it would lie under your feet or behind you */
  function needBack(p) { if (!cfg.fps || !p || (p.kind !== 'drive' && p.kind !== 'paint' && p.kind !== 'hold')) return 0; var Z = []; try { Z = zoneMeshes(p) || []; } catch (e) { return 0; } if (!Z.length) return 0;
    var F = cfg.fps, bb = new THREE.Box3(), half = (F.fov || 58) * Math.PI / 360, th = -((F.pitchLim || [-0.8, 0.5])[0] - 0.65 * half), zmax = -1e9, yAt = 0; Z.forEach(function (m) { bb.setFromObject(m); if (isFinite(bb.max.z) && bb.max.z > zmax) { zmax = bb.max.z; yAt = bb.min.y; } }); if (zmax < -1e8) return 0;
    var h = Math.max(0.05, F.pos[1] - yAt), zc = th < Math.PI / 2 - 0.02 ? zmax + h / Math.tan(th) : zmax - h * Math.tan(th - Math.PI / 2); return Math.max(0, Math.min(F.backMax || 0.8, zc - F.pos[2])); }
  /* (V82) a paint phase opens with its whole coat in view: the look turns (and the lens widens, up to its widest) so that the wall and the floor band in front of it are seen together — eased, and given up the moment you take the view yourself */
  function frameCoat() { if (!cfg.fps || !S || !S.look || !S.paint || !S.paint.meshes) return; var F = cfg.fps, P0 = new THREE.Vector3(F.pos[0], F.pos[1], F.pos[2] + (S.backTo || 0)), yl = F.yawLim || 1.3, pl = F.pitchLim || [-0.8, 0.5], ys = [], ps = [], v = new THREE.Vector3();
    S.paint.meshes.forEach(function (me) { var g = me.geometry; if (!g) return; g.computeBoundingBox(); var bb = g.boundingBox, z = (bb.min.z + bb.max.z) / 2, i, j; me.updateMatrixWorld(true); for (i = 0; i <= 4; i++) for (j = 0; j <= 4; j++) { v.set(bb.min.x + (bb.max.x - bb.min.x) * (0.04 + 0.92 * i / 4), bb.min.y + (bb.max.y - bb.min.y) * (0.04 + 0.92 * j / 4), z).applyMatrix4(me.matrixWorld).sub(P0); ys.push(Math.atan2(-v.x, -v.z)); ps.push(Math.atan2(v.y, Math.hypot(v.x, v.z))); } });
    if (!ys.length) return; var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), p0 = Math.min.apply(null, ps), p1 = Math.max.apply(null, ps), r = rect(), asp = r.height ? r.width / r.height : 1.6, need = (p1 - p0) * 1.12, needH = (y1 - y0) * 1.12;
    var fv = Math.max(need, 2 * Math.atan(Math.tan(needH / 2) / asp)) * 180 / Math.PI, fov = Math.max(F.fov || 58, Math.min(84, fv)), half = fov * Math.PI / 360, pc = (p0 + p1) / 2;
    if (fv > 84) pc = Math.min(p1 - half * 0.92, Math.max(p0 + half * 0.92, pc)); /* (when it cannot all be seen, the wall's top stays in view and the floor's near edge is left to the brush at the bottom of the screen) */
    S.lookTo = { yaw: Math.max(-yl, Math.min(yl, (y0 + y1) / 2)), pitch: Math.max(pl[0], Math.min(pl[1], pc)), fov: fov, t: 0 }; S.framed = true; }
  function fpsCam(cam, now) {
    var F = cfg.fps, L2 = S && S.look ? S.look : { yaw: F.yaw || 0, pitch: F.pitch || 0 }, t = (now || performance.now()) / 1000, bob = S && (S.hold || S.engaged) ? 0.003 : 0.0015;
    cam.position.set(F.pos[0], F.pos[1] + bob * Math.sin(t * 1.7), F.pos[2] + (S && S.back ? S.back : 0)); cam.rotation.order = 'YXZ'; cam.rotation.set(L2.pitch, L2.yaw, 0);
    var f = fovFor(); if (Math.abs(cam.fov - f) > 0.01) { cam.fov = f; cam.updateProjectionMatrix(); }
    cam.updateMatrixWorld(true);
    if (LAMP) { cam.getWorldDirection(CF); LAMP.position.copy(cam.position).addScaledVector(CU, 0.12); LAMP.target.position.copy(cam.position).addScaledVector(CF, 3); LAMP.target.updateMatrixWorld(true); }
  }
  function fpsScene() { /* a site lamp over the shoulder, the room's backdrop and haze: the sample is lit like a workplace, not a showcase */
    var sc = view.dbg && view.dbg.scene, r = view.dbg && view.dbg.renderer; if (!sc) return;
    LAMP = new THREE.SpotLight(0xfff1dc, 0.55, 9, 0.95, 0.55, 1.4); LAMP.castShadow = false; sc.add(LAMP); sc.add(LAMP.target);
    var bg = cfg.fps.bg != null ? cfg.fps.bg : 0x2e3843; if (r) { r.userData.bg = bg; r.userData.backdrop = bg; r.setClearColor(screenColor(bg), 1); r.userData.onTheme = function () { r.setClearColor(screenColor(bg), 1); }; }
    if (cfg.fps.fog !== false) sc.fog = new THREE.Fog(screenColor(bg), cfg.fps.fogNear || 3.5, cfg.fps.fogFar || 11);
  }
  /* the tool the stage holds, re-held from the camera: aimed tools point from the hand to the work, pressed tools lie on the work with the handle towards the hand */
  var HP = new THREE.Vector3(), HD = new THREE.Vector3(), HI = new THREE.Vector3();
  function fpsHold() {
    var m = member(), c = cam(); if (!m || !c || !m.kit) return; var cw = m.crew ? m.crew() : null, tool = cw ? cw.tool() : null, K = m.kit; if (!tool || !tool.visible) return;
    c.getWorldDirection(CF); CR.crossVectors(CF, CU).normalize(); HP.copy(c.position).addScaledVector(CR, 0.22).addScaledVector(CU, -0.26).addScaledVector(CF, 0.1); /* the hand: right of the eye, below it, a little forward */
    var par = tool.parent || m.group; par.updateMatrixWorld(true); par.worldToLocal(HP);
    var A = tool.userData.lastAim, P2 = tool.userData.lastPress; tool.userData.reHold = true;
    if (A) { HI.set(A.impact[0], A.impact[1], A.impact[2]); HD.subVectors(HP, HI); var dist = HD.length(); HD.normalize(); var so = Math.min(A.standoff, Math.max(0.05, dist - 0.35)); K.aim(tool, A.impact, HD, so, 0); }
    else if (P2) { /* a pressed tool: its contact stays on the work, its body (local −z) runs to the hand, the head turned flat-ish to the surface by the look-at's up vector */
      tool.position.set(P2.x, P2.y, P2.z); HI.set(P2.x, P2.y, P2.z); par.localToWorld(HI); HD.copy(HP); par.localToWorld(HD); HD.sub(HI); var len = HD.length() || 1; HD.multiplyScalar(1 / len);
      HI.addScaledVector(HD, -Math.max(0.3, len)); tool.up.set(P2.floor ? 0 : 0, P2.floor ? 0 : 1, P2.floor ? -1 : 0); tool.lookAt(HI); tool.up.set(0, 1, 0); tool.visible = true; }
    tool.userData.reHold = false; /* the re-hold's own follow() stays pending until the next frame's begin(); the man stays hidden */
  }
  function member() { return view && view.dbg ? view.dbg.member : null; }
  function cam() { return view && view.dbg ? view.dbg.cam : null; }
  function stages() { return cfg.view === 'pf' ? PF_STAGES[cfg.scenario] : cfg.view === 'ca' ? CA_STAGES[cfg.scenario] : STG(cfg.scenario); }
  function stageIndex(id) { return Math.max(0, stages().indexOf(id)); }
  /* the sample shown as a phase needs it: a stage frozen at tw, or the finished picture of the last stage */
  function showStage(id, tw) { if (!view) return; var i = stageIndex(id); if (view.stage() !== i || S.shown !== id) { view.setStage(i, true); S.shown = id; } view.freeze(tw); }

  /* ----- run state ----- */
  function fresh() {
    var m = {}, k; for (k in cfg.mats) m[k] = { mixed: false, pot: 0, potOn: false, step: 0, hold: 0, mature: 0, batches: 0 };
    return { look: cfg.fps ? { yaw: cfg.fps.yaw || 0, pitch: cfg.fps.pitch || 0, fov: cfg.fps.fov || 58 } : null, drag: null, phase: 0, tool: -1, score: 0, t0: performance.now(), clock: cfg.clock0 || 7.5, hold: null, ptr: null, mats: m, mixing: false, mixKey: null, pend: 0, shown: null, tw: 0, cons: {}, notes: [], quiz: null, fin: false, lapse: null, paint: null, warned: {}, lastFeed: 0, play: null, engaged: false, moved: 0, pp: null, pv: 0 };
  }
  function needsOf(p) { return !p.needs ? [] : typeof p.needs === 'string' ? [p.needs] : p.needs; }
  function tw0() { var p = ph(); return p.from != null ? p.from : 0; }
  function tw1() { var p = ph(); return p.to != null ? p.to : 1; }
  function need() { var p = ph(), t = p.tool; return t == null ? null : (t.length != null ? t : [t]); }
  function toolOk() { var n = need(); return !n || n.indexOf(S.tool) >= 0; }
  function isLook() { return S.tool === cfg.tools.length; }

  /* ----- HUD ----- */
  function hud() {
    var l = L(), t = PT(), p = ph(), n = cfg.phases.length;
    el.hsPhase.textContent = l.phase + ' ' + (S.phase + 1) + ' ' + l.of + ' ' + n + ' — ' + t.n; if (!S.lapse) el.hsPrompt.textContent = t.p;
    var c = '';
    if (p.kind === 'drive' || p.kind === 'play') { c = Math.round(100 * E((S.tw - tw0()) / Math.max(1e-6, tw1() - tw0()))) + ' % · ' + t.c; var ndH = need(); if (p.kind === 'drive' && ndH) c += ' · ' + (toolOk() ? l.toolOn + ': ' + toolName(S.tool) + ' ✓ · ' + (S.engaged ? l.aimOn : l.aimOff) : l.toolPick + ': ' + toolName(ndH[0]) + ' →'); }
    else if (p.kind === 'paint' && S.paint) { var P2 = S.paint, cov = Math.round(100 * P2.cover), k = (P2.kgm2()).toFixed(2); c = l.covered.replace('{c}', cov).replace('{k}', k).replace('{t}', p.paint.rate.toFixed(2)); }
    else c = t.c || '';
    el.hsCount.textContent = c; el.hsScore.textContent = S.score; el.hsClock.textContent = clock();
    var nd = need(), first = nd ? nd[0] : -1;
    [].forEach.call(el.hsTools.children, function (b, i) { b.setAttribute('aria-pressed', i === S.tool ? 'true' : 'false'); b.classList.toggle('is-next', nd && nd.indexOf(i) >= 0 && i !== S.tool && !S.mixKey && !S.quiz); });
    el.hsToolName.textContent = S.tool >= 0 ? toolName(S.tool) : (first >= 0 ? toolName(first) + ' →' : '');
    var tb = el.hsTools.children[S.tool >= 0 ? S.tool : first]; if (tb && tb.scrollIntoView && el.hsTools.scrollWidth > el.hsTools.clientWidth + 4) { try { tb.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} }
    var pk = needsOf(p), on = null; pk.forEach(function (k) { if (!on && S.mats[k].potOn) on = k; });
    el.hsPot.hidden = !on; if (on) { var m = S.mats[on], s = Math.max(0, Math.round(m.pot)); el.hsPotName.textContent = l.pot + ' · ' + MT(on).name; el.hsPotTime.textContent = fmt(s); el.hsPotBar.style.width = (100 * s / (mat(on).pot * 60)) + '%'; el.hsPot.classList.toggle('is-low', s < 300); if (s < 300 && s > 0 && !S.warned['pot' + on]) { S.warned['pot' + on] = 1; snd('warn'); } }
  }
  function toolName(i) { var tt = T().tools; return i < tt.length ? tt[i] : L().look; }
  function feed(msg, bad) { var lastEl = el.hsFeed.lastChild; if (lastEl && lastEl.textContent === msg) { el.hsFeed.removeChild(lastEl); } var d = document.createElement('div'); d.textContent = msg; if (bad) d.className = 'bad'; el.hsFeed.appendChild(d); while (el.hsFeed.children.length > 3) el.hsFeed.removeChild(el.hsFeed.firstChild); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 4200); }
  function snd(name, arg) { if (HASA) HSA.event(name, arg); } /* an event's sound */
  function sndFor(p, tool) { /* the sound of the tool at work in this phase: the phase's own say, the simulator's, or the tool kind's */
    var ov = p.snd; if (typeof ov === 'string') return ov; if (ov && ov[tool] != null) return ov[tool]; var k = cfg.tools[tool]; if (!k) return null; if (cfg.snd && cfg.snd[k] !== undefined) return cfg.snd[k]; return HSA_TOOLSND[k] || null; }
  function hint(key) { var now = performance.now(); if (now - feedAt < 2400) return; feedAt = now; feed(L()[key] || key, false); }
  function addScore(n) { S.score = Math.max(0, S.score + n); }
  function toolbar() {
    var tt = T().tools; el.hsTools.innerHTML = '';
    cfg.tools.forEach(function (k, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'sim__tool'; b.innerHTML = '<kbd>' + (i + 1) + '</kbd><svg viewBox="0 0 24 24" aria-hidden="true">' + (HSIM_ICONS[k] || HSIM_ICONS.hand) + '</svg><span>' + tt[i] + '</span>'; b.addEventListener('click', function () { S.tool = i; hud(); snd('click'); }); el.hsTools.appendChild(b); });
    var lk = document.createElement('button'); lk.type = 'button'; lk.className = 'sim__tool'; lk.innerHTML = '<kbd>' + (cfg.tools.length + 1) + '</kbd><svg viewBox="0 0 24 24" aria-hidden="true">' + HSIM_ICONS.look + '</svg><span>' + L().look + '</span>'; lk.addEventListener('click', function () { S.tool = cfg.tools.length; hud(); snd('click'); }); el.hsTools.appendChild(lk);
    el.hsView.setAttribute('aria-label', L().view); el.hsView.title = L().view; el.hsZin.setAttribute('aria-label', L().zin); el.hsZout.setAttribute('aria-label', L().zout); el.hsLook.textContent = L().site;
  }

  /* ----- mixing: the material of a phase is mixed in its panel; the pot life then runs with the work ----- */
  function unmixed() { var p = ph(), pk = needsOf(p), k; for (k = 0; k < pk.length; k++) if (!S.mats[pk[k]].mixed) return pk[k]; return null; }
  function mixPanel() {
    var p = ph(), key = (p.kind === 'drive' || p.kind === 'paint' || p.kind === 'hold') && !S.lapse && !S.fin ? unmixed() : null;
    S.mixKey = key; if (S.quiz) return; /* the quiz owns the panel */ el.hsMix.hidden = !key; if (!key) return;
    var m = mat(key), st = S.mats[key], l = L(), mt = MT(key), steps = m.steps, i = st.step, h = '<h3>' + l.mixTitle.replace('{P}', mt.name) + '</h3><ol>';
    steps.forEach(function (sp, k) { h += '<li' + (k < i ? ' class="done"' : '') + '>' + mt.steps[k] + '</li>'; }); h += '</ol>';
    var sp = steps[i];
    if (sp && sp.k === 'hold') h += '<div class="sim__mixbar"><u id="hsMixU" style="width:' + Math.round(st.hold / sp.s * 100) + '%"></u></div><button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + l.mixHold + ' · <span id="hsMixClock">' + fmt(st.hold * sp.real / sp.s) + '</span> / ' + fmt(sp.real) + '</button>';
    else if (sp && sp.k === 'mature') h += '<div class="sim__mixbar"><u id="hsMixU" style="width:' + Math.round(st.mature / sp.s * 100) + '%"></u></div><p class="hsim__mixnote">' + l.mixMature + ' <span id="hsMixClock">' + fmt(st.mature * sp.real / sp.s) + '</span> / ' + fmt(sp.real) + '</p>';
    else if (sp && sp.k === 'slider') h += '<label class="hsim__slider"><span>' + (mt.slider || '') + ' <b id="hsSlVal">' + sp.v0 + '</b> ' + sp.unit + '</span><input type="range" id="hsSl" min="' + sp.min + '" max="' + sp.max + '" step="' + sp.step + '" value="' + sp.v0 + '"></label><button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + l.set + '</button>';
    else if (sp) h += '<button class="sb-btn sb-btn--primary" type="button" id="hsMixBtn">' + (sp.k === 'done' ? l.mixDone : (mt.btn && mt.btn[i]) || l.mixNext) + '</button>';
    if (mt.note) h += '<p class="hsim__mixnote">' + mt.note + '</p>';
    el.hsMix.innerHTML = h; var b = document.getElementById('hsMixBtn');
    if (!b) return;
    if (sp.k === 'hold') { var on = function (e) { e.preventDefault(); S.mixing = true; }, off = function () { S.mixing = false; }; b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); S.mixing = true; } }); b.addEventListener('keyup', off); }
    else if (sp.k === 'slider') { var inp = document.getElementById('hsSl'), val = document.getElementById('hsSlVal'); inp.addEventListener('input', function () { val.textContent = inp.value; }); b.addEventListener('click', function () { var v = parseFloat(inp.value), ok = v >= sp.ok[0] && v <= sp.ok[1]; if (ok) { addScore(100); feed(l.doseOk); snd('doseOk'); } else { addScore(-50); feed(l.doseBad + (mt.sliderBad ? ' ' + mt.sliderBad : ''), true); S.notes.push((mt.name) + ': ' + v + ' ' + sp.unit); snd('doseBad'); } st.step++; mixStep(key); }); }
    else b.addEventListener('click', function () { st.step++; mixStep(key); snd('click'); });
    b.focus();
  }
  function mixStep(key) { var m = mat(key), st = S.mats[key]; if (st.step >= m.steps.length) { st.mixed = true; st.potOn = true; st.pot = m.pot * 60; st.batches++; addScore(100); feed(L().potGo.replace('{P}', MT(key).name).replace('{m}', m.pot)); delete S.warned['pot' + key]; snd('ding'); } mixPanel(); hud(); }
  function needsNow(k) { var p = ph(), pk = needsOf(p); return pk.indexOf(k) >= 0; }
  function potTick(dt) { /* a batch that sets in the bucket while it is still wanted costs points and a fresh batch; one no longer needed simply goes off */
    var k; for (k in S.mats) { var st = S.mats[k]; if (!st.potOn) continue; st.pot -= dt * RATE; if (st.pot <= 0) { st.potOn = false; st.mixed = false; st.step = 0; st.hold = 0; st.mature = 0; if (needsNow(k)) { addScore(-200); feed(L().potOut.replace('{P}', MT(k).name), true); S.hold = null; el.hsRing.hidden = true; el.hsTip.hidden = true; mixPanel(); snd('potOut'); } } }
  }
  function fmtH(h) { var l = L(); return h >= 24 ? (Math.round(h / 24 * 10) / 10) + ' ' + l.days : (Math.round(h * 10) / 10) + ' ' + l.hours; }
  function expireAll() { var k; for (k in S.mats) { var st = S.mats[k]; if (st.mixed) { st.mixed = false; st.potOn = false; st.step = 0; st.hold = 0; st.mature = 0; } } }

  /* ----- quizzes and dosing: a question the data sheet answers ----- */
  function quizPanel() {
    var p = ph(), l = L(); if (p.kind !== 'quiz' && p.kind !== 'dose') { S.quiz = null; return; }
    var t = PT(); S.quiz = true; el.hsMix.hidden = false; var h = '<h3>' + t.n + '</h3><p class="hsim__q">' + t.q + '</p>';
    if (p.kind === 'quiz') { h += '<div class="hsim__opts">'; t.opts.forEach(function (o, i) { h += '<button class="sb-btn sb-btn--secondary" type="button" data-opt="' + i + '">' + o + '</button>'; }); h += '</div>'; }
    else h += '<label class="hsim__slider"><span>' + t.label + ' <b id="hsSlVal">' + p.dose.v0 + '</b> ' + p.dose.unit + '</span><input type="range" id="hsSl" min="' + p.dose.min + '" max="' + p.dose.max + '" step="' + p.dose.step + '" value="' + p.dose.v0 + '"></label><button class="sb-btn sb-btn--primary" type="button" id="hsDoseBtn">' + l.set + '</button>';
    el.hsMix.innerHTML = h;
    if (p.kind === 'quiz') [].forEach.call(el.hsMix.querySelectorAll('[data-opt]'), function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-opt'); if (i === p.ok) { addScore(100); feed(l.quizOk + ' ' + (t.why || '')); snd('quizOk'); } else { addScore(-50); feed(l.quizBad + (t.why || ''), true); S.notes.push(t.n + ': ' + t.opts[i]); snd('quizBad'); } S.quiz = null; el.hsMix.hidden = true; nextPhase(); }); });
    else { var inp = document.getElementById('hsSl'), val = document.getElementById('hsSlVal'); inp.addEventListener('input', function () { val.textContent = inp.value; }); document.getElementById('hsDoseBtn').addEventListener('click', function () { var v = parseFloat(inp.value), ok = v >= p.dose.ok[0] && v <= p.dose.ok[1]; if (ok) { addScore(100); feed(l.doseOk + ' ' + (t.why || '')); snd('doseOk'); } else { addScore(-50); feed(l.doseBad + ' ' + (t.why || ''), true); S.notes.push(t.n + ': ' + v + ' ' + p.dose.unit); snd('doseBad'); } S.cons[t.n] = v + ' ' + p.dose.unit; S.quiz = null; el.hsMix.hidden = true; nextPhase(); }); }
    var fb = el.hsMix.querySelector('button'); if (fb) fb.focus();
  }

  /* ----- phases ----- */
  function enterPhase() {
    var p = ph(); S.hold = null; S.engaged = false; S.tw = tw0(); S.paint = null; S.lapse = null; S.play = null; el.hsRing.hidden = true; el.hsTip.hidden = true;
    if (p.stage) showStage(p.stage, p.kind === 'paint' ? 0.002 : S.tw);
    if (cfg.fps && (p.kind === 'drive' || p.kind === 'paint' || p.kind === 'hold')) S.backTo = needBack(p);
    if (p.kind === 'paint') { S.paint = makePaint(p); if (S.paint) frameCoat(); if (S.paint && cfg.fps && S.warned && !S.warned.edge) { S.warned.edge = true; setTimeout(function () { if (open && S && S.paint && !S.paint.done) feed(L().edge, false); }, 1800); } }
    else if (S.framed && cfg.fps && S.look) { S.framed = false; S.lookTo = { yaw: cfg.fps.yaw || 0, pitch: cfg.fps.pitch || 0, fov: cfg.fps.fov || 58, t: 0 }; } /* (V82) after the coat, the view comes back to its own lens and level */
    if (p.kind === 'wait') { S.lapse = { t: 0, dur: p.secs || 2.6, h0: S.clock, h1: S.clock + p.hours }; expireAll(); if (p.stage) showStage(p.stage, 1); snd('lapse', S.lapse.dur); }
    if (p.kind === 'play') { var i = stageIndex(p.stage); view.setStage(i, true); view.settle(); view.setStage(i, false); S.shown = p.stage; S.play = { t: 0, dur: view.duration ? view.duration() : 2 }; }
    if (view && view.reset && p.reset) view.reset();
    quizPanel(); mixPanel(); hud(); boxShow();
  }
  function nextPhase() {
    var t = PT(); if (t.done) feed(t.done); addScore(150); vib([20, 40, 20]);
    if (S.phase >= cfg.phases.length - 1) { finish(); return; }
    S.phase++; enterPhase();
  }
  function completeWork() { /* a drive or paint phase done: the finished picture of its stage from now on */
    var p = ph(); if (p.kind === 'paint' && S.paint) { S.paint.finish(); S.cons[p.paint.label || p.id] = { kg: S.paint.kgm2(), rate: p.paint.rate, cover: S.paint.cover }; var q = S.paint.quality(); addScore(q); }
    if (p.stage && (p.to == null || p.to >= 0.999)) showStage(p.stage, 1);
    S.hold = null; el.hsRing.hidden = true; snd('done'); nextPhase();
  }

  /* ----- pointer: the zone of the work, the head of the tool, the man ----- */
  function rect() { return canvas.getBoundingClientRect(); }
  /* (V82) the lowest height of the view where the work can be reached: above the tool bar (a ring under the bar cannot be taken), as a share of the view (-1 … 1) */
  function safeLow() { var r = rect(), tb = el.hsTools ? el.hsTools.getBoundingClientRect() : null; if (!r.height || !tb || !tb.height) return -0.95; return Math.min(0.2, -1 + 2 * Math.max(0, r.bottom - tb.top + 12) / r.height); }
  function toScreen(wp) { var c = cam(), r = rect(); if (!c) return null; V3b.copy(wp).project(c); if (V3b.z > 1) return null; return { x: r.left + (V3b.x + 1) / 2 * r.width, y: r.top + (1 - V3b.y) / 2 * r.height }; }
  function headPos() { /* where the work is: the stage's own callout anchor at this moment (the tool at work), else the tool the man holds, or the man himself (flooring crews) — a world point */
    var p = ph(), m = member();
    if (p.follow !== 'men' && p.follow !== 'zone' && m && m.anchors && p.stage) { var cwT = m.crew ? m.crew() : null; if (cwT && !cwT.tool()) return null; /* no tool at work this moment (between sub-phases): the marked area is the work */ var aw = anchorAt(S.tw); if (aw) return aw; }
    if (p.follow === 'men' && view.dbg && view.dbg.parts) { var C = view.dbg.parts().crew, best = null, bd = 1e9, pt = S.ptr, off = null; if (!C) return null; C.all.forEach(function (w) { if (!w.userData.man || !w.visible) return; w.getWorldPosition(V3); V3.y += 0.9; var sp = toScreen(V3); if (!sp) { if (!off) off = V3.clone(); return; } var d = pt ? Math.hypot(sp.x - pt.x, sp.y - pt.y) : 0; if (d < bd) { bd = d; best = V3.clone(); } }); return best || off; } /* (V84) a crew wholly behind the viewer still is the work: the look can turn to him */
    if (p.follow === 'zone' || !m || !m.crew) return null;
    var cw = m.crew(), tool = cw ? cw.tool() : null; if (!tool || !tool.visible) return null; tool.getWorldPosition(V3); return V3.clone();
  }
  function anchorAt(tw) { /* the stage's own callout anchor at a moment: the tool at work — a world point, or null */
    var p = ph(), m = member(); if (!m || !m.anchors || !p.stage) return null; try { var A = m.anchors(p.stage, tw); if (A && A.length) { V3.set(A[0].p[0], A[0].p[1], A[0].p[2]).applyMatrix4(m.group.matrixWorld); return V3.clone(); } } catch (e) {} return null;
  }
  function zoneHit(e) { return zoneHitAt(e.clientX, e.clientY); }
  function zoneHitAt(cx, cy) { /* the pointer over the work zone of the phase: the zone planes (drive) or the coat's faces (paint) */
    var p = ph(), c = cam(), r = rect(); if (!c) return null; V2.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(V2, c);
    if (p.kind === 'paint' && S.paint) { var hits = ray.intersectObjects(S.paint.meshes, false); return hits.length ? hits[0] : null; }
    var Z = zoneMeshes(p); if (!Z.length) return { any: true };
    var hz = ray.intersectObjects(Z, false); return hz.length ? hz[0] : null;
  }
  var zoneCache = {};
  function zoneCentre(p) { /* (V84) the middle of the phase's work zone — a world point, or null */
    var Z = []; try { Z = zoneMeshes(p) || []; } catch (e) { return null; } if (!Z.length) return null; var key = 'c:' + p.id; if (zoneCache[key]) return zoneCache[key];
    var bb = new THREE.Box3(); Z.forEach(function (me) { me.updateMatrixWorld(true); bb.expandByObject(me); }); if (bb.isEmpty()) return null; var c = new THREE.Vector3(); bb.getCenter(c); zoneCache[key] = c; return c;
  }
  function zoneMeshes(p) {
    if (!p.zone) return [];
    var key = p.id; if (zoneCache[key]) return zoneCache[key];
    var m = member(), g = m ? m.group : (view.dbg && view.dbg.scene), list = [], zs = typeof p.zone === 'function' ? p.zone(m, view) : (typeof p.zone === 'string' ? [p.zone] : p.zone); if (!g) return [];
    zs.forEach(function (z) {
      if (typeof z === 'string') z = cfg.zones[z]; if (!z) return;
      var geo, me, mm = new THREE.MeshBasicMaterial({ visible: false });
      if (z.kind === 'wall') { geo = new THREE.PlaneGeometry(z.x1 - z.x0, z.y1 - z.y0); me = new THREE.Mesh(geo, mm); me.position.set((z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2, z.z); if (z.ry) me.rotation.y = z.ry; }
      else if (z.kind === 'side') { geo = new THREE.PlaneGeometry(z.z1 - z.z0, z.y1 - z.y0); me = new THREE.Mesh(geo, mm); me.rotation.y = -Math.PI / 2; me.position.set(z.x, (z.y0 + z.y1) / 2, (z.z0 + z.z1) / 2); }
      else { geo = new THREE.PlaneGeometry(z.x1 - z.x0, z.z1 - z.z0); me = new THREE.Mesh(geo, mm); me.rotation.x = -Math.PI / 2; me.position.set((z.x0 + z.x1) / 2, z.y, (z.z0 + z.z1) / 2); }
      me.userData.noHit = true; g.add(me); list.push(me);
    });
    zoneCache[key] = list; return list;
  }
  function pdist() { var k = Object.keys(PTRS); if (k.length < 2) return 0; var a = PTRS[k[0]], b = PTRS[k[1]]; return Math.hypot(a.x - b.x, a.y - b.y); }
  function down(e) {
    if (!open) return; PTRS[e.pointerId] = { x: e.clientX, y: e.clientY }; if (HASA) HSA.resume();
    if (Object.keys(PTRS).length === 2) { /* a second finger: the hold ends, the pinch zooms, the view's own drag gets no more moves */ if (S && S.hold) { S.hold = null; el.hsRing.hidden = true; if (S.paint) S.paint.lift(); } pinch = { d: pdist() }; e.stopImmediatePropagation(); e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch (er) {} return; }
    if (!el.hsCard.hidden || S.quiz) return; var p = ph(); S.ptr = { x: e.clientX, y: e.clientY };
    if (isLook() || (p.kind !== 'drive' && p.kind !== 'paint' && p.kind !== 'hold')) { S.orbited = true; if (cfg.fps) { S.drag = { x: e.clientX, y: e.clientY }; e.stopImmediatePropagation(); try { canvas.setPointerCapture(e.pointerId); } catch (er) {} } return; } /* the view orbits (third person) or the look turns (first person) */
    S.moved = performance.now(); var hp = (p.kind === 'drive' || p.kind === 'hold') ? headPos() : null, sp = hp ? toScreen(hp) : null, tol0 = tolFor(e.pointerType);
    var hit = sp ? (Math.hypot(sp.x - e.clientX, sp.y - e.clientY) <= tol0 ? { head: true } : null) : zoneHit(e); /* a ring on screen: the ring is the work, a press anywhere else turns the look; no ring: the marked area is the work */ if (!hit) { S.orbited = true; if (cfg.fps) { S.drag = { x: e.clientX, y: e.clientY }; e.stopImmediatePropagation(); try { canvas.setPointerCapture(e.pointerId); } catch (er) {} } return; } /* off the work: the view orbits, or the look turns */
    e.stopImmediatePropagation(); e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
    if (S.mixKey) { hint('notMixed'); return; }
    if (!toolOk()) { var nd = need(); feed(L().wrongTool + toolName(nd[0]), true); addScore(-25); vib(30); hud(); snd('bad'); return; }
    S.hold = { id: e.pointerId, hit: hit, t: 0, ptype: e.pointerType }; if (S.hold) boxOpen(false); if (p.kind === 'paint' && S.paint) S.paint.stroke(hit);
    el.hsRing.hidden = false; el.hsRing.style.left = e.clientX + 'px'; el.hsRing.style.top = e.clientY + 'px';
  }
  function move(e) {
    if (PTRS[e.pointerId]) PTRS[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (pinch) { e.stopImmediatePropagation(); var d = pdist(); if (d > 10 && pinch.d > 10 && view) { zoomBy(pinch.d / d); S.orbited = true; } if (d > 10) pinch.d = d; return; }
    if (!S) return; S.ptr = { x: e.clientX, y: e.clientY }; S.moved = performance.now();
    if (S.drag && cfg.fps) { e.stopImmediatePropagation(); var F = cfg.fps, yl = F.yawLim || 1.3, pl = F.pitchLim || [-0.8, 0.5], k = (e.pointerType === 'touch' ? 0.0045 : 0.0035) * (fovFor() / 58); S.look.yaw = Math.max(-yl, Math.min(yl, S.look.yaw - (e.clientX - S.drag.x) * k)); S.look.pitch = Math.max(pl[0], Math.min(pl[1], S.look.pitch - (e.clientY - S.drag.y) * k)); S.drag = { x: e.clientX, y: e.clientY }; return; }
    if (!S.hold) return; e.stopImmediatePropagation();
    var p = ph(); if (p.kind === 'paint' && S.paint) { var hit = zoneHit(e); S.hold.hit = hit; if (hit) S.paint.at(hit); else S.paint.lift(); }
    else S.hold.hit = zoneHit(e);
  }
  function up(e) { delete PTRS[e.pointerId]; if (pinch && Object.keys(PTRS).length < 2) pinch = null; if (!S) return; S.moved = performance.now(); if (S.drag) { S.drag = null; if (cfg.fps) e.stopImmediatePropagation(); } if (S.hold && S.hold.id === e.pointerId) { e.stopImmediatePropagation(); S.hold = null; if (ph().kind === 'paint') el.hsRing.hidden = true; if (S.paint) S.paint.lift(); } }
  function key(e) { if (!open) return; if (e.key === 'Escape') { self.close(); return; } if ((e.key === 'm' || e.key === 'M') && HASA && document.activeElement && document.activeElement.tagName !== 'INPUT') { HSA.init(); HSA.toggle(); return; } var n = parseInt(e.key, 10); if (n >= 1 && n <= cfg.tools.length + 1 && el.hsCard.hidden && document.activeElement && document.activeElement.tagName !== 'INPUT') { S.tool = n - 1; hud(); snd('click'); } }

  /* ----- the frame: progress of the held work, the clock, the pot lives, the time lapses ----- */
  var AQ = { k: null, l: 1, s: null }; /* the sound of this frame: the tool at work, its level, the stroke speed */
  function frame(now) { AQ.k = null; AQ.l = 1; AQ.s = null; tickBody(now); if (open && HASA) HSA.work(AQ.k, AQ.l, AQ.s); }
  function tickBody(now) {
    if (!open) return; var raw = last ? now - last : 0, dt = Math.min(0.3, raw / 1000); last = now; raf = requestAnimationFrame(frame);
    if (!el.hsCard.hidden) return;
    if (S.ptr) { if (S.pp && S.pp !== S.ptr) { var dpx = Math.hypot(S.ptr.x - S.pp.x, S.ptr.y - S.pp.y); S.pv += (dpx / Math.max(dt, 1e-3) - S.pv) * 0.35; } else if (S.pp === S.ptr) S.pv *= 0.8; S.pp = S.ptr; } else S.pv = 0; /* the pointer's speed, px/s, for the stroke of a hand tool */
    var p = ph(), l = L();
    if (S.lapse) { var W = S.lapse; W.t += dt; var f = E(W.t / W.dur), e2 = f * f * (3 - 2 * f); S.clock = W.h0 + (W.h1 - W.h0) * e2; el.hsPrompt.textContent = PT().p; el.hsClock.textContent = clock(); el.hsCount.textContent = '+ ' + fmtH(S.clock - W.h0); if (f >= 1) { S.lapse = null; nextPhase(); } return; }
    if (S.play) { S.play.t += dt; S.clock += dt / 60; var prP = view.progress ? view.progress() : 0.5; if (p.snd) { AQ.k = p.snd; AQ.l = p.snd === 'heal' ? 1 - prP : p.snd === 'car' ? prP : 1; } if (prP >= 0.999) { S.play = null; addScore(50); if (p.stage) showStage(p.stage, 1); nextPhase(); } else hud(); return; }
    if (S.mixing && S.mixKey) { var m = mat(S.mixKey), st = S.mats[S.mixKey], sp = m.steps[st.step]; if (sp && sp.k === 'hold') { AQ.k = 'mixer'; st.hold = Math.min(sp.s, st.hold + dt); var u = document.getElementById('hsMixU'), c = document.getElementById('hsMixClock'); if (u) u.style.width = (st.hold / sp.s * 100) + '%'; if (c) c.textContent = fmt(st.hold * sp.real / sp.s); if (st.hold >= sp.s) { S.mixing = false; st.step++; addScore(50); mixStep(S.mixKey); } } }
    if (S.mixKey) { var m2 = mat(S.mixKey), st2 = S.mats[S.mixKey], sp2 = m2.steps[st2.step]; if (sp2 && sp2.k === 'mature') { st2.mature = Math.min(sp2.s, st2.mature + dt); S.clock += dt * (sp2.real / sp2.s) / 3600; var u2 = document.getElementById('hsMixU'), c2 = document.getElementById('hsMixClock'); if (u2) u2.style.width = (st2.mature / sp2.s * 100) + '%'; if (c2) c2.textContent = fmt(st2.mature * sp2.real / sp2.s); if (st2.mature >= sp2.s) { st2.step++; mixStep(S.mixKey); } } }
    potTick(dt);
    if (S.backTo != null && Math.abs((S.back || 0) - S.backTo) > 1e-4) S.back = (S.back || 0) + (S.backTo - (S.back || 0)) * Math.min(1, dt * 3.5); /* (the step back, taken in about a second) */
    if (S.lookTo && S.look) { if (S.drag || S.hold || pinch) S.lookTo = null; else { var LT = S.lookTo, kE = Math.min(1, dt * 5); LT.t += dt; S.look.yaw += (LT.yaw - S.look.yaw) * kE; S.look.pitch += (LT.pitch - S.look.pitch) * kE; S.look.fov += (LT.fov - S.look.fov) * kE; if (LT.t > 1.4) S.lookTo = null; } }
    /* (V82) painting: the brush held near an edge of the view turns the look that way, slowly, and the coat goes on under it — the far ends of a wall and the floor band in front of it are reached without changing tools */
    if (cfg.fps && S.look && !S.drag && S.hold && S.ptr && p.kind === 'paint' && S.paint) { var rrE = rect(), bnd = Math.max(36, Math.min(rrE.width, rrE.height) * 0.12), F2 = cfg.fps, yl2 = F2.yawLim || 1.3, pl2 = F2.pitchLim || [-0.8, 0.5], ux = 0, uy = 0;
      if (S.ptr.x < rrE.left + bnd) ux = -(rrE.left + bnd - S.ptr.x) / bnd; else if (S.ptr.x > rrE.right - bnd) ux = (S.ptr.x - (rrE.right - bnd)) / bnd;
      if (S.ptr.y < rrE.top + bnd) uy = -(rrE.top + bnd - S.ptr.y) / bnd; else if (S.ptr.y > rrE.bottom - bnd) uy = (S.ptr.y - (rrE.bottom - bnd)) / bnd;
      if (ux || uy) { var rE = dt * 0.75 * (fovFor() / 60), y0 = S.look.yaw, p0 = S.look.pitch; S.look.yaw = Math.max(-yl2, Math.min(yl2, S.look.yaw - Math.max(-1, Math.min(1, ux)) * rE)); S.look.pitch = Math.max(pl2[0], Math.min(pl2[1], S.look.pitch - Math.max(-1, Math.min(1, uy)) * rE));
        if (S.look.yaw !== y0 || S.look.pitch !== p0) { var hE = zoneHitAt(S.ptr.x, S.ptr.y); S.hold.hit = hE; if (hE) S.paint.at(hE); else S.paint.lift(); } } }
    if (cfg.fps && S.look && !S.drag && (!S.hold || !S.engaged) && !isLook() && (p.kind === 'drive' || p.kind === 'hold')) { /* the look drifts to the work when the hand rests, or at once when the work is off the screen: the tool at work comes to the middle of the view — never while you work, so the ring never slides away under the pointer; (V84) a hand still held down beside a ring that has left the screen or gone under the tool bar no longer pins the view: the look turns to the work */
      var hpA = headPos() || zoneCentre(p), c0 = cam(); if (hpA && c0) { V3b.copy(hpA).project(c0); /* (V84) no tool at work this moment: the marked area is where the look turns */ var behind = V3b.z > 1, offS = behind || Math.abs(V3b.x) > 0.95 || V3b.y > 0.95 || V3b.y < safeLow();
        if (offS || (!S.hold && !S.engaged && now - S.moved > 700)) { /* (V82) aimed by the work's own direction from the eye, so that work behind you or under the tool bar is turned to as well */
          var F = cfg.fps, yl = F.yawLim || 1.3, pl = F.pitchLim || [-0.8, 0.5], dx = hpA.x - c0.position.x, dy = hpA.y - c0.position.y, dz = hpA.z - c0.position.z, hfov = fovFor() * Math.PI / 360;
          var ty = Math.max(-yl, Math.min(yl, Math.atan2(-dx, -dz))), tp = Math.max(pl[0], Math.min(pl[1], Math.atan2(dy, Math.hypot(dx, dz)) + hfov * 0.12)), ry = ty - S.look.yaw, rp = tp - S.look.pitch, dead = offS ? 0 : hfov * 0.3, mx = dt * (offS ? 2.2 : 1.6);
          if (Math.abs(ry) > dead) S.look.yaw += Math.sign(ry) * Math.min(mx, Math.abs(ry) - dead); if (Math.abs(rp) > dead * 0.8) S.look.pitch += Math.sign(rp) * Math.min(mx, Math.abs(rp) - dead * 0.8); } } }
    if (p.kind === 'drive' || p.kind === 'hold') {
      var hp = headPos(), pt = S.ptr, sp3 = hp ? toScreen(hp) : null, tol = tolFor(S.hold ? S.hold.ptype : null), canWork = !S.mixKey && !S.quiz && el.hsCard.hidden, near = false, onZone = false, ok = toolOk();
      var span = tw1() - tw0(), prog = E((S.tw - tw0()) / Math.max(1e-6, span)), lead = 0;
      if (pt && !S.drag) {
        if (sp3) { var bd = Math.hypot(sp3.x - pt.x, sp3.y - pt.y);
          if (p.kind === 'drive' && !p.follow) { var stp = span * 0.025, kk; for (kk = 1; kk <= 6; kk++) { var tk = Math.min(tw1(), S.tw + stp * kk); if (tk <= S.tw + 1e-6) break; var ak = anchorAt(tk), sk = ak ? toScreen(ak) : null; if (!sk) break; var dk = Math.hypot(sk.x - pt.x, sk.y - pt.y); if (dk < bd - 1) { bd = dk; lead = kk / 6; } } } /* the pointer ahead on the tool's path counts as on the work, and pulls the tool on faster */
          near = bd <= tol * (S.engaged ? 1.5 : 1); /* once on the ring you stay on it a little further out: no flicker at the edge */ }
        onZone = !!zoneHitAt(pt.x, pt.y); }
      var aimed = sp3 ? (near || (onZone && prog > 0.92)) : onZone; /* the ring at the tool's head is the work; without a head the marked area is; the last stretch finishes from anywhere on the area */
      var engaged = canWork && ok && !S.drag && (S.hold || !COARSE) && aimed; /* a mouse works by pointing at the ring; a finger by holding on it */
      var rx = sp3 ? sp3.x : (pt ? pt.x : 0), ry = sp3 ? sp3.y : (pt ? pt.y : 0), ringOn = canWork && (!!sp3 || (!!pt && (S.hold || !COARSE)));
      el.hsRing.hidden = !ringOn; if (ringOn) { el.hsRing.style.left = rx + 'px'; el.hsRing.style.top = ry + 'px'; }
      el.hsRing.classList.toggle('is-on', engaged); el.hsRing.classList.toggle('is-wrong', canWork && !ok); el.hsRing.classList.toggle('is-near', !engaged && aimed && ok); el.hsRingArc.setAttribute('stroke-dashoffset', (188.5 * (1 - prog)).toFixed(1));
      var tip = ''; if (ringOn) { var ndT = need(); if (!ok) tip = ndT ? l.tipTool + toolName(ndT[0]) : ''; else if (engaged) tip = l.tipWork + ' · ' + Math.round(prog * 100) + ' %'; else if (sp3) tip = S.hold ? l.tipFollow : (COARSE ? l.tipHold : l.tipPoint); else tip = l.tipZone; }
      el.hsTip.hidden = !tip; if (tip) { if (tipLast !== tip) { tipLast = tip; el.hsTip.textContent = tip; } var rr = rect(); el.hsTip.style.left = Math.max(rr.left + 76, Math.min(rr.right - 76, rx)) + 'px'; el.hsTip.style.top = (ry + (COARSE ? 56 : 48)) + 'px'; } /* the tip stays inside the screen even when the ring is at its edge */
      if (canWork && aimed && !ok) { var ndF = need(); if (ndF) { var nowT = performance.now(); if (nowT - feedAt > 2400) { feedAt = nowT; feed(l.wrongTool + toolName(ndF[0]), true); snd('bad'); } } }
      else if (canWork && ok && S.hold && !engaged && sp3) hint(p.follow === 'men' ? 'men' : 'follow');
      if (engaged) { AQ.k = sndFor(p, S.tool); AQ.l = 0.75 + 0.25 * lead; S.tw = Math.min(tw1(), S.tw + dt / (p.secs || 10) * span * (0.6 + 1.4 * lead)); S.clock += dt / 60; if (S.tw >= tw1() - 1e-6) { showStage(p.stage, S.tw); S.engaged = false; el.hsTip.hidden = true; completeWork(); return; } }
      showStage(p.stage, S.tw); var was = S.engaged; S.engaged = engaged; if (engaged || S.hold || was !== engaged) hud();
      /* while you work the view holds still; only when the work is about to leave the screen does the look turn after it, slowly */
      if (cfg.fps && S.look && engaged && sp3 && !S.drag) { var c1 = cam(); V3b.copy(hp).project(c1); var F1 = cfg.fps, yl1 = F1.yawLim || 1.3, pl1 = F1.pitchLim || [-0.8, 0.5], hf = fovFor() * Math.PI / 360, r1 = dt * 0.7; if (Math.abs(V3b.x) > 0.7) S.look.yaw = Math.max(-yl1, Math.min(yl1, S.look.yaw - Math.sign(V3b.x) * Math.min(r1, Math.abs(V3b.x) - 0.7) * hf * (c1.aspect || 1.6))); if (Math.abs(V3b.y) > 0.7) S.look.pitch = Math.max(pl1[0], Math.min(pl1[1], S.look.pitch + Math.sign(V3b.y) * Math.min(r1, Math.abs(V3b.y) - 0.7) * hf)); }
    }
    else if (p.kind === 'paint' && S.paint) { if (S.hold && S.hold.hit) { AQ.k = sndFor(p, S.tool); AQ.s = Math.max(0, Math.min(1, S.pv / 650)); } S.clock += (S.hold ? dt : dt * 0.2) / 60; if (S.hold && S.ptr) { el.hsRing.style.left = S.ptr.x + 'px'; el.hsRing.style.top = S.ptr.y + 'px'; el.hsRing.classList.toggle('is-on', !!S.hold.hit); el.hsRing.classList.remove('is-wrong'); el.hsRing.classList.remove('is-near'); el.hsRingArc.setAttribute('stroke-dashoffset', (188.5 * (1 - S.paint.cover)).toFixed(1)); } el.hsTip.hidden = true; S.paint.tick(dt); showStage(p.stage, 0.002); if (S.paint.complete()) { completeWork(); return; } if (S.hold) hud(); }
    el.hsClock.textContent = clock(); if (S.mats && !el.hsPot.hidden) hud();
  }

  /* ----- painting: a coat applied by hand — a mask the brush writes into, the man holding the brush at the pointer ----- */
  function makePaint(p) {
    var m = member(), coat = m && m.parts ? m.parts[p.paint.coat] : null, kit = m ? m.kit : null, rig = m ? m.rig : null; if (!coat || !kit) return null;
    var segs = coat.segs, cells = [], W = 160, saved = [], tools = rig && rig.tools ? rig.tools : {}, tool = tools[p.paint.tool] || tools.broom, last = null, inc = 0.29, k; /* the brush lays most material under its middle: a parabolic profile, stamps every 0.4 R — one straight pass gives 1.0 of the rate under the centre line, rows overlapping by half give approx. 1.1–1.2 */
    var R = p.paint.r || 0.085; /* half width of the tool's contact, in the sample's metres */
    segs.forEach(function (s) {
      var pt = s.pt, w = pt.x1 - pt.x0, h = pt.a1 - pt.a0, cw = W, chh = Math.max(8, Math.round(W * h / w)), c = mkCanvas(cw, chh), q = c.getContext('2d'); q.fillStyle = '#000'; q.fillRect(0, 0, cw, chh);
      var tex = canvasTex(c, { srgb: false }), gw = 48, gh = Math.max(4, Math.round(gw * h / w)), acc = new Float32Array(gw * gh), only = s.mask && s.mask.only; void only;
      saved.push({ mm: s.mm, map: s.mm.alphaMap }); s.mm.alphaMap = tex; s.mm.alphaTest = 0.1; s.mm.needsUpdate = true;
      cells.push({ s: s, c: c, q: q, tex: tex, cw: cw, ch: chh, gw: gw, gh: gh, acc: acc, w: w, h: h, dirty: false });
    });
    /* cells of the mask that the coat leaves out (patches cut by `only`, e.g. the repair pockets) do not count */
    var skip = []; cells.forEach(function (C) { var sk = new Uint8Array(C.gw * C.gh), s = C.s, pt = s.pt, i, j; if (s.mask && s.mask.order) {} for (j = 0; j < C.gh; j++) for (i = 0; i < C.gw; i++) { var uu = (i + 0.5) / C.gw, vv = 1 - (j + 0.5) / C.gh, x = pt.x0 + uu * C.w, a = pt.kind === 'wall' ? pt.a0 + vv * C.h : pt.a1 - vv * C.h; if (p.paint.only && !p.paint.only(x, a, pt.kind, m)) sk[j * C.gw + i] = 1; } skip.push(sk); });
    /* (V82) cells the eye can never reach do not count either: hidden behind the other face at the corner (the wall's foot below the floor's plane, the floor's edge behind the wall's) — found by a ray from where you stand to each cell */
    (function () { if (!cfg.fps || !THREE.Raycaster) return; var eye = new THREE.Vector3(cfg.fps.pos[0], cfg.fps.pos[1], cfg.fps.pos[2] + (S && S.backTo ? S.backTo : 0)), rc2 = new THREE.Raycaster(), dir = new THREE.Vector3(), wpt = new THREE.Vector3(), tv = new THREE.Vector3();
      coat.meshes.forEach(function (me, ci) { var C = cells[ci], sk = skip[ci]; if (!C || !sk) return; var g = me.geometry, pa = g && g.attributes.position, ua = g && g.attributes.uv; if (!pa || !ua) return; me.updateMatrixWorld(true); var c4 = {}, vi, i, j; for (vi = 0; vi < pa.count; vi++) c4[Math.round(ua.getX(vi)) + '' + Math.round(ua.getY(vi))] = new THREE.Vector3(pa.getX(vi), pa.getY(vi), pa.getZ(vi)); if (!c4['00'] || !c4['10'] || !c4['01'] || !c4['11']) return;
        for (j = 0; j < C.gh; j++) for (i = 0; i < C.gw; i++) { var q = j * C.gw + i; if (sk[q]) continue; var u = (i + 0.5) / C.gw, v = 1 - (j + 0.5) / C.gh; wpt.copy(c4['00']).lerp(c4['10'], u).lerp(tv.copy(c4['01']).lerp(c4['11'], u), v).applyMatrix4(me.matrixWorld); dir.copy(wpt).sub(eye); var dist = dir.length(); if (dist < 1e-4) continue; dir.multiplyScalar(1 / dist); rc2.set(eye, dir); rc2.far = dist + 0.01; var hs = rc2.intersectObjects(coat.meshes, false); if (hs.length && hs[0].object !== me && hs[0].distance < dist - 0.003) sk[q] = 1; } }); })();
    var P = { meshes: coat.meshes, cover: 0, thickHit: 0, pos: null, kind: 'wall', seg: null };
    function cellOf(hit) { var i = coat.meshes.indexOf(hit.object); return i >= 0 ? cells[i] : null; }
    function stamp(C, u, v) { /* u, v in the patch (0..1, v up the wall / towards the wall on a floor) */
      var px = u * C.cw, py = (1 - v) * C.ch, rp = 0.82 * R / C.w * C.cw; /* (V82) the coat is drawn as wide as one pass counts (≥ 0.2 of the coat lies within 0.8 of the brush's half width): what looks covered is covered */ C.q.fillStyle = '#fff'; C.q.beginPath(); C.q.arc(px, py, rp, 0, Math.PI * 2); C.q.fill(); C.dirty = true;
      var gx = u * C.gw, gy = (1 - v) * C.gh, rg = R / C.w * C.gw, i0 = Math.max(0, Math.floor(gx - rg)), i1 = Math.min(C.gw - 1, Math.ceil(gx + rg)), j0 = Math.max(0, Math.floor(gy - rg)), j1 = Math.min(C.gh - 1, Math.ceil(gy + rg)), i, j;
      for (j = j0; j <= j1; j++) for (i = i0; i <= i1; i++) { var dx = i + 0.5 - gx, dy = j + 0.5 - gy, d2 = (dx * dx + dy * dy) / (rg * rg); if (d2 <= 1) { var q = j * C.gw + i, a = C.acc[q] + inc * (1 - d2); if (a > 2.2 && C.acc[q] <= 2.2) P.thickHit++; C.acc[q] = Math.min(3, a); } }
    }
    function uvOf(C, x, a) { var pt = C.s.pt; return { u: (x - pt.x0) / C.w, v: pt.kind === 'wall' ? (a - pt.a0) / C.h : (pt.a1 - a) / C.h }; }
    P.stroke = function (hit) { last = null; P.at(hit); };
    P.at = function (hit) { var C = cellOf(hit); if (!C) return; var pt = C.s.pt, lp = m.group.worldToLocal(hit.point.clone()), x = lp.x, a = pt.kind === 'wall' ? lp.y : lp.z; P.pos = { x: x, a: a, z: pt.kind === 'wall' ? pt.off : lp.y, kind: pt.kind, C: C }; P.seg = C.s;
      if (last && last.C === C) { var d = Math.hypot(x - last.x, a - last.a), n = Math.floor(d / (R * 0.4)), i; for (i = 1; i <= n; i++) { var f = i / n, uv = uvOf(C, last.x + (x - last.x) * f, last.a + (a - last.a) * f); stamp(C, uv.u, uv.v); } if (n) last = { C: C, x: x, a: a }; }
      else { var uv0 = uvOf(C, x, a); stamp(C, uv0.u, uv0.v); last = { C: C, x: x, a: a }; } };
    P.lift = function () { last = null; };
    P.tick = function () { var done = 0, n = 0; cells.forEach(function (C, ci) { if (C.dirty) { C.tex.needsUpdate = true; C.dirty = false; } var sk = skip[ci], q; for (q = 0; q < C.acc.length; q++) { if (sk[q]) continue; n++; if (C.acc[q] >= 0.2) done++; } }); P.cover = n ? done / n : 1; if (P.thickHit > 0 && !S.warned.thick) { S.warned.thick = true; addScore(-40); feed(L().thick, true); } };
    P.kgm2 = function () { var sum = 0, n = 0; cells.forEach(function (C, ci) { var sk = skip[ci], q; for (q = 0; q < C.acc.length; q++) { if (sk[q]) continue; n++; sum += Math.min(2.4, C.acc[q]); } }); return n ? p.paint.rate * sum / n : 0; };
    P.complete = function () { return P.cover >= (p.paint.cover || 0.97); };
    P.quality = function () { var k2 = P.kgm2(), rng = p.paint.ok || [p.paint.rate * 0.8, p.paint.rate * 1.35]; if (k2 >= rng[0] && k2 <= rng[1]) return 100; if (k2 < rng[0]) { feed(L().thin, true); return 20; } return 40; };
    P.finish = function () { saved.forEach(function (sv) { sv.mm.alphaMap = sv.map; sv.mm.needsUpdate = true; }); P.done = true; if (kit.crew) { kit.crew.keepAnim = false; kit.crew.suspend = false; } if (rig && rig.fx && rig.fx.clouds.splat) rig.fx.clouds.splat.update(0, function () { return null; }); };
    /* the man: the pointer's tool pressed on the coat where the pointer is, in place of the rig's own */
    P.pose = function () {
      if (!P.pos || !tool || !kit.crew) return; if (rig && rig.hideTools) rig.hideTools();
      var q = P.pos, cw = kit.crew; kit.now = performance.now() / 1000; kit.xRange = [q.C.s.pt.x0, q.C.s.pt.x1]; cw.keepAnim = true; cw.suspend = false; cw.begin(); /* keepAnim: the rig's own resolve (no tool at this frozen moment) must not reset his motion state — he follows the brush smoothly */
      var tk = HSIM_TOOLKIND[cfg.tools[S.tool]] || p.paint.tool || 'broom', lift = 0.0014; tool = tools[tk] || tools.broom; R = tk === 'broom' ? 0.085 : tk === 'spray' ? 0.12 : 0.14;
      if (tk === 'spray') { var fx = rig.fx, g2 = tools.gun; if (g2 && fx) { fx.aimAt(g2, q.kind === 'wall' ? { kind: 'wall', x: q.x, y: q.a, z: q.z + 0.001 } : { kind: 'floor', x: q.x, y: q.z + 0.001, z: q.a }, g2.userData.standoff.spray, S.hold ? 0 : 1, 0.001); g2.userData.stream(kit.now, !!S.hold); if (fx.clouds.splat) fx.clouds.splat.update(S.hold ? kit.now : 0, function () { return q.kind === 'wall' ? [q.x, q.a, q.z + 0.004] : [q.x, q.z + 0.004, q.a]; }, fx.ground); } }
      else { var tilt = tk === 'broom' ? (q.kind === 'wall' && q.a < 0.45 ? -0.35 : 0.35) : tk === 'notched' ? 0.3 : 0.32, yaw = tk === 'broom' ? (q.kind === 'wall' ? (q.a < 0.45 ? Math.PI : 0) : 0.2) : (q.kind === 'wall' ? Math.PI / 2 : 0.1); if (rig && rig.fx) rig.fx.follow(tool, q.kind === 'wall' ? { kind: 'wall', x: q.x, y: q.a, z: q.z } : { kind: 'floor', x: q.x, y: q.z, z: q.a }, tilt, yaw, 0, lift); else kit.press(tool, q.x, q.a, q.z + lift, tilt, yaw, 0); }
      cw.resolve(); cw.suspend = true; /* the rig's own resolve in the next member.set is skipped: he stays with the user's brush */
      /* the coat's companions follow the coverage: the fillets along the joint, the twin coat on the return wall */
      var cov = P.cover; if (coat.R) { coat.R.show(true); coat.R.set(cov); }
      (p.paint.coves || []).forEach(function (cv) { var pl = m.clip && m.clip[cv.clip]; if (!pl) return; if (cv.kind === 'y') { var s0 = segs[0]; pl.constant = cov <= 0.02 ? -10 : cov >= 0.98 ? 10 : -(s0.pt.a1 - cov * (s0.pt.a1 - s0.pt.a0)); } else if (cv.kind === 'r') { pl.constant = cov < 0.86 ? -10 : cov >= 0.98 ? 10 : (cov - 0.86) / 0.14 * (cv.D || 1.4); } else { var x0 = segs[0].x0, x1 = segs[0].pt.x1; pl.constant = cov <= 0.02 ? -10 : cov >= 0.98 ? 10 : x0 + cov * (x1 - x0); } });
    };
    /* the brush starts at the top left of the first patch, in the man's hand, before the first stroke */
    var s0 = segs[0]; if (s0) P.pos = { x: s0.x0 + 0.1, a: s0.pt.kind === 'wall' ? s0.pt.a1 - 0.08 : s0.pt.a0 + 0.1, z: s0.pt.off, kind: s0.pt.kind, C: cells[0] };
    return P;
  }
  function afterState() {
    if (S && S.paint && !S.paint.done) S.paint.pose();
    if (cfg.fps) { var m = member(), cw = m && m.crew ? m.crew() : null; if (cw) { var held = cw.tool(); cw.hideAll(); fpsHold(); if (held && m.kit && m.kit.crew) {} } }
  }

  /* ----- cards ----- */
  function briefing() {
    var l = L(), t = T(), h = '<div class="sim__cardin"><p class="sim__phase">' + t.eyebrow + '</p><h2 id="hsTitle">' + t.title + '</h2><p>' + t.sub + '</p><ol class="sim__brief">';
    t.brief.forEach(function (b) { h += '<li>' + b + '</li>'; }); h += '</ol><div class="sim__keys">'; (COARSE ? l.touch : l.keys).forEach(function (k) { h += '<span><b>' + k[0] + '</b> ' + k[1] + '</span>'; });
    h += '</div><div class="sim__cardact"><button class="sb-btn sb-btn--inverse sb-btn--lg" type="button" id="hsStart">' + l.start + '</button><button class="sb-link" type="button" id="hsBack">' + l.back + '</button></div></div>';
    el.hsCard.innerHTML = h; el.hsCard.hidden = false;
    document.getElementById('hsStart').addEventListener('click', function () { el.hsCard.hidden = true; S.t0 = performance.now(); if (HASA) HSA.resume(); snd('click'); enterPhase(); });
    document.getElementById('hsBack').addEventListener('click', self.close); document.getElementById('hsStart').focus();
  }
  function finish() {
    S.fin = true; snd('finish'); var l = L(), t = T(), secs = Math.round((performance.now() - S.t0) / 1000), max = cfg.maxScore || 2000, rank = S.score >= max * 0.82 ? 2 : S.score >= max * 0.6 ? 1 : 0, k;
    var h = '<div class="sim__cardin"><p class="sim__phase">' + l.rank + ' — ' + l.ranks[rank] + '</p><h2>' + t.res_title + '</h2><div class="sim__result"><div><b>' + S.score + '</b><span>' + l.res[0] + '</span></div><div><b>' + fmt(secs) + '</b><span>' + l.res[1] + '</span></div><div><b>' + (Math.floor(S.clock / 24) + 1) + '</b><span>' + l.res[2] + '</span></div></div>';
    var lines = []; for (k in S.cons) { var c = S.cons[k]; lines.push(typeof c === 'string' ? k + ': ' + c : k + ': ' + c.kg.toFixed(2) + ' kg/m² (' + (LANG === 'zh' ? '技術資料表約 ' : LANG === 'de' ? 'Merkblatt ca. ' : 'data sheet approx. ') + c.rate.toFixed(2) + ')'); }
    if (lines.length) { h += '<p class="sim__phase" style="margin-top:20px">' + l.cons + '</p><ul class="hsim__cons">'; lines.forEach(function (x) { h += '<li>' + x + '</li>'; }); h += '</ul>'; }
    var vd = cfg.verdict ? cfg.verdict(S, LANG) : null; if (vd) h += '<p class="sim__phase" style="margin-top:20px">' + l.verdict + '</p><p style="margin-top:6px">' + vd + '</p>';
    h += '<p>' + t.res_sub + '</p><p style="font-weight:700">Problems solved.</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse sb-btn--lg" type="button" id="hsAgain">' + l.again + '</button><button class="sb-link" type="button" id="hsBack2">' + l.back + '</button></div><p class="sim__dev">' + (LANG === 'zh' ? '系統由好時新創 Good Startup 開發' : LANG === 'de' ? 'System entwickelt von Good Startup' : 'System developed by Good Startup') + '</p></div>'; /* (V86) who made the system: one line under the result */
    el.hsCard.innerHTML = h; el.hsCard.hidden = false; el.hsMix.hidden = true; el.hsPot.hidden = true; el.hsRing.hidden = true; el.hsTip.hidden = true;
    document.getElementById('hsAgain').addEventListener('click', function () { S = fresh(); toolbar(); hud(); briefing(); if (view) { view.setStage(0, true); view.settle(); } }); document.getElementById('hsBack2').addEventListener('click', self.close); document.getElementById('hsAgain').focus();
  }

  /* ----- open / close ----- */
  this.open = function () {
    opener = document.activeElement; root.hidden = false; document.body.style.overflow = 'hidden'; open = true; last = 0; root.setAttribute('data-hs', cat);
    if (!HAS3D || typeof CRView === 'undefined') { el.hsCard.hidden = false; el.hsCard.innerHTML = '<div class="sim__cardin"><h2>' + T().title + '</h2><p>' + L().no3d + '</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse" type="button" id="hsBack3">' + L().back + '</button></div></div>'; document.getElementById('hsBack3').addEventListener('click', self.close); return; }
    if (!view) { try { build(); applyHome(); window.addEventListener('resize', function () { if (open) applyHome(true); }); } catch (e) { if (window.console) console.error('hands-on', cat, e); el.hsCard.hidden = false; el.hsCard.innerHTML = '<div class="sim__cardin"><h2>' + T().title + '</h2><p>' + L().no3d + '</p><div class="sim__cardact"><button class="sb-btn sb-btn--inverse" type="button" id="hsBack3">' + L().back + '</button></div></div>'; document.getElementById('hsBack3').addEventListener('click', self.close); return; } }
    HSIM.showHost(host);
    document.addEventListener('keydown', key); S = fresh(); view.setStage(0, true); view.settle(); if (view.reset && !cfg.fps) view.reset(); toolbar(); el.hsFeed.innerHTML = ''; el.hsMix.hidden = true; hud(); briefing(); raf = requestAnimationFrame(frame);
    el.hsView.onclick = function () { S.orbited = false; if (cfg.fps && S.paint && !S.paint.done && ph().kind === 'paint') { frameCoat(); return; } /* (V82) while painting: the whole coat back in view */ if (cfg.fps) { S.look = { yaw: cfg.fps.yaw || 0, pitch: cfg.fps.pitch || 0, fov: cfg.fps.fov || 58 }; } else { applyHome(); if (view.reset) view.reset(); } }; el.hsZin.onclick = function () { zoomBy(0.85); S.orbited = true; }; el.hsZout.onclick = function () { zoomBy(1.18); S.orbited = true; };
  };
  this.close = function () { open = false; cancelAnimationFrame(raf); root.hidden = true; document.body.style.overflow = ''; document.removeEventListener('keydown', key); if (HASA) HSA.close(); if (opener && opener.focus) opener.focus(); };
  this.relabel = function () { if (open && S) { toolbar(); hud(); mixPanel(); if (S.quiz) quizPanel(); if (!el.hsCard.hidden) { if (S.fin) finish(); else briefing(); } } };
  this.isOpen = function () { return open; };
  this.dispose = function () { /* one simulator holds a WebGL context at a time: the others give theirs back and rebuild when opened again */
    if (!view) return; try { var r = view.dbg && view.dbg.renderer; if (r) { if (typeof GLBudget !== 'undefined') GLBudget.drop(r); r.dispose(); if (r.forceContextLoss) r.forceContextLoss(); } if (view.dbg && view.dbg.member && view.dbg.member.dispose) view.dbg.member.dispose(); } catch (e) {}
    if (host && host.parentNode) host.parentNode.removeChild(host); view = null; host = null; canvas = null; zoneCache = {}; self.view = null;
  };
  this.peek = function (f) { return f(S, view, { enter: enterPhase, next: nextPhase, hud: hud, head: headPos, at: anchorAt, toScreen: toScreen, cam: cam, zone: zoneMeshes, complete: completeWork, mix: mixPanel }); }; /* for automated checks */
  ids.forEach(function (id) { el[id] = document.getElementById(id); });
  if (!el.hsBox.userData) { el.hsBox.userData = 1; el.hsBox.addEventListener('click', function () { el.hsBox.classList.toggle('is-open'); }); el.hsBox.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.hsBox.classList.toggle('is-open'); } }); }
}

/* ----- the overlay (one for all five), the gates in the guides, the registry ----- */
var HASA = typeof HSA !== 'undefined' && HSA.has(); /* the jobsite's sound, where the browser has Web Audio */
var HSIM = (function () {
  var inst = {}, built = false, active = null;
  function ensure() {
    if (built) return; built = true;
    var d = document.createElement('div'); d.className = 'sim hsim'; d.id = 'hsim'; d.hidden = true; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'hsTitle');
    d.innerHTML = '<div class="sim__top"><div class="sim__box hsim__hud is-open" id="hsBox" role="button" tabindex="0"><div class="sim__phase" id="hsPhase"></div><div class="sim__prompt" id="hsPrompt"></div><div class="sim__count" id="hsCount"></div></div>' +
      '<div class="sim__right"><button class="sim__exit" type="button" id="hsExit"></button><div class="sim__box sim__score"><b id="hsScore">0</b><span id="hsScoreL"></span></div><div class="sim__box sim__pot" id="hsPot" hidden><span class="sim__phase" id="hsPotName"></span><div class="sim__count" id="hsPotTime">45:00</div><i><u id="hsPotBar"></u></i></div>' +
      '<div class="sim__box hsim__clock"><span class="sim__phase" id="hsLook"></span><div class="sim__count" id="hsClock"></div></div></div></div>' +
      '<div class="hsim__viewbtns"><button class="sim__exit hsim__ico" type="button" id="hsZin" aria-label="Zoom in"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button><button class="sim__exit hsim__ico" type="button" id="hsZout" aria-label="Zoom out"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button><button class="sim__exit hsim__ico" type="button" id="hsView" aria-label="Reset view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><circle cx="12" cy="12" r="3"/></svg></button><button class="sim__exit hsim__ico" type="button" id="hsSnd" aria-label="Sound" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="w" d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.4a8 8 0 0 1 0 11.2"/><path class="x" d="M16 9l5 6M21 9l-5 6"/></svg></button></div>' +
      '<div class="sim__ring" id="hsRing" hidden aria-hidden="true"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" stroke="rgba(255,255,255,.35)"/><circle id="hsRingArc" cx="36" cy="36" r="30" stroke="#fff" stroke-dasharray="188.5" stroke-dashoffset="188.5" transform="rotate(-90 36 36)"/></svg></div><div class="sim__tip" id="hsTip" hidden aria-hidden="true"></div>' +
      '<div class="sim__feed" id="hsFeed" aria-live="polite"></div><div class="sim__mix hsim__mix" id="hsMix" hidden></div><div class="sim__toolname" aria-hidden="true"><span id="hsToolName"></span></div><div class="sim__tools" id="hsTools" role="toolbar" aria-label="Tools"></div><div class="sim__card" id="hsCard"></div>';
    document.body.appendChild(d);
    document.getElementById('hsExit').addEventListener('click', function () { if (active) active.close(); });
    var sb = document.getElementById('hsSnd'), sndUI = function (m) { sb.classList.toggle('is-off', m); sb.setAttribute('aria-pressed', m ? 'false' : 'true'); var t = (HSIM_T[LANG] || HSIM_T.en); sb.title = m ? t.soundOff : t.soundOn; sb.setAttribute('aria-label', t.sound); };
    if (HASA) { HSA.onChange(sndUI); sndUI(HSA.muted()); sb.addEventListener('click', function () { HSA.init(); HSA.toggle(); }); } else sb.hidden = true;
  }
  /* the gates' buttons: wired at load (the overlay itself is built on the first entry), with a guard against the open failing silently */
  function onGate(e) { var b = e.target && e.target.closest ? e.target.closest('[data-hsopen]') : null; if (!b) return; e.preventDefault(); try { HSIM.open(b.getAttribute('data-hsopen')); } catch (err) { if (window.console) console.error('hands-on', err); var o = document.getElementById('hsim'); if (o) o.hidden = true; document.body.style.overflow = ''; alert((HSIM_T[LANG] || HSIM_T.en).no3d); } }
  document.addEventListener('click', onGate);
  function L() { return HSIM_T[LANG] || HSIM_T.en; }
  function get(cat) { ensure(); if (!inst[cat] && HSIMS[cat]) inst[cat] = new HandsOn(cat, HSIMS[cat]); return inst[cat] || null; }
  return {
    get: get,
    open: function (cat) { var h = get(cat); if (!h) return; var k; for (k in inst) if (k !== cat) inst[k].dispose(); active = h; document.getElementById('hsExit').textContent = L().exit; document.getElementById('hsScoreL').textContent = L().score; h.open(); if (HASA) HSA.open(HSIMS[cat].amb || 'basement'); },
    showHost: function (host) { [].forEach.call(document.querySelectorAll('#hsim .hsim__view'), function (v) { v.style.display = v === host ? 'block' : 'none'; }); window.dispatchEvent(new Event('resize')); },
    relabel: function () { var k; for (k in inst) inst[k].relabel(); [].forEach.call(document.querySelectorAll('[data-hs]'), function (e) { var c = e.getAttribute('data-hscat'), key = e.getAttribute('data-hs'), cfg = HSIMS[c]; if (!cfg) return; var t = cfg.t[LANG] || cfg.t.en, v = key === 'btn' ? L().enter : t.gate[key]; if (v != null) e.innerHTML = v; }); if (active) { document.getElementById('hsExit').textContent = L().exit; document.getElementById('hsScoreL').textContent = L().score; } var sb2 = document.getElementById('hsSnd'); if (sb2 && HASA) { sb2.title = HSA.muted() ? L().soundOff : L().soundOn; sb2.setAttribute('aria-label', L().sound); } },
    /* the gate section of a guide: eyebrow, title, description, the button, three figures */
    gate: function (cat) {
      var cfg = HSIMS[cat]; if (!cfg) return ''; var t = cfg.t[LANG] || cfg.t.en, g = t.gate, m = cfg.meta, h = '<section class="gate on-navy" id="' + cat + '-simulator"><div class="wrap"><div class="gate__grid"><div>';
      h += '<p class="gate__eyebrow" data-hscat="' + cat + '" data-hs="eyebrow">' + g.eyebrow + '</p><h2 class="gate__title" data-hscat="' + cat + '" data-hs="title">' + g.title + '</h2><p class="gate__desc" data-hscat="' + cat + '" data-hs="desc">' + g.desc + '</p>';
      h += '<div class="cover__actions"><button class="sb-btn sb-btn--inverse sb-btn--lg" type="button" id="' + cat + 'SimOpen" data-hsopen="' + cat + '" data-hscat="' + cat + '" data-hs="btn">' + L().enter + '</button></div><p class="gate__foot" data-hscat="' + cat + '" data-hs="foot">' + g.foot + '</p></div>';
      h += '<div class="gate__meta">'; m.forEach(function (x, i) { h += '<div><b>' + x + '</b><span data-hscat="' + cat + '" data-hs="m' + i + '">' + g['m' + i] + '</span></div>'; }); h += '</div></div></div></section>';
      return h;
    }
  };
})();

/* ===== the five configurations ===== */
var HSIM_TOOLKIND = { broom: 'broom', trowel: 'trowel', notched: 'notched', spray: 'spray' }; /* toolbar key → the kit tool that paints */
var HSIMS = {};
/* mixing steps shared by the data sheets: hold = the mixing time (s of simulation, s real), mature = the maturing time */
function hsMix(list) { return list.map(function (x) { return typeof x === 'string' ? { k: x } : x; }); }
var HS_HOLD3 = { k: 'hold', s: 4, real: 180 }, HS_MATURE5 = { k: 'mature', s: 3, real: 300 }, HS_MATURE3 = { k: 'mature', s: 2.4, real: 240 }, HS_MATURE2 = { k: 'mature', s: 2, real: 120 };

/* ----- Mineral waterproofing: AQUAFIN-RB400 from the negative side (concrete basement wall) ----- */
HSIMS.wp = {
  view: 'cr', amb: 'basement', fps: { pos: [0.08, 0.74, 1.02], yaw: 0, pitch: -0.14, fov: 60, yawLim: 1.5, pitchLim: [-1.0, 0.55] }, scenario: 'negc', maxScore: 3000, meta: ['13', '3', '45 min'],
  tools: ['lance', 'chipper', 'trowel', 'broom', 'notched', 'spray', 'hose'],
  mats: {
    M30: { pot: 45, steps: hsMix(['click', HS_HOLD3, HS_MATURE5, 'click', 'done']), t: { en: { name: 'ASOCRET-M30', steps: ['Put 4.5–5.25 l of water per 25 kg into a clean mixing bucket and add the powder.', 'Mix approx. 3 minutes to a homogeneous, lump-free mass.', 'Maturing time approx. 5 minutes.', 'Homogenise again.', 'Pot life approx. 45 minutes.'], btn: ['Water in, powder in', '', '', 'Homogenise again'], note: 'Stirrer approx. 500–700 rpm. Do not add water or new mortar to mortar that has already set.' }, zh: { name: 'ASOCRET-M30', steps: ['每 25 kg 粉料加 4.5–5.25 l 水，倒入乾淨的攪拌桶，再加入粉料。', '攪拌約 3 分鐘至均勻無結塊。', '熟化時間約 5 分鐘。', '再次均勻攪拌。', '可使用時間約 45 分鐘。'], btn: ['加水、加粉料', '', '', '再次均勻攪拌'], note: '攪拌機約 500–700 rpm。已開始硬化的砂漿不得再加水或新料。' } } },
    AQ1K: { pot: 60, steps: hsMix(['click', HS_HOLD3, 'done']), t: { en: { name: 'AQUAFIN-1K', steps: ['Put approx. 6.7 l of water per 25 kg (26–27 %) into a clean mixing bucket and add the powder.', 'Mix approx. 3 minutes to a homogeneous, lump-free mass.', 'Pot life approx. 60 minutes.'], btn: ['Water in, powder in'], note: 'Stirrer approx. 500–700 rpm. Do not add water or new mortar to mortar that has already set (risk of inadequate strength development).' }, zh: { name: 'AQUAFIN-1K', steps: ['每 25 kg 粉料加約 6.7 l 水（26–27 %），倒入乾淨的攪拌桶，再加入粉料。', '攪拌約 3 分鐘至均勻無結塊。', '可使用時間約 60 分鐘。'], btn: ['加水、加粉料'], note: '攪拌機約 500–700 rpm。已開始硬化的砂漿不得再加水或新料（強度發展不足的風險）。' } } },
    RB400: { pot: 45, steps: hsMix(['click', HS_HOLD3, HS_MATURE5, 'click', 'done']), t: { en: { name: 'AQUAFIN-RB400', steps: ['Put the liquid component B into a clean mixing bucket and add the powder component A (A : B = 1.5 : 1 by weight).', 'Mix approx. 3 minutes to a homogeneous, lump-free mass.', 'Settling period approx. 5 minutes.', 'Homogenise the compound thoroughly again. Water only after mixing: max. 0.24 l per 24 kg.', 'Pot life approx. 45 minutes at approx. 5–30 °C.'], btn: ['Liquid in, powder in', '', '', 'Homogenise again'], note: 'Stirrer approx. 500–700 rpm. Do not add water or new material to material that has already set.' }, zh: { name: 'AQUAFIN-RB400', steps: ['將液體組份 B 倒入乾淨的攪拌桶，加入粉體組份 A（A : B = 1.5 : 1，重量比）。', '攪拌約 3 分鐘至均勻無結塊。', '靜置約 5 分鐘。', '再次充分均勻攪拌。水只能在攪拌後加入：每 24 kg 最多 0.24 l。', '約 5–30 °C 時可使用時間約 45 分鐘。'], btn: ['加液體、加粉料', '', '', '再次均勻攪拌'], note: '攪拌機約 500–700 rpm。已開始硬化的材料不得再加水或新料。' } } }
  },
  zones: { wall: { kind: 'wall', x0: -0.7, x1: 0.7, y0: 0, y1: 1.0, z: 0.012 }, floor: { kind: 'floor', x0: -0.7, x1: 0.7, z0: 0, z1: 1.4, y: 0.012 }, band: { kind: 'wall', x0: -0.05, x1: 0.41, y0: 0, y1: 1.0, z: 0.014 } },
  phases: [
    { id: 'jet', kind: 'drive', stage: 'prep', from: 0, to: 0.55, tool: 0, secs: 12, zone: 'wall' },
    { id: 'breakout', kind: 'drive', stage: 'prep', from: 0.55, to: 1, tool: 1, secs: 7, zone: 'wall' },
    { id: 'fill', kind: 'drive', stage: 'repair', from: 0, to: 0.56, tool: 2, secs: 9, zone: 'wall', needs: 'M30' },
    { id: 'cove', kind: 'drive', stage: 'repair', from: 0.56, to: 1, tool: [3, 2], secs: 8, zone: ['wall', 'floor'], needs: ['AQ1K', 'M30'] },
    { id: 'wait3', kind: 'wait', hours: 3, stage: 'repair' },
    { id: 'seal', kind: 'paint', stage: 'seal', tool: 3, zone: ['wall', 'floor'], needs: 'AQ1K', paint: { coat: 'seal', tool: 'broom', rate: 1.75, ok: [1.3, 2.0], coves: [{ clip: 'sealc', kind: 'x' }], label: 'AQUAFIN-1K' } },
    { id: 'wait6', kind: 'wait', hours: 6, stage: 'seal' },
    { id: 'band', kind: 'drive', stage: 'joint', from: 0, to: 1, tool: [4, 2], secs: 9, zone: 'band', needs: 'RB400' },
    { id: 'coat1', kind: 'paint', stage: 'coat1', tool: [2, 4], zone: ['wall', 'floor'], needs: 'RB400', paint: { coat: 'c1', tool: 'trowel', rate: 1.8, ok: [1.4, 2.4], coves: [{ clip: 'c1c', kind: 'x' }], label: 'AQUAFIN-RB400 · 1' } },
    { id: 'wait3b', kind: 'wait', hours: 3, stage: 'coat1' },
    { id: 'coat2', kind: 'paint', stage: 'coat2', tool: [5, 2], zone: ['wall', 'floor'], needs: 'RB400', paint: { coat: 'c2', tool: 'spray', rate: 1.8, ok: [1.4, 2.4], coves: [{ clip: 'c2c', kind: 'x' }], label: 'AQUAFIN-RB400 · 2' } },
    { id: 'cure', kind: 'drive', stage: 'cure', from: 0, to: 1, tool: 6, secs: 8, zone: ['wall', 'floor'] },
    { id: 'wait3d', kind: 'wait', hours: 72, stage: 'cure', secs: 3.2 }
  ],
  verdict: function (S, lang) { var a = S.cons['AQUAFIN-RB400 · 1'], b = S.cons['AQUAFIN-RB400 · 2'], kg = (a ? a.kg : 0) + (b ? b.kg : 0), mm = kg / 1.2; var s = (lang === 'zh' ? 'AQUAFIN-RB400 乾膜厚度約 ' : 'AQUAFIN-RB400 dry film approx. ') + mm.toFixed(1) + ' mm' + (lang === 'zh' ? '（兩道合計約 ' : ' (two coats, approx. ') + kg.toFixed(1) + ' kg/m²' + (lang === 'zh' ? '）。' : '). '); if (mm >= 3.0) s += lang === 'zh' ? '≥ 3.0 mm：符合 WTA 4-6 壓力水（背水面達 0.75 bar）。' : '≥ 3.0 mm: water pressure after WTA 4-6 (negative side up to 0.75 bar).'; else if (mm >= 2.0) s += lang === 'zh' ? '≥ 2.0 mm：僅達土壤濕氣等級——壓力水需 ≥ 3.0 mm。' : '≥ 2.0 mm: soil moisture only — water pressure needs ≥ 3.0 mm.'; else s += lang === 'zh' ? '低於 2.0 mm：厚度不足。' : 'below 2.0 mm: insufficient.'; return s; },
  t: {
   en: {
    gate: { eyebrow: 'Interactive · Hands-on simulation', title: 'Waterproof the basement wall <span>from the inside, with your own hands</span>', desc: 'The concrete basement wall of the 3D sample — jetted, repaired, pre-sealed and coated twice with AQUAFIN-RB400 against pressing water from the rear. You guide the lance, the chipping hammer and the trowel, mix every material with its mixing and maturing time, brush, trowel and spray the coats yourself to the material rate of the technical data sheet, and keep the pot life. No site, no risk: repeat it as often as you like.', foot: 'Thirteen phases from the technical data sheets of ASOCRET-M30, AQUAFIN-1K and AQUAFIN-RB400; the site clock runs through the waiting times.', m0: 'phases', m1: 'materials to mix', m2: 'pot life RB400' },
    eyebrow: 'Operation briefing · Basement wall, from the inside', title: 'Negative-side waterproofing <span>with AQUAFIN-RB400</span>',
    sub: 'An existing concrete basement wall lets water through at a construction joint and at honeycombed zones; the old paint flakes. The outside cannot be dug up. Prepare, repair and pre-seal the wall, then coat it twice with AQUAFIN-RB400 to ≥ 3.0 mm dry film — flexible and crack-bridging, against pressing water from the negative side (WTA 4-6, up to 0.75 bar).',
    brief: ['Jet the face at > 400 bar, break out the honeycombs', 'Fill pockets, tie holes and the chased joint with ASOCRET-M30; sealing cove', 'Pre-seal with AQUAFIN-1K brushed in, ≤ 1 mm per step', 'The joint band of AQUAFIN-RB400, 15 cm on both sides', 'First coat RB400 with the trowel, second after 3 hours — ≥ 3.0 mm dry film', 'Keep damp for at least 3 days'],
    tools: ['Jet lance', 'Chipping hammer', 'Trowel', 'Brush', 'Notched trowel', 'Spray gun', 'Hose'],
    phases: [
     { n: 'High-pressure water jetting', p: 'Select the jet lance and hold the pointer on the nozzle: the face is jetted from the top down at > 400 bar until paint and lime runs are gone and the concrete is laid bare, matt damp.', c: 'jetted', done: 'Substrate laid bare, pore-open, matt damp.' },
     { n: 'Breaking out', p: 'Select the chipping hammer and stay with it: the honeycombed zones are broken out to sound concrete, the edges cut square.', c: 'broken out', done: 'Honeycombs broken out to sound concrete.' },
     { n: 'Repair with ASOCRET-M30', p: 'Mix ASOCRET-M30, then guide the trowel: pockets and tie holes are filled, the chased construction joint filled flush from the bottom up (3–30 mm in one step).', c: 'filled', done: 'Pockets, tie holes and joint filled flush.' },
     { n: 'Bonding slurry and sealing cove', p: 'Mix AQUAFIN-1K for the bonding slurry. Brush it along the wall–floor joint, then form the sealing cove of ASOCRET-M30 wet in wet, edge height ≥ 4 cm, rounded.', c: 'cove formed', done: 'Sealing cove formed on its bonding slurry.' },
     { n: 'The cove sets', p: 'The cementitious cove can be overcoated after approx. 3 hours. The mixed material in the buckets goes off meanwhile — fresh batches for the next step.', c: '', done: '' },
     { n: 'Pre-sealing with AQUAFIN-1K', p: 'Mix AQUAFIN-1K and brush it into the matt damp wall and the floor strip yourself: drag over the surfaces with the brush, pore-deep, approx. 1.75 kg/m² (≤ 1 mm per step; more than 2 kg/m² in one step can crack).', c: '', done: 'Pre-sealed — the rigid slurry keeps the moisture from the rear off the flexible coating.' },
     { n: 'Overcoat after approx. 6 hours', p: 'AQUAFIN-1K is overcoated after approx. 6 hours. The site clock runs.', c: '', done: '' },
     { n: 'Joint band of AQUAFIN-RB400', p: 'Mix AQUAFIN-RB400 (A : B = 1.5 : 1, 3 minutes, mature 5 minutes, homogenise). Guide the notched trowel over the construction joint, 15 cm on both sides, to ≥ 4.0 mm dry film, then smooth.', c: 'band applied', done: 'Construction joint reinforced with the band of RB400.' },
     { n: 'First coat of AQUAFIN-RB400', p: 'Trowel the first coat yourself over wall and floor strip, free of pores: an even thickness with the coating-thickness trowel, approx. 1.8 kg/m² (1.5 mm dry). Keep the pot life of 45 minutes.', c: '', done: 'First coat applied, free of pores.' },
     { n: 'Second step after approx. 3 hours', p: 'The second application step follows when the first can no longer be damaged by reworking — after approx. 3 hours. Mix a fresh batch.', c: '', done: '' },
     { n: 'Second coat of AQUAFIN-RB400', p: 'Spray or trowel the second coat over the first, free of pores, approx. 1.8 kg/m²: the two coats give ≥ 3.0 mm dry film for pressing water (≥ 2.0 mm would be soil moisture only).', c: '', done: 'Second coat applied — the thick-layer coating is complete.' },
     { n: 'Curing', p: 'Select the hose and keep the fresh coating damp; it is protected from draught, sun and direct heating. 1 bar after approx. 16 hours, pressurised water after ≥ 1 day.', c: 'kept damp', done: 'Kept damp; ventilated, no condensation.' },
     { n: 'Three days', p: 'Kept damp ≥ 3 days. The flexible, crack-bridging, radon-tight coating holds the pressing water from the rear.', c: '', done: '' }
    ],
    res_title: 'The wall is waterproofed. <span>Flexible, crack-bridging, radon-tight.</span>', res_sub: 'Plaster, tiles or a coating may follow once the system has cured. Clean the tools with water immediately after use. Observe the technical data sheets and the safety data sheets.'
   },
   zh: {
    gate: { eyebrow: '互動 · 實作模擬', title: '由內側為地下室牆體防水<span>——親手施作</span>', desc: '3D 樣品中的混凝土地下室外牆——水刀處理、修補、預先封閉，再以 AQUAFIN-RB400 塗布兩道，抵抗來自背面的壓力水。您親自引導水刀、鑿除機與鏝刀，依攪拌與熟化時間拌合每一種材料，依技術資料表的用量親手刷塗、鏝塗與噴塗，並掌握可使用時間。不必到工地、沒有風險：想練習幾次就幾次。', foot: '依 ASOCRET-M30、AQUAFIN-1K 與 AQUAFIN-RB400 技術資料表的十三個階段；等待時間由工地時鐘推進。', m0: '個階段', m1: '種材料需攪拌', m2: 'RB400 可使用時間' },
    eyebrow: '作業簡報・地下室外牆，由內側施作', title: '背水面防水<span>使用 AQUAFIN-RB400</span>',
    sub: '既有混凝土地下室外牆在施工縫與蜂窩處滲水，舊漆層剝落，外側無法開挖。請處理、修補並預先封閉牆面，再以 AQUAFIN-RB400 塗布兩道至乾膜 ≥ 3.0 mm——具彈性、可橋接裂縫，抵抗背水面壓力水（WTA 4-6，達 0.75 bar）。',
    brief: ['以 > 400 bar 水刀處理牆面，鑿除蜂窩', '以 ASOCRET-M30 填補孔洞、螺栓孔與開槽的接縫；施作止水導角', '以 AQUAFIN-1K 刷入預先封閉，每道 ≤ 1 mm', 'AQUAFIN-RB400 接縫帶，兩側各 15 cm', 'RB400 第一道以鏝刀施作，3 小時後第二道——乾膜 ≥ 3.0 mm', '保持濕潤至少 3 天'],
    tools: ['水刀噴槍', '鑿除機', '鏝刀', '毛刷', '鋸齒鏝刀', '噴槍', '水管'],
    phases: [
     { n: '高壓水刀處理', p: '選擇水刀噴槍，將指標保持在噴嘴上：牆面由上而下以 > 400 bar 處理，直到舊漆與石灰析出清除、混凝土露出並呈微濕狀態。', c: '已處理', done: '基面已露出、孔隙開放、微濕。' },
     { n: '鑿除', p: '選擇鑿除機並跟著它：蜂窩區域鑿除至堅實混凝土，邊緣切齊。', c: '已鑿除', done: '蜂窩已鑿除至堅實混凝土。' },
     { n: '以 ASOCRET-M30 修補', p: '先攪拌 ASOCRET-M30，再引導鏝刀：填補孔洞與螺栓孔，開槽的施工縫由下而上填至齊平（單道 3–30 mm）。', c: '已填補', done: '孔洞、螺栓孔與接縫已填平。' },
     { n: '黏結漿料與止水導角', p: '攪拌 AQUAFIN-1K 作為黏結漿料，沿牆腳刷塗，再趁濕以 ASOCRET-M30 施作止水導角，邊高 ≥ 4 cm，呈圓弧。', c: '導角完成', done: '止水導角已施作於黏結漿料上。' },
     { n: '導角硬化', p: '水泥系導角約 3 小時後可覆塗。桶中已拌合的材料在此期間失效——下一步需重新拌合。', c: '', done: '' },
     { n: '以 AQUAFIN-1K 預先封閉', p: '攪拌 AQUAFIN-1K，親手刷入微濕的牆面與地坪帶：以毛刷在表面拖曳，刷入孔隙，約 1.75 kg/m²（每道 ≤ 1 mm；單道超過 2 kg/m² 可能開裂）。', c: '', done: '已預先封閉——剛性防水塗料把背面濕氣擋在彈性塗層之外。' },
     { n: '約 6 小時後覆塗', p: 'AQUAFIN-1K 約 6 小時後可覆塗。工地時鐘推進中。', c: '', done: '' },
     { n: 'AQUAFIN-RB400 接縫帶', p: '攪拌 AQUAFIN-RB400（A : B = 1.5 : 1，3 分鐘，靜置 5 分鐘，再均勻攪拌）。引導鋸齒鏝刀沿施工縫兩側各 15 cm 施作至乾膜 ≥ 4.0 mm，再抹平。', c: '接縫帶完成', done: '施工縫已以 RB400 接縫帶補強。' },
     { n: 'AQUAFIN-RB400 第一道', p: '親手以鏝刀在牆面與地坪帶施作第一道，無孔洞：以厚度鏝刀控制均勻厚度，約 1.8 kg/m²（乾膜 1.5 mm）。注意 45 分鐘的可使用時間。', c: '', done: '第一道已完成，無孔洞。' },
     { n: '約 3 小時後第二道', p: '第一道不再因後續施作而受損時——約 3 小時後——進行第二道。請重新拌合一批。', c: '', done: '' },
     { n: 'AQUAFIN-RB400 第二道', p: '以噴塗或鏝塗在第一道上施作第二道，無孔洞，約 1.8 kg/m²：兩道合計乾膜 ≥ 3.0 mm 可承受壓力水（≥ 2.0 mm 僅適用土壤濕氣）。', c: '', done: '第二道已完成——厚塗層系統完成。' },
     { n: '養護', p: '選擇水管，保持新塗層濕潤；避免穿堂風、日曬與直接加熱。約 16 小時後可承受 1 bar，≥ 1 天後可承受壓力水。', c: '已保濕', done: '已保持濕潤；通風、無結露。' },
     { n: '三天', p: '保持濕潤 ≥ 3 天。彈性、可橋接裂縫、阻隔氡氣的塗層承受來自背面的壓力水。', c: '', done: '' }
    ],
    res_title: '牆體防水完成。<span>具彈性、可橋接裂縫、阻隔氡氣。</span>', res_sub: '系統硬化後可施作粉刷、磁磚或塗料。工具請於使用後立即以水清潔。請遵守技術資料表與安全資料表。'
   }
  }
};

/* ----- Retrospective crystalline waterproofing: AQUAFIN-IC from the negative side ----- */
HSIMS.rc = {
  view: 'cr', amb: 'basement', fps: { pos: [0.02, 0.72, 0.72], yaw: 0, pitch: -0.16, fov: 66, yawLim: 1.6, pitchLim: [-1.1, 0.55] }, scenario: 'rcwall', maxScore: 2500, meta: ['11', '3', '2 min'],
  tools: ['lance', 'chipper', 'hose', 'hand', 'broom', 'trowel'],
  mats: {
    F20: { pot: 2, rate: 4, steps: hsMix(['click', { k: 'hold', s: 3, real: 60 }, 'done']), t: { en: { name: 'FIX-20-T', steps: ['Approx. 200–250 g of water per kg of powder into a clean bucket — a small quantity only, what can be placed at once.', 'Mix at least approx. 1 minute to a homogeneous, lump-free mass. Gloves!', 'Solidification starts after 1–2 minutes: pot life approx. 2 minutes.'], btn: ['Water in, powder in'], note: 'Low temperatures: warm water and pre-warmed powder; high temperatures: cool water — the powder must not exceed +23 °C.' }, zh: { name: 'FIX-20-T', steps: ['每 kg 粉料加約 200–250 g 水，倒入乾淨的桶中——只拌少量，一次可放入的量。', '至少攪拌約 1 分鐘至均勻無結塊。請戴手套！', '1–2 分鐘後開始凝固：可使用時間約 2 分鐘。'], btn: ['加水、加粉料'], note: '低溫時用溫水與預熱的粉料；高溫時用冷水——粉料不得超過 +23 °C。' } } },
    IM: { pot: 30, steps: hsMix(['click', HS_HOLD3, 'done']), t: { en: { name: 'ASOCRET-IM', steps: ['3.75–4.25 l of water per 25 kg into a clean mixing bucket, the powder in.', 'Mix approx. 3 minutes to a homogeneous, lump-free mass of filler consistency.', 'Pot life approx. 30 minutes at approx. 5–30 °C.'], btn: ['Water in, powder in'], note: 'Stirrer approx. 500–700 rpm. Up to 10 mm per application step.' }, zh: { name: 'ASOCRET-IM', steps: ['每 25 kg 加 3.75–4.25 l 水，倒入乾淨的攪拌桶，再加入粉料。', '攪拌約 3 分鐘至均勻無結塊的批土稠度。', '約 5–30 °C 時可使用時間約 30 分鐘。'], btn: ['加水、加粉料'], note: '攪拌機約 500–700 rpm。每道最多 10 mm。' } } },
    IC: { pot: 60, steps: hsMix(['click', HS_HOLD3, HS_MATURE3, 'click', 'done']), t: { en: { name: 'AQUAFIN-IC', steps: ['6.75–8 l of water per 25 kg (27–32 %) into a clean mixing bucket; add the powder while stirring vigorously.', 'Mix approx. 3 minutes until homogeneous and clump-free.', 'Maturing time approx. 3–5 minutes.', 'Mix again.', 'Pot life approx. 60 minutes at approx. 5–30 °C.'], btn: ['Water in, powder in', '', '', 'Mix again'], note: 'Stirrer approx. 500–700 rpm; liquid consistency, density approx. 1.6 kg/dm³.' }, zh: { name: 'AQUAFIN-IC', steps: ['每 25 kg 加 6.75–8 l 水（27–32 %），倒入乾淨的攪拌桶；邊劇烈攪拌邊加入粉料。', '攪拌約 3 分鐘至均勻無結塊。', '熟化時間約 3–5 分鐘。', '再次攪拌。', '約 5–30 °C 時可使用時間約 60 分鐘。'], btn: ['加水、加粉料', '', '', '再次攪拌'], note: '攪拌機約 500–700 rpm；液態稠度，密度約 1.6 kg/dm³。' } } }
  },
  zones: { wall: { kind: 'wall', x0: -0.7, x1: 0.7, y0: 0, y1: 1.0, z: 0.012 }, floor: { kind: 'floor', x0: -0.7, x1: 0.7, z0: 0, z1: 0.85, y: 0.012 }, side: { kind: 'side', x: 0.69, y0: 0, y1: 1.0, z0: 0, z1: 0.85 }, leak: { kind: 'wall', x0: 0.0, x1: 0.4, y0: 0, y1: 0.35, z: 0.014 } },
  phases: [
    { id: 'jet', kind: 'drive', stage: 'prep', from: 0, to: 0.45, tool: 0, secs: 11, zone: ['wall', 'side'] },
    { id: 'chase', kind: 'drive', stage: 'prep', from: 0.45, to: 0.75, tool: 1, secs: 8, zone: 'wall' },
    { id: 'wet', kind: 'drive', stage: 'prep', from: 0.75, to: 1, tool: 2, secs: 5, zone: ['wall', 'side', 'floor'] },
    { id: 'plug', kind: 'drive', stage: 'plug', from: 0, to: 1, tool: 3, secs: 8, zone: 'leak', needs: 'F20' },
    { id: 'fill', kind: 'drive', stage: 'repair', from: 0, to: 0.32, tool: [4, 5], secs: 8, zone: 'wall', needs: ['IC', 'IM'] },
    { id: 'cove', kind: 'drive', stage: 'repair', from: 0.32, to: 1, tool: [4, 5], secs: 12, zone: ['wall', 'floor', 'side'], needs: ['IC', 'IM'] },
    { id: 'wait2', kind: 'wait', hours: 2, stage: 'repair' },
    { id: 'coat1', kind: 'paint', stage: 'coat1', tool: 4, zone: ['wall', 'floor'], needs: 'IC', paint: { coat: 'c1', tool: 'broom', rate: 0.75, ok: [0.6, 1.0], coves: [{ clip: 'c1c', kind: 'x' }, { clip: 'c1V', kind: 'y' }, { clip: 'c1cR', kind: 'r', D: 0.85 }], label: 'AQUAFIN-IC · 1' } },
    { id: 'coat2', kind: 'paint', stage: 'coat2', tool: 4, zone: ['wall', 'floor'], needs: 'IC', paint: { coat: 'c2', tool: 'broom', rate: 0.75, ok: [0.6, 1.0], coves: [{ clip: 'c2c', kind: 'x' }, { clip: 'c2V', kind: 'y' }, { clip: 'c2cR', kind: 'r', D: 0.85 }], label: 'AQUAFIN-IC · 2' } },
    { id: 'cure', kind: 'drive', stage: 'cure', from: 0, to: 1, tool: 2, secs: 8, zone: ['wall', 'floor', 'side'] },
    { id: 'wait3d', kind: 'wait', hours: 72, stage: 'cure', secs: 3.2 }
  ],
  verdict: function (S, lang) { var a = S.cons['AQUAFIN-IC · 1'], b = S.cons['AQUAFIN-IC · 2'], kg = (a ? a.kg : 0) + (b ? b.kg : 0); var s = (lang === 'zh' ? 'AQUAFIN-IC 兩道合計約 ' : 'AQUAFIN-IC in two coats, approx. ') + kg.toFixed(2) + ' kg/m²' + (lang === 'zh' ? '。' : '. '); if (kg >= 1.5) s += lang === 'zh' ? '≥ 1.5 kg/m²：可承受積水與背水面壓力水（達 1.5 bar）。' : '≥ 1.5 kg/m²: accumulated and negative pressing water (up to 1.5 bar).'; else if (kg >= 1.2) s += lang === 'zh' ? '≥ 1.2 kg/m²：僅達非承壓水等級——壓力水需 1.5 kg/m²。' : '≥ 1.2 kg/m²: non-pressurised water only — pressing water needs 1.5 kg/m².'; else s += lang === 'zh' ? '低於 1.2 kg/m²：用量不足。' : 'below 1.2 kg/m²: insufficient rate.'; return s; },
  t: {
   en: {
    gate: { eyebrow: 'Interactive · Hands-on simulation', title: 'Stop the water and make the wall crystalline <span>with your own hands</span>', desc: 'The leaking basement wall of the 3D sample: the running water stopped with a plug of FIX-20-T within its two-minute pot life, the joint chased and filled with ASOCRET-IM on a screen of AQUAFIN-IC, the coved fillet, then two coats of AQUAFIN-IC brushed into the matt damp concrete to 1.5 kg/m² — you guide the tools, mix with the maturing times, brush the coats yourself and let the crystals grow.', foot: 'Eleven phases from the technical data sheets of FIX-20-T, ASOCRET-IM and AQUAFIN-IC; the site clock runs through the waiting times.', m0: 'phases', m1: 'materials to mix', m2: 'pot life FIX-20-T' },
    eyebrow: 'Operation briefing · Basement wall, negative pressing water', title: 'Crystalline waterproofing from the inside <span>with AQUAFIN-IC</span>',
    sub: 'Ground water presses through a construction joint of the concrete basement wall: the joint leaks, lime leaches out, at its foot the water runs in. The outside cannot be dug up. Stop the water, chase and fill the joint, form the cove, then brush two coats of AQUAFIN-IC into the matt damp concrete: the crystals grow into the capillaries and hold the pressing water back — up to 1.5 bar from the negative side.',
    brief: ['Jet both walls at > 400 bar; chase the joint 20 × 25 mm; chisel the leak to a dovetail', 'Wet to matt damp — no puddles', 'Plug the running water with FIX-20-T, pressed in by hand and held until it hardens', 'Screen with AQUAFIN-IC, fill with ASOCRET-IM wet in wet; coved fillet approx. 4 cm', 'Two coats of AQUAFIN-IC, 1.5 kg/m² in total for pressing water', 'Keep damp ≥ 3 days, ventilated'],
    tools: ['Jet lance', 'Chipping hammer', 'Hose', 'Hand / plug', 'Brush', 'Trowel'],
    phases: [
     { n: 'High-pressure water jetting', p: 'Select the jet lance and hold the pointer on the nozzle: the back wall and the right wall are jetted from the top down at > 400 bar until the concrete is pore-open and absorbent.', c: 'jetted', done: 'Substrate pore-open, free of adhesion-inhibiting substances.' },
     { n: 'Chase and dovetail', p: 'Select the chipping hammer and stay with it: the construction joint is chased 20 mm wide and 25 mm deep; where the water runs out, the opening is chiselled to a dovetail for the plug.', c: 'chased', done: 'Joint chased 20 × 25 mm, the leak dovetailed.' },
     { n: 'Wetting', p: 'Select the hose and dampen walls and floor with clean water: matt damp at the time of application, no puddles. Repeated moistening favours the growth of the crystals.', c: 'wetted', done: 'Matt damp, no puddles.' },
     { n: 'Plug the water leak', p: 'Mix a small quantity of FIX-20-T. Hold the pointer on the leak: the plug is pressed into the dovetailed opening by hand and held until it hardens — after 1–2 minutes, with a noticeable warming. Within the pot life of 2 minutes!', c: 'plugged', done: 'The water is stopped. FIX-20-T solidifies even under water and swells against the concrete.' },
     { n: 'Screen and fill the joint', p: 'Mix AQUAFIN-IC and ASOCRET-IM. Brush the screen of IC into the chased joint, then fill it flush with IM wet in wet, up to 10 mm per step (approx. 1.3 kg per metre of 20 × 25 mm).', c: 'filled', done: 'Joint and crack filled flush on a screen of AQUAFIN-IC.' },
     { n: 'Coved fillet', p: 'Guide brush and trowel along the wall–floor joint and up the corner: the substrate screened with AQUAFIN-IC, ASOCRET-IM applied wet in wet with an edge height of approx. 4 cm, rounded.', c: 'cove formed', done: 'Coved fillet formed — part of the crystalline system.' },
     { n: 'After approx. 1–3 hours', p: 'After approx. 1–3 hours the fresh mortar is reworked with AQUAFIN-IC. The batches in the buckets have gone off — mix fresh.', c: '', done: '' },
     { n: 'First coat of AQUAFIN-IC', p: 'Mix AQUAFIN-IC and brush the first coat yourself into the matt damp concrete — wall, floor strip, over the filled joint and the fresh fillet: evenly, worked in meticulously, free of pores, approx. 0.75 kg/m².', c: '', done: 'First coat brushed in.' },
     { n: 'Second coat, wet in sticky', p: 'Brush the second coat while the first is still sticky and has not dried out: approx. 0.75 kg/m² more — 1.5 kg/m² in two layers for accumulated and pressing water.', c: '', done: 'Second coat applied; drying of the first was avoided.' },
     { n: 'Curing', p: 'Select the hose: jute sheets are hung and the coating is kept damp, the room ventilated — no condensation, no direct heating. The crystals grow into the capillaries.', c: 'kept damp', done: 'Kept damp and ventilated.' },
     { n: 'Three days', p: 'Kept damp ≥ 3 days. Foot traffic after approx. 5 hours; withstands pressurised water after ≥ 7 days.', c: '', done: '' }
    ],
    res_title: 'The wall is dry. <span>The crystals hold the pressing water back.</span>', res_sub: 'Negative pressing water up to 1.5 bar; cracks up to 0.4 mm heal when water reaches them. Movement and connecting joints take the ASO-Dichtband system. Observe the technical data sheets and the safety data sheets.'
   },
   zh: {
    gate: { eyebrow: '互動 · 實作模擬', title: '止住滲水、讓牆體結晶<span>——親手施作</span>', desc: '3D 樣品中滲水的地下室牆體：流動的水以 FIX-20-T 塞體在兩分鐘可使用時間內止住，接縫開槽並於 AQUAFIN-IC 底塗上以 ASOCRET-IM 填補，施作導角，再將兩道 AQUAFIN-IC 刷入微濕的混凝土至 1.5 kg/m²——您引導工具、依熟化時間攪拌、親手刷塗，並讓結晶生長。', foot: '依 FIX-20-T、ASOCRET-IM 與 AQUAFIN-IC 技術資料表的十一個階段；等待時間由工地時鐘推進。', m0: '個階段', m1: '種材料需攪拌', m2: 'FIX-20-T 可使用時間' },
    eyebrow: '作業簡報・地下室牆體，背水面壓力水', title: '由內側施作結晶型防水<span>使用 AQUAFIN-IC</span>',
    sub: '地下水從混凝土地下室外牆的施工縫壓入：接縫滲漏、石灰析出、牆腳有水流入，外側無法開挖。請止水、開槽並填補接縫、施作導角，再將兩道 AQUAFIN-IC 刷入微濕的混凝土：結晶長入毛細孔，將壓力水擋回——背水面達 1.5 bar。',
    brief: ['以 > 400 bar 水刀處理兩面牆；接縫開槽 20 × 25 mm；滲漏處鑿成燕尾形', '潤濕至微濕——不得積水', '以 FIX-20-T 塞體止住流動的水，以手壓入並保持至硬化', '以 AQUAFIN-IC 底塗，趁濕以 ASOCRET-IM 填補；導角約 4 cm', '兩道 AQUAFIN-IC，壓力水合計 1.5 kg/m²', '保持濕潤 ≥ 3 天並通風'],
    tools: ['水刀噴槍', '鑿除機', '水管', '手／塞體', '毛刷', '鏝刀'],
    phases: [
     { n: '高壓水刀處理', p: '選擇水刀噴槍，將指標保持在噴嘴上：後牆與右牆由上而下以 > 400 bar 處理，直到混凝土孔隙開放且具吸水性。', c: '已處理', done: '基面孔隙開放，無妨礙附著的物質。' },
     { n: '開槽與燕尾', p: '選擇鑿除機並跟著它：施工縫開槽寬 20 mm、深 25 mm；水流出處鑿成燕尾形以利塞體錨固。', c: '已開槽', done: '接縫已開槽 20 × 25 mm，滲漏處已鑿成燕尾形。' },
     { n: '潤濕', p: '選擇水管，以乾淨的水潤濕牆面與地坪：施作時呈微濕、不得積水。反覆潤濕有利於結晶生長。', c: '已潤濕', done: '微濕，無積水。' },
     { n: '封堵滲漏', p: '拌合少量 FIX-20-T。將指標保持在滲漏處：以手將塞體壓入燕尾形開口並保持至硬化——1–2 分鐘後，伴隨明顯放熱。須在 2 分鐘的可使用時間內完成！', c: '已封堵', done: '水已止住。FIX-20-T 水下亦可凝固並膨脹頂緊混凝土。' },
     { n: '底塗並填補接縫', p: '攪拌 AQUAFIN-IC 與 ASOCRET-IM。先以毛刷將 IC 底塗刷入開槽的接縫，再趁濕以 IM 填至齊平，每道最多 10 mm（20 × 25 mm 每公尺約 1.3 kg）。', c: '已填補', done: '接縫與裂縫已於 AQUAFIN-IC 底塗上填平。' },
     { n: '導角', p: '沿牆腳與轉角引導毛刷與鏝刀：基面以 AQUAFIN-IC 底塗，趁濕以 ASOCRET-IM 施作邊高約 4 cm 的圓弧導角。', c: '導角完成', done: '導角已完成——結晶系統的一部分。' },
     { n: '約 1–3 小時後', p: '約 1–3 小時後在新鮮砂漿上覆塗 AQUAFIN-IC。桶中的材料已失效——請重新拌合。', c: '', done: '' },
     { n: 'AQUAFIN-IC 第一道', p: '攪拌 AQUAFIN-IC，親手將第一道刷入微濕的混凝土——牆面、地坪帶、填補後的接縫與新鮮導角：均勻、仔細刷入、無孔洞，約 0.75 kg/m²。', c: '', done: '第一道已刷入。' },
     { n: '第二道，趁黏施作', p: '在第一道仍帶黏性、尚未乾燥時刷上第二道：再約 0.75 kg/m²——兩層合計 1.5 kg/m²，適用積水與壓力水。', c: '', done: '第二道已完成；第一道未曾乾燥。' },
     { n: '養護', p: '選擇水管：掛上麻布並保持塗層濕潤，空間通風——避免結露，不得直接加熱。結晶長入毛細孔。', c: '已保濕', done: '已保持濕潤並通風。' },
     { n: '三天', p: '保持濕潤 ≥ 3 天。約 5 小時後可行走；≥ 7 天後可承受壓力水。', c: '', done: '' }
    ],
    res_title: '牆體已乾燥。<span>結晶將壓力水擋回。</span>', res_sub: '背水面壓力水達 1.5 bar；達 0.4 mm 的裂縫遇水自我修復。伸縮縫與連接縫採用 ASO-Dichtband 系統。請遵守技術資料表與安全資料表。'
   }
  }
};

/* ----- Concrete restoration: ASOCRET-BIS on a corroding bar (reinforced concrete beam) ----- */
HSIMS.cr = {
  view: 'cr', amb: 'basement', fps: { pos: [0.06, 0.74, 1.05], yaw: 0, pitch: -0.12, fov: 58, yawLim: 1.5, pitchLim: [-1.0, 0.55] }, scenario: 'steel', maxScore: 3400, meta: ['17', '4', '60 min'],
  tools: ['cutter', 'lance', 'blaster', 'hose', 'broom', 'trowel', 'spray', 'rule', 'sponge'],
  mats: {
    HSF: { pot: 60, steps: hsMix(['click', HS_HOLD3, HS_MATURE5, 'click', 'done']), t: { en: { name: 'ASOCRET-HS-FLEX (corrosion protection)', steps: ['Approx. 5.5–5.75 l of water per 25 kg into a clean mixing bucket, the powder in — the consistency for the corrosion protection.', 'Mix approx. 3 minutes.', 'Activation time approx. 5 minutes.', 'Mix again.', 'Pot life approx. 60 minutes at 5–30 °C.'], btn: ['Water in, powder in', '', '', 'Mix again'], note: 'Approx. 1.6 kg/m² per mm; approx. 1 mm per application step.' }, zh: { name: 'ASOCRET-HS-FLEX（鋼筋防蝕）', steps: ['每 25 kg 加約 5.5–5.75 l 水，倒入乾淨的攪拌桶，再加入粉料——防蝕塗層的稠度。', '攪拌約 3 分鐘。', '活化時間約 5 分鐘。', '再次攪拌。', '5–30 °C 時可使用時間約 60 分鐘。'], btn: ['加水、加粉料', '', '', '再次攪拌'], note: '每 mm 約 1.6 kg/m²；每道約 1 mm。' } } },
    HSFB: { pot: 60, steps: hsMix(['click', HS_HOLD3, HS_MATURE5, 'click', 'done']), t: { en: { name: 'ASOCRET-HS-FLEX (bond coat)', steps: ['Approx. 6.75–7.0 l of water per 25 kg — the brushable consistency of the bond coat.', 'Mix approx. 3 minutes.', 'Activation time approx. 5 minutes.', 'Mix again.', 'Pot life approx. 60 minutes.'], btn: ['Water in, powder in', '', '', 'Mix again'], note: 'Approx. 1.5 kg/m² per mm. In case of interruptions the bond coat must set completely; then repeat it.' }, zh: { name: 'ASOCRET-HS-FLEX（黏結漿料）', steps: ['每 25 kg 加約 6.75–7.0 l 水——黏結漿料可刷塗的稠度。', '攪拌約 3 分鐘。', '活化時間約 5 分鐘。', '再次攪拌。', '可使用時間約 60 分鐘。'], btn: ['加水、加粉料', '', '', '再次攪拌'], note: '每 mm 約 1.5 kg/m²。若中斷，黏結漿料須完全硬化後重新施作。' } } },
    BIS540: { pot: 60, steps: hsMix(['click', HS_HOLD3, 'click', { k: 'hold', s: 2.5, real: 60 }, 'done']), t: { en: { name: 'ASOCRET-BIS-5/40', steps: ['Put approx. 2.8–3.0 l of water into a clean mixing bucket and add 25 kg of powder.', 'Pre-mix approx. 3 minutes to a homogeneous, lump-free mass.', 'Add the remaining water: in total approx. 3.5–3.75 l.', 'Mix sufficiently (forced paddle mixer for larger quantities).', 'Pot life approx. 60 minutes; approx. 1.8 kg/m² per mm.'], btn: ['Water in, powder in', '', 'Add the remaining water'], note: 'Do not add water or new mortar to mortar that has already set (risk of inadequate strength development).' }, zh: { name: 'ASOCRET-BIS-5/40', steps: ['將約 2.8–3.0 l 水倒入乾淨的攪拌桶，加入 25 kg 粉料。', '預拌約 3 分鐘至均勻無結塊。', '加入剩餘的水：合計約 3.5–3.75 l。', '充分攪拌（大量時使用強制式攪拌機）。', '可使用時間約 60 分鐘；每 mm 約 1.8 kg/m²。'], btn: ['加水、加粉料', '', '加入剩餘的水'], note: '已開始硬化的砂漿不得再加水或新料（強度發展不足的風險）。' } } },
    BIS16: { pot: 60, steps: hsMix(['click', HS_HOLD3, HS_MATURE5, 'click', 'done']), t: { en: { name: 'ASOCRET-BIS-1/6', steps: ['5–5.25 l of water per 25 kg into a clean mixing bucket, the powder in.', 'Mix approx. 3 minutes.', 'Settling period approx. 5 minutes.', 'Homogenise again.', 'Pot life approx. 60 minutes; approx. 1.6 kg/m² per mm.'], btn: ['Water in, powder in', '', '', 'Homogenise again'], note: 'Up to 6 mm per application step; on BIS-5/40 after 24 hours at the earliest.' }, zh: { name: 'ASOCRET-BIS-1/6', steps: ['每 25 kg 加 5–5.25 l 水，倒入乾淨的攪拌桶，再加入粉料。', '攪拌約 3 分鐘。', '靜置約 5 分鐘。', '再次均勻攪拌。', '可使用時間約 60 分鐘；每 mm 約 1.6 kg/m²。'], btn: ['加水、加粉料', '', '', '再次均勻攪拌'], note: '每道最多 6 mm；於 BIS-5/40 上最早 24 小時後施作。' } } }
  },
  zones: { face: { kind: 'wall', x0: -0.5, x1: 0.5, y0: 0.1, y1: 1.05, z: 0.02 } },
  phases: [
    { id: 'saw', kind: 'drive', stage: 'prep', from: 0, to: 0.17, tool: 0, secs: 5, zone: 'face' },
    { id: 'jet', kind: 'drive', stage: 'prep', from: 0.17, to: 0.54, tool: 1, secs: 10, zone: 'face' },
    { id: 'blast', kind: 'drive', stage: 'prep', from: 0.54, to: 0.86, tool: 2, secs: 9, zone: 'face' },
    { id: 'rinse', kind: 'drive', stage: 'prep', from: 0.86, to: 1, tool: 3, secs: 4, zone: 'face' },
    { id: 'hsf1', kind: 'drive', stage: 'steel', from: 0, to: 0.5, tool: 4, secs: 8, zone: 'face', needs: 'HSF' },
    { id: 'wait2', kind: 'wait', hours: 2, stage: 'steel', from: 0.5 },
    { id: 'hsf2', kind: 'drive', stage: 'steel', from: 0.5, to: 1, tool: 4, secs: 8, zone: 'face', needs: 'HSF' },
    { id: 'wait6', kind: 'wait', hours: 6, stage: 'steel' },
    { id: 'wet', kind: 'drive', stage: 'bond', from: 0, to: 0.3, tool: 3, secs: 4, zone: 'face' },
    { id: 'bond', kind: 'drive', stage: 'bond', from: 0.3, to: 1, tool: 4, secs: 8, zone: 'face', needs: 'HSFB' },
    { id: 'fill1', kind: 'drive', stage: 'fill1', from: 0, to: 1, tool: [6, 5], secs: 9, zone: 'face', needs: 'BIS540', snd: { 6: 'sprayMortar' } },
    { id: 'fill2', kind: 'drive', stage: 'fill2', from: 0, to: 1, tool: [5, 7], secs: 8, zone: 'face', needs: 'BIS540' },
    { id: 'wait24', kind: 'wait', hours: 24, stage: 'fill2', secs: 3 },
    { id: 'fine', kind: 'drive', stage: 'fine', from: 0, to: 0.72, tool: 5, secs: 8, zone: 'face', needs: 'BIS16' },
    { id: 'felt', kind: 'drive', stage: 'fine', from: 0.72, to: 1, tool: 8, secs: 4, zone: 'face', needs: 'BIS16' },
    { id: 'cure', kind: 'drive', stage: 'cure', from: 0, to: 1, tool: 3, secs: 6, zone: 'face' },
    { id: 'wait3d', kind: 'wait', hours: 72, stage: 'cure', secs: 3.2 }
  ],
  t: {
   en: {
    gate: { eyebrow: 'Interactive · Hands-on simulation', title: 'Repair the corroding beam <span>with your own hands</span>', desc: 'The spalled reinforced concrete beam of the 3D sample: saw the edges, jet out the carbonated concrete, de-rust the bar to SA 2½, protect it twice with ASOCRET-HS-FLEX, brush in the bond coat and re-profile with ASOCRET-BIS-5/40 wet in wet, smooth with ASOCRET-BIS-1/6 and cure. You guide every tool and mix every mortar with its water, mixing and activation time — and keep the pot life.', foot: 'Seventeen phases from the technical data sheets of ASOCRET-HS-FLEX, ASOCRET-BIS-5/40 and ASOCRET-BIS-1/6; the site clock runs through the waiting times.', m0: 'phases', m1: 'mortars to mix', m2: 'pot life' },
    eyebrow: 'Operation briefing · Reinforced concrete beam, garage', title: 'Concrete repair <span>with the ASOCRET-BIS system</span>',
    sub: 'The carbonated cover has spalled off over a corroding bar. Expose and de-rust the reinforcement, protect it, bond the repair mortar wet in wet and re-profile the beam flush, then close the surface with the fine smoothing mortar — the system of ASOCRET-HS-FLEX, ASOCRET-BIS-5/40 and ASOCRET-BIS-1/6.',
    brief: ['Saw the edges square; break out and jet the carbonated concrete behind the bar', 'De-rust to SA 2½, rinse', 'ASOCRET-HS-FLEX on the steel: two coats, the second after approx. 2 hours', 'Pre-wet; bond coat of ASOCRET-HS-FLEX brushed in pore-deep', 'ASOCRET-BIS-5/40 wet in wet, ≤ 20 mm per step, compacted and levelled flush', 'ASOCRET-BIS-1/6 after 24 hours, 1–6 mm; keep damp 3–5 days'],
    tools: ['Disc cutter', 'Jet lance', 'Blaster', 'Hose', 'Brush', 'Trowel', 'Spray', 'Straight edge', 'Sponge board'],
    phases: [
     { n: 'Saw the edges', p: 'Select the disc cutter and stay with it: the edges of the repair area are cut square — no feather edges.', c: 'cut', done: 'Edges cut square.' },
     { n: 'Break out and jet', p: 'Select the jet lance and hold the pointer on the nozzle: the carbonated, loose concrete is removed to sound concrete, behind the bar as well — at least 20 mm clear round the steel.', c: 'jetted', done: 'Broken out to sound concrete, the bar exposed all round.' },
     { n: 'De-rust the steel', p: 'Select the blaster and follow it along the bar: the reinforcement is de-rusted to SA 2½, bright metal.', c: 'blasted', done: 'Reinforcement de-rusted to SA 2½.' },
     { n: 'Rinse', p: 'Select the hose: dust and grit are rinsed off the repair area.', c: 'rinsed', done: 'Clean and dust-free.' },
     { n: 'Corrosion protection, first coat', p: 'Mix ASOCRET-HS-FLEX for the corrosion protection (5.5–5.75 l per 25 kg). Guide the brush: the first coat on the reinforcing steel, fully covering, approx. 1 mm.', c: 'coated', done: 'First coat of corrosion protection applied.' },
     { n: 'Waiting time approx. 2 hours', p: 'The second coat is applied after approx. 2 hours, when the first coat is brushable. The batch goes off meanwhile.', c: '', done: '' },
     { n: 'Corrosion protection, second coat', p: 'Mix a fresh batch and brush the second coat over the first, fully covering.', c: 'coated', done: 'Reinforcement protected with two coats.' },
     { n: 'Waiting time approx. 6 hours', p: 'The repair mortar can be applied approx. 6 hours after the second coat has hardened.', c: '', done: '' },
     { n: 'Pre-wetting', p: 'Select the hose: the mineral substrate is pre-moistened so that it is matt damp at the time of application — no shiny film of water, no puddles.', c: 'wetted', done: 'Matt damp.' },
     { n: 'Bond coat', p: 'Mix ASOCRET-HS-FLEX in the bond-coat consistency (6.75–7.0 l per 25 kg). Guide the hard brush: the bond coat is brushed into the prepared substrate in a single coat, down to the pores, fully covering.', c: 'brushed in', done: 'Bond coat brushed in pore-deep — the mortar follows while it is wet.' },
     { n: 'Repair mortar, first layer', p: 'Mix ASOCRET-BIS-5/40. Stay with the tool: the mortar is applied into the fresh bond coat — sprayed or thrown on with the trowel — and compacted; max. 20 mm in one step.', c: 'applied', done: 'First layer applied wet in wet and compacted.' },
     { n: 'Repair mortar, flush', p: 'Guide trowel and straight edge: the second layer is applied fresh in fresh within the pot life, compacted and levelled flush with the surface.', c: 'levelled', done: 'Beam re-profiled flush.' },
     { n: 'After 24 hours', p: 'ASOCRET-BIS-1/6 on BIS-5/40: after 24 hours at the earliest. Keep the mortar damp meanwhile.', c: '', done: '' },
     { n: 'Fine smoothing', p: 'Mix ASOCRET-BIS-1/6. Guide the trowel: a scratch coat first, then the layer of 1–6 mm over the repaired area, struck off within the pot life.', c: 'smoothed', done: 'Surface closed with ASOCRET-BIS-1/6.' },
     { n: 'Felt finish', p: 'Select the sponge board and stay with it: after a corresponding waiting time the surface is treated with the felt board.', c: 'felted', done: 'Surface felted.' },
     { n: 'Curing', p: 'Select the hose: the mortar is kept damp and protected from draught and sun — curing film or wet jute.', c: 'kept damp', done: 'Curing started.' },
     { n: 'Three to five days', p: 'Keep the mortar damp for at least 3–5 days. The site clock runs.', c: '', done: '' }
    ],
    res_title: 'The beam is repaired. <span>Steel protected, section restored, surface closed.</span>', res_sub: 'Clean the tools with water immediately after use. Observe the technical data sheets and the safety data sheets; the repair principles of EN 1504-9 apply.'
   },
   zh: {
    gate: { eyebrow: '互動 · 實作模擬', title: '修補鏽蝕的梁<span>——親手施作</span>', desc: '3D 樣品中剝落的鋼筋混凝土梁：鋸切邊緣、沖除碳化混凝土、將鋼筋除鏽至 SA 2½、以 ASOCRET-HS-FLEX 塗布兩道防蝕、刷入黏結漿料並趁濕以 ASOCRET-BIS-5/40 回復斷面、以 ASOCRET-BIS-1/6 批平並養護。您引導每一件工具，依加水量、攪拌與活化時間拌合每一種砂漿——並掌握可使用時間。', foot: '依 ASOCRET-HS-FLEX、ASOCRET-BIS-5/40 與 ASOCRET-BIS-1/6 技術資料表的十七個階段；等待時間由工地時鐘推進。', m0: '個階段', m1: '種砂漿需攪拌', m2: '可使用時間' },
    eyebrow: '作業簡報・鋼筋混凝土梁，車庫', title: '混凝土修補<span>使用 ASOCRET-BIS 系統</span>',
    sub: '碳化的保護層在鏽蝕鋼筋上方剝落。請露出並除鏽鋼筋、施作防蝕、趁濕黏結修補砂漿並將梁回復至齊平，再以細批土砂漿封閉表面——ASOCRET-HS-FLEX、ASOCRET-BIS-5/40 與 ASOCRET-BIS-1/6 的系統。',
    brief: ['鋸切邊緣成直角；鑿除並沖除鋼筋後方的碳化混凝土', '除鏽至 SA 2½，沖洗', '鋼筋上的 ASOCRET-HS-FLEX：兩道，第二道約 2 小時後', '預先潤濕；ASOCRET-HS-FLEX 黏結漿料刷入孔隙', 'ASOCRET-BIS-5/40 趁濕施作，每道 ≤ 20 mm，搗實並整平至齊面', '24 小時後 ASOCRET-BIS-1/6，1–6 mm；保持濕潤 3–5 天'],
    tools: ['切割機', '水刀噴槍', '噴砂槍', '水管', '毛刷', '鏝刀', '噴塗', '刮尺', '海綿抹板'],
    phases: [
     { n: '鋸切邊緣', p: '選擇切割機並跟著它：修補區邊緣切成直角——不得有薄邊。', c: '已切割', done: '邊緣已切成直角。' },
     { n: '鑿除與沖除', p: '選擇水刀噴槍，將指標保持在噴嘴上：碳化、鬆動的混凝土清除至堅實混凝土，鋼筋後方亦然——鋼筋周圍至少淨空 20 mm。', c: '已沖除', done: '已鑿除至堅實混凝土，鋼筋全周露出。' },
     { n: '鋼筋除鏽', p: '選擇噴砂槍並沿鋼筋跟隨：鋼筋除鏽至 SA 2½，呈金屬光澤。', c: '已噴砂', done: '鋼筋已除鏽至 SA 2½。' },
     { n: '沖洗', p: '選擇水管：沖掉修補區的粉塵與砂粒。', c: '已沖洗', done: '乾淨無塵。' },
     { n: '鋼筋防蝕第一道', p: '攪拌作為防蝕塗層的 ASOCRET-HS-FLEX（每 25 kg 5.5–5.75 l）。引導毛刷：在鋼筋上塗布第一道，完全覆蓋，約 1 mm。', c: '已塗布', done: '防蝕第一道已完成。' },
     { n: '等待約 2 小時', p: '第二道於約 2 小時後、第一道可再刷塗時施作。桶中材料在此期間失效。', c: '', done: '' },
     { n: '鋼筋防蝕第二道', p: '重新拌合一批，在第一道上刷塗第二道，完全覆蓋。', c: '已塗布', done: '鋼筋已以兩道防蝕保護。' },
     { n: '等待約 6 小時', p: '修補砂漿可於第二道硬化後約 6 小時施作。', c: '', done: '' },
     { n: '預先潤濕', p: '選擇水管：預先潤濕礦物基面，使施作時呈微濕——無水光、無積水。', c: '已潤濕', done: '微濕。' },
     { n: '黏結漿料', p: '以黏結漿料稠度攪拌 ASOCRET-HS-FLEX（每 25 kg 6.75–7.0 l）。引導硬毛刷：黏結漿料單道刷入處理後的基面，深入孔隙，完全覆蓋。', c: '已刷入', done: '黏結漿料已刷入孔隙——砂漿趁濕跟進。' },
     { n: '修補砂漿第一層', p: '攪拌 ASOCRET-BIS-5/40。跟著工具：砂漿噴塗或以鏝刀甩入新鮮的黏結漿料並搗實；單道最多 20 mm。', c: '已施作', done: '第一層已趁濕施作並搗實。' },
     { n: '修補砂漿齊面', p: '引導鏝刀與刮尺：第二層在可使用時間內趁新鮮施作，搗實並整平至與表面齊平。', c: '已整平', done: '梁已回復至齊平。' },
     { n: '24 小時後', p: 'ASOCRET-BIS-1/6 於 BIS-5/40 上：最早 24 小時後。期間保持砂漿濕潤。', c: '', done: '' },
     { n: '細批土', p: '攪拌 ASOCRET-BIS-1/6。引導鏝刀：先刮塗薄層，再在修補區施作 1–6 mm，於可使用時間內刮平。', c: '已批平', done: '表面已以 ASOCRET-BIS-1/6 封閉。' },
     { n: '海綿抹面', p: '選擇海綿抹板並跟著它：經適當等待時間後以抹板處理表面。', c: '已抹面', done: '表面已抹面。' },
     { n: '養護', p: '選擇水管：保持砂漿濕潤並避免穿堂風與日曬——養護膜或濕麻布。', c: '已保濕', done: '養護開始。' },
     { n: '三至五天', p: '保持砂漿濕潤至少 3–5 天。工地時鐘推進中。', c: '', done: '' }
    ],
    res_title: '梁已修補完成。<span>鋼筋受保護、斷面回復、表面封閉。</span>', res_sub: '工具請於使用後立即以水清潔。請遵守技術資料表與安全資料表；適用 EN 1504-9 的修補原則。'
   }
  }
};

/* ----- Protective flooring: the garage floor with ASODUR-V360W in two days ----- */
HSIMS.pf = {
  view: 'pf', amb: 'garage', snd: { blaster: 'shot' }, fps: { pos: [0.6, 1.55, 5.6], yaw: 0, pitch: -0.3, fov: 62, yawLim: 1.6, pitchLim: [-1.2, 0.4], bg: 0x3a414a, fogNear: 6, fogFar: 16 }, scenario: 'pfgarage', maxScore: 3000, meta: ['12', '4', '40 min'],
  tools: ['blaster', 'cm', 'trowel', 'vacuum', 'roller', 'gun'],
  mats: {
    V360P: { pot: 40, steps: hsMix(['click', HS_HOLD3, { k: 'slider', min: 0, max: 15, step: 1, v0: 0, unit: '%', ok: [8, 10] }, 'done']), t: { en: { name: 'ASODUR-V360W primer', steps: ['Stir component A, add component B: 100 : 20 parts by weight.', 'Mix approx. 3 minutes.', 'Stir in the water for the primer: 8–10 %, not more than 10 %.', 'Pot life approx. 40 minutes.'], btn: ['A stirred, B added'], slider: 'Water added', sliderBad: 'The primer is diluted with 8–10 % water (max. 10 %).', note: 'Dry substrate ≤ 5 CM-%; substrate and air 10–35 °C, 3 °C above the dew point; approx. 0.15 kg/m².' }, zh: { name: 'ASODUR-V360W 底漆', steps: ['攪拌 A 組份，加入 B 組份：100 : 20 重量比。', '攪拌約 3 分鐘。', '拌入底漆用水：8–10 %，不超過 10 %。', '可使用時間約 40 分鐘。'], btn: ['A 攪拌、加入 B'], slider: '加水量', sliderBad: '底漆以 8–10 % 水稀釋（最多 10 %）。', note: '乾燥基面 ≤ 5 CM-%；基面與空氣 10–35 °C，高於露點 3 °C；約 0.15 kg/m²。' } } },
    V360L: { pot: 40, steps: hsMix(['click', HS_HOLD3, { k: 'slider', min: 0, max: 10, step: 0.5, v0: 0, unit: '%', ok: [2.5, 3.5] }, 'done']), t: { en: { name: 'ASODUR-V360W levelling', steps: ['Mix component A with component B, 100 : 20 parts by weight.', 'Mix approx. 3 minutes.', 'Thicken with the fibre filler ASO-FF for the pinholes: approx. 3 %. (Unevenness up to 2 mm: 1 : 0.5 quartz sand 0.1–0.35 mm.)', 'Pot life approx. 40 minutes.'], btn: ['A + B'], slider: 'ASO-FF added', sliderBad: 'Approx. 3 % ASO-FF thickens the resin for pinholes and recesses.', note: 'Approx. 1.6 kg/m² per mm of levelling; sanded with 100 grit and vacuumed after hardening.' }, zh: { name: 'ASODUR-V360W 整平', steps: ['A 組份與 B 組份混合，100 : 20 重量比。', '攪拌約 3 分鐘。', '以纖維填料 ASO-FF 增稠填補針孔：約 3 %。（不平整達 2 mm：以 1 : 0.5 石英砂 0.1–0.35 mm。）', '可使用時間約 40 分鐘。'], btn: ['A + B'], slider: '加入 ASO-FF', sliderBad: '約 3 % 的 ASO-FF 使樹脂增稠以填補針孔與凹陷。', note: '整平每 mm 約 1.6 kg/m²；硬化後以 100 號砂紙研磨並吸塵。' } } },
    V360S: { pot: 40, steps: hsMix(['click', HS_HOLD3, { k: 'slider', min: 0, max: 15, step: 1, v0: 5, unit: '%', ok: [0, 0] }, 'done']), t: { en: { name: 'ASODUR-V360W seal', steps: ['Mix component A with component B, 100 : 20 parts by weight.', 'Mix approx. 3 minutes.', 'Water for the seal? The seal is applied undiluted.', 'Pot life approx. 40 minutes.'], btn: ['A + B'], slider: 'Water added', sliderBad: 'The seal is mixed like the primer but applied undiluted — 0 % water.', note: 'Rolled criss-cross with the nylon fur roller, approx. 0.30–0.35 kg/m² per step.' }, zh: { name: 'ASODUR-V360W 面漆', steps: ['A 組份與 B 組份混合，100 : 20 重量比。', '攪拌約 3 分鐘。', '面漆要加水嗎？面漆不稀釋施作。', '可使用時間約 40 分鐘。'], btn: ['A + B'], slider: '加水量', sliderBad: '面漆的拌合方式與底漆相同，但不稀釋施作——0 % 水。', note: '以尼龍毛滾筒十字交叉滾塗，每道約 0.30–0.35 kg/m²。' } } },
    V360A: { pot: 40, steps: hsMix(['click', HS_HOLD3, { k: 'slider', min: 0, max: 15, step: 0.5, v0: 0, unit: '%', ok: [8, 10] }, 'done']), t: { en: { name: 'ASODUR-V360W with ASO-Antislide', steps: ['Mix component A with component B, 100 : 20 parts by weight.', 'Mix approx. 3 minutes.', 'Stir the glass granulate ASO-Antislide into the premixed seal: 8–10 % by weight (max. 170 g/m²), stirred up during the work.', 'Pot life approx. 40 minutes.'], btn: ['A + B'], slider: 'ASO-Antislide added', sliderBad: 'ASO-Antislide at 8–10 % by weight gives slip class R10 with V360W; the granulate goes into the last step only.', note: 'Grain 90–150 µm; the granulate must not settle in the bucket.' }, zh: { name: 'ASODUR-V360W 加 ASO-Antislide', steps: ['A 組份與 B 組份混合，100 : 20 重量比。', '攪拌約 3 分鐘。', '將玻璃顆粒 ASO-Antislide 拌入已拌合的面漆：8–10 % 重量比（最多 170 g/m²），施作中持續攪動。', '可使用時間約 40 分鐘。'], btn: ['A + B'], slider: '加入 ASO-Antislide', sliderBad: 'ASO-Antislide 8–10 % 重量比與 V360W 可達防滑等級 R10；顆粒只加入最後一道。', note: '粒徑 90–150 µm；顆粒不得在桶中沉澱。' } } }
  },
  zones: { floor: { kind: 'floor', x0: -3.25, x1: 3.25, z0: 0, z1: 6.0, y: 0.03 } },
  phases: [
    { id: 'blast', kind: 'drive', stage: 'prep', from: 0, to: 0.6, tool: 0, secs: 12, zone: 'floor', follow: 'men' },
    { id: 'cm', kind: 'quiz', ok: 0 },
    { id: 'repair', kind: 'drive', stage: 'prep', from: 0.6, to: 1, tool: [2, 3, 5], secs: 8, zone: 'floor', follow: 'men' },
    { id: 'prime', kind: 'drive', stage: 'prime', from: 0, to: 1, tool: 4, secs: 11, zone: 'floor', follow: 'men', needs: 'V360P' },
    { id: 'wait16', kind: 'wait', hours: 16, stage: 'prime' },
    { id: 'level', kind: 'drive', stage: 'level', from: 0, to: 1, tool: [2, 3], secs: 10, zone: 'floor', follow: 'men', needs: 'V360L' },
    { id: 'wait16b', kind: 'wait', hours: 16, stage: 'level' },
    { id: 'seal', kind: 'drive', stage: 'coat', from: 0, to: 1, tool: 4, secs: 11, zone: 'floor', follow: 'men', needs: 'V360S' },
    { id: 'wait16c', kind: 'wait', hours: 16, stage: 'coat' },
    { id: 'finish', kind: 'drive', stage: 'finish', from: 0, to: 1, tool: [4, 5], secs: 12, zone: 'floor', follow: 'men', needs: 'V360A' },
    { id: 'wait7d', kind: 'wait', hours: 168, stage: 'finish', secs: 3.4 },
    { id: 'service', kind: 'play', stage: 'service', snd: 'car' }
  ],
  t: {
   en: {
    gate: { eyebrow: 'Interactive · Hands-on simulation', title: 'Do the garage floor over a weekend <span>with your own hands</span>', desc: 'The garage of the 3D sample: shot-blast and grind the slab, read the CM test, prime with ASODUR-V360W diluted 8–10 %, fill the pinholes with ASO-FF, roll the seal criss-cross in two steps and stir ASO-Antislide into the last — each batch mixed 100 : 20 with its 40-minute pot life, each overcoat window of 16–48 hours on the site clock. You lead the crew and decide every dilution.', foot: 'Twelve phases from the technical data sheets of ASODUR-V360W, ASO-FF, ASO-Antislide and INDUFLEX-PU.', m0: 'phases', m1: 'batches to mix', m2: 'pot life V360W' },
    eyebrow: 'Operation briefing · Garage and cellar floor', title: 'The aqueous seal <span>ASODUR-V360W in two days</span>',
    sub: 'The garage floor dusts under the tyres, drinks the oil drip and is never clean. The slab is dry and sound; the floor must be done over a weekend. The water-emulsified epoxy ASODUR-V360W is primer, levelling compound and seal in one product: diluted as the primer, filled for the pinholes, rolled criss-cross in two steps — satin, pigmented, vapour permeable, walkable after 16 hours.',
    brief: ['Shot blasting and edge grinding; CM test ≤ 5 CM-%, dew point', 'Repairs, crack sealing, vacuuming', 'Primer: V360W 100 : 20, diluted 8–10 %, rolled criss-cross, approx. 0.15 kg/m²', 'Levelling: pinholes with approx. 3 % ASO-FF; sanded and vacuumed after hardening', 'Seal: undiluted, criss-cross, 0.30–0.35 kg/m² per step; ASO-Antislide 8–10 % in the last step', 'Joints with INDUFLEX-PU; driven on after 7 days'],
    tools: ['Shot blaster', 'CM test kit', 'Trowel', 'Vacuum', 'Nylon fur roller', 'Cartridge gun'],
    phases: [
     { n: 'Mechanical preparation', p: 'Select the shot blaster and stay with the crew: the slab is shot-blasted lane by lane after DIN EN 14879-1, the edges ground with the H-class vacuum on the grinder.', c: 'prepared', done: 'Slab prepared: grippy, load-bearing, dust-free.' },
     { n: 'Residual moisture', q: 'The CM device reads 3.2 CM-% on the slab; the substrate is 2 °C above the dew point at 65 % relative humidity. What now?', opts: ['Wait for the climate — V360W allows ≤ 5 CM-%, but the substrate must be ≥ 3 °C above the dew point', 'Start priming at once: 3.2 CM-% is dry enough', 'Switch to the barrier primer ASODUR-SG3: the slab is too damp'], why: 'V360W takes ≤ 5 CM-%; but substrate and air must be 10–35 °C and at least 3 °C above the dew point, humidity max. 65 %. Heat or ventilate first.', c: '', done: 'Climate checked.' },
     { n: 'Repairs and vacuuming', p: 'Guide the crew: breakouts filled, the crack closed with the cartridge gun, the floor vacuumed dust-free.', c: 'repaired', done: 'Repairs done, floor vacuumed.' },
     { n: 'Primer', p: 'Mix ASODUR-V360W 100 : 20 and dilute it for the primer. Stay with the roller: the primer is rolled criss-cross with the nylon fur roller onto the dry substrate, approx. 0.15 kg/m², within the pot life of 40 minutes.', c: 'primed', done: 'Primed; the seal follows after min. 16 hours and within 48 hours.' },
     { n: 'Overnight', p: 'The primer hardens: overcoat after min. 16 hours, within 48 hours (beyond it the surface is sanded again).', c: '', done: '' },
     { n: 'Levelling', p: 'Mix V360W and thicken it with ASO-FF. Guide the crew: pinholes and small recesses filled, unevenness levelled, sanded with 100 grit and vacuumed after hardening.', c: 'levelled', done: 'Pinholes filled, surface sanded and vacuumed.' },
     { n: 'Hardening', p: 'The levelling hardens; the seal follows within the overcoat window of 16–48 hours.', c: '', done: '' },
     { n: 'Seal, first step', p: 'Mix V360W undiluted. Stay with the roller: the seal is rolled criss-cross, approx. 0.30–0.35 kg/m² — pigmented, satin, vapour permeable.', c: 'sealed', done: 'First step of the seal rolled; walkable after approx. 16 hours.' },
     { n: 'Overnight', p: 'The second step after min. 16 hours and within 48 hours.', c: '', done: '' },
     { n: 'Anti-slip seal and joints', p: 'Mix V360W and stir ASO-Antislide into it, 8–10 % by weight. Guide the crew: the last step rolled criss-cross (R10), the glass granulate stirred up during the work; then the field and wall joints filled with INDUFLEX-PU.', c: 'finished', done: 'Floor finished: R10, joints elastic.' },
     { n: 'Seven days', p: 'Walkable after approx. 16 hours, full resilience after approx. 7 days; the garage is driven on after 7 days — tyres not turned on the spot in the first weeks.', c: '', done: '' },
     { n: 'In service', p: 'The car drives in: oil, tyre softeners, petrol and dilute acids no longer mark the floor.', c: 'in service', done: 'The floor in service.' }
    ],
    res_title: 'The garage floor is sealed. <span>Satin, R10, easy to clean.</span>', res_sub: 'Clean the tools with water at once. Observe the technical data sheets of ASODUR-V360W, ASO-FF, ASO-Antislide and INDUFLEX-PU and the safety data sheets.'
   },
   zh: {
    gate: { eyebrow: '互動 · 實作模擬', title: '一個週末完成車庫地坪<span>——親手施作</span>', desc: '3D 樣品中的車庫：噴砂與研磨底板、判讀 CM 試驗、以稀釋 8–10 % 的 ASODUR-V360W 打底、以 ASO-FF 填補針孔、十字交叉滾塗兩道面漆並在最後一道拌入 ASO-Antislide——每批以 100 : 20 拌合並掌握 40 分鐘的可使用時間，每個 16–48 小時的可覆塗時段由工地時鐘推進。您帶領班組並決定每一次稀釋。', foot: '依 ASODUR-V360W、ASO-FF、ASO-Antislide 與 INDUFLEX-PU 技術資料表的十二個階段。', m0: '個階段', m1: '批材料需拌合', m2: 'V360W 可使用時間' },
    eyebrow: '作業簡報・車庫與地下室地坪', title: '水性面漆<span>ASODUR-V360W，兩天完成</span>',
    sub: '車庫地坪在輪胎下起塵、吸入滴油、永遠不乾淨。底板乾燥堅實；地坪須在一個週末完成。水性環氧 ASODUR-V360W 集底漆、整平料與面漆於一身：稀釋後作底漆，增稠填補針孔，十字交叉滾塗兩道——緞面、有色、透氣，16 小時後可行走。',
    brief: ['噴砂與邊緣研磨；CM 試驗 ≤ 5 CM-%、露點', '修補、裂縫封閉、吸塵', '底漆：V360W 100 : 20，稀釋 8–10 %，十字交叉滾塗，約 0.15 kg/m²', '整平：針孔以約 3 % ASO-FF；硬化後研磨並吸塵', '面漆：不稀釋，十字交叉，每道 0.30–0.35 kg/m²；最後一道加 ASO-Antislide 8–10 %', '接縫以 INDUFLEX-PU 填縫；7 天後可行車'],
    tools: ['噴砂機', 'CM 試驗組', '鏝刀', '吸塵器', '尼龍毛滾筒', '填縫槍'],
    phases: [
     { n: '機械基面處理', p: '選擇噴砂機並跟著班組：底板依 DIN EN 14879-1 逐道噴砂，邊緣以接 H 級吸塵器的研磨機研磨。', c: '已處理', done: '底板已處理：粗糙、堅實、無塵。' },
     { n: '殘餘含水率', q: 'CM 儀在底板上讀得 3.2 CM-%；相對濕度 65 % 時基面高於露點 2 °C。接下來？', opts: ['等待氣候條件——V360W 允許 ≤ 5 CM-%，但基面須高於露點 ≥ 3 °C', '立即打底：3.2 CM-% 已夠乾燥', '改用阻隔底漆 ASODUR-SG3：底板太潮濕'], why: 'V360W 可接受 ≤ 5 CM-%；但基面與空氣須為 10–35 °C 且至少高於露點 3 °C，濕度最多 65 %。請先加熱或通風。', c: '', done: '氣候已確認。' },
     { n: '修補與吸塵', p: '引導班組：填補破損處，以填縫槍封閉裂縫，地坪吸塵至無塵。', c: '已修補', done: '修補完成，地坪已吸塵。' },
     { n: '底漆', p: '以 100 : 20 拌合 ASODUR-V360W 並稀釋作為底漆。跟著滾筒：底漆以尼龍毛滾筒在乾燥基面上十字交叉滾塗，約 0.15 kg/m²，在 40 分鐘可使用時間內完成。', c: '已打底', done: '已打底；面漆於至少 16 小時後、48 小時內跟進。' },
     { n: '隔夜', p: '底漆硬化：至少 16 小時後、48 小時內覆塗（超過則須重新研磨表面）。', c: '', done: '' },
     { n: '整平', p: '拌合 V360W 並以 ASO-FF 增稠。引導班組：填補針孔與小凹陷、整平不平整處，硬化後以 100 號砂紙研磨並吸塵。', c: '已整平', done: '針孔已填補，表面已研磨並吸塵。' },
     { n: '硬化', p: '整平層硬化；面漆在 16–48 小時的可覆塗時段內跟進。', c: '', done: '' },
     { n: '面漆第一道', p: '不稀釋拌合 V360W。跟著滾筒：面漆十字交叉滾塗，約 0.30–0.35 kg/m²——有色、緞面、透氣。', c: '已塗布', done: '面漆第一道已滾塗；約 16 小時後可行走。' },
     { n: '隔夜', p: '第二道於至少 16 小時後、48 小時內施作。', c: '', done: '' },
     { n: '防滑面漆與接縫', p: '拌合 V360W 並拌入 ASO-Antislide，8–10 % 重量比。引導班組：最後一道十字交叉滾塗（R10），施作中持續攪動玻璃顆粒；再以 INDUFLEX-PU 填補分格縫與牆縫。', c: '已完成', done: '地坪完成：R10，接縫具彈性。' },
     { n: '七天', p: '約 16 小時後可行走，約 7 天後達完全耐受；車庫 7 天後可行車——最初幾週輪胎不得原地轉向。', c: '', done: '' },
     { n: '使用中', p: '車輛駛入：油、輪胎軟化劑、汽油與稀酸不再在地坪留下痕跡。', c: '使用中', done: '地坪投入使用。' }
    ],
    res_title: '車庫地坪已封閉。<span>緞面、R10、易清潔。</span>', res_sub: '工具請立即以水清潔。請遵守 ASODUR-V360W、ASO-FF、ASO-Antislide 與 INDUFLEX-PU 的技術資料表與安全資料表。'
   }
  }
};

/* ----- Concrete admixture: the watertight basement with BETOCRETE ----- */
HSIMS.ca = {
  view: 'ca', amb: 'site', fps: { pos: [0.3, 1.5, 3.1], yaw: 0, pitch: -0.3, fov: 62, yawLim: 1.6, pitchLim: [-1.2, 0.5], bg: 0x8fa3b6, fogNear: 8, fogFar: 26 }, scenario: 'cabase', maxScore: 1900, meta: ['9', '1.85 %', '> 45 s'],
  tools: ['waterstop', 'poker', 'sheet'],
  mats: {
    MIXP: { pot: 90, steps: hsMix([{ k: 'hold', s: 4, real: 45 }, 'done']), t: { en: { name: 'Concrete with BETOCRETE-CL170-P (plant)', steps: ['Dose the liquid admixture with the mixing water via the dosing system of the plant and mix for more than 45 seconds; the quantity is deducted from the mixing water.', 'The concrete is ready for the truck.'], note: 'Where the truck is dosed on site: BETOCRETE-CP360-WP as 3 kg water-soluble bags, approx. 1 minute of mixing per m³ of drum content, at least 5 minutes.' }, zh: { name: '添加 BETOCRETE-CL170-P 的混凝土（拌合廠）', steps: ['液態添加劑經拌合廠的計量系統隨拌合水投入，攪拌超過 45 秒；添加量自拌合水中扣除。', '混凝土可裝入拌合車。'], note: '若在工地投入拌合車：BETOCRETE-CP360-WP 以 3 kg 水溶性袋投入，每 m³ 鼓內容量約攪拌 1 分鐘，至少 5 分鐘。' } } }
  },
  zones: { slab: { kind: 'floor', x0: -1.6, x1: 1.6, z0: -0.4, z1: 2.1, y: 0.05 }, wall: { kind: 'wall', x0: -1.6, x1: 1.6, y0: 0, y1: 1.8, z: 0.05 } },
  phases: [
    { id: 'joint', kind: 'drive', stage: 'joint', from: 0, to: 1, tool: 0, secs: 8, zone: ['slab', 'wall'], follow: 'zone' },
    { id: 'dosequiz', kind: 'quiz', ok: 1 },
    { id: 'dose', kind: 'dose', dose: { min: 2, max: 9, step: 0.1, v0: 4.0, unit: 'kg/m³', ok: [5.8, 6.1] } },
    { id: 'pour', kind: 'drive', stage: 'pour', from: 0, to: 1, tool: 1, secs: 12, zone: ['slab', 'wall'], follow: 'zone', needs: 'MIXP' },
    { id: 'waterquiz', kind: 'quiz', ok: 0 },
    { id: 'cure', kind: 'drive', stage: 'cure', from: 0, to: 1, tool: 2, secs: 7, zone: ['slab', 'wall'], follow: 'zone' },
    { id: 'wait7d', kind: 'wait', hours: 168, stage: 'cure', secs: 3.4 },
    { id: 'service', kind: 'play', stage: 'service', snd: 'water' },
    { id: 'heal', kind: 'play', stage: 'heal', snd: 'heal' }
  ],
  t: {
   en: {
    gate: { eyebrow: 'Interactive · Hands-on simulation', title: 'Cast the watertight basement <span>and dose it yourself</span>', desc: 'The basement of the 3D sample: the crystalline waterstop in the kicker, the admixture dosed at the plant — you decide the dosing level from the w/c ratio and the cement content of the recipe, as the data sheet asks — the concrete placed and compacted, cured, backfilled, and the crack that heals when the water arrives. The decisions of the data sheet, taken by you, without a single cubic metre wasted.', foot: 'Nine phases from the technical data sheets of BETOCRETE-CL170-P, BETOCRETE-CP360-WP and the AQUAFIN-CJ joint accessories.', m0: 'phases', m1: 'dosing at w/c 0.5', m2: 'mixing at the plant' },
    eyebrow: 'Operation briefing · Base slab and walls below ground', title: 'Watertight concrete <span>with BETOCRETE</span>',
    sub: 'A basement stands in the ground: soil moisture and ground water press against the slab and the walls, the construction joint at the kicker is the weak point, and the cracks that every slab and wall develop would carry the water inside. Recipe: CEM II, 320 kg/m³ cement, w/c 0.50, dosed with BETOCRETE-CL170-P at the plant.',
    brief: ['The crystalline waterstop AQUAFIN-CJ5 in the kicker, AQUAFIN-CJ6 on working joints, AQUAFIN-CJ1 as reserve', 'Dosing level from the w/c ratio: 1.75 / 1.85 / 2.00 % of the cement weight, never above 2.25 %', 'Mixed in the plant for more than 45 seconds', 'Placed in layers, fully compacted, no water added on site', 'Cured to the standards; crystals on the surface are not a defect', 'Cracks up to 0.4 mm heal when the water arrives'],
    tools: ['Joint accessories', 'Poker vibrator', 'Curing sheet'],
    phases: [
     { n: 'Construction joints', p: 'Select the joint accessories and hold the pointer on the kicker: the crystalline waterstop AQUAFIN-CJ5 is fixed to the reinforcement before the wall is poured, the swelling tape AQUAFIN-CJ6 on the working joints, the injection hose AQUAFIN-CJ1 as reserve.', c: 'detailed', done: 'Joints detailed with the system accessories.' },
     { n: 'Dosing level', q: 'The recipe: 320 kg/m³ CEM II, w/c 0.50. The dosing level of BETOCRETE-CL170-P according to the data sheet?', opts: ['1.75 % of the cement weight (w/c < 0.4)', '1.85 % of the cement weight (w/c > 0.4–0.5)', '2.00 % of the cement weight (w/c > 0.5–0.55)', '2.50 % — more admixture, more crystals'], why: 'Liquid BETOCRETE: 1.75 % below w/c 0.4, 1.85 % at w/c > 0.4–0.5, 2.00 % at w/c > 0.5–0.55 — never above 2.25 %. Preliminary tests always.', c: '', done: 'Dosing level chosen.' },
     { n: 'Quantity per m³', label: 'BETOCRETE-CL170-P', q: 'Set the quantity of BETOCRETE-CL170-P per m³ of concrete for 320 kg/m³ of cement at 1.85 %.', why: '320 kg × 1.85 % = 5.92 kg per m³; the quantity is deducted from the mixing water.', c: '', done: 'Dosed.' },
     { n: 'Place and compact', p: 'The plant mixes for more than 45 seconds. Then select the poker vibrator and hold the pointer on the pour: the concrete is placed in layers and fully compacted — honeycombs and voids are not sealed by crystals.', c: 'placed', done: 'Concrete placed and fully compacted, without cold joints.' },
     { n: 'Water on site?', q: 'The second truck arrives stiff after a long drive. The foreman asks for 10 l of water per m³ in the drum.', opts: ['No — no water on site: it raises the w/c ratio beyond the recipe. Consistency is adjusted with the superplasticiser of the recipe.', 'Yes — 10 l/m³ is harmless, the admixture seals the pores anyway', 'Yes, but add BETOCRETE as well to compensate'], why: 'No additional water on site: it raises the w/c ratio beyond the recipe; the crystalline effect works in a dense concrete.', c: '', done: 'Recipe kept.' },
     { n: 'Curing', p: 'Select the curing sheet and stay on the slab: the surfaces are protected against drying out, wind, sun and frost and kept damp to the valid standards. Crystals on the surface are not a defect.', c: 'cured', done: 'Curing to the standards.' },
     { n: 'Seven days', p: 'The formwork is struck when the strength allows; the concrete hardens — the crystalline effect needs the dense concrete the curing produces.', c: '', done: '' },
     { n: 'Backfill and ground water', p: 'The working space is backfilled; the ground water rises against the slab and the walls. The crystals close the pores.', c: 'backfilled', done: 'In the ground, under water pressure.' },
     { n: 'The crack heals', p: 'A crack of up to 0.4 mm opens and the water reaches it: crystals grow in the crack until it is sealed. Wider or moving cracks are injected (AQUAFIN-P1, P4, IH).', c: 'healed', done: 'Crack healed by crystal growth.' }
    ],
    res_title: 'The basement is watertight. <span>Dense concrete, healing cracks.</span>', res_sub: 'Concrete with BETOCRETE is produced, placed and cured to the currently valid standards; the admixture does not replace the craft. Observe the technical data sheets and the safety data sheets.'
   },
   zh: {
    gate: { eyebrow: '互動 · 實作模擬', title: '澆置水密地下室<span>——親手計量</span>', desc: '3D 樣品中的地下室：結晶型止水鋼板立於牆腳，添加劑於拌合廠計量——您依配比的水灰比與水泥用量決定摻量，一如技術資料表的要求——混凝土澆置搗實、養護、回填，以及遇水自我修復的裂縫。技術資料表的每一個決定由您做出，而不浪費一立方公尺。', foot: '依 BETOCRETE-CL170-P、BETOCRETE-CP360-WP 與 AQUAFIN-CJ 接縫配件技術資料表的九個階段。', m0: '個階段', m1: '水灰比 0.5 時的摻量', m2: '拌合廠攪拌' },
    eyebrow: '作業簡報・地下底板與牆體', title: '水密混凝土<span>使用 BETOCRETE</span>',
    sub: '地下室立於土壤之中：土壤濕氣與地下水壓向底板與牆體，牆腳的施工縫是弱點，而每一塊底板與牆體都會出現的裂縫會把水帶進室內。配比：CEM II，水泥 320 kg/m³，水灰比 0.50，於拌合廠以 BETOCRETE-CL170-P 計量。',
    brief: ['結晶型止水鋼板 AQUAFIN-CJ5 立於牆腳，AQUAFIN-CJ6 置於工作縫，AQUAFIN-CJ1 作為備用', '依水灰比決定摻量：水泥重量的 1.75 / 1.85 / 2.00 %，絕不超過 2.25 %', '於拌合廠攪拌超過 45 秒', '分層澆置、完全搗實、工地不加水', '依規範養護；表面結晶不是缺陷', '達 0.4 mm 的裂縫遇水自我修復'],
    tools: ['接縫配件', '振動棒', '養護布'],
    phases: [
     { n: '施工縫', p: '選擇接縫配件並將指標保持在牆腳：結晶型止水鋼板 AQUAFIN-CJ5 於澆置牆體前固定於鋼筋上，膨脹止水條 AQUAFIN-CJ6 置於工作縫，灌漿管 AQUAFIN-CJ1 作為備用。', c: '已處理', done: '接縫已以系統配件處理。' },
     { n: '摻量', q: '配比：320 kg/m³ CEM II，水灰比 0.50。依技術資料表，BETOCRETE-CL170-P 的摻量為？', opts: ['水泥重量的 1.75 %（水灰比 < 0.4）', '水泥重量的 1.85 %（水灰比 > 0.4–0.5）', '水泥重量的 2.00 %（水灰比 > 0.5–0.55）', '2.50 %——添加劑越多，結晶越多'], why: '液態 BETOCRETE：水灰比 0.4 以下 1.75 %，> 0.4–0.5 為 1.85 %，> 0.5–0.55 為 2.00 %——絕不超過 2.25 %。務必進行初步試驗。', c: '', done: '摻量已選定。' },
     { n: '每 m³ 用量', label: 'BETOCRETE-CL170-P', q: '請設定水泥 320 kg/m³、摻量 1.85 % 時每 m³ 混凝土的 BETOCRETE-CL170-P 用量。', why: '320 kg × 1.85 % = 每 m³ 5.92 kg；用量自拌合水中扣除。', c: '', done: '已計量。' },
     { n: '澆置與搗實', p: '拌合廠攪拌超過 45 秒。再選擇振動棒並將指標保持在澆置處：混凝土分層澆置並完全搗實——蜂窩與孔洞不會被結晶封閉。', c: '已澆置', done: '混凝土已澆置並完全搗實，無冷縫。' },
     { n: '工地加水？', q: '第二車混凝土長途運送後抵達時偏乾硬。工頭要求在鼓中每 m³ 加 10 l 水。', opts: ['不——工地不加水：那會使水灰比超出配比。稠度以配比中的強塑劑調整。', '可以——10 l/m³ 無害，添加劑反正會封閉孔隙', '可以，但同時補加 BETOCRETE 以補償'], why: '工地不得額外加水：那會使水灰比超出配比；結晶效應只在密實的混凝土中發揮作用。', c: '', done: '配比維持不變。' },
     { n: '養護', p: '選擇養護布並停留在底板上：表面依現行規範防止乾燥、風、日曬與霜凍並保持濕潤。表面結晶不是缺陷。', c: '已養護', done: '依規範養護。' },
     { n: '七天', p: '強度允許時拆模；混凝土硬化——結晶效應需要養護所產生的密實混凝土。', c: '', done: '' },
     { n: '回填與地下水', p: '工作空間回填；地下水上升壓向底板與牆體。結晶封閉孔隙。', c: '已回填', done: '位於土中，承受水壓。' },
     { n: '裂縫自我修復', p: '一道達 0.4 mm 的裂縫張開，水到達裂縫：結晶在裂縫中生長直到封閉。更寬或活動的裂縫則以灌注處理（AQUAFIN-P1、P4、IH）。', c: '已修復', done: '裂縫已由結晶生長修復。' }
    ],
    res_title: '地下室已達水密。<span>密實的混凝土、自我修復的裂縫。</span>', res_sub: '添加 BETOCRETE 的混凝土依現行規範生產、澆置與養護；添加劑不能取代工藝。請遵守技術資料表與安全資料表。'
   }
  }
};
