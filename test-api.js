const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/tasks';

// Test data
const sampleTasks = [
  {
    title: 'Learn Node.js',
    description: 'Complete the Node.js tutorial and build a REST API',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    tags: ['learning', 'programming', 'nodejs']
  },
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ['documentation', 'important']
  },
  {
    title: 'Review code changes',
    description: 'Review pull requests and provide feedback',
    status: 'pending',
    priority: 'low',
    tags: ['code-review', 'teamwork']
  }
];

let createdTaskIds = [];

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Create Tasks
    console.log('2. Creating Sample Tasks...');
    for (const task of sampleTasks) {
      const response = await axios.post(BASE_URL, task);
      createdTaskIds.push(response.data.data._id);
      console.log(`✅ Created task: ${response.data.data.title}`);
    }
    console.log('');

    // Test 3: Get All Tasks
    console.log('3. Getting All Tasks...');
    const allTasksResponse = await axios.get(BASE_URL);
    console.log(`✅ Found ${allTasksResponse.data.results} tasks`);
    console.log(`📄 Pagination: Page ${allTasksResponse.data.pagination.currentPage} of ${allTasksResponse.data.pagination.totalPages}`);
    console.log('');

    // Test 4: Get Task Statistics
    console.log('4. Getting Task Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('✅ Task Statistics:');
    console.log(`   Total Tasks: ${statsResponse.data.data.overview.totalTasks}`);
    console.log(`   Completed: ${statsResponse.data.data.overview.completedTasks}`);
    console.log(`   Pending: ${statsResponse.data.data.overview.pendingTasks}`);
    console.log(`   In Progress: ${statsResponse.data.data.overview.inProgressTasks}`);
    console.log(`   Overdue: ${statsResponse.data.data.overview.overdueTasks}`);
    console.log('');

    // Test 5: Filter Tasks
    console.log('5. Testing Filters...');
    const pendingTasksResponse = await axios.get(`${BASE_URL}?status=pending`);
    console.log(`✅ Found ${pendingTasksResponse.data.results} pending tasks`);
    
    const highPriorityResponse = await axios.get(`${BASE_URL}?priority=high`);
    console.log(`✅ Found ${highPriorityResponse.data.results} high priority tasks`);
    console.log('');

    // Test 6: Search Tasks
    console.log('6. Testing Search...');
    const searchResponse = await axios.get(`${BASE_URL}?search=node`);
    console.log(`✅ Found ${searchResponse.data.results} tasks containing "node"`);
    console.log('');

    // Test 7: Get Single Task
    console.log('7. Getting Single Task...');
    if (createdTaskIds.length > 0) {
      const singleTaskResponse = await axios.get(`${BASE_URL}/${createdTaskIds[0]}`);
      console.log(`✅ Retrieved task: ${singleTaskResponse.data.data.title}`);
    }
    console.log('');

    // Test 8: Update Task
    console.log('8. Updating Task...');
    if (createdTaskIds.length > 0) {
      const updateResponse = await axios.put(`${BASE_URL}/${createdTaskIds[0]}`, {
        status: 'in-progress',
        description: 'Updated description for testing'
      });
      console.log(`✅ Updated task: ${updateResponse.data.data.title}`);
      console.log(`   New status: ${updateResponse.data.data.status}`);
    }
    console.log('');

    // Test 9: Mark Task as Completed
    console.log('9. Marking Task as Completed...');
    if (createdTaskIds.length > 1) {
      const completeResponse = await axios.patch(`${BASE_URL}/${createdTaskIds[1]}/complete`);
      console.log(`✅ Completed task: ${completeResponse.data.data.title}`);
      console.log(`   Completed at: ${completeResponse.data.data.completedAt}`);
    }
    console.log('');

    // Test 10: Sort Tasks
    console.log('10. Testing Sorting...');
    const sortedResponse = await axios.get(`${BASE_URL}?sortBy=createdAt&sortOrder=desc`);
    console.log(`✅ Retrieved ${sortedResponse.data.results} tasks sorted by creation date (newest first)`);
    console.log('');

    // Test 11: Pagination
    console.log('11. Testing Pagination...');
    const paginatedResponse = await axios.get(`${BASE_URL}?page=1&limit=2`);
    console.log(`✅ Pagination test: ${paginatedResponse.data.results} tasks on page ${paginatedResponse.data.pagination.currentPage}`);
    console.log(`   Total pages: ${paginatedResponse.data.pagination.totalPages}`);
    console.log('');

    // Test 12: Validation Error
    console.log('12. Testing Validation Error...');
    try {
      await axios.post(BASE_URL, {
        title: '', // Empty title should fail validation
        description: 'This should fail'
      });
    } catch (error) {
      console.log('✅ Validation error caught as expected:');
      console.log(`   Error: ${error.response.data.message}`);
      console.log(`   Field: ${error.response.data.errors[0].field}`);
    }
    console.log('');

    // Test 13: Delete Task
    console.log('13. Deleting Task...');
    if (createdTaskIds.length > 2) {
      const deleteResponse = await axios.delete(`${BASE_URL}/${createdTaskIds[2]}`);
      console.log(`✅ Deleted task: ${deleteResponse.data.message}`);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Final Statistics:');
    const finalStats = await axios.get(`${BASE_URL}/stats`);
    console.log(`   Total Tasks: ${finalStats.data.data.overview.totalTasks}`);
    console.log(`   Completed: ${finalStats.data.data.overview.completedTasks}`);
    console.log(`   Pending: ${finalStats.data.data.overview.pendingTasks}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Check if server is running before testing
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running, starting tests...\n');
    await testAPI();
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first:');
    console.error('   npm run dev');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  checkServer();
}

module.exports = { testAPI, checkServer }; 