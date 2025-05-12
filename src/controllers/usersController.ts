import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';

import { users } from '../models/user';

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', err => {
      reject(err);
    });
  });
};

export const getAllUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUserById = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid UUID' }));
  }

  const user = users.find(u => u.id === userId);

  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseBody(req);
    const { username, age, hobbies } = body;

    if (!username || typeof username !== 'string' ||
        typeof age !== 'number' ||
        !Array.isArray(hobbies) ||
        !hobbies.every(h => typeof h === 'string')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Invalid request body' }));
    }

    const newUser = {
      id: randomUUID(),
      username,
      age,
      hobbies
    };

    users.push(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid UUID' }));
  }

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  try {
    const body = await parseBody(req);
    const { username, age, hobbies } = body;

    if (!username || typeof username !== 'string' ||
        typeof age !== 'number' ||
        !Array.isArray(hobbies) ||
        !hobbies.every(h => typeof h === 'string')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Invalid request body' }));
    }

    const updatedUser = { id: userId, username, age, hobbies };
    users[userIndex] = updatedUser;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid UUID' }));
  }

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  users.splice(userIndex, 1);
  res.writeHead(204);
  res.end();
};
