/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');
var fs = require('fs');
var gm = require('gm');
var UPLOAD_ROOT = './upload';
var ICON_ROOT = './assets/images/file-type-icons'

module.exports = {

	index: function(req, res) {
		var options = JSON.parse(req.param('options') || '{}');
		options.sort = options.sort || 'id DESC';
		File.find(options).then(function(files) {
			File.count().exec(function(err, count) {
				return res.json({files: files, count: count});
			});
		}).fail(function(err) {
			res.error(404, 'File not found');
		});
	},

	get: function(req, res) {
		var file_id = req.param('id');
		File.findOne({id: file_id}).exec(function(err, file) {
			if (err) {
				sails.log.error('File not found', file_id);
				return res.send(404, 'File not found');
			}
      res.sendfile(UPLOAD_ROOT + '/' + file.owner + '/' + file.filename);
		});
	},

  public_get: function(req, res) {
    var name = req.param('name');
    res.sendfile(UPLOAD_ROOT + '/public/' + name);
  },

	get_thumb: function(req, res) {
		var file_id = req.param('id');
		var size = req.param('size');
		if (/^\d+x\d+$/.test(size) === false) {
			sails.log.error('trying to get thumb with a wrong size', size);
			return res.send(500, 'Bad request');
		}
		size = size.split('x');
		var width = size[0];
		var height = size[1];
		if (width > sails.config.files.MAX_THUMB_WIDTH || height > sails.config.files.MAX_THUMB_HEIGHT) {
			sails.log.error('trying to get a oversize thumb', size);
			return res.send(400, 'Bad request');
		} 
		File.findOne({id: file_id}).exec(function(err, file) {
			if (err) {
				sails.log.error('file not found', file_id);
				res.send(404, 'Not found');
			}
			var file_path;
			if (file.isPhoto()) {
				file_path = UPLOAD_ROOT + '/' + file.owner + '/' + file.filename;
				gm(file_path)
				.resize(width,height, '^')
				.gravity('Center')
				.crop(width, height)
				.stream()
				.pipe(res);
			} else {
				file_path = ICON_ROOT + '/' + file.getExtension() + '.png';
				gm(file_path)
				.resize(null,height, '^')
				.gravity('Center')
				.extent(width, height)
				.stream()
				.pipe(res);
			}
		});
	},

	upload: function(req, res) {
		upload_dir = UPLOAD_ROOT + '/' + req.session.user.id;
		sails.log('User', req.session.user.id, 'is uploading a file');
		req.file('file').upload({
			dirname: upload_dir
		},function(err, files) {
			if (err) {
				sails.log.error('Upload fail', err);
				return res.serverError(err);
			}
			if (files.length == 0) return res.send("file empty", 411);
			var file = files[0];
			var org_name = file.filename;
			var file_ext = org_name.match(/\.([A-z0-9]*)$/)[0];
			var new_name = uuid.v1() + file_ext;
			fs.renameSync(upload_dir + '/' + org_name, upload_dir + '/' + new_name);
			sails.log('User', req.session.user.id, 'uploaded a file:', new_name);
			file.filename = new_name;
			file.owner = req.session.user.id;
			File.create(file).exec(function(err, file) {
				if (err) {
					sails.log.error('Can not add file to db', err);
					return res.serverError(err);
				}
				return res.json({
					message: files.length + ' file(s) uploaded successfully!',
					file: file
				});
			});
		});
	},

  public_upload: function(req, res) {
    var filename = uuid.v1() + '.png';
    var upload_dir = UPLOAD_ROOT + '/public/' + filename;
    sails.log('Someone is uploading a file');
    var imageData = req.param('data').replace(/^data:image\/png;base64,/, "");
    fs.writeFile(upload_dir, imageData, 'base64', function(err) {
      if (err) {
        sails.log.error('Upload fail', err);
        return res.serverError(err);
      }
      return res.json({
        file: filename
      });
    });
  }
};

