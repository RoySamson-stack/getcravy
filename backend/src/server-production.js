const express = require('express');
const { Pool } = require('pg');
const { 
    rateLimits, 
    securityHeaders, 
    corsOptions, 
    verifyToken, 
    sanitizeInput,
    sanitizeUser,
    sanitizeRestaurant,
    securityLogger,
    validationSchemas 
} = require('./middleware/security');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(securityLogger);

// Database connection with SSL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes with rate limiting
app.use('/api/auth', rateLimits.auth);
app.post('/api/auth/register', validationSchemas.register, sanitizeInput, async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        
        // Check if user exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
        
        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password_hash, first_name, last_name]
        );

        const user = sanitizeUser(result.rows[0]);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Restaurant routes with data minimization
app.use('/api/restaurants', rateLimits.api);
app.get('/api/restaurants', validationSchemas.restaurantSearch, sanitizeInput, async (req, res) => {
    try {
        const { lat, lng, radius = 10, limit = 20, cuisine, vibe } = req.query;
        
        let query = `
            SELECT id, name, description, phone, whatsapp, 
                   ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat,
                   address, area, cuisine_types, price_range, rating, review_count,
                   image_urls, opening_hours, features, vibes
            FROM restaurants 
            WHERE is_active = true
        `;
        const params = [];
        let paramCount = 0;

        // Location-based filtering
        if (lat && lng) {
            paramCount++;
            query += ` AND ST_DWithin(location, ST_GeogFromText('POINT(${lng} ${lat})'), ${radius * 1000})`;
        }

        // Cuisine filtering
        if (cuisine) {
            paramCount++;
            params.push(cuisine);
            query += ` AND $${paramCount} = ANY(cuisine_types)`;
        }

        // Vibe filtering
        if (vibe) {
            paramCount++;
            params.push(vibe);
            query += ` AND $${paramCount} = ANY(vibes)`;
        }

        // Order by distance if location provided
        if (lat && lng) {
            query += ` ORDER BY location <-> ST_GeogFromText('POINT(${lng} ${lat})')`;
        } else {
            query += ` ORDER BY rating DESC, review_count DESC`;
        }

        paramCount++;
        params.push(parseInt(limit));
        query += ` LIMIT $${paramCount}`;

        const result = await pool.query(query, params);
        const restaurants = result.rows.map(sanitizeRestaurant);

        res.json({ restaurants, count: restaurants.length });
    } catch (error) {
        console.error('Restaurant search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Protected routes
app.get('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = sanitizeUser(result.rows[0]);
        res.json({ user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`GoEat API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
