// Minimal devResults stub used for local/dev environments.
// Provides a lightweight in-memory implementation so production builds
// referencing `@/lib/devResults` succeed when the full dev helper is absent.

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
