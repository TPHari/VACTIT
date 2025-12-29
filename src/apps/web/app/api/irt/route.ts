import { NextRequest, NextResponse } from 'next/server';
import { spawnSync } from 'child_process';
let _devResults: any = null;
async function loadDevResults() {
  if (_devResults) return _devResults;
  try {
    const mod = await import('@/lib/devResults');
    _devResults = mod.devResults ?? mod.default ?? mod;
  } catch (e) {
    // fallback no-op implementation for production builds
    _devResults = {
      create: async (_: any) => null,
      findMany: async () => [],
    };
  }
  return _devResults;
}

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

    // send request to R service with server-side API key and timeout+retries
    const IRT_API_KEY = process.env.IRT_API_KEY;

    const fetchWithTimeout = (url: string, opts: any, timeout = 20000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(id));
    };

    const withRetries = async (fn: () => Promise<Response>, attempts = 2) => {
      let lastErr: any;
      for (let i = 0; i < attempts; i++) {
        try {
          return await fn();
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 200 * (i + 1)));
        }
      }
      throw lastErr;
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (IRT_API_KEY) headers['Authorization'] = `Bearer ${IRT_API_KEY}`;

    const resp = await withRetries(() => fetchWithTimeout(`${R_API_URL.replace(/\/+$/, '')}/calculate-irt`, {
      method: 'POST',
      headers,
      body: payload,
    }, 20000), 2);

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
    const dev = await loadDevResults();
    const saved = await dev.create({ thetas: out.ability ?? null, items: itemsFlat, meta: { source: 'R_API', raw: out } });
    return NextResponse.json({ ok: true, data: out, saved });
  } catch (err: any) {
    console.error('POST /api/irt error', err);
    return NextResponse.json({ ok: false, error: err.message || 'server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const dev = await loadDevResults();
    const results = await dev.findMany();
    return NextResponse.json({ ok: true, data: results });
  } catch (err: any) {
    console.error('GET /api/irt error', err);
    return NextResponse.json({ ok: false, error: err.message || 'server error' }, { status: 500 });
  }
}
