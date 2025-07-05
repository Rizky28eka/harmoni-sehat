const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Made required as per user's no-null request for FKs
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  entity_type: {
    type: String,
    required: true,
    trim: true,
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId, // Assuming entity_id refers to an ObjectId
    required: true, // Made required as per user's no-null request
  },
  old_values: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  new_values: {
    type: Object,
    default: {}, // Default to empty object instead of null
  },
  ip_address: {
    type: String,
    default: '',
    trim: true,
  },
  user_agent: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
AuditTrailSchema.index({ user_id: 1 });
AuditTrailSchema.index({ action: 1 });
AuditTrailSchema.index({ entity_type: 1 });
AuditTrailSchema.index({ entity_id: 1 });
AuditTrailSchema.index({ severity: 1 });
AuditTrailSchema.index({ created_at: 1 });

module.exports = mongoose.model('AuditTrail', AuditTrailSchema);