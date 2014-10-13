/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res) {
    Category.find().exec(function(err, categories){
      if (err) return res.send(500, '');
      res.json(categories);
    });
  },

	delete: function(req, res) {
		ids = JSON.parse(req.param('ids'));
		if (ids.length == 0) return res.send("category empty", 411);
		Category.destroy({id: ids}).exec(function(err, categories) {
			if (err) return res.send(err,500);
			res.json(categories);
		});
	},

  get: function(req, res) {
    var id = parseInt(req.param('id'));
    async.auto({
      category: function(cb) {
        Category.findOne(id).populate('products').exec(cb);
      },
      categoryProducts: ['category', function(cb, results) {
        Product.find({id: _.pluck(results.category.products, 'id')})
          .populate('user')
          .populate('images')
          .populate('comments')
          .populate('likes')
          .exec(cb);
      }],
      map: ['categoryProducts', function(cb, results) {
        var category = results.category.toObject();
        category.products = results.categoryProducts;
        return cb(null, category);
      }]
    },

    function finish(err, results) {
      if(err) return res.serverError(err);
      return res.json(_.clone(results.map));
    });
  }
};