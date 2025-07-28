const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateQueryParams,
  validateTaskId,
  validateComment,
  validateAttachment,
  handleValidationErrors
} = require('../middleware/validateTask');

// Apply validation middleware to all routes
router.use(validateQueryParams, handleValidationErrors);

// GET /api/tasks - Get all tasks with filtering, sorting, and pagination
router.get('/', taskController.getAllTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', taskController.getTaskStats);

// GET /api/tasks/search - Advanced search
router.get('/search', taskController.advancedSearch);

// GET /api/tasks/export - Export tasks
router.get('/export', taskController.exportTasks);

// GET /api/tasks/templates - Get all templates
router.get('/templates', taskController.getTemplates);

// POST /api/tasks - Create a new task
router.post('/', validateCreateTask, handleValidationErrors, taskController.createTask);

// POST /api/tasks/bulk - Bulk create tasks
router.post('/bulk', taskController.bulkCreateTasks);

// POST /api/tasks/templates - Create a task template
router.post('/templates', validateCreateTask, handleValidationErrors, taskController.createTemplate);

// POST /api/tasks/from-template - Create task from template
router.post('/from-template', taskController.createFromTemplate);

// PATCH /api/tasks/bulk - Bulk update tasks
router.patch('/bulk', taskController.bulkUpdateTasks);

// DELETE /api/tasks/bulk - Bulk delete tasks
router.delete('/bulk', taskController.bulkDeleteTasks);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', validateTaskId, handleValidationErrors, taskController.getTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateUpdateTask, handleValidationErrors, taskController.updateTask);

// PATCH /api/tasks/:id - Partially update a task
router.patch('/:id', validateUpdateTask, handleValidationErrors, taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateTaskId, handleValidationErrors, taskController.deleteTask);

// PATCH /api/tasks/:id/complete - Mark task as completed
router.patch('/:id/complete', validateTaskId, handleValidationErrors, taskController.completeTask);

// POST /api/tasks/:id/comments - Add comment to task
router.post('/:id/comments', validateTaskId, validateComment, handleValidationErrors, taskController.addComment);

// POST /api/tasks/:id/attachments - Add attachment to task
router.post('/:id/attachments', validateTaskId, validateAttachment, handleValidationErrors, taskController.addAttachment);

module.exports = router; 