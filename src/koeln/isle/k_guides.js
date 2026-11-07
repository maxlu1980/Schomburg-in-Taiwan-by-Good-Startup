  /* ----- (Köln) the six SCHOMBURG practice sites: the site's name, the products, the pitch and the instructor's three tips.
     Every statement and figure from the guide site (src/app.js, src/de.js, src/hsim.js) or the bible's product figures. ----- */
  var KGUIDE = {
    inj: {
      n: { en: 'Breslauer Platz · Crack injection', zh: 'Breslauer Platz · 裂縫灌注', de: 'Breslauer Platz · Rissinjektion' },
      p: { en: 'AQUAFIN-P1 · AQUAFIN-P4', zh: 'AQUAFIN-P1 · AQUAFIN-P4', de: 'AQUAFIN-P1 · AQUAFIN-P4' },
      pitch: { en: 'Packers in holes drilled at 45° across the crack: AQUAFIN-P1 foams to approx. 40 × its volume and stops running water, then AQUAFIN-P4 (approx. 125 mPa·s) seals the crack soft-elastic.',
        zh: '針頭裝在與裂縫呈 45° 的鑽孔內：AQUAFIN-P1 遇水發泡至約 40 倍體積，先止住流動水；再灌注 AQUAFIN-P4（約 125 mPa·s），硬化成軟彈性，永久封閉裂縫。',
        de: 'Packer in Bohrlöchern, die den Riss unter 45° kreuzen: AQUAFIN-P1 schäumt auf ca. das 40-fache Volumen auf und stoppt fließendes Wasser, dann dichtet AQUAFIN-P4 (ca. 125 mPa·s) den Riss weichelastisch ab.' },
      npc: {
        en: ['Holes every 20 cm on alternating sides, at 45° — each one must cross the crack inside the wall.', 'Blow the holes out with oil-free air, then seal packers and crack approx. 15 cm wide with ASODUR-EKF.', 'Vertical crack: start at the lowest packer, move up when resin shows at the next. Pot life approx. 30 min!'],
        zh: ['沿裂縫兩側交錯、每 20 cm 以 45° 鑽孔——每一孔都要在牆體內部與裂縫交會。', '以無油壓縮空氣清孔，再用 ASODUR-EKF 把針頭與裂縫封縫，寬約 15 cm。', '垂直裂縫由最低的針頭開始，下一支針頭冒出樹脂就往上換。可使用時間約 30 分鐘！'],
        de: ['Bohrlöcher alle 20 cm, wechselseitig, unter 45° — jedes muss den Riss im Inneren der Wand kreuzen.', 'Löcher mit ölfreier Druckluft ausblasen, dann Packer und Riss ca. 15 cm breit mit ASODUR-EKF verdämmen.', 'Senkrechter Riss: am untersten Packer beginnen, weiter, wenn am nächsten Harz austritt. Topfzeit ca. 30 min!']
      } },
    cr: {
      n: { en: 'Rheingarten · Concrete restoration', zh: 'Rheingarten · 混凝土修復', de: 'Rheingarten · Betoninstandsetzung' },
      p: { en: 'ASOCRET-HS-FLEX · ASOCRET-BIS-5/40 · ASOCRET-BIS-1/6', zh: 'ASOCRET-HS-FLEX · ASOCRET-BIS-5/40 · ASOCRET-BIS-1/6', de: 'ASOCRET-HS-FLEX · ASOCRET-BIS-5/40 · ASOCRET-BIS-1/6' },
      pitch: { en: 'Spalled cover over a rusting bar, restored as one system: the steel de-rusted to SA 2.5 and coated twice with ASOCRET-HS-FLEX, then ASOCRET-BIS-5/40 wet in wet for 5–40 mm and ASOCRET-BIS-1/6 for 1–6 mm.',
        zh: '鋼筋鏽蝕、保護層剝落，以一套系統修復：鋼筋除鏽至 SA 2.5，以 ASOCRET-HS-FLEX 塗刷兩道，再以 ASOCRET-BIS-5/40 濕碰濕修補 5–40 mm，ASOCRET-BIS-1/6 整平 1–6 mm。',
        de: 'Abgeplatzte Betondeckung über rostender Bewehrung, als ein System instand gesetzt: Stahl auf SA 2,5 entrostet und zweimal mit ASOCRET-HS-FLEX beschichtet, dann ASOCRET-BIS-5/40 frisch in frisch für 5–40 mm und ASOCRET-BIS-1/6 für 1–6 mm.' },
      npc: {
        en: ['Break out to sound concrete, at least 20 mm clear round the bar, and de-rust it to SA 2.5.', 'Two coats of ASOCRET-HS-FLEX on the steel, the second after approx. 2 h; mortar approx. 6 h after it hardens.', 'BIS-5/40 goes into the wet bond coat, max. 20 mm per step. Then keep it damp for 3–5 days.'],
        zh: ['鑿除至堅實混凝土，鋼筋四周至少淨空 20 mm，再除鏽至 SA 2.5。', 'ASOCRET-HS-FLEX 在鋼筋上塗兩道，第二道約 2 小時後；硬化後約 6 小時才上修補砂漿。', 'BIS-5/40 要趁黏結漿料未乾時施作，每次最多 20 mm。之後保持濕潤 3–5 天。'],
        de: ['Bis auf gesunden Beton ausbrechen, mindestens 20 mm frei um den Stab, und auf SA 2,5 entrosten.', 'Zwei Lagen ASOCRET-HS-FLEX auf den Stahl, die zweite nach ca. 2 h; Mörtel ca. 6 h nach dem Erhärten.', 'BIS-5/40 in die frische Haftbrücke, max. 20 mm je Arbeitsgang. Danach 3–5 Tage feucht halten.']
      } },
    wp: {
      n: { en: 'Frankenwerft · Mineral waterproofing', zh: 'Frankenwerft · 水泥基防水', de: 'Frankenwerft · Mineralische Abdichtung' },
      p: { en: 'AQUAFIN-2K/M-PLUS · AQUAFIN-RB400 · FIX-20-T', zh: 'AQUAFIN-2K/M-PLUS · AQUAFIN-RB400 · FIX-20-T', de: 'AQUAFIN-2K/M-PLUS · AQUAFIN-RB400 · FIX-20-T' },
      pitch: { en: 'Mineral slurries and flexible coatings by brush, trowel or spray: AQUAFIN-2K/M-PLUS holds 2.5 bar, AQUAFIN-RB400 5.0 bar at 3.0 mm dry film — both 0.75 bar from the negative side.',
        zh: '以毛刷、鏝刀或噴塗施作的水泥基防水塗料與彈性塗層：AQUAFIN-2K/M-PLUS 可承受 2.5 bar，AQUAFIN-RB400 乾膜 3.0 mm 時達 5.0 bar——兩者在背水面皆可承受 0.75 bar。',
        de: 'Mineralische Schlämmen und flexible Beschichtungen, gestrichen, gespachtelt oder gespritzt: AQUAFIN-2K/M-PLUS hält 2,5 bar, AQUAFIN-RB400 bei 3,0 mm Trockenschicht 5,0 bar — beide 0,75 bar von der Negativseite.' },
      npc: {
        en: ['AQUAFIN-2K/M-PLUS: up to 1 mm per step, never more than 2 kg/m² at once — or it can crack.', 'RB400 from the inside: second coat after approx. 3 h; pressing water needs ≥ 3.0 mm dry film.', 'Water running in? Plug it first with FIX-20-T — working time approx. 2 min, so mix small batches.'],
        zh: ['AQUAFIN-2K/M-PLUS 每道最多 1 mm，單次絕不超過 2 kg/m²——否則可能開裂。', 'RB400 由內側施作：約 3 小時後上第二道；壓力水情況總乾膜須 ≥ 3.0 mm。', '有水流進來？先用 FIX-20-T 堵住——可操作時間約 2 分鐘，所以每次少量拌合。'],
        de: ['AQUAFIN-2K/M-PLUS: bis 1 mm je Arbeitsgang, nie mehr als 2 kg/m² auf einmal — sonst kann es reißen.', 'RB400 von innen: zweite Lage nach ca. 3 h; drückendes Wasser verlangt ≥ 3,0 mm Trockenschicht.', 'Läuft Wasser herein? Zuerst mit FIX-20-T stopfen — Verarbeitungszeit ca. 2 min, also kleine Mengen anmischen.']
      } },
    rc: {
      n: { en: 'Breslauer Platz · Crystalline waterproofing', zh: 'Breslauer Platz · 結晶型後施防水', de: 'Breslauer Platz · Kristalline Abdichtung' },
      p: { en: 'AQUAFIN-IC · ASOCRET-IM · FIX-20-T', zh: 'AQUAFIN-IC · ASOCRET-IM · FIX-20-T', de: 'AQUAFIN-IC · ASOCRET-IM · FIX-20-T' },
      pitch: { en: 'From the inside, without digging: FIX-20-T plugs the running water, then two coats of AQUAFIN-IC grow crystals into the capillaries — watertight against negative pressing water up to 1.5 bar.',
        zh: '由內側施作，免開挖：FIX-20-T 堵住流動水，再刷兩道 AQUAFIN-IC，讓結晶長入毛細孔——可抵抗背水面的負水壓達 1.5 bar。',
        de: 'Von innen, ohne Aufgraben: FIX-20-T stopft das fließende Wasser, dann lassen zwei Lagen AQUAFIN-IC Kristalle in die Kapillaren wachsen — dicht gegen rückseitig drückendes Wasser bis 1,5 bar.' },
      npc: {
        en: ['Wet the concrete to matt damp — no puddles. Repeated moistening helps the crystals grow.', 'Second coat of AQUAFIN-IC while the first is still sticky: 1.5 kg/m² in total for pressing water.', 'Keep it damp for at least 3 days, ventilate, no direct heating. The crystals do the rest.'],
        zh: ['先把混凝土潤濕到微濕——不能積水。反覆潤濕有助結晶生長。', '第一道 AQUAFIN-IC 還帶黏性時就上第二道：壓力水情況合計 1.5 kg/m²。', '至少保持濕潤 3 天，保持通風，不可直接加熱。剩下的交給結晶。'],
        de: ['Den Beton mattfeucht vornässen — keine Pfützen. Wiederholtes Nässen fördert das Kristallwachstum.', 'Zweite Lage AQUAFIN-IC, solange die erste noch klebrig ist: 1,5 kg/m² insgesamt bei drückendem Wasser.', 'Mindestens 3 Tage feucht halten, lüften, nicht direkt beheizen. Den Rest machen die Kristalle.']
      } },
    ca: {
      n: { en: 'Deutz promenade · Crystalline admixture', zh: '道依茨河岸步道 · 結晶型混凝土摻料', de: 'Deutzer Rheinpromenade · Kristallines Zusatzmittel' },
      p: { en: 'BETOCRETE-CL170-P · AQUAFIN-CJ5 · AQUAFIN-CJ6', zh: 'BETOCRETE-CL170-P · AQUAFIN-CJ5 · AQUAFIN-CJ6', de: 'BETOCRETE-CL170-P · AQUAFIN-CJ5 · AQUAFIN-CJ6' },
      pitch: { en: 'The waterproofing goes into the fresh concrete: BETOCRETE-CL170-P at approx. 1.75–2.25 % of the cement weight, and cracks up to 0.4 mm heal themselves when the water reaches them.',
        zh: '防水直接拌進新拌混凝土：BETOCRETE-CL170-P 摻量約為水泥重量的 1.75–2.25 %，日後 0.4 mm 以內的裂縫遇水即自行癒合。',
        de: 'Die Abdichtung steckt im Frischbeton: BETOCRETE-CL170-P mit ca. 1,75–2,25 % des Zementgewichts, und Risse bis 0,4 mm heilen von selbst, sobald Wasser sie erreicht.' },
      npc: {
        en: ['Dose by the w/c ratio: 1.75 % below 0.4, 1.85 % to 0.5, 2.00 % to 0.55 — never above 2.25 %.', 'Mix for more than 45 seconds at the plant — and no water on site: it raises the w/c ratio.', 'With CEM I at least 270 kg/m³ of cement, and the component at least 15 cm thick.'],
        zh: ['依水灰比決定摻量：< 0.4 用 1.75 %，> 0.4–0.5 用 1.85 %，> 0.5–0.55 用 2.00 %——絕不超過 2.25 %。', '拌合廠要拌合超過 45 秒——工地不准加水：會讓水灰比超出配比。', 'CEM I 水泥用量至少 270 kg/m³，構件厚度至少 15 cm。'],
        de: ['Nach w/z-Wert dosieren: 1,75 % unter 0,4, 1,85 % bis 0,5, 2,00 % bis 0,55 — nie über 2,25 %.', 'Im Werk länger als 45 Sekunden mischen — und auf der Baustelle kein Wasser: Es hebt den w/z-Wert.', 'Bei CEM I mindestens 270 kg/m³ Zement, und das Bauteil mindestens 15 cm dick.']
      } },
    pf: {
      n: { en: 'Trankgasse · Protective flooring', zh: 'Trankgasse · 地坪保護與塗裝', de: 'Trankgasse · Bodenschutz und Beschichtung' },
      p: { en: 'ASODUR-SG3 · ASODUR-B351 · ASODUR-V360W', zh: 'ASODUR-SG3 · ASODUR-B351 · ASODUR-V360W', de: 'ASODUR-SG3 · ASODUR-B351 · ASODUR-V360W' },
      pitch: { en: 'Seamless resin floors for garages, workshops and halls: the barrier primer ASODUR-SG3 bonds to matt damp concrete and holds negative water pressure up to 3 bar; the coating follows as on a dry floor.',
        zh: '車庫、工坊與廠房的無縫樹脂地坪：阻隔型底漆 ASODUR-SG3 可附著於微濕混凝土，阻擋達 3 bar 的負水壓；塗層隨後如同在乾燥地坪上施作。',
        de: 'Fugenlose Harzböden für Garagen, Werkstätten und Hallen: Die Sperrgrundierung ASODUR-SG3 haftet auf mattfeuchtem Beton und hält negativen Wasserdruck bis 3 bar; die Beschichtung folgt wie auf trockenem Boden.' },
      npc: {
        en: ['Read the CM device first: ≤ 4 CM-% for the resin systems. Wetter? Then the barrier primer ASODUR-SG3.', 'Substrate and air 10–35 °C and at least 3 °C above the dew point — measure it, never guess.', 'ASODUR-SG3 in two coats: the second after min. 12 h, broadcast with approx. 1–1.5 kg/m² quartz sand.'],
        zh: ['先看 CM 含水率：樹脂系統須 ≤ 4 CM-%。比這更濕？就用阻隔型底漆 ASODUR-SG3。', '基面與空氣 10–35 °C，且高於露點至少 3 °C——要實測，不要用猜的。', 'ASODUR-SG3 分兩道：第二道至少 12 小時後施作，並撒布約 1–1.5 kg/m² 石英砂。'],
        de: ['Zuerst das CM-Gerät: ≤ 4 CM-% für die Harzsysteme. Feuchter? Dann die Sperrgrundierung ASODUR-SG3.', 'Untergrund und Luft 10–35 °C und mindestens 3 °C über dem Taupunkt — messen, nie schätzen.', 'ASODUR-SG3 in zwei Lagen: die zweite nach mind. 12 h, mit ca. 1–1,5 kg/m² Quarzsand abgestreut.']
      } }
  };

  /* ----- (Köln) the quiz of each practice site: 8 site decisions per guide, three options, one right per the guide (ok = its index) ----- */
  window.SIMQ = {
    inj: [
      { t: {
        en: { q: 'Water is running out of the crack. What goes in first?', a: ['AQUAFIN-P4 straight away — it works on damp substrates', 'AQUAFIN-P1, to stop the water; then AQUAFIN-P4', 'ASOCRET-M30, pressed into the crack'], why: 'A water-conducting crack needs an initial injection of AQUAFIN-P1, which foams on contact with water and stops the ingress; AQUAFIN-P4 then gives the permanent seal.' },
        zh: { q: '水正從裂縫流出來。第一步灌什麼？', a: ['直接灌 AQUAFIN-P4——它可用於潮濕基材', '先灌 AQUAFIN-P1 止水，再灌 AQUAFIN-P4', '把 ASOCRET-M30 壓進裂縫'], why: '導水裂縫須先以 AQUAFIN-P1 進行初步灌注，遇水發泡、阻斷進水；之後再注入 AQUAFIN-P4，形成永久封閉。' },
        de: { q: 'Aus dem Riss läuft Wasser. Was wird zuerst injiziert?', a: ['Sofort AQUAFIN-P4 — es wirkt auf feuchten Untergründen', 'AQUAFIN-P1, um das Wasser zu stoppen; dann AQUAFIN-P4', 'ASOCRET-M30, in den Riss gedrückt'], why: 'Ein wasserführender Riss braucht zuerst eine Injektion mit AQUAFIN-P1, die bei Wasserkontakt aufschäumt und den Eintritt stoppt; AQUAFIN-P4 ergibt danach die dauerhafte Abdichtung.' } }, ok: 1 },
      { t: {
        en: { q: 'How do you drill the injection holes for a wall crack?', a: ['Straight into the crack line, as close to it as possible', 'Parallel to the crack, so the hole follows it', 'At 45°, every 20 cm on alternating sides, so each hole crosses the crack inside'], why: 'The system “Crack repair (wall surfaces)”: holes every 20 cm, offset to alternate sides, at 45° — each crosses the crack inside the wall, drilled between the bars.' },
        zh: { q: '牆面裂縫的灌注孔要怎麼鑽？', a: ['直接對準裂縫線鑽，越近越好', '與裂縫平行鑽，讓孔順著裂縫走', '以 45°、每 20 cm 於兩側交錯鑽孔，使每孔在內部與裂縫交會'], why: 'SCHOMBURG「裂縫修補（牆面）」系統：每 20 cm 一孔、兩側交錯、以 45° 鑽入，每孔於牆體內部與裂縫交會，並由鋼筋之間鑽入。' },
        de: { q: 'Wie werden die Injektionslöcher für einen Wandriss gebohrt?', a: ['Direkt in die Risslinie, so nah wie möglich', 'Parallel zum Riss, damit das Loch ihm folgt', 'Unter 45°, alle 20 cm wechselseitig, sodass jedes Loch den Riss im Inneren kreuzt'], why: 'System „Rissinstandsetzung (Wandflächen)“: Löcher alle 20 cm, wechselseitig versetzt, unter 45° — jedes kreuzt den Riss im Inneren der Wand, zwischen den Bewehrungsstäben gebohrt.' } }, ok: 2 },
      { t: {
        en: { q: 'The holes are drilled and full of drilling dust. How do you clear them?', a: ['With oil-free compressed air', 'With any compressor — a little oil mist does no harm', 'Leave the dust; the resin binds it'], why: 'Drilling debris is cleared with oil-free compressed air only; the holes must be free of it before the packers go in.' },
        zh: { q: '孔已鑽好，裡面滿是粉屑。怎麼清？', a: ['用無油壓縮空氣吹淨', '隨便哪台空壓機都行——帶點油霧沒關係', '不用清，樹脂會把粉屑黏住'], why: '鑽孔粉屑僅可使用無油壓縮空氣清除；安裝針頭前，孔內不得殘留粉屑。' },
        de: { q: 'Die Löcher sind gebohrt und voller Bohrmehl. Wie werden sie gereinigt?', a: ['Mit ölfreier Druckluft', 'Mit irgendeinem Kompressor — etwas Ölnebel schadet nicht', 'Das Bohrmehl bleibt drin; das Harz bindet es'], why: 'Bohrmehl wird ausschließlich mit ölfreier Druckluft ausgeblasen; die Löcher müssen frei davon sein, bevor die Packer gesetzt werden.' } }, ok: 0 },
      { t: {
        en: { q: 'All packers are set. What comes before you grout?', a: ['Nothing — start grouting while the packers are fresh', 'Tape over the crack so the resin stays in', 'Seal packers and crack zone approx. 15 cm wide with ASODUR-EKF and let it cure'], why: 'The packers and the crack zone are sealed approx. 15 cm wide with ASODUR-EKF; the crack insulation must cure before AQUAFIN-P4 is grouted in.' },
        zh: { q: '針頭全部裝好了。灌注之前還要做什麼？', a: ['不用——趁針頭剛裝好直接灌', '用膠帶貼住裂縫，讓樹脂留在裡面', '以 ASODUR-EKF 封閉針頭與裂縫區域，寬約 15 cm，並待其硬化'], why: '以 ASODUR-EKF 將針頭及裂縫區域表面封閉，寬約 15 cm；須待封縫材料硬化後才灌注 AQUAFIN-P4。' },
        de: { q: 'Alle Packer sitzen. Was kommt vor dem Verpressen?', a: ['Nichts — gleich verpressen, solange die Packer frisch sitzen', 'Den Riss abkleben, damit das Harz drinbleibt', 'Packer und Risszone ca. 15 cm breit mit ASODUR-EKF verdämmen und aushärten lassen'], why: 'Packer und Risszone werden ca. 15 cm breit mit ASODUR-EKF verdämmt; die Rissverdämmung muss aushärten, bevor AQUAFIN-P4 verpresst wird.' } }, ok: 2 },
      { t: {
        en: { q: 'You mix AQUAFIN-P4. Which is right?', a: ['Less hardener than resin — it gives a longer pot life', '1 : 1 by volume, approx. 3 min at approx. 300 rpm, decant, stir again', 'Shake both cans and pour them into the pump'], why: '1 volume share A to 1 volume share B, mixed approx. 3 minutes at approx. 300 rpm, decanted into a clean bucket and stirred again; pot life approx. 30 minutes.' },
        zh: { q: '拌合 AQUAFIN-P4，哪個做法正確？', a: ['硬化劑少放一點——可使用時間比較長', '體積比 1 : 1，以約 300 rpm 攪拌約 3 分鐘，倒入乾淨桶後再拌一次', '兩罐搖一搖，直接倒進灌注機'], why: 'A 劑 1 體積份配 B 劑 1 體積份，以約 300 rpm 攪拌約 3 分鐘，倒入乾淨的桶內再次攪拌；可使用時間約 30 分鐘。' },
        de: { q: 'Sie mischen AQUAFIN-P4. Was ist richtig?', a: ['Weniger Härter als Harz — das verlängert die Topfzeit', '1 : 1 nach Volumen, ca. 3 min bei ca. 300 U/min, umtopfen, nochmals rühren', 'Beide Gebinde schütteln und in die Pumpe gießen'], why: '1 Volumenteil A auf 1 Volumenteil B, ca. 3 Minuten bei ca. 300 U/min gemischt, in ein sauberes Gefäß umgetopft und nochmals gerührt; Topfzeit ca. 30 Minuten.' } }, ok: 1 },
      { t: {
        en: { q: 'A vertical crack, five packers. Where do you start grouting?', a: ['At the lowest packer, moving up when resin emerges at the next', 'At the top packer — gravity carries the resin down', 'At the middle packer, then both ways'], why: 'Vertical cracks are grouted from the lowest packer upwards; change to the next packer when resin emerges there.' },
        zh: { q: '一條垂直裂縫、五支針頭。從哪裡開始灌？', a: ['從最低的針頭開始，下一支冒出樹脂就往上換', '從最高的針頭——重力會把樹脂帶下去', '從中間那支開始，再往上下兩邊灌'], why: '垂直裂縫由最低的針頭開始往上灌注；樹脂由下一支針頭溢出時，即換至該針頭繼續。' },
        de: { q: 'Ein senkrechter Riss, fünf Packer. Wo beginnen Sie mit dem Verpressen?', a: ['Am untersten Packer, weiter nach oben, sobald am nächsten Harz austritt', 'Am obersten Packer — die Schwerkraft trägt das Harz nach unten', 'Am mittleren Packer, dann in beide Richtungen'], why: 'Senkrechte Risse werden vom untersten Packer nach oben verpresst; zum nächsten Packer wechseln, wenn dort Harz austritt.' } }, ok: 0 },
      { t: {
        en: { q: 'The resin is grouted at 20 °C. How do you finish?', a: ['Pull the packers at once and leave the holes open to dry', 'Cut the packers flush and paint over them', 'After curing (approx. 5 h), remove the packers and plug flush with ASOCRET-M30'], why: 'Final curing at 20 °C takes approx. 5 hours; then the packers are removed and the boreholes plugged flush with ASOCRET-M30.' },
        zh: { q: '樹脂在 20 °C 下灌完了。怎麼收尾？', a: ['立刻拔掉針頭，孔洞留著讓它乾', '把針頭切平後直接上漆', '待硬化（約 5 小時）後拆除針頭，以 ASOCRET-M30 填補齊平'], why: '20 °C 時約 5 小時完全硬化；之後拆除灌注針頭，並以 ASOCRET-M30 將鑽孔填補至與表面齊平。' },
        de: { q: 'Das Harz ist bei 20 °C verpresst. Wie geht es zu Ende?', a: ['Packer sofort ziehen, Löcher zum Trocknen offen lassen', 'Packer bündig abschneiden und überstreichen', 'Nach dem Aushärten (ca. 5 h) die Packer entfernen und bündig mit ASOCRET-M30 verschließen'], why: 'Die Endaushärtung bei 20 °C dauert ca. 5 Stunden; dann werden die Packer entfernt und die Bohrlöcher bündig mit ASOCRET-M30 verschlossen.' } }, ok: 2 },
      { t: {
        en: { q: 'A thin component with dense reinforcement: no drilling. The crack is damp but carries no water. What now?', a: ['Drill anyway, between the bars', 'Adhesive packers bonded over the crack with ASODUR-EKF', 'AQUAFIN-P1 poured over the surface'], why: 'Where thin components, dense reinforcement or prestressing steel rule out drilling, adhesive packers are bonded over the crack with ASODUR-EKF — for a dry or damp crack that does not conduct water.' },
        zh: { q: '構件很薄、鋼筋很密，不能鑽孔。裂縫潮濕但不導水。怎麼辦？', a: ['照樣鑽，從鋼筋之間鑽', '以 ASODUR-EKF 將黏貼式針頭黏固在裂縫上', '把 AQUAFIN-P1 倒在表面上'], why: '構件太薄、鋼筋密集或有預力鋼材而不能鑽孔時，以 ASODUR-EKF 將黏貼式針頭黏固於裂縫上方——適用於乾燥或潮濕、不導水的裂縫。' },
        de: { q: 'Dünnes Bauteil, dichte Bewehrung: Bohren geht nicht. Der Riss ist feucht, führt aber kein Wasser. Was nun?', a: ['Trotzdem bohren, zwischen den Stäben', 'Klebepacker mit ASODUR-EKF über dem Riss aufkleben', 'AQUAFIN-P1 auf die Oberfläche gießen'], why: 'Wo dünne Bauteile, dichte Bewehrung oder Spannstahl kein Bohren zulassen, werden Klebepacker mit ASODUR-EKF über dem Riss aufgeklebt — für einen trockenen oder feuchten Riss, der kein Wasser führt.' } }, ok: 1 }
    ],
    cr: [
      { t: {
        en: { q: 'Spalls and rust stains on a beam. What happens before anyone breaks out?', a: ['An expert or structural engineer assesses the current state', 'Break out wherever it sounds hollow', 'Coat the whole beam so it stops getting worse'], why: 'Before any concrete restoration the current state is checked by an expert and/or structural engineer; the test report decides the repair principle and the extent of the breakout.' },
        zh: { q: '梁上有剝落與鏽斑。開始鑿除之前要先做什麼？', a: ['由專家或結構技師評估現況', '哪裡敲起來空心就從哪裡鑿', '先把整根梁塗起來，免得繼續惡化'], why: '任何混凝土修復前，須先由專家及／或結構技師檢查現況；檢測報告決定修復原則與鑿除範圍。' },
        de: { q: 'Abplatzungen und Rostfahnen an einem Unterzug. Was geschieht, bevor jemand ausbricht?', a: ['Ein Sachkundiger oder Tragwerksplaner beurteilt den Istzustand', 'Überall ausbrechen, wo es hohl klingt', 'Den ganzen Unterzug beschichten, damit es nicht schlimmer wird'], why: 'Vor jeder Betoninstandsetzung prüft ein Sachkundiger und/oder Tragwerksplaner den Istzustand; der Prüfbericht bestimmt das Instandsetzungsprinzip und den Umfang des Ausbruchs.' } }, ok: 0 },
      { t: {
        en: { q: 'The bar is exposed and rusty. How clean must it be?', a: ['Brushed until the loose rust is gone', 'Painted with any rust converter', 'De-rusted to SA 2.5, free of dust and grease — behind the bar too'], why: 'Exposed reinforcing steel is totally de-rusted to cleanliness level SA 2.5, free of dust and grease, blasted all round the bar.' },
        zh: { q: '鋼筋外露且已生鏽。要清到什麼程度？', a: ['刷到浮鏽掉了就好', '隨便塗一層除鏽轉化劑', '除鏽至 SA 2.5，無粉塵與油脂——鋼筋背面也要'], why: '外露鋼筋須完全除鏽至清潔度 SA 2.5，且無粉塵與油脂；鋼筋四周、背面都要噴砂處理。' },
        de: { q: 'Der Bewehrungsstab liegt frei und rostet. Wie sauber muss er sein?', a: ['Gebürstet, bis der lose Rost weg ist', 'Mit irgendeinem Rostumwandler gestrichen', 'Auf SA 2,5 entrostet, staub- und fettfrei — auch hinter dem Stab'], why: 'Freiliegende Bewehrung wird vollständig auf den Reinheitsgrad SA 2,5 entrostet, staub- und fettfrei, rundum gestrahlt.' } }, ok: 2 },
      { t: {
        en: { q: 'Corrosion protection on the steel with ASOCRET-HS-FLEX: how?', a: ['One thin sprayed coat, then mortar right away', 'Two brush coats, fully covering; the second after approx. 2 hours', 'Stirred into the repair mortar instead'], why: 'ASOCRET-HS-FLEX goes on the steel in two brush coats, the second after approx. 2 hours; the repair mortar follows approx. 6 hours after the second coat has hardened.' },
        zh: { q: '以 ASOCRET-HS-FLEX 做鋼筋防蝕，怎麼施作？', a: ['薄噴一道，馬上上砂漿', '以毛刷塗兩道、完全覆蓋；第二道約 2 小時後', '改成拌進修補砂漿裡'], why: 'ASOCRET-HS-FLEX 以毛刷在鋼筋上塗兩道，第二道約 2 小時後；第二道硬化後約 6 小時才施作修補砂漿。' },
        de: { q: 'Korrosionsschutz mit ASOCRET-HS-FLEX auf dem Stahl: wie?', a: ['Eine dünne Spritzlage, sofort danach Mörtel', 'Zwei Lagen mit der Bürste, vollflächig deckend; die zweite nach ca. 2 Stunden', 'Stattdessen in den Instandsetzungsmörtel eingerührt'], why: 'ASOCRET-HS-FLEX kommt in zwei Lagen mit der Bürste auf den Stahl, die zweite nach ca. 2 Stunden; der Mörtel folgt ca. 6 Stunden nach dem Erhärten der zweiten Lage.' } }, ok: 1 },
      { t: {
        en: { q: 'The prepared substrate is bone dry. What before the bond coat?', a: ['Nothing — the bond coat brings its own water', 'Flood it so the water stands in puddles', 'Pre-wet 24 h and 2 h before, so it is matt damp'], why: 'The substrate is dampened 24 hours and 2 hours before application and is matt damp when the work starts: no shiny water film, no puddles.' },
        zh: { q: '處理好的基面乾透了。上黏結漿料前要怎麼做？', a: ['不用處理——黏結漿料本身有水分', '大量灑水，讓地面積水', '施作前 24 小時及 2 小時預濕，使其呈微濕'], why: '施作前 24 小時及 2 小時充分潤濕基面，施作時呈微濕：沒有反光水膜，也沒有積水。' },
        de: { q: 'Der vorbereitete Untergrund ist knochentrocken. Was kommt vor der Haftbrücke?', a: ['Nichts — die Haftbrücke bringt ihr Wasser mit', 'Fluten, bis das Wasser in Pfützen steht', '24 h und 2 h vorher vornässen, sodass er mattfeucht ist'], why: 'Der Untergrund wird 24 Stunden und 2 Stunden vorher angefeuchtet und ist bei der Verarbeitung mattfeucht: kein glänzender Wasserfilm, keine Pfützen.' } }, ok: 2 },
      { t: {
        en: { q: 'The bond coat is brushed in. When does ASOCRET-BIS-5/40 go on?', a: ['When the bond coat has hardened completely', 'At once, while the bond coat is still wet — wet in wet', 'The next morning'], why: 'The repair mortar is applied while the bond coat is still wet; after an interruption the bond coat must set completely and is then applied again.' },
        zh: { q: '黏結漿料刷好了。ASOCRET-BIS-5/40 什麼時候上？', a: ['等黏結漿料完全硬化後', '立刻，趁黏結漿料還濕——濕碰濕', '隔天早上'], why: '修補砂漿須趁黏結漿料未乾時施作；若中斷，黏結漿料須完全凝固後再重新施作。' },
        de: { q: 'Die Haftbrücke ist eingebürstet. Wann kommt ASOCRET-BIS-5/40?', a: ['Wenn die Haftbrücke vollständig erhärtet ist', 'Sofort, solange die Haftbrücke noch frisch ist — frisch in frisch', 'Am nächsten Morgen'], why: 'Der Instandsetzungsmörtel wird in die noch frische Haftbrücke eingebracht; nach einer Unterbrechung muss sie vollständig abbinden und wird dann wiederholt.' } }, ok: 1 },
      { t: {
        en: { q: 'The breakout is deeper than 20 mm. How do you fill it with ASOCRET-BIS-5/40?', a: ['In layers of max. 20 mm per step, compacted and levelled flush', 'In one go — the mortar is non-slump', 'Thinned with extra water so it flows into the hole'], why: 'ASOCRET-BIS-5/40 is made for breakouts of approx. 5–40 mm, up to max. 20 mm per application step; greater thicknesses are built up in several layers.' },
        zh: { q: '破損深度超過 20 mm。ASOCRET-BIS-5/40 要怎麼填？', a: ['分層施作，每次最多 20 mm，搗實並整平齊面', '一次填滿——這款砂漿不垂流', '多加水稀釋，讓它流進孔裡'], why: 'ASOCRET-BIS-5/40 適用破損深度約 5–40 mm，每次施作最多 20 mm；較大厚度建議分多層施作。' },
        de: { q: 'Der Ausbruch ist tiefer als 20 mm. Wie füllen Sie ihn mit ASOCRET-BIS-5/40?', a: ['In Lagen von max. 20 mm je Arbeitsgang, verdichtet und bündig abgezogen', 'In einem Zug — der Mörtel ist standfest', 'Mit zusätzlichem Wasser verdünnt, damit er ins Loch fließt'], why: 'ASOCRET-BIS-5/40 ist für Ausbrüche von ca. 5–40 mm gemacht, mit max. 20 mm je Arbeitsgang; größere Dicken werden mehrlagig aufgebaut.' } }, ok: 0 },
      { t: {
        en: { q: 'When may ASOCRET-BIS-1/6 go over the ASOCRET-BIS-5/40?', a: ['Straight away, wet in wet', 'Only after 28 days', 'After 24 hours at the earliest, starting with a scratch coat'], why: 'BIS-1/6 goes on BIS-5/40 after 24 hours at the earliest: a scratch coat first, then the layer of 1–6 mm, struck off within the pot life.' },
        zh: { q: 'ASOCRET-BIS-1/6 最早什麼時候可以施作在 ASOCRET-BIS-5/40 上？', a: ['馬上，濕碰濕', '要等 28 天', '最早 24 小時後，先刮塗一道薄層'], why: 'BIS-1/6 施作於 BIS-5/40 上最早須 24 小時後：先刮塗薄層，再施作 1–6 mm，並於可使用時間內刮平。' },
        de: { q: 'Wann darf ASOCRET-BIS-1/6 auf ASOCRET-BIS-5/40?', a: ['Sofort, frisch in frisch', 'Erst nach 28 Tagen', 'Frühestens nach 24 Stunden, zuerst eine Kratzspachtelung'], why: 'BIS-1/6 kommt frühestens nach 24 Stunden auf BIS-5/40: zuerst eine Kratzspachtelung, dann die Lage von 1–6 mm, innerhalb der Topfzeit abgezogen.' } }, ok: 2 },
      { t: {
        en: { q: 'The repair is finished on a sunny, windy afternoon. Now?', a: ['Let it dry fast — that makes it harder', 'Keep it damp for at least 3–5 days: film, wet jute or water mist', 'Warm it with a fan heater overnight'], why: 'Mortar surfaces are protected from rapid drying and kept damp for at least 3–5 days; sunlight and draughts need more attention.' },
        zh: { q: '修補在一個有太陽、風又大的下午完成。接下來？', a: ['讓它快點乾——會比較硬', '至少保持濕潤 3–5 天：覆蓋薄膜、濕黃麻布或噴霧', '整晚用暖風機加熱'], why: '砂漿表面須防止快速乾燥，至少保持濕潤 3–5 天；日曬與風吹時更要注意。' },
        de: { q: 'Die Instandsetzung ist an einem sonnigen, windigen Nachmittag fertig. Und jetzt?', a: ['Schnell trocknen lassen — das macht ihn härter', 'Mindestens 3–5 Tage feucht halten: Folie, nasse Jute oder Wassernebel', 'Über Nacht mit dem Heizlüfter wärmen'], why: 'Mörtelflächen werden vor schnellem Austrocknen geschützt und mindestens 3–5 Tage feucht gehalten; Sonne und Zugluft verlangen besondere Sorgfalt.' } }, ok: 1 }
    ],
    wp: [
      { t: {
        en: { q: 'Balcony, tiles to follow on AQUAFIN-2K/M-PLUS. What dry film do you build?', a: ['One thin coat — the tile adhesive does the rest', '> 2.0 mm in at least two coats: 3.5 kg/m² plus a 25 % allowance', 'One thick coat, as much as the trowel holds'], why: 'Bonded waterproofing under tiles (DIN 18534, DIN 18531): > 2.0 mm dry film, approx. 3.5 kg/m², with an allowance of at least 25 % for uneven substrates.' },
        zh: { q: '陽台，之後要在 AQUAFIN-2K/M-PLUS 上貼磚。乾膜要做多厚？', a: ['薄薄一道就好——其他交給磁磚黏著劑', '至少分兩道達 > 2.0 mm：3.5 kg/m² 另加 25 % 餘裕', '一次厚塗，鏝刀能抹多少就抹多少'], why: '磁磚下的複合防水（DIN 18534、DIN 18531）：乾膜 > 2.0 mm，約 3.5 kg/m²，基面不平時至少另加 25 % 厚度餘裕。' },
        de: { q: 'Balkon, Fliesen folgen auf AQUAFIN-2K/M-PLUS. Welche Trockenschicht bauen Sie auf?', a: ['Eine dünne Lage — den Rest macht der Fliesenkleber', '> 2,0 mm in mindestens zwei Lagen: 3,5 kg/m² plus 25 % Zuschlag', 'Eine dicke Lage, so viel die Kelle hält'], why: 'Verbundabdichtung unter Fliesen (DIN 18534, DIN 18531): > 2,0 mm Trockenschicht, ca. 3,5 kg/m², mit mindestens 25 % Zuschlag für unebene Untergründe.' } }, ok: 1 },
      { t: {
        en: { q: 'How do you mix AQUAFIN-2K/M-PLUS?', a: ['50–60 % of the liquid first, the powder, then the rest; approx. 3 min, rest 5 min, mix again', 'All the powder into all the liquid at once, a quick stir', 'Powder with tap water, like a 1-component slurry'], why: 'Approx. 50–60 % of the liquid component first, then the powder, then the rest of the liquid (A : B = 2.5 : 1 by weight); approx. 3 minutes, approx. 5 minutes settling, homogenise again.' },
        zh: { q: 'AQUAFIN-2K/M-PLUS 怎麼拌合？', a: ['先倒 50–60 % 液體、加粉料、再加其餘液體；約 3 分鐘，熟化 5 分鐘，再拌勻', '全部粉料一次倒進全部液體，隨便攪一下', '粉料加自來水拌，跟單組份塗料一樣'], why: '先將約 50–60 % 的液體組份倒入桶中，加入粉料，再加入其餘液體（A : B = 2.5 : 1 重量比）；攪拌約 3 分鐘，熟化約 5 分鐘後再次拌勻。' },
        de: { q: 'Wie wird AQUAFIN-2K/M-PLUS gemischt?', a: ['Zuerst 50–60 % der Flüssigkeit, das Pulver, dann der Rest; ca. 3 min, 5 min reifen, nochmals mischen', 'Alles Pulver auf einmal in die ganze Flüssigkeit, kurz umrühren', 'Pulver mit Leitungswasser, wie eine einkomponentige Schlämme'], why: 'Zuerst ca. 50–60 % der Flüssigkomponente, dann das Pulver, dann der Rest der Flüssigkeit (A : B = 2,5 : 1 nach Gewicht); ca. 3 Minuten, ca. 5 Minuten Reifezeit, erneut homogenisieren.' } }, ok: 0 },
      { t: {
        en: { q: 'To save a day, the crew wants all the AQUAFIN-2K/M-PLUS on in one thick coat. Your call?', a: ['Fine — one coat is faster and just as tight', 'Fine, if a little water is added to spread it', 'No: up to 1 mm per step; more than 2 kg/m² in one step can crack'], why: 'AQUAFIN-2K/M-PLUS goes on in at least two steps of up to 1 mm; more than 2 kg/m² in one step can lead to cracking. The second coat follows after approx. 3–6 hours.' },
        zh: { q: '為了省一天，班組想一次厚塗完 AQUAFIN-2K/M-PLUS。你怎麼決定？', a: ['可以——一道比較快，一樣防水', '可以，加點水比較好抹', '不行：每道最多 1 mm；單次超過 2 kg/m² 可能開裂'], why: 'AQUAFIN-2K/M-PLUS 至少分兩道施作，每道最多 1 mm；單次施作超過 2 kg/m² 可能導致開裂。第二道約 3–6 小時後施作。' },
        de: { q: 'Um einen Tag zu sparen, will die Kolonne AQUAFIN-2K/M-PLUS in einer dicken Lage auftragen. Ihre Entscheidung?', a: ['In Ordnung — eine Lage ist schneller und genauso dicht', 'In Ordnung, wenn zum Verteilen etwas Wasser dazukommt', 'Nein: bis 1 mm je Arbeitsgang; mehr als 2 kg/m² in einem Arbeitsgang können reißen'], why: 'AQUAFIN-2K/M-PLUS wird in mindestens zwei Arbeitsgängen von bis zu 1 mm aufgetragen; mehr als 2 kg/m² in einem Arbeitsgang können zu Rissen führen. Die zweite Lage folgt nach ca. 3–6 Stunden.' } }, ok: 2 },
      { t: {
        en: { q: 'When can the tiler start on the AQUAFIN-2K/M-PLUS?', a: ['When the waterproofing has completely hardened', 'While the second coat is still fresh, for a better bond', 'Between the first and the second coat'], why: 'The waterproofing layer must be completely hardened when the tiles are laid, with a tile adhesive from the system list.' },
        zh: { q: '磁磚師傅什麼時候可以在 AQUAFIN-2K/M-PLUS 上開工？', a: ['防水層完全硬化之後', '趁第二道還新鮮，黏得比較牢', '在第一道與第二道之間'], why: '鋪貼磁磚時防水層必須完全硬化，並使用系統清單中的磁磚黏著劑。' },
        de: { q: 'Wann darf der Fliesenleger auf AQUAFIN-2K/M-PLUS anfangen?', a: ['Wenn die Abdichtung vollständig erhärtet ist', 'Solange die zweite Lage noch frisch ist, für besseren Verbund', 'Zwischen der ersten und der zweiten Lage'], why: 'Die Abdichtung muss beim Verlegen vollständig erhärtet sein; verlegt wird mit einem Fliesenkleber der Systemliste.' } }, ok: 0 },
      { t: {
        en: { q: 'The first coat of AQUAFIN-RB400 is on. When does the second go on?', a: ['At once, wet in wet', 'When reworking can no longer damage the first — after approx. 3 hours', 'After 7 days, when it has cured'], why: 'The second step follows when the first can no longer be damaged by reworking: overcoat after approx. 3 hours; RB400 is rainproof after approx. 3 hours.' },
        zh: { q: '第一道 AQUAFIN-RB400 已經上好。第二道什麼時候上？', a: ['馬上，濕碰濕', '第一道不再因後續作業受損時——約 3 小時後', '7 天後，完全養護好再說'], why: '第一道不再因後續作業受損時即可施作第二道：約 3 小時後可覆塗；RB400 約 3 小時後即可防雨。' },
        de: { q: 'Die erste Lage AQUAFIN-RB400 ist drauf. Wann kommt die zweite?', a: ['Sofort, nass in nass', 'Wenn das Überarbeiten die erste nicht mehr beschädigt — nach ca. 3 Stunden', 'Nach 7 Tagen, wenn sie ausgehärtet ist'], why: 'Die zweite Lage folgt, wenn die erste durch das Überarbeiten nicht mehr beschädigt werden kann: überarbeitbar nach ca. 3 Stunden; RB400 ist nach ca. 3 Stunden regenfest.' } }, ok: 1 },
      { t: {
        en: { q: 'Concrete basement wall from the inside, water pressing from the rear (WTA 4-6). Total AQUAFIN-RB400?', a: ['≥ 2.0 mm dry film is enough for any water', 'One coat, whatever its thickness', '≥ 3.0 mm dry film, ≥ 3.6 kg/m², in two coats'], why: 'WTA 4-6: water pressure from the negative side needs ≥ 3.0 mm dry film (≥ 3.6 kg/m²); ≥ 2.0 mm is for soil moisture and non-percolating water only.' },
        zh: { q: '混凝土地下室牆由內側施作，背面有壓力水（WTA 4-6）。AQUAFIN-RB400 總共要多少？', a: ['乾膜 ≥ 2.0 mm，什麼水都夠', '一道就好，厚度不拘', '乾膜 ≥ 3.0 mm、≥ 3.6 kg/m²，分兩道'], why: 'WTA 4-6：背水面壓力水須乾膜 ≥ 3.0 mm（≥ 3.6 kg/m²）；≥ 2.0 mm 僅適用於土壤濕氣與非滲流水。' },
        de: { q: 'Betonkellerwand von innen, Wasser drückt von hinten (WTA 4-6). Wie viel AQUAFIN-RB400 insgesamt?', a: ['≥ 2,0 mm Trockenschicht reichen für jedes Wasser', 'Eine Lage, egal wie dick', '≥ 3,0 mm Trockenschicht, ≥ 3,6 kg/m², in zwei Lagen'], why: 'WTA 4-6: Drückendes Wasser von der Negativseite verlangt ≥ 3,0 mm Trockenschicht (≥ 3,6 kg/m²); ≥ 2,0 mm gelten nur für Bodenfeuchte und nicht drückendes Wasser.' } }, ok: 2 },
      { t: {
        en: { q: 'Moisture keeps coming through the wall from behind. What goes under the flexible AQUAFIN-RB400?', a: ['A pre-seal of AQUAFIN-1K, brushed into the matt damp concrete', 'Nothing — dry the wall with a heater first', 'A coat of paint to block the damp'], why: 'Moisture from the rear must be kept off RB400: pre-sealing with AQUAFIN-1K is recommended; direct heating or blowing warm air is not permitted.' },
        zh: { q: '濕氣一直從牆背面滲過來。彈性的 AQUAFIN-RB400 底下要先做什麼？', a: ['先以 AQUAFIN-1K 刷入微濕的混凝土，做預先封閉', '什麼都不用——先用暖爐把牆烘乾', '先刷一道油漆擋住濕氣'], why: '來自背面的濕氣不得作用於 RB400：建議先以 AQUAFIN-1K 預先封閉；不得直接加熱或吹熱風。' },
        de: { q: 'Von hinten dringt ständig Feuchte durch die Wand. Was kommt unter das flexible AQUAFIN-RB400?', a: ['Eine Vorabdichtung aus AQUAFIN-1K, in den mattfeuchten Beton eingebürstet', 'Nichts — die Wand zuerst mit einem Heizgerät trocknen', 'Ein Anstrich, der die Feuchte sperrt'], why: 'Rückseitige Feuchte muss von RB400 ferngehalten werden: Eine Vorabdichtung mit AQUAFIN-1K wird empfohlen; direktes Beheizen oder Warmluftgebläse sind nicht zulässig.' } }, ok: 0 },
      { t: {
        en: { q: 'The wall meets the base slab in a sharp corner. What before the waterproofing?', a: ['Nothing — the coating bridges the corner', 'A bead of sealant in the corner', 'A sealing cove of ASOCRET-M30, edge height at least 4 cm, rounded, on a bonding slurry'], why: 'At the slab–wall transition a sealing cove of ASOCRET-M30 (edge height at least 4 cm) is set wet in wet on a bonding slurry and rounded; the waterproofing follows after approx. 3 hours.' },
        zh: { q: '牆與底板交接處是個直角。防水之前要怎麼處理？', a: ['不用處理——塗層會橋接轉角', '在角落打一道密封膠', '先塗黏結漿料，再以 ASOCRET-M30 施作導角，邊高至少 4 cm，修圓'], why: '底板與牆交接處：於黏結漿料上濕碰濕施作 ASOCRET-M30 止水導角（邊高至少 4 cm）並修圓；約 3 小時後即可施作防水。' },
        de: { q: 'Die Wand trifft in scharfer Ecke auf die Bodenplatte. Was kommt vor der Abdichtung?', a: ['Nichts — die Beschichtung überbrückt die Ecke', 'Eine Raupe Dichtstoff in die Ecke', 'Eine Dichtkehle aus ASOCRET-M30, Schenkellänge mindestens 4 cm, gerundet, auf einer Haftschlämme'], why: 'Am Übergang Bodenplatte–Wand wird eine Dichtkehle aus ASOCRET-M30 (mindestens 4 cm) nass in nass auf einer Haftschlämme angelegt und gerundet; die Abdichtung folgt nach ca. 3 Stunden.' } }, ok: 2 }
    ],
    rc: [
      { t: {
        en: { q: 'Water spurts from a leak in the basement wall. What first?', a: ['Brush AQUAFIN-IC over it — the crystals will cope', 'Fill it with ASOCRET-IM', 'Plug it with FIX-20-T, pressed in by hand and held until it hardens'], why: 'Running water is stopped first: a plug of FIX-20-T is pressed into the dovetailed opening and held — it solidifies after 1–2 minutes, even under water.' },
        zh: { q: '地下室牆上的漏點正在噴水。第一步？', a: ['刷上 AQUAFIN-IC——結晶會處理', '用 ASOCRET-IM 填補', '用 FIX-20-T 以手壓入堵住，按住直到硬化'], why: '先止住流動水：將 FIX-20-T 塞體壓入鑿成燕尾形的開口並按住——1–2 分鐘後凝固，即使在水中也可以。' },
        de: { q: 'Aus einer Leckstelle der Kellerwand spritzt Wasser. Was zuerst?', a: ['AQUAFIN-IC darüberstreichen — die Kristalle schaffen das', 'Mit ASOCRET-IM füllen', 'Mit FIX-20-T stopfen, von Hand eingedrückt und gehalten, bis er erhärtet'], why: 'Fließendes Wasser wird zuerst gestoppt: Ein Pfropfen FIX-20-T wird in die schwalbenschwanzförmige Öffnung gedrückt und gehalten — er erstarrt nach 1–2 Minuten, auch unter Wasser.' } }, ok: 2 },
      { t: {
        en: { q: 'How much FIX-20-T do you mix at a time?', a: ['Only what you can place at once — the pot life is approx. 2 minutes', 'A full bucket, to last the morning', 'Half a bucket; re-temper it with water when it stiffens'], why: 'Solidification starts after 1–2 minutes and the pot life is approx. 2 minutes: mix only what can be placed at once (approx. 200–250 g of water per kg).' },
        zh: { q: 'FIX-20-T 每次拌多少？', a: ['只拌一次用得完的量——可使用時間約 2 分鐘', '拌一整桶，夠用一個上午', '拌半桶，變稠了再加水回拌'], why: '1–2 分鐘後即開始凝固，可使用時間約 2 分鐘：只拌合能一次用完的量（每 kg 約 200–250 g 水）。' },
        de: { q: 'Wie viel FIX-20-T mischen Sie auf einmal an?', a: ['Nur so viel, wie sich sofort einbauen lässt — Topfzeit ca. 2 Minuten', 'Einen vollen Eimer für den ganzen Vormittag', 'Einen halben Eimer; beim Ansteifen mit Wasser nachmischen'], why: 'Das Erstarren beginnt nach 1–2 Minuten, die Topfzeit beträgt ca. 2 Minuten: Nur anmischen, was sich sofort einbauen lässt (ca. 200–250 g Wasser je kg).' } }, ok: 0 },
      { t: {
        en: { q: 'The water pressure is so high that every plug is pushed out. What now?', a: ['Press harder and hold for longer', 'Set a drain hose in the strongest flow, fix it with FIX-20-T, plug around it, then plug the hose hole', 'Coat over the leak and let the crystals close it'], why: 'Under high pressure a hose fixed with FIX-20-T in the strongest flow relieves the pressure while the leak around it is plugged; after drying the hose is removed and its hole plugged.' },
        zh: { q: '水壓高到每個塞體都被推出來。怎麼辦？', a: ['壓得更用力、按得更久', '在水流最強處嵌入導流軟管，以 FIX-20-T 固定，周圍堵住，再堵軟管孔', '直接塗過去，讓結晶去封'], why: '水壓高時，於水流最強處以 FIX-20-T 固定軟管導流以釋放壓力，同時堵住周圍的滲漏；乾燥後拔除軟管，再堵塞其孔洞。' },
        de: { q: 'Der Wasserdruck ist so hoch, dass jeder Pfropfen herausgedrückt wird. Was nun?', a: ['Fester drücken und länger halten', 'Einen Entlastungsschlauch in die stärkste Strömung setzen, mit FIX-20-T fixieren, ringsum stopfen, dann das Schlauchloch stopfen', 'Darüber beschichten und die Kristalle schließen lassen'], why: 'Bei hohem Druck entlastet ein mit FIX-20-T fixierter Schlauch in der stärksten Strömung, während die Leckage ringsum gestopft wird; nach dem Trocknen wird der Schlauch entfernt und sein Loch gestopft.' } }, ok: 1 },
      { t: {
        en: { q: 'A static crack wider than 0.4 mm runs through the wall. How is it treated?', a: ['Chased 20 mm wide and 25 mm deep, screened with AQUAFIN-IC, filled flush with ASOCRET-IM wet in wet', 'Two coats of AQUAFIN-IC over it — that is enough', 'Filled with sealant and painted over'], why: 'Static cracks and joints over 0.4 mm are opened to 20 × 25 mm, screened with AQUAFIN-IC and filled flush with ASOCRET-IM; AQUAFIN-IC itself seals later cracks up to 0.4 mm.' },
        zh: { q: '牆上有一條寬度超過 0.4 mm 的靜態裂縫。怎麼處理？', a: ['開槽寬 20 mm、深 25 mm，槽壁先塗 AQUAFIN-IC，再以 ASOCRET-IM 濕碰濕填平', '上面刷兩道 AQUAFIN-IC 就夠了', '打密封膠後再上漆'], why: '超過 0.4 mm 的靜態裂縫與接縫須開槽至 20 × 25 mm，以 AQUAFIN-IC 底塗後用 ASOCRET-IM 填平；AQUAFIN-IC 本身可封閉日後產生、達 0.4 mm 的裂縫。' },
        de: { q: 'Ein statischer Riss, breiter als 0,4 mm, durchzieht die Wand. Wie wird er behandelt?', a: ['20 mm breit und 25 mm tief aufgestemmt, mit AQUAFIN-IC vorgeschlämmt, nass in nass bündig mit ASOCRET-IM gefüllt', 'Zwei Lagen AQUAFIN-IC darüber — das reicht', 'Mit Dichtstoff gefüllt und überstrichen'], why: 'Statische Risse und Fugen über 0,4 mm werden auf 20 × 25 mm aufgestemmt, mit AQUAFIN-IC vorgeschlämmt und bündig mit ASOCRET-IM gefüllt; AQUAFIN-IC selbst dichtet später entstehende Risse bis 0,4 mm.' } }, ok: 0 },
      { t: {
        en: { q: 'The jetted concrete has dried out. What before AQUAFIN-IC?', a: ['Nothing — the slurry brings its own water', 'Flood the floor so it soaks well', 'Wet it with clean water until matt damp, without puddles'], why: 'The surface must be matt damp at application, without puddles; repeated moistening favours the growth of the crystals.' },
        zh: { q: '水刀處理過的混凝土已經乾了。上 AQUAFIN-IC 之前？', a: ['不用——塗料本身有水', '把地面灌滿水，讓它吸飽', '以清水潤濕至微濕，不可積水'], why: '施作時表面須呈微濕且不可積水；反覆潤濕有助於結晶生長。' },
        de: { q: 'Der gestrahlte Beton ist ausgetrocknet. Was kommt vor AQUAFIN-IC?', a: ['Nichts — die Schlämme bringt ihr Wasser mit', 'Den Boden fluten, damit er sich vollsaugt', 'Mit sauberem Wasser mattfeucht vornässen, ohne Pfützen'], why: 'Die Oberfläche muss beim Auftrag mattfeucht sein, ohne Pfützen; wiederholtes Anfeuchten fördert das Kristallwachstum.' } }, ok: 2 },
      { t: {
        en: { q: 'The first coat of AQUAFIN-IC is on. When does the second go on?', a: ['Tomorrow, when the first is fully dry', 'While the first is still sticky and has not dried out', 'After 7 days of curing'], why: 'The second layer goes on while the first is still sticky; drying of the first layer must be avoided.' },
        zh: { q: '第一道 AQUAFIN-IC 已經刷好。第二道什麼時候上？', a: ['明天，等第一道完全乾了', '趁第一道還帶黏性、尚未乾燥時', '養護 7 天之後'], why: '第二道須在第一道仍帶黏性時施作；必須避免第一道乾掉。' },
        de: { q: 'Die erste Lage AQUAFIN-IC ist drauf. Wann kommt die zweite?', a: ['Morgen, wenn die erste ganz trocken ist', 'Solange die erste noch klebrig ist und nicht ausgetrocknet', 'Nach 7 Tagen Nachbehandlung'], why: 'Die zweite Lage wird aufgetragen, solange die erste noch klebrig ist; ein Austrocknen der ersten Lage ist zu vermeiden.' } }, ok: 1 },
      { t: {
        en: { q: 'Accumulated water presses on the wall. How much AQUAFIN-IC in total?', a: ['0.75 kg/m² in one layer', '1.2 kg/m² in two layers', '1.5 kg/m² in two layers'], why: 'The rate follows the water load: 0.75 kg/m² in one layer for soil moisture, 1.2 kg/m² in two layers for non-pressurised water, 1.5 kg/m² in two layers for accumulated water.' },
        zh: { q: '牆面承受積滯水壓。AQUAFIN-IC 總用量多少？', a: ['一道 0.75 kg/m²', '兩道合計 1.2 kg/m²', '兩道合計 1.5 kg/m²'], why: '用量依水作用而定：土壤濕氣一道 0.75 kg/m²；非承壓水兩道 1.2 kg/m²；積滯水兩道 1.5 kg/m²。' },
        de: { q: 'Aufstauendes Wasser drückt gegen die Wand. Wie viel AQUAFIN-IC insgesamt?', a: ['0,75 kg/m² in einer Lage', '1,2 kg/m² in zwei Lagen', '1,5 kg/m² in zwei Lagen'], why: 'Der Verbrauch folgt der Wasserbelastung: 0,75 kg/m² in einer Lage bei Bodenfeuchte, 1,2 kg/m² in zwei Lagen bei nicht drückendem Wasser, 1,5 kg/m² in zwei Lagen bei aufstauendem Wasser.' } }, ok: 2 },
      { t: {
        en: { q: 'The owner wants the sealed wall tiled and painted later. Your answer?', a: ['Fine, any time after 3 days', 'No: AQUAFIN-IC cannot be overcoated with tiles, plaster, bonded screeds or paint', 'Fine, once it is sanded'], why: 'AQUAFIN-IC cannot be overcoated with tiles, plaster, bonded screeds or paint — check what must follow on the coating before choosing it.' },
        zh: { q: '業主想在封好的牆上之後貼磚、上漆。你怎麼回答？', a: ['可以，3 天後隨時都行', '不行：AQUAFIN-IC 不可再覆以磁磚、粉刷、複合整平層或塗料', '可以，打磨過就行'], why: 'AQUAFIN-IC 不可再覆以磁磚、粉刷、複合整平層或塗料——選用前須先確認塗層之後還要做什麼。' },
        de: { q: 'Der Bauherr will die abgedichtete Wand später fliesen und streichen. Ihre Antwort?', a: ['In Ordnung, jederzeit nach 3 Tagen', 'Nein: AQUAFIN-IC kann nicht mit Fliesen, Putz, Verbundestrichen oder Farbe überarbeitet werden', 'In Ordnung, wenn sie angeschliffen wird'], why: 'AQUAFIN-IC kann nicht mit Fliesen, Putz, Verbundestrichen oder Farbe überarbeitet werden — vor der Wahl prüfen, was auf die Beschichtung folgen soll.' } }, ok: 1 }
    ],
    ca: [
      { t: {
        en: { q: 'Recipe: 320 kg/m³ CEM II, w/c 0.50. The dosing of BETOCRETE-CL170-P?', a: ['1.75 % of the cement weight', '1.85 % of the cement weight', '2.00 % of the cement weight'], why: 'Liquid BETOCRETE: 1.75 % below w/c 0.4, 1.85 % at > 0.4–0.5, 2.00 % at > 0.5–0.55 of the cement weight — never above 2.25 %; preliminary tests always.' },
        zh: { q: '配比：CEM II 320 kg/m³，水灰比 0.50。BETOCRETE-CL170-P 摻量多少？', a: ['水泥重量的 1.75 %', '水泥重量的 1.85 %', '水泥重量的 2.00 %'], why: '液態 BETOCRETE：水灰比 < 0.4 用 1.75 %，> 0.4–0.5 用 1.85 %，> 0.5–0.55 用 2.00 %（以水泥重量計）——絕不超過 2.25 %；一律先做預先試驗。' },
        de: { q: 'Rezeptur: 320 kg/m³ CEM II, w/z 0,50. Die Dosierung von BETOCRETE-CL170-P?', a: ['1,75 % des Zementgewichts', '1,85 % des Zementgewichts', '2,00 % des Zementgewichts'], why: 'Flüssiges BETOCRETE: 1,75 % unter w/z 0,4, 1,85 % bei > 0,4–0,5, 2,00 % bei > 0,5–0,55 des Zementgewichts — nie über 2,25 %; Vorversuche immer.' } }, ok: 1 },
      { t: {
        en: { q: 'You check a CEM I recipe for BETOCRETE-CL170-P. The minimum cement content?', a: ['270 kg/m³', '290 kg/m³', '380 kg/m³'], why: 'The data sheet asks for cement ≥ 270 kg/m³ with CEM I, ≥ 290 with CEM II and ≥ 380 with CEM III/A, and a w/c ratio < 0.55.' },
        zh: { q: '你在審一份使用 CEM I 的 BETOCRETE-CL170-P 配比。最低水泥用量是？', a: ['270 kg/m³', '290 kg/m³', '380 kg/m³'], why: '技術資料表要求水泥用量：CEM I ≥ 270 kg/m³、CEM II ≥ 290、CEM III/A ≥ 380，且水灰比 < 0.55。' },
        de: { q: 'Sie prüfen eine CEM-I-Rezeptur für BETOCRETE-CL170-P. Der Mindestzementgehalt?', a: ['270 kg/m³', '290 kg/m³', '380 kg/m³'], why: 'Das Merkblatt verlangt Zement ≥ 270 kg/m³ bei CEM I, ≥ 290 bei CEM II und ≥ 380 bei CEM III/A sowie einen w/z-Wert < 0,55.' } }, ok: 0 },
      { t: {
        en: { q: 'The truck arrives stiff after a long drive. The foreman wants 10 l of water per m³ in the drum. Your call?', a: ['Yes — the admixture seals the pores anyway', 'Yes, but add some BETOCRETE to compensate', 'No water on site: it raises the w/c ratio; the superplasticiser of the recipe sets the consistency'], why: 'No additional water on site: it raises the w/c ratio beyond the recipe, and the crystalline effect works in a dense concrete.' },
        zh: { q: '拌合車跑了很久，到場時混凝土很乾。工頭想每 m³ 加 10 l 水。你怎麼決定？', a: ['可以——反正摻料會封住孔隙', '可以，但要多加一點 BETOCRETE 補償', '工地不准加水：會提高水灰比；稠度用配比中的強塑劑調整'], why: '工地不得另行加水：會使水灰比超出配比，而結晶作用需要緻密的混凝土。' },
        de: { q: 'Der Fahrmischer kommt nach langer Fahrt steif an. Der Polier will 10 l Wasser je m³ in die Trommel. Ihre Entscheidung?', a: ['Ja — das Zusatzmittel dichtet die Poren ohnehin', 'Ja, aber zum Ausgleich etwas BETOCRETE dazu', 'Kein Wasser auf der Baustelle: Es hebt den w/z-Wert; die Konsistenz regelt das Fließmittel der Rezeptur'], why: 'Kein zusätzliches Wasser auf der Baustelle: Es hebt den w/z-Wert über die Rezeptur, und die kristalline Wirkung braucht dichten Beton.' } }, ok: 2 },
      { t: {
        en: { q: 'Liquid BETOCRETE is dosed at the plant. What about the mixing?', a: ['A quick turn is enough — it is a liquid', 'Mix for more than 45 seconds; its quantity is deducted from the mixing water', 'Add it on top of the full mixing water'], why: 'Liquid BETOCRETE is dosed with the mixing water or into the finished mix; the mixing time in the plant is more than 45 seconds, and the quantity is deducted from the mixing water.' },
        zh: { q: '液態 BETOCRETE 在拌合廠投料。拌合要注意什麼？', a: ['稍微轉一下就好——它是液體', '拌合超過 45 秒；其用量自拌合水中扣除', '照原本的拌合水量，再額外加進去'], why: '液態 BETOCRETE 隨拌合水或投入已拌合的混凝土；拌合廠拌合時間超過 45 秒，其用量須自拌合水中扣除。' },
        de: { q: 'Flüssiges BETOCRETE wird im Werk dosiert. Was gilt beim Mischen?', a: ['Kurz umrühren genügt — es ist flüssig', 'Länger als 45 Sekunden mischen; die Menge wird vom Anmachwasser abgezogen', 'Zusätzlich zum vollen Anmachwasser zugeben'], why: 'Flüssiges BETOCRETE wird mit dem Anmachwasser oder in den fertigen Mischbeton dosiert; die Mischzeit im Werk beträgt mehr als 45 Sekunden, die Menge wird vom Anmachwasser abgezogen.' } }, ok: 1 },
      { t: {
        en: { q: 'The construction joint at the kicker is the weak point. What goes in before the wall is poured?', a: ['The crystalline waterstop AQUAFIN-CJ5, fixed to the reinforcement', 'Nothing — the admixture seals the joint by itself', 'A bead of sealant after the pour'], why: 'AQUAFIN-CJ5 is fixed to the reinforcement in the kicker before the wall is poured; the swelling tape AQUAFIN-CJ6 goes on working joints, the injection hose AQUAFIN-CJ1 is the reserve.' },
        zh: { q: '牆腳的施工縫是弱點。澆置牆體之前要放什麼？', a: ['結晶型止水鋼板 AQUAFIN-CJ5，固定在鋼筋上', '不用——摻料自己會封住接縫', '澆完再打一道密封膠'], why: 'AQUAFIN-CJ5 於澆置牆體前固定在牆腳的鋼筋上；工作縫用膨脹止水條 AQUAFIN-CJ6，灌漿管 AQUAFIN-CJ1 作為備用。' },
        de: { q: 'Die Arbeitsfuge an der Aufkantung ist die Schwachstelle. Was kommt hinein, bevor die Wand betoniert wird?', a: ['Das kristalline Fugenband AQUAFIN-CJ5, an der Bewehrung befestigt', 'Nichts — das Zusatzmittel dichtet die Fuge von selbst', 'Nach dem Betonieren eine Raupe Dichtstoff'], why: 'AQUAFIN-CJ5 wird vor dem Betonieren der Wand in der Aufkantung an der Bewehrung befestigt; das Quellband AQUAFIN-CJ6 kommt auf Arbeitsfugen, der Injektionsschlauch AQUAFIN-CJ1 ist die Reserve.' } }, ok: 0 },
      { t: {
        en: { q: 'After striking the formwork you find a honeycomb. Will the crystals seal it?', a: ['Yes — give it a few weeks of ground water', 'Yes, if BETOCRETE is brushed on', 'No: honeycombs and voids are broken out and repaired, e.g. with the ASOCRET-BIS system'], why: 'The crystalline effect works in a dense concrete: honeycombs and voids are not sealed by crystals but broken out and repaired before the component is loaded.' },
        zh: { q: '拆模後發現蜂窩。結晶會把它封起來嗎？', a: ['會——讓地下水泡幾個星期就好', '會，只要在表面刷上 BETOCRETE', '不會：蜂窩與空洞須鑿除修補，例如使用 ASOCRET-BIS 系統'], why: '結晶作用只在緻密的混凝土中有效：蜂窩與空洞不會被結晶封閉，須在構件承載前鑿除並修補。' },
        de: { q: 'Nach dem Ausschalen finden Sie ein Kiesnest. Dichten es die Kristalle?', a: ['Ja — ein paar Wochen Grundwasser, dann ist es dicht', 'Ja, wenn BETOCRETE aufgestrichen wird', 'Nein: Kiesnester und Hohlräume werden ausgebrochen und instand gesetzt, z. B. mit dem ASOCRET-BIS-System'], why: 'Die kristalline Wirkung braucht dichten Beton: Kiesnester und Hohlräume werden nicht von Kristallen gedichtet, sondern vor der Belastung ausgebrochen und instand gesetzt.' } }, ok: 2 },
      { t: {
        en: { q: 'After backfilling, a fine crack under 0.4 mm opens in the wall. What now?', a: ['Inject it at once', 'Nothing: it heals by crystal growth when the water reaches it', 'Break out the wall section'], why: 'Cracks up to 0.4 mm heal themselves by crystal growth when water arrives; wider or moving cracks are injected (AQUAFIN-P1, P4, IH).' },
        zh: { q: '回填後，牆上出現一條小於 0.4 mm 的細裂縫。怎麼辦？', a: ['立刻灌注', '不用處理：水到達時會因結晶生長而自行癒合', '把那段牆鑿掉重做'], why: '0.4 mm 以內的裂縫在水到達時會因結晶生長而自行癒合；更寬或會活動的裂縫則須灌注（AQUAFIN-P1、P4、IH）。' },
        de: { q: 'Nach dem Verfüllen öffnet sich in der Wand ein feiner Riss unter 0,4 mm. Was nun?', a: ['Sofort injizieren', 'Nichts: Er heilt durch Kristallwachstum, sobald das Wasser ihn erreicht', 'Den Wandabschnitt ausbrechen'], why: 'Risse bis 0,4 mm heilen durch Kristallwachstum, wenn Wasser ankommt; breitere oder bewegte Risse werden injiziert (AQUAFIN-P1, P4, IH).' } }, ok: 1 },
      { t: {
        en: { q: 'Crystals show on the cured concrete surface. Is that a defect?', a: ['Yes — grind them off and coat the wall', 'Yes — the dosage was too high', 'No: depending on the mix, crystals on the surface are not a defect'], why: 'BETOCRETE-modified concretes may show crystals on the surface, depending on the composition — that is not a defect.' },
        zh: { q: '養護後的混凝土表面出現結晶。這是缺陷嗎？', a: ['是——磨掉後再整面塗裝', '是——摻量太高了', '不是：視配比而定，表面出現結晶並非缺陷'], why: '摻有 BETOCRETE 的混凝土視配比可能在表面出現結晶——這不是缺陷。' },
        de: { q: 'Auf der nachbehandelten Betonfläche zeigen sich Kristalle. Ein Mangel?', a: ['Ja — abschleifen und die Wand beschichten', 'Ja — die Dosierung war zu hoch', 'Nein: Je nach Zusammensetzung sind Kristalle an der Oberfläche kein Mangel'], why: 'Mit BETOCRETE modifizierter Beton kann je nach Zusammensetzung Kristalle an der Oberfläche zeigen — das ist kein Mangel.' } }, ok: 2 }
    ],
    pf: [
      { t: {
        en: { q: 'A young slab: residual moisture above 4 CM-% and no time to let it dry. Which primer?', a: ['ASODUR-GBM, as on any dry slab', 'The barrier primer ASODUR-SG3, in two coats', 'No primer — coat straight on'], why: 'Above 4 CM-% the barrier primers take over: ASODUR-SG3 bonds to matt damp or young concrete and blocks vapour and negative water pressure up to 3 bar.' },
        zh: { q: '新澆的樓板：殘餘含水率高於 4 CM-%，又沒時間等它乾。用哪種底漆？', a: ['ASODUR-GBM，跟一般乾燥樓板一樣', '阻隔型底漆 ASODUR-SG3，分兩道', '不上底漆——直接上塗層'], why: '超過 4 CM-% 時改用阻隔型底漆：ASODUR-SG3 可附著於微濕或新澆混凝土，阻隔水氣及達 3 bar 的負水壓。' },
        de: { q: 'Junge Bodenplatte: Restfeuchte über 4 CM-%, keine Zeit zum Austrocknen. Welche Grundierung?', a: ['ASODUR-GBM, wie auf jeder trockenen Platte', 'Die Sperrgrundierung ASODUR-SG3, in zwei Lagen', 'Keine Grundierung — direkt beschichten'], why: 'Über 4 CM-% übernehmen die Sperrgrundierungen: ASODUR-SG3 haftet auf mattfeuchtem oder jungem Beton und sperrt Dampf und negativen Wasserdruck bis 3 bar.' } }, ok: 1 },
      { t: {
        en: { q: 'The substrate is only 2 °C above the dew point. Start priming?', a: ['Yes — 2 °C is close enough', 'Yes, with a thicker primer coat', 'No: it must be at least 3 °C above the dew point; heat or ventilate first'], why: 'Substrate and air must be 10–35 °C and at least 3 °C above the dew point; below that distance the resin blushes and the bond fails.' },
        zh: { q: '基面溫度只比露點高 2 °C。可以開始上底漆嗎？', a: ['可以——2 °C 差不多了', '可以，底漆塗厚一點就好', '不行：須高於露點至少 3 °C；先加溫或通風'], why: '基面與空氣須為 10–35 °C，且高於露點至少 3 °C；低於此差距，樹脂會泛白，黏結失效。' },
        de: { q: 'Der Untergrund liegt nur 2 °C über dem Taupunkt. Grundieren?', a: ['Ja — 2 °C sind nah genug', 'Ja, mit einer dickeren Grundierlage', 'Nein: mindestens 3 °C über dem Taupunkt; erst heizen oder lüften'], why: 'Untergrund und Luft müssen 10–35 °C haben und mindestens 3 °C über dem Taupunkt liegen; darunter läuft das Harz an und der Verbund versagt.' } }, ok: 2 },
      { t: {
        en: { q: 'How is the slab prepared before the primer?', a: ['Shot-blasted to an open-pored, grippy surface, vacuumed dust-free; ≥ 1.5 N/mm²', 'Swept and mopped with a strong detergent', 'Wetted down so the dust stays put'], why: 'Shot blasting (DIN EN 14879-1) removes laitance, old coatings and loose parts; the surface tensile strength is at least 1.5 N/mm², vacuumed dust-free right before the primer.' },
        zh: { q: '上底漆之前，樓板怎麼處理？', a: ['珠擊至開孔、具抓附力的表面，吸塵至無塵；≥ 1.5 N/mm²', '掃乾淨，用強力清潔劑拖地', '灑水，讓灰塵不要飛'], why: '以珠擊（DIN EN 14879-1）去除浮漿、舊塗層與鬆動部分；表面拉拔強度至少 1.5 N/mm²，上底漆前立即吸塵至無塵。' },
        de: { q: 'Wie wird die Platte vor der Grundierung vorbereitet?', a: ['Kugelgestrahlt bis offenporig und griffig, staubfrei abgesaugt; ≥ 1,5 N/mm²', 'Gekehrt und mit starkem Reiniger gewischt', 'Angenässt, damit der Staub liegen bleibt'], why: 'Kugelstrahlen (DIN EN 14879-1) entfernt Zementschlämme, Altbeschichtungen und lose Teile; die Oberflächenzugfestigkeit beträgt mindestens 1,5 N/mm², unmittelbar vor der Grundierung staubfrei abgesaugt.' } }, ok: 0 },
      { t: {
        en: { q: 'The first coat of ASODUR-SG3 is on. When and how does the second follow?', a: ['At once, wet in wet, without sand', 'When it is fully cured, however long that takes', 'After min. 12 hours (within 5 days), broadcast with approx. 1–1.5 kg/m² quartz sand'], why: 'The second coat follows after min. 12 hours and within 5 days, broadcast with quartz sand (approx. 1–1.5 kg/m²) as the key for the coating.' },
        zh: { q: '第一道 ASODUR-SG3 已上好。第二道何時、怎麼施作？', a: ['馬上濕碰濕，不撒砂', '等它完全硬化，多久都沒關係', '至少 12 小時後（5 天內），並撒布約 1–1.5 kg/m² 石英砂'], why: '第二道於至少 12 小時後、5 天內施作，並撒布石英砂（約 1–1.5 kg/m²），作為塗層的抓附層。' },
        de: { q: 'Die erste Lage ASODUR-SG3 ist drauf. Wann und wie folgt die zweite?', a: ['Sofort nass in nass, ohne Sand', 'Wenn sie ganz ausgehärtet ist, egal wie lange', 'Nach mind. 12 Stunden (innerhalb von 5 Tagen), mit ca. 1–1,5 kg/m² Quarzsand abgestreut'], why: 'Die zweite Lage folgt nach mind. 12 Stunden und innerhalb von 5 Tagen, abgestreut mit Quarzsand (ca. 1–1,5 kg/m²) als Haftgrund für die Beschichtung.' } }, ok: 2 },
      { t: {
        en: { q: 'Damp slab, and only one shift for both primer coats. What do you use?', a: ['ASODUR-SG3-superfast: the second coat after approx. 3.5 hours', 'ASODUR-SG3 thinned with water so it dries faster', 'ASODUR-SG3, skipping the second coat'], why: 'SG3-superfast gives the same barrier and is overcoated after approx. 3.5 hours — two coats in one shift; pot life approx. 15–20 minutes.' },
        zh: { q: '潮濕樓板，兩道底漆只有一個班次可以做完。用什麼？', a: ['ASODUR-SG3-superfast：約 3.5 小時後即可上第二道', 'ASODUR-SG3 加水稀釋，乾得比較快', 'ASODUR-SG3，省掉第二道'], why: 'SG3-superfast 阻隔效果相同，約 3.5 小時後即可覆塗——一個班次完成兩道；可使用時間約 15–20 分鐘。' },
        de: { q: 'Feuchte Platte, nur eine Schicht für beide Grundierlagen. Was nehmen Sie?', a: ['ASODUR-SG3-superfast: die zweite Lage nach ca. 3,5 Stunden', 'ASODUR-SG3, mit Wasser verdünnt, damit es schneller trocknet', 'ASODUR-SG3, ohne die zweite Lage'], why: 'SG3-superfast bildet dieselbe Sperre und ist nach ca. 3,5 Stunden überarbeitbar — zwei Lagen in einer Schicht; Topfzeit ca. 15–20 Minuten.' } }, ok: 0 },
      { t: {
        en: { q: 'ASODUR-B351 is spread at approx. 1 mm. What next?', a: ['Leave it untouched so it levels itself', 'Roll it criss-cross with the spiked roller while it still flows, to release the air', 'Mist water over it for a smoother finish'], why: 'The self-levelling coating is rolled criss-cross with the spiked roller to release the air, while it still flows; then it is kept free of damp for approx. 4–6 hours.' },
        zh: { q: 'ASODUR-B351 已攤鋪約 1 mm。接下來？', a: ['不要碰，讓它自己流平', '趁還在流動時以釘輥十字交叉滾壓，排出空氣', '噴點水讓表面更平滑'], why: '自平塗層須趁仍可流動時以釘輥十字交叉滾壓以排出空氣；之後約 4–6 小時內避免受潮。' },
        de: { q: 'ASODUR-B351 ist mit ca. 1 mm aufgezogen. Was nun?', a: ['Nicht berühren, damit es selbst verläuft', 'Mit der Stachelwalze über Kreuz rollen, solange es noch fließt, um die Luft auszutreiben', 'Wasser aufsprühen für eine glattere Oberfläche'], why: 'Die selbstverlaufende Beschichtung wird mit der Stachelwalze über Kreuz entlüftet, solange sie noch fließt; danach ca. 4–6 Stunden vor Feuchte schützen.' } }, ok: 1 },
      { t: {
        en: { q: 'Garage floor with ASODUR-V360W. How is the primer made?', a: ['Undiluted, exactly like the seal', 'With as much water as it takes to roll easily', 'Mixed 100 : 20, diluted with 8–10 % water (max. 10 %), approx. 0.15 kg/m²'], why: 'V360W is its own primer: mixed 100 : 20, diluted with 8–10 % water — not more than 10 % — and rolled criss-cross at approx. 0.15 kg/m²; the seal itself goes on undiluted.' },
        zh: { q: '車庫地坪用 ASODUR-V360W。底漆怎麼調？', a: ['不稀釋，跟面漆完全一樣', '加水加到好滾為止', '以 100 : 20 拌合，加 8–10 % 水稀釋（最多 10 %），約 0.15 kg/m²'], why: 'V360W 本身就是底漆：以 100 : 20 拌合，加 8–10 % 水稀釋——不超過 10 %——十字交叉滾塗約 0.15 kg/m²；面漆則不稀釋。' },
        de: { q: 'Garagenboden mit ASODUR-V360W. Wie wird die Grundierung angesetzt?', a: ['Unverdünnt, genau wie die Versiegelung', 'Mit so viel Wasser, bis es sich leicht rollen lässt', '100 : 20 gemischt, mit 8–10 % Wasser verdünnt (max. 10 %), ca. 0,15 kg/m²'], why: 'V360W ist seine eigene Grundierung: 100 : 20 gemischt, mit 8–10 % Wasser verdünnt — nicht mehr als 10 % — und mit ca. 0,15 kg/m² über Kreuz gerollt; die Versiegelung selbst bleibt unverdünnt.' } }, ok: 2 },
      { t: {
        en: { q: 'The slab has field joints. Coat straight over them?', a: ['Yes — the coating bridges the joints', 'No: take them through the coating and fill them elastic with INDUFLEX-PU (width : depth 1 : 0.8)', 'No: fill them flush with epoxy mortar first'], why: 'Joints are taken through the coating: backed with a closed-cell cord, primed and filled with INDUFLEX-PU, depth after width : depth 1 : 0.8 — a coating bridges a joint only until the slab moves.' },
        zh: { q: '樓板上有分格縫。直接塗過去嗎？', a: ['可以——塗層會橋接接縫', '不行：接縫須貫穿塗層，以 INDUFLEX-PU 彈性填縫（寬 : 深 1 : 0.8）', '不行：先用環氧砂漿填平'], why: '接縫須貫穿塗層：置入閉孔背襯條、上底漆後以 INDUFLEX-PU 填縫，深度依寬 : 深 1 : 0.8——塗層只能橋接到樓板開始移動為止。' },
        de: { q: 'Die Platte hat Feldfugen. Einfach darüber beschichten?', a: ['Ja — die Beschichtung überbrückt die Fugen', 'Nein: durch die Beschichtung führen und elastisch mit INDUFLEX-PU füllen (Breite : Tiefe 1 : 0,8)', 'Nein: zuerst bündig mit Epoxidmörtel füllen'], why: 'Fugen werden durch die Beschichtung geführt: mit geschlossenzelliger Rundschnur hinterfüllt, grundiert und mit INDUFLEX-PU gefüllt, Tiefe nach Breite : Tiefe 1 : 0,8 — eine Beschichtung überbrückt eine Fuge nur, bis die Platte sich bewegt.' } }, ok: 1 }
    ]
  };

  /* ----- sources: for each question the site snippet that supports it (first ~80 chars, from src/app.js) -----
     inj q1 · app.js: Where the {defect} conducts water, an initial injection of {P1} is necessary to 
     inj q2 · app.js: Holes every 20 cm, offset to alternate sides of the crack, at an angle of 45°: e
     inj q3 · app.js: Clear any drilling debris in the drilled holes using oil-free compressed air.'],
     inj q4 · app.js: Seal the inserted packers and the zone of the {defect} on the surface approx. 15
     inj q5 · app.js: {P4} is a 2 component system, mixed 1 volume share component A to 1 volume share
     inj q6 · app.js: Vertical cracks: start at the lowest packer and work upwards.', 'Change to the n
     inj q7 · app.js: After the resin has cured, remove the injection packers and plug the boreholes f
     inj q8 · app.js: Thin components, dense reinforcement or prestressing steel do not allow drilling
     cr q1 · app.js: Before any concrete restoration measures, the current state must generally be ch
     cr q2 · app.js: The exposed reinforcing steels must be totally de-rusted and must be clear of du
     cr q3 · app.js: the second coat is applied after approx. 2 hours waiting time, when the first co
     cr q4 · app.js: Dampen the pre-treated mineral substrate sufficiently 24 hours and 2 hours befor
     cr q5 · app.js: The repair mortar {BIS540} is applied while the bond coat is still wet, in the r
     cr q6 · app.js: with large surface applications the layer thickness can be up to max. 20 mm in o
     cr q7 · app.js: on {BIS540}: overcoat after 24 hours at the earliest'], src: 'BIS16 · BIS540' },
     cr q8 · app.js: keep the surfaces damp for at least 3–5 days using water mist nozzles, wet jute 
     wp q1 · app.js: {AQ2K} as bonded waterproofing with tiles and boards for water impact classes W0
     wp q2 · app.js: Fill approx. 50–60 % of the liquid component into a clean mixing bucket and mix 
     wp q3 · app.js: The second application step (and subsequent ones) can be carried out after appro
     wp q4 · app.js: The waterproofing layer must be completely hardened at the time of the laying wo
     wp q5 · app.js: The second application step (and following) can take place when the first applic
     wp q6 · app.js: Water pressure from the negative side (WTA 4-6): ≥ 3.0 mm dry film, ≥ 3.6 kg/m²;
     wp q7 · app.js: Moisture penetration from the rear and intermittent moisture loading from the ne
     wp q8 · app.js: While still wet, install a sealing cove with an edge height of at least 4 cm mad
     rc q1 · app.js: Form plugs with the mortar and press them into the area where the water runs; ho
     rc q2 · app.js: Solidification starts after 1–2 minutes and the pot life is approx. 2 minutes — 
     rc q3 · app.js: If the water pressure is high, a drain is installed using water hoses or pipes: 
     rc q4 · app.js: Defective construction joints and visible static cracks over 0.4 mm are opened t
     rc q5 · app.js: dampen the surfaces to be sealed with clean water beforehand; repeated moistenin
     rc q6 · app.js: Apply the second layer while the first layer is still sticky and has not yet dri
     rc q7 · app.js: The total rate follows the water load: 0.75 kg/m² in one layer for soil moisture
     rc q8 · app.js: {IC} cannot be overcoated with tiles, plaster, bonded screeds or paint, and cann
     ca q1 · app.js: The dosing level of the data sheet follows the w/c ratio: liquid 1.75 % (< 0.4),
     ca q2 · app.js: cement ≥ 270 kg/m³ (CEM I), ≥ 290 (CEM II), ≥ 380 (CEM III/A); w/c < 0.55; grain
     ca q3 · app.js: no additional water on site: it raises the w/c ratio beyond the recipe †', 'full
     ca q4 · app.js: The mixing time in the concrete plant is more than 45 seconds. The quantity of t
     ca q5 · app.js: {CJ5} is fixed to the reinforcement in the kicker before the wall is poured and 
     ca q6 · app.js: The crystalline effect works in a dense concrete — honeycombs and voids are not 
     ca q7 · app.js: Surface and continuous cracks up to 0.4 mm (tapering down to 0.5 mm) are healed 
     ca q8 · app.js: BETOCRETE-modified concretes may show crystals on the surface, depending on the 
     pf q1 · app.js: A substrate that is matt damp, young, without a vapour barrier or under ground w
     pf q2 · app.js: below the dew point distance the resin blushes and the bond fails: the dew point
     pf q3 · app.js: laitance, sinter layers, old coatings, separating agents and loose parts are rem
     pf q4 · app.js: the second after min. 12 hours and within 5 days, broadcast with quartz sand (ap
     pf q5 · app.js: Where the schedule leaves no night between the coats, {SG3F} replaces {SG3}: mix
     pf q6 · app.js: rolled criss-cross with the spiked roller to release the air: approx. 70 N/mm² c
     pf q7 · app.js: 8–10 % water is stirred in (not more than 10 %) and the primer rolled criss-cros
     pf q8 · app.js: The field joints, connection joints and wall joints of the floor are taken throu
  ----- */
