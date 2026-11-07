# Köln: exact-string patches of inline UI words the player sees (parts b, z, c). Exec'd by port.py / patchcheck.py: patch(part, old, new).
# part b: the hero's name in the talk box is Mira (zh 米菈)
patch('01_island_b', "function lunaName() { return LANG === 'en' ? 'Luna' : 'ルナ'; }", "function lunaName() { return LANG === 'zh' ? '米菈' : 'Mira'; }")
# part b: the Brauhaus Heinzelstube keeps the hours its words give (T.diner / T.dinerClosed): 11:00 to 01:00
patch('01_island_b', "function dinerOpen() { return hourNow >= 19 || hourNow < 7; }", "function dinerOpen() { return hourNow >= 11 || hourNow < 1; }")
# part z: the quality chip's colon follows the language
patch('26_island_z', "b.textContent = qx('t') + '：' + qx(qGet());", "b.textContent = qx('t') + (LANG === 'zh' ? '：' : ': ') + qx(qGet());")
# part c: the training centre's host is the lead trainer
patch('27_island_c', "(LANG === 'en' ? 'Welcome drop' : LANG === 'ja' ? '受付しずく' : '接待水滴')", "(LANG === 'zh' ? '首席講師' : LANG === 'de' ? 'Leitender Trainer' : 'Lead trainer')")
# part c: a site card names its guide in German too
patch('27_island_c', "lx({ zh: tr0('title.' + cat, 'zh'), en: tr0('title.' + cat, 'en'), ja: tr0('title.' + cat, 'ja') })", "lx({ en: tr0('title.' + cat, 'en'), zh: tr0('title.' + cat, 'zh'), de: tr0('title.' + cat, 'de') })")
# part c: the boss gate's "Hint:" colon follows the language
patch('27_island_c', "esc(t('bossHint')) + '：</b>'", "esc(t('bossHint')) + (LANG === 'zh' ? '：' : ': ') + '</b>'")
# part c: the key named on the action mark
patch('27_island_c', "(COARSE ? '' : ' · Space')", "(COARSE ? '' : ' · ' + (LANG === 'zh' ? '空白鍵' : LANG === 'de' ? 'Leertaste' : 'Space'))")
