const express = require('express');
const router = express.Router();
const { mockDatabase, updateStats } = require('../data/mockDatabase');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// POST /api/v1/webhook/booking-created - Webhook for when a booking is created
router.post('/booking-created', (req, res) => {
  try {
    console.log('📨 Webhook received: booking-created', req.body);
    
    // Simulate webhook processing
    const webhookData = {
      event: 'booking.created',
      timestamp: new Date().toISOString(),
      data: req.body,
      processed: true
    };
    
    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: webhookData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/v1/webhook/n8n - General webhook endpoint for n8n
router.post('/n8n', (req, res) => {
  try {
    console.log('🤖 n8n webhook received:', req.body);
    
    const { action, data } = req.body;
    
    let response = {
      success: true,
      action: action,
      timestamp: new Date().toISOString()
    };
    
    switch (action) {
      case 'checkAvailability':
        const { date, time } = data;
        const isAvailable = !mockDatabase.bookings.some(b => 
          b.date === date && 
          b.time === time && 
          b.status !== 'cancelled'
        );
        response.data = {
          available: isAvailable,
          date,
          time,
          message: isAvailable ? 'Slot is available' : 'Slot is already booked'
        };
        break;
        
      case 'getBookingsCount':
        const bookingsCount = mockDatabase.bookings.filter(b => 
          b.status === 'confirmed'
        ).length;
        response.data = {
          count: bookingsCount,
          message: `You have ${bookingsCount} confirmed bookings`
        };
        break;
        
      case 'getTodayBookings':
        const today = moment().format('YYYY-MM-DD');
        const todayBookings = mockDatabase.bookings.filter(b => 
          b.date === today && b.status === 'confirmed'
        );
        response.data = {
          count: todayBookings.length,
          bookings: todayBookings.map(b => ({
            id: b.id,
            clientName: b.clientName,
            service: b.service,
            time: b.time,
            price: b.price
          })),
          message: `You have ${todayBookings.length} bookings today`
        };
        break;
        
      case 'getUpcomingBookings':
        const upcoming = mockDatabase.bookings.filter(b => 
          moment(b.date).isAfter(moment()) && 
          b.status === 'confirmed'
        ).slice(0, 5);
        response.data = {
          count: upcoming.length,
          bookings: upcoming.map(b => ({
            id: b.id,
            clientName: b.clientName,
            service: b.service,
            date: b.date,
            time: b.time,
            price: b.price
          })),
          message: `You have ${upcoming.length} upcoming bookings`
        };
        break;
        
      case 'quickBooking':
        const { clientName, clientEmail, clientPhone, serviceId, bookingDate, bookingTime } = data;
        
        // Find service
        const service = mockDatabase.services.find(s => s.id === serviceId);
        if (!service) {
          response.success = false;
          response.error = 'Service not found';
          break;
        }
        
        // Check availability
        const slotTaken = mockDatabase.bookings.some(b => 
          b.date === bookingDate && 
          b.time === bookingTime && 
          b.status !== 'cancelled'
        );
        
        if (slotTaken) {
          response.success = false;
          response.error = 'Time slot not available';
          break;
        }
        
        // Create booking
        const newBooking = {
          id: uuidv4(),
          clientName,
          clientEmail,
          clientPhone,
          service: service.name,
          serviceId: service.id,
          date: bookingDate,
          time: bookingTime,
          duration: service.duration,
          price: service.price,
          depositAmount: Math.round(service.price * (service.depositPercentage / 100)),
          depositPaid: false,
          status: 'pending',
          notes: 'Created via n8n webhook',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        mockDatabase.bookings.push(newBooking);
        updateStats();
        
        response.data = {
          booking: newBooking,
          message: `Booking created successfully for ${clientName}`,
          depositLink: `http://localhost:3000/api/v1/bookings/${newBooking.id}/deposit`
        };
        break;
        
      case 'getServices':
        response.data = {
          services: mockDatabase.services.filter(s => s.available),
          message: `We have ${mockDatabase.services.filter(s => s.available).length} services available`
        };
        break;
        
      case 'getStats':
        updateStats();
        response.data = {
          stats: mockDatabase.stats,
          message: 'Here are your current statistics'
        };
        break;
        
      default:
        response.success = false;
        response.error = `Unknown action: ${action}`;
    }
    
    res.json(response);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/v1/webhook/test - Test webhook endpoint
router.post('/test', (req, res) => {
  console.log('🧪 Test webhook received:', req.body);
  
  res.json({
    success: true,
    message: 'Test webhook received successfully',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// GET /api/v1/webhook/actions - List available webhook actions
router.get('/actions', (req, res) => {
  res.json({
    success: true,
    message: 'Available webhook actions for n8n integration',
    actions: [
      {
        action: 'checkAvailability',
        description: 'Check if a specific time slot is available',
        requiredFields: ['date', 'time'],
        example: {
          action: 'checkAvailability',
          data: {
            date: '2024-12-20',
            time: '14:00'
          }
        }
      },
      {
        action: 'getBookingsCount',
        description: 'Get the total number of confirmed bookings',
        requiredFields: [],
        example: {
          action: 'getBookingsCount',
          data: {}
        }
      },
      {
        action: 'getTodayBookings',
        description: 'Get all bookings for today',
        requiredFields: [],
        example: {
          action: 'getTodayBookings',
          data: {}
        }
      },
      {
        action: 'getUpcomingBookings',
        description: 'Get upcoming confirmed bookings',
        requiredFields: [],
        example: {
          action: 'getUpcomingBookings',
          data: {}
        }
      },
      {
        action: 'quickBooking',
        description: 'Create a new booking quickly',
        requiredFields: ['clientName', 'clientEmail', 'clientPhone', 'serviceId', 'bookingDate', 'bookingTime'],
        example: {
          action: 'quickBooking',
          data: {
            clientName: 'John Doe',
            clientEmail: 'john@email.com',
            clientPhone: '+1-555-0123',
            serviceId: 'srv_001',
            bookingDate: '2024-12-25',
            bookingTime: '14:00'
          }
        }
      },
      {
        action: 'getServices',
        description: 'Get all available services',
        requiredFields: [],
        example: {
          action: 'getServices',
          data: {}
        }
      },
      {
        action: 'getStats',
        description: 'Get booking statistics',
        requiredFields: [],
        example: {
          action: 'getStats',
          data: {}
        }
      }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
