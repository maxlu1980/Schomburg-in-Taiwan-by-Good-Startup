/* ===== KW — the world of SCHOMBURG · KÖLN: the sky, the light and the weather over the one city =====
   The reference game's world (TWW) without its island: the sky dome with the sun, the moon and the true stars over Köln, the palette by the sun's
   real altitude, the weather (AccuWeather's Altstadt-Nord cell or the Köln/Bonn climate), the rain and the snow, the lightning, the soft
   shadows that follow the camera, the environment map, the street lamps that light the ground at night. The ground, the buildings, the Rhine and
   everything else that stands are the city's own (KOELN3D). Units: 1 = 1.2 m. */
var KW = (function () {
  var K = KIT, V3 = THREE.Vector3;
  var Q = { low: false, shadow: 2048, view: 140, grass: 0 };
  function lin(h) { return K.lin(h); }
  /* ================= time of day ================= */
  var KEYS = [ /* hour: sky top, horizon, low, sun colour, sun k, hemi sky, hemi ground, hemi k, fog, exposure, night, stars, bloom */
    [0, 0x0b1430, 0x1c2c4f, 0x111a33, 0x9fb4ff, 0.26, 0x3a4c84, 0x1a2036, 0.42, 0x1a2644, 1.1, 1, 1, 0.55],
    [4.6, 0x13204a, 0x2c3a62, 0x1a2444, 0x9fb4ff, 0.24, 0x3e5290, 0x1c2438, 0.42, 0x26355a, 1.06, 1, 0.8, 0.5],
    [5.8, 0x4a5f9a, 0xf2a98a, 0x8b7fa0, 0xffb07a, 0.66, 0x8a9cc8, 0x5a4a44, 0.39, 0xd9a99a, 1.0, 0.5, 0.1, 0.42],
    [7.5, 0x5aa6ea, 0xd8eef6, 0xa8d4e8, 0xfff0d6, 1.43, 0xb8dcf4, 0x7a8a5a, 0.47, 0xcfe6f2, 1.0, 0, 0, 0.3],
    [12, 0x3f92e0, 0xcdeaf8, 0xa0d0e8, 0xfff8ec, 1.7, 0xbfe2f8, 0x80905e, 0.5, 0xc8e4f4, 0.98, 0, 0, 0.28],
    [16, 0x4a98e2, 0xd6ecf4, 0xa8d4e6, 0xfff0d8, 1.53, 0xbcdcf2, 0x84905c, 0.48, 0xd0e6f0, 1.0, 0, 0, 0.3],
    [17.6, 0x6a8fd6, 0xffcf96, 0xe0b090, 0xffc27a, 1.31, 0xd8c4b8, 0x8a7a58, 0.42, 0xf2cfa6, 1.02, 0.1, 0, 0.42],
    [18.6, 0x4a5a9e, 0xff9a6a, 0xb07a86, 0xff8a54, 0.71, 0xb09ab0, 0x5a4a48, 0.36, 0xe39c84, 1.04, 0.55, 0.15, 0.55],
    [19.5, 0x1c2a5a, 0x5a4a78, 0x2a2a48, 0xb0b8ff, 0.28, 0x52609a, 0x22283a, 0.4, 0x3a3a62, 1.08, 1, 0.7, 0.6],
    [24, 0x0b1430, 0x1c2c4f, 0x111a33, 0x9fb4ff, 0.26, 0x3a4c84, 0x1a2036, 0.42, 0x1a2644, 1.1, 1, 1, 0.55]];
  var TITLE = [0, 0x8a7fc8, 0xffb8a0, 0xf0a6a0, 0xffc9a0, 1.3, 0xf0c8c8, 0xc89a8a, 0.5, 0xf4bfae, 1.0, 0, 0, 0.5];
  function preset(h) { if (h === 'title') return unpack(TITLE); h = ((h % 24) + 24) % 24; var i; for (i = 0; i < KEYS.length - 1; i++) if (h >= KEYS[i][0] && h <= KEYS[i + 1][0]) break; var a = KEYS[i], b = KEYS[i + 1], t = (h - a[0]) / Math.max(1e-6, b[0] - a[0]), o = unpack(a), p = unpack(b); Object.keys(o).forEach(function (k) { if (o[k] instanceof THREE.Color) o[k].lerp(p[k], t); else if (typeof o[k] === 'number') o[k] += (p[k] - o[k]) * t; }); o.h = h; return o; }
  function unpack(a) { return { top: lin(a[1]), hz: lin(a[2]), low: lin(a[3]), sunC: lin(a[4]), sunK: a[5], hemiS: lin(a[6]), hemiG: lin(a[7]), hemiK: a[8], fog: lin(a[9]), expo: a[10], night: a[11], stars: a[12], bloom: a[13], h: a[0] }; }
  function sunDir(h) { if (h === 'title') return new V3(-0.55, 0.22, -0.8).normalize(); var day = h >= 5.6 && h <= 18.8, a, e; if (day) { a = Math.PI * (h - 6) / 12; e = Math.max(0.06, Math.sin(Math.PI * (h - 5.6) / 13.2)) * 1.15; } else { var hn = h < 6 ? h + 24 : h; a = Math.PI * (hn - 18.8) / 11.2; e = Math.max(0.25, Math.sin(Math.PI * (hn - 18.8) / 11.2)) * 0.9; } return new V3(Math.cos(a) * Math.cos(e), Math.sin(e), Math.sin(a) * Math.cos(e) * 0.7 + 0.35).normalize(); }

  /* ================= (V69) the sky as the air makes it =================
     The light of the real sun scattered by the air (Rayleigh: the blue overhead, the white haze low down, the reds and golds when the sun is
     low and its light has crossed a long path) and by the city's haze (Mie: the glare round the sun), its brightness matched to the hour's
     palette so the scene's exposure stays; at dusk the Earth's shadow rising blue-grey in the east under the pink Belt of Venus; at night
     the dark blue of the palette, the orange glow of the city's lights low round the horizon, the Milky Way across the stars (placed by the
     galactic pole in the equatorial frame), the moon by its phase. A deck of cloud drawn over the city to the weather's cover: sunlit tops,
     dark bases, silver edges where the sun stands behind them, dyed by the low sun, lit from below by the city at night, flaring in the
     lightning; thin high cloud when the cover is light, with the 22° halo round the sun; after a shower, with the sun low behind you, the
     rainbow (the second bow outside it, the dark band between). */
  function kwSkyMat(shareU) { return new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: shareU || { uTop: { value: lin(0x4f9be0) }, uHz: { value: lin(0xd3ecf7) }, uLow: { value: lin(0x9fd0e6) }, uSun: { value: new V3(0.3, 0.6, -0.7) }, uSunC: { value: lin(0xfff2dc) }, uSunK: { value: 1 }, uGlowC: { value: new THREE.Color(0, 0, 0) }, uStars: { value: 0 }, uTime: K.U.uTime, uMoon: { value: new V3(-0.4, 0.5, 0.6) }, uMoonK: { value: 0 }, uMoonR: { value: 0.014 }, uCloud: { value: 0 }, uFlash: { value: 0 }, uEq: { value: new THREE.Matrix3() },
      uCover: { value: 0.3 }, uRain: { value: 0 }, uRbow: { value: 0 }, uHalo: { value: 0 }, uThin: { value: 0 }, uDrift: { value: new THREE.Vector2() }, uNightK: { value: 0 }, uHaze: { value: 0.25 } },
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w * 0.9999; }',
    fragmentShader: [
'uniform vec3 uTop, uHz, uLow, uSun, uSunC, uMoon, uGlowC; uniform float uStars, uTime, uMoonK, uSunK, uMoonR, uCloud, uFlash; uniform mat3 uEq;',
'uniform float uCover, uRain, uRbow, uHalo, uThin, uNightK, uHaze; uniform vec2 uDrift; varying vec3 vD;',
'float h3(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }',
'float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h3(vec3(i, 1.0)), h3(vec3(i + vec2(1.0, 0.0), 1.0)), f.x), mix(h3(vec3(i + vec2(0.0, 1.0), 1.0)), h3(vec3(i + 1.0, 1.0)), f.x), f.y); }',
'float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * n2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }',
'float fbm3(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * n2(p); p = p * 2.07 + vec2(5.3, 1.1); a *= 0.5; } return s / 0.875; }',
/* the air: Rayleigh and Mie optical depths at the zenith (red, green, blue), the air mass along a direction (Kasten and Young) */
'const vec3 TR = vec3(0.041, 0.099, 0.245); const vec3 TOZ = vec3(0.0035, 0.0105, 0.0004);',
'float airm(float y){ float z = degrees(acos(clamp(y, 0.0, 1.0))); return 1.0 / (max(y, 0.0) + 0.50572 * pow(max(96.07995 - z, 0.5), -1.6364)); }',
'vec3 atmos(vec3 d, vec3 s){ float mu = dot(d, s); vec3 TM = vec3(0.21, 0.23, 0.25) * (0.22 + uHaze * 1.4); float pr = 0.0596831 * (1.0 + mu * mu); float g = 0.72; float pm = 0.0795775 * (1.0 - g * g) / pow(max(1e-4, 1.0 + g * g - 2.0 * g * mu), 1.5);',
'  float mv = airm(max(d.y, 0.0)), ms = airm(max(s.y, -0.02)); vec3 Ts = exp(-(TR + TM) * ms - TOZ * ms * 4.0) * smoothstep(-0.12, 0.02, s.y); vec3 sc = (TR * pr + TM * pm) / (TR + TM); return 22.0 * sc * (1.0 - exp(-(TR + TM) * mv)) * Ts; }',
'vec3 sunTrans(vec3 s){ vec3 TM = vec3(0.21, 0.23, 0.25) * (0.22 + uHaze * 1.4); float am = airm(max(s.y, -0.02)); return exp(-(TR + TM) * am - TOZ * am * 4.0) * smoothstep(-0.03, 0.02, s.y); }',
'float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }',
/* the colours of the bows: a spectrum from violet (0) to red (1) */
'vec3 spec(float t){ return clamp(vec3(smoothstep(0.45, 0.95, t) + smoothstep(0.25, 0.0, t) * 0.5, smoothstep(0.15, 0.55, t) * smoothstep(1.0, 0.6, t), smoothstep(0.55, 0.2, t)), 0.0, 1.0); }',
'void main(){ vec3 d = normalize(vD); float y = d.y; vec3 s = normalize(uSun);',
/* the palette's gradient (the night and the art direction), then the air's scattering scaled to the palette's brightness */
' vec3 pal = y > 0.0 ? mix(uHz, uTop, pow(clamp(y * 1.25, 0.0, 1.0), 0.62)) : mix(uHz, uLow, clamp(-y * 3.0, 0.0, 1.0));',
' vec3 Tsg = sunTrans(s); Tsg /= max(max(Tsg.r, Tsg.g), 1e-3);',
' vec2 sh = normalize(s.xz + vec2(1e-5)); float fa = dot(normalize(d.xz + vec2(1e-5)), sh) * 0.5 + 0.5; pal += uGlowC * pow(fa, 3.0) * exp(-max(y, 0.0) * 5.5) * (1.0 - uCloud * 0.75);',
' vec3 phy = atmos(vec3(d.x, max(y, 0.0), d.z), s), zen = atmos(vec3(0.0, 1.0, 0.0), s); float sc = clamp(lum(mix(uTop, uHz, 0.35)) / max(lum(zen) * 0.75 + lum(atmos(normalize(vec3(-s.x, 0.25, -s.z)), s)) * 0.25, 1e-4), 0.0, 4.0);',
' phy *= sc; if (y < 0.0) phy = mix(phy, uLow * (0.6 + 0.4 * lum(phy) / max(lum(uLow), 1e-3)), clamp(-y * 4.0, 0.0, 1.0));',
' float wP = smoothstep(-0.03, 0.12, s.y) * (1.0 - uCloud * 0.55); vec3 c = mix(pal, phy, wP * 0.8); c = mix(c, c * vec3(0.86, 0.95, 1.12), smoothstep(0.15, 0.8, y) * wP * 0.6);',
/* dusk and dawn: the Earth's shadow and the Belt of Venus opposite the sun */
' { float Lr = max(lum(mix(uTop, uHz, 0.5)), 1e-3) * 1.5; float lc = lum(c); if (lc > Lr) c *= (Lr + (lc - Lr) * 0.12) / lc; }',
' float tw = smoothstep(0.06, -0.01, s.y) * smoothstep(-0.2, -0.04, s.y) * (1.0 - uCloud * 0.8); if (tw > 0.001) { float anti = max(0.0, -dot(normalize(d.xz + vec2(1e-5)), sh)); float bnd = max(0.0, -s.y) * 1.3 + 0.015; float below = smoothstep(bnd + 0.025, bnd - 0.03, y) * anti * step(-0.02, y); c = mix(c, c * vec3(0.5, 0.56, 0.78), below * tw * 0.8); float ven = exp(-pow((y - bnd - 0.06) / 0.05, 2.0)) * anti; c += vec3(0.5, 0.22, 0.26) * ven * tw * 0.35 * lum(uHz); }',
/* the city's glow on the night's horizon */
' { float sg = smoothstep(0.3, 0.0, s.y) * smoothstep(-0.12, -0.01, s.y) * (1.0 - uCloud * 0.6); c += uSunC * Tsg * pow(fa, 4.0) * exp(-max(y, 0.0) * 7.0) * sg * 0.55; }',
' c += vec3(0.075, 0.048, 0.026) * uNightK * exp(-max(y, 0.0) * 7.0) * (0.6 + 0.8 * uCloud);',
/* the Milky Way: a band along the galactic equator, brighter towards the centre, its dust lanes */
' vec3 e = uEq * d; if (uStars > 0.002 && y > -0.02) { float b = dot(e, vec3(-0.8678, -0.1970, 0.4560)); float gc = max(0.0, dot(e, vec3(-0.0549, -0.8735, -0.4838))); float band = exp(-pow(b / 0.16, 2.0)) * (0.35 + 0.9 * pow(gc, 3.0)); float dust = fbm(vec2(atan(e.y, e.x) * 5.0, b * 22.0)); band *= smoothstep(0.25, 0.75, dust) * 0.8 + 0.2; c += vec3(0.72, 0.76, 0.95) * band * 0.06 * uStars * smoothstep(-0.02, 0.2, y) * (1.0 - uMoonK * 0.6); }',
' if (uStars > 0.002 && y > -0.03) { vec3 g = e * 260.0; vec3 q = floor(g); float r = h3(q); if (r > 0.9972) { float mag = (r - 0.9972) / 0.0028; float pt = smoothstep(0.42, 0.08, length(fract(g) - 0.5)); float tws = 0.7 + 0.3 * sin(uTime * (1.3 + mag * 2.0) + r * 61.0) * (1.0 - smoothstep(0.1, 0.5, y) * 0.6); c += mix(vec3(1.0, 0.86, 0.72), vec3(0.78, 0.86, 1.0), h3(q + 3.0)) * pt * tws * (0.35 + mag * 1.4) * uStars * smoothstep(-0.03, 0.12, y); } }',
/* the sun: its disc darkening towards the limb, reddened by the air it shines through, the glare round it */
' float mu = dot(d, s); vec3 Tsun = sunTrans(s); float rd = clamp((1.0 - mu) / (1.0 - 0.99988), 0.0, 2.0); float disc = rd < 1.0 ? (1.0 - 0.62 * (1.0 - sqrt(max(0.0, 1.0 - rd * rd)))) : 0.0; disc *= smoothstep(1.0, 0.92, rd);',
' vec3 sunCol = uSunC * mix(vec3(1.0), Tsun / max(max(Tsun.r, Tsun.g), 1e-3), 0.7); c += sunCol * uSunK * (disc * 30.0 + pow(max(mu, 0.0), 300.0) * 0.8 + pow(max(mu, 0.0), 40.0) * 0.12);',
/* the moon */
' float mc = dot(d, uMoon); if (uMoonK > 0.002 && mc > 0.995) { vec3 t1 = normalize(cross(vec3(0.0, 1.0, 0.0001), uMoon)); vec3 t2 = cross(uMoon, t1); vec2 q = vec2(dot(d, t1), dot(d, t2)) / sin(uMoonR); float r2 = dot(q, q);',
'  c += vec3(0.75, 0.82, 1.0) * exp(-r2 * 0.09) * 0.05 * uMoonK * smoothstep(0.0, 0.3, dot(-uMoon, s) + 0.6);',
'  if (r2 < 1.0) { vec3 n = -uMoon * sqrt(1.0 - r2) + t1 * q.x + t2 * q.y; float lit = clamp(dot(n, s) * 3.0 + 0.04, 0.0, 1.0); float mar = n2(q * 2.6 + 3.7) * 0.55 + n2(q * 6.1 + 1.3) * 0.3 + n2(q * 14.0) * 0.15; vec3 alb = vec3(1.0, 0.97, 0.9) * (0.58 + 0.42 * smoothstep(0.38, 0.62, mar)); c = mix(c, alb * (lit * 2.6 + 0.03) * (0.82 + 0.18 * sqrt(1.0 - r2)), uMoonK * smoothstep(1.0, 0.9, r2)); } }',
/* the deck of cloud: the ray to a layer about 1.5 km up, its density from the cover, lit from the sun's side through its own thickness */
' if (y > 0.0 && (uCover > 0.02 || uThin > 0.02)) { float t = 1.0 / (y + 0.05); vec2 p = d.xz * t * 0.62 + uDrift; float fade = smoothstep(0.0, 0.05, y); float cov = clamp(uCover, 0.0, 1.0);',
/* the shape: a warped field (towers and gaps, not a blur), billows on it */
'  vec2 q = p * 0.8; q += (vec2(fbm3(q * 0.7 + 3.1), fbm3(q * 0.9 + 7.7)) - 0.5) * 0.38; float base = fbm(q) * 0.62 + (1.0 - abs(fbm3(q * 1.9 - 1.7) * 2.0 - 1.0)) * 0.38;',
'  float lo = mix(0.7, 0.18, cov), den = clamp((base - lo) / (0.16 + 0.22 * cov), 0.0, 1.0); den = clamp(den - (1.0 - den) * fbm3(q * 6.3 + uDrift * 2.0) * 0.45, 0.0, 1.0); den = den * den * (3.0 - 2.0 * den); den = max(den, smoothstep(0.86, 1.0, cov) * (0.82 + 0.18 * base));',
/* the light: how much cloud lies toward the sun (its shadow inside the cloud), the sun's colour through the air, the sky's light from above */
'  vec2 sd2 = normalize(s.xz + vec2(1e-5)) * 0.09; float occ = 0.0; for (int i = 1; i <= 3; i++) { vec2 qq = q + sd2 * float(i); float bb = fbm3(qq) * 0.78 + 0.11; occ += clamp((bb - lo) / (0.16 + 0.22 * cov), 0.0, 1.0); }',
'  float shade = exp(-occ * 0.75 - den * 0.35); float day = smoothstep(-0.1, 0.06, s.y); vec3 lit = uSunC * Tsun / max(max(Tsun.r, Tsun.g), 1e-3) * uSunK; vec3 amb = mix(uHz, uTop, 0.45);',
'  float hg = 0.0795775 * (1.0 - 0.5625) / pow(max(1e-4, 1.0 + 0.5625 - 1.5 * mu), 1.5);',
'  vec3 cc = amb * (0.82 - 0.42 * den) + lit * day * (0.12 + 0.95 * shade) * (0.6 + 0.4 * (1.0 - cov)) + lit * day * min(hg, 3.0) * (1.0 - den) * smoothstep(0.0, 0.4, den) * 1.8;',
/* at sunset the bases glow: the sun below the deck lights it from underneath, red, strongest toward the sun */
'  float sl = smoothstep(0.14, 0.01, s.y) * smoothstep(-0.11, -0.01, s.y); cc += lit * sl * (0.55 + 0.9 * pow(fa, 2.0)) * (1.1 - 0.5 * den) * (1.0 - cov * 0.6);',
'  float ovc = smoothstep(0.7, 1.0, cov) * den; cc = mix(cc, cc * vec3(0.55, 0.58, 0.66) * (0.7 + 0.6 * smoothstep(0.35, 0.8, fbm3(q * 2.2 + 5.0))), ovc * 0.7); cc *= 1.0 - uRain * 0.5 * den;',
'  cc += vec3(0.048, 0.03, 0.016) * uNightK * den * (0.5 + 0.5 * cov); cc += vec3(0.75, 0.78, 0.95) * uFlash * den * 1.6; float al = clamp(smoothstep(0.0, 0.3, den) * fade, 0.0, 1.0);',
'  c = mix(c, cc, al);',
/* the thin high cloud: streaks drawn out by the wind aloft */
'  if (uThin > 0.02) { vec2 pc = d.xz * t * 0.25 + uDrift * 0.4; float ci = fbm(vec2(pc.x * 0.6 + pc.y * 0.25, pc.y * 3.2)); float cir = smoothstep(0.52, 0.85, ci) * uThin * fade; c = mix(c, mix(amb, lit * day + amb * 0.5, 0.6) * 1.05 + lit * sl * 0.8, cir * 0.55); } }',
/* the bows and the halo, in front of the cloud (the rain and the ice are nearer than the deck) */
' if (uRbow > 0.002 && y > -0.01) { float a = degrees(acos(clamp(-mu, -1.0, 1.0))); float p1 = (a - 40.6) / 1.8, p2 = (a - 50.2) / 3.0; vec3 bow = vec3(0.0); if (p1 > 0.0 && p1 < 1.0) bow += spec(p1) * smoothstep(0.0, 0.15, p1) * smoothstep(1.0, 0.85, p1); if (p2 > 0.0 && p2 < 1.0) bow += spec(1.0 - p2) * smoothstep(0.0, 0.2, p2) * smoothstep(1.0, 0.8, p2) * 0.42; float inner = smoothstep(40.8, 36.0, a) * 0.18; float alex = step(42.4, a) * step(a, 50.2) * 0.12; c = c * (1.0 - alex * uRbow) + (bow * 0.9 + inner) * uRbow * lum(uHz) * smoothstep(-0.01, 0.06, y); }',
' if (uHalo > 0.002) { float a = degrees(acos(clamp(mu, -1.0, 1.0))); float hr = exp(-pow((a - 22.0) / 0.9, 2.0)); c += (vec3(1.0, 0.92, 0.85) * hr + vec3(0.25, 0.05, 0.0) * exp(-pow((a - 21.4) / 0.5, 2.0))) * uHalo * 0.28 * lum(uHz); }',
' c += vec3(0.62, 0.66, 0.82) * uFlash; gl_FragColor = vec4(c, 1.0);', '\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'].join('\n') }); }
  /* ================= build ================= */
  function build(scene, opt) {
    opt = opt || {}; Q.low = !!opt.low; if (Q.low) { Q.shadow = 1024; Q.view = 105; }
    if (opt.quality) Object.assign(Q, opt.quality);
    K.detailTex();
    var W = { scene: scene, Q: Q, colliders: [], interact: [], places: {}, npcs: [], signs: [], chunks: [], anim: [], night: 0, relabelers: [], glows: [], parts: [] }, i;
    /* the water's light: the Rhine shares the sun, the sky and the fog the sky sets (W.seaU) */
    var seaU = { uSun: { value: new V3(0.3, 0.6, -0.7) }, uSunC: { value: lin(0xfff2dc) }, uSky: { value: lin(0xbfe3f5) }, uFog: { value: lin(0xcfe6f2) }, uFogN: { value: 60 }, uFogF: { value: 190 }, uDeep: { value: lin(0x3a5a52) }, uShallow: { value: lin(0x5f7d6a) } };
    var sea = { material: { uniforms: seaU } }; W.seaU = seaU;
    /* the sky */
    var sky = new THREE.Mesh(new THREE.SphereGeometry(800, 48, 24), kwSkyMat()); sky.frustumCulled = false; scene.add(sky); W.sky = sky;
    /* the clouds: the city builds its own fair-weather clouds and takes their colours from these; a few far off over the Bergisches Land and the Eifel */
    var ctex = K.blobTex(), cg = new THREE.PlaneGeometry(1, 0.625), cl = [], r = K.seeded(13); for (i = 0; i < 24; i++) { var a = r() * 6.283, d = 420 + r() * 260, s2 = 60 + r() * 60; cl.push({ p: [Math.cos(a) * d, 120 + r() * 60, Math.sin(a) * d], s: [s2, s2, s2] }); }
    var clouds = K.inst(cg, K.cloudMat(ctex), cl, { cast: false, recv: false }); clouds.frustumCulled = false; clouds.renderOrder = 2; clouds.material.uniforms.uNear.value = 60; clouds.visible = false; /* the sky's own deck of cloud replaces the sprites */ scene.add(clouds); W.clouds = clouds;
    var tclouds = K.inst(cg, K.cloudMat(ctex), cl.slice(0, 4), { cast: false, recv: false }); tclouds.visible = false; scene.add(tclouds); W.titleClouds = tclouds;
    /* the light */
    var sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true; sun.shadow.mapSize.set(Q.shadow, Q.shadow); var sc = sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 160; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.035; scene.add(sun); scene.add(sun.target); W.sun = sun;
    var hemi = new THREE.HemisphereLight(0xbfe2f8, 0x80905e, 0.75); scene.add(hemi); W.hemi = hemi;
    scene.fog = new THREE.Fog(0xcfe6f2, 70, 200); W.fog = scene.fog;
    /* the environment map from a small sky scene */
    var envScene = new THREE.Scene(), envSky = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 12), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { uTop: { value: lin(0x4f9be0) }, uHz: { value: lin(0xd3ecf7) }, uLow: { value: lin(0x6b8a5a) } }, vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }', fragmentShader: 'uniform vec3 uTop,uHz,uLow; varying vec3 vD; void main(){ float y = vD.y; vec3 c = y > 0.0 ? mix(uHz, uTop, pow(clamp(y,0.0,1.0),0.6)) : mix(uHz, uLow, clamp(-y*2.5,0.0,1.0)); gl_FragColor = vec4(c, 1.0); }' })); envScene.add(envSky); W.envScene = envScene; W.envSky = envSky;
    /* (V69) the environment the glass, the metal and the wet stone reflect: the real sky (its clouds, the sunset, the sun), with the city's ground below */
    var envSky2 = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), kwSkyMat(Object.assign({}, sky.material.uniforms, { uLow: envSky.material.uniforms.uLow, uFlash: { value: 0 } }))); envScene.add(envSky2); envSky.visible = false; W.envSky2 = envSky2;
    /* ---------- API ---------- */
    W.height = function (x, z) { return -1; }; /* beyond the city: nothing to stand on (the city answers inside its bounds) */
    W.land = function (x, z) { return false; };
    W.preset = preset;
    W.setTime = function (h) { var P = preset(h), sd2 = sunDir(h); W.P = P; W.hour = h;
      sky.material.uniforms.uTop.value.copy(P.top); sky.material.uniforms.uHz.value.copy(P.hz); sky.material.uniforms.uLow.value.copy(P.low); sky.material.uniforms.uSun.value.copy(sd2); sky.material.uniforms.uSunC.value.copy(P.sunC); sky.material.uniforms.uStars.value = P.stars; sky.material.uniforms.uMoonK.value = P.night; sky.material.uniforms.uMoon.value.set(-sd2.x, Math.abs(sd2.y) + 0.2, -sd2.z).normalize();
      if (h !== 'title' && (h < 5.6 || h > 18.8)) { sky.material.uniforms.uSun.value.set(0, -1, 0); }
      sun.color.copy(P.sunC); sun.intensity = P.sunK; W.sunDir = sd2; hemi.color.copy(P.hemiS); hemi.groundColor.copy(P.hemiG); hemi.intensity = P.hemiK; if (W.urban) hemi.groundColor.copy(lin(0x6e6a64)).multiplyScalar(1 - P.night * 0.75);
      W.fogLin = P.fog.clone(); if (W.post) scene.fog.color.copy(P.fog); else { var c = P.fog.clone().convertLinearToSRGB(); scene.fog.color.setRGB(c.r, c.g, c.b); }
      var sm = sea.material.uniforms; sm.uSun.value.copy(sd2); sm.uSunC.value.copy(P.sunC).multiplyScalar(P.night > 0.5 ? 0.25 : 1); sm.uFog.value.copy(P.fog); sm.uSky.value.copy(P.hz); sm.uDeep.value.copy(lin(0x3a5a52)).multiplyScalar(1 - P.night * 0.75); sm.uShallow.value.copy(lin(0x5f7d6a)).multiplyScalar(1 - P.night * 0.7);
      [clouds, tclouds].forEach(function (c2) { c2.material.uniforms.uCol.value.copy(P.hz).lerp(lin(0xffffff), 0.55).multiplyScalar(1 - P.night * 0.55); c2.material.uniforms.uShade.value.copy(P.low).lerp(P.top, 0.3).multiplyScalar(1 - P.night * 0.5); });
      K.U.uNight.value = P.night; W.night = P.night;
      if (W.post) { W.post.final.uniforms.uExpo.value = P.expo; W.post.final.uniforms.uBloom.value = P.bloom * (W.Q.bloom == null ? 1 : W.Q.bloom); }
      envSky.material.uniforms.uTop.value.copy(P.top); envSky.material.uniforms.uHz.value.copy(P.hz); envSky.material.uniforms.uLow.value.copy(W.urban ? hemi.groundColor : P.hemiG); W.envDirty = true;
      W.relabelers.forEach(function (f) { if (f.time) f.time(P); }); };
    /* a city's ground (asphalt and concrete, not grass) for the light bounced from below and the reflections of the lower sky */
    W.setUrban = function (on) { on = !!on; if (!!W.urban === on) return; W.urban = on; var P = W.P; if (!P) return; if (on) hemi.groundColor.copy(lin(0x6e6a64)).multiplyScalar(1 - (P.night || 0) * 0.75); else hemi.groundColor.copy(P.hemiG); envSky.material.uniforms.uLow.value.copy(hemi.groundColor); W.envDirty = true; };
    /* (V79) the shadow box by the camera's height: 26 m round the walker, wider steps for the views from above (the opening film, the flights) —
       in steps with a margin, so that the texels do not change size as the camera climbs; and the box moved only in whole texels of the shadow
       map, in the light's own plane, so that the shadows' edges do not shimmer and crawl as the camera glides (the film's flickering ground) */
    var SHL = [[26, 60, 160, 0.035, -0.0004], [55, 110, 300, 0.07, -0.0006], [115, 220, 520, 0.14, -0.0008], [190, 300, 720, 0.24, -0.001]], _sv = new V3(), _sr = new V3(), _su = new V3(), _sp = new V3(); W.shLvl = 0;
    W.follow = function (x, z, camPos) { /* the sun's shadow box and the sky follow the camera's target */
      var d = W.sunDir || new V3(0.3, 0.8, 0.4), h = camPos ? camPos.y : 0, L = W.shLvl, up = [24, 52, 105], dn = [18, 42, 88]; while (L < 3 && h > up[L]) L++; while (L > 0 && h < dn[L - 1]) L--;
      var S = SHL[L], sc = sun.shadow.camera; if (L !== W.shLvl || sc.right !== S[0]) { W.shLvl = L; sc.left = -S[0]; sc.right = S[0]; sc.top = S[0]; sc.bottom = -S[0]; sc.far = S[2]; sc.updateProjectionMatrix(); sun.shadow.normalBias = S[3]; sun.shadow.bias = S[4]; }
      _sv.set(d.x * S[1], Math.max(8, d.y * S[1]), d.z * S[1]); var vn = _sp.copy(_sv).normalize(); _sr.set(0, 1, 0).cross(vn); if (_sr.lengthSq() < 1e-8) _sr.set(1, 0, 0); _sr.normalize(); _su.copy(vn).cross(_sr);
      var ts = 2 * S[0] / (sun.shadow.mapSize.x || 1024), a = x * _sr.x + z * _sr.z, b = x * _su.x + z * _su.z, da = Math.round(a / ts) * ts - a, db = Math.round(b / ts) * ts - b, tx = x + _sr.x * da + _su.x * db, ty = _sr.y * da + _su.y * db, tz = z + _sr.z * da + _su.z * db;
      sun.position.set(tx + _sv.x, ty + _sv.y, tz + _sv.z); sun.target.position.set(tx, ty, tz); sun.target.updateMatrixWorld();
      if (camPos) sky.position.copy(camPos);
      var vr = Q.view; W.parts.forEach(function (p) { var dd = Math.hypot(p.x - x, p.z - z) - p.r; p.o.visible = dd < vr + 10; }); };
    W.update = function (dt, t) { K.U.uTime.value = t; W.anim.forEach(function (f) { f(dt, t); }); };
    W.envUpdate = function (R3) { if (!W.envDirty || !R3) return; W.envDirty = false; if (!W.pmrem) W.pmrem = new THREE.PMREMGenerator(R3); var old = scene.environment; var rtE = W.pmrem.fromScene(envScene, 0, 0.1, 100); scene.environment = rtE.texture; if (W._envRT) W._envRT.dispose(); W._envRT = rtE; };
    W.relabel = function (fn) { W.relabelers.forEach(function (f) { if (f.label) f.label(fn); }); };
    W.region = function (x, z) { var best = null, bd = 1e9; Object.keys(W.places).forEach(function (k) { var p = W.places[k], d = Math.hypot(p.x - x, p.z - z); if (d < (p.rr || 16) && d < bd) { bd = d; best = k; } }); return best; };
    (function () {
    /* ================= the real sky: the hour by the sun's altitude, the moon, the stars, the weather, the season =================
       The palette follows the true solar elevation (degrees): night below -18, the blue hour, the golden hour, the day. The weather
       greys the sky and softens the sun, brings the fog in, wets the ground, rains, flashes. The street lamps light the ground. */
    var SKYK = [ /* alt: top, horizon, low, light colour, light k, hemi sky, hemi ground, hemi k, fog, glow, stars, night, exposure, bloom */
      [-90, 0x03060f, 0x070e1e, 0x050a14, 0x9fb4ff, 0, 0x142038, 0x070a10, 0.16, 0x070d1a, 0x000000, 1, 1, 1.22, 0.3],
      [-18, 0x03060f, 0x070e1e, 0x050a14, 0x9fb4ff, 0, 0x142038, 0x070a10, 0.16, 0x070d1a, 0x000000, 1, 1, 1.22, 0.3],
      [-12, 0x060d24, 0x111d40, 0x0a101e, 0x9fb4ff, 0, 0x1c2a50, 0x0b0f18, 0.2, 0x0d1528, 0x14183a, 0.85, 1, 1.22, 0.32],
      [-6, 0x13205a, 0x343a6c, 0x181d34, 0xffa070, 0, 0x3a4888, 0x181c2a, 0.34, 0x222848, 0x6c3e66, 0.35, 0.85, 1.18, 0.4],
      [-3, 0x283e84, 0x7c6488, 0x342f44, 0xff9a66, 0.06, 0x6676a6, 0x2e2f36, 0.52, 0x6e5a74, 0xc0684e, 0.06, 0.6, 1.15, 0.6],
      [0, 0x3a5aa6, 0xe09c7c, 0x86788a, 0xff8a4a, 0.35, 0x8e9ab8, 0x4c4a40, 0.55, 0xd09884, 0xff8c50, 0, 0.32, 1.1, 0.55],
      [3, 0x4a76c6, 0xf2c29a, 0xb4a6a0, 0xffb070, 0.82, 0xb4bed4, 0x666048, 0.45, 0xe6c2a8, 0xff9e5e, 0, 0.1, 1.04, 0.5],
      [8, 0x4a8ad6, 0xdcdedc, 0xa8c8dc, 0xffdcb4, 1.35, 0xbcd4ec, 0x7a8456, 0.48, 0xd6e2ea, 0x6a4a30, 0, 0, 1.0, 0.45],
      [20, 0x4392e0, 0xd2eaf6, 0xa4d0e8, 0xfff0d8, 1.6, 0xbfe0f6, 0x80905e, 0.5, 0xcde6f4, 0x000000, 0, 0, 0.98, 0.42],
      [45, 0x3f90e0, 0xcdeaf8, 0xa0d0e8, 0xfff8ec, 1.72, 0xbfe2f8, 0x80905e, 0.5, 0xc8e4f4, 0x000000, 0, 0, 0.97, 0.42],
      [90, 0x3f90e0, 0xcdeaf8, 0xa0d0e8, 0xfff8ec, 1.72, 0xbfe2f8, 0x80905e, 0.5, 0xc8e4f4, 0x000000, 0, 0, 0.97, 0.42]];
    function palette(alt) { var i; for (i = 0; i < SKYK.length - 2; i++) if (alt < SKYK[i + 1][0]) break; var a = SKYK[i], b = SKYK[i + 1], t = Math.max(0, Math.min(1, (alt - a[0]) / Math.max(1e-6, b[0] - a[0]))); t = t * t * (3 - 2 * t);
      function C(k) { return lin(a[k]).lerp(lin(b[k]), t); } function N(k) { return a[k] + (b[k] - a[k]) * t; }
      return { top: C(1), hz: C(2), low: C(3), sunC: C(4), sunK: N(5), hemiS: C(6), hemiG: C(7), hemiK: N(8), fog: C(9), glow: C(10), stars: N(11), night: N(12), expo: N(13), bloom: N(14), h: alt }; }
    function grey(c, k, dark) { var l = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722; c.lerp(new THREE.Color(l, l * 1.01, l * 1.04), k); c.multiplyScalar(dark); return c; }
    var WXS = { cloud: 0.2, rain: 0, fog: 0, thunder: 0, wind: 10, wet: 0, snow: 0, vis: 30 }, SKYST = { A: null, se: null, wx: null, t: 0, envT: 0, x: 0, z: 0 }, FLASH = { k: 0, next: 4, seq: [] };
    var EQ = new THREE.Matrix3();
    /* the brightest stars, where they really are (RA hours, Dec degrees, magnitude): the constellations are there to be found */
    var STARS = [[6.752, -16.72, -1.46], [6.399, -52.7, -0.74], [14.261, 19.18, -0.05], [18.616, 38.78, 0.03], [5.278, 46.0, 0.08], [5.242, -8.2, 0.13], [7.655, 5.22, 0.34], [1.629, -57.24, 0.46], [5.919, 7.41, 0.5], [14.064, -60.37, 0.61], [19.846, 8.87, 0.76], [12.443, -63.1, 0.76], [4.599, 16.51, 0.86], [16.49, -26.43, 0.96], [13.42, -11.16, 0.97], [7.755, 28.03, 1.14], [22.961, -29.62, 1.16], [20.69, 45.28, 1.25], [12.795, -59.69, 1.25], [10.14, 11.97, 1.35], [6.977, -28.97, 1.5], [7.577, 31.89, 1.58], [17.56, -37.1, 1.62], [12.519, -57.11, 1.63], [5.419, 6.35, 1.64], [5.438, 28.61, 1.65], [9.22, -69.72, 1.67], [5.604, -1.2, 1.69], [22.137, -46.96, 1.73], [5.679, -1.94, 1.77], [12.9, 55.96, 1.77], [11.062, 61.75, 1.79], [3.405, 49.86, 1.79], [7.14, -26.39, 1.83], [17.622, -43.0, 1.86], [18.403, -34.38, 1.85], [8.375, -59.51, 1.86], [13.792, 49.31, 1.86], [5.992, 44.95, 1.9], [16.811, -69.03, 1.91], [6.629, 16.4, 1.93], [20.427, -56.74, 1.94], [2.53, 89.26, 1.98], [6.378, -17.96, 1.98], [9.46, -8.66, 1.98], [2.12, 23.46, 2.0], [0.727, -17.99, 2.04], [18.921, -26.3, 2.05], [14.111, -36.37, 2.06], [13.399, 54.93, 2.23], [0.14, 29.09, 2.06], [1.163, 35.62, 2.06], [5.796, -9.67, 2.09], [14.845, 74.16, 2.08], [17.582, 12.56, 2.08], [3.136, 40.96, 2.12], [2.065, 42.33, 2.1], [11.818, 14.57, 2.13], [5.533, -0.3, 2.23], [11.031, 56.38, 2.37], [11.897, 53.69, 2.44], [12.257, 57.03, 3.31], [0.675, 56.54, 2.24], [0.153, 59.15, 2.28], [0.945, 60.72, 2.47], [1.43, 60.24, 2.68], [1.907, 63.67, 3.37], [21.736, 9.88, 2.39], [23.079, 15.21, 2.48], [23.063, 28.08, 2.42], [0.22, 15.18, 2.83], [20.37, 40.26, 2.23], [19.512, 27.96, 3.05], [3.791, 24.11, 2.87], [16.006, -22.62, 2.29], [14.848, -16.04, 2.75], [13.036, 10.96, 2.83], [15.738, 6.43, 2.63], [17.943, 51.49, 2.24], [21.31, 62.59, 2.45]];
    var stG = new THREE.BufferGeometry(), stP = new Float32Array(STARS.length * 3), stS = new Float32Array(STARS.length); STARS.forEach(function (q, k) { stS[k] = Math.max(1.6, 6.2 - (q[2] + 1.5) * 1.15); });
    stG.setAttribute('position', new THREE.BufferAttribute(stP, 3)); stG.setAttribute('size', new THREE.BufferAttribute(stS, 1));
    var stM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: true, fog: false, blending: THREE.AdditiveBlending, uniforms: { uK: { value: 0 }, uDpr: { value: 1 }, uTime: K.U.uTime },
      vertexShader: 'attribute float size; uniform float uDpr, uTime; varying float vA; void main(){ vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w * 0.99985; vA = 0.8 + 0.2 * sin(uTime * 2.1 + position.x * 0.07); gl_PointSize = size * uDpr; }',
      fragmentShader: 'uniform float uK; varying float vA; void main(){ vec2 q = gl_PointCoord - 0.5; float r = length(q); float a = smoothstep(0.5, 0.0, r); a = a * a; gl_FragColor = vec4(vec3(1.0, 0.97, 0.92) * a * uK * vA * 1.4, 1.0); }' });
    var stars = new THREE.Points(stG, stM); stars.frustumCulled = false; stars.renderOrder = -1; scene.add(stars); W.stars = stars;
    /* the rain: streaks in a box that travels with the camera, drawn by the GPU from a fixed buffer */
    var RN = Q.low ? 900 : 2400, rp = new Float32Array(RN * 2 * 3), ra = new Float32Array(RN * 2 * 4), re = new Float32Array(RN * 2), rr0 = K.seeded(77);
    for (i = 0; i < RN; i++) { var ax = rr0() * 2 - 1, az = rr0() * 2 - 1, ay = rr0(), aw = rr0(); [0, 1].forEach(function (e2) { var k = i * 2 + e2; ra.set([ax, az, ay, aw], k * 4); re[k] = e2; }); }
    var rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3)); rg.setAttribute('a', new THREE.BufferAttribute(ra, 4)); rg.setAttribute('e', new THREE.BufferAttribute(re, 1));
    var rainM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, fog: false, uniforms: { uC: { value: new V3() }, uT: K.U.uTime, uBox: { value: 9 }, uH: { value: 12 }, uWv: { value: new THREE.Vector2() }, uA: { value: 0 }, uFall: { value: 11 }, uLen: { value: 0.045 }, uCol: { value: new THREE.Color(0.7, 0.76, 0.86) } },
      vertexShader: 'uniform vec3 uC; uniform float uT, uBox, uH, uFall, uLen; uniform vec2 uWv; attribute vec4 a; attribute float e; varying float vE; void main(){ float sp = uFall * (0.8 + a.w * 0.4); float y = mod(a.z * uH - uT * sp, uH); vec3 p = vec3(uC.x + a.x * uBox, uC.y - 3.0 + y, uC.z + a.y * uBox); vec3 v = vec3(uWv.x, -sp, uWv.y); p += v * uLen * e; vE = e; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }',
      fragmentShader: 'uniform float uA; uniform vec3 uCol; varying float vE; void main(){ gl_FragColor = vec4(uCol, uA * (0.35 + 0.65 * vE)); }' });
    var rain = new THREE.LineSegments(rg, rainM); rain.frustumCulled = false; rain.visible = false; rain.renderOrder = 3; scene.add(rain); W.rain = rain;
    function applySky(P, sunD, moon, cl) {
      var u = sky.material.uniforms; u.uTop.value.copy(P.top); u.uHz.value.copy(P.hz); u.uLow.value.copy(P.low); u.uSun.value.set(sunD[0], sunD[1], sunD[2]); u.uSunC.value.copy(P.sunC); u.uGlowC.value.copy(P.glow);
      u.uSunK.value = Math.max(0, Math.min(1, (P.h + 1.2) / 1.5)) * Math.max(0, 1 - Math.pow(cl, 1.3) * 0.97); u.uStars.value = P.stars * Math.max(0, 1 - cl * 1.1); u.uCloud.value = cl;
      /* the deck of cloud, the high veil, the haze, the bows and the halo follow the weather (W.skyFx overrides them for a view) */
      var fx = W.skyFx || {}, alt = P.h, up = Math.max(0, Math.min(1, (alt - 2) / 6)), smk = function (a0, a1, x) { var t = Math.max(0, Math.min(1, (x - a0) / (a1 - a0))); return t * t * (3 - 2 * t); };
      u.uCover.value = fx.cover != null ? fx.cover : Math.min(1, WXS.cloud * 0.95 + WXS.rain * 0.35); u.uRain.value = WXS.rain; u.uNightK.value = P.night; u.uHaze.value = Math.min(1, 0.16 + cl * 0.3 + WXS.fog * 0.6);
      u.uThin.value = fx.thin != null ? fx.thin : (0.18 + 0.6 * smk(0.08, 0.4, WXS.cloud) * (1 - smk(0.55, 0.85, WXS.cloud))) * (1 - Math.min(1, WXS.rain * 2));
      u.uHalo.value = fx.halo != null ? fx.halo : u.uThin.value * smk(0.4, 0.7, u.uThin.value) * smk(6, 14, alt) * 0.9;
      u.uRbow.value = fx.rbow != null ? fx.rbow : (WXS.wet > 0.2 && WXS.rain > 0.015 && WXS.rain < 0.45 ? 1 : 0) * up * (1 - smk(36, 42, alt)) * (1 - smk(0.7, 0.92, cl)) * smk(0.015, 0.08, WXS.rain);
      if (moon) { u.uMoon.value.set(moon.dir[0], moon.dir[1], moon.dir[2]); u.uMoonK.value = moon.alt > -1 ? (0.35 + 0.65 * P.night) * Math.max(0, 1 - cl * 0.9) : 0; } else u.uMoonK.value = 0;
      stM.uniforms.uK.value = u.uStars.value;
      /* the light: the sun while it is up (never from below the horizon), else the moon by its phase and height, else the faint sky */
      var ld = sunD, lc = P.sunC, lk = P.sunK * Math.max(0.06, 1 - Math.pow(cl, 1.4) * 0.82);
      if (P.h < -2 && moon && moon.alt > 1.5) { ld = moon.dir; lc = lin(0xa4b8ff); lk = 0.2 * Math.pow(moon.illum, 1.5) * Math.min(1, Math.sin(moon.alt * Math.PI / 180) * 3.5) * Math.max(0.1, 1 - cl * 0.85); }
      else if (P.h < -2) { ld = [0.25, 0.9, 0.35]; lc = lin(0x8ea4e0); lk = 0.05; }
      var lv = new V3(ld[0], Math.max(0.08, ld[1]), ld[2]).normalize(); sun.color.copy(lc); sun.intensity = lk; W.sunDir = lv;
      hemi.color.copy(P.hemiS); hemi.groundColor.copy(P.hemiG); hemi.intensity = P.hemiK * (1 + cl * 0.25);
      W.fogLin = P.fog.clone(); if (W.post) scene.fog.color.copy(P.fog); else { var c = P.fog.clone().convertLinearToSRGB(); scene.fog.color.setRGB(c.r, c.g, c.b); }
      var sm = sea.material.uniforms; sm.uSun.value.copy(lv); sm.uSunC.value.copy(lc).multiplyScalar(lk / 1.7); sm.uFog.value.copy(P.fog); sm.uSky.value.copy(P.hz); sm.uDeep.value.copy(lin(0x3a5a52)).multiplyScalar((1 - P.night * 0.8) * (1 - cl * 0.3)); sm.uShallow.value.copy(lin(0x5f7d6a)).multiplyScalar((1 - P.night * 0.75) * (1 - cl * 0.3));
      [clouds, tclouds].forEach(function (c2) { c2.material.uniforms.uCol.value.copy(P.hz).lerp(lin(0xffffff), 0.55 - cl * 0.25).multiplyScalar((1 - P.night * 0.7) * (1 - WXS.rain * 0.35)); c2.material.uniforms.uShade.value.copy(P.low).lerp(P.top, 0.3).multiplyScalar((1 - P.night * 0.6) * (1 - cl * 0.35)); });
      K.U.uNight.value = P.night; W.night = P.night; W.P = P;
      /* the sun's shafts through the spires, the bridge's arches and the gaps in the cloud: strongest with the sun low in a hazy, broken sky */
      if (W.post) { var ry = W.post.rays || (W.post.rays = { dir: new V3(), k: 0, col: new THREE.Color(), thr: 0.6 }); ry.dir.set(sunD[0], sunD[1], sunD[2]).normalize();
        var lowS = Math.max(0, Math.min(1, (P.h + 1) / 4)) * (1 - smk(8, 30, P.h) * 0.8), brk = 0.55 + 0.9 * Math.max(0, Math.min(1, cl / 0.45)) * (1 - Math.max(0, Math.min(1, (cl - 0.7) / 0.22)));
        ry.k = fx.rays != null ? fx.rays : lowS * brk * (0.55 + u.uHaze.value * 0.9) * (1 - WXS.rain * 0.7) * 0.9; ry.col.copy(P.sunC).lerp(lin(0xffb070), Math.max(0, Math.min(1, (14 - P.h) / 14)) * 0.5);
        ry.thr = Math.max(0.15, (P.hz.r * 0.2126 + P.hz.g * 0.7152 + P.hz.b * 0.0722) * 1.05); }
      if (W.post) { W.post.final.uniforms.uExpo.value = P.expo * (1 + cl * 0.08); W.post.final.uniforms.uBloom.value = P.bloom * (W.Q.bloom == null ? 1 : W.Q.bloom); }
      envSky.material.uniforms.uTop.value.copy(P.top); envSky.material.uniforms.uHz.value.copy(P.hz); envSky.material.uniforms.uLow.value.copy(P.hemiG);
      W.relabelers.forEach(function (f) { if (f.time) f.time(P); }); }
    /* where and when: the clock of the island and the place the camera looks at */
    W.skyAt = function (x, z) { SKYST.x = x; SKYST.z = z; };
    W.sky2 = function (date, force) { var A = SKY.at(date, SKYST.x, SKYST.z), se = SKY.season(date), wt = SKY.weather(date, SKYST.x, SKYST.z); SKYST.A = A; SKYST.se = se; SKYST.wx = wt; SKYST.date = date;
      if (force) { WXS.cloud = wt.cloud; WXS.rain = Math.max(wt.rain, wt.drizzle * 0.5); WXS.fog = wt.fog; WXS.wet = Math.max(WXS.wet, WXS.rain > 0.1 ? 0.8 : 0); WXS.snow = wt.snow; }
      K.U.uSeason.value.set(se.tint[0], se.tint[1], se.tint[2]); K.U.uBloomS.value = se.bloom;
      EQ.set.apply(EQ, A.eq); sky.material.uniforms.uEq.value.copy(EQ);
      var lat = A.lat * Math.PI / 180, ll = SKY.lonlat(SKYST.x, SKYST.z);
      STARS.forEach(function (q, k) { var ra = q[0] / 12 * Math.PI, dec = q[1] * Math.PI / 180, X = Math.cos(dec) * Math.cos(ra), Y = Math.cos(dec) * Math.sin(ra), Z = Math.sin(dec), e = A.eq;
        /* world = M v, M the transpose of eq */ stP[k * 3] = (e[0] * X + e[3] * Y + e[6] * Z) * 760; stP[k * 3 + 1] = (e[1] * X + e[4] * Y + e[7] * Z) * 760; stP[k * 3 + 2] = (e[2] * X + e[5] * Y + e[8] * Z) * 760; });
      stG.attributes.position.needsUpdate = true; W.skyTick(0, true); return A; };
    /* every frame: the weather eases toward the latest report, the palette follows the sun, the rain falls, the lightning flashes */
    W.skyTick = function (dt, now) { var A = SKYST.A, wt = SKYST.wx; if (!A || !wt) return; var k = now ? 1 : 1 - Math.exp(-dt / 12);
      WXS.cloud += (wt.cloud - WXS.cloud) * k; var rT = Math.max(wt.rain, wt.drizzle * 0.55, wt.snow * 0.8); WXS.rain += (rT - WXS.rain) * k; WXS.fog += (wt.fog - WXS.fog) * k; WXS.snow += ((wt.snow > 0 ? 1 : 0) - WXS.snow) * k; WXS.wind += ((wt.wind || 10) - WXS.wind) * k; WXS.thunder = wt.thunder;
      /* the deck drifts with the wind aloft (a little faster than the wind below, from the same quarter) */
      var wdd = ((wt.windDir != null ? wt.windDir : 240) + 15) * Math.PI / 180, wv = (WXS.wind || 10) * 0.0009; sky.material.uniforms.uDrift.value.x -= Math.sin(wdd) * wv * dt; sky.material.uniforms.uDrift.value.y += Math.cos(wdd) * wv * dt;
      var wetT = WXS.rain > 0.05 ? Math.min(1, 0.45 + WXS.rain) : 0; WXS.wet += (wetT - WXS.wet) * (wetT > WXS.wet ? 1 - Math.exp(-dt / 25) : 1 - Math.exp(-dt / 240)); if (now) WXS.wet = Math.max(WXS.wet, wetT * 0.9);
      K.U.uWet.value = WXS.wet; K.U.uWind.value = Math.max(0.5, Math.min(3, 0.6 + WXS.wind / 22));
      var cl = Math.min(1, WXS.cloud + WXS.rain * 0.2), P = palette(A.sun.alt); grey(P.top, cl * 0.82, 1 - cl * 0.32 - WXS.rain * 0.18); grey(P.hz, cl * 0.75, 1 - cl * 0.2 - WXS.rain * 0.15); grey(P.low, cl * 0.6, 1 - cl * 0.2); grey(P.fog, cl * 0.7 + WXS.fog * 0.3, 1 - cl * 0.15); grey(P.hemiS, cl * 0.6, 1); P.sunC.lerp(lin(0xf2f0ec), cl * 0.5); P.glow.multiplyScalar(1 - cl * 0.7);
      /* lightning */ if (WXS.thunder && WXS.rain > 0.3) { FLASH.next -= dt; if (FLASH.next <= 0) { FLASH.next = 5 + Math.random() * 14; FLASH.seq = [0, 0.09, 0.2, 0.32].map(function (x, j) { return [x, j % 2 ? 0 : 1]; }); FLASH.t = 0; } }
      if (FLASH.seq.length) { FLASH.t += dt; var on = 0; FLASH.seq.forEach(function (q, j) { var nx = FLASH.seq[j + 1]; if (FLASH.t >= q[0] && (!nx || FLASH.t < nx[0])) on = q[1]; }); FLASH.k = on * (FLASH.t < 0.4 ? 1 : 0); if (FLASH.t > 0.5) FLASH.seq = []; } else FLASH.k = 0;
      applySky(P, A.sun.dir, A.moon, cl); sky.material.uniforms.uFlash.value = FLASH.k * 0.9; if (FLASH.k) { hemi.intensity += 1.6; }
      /* the fog: haze in the rain, close in a fog, far on a clear day */ var far = 200 - cl * 30 - WXS.rain * 70; if (WXS.fog > 0.05) far = far * (1 - WXS.fog) + 38 * WXS.fog; if (wt.vis != null && wt.vis < 20) far = Math.min(far, Math.max(36, wt.vis * 12)); scene.fog.far = far; scene.fog.near = Math.min(70, far * 0.32);
      /* the clouds: as many as the cover */ clouds.count = Math.max(6, Math.round(clouds.instanceMatrix.count * (0.15 + 0.85 * cl)));
      SKYST.envT -= dt; if (SKYST.envT <= 0 || now) { SKYST.envT = 15; W.envDirty = true; } };
    W.rainTick = function (camPos) { var a = WXS.rain; rain.visible = a > 0.02 && camPos.y < 40; if (!rain.visible) return; var u = rainM.uniforms; u.uC.value.copy(camPos); u.uA.value = Math.min(0.5, 0.12 + a * 0.4) * (W.post ? 1 : 0.8);
      var sn = WXS.snow > 0.5; u.uFall.value = sn ? 1.6 : 11 + a * 4; u.uLen.value = sn ? 0.02 : 0.05; u.uCol.value.setRGB(sn ? 1 : 0.68, sn ? 1 : 0.74, sn ? 1 : 0.85).multiplyScalar(0.5 + (1 - W.night) * 0.6);
      var wr = (WXS.wind / 3.6) * 0.35, wd = ((SKYST.wx && SKYST.wx.windDir) || 45) * Math.PI / 180; u.uWv.value.set(-Math.sin(wd) * wr, Math.cos(wd) * wr); rg.setDrawRange(0, Math.round(RN * Math.min(1, 0.15 + a)) * 2); };
    W.wxState = function () { return { flash: FLASH.k, cloud: WXS.cloud, rain: WXS.rain, fog: WXS.fog, wet: WXS.wet, thunder: WXS.thunder, wind: WXS.wind, snow: WXS.snow, report: SKYST.wx, sun: SKYST.A && SKYST.A.sun, moon: SKYST.A && SKYST.A.moon, season: SKYST.se }; };
    /* the street lamps that light the ground: the nearest twelve to the camera's target, in view space (bent like the world) */
    var LV = new V3(), LS = [], SPW = { p: new V3(), d: new V3(), k: 0 };
    W.setSpot = function (p, d, k, o) { o = o || {}; SPW.p.copy(p); SPW.d.copy(d).normalize(); SPW.k = k; K.U.uSpCos.value.set(Math.cos(o.outer || 0.5), Math.cos(o.inner || 0.28)); K.U.uSpR.value = o.range || 18; if (o.color) K.U.uSpC.value.set(o.color); };
    W.lightsTick = function (cam, tx, tz) { var n = 0, nk = W.night, U2 = K.U, mv = cam.matrixWorldInverse, f = U2.uFocus.value, cv = U2.uCurve.value;
      function toView(v) { v.applyMatrix4(mv); var iDz = Math.max(0, -v.z - f); v.y -= cv * iDz * iDz; return v; }
      if (nk > 0.05 && W.glows) { LS.length = 0; W.glows.forEach(function (g) { var d = Math.hypot(g[0] - tx, g[2] - tz); if (d < 34) LS.push([d, g]); }); LS.sort(function (a, b) { return a[0] - b[0]; });
        for (var j = 0; j < LS.length && n < (Q.low ? 6 : 12); j++) { var g = LS[j][1]; toView(LV.set(g[0], g[1] - 0.05, g[2])); U2.uLLp.value[n].set(LV.x, LV.y, LV.z, 2.8 * nk * Math.min(1, (34 - LS[j][0]) / 8) * (g[4] || 1)); n++; } }
      U2.uLLn.value = n;
      if (SPW.k > 0.01) { toView(LV.copy(SPW.p)); U2.uSpP.value.copy(LV); var d2 = SPW.d.clone().transformDirection(mv); U2.uSpD.value.copy(d2); U2.uSpK.value = SPW.k; } else U2.uSpK.value = 0; };

      var setTimeOld = W.setTime; W.setTimeFixed = function (h) { setTimeOld(h); var u = sky.material.uniforms; u.uMoonK.value = 0; u.uStars.value = 0; stM.uniforms.uK.value = 0; rain.visible = false; K.U.uLLn.value = 0; W.night = 0; };
      W.setTime = function (h) { if (h === 'title' || !SKYST.A) { setTimeOld(h); var u = sky.material.uniforms; if (h === 'title') { u.uSunK.value = 1; u.uGlowC.value.setRGB(0.25, 0.1, 0.06); u.uCloud.value = 0; u.uMoonK.value = 0; u.uStars.value = 0; stM.uniforms.uK.value = 0; rain.visible = false; K.U.uLLn.value = 0; } return; } W.skyTick(0, true); };
    })();
    W.setTime(12); return W; }
  return { build: build, Q: Q, preset: preset, sunDir: sunDir };
})();
