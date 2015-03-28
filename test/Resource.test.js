import Resource from '../src/Resource';
import assert from 'assert';

describe('Resource', () => {

  it('camelCase', () => {
    let r = new Resource('books');
    r.name.should.be.equal('books');
    r.controller.should.be.equal('books');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(true);
    r.plural.should.be.equal('books');
    r.singular.should.be.equal('book');
    r.memberName.should.be.equal('book');
    r.collectionName.should.be.equal('books')
    r.resourceScope.should.be.eql({
      controller: 'books'
    });
    r.collectionScope.should.be.equal('books');
    r.memberScope.should.be.equal('books/:id');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('bookId');
    r.nestedScope.should.be.equal('books/:bookId');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('books/change');
  });

  it('undercase', () => {
    let r = new Resource('books', {}, false);
    r.name.should.be.equal('books');
    r.controller.should.be.equal('books');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(false);
    r.plural.should.be.equal('books');
    r.singular.should.be.equal('book');
    r.memberName.should.be.equal('book');
    r.collectionName.should.be.equal('books')
    r.resourceScope.should.be.eql({
      controller: 'books'
    });
    r.collectionScope.should.be.equal('books');
    r.memberScope.should.be.equal('books/:id');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('book_id');
    r.nestedScope.should.be.equal('books/:book_id');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('books/change');
  });

  it('as', () => {
    let r = new Resource('books', { as: 'iBooks' }, false);
    r.name.should.be.equal('iBooks');
    r.path.should.be.equal('books');
    r.controller.should.be.equal('books');
    r.as.should.be.equal('iBooks');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(false);
    r.plural.should.be.equal('iBooks');
    r.singular.should.be.equal('iBook');
    r.memberName.should.be.equal('iBook');
    r.collectionName.should.be.equal('iBooks')
    r.resourceScope.should.be.eql({
      controller: 'books'
    });
    r.collectionScope.should.be.equal('books');
    r.memberScope.should.be.equal('books/:id');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('iBook_id');
    r.nestedScope.should.be.equal('books/:iBook_id');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('books/change');
  });
});
