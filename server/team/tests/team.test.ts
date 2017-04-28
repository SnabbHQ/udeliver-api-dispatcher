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

describe('## Team APIs', () => {
  let team = {
    _id: '',
    description: 'Boring description',
    name: 'Team Banana',
  };

  describe('# POST /api/teams', () => {
    it('should create a new team', done => {
      request(app)
        .post('/api/teams')
        .send(team)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.description).to.equal(team.description);
          expect(res.body.name).to.equal(team.name);
          team = res.body;
          done();
        })
        .catch(done);
    });

    it('should report a duplicate team error ', done => {
      request(app)
        .post('/api/teams')
        .send(team)
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

  describe('# GET /api/teams/:teamId', () => {
    it('should get team details', done => {
      request(app)
        .get(`/api/teams/${team._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.description).to.equal(team.description);
          expect(res.body.name).to.equal(team.name);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when team does not exists', done => {
      request(app)
        .get('/api/teams/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.code).to.exist;
          expect(res.body.key).to.exist;
          expect(res.body.message).to.exist;
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/teams/:teamId', () => {
    it('should update team details', done => {
      team.description = 'Exciting description!';
      team.name = 'Power Rangers';
      request(app)
        .put(`/api/teams/${team._id}`)
        .send(team)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.description).to.equal('Exciting description!');
          expect(res.body.name).to.equal('Power Rangers');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/teams/', () => {
    it('should get all teams', done => {
      request(app)
        .get('/api/teams')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all teams (with limit and skip)', done => {
      request(app)
        .get('/api/teams')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/teams/', () => {
    it('should delete team', done => {
      request(app)
        .delete(`/api/teams/${team._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });
});
