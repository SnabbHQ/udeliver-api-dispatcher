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

describe('## Websockets APIs', () => {
  let team = {
    _id: '',
    description: 'Boring description',
    name: 'Team Banana',
  };

  // TODO - We need to mock pusher. Until now lets turn it off.
  // describe('# POST /api/websockets/auth', () => {
  //   it('should authenticate a socket ', done => {
  //     request(app)
  //       .post('/api/websockets/auth')
  //       .send(team)
  //       .expect(httpStatus.OK)
  //       .then(res => {
  //         expect(res.body.description).to.equal(team.description);
  //         expect(res.body.name).to.equal(team.name);
  //         team = res.body;
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  describe('# POST /api/onduty', () => {
    const body = {
      time_ms: 1234,
      events: [
        {
          'name': 'channel_occupied',
          'channel': 'private-1234'
        }
      ]
    };

    it('Should register onDuty information locally and dispatch new event', done => {
      request(app)
        .post(`/api/websockets/onduty`)
        .send(body)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.timeMs).to.equal(body.time_ms);
          expect(res.body.events).to.deep.equal(body.events);
          done();
        })
        .catch(done);
    });
  });
});
