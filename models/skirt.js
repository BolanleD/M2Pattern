var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SkirtSchema = new Schema({
  name: {type: String, required: true},
  waist: {type: Number, required: true},
  hip: {type: Number, required: true},
  side_hip_depth: {type: Number, required: true},
  front_hip_depth: {type: Number, required: true},
  back_hip_depth: {type: Number, required: true},
  skirt_length: {type: Number, required: true},
  back_hip_arc: {type: Number, required: true}

});

// Virtual for avatar's URL
SkirtSchema
.virtual('url')
.get(function () {
  return '/pattern/skirt/' + this._id;
});

//Export model
module.exports = mongoose.model('Skirt', SkirtSchema);
  