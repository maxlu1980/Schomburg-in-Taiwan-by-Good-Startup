  /* ===== ISLE part K27 (Köln, V86): who made it. "System developed by Good Startup" (系統由好時新創 Good Startup 開發) is stated, in one
     small line, on the game's interfaces: under the title card's text; on the loading screen (src/body.html and k_load.js) and on the veil
     of every screen transition (a ride, a door, a train: the fade between two places); on the opening film's closing title; as a footer of
     the panels opened from the HUD (menu, map, navigation, the pocket door, the phone, bag, handbook, gear, graphics, help, the way back to
     the guides); and on the result cards (a duel won or lost, a ride's end). Not on the 3D picture while playing: nothing stands in the
     view. One wording per language; every such element is marked data-kdev and filled by kdevFill, also when the language changes. ===== */
  var KDEV = { on: 0 };
  var KDEVT = { zh: '系統由好時新創 Good Startup 開發', en: 'System developed by Good Startup', de: 'System entwickelt von Good Startup' };
  function kdevText() { return KDEVT[LANG] || KDEVT.en; }
  function kdevFill(scope) { var L = (scope || document).querySelectorAll('[data-kdev]'), i, tx = kdevText(); for (i = 0; i < L.length; i++) if (L[i].textContent !== tx) L[i].textContent = tx; }
  function kdevEl(tag, cls) { var e = document.createElement(tag); e.className = cls; e.setAttribute('data-kdev', ''); e.textContent = kdevText(); return e; }
  /* the title card (over its small print) and the transitions' veil (the line shows and goes with the veil; not in a hit's flash) */
  var _buildDomDev = buildDom; buildDom = function () { _buildDomDev.apply(this, arguments); try { var cr = $('isCredit'); if (cr && !root.querySelector('.isle__dev--title')) cr.parentNode.insertBefore(kdevEl('p', 'isle__dev isle__dev--title'), cr);
      var fd = $('isFade'); if (fd && !fd.querySelector('.isle__dev')) fd.appendChild(kdevEl('p', 'isle__dev isle__dev--fade')); } catch (e) { if (window.ISLE_TEST) throw e; } };
  var _labelsDev = labels; labels = function () { _labelsDev.apply(this, arguments); try { kdevFill(root); } catch (e) {} };
  /* the cards: a footer under the content of the panels opened from the HUD and of the result cards. The panels' openers mark their card
     (KDEV.on); a panel that draws itself again (a choice made in it) is known by its kind; a result card by what it shows (the duel's
     verdict, the retry after a defeat, a reward with nothing to decide, the stars after a ride). Prompts in play (a stall, a gate, a quiz)
     carry none. */
  function kdevResult(cin, cls) { var h2 = cin.querySelector('h2'), tx = h2 ? h2.textContent : ''; if (tx && (tx === tg('felled') || tx === tg('died'))) return true; if (cin.querySelector('#isRetry') || cin.querySelector('.isle__stars')) return true; return !!(cls && /isle__cin--boss(\s|$)/.test(cls) && !cin.querySelector('.isle__cact')); }
  var _cardDev = card; card = function (html, cls) { var C = _cardDev(html, cls); try { var cin = C.querySelector('.isle__cin'); if (cin && !cin.querySelector('.isle__dev') && (KDEV.on || (cls && /isle__cin--(map|nav|gear|menu|gfx|wide|portal|book)(\s|$)/.test(cls)) || kdevResult(cin, cls))) cin.appendChild(kdevEl('p', 'isle__dev isle__dev--card')); } catch (e) { if (window.ISLE_TEST) throw e; } return C; };
  function kdevWrap(f) { return function () { KDEV.on++; try { return f.apply(this, arguments); } finally { KDEV.on--; } }; }
  moreCard = kdevWrap(moreCard); helpCard = kdevWrap(helpCard); mapCard = kdevWrap(mapCard); phoneCard = kdevWrap(phoneCard); bagCard = kdevWrap(bagCard); bookCard = kdevWrap(bookCard); gearCard = kdevWrap(gearCard); guidesCard = kdevWrap(guidesCard); navCard = kdevWrap(navCard); qualCard = kdevWrap(qualCard);
  /* the opening film's closing title: the line between the tag and the film's own credits */
  var _kinOverlayDev = kinOverlay; kinOverlay = function () { var O = _kinOverlayDev.apply(this, arguments); try { var Tt = O && O.querySelector('#kinTitle'); if (Tt && !Tt.querySelector('.kin__dev')) { var em = Tt.querySelector('em'), d = kdevEl('i', 'kin__dev'); if (em) Tt.insertBefore(d, em); else Tt.appendChild(d); } if (O) kdevFill(O); } catch (e) { if (window.ISLE_TEST) throw e; } return O; };
  /* (the tests) every such line now in the page: [class, text, x, y, w, h, laid out and not hidden, the opacity it is seen at] */
  window.ISLE_x = window.ISLE_x || {}; window.ISLE_x.dev = function () { return [].map.call(document.querySelectorAll('[data-kdev]'), function (e) { var r = e.getBoundingClientRect(), o = 1, p; for (p = e; p && p.nodeType === 1 && !(p.classList && p.classList.contains('isle__cin')); p = p.parentNode) o *= +getComputedStyle(p).opacity; return [e.className, e.textContent, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), !!(e.offsetWidth || e.offsetHeight) && getComputedStyle(e).visibility !== 'hidden', +o.toFixed(2)]; }); };
