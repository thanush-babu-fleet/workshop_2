# Enhanced Task Management API Documentation

## Overview
This enhanced Task Management API provides comprehensive task management capabilities with advanced features including task dependencies, comments, attachments, bulk operations, templates, and more.

## Base URL
```
http://localhost:3000/api/tasks
```

## Authentication
Currently, the API doesn't require authentication. In a production environment, you should implement JWT or session-based authentication.

## Enhanced Features

### 1. Task Categories & Projects
Organize tasks by categories and projects for better management.

### 2. Task Dependencies
Link tasks that depend on other tasks to create workflow relationships.

### 3. Comments & Collaboration
Add comments to tasks for team collaboration and communication.

### 4. File Attachments
Attach files to tasks (metadata storage - actual file upload would need separate implementation).

### 5. Task Templates
Create reusable task templates for common workflows.

### 6. Bulk Operations
Perform operations on multiple tasks simultaneously.

### 7. Advanced Search & Filtering
Powerful search capabilities with multiple filter options.

### 8. Task Export
Export tasks in JSON or CSV format.

### 9. Enhanced Statistics
Comprehensive task analytics and reporting.

### 10. Task History
Track all changes made to tasks with audit trail.

## API Endpoints

### Core Task Operations

#### Get All Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of tasks per page (default: 10, max: 100)
- `status` (string): Filter by status (pending, in-progress, completed, cancelled)
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `category` (string): Filter by category
- `project` (string): Filter by project
- `assignee` (string): Filter by assignee
- `reporter` (string): Filter by reporter
- `isCompleted` (boolean): Filter by completion status
- `isTemplate` (boolean): Filter by template status
- `overdue` (boolean): Filter for overdue tasks
- `tags` (string): Comma-separated list of tags
- `search` (string): Search in title, description, category, project, assignee
- `sortBy` (string): Sort field (title, status, priority, dueDate, createdAt, updatedAt, category, project, assignee)
- `sortOrder` (string): Sort order (asc, desc)

**Example:**
```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high&page=1&limit=20"
```

#### Get Single Task
```http
GET /api/tasks/:id
```

**Example:**
```bash
curl "http://localhost:3000/api/tasks/64f8a1b2c3d4e5f6a7b8c9d0"
```

#### Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the application",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "project": "User Management System",
  "dueDate": "2024-01-15T23:59:59.000Z",
  "estimatedHours": 8,
  "tags": ["authentication", "security", "jwt"],
  "assignee": "John Doe",
  "reporter": "Jane Smith",
  "reminderDate": "2024-01-14T09:00:00.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/:id
PATCH /api/tasks/:id
```

**Request Body:** (same as create, but all fields are optional)

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Mark Task as Completed
```http
PATCH /api/tasks/:id/complete
```

### Enhanced Features

#### Task Comments

##### Add Comment
```http
POST /api/tasks/:id/comments
```

**Request Body:**
```json
{
  "content": "Started working on the authentication module. Will complete by EOD.",
  "author": "John Doe"
}
```

#### Task Attachments

##### Add Attachment
```http
POST /api/tasks/:id/attachments
```

**Request Body:**
```json
{
  "filename": "auth_design.pdf",
  "originalName": "authentication_design_document.pdf",
  "mimeType": "application/pdf",
  "size": 2048576,
  "url": "https://example.com/files/auth_design.pdf"
}
```

### Bulk Operations

#### Bulk Create Tasks
```http
POST /api/tasks/bulk
```

**Request Body:**
```json
{
  "tasks": [
    {
      "title": "Task 1",
      "description": "Description 1",
      "priority": "high",
      "category": "Development"
    },
    {
      "title": "Task 2",
      "description": "Description 2",
      "priority": "medium",
      "category": "Testing"
    }
  ]
}
```

#### Bulk Update Tasks
```http
PATCH /api/tasks/bulk
```

**Request Body:**
```json
{
  "taskIds": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "updates": {
    "status": "in-progress",
    "assignee": "John Doe"
  }
}
```

#### Bulk Delete Tasks
```http
DELETE /api/tasks/bulk
```

**Request Body:**
```json
{
  "taskIds": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"]
}
```

### Task Templates

#### Create Template
```http
POST /api/tasks/templates
```

**Request Body:**
```json
{
  "title": "Bug Fix Template",
  "description": "Standard template for bug fixes",
  "priority": "medium",
  "category": "Bug Fix",
  "estimatedHours": 4,
  "tags": ["bug", "fix"],
  "templateName": "Standard Bug Fix"
}
```

#### Get All Templates
```http
GET /api/tasks/templates
```

#### Create Task from Template
```http
POST /api/tasks/from-template
```

**Request Body:**
```json
{
  "templateId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "customizations": {
    "title": "Fix login button not working",
    "description": "Users cannot click the login button on mobile devices",
    "assignee": "John Doe",
    "dueDate": "2024-01-20T23:59:59.000Z"
  }
}
```

### Advanced Search

#### Advanced Search
```http
GET /api/tasks/search
```

**Query Parameters:**
- `query` (string): Text search across multiple fields
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `category` (string): Filter by category
- `project` (string): Filter by project
- `assignee` (string): Filter by assignee
- `tags` (string): Comma-separated tags
- `dateFrom` (string): Start date for creation date range
- `dateTo` (string): End date for creation date range
- `isCompleted` (boolean): Filter by completion status
- `hasAttachments` (boolean): Filter tasks with attachments
- `hasComments` (boolean): Filter tasks with comments

**Example:**
```bash
curl "http://localhost:3000/api/tasks/search?query=authentication&status=pending&hasComments=true&dateFrom=2024-01-01"
```

### Export

#### Export Tasks
```http
GET /api/tasks/export
```

**Query Parameters:**
- `format` (string): Export format (json, csv) - default: json
- `filters` (object): Filter criteria for export

**Example:**
```bash
# Export as JSON
curl "http://localhost:3000/api/tasks/export?format=json"

# Export as CSV
curl "http://localhost:3000/api/tasks/export?format=csv"
```

### Statistics

#### Get Task Statistics
```http
GET /api/tasks/stats
```

**Response includes:**
- Total tasks count
- Completed tasks count
- Pending tasks count
- In-progress tasks count
- Overdue tasks count
- Total estimated hours
- Total actual hours
- Priority breakdown
- Category breakdown
- Project breakdown

## Enhanced Task Model

The enhanced task model includes the following additional fields:

```json
{
  "title": "string (required, max 100 chars)",
  "description": "string (max 500 chars)",
  "status": "enum (pending, in-progress, completed, cancelled)",
  "priority": "enum (low, medium, high, urgent)",
  "category": "string (max 50 chars)",
  "project": "string (max 100 chars)",
  "dueDate": "date",
  "estimatedHours": "number (0-1000)",
  "actualHours": "number (0-1000)",
  "tags": ["string array (max 10 tags, 20 chars each)"],
  "dependencies": ["ObjectId array (task IDs)"],
  "assignee": "string (max 100 chars)",
  "reporter": "string (max 100 chars)",
  "isCompleted": "boolean",
  "completedAt": "date",
  "comments": [
    {
      "content": "string (required, max 1000 chars)",
      "author": "string (required, max 100 chars)",
      "createdAt": "date"
    }
  ],
  "attachments": [
    {
      "filename": "string (required)",
      "originalName": "string (required)",
      "mimeType": "string (required)",
      "size": "number (required)",
      "url": "string (required)",
      "uploadedAt": "date"
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
  "templateName": "string (max 100 chars)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Virtual Fields

The API also provides these computed fields:

- `isOverdue`: Boolean indicating if the task is overdue
- `progressPercentage`: Number (0-100) indicating task progress
- `timeRemaining`: Time remaining until due date (in milliseconds)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message",
      "value": "invalidValue"
    }
  ]
}
```

## Success Responses

All successful operations return:

```json
{
  "status": "success",
  "message": "Operation description",
  "data": {
    // Response data
  }
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting using middleware like `express-rate-limit`.

## CORS

CORS is enabled for all origins. In production, configure it to allow only specific domains.

## Security Headers

The API uses Helmet.js to set security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (in production)

## Testing

Use the included `test-api.js` file to test the API endpoints:

```bash
npm test
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `config.env`:
```
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

4. For development with auto-restart:
```bash
npm run dev
```

## Future Enhancements

Potential future enhancements could include:
- Real-time notifications using WebSockets
- File upload functionality with cloud storage
- User authentication and authorization
- Task time tracking
- Gantt chart visualization
- Email notifications for due dates
- Mobile app support
- API versioning
- GraphQL support 