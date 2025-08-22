import request from 'supertest';
import express from 'express';
import sessionRouter from '../src/routes/sessionRoutes.js';
import { connect, closeDatabase, clearDatabase } from './setup.js';

const app = express();
app.use(express.json());
app.use('/sessions', sessionRouter);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Session API', () => {

  it('should create a session with valid signer', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ signer: { name: 'Piyush', email: 'piyush@gmail.com' } });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.session).toHaveProperty('_id');
    expect(res.body.session.signer.name).toBe('Piyush');
  });

  it('should fail if signer is missing', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({});
    
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0]).toMatch(/signer/);
  });

  it('should fail if duplicate emails in session', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({
        signer: { name: 'Piyush', email: 'piyush@gmail.com' },
        additionalSigners: [{ name: 'John', email: 'piyush@gmail.com' }]
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Duplicate emails found among participants');
  });

  it('should allow optional witnesses and observers', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({
        signer: { name: 'Piyush', email: 'piyush@gmail.com' },
        witnesses: [],
        observers: []
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.session.witnesses).toEqual([]);
    expect(res.body.session.observers).toEqual([]);
  });

  it('should get all sessions', async () => {
    // Create 2 sessions first
    await request(app).post('/sessions').send({ signer: { name: 'Piyush', email: 'piyush@gmail.com' } });
    await request(app).post('/sessions').send({ signer: { name: 'John', email: 'john@gmail.com' } });

    const res = await request(app).get('/sessions');
    expect(res.statusCode).toBe(200);
    expect(res.body.sessions.length).toBe(2);
    expect(res.body.sessions[0]).toHaveProperty('signer');
  });

  it('should delete a session by id', async () => {
    // Create session
    const createRes = await request(app)
      .post('/sessions')
      .send({ signer: { name: 'Piyush', email: 'piyush@gmail.com' } });
    
    const sessionId = createRes.body.session._id;

    const deleteRes = await request(app).delete(`/sessions/${sessionId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Session deleted successfully');

    // Check session no longer exists
    const getRes = await request(app).get('/sessions');
    expect(getRes.body.sessions.length).toBe(0);
  });

  it('should return 404 if deleting non-existing session', async () => {
    const res = await request(app).delete('/sessions/64c1f3b123456789abcdef01'); // random id
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Session not found');
  });

});
