const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  pertanyaan: {
    type: String,
    required: true,
    trim: true,
  },
  jawaban: {
    type: String,
    required: true,
    trim: true,
  },
  kategori: {
    type: String,
    default: '', // Default to empty string instead of null
    trim: true,
  },
  urutan: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  helpful_count: {
    type: Number,
    default: 0,
  },
  not_helpful_count: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array,
    default: [], // Default to empty array instead of null
  },
}, { timestamps: true });

// Indexes
FAQSchema.index({ kategori: 1 });
FAQSchema.index({ is_active: 1 });
FAQSchema.index({ urutan: 1 });
FAQSchema.index({ views: 1 });

module.exports = mongoose.model('FAQ', FAQSchema);