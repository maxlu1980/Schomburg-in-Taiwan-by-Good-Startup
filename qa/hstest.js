/* hands-on simulator run-through: opens a guide, starts its simulator and plays every phase with synthetic pointer events
   node hstest.js cat [maxPhases] [lang]   → shots/hs/<cat>_<phase>.jpg, console report */
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const ROUTE = { wp: '#/mineral-waterproofing', rc: '#/retrospective-concrete-waterproofing', cr: '#/concrete-restoration', pf: '#/protective-flooring-coating-systems', ca: '#/concrete-technology/crystalline-concrete-admixture' };
(async () => {
  const cat = process.argv[2] || 'wp', maxPh = +(process.argv[3] || 99), lang = process.argv[4] || 'en';
  fs.mkdirSync('shots/hs', { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); p.setDefaultTimeout(600000); await p.addInitScript((fast) => { window.NO_GOV = true; if (fast) window.FAST3D = true; }, process.env.FULL ? false : true);
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 400))); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  await p.goto('http://127.0.0.1:8765/dist/test.html' + ROUTE[cat], { waitUntil: 'load' }); await p.waitForTimeout(2500);
  if (lang !== 'en') { await p.evaluate(l => setLang(l), lang); await p.waitForTimeout(500); }
  const gate = await p.evaluate(c => { const s = document.getElementById(c + '-simulator'); return s ? { title: s.querySelector('.gate__title').textContent.trim().slice(0, 60), btn: !!document.getElementById(c + 'SimOpen') } : null; }, cat);
  console.log('gate', JSON.stringify(gate));
  await p.evaluate(c => HSIM.open(c), cat); await p.waitForTimeout(2500);
  const files = [];
  /* (QA V82) a watchdog: a call into the page that has not returned in 15 s means its main thread is stuck — pause it and print where */
  const cdp = await p.context().newCDPSession(p); await cdp.send('Debugger.enable'); let pausedAt = null; cdp.on('Debugger.paused', ev => { pausedAt = ev.callFrames.slice(0, 12).map(f => (f.functionName || '(anon)') + ' @' + f.location.lineNumber + ':' + f.location.columnNumber); });
  const ev0 = p.evaluate.bind(p); p.evaluate = async function (fn, arg) { let done = false; const t = setTimeout(async () => { if (done) return; console.log('WATCHDOG: page call stuck > 15 s, pausing'); try { await cdp.send('Debugger.pause'); await new Promise(r => setTimeout(r, 1500)); console.log('STACK', JSON.stringify(pausedAt)); await cdp.send('Debugger.resume'); } catch (e) { console.log('pause failed', String(e)); } }, 15000); try { return await ev0(fn, arg); } finally { done = true; clearTimeout(t); } };
  async function shot(name) { const f = 'shots/hs/' + cat + '_' + name + '.jpg'; await p.screenshot({ path: f, type: 'jpeg', quality: 80 }); files.push(f); }
  await shot('brief');
  await p.click('#hsStart'); await p.waitForTimeout(800);
  const nPh = await p.evaluate(c => HSIMS[c].phases.length, cat);
  let guard = 0;
  for (let ph = 0; ph < Math.min(nPh, maxPh) && guard < 400; ) {
    guard++;
    const st = await p.evaluate(c => HSIM.get(c).peek((S, v) => ({ phase: S.phase, kind: HSIMS[c].phases[S.phase].kind, tool: S.tool, mixKey: S.mixKey, quiz: !!S.quiz, lapse: !!S.lapse, play: !!S.play, tw: S.tw, cover: S.paint ? S.paint.cover : null, kg: S.paint ? S.paint.kgm2() : null, score: S.score, fin: S.fin, card: !document.getElementById('hsCard').hidden })), cat);
    if (st.fin) { console.log('FINISHED score', st.score); await shot('result'); break; }
    if (st.card) { const ct = await p.evaluate(() => { const c = document.getElementById('hsCard'); const b = c.querySelector('button'); return { text: c.textContent.replace(/\s+/g, ' ').slice(0, 200), btn: b ? b.id || b.textContent.trim().slice(0, 30) : null }; }); console.log('CARD open in phase', st.phase, JSON.stringify(ct)); if (process.env.HS_REACH) { await p.evaluate(() => { const b = document.querySelector('#hsCard button'); if (b) b.click(); }); await p.waitForTimeout(600); continue; } }
    if (st.phase !== ph) { console.log('phase', st.phase, st.kind, 'score', st.score); ph = st.phase; await shot('p' + String(ph).padStart(2, '0') + '_' + st.kind); }
    const P = await p.evaluate(({ c, i }) => HSIMS[c].phases[i], { c: cat, i: st.phase });
    if (st.lapse || st.play) { await p.waitForTimeout(400); continue; }
    if (st.quiz) { // the right option, or set the slider to the middle of the ok range
      if (P.kind === 'quiz') await p.click('#hsMix [data-opt="' + P.ok + '"]'); else { await p.evaluate(P => { const s = document.getElementById('hsSl'); s.value = (P.dose.ok[0] + P.dose.ok[1]) / 2; s.dispatchEvent(new Event('input')); }, P); await p.click('#hsDoseBtn'); }
      await p.waitForTimeout(300); continue;
    }
    if (st.mixKey) { // the mixing panel: click, hold, set sliders
      const step = await p.evaluate(({ c, k }) => HSIM.get(c).peek(S => { const m = HSIMS[c].mats[k], st = S.mats[k]; return m.steps[st.step]; }), { c: cat, k: st.mixKey });
      if (!step) { await p.waitForTimeout(200); continue; }
      if (step.k === 'hold') { const bb = await p.locator('#hsMixBtn').boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout((step.s + 0.3) * 1000); await p.mouse.up(); }
      else if (step.k === 'mature') { await p.waitForTimeout((step.s + 0.3) * 1000); }
      else if (step.k === 'slider') { await p.evaluate(step => { const s = document.getElementById('hsSl'); s.value = (step.ok[0] + step.ok[1]) / 2; s.dispatchEvent(new Event('input')); }, step); await p.click('#hsMixBtn'); }
      else await p.click('#hsMixBtn');
      await p.waitForTimeout(250); continue;
    }
    // select the tool
    const need = P.tool == null ? null : (P.tool.length != null ? P.tool[0] : P.tool); if (need != null && st.tool !== need) { await p.evaluate(({ c, n }) => HSIM.get(c).peek((S, v, A) => { S.tool = n; A.hud(); }), { c: cat, n: need }); }
    await p.evaluate(c => HSIM.get(c).peek(S => { Object.keys(S.mats).forEach(k => { if (S.mats[k].potOn) S.mats[k].pot = 99999; }); }), cat);
    if (P.kind === 'drive' || P.kind === 'hold') {
      // the head of the tool on screen (or the zone's centre): press there and keep following it
      const t0 = Date.now(); let frames = 0, fails = 0, isDown = false;
      while (Date.now() - t0 < 40000) {
        const r = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const hp = A.head(); let sp = hp ? A.toScreen(hp) : null; if (!sp) { const Z = A.zone(HSIMS[c].phases[S.phase]); if (Z.length) { const m = Z[0]; const w = new THREE.Vector3(); m.getWorldPosition(w); sp = A.toScreen(w); } } return { sp: sp, tw: S.tw, phase: S.phase, hold: !!S.hold, fin: S.fin }; }), cat);
        if (r.phase !== st.phase || r.fin) break;
        if (!r.sp) { fails++; await p.waitForTimeout(100); if (fails > 50) { console.log('  no head/zone position'); break; } continue; }
        const onCv = await p.evaluate(q => { const e = document.elementFromPoint(q.x, q.y); return !!e && e.tagName === 'CANVAS'; }, r.sp); if (!onCv) { fails++; if (fails % 25 === 1) { const who = await p.evaluate(q => { const e = document.elementFromPoint(q.x, q.y); const ch = []; let x = e; while (x && ch.length < 4) { ch.push(x.tagName + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.split(' ').slice(0, 3).join('.') : '')); x = x.parentElement; } const r = e && e.getBoundingClientRect(); return { ch, box: r && [r.left, r.top, r.width, r.height].map(Math.round), text: e ? (e.textContent || '').slice(0, 80) : '' }; }, r.sp); console.log('  covered', JSON.stringify(r.sp), JSON.stringify(who)); } } /* (QA V82) a ring under the HUD cannot be taken: wait for the look */
        if (!onCv || r.sp.x < 2 || r.sp.y < 2 || r.sp.x > 1278 || r.sp.y > 798) { if (isDown) { await p.mouse.up(); isDown = false; } await p.waitForTimeout(250); continue; } /* off screen: the hand rests, the look turns to the work */
        if (!r.hold) { if (isDown) await p.mouse.up(); await p.mouse.move(r.sp.x, r.sp.y); await p.mouse.down(); isDown = true; }
        else await p.mouse.move(r.sp.x, r.sp.y);
        frames++; if (frames % 30 === 0) console.log('   drive', JSON.stringify(r)); if (frames === 40 && !r.hold) { const dbg = await p.evaluate(({ c, x, y }) => HSIM.get(c).peek((S, v, A) => { const el = document.elementFromPoint(x, y); const hp = A.head(), sp = hp ? A.toScreen(hp) : null; return { tool: S.tool, mixKey: S.mixKey, quiz: !!S.quiz, card: !document.getElementById('hsCard').hidden, hold: !!S.hold, drag: !!S.drag, look: S.look, el: el ? el.tagName + '#' + el.id + '.' + el.className : null, sp, feed: (document.querySelector('.sim__feed') || {}).textContent, hint: (document.getElementById('hsTip') || {}).textContent, tipHidden: (document.getElementById('hsTip') || {}).hidden }; }), { c: cat, x: r.sp.x, y: r.sp.y }); console.log('  DEBUG no hold', JSON.stringify(dbg).slice(0, 900)); } await p.waitForTimeout(60);
      }
      await p.mouse.up(); await p.waitForTimeout(150);
    } else if (P.kind === 'paint') {
      if (process.env.HS_REACH && !st.reach) { /* (QA V82) can every cell of the coat ever come on screen, for some look within the limits, at the widest zoom? */
        const R = await p.evaluate(async c => { const out = await new Promise(res => HSIM.get(c).peek(async (S, v, A) => { const F = HSIMS[c].fps || {}; if (!S.look || !S.paint) { res({ none: true }); return; }
            const sv = Object.assign({}, S.look), yl = F.yawLim || 1.3, pl = F.pitchLim || [-0.8, 0.5], cells = []; const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            S.paint.meshes.forEach((me, k) => { const g = me.geometry; g.computeBoundingBox(); const bb = g.boundingBox, z = (bb.min.z + bb.max.z) / 2; me.updateMatrixWorld(true); for (let i = 0; i < 24; i++) for (let j = 0; j < 16; j++) cells.push({ k, w: new THREE.Vector3(bb.min.x + (bb.max.x - bb.min.x) * (i + 0.5) / 24, bb.min.y + (bb.max.y - bb.min.y) * (j + 0.5) / 16, z).applyMatrix4(me.matrixWorld), ok: false, okDef: false }); });
            const vw = innerWidth, vh = innerHeight, chk = def => cells.forEach(q => { const s2 = A.toScreen(q.w); if (s2 && s2.x > 8 && s2.x < vw - 8 && s2.y > 8 && s2.y < vh - 8) { q.ok = true; if (def) q.okDef = true; } });
            await raf(); chk(true);
            for (let a = 0; a < 7; a++) for (let b2 = 0; b2 < 5; b2++) { S.look.yaw = -yl + 2 * yl * a / 6; S.look.pitch = pl[0] + (pl[1] - pl[0]) * b2 / 4; S.look.fov = 84; await raf(); chk(false); }
            Object.assign(S.look, sv); await raf();
            const per = {}; cells.forEach(q => { const o = per[q.k] = per[q.k] || { n: 0, ok: 0, def: 0 }; o.n++; if (q.ok) o.ok++; if (q.okDef) o.def++; });
            res({ reach: +(cells.filter(q => q.ok).length / cells.length).toFixed(3), atStart: +(cells.filter(q => q.okDef).length / cells.length).toFixed(3), per }); })); return out; }, cat);
        console.log('REACH phase', st.phase, P.id, JSON.stringify(R));
        await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { S.paint.cover = 1; A.complete(); }), cat); await p.waitForTimeout(800); continue; }
      // rows of strokes over every coat face, from the projected patch corners
      const grid = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const out = []; S.paint.meshes.forEach(me => { const g = me.geometry; g.computeBoundingBox(); const bb = g.boundingBox; me.updateMatrixWorld(true); const z = (bb.min.z + bb.max.z) / 2; const pts = [[bb.min.x, bb.max.y], [bb.max.x, bb.max.y], [bb.min.x, bb.min.y], [bb.max.x, bb.min.y]].map(q => new THREE.Vector3(q[0], q[1], z).applyMatrix4(me.matrixWorld).toArray()); pts.nv = g.attributes.position.count; out.push(pts); }); console.log('HSTEST paint meshes', out.length, 'vertex counts', S.paint.meshes.map(me => me.geometry.attributes.position.count).join(',')); return out; }), cat); /* (QA V82) the patch's corners from its bounding box: a subdivided plane's first four vertices are only its first strip */
      await p.evaluate(c => HSIM.get(c).peek(S => { Object.keys(S.mats).forEach(k => { if (S.mats[k].potOn) S.mats[k].pot = 99999; }); }), cat); /* the harness paints far slower than a hand: no pot-life expiry in the test */
      for (let pass = 0; pass < 1; pass++) {
        for (const pts of grid) { // plane corners: (-w/2,h/2) (w/2,h/2) (-w/2,-h/2) (w/2,-h/2) in local → world
          const rows = 11, cols = 11;
          for (let r = 0; r <= rows; r++) {
            const fr = 0.04 + 0.92 * r / rows; let first = true;
            for (let cI = 0; cI <= cols; cI++) {
              const fc = 0.04 + 0.92 * (r % 2 === 0 ? cI : cols - cI) / cols;
              const w = await p.evaluate(({ pts, fr, fc, c }) => HSIM.get(c).peek((S, v, A) => { const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; const top = lerp(pts[0], pts[1], fc), bot = lerp(pts[2], pts[3], fc), q = lerp(top, bot, fr); return A.toScreen(new THREE.Vector3(q[0], q[1], q[2])); }), { pts, fr, fc, c: cat });
              if (!w) continue; if (first) { await p.mouse.move(w.x, w.y); await p.mouse.down(); first = false; } else await p.mouse.move(w.x, w.y);
            }
            await p.mouse.up(); await p.waitForTimeout(30);
            const q = await p.evaluate(c => HSIM.get(c).peek(S => ({ phase: S.phase, cover: S.paint ? S.paint.cover : null, kg: S.paint ? S.paint.kgm2() : null })), cat);
            if (q.phase !== st.phase) break;
          }
          const q2 = await p.evaluate(c => HSIM.get(c).peek(S => ({ phase: S.phase, cover: S.paint ? S.paint.cover : null, kg: S.paint ? S.paint.kgm2() : null })), cat);
          console.log('  paint pass', pass, JSON.stringify(q2)); if (q2.phase !== st.phase) break;
        }
        const q3 = await p.evaluate(c => HSIM.get(c).peek(S => S.phase), cat); if (q3 !== st.phase) break;
      }
      /* (QA V82) the holes: read each coat's mask, paint the unpainted cells that are on screen, and for those off screen hold the brush at that edge of the view (the view turns with it) */
      for (let tryE = 0; tryE < 14; tryE++) {
        const H = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { if (!S.paint) return null; const vw = innerWidth, vh = innerHeight, on = [], off = []; let sx = 0, sy = 0;
          S.paint.meshes.forEach(me => { const im = me.material.alphaMap && me.material.alphaMap.image; if (!im || !im.getContext) return; const g = me.geometry, pa = g.attributes.position, ua = g.attributes.uv; me.updateMatrixWorld(true); const C4 = {}; for (let vi = 0; vi < pa.count; vi++) { const key = Math.round(ua.getX(vi)) + '' + Math.round(ua.getY(vi)); C4[key] = new THREE.Vector3(pa.getX(vi), pa.getY(vi), pa.getZ(vi)); } const at2 = (u, w) => { const a0 = C4['00'].clone().lerp(C4['10'], u), a1 = C4['01'].clone().lerp(C4['11'], u); return a0.lerp(a1, w); };
            const d = im.getContext('2d').getImageData(0, 0, im.width, im.height).data, st2 = 5;
            for (let y = 2; y < im.height; y += st2) for (let x = 2; x < im.width; x += st2) { if (d[(y * im.width + x) * 4] > 100) continue; const u = (x + 0.5) / im.width, w = 1 - (y + 0.5) / im.height, wp = at2(u, w).applyMatrix4(me.matrixWorld); /* (by the mesh's own UVs: the floor's mask runs towards the wall) */
              const s2 = A.toScreen(wp), el2 = s2 ? document.elementFromPoint(s2.x, s2.y) : null; if (s2 && s2.x > 24 && s2.x < vw - 24 && s2.y > 24 && s2.y < vh - 24 && el2 && el2.tagName === 'CANVAS') on.push([Math.round(s2.x), Math.round(s2.y)]); else { const q = wp.clone().project(A.cam()); const bk = q.z > 1; sx += Math.max(-3, Math.min(3, bk ? -q.x : q.x)); sy += Math.max(-3, Math.min(3, bk ? q.y : -q.y)); off.push(1); } } });
          return { phase: S.phase, cover: S.paint.cover, on: on, off: off.length, sx: off.length ? sx / off.length : 0, sy: off.length ? sy / off.length : 0, vw: vw, vh: vh }; }), cat);
        if (!H || H.phase !== st.phase || H.cover >= 0.97) break;
        console.log('  holes', JSON.stringify({ cover: +H.cover.toFixed(3), on: H.on.length, off: H.off }));
        if (H.on.length) { const rows = {}; H.on.forEach(q => { const k = Math.round(q[1] / 14); (rows[k] = rows[k] || []).push(q); }); const ks = Object.keys(rows).map(Number).sort((x, y) => x - y);
          for (const k of ks) { const r = rows[k].sort((x, y) => x[0] - y[0]); await p.mouse.move(r[0][0] - 6, r[0][1]); await p.mouse.down(); for (const q of r) await p.mouse.move(q[0], q[1], { steps: 2 }); await p.mouse.move(r[r.length - 1][0] + 6, r[r.length - 1][1]); await p.mouse.up(); } }
        else if (H.off) { const ax = Math.abs(H.sx) > Math.abs(H.sy) * 1.2, ex = ax ? (H.sx > 0 ? H.vw - 14 : 14) : null, ey = ax ? null : (H.sy > 0 ? H.vh - 14 : 14);
          const start = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const r = []; S.paint.meshes.forEach(me => { const g = me.geometry; g.computeBoundingBox(); const bb = g.boundingBox; me.updateMatrixWorld(true); for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) { const wp = new THREE.Vector3(bb.min.x + (bb.max.x - bb.min.x) * i / 6, bb.min.y + (bb.max.y - bb.min.y) * j / 6, (bb.min.z + bb.max.z) / 2).applyMatrix4(me.matrixWorld), s2 = A.toScreen(wp); if (s2 && s2.x > 60 && s2.x < innerWidth - 60 && s2.y > 60 && s2.y < innerHeight - 60) r.push([s2.x, s2.y]); } }); return r; }), cat);
          if (!start.length) { await p.click('#hsView'); await p.waitForTimeout(1800); console.log('  view button: coat framed again'); continue; } const st0 = start.sort((x, y) => ax ? (H.sx > 0 ? y[0] - x[0] : x[0] - y[0]) : (H.sy > 0 ? y[1] - x[1] : x[1] - y[1]))[0];
          await p.mouse.move(st0[0], st0[1]); await p.mouse.down(); const tx = ex == null ? st0[0] : ex, ty = ey == null ? st0[1] : ey; await p.mouse.move(tx, ty, { steps: 12 });
          for (let k = 0; k < 30; k++) { await p.mouse.move(ax ? tx : H.vw * (0.3 + 0.4 * ((k % 10) / 10)), ax ? H.vh * (0.3 + 0.4 * ((k % 10) / 10)) : ty); await p.waitForTimeout(50); }
          await p.mouse.up(); console.log('  edge hold toward', ax ? (H.sx > 0 ? 'right' : 'left') : (H.sy > 0 ? 'down' : 'up')); }
        else break;
      }
      const qF = await p.evaluate(c => HSIM.get(c).peek(S => ({ phase: S.phase, cover: S.paint ? S.paint.cover : null, kg: S.paint ? S.paint.kgm2() : null })), cat); console.log('  paint end', JSON.stringify(qF));
      await shot('p' + String(st.phase).padStart(2, '0') + '_painted');
      if (process.env.HS_DUMP) { const D = await p.evaluate(c => HSIM.get(c).peek((S, v, A) => { const vw = innerWidth, vh = innerHeight; return S.paint.meshes.map((me, k) => { const g = me.geometry; g.computeBoundingBox(); const bb = g.boundingBox; me.updateMatrixWorld(true); const z = (bb.min.z + bb.max.z) / 2; const cs = [[bb.min.x, bb.max.y], [bb.max.x, bb.max.y], [bb.min.x, bb.min.y], [bb.max.x, bb.min.y]].map(q => { const w = new THREE.Vector3(q[0], q[1], z).applyMatrix4(me.matrixWorld), s2 = A.toScreen(w); return s2 ? [Math.round(s2.x), Math.round(s2.y)] : null; }); const im = me.material.alphaMap && me.material.alphaMap.image; return { k: k, name: me.name, nv: g.attributes.position.count, vis: me.visible, corners: cs, mask: im && im.toDataURL ? im.toDataURL() : null, vw: vw, vh: vh }; }); }), cat);
        const fs2 = require('fs'); D.forEach(d => { if (d.mask) fs2.writeFileSync('shots/hs/' + cat + '_mask' + d.k + '.png', Buffer.from(d.mask.split(',')[1], 'base64')); delete d.mask; }); console.log('DUMP', JSON.stringify(D)); process.exit(0); }
    } else await p.waitForTimeout(300);
  }
  const fin = await p.evaluate(c => HSIM.get(c).peek(S => ({ fin: S.fin, score: S.score, phase: S.phase, cons: S.cons, notes: S.notes })), cat);
  console.log('END', JSON.stringify(fin)); console.log(errs.length ? errs.slice(0, 8).join('\n') : 'NO ERRORS'); await b.close();
  if (files.length) { try { execSync('python3 ' + __dirname + '/sheet4.py shots/hs/sheet_' + cat + '.jpg 2400 3 ' + files.join(' ')); } catch (e) { console.log('sheet failed', String(e).slice(0, 200)); } }
})();
