import Http from '../src/Http';
import assert from 'power-assert';

describe('Http', () => {

  const http = new Http();

  it('should start with $', () => {
    assert(http.get.name === '$get');
  });
});