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

describe('## Contact APIs', () => {
  let contact = {
    _id: '',
    companyName: 'Mr Potato Associates',
    email: 'k@snabb.io',
    firstName: 'Mr',
    lastName: 'Potato',
    mobileNumber: '+34661518132',
  };

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/contacts/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    // TODO - Fix invalid phone number processing
    // it('should handle express validation error - wrong mobile number', (done) => {
    //   request(app)
    //     .post('/api/contacts')
    //     .send({
    //       mobileNumber: '123'
    //     })
    //     .expect(httpStatus.UNPROCESSABLE_ENTITY)
    //     .then((res) => {
    //       expect(res.body.message).to.equal('"email" is required');
    //       done();
    //     })
    //     .catch(done);
    // });
  });

  describe('# POST /api/contacts', () => {
    it('should create a new contact', (done) => {
      request(app)
        .post('/api/contacts')
        .send(contact)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.companyName).to.equal(contact.companyName);
          expect(res.body.email).to.equal(contact.email);
          expect(res.body.firstName).to.equal(contact.firstName);
          expect(res.body.lastName).to.equal(contact.lastName);
          expect(res.body.mobileNumber).to.equal(contact.mobileNumber);
          contact = res.body;
          done();
        })
        .catch(done);
    });

     it('should report a duplicate contact error ', done => {
      request(app)
        .post('/api/contacts')
        .send(contact)
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

  describe('# GET /api/contacts/:contactId', () => {
    it('should get contact details', (done) => {
      request(app)
        .get(`/api/contacts/${contact._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.companyName).to.equal(contact.companyName);
          expect(res.body.email).to.equal(contact.email);
          expect(res.body.firstName).to.equal(contact.firstName);
          expect(res.body.lastName).to.equal(contact.lastName);
          expect(res.body.mobileNumber).to.equal(contact.mobileNumber);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when contact does not exists', (done) => {
      request(app)
        .get('/api/contacts/56c787ccc67fc16ccc1a5e92')
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

  describe('# PUT /api/contacts/:contactId', () => {
    it('should update contact details', (done) => {
      contact.email = 'k1@snabb.io';
      request(app)
        .put(`/api/contacts/${contact._id}`)
        .send(contact)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.companyName).to.equal(contact.companyName);
          expect(res.body.email).to.equal('k1@snabb.io');
          expect(res.body.firstName).to.equal(contact.firstName);
          expect(res.body.lastName).to.equal(contact.lastName);
          expect(res.body.mobileNumber).to.equal(contact.mobileNumber);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/contacts/', () => {
    it('should get all contacts', (done) => {
      request(app)
        .get('/api/contacts')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all contacts (with limit and skip)', (done) => {
      request(app)
        .get('/api/contacts')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/contacts/', () => {
    it('should delete contact', (done) => {
      request(app)
        .delete(`/api/contacts/${contact._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
