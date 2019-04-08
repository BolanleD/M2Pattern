var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DAvatarSchema = new Schema({
  name: {type: String, required: true},
  client: {type: Schema.ObjectId, ref: 'Client', required: true},
  owner: {type: String, required:true},
  waist: {type: Number, required: true},
  hip: {type: Number, required: true},
  side_hip_depth: {type: Number, required: true},
  front_hip_depth: {type: Number, required: true},
  back_hip_depth: {type: Number, required: true},
  skirt_length: {type: Number, required: true},
  back_hip_arc: {type: Number, required: true}

});

// Virtual for davatar's URL
DAvatarSchema
.virtual('url')
.get(function () {
  return '/pattern/davatar/' + this._id;
});

//Export model
module.exports = mongoose.model('DAvatar', DAvatarSchema);
  