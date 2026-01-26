# 🚀 Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

**Option A: Using PostgreSQL (Recommended)**

```bash
# Install PostgreSQL if not installed
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb goeat

# Or using psql:
psql -U postgres
CREATE DATABASE goeat;
\q
```

**Option B: Using SQLite (For Development Only)**

If you don't have PostgreSQL, you can modify `backend/src/config/database.js` to use SQLite:

```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goeat
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 4. Run Database Migration

```bash
npm run migrate
```

This will create all necessary tables.

### 5. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## Testing the API

### Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+254712345678"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Connecting Frontend

### Update Frontend Environment

Make sure your frontend `.env` file has:

```env
API_BASE_URL=http://localhost:5000/api
```

**Note**: For Expo Go on physical device, use your computer's IP address:
```env
API_BASE_URL=http://192.168.1.X:5000/api
```

### Test Connection

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Try logging in with registered user

## Troubleshooting

### Database Connection Error

- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check database exists: `psql -l | grep goeat`

### Port Already in Use

Change port in `.env`:
```env
PORT=5001
```

### CORS Errors

Update CORS_ORIGIN in `.env` to match your frontend URL:
```env
CORS_ORIGIN=http://localhost:19006
```

For physical device, use your computer's IP:
```env
CORS_ORIGIN=http://192.168.1.X:19006
```

## Next Steps

1. ✅ Backend server running
2. ✅ Authentication working
3. ⏭️ Create Restaurant API
4. ⏭️ Connect frontend to restaurants
5. ⏭️ Add image upload

See [PRIORITY_ROADMAP.md](../PRIORITY_ROADMAP.md) for next tasks.








