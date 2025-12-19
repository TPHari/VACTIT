import { NextRequest, NextResponse } from 'next/server';
import { devResults } from '@/lib/devResults';
import { spawnSync } from 'child_process';

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
    // Expect body.responses: array of arrays (N x J) numeric 0/1
    if (!body || !body.responses) return NextResponse.json({ ok: false, error: 'missing responses' }, { status: 400 });

    // Call R script via Rscript (must be installed on host)
    const input = JSON.stringify({ responses: body.responses, names: body.names ?? null });
    const path = require('path');
    const scriptPath = path.resolve(process.cwd(), '..', '..', '..', 'scripts', 'irt_run.R');

    const rscriptCmd = findRscript();
    if (!rscriptCmd) {
      const msg = 'Rscript executable not found. Install R and ensure Rscript is on PATH, or set the environment variable R_SCRIPT_PATH to the full path to Rscript.';
      console.error(msg);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    console.log('Invoking Rscript:', rscriptCmd, 'script:', scriptPath);
    const proc = spawnSync(rscriptCmd, [scriptPath], { input, encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });

    if (proc.error) {
      console.error('Rscript spawn error', proc.error);
      return NextResponse.json({ ok: false, error: proc.error.message }, { status: 500 });
    }
    if (proc.status !== 0) {
      console.error('Rscript failed. stdout:', proc.stdout);
      console.error('Rscript failed. stderr:', proc.stderr);
      const errMsg = proc.stderr && proc.stderr.length > 0 ? proc.stderr : (proc.stdout && proc.stdout.length > 0 ? proc.stdout : 'Rscript failed');
      return NextResponse.json({ ok: false, error: 'Rscript failed', stdout: proc.stdout, stderr: proc.stderr }, { status: 500 });
    }

    let out: any = null;
    try {
      out = JSON.parse(proc.stdout);
    } catch (e) {
      console.error('parse R output', e, proc.stdout);
      return NextResponse.json({ ok: false, error: 'failed to parse R output' }, { status: 500 });
    }

    // store result in devResults for inspection (flatten items)
    const itemsFlat = [] as any[];
    if (out.items) {
      if (out.items.vi) itemsFlat.push({ section: 'vi', items: out.items.vi });
      if (out.items.en) itemsFlat.push({ section: 'en', items: out.items.en });
      if (out.items.math) itemsFlat.push({ section: 'math', items: out.items.math });
      if (out.items.sci) itemsFlat.push({ section: 'sci', items: out.items.sci });
    }
    const saved = await devResults.create({ thetas: null, items: itemsFlat, meta: { source: 'R', raw: out } });
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
