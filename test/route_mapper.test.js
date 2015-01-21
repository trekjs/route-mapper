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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(1);
    routes[0].path.should.equal('/');
    routes[0].name.should.equal('root');
    urlHelpers.root_path().should.equal('/');
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
    routeMapper.urlHelpers.purchase_path(233).should.equal('/products/233/purchase');
  });
});

describe('Mapper#resources', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.resources('products');
  });
  it("resource route (maps HTTP verbs to controller actions automatically)", () => {
    let routes = routeMapper.routes;
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(8);
    Object.keys(urlHelpers).length.should.equal(4);
    let helpers = ['products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.products_path().should.equal('/products');
    urlHelpers.new_product_path().should.equal('/products/new');
    urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    urlHelpers.product_path(233).should.equal('/products/233');
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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(11);
    Object.keys(urlHelpers).length.should.equal(7);
    let helpers = ['short_product', 'toggle_product', 'sold_products', 'products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.short_product_path(233).should.equal('/products/233/short');
    urlHelpers.toggle_product_path(233).should.equal('/products/233/toggle');
    urlHelpers.sold_products_path().should.equal('/products/sold');
    urlHelpers.products_path().should.equal('/products');
    urlHelpers.new_product_path().should.equal('/products/new');
    urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    urlHelpers.product_path(233).should.equal('/products/233');
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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(31);
    Object.keys(urlHelpers).length.should.equal(15);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'product_seller', 'new_product_seller', 'edit_product_seller',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    urlHelpers.product_seller_path(233).should.equal('/products/233/seller');
    urlHelpers.new_product_seller_path(233).should.equal('/products/233/seller/new');
    urlHelpers.edit_product_seller_path(233).should.equal('/products/233/seller/edit');

    urlHelpers.products_path().should.equal('/products');
    urlHelpers.new_product_path().should.equal('/products/new');
    urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    urlHelpers.product_path(233).should.equal('/products/233');
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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(25);
    Object.keys(urlHelpers).length.should.equal(13);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'recent_product_sales', 'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    urlHelpers.recent_product_sales_path(233).should.equal('/products/233/sales/recent');
    urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    urlHelpers.products_path().should.equal('/products');
    urlHelpers.new_product_path().should.equal('/products/new');
    urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    urlHelpers.product_path(233).should.equal('/products/233');
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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(18);
    Object.keys(urlHelpers).length.should.equal(10);
    let helpers = [
      'post_toggle', 'posts', 'new_post', 'edit_post', 'post',
      'photo_toggle', 'photos', 'new_photo', 'edit_photo', 'photo'
    ].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.post_toggle_path(233).should.equal('/posts/233/toggle');
    urlHelpers.posts_path(233).should.equal('/posts');
    urlHelpers.new_post_path().should.equal('/posts/new');
    urlHelpers.edit_post_path(233).should.equal('/posts/233/edit');
    urlHelpers.post_path(233).should.equal('/posts/233');

    urlHelpers.photo_toggle_path(377).should.equal('/photos/377/toggle');
    urlHelpers.photos_path(377).should.equal('/photos');
    urlHelpers.new_photo_path().should.equal('/photos/new');
    urlHelpers.edit_photo_path(377).should.equal('/photos/377/edit');
    urlHelpers.photo_path(377).should.equal('/photos/377');
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
    let urlHelpers = routeMapper.urlHelpers;
    routes.length.should.equal(8);
    Object.keys(urlHelpers).length.should.equal(4);
    let helpers = [
      'admin_products', 'new_admin_product', 'edit_admin_product', 'admin_product'
    ].map((e) => e + '_path');
    Object.keys(urlHelpers).should.eql(helpers);
    urlHelpers.admin_products_path().should.equal('/admin/products');
    urlHelpers.new_admin_product_path().should.equal('/admin/products/new');
    urlHelpers.edit_admin_product_path(233).should.equal('/admin/products/233/edit');
    urlHelpers.admin_product_path(233).should.equal('/admin/products/233');
  });
});
