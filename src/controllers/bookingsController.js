const { v4: uuidv4 } = require('uuid');
const { mockDatabase, updateStats } = require('../data/mockDatabase');
const moment = require('moment');

// Get all bookings with optional filters
const getAllBookings = (req, res) => {
  try {
    let bookings = [...mockDatabase.bookings];
    
    // Apply filters
    const { status, date, clientEmail, clientPhone, from, to } = req.query;
    
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    if (date) {
      bookings = bookings.filter(b => b.date === date);
    }
    
    if (clientEmail) {
      bookings = bookings.filter(b => b.clientEmail.toLowerCase().includes(clientEmail.toLowerCase()));
    }
    
    if (clientPhone) {
      bookings = bookings.filter(b => b.clientPhone.includes(clientPhone));
    }
    
    if (from) {
      bookings = bookings.filter(b => moment(b.date).isSameOrAfter(moment(from)));
    }
    
    if (to) {
      bookings = bookings.filter(b => moment(b.date).isSameOrBefore(moment(to)));
    }
    
    // Sort by date and time
    bookings.sort((a, b) => {
      const dateCompare = moment(a.date).diff(moment(b.date));
      if (dateCompare !== 0) return dateCompare;
      return moment(a.time, 'HH:mm').diff(moment(b.time, 'HH:mm'));
    });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get single booking by ID
const getBookingById = (req, res) => {
  try {
    const booking = mockDatabase.bookings.find(b => b.id === req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: booking,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Create new booking
const createBooking = (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      date,
      time,
      notes
    } = req.body;
    
    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !serviceId || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['clientName', 'clientEmail', 'clientPhone', 'serviceId', 'date', 'time'],
        timestamp: new Date().toISOString()
      });
    }
    
    // Find service
    const service = mockDatabase.services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if time slot is available
    const existingBooking = mockDatabase.bookings.find(b => 
      b.date === date && 
      b.time === time && 
      b.status !== 'cancelled'
    );
    
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'Time slot already booked',
        timestamp: new Date().toISOString()
      });
    }
    
    // Create new booking
    const newBooking = {
      id: uuidv4(),
      clientName,
      clientEmail,
      clientPhone,
      service: service.name,
      serviceId: service.id,
      date,
      time,
      duration: service.duration,
      price: service.price,
      depositAmount: Math.round(service.price * (service.depositPercentage / 100)),
      depositPaid: false,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockDatabase.bookings.push(newBooking);
    updateStats();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Update booking
const updateBooking = (req, res) => {
  try {
    const bookingIndex = mockDatabase.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    const updatedBooking = {
      ...mockDatabase.bookings[bookingIndex],
      ...req.body,
      id: mockDatabase.bookings[bookingIndex].id, // Prevent ID change
      updatedAt: new Date().toISOString()
    };
    
    mockDatabase.bookings[bookingIndex] = updatedBooking;
    updateStats();
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Confirm booking
const confirmBooking = (req, res) => {
  try {
    const bookingIndex = mockDatabase.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    mockDatabase.bookings[bookingIndex].status = 'confirmed';
    mockDatabase.bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    // If deposit is being paid
    if (req.body.depositPaid) {
      mockDatabase.bookings[bookingIndex].depositPaid = true;
    }
    
    updateStats();
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: mockDatabase.bookings[bookingIndex],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Cancel booking
const cancelBooking = (req, res) => {
  try {
    const bookingIndex = mockDatabase.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    mockDatabase.bookings[bookingIndex].status = 'cancelled';
    mockDatabase.bookings[bookingIndex].cancelledAt = new Date().toISOString();
    mockDatabase.bookings[bookingIndex].updatedAt = new Date().toISOString();
    mockDatabase.bookings[bookingIndex].cancellationReason = req.body.reason || 'No reason provided';
    
    updateStats();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: mockDatabase.bookings[bookingIndex],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Delete booking (hard delete)
const deleteBooking = (req, res) => {
  try {
    const bookingIndex = mockDatabase.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    const deletedBooking = mockDatabase.bookings.splice(bookingIndex, 1)[0];
    updateStats();
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Process deposit payment
const processDeposit = (req, res) => {
  try {
    const bookingIndex = mockDatabase.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        timestamp: new Date().toISOString()
      });
    }
    
    mockDatabase.bookings[bookingIndex].depositPaid = true;
    mockDatabase.bookings[bookingIndex].depositPaidAt = new Date().toISOString();
    mockDatabase.bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    // Auto-confirm booking when deposit is paid
    if (mockDatabase.bookings[bookingIndex].status === 'pending') {
      mockDatabase.bookings[bookingIndex].status = 'confirmed';
    }
    
    updateStats();
    
    res.json({
      success: true,
      message: 'Deposit processed successfully',
      data: mockDatabase.bookings[bookingIndex],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  confirmBooking,
  cancelBooking,
  deleteBooking,
  processDeposit
};
