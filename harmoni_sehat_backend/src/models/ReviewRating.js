const mongoose = require('mongoose');

const ReviewRatingSchema = new mongoose.Schema({
  konsultasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konsultasi',
    required: true, // Made required as per user's no-null request for FKs
  },
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewed_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review_text: {
    type: String,
    default: '',
    trim: true,
  },
  review_type: {
    type: String,
    enum: ['doctor', 'apotek', 'kurir', 'aplikasi', 'klinik', 'rumah_sakit'],
    required: true,
  },
  is_anonymous: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: true,
  },
  rating_aspects: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  response_from_reviewed: {
    type: String,
    default: '',
    trim: true,
  },
  response_date: {
    type: Date,
    default: new Date(0), // Default to epoch instead of null
  },
}, { timestamps: true });

// Indexes
ReviewRatingSchema.index({ konsultasi_id: 1 });
ReviewRatingSchema.index({ reviewer_id: 1 });
ReviewRatingSchema.index({ reviewed_id: 1 });
ReviewRatingSchema.index({ review_type: 1 });
ReviewRatingSchema.index({ rating: 1 });
ReviewRatingSchema.index({ is_approved: 1 });
ReviewRatingSchema.index({ created_at: 1 });

module.exports = mongoose.model('ReviewRating', ReviewRatingSchema);