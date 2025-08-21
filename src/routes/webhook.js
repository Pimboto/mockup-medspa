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
      case 'checkAvailability': {
        const { date, time, serviceId } = data;
        const isAvailable = !mockDatabase.bookings.some(b => 
          b.date === date && 
          b.time === time && 
          b.status !== 'cancelled'
        );
        
        if (isAvailable) {
          response.data = {
            available: true,
            date,
            time,
            message: `Great news! ${date} at ${time} is available.`
          };
        } else {
          // Find alternative slots
          const alternatives = [];
          const targetDate = moment(date);
          const dayOfWeek = targetDate.format('dddd').toLowerCase();
          const businessHours = mockDatabase.availability.businessHours[dayOfWeek];
          
          // Check same day different times
          const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
          for (const slot of timeSlots) {
            if (slot !== time && businessHours && businessHours.isOpen) {
              const slotAvailable = !mockDatabase.bookings.some(b => 
                b.date === date && 
                b.time === slot && 
                b.status !== 'cancelled'
              );
              if (slotAvailable && alternatives.length < 3) {
                alternatives.push({ date, time: slot });
              }
            }
          }
          
          // Check next 3 days at the same time
          for (let i = 1; i <= 3 && alternatives.length < 5; i++) {
            const nextDate = moment(date).add(i, 'days').format('YYYY-MM-DD');
            const nextDayOfWeek = moment(nextDate).format('dddd').toLowerCase();
            const nextBusinessHours = mockDatabase.availability.businessHours[nextDayOfWeek];
            
            if (nextBusinessHours && nextBusinessHours.isOpen) {
              const slotAvailable = !mockDatabase.bookings.some(b => 
                b.date === nextDate && 
                b.time === time && 
                b.status !== 'cancelled'
              );
              if (slotAvailable) {
                alternatives.push({ date: nextDate, time });
              }
            }
          }
          
          response.data = {
            available: false,
            date,
            time,
            alternatives,
            message: `Sorry, ${date} at ${time} is not available. Here are some alternatives:`,
            alternativesText: alternatives.map(alt => `${alt.date} at ${alt.time}`).join(', ')
          };
        }
        break;
      }
        
      case 'getBookingsCount': {
        const bookingsCount = mockDatabase.bookings.filter(b => 
          b.status === 'confirmed'
        ).length;
        response.data = {
          count: bookingsCount,
          message: `You have ${bookingsCount} confirmed bookings`
        };
        break;
      }
        
      case 'getTodayBookings': {
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
      }
        
      case 'getUpcomingBookings': {
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
      }
        
      case 'quickBooking': {
        const { clientName, clientEmail, clientPhone, serviceId: serviceIdBooking, bookingDate, bookingTime } = data;
        
        // Find service
        const service = mockDatabase.services.find(s => s.id === serviceIdBooking);
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
        
        // For the new service structure, we'll use default values for quick booking
        // In a real implementation, you'd need to specify which areas/packages to book
        const defaultDuration = service.booking ? service.booking.durationMinutes : 60;
        const defaultPrice = service.pricing && service.pricing.areas && service.pricing.areas.length > 0 
          ? service.pricing.areas[0].price 
          : 200; // fallback price
        const depositPercentage = service.booking && service.booking.deposit 
          ? service.booking.deposit.value 
          : 20;

        // Create booking
        const newBooking = {
          id: uuidv4(),
          clientName,
          clientEmail,
          clientPhone,
          service: service.name,
          serviceId: serviceIdBooking,
          date: bookingDate,
          time: bookingTime,
          duration: defaultDuration,
          price: defaultPrice,
          depositAmount: Math.round(defaultPrice * (depositPercentage / 100)),
          depositPaid: false,
          status: 'pending',
          notes: 'Created via n8n webhook',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        mockDatabase.bookings.push(newBooking);
        updateStats();
        
        response.data = {
          booking: {
            ...newBooking,
            bookingCode: newBooking.id.substring(0, 8).toUpperCase()
          },
          bookingCode: newBooking.id.substring(0, 8).toUpperCase(),
          message: `Perfect! Your ${service.name} is booked for ${bookingDate} at ${bookingTime}. Your booking code is ${newBooking.id.substring(0, 8).toUpperCase()}. Please save this code for future reference.`,
          depositRequired: !newBooking.depositPaid,
          depositAmount: newBooking.depositAmount,
          totalPrice: newBooking.price
        };
        break;
      }
        
      case 'getServices': {
        response.data = {
          services: mockDatabase.services.filter(s => s.status && s.status.available),
          message: `We have ${mockDatabase.services.filter(s => s.status && s.status.available).length} services available`
        };
        break;
      }
        
      case 'getStats': {
        updateStats();
        response.data = {
          stats: mockDatabase.stats,
          message: 'Here are your current statistics'
        };
        break;
      }
        
      case 'getMyBookings': {
        const { phoneNumber } = data;
        if (!phoneNumber) {
          response.success = false;
          response.error = 'Phone number is required';
          break;
        }
        
        const myBookings = mockDatabase.bookings.filter(b => 
          b.clientPhone === phoneNumber && 
          b.status !== 'cancelled'
        ).sort((a, b) => moment(a.date + ' ' + a.time).diff(moment(b.date + ' ' + b.time)));
        
        if (myBookings.length === 0) {
          response.data = {
            bookings: [],
            message: `No bookings found for phone number ${phoneNumber}`,
            count: 0
          };
        } else {
          response.data = {
            bookings: myBookings.map(b => ({
              bookingCode: b.id.substring(0, 8).toUpperCase(),
              id: b.id,
              service: b.service,
              date: b.date,
              time: b.time,
              price: b.price,
              status: b.status,
              depositPaid: b.depositPaid,
              clientName: b.clientName
            })),
            message: `Found ${myBookings.length} booking(s) for ${myBookings[0].clientName}`,
            count: myBookings.length
          };
        }
        break;
      }
        
      case 'rescheduleBooking': {
        const { phoneNumber: phoneReschedule, bookingCode, newDate, newTime } = data;
        
        if (!phoneReschedule || !bookingCode) {
          response.success = false;
          response.error = 'Phone number and booking code are required';
          break;
        }
        
        // Find the booking
        const bookingToReschedule = mockDatabase.bookings.find(b => 
          b.clientPhone === phoneReschedule && 
          b.id.substring(0, 8).toUpperCase() === bookingCode.toUpperCase() &&
          b.status !== 'cancelled'
        );
        
        if (!bookingToReschedule) {
          response.success = false;
          response.error = 'Booking not found or already cancelled';
          break;
        }
        
        // Check new slot availability
        const newSlotTaken = mockDatabase.bookings.some(b => 
          b.date === newDate && 
          b.time === newTime && 
          b.status !== 'cancelled' &&
          b.id !== bookingToReschedule.id
        );
        
        if (newSlotTaken) {
          response.success = false;
          response.error = `The slot ${newDate} at ${newTime} is not available`;
          break;
        }
        
        // Update the booking
        const oldDate = bookingToReschedule.date;
        const oldTime = bookingToReschedule.time;
        bookingToReschedule.date = newDate;
        bookingToReschedule.time = newTime;
        bookingToReschedule.updatedAt = new Date().toISOString();
        bookingToReschedule.notes = `Rescheduled from ${oldDate} at ${oldTime}. ${bookingToReschedule.notes || ''}`;
        
        updateStats();
        
        response.data = {
          booking: {
            bookingCode: bookingToReschedule.id.substring(0, 8).toUpperCase(),
            service: bookingToReschedule.service,
            oldDate,
            oldTime,
            newDate,
            newTime,
            clientName: bookingToReschedule.clientName
          },
          message: `Successfully rescheduled your ${bookingToReschedule.service} from ${oldDate} at ${oldTime} to ${newDate} at ${newTime}`,
          success: true
        };
        break;
      }
        
      case 'cancelMyBooking': {
        const { phoneNumber: phoneCancel, bookingCode: codeCancel, reason } = data;
        
        if (!phoneCancel || !codeCancel) {
          response.success = false;
          response.error = 'Phone number and booking code are required';
          break;
        }
        
        // Find the booking
        const bookingToCancel = mockDatabase.bookings.find(b => 
          b.clientPhone === phoneCancel && 
          b.id.substring(0, 8).toUpperCase() === codeCancel.toUpperCase() &&
          b.status !== 'cancelled'
        );
        
        if (!bookingToCancel) {
          response.success = false;
          response.error = 'Booking not found or already cancelled';
          break;
        }
        
        // Cancel the booking
        bookingToCancel.status = 'cancelled';
        bookingToCancel.cancelledAt = new Date().toISOString();
        bookingToCancel.updatedAt = new Date().toISOString();
        bookingToCancel.cancellationReason = reason || 'Cancelled by client via chat';
        
        updateStats();
        
        response.data = {
          booking: {
            bookingCode: bookingToCancel.id.substring(0, 8).toUpperCase(),
            service: bookingToCancel.service,
            date: bookingToCancel.date,
            time: bookingToCancel.time,
            clientName: bookingToCancel.clientName
          },
          message: `Your ${bookingToCancel.service} appointment on ${bookingToCancel.date} at ${bookingToCancel.time} has been cancelled`,
          refundInfo: bookingToCancel.depositPaid ? 'Your deposit will be refunded within 3-5 business days' : 'No deposit was paid',
          success: true
        };
        break;
      }
        
      case 'confirmDeposit': {
        const { phoneNumber: phoneDeposit, bookingCode: codeDeposit } = data;
        
        if (!phoneDeposit || !codeDeposit) {
          response.success = false;
          response.error = 'Phone number and booking code are required';
          break;
        }
        
        // Find the booking
        const bookingToConfirm = mockDatabase.bookings.find(b => 
          b.clientPhone === phoneDeposit && 
          b.id.substring(0, 8).toUpperCase() === codeDeposit.toUpperCase() &&
          b.status !== 'cancelled'
        );
        
        if (!bookingToConfirm) {
          response.success = false;
          response.error = 'Booking not found or cancelled';
          break;
        }
        
        // Mark deposit as paid and confirm booking
        bookingToConfirm.depositPaid = true;
        bookingToConfirm.depositPaidAt = new Date().toISOString();
        bookingToConfirm.status = 'confirmed';
        bookingToConfirm.updatedAt = new Date().toISOString();
        
        updateStats();
        
        response.data = {
          booking: {
            bookingCode: bookingToConfirm.id.substring(0, 8).toUpperCase(),
            service: bookingToConfirm.service,
            date: bookingToConfirm.date,
            time: bookingToConfirm.time,
            depositAmount: bookingToConfirm.depositAmount,
            totalPrice: bookingToConfirm.price,
            clientName: bookingToConfirm.clientName
          },
          message: `Perfect! Your deposit of ${bookingToConfirm.depositAmount} has been confirmed. Your ${bookingToConfirm.service} is booked for ${bookingToConfirm.date} at ${bookingToConfirm.time}`,
          success: true
        };
        break;
      }
        
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
      },
      {
        action: 'getMyBookings',
        description: 'Get all bookings for a phone number',
        requiredFields: ['phoneNumber'],
        example: {
          action: 'getMyBookings',
          data: {
            phoneNumber: '+1-555-0101'
          }
        }
      },
      {
        action: 'rescheduleBooking',
        description: 'Reschedule an existing booking',
        requiredFields: ['phoneNumber', 'bookingCode', 'newDate', 'newTime'],
        example: {
          action: 'rescheduleBooking',
          data: {
            phoneNumber: '+1-555-0101',
            bookingCode: 'ABC12345',
            newDate: '2024-12-28',
            newTime: '15:00'
          }
        }
      },
      {
        action: 'cancelMyBooking',
        description: 'Cancel a booking using phone and booking code',
        requiredFields: ['phoneNumber', 'bookingCode'],
        example: {
          action: 'cancelMyBooking',
          data: {
            phoneNumber: '+1-555-0101',
            bookingCode: 'ABC12345',
            reason: 'Need to reschedule'
          }
        }
      },
      {
        action: 'confirmDeposit',
        description: 'Confirm deposit payment for a booking',
        requiredFields: ['phoneNumber', 'bookingCode'],
        example: {
          action: 'confirmDeposit',
          data: {
            phoneNumber: '+1-555-0101',
            bookingCode: 'ABC12345'
          }
        }
      }
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
