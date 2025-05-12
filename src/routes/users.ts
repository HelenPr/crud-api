import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usersController.ts';
import { parse } from 'url';

export const handleUsers = (req: IncomingMessage, res: ServerResponse) => {
  const urlParts = req.url?.split('/') || [];
  const method = req.method;
  const userId = urlParts[3];

  if (urlParts[1] === 'api' && urlParts[2] === 'users') {
    if (method === 'GET' && !userId) return getAllUsers(req, res);
    if (method === 'GET' && userId) return getUserById(req, res, userId);
    if (method === 'POST' && !userId) return createUser(req, res);
    if (method === 'PUT' && userId) return updateUser(req, res, userId);
    if (method === 'DELETE' && userId) return deleteUser(req, res, userId);
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
};
