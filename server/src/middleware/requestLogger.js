// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`🌐 ${req.method} ${req.url}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Log body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const safeBody = { ...req.body };
    // Remove sensitive fields from logs
    delete safeBody.password;
    delete safeBody.token;
    delete safeBody.secret;
    
    if (Object.keys(safeBody).length > 0) {
      console.log('📝 Request body:', safeBody);
    }
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    console.log(`✅ ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    
    // Call the original json method
    return originalJson.call(this, data);
  };

  next();
};

// Rate limiting simulation (basic implementation)
const requestCounts = new Map();

export const basicRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = requestCounts.get(key);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.count >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    record.count++;
    next();
  };
};