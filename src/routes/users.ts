import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById } from '../controllers/usersController.ts';
import { parse } from 'url';

export const handleUsers = (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  const userId = parsedUrl.pathname?.split('/')[3];
  const method = req.method;

  if (parsedUrl.pathname === '/api/users' && method === 'GET') {
    return getAllUsers(req, res);
  }

  if (parsedUrl.pathname?.startsWith('/api/users/') && method === 'GET') {
    return getUserById(req, res, userId!);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
};
