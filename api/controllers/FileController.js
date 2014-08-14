/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');
var fs = require('fs');
var UPLOAD_ROOT = './upload';

module.exports = {

	get: function(req, res) {
		var file_id = req.param('id');
		File.findOne({id: file_id}).exec(function(err, file) {
			res.sendfile(UPLOAD_ROOT + '/' + file.owner + '/' + file.filename);
		});
	},

	upload: function(req, res) {
		upload_dir = UPLOAD_ROOT + '/' + req.session.user.id;
		req.file('file').upload({
			dirname: upload_dir
		},function(err, files) {
			if(err) return res.serverError(error);
			if(files.length == 0) return res.send("file empty", 411);
			var file = files[0];
			var org_name = file.filename;
			var file_ext = org_name.match(/\.([A-z0-9]*)$/)[0];
			var new_name = uuid.v1() + file_ext;
			fs.renameSync(upload_dir + '/' + org_name, upload_dir + '/' + new_name);
			file.filename = new_name;
			file.owner = req.session.user.id;
			File.create(file).exec(function(err, file) {
				console.log(err, file);
				return res.json({
					message: files.length + ' file(s) uploaded successfully!',
					file: file
				});
			});
		});
	}
};

