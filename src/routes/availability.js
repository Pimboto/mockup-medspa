const express = require('express');
const router = express.Router();
const moment = require('moment');
const { mockDatabase } = require('../data/mockDatabase');

// GET /api/v1/availability - Get available time slots
router.get('/', (req, res) => {
  try {
    const { date, serviceId, days = 7 } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const startDate = moment(date);
    const endDate = moment(date).add(days, 'days');
    const availableSlots = [];
    
    // Generate time slots for each day
    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      const dayOfWeek = m.format('dddd').toLowerCase();
      const businessHours = mockDatabase.availability.businessHours[dayOfWeek];
      
      if (!businessHours || !businessHours.isOpen) {
        continue; // Skip closed days
      }
      
      // Check if it's a holiday
      const dateStr = m.format('YYYY-MM-DD');
      const isHoliday = mockDatabase.availability.holidays.some(h => h.date === dateStr);
      if (isHoliday) {
        continue;
      }
      
      // Generate slots for this day
      const openTime = moment(dateStr + ' ' + businessHours.open, 'YYYY-MM-DD HH:mm');
      const closeTime = moment(dateStr + ' ' + businessHours.close, 'YYYY-MM-DD HH:mm');
      
      for (let slotTime = moment(openTime); slotTime.isBefore(closeTime); slotTime.add(30, 'minutes')) {
        // Check if slot is already booked
        const isBooked = mockDatabase.bookings.some(b => 
          b.date === dateStr && 
          b.time === slotTime.format('HH:mm') && 
          b.status !== 'cancelled'
        );
        
        if (!isBooked) {
          availableSlots.push({
            date: dateStr,
            time: slotTime.format('HH:mm'),
            datetime: slotTime.toISOString(),
            available: true
          });
        }
      }
    }
    
    res.json({
      success: true,
      count: availableSlots.length,
      data: availableSlots,
      businessHours: mockDatabase.availability.businessHours,
      holidays: mockDatabase.availability.holidays,
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

// GET /api/v1/availability/check - Check specific slot availability
router.get('/check', (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Date and time parameters are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if slot is booked
    const isBooked = mockDatabase.bookings.some(b => 
      b.date === date && 
      b.time === time && 
      b.status !== 'cancelled'
    );
    
    // Check business hours
    const dayOfWeek = moment(date).format('dddd').toLowerCase();
    const businessHours = mockDatabase.availability.businessHours[dayOfWeek];
    
    let isWithinBusinessHours = false;
    if (businessHours && businessHours.isOpen) {
      const requestedTime = moment(time, 'HH:mm');
      const openTime = moment(businessHours.open, 'HH:mm');
      const closeTime = moment(businessHours.close, 'HH:mm');
      isWithinBusinessHours = requestedTime.isSameOrAfter(openTime) && requestedTime.isBefore(closeTime);
    }
    
    res.json({
      success: true,
      data: {
        date,
        time,
        available: !isBooked && isWithinBusinessHours,
        isBooked,
        isWithinBusinessHours,
        dayOfWeek
      },
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

// GET /api/v1/availability/business-hours - Get business hours
router.get('/business-hours', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockDatabase.availability.businessHours,
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

// PUT /api/v1/availability/business-hours - Update business hours
router.put('/business-hours', (req, res) => {
  try {
    const { day, open, close, isOpen } = req.body;
    
    if (!day) {
      return res.status(400).json({
        success: false,
        error: 'Day parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const dayLower = day.toLowerCase();
    if (!mockDatabase.availability.businessHours[dayLower]) {
      return res.status(404).json({
        success: false,
        error: 'Invalid day',
        timestamp: new Date().toISOString()
      });
    }
    
    if (open !== undefined) mockDatabase.availability.businessHours[dayLower].open = open;
    if (close !== undefined) mockDatabase.availability.businessHours[dayLower].close = close;
    if (isOpen !== undefined) mockDatabase.availability.businessHours[dayLower].isOpen = isOpen;
    
    res.json({
      success: true,
      message: 'Business hours updated successfully',
      data: mockDatabase.availability.businessHours[dayLower],
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

module.exports = router;
