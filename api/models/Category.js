/**
* Category.js
*
* @description :: 
	Fields:
		name: 			Category name
		image: 			Category image
		parent_id: 	The id of the parent category
		sort_order: Categories will be sorted by sort_order ascendingly
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'STRING',
  		required: true
  	},
  	image_id: 'INTEGER',
  	parent_id: {
  		type: 'INTEGER',
  		defaultsTo: 0
  	},
    description: {
      type: 'TEXT'
    },
  	sort_order: {
  		type: 'INTEGER',
  		defaultsTo: 0
  	}
  }

};

