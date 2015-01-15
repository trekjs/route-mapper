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
    it("root route", () => {
      m.root('welcome#index');
      //m.root({ to: 'welcome#index' });
    });
  });
});

describe('Mapper#get', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("get route", () => {
      m.get('products/:id', { to: 'catalog#view' });
    });
  });
});

describe('Mapper#get', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("named get route", () => {
      m.get('products/:id', { to: 'catalog#view', as: 'purchase' });
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route", () => {
      m.resources('products');
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route with options", () => {
      m.resources('products', () => {
       m.member(() => {
         m.get('short');
         m.post('toggle');
       });
 
       m.collection(() => {
         m.get('sold');
       });
      });
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route with sub-resources", () => {
      m.resources('products', () => {
       m.resources('comments', 'sales');
       m.resource('seller');
      });
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route with more complex sub-resources", () => {
      m.resources('products', () => {
       m.resources('comments')
       m.resources('sales', () => {
         m.get('recent', { on: 'collection' });
       });
      });
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route with concerns", () => {
     m.concern('toggleable', () => {
       m.post('toggle');
     });
     m.resources('posts', { concerns: 'toggleable' });
     m.resources('photos', { concerns: 'toggleable' });
    });
  });
});

describe('Mapper#resources', () => {
  let router = new RouteSet();
  router.draw((m) => {
    it("resources route with a namespace", () => {
      m.namespace('admin', () => {
        m.namespace('my', () => {
       // Directs /admin/products/* to Admin::ProductsController
       // (app/controllers/admin/products_controller.rb)
          m.resources('products');
        });
      });
    });
  });
});
