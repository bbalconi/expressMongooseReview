var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChairSchema = new Schema({
  model:  String,
  type: String,
});

module.exports = mongoose.model("Chair", ChairSchema);