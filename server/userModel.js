var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    desc: {type: String, required: true},
  }
);

module.exports = mongoose.model('userModel', userSchema);