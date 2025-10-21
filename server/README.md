# TransparaTech Backend Server

Official backend API for PUPSMB TransparaTech Management System - A comprehensive platform for managing student organizations, reports, and transparency initiatives.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Installation

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Run setup script**
   
   **Windows:**
   ```cmd
   setup.bat
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   ```bash
   # Edit .env file with your database credentials
   DB_NAME=transparatech_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Set up database**
   ```sql
   -- Connect to PostgreSQL and create database
   CREATE DATABASE transparatech_db;
   
   -- Run schema migration
   psql -d transparatech_db -f src/database/schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

Once the server is running, visit:
- **API Docs**: http://localhost:5000/api/v1/docs
- **Health Check**: http://localhost:5000/api/v1/health

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection and configuration
│   ├── middleware/
│   │   ├── errorHandler.js      # Global error handling
│   │   └── requestLogger.js     # Request logging and rate limiting
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── users.js            # User management routes
│   │   └── index.js            # Route aggregation
│   ├── validation/
│   │   └── schemas.js          # Joi validation schemas
│   ├── database/
│   │   └── schema.sql          # Database schema and sample data
│   └── server.js               # Main server file
├── .env.example                # Environment variables template
├── .env                        # Your environment variables (create from .env.example)
├── package.json                # Dependencies and scripts
├── setup.bat                   # Windows setup script
└── setup.sh                    # Unix setup script
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run db:schema` - Run database schema migration
- `npm test` - Run tests (when implemented)

## 🛠️ Core Features

### Authentication & Authorization
- User registration and login
- Role-based access control (Student, Admin, Officer, Auditor, Viewer)
- JWT token management (ready for implementation)
- Password validation and security

### Database Management
- PostgreSQL integration with connection pooling
- Structured schema for users, organizations, reports
- Audit logging for transparency
- Database migrations and seeding

### API Features
- RESTful API design
- Request validation with Joi
- Error handling and logging
- Rate limiting
- CORS configuration
- API documentation

### Security
- Input validation and sanitization
- SQL injection prevention
- Rate limiting protection
- Environment-based configuration
- Secure password handling (ready for bcrypt)

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (soft delete)

### System
- `GET /api/v1/health` - Health check
- `GET /api/v1/docs` - API documentation

## 🗄️ Database Schema

### Main Tables
- **users** - User accounts and profiles
- **organizations** - Student organizations
- **organization_members** - User-organization relationships
- **reports** - Transparency reports
- **audit_logs** - System audit trail
- **notifications** - User notifications
- **sessions** - User session management

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transparatech_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret
BCRYPT_ROUNDS=12
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Docker (Optional)
```dockerfile
# Create Dockerfile for containerization
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Add testing framework
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📝 Development Notes

### Adding New Routes
1. Create route file in `src/routes/`
2. Add validation schemas in `src/validation/schemas.js`
3. Register route in `src/routes/index.js`
4. Update API documentation

### Database Migrations
1. Create migration SQL files
2. Update `src/database/schema.sql`
3. Run migration: `npm run db:schema`

### Error Handling
- All async routes wrapped with `asyncHandler`
- Global error handler in `middleware/errorHandler.js`
- Database errors automatically handled
- Validation errors from Joi schemas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check API documentation at `/api/v1/docs`
- Review error logs in console
- Ensure database connection is working
- Verify environment variables are set correctly

---

**TransparaTech** - Making Technology Transparent & Accessible