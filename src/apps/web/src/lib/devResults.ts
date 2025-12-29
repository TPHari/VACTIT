// Minimal devResults stub used for local/dev environments.
// This file intentionally provides a lightweight in-memory implementation
// so server builds (Vercel) that reference `@/lib/devResults` succeed.

type DevRecord = {
  id?: string;
  thetas?: any;
  items?: any;
  meta?: any;
};

const store: DevRecord[] = [];

export const devResults = {
  create: async (rec: DevRecord) => {
    const id = `dev-${store.length + 1}`;
    const saved = { id, ...rec };
    store.push(saved);
    return saved;
  },
  findMany: async () => {
    return store.slice().reverse();
  },
};

export default devResults;
