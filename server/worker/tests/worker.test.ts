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

describe('## Worker APIs', () => {
  let worker = {
    _id: '',
    email: 'k@snabb.io',
    firstName: 'Mr',
    lastName: 'Potato',
    mobileNumber: '+34661518132'
  };

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/workers/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - email is required', (done) => {
      request(app)
        .post('/api/workers')
        .send({
          mobileNumber: '1234567890'
        })
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          expect(res.body.message).to.equal('"email" is required');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/workers', () => {
    it('should create a new worker', (done) => {
      request(app)
        .post('/api/workers')
        .send(worker)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(worker.email);
          expect(res.body.firstName).to.equal(worker.firstName);
          expect(res.body.lastName).to.equal(worker.lastName);
          expect(res.body.mobileNumber).to.equal(worker.mobileNumber);
          worker = res.body;
          done();
        })
        .catch(done);
    });

     it('should report a duplicate worker error ', done => {
      request(app)
        .post('/api/workers')
        .send(worker)
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

  describe('# GET /api/workers/:workerId', () => {
    it('should get worker details', (done) => {
      request(app)
        .get(`/api/workers/${worker._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(worker.email);
          expect(res.body.firstName).to.equal(worker.firstName);
          expect(res.body.lastName).to.equal(worker.lastName);
          expect(res.body.mobileNumber).to.equal(worker.mobileNumber);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when worker does not exists', (done) => {
      request(app)
        .get('/api/workers/56c787ccc67fc16ccc1a5e92')
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

  describe('# PUT /api/workers/:workerId', () => {
    it('should update worker details', (done) => {
      worker.email = 'k1@snabb.io';
      request(app)
        .put(`/api/workers/${worker._id}`)
        .send(worker)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('k1@snabb.io');
          expect(res.body.firstName).to.equal(worker.firstName);
          expect(res.body.lastName).to.equal(worker.lastName);
          expect(res.body.mobileNumber).to.equal(worker.mobileNumber);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/workers/', () => {
    it('should get all workers', (done) => {
      request(app)
        .get('/api/workers')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all workers (with limit and skip)', (done) => {
      request(app)
        .get('/api/workers')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/workers/', () => {
    it('should delete worker', (done) => {
      request(app)
        .delete(`/api/workers/${worker._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
