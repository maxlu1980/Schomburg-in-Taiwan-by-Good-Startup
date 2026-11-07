/* ===== KISLE glue: what the reference page provided — the island's geometry (none in Köln), the cities' weather (Köln's), the logo ===== */
var TWG = { ll: function () { return [1e5, 1e5]; }, sdf: function () { return -99; }, height: function () { return -1; }, GW: 1, GH: 1, X0: 0, Z0: 0, lake: null };
var TKWEA = KOLNWEA, TPEWEA = KOLNWEA;
var LOGO_IMG = (function () { try { var L = typeof LOGO !== 'undefined' && LOGO.logo; if (!L) return undefined; return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + L.w + ' ' + L.h + '"><path fill="#e3000f" d="' + L.d + '"/></svg>'); } catch (e) { return undefined; } })();
