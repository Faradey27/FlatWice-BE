import request from 'supertest';
import App from './../../src/App';
const app = new App();

describe('List of short tests that cover key product features', () => {
  it('should response with 404 on / endpoint', async () => {
    const response = await request(app.express).get('/');

    expect(response.error.toString()).toContain('404');
  });
});
