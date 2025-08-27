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
      bookingLink: '/api/booking-link',
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
    // Validate that we have an event type URI
    const eventTypeUri = process.env.CALENDLY_EVENT_TYPE_URI || calendlyEventTypes[0]?.uri;
    
    if (!eventTypeUri) {
      return res.json({
        success: false,
        error: 'No event type configured',
        message: 'Please configure CALENDLY_EVENT_TYPE_URI in .env file or create an event type in Calendly',
        availableEventTypes: calendlyEventTypes.map(et => ({
          uri: et.uri,
          name: et.name,
          duration: et.duration
        }))
      });
    }
    
    // Parse and validate date
    const now = new Date();
    let startTime;
    
    if (req.query.date) {
      // If user provides a date
      const requestedDate = req.query.date;
      startTime = new Date(requestedDate);
      
      if (isNaN(startTime.getTime())) {
        return res.json({
          success: false,
          error: 'Invalid date format',
          message: 'Please provide date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)',
          example: new Date().toISOString()
        });
      }
      
      // If it's just a date (YYYY-MM-DD), check if it's today
      if (requestedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const today = now.toISOString().split('T')[0];
        const requestedDateOnly = requestedDate;
        
        if (requestedDateOnly === today) {
          // If it's today, start from current time
          startTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour buffer
        } else if (new Date(requestedDateOnly) < new Date(today)) {
          // If it's in the past
          return res.json({
            success: false,
            error: 'Date must be in the future',
            message: `Cannot check availability for past dates. Today is ${today}`,
            requestedDate: requestedDateOnly
          });
        }
        // If it's a future date, keep the original time (midnight)
      }
    } else {
      // No date provided, use current time + 1 hour
      startTime = new Date(now.getTime() + 60 * 60 * 1000);
    }
    
    // Ensure start time is in the future
    if (startTime <= now) {
      startTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour buffer
    }
    
    // Calculate end time (7 days from start)
    const endTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    console.log('Fetching availability:', {
      eventType: eventTypeUri,
      currentTime: now.toISOString(),
      requestedDate: req.query.date || 'not provided',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isToday: req.query.date === now.toISOString().split('T')[0]
    });
    
    const response = await axios.get(
      `${CALENDLY_API_BASE}/event_type_available_times`,
      {
        headers: calendlyHeaders,
        params: {
          event_type: eventTypeUri,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        }
      }
    );
    
    // Simplify the response for AI agents - only time and formatted
    const simplifiedTimes = response.data.collection.map(slot => ({
      time: slot.start_time.split('T')[1].replace('Z', ''),
      formatted: new Date(slot.start_time).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }));

    res.json({
      success: true,
      source: 'calendly',
      requestedDate: req.query.date || 'current',
      totalSlots: simplifiedTimes.length,
      availableTimes: simplifiedTimes
    });
    
  } catch (error) {
    console.error('Availability error:', error.response?.data || error.message);
    
    res.json({
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data?.details || 'Check server logs for more information',
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
    
    // Filter by email if provided
    if (req.query.email) {
      params.invitee_email = req.query.email;
      console.log(`Filtering bookings for email: ${req.query.email}`);
    }
    
    // Filter by phone if provided
    if (req.query.phone) {
      // Note: Calendly doesn't have direct phone filtering, we'll filter after fetching
      console.log(`Will filter bookings for phone: ${req.query.phone}`);
    }
    
    const response = await axios.get(
      `${CALENDLY_API_BASE}/scheduled_events`,
      {
        headers: calendlyHeaders,
        params
      }
    );
    
    // Get invitee details for each event
    const bookingsWithDetails = await Promise.all(
      response.data.collection.map(async (event) => {
        try {
          // Get invitees for this event
          const inviteesResponse = await axios.get(
            event.uri + '/invitees',
            { headers: calendlyHeaders }
          );
          
          const invitee = inviteesResponse.data.collection[0];
          
          const booking = {
            id: event.uri.split('/').pop(),
            name: event.name,
            startTime: event.start_time,
            endTime: event.end_time,
            status: event.status,
            location: event.location?.location || 'TBD',
            invitee: {
              name: invitee?.name || 'Unknown',
              email: invitee?.email || 'Unknown',
              phone: invitee?.text_reminder_number || 'Not provided'
            }
          };
          
          // Filter by phone if requested
          if (req.query.phone && invitee?.text_reminder_number !== req.query.phone) {
            return null;
          }
          
          return booking;
        } catch (err) {
          console.error('Error fetching invitee details:', err.message);
          return {
            id: event.uri.split('/').pop(),
            name: event.name,
            startTime: event.start_time,
            endTime: event.end_time,
            status: event.status,
            location: event.location?.location || 'TBD',
            invitee: {
              name: 'Error loading',
              email: 'Error loading',
              phone: 'Error loading'
            }
          };
        }
      })
    );
    
    // Filter out nulls (from phone filtering)
    const bookings = bookingsWithDetails.filter(booking => booking !== null);
    
    res.json({
      success: true,
      total: bookings.length,
      filters: {
        email: req.query.email || null,
        phone: req.query.phone || null
      },
      bookings
    });
    
  } catch (error) {
    console.error('Bookings error:', error.response?.data || error.message);
    res.json({
      success: false,
      error: error.response?.data?.message || error.message,
      bookings: []
    });
  }
});

// Create a personalized booking link
app.get('/api/booking-link', async (req, res) => {
  const { name, email, phone, serviceId, notes } = req.query;
  
  // Validate required parameters
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      required: ['name', 'email'],
      optional: ['phone', 'serviceId', 'notes']
    });
  }
  
  try {
    // Get service details if serviceId provided
    let service = null;
    if (serviceId) {
      service = servicesData.services.find(s => s.id === serviceId);
      if (!service) {
        return res.status(404).json({ 
          success: false,
          error: 'Service not found' 
        });
      }
    }
    
    // Base URL for booking (you can customize this)
    const baseUrl = process.env.BASE_URL 
      ? `${process.env.BASE_URL}/booking`
      : `http://localhost:${PORT}/booking`;
    
    // Create URL with pre-filled parameters
    const params = new URLSearchParams({
      name: name,
      email: email,
      ...(phone && { phone: phone }),
      ...(serviceId && { serviceId: serviceId }),
      ...(service && { serviceName: service.name }),
      ...(service && { servicePrice: service.price }),
      ...(notes && { notes: notes })
    });
    
    const bookingLink = `${baseUrl}?${params.toString()}`;
    
    // If Calendly is connected, also create a Calendly link
    let calendlyLink = null;
    if (calendlyConnected) {
      try {
        const response = await axios.post(
          `${CALENDLY_API_BASE}/scheduling_links`,
          {
            max_event_count: 1,
            owner: process.env.CALENDLY_EVENT_TYPE_URI || calendlyEventTypes[0]?.uri,
            owner_type: 'EventType'
          },
          { headers: calendlyHeaders }
        );
        
        calendlyLink = response.data.resource.booking_url + 
          `?name=${encodeURIComponent(name)}` +
          `&email=${encodeURIComponent(email)}` +
          `&a1=${encodeURIComponent(phone || '')}` +
          `&a2=${encodeURIComponent(service?.name || '')}` +
          `&a3=${encodeURIComponent(notes || '')}`;
      } catch (err) {
        console.error('Error creating Calendly link:', err.message);
      }
    }
    
    res.json({
      success: true,
      links: {
        booking: bookingLink,
        calendly: calendlyLink
      },
      prefilledData: {
        name,
        email,
        phone: phone || 'Not provided',
        service: service ? {
          id: service.id,
          name: service.name,
          price: `$${service.price}`
        } : null,
        notes: notes || null
      },
      message: 'Use these links to send to the customer with their information pre-filled'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
