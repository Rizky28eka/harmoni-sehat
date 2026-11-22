import http from 'http';
import app from './app';
import connectDB from './config/db';
import { PORT } from './config/env';
import { ensureRoles } from './utils/bootstrap';
import { initSocket } from './sockets';
import { startJobs } from './services/jobs';

const start = async () => {
  await connectDB();
  await ensureRoles();

  const server = http.createServer(app);
  initSocket(server);
  startJobs();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
