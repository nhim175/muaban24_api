/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res) {
    var data = req.allParams();
    data.user = req.session.user.id;
    sails.log.debug('user', req.session.user.id, 'is posting a comment');
    Comment.create(data).exec(function(err, comment) {
      if (err) {
        sails.log.error('Can not add comment', err);
        return res.serverError(err);
      }
      sails.log.debug('user', req.session.user.id, 'posted a comment', comment.id, 'on product ', comment.productId);
      return res.json(comment);
    });
  }
};

