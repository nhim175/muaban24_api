/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },
    categories: {
      collection: 'category',
      via: 'products',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    price: {
      type: 'integer'
    },
    isNew: {
      type: 'boolean',
      required: true
    },
    forSale: {
      type: 'boolean',
      required: true
    },
    forFree: {
      type: 'boolean',
      required: true
    },
    forExchange: {
      type: 'boolean',
      required: true
    },
    transactionMode: {
      type: 'string',
      required: true,
      enum: ['bank_transfer', 'cod']
    },
    transactionAddress: {
      type: 'string'
    },
    exchangeInfo: {
      type: 'string'
    },
    images: {
      collection: 'file',
      required: true,
      notEmpty: true
    },
    user: {
      model: 'user',
      required: true
    },
    likes: {
      collection: 'productlike',
      via: 'product'
    },
    comments: {
      collection: 'comment',
      via: 'product'
    }
  }
};

