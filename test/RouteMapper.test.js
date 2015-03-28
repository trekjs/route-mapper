import RouteMapper from '../src/RouteMapper';

let routeMapper = new RouteMapper();

routeMapper

  .resources('photos', { as: 'google' }, () => {
    routeMapper.resources('books', () => {
      routeMapper.resources('users')
    });
  })


  .root('welcome#index')

  .get('products/:id', { to: 'catalog#view' })
  //.get({ path: 'products/:id', to: 'catalog#view' })

  .get('products/:id/purchase',  { to: 'catalog#purchase', as: 'purchase' })

  .resources('products')

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

  .resources('products', () => {
    routeMapper
      .resources('comments', 'sales', () => {
        routeMapper.resources('users');
      })
      .resource('seller', { format: false, controller: 'ggggg' })
  })

  .get(':controller/:action')
