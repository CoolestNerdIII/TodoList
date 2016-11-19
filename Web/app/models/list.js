// Imports
var mongoose = require('mongoose');

// Define the schema
var listSchema = mongoose.Schema({
  name: String,
  description: String,
  created: {type: Date, default: Date.now},
  archived: {type: Boolean, default: false},
  priority: {type: Number, min: 0, max: 10, default: 5},
  backgroundColor: String,
});

// Methods
listSchema.methods.getItems = function (cb) {
  return Item.find({list: this._id}, cb);
};

// create the model and expose it to the app
module.exports = mongoose.model('List', listSchema);
