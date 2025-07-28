const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateQueryParams,
  validateTaskId,
  handleValidationErrors
} = require('../middleware/validateTask');

// Apply validation middleware to all routes
router.use(validateQueryParams, handleValidationErrors);

// GET /api/tasks - Get all tasks with filtering, sorting, and pagination
router.get('/', taskController.getAllTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', taskController.getTaskStats);

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', validateTaskId, handleValidationErrors, taskController.getTask);

// POST /api/tasks - Create a new task
router.post('/', validateCreateTask, handleValidationErrors, taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateUpdateTask, handleValidationErrors, taskController.updateTask);

// PATCH /api/tasks/:id - Partially update a task
router.patch('/:id', validateUpdateTask, handleValidationErrors, taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateTaskId, handleValidationErrors, taskController.deleteTask);

// PATCH /api/tasks/:id/complete - Mark task as completed
router.patch('/:id/complete', validateTaskId, handleValidationErrors, taskController.completeTask);

module.exports = router; 