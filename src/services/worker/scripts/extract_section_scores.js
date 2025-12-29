// Fetch saved IRT results from the local API and extract per-student section scores
// Usage: node scripts/extract_section_scores.js [savedId] [outCsv] [outJson]
// Defaults: latest saved, scripts/section_scores.csv, scripts/section_scores.json

const fs = require('fs');

async function main() {
  const argv = process.argv.slice(2);
  const firstArg = argv[0];
  const outCsv = argv[1] || 'scripts/section_scores.csv';
  const outJson = argv[2] || 'scripts/section_scores.json';

  let record = null;
  // If firstArg is a path to a JSON file, read the saved response from disk
  if (firstArg && require('fs').existsSync(firstArg)) {
    const raw = JSON.parse(require('fs').readFileSync(firstArg, 'utf-8'));
    // Expect file format { status, body }
    const body = raw && raw.body ? raw.body : raw;
    if (!body || !body.ok) throw new Error('invalid response file: ' + firstArg);
    // emulate the devResults saved record structure
    record = body.saved || (body.data && body.data.saved) || { meta: { raw: body.data } };
  } else {
    // fallback: fetch from API
    const res = await fetch('http://localhost:3000/api/irt');
    const j = await res.json();
    if (!j.ok) throw new Error('failed to fetch /api/irt: ' + JSON.stringify(j));
    const results = j.data;
    if (!Array.isArray(results) || results.length === 0) throw new Error('no saved results found');
    const savedId = firstArg;
    if (savedId) record = results.find(r => String(r.id) === String(savedId));
    if (!record) record = results[results.length - 1];
  }

  // Try to find student array in common locations
  const raw = record.meta && record.meta.raw ? record.meta.raw : record;
  const students = raw.students || raw.data && raw.data.students || record.students || (record.data && record.data.students);
  if (!Array.isArray(students)) throw new Error('no students array found in saved result');

  function getScore(s, keyCandidates) {
    for (const k of keyCandidates) if (s[k] !== undefined) return s[k];
    return null;
  }

  // Key candidates for possible field names
  const viKeys = ['score0_300_vi', 'score_vi', 'score_vi_0_300', 'score_vi_300', 'vi_score'];
  const enKeys = ['score0_300_en', 'score_en', 'score_en_0_300', 'score_en_300', 'en_score'];
  const mathKeys = ['score0_300_math', 'score_math', 'score_math_0_300', 'score_math_300', 'math_score'];
  const sciKeys = ['score0_300_sci', 'score_sci', 'score_sci_0_300', 'score_sci_300', 'sci_score'];

  const out = students.map(s => {
    const name = s.name || s.id || s.student || s.label || 'unknown';
    return {
      name,
      vi: getScore(s, viKeys),
      en: getScore(s, enKeys),
      math: getScore(s, mathKeys),
      sci: getScore(s, sciKeys),
    };
  });

  // Write JSON
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2));

  // Write CSV
  const header = 'name,vi,en,math,sci\n';
  const rows = out.map(r => [
    '"' + String(r.name).replace(/"/g, '""') + '"',
    r.vi == null ? '' : String(r.vi),
    r.en == null ? '' : String(r.en),
    r.math == null ? '' : String(r.math),
    r.sci == null ? '' : String(r.sci)
  ].join(',')).join('\n');
  fs.writeFileSync(outCsv, header + rows + '\n');

  console.log('Wrote', outJson, 'and', outCsv);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
