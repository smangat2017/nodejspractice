var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  api: String,
  title: String,
  source: String,
  upvotes: Number
});

module.exports = mongoose.model('Post', postSchema);
