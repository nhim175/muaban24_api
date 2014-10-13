/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');

module.exports = {
  index: function(req, res) {
    Product.find().populate('likes').populate('comments').populate('user').populate('categories').populate('images').exec(function(err, products) {
      if (err) return res.send(500, err);
      res.json(products);
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

