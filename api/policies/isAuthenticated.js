/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Check if token key is matched
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var token = req.param('token');
  User.findOne({token: token}).exec(function(err, user) {
  	if(user) {
  		req.session.user = user;
  		return next();
  	}
  	return res.forbidden('You are not permitted to perform this action.');
  });
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
};
