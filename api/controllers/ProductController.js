/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');

module.exports = {
  index: function(req, res) {
    Product.find().exec(function(err, products) {
      if (err) return res.send(500, err);
      var products = _.map(products, function(product) { return product.toObject(); });
      var productIds = _.pluck(products, 'id');
      ProductLike.find({productId: productIds}).exec(function(err, likes) {
        if (err) return res.send(500, err);
        var likesByProductId = _.countBy(likes, function(like) { return like.productId; });
        Comment.find({productId: productIds}).exec(function(err, comments) {
          var commentsByProductId = _.countBy(comments, function(comment) { return comment.productId; });
          var result = _.map(products, function(product) {
            product.likes = likesByProductId[product.id] || 0;
            product.comments = commentsByProductId[product.id] || 0;
            return product;
          });
          return res.json(result);
        });
      });
    });
  },

	create: function(req, res) {
    var data = req.allParams();
    data.userId = req.session.user.id;
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
      userId: req.session.user.id,
      productId: productId
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
      userId: req.session.user.id,
      productId: productId
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
  }
};

