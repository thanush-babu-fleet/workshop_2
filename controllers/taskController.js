const Task = require('../models/Task');

// Get all tasks with filtering, sorting, and pagination
exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.isCompleted !== undefined) {
      filter.isCompleted = req.query.isCompleted === 'true';
    }
    if (req.query.category) filter.category = req.query.category;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.reporter) filter.reporter = req.query.reporter;
    if (req.query.isTemplate !== undefined) {
      filter.isTemplate = req.query.isTemplate === 'true';
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
        { project: { $regex: req.query.search, $options: 'i' } },
        { assignee: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      filter.tags = { $in: tags };
    }
    if (req.query.overdue === 'true') {
      filter.$and = [
        { dueDate: { $exists: true, $ne: null } },
        { dueDate: { $lt: new Date() } },
        { isCompleted: false }
      ];
    }

    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const order = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = order;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    const tasks = await Task.find(filter)
      .populate('dependencies', 'title status')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('dependencies', 'title status isCompleted');
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('dependencies', 'title status');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Mark task as completed
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        isCompleted: true,
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    ).populate('dependencies', 'title status');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task marked as completed',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete task',
      error: error.message
    });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { content, author } = req.body;
    
    if (!content || !author) {
      return res.status(400).json({
        status: 'error',
        message: 'Content and author are required'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            content,
            author
          }
        }
      },
      { new: true }
    ).populate('dependencies', 'title status');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Comment added successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Add attachment to task
exports.addAttachment = async (req, res) => {
  try {
    const { filename, originalName, mimeType, size, url } = req.body;
    
    if (!filename || !originalName || !mimeType || !size || !url) {
      return res.status(400).json({
        status: 'error',
        message: 'All attachment fields are required'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          attachments: {
            filename,
            originalName,
            mimeType,
            size,
            url
          }
        }
      },
      { new: true }
    ).populate('dependencies', 'title status');

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Attachment added successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add attachment',
      error: error.message
    });
  }
};

// Bulk create tasks
exports.bulkCreateTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Tasks array is required and cannot be empty'
      });
    }

    const createdTasks = await Task.insertMany(tasks);

    res.status(201).json({
      status: 'success',
      message: `${createdTasks.length} tasks created successfully`,
      data: createdTasks
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create tasks',
      error: error.message
    });
  }
};

// Bulk update tasks
exports.bulkUpdateTasks = async (req, res) => {
  try {
    const { taskIds, updates } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Task IDs array is required and cannot be empty'
      });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds } },
      updates,
      { runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} tasks updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update tasks',
      error: error.message
    });
  }
};

// Bulk delete tasks
exports.bulkDeleteTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Task IDs array is required and cannot be empty'
      });
    }

    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} tasks deleted successfully`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete tasks',
      error: error.message
    });
  }
};

// Create task template
exports.createTemplate = async (req, res) => {
  try {
    const templateData = {
      ...req.body,
      isTemplate: true
    };

    const template = await Task.create(templateData);
    
    res.status(201).json({
      status: 'success',
      message: 'Task template created successfully',
      data: template
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create template',
      error: error.message
    });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Task.find({ isTemplate: true })
      .select('-history -comments -attachments');

    res.status(200).json({
      status: 'success',
      results: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

// Create task from template
exports.createFromTemplate = async (req, res) => {
  try {
    const { templateId, customizations } = req.body;
    
    const template = await Task.findById(templateId);
    if (!template || !template.isTemplate) {
      return res.status(404).json({
        status: 'error',
        message: 'Template not found'
      });
    }

    const taskData = {
      title: customizations.title || template.title,
      description: customizations.description || template.description,
      priority: customizations.priority || template.priority,
      category: customizations.category || template.category,
      project: customizations.project || template.project,
      estimatedHours: customizations.estimatedHours || template.estimatedHours,
      tags: customizations.tags || template.tags,
      dueDate: customizations.dueDate || template.dueDate,
      assignee: customizations.assignee || template.assignee,
      reporter: customizations.reporter || template.reporter
    };

    const newTask = await Task.create(taskData);
    
    res.status(201).json({
      status: 'success',
      message: 'Task created from template successfully',
      data: newTask
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create task from template',
      error: error.message
    });
  }
};

// Export tasks
exports.exportTasks = async (req, res) => {
  try {
    const { format = 'json', filters = {} } = req.query;
    
    // Build filter object
    const filter = {};
    if (filters.status) filter.status = filters.status;
    if (filters.priority) filter.priority = filters.priority;
    if (filters.category) filter.category = filters.category;
    if (filters.project) filter.project = filters.project;
    if (filters.isCompleted !== undefined) {
      filter.isCompleted = filters.isCompleted === 'true';
    }

    const tasks = await Task.find(filter)
      .populate('dependencies', 'title')
      .select('-history');

    if (format === 'csv') {
      const csvData = tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        project: task.project,
        dueDate: task.dueDate,
        assignee: task.assignee,
        reporter: task.reporter,
        isCompleted: task.isCompleted,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
      
      // Simple CSV conversion
      const csv = [
        Object.keys(csvData[0] || {}).join(','),
        ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      res.send(csv);
    } else {
      res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: tasks
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to export tasks',
      error: error.message
    });
  }
};

// Advanced search
exports.advancedSearch = async (req, res) => {
  try {
    const {
      query,
      status,
      priority,
      category,
      project,
      assignee,
      tags,
      dateFrom,
      dateTo,
      isCompleted,
      hasAttachments,
      hasComments
    } = req.query;

    const filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { project: { $regex: query, $options: 'i' } },
        { assignee: { $regex: query, $options: 'i' } }
      ];
    }

    // Filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (project) filter.project = project;
    if (assignee) filter.assignee = assignee;
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true';
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Has attachments/comments
    if (hasAttachments === 'true') {
      filter['attachments.0'] = { $exists: true };
    }
    if (hasComments === 'true') {
      filter['comments.0'] = { $exists: true };
    }

    const tasks = await Task.find(filter)
      .populate('dependencies', 'title status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to perform advanced search',
      error: error.message
    });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$dueDate', null] },
                    { $gt: ['$dueDate', new Date()] },
                    { $ne: ['$isCompleted', true] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalEstimatedHours: { $sum: { $ifNull: ['$estimatedHours', 0] } },
          totalActualHours: { $sum: { $ifNull: ['$actualHours', 0] } }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Task.aggregate([
      {
        $match: { category: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const projectStats = await Task.aggregate([
      {
        $match: { project: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          overdueTasks: 0,
          totalEstimatedHours: 0,
          totalActualHours: 0
        },
        priorityBreakdown: priorityStats,
        categoryBreakdown: categoryStats,
        projectBreakdown: projectStats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch task statistics',
      error: error.message
    });
  }
}; 