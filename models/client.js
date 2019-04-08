var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    phone:{type: String},
    email: {type: String},
    owner: {type: String, required: true},
  }
);

// Virtual for client's full name
ClientSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for client's URL
ClientSchema
.virtual('url')
.get(function () {
  return '/pattern/client/' + this._id;
});

//Export model
module.exports = mongoose.model('Client', ClientSchema);