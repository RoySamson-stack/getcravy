#!/bin/bash
echo "Starting PostgreSQL with Docker..."
docker run --name goeat-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=goeat \
  -p 5432:5432 \
  -d postgres:15

echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "PostgreSQL should be running now!"
echo "Database: goeat"
echo "User: postgres"
echo "Password: postgres"
