var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
  },
  tags: [{
    type: String
  }],
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
},{ timestamps:true })

module.exports = mongoose.model('Article',articleSchema);