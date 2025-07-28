const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating a task
exports.validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  
  body('project')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Project name cannot be more than 100 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  
  body('estimatedHours')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Estimated hours must be between 0 and 1000'),
  
  body('actualHours')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Actual hours must be between 0 and 1000'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      return true;
    }),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag cannot be more than 20 characters'),
  
  body('dependencies')
    .optional()
    .isArray()
    .withMessage('Dependencies must be an array'),
  
  body('dependencies.*')
    .optional()
    .isMongoId()
    .withMessage('Each dependency must be a valid task ID'),
  
  body('assignee')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assignee name cannot be more than 100 characters'),
  
  body('reporter')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reporter name cannot be more than 100 characters'),
  
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),
  
  body('reminderDate')
    .optional()
    .isISO8601()
    .withMessage('Reminder date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Reminder date cannot be in the past');
      }
      return true;
    }),
  
  body('isTemplate')
    .optional()
    .isBoolean()
    .withMessage('isTemplate must be a boolean'),
  
  body('templateName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Template name cannot be more than 100 characters')
];

// Validation rules for updating a task
exports.validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  
  body('project')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Project name cannot be more than 100 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  
  body('estimatedHours')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Estimated hours must be between 0 and 1000'),
  
  body('actualHours')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Actual hours must be between 0 and 1000'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      return true;
    }),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag cannot be more than 20 characters'),
  
  body('dependencies')
    .optional()
    .isArray()
    .withMessage('Dependencies must be an array'),
  
  body('dependencies.*')
    .optional()
    .isMongoId()
    .withMessage('Each dependency must be a valid task ID'),
  
  body('assignee')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assignee name cannot be more than 100 characters'),
  
  body('reporter')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reporter name cannot be more than 100 characters'),
  
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),
  
  body('reminderDate')
    .optional()
    .isISO8601()
    .withMessage('Reminder date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Reminder date cannot be in the past');
      }
      return true;
    }),
  
  body('isTemplate')
    .optional()
    .isBoolean()
    .withMessage('isTemplate must be a boolean'),
  
  body('templateName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Template name cannot be more than 100 characters')
];

// Validation rules for query parameters
exports.validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot be more than 50 characters'),
  
  query('project')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Project filter cannot be more than 100 characters'),
  
  query('assignee')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assignee filter cannot be more than 100 characters'),
  
  query('reporter')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reporter filter cannot be more than 100 characters'),
  
  query('isCompleted')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isCompleted must be true or false'),
  
  query('isTemplate')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isTemplate must be true or false'),
  
  query('overdue')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('overdue must be true or false'),
  
  query('tags')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tags filter cannot be more than 200 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt', 'category', 'project', 'assignee'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search term must be between 1 and 50 characters')
];

// Validation rules for task ID parameter
exports.validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

// Validation rules for comments
exports.validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot be more than 1000 characters'),
  
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 100 })
    .withMessage('Author name cannot be more than 100 characters')
];

// Validation rules for attachments
exports.validateAttachment = [
  body('filename')
    .trim()
    .notEmpty()
    .withMessage('Filename is required')
    .isLength({ max: 255 })
    .withMessage('Filename cannot be more than 255 characters'),
  
  body('originalName')
    .trim()
    .notEmpty()
    .withMessage('Original filename is required')
    .isLength({ max: 255 })
    .withMessage('Original filename cannot be more than 255 characters'),
  
  body('mimeType')
    .trim()
    .notEmpty()
    .withMessage('MIME type is required')
    .isLength({ max: 100 })
    .withMessage('MIME type cannot be more than 100 characters'),
  
  body('size')
    .isInt({ min: 1 })
    .withMessage('File size must be a positive integer'),
  
  body('url')
    .trim()
    .notEmpty()
    .withMessage('File URL is required')
    .isURL()
    .withMessage('File URL must be a valid URL')
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
}; 