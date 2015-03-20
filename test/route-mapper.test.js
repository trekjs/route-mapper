import RouteMapper from '../src/route_mapper';

let routeMapper = new RouteMapper();

//console.dir(routeMapper)

routeMapper

  /*
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
  */

  // .resources('products', () => {
  //   routeMapper
      //.resources('comments', 'sales')
      .resource('seller', { format: false, controller: 'ggggg' })
  // })

  .get(':controller/:action')





/*
  .namespace('admin', () => {
    routeMapper.root({ to: 'admin#index' });
  })

  .root({ to: "home#index" })

  .resources('photos', () => {
    routeMapper.resources('books');
  })
*/


return

/*
  .match('/application.js', {
    to: 'Sprockets',
    verb: 'all'
  })

  .match('books', { to: 'books#show', verb: ['get', 'post'] })

  .root('pages#main')

  .get('photos/:id', { to: 'photos#show' })

  .get('posts/:id([A-Z]\\d{5})', { to: 'posts#show' })
  //.get('posts/:id', { to: 'posts#show', constraints: { id: /[A-Z]\d{5}/ } })

  .resources('videos', 'articles', () => {
    routeMapper.resources('projects');
  })

  .resource('geocoder')

  // /admin => app/admin/admin.js#index
  // .namespace('admin', (r) => {
  //   r.root({
  //     to: 'admin#index'
  //   })
  // })

// / => app/home.js#index
//.root({ to: 'home#index'})


/*
RouteMapper.prototype.draw = function(callback) {
  callback.apply(this);
};

var routeMapper = new RouteMapper();
routeMapper.draw(function () {
});



routeMapper
  // Basic Methods
  .root()
  .match()
  .mount()

  // HTTP Verbs
  .get()
  .post()
  .patch()
  .put()
  .del()
  .delete()
  .options()
  ._map_method()

  // Scoping
  .scope()
  .controller()
  .constraints()
  .namespace()
  .defaults()

  // Resource & Resources
  .resource()
  .resources()
  .collection()
  .member()
  .new()
  .concerns()
  .concern()

  .nested()
  .shallow()
  .shallowScope()
*/

/** examples **/

/*
  .root('/', {  })

  // /photos      => app/controllers/photos.js
  .resources('photos')
  // /books       => app/controllers/books.js
  // /videos      => app/controllers/videos.js
  .resources('photos', 'books', 'videos')
  // .resources('photos').resources('books').resources('videos')

  // /profile     => app/controllers/users.js
  .get('profile', { to: 'users#show' })

  // /geocoder    => app/controllers/geocoders.js
  .resource('geocoder')

  // /admin/articles => app/controllers/admin/articles.js
  // /admin/comments => app/controllers/admin/comments.js
  .namespace('admin')
    .resources('articles', 'comments')

  // /articles       => app/controllers/admin/articles.js
  // /comments       => app/controllers/admin/comments.js
  .scope({ module: 'admin' })
    .resources('articles', 'comments')

  // =>
  .resources('articles', { module: 'admin' })

  // /admin/articles  => app/controllers/articles.js
  // /admin/comments  => app/controllers/comments.js
  .scope('/admin')
    .resources('articles', 'comments')

  // /admin/articles => app/controllers/articles.js
  .resources('articles')

  // Nested Resources
  .resources('magazines')
    .resources('ads')

  // /publishers/1/magazines/2/photos/3
  .resources('publishers')
    .resources('magazines')
      .resources('photos')

  .resources('pages').slash()
    .resources('photos')
*/

/*
[

  {
    verb: 'get',

  }

  resources:

  get:

  post:

]
*/
