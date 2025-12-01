import server from './server';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 API server running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
