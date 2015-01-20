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
    routeMapper.routes.length.should.equal(1);
    routeMapper.routes[0].path.should.equal('/');
    routeMapper.routes[0].name.should.equal('root');
    routeMapper.urlHelpers.root_path().should.equal('/');
  });
});

describe('Mapper#get', () => {
  let routeMapper = new RouteMapper();
  routeMapper.draw((m) => {
    m.get('products/:id', { to: 'catalog#view' });
  });
  it("get", () => {
    routeMapper.routes.length.should.equal(1);
    routeMapper.routes[0].path.should.equal('/products/:id');
    routeMapper.routes[0].controller.should.equal('catalog');
    routeMapper.routes[0].action.should.equal('view');
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
    routeMapper.routes.length.should.equal(8);
    Object.keys(routeMapper.urlHelpers).length.should.equal(4);
    let helpers = ['products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.products_path().should.equal('/products');
    routeMapper.urlHelpers.new_product_path().should.equal('/products/new');
    routeMapper.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeMapper.urlHelpers.product_path(233).should.equal('/products/233');
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
    routeMapper.routes.length.should.equal(11);
    Object.keys(routeMapper.urlHelpers).length.should.equal(7);
    let helpers = ['short_product', 'toggle_product', 'sold_products', 'products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.short_product_path(233).should.equal('/products/233/short');
    routeMapper.urlHelpers.toggle_product_path(233).should.equal('/products/233/toggle');
    routeMapper.urlHelpers.sold_products_path().should.equal('/products/sold');
    routeMapper.urlHelpers.products_path().should.equal('/products');
    routeMapper.urlHelpers.new_product_path().should.equal('/products/new');
    routeMapper.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeMapper.urlHelpers.product_path(233).should.equal('/products/233');
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
    routeMapper.routes.length.should.equal(31);
    Object.keys(routeMapper.urlHelpers).length.should.equal(15);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'product_seller', 'new_product_seller', 'edit_product_seller',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    routeMapper.urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    routeMapper.urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    routeMapper.urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    routeMapper.urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    routeMapper.urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    routeMapper.urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    routeMapper.urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    routeMapper.urlHelpers.product_seller_path(233).should.equal('/products/233/seller');
    routeMapper.urlHelpers.new_product_seller_path(233).should.equal('/products/233/seller/new');
    routeMapper.urlHelpers.edit_product_seller_path(233).should.equal('/products/233/seller/edit');

    routeMapper.urlHelpers.products_path().should.equal('/products');
    routeMapper.urlHelpers.new_product_path().should.equal('/products/new');
    routeMapper.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeMapper.urlHelpers.product_path(233).should.equal('/products/233');
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
    routeMapper.routes.length.should.equal(25);
    Object.keys(routeMapper.urlHelpers).length.should.equal(13);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'recent_product_sales', 'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    routeMapper.urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    routeMapper.urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    routeMapper.urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    routeMapper.urlHelpers.recent_product_sales_path(233).should.equal('/products/233/sales/recent');
    routeMapper.urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    routeMapper.urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    routeMapper.urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    routeMapper.urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    routeMapper.urlHelpers.products_path().should.equal('/products');
    routeMapper.urlHelpers.new_product_path().should.equal('/products/new');
    routeMapper.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeMapper.urlHelpers.product_path(233).should.equal('/products/233');
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
    routeMapper.routes.length.should.equal(18);
    Object.keys(routeMapper.urlHelpers).length.should.equal(10);
    let helpers = [
      'post_toggle', 'posts', 'new_post', 'edit_post', 'post',
      'photo_toggle', 'photos', 'new_photo', 'edit_photo', 'photo'
    ].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.post_toggle_path(233).should.equal('/posts/233/toggle');
    routeMapper.urlHelpers.posts_path(233).should.equal('/posts');
    routeMapper.urlHelpers.new_post_path().should.equal('/posts/new');
    routeMapper.urlHelpers.edit_post_path(233).should.equal('/posts/233/edit');
    routeMapper.urlHelpers.post_path(233).should.equal('/posts/233');

    routeMapper.urlHelpers.photo_toggle_path(377).should.equal('/photos/377/toggle');
    routeMapper.urlHelpers.photos_path(377).should.equal('/photos');
    routeMapper.urlHelpers.new_photo_path().should.equal('/photos/new');
    routeMapper.urlHelpers.edit_photo_path(377).should.equal('/photos/377/edit');
    routeMapper.urlHelpers.photo_path(377).should.equal('/photos/377');
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
    routeMapper.routes.length.should.equal(8);
    Object.keys(routeMapper.urlHelpers).length.should.equal(4);
    let helpers = [
      'admin_products', 'new_admin_product', 'edit_admin_product', 'admin_product'
    ].map((e) => e + '_path');
    Object.keys(routeMapper.urlHelpers).should.eql(helpers);
    routeMapper.urlHelpers.admin_products_path().should.equal('/admin/products');
    routeMapper.urlHelpers.new_admin_product_path().should.equal('/admin/products/new');
    routeMapper.urlHelpers.edit_admin_product_path(233).should.equal('/admin/products/233/edit');
    routeMapper.urlHelpers.admin_product_path(233).should.equal('/admin/products/233');
  });
});
