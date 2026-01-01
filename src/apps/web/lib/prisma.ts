declare global {
  // eslint-disable-next-line no-var
  var __prisma_client__: any;
}

type PrismaClientType = import('@prisma/client').PrismaClient;

export async function getPrisma(): Promise<PrismaClientType> {
  if (global.__prisma_client__) return global.__prisma_client__;

  // Load @prisma/client at runtime using a non-transformable require
  // (eval) so Turbopack/Next won't bundle an edge/browser build.
  let PrismaClientCtor: { new (opts?: any): PrismaClientType } | null = null;
  try {
    const req: any = eval('require');
    try {
      const rootClientPath = req('path').resolve(process.cwd(), '..', '..', '..', 'node_modules', '@prisma', 'client');
      const mod = req(rootClientPath);
      PrismaClientCtor = mod?.PrismaClient;
    } catch (rootErr) {
      const mod = req('@prisma/client');
      PrismaClientCtor = mod?.PrismaClient;
    }
  } catch (e1) {
    try {
      const mod = await import('@prisma/client');
      PrismaClientCtor = (mod as any)?.PrismaClient;
    } catch (e2) {
      console.error('Failed to load @prisma/client via require or import', e1, e2);
      throw e2 ?? e1;
    }
  }

  if (!PrismaClientCtor) {
    throw new Error('Could not obtain PrismaClient constructor from @prisma/client');
  }

  let client: PrismaClientType;
  try {
    client = new PrismaClientCtor({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (err: any) {
    console.error('Error instantiating PrismaClient. Ensure `npx prisma generate` ran and node_modules/.prisma/client is accessible', err?.message ?? err);
    throw err;
  }

  if (process.env.NODE_ENV !== 'production') global.__prisma_client__ = client;

  return client;
}