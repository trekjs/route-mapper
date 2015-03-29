import SingletonResource from '../src/SingletonResource';
import assert from 'assert';

describe('SingletonResource', () => {

  it('camelCase', () => {
    let r = new SingletonResource('person');
    r.name.should.be.equal('person');
    r.controller.should.be.equal('people');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(true);
    r.plural.should.be.equal('people');
    r.singular.should.be.equal('person');
    r.memberName.should.be.equal('person');
    r.collectionName.should.be.equal('person')
    r.resourceScope.should.be.eql({
      controller: 'people'
    });
    r.collectionScope.should.be.equal('person');
    r.memberScope.should.be.equal('person');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('personId');
    r.nestedScope.should.be.equal('person');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('person/change');
  });

  it('undercase', () => {
    let r = new SingletonResource('person', {}, false);
    r.name.should.be.equal('person');
    r.controller.should.be.equal('people');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(false);
    r.plural.should.be.equal('people');
    r.singular.should.be.equal('person');
    r.memberName.should.be.equal('person');
    r.collectionName.should.be.equal('person')
    r.resourceScope.should.be.eql({
      controller: 'people'
    });
    r.collectionScope.should.be.equal('person');
    r.memberScope.should.be.equal('person');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('person_id');
    r.nestedScope.should.be.equal('person');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('person/change');
  });

  it('as', () => {
    let r = new SingletonResource('person', { as: 'me' }, false);
    r.name.should.be.equal('me');
    r.path.should.be.equal('person');
    r.controller.should.be.equal('people');
    r.as.should.be.equal('me');
    r.param.should.be.equal('id');
    r.camelCase.should.be.equal(false);
    r.plural.should.be.equal('people');
    r.singular.should.be.equal('me');
    r.memberName.should.be.equal('me');
    r.collectionName.should.be.equal('me')
    r.resourceScope.should.be.eql({
      controller: 'people'
    });
    r.collectionScope.should.be.equal('person');
    r.memberScope.should.be.equal('person');
    r.shallowScope.should.be.equal(r.memberScope);
    r.nestedParam.should.be.equal('me_id');
    r.nestedScope.should.be.equal('person');
    r.isShallow.should.be.equal(false);
    r.newScope('change').should.be.equal('person/change');
  });
});
