# Database Setup Guide

## Quick Start

### 1. Start PostgreSQL Service

**On Arch Linux:**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL to start on boot (optional)
sudo systemctl enable postgresql

# Check if it's running
sudo systemctl status postgresql
```

**Alternative (if using postgres user directly):**
```bash
# Start PostgreSQL manually
sudo -u postgres pg_ctl -D /var/lib/postgres/data start
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql, run these commands:
CREATE DATABASE goeat;
CREATE USER postgres WITH PASSWORD 'your_password_here';  # Optional, if you want a password
GRANT ALL PRIVILEGES ON DATABASE goeat TO postgres;
\q
```

**Or if you want to use your current user:**
```bash
# Create database as your user
createdb goeat

# Or with specific user
createdb -U postgres goeat
```

### 3. Create .env File

```bash
cd backend
cp .env.example .env
```

Then edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goeat
DB_USER=postgres
DB_PASSWORD=          # Leave empty if no password, or set your password
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Data (Optional)

```bash
# Seed test users
npm run seed:users

# Seed restaurants
npm run seed

# Seed menu items
npm run seed:menu
```

## Troubleshooting

### PostgreSQL Not Starting

**Check if PostgreSQL is installed:**
```bash
which psql
which postgres
```

**Check PostgreSQL status:**
```bash
sudo systemctl status postgresql
```

**View PostgreSQL logs:**
```bash
sudo journalctl -u postgresql -f
```

**Initialize database cluster (if needed):**
```bash
sudo -u postgres initdb -D /var/lib/postgres/data
```

### Connection Issues

**Test connection:**
```bash
psql -h localhost -U postgres -d goeat
```

**If connection fails, check:**
1. PostgreSQL is running: `sudo systemctl status postgresql`
2. Port 5432 is open: `sudo netstat -tlnp | grep 5432`
3. PostgreSQL config allows local connections (check `/etc/postgresql/*/main/pg_hba.conf` or `/var/lib/postgres/data/pg_hba.conf`)

**For Arch Linux, edit pg_hba.conf:**
```bash
sudo nano /var/lib/postgres/data/pg_hba.conf
```

Make sure you have a line like:
```
host    all             all             127.0.0.1/32            trust
# or
host    all             all             127.0.0.1/32            md5
```

Then restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Using Docker (Alternative)

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name goeat-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=goeat \
  -p 5432:5432 \
  -d postgres:15

# Then update .env:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=goeat
# DB_USER=postgres
# DB_PASSWORD=postgres
```

## Test User Credentials

After running `npm run seed:users`, you can login with:

- **Email:** `john@example.com` | **Password:** `password123`
- **Email:** `jane@example.com` | **Password:** `password123`
- **Email:** `owner@example.com` | **Password:** `password123`
- **Email:** `admin@example.com` | **Password:** `password123`








