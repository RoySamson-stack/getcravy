const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ error: message });
    }
});

// Different rate limits for different endpoints
const rateLimits = {
    auth: createRateLimit(15 * 60 * 1000, 5, 'Too many auth attempts'), // 5 per 15min
    api: createRateLimit(60 * 60 * 1000, 1000, 'Rate limit exceeded'), // 1000 per hour
    search: createRateLimit(60 * 1000, 100, 'Too many search requests') // 100 per minute
};

// Security headers
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://goeat.com', 'https://www.goeat.com']
        : ['http://localhost:3000', 'http://localhost:19006'],
    credentials: true,
    optionsSuccessStatus: 200
};

// JWT verification middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Data minimization - remove sensitive fields
const sanitizeUser = (user) => {
    const { password_hash, ...sanitized } = user;
    return sanitized;
};

const sanitizeRestaurant = (restaurant) => {
    // Only return necessary fields for public API
    return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        phone: restaurant.phone,
        whatsapp: restaurant.whatsapp,
        location: restaurant.location,
        address: restaurant.address,
        area: restaurant.area,
        cuisine_types: restaurant.cuisine_types,
        price_range: restaurant.price_range,
        rating: restaurant.rating,
        review_count: restaurant.review_count,
        image_urls: restaurant.image_urls?.slice(0, 5), // Limit images
        opening_hours: restaurant.opening_hours,
        features: restaurant.features,
        vibes: restaurant.vibes
    };
};

// API key validation
const validateApiKey = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
    }

    try {
        // Check if API key exists and is active
        const keyHash = bcrypt.hashSync(apiKey, 10);
        // Query database for API key validation
        // This would be implemented with your database connection
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid API key' });
    }
};

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
    const logData = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
    };
    
    // Log suspicious activity
    if (req.url.includes('..') || req.url.includes('<script>')) {
        console.warn('Suspicious request:', logData);
    }
    
    next();
};

// Validation schemas
const validationSchemas = {
    register: [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        body('first_name').trim().isLength({ min: 1, max: 100 }),
        body('last_name').trim().isLength({ min: 1, max: 100 })
    ],
    login: [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty()
    ],
    restaurantSearch: [
        body('lat').optional().isFloat({ min: -90, max: 90 }),
        body('lng').optional().isFloat({ min: -180, max: 180 }),
        body('radius').optional().isInt({ min: 1, max: 50 }),
        body('limit').optional().isInt({ min: 1, max: 50 })
    ]
};

module.exports = {
    rateLimits,
    securityHeaders,
    corsOptions: cors(corsOptions),
    verifyToken,
    sanitizeInput,
    sanitizeUser,
    sanitizeRestaurant,
    validateApiKey,
    securityLogger,
    validationSchemas
};
