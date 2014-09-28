/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var md5 = require('MD5');

module.exports = {
	
  attributes: {
  	email: {
			type: 'email',
			required: true,
			unique: true,
			index: true
		},
		name: {
			type: 'STRING',
			required: true
		},
		password: {
			type: 'STRING',
			required: true
		},
		profile_image: 'STRING',
		phone: 'STRING',
		address: 'STRING',
		yahoo: 'STRING',
		skype: 'STRING',
		facebook: 'STRING',
		token: 'STRING',

    publicData: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.email;
      delete obj.token;
      return obj;
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  },

  beforeCreate: function(values, cb) {
  	if (!values.password) {
  		cb('Can not create user');
  	} else {
  		values.password = md5(values.password);
  		cb();
  	}
  },

  beforeValidate: function(values, cb) {
  	if (!values.password) {
  		delete values.password;
  	}
  	cb();
  },

  beforeUpdate: function(values, cb) {
  	if (values.password) values.password = md5(values.password);
  	cb();
  }

  
};

