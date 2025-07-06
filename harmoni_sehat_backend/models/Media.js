const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  model_type: {
    type: String,
    required: true,
  },
  model_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mime_type: {
    type: String,
  },
  size: {
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Media', MediaSchema);