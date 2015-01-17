import RouteSet from '../src/route_set';
import Mapper from '../src/mapper';
import assert from 'assert';

describe('RouteSet#draw', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    it("should be Mapper's instance", () => {
      assert.equal(true, m instanceof Mapper);
    });
  });
});


describe('Mapper#resourcesPathNames', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    it("should be return resourcesPathNames", () => {
      let options = { 'new': 'new', 'edit': 'edit' };
      options.edit.should.equal(m.resourcesPathNames().edit);
      options['new'].should.equal(m.resourcesPathNames()['new']);
    });
  });
});

describe('Mapper#root', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.root('welcome#index');
  });
  it("root", () => {
    routeSet.routes.length.should.equal(1);
    routeSet.routes[0].path.should.equal('/');
    routeSet.routes[0].name.should.equal('root');
    routeSet.urlHelpers.root_path().should.equal('/');
  });
});

describe('Mapper#get', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.get('products/:id', { to: 'catalog#view' });
  });
  it("get", () => {
    routeSet.routes.length.should.equal(1);
    routeSet.routes[0].path.should.equal('/products/:id');
    routeSet.routes[0].controller.should.equal('catalog');
    routeSet.routes[0].action.should.equal('view');
  });
});

describe('Mapper#get', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.get('products/:id/purchase', { to: 'catalog#view', as: 'purchase' });
  });
  it("named route that can be invoked with purchase_path(id: product.id)", () => {
    routeSet.routes.length.should.equal(1);
    routeSet.routes[0].path.should.equal('/products/:id/purchase');
    routeSet.routes[0].controller.should.equal('catalog');
    routeSet.routes[0].action.should.equal('view');
    routeSet.routes[0].name.should.equal('purchase');
    routeSet.urlHelpers.purchase_path(233).should.equal('/products/233/purchase');
  });
});

describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.resources('products');
  });
  it("resource route (maps HTTP verbs to controller actions automatically)", () => {
    routeSet.routes.length.should.equal(8);
    Object.keys(routeSet.urlHelpers).length.should.equal(4);
    let helpers = ['products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.products_path().should.equal('/products');
    routeSet.urlHelpers.new_product_path().should.equal('/products/new');
    routeSet.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeSet.urlHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
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
    routeSet.routes.length.should.equal(11);
    Object.keys(routeSet.urlHelpers).length.should.equal(7);
    let helpers = ['short_product', 'toggle_product', 'sold_products', 'products', 'new_product', 'edit_product', 'product'].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.short_product_path(233).should.equal('/products/233/short');
    routeSet.urlHelpers.toggle_product_path(233).should.equal('/products/233/toggle');
    routeSet.urlHelpers.sold_products_path().should.equal('/products/sold');
    routeSet.urlHelpers.products_path().should.equal('/products');
    routeSet.urlHelpers.new_product_path().should.equal('/products/new');
    routeSet.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeSet.urlHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.resources('products', () => {
      m.resources('comments', 'sales')
        .resource('seller');
    });
  });
  it("resource route with sub-resources", () => {
    routeSet.routes.length.should.equal(31);
    Object.keys(routeSet.urlHelpers).length.should.equal(15);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'product_seller', 'new_product_seller', 'edit_product_seller',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    routeSet.urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    routeSet.urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    routeSet.urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    routeSet.urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    routeSet.urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    routeSet.urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    routeSet.urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    routeSet.urlHelpers.product_seller_path(233).should.equal('/products/233/seller');
    routeSet.urlHelpers.new_product_seller_path(233).should.equal('/products/233/seller/new');
    routeSet.urlHelpers.edit_product_seller_path(233).should.equal('/products/233/seller/edit');

    routeSet.urlHelpers.products_path().should.equal('/products');
    routeSet.urlHelpers.new_product_path().should.equal('/products/new');
    routeSet.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeSet.urlHelpers.product_path(233).should.equal('/products/233');
  });
});


describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.resources('products', () => {
      m.resources('comments')
        .resources('sales', () => {
          m.get('recent', { on: 'collection' });
        });
    });
  });
  it("resource route with more complex sub-resources", () => {
    routeSet.routes.length.should.equal(25);
    Object.keys(routeSet.urlHelpers).length.should.equal(13);
    let helpers = [
      'product_comments', 'new_product_comment', 'edit_product_comment', 'product_comment',
      'recent_product_sales', 'product_sales', 'new_product_sale', 'edit_product_sale', 'product_sale',
      'products', 'new_product', 'edit_product', 'product'
    ].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.product_comments_path(233).should.equal('/products/233/comments');
    routeSet.urlHelpers.new_product_comment_path(233).should.equal('/products/233/comments/new');
    routeSet.urlHelpers.edit_product_comment_path(233, 377).should.equal('/products/233/comments/377/edit');
    routeSet.urlHelpers.product_comment_path(233, 377).should.equal('/products/233/comments/377');

    routeSet.urlHelpers.recent_product_sales_path(233).should.equal('/products/233/sales/recent');
    routeSet.urlHelpers.product_sales_path(233).should.equal('/products/233/sales');
    routeSet.urlHelpers.new_product_sale_path(233).should.equal('/products/233/sales/new');
    routeSet.urlHelpers.edit_product_sale_path(233, 377).should.equal('/products/233/sales/377/edit');
    routeSet.urlHelpers.product_sale_path(233, 377).should.equal('/products/233/sales/377');

    routeSet.urlHelpers.products_path().should.equal('/products');
    routeSet.urlHelpers.new_product_path().should.equal('/products/new');
    routeSet.urlHelpers.edit_product_path(233).should.equal('/products/233/edit');
    routeSet.urlHelpers.product_path(233).should.equal('/products/233');
  });
});

describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.concern('toggleable', () => {
      m.post('toggle');
    });
    m.resources('posts', { concerns: 'toggleable' });
    m.resources('photos', { concerns: 'toggleable' });
  });
  it("resource route with concerns", () => {
    routeSet.routes.length.should.equal(18);
    Object.keys(routeSet.urlHelpers).length.should.equal(10);
    let helpers = [
      'post_toggle', 'posts', 'new_post', 'edit_post', 'post',
      'photo_toggle', 'photos', 'new_photo', 'edit_photo', 'photo'
    ].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.post_toggle_path(233).should.equal('/posts/233/toggle');
    routeSet.urlHelpers.posts_path(233).should.equal('/posts');
    routeSet.urlHelpers.new_post_path().should.equal('/posts/new');
    routeSet.urlHelpers.edit_post_path(233).should.equal('/posts/233/edit');
    routeSet.urlHelpers.post_path(233).should.equal('/posts/233');

    routeSet.urlHelpers.photo_toggle_path(377).should.equal('/photos/377/toggle');
    routeSet.urlHelpers.photos_path(377).should.equal('/photos');
    routeSet.urlHelpers.new_photo_path().should.equal('/photos/new');
    routeSet.urlHelpers.edit_photo_path(377).should.equal('/photos/377/edit');
    routeSet.urlHelpers.photo_path(377).should.equal('/photos/377');
  });
});

describe('Mapper#resources', () => {
  let routeSet = new RouteSet();
  routeSet.draw((m) => {
    m.namespace('admin', () => {
      m.resources('products');
    });
  });
  it("resource route within a namespace", () => {
    routeSet.routes.length.should.equal(8);
    Object.keys(routeSet.urlHelpers).length.should.equal(4);
    let helpers = [
      'admin_products', 'new_admin_product', 'edit_admin_product', 'admin_product'
    ].map((e) => e + '_path');
    Object.keys(routeSet.urlHelpers).should.eql(helpers);
    routeSet.urlHelpers.admin_products_path().should.equal('/admin/products');
    routeSet.urlHelpers.new_admin_product_path().should.equal('/admin/products/new');
    routeSet.urlHelpers.edit_admin_product_path(233).should.equal('/admin/products/233/edit');
    routeSet.urlHelpers.admin_product_path(233).should.equal('/admin/products/233');
  });
});
