import http from 'http';
import { appHandler } from './app.ts';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const server = http.createServer(appHandler);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Running in:', process.env.NODE_ENV);
});
