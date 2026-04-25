const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);
