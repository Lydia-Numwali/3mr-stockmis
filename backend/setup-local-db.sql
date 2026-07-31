-- Create database
CREATE DATABASE stockmis;

-- Create user (skip if exists)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres'
   ) THEN
      CREATE USER postgres WITH PASSWORD 'Test@123';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE stockmis TO postgres;

-- Connect to stockmis database
\c stockmis

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;
