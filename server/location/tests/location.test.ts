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

describe('## Location APIs', () => {
  let location = {
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
        .get('/api/locations/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - address, city, country, postalCode are required', (done) => {
      request(app)
        .post('/api/locations')
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

  describe('# POST /api/locations', () => {
    it('should create a new location', (done) => {
      request(app)
        .post('/api/locations')
        .send(location)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(location.address);
          expect(res.body.address2).to.equal(location.address2);
          expect(res.body.city).to.equal(location.city);
          expect(res.body.country).to.equal(location.country);
          expect(res.body.latitude).to.equal(location.latitude);
          expect(res.body.longitude).to.equal(location.longitude);
          expect(res.body.postalCode).to.equal(location.postalCode);
          expect(res.body.state).to.equal(location.state);
          location = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/locations/:locationId', () => {
    it('should get location details', (done) => {
      request(app)
        .get(`/api/locations/${location._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(location.address);
          expect(res.body.address2).to.equal(location.address2);
          expect(res.body.city).to.equal(location.city);
          expect(res.body.country).to.equal(location.country);
          expect(res.body.latitude).to.equal(location.latitude);
          expect(res.body.longitude).to.equal(location.longitude);
          expect(res.body.postalCode).to.equal(location.postalCode);
          expect(res.body.state).to.equal(location.state);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when location does not exists', (done) => {
      request(app)
        .get('/api/locations/56c787ccc67fc16ccc1a5e92')
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

  describe('# PUT /api/locations/:locationId', () => {
    it('should update location details', (done) => {
      location.address2 = 'Address Updated';
      request(app)
        .put(`/api/locations/${location._id}`)
        .send(location)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.address).to.equal(location.address);
          expect(res.body.address2).to.equal(location.address2);
          expect(res.body.city).to.equal(location.city);
          expect(res.body.country).to.equal(location.country);
          expect(res.body.latitude).to.equal(location.latitude);
          expect(res.body.longitude).to.equal(location.longitude);
          expect(res.body.postalCode).to.equal(location.postalCode);
          expect(res.body.state).to.equal(location.state);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/locations/', () => {
    it('should get all locations', (done) => {
      request(app)
        .get('/api/locations')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all locations (with limit and skip)', (done) => {
      request(app)
        .get('/api/locations')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/locations/', () => {
    it('should delete location', (done) => {
      request(app)
        .delete(`/api/locations/${location._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
