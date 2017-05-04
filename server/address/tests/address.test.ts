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

describe('## Address APIs', () => {
  let address = {
    _id: '',
    address: 'Av/Whatever 1',
    address2: 'Apartment 2',
    city: 'Valencia',
    country: 'Spain',
    latitude: 0.01,
    longitude: -0.02,
    postalCode: '46004',
    state: 'Valencia',
  };

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/addresses/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - address, city, country, postalCode are required', (done) => {
      request(app)
        .post('/api/addresses')
        .send({
          mobileNumber: '1234567890'
        })
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then((res) => {
          expect(res.body.message).to.equal('\"address\" is required and \"city\" is required and \"country\" is required and \"postalCode\" is required');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/addresses', () => {
    it('should create a new address', (done) => {
      request(app)
        .post('/api/addresses')
        .send(address)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(address.address);
          expect(res.body.address2).to.equal(address.address2);
          expect(res.body.city).to.equal(address.city);
          expect(res.body.country).to.equal(address.country);
          expect(res.body.latitude).to.equal(address.latitude);
          expect(res.body.longitude).to.equal(address.longitude);
          expect(res.body.postalCode).to.equal(address.postalCode);
          expect(res.body.state).to.equal(address.state);
          address = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/addresses/:addressId', () => {
    it('should get address details', (done) => {
      request(app)
        .get(`/api/addresses/${address._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(address.address);
          expect(res.body.address2).to.equal(address.address2);
          expect(res.body.city).to.equal(address.city);
          expect(res.body.country).to.equal(address.country);
          expect(res.body.latitude).to.equal(address.latitude);
          expect(res.body.longitude).to.equal(address.longitude);
          expect(res.body.postalCode).to.equal(address.postalCode);
          expect(res.body.state).to.equal(address.state);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when address does not exists', (done) => {
      request(app)
        .get('/api/addresses/56c787ccc67fc16ccc1a5e92')
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

  describe('# PUT /api/addresses/:addressId', () => {
    it('should update address details', (done) => {
      address.address2 = 'Address Updated';
      request(app)
        .put(`/api/addresses/${address._id}`)
        .send(address)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(address.address);
          expect(res.body.address2).to.equal(address.address2);
          expect(res.body.city).to.equal(address.city);
          expect(res.body.country).to.equal(address.country);
          expect(res.body.latitude).to.equal(address.latitude);
          expect(res.body.longitude).to.equal(address.longitude);
          expect(res.body.postalCode).to.equal(address.postalCode);
          expect(res.body.state).to.equal(address.state);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/addresses/', () => {
    it('should get all addresses', (done) => {
      request(app)
        .get('/api/addresses')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all addresses (with limit and skip)', (done) => {
      request(app)
        .get('/api/addresses')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/addresses/', () => {
    it('should delete address', (done) => {
      request(app)
        .delete(`/api/addresses/${address._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
