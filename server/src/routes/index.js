import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';

const router = express.Router();

// API versioning
const API_VERSION = '/api/v1';

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);

// API documentation endpoint
router.get(`${API_VERSION}/docs`, (req, res) => {
  res.json({
    title: 'TransparaTech API Documentation',
    version: '1.0.0',
    description: 'Official API for PUPSMB TransparaTech Management System',
    endpoints: {
      authentication: {
        'POST /api/v1/auth/login': 'User login',
        'POST /api/v1/auth/register': 'User registration',
        'POST /api/v1/auth/logout': 'User logout',
        'POST /api/v1/auth/change-password': 'Change password',
        'GET /api/v1/auth/me': 'Get current user profile'
      },
      users: {
        'GET /api/v1/users': 'Get all users (paginated)',
        'GET /api/v1/users/:id': 'Get user by ID',
        'POST /api/v1/users': 'Create new user',
        'PUT /api/v1/users/:id': 'Update user',
        'DELETE /api/v1/users/:id': 'Delete user (soft delete)'
      }
    },
    examples: {
      register: {
        url: 'POST /api/v1/auth/register',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
          phone: '+1234567890',
          role: 'student'
        }
      },
      login: {
        url: 'POST /api/v1/auth/login',
        body: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!'
        }
      }
    }
  });
});

// Health check for API
router.get(`${API_VERSION}/health`, (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TransparaTech API',
    version: '1.0.0'
  });
});

export default router;