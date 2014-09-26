/**
 * isProductOwner
 *
 * @module      :: Policy
 * @description :: Check if token key is matched
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.user == req.param('userId')) {
    return next();
  }
  return res.forbidden('You can not edit this product');
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
};
