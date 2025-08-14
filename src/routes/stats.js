const express = require('express');
const router = express.Router();
const { mockDatabase, updateStats } = require('../data/mockDatabase');
const moment = require('moment');

// GET /api/v1/stats - Get general statistics
router.get('/', (req, res) => {
  try {
    updateStats();
    
    // Calculate additional stats
    const today = moment().format('YYYY-MM-DD');
    const todayBookings = mockDatabase.bookings.filter(b => b.date === today);
    const upcomingBookings = mockDatabase.bookings.filter(b => 
      moment(b.date).isAfter(moment()) && b.status === 'confirmed'
    );
    
    const stats = {
      ...mockDatabase.stats,
      todayBookings: todayBookings.length,
      todayRevenue: todayBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0),
      upcomingBookings: upcomingBookings.length,
      upcomingRevenue: upcomingBookings.reduce((sum, b) => sum + b.price, 0),
      averageBookingValue: mockDatabase.stats.totalRevenue / (mockDatabase.stats.confirmedBookings || 1),
      conversionRate: ((mockDatabase.stats.confirmedBookings / (mockDatabase.stats.totalBookings || 1)) * 100).toFixed(2) + '%',
      cancellationRate: ((mockDatabase.stats.cancelledBookings / (mockDatabase.stats.totalBookings || 1)) * 100).toFixed(2) + '%'
    };
    
    res.json({
      success: true,
      data: stats,
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

// GET /api/v1/stats/revenue - Get revenue statistics
router.get('/revenue', (req, res) => {
  try {
    const { from, to, groupBy = 'day' } = req.query;
    
    let bookings = mockDatabase.bookings.filter(b => b.status === 'confirmed');
    
    if (from) {
      bookings = bookings.filter(b => moment(b.date).isSameOrAfter(moment(from)));
    }
    
    if (to) {
      bookings = bookings.filter(b => moment(b.date).isSameOrBefore(moment(to)));
    }
    
    // Group revenue by period
    const revenueData = {};
    bookings.forEach(booking => {
      let key;
      switch (groupBy) {
        case 'month':
          key = moment(booking.date).format('YYYY-MM');
          break;
        case 'week':
          key = moment(booking.date).format('YYYY-[W]WW');
          break;
        default: // day
          key = booking.date;
      }
      
      if (!revenueData[key]) {
        revenueData[key] = {
          period: key,
          revenue: 0,
          bookings: 0,
          deposits: 0
        };
      }
      
      revenueData[key].revenue += booking.price;
      revenueData[key].bookings += 1;
      if (booking.depositPaid) {
        revenueData[key].deposits += booking.depositAmount;
      }
    });
    
    const sortedData = Object.values(revenueData).sort((a, b) => 
      moment(a.period).diff(moment(b.period))
    );
    
    res.json({
      success: true,
      groupBy,
      totalRevenue: sortedData.reduce((sum, d) => sum + d.revenue, 0),
      totalBookings: sortedData.reduce((sum, d) => sum + d.bookings, 0),
      totalDeposits: sortedData.reduce((sum, d) => sum + d.deposits, 0),
      data: sortedData,
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

// GET /api/v1/stats/services - Get service statistics
router.get('/services', (req, res) => {
  try {
    const serviceStats = {};
    
    mockDatabase.bookings.forEach(booking => {
      if (!serviceStats[booking.service]) {
        serviceStats[booking.service] = {
          service: booking.service,
          serviceId: booking.serviceId,
          totalBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
          pendingBookings: 0,
          totalRevenue: 0,
          averagePrice: booking.price
        };
      }
      
      serviceStats[booking.service].totalBookings++;
      
      switch (booking.status) {
        case 'confirmed':
          serviceStats[booking.service].confirmedBookings++;
          serviceStats[booking.service].totalRevenue += booking.price;
          break;
        case 'cancelled':
          serviceStats[booking.service].cancelledBookings++;
          break;
        case 'pending':
          serviceStats[booking.service].pendingBookings++;
          break;
      }
    });
    
    const sortedStats = Object.values(serviceStats).sort((a, b) => 
      b.totalBookings - a.totalBookings
    );
    
    res.json({
      success: true,
      count: sortedStats.length,
      data: sortedStats,
      mostPopular: sortedStats[0] || null,
      highestRevenue: sortedStats.sort((a, b) => b.totalRevenue - a.totalRevenue)[0] || null,
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

// GET /api/v1/stats/clients - Get client statistics
router.get('/clients', (req, res) => {
  try {
    const clientStats = {};
    
    mockDatabase.bookings.forEach(booking => {
      const clientKey = booking.clientEmail;
      
      if (!clientStats[clientKey]) {
        clientStats[clientKey] = {
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          totalBookings: 0,
          confirmedBookings: 0,
          totalSpent: 0,
          lastBooking: booking.date,
          services: new Set()
        };
      }
      
      clientStats[clientKey].totalBookings++;
      if (booking.status === 'confirmed') {
        clientStats[clientKey].confirmedBookings++;
        clientStats[clientKey].totalSpent += booking.price;
      }
      clientStats[clientKey].services.add(booking.service);
      
      if (moment(booking.date).isAfter(moment(clientStats[clientKey].lastBooking))) {
        clientStats[clientKey].lastBooking = booking.date;
      }
    });
    
    // Convert sets to arrays and sort
    const clientList = Object.values(clientStats).map(client => ({
      ...client,
      services: Array.from(client.services)
    })).sort((a, b) => b.totalSpent - a.totalSpent);
    
    res.json({
      success: true,
      totalClients: clientList.length,
      data: clientList,
      topClients: clientList.slice(0, 10),
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

// GET /api/v1/stats/dashboard - Get dashboard summary
router.get('/dashboard', (req, res) => {
  try {
    updateStats();
    
    const today = moment().format('YYYY-MM-DD');
    const thisWeek = {
      start: moment().startOf('week').format('YYYY-MM-DD'),
      end: moment().endOf('week').format('YYYY-MM-DD')
    };
    const thisMonth = {
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().endOf('month').format('YYYY-MM-DD')
    };
    
    // Today's stats
    const todayBookings = mockDatabase.bookings.filter(b => b.date === today);
    const todayStats = {
      bookings: todayBookings.length,
      confirmed: todayBookings.filter(b => b.status === 'confirmed').length,
      revenue: todayBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0)
    };
    
    // This week's stats
    const weekBookings = mockDatabase.bookings.filter(b => 
      moment(b.date).isBetween(thisWeek.start, thisWeek.end, null, '[]')
    );
    const weekStats = {
      bookings: weekBookings.length,
      confirmed: weekBookings.filter(b => b.status === 'confirmed').length,
      revenue: weekBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0)
    };
    
    // This month's stats
    const monthBookings = mockDatabase.bookings.filter(b => 
      moment(b.date).isBetween(thisMonth.start, thisMonth.end, null, '[]')
    );
    const monthStats = {
      bookings: monthBookings.length,
      confirmed: monthBookings.filter(b => b.status === 'confirmed').length,
      revenue: monthBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0)
    };
    
    // Upcoming bookings (next 7 days)
    const upcomingBookings = mockDatabase.bookings.filter(b => 
      moment(b.date).isBetween(moment(), moment().add(7, 'days')) && 
      b.status === 'confirmed'
    ).map(b => ({
      id: b.id,
      clientName: b.clientName,
      service: b.service,
      date: b.date,
      time: b.time,
      price: b.price
    }));
    
    res.json({
      success: true,
      data: {
        overview: mockDatabase.stats,
        today: todayStats,
        thisWeek: weekStats,
        thisMonth: monthStats,
        upcomingBookings: upcomingBookings.slice(0, 10),
        recentActivity: mockDatabase.bookings
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map(b => ({
            id: b.id,
            action: b.status,
            clientName: b.clientName,
            service: b.service,
            date: b.date,
            updatedAt: b.updatedAt
          }))
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

module.exports = router;
