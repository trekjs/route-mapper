import RouteMapper from '../src/route_mapper';
import Mapper from '../src/mapper';
import assert from 'assert';

describe('RouteMapper#draw', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    it("should be Mapper's instance", () => {
      assert.equal(true, m instanceof Mapper);
    });
  });
});

describe('Mapper#resourcesPathNames', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    it("should be return resourcesPathNames", () => {
      let options = { 'new': 'new', 'edit': 'edit' };
      options.edit.should.equal(m.resourcesPathNames().edit);
      options['new'].should.equal(m.resourcesPathNames()['new']);
    });
  });
});

describe('Mapper#root', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.root('welcome#index');
  });
  it("root", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(1);
    routes[0].path.should.equal('/');
    routes[0].name.should.equal('root');
    pathHelpers.root_path().should.equal('/');
  });
});

describe('Mapper#get', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.get('products/:id', { to: 'catalog#view' });
  });
  it("get", () => {
    let routes = routeMapper.routes;
    routes.length.should.equal(1);
    routes[0].path.should.equal('/products/:id');
    routes[0].controller.should.equal('catalog');
    routes[0].action.should.equal('view');
  });
});

describe('Mapper#get', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.get('products/:id/purchase', { to: 'catalog#view', as: 'purchase' });
  });
  it("named route that can be invoked with purchase_path(id: product.id)", () => {
    routeMapper.routes.length.should.equal(1);
    routeMapper.routes[0].path.should.equal('/products/:id/purchase');
    routeMapper.routes[0].controller.should.equal('catalog');
    routeMapper.routes[0].action.should.equal('view');
    routeMapper.routes[0].name.should.equal('purchase');
    routeMapper.pathHelpers.purchase_path(233).should.equal('/products/233/purchase');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.resources('products');
  });
  it("resource route (maps HTTP verbs to controller actions automatically)", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(8);
    Object.keys(pathHelpers).length.should.equal(4);
    let helpers = ['products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.products_path().should.equal('/products');
    pathHelpers.new_product_path().should.equal('/products/new');
    pathHelpers.edit_product_path(233).should.equal('/products/233/edit');
    pathHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
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
  it("resource route with options", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(11);
    Object.keys(pathHelpers).length.should.equal(7);
    let helpers = ['short_product', 'toggle_product', 'sold_products', 'products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.short_product_path(233).should.equal('/products/233/short');
    pathHelpers.toggle_product_path(233).should.equal('/products/233/toggle');
    pathHelpers.sold_products_path().should.equal('/products/sold');
    pathHelpers.products_path().should.equal('/products');
    pathHelpers.new_product_path().should.equal('/products/new');
    pathHelpers.edit_product_path(233).should.equal('/products/233/edit');
    pathHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.resources('products', () => {
      m.resources('comments', 'sales')
        .resource('seller');
    });
  });
  it("resource route with sub-resources", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(31);
    Object.keys(pathHelpers).length.should.equal(15);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'product_seller', 'new_product_seller', 'edit_product_seller',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.product_comments_path(233).should.equal('/products/233/comments');
    pathHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    pathHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    pathHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    pathHelpers.product_sales_path(233).should.equal('/products/233/sales');
    pathHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    pathHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    pathHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    pathHelpers.product_seller_path(233).should.equal('/products/233/seller');
    pathHelpers.new_product_seller_path(233).should.equal('/products/233/seller/new');
    pathHelpers.edit_product_seller_path(233).should.equal('/products/233/seller/edit');

    pathHelpers.products_path().should.equal('/products');
    pathHelpers.new_product_path().should.equal('/products/new');
    pathHelpers.edit_product_path(233).should.equal('/products/233/edit');
    pathHelpers.product_path(233).should.equal('/products/233');
  });
});


describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.resources('products', () => {
      m.resources('comments')
        .resources('sales', () => {
          m.get('recent', { on: 'collection' });
        });
    });
  });
  it("resource route with more complex sub-resources", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(25);
    Object.keys(pathHelpers).length.should.equal(13);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'recent_product_sales', 'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.product_comments_path(233).should.equal('/products/233/comments');
    pathHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    pathHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    pathHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    pathHelpers.recent_product_sales_path(233).should.equal('/products/233/sales/recent');
    pathHelpers.product_sales_path(233).should.equal('/products/233/sales');
    pathHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    pathHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    pathHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    pathHelpers.products_path().should.equal('/products');
    pathHelpers.new_product_path().should.equal('/products/new');
    pathHelpers.edit_product_path(233).should.equal('/products/233/edit');
    pathHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.concern('toggleable', () => {
      m.post('toggle');
    });
    m.resources('posts', { concerns: 'toggleable' });
    m.resources('photos', { concerns: 'toggleable' });
  });
  it("resource route with concerns", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(18);
    Object.keys(pathHelpers).length.should.equal(10);
    let helpers = [
      'post_toggle', 'posts', 'new_post', 'edit_post', 'post',
      'photo_toggle', 'photos', 'new_photo', 'edit_photo', 'photo'
    ].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.post_toggle_path(233).should.equal('/posts/233/toggle');
    pathHelpers.posts_path(233).should.equal('/posts');
    pathHelpers.new_post_path().should.equal('/posts/new');
    pathHelpers.edit_post_path(233).should.equal('/posts/233/edit');
    pathHelpers.post_path(233).should.equal('/posts/233');

    pathHelpers.photo_toggle_path(377).should.equal('/photos/377/toggle');
    pathHelpers.photos_path(377).should.equal('/photos');
    pathHelpers.new_photo_path().should.equal('/photos/new');
    pathHelpers.edit_photo_path(377).should.equal('/photos/377/edit');
    pathHelpers.photo_path(377).should.equal('/photos/377');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.namespace('admin', () => {
      m.resources('products');
    });
  });
  it("resource route within a namespace", () => {
    let routes = routeMapper.routes;
    let pathHelpers = routeMapper.pathHelpers;
    routes.length.should.equal(8);
    Object.keys(pathHelpers).length.should.equal(4);
    let helpers = [
      'admin_products', 'new_admin_product', 'edit_admin_product', 'admin_product'
    ].map((e) => e + '_path');
    Object.keys(pathHelpers).should.eql(helpers);
    pathHelpers.admin_products_path().should.equal('/admin/products');
    pathHelpers.new_admin_product_path().should.equal('/admin/products/new');
    pathHelpers.edit_admin_product_path(233).should.equal('/admin/products/233/edit');
    pathHelpers.admin_product_path(233).should.equal('/admin/products/233');
  });
});


describe('Mapper#format', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.get('photos/:id', { constraints: { id: /\d+/ }, to: 'photos#show', format: 'js' });
    m.get('users/:id.:format?', { constraints: { id: '444' }, to: 'users#show', format: 'js' });
    m.get('comments/:id', { to: 'users#show', format: true });
    m.get(':controller/:action/:id', { constraints: { format: /json|xml/ } });
  });
});
