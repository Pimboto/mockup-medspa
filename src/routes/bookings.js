const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

// GET /api/v1/bookings - Get all bookings
router.get('/', bookingsController.getAllBookings);

// GET /api/v1/bookings/:id - Get single booking
router.get('/:id', bookingsController.getBookingById);

// POST /api/v1/bookings - Create new booking
router.post('/', bookingsController.createBooking);

// PUT /api/v1/bookings/:id - Update booking
router.put('/:id', bookingsController.updateBooking);

// PATCH /api/v1/bookings/:id - Partial update booking
router.patch('/:id', bookingsController.updateBooking);

// POST /api/v1/bookings/:id/confirm - Confirm booking
router.post('/:id/confirm', bookingsController.confirmBooking);

// POST /api/v1/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', bookingsController.cancelBooking);

// DELETE /api/v1/bookings/:id - Delete booking
router.delete('/:id', bookingsController.deleteBooking);

// POST /api/v1/bookings/:id/deposit - Process deposit
router.post('/:id/deposit', bookingsController.processDeposit);

module.exports = router;
