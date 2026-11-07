// scenario runner for the Köln game: node kplay.js scenario.json  (actions: ["steps",n] ["wait",ms] ["eval","isle expr"] ["js","page expr"] ["shot",name] ["key",code,down] ["start"] ["title"])
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = 'shots/kplay/'; fs.mkdirSync(OUT, { recursive: true });
const SC = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const o = SC.opts || {}; const W = o.w || 1280, H = o.h || 760;
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'].concat(o.autoplay ? ['--autoplay-policy=no-user-gesture-required'] : []) });
  const p = await b.newPage({ viewport: { width: W, height: H }, hasTouch: !!o.touch, isMobile: !!o.touch });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | '))); p.on('console', m => { if (m.type() === 'error' || (m.type() === 'warning' && !/GPU stall|GL Driver/.test(m.text()))) errs.push(m.type() + ' ' + m.text().slice(0, 400)); });
  await p.addInitScript(o => { window.NO_GOV = true; window.ISLE_TEST = true; window.ISLE_TIER = o.tier || 'mid'; window.ISLE_DPR = o.dpr || 0.7; window.KT_LANG = o.lang || 'en'; window.ISLE_WX = o.wx || { code: 2, cloud: 0.35 }; if (o.hour != null) { window.ISLE_HOUR = o.hour; window.ISLE_TK_HOUR = o.hour; } if (!o.audio) { delete window.AudioContext; delete window.webkitAudioContext; } if (o.clear) try { localStorage.clear(); } catch (e) {} if (o.win) Object.keys(o.win).forEach(function (k) { window[k] = o.win[k]; }); }, o);
  await p.goto('http://127.0.0.1:8765/ktest/' + (o.page || 'game.html'), { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => window.KT_READY, null, { timeout: 300000 }).catch(() => errs.push('READY timeout'));
  const be = await p.evaluate(() => window.__bootErr || null); if (be) console.log('BOOT', be);
  async function steps(n, dt) { return p.evaluate(([n, dt]) => { try { return ISLE_x.ev('(function(){ cancelAnimationFrame(raf); for (var i = 0; i < ' + n + '; i++) { var nw = performance.now(); last = ' + (dt ? 'nw - ' + (dt * 1000) : '0') + '; frame(nw); cancelAnimationFrame(raf); } return mode; })()'); } catch (e) { return 'ERR ' + e.message; } }, [n, dt || 0]); }
  for (const a of SC.actions) {
    const t0 = Date.now(); let r;
    try {
      if (a[0] === 'steps') r = await steps(a[1], a[2]);
      else if (a[0] === 'wait') { await p.waitForTimeout(a[1]); r = ''; }
      else if (a[0] === 'eval') r = await p.evaluate(x => { try { var v = ISLE_x.ev(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, a[1]);
      else if (a[0] === 'js') r = await p.evaluate(x => { try { var v = eval(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, a[1]);
      else if (a[0] === 'shot') { await p.screenshot({ path: OUT + a[1] + '.jpg', type: 'jpeg', quality: 78, timeout: 150000 }); r = 'saved'; }
      else if (a[0] === 'key') r = await p.evaluate(([c, d]) => ISLE_x.ev('keys.' + c + ' = ' + (d ? 'true' : 'false')), [a[1], a[2]]);
      else if (a[0] === 'start') r = await p.evaluate(() => { try { ISLE._dbg.startGame(); return 'ok'; } catch (e) { return 'ERR ' + e.message; } });
      else if (a[0] === 'click') { await p.click(a[1], { timeout: 3000 }); r = 'clicked'; }
      else if (a[0] === 'save') { const v = await p.evaluate(x => eval(x), a[1]); require('fs').writeFileSync(a[2], Buffer.from(String(v), 'base64')); r = 'saved ' + a[2]; }
      else if (a[0] === 'ajs') r = await p.evaluate(async x => { try { var v = await eval(x); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return 'ERR ' + e.message; } }, a[1]);
      else if (a[0] === 'jsfile') { await p.addScriptTag({ path: require('path').join(__dirname, a[1]) }); r = 'loaded'; }
    } catch (e) { r = 'XERR ' + e.message; }
    console.log(JSON.stringify(a).slice(0, 140), '=>', String(r).slice(0, (a[0] === 'js' || a[0] === 'eval') && a[2] ? a[2] : 600), '(' + (Date.now() - t0) + 'ms)');
  }
  console.log('ERRS', errs.length); [...new Set(errs)].slice(0, 30).forEach(e => console.log(e));
  await b.close();
})();
