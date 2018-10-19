// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
// let User = require('app/users/user.model');
let User = require('../app/users/user.model');
var config = require('../config/index');

// Require the dev dependencies 
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app')
let should = chai.should();
let base_url = '/api/v1'

chai.use(chaiHttp);

// before(function(done) {
//     mockgoose.prepareStorage().then(function() {
//         mongoose.createConnection('mongodb://mongo:27017/spotz-backend-test', function(err) {
//             done(err);
//         });
//     });
// });

describe('Auth', function() {
  before(function(done) {
    User.remove({ email: 'robin111@local.com' }, function(err) {
      done();
    });
  });

  // Test Signup
  describe('/POST /auth/signup', function() {
    it('it should register user by email ', function(done) {
      let user = {
        first_name: 'robin',
        last_name: 'hood',
        // full_name: 'test test',
        email: 'robin111@local.com',
        password: 'robin@test',
      }
      chai.request(server)
        .post(base_url + '/auth/signup')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Created User Successfully!');
          res.body.should.have.property('token');
          done();
        });
    });
  })
})