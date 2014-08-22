/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'post /user/api_login': {
    controller: 'UserController',
    action: 'api_login',
    cors: {
      origin: '*'
    }
  },

  'get /user': {
    cors: {
      origin: '*'
    }
  },

  'post /user/update/:id': {
    cors: {
      origin: '*'
    }
  },

  'post /user/create': {
    cors: {
      origin: '*'
    }
  },

  'post /user/delete': {
    controller: 'UserController',
    action: 'delete',
    cors: {
      origin: '*'
    }
  },

  'post /file/upload': {
    controller: 'FileController',
    action: 'upload',
    cors: {
      origin: '*'
    }
  },

  'post /file/uploads': {
    controller: 'FileController',
    action: 'uploads',
    cors: {
      origin: '*'
    }
  },

  'get /file': {
    cors: {
      origin: '*'
    }
  },

  'get /media/:id': {
    controller: 'FileController',
    action: 'get',
    cors: {
      origin: '*'
    }
  },

  'get /media/thumb/:size/:id': {
    controller: 'FileController',
    action: 'get_thumb',
    cors: {
      origin: '*'
    }
  },

  'get /file': {
    cors: {
      origin: '*'
    }
  },

  'get /category': {
    cors: {
      origin: '*'
    }
  },
  'post /category/update/:id': {
    cors: {
      origin: '*'
    }
  },
  'post /category/create': {
    cors: {
      origin: '*'
    }
  },
  'post /category/delete': {
    controller: 'CategoryController',
    action: 'delete',
    cors: {
      origin: '*'
    }
  }
};
