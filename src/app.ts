import { IncomingMessage, ServerResponse } from 'http';

import { handleUsers } from './routes/users.ts';

export const appHandler = (req: IncomingMessage, res: ServerResponse) => {
  const { url = '', method } = req;

  if (url.startsWith('/api/users')) {
    return handleUsers(req, res);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
};
