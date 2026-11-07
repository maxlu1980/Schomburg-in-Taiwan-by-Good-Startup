const acorn = require('acorn'), fs = require('fs'), path = require('path');
const R = require('path').join(__dirname, '..', 'src') + '/';
const files = ['boot.js','logo-data.js','de.js','hsaudio.js','hsim.js','app.js','koeln/kw.js','koeln/koeln3d.js','koeln/kisle.js','koeln/isle/k_stubs.js', ...fs.readdirSync(R + 'koeln/lib').map(f => 'koeln/lib/' + f)];
let bad = 0;
for (const f of files) {
  const t = fs.readFileSync(R + f, 'utf8');
  try { const ast = acorn.parse(t, { ecmaVersion: 2022, sourceType: 'script' }); 
    // ES level used: flag any syntax newer than ES2015 that old Safari would reject
    let feats = new Set();
    const visit = (n) => { if (!n || typeof n.type !== 'string') return; if (n.type === 'ChainExpression') feats.add('optional chaining'); if (n.type === 'LogicalExpression' && n.operator === '??') feats.add('??'); if (n.type === 'ClassDeclaration' || n.type === 'ClassExpression') feats.add('class'); if (n.type === 'ArrowFunctionExpression') feats.add('arrow'); if (n.type === 'TemplateLiteral') feats.add('template'); if (n.type === 'VariableDeclaration' && n.kind !== 'var') feats.add(n.kind); if (n.type === 'SpreadElement' || n.type === 'RestElement') feats.add('spread'); if (n.type === 'AwaitExpression') feats.add('async'); for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === 'string') visit(v); } };
    visit(ast); console.log('ok  ', f.padEnd(28), (t.length/1024|0) + ' KB', [...feats].join(',') || 'ES5'); }
  catch (e) { bad++; console.log('FAIL', f, e.message); }
}
console.log('parse failures', bad);
