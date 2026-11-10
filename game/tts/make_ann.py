# The station's announcements -> neural speech (Supertonic 3 via sherpa-onnx, a man's voice) -> trimmed, levelled, 16 kHz MP3s
# -> src/koeln/isle/k_ann.js (base64 clips keyed by line id + the player from annplay.js).
# The wording is our own, in the usual order of a German platform announcement (track, what arrives, where to, a caution); the voice is
# synthetic; no recording of any railway is used.   VOX_SID=8 python3 make_ann.py [only-key ...]
import sherpa_onnx as s, numpy as np, wave, json, subprocess, base64, re, os, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parents[1]
# the Supertonic 3 model files (not in the repository: see README) are looked for in game/tts/model/ or $TTS_MODEL
M = os.environ.get('TTS_MODEL', str(HERE / 'model')) + '/'; OUT = os.environ.get('TTS_OUT', str(HERE / 'ann')) + '/'; os.makedirs(OUT, exist_ok=True)
SID = int(os.environ.get('VOX_SID', '8'))
st = s.OfflineTtsSupertonicModelConfig(duration_predictor=M + 'duration_predictor.onnx', text_encoder=M + 'text_encoder.onnx', vector_estimator=M + 'vector_estimator.onnx', vocoder=M + 'vocoder.onnx', tts_json=M + 'tts.json', unicode_indexer=M + 'unicode_indexer.bin', voice_style=M + 'voice.bin')
mc = s.OfflineTtsModelConfig(); mc.supertonic = st; mc.num_threads = 2; mc.provider = 'cpu'
tts = s.OfflineTts(s.OfflineTtsConfig(model=mc)); SR = tts.sample_rate
L = json.load(open(HERE / 'ann_lines.json', encoding='utf-8')); only = sys.argv[1:]
def trim(x):
    a = np.abs(x); th = max(1e-3, a.max() * 0.02); idx = np.where(a > th)[0]
    if not len(idx): return x
    i0 = max(0, idx[0] - int(0.03 * SR)); i1 = min(len(x), idx[-1] + int(0.15 * SR)); y = x[i0:i1].copy()
    f = int(0.008 * SR); y[:f] *= np.linspace(0, 1, f); y[-f * 4:] *= np.linspace(1, 0, f * 4); return y
def level(x):
    fr = int(0.02 * SR); e = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)]); act = e[e > e.max() * 0.1]
    g = 10 ** (-18 / 20) / max(1e-4, np.sqrt(np.mean(act ** 2))); y = x * g; lim = 10 ** (-1.5 / 20)
    return np.tanh(y / lim) * lim if np.abs(y).max() > lim else y
data = {}; texts = {}; total = 0; dur = {}
for k, (lang, t) in L.items():
    mp = OUT + k + '.mp3'
    if only and k not in only and os.path.exists(mp): pass
    else:
        g = s.GenerationConfig(); g.sid = SID; g.speed = 0.98; g.num_steps = 12; g.extra = {'lang': lang}
        a = tts.generate(t, g); x = level(trim(np.array(a.samples, dtype=np.float32)))
        wp = OUT + k + '.wav'
        with wave.open(wp, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wp, '-ac', '1', '-ar', '16000', '-af', 'highpass=f=120,lowpass=f=6800', '-c:a', 'libmp3lame', '-b:a', '24k', mp], check=True)
    b = open(mp, 'rb').read(); total += len(b); data[k] = base64.b64encode(b).decode(); texts[k] = t
    with wave.open(OUT + k + '.wav') as w: dur[k] = round(w.getnframes() / w.getframerate(), 2)
    print('%-8s %5.2fs %6d B  %s' % (k, dur[k], len(b), t))
js = '  /* ===== ISLE part K28 (Köln, V87): the station\'s announcements — spoken in German by a neural voice (Supertonic 3, a man\'s voice,\n     generated offline by game/tts/make_ann.py), our own wording in the usual order of a platform announcement; no railway\'s recordings ===== */\n'
js += '  var ANNC = ' + json.dumps(data, separators=(',', ':')) + ';\n'
js += '  var ANNT = ' + json.dumps({k: v[1] for k, v in L.items()}, ensure_ascii=False, separators=(',', ':')) + ';\n'
js += '  var ANND = ' + json.dumps(dur, separators=(',', ':')) + ';\n'
js += open(HERE / 'annplay.js', encoding='utf-8').read()
open(ROOT / 'src' / 'koeln' / 'isle' / 'k_ann.js', 'w', encoding='utf-8').write(js)
print('clips', len(data), 'bytes', total, 'seconds', round(sum(dur.values()), 1), 'js', len(js))
