// api/blog/models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true, unique: true },
  content: { type: String },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
