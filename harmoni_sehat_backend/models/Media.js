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
    type: Number, // in bytes
  },
}, { timestamps: true });

MediaSchema.index({ model_type: 1, model_id: 1 });

module.exports = mongoose.model('Media', MediaSchema);
