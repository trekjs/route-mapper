import assert from 'power-assert';
import routeMapper from './RouteMapper.test';

describe('Router#helpers', () => {

  it('should return an empty object', () => {
    assert(routeMapper.helers !== null);
  });

  it('should create a path by params', () => {
    assert('/photos/233/books/377/users' === routeMapper.helpers.google_book_users(233, 377));
  });

});
