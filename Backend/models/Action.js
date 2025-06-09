const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Action data is required']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Prevent modification of creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're handling timestamps manually for better control
});

// Update the updatedAt field before saving
actionSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Instance method to check if action can be modified (same year)
actionSchema.methods.canModify = function() {
  const currentYear = new Date().getFullYear();
  const actionYear = this.createdAt.getFullYear();
  return currentYear === actionYear;
};

// Static method to find actions by user and year
actionSchema.statics.findByUserAndYear = function(userId, year) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  
  return this.find({
    userId: userId,
    createdAt: {
      $gte: startOfYear,
      $lt: endOfYear
    }
  }).sort({ createdAt: -1 });
};

// Static method to find all actions by user
actionSchema.statics.findByUser = function(userId) {
  return this.find({ userId: userId }).sort({ createdAt: -1 });
};

// Virtual for getting the year of creation
actionSchema.virtual('creationYear').get(function() {
  return this.createdAt.getFullYear();
});

// Ensure virtual fields are serialized
actionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Action', actionSchema);
