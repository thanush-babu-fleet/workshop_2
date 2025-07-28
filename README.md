# Enhanced Task Management API

A comprehensive REST API for task management built with Node.js, Express, and MongoDB. This enhanced version includes advanced features for professional task management and team collaboration.

## 🚀 Enhanced Features

### Core Features
- ✅ **CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Advanced Filtering** - Filter by status, priority, category, project, assignee, and more
- ✅ **Pagination** - Efficient data loading with page-based pagination
- ✅ **Search** - Full-text search across multiple fields
- ✅ **Sorting** - Sort by any field in ascending or descending order

### 🆕 New Enhanced Features

#### 1. **Task Categories & Projects**
- Organize tasks by categories (Development, Design, Testing, etc.)
- Group tasks by projects for better project management
- Filter and sort by categories and projects

#### 2. **Task Dependencies**
- Link tasks that depend on other tasks
- Create workflow relationships between tasks
- Track dependent task completion status

#### 3. **Comments & Collaboration**
- Add comments to tasks for team communication
- Track comment history with timestamps
- Support for multiple comments per task

#### 4. **File Attachments**
- Attach files to tasks (metadata storage)
- Support for various file types and sizes
- Track attachment upload history

#### 5. **Task Templates**
- Create reusable task templates
- Standardize common workflows
- Quick task creation from templates

#### 6. **Bulk Operations**
- Bulk create multiple tasks at once
- Bulk update tasks with common changes
- Bulk delete tasks efficiently

#### 7. **Advanced Search & Filtering**
- Multi-field text search
- Date range filtering
- Filter by task properties (has attachments, has comments)
- Tag-based filtering

#### 8. **Task Export**
- Export tasks in JSON format
- Export tasks in CSV format
- Filtered exports based on criteria

#### 9. **Enhanced Statistics**
- Comprehensive task analytics
- Priority breakdown
- Category and project statistics
- Time tracking (estimated vs actual hours)

#### 10. **Task History & Audit Trail**
- Track all changes made to tasks
- Complete audit trail with timestamps
- Change history for compliance

#### 11. **Time Tracking**
- Estimated hours for planning
- Actual hours for tracking
- Progress monitoring

#### 12. **Advanced Task Properties**
- Assignee and reporter fields
- Reminder dates for notifications
- Template support
- Virtual fields (overdue status, progress percentage)

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator
- **Security**: Helmet.js, CORS
- **Logging**: Morgan
- **Environment**: Dotenv

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd task-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `config.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=3000
NODE_ENV=development
```

4. **Start the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 🧪 Testing

### Basic API Tests
```bash
npm test
```

### Enhanced Features Tests
```bash
npm run test:enhanced
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/tasks
```

### Key Endpoints

#### Core Operations
- `GET /api/tasks` - Get all tasks with filtering and pagination
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

#### Enhanced Features
- `POST /api/tasks/bulk` - Bulk create tasks
- `PATCH /api/tasks/bulk` - Bulk update tasks
- `DELETE /api/tasks/bulk` - Bulk delete tasks
- `POST /api/tasks/templates` - Create task template
- `GET /api/tasks/templates` - Get all templates
- `POST /api/tasks/from-template` - Create task from template
- `POST /api/tasks/:id/comments` - Add comment to task
- `POST /api/tasks/:id/attachments` - Add attachment to task
- `GET /api/tasks/search` - Advanced search
- `GET /api/tasks/export` - Export tasks
- `GET /api/tasks/stats` - Get task statistics

### Example Usage

#### Create a Task with Enhanced Fields
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication",
    "status": "pending",
    "priority": "high",
    "category": "Development",
    "project": "User Management System",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "estimatedHours": 8,
    "tags": ["authentication", "security"],
    "assignee": "John Doe",
    "reporter": "Jane Smith"
  }'
```

#### Bulk Create Tasks
```bash
curl -X POST http://localhost:3000/api/tasks/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "title": "Task 1",
        "priority": "high",
        "category": "Development"
      },
      {
        "title": "Task 2",
        "priority": "medium",
        "category": "Testing"
      }
    ]
  }'
```

#### Advanced Search
```bash
curl "http://localhost:3000/api/tasks/search?query=authentication&status=pending&hasComments=true"
```

#### Export Tasks
```bash
# Export as JSON
curl "http://localhost:3000/api/tasks/export?format=json"

# Export as CSV
curl "http://localhost:3000/api/tasks/export?format=csv"
```

## 📊 Enhanced Task Model

The enhanced task model includes:

```json
{
  "title": "string (required)",
  "description": "string",
  "status": "pending|in-progress|completed|cancelled",
  "priority": "low|medium|high|urgent",
  "category": "string",
  "project": "string",
  "dueDate": "date",
  "estimatedHours": "number",
  "actualHours": "number",
  "tags": ["string array"],
  "dependencies": ["task IDs"],
  "assignee": "string",
  "reporter": "string",
  "comments": [
    {
      "content": "string",
      "author": "string",
      "createdAt": "date"
    }
  ],
  "attachments": [
    {
      "filename": "string",
      "originalName": "string",
      "mimeType": "string",
      "size": "number",
      "url": "string"
    }
  ],
  "history": [
    {
      "field": "string",
      "oldValue": "mixed",
      "newValue": "mixed",
      "changedBy": "string",
      "changedAt": "date"
    }
  ],
  "reminderDate": "date",
  "isTemplate": "boolean",
  "templateName": "string"
}
```

## 🔍 Advanced Filtering & Search

### Query Parameters
- `status` - Filter by task status
- `priority` - Filter by priority level
- `category` - Filter by category
- `project` - Filter by project
- `assignee` - Filter by assignee
- `reporter` - Filter by reporter
- `tags` - Filter by tags (comma-separated)
- `overdue` - Filter for overdue tasks
- `hasAttachments` - Filter tasks with attachments
- `hasComments` - Filter tasks with comments
- `dateFrom/dateTo` - Date range filtering

### Search Examples
```bash
# Search for authentication tasks
GET /api/tasks/search?query=authentication

# Find high priority pending tasks
GET /api/tasks?priority=high&status=pending

# Get overdue tasks
GET /api/tasks?overdue=true

# Find tasks with comments
GET /api/tasks/search?hasComments=true

# Filter by multiple tags
GET /api/tasks?tags=authentication,security
```

## 📈 Statistics & Analytics

The API provides comprehensive statistics:

- Total tasks count
- Completed vs pending tasks
- Priority breakdown
- Category and project statistics
- Time tracking metrics
- Overdue task analysis

## 🔒 Security Features

- **Input Validation** - Comprehensive validation using express-validator
- **Security Headers** - Helmet.js for security headers
- **CORS Protection** - Configurable CORS settings
- **Error Handling** - Consistent error responses
- **Data Sanitization** - Input sanitization and validation

## 🚀 Performance Features

- **Database Indexing** - Optimized indexes for fast queries
- **Pagination** - Efficient data loading
- **Query Optimization** - Optimized MongoDB queries
- **Response Caching** - Ready for caching implementation

## 📝 API Documentation

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and MongoDB** 