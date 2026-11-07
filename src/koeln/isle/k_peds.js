  /* ===== ISLE part K16 (Köln, V74): the walkers keep to the floor. Their ways are lists of points; between two points they walk straight,
     following the floor under their feet (the highest floor within a step of where they are), and where a straight line crossed a wall (in
     the station's passage, past the stair flights' side walls and the shops; round the canopies' columns on the platforms; round buildings),
     they walked through it. Now each way is walked once, in the mind, when the city is built (while the loading screen is up), exactly as the
     walkers walk it: every 25 cm along it, the floor they would stand on, a step no higher than a stair's, and the same floors and walls Mira
     walks by, with a body's width either side. A point that stands in a wall is moved to the nearest free floor at its level; a leg that
     leaves the floor is replaced by a way found round the walls (a search over a half-metre grid that follows the floors, stairs included,
     pulled taut so it runs straight wherever it can). A walker pushed off its way (knocked down, or after the street play) gets its own way
     back the same way. ===== */
  var KPD = { done: null, fixed: 0, bad: 0, snap: 0, legs: 0, ms: 0, guard: 0, list: [] }, KPD_R = 0.2, KPD_ST = 0.25;
  function kpdQ(q) { return q && q.wait == null && !q.cross && q.x == null; } /* a point of the way (not a wait, not a crossing's green man) */
  /* the floor a walker at height y stands on at (x, z), and whether it may stand there with a body's width round it; NB: the city's buckets */
  function kpdG(NB, x, z, y) { var bk = NB.at(x, z); return bk ? TOKYO3D.groundL(bk, x, z, y) : y; }
  function kpdW(NB, x, z, y) { var bk = NB.at(x, z); return !!bk && TOKYO3D.walkL(bk, x, z, y, bk.c, bk.w); }
  function kpdWR(NB, x, z, y, r) { if (!kpdW(NB, x, z, y)) return false; if (!r) return true; return kpdW(NB, x + r, z, y) && kpdW(NB, x - r, z, y) && kpdW(NB, x, z + r, y) && kpdW(NB, x, z - r, y); }
  /* the walk from a (x, z, height) to b, as the walker does it: returns the height at b, or null where it would pass a wall or step off a ledge */
  function kpdSeg(NB, a, b, ya, r) { var dx = b[0] - a[0], dz = b[1] - a[1], d = Math.hypot(dx, dz), n = Math.max(1, Math.ceil(d / KPD_ST)), y = ya, i, px = d > 0 ? -dz / d * (r || 0) : 0, pz = d > 0 ? dx / d * (r || 0) : 0;
    for (i = 1; i <= n; i++) { var u = i / n, x = a[0] + dx * u, z = a[1] + dz * u, y2 = kpdG(NB, x, z, y); if (Math.abs(y2 - y) > 0.5) return null; y = y2; if (!kpdW(NB, x, z, y)) return null; if (r && (!kpdW(NB, x + px, z + pz, y) || !kpdW(NB, x - px, z - pz, y))) return null; } return y; }
  /* the nearest spot within R where a walker at height y may stand (with its body's width), on the same floor */
  function kpdSnap(NB, x, z, y, R) { var g = kpdG(NB, x, z, y); if (Math.abs(g - y) < 0.5 && kpdWR(NB, x, z, g, KPD_R)) return [x, z, g]; var best = null, bd = 1e9, s, a;
    for (s = 0.25; s <= R && !best; s += 0.25) for (a = 0; a < 24; a++) { var qx = x + Math.cos(a / 24 * Math.PI * 2) * s, qz = z + Math.sin(a / 24 * Math.PI * 2) * s, h = kpdG(NB, qx, qz, y); if (Math.abs(h - y) < 0.5 && kpdWR(NB, qx, qz, h, KPD_R) && s < bd) { bd = s; best = [qx, qz, h]; } } return best; }
  /* the way round: A* on a 0.5-unit grid over the two points' box (and M units round it), eight neighbours, each step following the floor
     (a step up or down of at most half a unit: a stair is climbed, a ledge is not), then pulled taut */
  function kpdPath(NB, a, b, ya, yb, M) { var C = 0.5, x0 = Math.min(a[0], b[0]) - M, z0 = Math.min(a[1], b[1]) - M, nx = Math.ceil((Math.max(a[0], b[0]) + M - x0) / C) + 1, nz = Math.ceil((Math.max(a[1], b[1]) + M - z0) / C) + 1;
    if (nx * nz > 300000) return null; var N = nx * nz, H = new Float32Array(N), g = new Float32Array(N), par = new Int32Array(N), shut = new Uint8Array(N), heap = [], i;
    for (i = 0; i < N; i++) { g[i] = 1e9; par[i] = -1; H[i] = NaN; }
    function cx(k) { return x0 + (k % nx) * C; } function cz(k) { return z0 + ((k / nx) | 0) * C; }
    /* the cell nearest a point that the point reaches in a straight walk */ function near(p, y, from) { var ix = Math.round((p[0] - x0) / C), iz = Math.round((p[1] - z0) / C), best = -1, bd = 1e9, bh = 0, r, dx, dz;
      for (r = 0; r <= 4 && best < 0; r++) for (dx = -r; dx <= r; dx++) for (dz = -r; dz <= r; dz++) { if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue; var jx = ix + dx, jz = iz + dz; if (jx < 0 || jz < 0 || jx >= nx || jz >= nz) continue; var k = jz * nx + jx, q = [cx(k), cz(k)], h = from ? kpdSeg(NB, p, q, y, 0) : kpdSeg(NB, q, p, kpdG(NB, q[0], q[1], y), 0);
        if (h == null) continue; if (!from) { h = kpdG(NB, q[0], q[1], y); } if (!kpdWR(NB, q[0], q[1], h, KPD_R)) continue; var dd = dx * dx + dz * dz; if (dd < bd) { bd = dd; best = k; bh = h; } } return best < 0 ? null : [best, bh]; }
    var S0 = near(a, ya, true), E0 = near(b, yb, false); if (!S0 || !E0) return null; var s = S0[0], e = E0[0], ex = e % nx, ez = (e / nx) | 0; H[s] = S0[1];
    function hh(k) { var dx = Math.abs(k % nx - ex), dz = Math.abs(((k / nx) | 0) - ez); return (Math.max(dx, dz) + 0.4142 * Math.min(dx, dz)) * C; }
    function push(k, f) { heap.push([f, k]); var c = heap.length - 1; while (c > 0) { var pp = (c - 1) >> 1; if (heap[pp][0] <= heap[c][0]) break; var t = heap[pp]; heap[pp] = heap[c]; heap[c] = t; c = pp; } }
    function pop() { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var c = 0; for (;;) { var l = c * 2 + 1, r = l + 1, m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; var t = heap[m]; heap[m] = heap[c]; heap[c] = t; c = m; } } return top; }
    /* the floor of a neighbour, reached from a cell at height h (NaN: not walkable from there) */ function step(k, h) { var x = cx(k), z = cz(k), h2 = kpdG(NB, x, z, h); if (Math.abs(h2 - h) > 0.5 || h2 < lo || h2 > hi || !kpdWR(NB, x, z, h2, KPD_R)) return NaN; return h2; }
    /* a way between two points on one floor keeps to that floor (within a metre: a step, the top of a stair), so the search does not wander down a stair into the passage under the platform, whose floor it would then claim */ var lo = -1e9, hi = 1e9; if (yb != null && Math.abs(ya - yb) < 0.6) { lo = Math.min(ya, yb) - 1.0; hi = Math.max(ya, yb) + 1.0; }
    g[s] = 0; push(s, hh(s)); var D8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]], found = false, steps = 0;
    while (heap.length && steps++ < 120000) { var cur = pop()[1]; if (shut[cur]) continue; shut[cur] = 1; if (cur === e) { if (Math.abs(H[cur] - E0[1]) < 0.6) { found = true; break; } shut[cur] = 0; g[cur] = 1e9; continue; } /* (reached on another floor — under it, or over it: not there) */ var ccx = cur % nx, ccz = (cur / nx) | 0, h0 = H[cur];
      for (i = 0; i < 8; i++) { var qx = ccx + D8[i][0], qz = ccz + D8[i][1]; if (qx < 0 || qz < 0 || qx >= nx || qz >= nz) continue; var k = qz * nx + qx; if (shut[k]) continue; var h2 = step(k, h0); if (h2 !== h2) continue;
        if (D8[i][2] > 1 && (step(ccz * nx + qx, h0) !== step(ccz * nx + qx, h0) || step(qz * nx + ccx, h0) !== step(qz * nx + ccx, h0))) continue; var ng = g[cur] + D8[i][2] * C; if (ng < g[k]) { g[k] = ng; par[k] = cur; H[k] = h2; push(k, ng + hh(k)); } } }
    if (!found) return null; var pts = [], k2 = e; while (k2 >= 0) { pts.push([cx(k2), cz(k2), H[k2]]); if (k2 === s) break; k2 = par[k2]; } pts.reverse(); pts.unshift([a[0], a[1], ya]); pts.push([b[0], b[1], null]);
    /* pulled taut: from each kept point, on as far as a straight walk (with the body's width) still keeps to the floor */ var out = [], j = 0, yj = ya;
    while (j < pts.length - 1) { var far = j + 1, yf = null, t; for (t = j + 1; t < pts.length && t - j < 400; t++) { var yy = kpdSeg(NB, pts[j], pts[t], yj, KPD_R); if (yy == null && t > j + 1) break; if (yy == null) { yy = kpdSeg(NB, pts[j], pts[t], yj, 0); if (yy == null) yy = pts[t][2] != null ? pts[t][2] : yj; } far = t; yf = yy; }
      if (far !== pts.length - 1) out.push([pts[far][0], pts[far][1], yf]); j = far; yj = yf; } return out; }
  /* each way of the city, walked once: points in walls moved, legs through walls replaced */
  function kpdFix(T) { var t0 = performance.now(), NB = navBuckets(T), seen = []; KPD.done = T; KPD.fixed = 0; KPD.bad = 0; KPD.snap = 0; KPD.legs = 0; KPD.list = [];
    (T.peds || []).forEach(function (p) { var r = p.r; if (!r || seen.indexOf(r) >= 0) return; seen.push(r); var ri = seen.length - 1, idx = [], i;
      for (i = 0; i < r.length; i++) if (kpdQ(r[i])) idx.push(i); if (idx.length < 2) return;
      /* the heights: each point's floor at its own height; a point standing in a wall goes to the nearest free floor */ var hy = {};
      idx.forEach(function (i2) { var q = r[i2], y = q[2] != null ? q[2] : (T.Y1 || 0.12), g = kpdG(NB, q[0], q[1], y + 0.3); if (Math.abs(g - y) > 0.8) g = y; var sn = kpdSnap(NB, q[0], q[1], g, 6); if (sn && (sn[0] !== q[0] || sn[1] !== q[1])) { q[0] = sn[0]; q[1] = sn[1]; KPD.snap++; } hy[i2] = sn ? sn[2] : g; });
      /* the legs, between consecutive points of the way (over any waits: the walker waits at a point, then walks on), round the loop */ var ins = {};
      for (var m = 0; m < idx.length; m++) { var ia = idx[m], ib = idx[(m + 1) % idx.length], A = r[ia], B = r[ib], cross = false, jj; for (jj = (ia + 1) % r.length; jj !== ib; jj = (jj + 1) % r.length) if (r[jj] && r[jj].cross) cross = true; if (cross) continue; /* a way over a crossing: the road is the green man's */
        KPD.legs++; var ya = hy[ia]; if (kpdSeg(NB, A, B, ya, KPD_R) != null || (kpdSeg(NB, A, B, ya, 0) != null && Math.hypot(B[0] - A[0], B[1] - A[1]) < 3)) continue;
        var Wy = kpdPath(NB, A, B, ya, hy[ib], 16) || kpdPath(NB, A, B, ya, hy[ib], 40); if (Wy) { ins[ib] = Wy; KPD.fixed++; } else { KPD.bad++; KPD.list.push([ri, ia, Math.round(A[0]), Math.round(A[1]), Math.round(B[0]), Math.round(B[1]), +ya.toFixed(2)]); } }
      /* the way's own array is changed in place (the walkers on it share it): the detour goes just before the point it leads to, so a walker
         heading for that point heads for the detour's first point instead */ var old = r.slice(), first = {}, out = [];
      old.forEach(function (q, i3) { first[i3] = out.length; if (ins[i3]) ins[i3].forEach(function (w) { out.push([w[0], w[1], w[2] != null ? w[2] : hy[i3]]); }); out.push(q); });
      r.length = 0; out.forEach(function (q) { r.push(q); }); T.peds.forEach(function (pp) { if (pp.r === r && pp.k != null) pp.k = first[pp.k] != null ? first[pp.k] : 0; }); });
    KPD.ms = Math.round(performance.now() - t0); }
  /* a walker off its way (a knock-down, the street play): before it walks back, the straight line back is walked in the mind; if it leaves the
     floor, the walker gets its own copy of the way with the way round put in */
  function kpdGuard(T, dt) { var NB = null; KPD.gt = (KPD.gt || 0) + dt; if (KPD.gt < 0.35) return; KPD.gt = 0; var budget = 2;
    T.peds.forEach(function (p) { if (!p.r || p.st !== 'walk' || budget <= 0 || !p.A.root.visible) return; var q = p.r[p.k]; if (!kpdQ(q)) return; var P = p.A.root.position;
      var pi = p.k, n = 0; do { pi = (pi - 1 + p.r.length) % p.r.length; n++; } while (n < p.r.length && !kpdQ(p.r[pi])); var pr = p.r[pi]; if (!kpdQ(pr)) return;
      /* on the leg from its last point (that leg was walked when the city was built): nothing to do */ var lx = q[0] - pr[0], lz = q[1] - pr[1], L2 = lx * lx + lz * lz, u = L2 > 0 ? Math.max(0, Math.min(1, ((P.x - pr[0]) * lx + (P.z - pr[1]) * lz) / L2)) : 0;
      if (Math.hypot(P.x - pr[0] - lx * u, P.z - pr[1] - lz * u) < 0.6) { p._chk = null; return; } if (p._chk === p.k) return; p._chk = p.k; /* (once per time off the way) */
      NB = NB || navBuckets(T); budget--; var a = [P.x, P.z], ya = P.y; if (kpdSeg(NB, a, q, ya, 0) != null) return; var Wy = kpdPath(NB, a, q, ya, q[2] != null ? q[2] : ya, 12); if (!Wy || !Wy.length) return;
      var r2 = p.r.slice(), k = p.k; Wy.forEach(function (w, j) { r2.splice(k + j, 0, [w[0], w[1], w[2]]); }); p.r = r2; p._chk = p.k; KPD.guard++; }); }
  /* when the city is built (behind the loading screen); failing that, at its first frame */
  var _koBuildPd = koBuild; koBuild = function () { var had = !!CITY.koeln, C = _koBuildPd.apply(this, arguments); if (!had && C && C.T && C.T.peds && C.T.peds.length) { try { kpdFix(C.T); } catch (e) { KPD.done = C.T; if (window.console) console.error('koeln ways', e); if (window.ISLE_TEST) throw e; } } return C; };
  var _extraTickPd = extraTick; extraTick = function (dt, ts) { _extraTickPd(dt, ts); try { if (TK && TK.id === 'koeln' && TK.T && TK.T.peds && TK.T.peds.length) { if (KPD.done !== TK.T) kpdFix(TK.T); else kpdGuard(TK.T, dt); } } catch (e) { KPD.done = TK && TK.T; if (window.ISLE_TEST) throw e; } };
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.peds = function () { return { fixed: KPD.fixed, bad: KPD.bad, snap: KPD.snap, legs: KPD.legs, ms: KPD.ms, guard: KPD.guard, list: KPD.list.slice(0, 12), n: TK && TK.T && TK.T.peds ? TK.T.peds.length : 0 }; };
