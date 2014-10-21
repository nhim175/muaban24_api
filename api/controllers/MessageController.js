/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req, res) {
    var actedUserId = req.session.user.id;
    Message.find({
      or: [
        { from: actedUserId },
        { to: actedUserId }
      ]
    }).populate('from').populate('to').exec(function(err, messages) {
      if (err) { return res.send(500, ''); }
      var result = [];
      var securedMessages = _.map(messages, function(message) {
        return {
          from: message.from.publicData(),
          to: message.to.publicData(),
          content: message.content,
          createdAt: message.createdAt
        }
      });
      securedMessages = _.groupBy(securedMessages, function(message) {
        return (message.from.id == actedUserId) ? message.to.id : message.from.id;
      });
      securedMessages = _.each(securedMessages, function(messages, userId) {
        result.push(_.last(messages));
      });
      res.json(result);
    });
  },

	get_by_user: function(req, res) {
    var userId = req.param('userId');
    var actedUserId = req.session.user.id;
    Message.find({
      or: [
        { from: userId, to: actedUserId },
        { from: actedUserId, to: userId }
      ]
    }).populate('from').populate('to').exec(function(err, messages) {
      if (err) { return res.send(500, ''); }
      var result = _.map(messages, function(message) {
        return {
          from: message.from.publicData(),
          to: message.to.publicData(),
          content: message.content
        }
      });
      res.json(result);
    });
  },

  create: function(req, res) {
    var data = {
      from : req.session.user.id,
      to: parseInt(req.param('to')),
      content: req.param('content')
    };
    Message.create(data).exec(function(err, message) {
      if (err) { return res.send(500, ''); }
      res.json(message);
    });
  }
};

