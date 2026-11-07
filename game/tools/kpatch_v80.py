# (V80) the street play's walkers follow a way of several points (a detour round trees, benches, bollards), there and back
patch('08_island_i', "if (n.kind === 'ped' && n.route) { var q = n.route[n.rk]; if (stepNpc(n, q[0], q[1], n.sp, dt)) n.rk = 1 - n.rk; }",
      "if (n.kind === 'ped' && n.route) { var q = n.route[n.rk]; if (stepNpc(n, q[0], q[1], n.sp, dt)) { var RL = n.route.length; if (RL <= 2) n.rk = 1 - n.rk; else { n.rdir = n.rdir || 1; if (n.rk + n.rdir >= RL || n.rk + n.rdir < 0) n.rdir = -n.rdir; n.rk += n.rdir; } } }")
# (V80) the camera's and the turn's easing made independent of the frame rate: Math.min(1, dt * k) (a step that grows with the frame's length
# and clips at 1, so 15 fps felt stiffer than 60) becomes kfi(dt, k) = 1 - (1 - k/60)^(dt·60) — the same at 60 fps, exact at any rate
def _kfi_seg(part, start):
    s0 = open(P + part + '.js').read()
    for _a2, _b2, _n2 in PATCH.get(part, []):
        s0 = s0.replace(_a2, _b2)
    a = s0.index(start); b = s0.index('\n  function ', a + 10); seg = s0[a:b]; out = ''; i = 0; key = 'Math.min(1, dt * '
    while True:
        j = seg.find(key, i)
        if j < 0: out += seg[i:]; break
        k = j + len(key); depth = 1; m = k
        while depth:
            if seg[m] == '(': depth += 1
            elif seg[m] == ')': depth -= 1
            m += 1
        out += seg[i:j] + 'kfi(dt, ' + seg[k:m - 1] + ')'; i = m
    if out != seg: patch(part, seg, out)
_kfi_seg('07_island_h', '  function tkCamera')
_kfi_seg('01_island_b', '  function camera(dt, snap)')
_kfi_seg('01_island_b', '  function move(dt) {')
