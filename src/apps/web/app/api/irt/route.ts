import { NextRequest, NextResponse } from 'next/server';
import { devResults } from '@/lib/devResults';

// Try to locate an Rscript executable. Priority:
// 1. process.env.R_SCRIPT_PATH (explicit)
// 2. the command 'Rscript' on PATH
// 3. try platform-specific lookup ('where' on Windows, 'which' on *nix)
function findRscript(): string | null {
  const tryCmd = (cmd: string) => {
    try {
      const chk = spawnSync(cmd, ['--version'], { encoding: 'utf-8', stdio: 'pipe' });
      if (!chk.error && chk.status === 0) return true;
    } catch (e) {
      /* ignore */
    }
    return false;
  };

  const envPath = process.env.R_SCRIPT_PATH;
  if (envPath && tryCmd(envPath)) return envPath;

  if (tryCmd('Rscript')) return 'Rscript';

  try {
    if (process.platform === 'win32') {
      const where = spawnSync('where', ['Rscript'], { encoding: 'utf-8' });
      if (!where.error && where.status === 0) {
        const p = where.stdout.split(/\r?\n/)[0].trim();
        if (p && tryCmd(p)) return p;
      }
    } else {
      const which = spawnSync('which', ['Rscript'], { encoding: 'utf-8' });
      if (!which.error && which.status === 0) {
        const p = which.stdout.split(/\r?\n/)[0].trim();
        if (p && tryCmd(p)) return p;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.responses) return NextResponse.json({ ok: false, error: 'missing responses' }, { status: 400 });

    const R_API_URL = process.env.R_API_URL || process.env.NEXT_PUBLIC_R_API_URL || 'http://localhost:8000';

    const payload = JSON.stringify({ responses: body.responses, names: body.names ?? null });

    const resp = await fetch(`${R_API_URL.replace(/\/+$/, '')}/calculate-irt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('R API error', resp.status, text);
      return NextResponse.json({ ok: false, error: 'R_API_ERROR', details: text }, { status: 502 });
    }

    const out = await resp.json();

    const itemsFlat = [] as any[];
    if (out.itemScores) {
      itemsFlat.push({ section: 'irt', items: out.itemScores });
    }
    const saved = await devResults.create({ thetas: out.ability ?? null, items: itemsFlat, meta: { source: 'R_API', raw: out } });
    return NextResponse.json({ ok: true, data: out, saved });
  } catch (err: any) {
    console.error('POST /api/irt error', err);
    return NextResponse.json({ ok: false, error: err.message || 'server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const results = await devResults.findMany();
    return NextResponse.json({ ok: true, data: results });
  } catch (err: any) {
    console.error('GET /api/irt error', err);
    return NextResponse.json({ ok: false, error: err.message || 'server error' }, { status: 500 });
  }
}
