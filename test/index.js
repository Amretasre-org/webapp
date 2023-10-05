process.env.NODE_ENV = "test"

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

const credentials = Buffer.from('john.doe@example.com:abc123').toString('base64');

describe('GET /healthz', () => {
    it('Should check status 400 when there is no headers', async () => {
        const response = await chai
            .request(app)
            .get('/healthz')
        expect(response).to.have.status(400);
    });

    it('Should check if the connection is established', async () => {
        const response = await chai
            .request(app)
            .get('/healthz')
            .set('Cache-Control', 'no-cache')
        expect(response).to.have.status(200);
    });
});

describe('Other methods for /healthz', () => {
    it('Should check status 405 for POST call', async () => {
        const response = await chai
            .request(app)
            .post('/healthz')
        expect(response).to.have.status(405);
    });

    it('Should check status 405 for PATCH calls', async () => {
        const response = await chai
            .request(app)
            .patch('/healthz')
        expect(response).to.have.status(405);
    });

    it('Should check status 405 for PUT calls', async () => {
        const response = await chai
            .request(app)
            .put('/healthz')
        expect(response).to.have.status(405);

    });

    it('Should check status 405 for DELETE calls', async () => {
        const response = await chai
            .request(app)
            .delete('/healthz')
        expect(response).to.have.status(405);
    });
});
