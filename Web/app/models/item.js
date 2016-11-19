// Imports
var mongoose = require('mongoose');

// Define the schema
var itemSchema = mongoose.Schema({
  text: String,
  isComplete: {type: Boolean, default: false},
  created: {type: Date, default: Date.now},
  priority: {type: Number, min: 1, max: 3, default: 2},
  dueDate: {type: Date, default: null},
  reminderDate: {type: Date, default: null},
  notes: String,
  list: {type: mongoose.Schema.ObjectId, ref: 'List', default: null}
});

// Methods
itemSchema.methods.findSimilarList = function (cb) {
  return this.model('Item').find({list: this.list}, cb);
};

// create the model and expose it to the app
module.exports = mongoose.model('Item', itemSchema);
