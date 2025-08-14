const express = require('express');
const router = express.Router();
const { mockDatabase } = require('../data/mockDatabase');
const { v4: uuidv4 } = require('uuid');

// GET /api/v1/services - Get all services
router.get('/', (req, res) => {
  try {
    const { category, available } = req.query;
    let services = [...mockDatabase.services];
    
    if (category) {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    
    if (available !== undefined) {
      services = services.filter(s => s.available === (available === 'true'));
    }
    
    res.json({
      success: true,
      count: services.length,
      data: services,
      categories: [...new Set(mockDatabase.services.map(s => s.category))],
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

// GET /api/v1/services/:id - Get single service
router.get('/:id', (req, res) => {
  try {
    const service = mockDatabase.services.find(s => s.id === req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: service,
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

// POST /api/v1/services - Create new service
router.post('/', (req, res) => {
  try {
    const {
      name,
      category,
      description,
      duration,
      price,
      depositRequired = true,
      depositPercentage = 20,
      available = true
    } = req.body;
    
    if (!name || !category || !duration || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'category', 'duration', 'price'],
        timestamp: new Date().toISOString()
      });
    }
    
    const newService = {
      id: 'srv_' + uuidv4().substring(0, 8),
      name,
      category,
      description: description || '',
      duration,
      price,
      depositRequired,
      depositPercentage,
      available
    };
    
    mockDatabase.services.push(newService);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
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

// PUT /api/v1/services/:id - Update service
router.put('/:id', (req, res) => {
  try {
    const serviceIndex = mockDatabase.services.findIndex(s => s.id === req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
        timestamp: new Date().toISOString()
      });
    }
    
    const updatedService = {
      ...mockDatabase.services[serviceIndex],
      ...req.body,
      id: mockDatabase.services[serviceIndex].id // Prevent ID change
    };
    
    mockDatabase.services[serviceIndex] = updatedService;
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
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

// DELETE /api/v1/services/:id - Delete service
router.delete('/:id', (req, res) => {
  try {
    const serviceIndex = mockDatabase.services.findIndex(s => s.id === req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if service has active bookings
    const hasActiveBookings = mockDatabase.bookings.some(b => 
      b.serviceId === req.params.id && 
      b.status !== 'cancelled'
    );
    
    if (hasActiveBookings) {
      return res.status(409).json({
        success: false,
        error: 'Cannot delete service with active bookings',
        timestamp: new Date().toISOString()
      });
    }
    
    const deletedService = mockDatabase.services.splice(serviceIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Service deleted successfully',
      data: deletedService,
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

// GET /api/v1/services/categories - Get all categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(mockDatabase.services.map(s => s.category))];
    
    res.json({
      success: true,
      count: categories.length,
      data: categories,
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
