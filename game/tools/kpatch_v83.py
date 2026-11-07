# ---- (V83) SCHOMBURG CIS: the navigation's floor chevrons and categories in the brand's colours (the red arrow; categories told apart by lightness) ----
patch('20_island_t', "map: tx2, color: 0xff9a3a,", "map: tx2, color: 0xe3000f,")
patch('20_island_t', "map: tx2, color: 0xffb060,", "map: tx2, color: 0xff6a72,")
patch('20_island_t', "var NVCOL = { train: '#ef7a1d', people: '#3a8ad8', transit: '#22a06b', place: '#a45ae0' };", "var NVCOL = { train: '#e3000f', people: '#005baa', transit: '#231f20', place: '#6d6e71' };")
patch('20_island_t', "地面的橘色箭頭會一路帶妳過去", "地面的紅色箭頭會一路帶妳過去")
patch('20_island_t', "the orange arrows on the ground lead the way", "the red arrows on the ground lead the way")
patch('20_island_t', "ahead: '沿著橘色箭頭前進'", "ahead: '沿著紅色箭頭前進'")
patch('20_island_t', "ahead: 'Follow the orange arrows'", "ahead: 'Follow the red arrows'")
