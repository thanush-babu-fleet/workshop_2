const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const taskHistorySchema = new mongoose.Schema({
  field: {
    type: String,
    required: [true, 'Field name is required']
  },
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  changedBy: {
    type: String,
    required: [true, 'User who made the change is required']
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  project: {
    type: String,
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    max: [1000, 'Estimated hours cannot exceed 1000']
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    max: [1000, 'Actual hours cannot exceed 1000']
  },
  tags: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    validate: {
      validator: function(value) {
        return value.toString() !== this._id.toString();
      },
      message: 'Task cannot depend on itself'
    }
  }],
  assignee: {
    type: String,
    trim: true,
    maxlength: [100, 'Assignee name cannot be more than 100 characters']
  },
  reporter: {
    type: String,
    trim: true,
    maxlength: [100, 'Reporter name cannot be more than 100 characters']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  comments: [commentSchema],
  attachments: [attachmentSchema],
  history: [taskHistorySchema],
  reminderDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'Reminder date cannot be in the past'
    }
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String,
    trim: true,
    maxlength: [100, 'Template name cannot be more than 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.isCompleted) return false;
  return new Date() > this.dueDate;
});

// Virtual for progress percentage
taskSchema.virtual('progressPercentage').get(function() {
  if (this.isCompleted) return 100;
  if (this.status === 'pending') return 0;
  if (this.status === 'in-progress') return 50;
  return 0;
});

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  if (!this.dueDate || this.isCompleted) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diff = due - now;
  return diff > 0 ? diff : 0;
});

// Pre-save middleware to set completedAt and track history
taskSchema.pre('save', function(next) {
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  } else if (!this.isCompleted) {
    this.completedAt = undefined;
  }
  next();
});

// Pre-save middleware to track changes
taskSchema.pre('save', function(next) {
  if (this.isNew) return next();
  
  const modifiedFields = this.modifiedPaths();
  const changes = [];
  
  modifiedFields.forEach(field => {
    if (field !== 'history' && field !== 'comments' && field !== 'attachments') {
      changes.push({
        field,
        oldValue: this._original[field],
        newValue: this[field],
        changedBy: 'system', // In a real app, this would come from auth context
        changedAt: new Date()
      });
    }
  });
  
  if (changes.length > 0) {
    this.history.push(...changes);
  }
  
  next();
});

// Indexes for better query performance
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isCompleted: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ isTemplate: 1 });
taskSchema.index({ reminderDate: 1 });

module.exports = mongoose.model('Task', taskSchema); 