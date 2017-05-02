import * as chai from 'chai';
import * as httpStatus from 'http-status';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { app } from '../../app';

const expect = chai.expect;
chai.config.includeStack = true;

/**
 * root level hooks
 */
after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  (mongoose as any).models = {};
  (mongoose as any).modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Organization APIs', () => {
  let organization = {
    _id: '',
    email: 'k@snabb.io',
    name: 'Snabb',
  };

  describe('# POST /api/organizations', () => {
    it('should create a new organization', (done) => {
      request(app)
        .post('/api/organizations')
        .send(organization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(organization.email);
          expect(res.body.name).to.equal(organization.name);
          organization = res.body;
          done();
        })
        .catch(done);
    });

    it('should report a duplicate team error ', done => {
      request(app)
        .post('/api/organizations')
        .send(organization)
        .expect(httpStatus.CONFLICT)
        .then(res => {
          expect(res.body.code).to.exist;
          expect(res.body.key).to.exist;
          expect(res.body.message).to.exist;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/organizations/:organizationId', () => {
    it('should get organization details', (done) => {
      request(app)
        .get(`/api/organizations/${organization._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(organization.email);
          expect(res.body.name).to.equal(organization.name);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when organization does not exists', (done) => {
      request(app)
        .get('/api/organizations/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.exist;
          expect(res.body.key).to.exist;
          expect(res.body.message).to.exist;
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/organizations/:organizationId', () => {
    it('should update organization details', (done) => {
      organization.email = 'k1@snabb.io';

      request(app)
        .put(`/api/organizations/${organization._id}`)
        .send(organization)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('k1@snabb.io');
          expect(res.body.name).to.equal(organization.name);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/organizations/', () => {
    it('should get all organizations', (done) => {
      request(app)
        .get('/api/organizations')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all organizations (with limit and skip)', (done) => {
      request(app)
        .get('/api/organizations')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/organizations/', () => {
    it('should delete organization', (done) => {
      request(app)
        .delete(`/api/organizations/${organization._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
