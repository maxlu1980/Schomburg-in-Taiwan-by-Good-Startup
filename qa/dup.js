const acorn = require('acorn'), fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname, '..', 'game', 'tools', 'port.py'), 'utf8');
const parts = eval(src.match(/KPARTS = (\[.*?\])/)[1].replace(/'/g, '"'));
const D = require('path').join(__dirname, '..', 'src', 'koeln', 'isle') + '/', decl = {};
for (const p of parts) {
  const t = fs.readFileSync(D + p, 'utf8');
  let ast; try { ast = acorn.parse('(function(){' + t + '\n})', { ecmaVersion: 2022 }); } catch (e) { console.log('PARSE', p, e.message); continue; }
  const body = ast.body[0].expression.body.body;
  const add = (n) => { (decl[n] = decl[n] || []).push(p); };
  const walkVar = (node) => { if (node.type === 'VariableDeclaration' && node.kind === 'var') node.declarations.forEach(d => d.id.type === 'Identifier' && add(d.id.name)); };
  const visit = (n) => { // var hoists out of blocks/loops but not functions
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'FunctionDeclaration') { add(n.id.name); return; }
    if (/Function/.test(n.type)) return;
    walkVar(n);
    for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === 'string') visit(v); }
  };
  body.forEach(visit);
}
const bad = Object.entries(decl).filter(([k, v]) => new Set(v).size > 1);
console.log('names', Object.keys(decl).length, 'dups', bad.length);
bad.forEach(([k, v]) => console.log(k, [...new Set(v)].join(' ')));
