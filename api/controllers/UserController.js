/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var md5 = require('MD5');
var hat = require('hat');

module.exports = {
  api_login: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');

    User.findOne({ email: email }).exec(function (err, user) {
      if (err) return res.send(err,500);
      if (!user) return res.send("No other user with that email exists!", 404);
      if (md5(password) !== user.password) {
        return res.send("Password is wrong!", 403);
      } else {
        user.token = hat();
        user.save(function() {
          req.session.authenticated = true;
          res.json(user);
        });
      }
    });
  }
};

