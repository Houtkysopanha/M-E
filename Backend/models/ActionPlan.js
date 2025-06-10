const mongoose = require('mongoose');

const actionPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
actionPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for creation year
actionPlanSchema.virtual('creationYear').get(function() {
  return this.createdAt.getFullYear();
});

// Ensure virtual fields are serialized
actionPlanSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('ActionPlan', actionPlanSchema);
