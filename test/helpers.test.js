import assert from 'power-assert';
import routeMapper from './RouteMapper.test';

describe('Router#helpers', () => {

  it('should not an empty object', () => {
    assert(routeMapper.helers !== null);
  });

  it('should create a path by params', () => {
    assert('/photos/233/books/377/users' === routeMapper.helpers.google_book_users(233, 377));
  });
  
  it('should stringify a single trailing param into a query string', () => {
    const qs = [ { admin: 0, francis: 'bacon' }, { not: 'included' } ];
    const expected = '/photos/233/books/377/users?admin=0&francis=bacon';
    const actual = routeMapper.helpers.google_book_users(233, 377, ...qs);
    assert(expected === actual);
  });  
  
  it('should stringify a sole param into a query string for a path without params', () => {
    const qs = [ { next: 'foobar' }, { not: 'included' } ];
    const expected = '/user?next=foobar';
    const actual = routeMapper.helpers.user(...qs);
    assert(expected === actual);
  });
});
