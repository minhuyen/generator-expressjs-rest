import assert from 'assert';
import supertest from 'supertest';
import app from '../../app';
import User from '../users/users.model';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteOne({ email: 'minhuyendo@gmail.com' });
});

describe('GET /login', function() {
  it('should return 200', async function() {
    await api
      .post('/api/v1/auth/login')
      .send({ email: 'admin@gmail.com', password: 'admin@123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('GET /signup', function() {
  it('should return 201', async function() {
    await api
      .post('/api/v1/auth/signup')
      .send({
        email: 'minhuyendo@gmail.com',
        password: '123456',
        fullName: 'Uyen Do'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });
});
