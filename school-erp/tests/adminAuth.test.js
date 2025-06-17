const request = require('supertest');
const { app } = require('../src/app');
const mongoose = require('mongoose');
const config = require('../src/config/config');
const { AdminModel } = require('../src/models/admin.model');

describe('Admin Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await AdminModel.deleteMany({});
    await AdminModel.create({
      name: 'Test Admin',
      email: 'test@schoolerp.com',
      password: 'Test123!',
      role: 'admin',
      schoolId: new mongoose.Types.ObjectId(),
    });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/v1/admin/login')
      .send({ email: 'test@schoolerp.com', password: 'Test123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.code).toBe(200);
    expect(res.body.data.tokens).toHaveProperty('access.token');
  });
});