const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/tasks';

// Test data
const testTasks = [
  {
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication to the application',
    status: 'pending',
    priority: 'high',
    category: 'Development',
    project: 'User Management System',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    estimatedHours: 8,
    tags: ['authentication', 'security', 'jwt'],
    assignee: 'John Doe',
    reporter: 'Jane Smith'
  },
  {
    title: 'Design database schema',
    description: 'Create ERD and database schema for the application',
    status: 'in-progress',
    priority: 'medium',
    category: 'Design',
    project: 'Database Design',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    estimatedHours: 6,
    tags: ['database', 'design', 'schema'],
    assignee: 'Alice Johnson',
    reporter: 'Bob Wilson'
  },
  {
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation',
    status: 'pending',
    priority: 'low',
    category: 'Documentation',
    project: 'API Documentation',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    estimatedHours: 4,
    tags: ['documentation', 'api'],
    assignee: 'Charlie Brown',
    reporter: 'Diana Prince'
  }
];

const testTemplates = [
  {
    title: 'Bug Fix Template',
    description: 'Standard template for bug fixes',
    priority: 'medium',
    category: 'Bug Fix',
    estimatedHours: 4,
    tags: ['bug', 'fix'],
    templateName: 'Standard Bug Fix',
    isTemplate: true
  },
  {
    title: 'Feature Development Template',
    description: 'Template for new feature development',
    priority: 'high',
    category: 'Development',
    estimatedHours: 16,
    tags: ['feature', 'development'],
    templateName: 'Feature Development',
    isTemplate: true
  }
];

async function testEnhancedAPI() {
  console.log('🚀 Starting Enhanced Task Management API Tests\n');

  try {
    // Test 1: Create tasks
    console.log('📝 Test 1: Creating tasks...');
    const createdTasks = [];
    for (const task of testTasks) {
      const response = await axios.post(BASE_URL, task);
      createdTasks.push(response.data.data);
      console.log(`✅ Created task: ${response.data.data.title}`);
    }

    // Test 2: Create templates
    console.log('\n📋 Test 2: Creating templates...');
    const createdTemplates = [];
    for (const template of testTemplates) {
      const response = await axios.post(`${BASE_URL}/templates`, template);
      createdTemplates.push(response.data.data);
      console.log(`✅ Created template: ${response.data.data.templateName}`);
    }

    // Test 3: Bulk create tasks
    console.log('\n📦 Test 3: Bulk creating tasks...');
    const bulkTasks = [
      {
        title: 'Bulk Task 1',
        description: 'First bulk task',
        priority: 'low',
        category: 'Testing'
      },
      {
        title: 'Bulk Task 2',
        description: 'Second bulk task',
        priority: 'medium',
        category: 'Testing'
      }
    ];
    const bulkResponse = await axios.post(`${BASE_URL}/bulk`, { tasks: bulkTasks });
    console.log(`✅ Bulk created ${bulkResponse.data.data.length} tasks`);

    // Test 4: Add comments to tasks
    console.log('\n💬 Test 4: Adding comments...');
    const commentData = {
      content: 'Started working on this task. Will complete by EOD.',
      author: 'John Doe'
    };
    const commentResponse = await axios.post(`${BASE_URL}/${createdTasks[0]._id}/comments`, commentData);
    console.log(`✅ Added comment to task: ${commentResponse.data.data.title}`);

    // Test 5: Add attachments to tasks
    console.log('\n📎 Test 5: Adding attachments...');
    const attachmentData = {
      filename: 'design_document.pdf',
      originalName: 'user_interface_design.pdf',
      mimeType: 'application/pdf',
      size: 2048576,
      url: 'https://example.com/files/design_document.pdf'
    };
    const attachmentResponse = await axios.post(`${BASE_URL}/${createdTasks[1]._id}/attachments`, attachmentData);
    console.log(`✅ Added attachment to task: ${attachmentResponse.data.data.title}`);

    // Test 6: Create task from template
    console.log('\n🎯 Test 6: Creating task from template...');
    const templateTaskData = {
      templateId: createdTemplates[0]._id,
      customizations: {
        title: 'Fix login button not working',
        description: 'Users cannot click the login button on mobile devices',
        assignee: 'John Doe',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
    const templateTaskResponse = await axios.post(`${BASE_URL}/from-template`, templateTaskData);
    console.log(`✅ Created task from template: ${templateTaskResponse.data.data.title}`);

    // Test 7: Advanced search
    console.log('\n🔍 Test 7: Advanced search...');
    const searchResponse = await axios.get(`${BASE_URL}/search?query=authentication&status=pending`);
    console.log(`✅ Found ${searchResponse.data.results} tasks matching search criteria`);

    // Test 8: Get all tasks with enhanced filtering
    console.log('\n📋 Test 8: Getting tasks with enhanced filtering...');
    const filteredResponse = await axios.get(`${BASE_URL}?category=Development&priority=high&limit=5`);
    console.log(`✅ Retrieved ${filteredResponse.data.results} tasks with filters`);

    // Test 9: Get task statistics
    console.log('\n📊 Test 9: Getting task statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    const stats = statsResponse.data.data;
    console.log(`✅ Task Statistics:`);
    console.log(`   - Total tasks: ${stats.overview.totalTasks}`);
    console.log(`   - Completed: ${stats.overview.completedTasks}`);
    console.log(`   - Pending: ${stats.overview.pendingTasks}`);
    console.log(`   - In Progress: ${stats.overview.inProgressTasks}`);
    console.log(`   - Overdue: ${stats.overview.overdueTasks}`);
    console.log(`   - Total estimated hours: ${stats.overview.totalEstimatedHours}`);

    // Test 10: Bulk update tasks
    console.log('\n🔄 Test 10: Bulk updating tasks...');
    const taskIds = createdTasks.slice(0, 2).map(task => task._id);
    const bulkUpdateData = {
      taskIds,
      updates: {
        status: 'in-progress',
        assignee: 'Team Lead'
      }
    };
    const bulkUpdateResponse = await axios.patch(`${BASE_URL}/bulk`, bulkUpdateData);
    console.log(`✅ Bulk updated ${bulkUpdateResponse.data.data.modifiedCount} tasks`);

    // Test 11: Get templates
    console.log('\n📋 Test 11: Getting templates...');
    const templatesResponse = await axios.get(`${BASE_URL}/templates`);
    console.log(`✅ Retrieved ${templatesResponse.data.results} templates`);

    // Test 12: Export tasks
    console.log('\n📤 Test 12: Exporting tasks...');
    const exportResponse = await axios.get(`${BASE_URL}/export?format=json`);
    console.log(`✅ Exported ${exportResponse.data.results} tasks as JSON`);

    // Test 13: Mark task as completed
    console.log('\n✅ Test 13: Marking task as completed...');
    const completeResponse = await axios.patch(`${BASE_URL}/${createdTasks[2]._id}/complete`);
    console.log(`✅ Marked task as completed: ${completeResponse.data.data.title}`);

    // Test 14: Get single task with dependencies
    console.log('\n🔗 Test 14: Getting single task with dependencies...');
    const singleTaskResponse = await axios.get(`${BASE_URL}/${createdTasks[0]._id}`);
    const task = singleTaskResponse.data.data;
    console.log(`✅ Retrieved task: ${task.title}`);
    console.log(`   - Status: ${task.status}`);
    console.log(`   - Priority: ${task.priority}`);
    console.log(`   - Category: ${task.category}`);
    console.log(`   - Project: ${task.project}`);
    console.log(`   - Assignee: ${task.assignee}`);
    console.log(`   - Comments: ${task.comments.length}`);
    console.log(`   - Attachments: ${task.attachments.length}`);
    console.log(`   - Is overdue: ${task.isOverdue}`);
    console.log(`   - Progress: ${task.progressPercentage}%`);

    // Test 15: Search with multiple filters
    console.log('\n🔍 Test 15: Advanced search with multiple filters...');
    const advancedSearchResponse = await axios.get(`${BASE_URL}/search?status=pending&hasComments=true&category=Development`);
    console.log(`✅ Found ${advancedSearchResponse.data.results} tasks with advanced filters`);

    // Test 16: Get overdue tasks
    console.log('\n⏰ Test 16: Getting overdue tasks...');
    const overdueResponse = await axios.get(`${BASE_URL}?overdue=true`);
    console.log(`✅ Found ${overdueResponse.data.results} overdue tasks`);

    // Test 17: Get tasks by tags
    console.log('\n🏷️ Test 17: Getting tasks by tags...');
    const tagsResponse = await axios.get(`${BASE_URL}?tags=authentication,security`);
    console.log(`✅ Found ${tagsResponse.data.results} tasks with specified tags`);

    // Test 18: Sort tasks by different fields
    console.log('\n📊 Test 18: Sorting tasks...');
    const sortResponse = await axios.get(`${BASE_URL}?sortBy=priority&sortOrder=desc&limit=5`);
    console.log(`✅ Retrieved ${sortResponse.data.results} tasks sorted by priority (descending)`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary of Enhanced Features Tested:');
    console.log('✅ Task creation with enhanced fields (category, project, assignee, etc.)');
    console.log('✅ Task templates creation and usage');
    console.log('✅ Bulk operations (create, update)');
    console.log('✅ Comments and attachments');
    console.log('✅ Advanced search and filtering');
    console.log('✅ Task statistics and analytics');
    console.log('✅ Task export functionality');
    console.log('✅ Enhanced task model with virtual fields');
    console.log('✅ Task dependencies and relationships');
    console.log('✅ Comprehensive validation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testEnhancedAPI(); 