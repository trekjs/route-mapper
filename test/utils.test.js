import utils from '../src/utils';
import assert from 'power-assert';

describe('Utils', () => {

  it('#splitTo()', () => {
    let ac = 'controller#action'
    let arr = utils.splitTo(ac);
    assert.deepEqual(['controller', 'action'], arr);

    ac = ''
    arr = utils.splitTo(ac);
    assert.deepEqual([], arr);
  });

  it('#normalizePath()', () => {
    let p = ''
    let np = utils.normalizePath(p);
    assert.equal('/', np);

    p = 'posts/:id'
    np = utils.normalizePath(p);
    assert.equal('/posts/:id', np);

    p = 'posts/%e8%94%ac%e8%8f%9c'
    np = utils.normalizePath(p);
    assert.equal('/posts/%E8%94%AC%E8%8F%9C', np);
  });

  it('#parseArgs()', function() {
    let a = utils.parseArgs();
    assert.deepEqual([], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal(undefined, a[2]);

    a = utils.parseArgs('posts');
    assert.deepEqual(['posts'], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal(undefined, a[2]);

    a = utils.parseArgs('posts', () => {});
    assert.deepEqual(['posts'], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal('function', typeof a[2]);

    a = utils.parseArgs('posts', {});
    assert.deepEqual(['posts'], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal(undefined, a[2]);

    a = utils.parseArgs({}, () => {});
    assert.deepEqual([], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal('function', typeof a[2]);

    a = utils.parseArgs({});
    assert.deepEqual([], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal(undefined, a[2]);

    a = utils.parseArgs(() => {});
    assert.deepEqual([], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal('function', typeof a[2]);

    a = utils.parseArgs('posts', 'tags', {}, () => {});
    assert.deepEqual(['posts', 'tags'], a[0]);
    assert.deepEqual({}, a[1]);
    assert.equal('function', typeof a[2]);
  });

});
