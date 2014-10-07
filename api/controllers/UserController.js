/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var md5 = require('MD5');
var hat = require('hat');
var _ = require('underscore');

module.exports = {
  index: function(req, res) {
    User.find().exec(function(err, users) {
      if (err) return res.send(err, 500);
      var users = _.map(users, function(user) {
        return user.toJSON();
      });
      return res.json(users);
    });
  },

  get: function(req, res) {
    var user_id = req.param('id');
    User.findOne({id: user_id}).exec(function(err, user) {
      if (err || user == null) {
        sails.log.error('User not found', user_id);
        return res.send(404, 'User not found');
      }
      return res.json(user.publicData());
    });
  },

  api_login: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');
    sails.log('User', email, 'is trying to log in');
    User.findOne({ email: email }).exec(function (err, user) {
      if (err) return res.send(err,500);
      if (!user) return res.send("No other user with that email exists!", 404);
      if (md5(password) !== user.password) {
        sails.log.warn('User', email, 'entered a wrong password!');
        return res.send("Password is wrong!", 403);
      } else {
        sails.log.info('User', email, 'logged in!');
        user.token = hat();
        delete user.password;
        user.save(function() {
          req.session.authenticated = true;
          return res.json(user);
        });
      }
    });
  },

  update: function(req, res) {
    var user_id = req.param('id');
    var user = JSON.parse(req.param('user'));
    sails.log('User', req.session.user.id, 'is updating user', user_id, user);
    User.update(user_id, user, function(err, result) {
      if (err) {
        sails.log.error('Update user', user_id, 'failed with error', err);
        return res.send(err, 500);
      }
      delete result[0].password;
      return res.json(result[0]);
    });
  },

  delete: function(req, res) {
    var ids = JSON.parse(req.param('ids'));
    if (ids.length == 0) return res.send("user empty", 411);
    sails.log('User', req.session.user.id, 'deleting users', ids);
    User.destroy({id: ids}).exec(function(err, users) {
      if (err) {
        sails.log.error('Delete failed!', err);
        return res.send(err,500);
      }
      sails.log('User', req.session.user.id, 'deleted users', ids, 'successfully!');
      return res.json(users);
    });
  },

  get_products: function(req, res) {
    var id = req.param('id');
    Product.find({where: {userId: id}, sort: 'createdAt ASC'}).exec(function(err, products) {
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
  }
};

