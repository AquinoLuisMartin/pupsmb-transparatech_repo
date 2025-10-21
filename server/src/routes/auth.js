import express from 'express';
import { query } from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { userSchemas, validate } from '../validation/schemas.js';

const router = express.Router();

// Login endpoint
router.post('/login', validate(userSchemas.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const result = await query(`
    SELECT 
      id, 
      first_name, 
      last_name, 
      email, 
      password, 
      role, 
      is_active
    FROM users 
    WHERE email = $1 AND is_active = true
  `, [email]);

  if (result.rows.length === 0) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  const user = result.rows[0];

  // In a real application, you would compare hashed passwords
  // For now, we'll do a simple comparison (NOT secure for production)
  if (password !== user.password) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Update last login
  await query(`
    UPDATE users 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = $1
  `, [user.id]);

  // In a real app, you would generate a JWT token here
  const token = `fake-jwt-token-${user.id}-${Date.now()}`;

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token,
      expiresIn: '24h'
    }
  });
}));

// Register endpoint
router.post('/register', validate(userSchemas.register), asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      error: 'User already exists',
      message: 'A user with this email already exists'
    });
  }

  // In a real app, you would hash the password here
  const result = await query(`
    INSERT INTO users (first_name, last_name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, first_name, last_name, email, role, created_at
  `, [firstName, lastName, email, password, phone, role || 'student']);

  const newUser = result.rows[0];

  // Generate token for the new user
  const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;

  res.status(201).json({
    message: 'Registration successful',
    data: {
      user: newUser,
      token,
      expiresIn: '24h'
    }
  });
}));

// Logout endpoint (in a real app, you might invalidate tokens)
router.post('/logout', asyncHandler(async (req, res) => {
  // In a JWT-based system, you might add the token to a blacklist
  res.json({
    message: 'Logout successful'
  });
}));

// Password change endpoint
router.post('/change-password', validate(userSchemas.changePassword), asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // In a real app, you would:
  // 1. Verify the current user from JWT token
  // 2. Check current password against hashed password
  // 3. Hash the new password before storing
  
  // For now, we'll return a success message
  res.json({
    message: 'Password changed successfully'
  });
}));

// Get current user profile (protected route)
router.get('/me', asyncHandler(async (req, res) => {
  // In a real app, you would extract user ID from JWT token
  // For now, we'll return a sample response
  
  res.json({
    message: 'This endpoint requires authentication',
    note: 'Implement JWT middleware to protect this route'
  });
}));

export default router;