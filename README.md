# Notes/Tasks REST API

A complete REST API for managing notes and tasks built with Node.js, Express, and MongoDB.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- 🔍 **Advanced Filtering** - Filter by status, priority, completion status
- 🔎 **Search Functionality** - Search tasks by title and description
- 📄 **Pagination** - Efficient data pagination with metadata
- 📊 **Statistics** - Get task overview and priority breakdown
- ✅ **Task Completion** - Mark tasks as completed with timestamps
- 🏷️ **Tagging System** - Add tags to organize tasks
- ⏰ **Due Date Management** - Set and track due dates with overdue detection
- 🔒 **Input Validation** - Comprehensive validation with detailed error messages
- 🛡️ **Security** - Helmet.js for security headers
- 📝 **Logging** - Request logging with Morgan
- 🌐 **CORS Support** - Cross-origin resource sharing enabled

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd workshop#2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` and modify the MongoDB connection string if needed
   - Default configuration uses local MongoDB: `mongodb://localhost:27017/notes-tasks-api`

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas cloud service

5. **Run the application:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api/tasks
```

### Health Check
```
GET /health
```

### Task Endpoints

#### 1. Get All Tasks
```
GET /api/tasks
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `status` (string) - Filter by status: `pending`, `in-progress`, `completed`, `cancelled`
- `priority` (string) - Filter by priority: `low`, `medium`, `high`, `urgent`
- `isCompleted` (boolean) - Filter by completion status: `true`, `false`
- `search` (string) - Search in title and description
- `sortBy` (string) - Sort field: `title`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt`
- `sortOrder` (string) - Sort order: `asc`, `desc`

**Example:**
```bash
GET /api/tasks?page=1&limit=5&status=pending&priority=high&sortBy=createdAt&sortOrder=desc
```

#### 2. Get Task Statistics
```
GET /api/tasks/stats
```

Returns overview statistics and priority breakdown.

#### 3. Get Single Task
```
GET /api/tasks/:id
```

#### 4. Create Task
```
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the new feature",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15T23:59:59.000Z",
  "tags": ["documentation", "important"],
  "isCompleted": false
}
```

#### 5. Update Task
```
PUT /api/tasks/:id
PATCH /api/tasks/:id
```

#### 6. Delete Task
```
DELETE /api/tasks/:id
```

#### 7. Mark Task as Completed
```
PATCH /api/tasks/:id/complete
```

## Data Model

### Task Schema
```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  status: String (enum: pending, in-progress, completed, cancelled),
  priority: String (enum: low, medium, high, urgent),
  dueDate: Date (optional, cannot be in past),
  tags: [String] (optional, max 10 tags, 20 chars each),
  isCompleted: Boolean (default: false),
  completedAt: Date (auto-set when completed),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Example Usage

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Node.js",
    "description": "Complete the Node.js tutorial and build a REST API",
    "priority": "high",
    "dueDate": "2024-01-20T23:59:59.000Z",
    "tags": ["learning", "programming"]
  }'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/tasks?status=pending&priority=high
```

### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "description": "Updated description"
  }'
```

### Mark Task as Completed
```bash
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/complete
```

### Get Task Statistics
```bash
curl http://localhost:3000/api/tasks/stats
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "tags": ["documentation", "important"],
    "isCompleted": false,
    "isOverdue": false,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required",
      "value": ""
    }
  ]
}
```

### Paginated Response
```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [...]
}
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

All errors include detailed messages and field-specific validation errors.

## Development

### Project Structure
```
workshop#2/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
├── models/
│   └── Task.js           # Task model schema
├── controllers/
│   └── taskController.js  # Business logic
├── routes/
│   └── taskRoutes.js     # API routes
├── middleware/
│   └── validateTask.js   # Input validation
└── README.md             # Documentation
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (placeholder)

## Security Features

- **Helmet.js** - Security headers
- **Input Validation** - Comprehensive validation
- **CORS** - Cross-origin resource sharing
- **Request Logging** - HTTP request logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development. 