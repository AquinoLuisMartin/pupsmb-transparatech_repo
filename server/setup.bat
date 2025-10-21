@echo off
echo 🚀 Setting up TransparaTech Backend Development Environment
echo ===========================================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

:: Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL is not installed. Please install PostgreSQL first.
    echo    You can download it from: https://www.postgresql.org/download/
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

:: Install dependencies
echo.
echo 📦 Installing dependencies...
npm install

:: Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update the .env file with your actual database credentials!
    echo    Edit: DB_NAME, DB_USER, DB_PASSWORD
) else (
    echo ✅ .env file already exists
)

:: Create logs directory
if not exist logs (
    echo.
    echo 📁 Creating logs directory...
    mkdir logs
    echo ✅ Logs directory created
)

:: Create uploads directory
if not exist uploads (
    echo.
    echo 📁 Creating uploads directory...
    mkdir uploads
    echo ✅ Uploads directory created
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update your .env file with actual database credentials
echo 2. Create your PostgreSQL database:
echo    CREATE DATABASE transparatech_db;
echo 3. Run the database schema:
echo    psql -d transparatech_db -f src/database/schema.sql
echo 4. Start the development server:
echo    npm run dev
echo.
echo 📚 API Documentation will be available at: http://localhost:5000/api/v1/docs
echo ❤️  Health Check: http://localhost:5000/api/v1/health
echo.
pause