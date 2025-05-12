import { AddressInfo } from 'net';
import http, { Server } from 'http';

let server: Server;
let baseUrl = '';

beforeAll(async () => {
  const { appHandler } = await import('../app');

  server = http.createServer(appHandler);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll((done) => {
  server.close(done);
});

describe('User API', () => {
  let createdUserId: string;

  it('should return empty user list initially', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('should create a new user', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'John', age: 30, hobbies: ['reading'] })
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data).toHaveProperty('id');
    createdUserId = data.id;
  });

  it('should get the created user by id', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.id).toBe(createdUserId);
  });

  it('should update the created user', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'John Updated', age: 31, hobbies: ['writing'] })
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.username).toBe('John Updated');
  });

  it('should delete the user', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`, { method: 'DELETE' });
    expect(res.status).toBe(204);
  });

  it('should return 404 for deleted user', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    expect(res.status).toBe(404);
  });
});
