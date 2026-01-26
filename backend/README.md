# GoEat Backend API

Backend API server for GoEat food discovery platform.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb goeat
   
   # Or using psql:
   psql -U postgres
   CREATE DATABASE goeat;
   ```

4. **Run migrations and seed data**
   ```bash
   # Create database tables
   npm run migrate
   
   # Seed test users (optional but recommended for testing)
   npm run seed:users
   
   # Seed restaurants (optional)
   npm run seed
   
   # Seed menu items (optional)
   npm run seed:menu
   ```

5. **Start server**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)

### Example Requests

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+254712345678"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User:**
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

## Test User Credentials

After running `npm run seed:users`, you can use these test accounts:

| Email | Password | Role |
|-------|----------|------|
| `john@example.com` | `password123` | user |
| `jane@example.com` | `password123` | user |
| `owner@example.com` | `password123` | restaurant_owner |
| `admin@example.com` | `password123` | admin |

**Quick Login Example:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## Environment Variables

See `.env.example` for all required environment variables.

## Development

- Server runs on `http://localhost:5000`
- API base URL: `http://localhost:5000/api`
- Health check: `http://localhost:5000/health`

## Database

The app uses Sequelize ORM with PostgreSQL. Models are defined in `src/models/`.

## Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet for security headers
- CORS configured
- Input validation

## Testing

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/       # Database and app configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   └── server.js     # Entry point
├── tests/            # Test files
├── .env.example      # Environment variables template
└── package.json
```

