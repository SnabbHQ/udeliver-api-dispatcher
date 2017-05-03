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

describe('## User APIs', () => {
  let user = {
    _id: '',
    email: 'k@snabb.io',
    firstName: 'Mr',
    lastName: 'Potato',
    mobileNumber: '+34661518132'
  };

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - email is required', (done) => {
      request(app)
        .post('/api/users')
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

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          user = res.body;
          done();
        })
        .catch(done);
    });

     it('should report a duplicate user error ', done => {
      request(app)
        .post('/api/users')
        .send(user)
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

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
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

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.email = 'k1@snabb.io';
      request(app)
        .put(`/api/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal('k1@snabb.io');
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/users')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
