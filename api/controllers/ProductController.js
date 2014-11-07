/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');
var moment = require('moment');

module.exports = {
  index: function(req, res) {
    Product.find()
      .populate('likes')
      .populate('comments')
      .populate('user')
      .populate('categories')
      .populate('images')
      .exec(function(err, products) {
        if (err) return res.send(500, err);
        res.json(products);
      });
  },

  query: function(req, res) {
    async.auto({
      product: function(cb) {
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        var requestParams = req.allParams();
        var categoryId = requestParams.category;
        var timestamp = requestParams.timestamp || now;
        var page = requestParams.page || 1;
        var perPage = 10;
        var query =  "SELECT p.* FROM category_products__product_categories AS cp ";
        query += "INNER JOIN product AS p ON p.id = cp.product_categories ";
        query += "WHERE p.createdAt < '" + timestamp + "' ";
        if (parseInt(categoryId) > 0) {
          query += "AND category_products = " + categoryId + " ";
        }
        query += "ORDER BY p.createdAt DESC ";
        query += "LIMIT " + (page-1)*perPage + "," + perPage + " ";

        Product.query(query, function(err, result) {
          if (err) return res.serverError(err);
          cb(null, {
            timestamp: timestamp,
            products: result
          });
        });
      },

      productImages: ['product', function(cb, results) {
        var productIds = (results.product.products.length > 0) ? 
          _.pluck(results.product.products, 'id').join(',') : -1;

        var query = "SELECT * FROM file_images_file__product_images AS pf ";
        query += "INNER JOIN file AS f ON f.id = pf.file_images_file ";
        query += "WHERE pf.product_images IN (" + productIds + ")";
        File.query(query, function(err, result) {
          if (err) return res.serverError(err);
          cb(null, _.groupBy(result, 'product_images'));
        });
      }],

      productUser: ['product', function(cb, results) {
        var userIds = (results.product.products.length > 0) ? 
          _.pluck(results.product.products, 'user').join(',') : -1;

        var query = "SELECT * FROM user WHERE id IN (" + userIds + ")";
        User.query(query, function(err, result) {
          if(err) return res.serverError(err);
          cb(null, _.groupBy(result, 'id'));
        });
      }],

      map: ['productImages', 'productUser', function(cb, results) {
        var result = results.product;
        result.products = result.products.map(function(product) {
          product.images = results.productImages[product.id];
          var user = results.productUser[product.user][0];
          product.user = {
            id: user.id,
            name: user.name
          };
          return product;
        });
        return cb(null, result);
      }],

    }, function finish(err, result) {
      if(err) return res.serverError(err);
      return res.json(result.map);
    });
    
  },

  get: function(req, res) {
    var id = req.param('id');
    async.auto({
      product: function(cb) {
        Product.findOne(id)
          .populate('user')
          .populate('likes')
          .populate('images')
          .populate('comments')
          .populate('categories')
          .exec(cb);
      },
      commentUsers: ['product', function(cb, results) {
        User.find({id: _.pluck(results.product.comments, 'user')})
          .exec(cb);
      }],
      map: ['commentUsers', function(cb, results) {
        var users = _.indexBy(results.commentUsers, 'id');
        var product = results.product.toObject();
        product.comments = product.comments.map(function(comment) {
          comment.user = users[comment.user];
          return comment;
        });
        return cb(null, product);
      }]
    },

    function finish(err, result) {
      if(err) return res.serverError(err);
      return res.json(_.clone(result.map));
    });
  },

	create: function(req, res) {
    var data = req.allParams();
    data.user = req.session.user.id;
    sails.log.debug('user', req.session.user.id, 'is creating a new product');
    Product.create(data).exec(function(err, product) {
      if (err) {
        sails.log.error('Can not add product', err);
        return res.serverError(err);
      }
      sails.log.debug('user', req.session.user.id, 'created a new product with id', product.id);
      return res.json(product);
    });
  },

  get_comments: function(req, res) {
    var id = req.param('id');
    Comment.find({where: {productId: id}, sort: 'createdAt ASC'}).exec(function(err, comments) {
      if (err) {
        return res.send(404, 'Comments not found');
      }
      return res.json(comments);
    });
  },

  like_product: function(req, res) {
    var productId = req.param('id');
    var data = {
      user: req.session.user.id,
      product: productId
    };
    ProductLike.create(data).exec(function(err, likeObject) {
      if (err) {
        return res.send(500, '');
      }
      return res.json(likeObject);
    });
  },

  unlike_product: function(req, res) {
    var productId = req.param('id');
    var data = {
      user: req.session.user.id,
      product: productId
    };
    ProductLike.destroy(data).exec(function(err) {
      if (err) {
        return res.send(500, '');
      }
      return res.send(200, 'ok');
    });
  },

  get_likes: function(req, res) {
    var productId = req.param('id');
    ProductLike.find().where({productId: productId}).exec(function(err, likes) {
      if (err) return res.send(500, '');
      if (likes.length == 0) return res.json([]);
      var userIds = _.pluck(likes, 'userId');
      User.find({id: userIds}).exec(function(err, users) {
        if (err) return res.send(500, '');
        var users = _.map(users, function(user) { return user.publicData(); });
        return res.json(users);
      });
    });
  },

  search: function(req, res) {
    var queryString = req.param('query');
    Product.find({ title: { 'like': '%'+queryString+'%'}})
    .populate('images')
    .populate('comments')
    .populate('likes')
    .populate('user')
    .exec(function(err, products) {
      // TODO: Repeat code
      if (err) return res.send(500, err);
      res.json(products);
    });
  }
};

