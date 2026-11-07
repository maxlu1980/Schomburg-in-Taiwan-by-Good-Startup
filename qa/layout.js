/* responsive audit: every route × viewport (zh): page-level sideways overflow, elements sticking out of the viewport, small touch targets on touch widths, clipped button labels */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const routes = ['#/crack-injection', '#/concrete-restoration', '#/mineral-waterproofing', '#/retrospective-concrete-waterproofing', '#/concrete-technology/crystalline-concrete-admixture', '#/protective-flooring-coating-systems'];
  const VP = (process.env.VP ? JSON.parse(process.env.VP) : [[360, 740, true], [390, 844, true], [768, 1024, true], [1024, 768, true], [1280, 800, false], [1920, 1080, false]]);
  for (const [w, h, touch] of VP) { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 900 }); const p = await ctx.newPage(); p.setDefaultTimeout(200000); await p.addInitScript(() => { window.NO_GOV = true; window.FAST3D = true; });
    for (const r of routes) { await p.goto('http://127.0.0.1:8765/dist/test.html' + r, { waitUntil: 'load' }); await p.waitForTimeout(1800); await p.evaluate(() => setLang('zh')); await p.waitForTimeout(500);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.9) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
      const o = await p.evaluate(touch => { const W = innerWidth, out = { docOver: document.documentElement.scrollWidth - W, wide: [], small: [], clip: [] }; const seen = new Set();
        document.querySelectorAll('body *').forEach(e => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || e.closest('[hidden]') || e.closest('.hsim')) return; const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
          let clipped = false; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const ac = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(ac.overflowX)) { clipped = true; break; } }
          if (!clipped && (r.right > W + 1 || r.left < -1) && cs.position !== 'fixed') { const key = e.tagName + '.' + (typeof e.className === 'string' ? e.className.split(' ')[0] : ''); if (!seen.has(key)) { seen.add(key); out.wide.push(key + ' ' + Math.round(r.left) + '…' + Math.round(r.right)); } }
          const inter = e.matches('a[href],button,input,select,textarea,[role=button],[tabindex]:not([tabindex="-1"])'); if (touch && inter && (r.width < 24 || r.height < 24) && !e.closest('p,li,td') ) { const key = e.tagName + '.' + (typeof e.className === 'string' ? e.className.split(' ')[0] : '') + '#' + (e.id || ''); if (!seen.has('s' + key)) { seen.add('s' + key); out.small.push(key + ' ' + Math.round(r.width) + '×' + Math.round(r.height)); } }
          if (e.matches('button,.sb-btn,[role=button]') && e.scrollWidth > e.clientWidth + 2 && /hidden|clip/.test(cs.overflowX)) { const key = 'c' + (e.id || e.textContent.trim().slice(0, 20)); if (!seen.has(key)) { seen.add(key); out.clip.push((e.id || e.textContent.trim().slice(0, 24)) + ' ' + e.scrollWidth + '>' + e.clientWidth); } } });
        out.wide = out.wide.slice(0, 6); out.small = out.small.slice(0, 8); out.clip = out.clip.slice(0, 6); return out; }, touch);
      if (o.docOver > 0 || o.wide.length || o.small.length || o.clip.length) console.log(w + 'x' + h, r, JSON.stringify(o)); else console.log(w + 'x' + h, r, 'ok'); }
    await ctx.close(); }
  await b.close(); })();
