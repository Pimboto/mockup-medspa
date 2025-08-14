// API Key validation middleware
const apiKeyValidation = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const validApiKey = process.env.API_KEY || 'medspa-demo-api-key-2024';

  // Skip validation for documentation and health endpoints
  if (req.path === '/docs' || req.path === '/health') {
    return next();
  }

  // For demo purposes, we'll allow requests without API key but log a warning
  if (!apiKey) {
    console.warn('⚠️  Request without API key:', req.method, req.path);
    // In production, you would return an error here
    // return res.status(401).json({ error: 'API key is required' });
  }

  if (apiKey && apiKey !== validApiKey) {
    return res.status(401).json({
      error: {
        message: 'Invalid API key',
        status: 401,
        timestamp: new Date().toISOString()
      }
    });
  }

  next();
};

module.exports = apiKeyValidation;
