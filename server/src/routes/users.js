import express from 'express';
import { query } from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { userSchemas, validate } from '../validation/schemas.js';

const router = express.Router();

// Get all users (with pagination)
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countResult = await query('SELECT COUNT(*) FROM users');
  const total = parseInt(countResult.rows[0].count);

  const result = await query(`
    SELECT 
      id, 
      first_name, 
      last_name, 
      email, 
      role, 
      is_active,
      created_at,
      updated_at
    FROM users 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  res.json({
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(`
    SELECT 
      id, 
      first_name, 
      last_name, 
      email, 
      role, 
      phone,
      bio,
      is_active,
      created_at,
      updated_at
    FROM users 
    WHERE id = $1
  `, [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${id} does not exist`
    });
  }

  res.json({ data: result.rows[0] });
}));

// Create new user
router.post('/', validate(userSchemas.register), asyncHandler(async (req, res) => {
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
  `, [firstName, lastName, email, password, phone, role]);

  res.status(201).json({
    message: 'User created successfully',
    data: result.rows[0]
  });
}));

// Update user
router.put('/:id', validate(userSchemas.updateProfile), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Build dynamic update query
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  if (fields.length === 0) {
    return res.status(400).json({
      error: 'No fields to update',
      message: 'Please provide at least one field to update'
    });
  }

  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(`
    UPDATE users 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, first_name, last_name, email, role, updated_at
  `, [id, ...values]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'User not found',
      message: `User with ID ${id} does not exist`
    });
  }

  res.json({
    message: 'User updated successfully',
    data: result.rows[0]
  });
}));

// Delete user (soft delete)
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(`
    UPDATE users 
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND is_active = true
    RETURNING id, first_name, last_name, email
  `, [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'User not found',
      message: `Active user with ID ${id} does not exist`
    });
  }

  res.json({
    message: 'User deleted successfully',
    data: result.rows[0]
  });
}));

export default router;