import http from 'http';
import { appHandler } from './app';

const PORT = process.env.PORT || 3000;

export const server = http.createServer(appHandler);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Running in:', process.env.NODE_ENV);
});
