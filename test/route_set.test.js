import RouteSet from '../src/route_set';
import Mapper from '../src/mapper';
import assert from 'assert';

describe('RouteSet#draw', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("should be Mapper's instance", () => {
      assert.equal(true, m instanceof Mapper);
    });
  });
});


describe('Mapper#resourcesPathNames', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("should be return resourcesPathNames", () => {
      let options = { 'new': 'new', 'edit': 'edit' };
      options.edit.should.equal(m.resourcesPathNames().edit);
      options['new'].should.equal(m.resourcesPathNames()['new']);
    });
  });
});

describe('Mapper#root', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("should be root", () => {
      //m.root('photos');
      //m.scope("/", () => {
      //  m.get("/", { to: 'pages#index' });
      //});
    });
  });
});

describe('Mapper#scope', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("should be scope", () => {
      //m.scope('/api', { as: 'api' }, () => {
      //  m.scope('/v1', { as: 'v1' }, () => {
      //    //m.resources('images')
      //  });
      //});
    });
  });
});

describe('Mapper#resources', function () {
  let router = new RouteSet();
  router.draw((m) => {
    it("should be resources", () => {
      //m.resources('photos', { only: ['index', 'show'] });
      //m.resources('comments', { except: ['destroy'] });
      //m.resources('users', () => {
      //  m.resources('posts', () => {
      //    m.resources('images');
      //  });
      //});


      //m.scope({ shallow: true, path:'store', as: 'sekret' }, () => {
      //  m.resources('books', () => {
      //    m.resources('dirs', () => {
      //      m.resources('pages', () => {});
      //    });
      //  });
      //});

      m.scope({ shallow: true, shallow_path: 'store', shallow_prefix: 'sekret' }, function () {
        m.resources('books', function () {
          m.resources('dirs', function () {
            m.resources('pages', function () {
              m.resources('notes');
            });
          });
        });
      });

    });
  });
});
