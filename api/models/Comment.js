/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    content: {
      type: 'string',
      required: true
    },
    productId: {
      type: 'integer',
      required: true
    },
    userId: {
      type: 'integer',
      required: true
    }
  }

};

