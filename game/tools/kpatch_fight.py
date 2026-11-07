# Köln patches for the duel (06_island_g), the five styles (11_island_k), the full-strength styles / police (14_island_n), the super moves (16_island_p).
# The tables themselves (WPN, SHD, ARM, GSLOT, FOE, TXG, FSX, DXN, DXGD, SPX) are re-assigned in src/koeln/isle/kt_fight.js.
# Format: patch(part, old, new[, n]) — `old` must occur exactly n times (default 1) in game/ref/parts/<part>.js.

# ---- part g: the duel ----
# the buff icon's tooltip when a buff has no name: en / zh / de instead of ja
patch('06_island_g', "{ zh: k, en: k, ja: k }", "{ en: k, zh: k, de: k }")
# the empty fallbacks of the place line and the subtitle (gate card twice, the opening banner, the win card)
patch('06_island_g', "{ zh: '', en: '', ja: '' }", "{ en: '', zh: '', de: '' }", 4)
# Slump's crew (the adds of the duel) instead of the Black Tide crewmen
patch('06_island_g', "{ n: { zh: '黑潮會手下', en: 'Crewman', ja: '手下' } }", "{ n: { en: 'Crewman', zh: '「坍落」的手下', de: 'Handlanger' } }")
# an art pressed before any practice site is visited: point to the first site (crack injection on the Breslauer Platz), not Hsinchu
patch('06_island_g', "{ d: lx(STN.hsz) + ' · ' + dn('sl') }", "{ d: lx(STN.inj) + ' · ' + dn('inj') }")
# the sparks of an art take the colour of its guide: the six SCHOMBURG guides instead of the reference's four product worlds
patch('06_island_g', "var cc = { sl: 0xff9a3a, ux: 0x5ac8f0, po: 0xffe070, ad: 0xb08aff }[o.art]", "var cc = { inj: 0x5ac8f0, cr: 0xff9a3a, wp: 0x3a9cff, rc: 0xb08aff, ca: 0x9ad870, pf: 0xffe070 }[o.art]")

# ---- part n: the heavy unit is German police ----
# the armoured van's side and rear plates
patch('14_island_n', "x.fillText('POLICE', 128, 46)", "x.fillText('POLIZEI', 128, 46)")
# the officers' shields (a slightly smaller face so the longer word fits the 128 px canvas)
patch('14_island_n', "x2.font = 'bold 26px sans-serif'; x2.textAlign = 'center'; x2.fillText('POLICE', 64, 70)", "x2.font = 'bold 22px sans-serif'; x2.textAlign = 'center'; x2.fillText('POLIZEI', 64, 70)")
# German police carry blue lamps only: the van's red lamp becomes a second blue one
patch('14_island_n', "var lr = new THREE.Mesh(bx(0.5, 0.1, 0.22), new THREE.MeshBasicMaterial({ color: 0xff2a2a, toneMapped: false }))", "var lr = new THREE.Mesh(bx(0.5, 0.1, 0.22), new THREE.MeshBasicMaterial({ color: 0x2a6aff, toneMapped: false }))")

# ---- parts k and p: no inline strings a player sees outside their tables (FSX, SPX); nothing to patch ----
