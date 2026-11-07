import os as _os, pathlib as _pl
ROOT = _pl.Path(_os.environ.get('SG_ROOT') or _pl.Path(__file__).resolve().parents[2])  # the repository root
REF = ROOT / 'game' / 'ref'  # the reference engine (ISLE parts in ref/parts, modules in ref/mods) — not part of the repository
SRC = ROOT / 'src' / 'koeln'
import re
p = SRC / 'isle' / 'k_intro.js'
s=open(p).read()
start=s.index("  /* ---------- the fanfare: brass, timpani, a snare roll and a cymbal")
a=s.index("    var LITE = (navigator.hardwareConcurrency")
b=s.index("    /* ---- the time: ♩ = 104")
c=s.index("    if (window.KIN_OFFLINE && ctx.startRendering)")
end=s.index("\n", c)+1
inst=s[a:b].split('\n')
# drop the master / hall / out lines (1..7) — kept: LITE/np (0), N.. (8..)
inst_keep=[inst[0]]+inst[8:]
inst_txt='\n'.join(inst_keep)
# the noise generator from one shared buffer per context
old_noise=[l for l in inst_keep if l.startswith('    function noise(')][0]
new_noise="    var NZ = null; function nz() { if (NZ) return NZ; var n = Math.ceil(ctx.sampleRate * 4), bf = ctx.createBuffer(1, n, ctx.sampleRate), ch = bf.getChannelData(0), i; for (i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1; NZ = bf; return NZ; } /* (one buffer of noise per context, read from a random place) */\n    function noise(t, d, v, f, ty, pan) { var sc = ctx.createBufferSource(); sc.buffer = nz(); var fl = ctx.createBiquadFilter(); fl.type = ty || 'bandpass'; fl.frequency.value = f; fl.Q.value = ty === 'bandpass' ? 0.9 : 0.5; var gg = ctx.createGain(); gg.gain.setValueAtTime(v, t); gg.gain.exponentialRampToValueAtTime(0.0001, t + d); sc.connect(fl); fl.connect(gg); out(gg, pan || 0, 0.8); sc.start(t, R(0, 3.9 - Math.min(3.85, d + 0.05))); sc.stop(t + d + 0.05); }"
inst_txt=inst_txt.replace(old_noise,new_noise)
old_sw=[l for l in inst_keep if l.startswith('    function cymSwell(')][0]
new_sw="    function cymSwell(t, len, v) { var sc = ctx.createBufferSource(); sc.buffer = nz(); var fl = ctx.createBiquadFilter(); fl.type = 'highpass'; fl.frequency.value = 5500; var gg = ctx.createGain(); gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(v, t + len); gg.gain.exponentialRampToValueAtTime(0.0001, t + len + 1.4); sc.connect(fl); fl.connect(gg); out(gg, -0.3, 1.0); sc.start(t, R(0, Math.max(0, 3.9 - len - 1.5))); sc.stop(t + len + 1.5); }"
inst_txt=inst_txt.replace(old_sw,new_sw)
arr=s[b:c]
arr=arr.replace("var B = 60 / 104, T0 = ctx.currentTime + 0.1,","var B = 60 / 104, T0 = 0,")
assert "T0 = 0," in arr
arr=re.sub(r'(?<![\w.])(strings|horn|trumpet|lowBrass|choir|timp|timpRoll|bassDrum|cymbal|cymSwell|drone|shimmer)\(', r'I.\1(', arr)
arr=arr.replace("KIN.auEnd = ts + 2.4 - T0; })();","END = ts + 2.4; })();")
assert "END = ts + 2.4;" in arr
head=open(ROOT / 'game' / 'tools' / 'score79_head.js', encoding='utf-8').read()
tail=open(ROOT / 'game' / 'tools' / 'score79_tail.js', encoding='utf-8').read()
new = head + "  function kscInst(ctx) {\n" + open(ROOT / 'game' / 'tools' / 'score79_bus.js', encoding='utf-8').read() + inst_txt + "\n    return { strings: strings, horn: horn, trumpet: trumpet, lowBrass: lowBrass, choir: choir, noise: noise, timp: timp, bassDrum: bassDrum, cymbal: cymbal, cymSwell: cymSwell, drone: drone, shimmer: shimmer }; }\n" \
  + "  /* the arrangement, written once as a list of notes (I: the recorder); the times in seconds from the score's start */\n  function kscArrange(I) { var END = 0;\n" + arr + "    return { BT: BT, end: END }; }\n" + tail
s=s[:start]+new+s[end:]
open(p,'w').write(s)
print('spliced', len(new))
