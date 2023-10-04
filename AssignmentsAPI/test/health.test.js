const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../AssignmentsAPI/app');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Health Check API', () => {
  it('should return a 200 status code and expected headers for a successful health check', async () => {
    const res = await chai.request(app).get('/healthz');

    expect(res).to.have.status(200);
    expect(res).to.have.header('cache-control', 'no-cache, no-store, must-revalidate');
    expect(res).to.have.header('pragma', 'no-cache');
    expect(res).to.have.header('x-content-type-options', 'nosniff');
    expect(res.body).to.be.empty;
  });
});
