/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	delete: function(req, res) {
		ids = JSON.parse(req.param('ids'));
		if (ids.length == 0) return res.send("category empty", 411);
		Category.destroy({id: ids}).exec(function(err, categories) {
			if (err) return res.send(err,500);
			res.json(categories);
		});
	},

  get_products: function(req, res) {
    var id = req.param('id');
    Product.find({where: {categories: {contains: id}}, sort: 'createdAt ASC'}).exec(function(err, products) {
      if (err) {
        return res.send(404, 'Products not found');
      }
      return res.json(products);
    });
  }
};