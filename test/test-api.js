const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    // Test creating a user activity
    console.log('Testing POST /api/activities...');
    const createResponse = await axios.post(`${API_URL}/activities`, {
      userId: 'test-user-1',
      activityType: 'login',
      metadata: {
        ip: '127.0.0.1',
        userAgent: 'Test Agent'
      }
    });
    console.log('Create activity response:', createResponse.data);

    // Wait for the message to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test retrieving activities
    console.log('\nTesting GET /api/activities...');
    const getResponse = await axios.get(`${API_URL}/activities?userId=test-user-1`);
    console.log('Get activities response:', getResponse.data);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI(); 