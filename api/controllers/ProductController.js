/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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
  }
};

