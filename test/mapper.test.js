import RouteMapper from '../src/route_mapper';
import Mapper from '../src/mapper';
import assert from 'assert';

describe('Mapper#constructor', () => {
  let set = new RouteMapper();
  let m = new Mapper(set);
  it("should be return Mapper's instance", () => {
    assert.equal(true, m instanceof Mapper);
  });
});

describe('Mapper#urlHelpers', () => {
  let set = new RouteMapper();
  let m = new Mapper(set);
  m.resource('post', { as: '' });

  m.scope('post', { as: 'post' }, () => {
    m.resource('comment', { as: '' });
  })

  let urlHelpers = set.urlHelpers;
  let paths = ['new_path', 'edit_path', 'post_path', 'new_post_path', 'edit_post_path' ]
  it("resource where as is empty", () => {
    Object.keys(set.urlHelpers).should.eql(paths);
    urlHelpers.new_path().should.equal('/post/new');
    urlHelpers.new_post_path().should.equal('/post/comment/new');
  });
});

describe('Mapper#urlHelpers', () => {
  let set = new RouteMapper();
  let m = new Mapper(set);
  m.resources('posts', { as: '' });

  m.scope('posts', { as: 'posts' }, () => {
    m.resource('comments', { as: '' });
  })

  let urlHelpers = set.urlHelpers;
  let paths = ['_index_path', 'new_path', 'edit_path', 'posts_path', 'new_posts_path', 'edit_posts_path' ];
  it("resources where as is empty", () => {
    Object.keys(set.urlHelpers).should.eql(paths);
    urlHelpers.new_path().should.equal('/posts/new');
    urlHelpers.new_posts_path().should.equal('/posts/comments/new');
  });
});


describe('Mapper#urlHelpers', () => {
  let set = new RouteMapper();
  let m = new Mapper(set);

  m.scope('post', { as: '' }, () => {
    m.resource('user');
    m.resources('comments');
  })

  let urlHelpers = set.urlHelpers;
  let paths = ['_index_path', 'new_path', 'edit_path', 'posts_path', 'new_posts_path', 'edit_posts_path' ];
  let paths = [
    'user_path', 'new_user_path', 'edit_user_path',
    'comments_path', 'new_comment_path', 'edit_comment_path', 'comment_path'
  ];
  it("scope where as is empty", () => {
    Object.keys(urlHelpers).should.eql(paths);
    urlHelpers.new_user_path().should.equal('/post/user/new');
    urlHelpers.new_comment_path().should.equal('/post/comments/new');
  });
});
