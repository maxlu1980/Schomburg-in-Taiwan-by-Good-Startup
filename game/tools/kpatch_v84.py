# (V84) accessibility and release hygiene
# the duel pad's item buttons show their name and their count: the name alone as aria-label hid the count from assistive technology — the visible text is the name
patch('06_island_g', "b.querySelector('span').textContent = tg(k); b.setAttribute('aria-label', tg(k)); });", "b.querySelector('span').textContent = tg(k); b.removeAttribute('aria-label'); });")
# a stale comment from the reference: the lines are spoken from Mira's own clips (k_vox.js), no third-party voice is embedded
patch('14_island_n', "spoken from the embedded VOICEVOX clips", "spoken from the embedded voice clips (k_vox.js)")
