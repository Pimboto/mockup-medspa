const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Calendly Configuration
const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN;
const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_USER_URI = process.env.CALENDLY_USER_URI;

// Headers for Calendly
const calendlyHeaders = {
  'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
  'Content-Type': 'application/json'
};

// Middlewares
app.use(cors());
app.use(express.json());

// Services data
let servicesData = null;
let calendlyConnected = false;
let calendlyUserInfo = null;
let calendlyEventTypes = [];

// ============================================
// TEST CALENDLY CONNECTION ON STARTUP
// ============================================
async function testCalendlyConnection() {
  console.log('\n📡 Testing Calendly Connection...');
  console.log('================================');
  
  if (!CALENDLY_API_TOKEN || CALENDLY_API_TOKEN === 'your_personal_access_token_here') {
    console.error('❌ CALENDLY_API_TOKEN not configured in .env');
    console.log('📝 Get your token from: https://calendly.com → Settings → Integrations');
    return false;
  }
  
  try {
    // Test 1: Get current user
    console.log('🔍 Fetching user info...');
    const userResponse = await axios.get(
      `${CALENDLY_API_BASE}/users/me`,
      { headers: calendlyHeaders }
    );
    
    calendlyUserInfo = userResponse.data.resource;
    console.log('✅ User:', calendlyUserInfo.name);
    console.log('✅ Email:', calendlyUserInfo.email);
    console.log('✅ User URI:', calendlyUserInfo.uri);
    
    // Test 2: Get event types
    console.log('\n🔍 Fetching event types...');
    const eventTypesResponse = await axios.get(
      `${CALENDLY_API_BASE}/event_types`,
      {
        headers: calendlyHeaders,
        params: {
          user: calendlyUserInfo.uri,
          active: true
        }
      }
    );
    
    calendlyEventTypes = eventTypesResponse.data.collection;
    console.log(`✅ Found ${calendlyEventTypes.length} active event types:`);
    calendlyEventTypes.forEach((et, index) => {
      console.log(`   ${index + 1}. ${et.name} (${et.duration} min)`);
      console.log(`      URI: ${et.uri}`);
      console.log(`      URL: ${et.scheduling_url}`);
    });
    
    // Test 3: Check if configured event type exists
    if (process.env.CALENDLY_EVENT_TYPE_URI) {
      const configuredEventType = calendlyEventTypes.find(et => 
        et.uri === process.env.CALENDLY_EVENT_TYPE_URI
      );
      
      if (configuredEventType) {
        console.log(`\n✅ Configured event type found: ${configuredEventType.name}`);
      } else {
        console.log('\n⚠️ Warning: Configured CALENDLY_EVENT_TYPE_URI not found in your event types');
        console.log('   Update .env with one of the URIs listed above');
      }
    } else {
      console.log('\n⚠️ CALENDLY_EVENT_TYPE_URI not configured in .env');
      console.log('   Add one of the URIs listed above to your .env file');
    }
    
    // Test 4: Try to get scheduled events
    console.log('\n🔍 Checking scheduled events...');
    const eventsResponse = await axios.get(
      `${CALENDLY_API_BASE}/scheduled_events`,
      {
        headers: calendlyHeaders,
        params: {
          user: calendlyUserInfo.uri,
          count: 5
        }
      }
    );
    
    const events = eventsResponse.data.collection;
    console.log(`✅ You have ${events.length} upcoming events`);
    
    calendlyConnected = true;
    console.log('\n✅ ✅ ✅ CALENDLY CONNECTION SUCCESSFUL! ✅ ✅ ✅');
    console.log('================================\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ CALENDLY CONNECTION FAILED!');
    console.error('Error:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 401) {
      console.error('\n🔑 Invalid API Token. Please check your CALENDLY_API_TOKEN in .env');
    } else if (error.response?.status === 404) {
      console.error('\n📍 Invalid URI. Please check your CALENDLY_USER_URI in .env');
    }
    
    console.log('\n📝 To get your credentials:');
    console.log('1. Get API Token: https://calendly.com → Settings → Integrations');
    console.log('2. Get User URI: curl https://api.calendly.com/users/me -H "Authorization: Bearer YOUR_TOKEN"');
    console.log('================================\n');
    
    return false;
  }
}

// ============================================
// LOAD SERVICES FROM JSON
// ============================================
async function loadServices() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'services.json'), 'utf8');
    servicesData = JSON.parse(data);
    console.log(`✅ Loaded ${servicesData.services.length} services from JSON`);
    return true;
  } catch (error) {
    console.error('❌ Error loading services.json:', error.message);
    servicesData = { services: [] };
    return false;
  }
}

// ============================================
// INITIALIZE ON STARTUP
// ============================================
async function initialize() {
  console.log('\n🚀 Starting MedSpa Booking System...');
  console.log('=====================================');
  
  // Load services
  await loadServices();
  
  // Test Calendly connection
  await testCalendlyConnection();
  
  console.log('Ready to serve requests!\n');
}

// ============================================
// MAIN ROUTE - STATUS CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'MedSpa Booking API - Calendly Integration',
    status: {
      server: 'running',
      port: PORT,
      services: servicesData ? `${servicesData.services.length} loaded` : 'not loaded',
      calendly: {
        connected: calendlyConnected,
        user: calendlyUserInfo ? calendlyUserInfo.name : null,
        eventTypes: calendlyEventTypes.length,
        configured: {
          token: !!CALENDLY_API_TOKEN && CALENDLY_API_TOKEN !== 'your_personal_access_token_here',
          userUri: !!CALENDLY_USER_URI,
          eventTypeUri: !!process.env.CALENDLY_EVENT_TYPE_URI
        }
      }
    },
    endpoints: {
      services: '/api/services',
      availability: '/api/availability',
      bookings: '/api/bookings',
      calendly: {
        eventTypes: '/api/calendly/event-types',
        user: '/api/calendly/user'
      }
    }
  });
});

// ============================================
// SERVICES ENDPOINTS (LOCAL JSON)
// ============================================
app.get('/api/services', async (req, res) => {
  if (!servicesData) {
    await loadServices();
  }
  
  const { category } = req.query;
  let services = servicesData.services || [];
  
  if (category) {
    services = services.filter(s => s.category === category);
  }
  
  res.json({
    success: true,
    total: services.length,
    source: 'local',
    services
  });
});

app.get('/api/services/categories', async (req, res) => {
  if (!servicesData) {
    await loadServices();
  }
  
  const categories = [...new Set(servicesData.services.map(s => s.category))];
  
  res.json({
    success: true,
    categories
  });
});

app.get('/api/services/:id', async (req, res) => {
  if (!servicesData) {
    await loadServices();
  }
  
  const service = servicesData.services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  res.json({
    success: true,
    service
  });
});

// ============================================
// CALENDLY ENDPOINTS
// ============================================
app.get('/api/availability', async (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected',
      message: 'Using default availability',
      availableTimes: [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
      ]
    });
  }
  
  try {
    const startTime = req.query.date || new Date().toISOString();
    const endTime = new Date(new Date(startTime).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const response = await axios.get(
      `${CALENDLY_API_BASE}/event_type_available_times`,
      {
        headers: calendlyHeaders,
        params: {
          event_type: process.env.CALENDLY_EVENT_TYPE_URI || calendlyEventTypes[0]?.uri,
          start_time: startTime,
          end_time: endTime
        }
      }
    );
    
    res.json({
      success: true,
      source: 'calendly',
      availableTimes: response.data.collection || []
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.response?.data?.message || error.message,
      availableTimes: []
    });
  }
});

app.get('/api/bookings', async (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected',
      bookings: []
    });
  }
  
  try {
    const params = {
      user: calendlyUserInfo.uri,
      count: 100,
      sort: 'start_time:desc'
    };
    
    if (req.query.email) {
      params.invitee_email = req.query.email;
    }
    
    const response = await axios.get(
      `${CALENDLY_API_BASE}/scheduled_events`,
      {
        headers: calendlyHeaders,
        params
      }
    );
    
    const bookings = response.data.collection.map(event => ({
      id: event.uri.split('/').pop(),
      name: event.name,
      startTime: event.start_time,
      endTime: event.end_time,
      status: event.status,
      location: event.location?.location || 'TBD'
    }));
    
    res.json({
      success: true,
      total: bookings.length,
      bookings
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.response?.data?.message || error.message,
      bookings: []
    });
  }
});

app.post('/api/bookings', async (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected',
      message: 'Please configure Calendly in .env file'
    });
  }
  
  try {
    const { userName, userEmail, userPhone, serviceId, notes } = req.body;
    
    const service = servicesData.services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Create scheduling link
    const response = await axios.post(
      `${CALENDLY_API_BASE}/scheduling_links`,
      {
        max_event_count: 1,
        owner: process.env.CALENDLY_EVENT_TYPE_URI || calendlyEventTypes[0]?.uri,
        owner_type: 'EventType'
      },
      { headers: calendlyHeaders }
    );
    
    const bookingUrl = response.data.resource.booking_url + 
      `?name=${encodeURIComponent(userName)}` +
      `&email=${encodeURIComponent(userEmail)}` +
      `&a1=${encodeURIComponent(userPhone)}` +
      `&a2=${encodeURIComponent(service.name)}` +
      `&a3=${encodeURIComponent(notes || '')}`;
    
    res.json({
      success: true,
      booking: {
        userName,
        userEmail,
        service: service.name,
        price: `$${service.price}`,
        schedulingLink: bookingUrl,
        message: 'Click the link to select your preferred time'
      }
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

app.delete('/api/bookings/:eventId', async (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected'
    });
  }
  
  try {
    await axios.post(
      `${CALENDLY_API_BASE}/scheduled_events/${req.params.eventId}/cancellation`,
      { reason: req.body.reason || 'Canceled by client' },
      { headers: calendlyHeaders }
    );
    
    res.json({
      success: true,
      message: 'Booking canceled successfully'
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

app.get('/api/calendly/event-types', (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected',
      eventTypes: []
    });
  }
  
  res.json({
    success: true,
    eventTypes: calendlyEventTypes.map(et => ({
      id: et.uri,
      name: et.name,
      duration: et.duration,
      url: et.scheduling_url
    }))
  });
});

app.get('/api/calendly/user', (req, res) => {
  if (!calendlyConnected) {
    return res.json({
      success: false,
      error: 'Calendly not connected'
    });
  }
  
  res.json({
    success: true,
    user: calendlyUserInfo
  });
});

// Start server
app.listen(PORT, async () => {
  // Initialize everything
  await initialize();
  
  console.log('=====================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log('=====================================');
  console.log('📝 Test with: curl http://localhost:3000/');
  console.log('=====================================\n');
});
