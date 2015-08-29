import RouteMapper from '../src/RouteMapper';

let routeMapper = new RouteMapper();
routeMapper.camelCase = false;

routeMapper

  // The priority is based upon order of creation: first created -> highest priority.
  .resources('photos', { as: 'google', format: false }, () => {
    routeMapper.resources('books', () => {
      routeMapper.resources('users');
      routeMapper.get('show');
    });
  })

  // You can have the root of your site routed with "root"
  .root('welcome#index')

  // Example of regular route:
  .get('products/:id', { to: 'catalog#view' })
  //.get({ path: 'products/:id', to: 'catalog#view' })

  // Example of named route that can be invoked with purchase_url(id: product.id)
  .get('products/:id/purchase',  { to: 'catalog#purchase', as: 'purchase' })

  // Example resource route (maps HTTP verbs to controller actions automatically):
  .resources('products')

  // Example resource route with options:
  .resources('products', () => {
    routeMapper
      .member(() => {
        routeMapper
          .get('short')
          .post('toggle')
      })
      .collection(() => {
        routeMapper.get('sold');
      })
  })

  // Example resource route with sub-resources:
  .resources('products', () => {
    routeMapper
      .resources('comments', 'sales')
      .resource('seller');
  })

  // Example resource route with more complex sub-resources:
  .resources('products', () => {
    routeMapper
      .resources('comments')
      .resources('sales', () => {
        routeMapper.get('recent', { on: 'collection' });
      });
  })

  // Example resource route with concerns:
  .concern('toggleable', () => {
    routeMapper.post('toggle');
  })
  .resources('posts', { concerns: 'toggleable' })
  .resources('photos', { concerns: 'toggleable' })

  // Example resource route within a namespace:
  .namespace('admin', () => {
    // Directs /admin/products/* to Admin.ProductsController
    // (app/controllers/admin/ProductsController.js)
    routeMapper.resources('products');
  })
  /*
  .get(':controller/:action');
  */

// console.log(routeMapper.routes)
