import request from 'supertest';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = require('../src/secure-server').app;

describe('Register Endpoint', () => {
  let server: https.Server;
  let port: number;

  beforeAll((done) => {
    const options = {
      key: fs.readFileSync(path.join(__dirname, '../ssl/privatekey.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../ssl/certificate.pem')),
    };

    server = https.createServer(options, app);
    server.listen(0, () => {
      port = (server.address() as any).port;
      done();
    });

    // Ignore self-signed certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  });


 

  it('should register a new user successfully', async () => {
    const response = await request(server)
      .post('/api/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'TestPassword1!',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });
});
