import assert from 'assert';
import supertest from 'supertest';
import app from '../../app';

const api = supertest(app);

describe('Basic Mocha String Test', function() {
  it('should return number of charachters in a string', function() {
    assert.equal('Hello'.length, 5);
  });
  it('should return first charachter of the string', function() {
    assert.equal('Hello'.charAt(0), 'H');
  });
});