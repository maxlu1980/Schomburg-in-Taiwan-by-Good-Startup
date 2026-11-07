const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [w, h, mob] of [[1280, 800, false], [390, 844, true]]) { const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob }); const p = await ctx.newPage();
    await p.addInitScript(() => { window.__lt = []; window.__lcp = 0; try { new PerformanceObserver(l => l.getEntries().forEach(e => __lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); new PerformanceObserver(l => l.getEntries().forEach(e => { __lcp = Math.round(e.startTime); })).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {} });
    const t0 = Date.now(); await p.goto('http://127.0.0.1:8765/dist/test.html#/crack-injection', { waitUntil: 'load' }); const tl = Date.now() - t0; await p.waitForTimeout(10000);
    const m = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0], fcp = performance.getEntriesByName('first-contentful-paint')[0]; const lt = __lt.filter(x => x[0] < 10000); return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: fcp ? Math.round(fcp.startTime) : null, lcp: __lcp, longTasks: lt.length, blockedMs: lt.reduce((a, x) => a + Math.max(0, x[1] - 50), 0), longest: lt.reduce((a, x) => Math.max(a, x[1]), 0) }; });
    console.log(w + 'x' + h, 'wall load', tl, 'ms', JSON.stringify(m)); await ctx.close(); }
  await b.close(); })();
