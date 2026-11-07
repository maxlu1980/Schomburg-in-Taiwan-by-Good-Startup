# (V85) the camera on the stairs: the city may give the order of the arm's angles to try (Köln: higher first while she climbs a stair)
patch('07_island_h', "C = [0, -0.14, 0.16, -0.28, 0.32, -0.44, 0.5, -0.6];", "C = (TKM.camOrder && TKM.camOrder(z, TC.climb || 0)) || [0, -0.14, 0.16, -0.28, 0.32, -0.44, 0.5, -0.6];")
# (V85) the board tiles' icons lay 5 mm over their discs' tops (they flickered from a few metres on): 1 cm over, and drawn in front of the disc
patch('27_island_c', "it2 = L3.map(function (tl) { return { p: [tl.x, tl.y + 0.075, tl.z] }; })", "it2 = L3.map(function (tl) { return { p: [tl.x, tl.y + 0.08, tl.z] }; })")
patch('27_island_c', "it2, { cast: false }); scene.add(m1); scene.add(m2); }); }", "it2, { cast: false }); m2.material.polygonOffset = true; m2.material.polygonOffsetFactor = -1; m2.material.polygonOffsetUnits = -4; scene.add(m1); scene.add(m2); }); }")
