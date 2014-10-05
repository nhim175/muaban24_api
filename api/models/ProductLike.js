/**
* ProductLike.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    userId: {
      type: 'int',
      required: true
    },
    productId: {
      type: 'int',
      required: true
    }
  }
};

